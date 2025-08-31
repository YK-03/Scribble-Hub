import React from "react";
import { useTheme } from "./ThemeProvider";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <footer
      className={
        `w-full border-t px-4 py-5 flex items-center justify-center bg-transparent ` +
        (isDark
          ? "border-[#232b3e] bg-[#181c2a] text-[#b0b0b0]"
          : "border-[#e5e7eb] bg-[#f8fafc] text-[#444]")
      }
      style={{
        minHeight: 56,
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: 0.2,
      }}
    >
      <span className="flex items-center gap-2 text-center select-none">
        Developed
        by
        <span
          style={{
            fontWeight: 600,
            color: isDark ? "#a78bfa" : "#7c3aed",
            
          }}
        >Yash Kaushik
        </span>
      </span>
    </footer>
  );
};

export default Footer;
