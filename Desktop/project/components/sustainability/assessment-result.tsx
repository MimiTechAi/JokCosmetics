import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { SustainabilityScore } from "@/lib/ai/sustainability/types";

interface AssessmentResultProps {
  result: SustainabilityScore;
}

export function AssessmentResult({ result }: AssessmentResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Nachhaltigkeitsbewertung</h3>
            <p className="text-sm text-muted-foreground">
              KI-gestützte Analyse Ihres Produkts
            </p>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            getScoreColor(result.score)
          )}>
            {result.score}/100
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Materialien</span>
              <span className={getScoreColor(result.ratings.materials)}>
                {result.ratings.materials}%
              </span>
            </div>
            <Progress value={result.ratings.materials} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Produktion</span>
              <span className={getScoreColor(result.ratings.production)}>
                {result.ratings.production}%
              </span>
            </div>
            <Progress value={result.ratings.production} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Transport</span>
              <span className={getScoreColor(result.ratings.transport)}>
                {result.ratings.transport}%
              </span>
            </div>
            <Progress value={result.ratings.transport} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verpackung</span>
              <span className={getScoreColor(result.ratings.packaging)}>
                {result.ratings.packaging}%
              </span>
            </div>
            <Progress value={result.ratings.packaging} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Lebenszyklus</span>
              <span className={getScoreColor(result.ratings.lifecycle)}>
                {result.ratings.lifecycle}%
              </span>
            </div>
            <Progress value={result.ratings.lifecycle} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Soziale Aspekte</span>
              <span className={getScoreColor(result.ratings.social)}>
                {result.ratings.social}%
              </span>
            </div>
            <Progress value={result.ratings.social} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Zertifizierungspotenzial</h4>
            <div className="space-y-2">
              {result.certifications.ready.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Bereit für Zertifizierung:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.certifications.ready.map((cert) => (
                      <Badge key={cert} variant="default">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {result.certifications.potential.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Potenzielle Zertifizierungen:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.certifications.potential.map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Umweltauswirkungen</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">CO₂</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {result.impact.co2}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Wasser</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {result.impact.water}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Abfall</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {result.impact.waste}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Verbesserungsvorschläge</h4>
            {result.improvements.high.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  Hohe Priorität:
                </p>
                <ul className="space-y-1">
                  {result.improvements.high.map((improvement, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvements.medium.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                  Mittlere Priorität:
                </p>
                <ul className="space-y-1">
                  {result.improvements.medium.map((improvement, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvements.low.length > 0 && (
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                  Niedrige Priorität:
                </p>
                <ul className="space-y-1">
                  {result.improvements.low.map((improvement, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}