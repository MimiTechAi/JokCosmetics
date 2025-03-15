import React, { useEffect, useRef, useState } from 'react';
import './instagram.css';

interface InstagramEmbedProps {
  postUrl: string;
  className?: string;
}

// Korrekte TypeScript-Definition für das Instagram-Objekt
interface InstagramEmbeds {
  Embeds?: {
    process: () => void;
  };
}

// Erweitere den globalen Window-Typ korrekt durch Interface-Merging
declare global {
  interface Window {
    instgrm?: InstagramEmbeds;
  }
}

export const SimpleInstagramEmbed: React.FC<InstagramEmbedProps> = ({ 
  postUrl, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<{
    scriptLoaded: boolean;
    processAttempted: boolean;
    error: string | null;
    attempts: number;
  }>({
    scriptLoaded: false,
    processAttempted: false,
    error: null,
    attempts: 0
  });

  useEffect(() => {
    console.log(`🔍 InstagramEmbed: Attempting to embed post: ${postUrl}`);
    
    // Funktion um das Instagram-Skript zu laden
    const loadInstagramScript = () => {
      try {
        if (window.instgrm) {
          console.log('✅ InstagramEmbed: Instagram script already loaded');
          setDebugInfo(prev => ({ ...prev, scriptLoaded: true }));
          if (window.instgrm.Embeds) {
            console.log('🔄 InstagramEmbed: Processing embeds via existing script');
            window.instgrm.Embeds.process();
            setDebugInfo(prev => ({ ...prev, processAttempted: true }));
          } else {
            console.warn('⚠️ InstagramEmbed: window.instgrm exists but Embeds object is missing');
            setDebugInfo(prev => ({ 
              ...prev, 
              error: 'window.instgrm exists but Embeds object is missing',
              scriptLoaded: true 
            }));
          }
        } else {
          console.log('📥 InstagramEmbed: Loading Instagram script...');
          const script = document.createElement('script');
          script.async = true;
          script.crossOrigin = "anonymous"; 
          script.src = "https://www.instagram.com/embed.js"; 
          
          // Add event listeners to track script loading/errors
          script.onload = () => {
            console.log('✅ InstagramEmbed: Instagram script loaded successfully');
            setDebugInfo(prev => ({ ...prev, scriptLoaded: true }));
            if (window.instgrm && window.instgrm.Embeds) {
              console.log('🔄 InstagramEmbed: Processing embeds after script load');
              window.instgrm.Embeds.process();
              setDebugInfo(prev => ({ ...prev, processAttempted: true }));
              
              // Nach erfolgreichem Laden und Verarbeiten den Container neu rendern
              if (containerRef.current) {
                const blockquote = containerRef.current.querySelector('blockquote');
                if (blockquote) {
                  // Sicherstellen, dass Instagram das Element bearbeiten kann
                  blockquote.dataset.instgrmCaptioned = '';
                  blockquote.dataset.instgrmPermalink = postUrl;
                }
              }
            }
          };
          
          script.onerror = (e) => {
            console.error('❌ InstagramEmbed: Error loading Instagram script', e);
            setDebugInfo(prev => ({ 
              ...prev, 
              error: 'Error loading Instagram script',
              scriptLoaded: false 
            }));
          };
          
          document.body.appendChild(script);
        }
      } catch (err) {
        console.error('❌ InstagramEmbed: Exception while loading Instagram script', err);
        setDebugInfo(prev => ({ 
          ...prev, 
          error: err instanceof Error ? err.message : 'Unknown error loading script'
        }));
      }
    };

    // Skript laden
    loadInstagramScript();

    // CORS-Fehler-Check
    const checkForCORSErrors = () => {
      const hasErrors = document.querySelectorAll('.instagram-media[data-instgrm-payload-id]').length === 0;
      if (hasErrors) {
        console.warn('⚠️ InstagramEmbed: Possible CORS issue detected');
        setDebugInfo(prev => ({ 
          ...prev, 
          error: prev.error || 'Möglicherweise CORS-Fehler bei der Kommunikation mit Instagram'
        }));
      }
    };

    // Forciere die manuelle Aktualisierung des Instagram-Skripts
    const forceTriggerProcess = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        try {
          // Versuche direkt auf die Elemente zuzugreifen und sie zu bearbeiten
          const containers = document.querySelectorAll('.instagram-media');
          console.log(`🔍 InstagramEmbed: Found ${containers.length} Instagram containers to process`);
          
          // Instagram Embeds manuell verarbeiten
          window.instgrm.Embeds.process();
          setTimeout(checkForCORSErrors, 500);
        } catch (error) {
          console.error('❌ InstagramEmbed: Error during manual processing', error);
        }
      }
    };

    // Retry-Mechanismus
    const maxAttempts = 5;
    const retryInterval = 2000; // 2 Sekunden
    
    const retryTimer = setInterval(() => {
      setDebugInfo(prev => {
        const newAttempts = prev.attempts + 1;
        if (newAttempts <= maxAttempts && (!prev.scriptLoaded || !prev.processAttempted)) {
          console.log(`🔁 InstagramEmbed: Retry attempt ${newAttempts}/${maxAttempts}`);
          
          if (window.instgrm && window.instgrm.Embeds) {
            console.log('🔄 InstagramEmbed: Processing embeds in retry');
            forceTriggerProcess(); 
            return { ...prev, attempts: newAttempts, processAttempted: true };
          } else if (!prev.scriptLoaded) {
            // Skript neu laden, wenn es noch nicht geladen wurde
            loadInstagramScript();
            return { ...prev, attempts: newAttempts };
          }
          
          return { ...prev, attempts: newAttempts };
        } else if (newAttempts > maxAttempts) {
          console.warn('⚠️ InstagramEmbed: Max retry attempts reached');
          // Ein letztes Mal prüfen, ob CORS-Fehler aufgetreten sind
          checkForCORSErrors();
          clearInterval(retryTimer);
          return { 
            ...prev, 
            attempts: newAttempts,
            error: prev.error || 'Max retry attempts reached' 
          };
        }
        
        return prev;
      });
    }, retryInterval);

    return () => {
      clearInterval(retryTimer);
    };
  }, [postUrl]);

  // Extrahiere die Post-ID aus der URL für das alt-Attribut
  const postId = postUrl.split('/').filter(Boolean).pop() || 'instagram-post';

  // Debug-Status-Klassen
  const debugStatusClass = debugInfo.error 
    ? 'instagram-debug-error' 
    : (debugInfo.scriptLoaded && debugInfo.processAttempted ? 'instagram-debug-success' : 'instagram-debug-loading');

  return (
    <div ref={containerRef} className={`instagram-embed ${className} ${debugStatusClass}`}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
      >
        <div className="instagram-loading">
          <div className="instagram-loading-icon">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <path 
                fill="#C13584" 
                d="M25,0 C11.2,0 0,11.2 0,25 C0,38.8 11.2,50 25,50 C38.8,50 50,38.8 50,25 C50,11.2 38.8,0 25,0 Z M39.7,26.5 L35.6,26.5 C35.9,27.9 36,29.4 36,30.9 C36,36.6 31.6,41 25.9,41 C20.2,41 15.8,36.6 15.8,30.9 C15.8,29.4 16,27.9 16.3,26.5 L12.2,26.5 L12.2,38.7 C12.2,39.4 12.8,40 13.5,40 L38.2,40 C38.9,40 39.5,39.4 39.5,38.7 L39.5,26.5 L39.7,26.5 Z M25.9,34.9 C29.7,34.9 32.8,31.8 32.8,28 C32.8,24.2 29.7,21.1 25.9,21.1 C22.1,21.1 19,24.2 19,28 C19,31.8 22.1,34.9 25.9,34.9 Z M39.5,16.3 C39.5,15.6 38.9,15 38.2,15 L34.8,15 C34.1,15 33.5,15.6 33.5,16.3 L33.5,19.7 C33.5,20.4 34.1,21 34.8,21 L38.2,21 C38.9,21 39.5,20.4 39.5,19.7 L39.5,16.3 Z"
              />
            </svg>
          </div>
          <p className="instagram-loading-text">
            Instagram-Beitrag wird geladen...
          </p>
          
          {/* Debug-Informationen */}
          {debugInfo.error && (
            <div className="instagram-debug-info">
              <p className="instagram-error-text">
                Fehler beim Laden: {debugInfo.error}
              </p>
              <p className="instagram-error-hint">
                Bitte prüfen Sie die Konsole für weitere Details oder versuchen Sie, die Seite neu zu laden.
              </p>
              <a 
                href={postUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="instagram-direct-link"
              >
                Beitrag direkt auf Instagram ansehen
              </a>
            </div>
          )}
          
          {debugInfo.attempts > 0 && !debugInfo.error && (
            <p className="instagram-loading-attempts">
              Ladeversuch {debugInfo.attempts}/5
            </p>
          )}
        </div>
      </blockquote>
    </div>
  );
};
