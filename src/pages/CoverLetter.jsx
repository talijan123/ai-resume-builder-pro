import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiCheck, HiLockClosed, HiSparkles } from "react-icons/hi2";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";

import DashboardHeader from "../components/layout/DashboardHeader";
import CoverLetterEditor from "../components/coverLetter/CoverLetterEditor";
import CoverLetterPaper from "../components/coverLetter/CoverLetterPaper";
import CoverLetterTemplates from "../components/coverLetter/CoverLetterTemplates";
import { useCoverLetter } from "../context/CoverLetterContext";
import { usePricing } from "../context/PricingContext";
import { useProfile } from "../context/ProfileContext";

export default function CoverLetter() {
  const { planSlug, planName, loading: pricingLoading } = usePricing();
  const { profileData, loading: profileLoading } = useProfile();
  const { id } = useParams();
  const {
    coverLetterData,
    updateLetter,
    loadCoverLetter,
    createCoverLetter,
  } = useCoverLetter();
  const [loadingLetter, setLoadingLetter] = useState(Boolean(id));
  const autoPrefillDone = useRef(false);
  const coverLetterRef = useRef(null);
  const profile = useMemo(() => profileData?.profile || {}, [profileData?.profile]);
  const contact = useMemo(() => profileData?.contact || {}, [profileData?.contact]);
  const hasAccess = planSlug === "pro" || planSlug === "team";
  const { letter, selectedTemplate } = coverLetterData;
  const resumeData = {
    personalInfo: { ...profile, ...contact },
    experience: profileData?.experience || [],
    education: profileData?.education || [],
    skills: profileData?.skills || [],
    projects: profileData?.projects || [],
    certifications: profileData?.certifications || [],
  };

  useEffect(() => {
    let mounted = true;

    if (profileLoading || pricingLoading) {
      return;
    }

    if (!id) {
      if (!autoPrefillDone.current) {
        autoPrefillDone.current = true;
        createCoverLetter({
          letter: {
            opening: buildOpening({}, profile),
            body: buildBody(profile),
          },
        });
      }
      setLoadingLetter(false);
      return () => {
        mounted = false;
      };
    }

    setLoadingLetter(true);
    loadCoverLetter(id)
      .catch((error) => {
        console.error("Failed to load cover letter:", error);
      })
      .finally(() => {
        if (mounted) setLoadingLetter(false);
      });

    return () => {
      mounted = false;
    };
  }, [createCoverLetter, id, loadCoverLetter, pricingLoading, profile, profileLoading]);

  const handlePrint = useReactToPrint({
    contentRef: coverLetterRef,
    documentTitle: letter.companyName
      ? `${letter.companyName} Cover Letter`
      : "Cover Letter",
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }

      @media print {
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .print-paper {
          width: 100% !important;
          max-width: none !important;
          min-height: 0 !important;
          margin: 0 !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
      }
    `,
  });

  const printCoverLetter = useCallback(async () => {
    if (!coverLetterRef.current) {
      return;
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
    handlePrint();
  }, [handlePrint]);

  if (pricingLoading || profileLoading || loadingLetter) {
    return <LoadingState />;
  }

  if (!hasAccess) {
    return <LockedState planName={planName} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader title="Cover Letter" subtitle="Create a professional cover letter for your next application." />
      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          <div className="space-y-5">
            <CoverLetterTemplates />
            <CoverLetterEditor
              profile={profile}
              contact={contact}
              resumeData={resumeData}
              planName={planName}
              onPrint={printCoverLetter}
            />
          </div>
          <section className="min-w-0">
            <div className="sticky top-[92px]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Live Preview</p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{selectedTemplate}</p>
                </div>
              </div>
              <div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-200/70 p-4 shadow-inner sm:p-8 dark:bg-slate-700/70">
                <CoverLetterPaper
                  ref={coverLetterRef}
                  template={selectedTemplate}
                  letter={letter}
                  profile={profile}
                  contact={contact}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function buildOpening(letter = {}, profile = {}) {
  const name = profile?.fullName || "I am";
  const title = profile?.professionalTitle || profile?.desiredJobTitle || "professional";
  return `I am excited to apply for the ${letter?.jobTitle || "position"} at ${letter?.companyName || "your company"}. As ${name}, a ${title}, I believe my technical skills, experience, and commitment to continuous learning would allow me to contribute effectively to your team.`;
}

function buildBody(profile = {}) {
  if (profile?.summary) return profile.summary;
  if (profile?.yearsOfExperience) return `With ${profile.yearsOfExperience} years of experience, I have developed a strong foundation in problem solving, technology, and professional development. I am comfortable learning new tools, working collaboratively, and taking responsibility for delivering high-quality results.`;
  return "Throughout my academic and professional journey, I have developed strong problem-solving abilities, technical skills, and a commitment to learning. I am eager to bring these strengths to your organization and contribute positively to your team.";
}

function LoadingState() {
  return <div className="min-h-screen bg-slate-50"><DashboardHeader title="Cover Letter" subtitle="Create a professional cover letter for your next application." /><main className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-6"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" /><p className="mt-4 text-sm font-semibold text-slate-500">Loading cover letter builder...</p></div></main></div>;
}

function LockedState({ planName }) {
  return <div className="min-h-screen bg-slate-50"><DashboardHeader title="Cover Letter" subtitle="Create a professional cover letter for your next application." /><main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[1200px] items-center justify-center px-6 py-12"><div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20"><HiLockClosed size={34} /></div><div className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-700"><HiSparkles size={14} />Pro Feature</div><h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Cover letters are available on Pro & Team</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">Your current plan is <span className="font-bold text-slate-700">{planName || "Starter"}</span>. Upgrade your plan to unlock the cover letter builder, professional templates, editing tools, and downloads.</p><div className="mx-auto mt-8 max-w-md space-y-3 text-left"><LockedFeature text="Professional cover letter templates" /><LockedFeature text="Profile-powered cover letter content" /><LockedFeature text="Live cover letter editor and preview" /><LockedFeature text="Download and print your cover letters" /></div><button type="button" onClick={() => { window.location.href = "/checkout"; }} className="mt-9 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"><HiSparkles size={18} />Upgrade to Pro</button><p className="mt-5 text-xs font-semibold text-slate-400">Pro and Team plans include cover letter access.</p></div></main></div>;
}

function LockedFeature({ text }) {
  return <div className="flex items-center gap-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><HiCheck size={15} /></div><p className="text-sm font-semibold text-slate-700">{text}</p></div>;
}
