import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";
import {
  getAllCompanion,
  getRecentSession,
} from "@/lib/actions/companion.action";

import React from "react";

function getSubjectColor(subject: string): string {
  // Convert to lowercase for case-insensitive matching
  const normalizedSubject = subject.toLowerCase().trim();
  
  const colors: { [key: string]: string } = {
    // Mathematics - Blue tones (logical, analytical)
    maths: "blue",
    mathematics: "blue",
    math: "blue",
    
    // Language - Purple/Violet tones (creative, expressive)
    language: "purple",
    english: "purple",
    hindi: "purple",
    literature: "purple",
    
    // Science - Green tones (natural, experimental)
    science: "green",
    physics: "green",
    chemistry: "green",
    biology: "green",
    
    // History - Orange/Amber tones (warm, traditional)
    history: "orange",
    
    // Coding - Cyan/Teal tones (modern, technical)
    coding: "cyan",
    programming: "cyan",
    development: "cyan",
    computer: "cyan",
    
    // Economics - Red tones (business, financial)
    economics: "red",
    finance: "red",
    business: "red",
    
    // Default fallback
    default: "gray",
  };
  
  return colors[normalizedSubject] || colors.default;
}

// Alternative function for hex color codes
function getSubjectColorHex(subject: string): string {
  const normalizedSubject = subject.toLowerCase().trim();
  
  const colorCodes: { [key: string]: string } = {
    // Mathematics - Blue shades
    maths: "#3B82F6",        // Blue-500
    mathematics: "#2563EB",   // Blue-600
    math: "#1D4ED8",         // Blue-700
    
    // Language - Purple shades
    language: "#8B5CF6",     // Violet-500
    english: "#7C3AED",      // Violet-600
    hindi: "#6D28D9",        // Violet-700
    literature: "#5B21B6",   // Violet-800
    
    // Science - Green shades
    science: "#10B981",      // Emerald-500
    physics: "#059669",      // Emerald-600
    chemistry: "#047857",    // Emerald-700
    biology: "#065F46",      // Emerald-800
    
    // History - Orange shades
    history: "#F59E0B",      // Amber-500
    
    // Coding - Cyan shades
    coding: "#06B6D4",       // Cyan-500
    programming: "#0891B2",  // Cyan-600
    development: "#0E7490",  // Cyan-700
    computer: "#155E75",     // Cyan-800
    
    // Economics - Red shades
    economics: "#EF4444",    // Red-500
    finance: "#DC2626",      // Red-600
    business: "#B91C1C",     // Red-700
    
    // Default
    default: "#6B7280",      // Gray-500
  };
  
  return colorCodes[normalizedSubject] || colorCodes.default;
}

// Function for Tailwind CSS classes
function getSubjectColorClass(subject: string): string {
  const normalizedSubject = subject.toLowerCase().trim();
  
  const colorClasses: { [key: string]: string } = {
    // Mathematics - Blue
    maths: "bg-blue-500 text-white",
    mathematics: "bg-blue-600 text-white",
    math: "bg-blue-700 text-white",
    
    // Language - Purple
    language: "bg-purple-500 text-white",
    english: "bg-purple-600 text-white",
    hindi: "bg-purple-700 text-white",
    literature: "bg-purple-800 text-white",
    
    // Science - Green
    science: "bg-green-500 text-white",
    physics: "bg-green-600 text-white",
    chemistry: "bg-green-700 text-white",
    biology: "bg-green-800 text-white",
    
    // History - Orange
    history: "bg-orange-500 text-white",
    
    // Coding - Cyan
    coding: "bg-cyan-500 text-white",
    programming: "bg-cyan-600 text-white",
    development: "bg-cyan-700 text-white",
    computer: "bg-cyan-800 text-white",
    
    // Economics - Red
    economics: "bg-red-500 text-white",
    finance: "bg-red-600 text-white",
    business: "bg-red-700 text-white",
    
    // Default
    default: "bg-gray-500 text-white",
  };
  
  return colorClasses[normalizedSubject] || colorClasses.default;
}

const Page = async () => {
  const companion = await getAllCompanion({ limit: 4 });
  
  const getRecentSessionCompanion = await getRecentSession(10);
  
  return (
    <main className="container mx-auto p-4">
      <h1>Popular Companions</h1>
      
      <section className="home-section">
        {companion.map((companions) => (
          <CompanionCard
            key={companions.id}
            {...companions}
            color={getSubjectColor(companions.subject)}
            // Alternative: use hex colors
            // colorHex={getSubjectColorHex(companions.subject)}
            // Alternative: use Tailwind classes
            // colorClass={getSubjectColorClass(companions.subject)}
          />
        ))}
      </section>
      
      <section className="home-section">
        <CompanionsList
          title="Recently Completed Sessions"
          companions={getRecentSessionCompanion}
          classNames="w-2/3 max-lg:w-full "
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;