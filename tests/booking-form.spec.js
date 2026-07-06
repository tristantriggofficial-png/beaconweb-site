// @ts-check
const { test, expect } = require('@playwright/test');

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/booking/6fJkJsGH5nA2RwmnnQAO';

/**
 * These tests exercise the "Book a Free Call" form on contact.html.
 * The webhook endpoint (BEACONWEB_WEBHOOK_URL) is intentionally still a
 * placeholder in production, so we assert the redirect to the GHL booking
 * calendar fires regardless of whether that webhook call succeeds or fails.
 */

async function fillForm(page) {
  await page.fill('#firstName', 'Jane');
  await page.fill('#lastName', 'Doe');
  await page.fill('#phone', '(760) 555-0100');
}

test('redirects to booking calendar when webhook call fails (placeholder URL)', async ({ page }) => {
  // Block any outbound webhook request so it "fails" like the current
  // placeholder BEACONWEB_WEBHOOK_URL does in production.
  await page.route('**/PLACEHOLDER_WEBHOOK', (route) => route.abort());

  // Prevent the actual cross-origin navigation to the GHL calendar so the
  // test can assert on the intended destination without leaving the page.
  await page.route(CALENDAR_URL, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>calendar</body></html>' })
  );

  await page.goto('/contact.html');
  await fillForm(page);
  await page.click('#bookingSubmitBtn');

  await page.waitForURL(CALENDAR_URL, { timeout: 5000 });
  expect(page.url()).toBe(CALENDAR_URL);
});

test('does not redirect if required fields are left blank', async ({ page }) => {
  await page.goto('/contact.html');
  // Leave all fields empty and submit.
  await page.click('#bookingSubmitBtn');

  // Should still be on the contact page — native validation blocks it.
  await page.waitForTimeout(500);
  expect(page.url()).toContain('/contact.html');
});

test('booking form only has First Name, Last Name, and Phone Number fields', async ({ page }) => {
  await page.goto('/contact.html');
  await expect(page.locator('#firstName')).toBeVisible();
  await expect(page.locator('#lastName')).toBeVisible();
  await expect(page.locator('#phone')).toBeVisible();
  await expect(page.locator('#businessName')).toHaveCount(0);
  await expect(page.locator('#email')).toHaveCount(0);
  await expect(page.locator('#challenge')).toHaveCount(0);
});
