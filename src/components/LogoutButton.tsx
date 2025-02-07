'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/providers/supabase-provider';

export function LogoutButton() {
  const router = useRouter();
  const supabase = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
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
