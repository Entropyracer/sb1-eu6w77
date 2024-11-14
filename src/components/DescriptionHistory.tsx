import React, { useState } from 'react';
import { History, BookmarkPlus, Copy, RotateCcw, Save, Trash } from 'lucide-react';
import { useDescription } from '../context/DescriptionContext';

const DescriptionHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');
  const { recentHistory, savedDescriptions, removeFromHistory, removeFromSaved, addToSaved, reuseDescription } = useDescription();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const items = activeTab === 'recent' ? recentHistory : savedDescriptions;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            activeTab === 'recent'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="font-medium">Recent</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookmarkPlus className="w-5 h-5" />
          <span className="font-medium">Saved</span>
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'recent' ? (
              <>
                <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p>No recent descriptions</p>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p>No saved descriptions</p>
              </>
            )}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm text-gray-700 truncate flex-1 mr-4">{item.text}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1 hover:text-indigo-600" 
                  title="Copy"
                  onClick={() => handleCopy(item.text)}
                >
                  <Copy className="w-4 h-4" />
                </button>
                {activeTab === 'recent' && (
                  <button 
                    className="p-1 hover:text-green-600" 
                    title="Save"
                    onClick={() => addToSaved(item.text)}
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
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
                  onClick={() => 
                    activeTab === 'recent' 
                      ? removeFromHistory(item.id) 
                      : removeFromSaved(item.id)
                  }
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

export default DescriptionHistory;