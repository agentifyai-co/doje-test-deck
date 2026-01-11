import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepCard } from './StepCard';

interface ApiConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiConfig: React.FC<ApiConfigProps> = ({ apiKey, setApiKey }) => {
  return (
    <StepCard
      stepNumber={1}
      title="Configure API Key"
      description="Get your API key from api2pdf.com and add it here."
    >
      <div className="space-y-2">
        <Label htmlFor="api-key">api2pdf.com API Key</Label>
        <Input
          id="api-key"
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Your API key is stored in your browser and never sent to our servers.
        </p>
      </div>
    </StepCard>
  );
};