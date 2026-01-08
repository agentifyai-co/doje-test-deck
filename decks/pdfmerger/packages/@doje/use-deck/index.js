import { createContext, useContext, useState, useCallback } from 'react';

const DeckContext = createContext(null);

export const DeckProvider = ({ children }) => {
  // This is a placeholder implementation for the Doje runtime interaction.
  const [state, setState] = useState({
    loading: false,
    error: null,
    response: null,
  });

  const runStep = useCallback(async (stepId, inputs) => {
    console.log(`Simulating runStep for '${stepId}' with inputs:`, inputs);
    setState({ loading: true, error: null, response: null });
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a mock response based on the presence of an API key
    if (inputs && inputs.apiKey) {
       setState({
         loading: false,
         error: null,
         response: {
           status: 200,
           body: {
             pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
             mbIn: 0.02,
             mbOut: 0.01,
             cost: 0.0025,
             success: true,
           }
         }
       });
    } else {
       setState({
         loading: false,
         error: {
           status: 401,
           body: {
             success: false,
             reason: "Invalid API Key provided. [Mocked Error]"
           },
           message: "Unauthorized"
         },
         response: null
       });
    }
  }, []);

  const value = { ...state, runStep };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (context === null) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};