import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiEnvelope,
  HiChatBubbleLeftRight,
  HiSparkles,
  HiCheckCircle,
  HiQuestionMarkCircle,
} from "react-icons/hi2";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Container from "../components/UI/Container/Container";
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1">
              <HiArrowLeft size={16} /> Home
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Contact Support</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
            {/* Left Column: Contact Info & Quick FAQ */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                  <HiChatBubbleLeftRight size={14} /> Get in Touch
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  We're Here to Help
                </h1>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Have a question about AI generation, ATS optimization, billing, or custom templates? Reach out and our team will get back to you promptly.
                </p>
              </div>

              {/* Direct Support Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    <HiEnvelope size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Support Email</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">support@resumeforge.ai</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                    <HiSparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Response Time</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Usually under 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Help & FAQ Shortcut */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
                  <HiQuestionMarkCircle className="text-blue-600 dark:text-blue-400" size={18} />
                  Looking for quick answers?
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Check out our interactive FAQ section on the home page or browse our detailed career guides.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/#faq"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View FAQs →
                  </Link>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <Link
                    to="/blog"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Browse Blog →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-8 sm:p-10 shadow-xl dark:shadow-2xl">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                      <HiCheckCircle size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Received!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting us, {formData.name || "there"}. We have received your inquiry and will follow up with you at <strong className="text-blue-600 dark:text-blue-400">{formData.email}</strong> soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData((prev) => ({ ...prev, message: "" }));
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send us a Message</h3>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@company.com"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Subject / Topic
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="AI Resume Assistance">AI Resume Assistance</option>
                        <option value="ATS Optimizer Question">ATS Optimizer Question</option>
                        <option value="Billing & Plans">Billing & Plans</option>
                        <option value="Feature Request">Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you today?"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? "Sending Message..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
