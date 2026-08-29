import { Link } from "react-router-dom";
import { HiArrowLeft, HiShieldCheck } from "react-icons/hi2";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Container from "../components/UI/Container/Container";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition flex items-center gap-1">
              <HiArrowLeft size={16} /> Home
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">Privacy Policy</span>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center gap-3 text-blue-400 mb-4">
              <HiShieldCheck size={28} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Data Protection & Trust
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-slate-400">
              Last Updated: August 2026
            </p>

            <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-300">
              <section>
                <h2 className="text-xl font-bold text-white mb-2">
                  1. Information We Collect
                </h2>
                <p>
                  ResumeForge AI collects information you provide directly to us when creating an account, generating resumes, and purchasing subscription plans. This includes your name, email address, contact information, work experience, educational background, skills, and optional profile photos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-2">
                  2. How We Use Your Information
                </h2>
                <p>
                  We use the information we collect strictly to deliver and improve our resume building services, provide AI generation capabilities, scan resumes for ATS compatibility, process payments securely, and offer customer support. We never sell your personal data or resume content to third-party data brokers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-2">
                  3. AI Processing & Data Confidentiality
                </h2>
                <p>
                  Your resume text is processed through encrypted AI endpoints solely for the purpose of generating summaries, optimizing bullet points, and checking ATS compatibility. Your content is not used to train public language models without your consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-2">
                  4. Data Security & Storage
                </h2>
                <p>
                  All account credentials, user resumes, and profile assets are securely stored and encrypted at rest and in transit using enterprise-grade cloud security infrastructure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-2">
                  5. Contact Us
                </h2>
                <p>
                  If you have questions regarding this Privacy Policy or your personal data, please reach out through our{" "}
                  <Link to="/contact" className="text-blue-400 hover:underline">
                    Contact Support Page
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
