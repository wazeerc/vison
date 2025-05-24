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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '';
    }
    // If on a shared link, also clear the URL (remove shareId from route)
    if (window.location.pathname.startsWith('/share/')) {
      window.history.replaceState({}, '', '/');
    }
  };

  return (
    <div className="my-8 vison-card animate-fade-in hover:shadow-purple-lg transition-all duration-300">
      <h2 className="mb-4 text-xl font-semibold text-vison-dark-charcoal/80">Input JSON</h2>

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
          ref={textareaRef}
          autoFocus
          className="w-full min-h-[180px] max-h-[400px] p-3 text-sm font-mono bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vison-purple focus:bg-white transition-all duration-200 scrollbar-thin scrollbar-thumb-vison-purple/50 scrollbar-track-gray-100"
          placeholder={[
            '{',
            '  "name": "Vison",',
            '  "features": [',
            '    "View",',
            '    "Edit",',
            '    "Share"',
            '  ]',
            '}',
            '',
          ].join('\n')}
          value={jsonText}
          onChange={handleTextChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-vison-charcoal/85 italic">
          {jsonText ? `${jsonText.length} characters` : ''}
        </div>

        <div className="flex gap-2">
          <button
            disabled={!jsonText}
            aria-disabled={!jsonText}
            onClick={handleReset}
            aria-label="Reset JSON input"
            className="btn-with-icon flex items-center gap-2 px-4 py-2 text-vison-charcoal bg-vison-peach rounded-xl hover:bg-vison-peach-dark transition-colors hover:shadow-soft active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
            aria-label="Upload JSON file"
            title="Upload JSON file"
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
