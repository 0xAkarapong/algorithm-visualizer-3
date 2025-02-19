import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

// Remove this import statemet
import config from "./fresh.config.ts";

// Replace following line with just: await start(manifest);
await start(manifest, config);