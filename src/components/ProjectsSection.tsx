import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, MapPin, Zap, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import projectSolar from "@/assets/project-solar.jpg";
import projectWind from "@/assets/project-wind.jpg";
import projectBess from "@/assets/project-bess.jpg";

/* ─── Data ─── */
const projects = [
  {
    id: "01",
    title: "Namakkal Solar Park",
    capacity: "42.3 MWp",
    location: "Namakkal, Tamil Nadu",
    detail:
      "106 acres of bifacial PV modules connected to 110/22 KV grid substation — a landmark in utility-scale solar engineering.",
    image: projectSolar,
    acreage: "106 Acres",
    year: "2021",
    accent: "#f59e0b",
    accentLight: "#fffbeb",
    tag: "Ground Mounted",
  },
  {
    id: "02",
    title: "Karur Solar Park I & II",
    capacity: "38.5 MWp",
    location: "Karur, Tamil Nadu",
    detail:
      "Dual park installation featuring Trina Solar bifacial modules and ABB/Fimer central inverters across 120 contiguous acres.",
    image: projectWind,
    acreage: "120 Acres",
    year: "2022",
    accent: "#15803d",
    accentLight: "#f0fdf4",
    tag: "Dual Park",
  },
  {
    id: "03",
    title: "Pazhani Solar Park",
    capacity: "42 MWp",
    location: "Pazhani, Tamil Nadu",
    detail:
      "Large-scale ground mounted solar with advanced energy management systems and real-time SCADA monitoring.",
    image: projectBess,
    acreage: "110 Acres",
    year: "2023",
    accent: "#0ea5e9",
    accentLight: "#f0f9ff",
    tag: "Smart Grid",
  },
];

/* ─── Magnetic cursor follower ─── */
const useMagnet = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);
  return { sx, sy };
};

/* ─── 3D tilt hook ─── */
const useTilt = () => {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 24 });
  const sry = useSpring(ry, { stiffness: 200, damping: 24 });
  const onMove = (e: React.MouseEvent, el: HTMLElement) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    rx.set(-((e.clientY - top) / height - 0.5) * 14);
    ry.set(((e.clientX - left) / width - 0.5) * 14);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  return { srx, sry, onMove, onLeave };
};

/* ─── Large hero project card ─── */
const HeroCard = ({
  project,
  isActive,
}: {
  project: (typeof projects)[0];
  isActive: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { srx, sry, onMove, onLeave } = useTilt();

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => ref.current && onMove(e, ref.current)}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="w-full h-full"
    >
      <div
        className="relative w-full h-full rounded-[2.5rem] overflow-hidden"
        style={{
          boxShadow: `0 32px 80px ${project.accent}25, 0 4px 16px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Image */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isActive ? 1 : 1.08 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        {/* Top row */}
        <div className="absolute top-7 left-7 right-7 flex items-center justify-between">
          <motion.span
            className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
            style={{
              fontFamily: "system-ui, sans-serif",
              background: `${project.accent}22`,
              color: project.accent,
              border: `1px solid ${project.accent}40`,
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -12 }}
            transition={{ delay: 0.2 }}
          >
            {project.tag}
          </motion.span>

          <motion.span
            className="text-white/50 text-xs font-medium"
            style={{ fontFamily: "system-ui, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            {project.year}
          </motion.span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={12} style={{ color: project.accent }} />
              <span
                className="text-white/60 text-xs tracking-wide"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {project.location}
              </span>
            </div>

            {/* Title */}
            <h3
              className="font-bold text-white mb-3 leading-tight"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {project.title}
            </h3>

            <p
              className="text-white/60 text-sm leading-relaxed mb-7 max-w-md"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {project.detail}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${project.accent}20`, border: `1px solid ${project.accent}30` }}
                >
                  <Zap size={13} style={{ color: project.accent }} />
                </div>
                <div>
                  <div
                    className="font-black text-lg leading-none"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: project.accent,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {project.capacity}
                  </div>
                  <div
                    className="text-[10px] text-white/40 mt-0.5"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    Capacity
                  </div>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Layers size={13} className="text-white/60" />
                </div>
                <div>
                  <div
                    className="font-black text-lg leading-none text-white"
                    style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}
                  >
                    {project.acreage}
                  </div>
                  <div
                    className="text-[10px] text-white/40 mt-0.5"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    Land Area
                  </div>
                </div>
              </div>

              <motion.button
                className="ml-auto w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: project.accent,
                  boxShadow: `0 4px 16px ${project.accent}50`,
                }}
                whileHover={{ scale: 1.12, rotate: 45 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.22 }}
              >
                <ArrowUpRight size={16} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Thumbnail strip card ─── */
const ThumbCard = ({
  project,
  isActive,
  onClick,
}: {
  project: (typeof projects)[0];
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className="relative rounded-2xl overflow-hidden flex-shrink-0 text-left"
    style={{
      width: isActive ? 200 : 120,
      height: 80,
      border: `2px solid ${isActive ? project.accent : "transparent"}`,
      boxShadow: isActive ? `0 0 0 4px ${project.accent}18` : "none",
      transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, box-shadow 0.3s",
    }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <img
      src={project.image}
      alt={project.title}
      className="w-full h-full object-cover"
    />
    <div
      className="absolute inset-0"
      style={{
        background: isActive
          ? "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%)"
          : "rgba(0,0,0,0.35)",
      }}
    />
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 p-3 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p
            className="text-white text-[10px] font-bold leading-tight"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {project.title}
          </p>
          <p style={{ color: project.accent, fontSize: 9, fontFamily: "system-ui, sans-serif" }}>
            {project.capacity}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

/* ─── Sidebar project list ─── */
type Project = typeof projects[number];

const SideList = ({
  projects,
  active,
  setActive,
}: {
  projects: Project[];
  active: number;
  setActive: (i: number) => void;
}) => (
  <div className="flex flex-col gap-2">
    {projects.map((p, i) => (
      <motion.button
        key={p.id}
        onClick={() => setActive(i)}
        className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-300"
        style={{
          background: active === i ? "white" : "transparent",
          border: `1px solid ${active === i ? p.accent + "25" : "transparent"}`,
          boxShadow: active === i ? `0 4px 20px ${p.accent}12` : "none",
        }}
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2 }}
      >
        {/* Progress bar indicator */}
        <div className="relative w-0.5 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 right-0 rounded-full"
            style={{ background: p.accent }}
            animate={{ height: active === i ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ fontFamily: "system-ui, sans-serif", color: p.accent }}
            >
              {p.id}
            </span>
            <span
              className="text-[10px] text-gray-300"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {p.year}
            </span>
          </div>
          <p
            className="text-sm font-semibold truncate"
            style={{
              fontFamily: "Georgia, serif",
              color: active === i ? "#111827" : "#6b7280",
              transition: "color 0.3s",
            }}
          >
            {p.title}
          </p>
          <p
            className="text-xs mt-0.5 truncate"
            style={{
              fontFamily: "system-ui, sans-serif",
              color: active === i ? p.accent : "#9ca3af",
            }}
          >
            {p.capacity} · {p.acreage}
          </p>
        </div>

        <motion.div
          animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : -4 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight size={14} style={{ color: p.accent }} />
        </motion.div>
      </motion.button>
    ))}
  </div>
);

/* ─── Main section ─── */
const ProjectsSection = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);
  const headerO = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const prev = () => setActive((a) => (a - 1 + projects.length) % projects.length);
  const next = () => setActive((a) => (a + 1) % projects.length);

  /* Auto-advance */
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % projects.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24"
      style={{ background: "#f7f5f0", fontFamily: "Georgia, serif" }}
    >
      {/* Dot texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.055]">
        <defs>
          <pattern id="pdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#15803d" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pdots)" />
      </svg>

      {/* Ambient glow blob */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 700,
          height: 700,
          top: "10%",
          right: "-15%",
          background: `radial-gradient(circle, ${projects[active].accent}08 0%, transparent 65%)`,
          filter: "blur(60px)",
          transition: "background 0.7s ease",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">

        {/* ── Header ── */}
        <motion.div
          style={{ y: headerY, opacity: headerO }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] font-bold tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
                style={{ fontFamily: "system-ui, sans-serif", background: "#15803d", color: "#f0fdf4" }}
              >
                Portfolio
              </span>
              <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #15803d, transparent)" }} />
            </div>
            <h2
              className="font-bold leading-[1.1]"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                color: "#111827",
                letterSpacing: "-0.03em",
              }}
            >
              160MW+{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #15803d, #4ade80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Commissioned
              </span>
            </h2>
            <p
              className="mt-3 text-sm text-gray-400 max-w-sm"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Landmark solar installations engineered across Tamil Nadu — from land to grid.
            </p>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={prev}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              whileHover={{ scale: 1.08, background: "#111827", color: "white" }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft size={16} />
            </motion.button>
            <span
              className="text-sm font-semibold tabular-nums"
              style={{ fontFamily: "system-ui, sans-serif", color: "#9ca3af" }}
            >
              {String(active + 1).padStart(2, "0")}{" "}
              <span className="text-gray-200">/</span>{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
            <motion.button
              onClick={next}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: "#111827",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
              whileHover={{ scale: 1.08, background: "#15803d" }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Main grid: [hero image | sidebar list] ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch">

          {/* Hero image area */}
          <div className="relative" style={{ height: "clamp(380px, 60vh, 600px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.97, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: -30 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <HeroCard project={projects[active]} isActive={true} />
              </motion.div>
            </AnimatePresence>

            {/* Floating project ID badge */}
            <motion.div
              key={`badge-${active}`}
              className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl flex flex-col items-center justify-center z-10"
              style={{
                background: projects[active].accent,
                boxShadow: `0 8px 24px ${projects[active].accent}50`,
              }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-white/70 text-[9px] font-bold tracking-widest" style={{ fontFamily: "system-ui" }}>NO</span>
              <span className="text-white font-black text-xl leading-none" style={{ fontFamily: "Georgia, serif" }}>
                {projects[active].id}
              </span>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5">
            {/* Project list */}
            <div
              className="rounded-[2rem] p-4 flex-1"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              }}
            >
              <p
                className="text-[10px] font-bold tracking-widest uppercase text-gray-300 px-4 pt-2 pb-3"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                All Projects
              </p>
              <SideList projects={projects} active={active} setActive={setActive} />
            </div>

            {/* Summary stat card */}
            <motion.div
              className="rounded-[2rem] p-6 relative overflow-hidden"
              style={{
                background: "#111827",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
              key={`stat-${active}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Background accent */}
              <div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${projects[active].accent}25 0%, transparent 70%)`,
                }}
              />
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-4"
                style={{ fontFamily: "system-ui, sans-serif", color: projects[active].accent }}
              >
                Project Highlight
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Capacity", value: projects[active].capacity },
                  { label: "Land Area", value: projects[active].acreage },
                  { label: "Location", value: "Tamil Nadu" },
                  { label: "Year", value: projects[active].year },
                ].map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-[10px] text-gray-500 mb-1"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {projects.map((p, i) => (
            <ThumbCard
              key={p.id}
              project={p}
              isActive={active === i}
              onClick={() => setActive(i)}
            />
          ))}

          {/* Progress bar */}
          <div className="flex-1 ml-4">
            <div className="h-px bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: projects[active].accent }}
                animate={{ width: `${((active + 1) / projects.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p
              className="text-[10px] text-gray-300 mt-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {active + 1} of {projects.length} projects
            </p>
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
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
            Every project engineered with precision — from terrain assessment to commercial operation date.
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
            View full portfolio
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
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
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, gi) =>
            ["Namakkal 42.3MWp", "Karur 38.5MWp", "Pazhani 42MWp", "106 Acres", "120 Acres", "110 Acres", "Tamil Nadu", "160MW+ Total"].map(
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

export default ProjectsSection;