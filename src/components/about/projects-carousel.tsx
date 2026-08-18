"use client";

import {
  BrainCircuit,
  GraduationCap,
  HardHat,
  HeartPulse,
  Landmark,
  Network,
  Scale,
  Share2,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const projects = [
  {
    category: "AI Business Solutions",
    title: "AI Platforms & Agents",
    description:
      "AI chatbots, full AI enabled business platforms, multi-agent solutions and embedding AI within business processes.",
    gradient: "from-indigo-950 via-violet-800 to-fuchsia-600",
    icon: BrainCircuit,
    tags: [
      "AI Chatbots",
      "AI Platforms",
      "Multi-Agent Systems",
      "Process Integration",
    ],
  },
  {
    category: "NHS",
    title: "Patient-Facing Mental Health System",
    description: "Award-winning patient-facing mental health system.",
    gradient: "from-blue-700 via-blue-600 to-cyan-500",
    icon: HeartPulse,
    tags: ["Healthcare", "Patient-Facing", "Award-Winning"],
  },
  {
    category: "Finance",
    title: "Business Orchestration & Workflow",
    description:
      "Business orchestration and workflow solutions across various products in UK retail banking.",
    gradient: "from-slate-800 via-indigo-700 to-indigo-500",
    icon: Landmark,
    tags: ["UK Retail Banking", "Orchestration", "Workflow"],
  },
  {
    category: "Legal",
    title: "GLO Case Management",
    description:
      "Group Litigation Order (GLO) case management system, including marketing and payments.",
    gradient: "from-purple-800 via-purple-700 to-fuchsia-500",
    icon: Scale,
    tags: ["Case Management", "Marketing", "Payments"],
  },
  {
    category: "Transport & Logistics",
    title: "End-to-End Operations Platform",
    description:
      "Operations, recruitment, fleet, warehouse, finance, haulage and reporting.",
    gradient: "from-orange-600 via-red-600 to-rose-600",
    icon: Truck,
    tags: [
      "Operations",
      "Recruitment",
      "Fleet",
      "Warehouse",
      "Finance",
      "Haulage",
      "Reporting",
    ],
  },
  {
    category: "Education",
    title: "Global Management System",
    description:
      "Full management system and ongoing maintenance for a global education provider.",
    gradient: "from-emerald-700 via-emerald-600 to-teal-400",
    icon: GraduationCap,
    tags: ["Global Deployment", "Ongoing Maintenance"],
  },
  {
    category: "Energy",
    title: "Energy Calculators",
    description:
      "Complex energy calculators for residential and commercial properties.",
    gradient: "from-lime-600 via-yellow-500 to-amber-500",
    icon: Zap,
    tags: ["Residential", "Commercial", "Calculations"],
  },
  {
    category: "Construction",
    title: "Site & Operations Platform",
    description:
      "Operations, recruitment and subcontractor management, site management, supply management, finance and reporting.",
    gradient: "from-stone-700 via-zinc-600 to-amber-500",
    icon: HardHat,
    tags: [
      "Operations",
      "Recruitment",
      "Subcontractor Management",
      "Site Management",
      "Supply Management",
      "Finance",
      "Reporting",
    ],
  },
  {
    category: "Social Networks",
    title: "Niche Social Platforms",
    description:
      "Bespoke web and native mobile social networks in a variety of niche sectors.",
    gradient: "from-pink-700 via-pink-600 to-rose-400",
    icon: Share2,
    tags: ["Web", "Native Mobile", "Niche Sectors"],
  },
  {
    category: "Business Platforms",
    title: "B2B Community Platforms",
    description:
      "B2B platforms including opportunity boards, job board, member directory, community and discussion spaces, messaging, referrals and more.",
    gradient: "from-sky-700 via-cyan-600 to-teal-400",
    icon: Network,
    tags: [
      "Opportunity Boards",
      "Job Board",
      "Member Directory",
      "Community",
      "Messaging",
      "Referrals",
    ],
  },
  {
    category: "Native Mobile Apps",
    title: "Cross-Sector Mobile Applications",
    description:
      "Building management, pet apps, niche social networks and bespoke business mobile apps.",
    gradient: "from-violet-700 via-violet-600 to-indigo-400",
    icon: Smartphone,
    tags: [
      "Building Management",
      "Pet Apps",
      "Niche Social Networks",
      "Bespoke Business Apps",
    ],
  },
];

export function ProjectsCarousel() {
  const items = projects.map((project, index) => (
    <Card
      key={project.title}
      index={index}
      layout
      card={{
        category: project.category,
        title: project.title,
        description: project.description,
        gradient: project.gradient,
        icon: project.icon,
        tags: project.tags,
        content: (
          <div>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {project.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ),
      }}
    />
  ));

  return <Carousel items={items} />;
}
