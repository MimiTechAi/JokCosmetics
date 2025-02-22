'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { PageContainer } from '@/components/PageContainer';

export default function AboutPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <PageContainer>
      <div ref={ref} className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
            Über JOK Cosmetics
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie professionelle Schönheitsbehandlungen in einer entspannten und luxuriösen Atmosphäre
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent z-10"></div>
              <Image
                src="/images/ptofile.png"
                alt="Thansuda von JOK Cosmetics"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                className="transform hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={100}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-20 blur-2xl"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Willkommen bei JOK Cosmetics</h2>
              <p className="text-gray-600 leading-relaxed">
                Als Ihre Expertin für Permanent Make-up, Wimpernverlängerung und Gesichtsbehandlungen 
                biete ich Ihnen professionelle Beauty-Dienstleistungen auf höchstem Niveau. Mein Ziel 
                ist es, Ihre natürliche Schönheit zu betonen und Ihr Selbstbewusstsein zu stärken.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Meine Philosophie</h2>
              <p className="text-gray-600 leading-relaxed">
                Jeder Kunde ist einzigartig und verdient eine individuelle, auf seine Bedürfnisse 
                abgestimmte Behandlung. Ich nehme mir Zeit für eine ausführliche Beratung und 
                entwickle gemeinsam mit Ihnen die perfekte Lösung für Ihre Wünsche.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Qualität & Hygiene</h2>
              <p className="text-gray-600 leading-relaxed">
                In meinem Studio arbeite ich ausschließlich mit hochwertigen Produkten und modernsten 
                Geräten. Hygiene und Sicherheit haben dabei oberste Priorität, damit Sie sich bei mir 
                rundum wohlfühlen können.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-600">
            Ich freue mich darauf, Sie in meinem Studio begrüßen zu dürfen!<br />
            Ihre Thansuda
          </p>
        </motion.div>
      </div>
    </PageContainer>
  );
}

export const viewport = {
  themeColor: '#ffffff',
};
