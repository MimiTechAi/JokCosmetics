'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretAdminAccess() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const router = useRouter();

  // Tastenkombination überwachen (Strg + Alt + A)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  // Logo-Klicks überwachen
  const handleLogoClick = () => {
    const currentTime = new Date().getTime();
    
    // Zurücksetzen wenn der letzte Klick mehr als 2 Sekunden her ist
    if (currentTime - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(currentTime);

    // Nach 5 schnellen Klicks zum Admin-Bereich
    if (clickCount === 4) {
      router.push('/admin');
      setClickCount(0);
    }
  };

  return (
    <div 
      onClick={handleLogoClick}
      className="cursor-pointer"
      aria-hidden="true"
    >
      <img
        src="/logo.svg"
        alt="Jok Cosmetics"
        className="h-12 w-auto"
      />
    </div>
  );
}
