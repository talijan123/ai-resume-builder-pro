import Container from "../../ui/Container/Container";
import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden
        pt-40
        pb-28
      "
    >
      <Container>

        <div
          className="
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >
          <HeroContent />

          <HeroPreview />
        </div>

      </Container>
    </section>
  );
}