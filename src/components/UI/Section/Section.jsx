import Container from "../Container/Container";

export default function Section({
  id,
  children,
  className = "",
}) {
  return (
    <section
      id={id}
      className={`
        py-28
        ${className}
      `}
    >
      <Container>
        {children}
      </Container>
    </section>
  );
}