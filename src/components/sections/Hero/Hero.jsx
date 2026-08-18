import Container from "../../UI/Container/Container";

import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden

        min-h-screen

        bg-[#F8FAFC]

        pt-36
        pb-24
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute

          top-10
          left-1/2

          h-[650px]
          w-[650px]

          -translate-x-1/2

          rounded-full

          bg-blue-500/10

          blur-[180px]
        "
      />

      <div
        className="
          absolute

          bottom-0
          right-0

          h-[350px]
          w-[350px]

          rounded-full

          bg-cyan-400/10

          blur-[140px]
        "
      />

      <div
        className="
          absolute

          top-40
          left-0

          h-[280px]
          w-[280px]

          rounded-full

          bg-indigo-500/10

          blur-[120px]
        "
      />

      <Container>

        <div
          className="
            relative
            z-10

            grid

            items-center

            gap-20

            lg:grid-cols-2
          "
        >
          <HeroContent />

          <HeroPreview />
        </div>

      </Container>
    </section>
  );
}