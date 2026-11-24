import { useEffect, useState } from "react";

export default function DemoController({ children }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [];

    timers.push(
      setTimeout(() => setStep(1), 500)
    );

    timers.push(
      setTimeout(() => setStep(2), 2000)
    );

    timers.push(
      setTimeout(() => setStep(3), 3500)
    );

    timers.push(
      setTimeout(() => setStep(4), 5000)
    );

    timers.push(
      setTimeout(() => setStep(5), 6500)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return children({
    step,

    showName: step >= 1,

    showJob: step >= 2,

    showSkills: step >= 3,

    showResume: step >= 4,

    showATS: step >= 5,
  });
}