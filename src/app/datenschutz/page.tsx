'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PageContainer } from '@/components/PageContainer';

export default function DatenschutzPage() {
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
            Datenschutzerklärung
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Informationen zum Schutz und zur Verarbeitung Ihrer personenbezogenen Daten
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">1. Datenschutz auf einen Blick</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Diese 
                Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Erhebung 
                und Verwendung personenbezogener Daten bei JOK Cosmetics.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">2. Verantwortliche Stelle</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Verantwortlich für die Datenverarbeitung ist:<br />
                JOK Cosmetics<br />
                Wilhelmstraße 17<br />
                75378 Bad Liebenzell<br />
                Deutschland
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">3. Datenerfassung beim Besuch unserer Website</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Bei der Nutzung unserer Website werden nur die technisch notwendigen Daten erfasst. 
                Wir verwenden Cookies nur in dem für die Funktionalität der Website erforderlichen Umfang. 
                Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 DSGVO.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">4. Terminbuchung und Kundendaten</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Bei der Buchung eines Termins erheben wir die für die Durchführung der Dienstleistung 
                erforderlichen Daten. Diese werden ausschließlich für die Terminverwaltung und 
                Kundenbetreuung verwendet und nicht an Dritte weitergegeben.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">5. Ihre Rechte</h2>
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der 
                Verarbeitung Ihrer personenbezogenen Daten. Bei Fragen zum Datenschutz können 
                Sie sich jederzeit an uns wenden.
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
