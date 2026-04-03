import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/* ─── Partner data with category, initials, accent ─── */
const partners = [
  { name: "Trina Solar",          category: "Modules",    initials: "TS", accent: "#f59e0b", light: "#fffbeb" },
  { name: "JA Solar",             category: "Modules",    initials: "JA", accent: "#f59e0b", light: "#fffbeb" },
  { name: "Canadian Solar",       category: "Modules",    initials: "CS", accent: "#f59e0b", light: "#fffbeb" },
  { name: "Goldi Solar",          category: "Modules",    initials: "GS", accent: "#f59e0b", light: "#fffbeb" },
  { name: "ABB",                  category: "Inverters",  initials: "AB", accent: "#0ea5e9", light: "#f0f9ff" },
  { name: "Fimer",                category: "Inverters",  initials: "FI", accent: "#0ea5e9", light: "#f0f9ff" },
  { name: "Sungrow",              category: "Inverters",  initials: "SG", accent: "#0ea5e9", light: "#f0f9ff" },
  { name: "JSW Energy",           category: "Energy",     initials: "JE", accent: "#15803d", light: "#f0fdf4" },
  { name: "Sembcorp",             category: "Energy",     initials: "SC", accent: "#15803d", light: "#f0fdf4" },
  { name: "Evergreen Renewables", category: "Energy",     initials: "ER", accent: "#15803d", light: "#f0fdf4" },
  { name: "TANGEDCO",             category: "Grid",       initials: "TG", accent: "#8b5cf6", light: "#faf5ff" },
  { name: "Sathya Solar",         category: "Grid",       initials: "SS", accent: "#8b5cf6", light: "#faf5ff" },
];

const categories = [
  { label: "All",       accent: "#111827" },
  { label: "Modules",   accent: "#f59e0b" },
  { label: "Inverters", accent: "#0ea5e9" },
  { label: "Energy",    accent: "#15803d" },
  { label: "Grid",      accent: "#8b5cf6" },
];

/* ─── Single logo card ─── */
const PartnerCard = ({ partner, index }: { partner: typeof partners[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 26 });
  const sry = useSpring(ry, { stiffness: 260, damping: 26 });
  const sc = useSpring(1, { stiffness: 300, damping: 22 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rx.set(-((e.clientY - top) / height - 0.5) * 14);
    ry.set(((e.clientX - left) / width - 0.5) * 14);
  };
  const onLeave = () => { rx.set(0); ry.set(0); sc.set(1); setHovered(false); };
  const onEnter = () => { sc.set(1.04); setHovered(true); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale: sc,
        transformStyle: "preserve-3d",
        perspective: 800,
        background: hovered ? partner.light : "white",
        border: `1px solid ${hovered ? partner.accent + "25" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? `0 16px 48px ${partner.accent}18, 0 4px 12px rgba(0,0,0,0.06)`
          : "0 2px 16px rgba(0,0,0,0.04)",
        padding: "1.5rem",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl cursor-pointer"
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{
          background: hovered
            ? `linear-gradient(90deg, transparent, ${partner.accent}50, transparent)`
            : "transparent",
          transition: "background 0.3s",
        }}
      />

      {/* Top row: initials circle + category pill */}
      <div className="flex items-center justify-between mb-5">
        <motion.div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm"
          style={{
            fontFamily: "Georgia, serif",
            background: hovered ? partner.accent : partner.light,
            color: hovered ? "white" : partner.accent,
            border: `1px solid ${partner.accent}25`,
            letterSpacing: "-0.02em",
            transition: "background 0.3s, color 0.3s",
          }}
          whileHover={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 0.35 }}
        >
          {partner.initials}
        </motion.div>

        <span
          className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "system-ui, sans-serif",
            background: hovered ? `${partner.accent}15` : "#f3f4f6",
            color: hovered ? partner.accent : "#9ca3af",
            border: `1px solid ${hovered ? partner.accent + "25" : "transparent"}`,
            transition: "all 0.3s",
          }}
        >
          {partner.category}
        </span>
      </div>

      {/* Name */}
      <p
        className="font-bold text-base leading-snug mb-3"
        style={{
          fontFamily: "Georgia, serif",
          color: hovered ? "#111827" : "#374151",
          letterSpacing: "-0.01em",
          transition: "color 0.3s",
        }}
      >
        {partner.name}
      </p>

      {/* Bottom: colored bar + arrow */}
      <div className="flex items-center justify-between">
        <div
          className="h-0.5 rounded-full flex-1 mr-4 overflow-hidden"
          style={{ background: "#f3f4f6" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: partner.accent }}
            animate={{ width: hovered ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <motion.div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: hovered ? partner.accent : "#f3f4f6",
            color: hovered ? "white" : "#9ca3af",
            transition: "background 0.3s, color 0.3s",
          }}
          animate={{ rotate: hovered ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ArrowUpRight size={12} />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Marquee row ─── */
const MarqueeRow = ({
  items,
  direction = 1,
  speed = 30,
}: {
  items: typeof partners;
  direction?: 1 | -1;
  speed?: number;
}) => (
  <div className="relative overflow-hidden">
    {/* Edge fades */}
    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
      style={{ background: "linear-gradient(to right, #f7f5f0, transparent)" }} />
    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
      style={{ background: "linear-gradient(to left, #f7f5f0, transparent)" }} />

    <motion.div
      className="flex gap-4 py-2"
      animate={{ x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      style={{ width: "max-content" }}
    >
      {[...items, ...items].map((p, i) => (
        <div
          key={`${p.name}-${i}`}
          className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            minWidth: 160,
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
            style={{
              fontFamily: "Georgia, serif",
              background: p.light,
              color: p.accent,
              letterSpacing: "-0.02em",
            }}
          >
            {p.initials}
          </div>
          <span
            className="text-sm font-semibold whitespace-nowrap text-gray-500"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {p.name}
          </span>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.accent, opacity: 0.5 }} />
        </div>
      ))}
    </motion.div>
  </div>
);

/* ─── Main section ─── */
const PartnersSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? partners
    : partners.filter((p) => p.category === activeCategory);

  const row1 = partners.slice(0, 6);
  const row2 = partners.slice(6);

  const activeCat = categories.find((c) => c.label === activeCategory)!;

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ background: "#f7f5f0", fontFamily: "Georgia, serif" }}
    >
      {/* Dot texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.055]">
        <defs>
          <pattern id="pardots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#15803d" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pardots)" />
      </svg>

      {/* Ambient blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(21,128,61,0.055) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="text-[10px] font-bold tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
                style={{ fontFamily: "system-ui, sans-serif", background: "#15803d", color: "#f0fdf4" }}
              >
                Trusted Partners
              </span>
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #15803d, transparent)" }} />
            </motion.div>

            <motion.h2
              className="font-bold leading-[1.1]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#111827", letterSpacing: "-0.03em" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Industry{" "}
              <span style={{
                background: "linear-gradient(135deg, #15803d, #4ade80)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Leaders
              </span>
            </motion.h2>

            <motion.p
              className="mt-3 text-sm text-gray-400 max-w-sm"
              style={{ fontFamily: "system-ui, sans-serif" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Collaborating with global technology leaders to deliver world-class renewable energy infrastructure.
            </motion.p>
          </div>

          {/* Stats strip */}
          <motion.div
            className="flex gap-6 flex-shrink-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            {[
              { val: "12+", label: "Partners", accent: "#15803d" },
              { val: "4",   label: "Domains",  accent: "#f59e0b" },
              { val: "20+", label: "Years",    accent: "#0ea5e9" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl px-5 py-4 text-center"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  minWidth: 80,
                }}
              >
                <div
                  className="font-black text-2xl leading-none"
                  style={{ fontFamily: "Georgia, serif", color: s.accent, letterSpacing: "-0.03em" }}
                >
                  {s.val}
                </div>
                <div
                  className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Category filter pills ── */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <motion.button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  background: isActive ? cat.accent : "white",
                  color: isActive ? "white" : "#6b7280",
                  border: `1px solid ${isActive ? "transparent" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: isActive ? `0 4px 14px ${cat.accent}35` : "0 1px 4px rgba(0,0,0,0.04)",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {cat.label}
                {isActive && (
                  <motion.span
                    className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-white/60"
                    layoutId="cat-dot"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Grid of partner cards ── */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((partner, i) => (
            <motion.div
              key={partner.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <PartnerCard partner={partner} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Active category summary bar ── */}
        {activeCategory !== "All" && (
          <motion.div
            className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{
              background: "white",
              border: `1px solid ${activeCat.accent}20`,
              boxShadow: `0 2px 12px ${activeCat.accent}10`,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: activeCat.accent }} />
            <p
              className="text-sm text-gray-500"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Showing <span style={{ color: activeCat.accent, fontWeight: 600 }}>{filtered.length}</span> {activeCategory} partners
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="ml-auto text-xs text-gray-300 hover:text-gray-500 transition-colors"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Clear ×
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Marquee rows ── */}
      <div className="mt-16 flex flex-col gap-4">
        <MarqueeRow items={row1} direction={1}  speed={32} />
        <MarqueeRow items={row2} direction={-1} speed={38} />
      </div>

      {/* ── Bottom CTA ── */}
      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="text-sm text-gray-400 max-w-sm text-center sm:text-left"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Our partner ecosystem spans module manufacturers, inverter OEMs, energy companies and grid operators.
          </p>
          <motion.button
            className="flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-white"
            style={{
              fontFamily: "system-ui, sans-serif",
              background: "#111827",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            whileHover={{ scale: 1.03, background: "#15803d", boxShadow: "0 8px 32px rgba(21,128,61,0.3)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            Become a partner
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowUpRight size={15} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* ── Marquee footer ── */}
      <div
        className="mt-20 overflow-hidden border-t border-b py-4"
        style={{ borderColor: "rgba(21,128,61,0.1)" }}
      >
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, gi) =>
            ["Trina Solar", "JA Solar", "ABB", "Sungrow", "JSW Energy", "TANGEDCO", "Fimer", "Sembcorp"].map((item, i) => (
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
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;