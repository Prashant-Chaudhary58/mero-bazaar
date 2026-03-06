import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation & Display', () => {

    test('should load the homepage and display the main hero section', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Verify hero text is visible
        const heroHeading = page.getByRole('heading', { name: 'Fresh Farm Produce' });
        await expect(heroHeading).toBeVisible();

        const subtitle = page.getByText('Directly from farmers to your kitchen.');
        await expect(subtitle).toBeVisible();
    });

    test('should display the search input box', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Verify search input is present
        const searchInput = page.getByPlaceholder('Search vegetables, fruits...');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeEditable();
    });

    test('should render category filter buttons including "All"', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Assuming first category is 'All'
        const allCategoryBtn = page.getByRole('button', { name: 'All', exact: true });
        await expect(allCategoryBtn).toBeVisible();

        const vegetablesBtn = page.getByRole('button', { name: 'Vegetables', exact: true });
        await expect(vegetablesBtn).toBeVisible();
    });

    test('should navigate to Login page when header Login button is clicked', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        // Using exact match to differentiate from any other Login usage
        const loginBtn = page.getByRole('link', { name: 'Login', exact: true });
        await expect(loginBtn).toBeVisible();

        await loginBtn.click();
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should navigate to Registration page when header Register button is clicked', async ({ page }) => {
        await page.goto('http://localhost:3000/');

        const registerBtn = page.getByRole('link', { name: 'Register', exact: true });
        await expect(registerBtn).toBeVisible();

        await registerBtn.click();
        await expect(page).toHaveURL(/.*\/auth\/register/);
    });

});
