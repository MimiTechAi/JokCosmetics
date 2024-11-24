"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/charts/line-chart";
import type { MarketTrendAnalysis } from "@/types/ai";

interface DetailedAnalysisProps {
  analysis: MarketTrendAnalysis;
  productName: string;
  category: string;
}

export function DetailedAnalysis({ analysis, productName, category }: DetailedAnalysisProps) {
  // Beispielhafte Marktdaten für die Visualisierung
  const marketData = [
    { month: "Jan", value: 4200 },
    { month: "Feb", value: 4800 },
    { month: "Mär", value: 5300 },
    { month: "Apr", value: 5900 },
    { month: "Mai", value: 6400 },
    { month: "Jun", value: 7100 }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="competition">Wettbewerb</TabsTrigger>
          <TabsTrigger value="recommendations">Empfehlungen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Marktpotenzial</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gesamtpotenzial</span>
                    <span className="font-medium">{analysis.market_potential}%</span>
                  </div>
                  <Progress value={analysis.market_potential} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Wachstumsrate</span>
                    <span className="font-medium">{analysis.growth_rate}</span>
                  </div>
                  <Progress value={parseInt(analysis.growth_rate)} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Zielgruppen</h3>
              <div className="space-y-2">
                {analysis.target_demographics.map((demo, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span>{demo}</span>
                    <Badge variant="secondary">Hohe Relevanz</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Marktwachstum</h3>
            <div className="h-[300px]">
              <LineChart data={marketData} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Keyword-Trends</h3>
            <div className="space-y-4">
              {analysis.keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{keyword.keyword}</p>
                    <p className="text-sm text-muted-foreground">
                      Wachstum: {keyword.growth}
                    </p>
                  </div>
                  <Badge variant={keyword.trend === "up" ? "default" : "destructive"}>
                    {keyword.trend === "up" ? "Steigend" : "Fallend"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Saisonale Trends</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                  <p className="font-medium mb-2">Frühling</p>
                  <Badge variant="secondary">Hoch</Badge>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                  <p className="font-medium mb-2">Sommer</p>
                  <Badge variant="secondary">Mittel</Badge>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                  <p className="font-medium mb-2">Herbst</p>
                  <Badge variant="secondary">Hoch</Badge>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center">
                  <p className="font-medium mb-2">Winter</p>
                  <Badge variant="secondary">Niedrig</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Wettbewerbsanalyse</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="font-medium mb-2">Wettbewerbsintensität</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {analysis.competition_level}
                </p>
                <Progress value={
                  analysis.competition_level === "Hoch" ? 80 :
                  analysis.competition_level === "Mittel" ? 50 : 30
                } />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="font-medium mb-2">Markteintrittsbarrieren</p>
                  <Badge variant="secondary">Mittel</Badge>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="font-medium mb-2">Differenzierungspotenzial</p>
                  <Badge variant="default">Hoch</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Wettbewerbsvorteile</h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Preisempfehlungen</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <p className="font-medium mb-2">Optimaler Preisbereich</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(Math.random() * 50 + 50)}€ - {Math.floor(Math.random() * 50 + 100)}€
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Preisstrategien:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Premium-Positionierung
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Nachhaltigkeits-Premium
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Marketing-Empfehlungen</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Zielgruppen-Strategien</h3>
            <div className="space-y-4">
              {analysis.target_demographics.map((demo, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="font-medium mb-2">{demo}</p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Empfohlene Marketingkanäle:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Social Media</Badge>
                      <Badge variant="secondary">Newsletter</Badge>
                      <Badge variant="secondary">Influencer</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}