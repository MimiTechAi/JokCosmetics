'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const ParticleEffect = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setDimensions({
        width: width,
        height: window.innerHeight
      });
      setParticleCount(width < 768 ? 30 : 60);
      setIsMounted(true);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 md:w-4 md:h-4 bg-white/40 rounded-full blur-[2px] md:blur-[3px]"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: Math.random() * 1 + 0.5,
          }}
          animate={{
            x: [null, Math.random() * dimensions.width],
            y: [null, Math.random() * dimensions.height],
            opacity: [0, 0.7, 0],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

export function Hero() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 right-0 bottom-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/hero/WhatsApp Image 2024-10-12 at 20.34.53.jpeg"
            alt="JOK Cosmetics Hero"
            fill
            className="object-cover object-[50%_30%]"
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/70 to-black/90" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <ParticleEffect />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white w-full max-w-[2000px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-6xl md:text-8xl lg:text-9xl font-bold mb-8 md:mb-12 font-serif tracking-tight"
          >
            <span className="block relative pt-4">
              <span className="relative inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                JOK Cosmetics
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl lg:text-4xl mb-8 md:mb-12 max-w-3xl mx-auto font-light tracking-wide"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/95 via-white/85 to-white/95">
              Meisterhafte Schönheitsbehandlungen in Bad Liebenzell
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center"
          >
            <Link href="/book">
              <Button 
                variant="default"
                size="lg"
                className="relative min-w-[220px] md:min-w-[260px] h-14 md:h-16 text-lg md:text-xl overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 font-medium tracking-wide">
                  Termin buchen
                </span>
              </Button>
            </Link>
            <Link href="https://wa.me/491735390928" target="_blank">
              <Button 
                variant="secondary"
                size="lg"
                className="relative min-w-[220px] md:min-w-[260px] h-14 md:h-16 text-lg md:text-xl overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/30" />
                <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 font-medium tracking-wide flex items-center justify-center">
                  <Image
                    src="/images/whatsapp.svg"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  WhatsApp
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [-10, 10], scale: [1, 0.9] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="w-8 h-14 border-3 border-white/80 rounded-full p-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <motion.div
                animate={{
                  y: [0, 16, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-light tracking-wider">
              Scroll
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
