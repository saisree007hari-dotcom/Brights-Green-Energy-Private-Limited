import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ─── Animated counter ─── */
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const step = (ts: number, start: number) => {
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame((t) => step(t, start));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── 3D tilt card ─── */
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 28 });
  const sry = useSpring(ry, { stiffness: 260, damping: 28 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rx.set(-((e.clientY - top) / height - 0.5) * 12);
    ry.set(((e.clientX - left) / width - 0.5) * 12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Organic blob SVG ─── */
const Blob = ({ className }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 200 200"
    className={className}
    animate={{ rotate: [0, 360] }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
  >
    <path
      d="M47.5,-57.2C59.9,-45.5,67.3,-28.6,68.4,-11.5C69.5,5.6,64.4,22.9,54.4,36.4C44.5,49.9,29.7,59.6,12.8,65.3C-4.1,71,-23.2,72.7,-38.7,65.2C-54.2,57.7,-66.1,41,-70.5,22.6C-74.9,4.3,-71.7,-15.7,-62.5,-31.3C-53.3,-46.9,-38.1,-58.1,-22.3,-66C-6.5,-73.9,9.9,-78.5,24.6,-73.2C39.2,-67.9,35.1,-68.9,47.5,-57.2Z"
      fill="currentColor"
      transform="translate(100 100)"
    />
  </motion.svg>
);

/* ─── Staggered word reveal (clip-path style) ─── */
const WordReveal = ({ text, className = "" }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden leading-[1.1] mr-[0.28em]">
        <motion.span
          className="inline-block"
          initial={{ y: "105%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </span>
);

/* ─── Floating dot grid ─── */
const DotGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#166534" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

/* ─── Sun rays decorative element ─── */
const SunRays = () => (
  <motion.div
    className="absolute"
    animate={{ rotate: 360 }}
    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-px origin-bottom"
        style={{
          height: 120,
          background: "linear-gradient(to top, rgba(21,128,61,0.2), transparent)",
          transform: `rotate(${i * 30}deg)`,
          left: "50%",
          bottom: "50%",
        }}
      />
    ))}
  </motion.div>
);

/* ─── Main component ─── */
const IntroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const blobY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const numY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const lineW = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  const headline = "We don't just build solar farms. We engineer the infrastructure that will power generations.";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#f7f5f0", fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Subtle dot texture */}
      <div className="absolute inset-0 pointer-events-none">
        <DotGrid />
      </div>

      {/* ── Decorative organic blobs ── */}
      <motion.div
        style={{ y: blobY }}
        className="absolute -top-32 -right-32 w-[520px] h-[520px] pointer-events-none"
      >
        <Blob className="w-full h-full text-green-100" />
      </motion.div>
      <motion.div
        style={{ y: blobY }}
        className="absolute -bottom-40 -left-24 w-[380px] h-[380px] pointer-events-none opacity-60"
      >
        <Blob className="w-full h-full text-amber-100" />
      </motion.div>

      {/* ══════════ HERO STRIP ══════════ */}
      <div className="relative pt-24 pb-0">
        {/* Chapter label — top left editorial */}
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-[10px] font-bold tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
              style={{ background: "#166534", color: "#f0fdf4", fontFamily: "system-ui, sans-serif" }}
            >
              Chapter 01
            </span>
            <div className="h-px flex-1 max-w-[100px]" style={{ background: "linear-gradient(90deg, #166534, transparent)" }} />
          </motion.div>
        </div>

        {/* ── Full-bleed title band ── */}
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] gap-0 lg:gap-16 items-end">

            {/* LEFT — oversized numeral column */}
            <div className="relative hidden lg:flex flex-col justify-end pb-4">
              <motion.div
                style={{ y: numY }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                {/* Giant numeral */}
                <div
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: "clamp(140px, 18vw, 220px)",
                    color: "transparent",
                    WebkitTextStroke: "2px #15803d",
                    letterSpacing: "-0.06em",
                    opacity: 0.12,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  01
                </div>

                {/* Sun rays decoration */}
                <div className="absolute top-12 left-8 w-36 h-36">
                  <SunRays />
                  {/* Center circle */}
                  <div
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full"
                    style={{ background: "#fbbf24", boxShadow: "0 0 24px rgba(251,191,36,0.4)" }}
                  />
                </div>
              </motion.div>

              {/* Promise badge card */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                <TiltCard>
                  <div
                    className="rounded-3xl p-6 border"
                    style={{
                      background: "white",
                      borderColor: "rgba(21,128,61,0.12)",
                      boxShadow: "0 4px 40px rgba(21,128,61,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p
                      className="text-[10px] tracking-[0.25em] uppercase font-bold mb-3"
                      style={{ color: "#15803d", fontFamily: "system-ui, sans-serif" }}
                    >
                      Our Promise
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#374151", fontFamily: "system-ui, sans-serif" }}>
                      Engineering clean energy infrastructure that lasts for generations, not just contracts.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-gray-400" style={{ fontFamily: "system-ui, sans-serif" }}>Active since 2004</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>

            {/* RIGHT — editorial headline */}
            <div className="pb-12">
              <h2
                className="font-bold leading-[1.12]"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
                  color: "#111827",
                  letterSpacing: "-0.025em",
                  fontFamily: "Georgia, serif",
                }}
              >
                <WordReveal text={headline} />
              </h2>

              {/* Animated underline */}
              <div className="mt-8 h-px overflow-hidden" style={{ background: "#e5e7eb" }}>
                <motion.div
                  className="h-full"
                  style={{ background: "linear-gradient(90deg, #15803d, #86efac)", width: lineW }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ STATS + VISUAL BAND ══════════ */}
      <div className="relative mt-0">
        {/* Diagonal cut separator */}
        <div
          className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
          style={{
            background: "#f7f5f0",
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)",
          }}
        />

        <div
          className="relative pt-20 pb-20"
          style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfccb 50%, #fef9c3 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-8 lg:px-16">

            {/* ── Asymmetric 3-column stat layout ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

              {/* STAT 1 — large card */}
              <motion.div
                initial={{ opacity: 0, y: 60, rotate: -1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="md:col-span-1"
              >
                <TiltCard className="h-full">
                  <div
                    className="relative h-full rounded-3xl overflow-hidden p-8 flex flex-col justify-between"
                    style={{
                      background: "white",
                      boxShadow: "0 8px 48px rgba(21,128,61,0.10), 0 2px 8px rgba(0,0,0,0.04)",
                      minHeight: 280,
                    }}
                  >
                    {/* Background texture circle */}
                    <div
                      className="absolute -top-12 -right-12 w-48 h-48 rounded-full"
                      style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)", opacity: 0.6 }}
                    />

                    <div className="relative">
                      <span
                        className="text-xs font-bold tracking-widest uppercase block mb-6"
                        style={{ color: "#15803d", fontFamily: "system-ui, sans-serif" }}
                      >
                        Experience
                      </span>
                      <div
                        className="font-black leading-none"
                        style={{
                          fontSize: 88,
                          fontFamily: "Georgia, serif",
                          color: "#111827",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        <Counter target={20} suffix="+" />
                      </div>
                      <p
                        className="mt-3 text-sm leading-relaxed"
                        style={{ color: "#6b7280", fontFamily: "system-ui, sans-serif" }}
                      >
                        Years of renewable energy expertise across Wind &amp; Solar
                      </p>
                    </div>

                    {/* Bottom bar */}
                    <motion.div
                      className="h-1 rounded-full mt-8"
                      style={{ background: "linear-gradient(90deg, #15803d, #4ade80)" }}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </TiltCard>
              </motion.div>

              {/* STAT 2 — tall accent card */}
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="md:col-span-1 md:-mt-8"
              >
                <TiltCard className="h-full">
                  <div
                    className="relative h-full rounded-3xl overflow-hidden p-8 flex flex-col justify-between"
                    style={{
                      background: "#15803d",
                      boxShadow: "0 20px 60px rgba(21,128,61,0.30)",
                      minHeight: 320,
                    }}
                  >
                    {/* Concentric rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {[180, 240, 300].map((size, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full border"
                          style={{
                            width: size,
                            height: size,
                            borderColor: "rgba(255,255,255,0.06)",
                          }}
                          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                          transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
                        />
                      ))}
                    </div>

                    <div className="relative">
                      <span
                        className="text-xs font-bold tracking-widest uppercase block mb-6 text-green-300"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        Scale
                      </span>
                      <div
                        className="font-black leading-none text-white"
                        style={{
                          fontSize: 72,
                          fontFamily: "Georgia, serif",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        <Counter target={5000} suffix="+" />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-green-200" style={{ fontFamily: "system-ui, sans-serif" }}>
                        Acres of solar energy land bank developed pan India
                      </p>
                    </div>

                    {/* Floating pill */}
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-8 w-fit"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                      <span className="text-xs text-green-100 font-medium" style={{ fontFamily: "system-ui, sans-serif" }}>Pan India presence</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

              {/* RIGHT column — stacked mini cards */}
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.8 }}
              >
                {/* Mini card A */}
                <TiltCard>
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "white",
                      border: "1px solid rgba(21,128,61,0.10)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2" style={{ fontFamily: "system-ui, sans-serif" }}>
                      Legacy
                    </p>
                    <p className="text-2xl font-black" style={{ fontFamily: "Georgia, serif", color: "#111827" }}>2004</p>
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>Year founded</p>
                  </div>
                </TiltCard>

                {/* Mini card B — image-like */}
                <TiltCard>
                  <div
                    className="rounded-2xl p-6 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)",
                      border: "1px solid rgba(202,138,4,0.15)",
                    }}
                  >
                    <div
                      className="absolute right-4 top-4 w-12 h-12 rounded-full"
                      style={{ background: "#fbbf24", boxShadow: "0 0 20px rgba(251,191,36,0.5)" }}
                    />
                    <p className="text-xs font-bold tracking-widest uppercase text-amber-700 mb-2" style={{ fontFamily: "system-ui, sans-serif" }}>
                      Mission
                    </p>
                    <p className="text-sm font-medium text-amber-900 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
                      Solar-first infrastructure for tomorrow's India
                    </p>
                  </div>
                </TiltCard>

                {/* Mini card C */}
                <TiltCard>
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: "#111827",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    }}
                  >
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2" style={{ fontFamily: "system-ui, sans-serif" }}>
                      Sectors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Solar", "Wind", "Land"].map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", fontFamily: "system-ui, sans-serif" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ MARQUEE FOOTER STRIP ══════════ */}
      <div
        className="relative overflow-hidden border-t"
        style={{ borderColor: "rgba(21,128,61,0.1)", background: "#f7f5f0", paddingBlock: "1.25rem" }}
      >
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, gi) =>
            ["Solar Development", "Wind Energy", "Land Banking", "Pan India Network", "Renewable Infrastructure", "20+ Years", "5000+ Acres", "Clean Future"]
              .map((item, i) => (
                <span key={`${gi}-${i}`} className="flex items-center gap-5">
                  <span
                    className="text-xs tracking-[0.25em] uppercase font-semibold"
                    style={{ color: "#15803d", opacity: 0.5, fontFamily: "system-ui, sans-serif" }}
                  >
                    {item}
                  </span>
                  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#15803d" opacity="0.3" /></svg>
                </span>
              ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;