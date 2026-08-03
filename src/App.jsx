import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Pricing from "./components/Pricing/Pricing";
import Footer from "./components/Footer/Footer";

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