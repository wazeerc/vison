
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import JsonInput from '../components/JsonInput';
import JsonTable from '../components/JsonTable';
import Footer from '../components/Footer';
import { DownloadIcon } from '../components/HandDrawnIcons';
import { parseJson, formatJson } from '../utils/jsonUtils';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const [jsonString, setJsonString] = useState<string>('');
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const [isArray, setIsArray] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Process JSON input
  const handleJsonChange = (json: string) => {
    setJsonString(json);
    
    if (!json.trim()) {
      setParsedData(null);
      setError(null);
      return;
    }
    
    const result = parseJson(json);
    setParsedData(result.data);
    setError(result.error);
    setIsArray(result.isArray);
    
    if (result.error) {
      toast.error(`JSON Parse Error: ${result.error}`);
    }
  };

  // Handle data changes from table edits
  const handleDataChange = (updatedData: Record<string, any> | any[]) => {
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
  }, []);

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto">
      <Header />
      
      <main className="max-w-4xl mx-auto">
        <JsonInput onJsonChange={handleJsonChange} />
        
        <JsonTable 
          jsonData={parsedData} 
          isArray={isArray}
          onDataChange={handleDataChange} 
        />
        
        {parsedData && (
          <div className="flex justify-end mt-6">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 vison-btn-secondary"
            >
              <DownloadIcon className="w-5 h-5" />
              Download JSON
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
