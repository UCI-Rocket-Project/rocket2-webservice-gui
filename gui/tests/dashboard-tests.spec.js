// @ts-check
const {test, expect} = require("@playwright/test");

test("Check for panels", async ({page}) => {
    await page.goto("/");
    const gsePanel = await page.getByTestId("gsePanel");
    await expect(gsePanel).toBeVisible();
    const ecuPanel = await page.getByTestId("ecuPanel");
    await expect(ecuPanel).toBeVisible();
});

test("Check keylock", async ({page}) => {
    await page.goto("/");

    const gn2Switch = await page.getByTestId("switch Gn2Vent");
    const ariaDisabled = await gn2Switch.getAttribute("aria-disabled");
    expect(ariaDisabled).toBe("true");

    await page.keyboard.down("Control");
    const ariaDisabled2 = await gn2Switch.getAttribute("aria-disabled");
    expect(ariaDisabled2).toBeNull();

    await page.keyboard.up("Control");
    const ariaDisabled3 = await gn2Switch.getAttribute("aria-disabled");
    expect(ariaDisabled3).toBe("true");
});
