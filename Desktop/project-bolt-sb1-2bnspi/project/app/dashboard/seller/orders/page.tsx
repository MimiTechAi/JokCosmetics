"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrderDetails } from "@/components/orders/order-details";
import { Eye } from "lucide-react";

// Sample data - In a real app, this would come from an API
const orders = [
  {
    id: "ORD-2024-001",
    date: "15.03.2024",
    customer: {
      name: "Max Mustermann",
      email: "max@example.com"
    },
    items: [
      { id: 1, name: "Bio-Baumwoll T-Shirt", quantity: 2, price: "59,98 €" },
      { id: 2, name: "Bambuszahnbürste", quantity: 1, price: "12,99 €" }
    ],
    total: "72,97 €",
    status: "processing",
    shippingAddress: "Musterstraße 123, 12345 Berlin"
  },
  {
    id: "ORD-2024-002",
    date: "14.03.2024",
    customer: {
      name: "Laura Schmidt",
      email: "laura@example.com"
    },
    items: [
      { id: 3, name: "Wiederverwendbare Wasserflasche", quantity: 1, price: "24,99 €" }
    ],
    total: "24,99 €",
    status: "shipped",
    shippingAddress: "Beispielweg 45, 67890 München"
  },
  {
    id: "ORD-2024-003",
    date: "13.03.2024",
    customer: {
      name: "Thomas Weber",
      email: "thomas@example.com"
    },
    items: [
      { id: 4, name: "Bio-Kaffeebohnen", quantity: 3, price: "50,97 €" }
    ],
    total: "50,97 €",
    status: "delivered",
    shippingAddress: "Testplatz 67, 34567 Hamburg"
  }
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bestellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Bestellungen und deren Status
        </p>
      </div>

      <Card className="p-6">
        <OrderFilters
          onSearch={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bestellung</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status as any} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
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

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}