import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Phone, Globe, Sun, Zap, Leaf } from "lucide-react";
import { useRef, useState, useEffect } from "react";

/* ─── Magnetic button hook ─── */
const useMagnetic = (strength = 0.35) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    x.set((e.clientX - left - width / 2) * strength);
    y.set((e.clientY - top - height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return { ref, sx, sy, onMove, onLeave };
};

/* ─── Spinning sun ornament ─── */
const SpinningSun = ({ size = 160, color = "#f59e0b" }: { size?: number; color?: string }) => (
  <motion.svg
    width={size} height={size} viewBox="0 0 160 160"
    animate={{ rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
  >
    {Array.from({ length: 16 }).map((_, i) => (
      <line
        key={i}
        x1="80" y1="12" x2="80" y2="28"
        stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.35}
        transform={`rotate(${i * 22.5} 80 80)`}
      />
    ))}
    <circle cx="80" cy="80" r="22" fill={color} opacity={0.18} />
    <circle cx="80" cy="80" r="12" fill={color} opacity={0.55} />
  </motion.svg>
);

/* ─── Orbiting ring ─── */
const OrbitRing = ({ radius, duration, dotColor }: { radius: number; duration: number; dotColor: string }) => (
  <motion.div
    className="absolute rounded-full border"
    style={{
      width: radius * 2, height: radius * 2,
      top: "50%", left: "50%",
      marginTop: -radius, marginLeft: -radius,
      borderColor: `${dotColor}18`,
    }}
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
  >
    <div
      className="absolute w-2.5 h-2.5 rounded-full"
      style={{ background: dotColor, top: -5, left: "50%", marginLeft: -5, opacity: 0.7 }}
    />
  </motion.div>
);

/* ─── Floating stat chip ─── */
const FloatingChip = ({
  icon, label, value, accent, delay, x, y,
}: {
  icon: React.ReactNode; label: string; value: string;
  accent: string; delay: number; x: string; y: string;
}) => (
  <motion.div
    className="absolute flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
    style={{
      left: x, top: y,
      background: "white",
      border: `1px solid ${accent}20`,
      boxShadow: `0 8px 28px ${accent}18, 0 2px 8px rgba(0,0,0,0.06)`,
    }}
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    animate={{ y: [0, -6, 0] }}
  >
    <div
      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${accent}15`, color: accent }}
    >
      {icon}
    </div>
    <div>
      <div className="font-black text-sm leading-none" style={{ fontFamily: "Georgia, serif", color: "#111827" }}>{value}</div>
      <div className="text-[10px] text-gray-400 mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>{label}</div>
    </div>
  </motion.div>
);

/* ─── Contact pill ─── */
const ContactPill = ({
  icon, text, href, accent, delay,
}: {
  icon: React.ReactNode; text: string; href: string; accent: string; delay: number;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group"
      style={{
        background: hovered ? "white" : "rgba(255,255,255,0.6)",
        border: `1px solid ${hovered ? accent + "30" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered ? `0 8px 24px ${accent}15` : "0 2px 8px rgba(0,0,0,0.04)",
        textDecoration: "none",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
        style={{ background: hovered ? `${accent}15` : "#f3f4f6", color: hovered ? accent : "#9ca3af" }}
      >
        {icon}
      </div>
      <span
        className="text-sm font-medium transition-colors duration-300"
        style={{ fontFamily: "system-ui, sans-serif", color: hovered ? "#111827" : "#6b7280" }}
      >
        {text}
      </span>
      <motion.div animate={{ x: hovered ? 2 : 0 }} transition={{ duration: 0.2 }}>
        <ArrowRight size={12} style={{ color: hovered ? accent : "#d1d5db" }} />
      </motion.div>
    </motion.a>
  );
};

/* ─── Main CTA section ─── */
const CtaSection = () => {
  const primaryBtn = useMagnetic(0.4);
  const secondaryBtn = useMagnetic(0.3);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: "#f7f5f0", fontFamily: "Georgia, serif" }}
    >
      {/* Dot texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.055]">
        <defs>
          <pattern id="ctadots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#15803d" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ctadots)" />
      </svg>

      {/* Large organic blob left */}
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M60,-72C75,-55,82,-32,80,-10C78,12,67,33,52,50C37,67,17,80,-6,83C-29,86,-55,79,-68,63C-81,47,-81,21,-76,-4C-71,-29,-61,-52,-44,-67C-27,-82,0,-89,22,-84C44,-79,45,-89,60,-72Z"
          fill="#15803d" opacity="0.06" transform="translate(150 150)"
        />
      </motion.svg>

      {/* Amber blob right */}
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute -right-20 -bottom-20 w-[420px] h-[420px] pointer-events-none opacity-50"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M55,-65C68,-50,72,-29,70,-8C68,13,60,33,46,50C32,67,12,80,-10,82C-32,84,-56,76,-70,58C-84,40,-88,13,-82,-12C-76,-37,-60,-59,-41,-72C-22,-85,0,-89,22,-82C44,-75,42,-80,55,-65Z"
          fill="#f59e0b" opacity="0.07" transform="translate(150 150)"
        />
      </motion.svg>

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">

        {/* ── Split layout: left text | right visual ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-20 items-center">

          {/* ── LEFT: headline + buttons + contact ── */}
          <div>
            {/* Chapter tag */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="text-[10px] font-bold tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
                style={{ fontFamily: "system-ui, sans-serif", background: "#15803d", color: "#f0fdf4" }}
              >
                Get Started
              </span>
              <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #15803d, transparent)" }} />
              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pulse ? "a" : "b"}
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                <span className="text-[10px] text-gray-400" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Available now
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-6">
              {["Join the", "Clean Energy", "Revolution"].map((line, i) => (
                <div key={line} className="overflow-hidden">
                  <motion.h2
                    className="font-bold leading-[1.08] block"
                    style={{
                      fontSize: "clamp(2.8rem, 6vw, 5rem)",
                      color: i === 1 ? "transparent" : "#111827",
                      background: i === 1
                        ? "linear-gradient(135deg, #15803d 0%, #4ade80 50%, #f59e0b 100%)"
                        : "none",
                      WebkitBackgroundClip: i === 1 ? "text" : "unset",
                      WebkitTextFillColor: i === 1 ? "transparent" : "#111827",
                      backgroundClip: i === 1 ? "text" : "unset",
                      letterSpacing: "-0.03em",
                    }}
                    initial={{ y: "110%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </motion.h2>
                </div>
              ))}
            </div>

            {/* Body text */}
            <motion.p
              className="text-base leading-relaxed text-gray-500 max-w-md mb-10"
              style={{ fontFamily: "system-ui, sans-serif" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              Partner with us to build a sustainable future. From 1MW rooftop to 100MW utility-scale —
              we deliver on time, on quality, every time.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {/* Primary */}
              <motion.button
                ref={primaryBtn.ref}
                onMouseMove={primaryBtn.onMove}
                onMouseLeave={primaryBtn.onLeave}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-base text-white overflow-hidden"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
                  boxShadow: "0 8px 32px rgba(21,128,61,0.35), 0 2px 8px rgba(0,0,0,0.1)",
                  x: primaryBtn.sx,
                  y: primaryBtn.sy,
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative">Get in Touch</span>
                <motion.span
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <ArrowRight size={17} />
                </motion.span>
              </motion.button>

              {/* Secondary */}
              <motion.button
                ref={secondaryBtn.ref}
                onMouseMove={secondaryBtn.onMove}
                onMouseLeave={secondaryBtn.onLeave}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-base"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  background: "white",
                  color: "#374151",
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  x: secondaryBtn.sx,
                  y: secondaryBtn.sy,
                }}
                whileHover={{ scale: 1.04, background: "#111827", color: "white", borderColor: "transparent" }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.22 }}
              >
                Download Profile
              </motion.button>
            </motion.div>

            {/* Contact pills */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <ContactPill
                icon={<Mail size={13} />}
                text="dinesh@brightsgreen.com"
                href="mailto:dinesh@brightsgreen.com"
                accent="#15803d"
                delay={0.52}
              />
              <ContactPill
                icon={<Phone size={13} />}
                text="+91 8754582476"
                href="tel:+918754582476"
                accent="#0ea5e9"
                delay={0.58}
              />
              <ContactPill
                icon={<Globe size={13} />}
                text="brightsgreen.com"
                href="https://brightsgreen.com"
                accent="#f59e0b"
                delay={0.64}
              />
            </motion.div>
          </div>

          {/* ── RIGHT: orbital visual + floating chips ── */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ height: 440 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Center glow */}
            <div
              className="absolute w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(21,128,61,0.12) 0%, rgba(245,158,11,0.06) 50%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* Orbit rings */}
            <OrbitRing radius={110} duration={18} dotColor="#15803d" />
            <OrbitRing radius={158} duration={26} dotColor="#f59e0b" />
            <OrbitRing radius={200} duration={38} dotColor="#0ea5e9" />

            {/* Center sun */}
            <div className="relative z-10">
              <SpinningSun size={140} color="#f59e0b" />
              {/* Center badge */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <span
                  className="font-black text-2xl leading-none"
                  style={{ fontFamily: "Georgia, serif", color: "#111827", letterSpacing: "-0.04em" }}
                >
                  20+
                </span>
                <span
                  className="text-[9px] tracking-widest uppercase text-gray-400 mt-0.5"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Years
                </span>
              </div>
            </div>

            {/* Floating stat chips */}
            <FloatingChip
              icon={<Zap size={13} />}
              label="Commissioned"
              value="160MW+"
              accent="#15803d"
              delay={0.5}
              x="60%"
              y="8%"
            />
            <FloatingChip
              icon={<Sun size={13} />}
              label="Land Developed"
              value="5000+ Acres"
              accent="#f59e0b"
              delay={0.65}
              x="-4%"
              y="72%"
            />
            <FloatingChip
              icon={<Leaf size={13} />}
              label="Projects"
              value="Pan India"
              accent="#0ea5e9"
              delay={0.8}
              x="58%"
              y="80%"
            />
          </motion.div>
        </div>

        {/* ── Bottom horizontal rule with tagline ── */}
        <motion.div
          className="mt-20 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p
            className="text-sm text-gray-400 italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "Engineering the infrastructure that will power generations."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: "system-ui, sans-serif" }}>
              Brights Green Energy
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Marquee footer ── */}
      <div
        className="mt-16 overflow-hidden border-t border-b py-4"
        style={{ borderColor: "rgba(21,128,61,0.1)" }}
      >
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, gi) =>
            ["Get in Touch", "160MW+ Commissioned", "Tamil Nadu", "Pan India", "Solar · Wind · BESS", "20+ Years", "5000+ Acres", "Sustainable Future"].map(
              (item, i) => (
                <span key={`${gi}-${i}`} className="flex items-center gap-5">
                  <span
                    className="text-xs tracking-[0.25em] uppercase font-semibold"
                    style={{ color: "#15803d", opacity: 0.45, fontFamily: "system-ui, sans-serif" }}
                  >
                    {item}
                  </span>
                  <svg width="5" height="5" viewBox="0 0 5 5">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#15803d" opacity="0.25" />
                  </svg>
                </span>
              )
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;