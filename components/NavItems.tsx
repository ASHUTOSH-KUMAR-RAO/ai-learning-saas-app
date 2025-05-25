"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "My Journey", href: "/my-journey" },
];

const NavItems = () => {
  const pathname = usePathname();
  //? usePathname hook is used to get the current path of the page, so that we can highlight the active link

  return (
    <nav className="flex items-center justify-center gap-1 px-3 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-200/60 shadow-sm">
      {navItems.map(
        (
          { label, href } // todo=> Jaab kabhi hum map function ke case mein curely braces ke place per paranthesis use karte hain, toh hum directly return karte hain,kyuki curly braces ke case mein ye ek block ki tarah treat hota hai, // !=> Jaab hum curly braces use karte hain, toh humein return statement likhna padta hai,aur iss case mein ye no brackets ki tarah treat hota hai just beacause of the arrow function
        ) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-out",
              "hover:scale-[1.02] active:scale-[0.98]",
              pathname === href
                ? [
                    "text-white bg-gradient-to-r from-blue-500 to-purple-500",
                    "shadow-md shadow-blue-400/20",
                  ]
                : ["text-gray-700 hover:text-gray-900", "hover:bg-gray-100/80"]
            )}
          >
            <span className="relative">{label}</span>
          </Link>
        )
      )}
    </nav>
  );
};

export default NavItems;
