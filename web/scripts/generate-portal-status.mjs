import fs from "fs";
import path from "path";

const services = [
  {
    name: "With You",
    description: "记录时间的流逝，珍惜当下的每一刻。",
    url: "https://zc.nianshu2022.cn",
    icon: "https://zc.nianshu2022.cn/favicon.ico",
    iconKey: "clock",
    visibility: "public",
  },
  {
    name: "MoonTV",
    description: "私人影视媒体库，存储我喜爱的电影与剧集。",
    url: "https://mv.nianshu2022.cn",
    icon: "https://mv.nianshu2022.cn/favicon.ico",
    iconKey: "tv",
    visibility: "protected",
  },
  {
    name: "Nginx",
    description: "Nginx 管理面板，反向代理与负载均衡控制台。",
    url: "https://nginx.nianshu2022.cn",
    icon: "https://nginx.nianshu2022.cn/images/favicons/favicon.ico",
    iconKey: "server",
    visibility: "protected",
  },
];

const CHECK_TIMEOUT_MS = 8000;
const outputPath = path.join(process.cwd(), "public", "portal-status.json");

function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
}

async function checkService(service) {
  const started = Date.now();
  try {
    const response = await withTimeout(
      fetch(service.url, { method: "GET", redirect: "follow" }),
      CHECK_TIMEOUT_MS
    );
    const latencyMs = Date.now() - started;
    const statusCode = response.status;
    const ok = response.ok || [401, 403].includes(statusCode);
    const derivedStatus = ok
      ? service.visibility === "protected"
        ? "protected"
        : "online"
      : "degraded";

    return {
      ...service,
      check: {
        status: derivedStatus,
        statusCode,
        latencyMs,
        message: ok ? "reachable" : "unexpected_status",
      },
    };
  } catch (error) {
    return {
      ...service,
      check: {
        status: "offline",
        statusCode: null,
        latencyMs: null,
        message: error instanceof Error ? error.message : "request_failed",
      },
    };
  }
}

async function main() {
  const checkedServices = await Promise.all(services.map((service) => checkService(service)));
  const payload = {
    generatedAt: new Date().toISOString(),
    source: "build script probe",
    timeoutMs: CHECK_TIMEOUT_MS,
    services: checkedServices,
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`✅ Generated portal status: ${outputPath}`);
}

main().catch((error) => {
  console.error("❌ Failed to generate portal status:", error);
  process.exit(1);
});

