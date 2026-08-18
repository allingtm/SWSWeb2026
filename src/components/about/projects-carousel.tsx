"use client";

import {
  BrainCircuit,
  GraduationCap,
  HardHat,
  HeartPulse,
  Landmark,
  type LucideIcon,
  Network,
  Scale,
  Share2,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

type Project = {
  category: string;
  title: string;
  /** One line, shown on the card face. */
  description: string;
  /**
   * Shown only in the expanded card. Has to say something the face does not,
   * otherwise opening a card just repeats the line that prompted the click.
   */
  detail: string;
  /**
   * A result the client is happy to see published — a figure, a timescale, a
   * named award. Rendered only when present, so these can be filled in one at
   * a time as clients agree to them rather than all at once.
   */
  outcome?: string;
  gradient: string;
  icon: LucideIcon;
  tags: string[];
};

const projects: Project[] = [
  {
    category: "AI Business Solutions",
    title: "AI Platforms & Agents",
    description:
      "AI chatbots, full AI enabled business platforms, multi-agent solutions and embedding AI within business processes.",
    detail:
      "Chatbots that answer from your own documents rather than the open internet, platforms with AI built into the workflow instead of bolted on beside it, and multi-agent systems that carry out multi-step tasks. Most of the engineering effort goes into verification, because these tools will hand you something that looks right whether it is or not.",
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
    detail:
      "A patient-facing system used by people at genuinely difficult moments. Patient-facing NHS work carries requirements that internal tools never see: clinical safety, accessibility for people in distress, information governance, and a tolerance for downtime close to zero.",
    gradient: "from-blue-700 via-blue-600 to-cyan-500",
    icon: HeartPulse,
    tags: ["Healthcare", "Patient-Facing", "Award-Winning"],
  },
  {
    category: "Finance",
    title: "Business Orchestration & Workflow",
    description:
      "Business orchestration and workflow solutions across various products in UK retail banking.",
    detail:
      "Orchestration and workflow across several UK retail banking products. Work of this kind is mostly about state: knowing exactly where every case sits, what has happened to it and who did what, in a form that still stands up to an audit years later.",
    gradient: "from-slate-800 via-indigo-700 to-indigo-500",
    icon: Landmark,
    tags: ["UK Retail Banking", "Orchestration", "Workflow"],
  },
  {
    category: "Legal",
    title: "GLO Case Management",
    description:
      "Group Litigation Order (GLO) case management system, including marketing and payments.",
    detail:
      "A Group Litigation Order case management system covering claimant marketing, sign-up and payments as well as the case work itself. Group litigation means thousands of claimants moving through one process at the same time, against court deadlines that do not move.",
    gradient: "from-purple-800 via-purple-700 to-fuchsia-500",
    icon: Scale,
    tags: ["Case Management", "Marketing", "Payments"],
  },
  {
    category: "Transport & Logistics",
    title: "End-to-End Operations Platform",
    description:
      "Operations, recruitment, fleet, warehouse, finance, haulage and reporting.",
    detail:
      "Operations, recruitment, fleet, warehouse, finance, haulage and reporting in one system. The difficulty in logistics is that none of those are separate concerns. A vehicle off the road changes the schedule, the driver roster and the invoice at the same time, and a system that treats them as separate modules will quietly disagree with itself.",
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
    detail:
      "A full management system for a global education provider, and the ongoing maintenance that follows a system of that size. Operating across countries brings its own set of problems: time zones, languages, local regulation, and data that has to stay where it is allowed to be.",
    gradient: "from-emerald-700 via-emerald-600 to-teal-400",
    icon: GraduationCap,
    tags: ["Global Deployment", "Ongoing Maintenance"],
  },
  {
    category: "Energy",
    title: "Energy Calculators",
    description:
      "Complex energy calculators for residential and commercial properties.",
    detail:
      "Calculators for residential and commercial properties, where the rules are set externally and change without asking. The engineering problem is keeping the calculation correct and auditable while the standards underneath it move, so that a figure produced two years ago can still be explained.",
    gradient: "from-lime-600 via-yellow-500 to-amber-500",
    icon: Zap,
    tags: ["Residential", "Commercial", "Calculations"],
  },
  {
    category: "Construction",
    title: "Site & Operations Platform",
    description:
      "Operations, recruitment and subcontractor management, site management, supply management, finance and reporting.",
    detail:
      "Operations, recruitment and subcontractor management, site management, supply management, finance and reporting. Construction runs on people and materials arriving in the right order, and most of the value in the software is making that visible before it goes wrong rather than accounting for it afterwards.",
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
    detail:
      "Bespoke web and native mobile social networks for niche sectors. Small communities have different problems to large ones: moderation without a moderation team, getting the first hundred members talking to each other, and keeping the place alive between bursts of activity.",
    gradient: "from-pink-700 via-pink-600 to-rose-400",
    icon: Share2,
    tags: ["Web", "Native Mobile", "Niche Sectors"],
  },
  {
    category: "Business Platforms",
    title: "B2B Community Platforms",
    description:
      "B2B platforms including opportunity boards, job board, member directory, community and discussion spaces, messaging, referrals and more.",
    detail:
      "B2B platforms with opportunity boards, job boards, member directories, discussion spaces, messaging and referrals. Each of those is a small product in its own right, and the work is making the whole set feel like one thing rather than six bolted together.",
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
    detail:
      "Building management, pet apps, niche social networks and bespoke business apps, across iOS and Android. Native mobile adds constraints the web does not have: app store review between you and your users, sensible behaviour when the signal drops, and people running a version you shipped a year ago.",
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
              {project.detail}
            </p>
            {project.outcome && (
              <p className="mt-5 border-l-2 border-primary/40 pl-4 text-base leading-relaxed text-foreground">
                {project.outcome}
              </p>
            )}
            <h4 className="mt-8 text-sm font-semibold uppercase tracking-wide text-foreground">
              What it covered
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
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
