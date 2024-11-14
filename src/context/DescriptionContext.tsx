import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DescriptionHistoryItem, SavedDescription } from '../types';

interface DescriptionContextType {
  recentHistory: DescriptionHistoryItem[];
  savedDescriptions: SavedDescription[];
  currentDescription: string | null;
  addToHistory: (text: string) => void;
  addToSaved: (text: string) => void;
  removeFromHistory: (id: string) => void;
  removeFromSaved: (id: string) => void;
  reuseDescription: (text: string) => void;
}

const DescriptionContext = createContext<DescriptionContextType | undefined>(undefined);

// Keep track of used IDs to ensure uniqueness
const usedIds = new Set<string>();

const generateUniqueId = () => {
  let id: string;
  do {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const counter = (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString(36);
    id = `${timestamp}-${random}-${counter}`;
  } while (usedIds.has(id));
  
  usedIds.add(id);
  return id;
};

export function DescriptionProvider({ children }: { children: ReactNode }) {
  const [recentHistory, setRecentHistory] = useLocalStorage<DescriptionHistoryItem[]>('recentHistory', []);
  const [savedDescriptions, setSavedDescriptions] = useLocalStorage<SavedDescription[]>('savedDescriptions', []);
  const [currentDescription, setCurrentDescription] = useLocalStorage<string | null>('currentDescription', null);

  const addToHistory = (text: string) => {
    const newItem: DescriptionHistoryItem = {
      id: generateUniqueId(),
      text,
      timestamp: Date.now(),
    };
    setRecentHistory(prev => {
      // Prevent duplicate entries
      const isDuplicate = prev.some(item => item.text === text);
      if (isDuplicate) {
        return prev;
      }
      return [newItem, ...prev].slice(0, 50);
    });
  };

  const addToSaved = (text: string) => {
    const newItem: SavedDescription = {
      id: generateUniqueId(),
      text,
      savedAt: Date.now(),
    };
    setSavedDescriptions(prev => {
      // Prevent duplicate entries
      const isDuplicate = prev.some(item => item.text === text);
      if (isDuplicate) {
        return prev;
      }
      return [newItem, ...prev].slice(0, 50);
    });
  };

  const removeFromHistory = (id: string) => {
    setRecentHistory(prev => prev.filter(item => item.id !== id));
    usedIds.delete(id); // Clean up the ID from our tracking set
  };

  const removeFromSaved = (id: string) => {
    setSavedDescriptions(prev => prev.filter(item => item.id !== id));
    usedIds.delete(id); // Clean up the ID from our tracking set
  };

  const reuseDescription = (text: string) => {
    setCurrentDescription(text);
  };

  return (
    <DescriptionContext.Provider
      value={{
        recentHistory,
        savedDescriptions,
        currentDescription,
        addToHistory,
        addToSaved,
        removeFromHistory,
        removeFromSaved,
        reuseDescription,
      }}
    >
      {children}
    </DescriptionContext.Provider>
  );
}

export function useDescription() {
  const context = useContext(DescriptionContext);
  if (context === undefined) {
    throw new Error('useDescription must be used within a DescriptionProvider');
  }
  return context;
}