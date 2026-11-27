const assert = require("node:assert/strict");
const { chromium } = require(process.env.CMS_TEST_PLAYWRIGHT || "playwright-core");
const base = new URL(process.env.OPS_TEST_URL || "http://localhost:4440");
assert.equal(base.hostname, "localhost");

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CMS_TEST_BROWSER });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    const go = path => page.goto(new URL(path, base).href, { waitUntil: "domcontentloaded" });
    const button = name => page.getByRole("button", { name, exact: true });
    const marker = String(Date.now());
    async function add(area, noun, values) {
      await go("/admin/operations/" + area);
      const create = button("New " + noun);
      const form = page.locator("form");
      for (let attempt = 0; attempt < 3 && !(await form.isVisible()); attempt++) {
        await create.press("Enter");
        await form.waitFor({timeout:3000}).catch(() => {});
      }
      for (const [name, value] of Object.entries(values)) {
        const field = page.locator("form label").filter({ has: page.getByText(name, { exact: true }) }).locator("input, textarea, select");
        if (typeof value === "number") await field.selectOption({ index: value });
        else await field.fill(value);
      }
      await button("Save record").click();
      await page.getByRole("status").filter({ hasText: "Record created." }).waitFor();
      console.log(area + " passed");
    }
    await go("/admin/login");
    const response = await page.request.post(new URL("/api/admin/sign-in", base).href, {
      headers: { Origin: base.origin }, data: { email: process.env.OPS_TEST_EMAIL, password: process.env.OPS_TEST_PASSWORD, rememberMe: false },
    });
    const session = await response.json();
    assert.equal(session.success, true, session.message);
    await go("/admin");
    await page.getByRole("heading", { name: "Staff workspaces" }).waitFor();
    await add("students", "student", { "Full name": "Student " + marker, Email: marker + "@example.invalid" });
    await add("trainers", "trainer", { "Full name": "Trainer " + marker, "Work email": marker + "@example.invalid", Specialty: "Analytics" });
    await add("enrolments", "enrolment", { Student: 1, "Course batch": 1 });
    await add("assignments", "assignment", { Trainer: 1, "Course batch": 1 });
    await add("jobs", "job", { "Job title": "Analyst " + marker, Company: "Test employer", Description: "Test opening" });
    await add("applications", "application", { Student: 1, "Job opening": 1, Status: 2 });
    await add("placements", "placement", { "Offered application": 1, "Placement date": "2026-11-23" });
    await add("payments", "payment", { Enrolment: 1, "Amount (INR)": "5000", "Payment reference": marker, "Payment date": "2026-11-23" });
    await add("notifications", "announcement", { Subject: "Notice " + marker, Message: "Test notification" });
    await button("Mark read").first().click();
    await button("Mark unread").first().waitFor();
    await go("/admin/operations/reports");
    await page.getByText("Recorded payments", { exact: true }).waitFor();
    for (const [route, heading] of [["courses", /Course/i], ["counselors", "Users & Roles"], ["settings", /Settings/i]]) {
      await go("/admin/" + route);
      await page.getByRole("heading", { name: heading }).first().waitFor();
    }
    console.log("Admin operations browser tests passed.");
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
