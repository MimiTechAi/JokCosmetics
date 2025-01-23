'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CookieSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Prüfe, ob Cookie-Einstellungen bereits gespeichert sind
    const savedSettings = localStorage.getItem('cookieConsent')
    if (!savedSettings) {
      setShow(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const newSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    saveSettings(newSettings)
  }

  const handleSaveSettings = () => {
    saveSettings(settings)
  }

  const saveSettings = (settings: CookieSettings) => {
    localStorage.setItem('cookieConsent', JSON.stringify(settings))
    setShow(false)

    if (settings.analytics) {
      // Analytics-Cookies aktivieren
      enableAnalytics()
    }
    if (settings.marketing) {
      // Marketing-Cookies aktivieren
      enableMarketing()
    }
  }

  const enableAnalytics = () => {
    // Google Analytics oder andere Analytics-Tools initialisieren
    // window.gtag('consent', 'update', { analytics_storage: 'granted' })
  }

  const enableMarketing = () => {
    // Marketing-Cookies aktivieren
    // window.gtag('consent', 'update', { ad_storage: 'granted' })
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie-Einstellungen</h3>
            <p className="text-gray-600 text-sm mb-4">
              Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern.
              Hier können Sie festlegen, welche Cookies Sie akzeptieren möchten.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.necessary}
                  disabled
                  className="h-4 w-4"
                />
                <div>
                  <label className="font-medium">Notwendige Cookies</label>
                  <p className="text-sm text-gray-500">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.analytics}
                  onChange={(e) =>
                    setSettings({ ...settings, analytics: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <div>
                  <label className="font-medium">Analyse Cookies</label>
                  <p className="text-sm text-gray-500">
                    Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.marketing}
                  onChange={(e) =>
                    setSettings({ ...settings, marketing: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <div>
                  <label className="font-medium">Marketing Cookies</label>
                  <p className="text-sm text-gray-500">
                    Werden verwendet, um Werbung relevanter für Sie zu gestalten.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-4">
              Weitere Informationen finden Sie in unserer{' '}
              <Link href="/datenschutz" className="text-primary underline">
                Datenschutzerklärung
              </Link>
              .
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Auswahl speichern
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
