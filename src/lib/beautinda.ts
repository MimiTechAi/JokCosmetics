// Beautinda API Integration
import puppeteer, { Browser, Page, ElementHandle, ConsoleMessage } from 'puppeteer';

const BEAUTINDA_URL = 'https://pro.beautinda.de';

export interface BeautindaCredentials {
  email: string;
  password: string;
}

export interface BeautindaLoginResponse {
  success: boolean;
  message?: string;
}

export interface BeautindaService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
}

export interface BeautindaCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface BeautindaBooking {
  id: string;
  customer_id: string;
  service_id: string;
  date: string;
  time: string;
  status?: string;
}

export class BeautindaAPI {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl: string;

  constructor(baseUrl: string = BEAUTINDA_URL) {
    this.baseUrl = baseUrl;
  }

  private async ensureInitialized(): Promise<Page> {
    if (!this.browser || !this.page) {
      await this.initialize();
    }
    if (!this.page) {
      throw new Error('Seite konnte nicht initialisiert werden');
    }
    return this.page;
  }

  public async initialize(): Promise<void> {
    try {
      if (!this.browser) {
        console.log('Starte Browser...');
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
          ]
        });
      }

      if (!this.page) {
        console.log('Erstelle neue Seite...');
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1280, height: 800 });
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Debug-Logging
        this.page.on('console', (msg: ConsoleMessage) => console.log('Browser Log:', msg.text()));
        this.page.on('error', (err: Error) => console.error('Browser Error:', err));
        this.page.on('pageerror', (err: Error) => console.error('Page Error:', err));
      }
    } catch (error) {
      console.error('Fehler bei der Browser-Initialisierung:', error);
      throw new Error('Browser konnte nicht initialisiert werden');
    }
  }

  public async login(credentials: BeautindaCredentials): Promise<BeautindaLoginResponse> {
    try {
      const page = await this.ensureInitialized();

      console.log('Navigiere zur Login-Seite...');
      await page.goto(`${this.baseUrl}/login`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Debug: Speichere Screenshot der Login-Seite
      await page.screenshot({ path: 'login-page.png' });
      
      // Debug: Hole HTML-Inhalt
      const pageContent = await page.content();
      console.log('Seiteninhalt:', pageContent);

      // Warte zuerst auf grundlegende Seitenelemente
      await page.waitForSelector('body', { timeout: 10000 });

      // Verschiedene mögliche Login-Selektoren
      const selectors = [
        // Formular-Selektoren
        'form[action*="login"]',
        'form[action*="auth"]',
        'form[method="post"]',
        'form',
        // Input-Selektoren
        'input[type="email"], input[name="email"]',
        'input[type="text"], input[name="username"]',
        'input[type="password"], input[name="password"]',
        // Button-Selektoren
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Login")',
        'button:contains("Anmelden")'
      ];

      console.log('Suche Login-Elemente...');
      
      // Prüfe jeden Selektor und logge das Ergebnis
      for (const selector of selectors) {
        const element = await page.$(selector);
        console.log(`Selektor "${selector}": ${element ? 'gefunden' : 'nicht gefunden'}`);
      }

      // Versuche direkt die Eingabefelder zu finden
      const emailInput = await page.$('input[type="email"], input[name="email"], input[type="text"]');
      const passwordInput = await page.$('input[type="password"], input[name="password"]');
      const submitButton = await page.$('button[type="submit"], input[type="submit"], button');

      if (!emailInput || !passwordInput || !submitButton) {
        console.log('Login-Elemente Status:', {
          emailInput: !!emailInput,
          passwordInput: !!passwordInput,
          submitButton: !!submitButton
        });

        // Speichere Screenshot für Debugging
        await page.screenshot({ path: 'login-error.png' });
        
        throw new Error('Login-Formular nicht gefunden. Bitte überprüfen Sie die Selektoren.');
      }

      console.log('Login-Elemente gefunden, führe Login durch...');

      // Führe Login durch
      await emailInput.type(credentials.email, { delay: 100 });
      await passwordInput.type(credentials.password, { delay: 100 });
      
      // Warte kurz vor dem Klick
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Klicke den Submit-Button und warte auf Navigation
      await Promise.all([
        page.waitForNavigation({ 
          waitUntil: 'networkidle0',
          timeout: 30000 
        }),
        submitButton.click()
      ]).catch(async (error) => {
        console.error('Navigation-Error:', error);
        // Versuche trotzdem fortzufahren
      });

      // Prüfe ob Login erfolgreich war
      const currentUrl = page.url();
      console.log('Aktuelle URL nach Login:', currentUrl);

      if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
        // Versuche Fehlermeldung zu finden
        const errorMessage = await page.$eval(
          '.error, .alert, .notification, [role="alert"], .message, .error-message',
          (el: Element) => el.textContent
        ).catch(() => 'Login fehlgeschlagen');

        throw new Error(`Login fehlgeschlagen: ${errorMessage}`);
      }

      console.log('Login erfolgreich');
      return { success: true };

    } catch (error) {
      console.error('Login-Fehler:', error);
      // Speichere finalen Screenshot bei Fehler
      if (this.page) {
        await this.page.screenshot({ path: 'login-final-error.png' });
      }
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unbekannter Fehler beim Login'
      };
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch (error) {
      console.error('Fehler beim Schließen des Browsers:', error);
    }
  }

  private async extractTableData<T>(selector: string, rowSelector: string, transform: (row: ElementHandle<Element>) => Promise<T>): Promise<T[]> {
    const page = await this.ensureInitialized();
    const table = await page.$(selector);
    
    if (!table) {
      throw new Error(`Tabelle nicht gefunden: ${selector}`);
    }

    const rows = await table.$$(rowSelector);
    const results: T[] = [];

    for (const row of rows) {
      try {
        const data = await transform(row);
        results.push(data);
      } catch (error) {
        console.error('Fehler beim Verarbeiten einer Zeile:', error);
      }
    }

    return results;
  }

  async getServices(): Promise<BeautindaService[]> {
    try {
      const page = await this.ensureInitialized();
      console.log('[Beautinda] Navigiere zu Services...');
      await page.goto(`${this.baseUrl}/services`, { waitUntil: 'networkidle0' });
      
      return this.extractTableData<BeautindaService>(
        '.services-table',
        'tr.service-row',
        async (row) => ({
          id: await row.$eval('td', (el: Element) => el.getAttribute('data-id') || ''),
          name: await row.$eval('td.name', (el: Element) => el.textContent?.trim() || ''),
          description: await row.$eval('td.description', (el: Element) => el.textContent?.trim() || ''),
          price: await row.$eval('td.price', (el: Element) => parseFloat(el.textContent?.replace(/[^0-9.,]/g, '') || '0')),
          duration: await row.$eval('td.duration', (el: Element) => parseFloat(el.textContent?.replace(/[^0-9]/g, '') || '0')),
          category: await row.$eval('td.category', (el: Element) => el.textContent?.trim() || ''),
        })
      );
    } catch (error) {
      console.error('[Beautinda] Fehler beim Abrufen der Services:', error);
      throw error;
    }
  }

  async getCustomers(): Promise<BeautindaCustomer[]> {
    try {
      const page = await this.ensureInitialized();
      console.log('[Beautinda] Navigiere zu Kunden...');
      await page.goto(`${this.baseUrl}/customers`, { waitUntil: 'networkidle0' });
      
      return this.extractTableData<BeautindaCustomer>(
        '.customers-table',
        'tr.customer-row',
        async (row) => ({
          id: await row.$eval('td', (el: Element) => el.getAttribute('data-id') || ''),
          name: await row.$eval('td.name', (el: Element) => el.textContent?.trim() || ''),
          email: await row.$eval('td.email', (el: Element) => el.textContent?.trim() || ''),
          phone: await row.$eval('td.phone', (el: Element) => el.textContent?.trim() || ''),
        })
      );
    } catch (error) {
      console.error('[Beautinda] Fehler beim Abrufen der Kunden:', error);
      throw error;
    }
  }

  async getBookings(): Promise<BeautindaBooking[]> {
    try {
      const page = await this.ensureInitialized();
      console.log('[Beautinda] Navigiere zu Buchungen...');
      await page.goto(`${this.baseUrl}/bookings`, { waitUntil: 'networkidle0' });
      
      return this.extractTableData<BeautindaBooking>(
        '.bookings-table',
        'tr.booking-row',
        async (row) => ({
          id: await row.$eval('td', (el: Element) => el.getAttribute('data-id') || ''),
          customer_id: await row.$eval('td', (el: Element) => el.getAttribute('data-customer-id') || ''),
          service_id: await row.$eval('td', (el: Element) => el.getAttribute('data-service-id') || ''),
          date: await row.$eval('td.date', (el: Element) => el.textContent?.trim() || ''),
          time: await row.$eval('td.time', (el: Element) => el.textContent?.trim() || ''),
          status: await row.$eval('td.status', (el: Element) => el.textContent?.trim() || ''),
        })
      );
    } catch (error) {
      console.error('[Beautinda] Fehler beim Abrufen der Buchungen:', error);
      throw error;
    }
  }
}
