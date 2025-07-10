// src/components/layout/logout-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useTransition } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await logout();
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
