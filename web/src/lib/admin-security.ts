const SUSPICIOUS_RULES = [
  { label: "JNDI 探测", pattern: /\b(?:jndi|ldap|rmi|dns|iiop|nis|corba):\/\//i },
  { label: "模板注入", pattern: /\$\{[^}]{0,160}(?:jndi|hostName|env|sys|lower|upper|::-)/i },
  { label: "脚本注入", pattern: /<\s*\/?\s*(?:script|iframe|img|svg|body|style|object|embed)\b/i },
  { label: "事件注入", pattern: /\bon[a-z]+\s*=/i },
  { label: "危险协议", pattern: /\bjavascript\s*:/i },
  { label: "SQL 探测", pattern: /\b(?:union\s+select|or\s+1\s*=\s*1|drop\s+table|sleep\s*\()/i },
  { label: "路径探测", pattern: /(?:\.\.\/|\.\.\\|\/etc\/passwd|cmd\.exe|powershell)/i },
];

export function analyzeSuspiciousText(...values: Array<string | number | null | undefined>) {
  const source = values
    .filter((value) => value !== null && value !== undefined)
    .map(String)
    .join(" ");

  const labels = SUSPICIOUS_RULES
    .filter((rule) => rule.pattern.test(source))
    .map((rule) => rule.label);

  return {
    flagged: labels.length > 0,
    labels: Array.from(new Set(labels)),
  };
}

export function compactUntrustedText(value: string | null | undefined, maxLength = 120) {
  const text = (value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
