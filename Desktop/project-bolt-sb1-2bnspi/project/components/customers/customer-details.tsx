import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Heart,
} from "lucide-react";

interface CustomerDetailsProps {
  customer: any;
  onClose: () => void;
}

export function CustomerDetails({ customer, onClose }: CustomerDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Kundendetails</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">Kunde seit {customer.joinDate}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Bestellungen</span>
              </div>
              <p className="text-2xl font-bold mt-2">{customer.orderCount}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Umsatz</span>
              </div>
              <p className="text-2xl font-bold mt-2">{customer.totalSpent}</p>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Präferenzen</h4>
            <div className="flex flex-wrap gap-2">
              {customer.preferences.map((pref: string) => (
                <Badge key={pref} variant="secondary">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Kontaktieren
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}