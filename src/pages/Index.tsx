import { supabase } from '../lib/supabase';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Footer from '../components/Footer';
import { CopyIcon, DownloadIcon, TableViewIcon, TreeViewIcon } from '../components/HandDrawnIcons';
import Header from '../components/Header';
import JsonInput from '../components/JsonInput';
import JsonTable from '../components/JsonTable';
import JsonTreeView from '../components/JsonTreeView';
import { formatJson, getJsonDepth, JsonValue, parseJson } from '../utils/jsonUtils';

type ViewMode = 'table' | 'tree';
const COMPLEXITY_DEPTH_THRESHOLD = 4;

const Index: React.FC = () => {
  const [jsonString, setJsonString] = useState<string>('');
  const [parsedData, setParsedData] = useState<JsonValue | null>(null);
  const [isArray, setIsArray] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [displayedView, setDisplayedView] = useState<ViewMode>('table');

  // ... (keep all existing code the same until the handleShare function)

  // Share feature implementation
  const handleShare = async () => {
    if (!parsedData) {
      toast.error('No valid JSON to share');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('shared_data')
        .insert([{
          data: parsedData,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        }])
        .select();

      if (error) throw error;

      const shareId = data[0].id;
      const shareLink = `${window.location.origin}/shared/${shareId}`;

      await navigator.clipboard.writeText(shareLink);
      toast.success(
        <div className="max-w-[300px]">
          <p>🔗 Shareable link copied!</p>
          <p className="text-xs opacity-75 mt-1">
            Expires in 1 hour - anyone with this link can view/edit
          </p>
        </div>
      );

    } catch (err) {
      console.error('Sharing failed:', err);
      toast.error('Failed to generate share link');
    }
  };

  // ... (keep all other existing code the same until the return statement)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-vison-bg">
      <div className="container px-4 py-8 mx-auto">
        <Header />
        <main className="flex flex-col gap-6 max-w-4xl mx-auto">
          {/* ... (keep all existing JSX the same) */}
          
          {parsedData && (
            <div className="flex justify-between items-center">
              {/* Updated Share Button */}
              <button
                onClick={handleShare}
                aria-label="Share JSON"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-peach text-vison-dark-charcoal font-semibold transition-all hover:bg-vison-peach-dark hover:shadow-soft active:scale-[0.98]"
              >
                <CopyIcon className="w-5 h-5" />
                Share
              </button>
              <div>
                {/* Copy Button */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    aria-label="Copy JSON to clipboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-peach text-vison-dark-charcoal font-medium transition-all hover:bg-vison-peach-dark hover:shadow-soft active:scale-[0.98]"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    aria-label="Download JSON file"
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