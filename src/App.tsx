import React from 'react';
import DescriptionBuilder from './components/DescriptionBuilder';
import RecentHistory from './components/RecentHistory';
import SavedDescriptions from './components/SavedDescriptions';
import { DescriptionProvider } from './context/DescriptionContext';

const App: React.FC = () => {
  return (
    <DescriptionProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Description Builder</h1>
            <p className="text-gray-600">Create and manage formatted descriptions with ease</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DescriptionBuilder />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <RecentHistory />
              <SavedDescriptions />
            </div>
          </div>
        </div>
      </div>
    </DescriptionProvider>
  );
};

export default App;