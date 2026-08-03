import Navbar from "./components/layout/Navbar/Navbar";
import Hero from "./components/sections/Hero/Hero";
import Features from "./components/sections/Features/Features";
import HowItWorks from "./components/sections/HowItWorks/HowItWorks";
import Pricing from "./components/sections/Pricing/Pricing";
import Footer from "./components/layout/Footer/Footer";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>

      <Footer />
    </>
  );
}