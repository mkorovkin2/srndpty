import { test, expect } from '@playwright/test';

test.describe('Srndpty Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title and description', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('✨ Srndpty');
    await expect(page.locator('p').first()).toContainText('Universal interactive diagram framework');
  });

  test('should have example selection dropdown', async ({ page }) => {
    const select = page.locator('#example-select');
    await expect(select).toBeVisible();
    
    // Check that all expected options are present
    await expect(select.locator('option[value="basic"]')).toHaveText('Basic Flow');
    await expect(select.locator('option[value="pipeline"]')).toHaveText('Data Pipeline');
    await expect(select.locator('option[value="microservices"]')).toHaveText('Microservices');
  });

  test('should switch examples when dropdown changes', async ({ page }) => {
    const select = page.locator('#example-select');
    const textarea = page.locator('textarea');
    
    // Start with basic example
    await expect(select).toHaveValue('basic');
    await expect(textarea).toContainText('"type": "flow"');
    
    // Switch to pipeline example
    await select.selectOption('pipeline');
    await expect(textarea).toContainText('Data Pipeline');
    await expect(textarea).toContainText('ingest');
    
    // Switch to microservices example
    await select.selectOption('microservices');
    await expect(textarea).toContainText('Microservices');
    await expect(textarea).toContainText('API Gateway');
  });

  test('should have control buttons', async ({ page }) => {
    // Check that all control buttons are present
    await expect(page.locator('button', { hasText: 'Zoom In' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Zoom Out' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Fit' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Reset' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Export SVG' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Export PNG' })).toBeVisible();
  });

  test('should have editable JSON textarea', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await expect(textarea).toBeEditable();
    
    // Should contain valid JSON by default
    const content = await textarea.inputValue();
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const textarea = page.locator('textarea');
    
    // Clear and enter invalid JSON
    await textarea.fill('{ invalid json');
    
    // Should show error message
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Error:');
  });

  test('should display diagram container', async ({ page }) => {
    const diagramContainer = page.locator('.diagram-container');
    await expect(diagramContainer).toBeVisible();
    
    // Should have proper dimensions
    const boundingBox = await diagramContainer.boundingBox();
    expect(boundingBox?.height).toBeGreaterThan(400);
  });

  test('should have interaction guide in footer', async ({ page }) => {
    await expect(page.locator('.interaction-guide h3')).toContainText('Interaction Guide');
    
    // Check for some key interaction instructions
    await expect(page.locator('.guide-item')).toContainText('Hover:');
    await expect(page.locator('.guide-item')).toContainText('Click Nodes:');
    await expect(page.locator('.guide-item')).toContainText('Zoom in/out');
  });

  test('should mention Next.js in footer', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Next.js');
    await expect(page.locator('footer')).toContainText('TypeScript');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Elements should still be visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#example-select')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('.diagram-container')).toBeVisible();
  });
});
