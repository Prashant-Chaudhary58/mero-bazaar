import { test, expect } from '@playwright/test';

test.describe('Authentication UI & Flows', () => {

    test('should load the login page and logo', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/login');

        // Verify Page Title or Heading
        const heading = page.getByRole('heading', { name: 'Welcome Back' });
        await expect(heading).toBeVisible();

        // Verify Logo Image
        const logo = page.getByAltText('MEro Baazar');
        await expect(logo).toBeVisible();
    });

    test('should show validation errors when submitting an empty form', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/login');

        const submitBtn = page.getByRole('button', { name: 'Login' });
        await submitBtn.click();

        // Verify Zod validation warnings
        await expect(page.getByText('Minimum 10 digits required')).toBeVisible();
        await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('should show validation error for invalid phone number format', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/login');

        const phoneInput = page.getByPlaceholder('98XXXXXXXX');
        const submitBtn = page.getByRole('button', { name: 'Login' });

        await phoneInput.fill('12345'); // Invalid length
        await submitBtn.click();

        await expect(page.getByText('Minimum 10 digits required')).toBeVisible();
    });

    test('should navigate to the Forgot Password page via the provided link', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/login');

        const forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
        await expect(forgotPasswordLink).toBeVisible();

        await forgotPasswordLink.click();

        // Assumes the Forgot Password page loads successfully
        await expect(page).toHaveURL(/.*\/auth\/forgot-password/);
    });

    test('should navigate to the Registration page via the Sign Up link', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/login');

        const signUpLink = page.getByRole('link', { name: 'Sign Up' });
        await expect(signUpLink).toBeVisible();

        await signUpLink.click();

        // Assumes the Register page loads successfully
        await expect(page).toHaveURL(/.*\/auth\/register/);
    });
});
