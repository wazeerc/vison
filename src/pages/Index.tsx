import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Footer from '../components/Footer';
import { CopyIcon, DownloadIcon, TableViewIcon, TreeViewIcon } from '../components/HandDrawnIcons';
import Header from '../components/Header';
import JsonInput from '../components/JsonInput';
import JsonTable from '../components/JsonTable';
import JsonTreeView from '../components/JsonTreeView';

import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';

import { decryptJson, encryptJson, exportKey, generateKey, importKey } from '@/utils/cryptoUtils';
import { formatJson, getJsonDepth, JsonValue, parseJson } from '../utils/jsonUtils';

// Define view types
type ViewMode = 'table' | 'tree';
const COMPLEXITY_DEPTH_THRESHOLD = 4; // Switch to tree view if depth is 4 or more

const Index: React.FC = () => {
  // Check for share id in URL
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const shareId = params.id;
  const [jsonString, setJsonString] = useState<string>('');
  // Use JsonValue for better typing, though top level could be object or array
  const [parsedData, setParsedData] = useState<JsonValue | null>(null);
  const [isArray, setIsArray] = useState<boolean>(false);
  const [_error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('table'); // State for current view
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [displayedView, setDisplayedView] = useState<ViewMode>('table'); // What's actually shown
  const displayedShareIdToastRef = useRef<string | null>(null);
  const autoSwitchedRef = useRef<boolean>(false);

  // Helper function to remove share key from URL after a delay when link is expired
  const removeExpiredKeyFromUrl = useCallback(
    (delay: number = 3000) => {
      setTimeout(() => {
        if (shareId) {
          navigate('/', { replace: true });
        }
      }, delay);
    },
    [navigate, shareId]
  );

  // Handle view transition with animation
  const handleViewChange = useCallback(
    (newView: ViewMode) => {
      if (currentView === newView || isTransitioning) return;

      setIsTransitioning(true);

      autoSwitchedRef.current = true;

      // First update the button state immediately for feedback
      setCurrentView(newView);

      // Small delay to allow CSS transitions to take effect
      setTimeout(() => {
        setDisplayedView(newView);
        setIsTransitioning(false);
      }, 300); // Match this with the CSS transition duration
    },
    [currentView, isTransitioning]
  );

  // Process JSON input
  const handleJsonChange = useCallback(
    (json: string) => {
      setJsonString(json);
      if (!json.trim()) {
        setParsedData(null);
        setError(null);
        setIsArray(false); // Reset isArray
        handleViewChange('table'); // Reset view
        autoSwitchedRef.current = false;
        return;
      }

      const result = parseJson(json);
      setParsedData(result.data);
      setError(result.error);
      setIsArray(result.isArray);
      if (result.error) {
        toast.error(`JSON Parse Error: ${result.error}`);
        handleViewChange('table'); // Reset view on error
        autoSwitchedRef.current = false;
      } else if (result.data) {
        // Check complexity and switch view if needed
        const depth = getJsonDepth(result.data);
        if (depth >= COMPLEXITY_DEPTH_THRESHOLD) {
          // Only auto-switch if not already switched for this session and user hasn't manually changed view
          if (currentView !== 'tree' && !autoSwitchedRef.current) {
            autoSwitchedRef.current = true;
            handleViewChange('tree');
            toast.info('Switched to Tree View due to JSON complexity.');
          }
        } else {
          // Default to table view if not complex, unless user manually switched to tree
          if (currentView !== 'tree' && !autoSwitchedRef.current) {
            handleViewChange('table');
          }
        }
      } else {
        handleViewChange('table'); // Reset if no data
        autoSwitchedRef.current = false;
      }
    },
    [handleViewChange, currentView]
  );

  // Handle data changes from table/tree edits
  const handleDataChange = (updatedData: JsonValue) => {
    // Use JsonValue
    setParsedData(updatedData);
    setJsonString(formatJson(updatedData));
  };

  // Share feature using Supabase
  const [, setShareLink] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!parsedData) {
      toast.error('No valid JSON to share');
      return;
    }
    setIsSharing(true);
    try {
      // 1. Generate a key
      const key = await generateKey();
      const exportedKey = await exportKey(key);
      // 2. Encrypt the JSON
      const { ciphertext, iv } = await encryptJson(parsedData, key);
      // 3. Store ciphertext and iv in Supabase
      const { data, error: supabaseError } = await supabase // Renamed error to avoid conflict
        .from('shared_json')
        .insert([{ json: { ciphertext, iv } }])
        .select('id')
        .single();
      if (supabaseError || !data?.id) {
        throw supabaseError || new Error('Failed to create shareable link');
      }
      // 4. Share link contains both id and key
      const url = `${window.location.origin}/share/${data.id}#${exportedKey}`;
      setShareLink(url);
      await navigator.clipboard.writeText(url);
      toast.info('Anyone with this link can access your JSON data, it will expire in 30 minutes.');
      toast.success('Shareable Vison link copied to your clipboard!');
    } catch (err) {
      toast.error('Failed to create share link');
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  // Export JSON to file
  const handleDownload = () => {
    if (!parsedData) {
      toast.error('No valid JSON to download');
      return;
    }

    const formatted = formatJson(parsedData);
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'vison-export.json';
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success('JSON file downloaded!');
  };
  // Copy JSON to clipboard
  const handleCopy = () => {
    if (!parsedData) {
      toast.error('No valid JSON to copy');
      return;
    }

    const formatted = formatJson(parsedData);
    navigator.clipboard
      .writeText(formatted)
      .then(() => {
        toast.success('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy JSON: ', err);
        toast.error('Failed to copy JSON to clipboard');
      });
  };

  // Effect: Handle fetching and initial processing of shared JSON
  useEffect(() => {
    if (shareId) {
      // If the user has reset (URL changed but shareId param still present), don't try to load shared data
      if (window.location.pathname === '/' && !window.location.hash) {
        // Do nothing, user has reset
        return;
      }
      const keyHash = window.location.hash.replace(/^#/, '');
      if (!keyHash) {
        toast.error('Missing decryption key in link.');
        removeExpiredKeyFromUrl();
        return;
      }

      const fetchData = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('shared_json')
            .select('json,created_at')
            .eq('id', shareId)
            .single();
          if (fetchError || !data) {
            toast.error('Invalid or expired share link.');
            if (displayedShareIdToastRef.current === shareId) {
              displayedShareIdToastRef.current = null;
            }
            removeExpiredKeyFromUrl();
            return;
          }

          const created = new Date(data.created_at);
          const now = new Date();
          const diff = (now.getTime() - created.getTime()) / 1000 / 60;
          if (diff > 30) {
            // 30 minutes expiry
            toast.error('This Vison link has expired.');
            if (displayedShareIdToastRef.current === shareId) {
              displayedShareIdToastRef.current = null;
            }
            removeExpiredKeyFromUrl();
            return;
          }

          const key = await importKey(keyHash);
          const decrypted = await decryptJson(data.json.ciphertext, data.json.iv, key);

          // Use handleJsonChange to set the initial shared JSON
          // This ensures consistent state updates and view logic handling
          handleJsonChange(formatJson(decrypted as JsonValue));

          if (displayedShareIdToastRef.current !== shareId) {
            toast.info('You are viewing a shared JSON file.');
            displayedShareIdToastRef.current = shareId;
          }
        } catch (e) {
          toast.error('Failed to decrypt or load shared JSON.');
          console.error('Decryption/fetch error:', e);
          if (displayedShareIdToastRef.current === shareId) {
            displayedShareIdToastRef.current = null;
          }
          removeExpiredKeyFromUrl();
        }
      };

      fetchData();
    } else {
      // No shareId, so clear the ref, so if user navigates back to a share link, toast shows.
      displayedShareIdToastRef.current = null;
      if (!jsonString) {
        handleJsonChange('');
      }
    }
  }, [shareId, handleJsonChange, jsonString, removeExpiredKeyFromUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-vison-bg">
      <div className="container px-4 py-8 mx-auto">
        <Header />
        <main className="flex flex-col gap-6 max-w-4xl mx-auto">
          <JsonInput onJsonChange={handleJsonChange} initialValue={jsonString} />
          {/* View Switcher */}
          {parsedData && (
            <div className="flex justify-center gap-6 mb-6 animate-fade-in">
              {/* Table View Button */}
              <button
                onClick={() => handleViewChange('table')}
                disabled={isTransitioning}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-soft active:scale-[0.98] ${
                  currentView === 'table'
                    ? 'bg-vison-purple text-white shadow-purple'
                    : 'bg-white text-vison-charcoal hover:bg-gray-100'
                } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <TableViewIcon className="w-5 h-5" />
                Table View
              </button>
              {/* Tree View Button */}
              <button
                onClick={() => handleViewChange('tree')}
                disabled={isTransitioning}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-soft active:scale-[0.98] ${
                  currentView === 'tree'
                    ? 'bg-vison-purple text-white shadow-purple'
                    : 'bg-white text-vison-charcoal hover:bg-gray-100'
                } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <TreeViewIcon className="w-5 h-5" />
                Tree View
              </button>
            </div>
          )}{' '}
          {/* Conditional View Rendering with animations */}
          <div className="view-container relative min-h-[200px]">
            <div
              className={`transition-all duration-300 ease-in-out transform ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
            >
              {displayedView === 'table' && (
                <div key="table-view" className="animate-view-enter">
                  <JsonTable
                    jsonData={parsedData}
                    isArray={isArray}
                    onDataChange={handleDataChange}
                  />
                </div>
              )}
              {displayedView === 'tree' && (
                <div key="tree-view" className="animate-view-enter">
                  <JsonTreeView jsonData={parsedData} onDataChange={handleDataChange} />
                </div>
              )}
            </div>
          </div>
          {parsedData && (
            <div className="flex justify-between items-center">
              {/* Share Button */}
              <button
                disabled={isSharing}
                onClick={handleShare}
                aria-label="Share JSON"
                title="Share JSON"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-vison-peach text-vison-dark-charcoal font-semibold transition-all hover:bg-vison-peach-dark hover:shadow-soft active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] min-h-[40px]"
              >
                {isSharing ? (
                  <svg
                    className="animate-spin h-5 w-5 text-vison-dark-charcoal"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  'Share'
                )}
              </button>
              <div>
                {/* Copy Button */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    aria-label="Copy JSON to clipboard"
                    title="Copy JSON to clipboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-peach text-vison-dark-charcoal font-medium transition-all hover:bg-vison-peach-dark hover:shadow-soft active:scale-[0.98]"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    aria-label="Download JSON file"
                    title="Download JSON file"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-purple text-white font-medium transition-all hover:bg-vison-purple-dark hover:shadow-purple active:scale-[0.98]"
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
