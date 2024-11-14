export interface Description {
  noun: string;
  descriptors: string[];
}

export interface DescriptionHistoryItem {
  id: string;
  text: string;
  timestamp: number;
}

export interface SavedDescription {
  id: string;
  text: string;
  savedAt: number;
}