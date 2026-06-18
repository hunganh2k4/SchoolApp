import { test, expect } from '@playwright/test';

// Use standard Frappe Administrator credentials for local testing
const FRAPPE_URL = 'http://localhost:8000';
const USERNAME = 'Administrator';
const PASSWORD = 'admin';

test.describe('Student Dashboard E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to Frappe Login
    await page.goto(`${FRAPPE_URL}/login`);

    // Fill in credentials and submit
    await page.fill('#login_email', USERNAME);
    await page.fill('#login_password', PASSWORD);
    await page.click('button.btn-login');

    // Wait for login to complete by waiting for the workspace or desk to load
    await page.waitForURL(/.*\/(app|desk).*/);

    // Navigate to the Student Dashboard
    await page.goto(`${FRAPPE_URL}/app/student-dashboard`);

    // Wait for the Dashboard to load and the 'Refresh List' button to appear
    await expect(page.locator('button:has-text("Refresh List")')).toBeVisible();
  });

  test('should create, update and delete a student', async ({ page }) => {
    const studentName = `Playwright Test Student ${Date.now()}`;
    const updatedStudentName = `${studentName} Updated`;
    const studentEmail = 'pwtest@example.com';

    // 1. Create a new student
    await page.click('button:has-text("New Student")');

    // Fill the dialog
    await page.fill('input[data-fieldname="student_name"]:visible', studentName);
    await page.fill('input[data-fieldname="student_email"]:visible', studentEmail);
    await page.click('button.btn-primary:has-text("Create"):visible');

    // Wait for success alert and modal to close
    await expect(page.locator('.alert-message', { hasText: 'Student created successfully' }).last()).toBeVisible({ timeout: 10000 });

    // Verify it appears in the list
    await expect(page.locator(`#result >> text="${studentName}"`)).toBeVisible();

    // 2. Edit the student
    // Locate the specific student card and click its Edit button
    const studentCard = page.locator('#result > div > div').filter({ hasText: studentName }).first();
    await studentCard.locator('.edit-btn').click();

    // Update name in dialog
    await page.fill('input[data-fieldname="student_name"]:visible', updatedStudentName);
    await page.click('button.btn-primary:has-text("Update"):visible');

    // Wait for success alert
    await expect(page.locator('.alert-message', { hasText: 'Student updated successfully' }).last()).toBeVisible({ timeout: 10000 });

    // Verify updated name appears in the list
    await expect(page.locator(`#result >> text="${updatedStudentName}"`)).toBeVisible();

    // 3. Delete the student
    const updatedStudentCard = page.locator('#result > div > div').filter({ hasText: updatedStudentName }).first();
    await updatedStudentCard.locator('.delete-btn').click();

    // Confirm deletion in frappe confirm dialog
    await page.click('button.btn-primary:has-text("Yes"):visible');

    // Wait for success alert
    await expect(page.locator('.alert-message', { hasText: 'Student deleted successfully' }).last()).toBeVisible({ timeout: 10000 });

    // Verify the student is no longer in the list
    await expect(page.locator(`#result >> text="${updatedStudentName}"`)).toBeHidden();
  });
});
