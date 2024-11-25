import { ReactNode } from "react";
import { SellerNav } from "@/components/seller-nav";

export default function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SellerNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}