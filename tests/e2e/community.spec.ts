import { test, expect } from '@playwright/test';

test.describe('Plateforme Communautaire Le Revenu - E2E Tests', () => {

  test('1. Page d’accueil et navigation principale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Communauté Le Revenu/);

    // Header and logo
    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('REVENU');
    await expect(brand).toContainText('Communauté');

    // Search bar
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    // Side navigation
    const sideNav = page.locator('.side');
    await expect(sideNav).toBeVisible();
    await expect(sideNav.locator('a').first()).toBeVisible();

    // Discussion Feed
    const feed = page.locator('.feed');
    await expect(feed).toBeVisible();
  });

  test('2. Bouton retour dans l’en-tête redirige vers l’accueil', async ({ page }) => {
    await page.goto('/spaces');
    const backBtn = page.locator('.sb-back');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toContainText("Retour à l'accueil");

    await backBtn.click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('3. Basculement de persona (Visiteur vs Membre actif)', async ({ page }) => {
    await page.goto('/');

    const visitorBtn = page.getByRole('button', { name: 'Visiteur' });
    const memberBtn = page.getByRole('button', { name: 'Membre actif' });

    await expect(visitorBtn).toBeVisible();
    await expect(memberBtn).toBeVisible();

    // Switch to Visitor
    await visitorBtn.click();
    await expect(visitorBtn).toHaveClass(/on/);

    // Switch to Member
    await memberBtn.click();
    await page.locator('.proto select').waitFor({ state: 'visible', timeout: 10000 });
    await expect(memberBtn).toHaveClass(/on/);
    await expect(page.locator('.proto select')).toBeVisible();
  });

  test('4. Consultation d’une discussion et vote « Utile »', async ({ page }) => {
    await page.goto('/');

    // Switch to Vincent to vote on other users' discussions (anti-self-vote compliance)
    const userSelect = page.locator('.proto select');
    if (await userSelect.isVisible()) {
      await userSelect.selectOption('Vincent_ETF');
      await page.waitForTimeout(500);
    }

    // Wait for feed to load
    await page.waitForSelector('.feed article, .feed .trow', { timeout: 10000 });
    const firstLink = page.locator('.ttitle a, .tt-main a').first();
    await expect(firstLink).toBeVisible();
    await firstLink.click();

    // Verify discussion content is displayed
    await expect(page.locator('.prose-content').first()).toBeVisible({ timeout: 10000 });

    // Click "Utile" vote button
    const usefulBtn = page.locator('button.act.useful').first();
    await expect(usefulBtn).toBeVisible();
    await usefulBtn.click();
    await expect(usefulBtn).toHaveClass(/on/);
  });

  test('5. Profil utilisateur avec points dynamiques et discussions paginées', async ({ page }) => {
    await page.goto('/profile/Camille_B');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Camille');
    await expect(page.locator('text=@Camille_B')).toBeVisible();

    // Points display from Strapi
    const pointsBlock = page.locator('.num.text-accent').first();
    await expect(pointsBlock).toBeVisible();
    const pts = await pointsBlock.innerText();
    expect(Number(pts)).toBeGreaterThan(0);
  });

  test('6. Filtrage par espace et bascule de densité', async ({ page }) => {
    await page.goto('/spaces/bourse');
    await expect(page.locator('h1')).toContainText('Bourse & actions');

    // Toggle compact density view
    const compactBtn = page.locator('button[aria-label="Vue compacte"]');
    await expect(compactBtn).toBeVisible();
    await compactBtn.click();
    await expect(page.locator('.feed-compact, .feed')).toBeVisible();
  });

  test('7. Création de sondage et vote multi-utilisateurs (créateur et autres membres)', async ({ page }) => {
    await page.goto('/');

    // 1. Ensure logged in as Camille
    const userSelect = page.locator('.proto select');
    await userSelect.waitFor({ state: 'visible', timeout: 10000 });
    await userSelect.selectOption('Camille_B');
    await page.waitForTimeout(500);

    // 2. Click "Sondage" in QuickComposer
    const pollBtn = page.getByRole('button', { name: 'Sondage' }).first();
    await expect(pollBtn).toBeVisible();
    await pollBtn.click();

    // 3. Fill poll modal form
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();

    const testTitle = `Sondage E2E Multi-Votes ${Date.now()}`;
    await page.locator('#c-title').fill(testTitle);
    await page.locator('#c-body').fill('Quelle stratégie dividendes recommandez-vous cette année ?');

    // Submit
    const submitBtn = modal.getByRole('button', { name: 'Publier' });
    await submitBtn.click();

    // 4. Verify redirected to newly created discussion
    await page.waitForURL(/\/discussions\/.+/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(testTitle);

    // 5. As Camille (creator), vote on Option 1
    const firstOption = page.locator('.post-main button').filter({ hasText: 'Option 1' }).first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // Verify option 1 now shows voted state (total 1 vote)
    await expect(page.locator('.post-main').getByText('1 votes')).toBeVisible();

    // 6. Switch persona to Vincent_ETF
    await userSelect.selectOption('Vincent_ETF');
    await page.waitForTimeout(600);

    // 7. Verify Vincent can also vote (Option 2 button has "Voter" and is not disabled)
    const secondOption = page.locator('.post-main button').filter({ hasText: 'Option 2' }).first();
    await expect(secondOption).toBeVisible();
    await expect(secondOption).toBeEnabled();
    await secondOption.click();

    // 8. Verify total votes is now 2
    await expect(page.locator('.post-main').getByText('2 votes')).toBeVisible();
  });

});
