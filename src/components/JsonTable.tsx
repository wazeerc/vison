import React, { useEffect, useState } from 'react';
import {
  convertValueType,
  flattenJson,
  getUniqueKeys,
  isEditableValue,
  JsonValue,
  updateJsonValue,
} from '../utils/jsonUtils';
import { TableViewIcon } from './HandDrawnIcons';

interface JsonTableProps {
  jsonData: JsonValue | null;
  isArray: boolean;
  onDataChange: (updatedData: JsonValue) => void;
}

const JsonTable: React.FC<JsonTableProps> = ({ jsonData, onDataChange }) => {
  const [flattenedData, setFlattenedData] = useState<Record<string, unknown>[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const [editCell, setEditCell] = useState<{ row: number; key: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    if (!jsonData) {
      setFlattenedData([]);
      setKeys([]);
      return;
    }

    const flattened = flattenJson(jsonData);
    setFlattenedData(flattened);
    const uniqueKeys = getUniqueKeys(flattened);
    setKeys(uniqueKeys);
  }, [jsonData]);

  const handleCellClick = (rowIndex: number, key: string, value: unknown) => {
    if (!isEditableValue(value)) return;
    setEditCell({ row: rowIndex, key });
    setEditValue(value == null ? '' : String(value));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditBlur = () => {
    if (editCell && jsonData) {
      const { row, key } = editCell;
      const convertedValue = convertValueType(editValue);
      const updatedData = updateJsonValue(jsonData as JsonValue, row, key, convertedValue);
      onDataChange(updatedData);
    }
    setEditCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditBlur();
    } else if (e.key === 'Escape') {
      setEditCell(null);
    }
  };

  if (!jsonData || flattenedData.length === 0) {
    return (
      <div className="vison-card text-center p-8 animate-fade-in hover:shadow-soft-lg transition-all duration-300">
        <TableViewIcon className="mx-auto w-12 h-12 text-gray-300 mb-3" />
        <p className="text-vison-charcoal/70">Enter valid JSON to see the table view</p>
      </div>
    );
  }

  return (
    <div className="vison-card animate-fade-in hover:shadow-soft-lg transition-all duration-300">
      <div className="vison-table-container overflow-auto max-h-[500px]">
        <table className="vison-table">
          <thead>
            <tr>
              {/* Row number column */}
              <th className="w-12 text-center">#</th>

              {/* Data columns */}
              {keys.map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flattenedData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="text-center text-gray-400 font-mono">{rowIndex}</td>

                {keys.map(key => {
                  const value = item[key];
                  const isEditing = editCell?.row === rowIndex && editCell?.key === key;
                  const canEdit = isEditableValue(value);

                  // Display cell content
                  return (
                    <td
                      key={`${rowIndex}-${key}`}
                      className={`${canEdit ? 'cursor-pointer hover:bg-vison-blue/10' : ''} transition-colors duration-150`}
                      onClick={() => handleCellClick(rowIndex, key, value)}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          autoFocus
                          className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-vison-blue"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleEditBlur}
                          onKeyDown={handleKeyDown}
                        />
                      ) : (
                        <CellContent value={value} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-vison-charcoal/70">
        {flattenedData.length} {flattenedData.length === 1 ? 'row' : 'rows'}, {keys.length}{' '}
        {keys.length === 1 ? 'column' : 'columns'}
        <span className="ml-1 text-xs">(Click on cell values to edit)</span>
      </div>
    </div>
  );
};

// Helper component to display cell content based on value type
const CellContent: React.FC<{ value: unknown }> = ({ value }) => {
  if (value == null) {
    return <span className="text-gray-400 italic">{String(value)}</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="text-purple-600 font-mono">{String(value)}</span>;
  }
  if (typeof value === 'number') {
    return <span className="text-blue-600 font-mono">{value}</span>;
  }
  if (typeof value === 'string') {
    return <span className="text-purple-800 font-mono">{value}</span>;
  }
  if (Array.isArray(value)) {
    return <span className="text-gray-500 italic">[Array: {value.length} items]</span>;
  }
  if (typeof value === 'object') {
    return (
      <span className="text-gray-500 italic">{`{Object: ${Object.keys(value as object).length} properties}`}</span>
    );
  }
  return <span>{String(value)}</span>;
};

export default JsonTable;
