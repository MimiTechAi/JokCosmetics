'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/database-types';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClientComponentClient<Database>();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 hover:bg-red-100/20 hover:text-red-600"
      onClick={handleLogout}
    >
      <LogOut className="h-5 w-5" />
      <span>Ausloggen</span>
    </Button>
  );
}
