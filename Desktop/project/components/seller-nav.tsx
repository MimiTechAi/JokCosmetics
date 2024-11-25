"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Settings,
  Package,
  ShoppingBag,
  Users,
  Leaf,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: BarChart,
    href: "/dashboard/seller",
    color: "text-sky-500",
  },
  {
    label: "Produkte",
    icon: Package,
    href: "/dashboard/seller/products",
    color: "text-violet-500",
  },
  {
    label: "Bestellungen",
    icon: ShoppingBag,
    href: "/dashboard/seller/orders",
    color: "text-pink-700",
  },
  {
    label: "Kunden",
    icon: Users,
    href: "/dashboard/seller/customers",
    color: "text-orange-700",
  },
  {
    label: "Nachhaltigkeit",
    icon: Leaf,
    href: "/dashboard/seller/sustainability",
    color: "text-emerald-500",
  },
  {
    label: "Einstellungen",
    icon: Settings,
    href: "/dashboard/seller/settings",
  },
];

export function SellerNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard/seller" className="flex items-center pl-3 mb-14">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold ml-2">Naturio</span>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-emerald-600 hover:bg-emerald-100/50 rounded-lg transition",
                pathname === route.href
                  ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}