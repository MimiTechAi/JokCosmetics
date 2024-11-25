"use client";

import { useState } from "react";
import { AssessmentForm } from "@/components/sustainability/assessment-form";
import { AssessmentResult } from "@/components/sustainability/assessment-result";
import type { SustainabilityScore } from "@/lib/ai/sustainability/types";

export default function SustainabilityAssessmentPage() {
  const [result, setResult] = useState<SustainabilityScore | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Nachhaltigkeitsbewertung
        </h2>
        <p className="text-muted-foreground">
          Analysieren Sie die Nachhaltigkeit Ihrer Produkte und erhalten Sie Zertifizierungsempfehlungen
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AssessmentForm onAnalysisComplete={setResult} />
        {result && <AssessmentResult result={result} />}
      </div>
    </div>
  );
}