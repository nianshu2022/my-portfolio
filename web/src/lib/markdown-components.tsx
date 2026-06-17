import type { Components } from "react-markdown";
import { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import Image from "next/image";
import CodeBlock from "@/components/ui/CodeBlock";

export function getSanitizeSchema(): Schema {
  return {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      "img", "table", "thead", "tbody", "tr", "th", "td", "br", "hr", "span", "div",
      "h1", "h2", "h3", "h4", "h5", "h6",
    ],
    attributes: {
      ...defaultSchema.attributes,
      img: ["src", "alt", "title", "width", "height", "style", "className"],
      "*": ["className", "id", "style"],
      h1: ["id", "className", "style"],
      h2: ["id", "className", "style"],
      h3: ["id", "className", "style"],
      h4: ["id", "className", "style"],
      h5: ["id", "className", "style"],
      h6: ["id", "className", "style"],
    },
  };
}

function proxyImage(src: string, opts?: { width?: number; quality?: number }): string {
  const { width = 1000, quality = 75 } = opts ?? {};
  if (!src.startsWith("http")) return src;
  try {
    const url = new URL(src);
    if (
      !url.hostname.includes("wsrv.nl") &&
      !url.hostname.includes("nianshu2022.cn")
    ) {
      return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality}&output=webp`;
    }
  } catch {
    // invalid URL
  }
  return src;
}

export function getMarkdownComponents(opts?: { imageWidth?: number; imageQuality?: number }): Components {
  const { imageWidth = 1000, imageQuality = 75 } = opts ?? {};

  return {
    img: (props) => {
      const src = (props.src as string) || "";
      let imageSrc = src;

      try {
        const url = new URL(src, "http://dummy.com");
        const protocol = url.protocol;
        if (!["http:", "https:", "data:"].includes(protocol)) {
          return <span className="text-red-500">[无效的图片链接]</span>;
        }
        if (protocol === "data:" && src.length > 10000) {
          return <span className="text-red-500">[图片过大]</span>;
        }
      } catch {
        return <span className="text-red-500">[无效的URL]</span>;
      }

      const style: React.CSSProperties = {
        width: "100%",
        maxWidth: "560px",
        height: "auto",
        borderRadius: "8px",
        backgroundColor: "transparent",
        verticalAlign: "top",
      };
      let className = "rounded-lg block mx-auto";

      try {
        const url = new URL(src, "http://dummy.com");
        const widthParam = url.searchParams.get("width") || url.searchParams.get("w");
        const shadow = url.searchParams.get("shadow");

        if (widthParam) {
          const widthValue = parseInt(widthParam);
          if (isNaN(widthValue) || widthValue < 1 || widthValue > 2000) {
            style.width = "100%";
          } else {
            style.width = `${widthValue}px`;
          }
          style.maxWidth = "100%";
          className += " mb-6 sm:inline-block sm:mx-0 sm:mb-4 sm:mr-8";
        }

        if (shadow === "true" || shadow === "1") {
          style.filter = "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))";
        }

        imageSrc = proxyImage(src, { width: imageWidth, quality: imageQuality });
      } catch {
        // ignore
      }

      const alt = typeof props.alt === "string" ? props.alt : "";
      const title = typeof props.title === "string" ? props.title : undefined;

      return (
        <Image
          src={imageSrc}
          alt={alt}
          title={title}
          width={imageWidth}
          height={Math.round(imageWidth * 0.625)}
          style={style}
          className={className}
          referrerPolicy="no-referrer"
          loading="lazy"
          unoptimized
        />
      );
    },
    table: (props) => (
      <div className="overflow-x-auto my-8 custom-scrollbar rounded-xl border border-border shadow-sm">
        <table
          {...props}
          className="min-w-full divide-y divide-border border-collapse"
        />
      </div>
    ),
    thead: (props) => (
      <thead {...props} className="bg-secondary/50" />
    ),
    th: (props) => (
      <th
        {...props}
        className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border"
      />
    ),
    td: (props) => (
      <td
        {...props}
        className="px-4 py-3 text-sm text-muted-foreground border-b border-border/50"
      />
    ),
    pre: (props) => <CodeBlock {...props} />,
  };
}
