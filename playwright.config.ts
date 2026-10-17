import { defineConfig, devices } from "@playwright/test";

const GPU = ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4180",
    launchOptions: { args: GPU },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npx vite preview --port 4180 --strictPort", url: "http://localhost:4180", reuseExistingServer: true },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
});
