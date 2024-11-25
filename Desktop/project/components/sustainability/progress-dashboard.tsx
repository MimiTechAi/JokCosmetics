"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Recycle } from "lucide-react";
import { progressTracker } from '@/lib/progress';
import type { ProgressData } from '@/types/ai';

export function ProgressDashboard() {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    setProgress(progressTracker.getProgress());
  }, []);

  if (!progress) return null;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ihr Nachhaltigkeits-Fortschritt</h3>
          <Badge variant="secondary">
            {progress.total_analyses} Analysen
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Durchschnittlicher Score</span>
              <span className="text-sm font-medium">{Math.round(progress.average_score)}%</span>
            </div>
            <Progress value={progress.average_score} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">CO₂ Einsparung</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                {progress.total_co2_saved}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Wasser gespart</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                {progress.total_water_saved}
              </p>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Recycle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Abfall reduziert</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                {progress.total_waste_reduced}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Letzte Analyse: {new Date(progress.last_analysis).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}