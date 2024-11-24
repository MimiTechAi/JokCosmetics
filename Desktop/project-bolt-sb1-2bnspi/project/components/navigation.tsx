"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { mainCategories, subCategories } from "@/lib/categories";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Leaf, Search, Menu, X, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const isAuthPage = pathname?.startsWith("/auth");
  const isSellerDashboard = pathname?.startsWith("/dashboard/seller");
  const isSeller = user?.role === 'seller';
  const isBuyer = isAuthenticated && !isSeller;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isAuthPage || !mounted) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-8">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="font-bold text-xl hidden md:inline">Naturio</span>
        </Link>

        <NavigationMenu className="hidden md:flex mr-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Kategorien</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[800px] grid-cols-2 p-4 md:grid-cols-3">
                  {mainCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategorie/${category.slug}`}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">{category.name}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {category.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nachhaltige Produkte suchen..."
              className="pl-9 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name || 'Mein Konto'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={isSeller ? "/dashboard/seller" : "/dashboard/buyer"}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={isSeller ? "/dashboard/seller/settings" : "/dashboard/buyer/settings"}>
                      <Settings className="mr-2 h-4 w-4" />
                      Einstellungen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/register?type=seller">
                  <Button variant="ghost">Für Händler</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost">Anmelden</Button>
                </Link>
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4">
            <ul className="space-y-4">
              <li>
                <Button variant="ghost" className="w-full justify-start">Kategorien</Button>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link href="/auth/register?type=seller">
                    <Button variant="ghost" className="w-full justify-start">Für Händler</Button>
                  </Link>
                </li>
              )}
              <li>
                {isAuthenticated ? (
                  <>
                    <Link href={isSeller ? "/dashboard/seller" : "/dashboard/buyer"}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href={isSeller ? "/dashboard/seller/settings" : "/dashboard/buyer/settings"}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Einstellungen
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      Abmelden
                    </Button>
                  </>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full justify-start">Anmelden</Button>
                  </Link>
                )}
              </li>
              <li>
                <div className="flex justify-start">
                  <ThemeToggle />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}