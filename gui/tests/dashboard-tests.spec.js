// @ts-check
const {test, expect} = require("@playwright/test");

const continualCheck = async (page, func, comp, timeout = 1000) => {
    let acc = 0;
    let result = null;
    while (acc < 10) {
        acc += 1;
        result = await func();
        if (result === comp) {
            break;
        }
        await page.waitForTimeout(timeout / 10);
    }
    expect(result).toEqual(comp);
};

test("Check for panels", async ({page}) => {
    await page.goto("/");
    const gsePanel = await page.getByTestId("gsePanel");
    await expect(gsePanel).toBeVisible();
    const ecuPanel = await page.getByTestId("ecuPanel");
    await expect(ecuPanel).toBeVisible();
});

test("Check keylock", async ({page}) => {
    await page.goto("/");

    const gn2Switch = await page.getByTestId("switch GN2 Vent");
    const ariaDisabled = await gn2Switch.getAttribute("aria-disabled");
    expect(ariaDisabled).toBe("true");

    await page.keyboard.down("Control");
    const ariaDisabled2 = await gn2Switch.getAttribute("aria-disabled");
    expect(ariaDisabled2).toBeNull();

    await page.keyboard.up("Control");
    const ariaDisabled3 = await gn2Switch.getAttribute("aria-disabled");
    expect(ariaDisabled3).toBe("true");
});

test("check switch", async ({page}) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    const gn2Switch = await page.getByTestId("switch GN2 Vent");
    await page.keyboard.down("Control");
    await gn2Switch.click({force: true});
    await page.waitForTimeout(1000);

    // Check to make sure the actual switch switched
    await continualCheck(page, async () => await gn2Switch.evaluate((el) => el.classList.contains("Mui-checked")), true);

    // Check to see if feedback opens
    const openIndicator = await page.getByTestId("status GN2 Vent");
    const imgElement = await openIndicator.locator('[role="img"]');
    await continualCheck(page, async () => await imgElement.getAttribute("type"), "available");

    // Close and check to see if feedback closes
    await gn2Switch.click({force: true});
    await page.waitForTimeout(1000);
    await continualCheck(page, async () => await imgElement.getAttribute("type"), "offline");

    await page.keyboard.up("Control");
});
