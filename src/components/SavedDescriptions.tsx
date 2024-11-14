import React from 'react';
import { BookmarkPlus, Copy, RotateCcw, Trash } from 'lucide-react';
import { useDescription } from '../context/DescriptionContext';

const SavedDescriptions: React.FC = () => {
  const { savedDescriptions, removeFromSaved, reuseDescription } = useDescription();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookmarkPlus className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Saved Descriptions</h2>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {savedDescriptions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <BookmarkPlus className="w-5 h-5 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No saved descriptions</p>
          </div>
        ) : (
          savedDescriptions.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm text-gray-700 truncate">{item.text}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1 hover:text-indigo-600" 
                  title="Copy"
                  onClick={() => handleCopy(item.text)}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  className="p-1 hover:text-blue-600" 
                  title="Reuse"
                  onClick={() => reuseDescription(item.text)}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  className="p-1 hover:text-red-600" 
                  title="Delete"
                  onClick={() => removeFromSaved(item.id)}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedDescriptions;