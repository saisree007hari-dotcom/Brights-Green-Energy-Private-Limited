import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import TimelineSection from "@/components/TimelineSection";
import ImpactSection from "@/components/ImpactSection";
import ProcessSection from "@/components/ProcessSection";
import PartnersSection from "@/components/PartnersSection";
import CtaSection from "@/components/CtaSection";

const Index = () => {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <IntroSection />
      <div id="services">
        <ServicesSection />
      </div>
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="timeline">
        <TimelineSection />
      </div>
      <div id="impact">
        <ImpactSection />
      </div>
      <ProcessSection />
      <PartnersSection />
      <div id="contact">
        <CtaSection />
      </div>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-subtle">
            © 2025 Brights Green Energy & Eternal Renewables. All rights reserved.
          </p>
          <p className="text-sm text-text-subtle">
            Powering India's Sustainable Future
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
