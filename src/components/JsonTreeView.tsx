import React, { useCallback, useMemo, useState } from 'react';

import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Pencil,
  X,
} from 'lucide-react';
import {
  convertValueType,
  isEditableValue,
  JsonArray,
  JsonObject,
  JsonValue,
  updateNestedJsonValue,
} from '../utils/jsonUtils';
import { TreeViewIcon } from './HandDrawnIcons';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Path = (string | number)[];

interface JsonTreeViewProps {
  jsonData: unknown;
  onDataChange: (updatedData: JsonValue) => void; // Add onDataChange prop
}

interface TreeNodeProps {
  nodeKey: string | number;
  nodeValue: unknown;
  level: number;
  path: Path; // Current path to this node
  isExpanded: (path: Path) => boolean;
  toggleExpand: (path: Path) => void;
  onEditSubmit: (path: Path, value: JsonValue) => void; // Renamed for clarity
  editingPath: Path | null;
  startEdit: (path: Path, currentValue: JsonValue) => void;
  cancelEdit: () => void;
  editValue: string; // Pass edit value down
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Pass handler down
  handleKeyDown: (e: React.KeyboardEvent) => void; // Pass handler down
}

// Helper to compare paths
const pathsEqual = (path1: Path | null, path2: Path | null): boolean => {
  if (!path1 || !path2 || path1.length !== path2.length) {
    return false;
  }
  return path1.every((segment, index) => segment === path2[index]);
};

// Helper function to get all expandable paths (moved outside for initial state calculation)
const getAllExpandablePaths = (value: JsonValue, currentPath: Path = ['root']): Path[] => {
  let paths: Path[] = [];
  if (typeof value === 'object' && value !== null) {
    paths.push(currentPath); // Add path for the object/array itself
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        paths = paths.concat(getAllExpandablePaths(item, [...currentPath, index]));
      });
    } else {
      Object.keys(value).forEach(key => {
        paths = paths.concat(getAllExpandablePaths(value[key], [...currentPath, key]));
      });
    }
  }
  return paths;
};

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ jsonData, onDataChange }) => {
  const stringifyPath = useCallback((path: Path): string => JSON.stringify(path), []);

  // Function to get all expandable paths (memoized based on jsonData)
  const allExpandablePaths = useMemo(() => {
    if (jsonData === null || typeof jsonData !== 'object') {
      return [];
    }
    return getAllExpandablePaths(jsonData as JsonValue);
  }, [jsonData]);

  const allExpandablePathStrings = useMemo(
    () => new Set(allExpandablePaths.map(stringifyPath)),
    [allExpandablePaths, stringifyPath]
  );

  // Calculate initial expanded state (all paths)
  const initialExpandedPaths = useMemo(() => {
    return new Set(allExpandablePaths.map(stringifyPath));
  }, [allExpandablePaths, stringifyPath]);

  // Initialize state
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(initialExpandedPaths);
  const [editingPath, setEditingPath] = useState<Path | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  // Initial state depends on whether there were any paths besides root
  const [isFullyExpanded, setIsFullyExpanded] = useState(allExpandablePaths.length > 1);

  const isExpanded = useCallback(
    (path: Path): boolean => {
      return expandedPaths.has(stringifyPath(path));
    },
    [expandedPaths, stringifyPath]
  );

  const toggleExpand = useCallback(
    (path: Path) => {
      const strPath = stringifyPath(path);
      setExpandedPaths(prev => {
        const newSet = new Set(prev);
        let currentlyFullyExpanded = false;
        if (newSet.has(strPath)) {
          newSet.delete(strPath);
          // If we collapse any node, it's no longer fully expanded
          setIsFullyExpanded(false);
        } else {
          newSet.add(strPath);
          // Check if adding this path makes it fully expanded
          if (allExpandablePathStrings.size === newSet.size) {
            // Compare sets element by element if sizes match, just to be sure
            let allMatch = true;
            for (const p of allExpandablePathStrings) {
              if (!newSet.has(p)) {
                allMatch = false;
                break;
              }
            }
            if (allMatch) {
              currentlyFullyExpanded = true;
            }
          }
          setIsFullyExpanded(currentlyFullyExpanded);
        }
        return newSet;
      });
    },
    [stringifyPath, allExpandablePathStrings]
  ); // Dependencies

  const expandAll = useCallback(() => {
    setExpandedPaths(allExpandablePathStrings);
    setIsFullyExpanded(allExpandablePaths.length > 1); // Set based on whether there's anything to expand
  }, [allExpandablePathStrings, allExpandablePaths.length]);

  const collapseAll = useCallback(() => {
    // Only keep the root node expanded
    setExpandedPaths(new Set<string>([stringifyPath(['root'])]));
    setIsFullyExpanded(false); // Explicitly set false
  }, [stringifyPath]);

  const startEdit = (path: Path, currentValue: JsonValue) => {
    setEditingPath(path);
    const stringValue = currentValue === null ? 'null' : String(currentValue ?? '');
    setEditValue(stringValue);
  };

  const cancelEdit = () => {
    setEditingPath(null);
    setEditValue('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const submitEdit = () => {
    if (!editingPath || jsonData === null) return;
    const convertedValue = convertValueType(editValue);
    // Use slice(1) to remove the artificial 'root' segment from the path
    const actualPath = editingPath.slice(1);
    const updatedData = updateNestedJsonValue(jsonData as JsonValue, actualPath, convertedValue);
    onDataChange(updatedData);
    cancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleToggleExpandCollapseAll = useCallback(() => {
    if (isFullyExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  }, [isFullyExpanded, collapseAll, expandAll]);

  if (jsonData === null || jsonData === undefined) {
    return (
      <div className="vison-card text-center p-8 animate-fade-in hover:shadow-soft-lg transition-all duration-300">
        <TreeViewIcon className="mx-auto w-12 h-12 text-gray-300 mb-3" />
        <p className="text-vison-charcoal/70">Enter valid JSON to see the tree view</p>
      </div>
    );
  }

  return (
    <div className="vison-card animate-fade-in hover:shadow-soft-lg transition-all duration-300">
      <div className="flex items-center justify-end mb-4">
        <Button
          variant="outline"
          size="icon" // Use icon size
          onClick={handleToggleExpandCollapseAll}
          title={isFullyExpanded ? 'Collapse' : 'Expand'} // Changed tooltip
          className="w-8 h-8" // Explicit size for icon button
        >
          {isFullyExpanded ? (
            <ChevronsUpDown className="w-4 h-4" /> // Icon for Collapse All
          ) : (
            <ChevronsDownUp className="w-4 h-4" /> // Icon for Expand All
          )}
        </Button>
      </div>
      {/* Removed max-w-2xl, changed overflow-x-hidden to overflow-x-auto, removed whitespace-normal */}
      <div className="vison-tree-container overflow-auto max-h-[500px] font-mono text-sm p-4 bg-gray-50 rounded-lg scrollbar-thin scrollbar-thumb-vison-purple/50 scrollbar-track-gray-100 overflow-x-auto">
        <TreeNode
          nodeKey="root"
          nodeValue={jsonData}
          level={0}
          path={['root']}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
          onEditSubmit={submitEdit} // Pass submitEdit
          editingPath={editingPath}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          editValue={editValue} // Pass state down
          handleEditChange={handleEditChange} // Pass handler down
          handleKeyDown={handleKeyDown} // Pass handler down
        />
      </div>
      <div className="mt-4 text-sm text-vison-charcoal/85">
        <span className="ml-1 text-xs italic">Click on the values to edit</span>
      </div>
    </div>
  );
};

const TreeNode: React.FC<TreeNodeProps> = ({
  // Destructure all props
  nodeKey,
  nodeValue,
  level,
  path,
  isExpanded,
  toggleExpand,
  onEditSubmit,
  editingPath,
  startEdit,
  cancelEdit,
  editValue,
  handleEditChange,
  handleKeyDown,
}) => {
  const isNodeObject = typeof nodeValue === 'object' && nodeValue !== null;
  const isNodeArray = Array.isArray(nodeValue);
  const indent = level * 24; // Increased indent slightly
  const nodeIsExpanded = isExpanded(path);
  const isCurrentlyEditing = pathsEqual(editingPath, path);
  const canEdit = isEditableValue(nodeValue);

  const handleValueClick = (e: React.MouseEvent) => {
    // Prevent click from propagating to parent toggleExpand
    e.stopPropagation();
    if (canEdit && !isCurrentlyEditing) {
      startEdit(path, nodeValue as JsonValue);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpand(path);
  };

  const renderValue = (value: unknown) => {
    if (value === null) {
      return <span className="text-gray-500 italic">null</span>;
    }
    if (typeof value === 'string') {
      return <span className="text-purple-800">"{value}"</span>; // Removed break-all
    }
    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }
    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{String(value)}</span>;
    }
    // For objects/arrays, show simple indicators when collapsed
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return <span className="text-gray-500 italic">[...]</span>; // Simplified array indicator
      } else {
        return <span className="text-gray-500 italic">{'{...}'}</span>; // Simplified object indicator
      }
    }
    return null;
  };

  // Removed quotes from key display
  const keyDisplay = typeof nodeKey === 'number' ? `${nodeKey}:` : `${nodeKey}:`;

  // Use memoization for child nodes if performance becomes an issue
  const childEntries = useMemo(() => {
    if (!isNodeObject) return [];
    return Object.entries(isNodeArray ? (nodeValue as JsonArray) : (nodeValue as JsonObject));
  }, [nodeValue, isNodeObject, isNodeArray]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the related target (where focus is going) is one of the control buttons
    // If it is, don't submit yet, let the button click handle it.
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget?.closest('.edit-control-button')) {
      return;
    }
    onEditSubmit(path, convertValueType(editValue)); // Submit on blur otherwise
  };
  const getInputWidth = () => {
    const valueLength = String(editValue).length;
    const contentType = typeof nodeValue;
    const extraPadding = contentType === 'string' ? 40 : 20;

    return Math.max(100, valueLength * 9 + extraPadding) + 'px';
  };

  return (
    <div style={{ paddingLeft: `${indent}px` }}>
      {/* Removed break-words */}
      <div className="flex items-center group hover:bg-gray-100 rounded transition-colors duration-150 py-0.5 relative">
        {/* Chevron */}
        {isNodeObject ? (
          <button
            aria-label="Toggle expand/collapse"
            onClick={handleToggleExpand}
            className="p-0.5 rounded hover:bg-gray-200 mr-1 text-gray-500 flex-shrink-0"
          >
            {nodeIsExpanded ? (
              <ChevronDown size={16} strokeWidth={1.5} />
            ) : (
              <ChevronRight size={16} strokeWidth={1.5} />
            )}
          </button>
        ) : (
          <span
            style={{ width: '20px', display: 'inline-block', marginRight: '4px' }}
            className="flex-shrink-0"
          ></span> // Placeholder
        )}
        {/* Key (only show if not root) */}
        {level > 0 && (
          <span className="text-vison-dark-charcoal mr-1 select-none flex-shrink-0 whitespace-nowrap">
            {keyDisplay}
          </span>
        )}{' '}
        {/* Added whitespace-nowrap */}
        {/* Value / Edit Input */}
        {isCurrentlyEditing ? (
          <div className="flex items-center">
            <Input
              type="text"
              value={editValue}
              onChange={handleEditChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              className="mr-1 px-1 py-0 h-6 text-sm"
              style={{ width: getInputWidth() }}
              onFocus={e => e.target.select()}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditSubmit(path, convertValueType(editValue))}
              className="ml-1 text-green-600 hover:bg-green-100 flex-shrink-0 edit-control-button h-6 w-6"
              aria-label="Save changes"
            >
              <Check size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelEdit}
              className="ml-0.5 text-red-600 hover:bg-red-100 flex-shrink-0 edit-control-button h-6 w-6"
              aria-label="Cancel editing"
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <span
            className={`ml-1 ${canEdit ? 'cursor-pointer group-hover:bg-vison-blue/10 px-1 rounded' : 'select-none'} whitespace-nowrap`} // Changed whitespace-normal to whitespace-nowrap
            onClick={handleValueClick}
          >
            {/* Show preview for collapsed objects/arrays, otherwise render primitive value */}
            {isNodeObject && !nodeIsExpanded ? renderValue(nodeValue) : renderValue(nodeValue)}
            {/* Show edit icon on hover for editable values */}
            {canEdit && (
              <Pencil
                size={12}
                className="inline-block ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}
          </span>
        )}
      </div>

      {/* Child Nodes */}
      {nodeIsExpanded && isNodeObject && (
        <div className="mt-0.5">
          {childEntries.map(([key, value]) => (
            <TreeNode
              key={key}
              nodeKey={isNodeArray ? parseInt(key) : key}
              nodeValue={value}
              level={level + 1}
              path={[...path, isNodeArray ? parseInt(key) : key]} // Construct child path
              isExpanded={isExpanded}
              toggleExpand={toggleExpand}
              onEditSubmit={onEditSubmit}
              editingPath={editingPath}
              startEdit={startEdit}
              cancelEdit={cancelEdit}
              editValue={editValue} // Pass down
              handleEditChange={handleEditChange} // Pass down
              handleKeyDown={handleKeyDown} // Pass down
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonTreeView;
