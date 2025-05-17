import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import JsonTable from '../components/JsonTable';
import JsonTreeView from '../components/JsonTreeView';
import { JsonValue } from '../utils/jsonUtils';
import { formatJson, getJsonDepth, parseJson } from '../utils/jsonUtils';
import { CopyIcon, TableViewIcon, TreeViewIcon } from '../components/HandDrawnIcons';

type ViewMode = 'table' | 'tree';
const COMPLEXITY_DEPTH_THRESHOLD = 4;

const SharedData: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [originalData, setOriginalData] = useState<JsonValue | null>(null);
  const [jsonData, setJsonData] = useState<JsonValue | null>(null);
  const [isArray, setIsArray] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedView, setDisplayedView] = useState<ViewMode>('table');

  useEffect(() => {
    const fetchSharedData = async () => {
      if (!shareId) {
        toast.error('Invalid share link');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('shared_data')
          .select('data, expires_at')
          .eq('id', shareId)
          .single();

        if (error) throw error;

        // Check expiration
        if (new Date(data.expires_at) < new Date()) {
          toast.error('This link has expired');
          return;
        }

        // Parse and initialize data
        const parsed = {
          data: data.data,
          isArray: Array.isArray(data.data),
          error: null
        };
        setOriginalData(parsed.data);
        setJsonData(parsed.data);
        setIsArray(parsed.isArray);

        // Set initial view based on complexity
        const depth = getJsonDepth(parsed.data);
        setCurrentView(depth >= COMPLEXITY_DEPTH_THRESHOLD ? 'tree' : 'table');
        setDisplayedView(depth >= COMPLEXITY_DEPTH_THRESHOLD ? 'tree' : 'table');

      } catch (err) {
        console.error('Failed to load shared data:', err);
        toast.error('Invalid or expired share link');
      }
    };

    fetchSharedData();
  }, [shareId]);

  const handleViewChange = (newView: ViewMode) => {
    if (currentView === newView || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentView(newView);

    setTimeout(() => {
      setDisplayedView(newView);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDataChange = (updatedData: JsonValue) => {
    setJsonData(updatedData);
  };

  const handleShareUpdated = async () => {
    if (!jsonData) {
      toast.error('No changes to share');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('shared_data')
        .insert([{
          data: jsonData,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        }])
        .select();

      if (error) throw error;

      const newShareId = data[0].id;
      const newShareLink = `${window.location.origin}/shared/${newShareId}`;
      
      await navigator.clipboard.writeText(newShareLink);
      toast.success(
        <div className="max-w-[300px]">
          <p>🔗 New share link copied!</p>
          <p className="text-xs opacity-75 mt-1">
            This updated version expires in 1 hour
          </p>
        </div>
      );

    } catch (err) {
      console.error('Sharing failed:', err);
      toast.error('Failed to share updated version');
    }
  };

  if (!jsonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-vison-bg">
        <div className="container px-4 py-8 mx-auto text-center">
          <p className="text-vison-charcoal">Loading shared data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-vison-bg">
      <div className="container px-4 py-8 mx-auto">
        <main className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-soft">
            <h1 className="text-2xl font-bold text-vison-charcoal mb-4">
              Shared JSON Data
            </h1>

            {/* View Switcher */}
            <div className="flex justify-center gap-6 mb-6">
              <button
                onClick={() => handleViewChange('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                  currentView === 'table'
                    ? 'bg-vison-purple text-white'
                    : 'bg-white text-vison-charcoal'
                }`}
              >
                <TableViewIcon className="w-5 h-5" />
                Table View
              </button>
              <button
                onClick={() => handleViewChange('tree')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                  currentView === 'tree'
                    ? 'bg-vison-purple text-white'
                    : 'bg-white text-vison-charcoal'
                }`}
              >
                <TreeViewIcon className="w-5 h-5" />
                Tree View
              </button>
            </div>

            {/* Data Display */}
            <div className="view-container relative min-h-[200px]">
              <div className={`transition-all duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                {displayedView === 'table' && (
                  <JsonTable
                    jsonData={jsonData}
                    isArray={isArray}
                    onDataChange={handleDataChange}
                  />
                )}
                {displayedView === 'tree' && (
                  <JsonTreeView
                    jsonData={jsonData}
                    onDataChange={handleDataChange}
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleShareUpdated}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-peach text-vison-dark-charcoal font-semibold hover:bg-vison-peach-dark transition-all"
              >
                <CopyIcon className="w-5 h-5" />
                Share Updated Version
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SharedData;