import { Navigate, Route, Routes } from "react-router-dom";
import { LegacyFramerPage } from "./components/LegacyFramerPage";

const BLOG_SLUGS = [
  "5-must-have-ai-tools-to-streamline-your-business",
  "ai-vs-manual-work-which-one-saves-more-time-money",
  "how-ai-is-transforming-workflow-automation-for-businesses",
  "the-future-of-ai-automation-how-it-s-changing-business-operations"
] as const;

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LegacyFramerPage htmlPath="/legacy/index.html" />} />
      <Route path="/index.html" element={<LegacyFramerPage htmlPath="/legacy/index.html" />} />

      <Route path="/about" element={<LegacyFramerPage htmlPath="/legacy/about.html" />} />
      <Route path="/about.html" element={<LegacyFramerPage htmlPath="/legacy/about.html" />} />

      <Route path="/blog" element={<LegacyFramerPage htmlPath="/legacy/blog.html" />} />
      <Route path="/blog.html" element={<LegacyFramerPage htmlPath="/legacy/blog.html" />} />

      <Route path="/contact" element={<LegacyFramerPage htmlPath="/legacy/contact.html" />} />
      <Route path="/contact.html" element={<LegacyFramerPage htmlPath="/legacy/contact.html" />} />

      <Route path="/404" element={<LegacyFramerPage htmlPath="/legacy/404.html" />} />
      <Route path="/404.html" element={<LegacyFramerPage htmlPath="/legacy/404.html" />} />

      {BLOG_SLUGS.map((slug) => (
        <Route
          key={slug}
          path={`/blog/${slug}`}
          element={<LegacyFramerPage htmlPath={`/legacy/blog/${slug}.html`} />}
        />
      ))}

      {BLOG_SLUGS.map((slug) => (
        <Route
          key={`${slug}-html`}
          path={`/blog/${slug}.html`}
          element={<LegacyFramerPage htmlPath={`/legacy/blog/${slug}.html`} />}
        />
      ))}

      <Route path="*" element={<Navigate to="/404.html" replace />} />
    </Routes>
  );
}
