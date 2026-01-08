import React from 'react';

export interface DeckResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

export interface DeckError {
  status: number;
  body: any;
  message: string;
}

export interface UseDeckResult {
  loading: boolean;
  error: DeckError | null;
  response: DeckResponse | null;
  runStep: (stepId: string, inputs: Record<string, any>) => Promise<void>;
}

export const DeckProvider: React.FC<{ children: React.ReactNode }>;
export const useDeck: () => UseDeckResult;