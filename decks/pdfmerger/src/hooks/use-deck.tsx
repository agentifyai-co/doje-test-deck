import { useState, createContext, useContext, ReactNode } from 'react';
import deckManifest from '../../deck.json';
import apiMocks from '../../api-mocks.json';

// This is a local mock to simulate the real @doje/use-deck package.
// It allows the UI component to be developed without access to the private package.

interface DeckContextType {
  runStep: (stepId: string, inputs: Record<string, any>) => Promise<void>;
  loading: boolean;
  error: any | null;
  response: any | null;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const runStep = async (stepId: string, inputs: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const step = deckManifest.steps.find(s => s.id === stepId);
      if (!step) {
        throw new Error(`Step "${stepId}" not found in deck.json`);
      }

      const endpointId = step.action.endpointRef;
      // In this mock, we'll use the mock data.
      // A full implementation would also handle live API calls.
      const mockResponse = apiMocks[endpointId]?.success;

      if (!mockResponse) {
        throw new Error(`Mock for endpoint "${endpointId}" not found in api-mocks.json.`);
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 750));

      setResponse(mockResponse);
    } catch (e) {
      const err = e as Error;
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const value = { runStep, loading, error, response };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};