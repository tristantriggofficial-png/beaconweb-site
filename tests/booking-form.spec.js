// @ts-check
const { test, expect } = require('@playwright/test');

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/booking/6fJkJsGH5nA2RwmnnQAO';
const WEBHOOK_URL_PATTERN = '**/hooks/ICtWkaRkaZin73KCZGkC/webhook-trigger/**';

/**
 * These tests exercise the "Book a Free Call" form on contact.html.
 * The GHL webhook call is fire-and-forget by design, so the redirect to
 * the booking calendar must fire regardless of whether that webhook call
 * succeeds or fails. Both scenarios are exercised below. The real webhook
 * endpoint is always intercepted here so tests never actually POST to
 * Tristan's live GHL webhook.
 */

async function fillForm(page) {
  await page.fill('#firstName', 'Jane');
  await page.fill('#lastName', 'Doe');
  await page.fill('#phone', '(760) 555-0100');
}

async function mockCalendarPage(page) {
  // Prevent the actual cross-origin navigation to the GHL calendar so the
  // test can assert on the intended destination without leaving the page.
  await page.route(CALENDAR_URL, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>calendar</body></html>' })
  );
}

test('redirects to booking calendar when the webhook call fails', async ({ page }) => {
  await page.route(WEBHOOK_URL_PATTERN, (route) => route.abort());
  await mockCalendarPage(page);

  await page.goto('/contact.html');
  await fillForm(page);
  await page.click('#bookingSubmitBtn');

  await page.waitForURL(CALENDAR_URL, { timeout: 5000 });
  expect(page.url()).toBe(CALENDAR_URL);
});

test('redirects to booking calendar when the webhook call succeeds', async ({ page }) => {
  await page.route(WEBHOOK_URL_PATTERN, (route) => route.fulfill({ status: 200, body: 'ok' }));
  await mockCalendarPage(page);

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
