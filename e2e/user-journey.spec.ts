import { test, expect } from '@playwright/test';

test.describe('CivicLens User Journey', () => {
  test('should navigate to sandbox and render components', async ({ page }) => {
    // Navigate to the sandbox page
    await page.goto('http://localhost:3000/sandbox');

    // Check if the page title is present
    await expect(page.locator('h1')).toContainText('Manifesto Sandbox');

    // Check if the sliders are rendered
    const sliders = page.locator('input[type="range"]');
    await expect(sliders).toHaveCount(5);

    // Check if the simulate button is present
    const simulateBtn = page.locator('button:has-text("Run Economic Simulation")');
    await expect(simulateBtn).toBeVisible();
    
    // Check topbar components
    const searchBtn = page.locator('button[aria-label="Submit search"]');
    await expect(searchBtn).toBeVisible();
  });

  test('should navigate to fact-checker and render form', async ({ page }) => {
    await page.goto('http://localhost:3000/fact-check');
    await expect(page.locator('h1')).toContainText('Fact-Check Lab');
    
    // Check text area
    const textarea = page.locator('textarea[placeholder*="Paste a WhatsApp forward"]');
    await expect(textarea).toBeVisible();
    
    // Check analyze button
    const analyzeBtn = page.locator('button:has-text("Analyze Claim")');
    await expect(analyzeBtn).toBeVisible();
  });
});
