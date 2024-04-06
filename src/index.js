import { createContext } from "@marshift/argus";
import { resolve, join } from "path";
import { readFileSync } from "fs";

const ctx = createContext(process.argv.slice(2));
const configPath = resolve(ctx.getOptionalArg(/-c|--config/) ?? join(process.cwd(), "kintobor.json"));
let config;

try {
    config = JSON.parse(readFileSync(configPath, "utf-8"));
} catch {
    console.error(`Failed to read or parse config file at ${configPath}`);
    process.exit(1);
}

console.log(config);
