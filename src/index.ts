import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics: traces the Tripwise Assistant's Anthropic calls. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "d565f638-db14-4a49-9274-368e39c88af2",
  agentId: "ZoCfmpljFANZyIOc_C0h5dCqnjc",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

/** Stops taking requests and sends Pendo's buffered events before the process exits. */
async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
