import Image from "next/image";

interface LogoProps {
  variant?: "full" | "icon";
  height?: number;
  /** "light" = dark text (default), "dark" = white/light text for dark backgrounds */
  theme?: "light" | "dark";
  className?: string;
}

export default function Logo({ variant = "full", height = 40, theme = "light", className = "" }: LogoProps) {
  if (variant === "icon") {
    return (
      <Image
        src="/logo.png"
        alt="Vittodaya"
        width={height}
        height={height}
        className={className}
        priority
      />
    );
  }

  const iconSize = Math.round(height * 1.27);
  const isDark = theme === "dark";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Vittodaya"
        width={iconSize}
        height={iconSize}
        priority
      />
      <span className="flex flex-col leading-none">
        <span
          style={{
            fontWeight: 800,
            fontSize: height * 0.62,
            color: isDark ? "#ffffff" : "#1a2e6b",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          Vittodaya
        </span>
        <span
          style={{
            fontWeight: 400,
            fontSize: height * 0.25,
            color: isDark ? "#bfdbfe" : "#1a2e6b",
            letterSpacing: "0.01em",
            lineHeight: 1.3,
          }}
        >
          Financial Services Private Limited
        </span>
        <span
          style={{
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: height * 0.23,
            color: "#C9A84C",
            letterSpacing: "0.01em",
            lineHeight: 1.3,
          }}
        >
          Empowering Your Financial Future
        </span>
      </span>
    </span>
  );
}
