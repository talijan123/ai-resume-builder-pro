import { useParams, Link, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiClock,
  HiCalendarDays,
  HiSparkles,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi2";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";

import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Container from "../components/UI/Container/Container";
import { blogPosts } from "../data/blogPosts";
import { useAuth } from "../context/AuthContext";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const post = blogPosts.find((p) => p.slug === slug);

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  function handleBuildResume() {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate(`/register?redirect=/blog/${slug}`);
    }
  }

  function handleShare(platform) {
    const url = window.location.href;
    const text = post?.title || "Check out this resume guide";
    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <Container>
            <div className="text-center max-w-lg mx-auto">
              <h1 className="text-4xl font-black text-white">Article Not Found</h1>
              <p className="mt-4 text-slate-400">
                The career guide or article you are looking for does not exist or has been moved.
              </p>
              <Link
                to="/blog"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
              >
                <HiArrowLeft /> Back to All Articles
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-blue-400 transition">
              Blog & Guides
            </Link>
            <span>/</span>
            <span className="text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {post.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider mb-5">
              {post.category}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            {/* Author & Meta Row */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3 text-left">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-slate-700"
                />
                <div>
                  <p className="font-bold text-white text-sm">{post.author.name}</p>
                  <p className="text-slate-400">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <HiCalendarDays size={16} className="text-blue-400" />
                  {post.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <HiClock size={16} className="text-blue-400" />
                  {post.readTime}
                </span>

                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleShare("twitter")}
                    aria-label="Share on X"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <FaXTwitter size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("linkedin")}
                    aria-label="Share on LinkedIn"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <FaLinkedin size={15} />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Cover Image */}
          <div className="max-w-4xl mx-auto mb-12 overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[460px] object-cover"
            />
          </div>

          {/* Article Main Body */}
          <article className="max-w-3xl mx-auto prose prose-invert prose-slate prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-p:leading-8 prose-li:text-slate-300 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-900/80 prose-blockquote:p-4 prose-blockquote:rounded-xl">
            <div className="space-y-6 text-slate-300 leading-8 text-base">
              {post.content.split("\n\n").map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith("## ")) {
                  return (
                    <h2
                      key={idx}
                      className="text-2xl sm:text-3xl font-black text-white mt-10 mb-4 pt-4 border-t border-slate-800/80"
                    >
                      {trimmed.replace("## ", "")}
                    </h2>
                  );
                }

                if (trimmed.startsWith("### ")) {
                  return (
                    <h3
                      key={idx}
                      className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 text-blue-300"
                    >
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }

                if (trimmed.startsWith("> ")) {
                  return (
                    <blockquote
                      key={idx}
                      className="my-6 rounded-2xl border-l-4 border-blue-500 bg-slate-900/90 p-5 italic text-slate-200 shadow-inner"
                    >
                      {trimmed.replace(/^>\s*/gm, "")}
                    </blockquote>
                  );
                }

                if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
                  const items = trimmed.split("\n").filter(Boolean);
                  return (
                    <ul key={idx} className="my-4 space-y-2.5 pl-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                          <span className="text-slate-300">
                            {item.replace(/^-\s*|^\d+\.\s*/, "")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (trimmed.startsWith("---")) {
                  return <hr key={idx} className="my-8 border-slate-800" />;
                }

                return (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Bottom In-Article Interactive CTA */}
          <div className="max-w-3xl mx-auto my-16 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950 border border-blue-500/30 p-8 sm:p-10 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
              <HiSparkles size={28} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Create an ATS-Optimized Resume in 5 Minutes
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Put these strategies into practice with ResumeForge AI's guided builder, ATS scanner, and modern templates.
            </p>
            <button
              type="button"
              onClick={handleBuildResume}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:-translate-y-0.5"
            >
              {user ? "Go to Dashboard" : "Start Building Your Resume Free"}{" "}
              <HiArrowRight size={16} />
            </button>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="max-w-5xl mx-auto mt-20 pt-12 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white mb-8">
                Recommended Career Guides
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id}
                    to={`/blog/${rPost.slug}`}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-blue-500/40 hover:bg-slate-900 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                        {rPost.category}
                      </span>
                      <h4 className="mt-2 text-sm font-bold text-white group-hover:text-blue-300 transition line-clamp-2">
                        {rPost.title}
                      </h4>
                    </div>
                    <p className="mt-4 text-xs font-semibold text-slate-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Guide <HiArrowRight size={12} />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
