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
      <Route path="/about" element={<LegacyFramerPage htmlPath="/legacy/about.html" />} />
      <Route path="/blog" element={<LegacyFramerPage htmlPath="/legacy/blog.html" />} />
      <Route path="/contact" element={<LegacyFramerPage htmlPath="/legacy/contact.html" />} />
      <Route path="/404" element={<LegacyFramerPage htmlPath="/legacy/404.html" />} />

      {BLOG_SLUGS.map((slug) => (
        <Route
          key={slug}
          path={`/blog/${slug}`}
          element={<LegacyFramerPage htmlPath={`/legacy/blog/${slug}.html`} />}
        />
      ))}

      {BLOG_SLUGS.map((slug) => (
        <Route key={`${slug}-html`} path={`/blog/${slug}.html`} element={<Navigate to={`/blog/${slug}`} replace />} />
      ))}

      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/about.html" element={<Navigate to="/about" replace />} />
      <Route path="/blog.html" element={<Navigate to="/blog" replace />} />
      <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
      <Route path="/404.html" element={<Navigate to="/404" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}