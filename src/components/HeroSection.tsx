import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-glow-green/30"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden grain-texture">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-hero-gradient animate-gradient"
        style={{ y: bgY }}
      />

      {/* Hero image with overlay */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </motion.div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-glow-green/10 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-glow-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Floating particles */}
      <FloatingParticle delay={0} x="10%" y="20%" size={6} />
      <FloatingParticle delay={0.5} x="80%" y="30%" size={4} />
      <FloatingParticle delay={1} x="60%" y="60%" size={8} />
      <FloatingParticle delay={1.5} x="25%" y="70%" size={5} />
      <FloatingParticle delay={2} x="75%" y="15%" size={7} />
      <FloatingParticle delay={0.8} x="45%" y="80%" size={4} />
      <FloatingParticle delay={1.2} x="90%" y="50%" size={6} />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="inline-block px-5 py-2 mb-8 text-sm font-medium tracking-widest uppercase rounded-full glass-panel text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Eternal Renewables × Brights Green Energy
          </motion.span>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight max-w-5xl text-text-hero"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Powering the{" "}
            <span className="text-gradient">Next Generation</span>{" "}
            of Clean Energy
          </motion.h1>

          <motion.p
            className="mt-8 text-lg md:text-xl max-w-2xl mx-auto text-text-subtle font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            160MW+ commissioned. From solar parks to wind farms to battery storage — 
            engineering India's sustainable future.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <button className="magnetic-btn px-8 py-4 rounded-full bg-accent-gradient text-primary-foreground font-display font-semibold text-lg glow-green hover:glow-blue transition-shadow duration-500">
              Explore Our Projects
            </button>
            <button className="magnetic-btn px-8 py-4 rounded-full glass-panel font-display font-semibold text-lg text-foreground hover:bg-primary/5 transition-colors">
              Our Vision →
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-12 scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-text-subtle">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
