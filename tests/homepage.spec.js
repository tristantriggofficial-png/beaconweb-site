// @ts-check
const { test, expect } = require('@playwright/test');

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/booking/6fJkJsGH5nA2RwmnnQAO';

/**
 * The homepage inquiry form (which silently discarded every submission —
 * GHL_WEBHOOK_URL was a placeholder, so leads were never actually captured
 * even though visitors saw a confident "you're all set" success message)
 * has been replaced with the same single-button pattern used on
 * contact.html: one click straight to the GHL booking calendar. This
 * makes the homepage and contact page one consistent conversion path
 * instead of two different ones.
 */

async function mockCalendarPage(page) {
  await page.route(CALENDAR_URL, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>calendar</body></html>' })
  );
}

test('book-a-call button exists on the homepage and points at the booking calendar URL', async ({ page }) => {
  await page.goto('/index.html');

  const button = page.locator('#bookCallBtn');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Find out why your business is losing money');
  await expect(button).toHaveAttribute('href', CALENDAR_URL);
});

test('clicking the homepage button navigates directly to the booking calendar, no form', async ({ page }) => {
  await mockCalendarPage(page);

  await page.goto('/index.html');
  await page.click('#bookCallBtn');

  await page.waitForURL(CALENDAR_URL, { timeout: 5000 });
  expect(page.url()).toBe(CALENDAR_URL);
});

test('homepage no longer contains the old inquiry form fields or fake success message', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#firstName')).toHaveCount(0);
  await expect(page.locator('#businessName')).toHaveCount(0);
  await expect(page.locator('#phone')).toHaveCount(0);
  await expect(page.locator('#email')).toHaveCount(0);
  await expect(page.locator('#websiteUrl')).toHaveCount(0);
  await expect(page.locator('#challenge')).toHaveCount(0);
  await expect(page.locator('.form-success')).toHaveCount(0);
  await expect(page.locator('.audit-form')).toHaveCount(0);
});

test('all "Get My Free Audit" anchors on the homepage point at #book-a-call, not the removed #audit-form', async ({ page }) => {
  await page.goto('/index.html');
  const hrefs = await page.locator('a:has-text("Get My Free Audit")').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href).toBe('#book-a-call');
  }
});

test('urgency and pricing-expectation copy are still present on the homepage', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('body')).toContainText('Limited to 5 free audits per month');
  await expect(page.locator('body')).toContainText('Pricing is customized after your free audit');
});
