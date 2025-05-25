import Image from "next/image";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">Start Learning your way.</div>
      <h2 className="text-2xl font-semibold">
        Experience personalized learning like never before.
      </h2>
      <p className="">
        Pick a name, subject, and voice & personality --and let your AI
        companion guide you through your learning journey.
      </p>
      <Image src="/images/cta.svg" alt="cta" width={360} height={230} />

      <button className="btn-primary">
        <Image src="/icons/plus.svg" alt="plus" width={15} height={15} />
        <Link href="/companions/new">
          <p>Create your New Companion</p>
        </Link>
      </button>
    </section>
  );
};

export default CTA;
