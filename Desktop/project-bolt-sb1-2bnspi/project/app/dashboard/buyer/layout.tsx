import { ReactNode } from "react";
import { BuyerNav } from "@/components/buyer-nav";

export default function BuyerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <BuyerNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}