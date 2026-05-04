import { networkInterfaces } from "os";
import { spawnSync } from "child_process";

const args = process.argv.slice(2);
const portIdx = Math.max(args.indexOf("-p"), args.indexOf("--port"));
const port = portIdx !== -1 && args[portIdx + 1] ? args[portIdx + 1] : "3000";

const nets = networkInterfaces();
const ips = [];
for (const iface of Object.values(nets)) {
  for (const info of iface) {
    if (info.family === "IPv4" && !info.internal) {
      ips.push(info.address);
    }
  }
}

console.log();
console.log(`  Local:   http://localhost:${port}`);
for (const ip of ips) {
  console.log(`  Network: http://${ip}:${port}`);
}
console.log();

spawnSync("npx", ["next", "dev", ...args], { stdio: "inherit", shell: true });
