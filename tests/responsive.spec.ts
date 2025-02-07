import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/services',
  '/about',
  '/agb',
  '/datenschutz',
];

const devices = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

test.describe('Visual Regression Tests', () => {
  for (const page of pages) {
    for (const device of devices) {
      test(`${page} should render correctly on ${device.name}`, async ({ page: pageContext }) => {
        // Set viewport size
        await pageContext.setViewportSize({
          width: device.width,
          height: device.height,
        });

        // Navigate to page
        await pageContext.goto(`http://localhost:3000${page}`);

        // Wait for main content to load
        await pageContext.waitForSelector('main', { timeout: 10000 });
        
        // Wait for all images to load
        await pageContext.waitForLoadState('networkidle');
        
        // Wait for animations to complete
        await pageContext.waitForTimeout(2000);
        
        // Disable animations and transitions
        await pageContext.addStyleTag({
          content: `
            * {
              animation: none !important;
              transition: none !important;
              scroll-behavior: auto !important;
            }
          `
        });

        // Force a specific window size to ensure consistent screenshots
        await pageContext.evaluate((height) => {
          window.innerHeight = height;
          window.outerHeight = height;
        }, device.height);

        // Wait for any dynamic content to settle
        await pageContext.waitForTimeout(1000);

        // Update screenshot options
        const screenshotOptions = {
          fullPage: true,
          threshold: 0.3,
          timeout: 15000,
          animations: 'disabled'
        };

        // Take the screenshot
        await expect(pageContext).toHaveScreenshot(`${page.replace('/', '')}-${device.name}.png`, screenshotOptions);
      });
    }
  }
});

test.describe('Layout Tests', () => {
  for (const page of pages) {
    for (const device of devices) {
      test(`${page} should have proper layout on ${device.name}`, async ({ page: pageContext }) => {
        // Set viewport size
        await pageContext.setViewportSize({
          width: device.width,
          height: device.height,
        });

        // Navigate to page
        await pageContext.goto(`http://localhost:3000${page}`);

        // Wait for main content to load
        await pageContext.waitForSelector('main', { timeout: 10000 });
        
        // Wait for all images to load
        await pageContext.waitForLoadState('networkidle');

        // Test for horizontal overflow (scrollbar)
        const hasHorizontalScrollbar = await pageContext.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScrollbar).toBeFalsy();

        // Check for overlapping elements
        const hasOverlap = await pageContext.evaluate(() => {
          const elements = document.querySelectorAll('*');
          let hasOverlap = false;
          
          elements.forEach((el1) => {
            const rect1 = el1.getBoundingClientRect();
            if (rect1.width === 0 || rect1.height === 0) return;
            
            elements.forEach((el2) => {
              if (el1 === el2 || el1.contains(el2) || el2.contains(el1)) return;
              
              const rect2 = el2.getBoundingClientRect();
              if (rect2.width === 0 || rect2.height === 0) return;
              
              if (!(rect1.right < rect2.left || 
                    rect1.left > rect2.right || 
                    rect1.bottom < rect2.top || 
                    rect1.top > rect2.bottom)) {
                hasOverlap = true;
              }
            });
          });
          return hasOverlap;
        });
        expect(hasOverlap).toBeFalsy();

        // Check for proper contrast ratio
        const hasLowContrast = await pageContext.evaluate(() => {
          function getLuminance(r: number, g: number, b: number) {
            const [rs, gs, bs] = [r, g, b].map(c => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          }

          function getContrastRatio(l1: number, l2: number) {
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
          }

          const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
          let hasLowContrast = false;

          textElements.forEach((el) => {
            const style = window.getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            if (fontSize < 14) {
              hasLowContrast = true;
              return;
            }

            const color = style.color;
            const bgColor = style.backgroundColor;
            
            const colorMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            const bgMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            
            if (!colorMatch || !bgMatch) return;
            
            const [, r1, g1, b1] = colorMatch.map(Number);
            const [, r2, g2, b2] = bgMatch.map(Number);
            
            const l1 = getLuminance(r1, g1, b1);
            const l2 = getLuminance(r2, g2, b2);
            
            const ratio = getContrastRatio(l1, l2);
            
            if (ratio < 4.5) {
              hasLowContrast = true;
            }
          });
          
          return hasLowContrast;
        });
        expect(hasLowContrast).toBeFalsy();
      });
    }
  }
});
