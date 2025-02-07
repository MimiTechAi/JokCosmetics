'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PageContainer } from '@/components/PageContainer';

export default function AGBPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <PageContainer>
      <div ref={ref} className="max-w-4xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hier finden Sie unsere allgemeinen Geschäftsbedingungen für die Dienstleistungen von JOK Cosmetics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">1. Geltungsbereich</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Dienstleistungen von JOK Cosmetics. 
                Mit der Buchung einer Dienstleistung erkennt der Kunde diese AGB an.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">2. Terminvereinbarung</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Termine können online, telefonisch oder persönlich vereinbart werden. 
                Eine Terminreservierung ist verbindlich und verpflichtet zur Zahlung der vereinbarten Leistung.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">3. Stornierung</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Termine können bis 24 Stunden vor dem vereinbarten Zeitpunkt kostenlos storniert werden. 
                Bei späteren Absagen oder Nichterscheinen wird der volle Behandlungspreis berechnet.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">4. Preise und Zahlung</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Die Preise für unsere Dienstleistungen sind in der aktuellen Preisliste aufgeführt. 
                Die Zahlung erfolgt direkt nach der Behandlung in bar oder per EC-Karte.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">5. Haftung</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                JOK Cosmetics haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit. 
                Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            Stand: Februar 2024<br />
            JOK Cosmetics
          </p>
        </motion.div>
      </div>
    </PageContainer>
  );
}
