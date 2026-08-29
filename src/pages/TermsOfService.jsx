import { Link } from "react-router-dom";
import { HiArrowLeft, HiDocumentCheck } from "react-icons/hi2";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import Container from "../components/UI/Container/Container";

export default function TermsOfService() {
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
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Terms of Service</span>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 sm:p-12 shadow-xl dark:shadow-2xl">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-4">
              <HiDocumentCheck size={28} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Service Agreement
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Last Updated: August 2026
            </p>

            <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using ResumeForge AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  2. Use of AI Services & Accuracy
                </h2>
                <p>
                  ResumeForge AI provides AI-assisted tools for resume and cover letter drafting. While our algorithms provide suggestions and formatting optimizations, users are solely responsible for reviewing and verifying the accuracy and authenticity of all information included in their resumes before submitting to employers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  3. Subscriptions, Credits & Billing
                </h2>
                <p>
                  Certain premium features (including advanced AI tokens, custom exports, and cover letter generation) require subscription plans or credits. All fees are billed in accordance with the selected plan at checkout.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  4. Intellectual Property
                </h2>
                <p>
                  You retain full ownership of all personal content and resume data you enter. ResumeForge AI and its templates, designs, and proprietary code remain the intellectual property of ResumeForge.
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
