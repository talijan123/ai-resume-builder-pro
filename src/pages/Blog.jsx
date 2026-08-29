import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMagnifyingGlass,
  HiArrowRight,
  HiClock,
  HiCalendarDays,
  HiSparkles,
  HiArrowLeft,
  HiBookOpen,
} from "react-icons/hi2";

import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Container from "../components/UI/Container/Container";
import { blogPosts } from "../data/blogPosts";
import { useAuth } from "../context/AuthContext";

const categories = [
  "All",
  "AI Resume",
  "ATS Secrets",
  "Career Advice",
  "Design & Templates",
];

export default function Blog() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];

  function handleBuildResume() {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link
              to="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1"
            >
              <HiArrowLeft size={16} /> Home
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Blog & Guides
            </span>
          </div>

          {/* Hero Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              <HiSparkles size={14} /> ResumeForge Career Hub
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Insights, ATS Guides & Career Advice
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Expert articles, data-backed resume optimization tactics, and actionable guides to help you land your dream job faster.
            </p>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <HiMagnifyingGlass
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search articles, keywords, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                      active
                        ? "bg-blue-600 text-white shadow-blue-500/20"
                        : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Article Banner (shown when no search query and category is 'All') */}
          {!searchQuery && selectedCategory === "All" && featuredPost && (
            <div className="mb-16">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3 block">
                Featured Article
              </span>
              <div className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl dark:shadow-2xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-2xl dark:hover:shadow-blue-500/10">
                <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-300">
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <HiClock size={14} /> {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      <Link to={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                      {featuredPost.excerpt}
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {featuredPost.author.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {featuredPost.publishedAt}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 shadow-md shadow-blue-600/20"
                      >
                        Read Article <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="h-64 sm:h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HiBookOpen className="text-blue-600 dark:text-blue-500" />
                {selectedCategory === "All"
                  ? "Latest Guides & Articles"
                  : `${selectedCategory} Articles`}
              </h2>
              <span className="text-xs text-slate-500">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-xl dark:hover:shadow-blue-500/10"
                  >
                    {/* Cover Thumbnail */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="relative block h-48 overflow-hidden bg-slate-100 dark:bg-slate-800"
                    >
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-300 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                        {post.category}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <HiCalendarDays size={14} /> {post.publishedAt}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <HiClock size={14} /> {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white transition group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {post.author.name}
                          </span>
                        </div>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          Read <HiArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center shadow-sm">
                <p className="text-base text-slate-600 dark:text-slate-400">
                  No articles found matching "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* Bottom Career CTA Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 p-8 sm:p-12 text-center text-white shadow-2xl">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Put These Insights Into Action?
            </h3>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Create an ATS-optimized, high-converting resume tailored to your dream job in under 5 minutes with AI.
            </p>
            <button
              type="button"
              onClick={handleBuildResume}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-xl transition hover:scale-105 cursor-pointer"
            >
              {user ? "Go to Dashboard" : "Build Your Resume Free"} <HiArrowRight size={16} />
            </button>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
