'use client';

import { motion } from 'framer-motion';

interface BookingStepsProps {
  currentStep: number;
}

export const BookingSteps = ({ currentStep }: BookingStepsProps) => {
  const steps = [
    { number: 1, label: 'Service' },
    { number: 2, label: 'Datum' },
    { number: 3, label: 'Uhrzeit' },
    { number: 4, label: 'Details' },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center ${
              step.number < 4 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            {step.number < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > step.number
                    ? 'bg-pink-600'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <span key={step.number} className="text-sm">
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};
