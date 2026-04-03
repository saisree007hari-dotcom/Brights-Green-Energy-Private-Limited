import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const milestones = [
  { year: "2003", title: "The Beginning", desc: "Sai Sree Enterprises founded, pioneering wind resource assessment in India" },
  { year: "2010", title: "Solar Expansion", desc: "Expanded into solar energy development, building a pan-India presence" },
  { year: "2019", title: "Eternal Founded", desc: "Eternal Renewables incorporated, committed to green energy innovation" },
  { year: "2020", title: "Brights Green", desc: "Rechristened as Brights Green Energy Pvt Ltd, 150MW+ wind developed" },
  { year: "2023", title: "50MW Solar", desc: "Commissioned 50MW ground mounted solar power plants in Tamil Nadu" },
  { year: "2024", title: "100MW Milestone", desc: "100MW ground mounted SPV plants operational, IIT collaboration" },
  { year: "2025", title: "BESS Future", desc: "Battery Energy Storage System development, targeting 250MW+ in 2 years" },
];

const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className="relative py-32 md:py-48 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-text-subtle">Our Journey</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-foreground">
            Two Decades of <span className="text-gradient">Innovation</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated path line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-accent-gradient origin-top"
              style={{ scaleY: pathLength, height: "100%" }}
            />
          </div>

          {milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={milestone.year}
                className={`relative flex items-center mb-16 last:mb-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Node */}
                <motion.div
                  className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  <div className="w-5 h-5 rounded-full bg-accent-gradient glow-green border-4 border-background" />
                </motion.div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="glass-panel p-6 rounded-2xl hover:glow-green transition-shadow duration-500">
                    <span className="font-display text-3xl font-bold text-gradient">{milestone.year}</span>
                    <h3 className="font-display text-lg font-semibold text-foreground mt-2">{milestone.title}</h3>
                    <p className="text-text-subtle text-sm mt-2">{milestone.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
