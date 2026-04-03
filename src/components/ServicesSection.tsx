import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Sun, Wind, Battery, Wrench, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

/* ─── Types ─── */
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  tag: string;
  accent: string;
  light: string;
  border: string;
  textAccent: string;
}

/* ─── 3D Tilt Card wrapper ─── */
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 240, damping: 26 });
  const sry = useSpring(ry, { stiffness: 240, damping: 26 });
  const scale = useSpring(1, { stiffness: 300, damping: 24 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    rx.set(-((e.clientY - top) / height - 0.5) * 16);
    ry.set(((e.clientX - left) / width - 0.5) * 16);
    scale.set(1.02);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale,
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Service data ─── */
const services: Service[] = [
  {
    icon: <Sun strokeWidth={1.5} />,
    title: "Solar EPC",
    description:
      "Utility-scale ground mounted & rooftop solar power projects — engineered from land acquisition to energisation.",
    stat: "160MW+",
    statLabel: "Commissioned in Tamil Nadu",
    tag: "Solar",
    accent: "#f59e0b",
    light: "#fffbeb",
    border: "rgba(245,158,11,0.15)",
    textAccent: "#b45309",
  },
  {
    icon: <Wind strokeWidth={1.5} />,
    title: "Wind Hybrid",
    description:
      "Wind-solar hybrid projects with minimal environmental footprint, maximising yield across varied terrains.",
    stat: "150MW+",
    statLabel: "Wind projects since 2003",
    tag: "Wind",
    accent: "#0ea5e9",
    light: "#f0f9ff",
    border: "rgba(14,165,233,0.15)",
    textAccent: "#0369a1",
  },
  {
    icon: <Battery strokeWidth={1.5} />,
    title: "BESS",
    description:
      "Cutting-edge battery energy storage solutions ensuring grid reliability, peak shaving and energy arbitrage.",
    stat: "24/7",
    statLabel: "Reliable energy dispatch",
    tag: "Storage",
    accent: "#10b981",
    light: "#f0fdf4",
    border: "rgba(16,185,129,0.15)",
    textAccent: "#047857",
  },
  {
    icon: <Wrench strokeWidth={1.5} />,
    title: "EPC & Turnkey",
    description:
      "End-to-end project delivery — resource assessment, engineering, procurement, construction and monitoring.",
    stat: "100%",
    statLabel: "Projects delivered on time",
    tag: "Turnkey",
    accent: "#8b5cf6",
    light: "#faf5ff",
    border: "rgba(139,92,246,0.15)",
    textAccent: "#6d28d9",
  },
];

/* ─── Individual service card ─── */
const ServiceCard = ({
  service,
  index,
  isActive,
  onClick,
}: {
  service: Service;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard>
        <motion.div
          onClick={onClick}
          className="relative rounded-[2rem] overflow-hidden cursor-pointer select-none"
          style={{
            background: isActive ? service.accent : "white",
            border: `1px solid ${isActive ? "transparent" : service.border}`,
            boxShadow: isActive
              ? `0 24px 64px ${service.accent}40, 0 4px 16px ${service.accent}20`
              : "0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            transition: "background 0.45s ease, box-shadow 0.45s ease",
          }}
          animate={{ y: isActive ? -6 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: isActive
                ? "rgba(255,255,255,0.3)"
                : `linear-gradient(90deg, transparent, ${service.accent}40, transparent)`,
            }}
          />

          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Radial accent circle */}
            <div
              className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full"
              style={{
                background: isActive
                  ? "rgba(255,255,255,0.08)"
                  : service.light,
                transition: "background 0.45s ease",
              }}
            />
            {/* Rotating ring */}
            <motion.div
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full border"
              style={{
                borderColor: isActive ? "rgba(255,255,255,0.1)" : `${service.accent}18`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative p-7 flex flex-col gap-5">
            {/* Header row */}
            <div className="flex items-start justify-between">
              {/* Icon circle */}
              <motion.div
                className="w-13 h-13 rounded-2xl flex items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  background: isActive ? "rgba(255,255,255,0.2)" : service.light,
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.15)" : service.border}`,
                  color: isActive ? "white" : service.accent,
                }}
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <span style={{ width: 22, height: 22 }}>{service.icon}</span>
              </motion.div>

              {/* Tag pill */}
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  background: isActive ? "rgba(255,255,255,0.18)" : service.light,
                  color: isActive ? "rgba(255,255,255,0.9)" : service.textAccent,
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.2)" : service.border}`,
                }}
              >
                {service.tag}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3
                className="font-bold text-xl mb-2 leading-tight"
                style={{
                  fontFamily: "Georgia, serif",
                  color: isActive ? "white" : "#111827",
                  letterSpacing: "-0.02em",
                }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  color: isActive ? "rgba(255,255,255,0.75)" : "#6b7280",
                }}
              >
                {service.description}
              </p>
            </div>

            {/* Stat row */}
            <div
              className="flex items-end justify-between pt-4"
              style={{
                borderTop: `1px solid ${isActive ? "rgba(255,255,255,0.15)" : service.border}`,
              }}
            >
              <div>
                <div
                  className="font-black text-2xl leading-none"
                  style={{
                    fontFamily: "Georgia, serif",
                    color: isActive ? "white" : service.accent,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {service.stat}
                </div>
                <div
                  className="text-[11px] mt-1"
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    color: isActive ? "rgba(255,255,255,0.6)" : "#9ca3af",
                  }}
                >
                  {service.statLabel}
                </div>
              </div>

              {/* Arrow button */}
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: isActive ? "rgba(255,255,255,0.2)" : service.light,
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.2)" : service.border}`,
                  color: isActive ? "white" : service.accent,
                }}
                whileHover={{ scale: 1.15, rotate: 45 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowUpRight size={14} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
};

/* ─── Feature detail panel ─── */
const DetailPanel = ({ service }: { service: Service }) => (
  <motion.div
    key={service.title}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4 }}
    className="rounded-[2rem] p-10 h-full flex flex-col justify-between relative overflow-hidden"
    style={{
      background: service.light,
      border: `1px solid ${service.border}`,
      minHeight: 320,
    }}
  >
    {/* Background decorative circles */}
    <div
      className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30"
      style={{ background: service.accent }}
    />
    <div
      className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
      style={{ background: service.accent }}
    />
    {/* Spinning ring */}
    <motion.div
      className="absolute top-8 right-8 w-20 h-20 rounded-full border-2 border-dashed opacity-20"
      style={{ borderColor: service.accent }}
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />

    <div className="relative">
      <div
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "white",
          color: service.textAccent,
          border: `1px solid ${service.border}`,
          boxShadow: `0 2px 8px ${service.accent}15`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: service.accent }}
        />
        {service.tag} Division
      </div>

      <h3
        className="font-bold text-4xl mb-4 leading-tight"
        style={{
          fontFamily: "Georgia, serif",
          color: "#111827",
          letterSpacing: "-0.03em",
        }}
      >
        {service.title}
      </h3>
      <p
        className="text-base leading-relaxed max-w-sm"
        style={{ fontFamily: "system-ui, sans-serif", color: "#4b5563" }}
      >
        {service.description}
      </p>
    </div>

    <div className="relative mt-8 flex items-center gap-6">
      <div>
        <div
          className="text-5xl font-black leading-none"
          style={{
            fontFamily: "Georgia, serif",
            color: service.accent,
            letterSpacing: "-0.04em",
          }}
        >
          {service.stat}
        </div>
        <div
          className="text-sm mt-1"
          style={{ fontFamily: "system-ui, sans-serif", color: "#6b7280" }}
        >
          {service.statLabel}
        </div>
      </div>
      <div
        className="h-12 w-px"
        style={{ background: service.border }}
      />
      <motion.button
        className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full"
        style={{
          fontFamily: "system-ui, sans-serif",
          background: service.accent,
          color: "white",
          boxShadow: `0 4px 16px ${service.accent}40`,
        }}
        whileHover={{ scale: 1.04, boxShadow: `0 8px 24px ${service.accent}50` }}
        whileTap={{ scale: 0.97 }}
      >
        Learn more <ArrowUpRight size={14} />
      </motion.button>
    </div>
  </motion.div>
);

/* ─── Main section ─── */
const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "#f7f5f0", fontFamily: "Georgia, serif" }}
    >
      {/* Subtle dot texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="sdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#15803d" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sdots)" />
      </svg>

      {/* Ambient color blob */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${services[activeIndex].accent}08 0%, transparent 70%)`,
          transition: "background 0.6s ease",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">

        {/* ── Section header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-[10px] font-bold tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  background: "#15803d",
                  color: "#f0fdf4",
                }}
              >
                Our Capabilities
              </span>
              <div
                className="h-px w-16"
                style={{ background: "linear-gradient(90deg, #15803d, transparent)" }}
              />
            </motion.div>

            <motion.h2
              className="font-bold leading-[1.1]"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                color: "#111827",
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Green Energy{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #15803d, #4ade80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Solutions
              </span>
            </motion.h2>
          </div>

          {/* Tab pills */}
          <motion.div
            className="flex gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {services.map((s, i) => (
              <motion.button
                key={s.title}
                onClick={() => setActiveIndex(i)}
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  background: activeIndex === i ? s.accent : "white",
                  color: activeIndex === i ? "white" : "#6b7280",
                  border: `1px solid ${activeIndex === i ? "transparent" : "rgba(0,0,0,0.08)"}`,
                  boxShadow:
                    activeIndex === i ? `0 4px 14px ${s.accent}40` : "0 1px 4px rgba(0,0,0,0.04)",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {s.title}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Main content: cards grid + detail panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-6">

          {/* Left — 2×2 cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                isActive={activeIndex === i}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          {/* Right — detail panel */}
          <div className="lg:pl-2">
            <AnimatePresence mode="wait">
              <DetailPanel key={activeIndex} service={services[activeIndex]} />
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center gap-3 mt-5 justify-center">
              {services.map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="rounded-full"
                  style={{
                    width: activeIndex === i ? 28 : 8,
                    height: 8,
                    background: activeIndex === i ? s.accent : "#d1d5db",
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA row ── */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10"
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p
            className="text-sm text-gray-400 max-w-sm text-center sm:text-left"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Every capability under one roof — from resource assessment to commercial operation.
          </p>
          <motion.button
            className="flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm"
            style={{
              fontFamily: "system-ui, sans-serif",
              background: "#111827",
              color: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              background: "#15803d",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            View all services
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUpRight size={15} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* ── Marquee strip ── */}
      <div
        className="mt-20 overflow-hidden border-t border-b py-4"
        style={{ borderColor: "rgba(21,128,61,0.1)", background: "#f7f5f0" }}
      >
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, gi) =>
            ["Solar EPC", "Wind Hybrid", "BESS", "EPC Turnkey", "160MW+ Solar", "150MW+ Wind", "Pan India", "Since 2003"].map(
              (item, i) => (
                <span key={`${gi}-${i}`} className="flex items-center gap-5">
                  <span
                    className="text-xs tracking-[0.25em] uppercase font-semibold"
                    style={{
                      color: "#15803d",
                      opacity: 0.45,
                      fontFamily: "system-ui, sans-serif",
                    }}
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

export default ServicesSection;