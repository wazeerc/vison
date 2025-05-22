import React, { useRef, useState } from 'react';

import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { parseJson } from '../utils/jsonUtils';
import { UploadIcon } from './HandDrawnIcons';

import { Textarea } from './ui/textarea';

interface JsonInputProps {
  onJsonChange: (json: string) => void;
  initialValue?: string;
}

const JsonInput: React.FC<JsonInputProps> = ({ onJsonChange, initialValue = '' }) => {
  const [jsonText, setJsonText] = useState(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    onJsonChange(value);
  };

  // Update state if initialValue changes (for Share page or initial load)
  React.useEffect(() => {
    if (initialValue !== jsonText) {
      setJsonText(initialValue);
      if (initialValue !== jsonText) {
        onJsonChange(initialValue);
      }
    }
  }, [initialValue, onJsonChange, jsonText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
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
        console.error('Error parsing JSON file:', error);
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
    reader.onload = event => {
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
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setJsonText('');
    onJsonChange('');
    toast.success('Input JSON cleared');
  };

  return (
    <div className="my-8 vison-card animate-fade-in hover:shadow-purple-lg transition-all duration-300">
      <h2 className="mb-4 text-xl font-semibold text-vison-dark-charcoal">Input JSON</h2>

      <div
        className={`p-4 mb-4 border-2 border-dashed rounded-xl transition-colors ${
          isDragging
            ? 'bg-vison-purple/20 border-vison-purple-dark'
            : 'border-gray-200 hover:border-vison-purple'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Textarea
          className="w-full min-h-[160px] max-h-[400px] p-3 text-sm font-mono bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vison-purple focus:bg-white transition-all duration-200"
          placeholder="Paste your JSON here..."
          value={jsonText}
          onChange={handleTextChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-vison-charcoal/70">
          {jsonText ? `${jsonText.length} characters` : 'No JSON input yet'}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="btn-with-icon flex items-center gap-2 px-4 py-2 text-vison-charcoal bg-vison-peach rounded-xl hover:bg-vison-peach-dark transition-colors hover:shadow-soft active:scale-[0.98]"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={triggerFileInput}
            className="btn-with-icon flex items-center gap-2 px-4 py-2 rounded-xl bg-vison-purple text-white font-medium transition-all hover:bg-vison-purple-dark hover:shadow-purple active:scale-[0.98]"
          >
            <UploadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonInput;
