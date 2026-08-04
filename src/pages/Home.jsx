import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/sections/Hero/Hero";
import Features from "../components/sections/Features/Features";
import HowItWorks from "../components/sections/HowItWorks/HowItWorks";
import Templates from "../components/sections/Templates/Templates";
import Demo from "../components/sections/Demo/LiveDemo";
import Pricing from "../components/sections/Pricing/Pricing";
import Testimonials from "../components/sections/Testimonials/Testimonials";
import FAQ from "../components/sections/FAQ/FAQ";
import CTA from "../components/sections/CTA/CTA";
import Footer from "../components/layout/Footer/Footer";
import ScrollToTop from "../components/ui/ScrollToTop/ScrollToTop";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Templates />
        <Demo />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <Footer />

      <ScrollToTop />
    </>
  );
}