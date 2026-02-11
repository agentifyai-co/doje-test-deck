import React, { useState } from 'react';
import { ApiConfig } from './ApiConfig';
import { UrlToPdfGetStep } from './UrlToPdfGetStep';
import { UrlToPdfPostStep } from './UrlToPdfPostStep';
import { HtmlToPdfStep } from './HtmlToPdfStep';

const Deck: React.FC = () => {
  const [apiKey, setApiKey] = useState('');

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">PDF Generation with Headless Chrome</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          A Usecase Deck for converting web content to PDFs using the api2pdf.com service.
        </p>
      </header>
      <div className="flex flex-col items-center gap-8">
        <ApiConfig apiKey={apiKey} setApiKey={setApiKey} />
        <UrlToPdfGetStep apiKey={apiKey} />
        <UrlToPdfPostStep apiKey={apiKey} />
        <HtmlToPdfStep apiKey={apiKey} />
      </div>
    </main>
  );
};

export default Deck;