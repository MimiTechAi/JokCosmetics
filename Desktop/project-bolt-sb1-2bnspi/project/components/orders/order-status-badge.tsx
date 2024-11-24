import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    pending: { label: "Ausstehend", variant: "secondary" },
    processing: { label: "In Bearbeitung", variant: "default" },
    shipped: { label: "Versendet", variant: "default" },
    delivered: { label: "Geliefert", variant: "default" },
    cancelled: { label: "Storniert", variant: "destructive" },
  };

  const { label, variant } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}