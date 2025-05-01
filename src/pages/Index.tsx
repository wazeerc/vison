import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Footer from '../components/Footer';
import { CopyIcon, DownloadIcon, TableViewIcon, TreeViewIcon } from '../components/HandDrawnIcons'; // Added CopyIcon, TableViewIcon, TreeViewIcon
import Header from '../components/Header';
import JsonInput from '../components/JsonInput';
import JsonTable from '../components/JsonTable';
import JsonTreeView from '../components/JsonTreeView'; // Import the new Tree View component
import { formatJson, getJsonDepth, JsonValue, parseJson } from '../utils/jsonUtils'; // Import JsonValue type and getJsonDepth

// Define view types
type ViewMode = 'table' | 'tree';
const COMPLEXITY_DEPTH_THRESHOLD = 4; // Switch to tree view if depth is 4 or more

const Index: React.FC = () => {
  const [jsonString, setJsonString] = useState<string>('');
  // Use JsonValue for better typing, though top level could be object or array
  const [parsedData, setParsedData] = useState<JsonValue | null>(null);
  const [isArray, setIsArray] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('table'); // State for current view

  // Process JSON input
  const handleJsonChange = (json: string) => {
    setJsonString(json);

    if (!json.trim()) {
      setParsedData(null);
      setError(null);
      setIsArray(false); // Reset isArray
      setCurrentView('table'); // Reset view
      return;
    }

    const result = parseJson(json);
    setParsedData(result.data);
    setError(result.error);
    setIsArray(result.isArray);

    if (result.error) {
      toast.error(`JSON Parse Error: ${result.error}`);
      setCurrentView('table'); // Reset view on error
    } else if (result.data) {
      // Check complexity and switch view if needed
      const depth = getJsonDepth(result.data);
      if (depth >= COMPLEXITY_DEPTH_THRESHOLD) {
        // Only switch automatically if the current view isn't already tree (to respect manual selection)
        if (currentView !== 'tree') {
            setCurrentView('tree');
            toast.info('Switched to Tree View due to JSON complexity.');
        }
      } else {
         // Default to table view if not complex, unless user manually switched to tree
         if (currentView !== 'tree') {
            setCurrentView('table');
         }
      }
    } else {
        setCurrentView('table'); // Reset if no data
    }
  };

  // Handle data changes from table/tree edits
  const handleDataChange = (updatedData: JsonValue) => { // Use JsonValue
    setParsedData(updatedData);
    setJsonString(formatJson(updatedData));
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
    navigator.clipboard.writeText(formatted)
      .then(() => {
        toast.success('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy JSON: ', err);
        toast.error('Failed to copy JSON to clipboard');
      });
  };

  // Provide some sample data for first-time users
  useEffect(() => {
    const sampleJson = `{
  "name": "Vison Example",
  "version": "1.0.0",
  "active": true,
  "description": "A sample JSON for demonstrating Vison",
  "features": ["Easy editing", "Table view", "Real-time updates"],
  "stats": {
    "users": 1250,
    "rating": 4.8
  }
}`;

    // Only set sample data if no JSON has been entered yet
    if (!jsonString) {
      setJsonString(sampleJson);
      const result = parseJson(sampleJson);
      setParsedData(result.data);
      setIsArray(result.isArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty dependency array to run only once if jsonString is initially empty

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-vison-bg">
      <div className="container px-4 py-8 mx-auto">
        <Header />

        <main className="max-w-4xl mx-auto">
          <JsonInput onJsonChange={handleJsonChange} />

          {/* View Switcher */}
          {parsedData && (
            <div className="flex justify-center gap-2 mb-6 animate-fade-in">
              {/* Table View Button */}
              <button
                onClick={() => setCurrentView('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-soft active:scale-[0.98] ${
                  currentView === 'table'
                    ? 'bg-vison-purple text-white shadow-purple'
                    : 'bg-white text-vison-charcoal hover:bg-gray-100'
                }`}
              >
                <TableViewIcon className="w-5 h-5" />
                Table View
              </button>
              {/* Tree View Button */}
              <button
                onClick={() => setCurrentView('tree')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-soft active:scale-[0.98] ${
                  currentView === 'tree'
                    ? 'bg-vison-purple text-white shadow-purple'
                    : 'bg-white text-vison-charcoal hover:bg-gray-100'
                }`}
              >
                <TreeViewIcon className="w-5 h-5" />
                Tree View
              </button>
            </div>
          )}

          {/* Conditional View Rendering */}
          {currentView === 'table' && (
            <JsonTable
              // Cast needed here as JsonTable expects Record<string, any> or array
              jsonData={typeof parsedData === 'object' && parsedData !== null ? parsedData as (Record<string, unknown> | unknown[]) : null}
              isArray={isArray}
              onDataChange={handleDataChange}
            />
          )}
          {currentView === 'tree' && (
            <JsonTreeView
              jsonData={parsedData}
              onDataChange={handleDataChange} // Pass handleDataChange
            />
          )}

          {parsedData && (
            <div className="flex justify-end mt-6 gap-3 animate-fade-in">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-peach text-vison-dark-charcoal font-medium transition-all hover:bg-vison-peach-dark hover:shadow-soft active:scale-[0.98]"
              >
                <CopyIcon className="w-5 h-5" />
              </button>
              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-purple text-white font-medium transition-all hover:bg-vison-purple-dark hover:shadow-purple active:scale-[0.98]"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
