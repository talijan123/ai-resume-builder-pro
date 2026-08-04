import Section from "../../ui/Section/Section";
import SectionTitle from "../../ui/SectionTitle/SectionTitle";
import SectionSubtitle from "../../ui/SectionSubtitle/SectionSubtitle";

import DemoController from "./DemoController";
import DemoInput from "./DemoInput";
import ResumeOutput from "./ResumeOutput";

export default function LiveDemo() {
  return (
    <Section id="live-demo">

      <div className="text-center">

        <span
          className="
            inline-flex
            items-center

            rounded-full

            border
            border-blue-200

            bg-blue-50

            px-4
            py-2

            text-sm
            font-semibold

            text-blue-600
          "
        >
          LIVE AI DEMO
        </span>

        <SectionTitle>
          Watch AI Build
          <br />
          Your Resume Live
        </SectionTitle>

        <SectionSubtitle>
          Experience how ResumeForge AI transforms
          your information into a professional
          ATS-friendly resume in seconds.
        </SectionSubtitle>

      </div>

      <DemoController>

        {(demo) => (

          <div
            className="
              mt-20

              grid

              gap-10

              items-center

              lg:grid-cols-2
            "
          >

            <DemoInput {...demo} />

            <ResumeOutput {...demo} />

          </div>

        )}

      </DemoController>

    </Section>
  );
}