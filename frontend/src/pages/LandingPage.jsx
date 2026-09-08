import React, { useEffect } from 'react';
import { Navbar, Hero, Problem, Solution, Features, HowItWorks } from '../components/LandingPage/SectionOne';
import { DashboardPreview, AiVerification, ComplianceRisk, Transparency, Impact, UserTypes, Security, FinalCta, Footer } from '../components/LandingPage/SectionTwo';

export function LandingPage({ navigate }) {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <AiVerification />
        <ComplianceRisk />
        <Transparency />
        <Impact />
        <UserTypes />
        <Security />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
