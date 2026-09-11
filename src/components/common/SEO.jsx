import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://ai-resume-builder-pro-five.vercel.app";
const DEFAULT_TITLE = "ResumeForge - Free AI Resume Builder & ATS CV Maker";
const DEFAULT_DESCRIPTION =
  "Create ATS-friendly, professional resumes and cover letters in minutes with ResumeForge AI. Real-time ATS score checker, AI bullet optimization, and free modern templates.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * Utility to set or create a <meta> tag
 */
function setMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Utility to set or create a <link rel="canonical"> tag
 */
function setCanonicalTag(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Dynamic SEO & Head Management Component
 */
export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  schema,
  article,
}) {
  const location = useLocation();
  const currentUrl = canonicalUrl || `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // 2. Standard Meta
    setMetaTag("name", "title", title);
    setMetaTag("name", "description", description);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }

    // 3. Canonical URL
    setCanonicalTag(currentUrl);

    // 4. OpenGraph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:site_name", "ResumeForge AI");

    // 5. Twitter Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);
    setMetaTag("name", "twitter:url", currentUrl);

    // 6. Article Meta (if applicable)
    if (article) {
      if (article.publishedTime) {
        setMetaTag("property", "article:published_time", article.publishedTime);
      }
      if (article.author) {
        setMetaTag("property", "article:author", article.author);
      }
      if (article.section) {
        setMetaTag("property", "article:section", article.section);
      }
      if (Array.isArray(article.tags)) {
        article.tags.forEach((tag) => setMetaTag("property", "article:tag", tag));
      }
    }

    // 7. Dynamic JSON-LD Schema
    const scriptId = "dynamic-seo-schema";
    let existingScript = document.getElementById(scriptId);

    if (schema) {
      if (!existingScript) {
        existingScript = document.createElement("script");
        existingScript.id = scriptId;
        existingScript.type = "application/ld+json";
        document.head.appendChild(existingScript);
      }
      existingScript.textContent =
        typeof schema === "string" ? schema : JSON.stringify(schema);
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      // Clean up dynamic schema when unmounting if appropriate
      const script = document.getElementById(scriptId);
      if (script) {
        script.remove();
      }
    };
  }, [
    title,
    description,
    keywords,
    currentUrl,
    ogType,
    ogImage,
    schema,
    article,
  ]);

  return null;
}
