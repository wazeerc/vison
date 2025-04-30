
import React, { useState, useRef } from 'react';
import { UploadIcon } from './HandDrawnIcons';
import { toast } from 'sonner';
import { parseJson } from '../utils/jsonUtils';

interface JsonInputProps {
  onJsonChange: (json: string) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onJsonChange }) => {
  const [jsonText, setJsonText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    onJsonChange(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const result = parseJson(content);
        if (result.error) {
          toast.error(`Invalid JSON: ${result.error}`);
          return;
        }
        setJsonText(content);
        onJsonChange(content);
        toast.success('JSON file loaded successfully!');
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please drop a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const result = parseJson(content);
        if (result.error) {
          toast.error(`Invalid JSON: ${result.error}`);
          return;
        }
        setJsonText(content);
        onJsonChange(content);
        toast.success('JSON file loaded successfully!');
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-8 vison-card animate-fade-in">
      <h2 className="mb-4 text-xl font-semibold text-vison-dark-charcoal">Input JSON</h2>
      
      <div 
        className={`p-4 mb-4 border-2 border-dashed rounded-xl transition-colors ${
          isDragging ? 'bg-vison-blue/20 border-vison-blue-dark' : 'border-gray-200 hover:border-vison-blue'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          className="w-full h-40 p-3 text-sm font-mono bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vison-blue focus:bg-white"
          placeholder="Paste your JSON here..."
          value={jsonText}
          onChange={handleTextChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-vison-charcoal/70">
          {jsonText ? `${jsonText.length} characters` : 'No JSON input yet'}
        </div>
        
        <div>
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={triggerFileInput}
            className="flex items-center gap-2 vison-btn"
          >
            <UploadIcon className="w-5 h-5" />
            Upload JSON file
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonInput;
