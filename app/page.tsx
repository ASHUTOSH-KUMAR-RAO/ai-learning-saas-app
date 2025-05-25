import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";

import React from "react";

const Page = () => {
  return (
    <main className="container mx-auto p-4">
      <h1>Popular Companions</h1>

      <section className="home-section">
        <CompanionCard
          id="321"
          name="Ashutosh Kumar Rao"
          topic="A versatile AI companion for all your needs."
          subject="AI Companion"
          duration={55}
          color="#f0f4c3"
        />
        <CompanionCard
          id="786"
          name="Awash Kuamr"
          topic="How to build a Self Descipline"
          subject="Self Descipline"
          duration={59}
          color="#f1e4"
        />
        <CompanionCard
          id="321"
          name="Abhishek Kumar Singh"
          topic="How to Solve a Problem in Mathematics"
          subject="Mathematics"
          duration={83}
          color="#f0e234"
        />
      </section>

      <section className="home-section">
        <CompanionsList
        title="Recently Completed Sessions"
        companions={recentSessions}
        classNames="w-2/3 max-lg:w-full "
        
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
