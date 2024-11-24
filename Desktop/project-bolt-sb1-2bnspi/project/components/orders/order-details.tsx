import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Package, Truck, MapPin, User } from "lucide-react";

interface OrderDetailsProps {
  order: any;
  onClose: () => void;
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bestellung #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bestelldatum</p>
              <p className="font-medium">{order.date}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Kundeninformationen</p>
                <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Lieferadresse</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium mb-2">Bestellte Produkte</p>
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{item.name}</span>
                      <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Gesamtbetrag</span>
                <span className="font-bold">{order.total}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Status aktualisieren
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}