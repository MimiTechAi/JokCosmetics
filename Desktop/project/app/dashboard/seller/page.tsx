"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart } from "@/components/charts/line-chart";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

// Sample data - Replace with API data in production
const salesData = [
  { month: "Jan", value: 4200 },
  { month: "Feb", value: 4800 },
  { month: "Mar", value: 5300 },
  { month: "Apr", value: 5900 },
  { month: "Mai", value: 6400 },
  { month: "Jun", value: 7100 }
];

const notifications = [
  { id: 1, type: "warning", message: "10 Bestellungen warten auf Bearbeitung" },
  { id: 2, type: "alert", message: "2 Produkte sind fast ausverkauft" },
  { id: 3, type: "success", message: "Umsatzziel für Juni erreicht" }
];

const todos = [
  { id: 1, task: "Neue Produkte hinzufügen", priority: "high" },
  { id: 2, task: "Umsatzanalyse durchführen", priority: "medium" },
  { id: 3, task: "Lagerbestand prüfen", priority: "low" }
];

export default function SellerDashboard() {
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht über Ihre Verkaufsaktivitäten
          </p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Zeitraum wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Letzte 7 Tage</SelectItem>
            <SelectItem value="30d">Letzter Monat</SelectItem>
            <SelectItem value="90d">Letztes Quartal</SelectItem>
            <SelectItem value="365d">Letztes Jahr</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Alert key={notification.id} variant={notification.type === "warning" ? "destructive" : "default"}>
            <AlertDescription className="flex items-center">
              {notification.type === "warning" && <AlertCircle className="h-4 w-4 mr-2" />}
              {notification.type === "success" && <CheckCircle2 className="h-4 w-4 mr-2" />}
              {notification.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Produkte
                </p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">12%</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Meistverkauft: Bio-Baumwoll T-Shirt</p>
            <p>3 Produkte fast ausverkauft</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Bestellungen
                </p>
                <h3 className="text-2xl font-bold">142</h3>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">8%</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Ø Bestellwert: €89,50</p>
            <p>10 offene Bestellungen</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-violet-100 dark:bg-violet-900 rounded-full">
                <Users className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Kunden
                </p>
                <h3 className="text-2xl font-bold">89</h3>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">24%</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>12 neue Kunden diese Woche</p>
            <p>85% Wiederkaufrate</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Umsatz
                </p>
                <h3 className="text-2xl font-bold">€4,325</h3>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-red-600">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">4%</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Conversion Rate: 3.2%</p>
            <p>Ziel: €5,000 (-€675)</p>
          </div>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Umsatzentwicklung</h3>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Metrik wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Umsatz</SelectItem>
                <SelectItem value="orders">Bestellungen</SelectItem>
                <SelectItem value="customers">Kunden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px]">
            <LineChart data={salesData} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Aufgaben</h3>
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      todo.priority === "high"
                        ? "destructive"
                        : todo.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {todo.priority}
                  </Badge>
                  <span>{todo.task}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Erledigt
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Letzte Aktivitäten</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Neue Bestellung #2024-142</p>
              <p className="text-sm text-muted-foreground">2 Produkte • €89,50</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 inline mr-1" />
              Vor 5 Minuten
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Package className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Produkt aktualisiert: Bio-Baumwoll T-Shirt</p>
              <p className="text-sm text-muted-foreground">Lagerbestand: 45 Stück</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 inline mr-1" />
              Vor 1 Stunde
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Neuer Kunde registriert</p>
              <p className="text-sm text-muted-foreground">Max Mustermann</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 inline mr-1" />
              Vor 2 Stunden
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}