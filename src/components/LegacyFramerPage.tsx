import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type LegacyFramerPageProps = {
  htmlPath: string;
};

const PATH_REWRITES: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about",
  "blog.html": "/blog",
  "contact.html": "/contact",
  "404.html": "/404",
  "blog/5-must-have-ai-tools-to-streamline-your-business.html":
    "/blog/5-must-have-ai-tools-to-streamline-your-business",
  "blog/ai-vs-manual-work-which-one-saves-more-time-money.html":
    "/blog/ai-vs-manual-work-which-one-saves-more-time-money",
  "blog/how-ai-is-transforming-workflow-automation-for-businesses.html":
    "/blog/how-ai-is-transforming-workflow-automation-for-businesses",
  "blog/the-future-of-ai-automation-how-it-s-changing-business-operations.html":
    "/blog/the-future-of-ai-automation-how-it-s-changing-business-operations"
};

const HEAD_SELECTOR = [
  "meta[name='viewport']",
  "meta[name='description']",
  "meta[name='robots']",
  "meta[name='generator']",
  "meta[name='twitter:card']",
  "meta[name='twitter:title']",
  "meta[name='twitter:description']",
  "meta[name='twitter:image']",
  "meta[property='og:type']",
  "meta[property='og:title']",
  "meta[property='og:description']",
  "meta[property='og:image']",
  "meta[property='og:url']",
  "link[rel='canonical']",
  "link[rel='icon']",
  "link[rel='apple-touch-icon']",
  "link[rel='preconnect']",
  "link[rel='dns-prefetch']",
  "link[rel='stylesheet']",
  "style"
].join(",");

function cloneHeadNode(node: Element): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-legacy-injected", "true");
  return clone;
}

function copyScript(oldScript: HTMLScriptElement): HTMLScriptElement {
  const replacement = document.createElement("script");
  for (const attr of Array.from(oldScript.attributes)) {
    replacement.setAttribute(attr.name, attr.value);
  }
  replacement.text = oldScript.text;
  return replacement;
}

function normalizeHref(href: string): string {
  const trimmed = href.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:") || trimmed.startsWith("#")) {
    return trimmed;
  }

  const clean = trimmed.replace(/^\.?\//, "");
  return PATH_REWRITES[clean] ?? trimmed;
}

export function LegacyFramerPage({ htmlPath }: LegacyFramerPageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const headNodes: HTMLElement[] = [];
    const priorTitle = document.title;
    const priorBodyClass = document.body.className;
    const priorHtmlLang = document.documentElement.lang;
    let cancelled = false;

    async function renderLegacyPage() {
      const response = await fetch(htmlPath, { cache: "no-store" });
      if (!response.ok) {
        navigate("/404", { replace: true });
        return;
      }

      const html = await response.text();
      if (cancelled || !mountRef.current) {
        return;
      }

      const parsed = new DOMParser().parseFromString(html, "text/html");

      document.title = parsed.title || priorTitle;
      document.documentElement.lang = parsed.documentElement.lang || priorHtmlLang;
      document.body.className = parsed.body.className;

      for (const node of Array.from(parsed.head.querySelectorAll(HEAD_SELECTOR))) {
        const injected = cloneHeadNode(node);
        document.head.appendChild(injected);
        headNodes.push(injected);
      }

      const mount = mountRef.current;
      mount.innerHTML = parsed.body.innerHTML;

      for (const anchor of Array.from(mount.querySelectorAll("a[href]"))) {
        const rawHref = anchor.getAttribute("href");
        if (!rawHref) {
          continue;
        }

        const normalizedHref = normalizeHref(rawHref);
        if (normalizedHref !== rawHref) {
          anchor.setAttribute("href", normalizedHref);
        }

        if (normalizedHref.startsWith("/")) {
          anchor.addEventListener("click", (event) => {
            if (!(event instanceof MouseEvent)) {
              return;
            }
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
              return;
            }
            event.preventDefault();
            navigate(normalizedHref);
          });
        }
      }

      for (const script of Array.from(mount.querySelectorAll("script"))) {
        const replacement = copyScript(script);
        script.replaceWith(replacement);
      }
    }

    void renderLegacyPage();

    return () => {
      cancelled = true;
      for (const node of headNodes) {
        node.remove();
      }
      document.title = priorTitle;
      document.body.className = priorBodyClass;
      document.documentElement.lang = priorHtmlLang;
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [htmlPath, navigate]);

  return <div ref={mountRef} />;
}