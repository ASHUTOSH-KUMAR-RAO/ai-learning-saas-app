import CompanionCard from "@/components/CompanionCard";
import { getAllCompanion } from "@/lib/actions/companion.action";
import { getSubjectColor } from "@/lib/utils";

const CompanionsLibrary =async ({searchParams}:SearchParams) => {

const params = await  searchParams;

  // You can use the params to fetch data or perform actions based on the search parameters

  const subject = params.subject ? params.subject : '';
  const topic = params.topic ? params.topic : '';

  const companions = await getAllCompanion({ subject, topic });

  console.log(companions);
  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Companion Library</h1>
        <div className="flex gap-4">Filter</div>
      </section>

      <section className="companions-grid ">
        {companions.map((companion) => (
         <CompanionCard key={companion.id} {...companion} color={getSubjectColor(companion.subject)} />
        ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary


