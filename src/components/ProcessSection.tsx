import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, MapPin, FileCheck, HardHat, Zap, Settings } from "lucide-react";

const steps = [
  { icon: <Search className="w-6 h-6" />, title: "Wind & Solar Assessment", desc: "Meteorological studies and resource evaluation" },
  { icon: <MapPin className="w-6 h-6" />, title: "Land Acquisition", desc: "Strategic site selection and land bank development" },
  { icon: <FileCheck className="w-6 h-6" />, title: "Permits & Grid Access", desc: "Building permits, PPA, CTU/STU connectivity approvals" },
  { icon: <HardHat className="w-6 h-6" />, title: "Construction & EPC", desc: "Foundation, substation, transmission line installation" },
  { icon: <Zap className="w-6 h-6" />, title: "Commissioning", desc: "Grid synchronization and performance testing" },
  { icon: <Settings className="w-6 h-6" />, title: "O&M Management", desc: "Long-term project management and optimization" },
];

const ProcessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-text-subtle">Our Process</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-foreground">
            From Concept to <span className="text-gradient">Commissioning</span>
          </h2>
        </motion.div>

        {/* Progress bar */}
        <div className="relative mb-16">
          <div className="h-1 rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-accent-gradient"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Steps - staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ marginTop: i % 2 === 1 ? "2rem" : 0 }}
            >
              <div className="glass-panel p-8 rounded-3xl h-full hover:glow-green transition-all duration-500 group-hover:translate-y-[-4px]">
                {/* Step number */}
                <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-sm glow-green">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {step.icon}
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-text-subtle text-sm">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
