import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepCardProps {
  title: string;
  description: string;
  stepNumber: number;
  children: React.ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({ title, description, stepNumber, children }) => {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900">
            <span className="font-bold">{stepNumber}</span>
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};