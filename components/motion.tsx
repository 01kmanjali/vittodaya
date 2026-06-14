"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const viewport = { once: true, margin: "-60px" } as const;

export function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideRight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeft({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={slideLeft}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function FloatingCoin({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <circle cx="32" cy="32" r="30" fill="#C9A84C" opacity="0.15" />
        <circle cx="32" cy="32" r="26" fill="#C9A84C" opacity="0.25" />
        <circle cx="32" cy="32" r="22" fill="#C9A84C" />
        <text x="32" y="38" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0a3460">₹</text>
      </svg>
    </motion.div>
  );
}

export function FloatingGraph({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <rect width="80" height="56" rx="10" fill="#0a3460" opacity="0.85" />
        <polyline points="8,44 22,32 36,36 50,18 64,8 72,14" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="64" cy="8" r="3.5" fill="#C9A84C" />
        {[8,22,36,50].map((x, i) => (
          <rect key={i} x={x - 4} y={28 + i * 4} width="8" height={16 - i * 4} rx="2" fill="white" opacity="0.2" />
        ))}
      </svg>
    </motion.div>
  );
}

export function AnimatedCircles() {
  const circles = [
    { size: 380, top: "-96px", right: "-96px", delay: 0,   duration: 8  },
    { size: 280, bottom: "-80px", left: "-80px", delay: 1,  duration: 10 },
    { size: 200, top: "40%",  left: "38%",       delay: 2,  duration: 7  },
    { size: 140, top: "15%",  left: "25%",        delay: 0.5, duration: 9 },
    { size: 100, bottom: "20%", right: "20%",     delay: 1.5, duration: 6 },
  ];
  return (
    <>
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: c.size, height: c.size,
            top: "top" in c ? c.top : undefined,
            bottom: "bottom" in c ? c.bottom : undefined,
            left: "left" in c ? c.left : undefined,
            right: "right" in c ? c.right : undefined,
            background: "white",
            opacity: 0.06,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.06, 0.10, 0.06],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export function FloatingHome({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0], scale: [1, 1.03, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <circle cx="32" cy="32" r="30" fill="white" opacity="0.15" />
        <path d="M32 10 L56 30 L52 30 L52 54 L12 54 L12 30 L8 30 Z" fill="white" opacity="0.9" />
        <rect x="24" y="40" width="8" height="14" rx="1" fill="#0a3460" opacity="0.6" />
        <rect x="36" y="36" width="9" height="10" rx="1" fill="#0a3460" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

export function CountUp({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      {value}{suffix}
    </motion.span>
  );
}

export function PulseRing({ className }: { className?: string }) {
  return (
    <motion.span
      className={className}
      animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

export function HeroContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type CircleDef = {
  size: number; color: string;
  opacityRange: [number, number]; duration: number; delay: number;
  top?: string; bottom?: string; left?: string; right?: string;
};

const CIRCLE_VARIANTS: Record<string, CircleDef[]> = {
  // big blue top-right, gold bottom-left dominant
  A: [
    { size: 380, top: "-100px",  right: "-100px", color: "#0a3460", opacityRange: [0.14, 0.22], duration: 9,  delay: 0   },
    { size: 240, bottom: "-70px",left: "-70px",   color: "#C9A84C", opacityRange: [0.16, 0.26], duration: 11, delay: 1   },
    { size: 130, top: "20%",     left: "30%",     color: "#C9A84C", opacityRange: [0.10, 0.18], duration: 7,  delay: 2   },
    { size: 80,  bottom: "20%",  right: "25%",    color: "#0a3460", opacityRange: [0.12, 0.20], duration: 8,  delay: 1.5 },
  ],
  // gold top-left, blue bottom-right
  B: [
    { size: 300, top: "-80px",   left: "-80px",   color: "#C9A84C", opacityRange: [0.14, 0.24], duration: 10, delay: 0   },
    { size: 200, bottom: "-60px",right: "-60px",  color: "#0a3460", opacityRange: [0.16, 0.26], duration: 9,  delay: 0.8 },
    { size: 110, top: "40%",     right: "18%",    color: "#0a3460", opacityRange: [0.12, 0.20], duration: 8,  delay: 2   },
    { size: 75,  bottom: "30%",  left: "28%",     color: "#C9A84C", opacityRange: [0.13, 0.22], duration: 6,  delay: 1.2 },
  ],
  // centered large gold + scattered blues
  C: [
    { size: 260, top: "50%",     left: "50%",     color: "#C9A84C", opacityRange: [0.10, 0.18], duration: 12, delay: 0   },
    { size: 180, top: "-60px",   left: "-60px",   color: "#0a3460", opacityRange: [0.15, 0.24], duration: 8,  delay: 0.5 },
    { size: 150, bottom: "-50px",right: "-50px",  color: "#0a3460", opacityRange: [0.14, 0.22], duration: 9,  delay: 1   },
    { size: 90,  top: "15%",     right: "20%",    color: "#C9A84C", opacityRange: [0.14, 0.24], duration: 7,  delay: 2   },
    { size: 65,  bottom: "25%",  left: "20%",     color: "#C9A84C", opacityRange: [0.12, 0.20], duration: 6,  delay: 1.8 },
  ],
  // two large circles left edge + small cluster right
  D: [
    { size: 320, top: "-90px",   left: "-90px",   color: "#0a3460", opacityRange: [0.15, 0.24], duration: 10, delay: 0   },
    { size: 180, bottom: "-50px",left: "10%",     color: "#C9A84C", opacityRange: [0.15, 0.25], duration: 8,  delay: 1   },
    { size: 110, top: "20%",     right: "-30px",  color: "#C9A84C", opacityRange: [0.13, 0.22], duration: 7,  delay: 0.5 },
    { size: 80,  bottom: "20%",  right: "15%",    color: "#0a3460", opacityRange: [0.14, 0.22], duration: 9,  delay: 2   },
  ],
  // diagonal — top-left gold + bottom-right blue + midpoints
  E: [
    { size: 280, top: "-70px",   left: "-70px",   color: "#C9A84C", opacityRange: [0.14, 0.22], duration: 9,  delay: 0   },
    { size: 220, bottom: "-60px",right: "-60px",  color: "#0a3460", opacityRange: [0.15, 0.25], duration: 11, delay: 0.6 },
    { size: 100, top: "35%",     left: "42%",     color: "#0a3460", opacityRange: [0.12, 0.20], duration: 8,  delay: 1.5 },
    { size: 70,  top: "10%",     right: "25%",    color: "#C9A84C", opacityRange: [0.14, 0.24], duration: 6,  delay: 2.2 },
  ],
};

const VARIANT_ORDER: Array<keyof typeof CIRCLE_VARIANTS> = ["A", "B", "C", "D", "E", "B", "A", "E", "C"];

export function SectionBgCircles({ variant }: { variant: keyof typeof CIRCLE_VARIANTS }) {
  const circles = CIRCLE_VARIANTS[variant] ?? CIRCLE_VARIANTS.A;
  return (
    <>
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            bottom: c.bottom,
            left: c.left,
            right: c.right,
            background: c.color,
            opacity: c.opacityRange[0],
            ...(c.left === "50%" ? { transform: "translate(-50%, -50%)" } : {}),
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [c.opacityRange[0], c.opacityRange[1], c.opacityRange[0]],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}


