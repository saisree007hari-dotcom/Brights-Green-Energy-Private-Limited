import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ end, suffix, duration = 2 }: { end: number; suffix: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-display text-6xl md:text-8xl lg:text-9xl font-black text-gradient">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const impacts = [
  { value: 160, suffix: "MW+", label: "Solar Capacity Commissioned" },
  { value: 150, suffix: "MW+", label: "Wind Projects Developed" },
  { value: 5000, suffix: "+", label: "Acres Land Bank" },
  { value: 20, suffix: "+", label: "Years Industry Experience" },
];

const ImpactSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden grain-texture">
      {/* Pulsing background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(152 60% 42% / 0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(205 85% 55% / 0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-text-subtle">Impact at Scale</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-foreground">
            Numbers That <span className="text-gradient">Matter</span>
          </h2>
        </motion.div>

        <div className="space-y-20">
          {impacts.map((impact, i) => (
            <motion.div
              key={impact.label}
              className={`flex flex-col ${i % 2 === 0 ? "items-start" : "items-end"}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedCounter end={impact.value} suffix={impact.suffix} />
              <p className="mt-3 text-text-subtle text-lg font-body">{impact.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
