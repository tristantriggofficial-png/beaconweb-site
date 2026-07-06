// @ts-check
const { test, expect } = require('@playwright/test');

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/booking/6fJkJsGH5nA2RwmnnQAO';

/**
 * contact.html no longer has an inquiry/booking form. The "Book a Call"
 * section is now a single button that links straight to the GHL booking
 * calendar. GHL's calendar widget itself collects name/phone/email when
 * someone actually books a slot, so there is no custom webhook on this
 * page anymore. These tests just confirm the button exists and points at
 * the correct calendar.
 */

async function mockCalendarPage(page) {
  // Prevent the actual cross-origin navigation to the GHL calendar so the
  // test can assert on the intended destination without leaving the page.
  await page.route(CALENDAR_URL, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>calendar</body></html>' })
  );
}

test('book-a-call button exists, is prominent, and points at the booking calendar URL', async ({ page }) => {
  await page.goto('/contact.html');

  const button = page.locator('#bookCallBtn');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Book My Free Audit Call');
  await expect(button).toHaveAttribute('href', CALENDAR_URL);
});

test('clicking the button navigates directly to the booking calendar, no intermediate form', async ({ page }) => {
  await mockCalendarPage(page);

  await page.goto('/contact.html');
  await page.click('#bookCallBtn');

  await page.waitForURL(CALENDAR_URL, { timeout: 5000 });
  expect(page.url()).toBe(CALENDAR_URL);
});

test('contact.html no longer contains the old inquiry form fields', async ({ page }) => {
  await page.goto('/contact.html');
  await expect(page.locator('#firstName')).toHaveCount(0);
  await expect(page.locator('#lastName')).toHaveCount(0);
  await expect(page.locator('#phone')).toHaveCount(0);
  await expect(page.locator('#businessName')).toHaveCount(0);
  await expect(page.locator('#email')).toHaveCount(0);
  await expect(page.locator('#bookingForm')).toHaveCount(0);
});

test('urgency, guarantee, and pricing-expectation copy are still present', async ({ page }) => {
  await page.goto('/contact.html');
  await expect(page.locator('body')).toContainText('Limited to 5 free audits per month');
  await expect(page.locator('body')).toContainText("You'll receive your audit whether you hire us or not");
  await expect(page.locator('body')).toContainText('Pricing is customized after your free audit');
});
