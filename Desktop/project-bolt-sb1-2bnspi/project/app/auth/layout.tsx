import { ReactNode } from 'react';
import Image from 'next/image';
import { Leaf } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
          alt="Naturio Authentication Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-bold">Naturio</span>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}