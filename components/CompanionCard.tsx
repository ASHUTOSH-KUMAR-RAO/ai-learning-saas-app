import Image from "next/image";
import Link from "next/link";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
}
const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
}: CompanionCardProps) => {
  return (
    <article className="companion-card" style={{ background: color }}>
      <div className="flex items-center justify-between">
        <div className="subject-badge">{subject}</div>
        <button className="companion-bookmark">
          <Image
            src="/icons/bookmark.svg"
            alt="Bookmark Icon"
            width={12.5}
            height={16}
          />
        </button>
      </div>
       <h1 className="text-2xl font-bold">{name}</h1>
       <p className="text-sm">{topic}</p>
       <div className="flex items-center gap-2">
        <Image
          src="/icons/clock.svg"
          alt="Clock Icon"
          width={16}
          height={16}
        />
        <span className="text-sm">{duration} min</span>
       </div>

       <Link href={`/companions/${id}`} className="w-full">
         <button className="btn-primary w-full justify-center">Launch Lesson</button>
       </Link>
    </article>
  );
};

export default CompanionCard;
