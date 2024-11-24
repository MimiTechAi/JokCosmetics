"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CustomerFilters } from "@/components/customers/customer-filters";
import { CustomerDetails } from "@/components/customers/customer-details";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Max Mustermann",
    email: "max@example.com",
    phone: "+49 123 4567890",
    address: "Musterstraße 123, 12345 Berlin",
    joinDate: "März 2023",
    orderCount: 12,
    totalSpent: "1.245 €",
    status: "regular",
    lastOrder: "15.03.2024",
    trend: "up",
    preferences: ["Bio-Produkte", "Plastikfrei", "Vegane Kosmetik"]
  },
  {
    id: 2,
    name: "Laura Schmidt",
    email: "laura@example.com",
    phone: "+49 234 5678901",
    address: "Beispielweg 45, 67890 München",
    joinDate: "Januar 2024",
    orderCount: 3,
    totalSpent: "245 €",
    status: "new",
    lastOrder: "14.03.2024",
    trend: "up",
    preferences: ["Nachhaltige Mode", "Zero Waste"]
  },
  {
    id: 3,
    name: "Thomas Weber",
    email: "thomas@example.com",
    phone: "+49 345 6789012",
    address: "Testplatz 67, 34567 Hamburg",
    joinDate: "Juni 2023",
    orderCount: 8,
    totalSpent: "876 €",
    status: "vip",
    lastOrder: "10.03.2024",
    trend: "down",
    preferences: ["Bio-Lebensmittel", "Fair Trade", "Regionale Produkte"]
  }
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { label: "Neukunde", variant: "secondary" as const },
      regular: { label: "Stammkunde", variant: "default" as const },
      vip: { label: "VIP", variant: "default" as const }
    };
    return variants[status as keyof typeof variants];
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kunden</h2>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Kundenbeziehungen
        </p>
      </div>

      <Card className="p-6">
        <CustomerFilters
          onSearch={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bestellungen</TableHead>
                <TableHead>Umsatz</TableHead>
                <TableHead>Letzte Bestellung</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(customer.status).variant}>
                      {getStatusBadge(customer.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.orderCount}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    {customer.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}