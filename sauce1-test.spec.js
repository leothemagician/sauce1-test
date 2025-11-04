import {test, expect} from "@playwright/test";

  const locators = {

    username: "input[data-test='username']",
    password: "input[data-test='password']",
    login: "input[data-test='login-button']",
    productsTitle: "span[data-test='title']",
    shopingcart: "span[data-test='shopping-cart-badge']",
    cartlink: ".shopping_cart_link",
    slbackpack: "button[data-test='add-to-cart-sauce-labs-backpack']",
    rmvBackpack: "button[data-test='remove-sauce-labs-backpack']",
    slbikelight: "button[data-test='add-to-cart-sauce-labs-bike-light']",
    slbolt: "button[data-test='add-to-cart-sauce-labs-bolt-t-shirt']",
    cartItemPrices: "div[data-test='inventory-item-price']",
    firstname: "input[data-test='firstName']",
    lastname: "input[data-test='lastName']",
    postalcode: "input[data-test='postalCode']",
    inventory: "div[data-test='inventory-item-name']",
    thankyou: "h2[data-test='complete-header']",
    productsort: "select",

}

test.describe("Sauce1-test", () => {
  
  //Task 1 — Login + verify user landed (quick sanity)
  // Siguro që login funksionon (ky është prerequisite për të tjerat).
  // Hapat:
  // Hape faqen
  // Mbush username dhe password
  // Kliko Login
  // Verifiko URL /inventory.html dhe tekstin .title == 'Products'
  
    //Testi qe do te perdoret nese nevojitet nje login
  test.beforeEach(async ({page}) => {
    await page.pause();
    await page.goto("https://www.saucedemo.com/");
    await page.locator(locators.username).fill("standard_user");
    await page.locator(locators.password).fill("secret_sauce");
    await page.locator(locators.login).click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(locators.productsTitle)).toHaveText("Products");
})

// Task 2 — Shto 2 produkte në cart + verifiko përmbajtjen e cart
// Qëllimi: Verifiko që produktet e shtuara shfaqen në icon-in e cart dhe në faqe.
// Hapat:
// Bëj login (task 1).
// Shto sauce-labs-backpack dhe sauce-labs-bike-light në cart.
// Kliko ikonën e cart (a.shopping_cart_link).
// Verifiko që në /cart.html të shfaqen dy itemët me emrat e saktë dhe çmimet.

  test("Add to cart", async ({page}) => {
    await page.locator(locators.slbackpack).click();
    await page.locator(locators.slbikelight).click();
    await expect(page.locator(locators.shopingcart)).toHaveText("2");
    await page.locator(locators.shopingcart).click();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await expect(page.getByText("Sauce Labs Backpack")).toBeVisible();
    await expect(page.getByText("Sauce Labs Bike Light")).toBeVisible();
    const prices = await page.locator(locators.cartItemPrices).allTextContents();
    expect(prices).toContain('$29.99');
    expect(prices).toContain('$9.99');
  })

// Task 3 — Checkout flow (finish order)
// Qëllimi: Përfundo procesin e blerjes dhe verifiko faqen e konfirmimit.
// Hapat:
// Nga /cart.html klik Checkout (button[data-test='checkout']).
// Mbush First Name, Last Name, Postal Code në /checkout-step-one.html. (locatorët: input[data-test='firstName'] etj.)
// Klik Continue, verifiko produktet në checkout-step-two.html.
// Klik Finish. Verifiko që /checkout-complete.html përmban tekstin THANK YOU FOR YOUR ORDER.

  test("Finish Order", async ({page}) => {
    await page.locator(locators.slbackpack).click();
    await page.locator(locators.slbikelight).click();
    await page.locator(locators.shopingcart).click();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await page.locator("button[data-test='checkout']").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
    await page.locator(locators.firstname).fill("Leonard");
    await page.locator(locators.lastname).fill("Mustafa");
    await page.locator(locators.postalcode).fill("12500");
    await page.locator("input[data-test='continue']").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
    const products = await page.locator(locators.inventory).allTextContents();
    expect(products).toContain("Sauce Labs Backpack");
    expect(products).toContain("Sauce Labs Bike Light");
    await page.locator("button[data-test='finish']").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
    const finish = page.locator(locators.thankyou)
    await expect(finish).toHaveText("Thank you for your order!")
  })

// Task 4 — Remove one item during checkout and verify totals (advanced)
// Qëllimi: Shto 3 produkte, fshij një para finish, dhe verifiko që total (nëse faqja ka total) 
// apo numri i artikujve reflekton ndryshimin.
// Hapat:
// Shto 3 produkte.
// Shko /cart.html dhe hiq një produkt (button[data-test='remove-...']).
// Verifiko që badge-i është reduktuar dhe që lista në cart ka një item më pak.
// Nota: Saucedemo nuk ka total i qartë detajuar, por numeri i artikujve duhet të jetë i saktë. 
// Përdor .cart_item count.
// Shembull për count:
// const items = await page.locator('.cart_item').count();
// expect(items).toBe(2); // pasi ke hequr një  

test("Remove one item during Checkout", async ({page}) => {
  await page.locator(locators.slbackpack).click();
  await page.locator(locators.slbikelight).click();
  await page.locator(locators.slbolt).click();
  await expect(page.locator(locators.shopingcart)).toHaveText("3");
  await page.locator(locators.cartlink).click();
  await expect(page).toHaveURL(/cart.html/);
  await page.locator(locators.rmvBackpack).click();
  await expect(page.locator(locators.shopingcart)).toHaveText("2");
  const items = await page.locator(locators.inventory).count();
  expect(items).toBe(2);
})

// Task 5 — Filter + visual snapshot (visual regression)
// Qëllimi: Testo filterin (low→high) dhe kap një screenshot të faqes të filtruar për krahasim vizual.
// Hapat:
// Login.
// select[data-test='product-sort-container'] → selectOption('lohi').
// Pris që rreshti i parë të ketë çmimin më të vogël.
// Bëj await page.screenshot({ path: 'filtered.png', fullPage: true }) dhe ruaje për reference.
// Shembull:
// await page.locator("select[data-test='product-sort-container']").selectOption('lohi');
// const prices = (await page.locator('.inventory_item_price').allTextContents()).map(t => parseFloat(t.replace('$','')));
// for (let i=1;i<prices.length;i++) expect(prices[i]).toBeGreaterThanOrEqual(prices[i-1]);
// await page.screenshot({ path: 'lohi.png', fullPage: true });

test("Filter,screenshot", async ({page}) => {
  await page.locator("select[data-test='product-sort-container']").selectOption("lohi");
  const prices = (await page.locator(locators.inventory).allTextContents()).map(t => parseFloat(t.replace('$', '').trim()));
  for (let i=1;i<prices.length;i++) expect(prices[i]).toBeGreaterThanOrEqual(prices[i-1]);
  await page.screenshot({path: 'lohi.png', fullPage: true});
  await expect(page).toHaveURL(/inventory.html/);
})

// Task 6 — Accessibility quick check (axe)
// Qëllimi: Bëj një kontroll të shpejtë accessibility me playwright-axe. (opsionale)
// Hapat:
// Instalo npm i --save-dev playwright-axe (ose shiko alternative)
// Inject dhe run checkA11y(page) dhe verifiko se nuk ka critical issues.
// Shembull i thjeshtë:
// import { injectAxe, checkA11y } from 'playwright-axe';
// await injectAxe(page);
// await checkA11y(page);
// Si do ta praktikosh (propozim rrjedhe)
// Bëj Task 1 dhe sigurohet që kalon. Kopjo kodin dhe më dërgo këtu — unë ta kontrolloj.
// Pastaj bëj Task 2 dhe përsëri dërgo kodin, unë jap feedback dhe rregullime.
// Vazhdon me Task 3…6 në të njëjtën mënyrë.
// Kur të gjithë testet kalojnë lokalisht, i vendos në repo, bësh git add/commit/push. 
// Unë të jap përmbajtjen e workflow .github/workflows/playwright-ci.yml (që kemi bërë) 
// dhe të ndihmoj me secrets/screenshot artifacts në GitHub.

})


