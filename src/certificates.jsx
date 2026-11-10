"use client";

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import DisplayCards from "@/components/ui/display-cards";
import { Sparkles, Trophy, Award, Code, CheckCircle } from "lucide-react";

const certificateCards = [
  {
    icon: <Trophy className="size-4 text-red-400" />,
    title: "Pursuit '25 // Winner",
    description: "Takeshi Castle — ISTE National Level Symposium (SSGMCE)",
    date: "March 2025",
    tag: "WINNER",
    image: "./certificates/cert-pursuit-winner.jpg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
  {
    icon: <Sparkles className="size-4 text-red-400" />,
    title: "Project Xpo 2K25",
    description: "National Level Project Competition — Padm. Dr. V.B. Kolte COE",
    date: "April 2025",
    tag: "PROJECT COMP",
    image: "./certificates/cert-project-xpo.jpg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
  {
    icon: <Code className="size-4 text-red-400" />,
    title: "Digital FABLAB",
    description: "Web Development Module — Digital FABLAB at SSGMCE Shegaon",
    date: "2024–25",
    tag: "FABLAB",
    image: "./certificates/cert-web-development.jpg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
  {
    icon: <Award className="size-4 text-red-400" />,
    title: "Jagdamba Electricals",
    description: "7-Day Industrial Training & Transformer Repair — Jagdamba Electricals & Engg.",
    date: "July 2024",
    tag: "INTERNSHIP",
    image: "./certificates/cert-jagdamba-training.jpg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
  {
    icon: <Sparkles className="size-4 text-red-400" />,
    title: "NxtWave // Gen AI Model",
    description: "AI for Students: Build Your Own Generative AI Model Workshop",
    date: "Feb 2025",
    tag: "GEN AI MODEL",
    image: "./certificates/cert-nxtwave-genai.jpg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
  {
    icon: <Code className="size-4 text-red-400" />,
    title: "Hacktoberfest '24",
    description: "Global Open Source Contribution — DigitalOcean & GitHub Community",
    date: "Oct 2024",
    tag: "OPEN SOURCE",
    image: "./certificates/cert-hacktoberfest.svg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
  {
    icon: <CheckCircle className="size-4 text-red-400" />,
    title: "MS-CIT // 93% Distinction",
    description: "Maharashtra State Certificate in Information Technology (Score: 93/100)",
    date: "June 2022",
    tag: "MS-CIT 93%",
    image: "./certificates/cert-mscit-blank.svg",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
  },
];

function DisplayCardsDemo() {
  // Starts with middle card (index 3: Jagdamba Electricals) for perfect bilateral symmetry
  const [activeIndex, setActiveIndex] = useState(3);

  // Synchronize active class on top horizontal selector buttons
  useEffect(() => {
    document.querySelectorAll(".lab-tag-pill").forEach((b, idx) => {
      b.classList.toggle("active", idx === activeIndex);
    });
  }, [activeIndex]);

  useEffect(() => {
    const handleMilestone = (e) => {
      const text = (e.detail || "").toUpperCase();
      let targetIndex = null;
      if (text.includes("PURSUIT") || text.includes("WINNER") || text.includes("TAKESHI")) {
        targetIndex = 0;
      } else if (text.includes("PROJECT XPO") || text.includes("KOLTE")) {
        targetIndex = 1;
      } else if (text.includes("FABLAB") || text.includes("WEB DEV") || text.includes("WEB DEVELOPMENT")) {
        targetIndex = 2;
      } else if (text.includes("JAGDAMBA") || text.includes("ELECTRICALS") || text.includes("INTERNSHIP") || text.includes("TRANSFORMER")) {
        targetIndex = 3;
      } else if (text.includes("NXT WAVE") || text.includes("GEN AI") || text.includes("CHATBOT")) {
        targetIndex = 4;
      } else if (text.includes("HACKTOBERFEST") || text.includes("OPEN SOURCE")) {
        targetIndex = 5;
      } else if (text.includes("MS-CIT") || text.includes("93%")) {
        targetIndex = 6;
      } else if (text.includes("01")) {
        targetIndex = 0;
      } else if (text.includes("02")) {
        targetIndex = 1;
      } else if (text.includes("03")) {
        targetIndex = 2;
      } else if (text.includes("04")) {
        targetIndex = 3;
      } else if (text.includes("05")) {
        targetIndex = 4;
      } else if (text.includes("06")) {
        targetIndex = 5;
      } else if (text.includes("07")) {
        targetIndex = 6;
      }

      if (targetIndex !== null) {
        setActiveIndex(targetIndex);
      }
    };

    window.addEventListener("certificate-selected", handleMilestone);

    return () => {
      window.removeEventListener("certificate-selected", handleMilestone);
    };
  }, []);

  return (
    <div className="display-cards-wrapper">
      {/* Top HUD Tag */}
      <div className="display-cards-hud-top">
        <span className="hud-badge">// OFFICIAL CREDENTIALS &amp; CERTIFICATIONS</span>
        <span className="hud-badge text-red">7 VERIFIED</span>
      </div>

      <div className="display-cards-inner">
        <DisplayCards 
          cards={certificateCards} 
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      </div>

      {/* Bottom HUD Tag */}
      <div className="display-cards-hud-bottom">
        <span>SCROLL OR CLICK BUTTONS TO NAVIGATE • CLICK ACTIVE TO EXPAND</span>
        <span className="text-red">[STACK_VIEW ↗]</span>
      </div>
    </div>
  );
}

export { DisplayCardsDemo };

const mountContainer = document.getElementById("certificatesCarouselRoot");
if (mountContainer) {
  const root = createRoot(mountContainer);
  root.render(<DisplayCardsDemo />);
}
