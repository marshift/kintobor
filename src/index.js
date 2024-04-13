import { createContext } from "@marshift/argus";
import { resolve, join } from "path";
import { readFileSync } from "fs";

import { getServerInfo, stripBadChars } from "./lib/upstream.js";
import { register, update, unlist } from "./lib/mserv.js";

const ctx = createContext(process.argv.slice(2));
const configPath = resolve(ctx.getOptionalArg(/-c|--config/) ?? join(process.cwd(), "kintobor.json"));
let config;

try {
    config = JSON.parse(readFileSync(configPath, "utf-8"));
} catch {
    console.error(`Failed to read or parse config file at ${configPath}`);
    process.exit(1);
}

console.log("attempting to reach upstream server...");
const upstreamInfo = await getServerInfo("127.0.0.1", config.port);

console.log("making master server request...");
const serverId = stripBadChars(await register(config.roomId, config.port, upstreamInfo.server_name, upstreamInfo.version));

console.log("establishing update interval...");
const updateInterval = setInterval(async () => {
    console.log("updating master server listing...");
    const { server_name } = await getServerInfo("127.0.0.1", config.port); // TODO: bad?
    await update(serverId, server_name);
}, 900000);

["SIGINT", "SIGQUIT", "SIGTERM"].forEach((e) => process.on(e, async () => {
    console.log("unlisting server - goodbye!");
    clearInterval(updateInterval);
    await unlist(serverId);
}));
