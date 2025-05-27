import CompanionForm from "@/components/CompanionForm";
import { auth } from "@clerk/nextjs/server";

const NewCompanion = async() => {

  const {userId} = await auth();
  if (!userId) {
    return (
      <main className="min-lg:w-1/3 min-md:w-1/2 flex justify-center items-center ">
        <article className="w-full gap-4 flex flex-col ">
          <h1>Companion Builder</h1>
          <p>You must be logged in to create a companion.</p>
        </article>
      </main>
    );
  }
  return (
    <main className="min-lg:w-1/3 min-md:w-1/2 flex justify-center items-center ">
      <article className="w-full gap-4 flex flex-col ">
        <h1>Companion Builder</h1>
        <CompanionForm/>
      </article>
    </main>
  )
}

export default NewCompanion;