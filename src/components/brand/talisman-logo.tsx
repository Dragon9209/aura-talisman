import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TalismanLogoProps {
  className?: string
  iconClassName?: string
  showSubtitle?: boolean
  variant?: "horizontal" | "stacked"
}

export function TalismanLogo({
  className,
  iconClassName,
  showSubtitle = false,
  variant = "horizontal",
}: TalismanLogoProps): JSX.Element {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-90 select-none",
        variant === "stacked" && "flex-col items-center gap-1.5 text-center",
        className
      )}
    >
      {/* Sacred Geometry Energy Talisman Symbol */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "size-8 text-amber-700 dark:text-amber-400 transition-transform duration-700 ease-out group-hover:rotate-45 group-hover:scale-105",
            iconClassName
          )}
        >
          {/* Subtle Outer Energy Aura Orbitals */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 3"
            className="opacity-50"
          />
          <circle
            cx="20"
            cy="20"
            r="15"
            stroke="currentColor"
            strokeWidth="0.8"
            className="opacity-70"
          />

          {/* 8-Ray Sacred Radiant Star (Talisman Axis) */}
          <path
            d="M20 2 L22.8 15.5 L36 20 L22.8 24.5 L20 38 L17.2 24.5 L4 20 L17.2 15.5 Z"
            fill="currentColor"
          />
          <path
            d="M20 8 L22 17 L29 20 L22 23 L20 32 L18 23 L11 20 L18 17 Z"
            fill="currentColor"
            className="opacity-60"
            transform="rotate(45 20 20)"
          />
          <path
            d="M20 7 L21.8 16.5 L28 20 L21.8 23.5 L20 33 L18.2 23.5 L12 20 L18.2 16.5 Z"
            fill="#FFFFFF"
            className="dark:fill-zinc-950"
          />

          {/* Central Sacred Crystal Diamond */}
          <rect
            x="17.2"
            y="17.2"
            width="5.6"
            height="5.6"
            transform="rotate(45 20 20)"
            fill="currentColor"
          />
          <circle cx="20" cy="20" r="1.2" fill="#FFFFFF" className="dark:fill-zinc-950" />
        </svg>
      </div>

      {/* Typography: Luxury Mystical Expanded Font */}
      <div className={cn("flex flex-col", variant === "stacked" && "items-center")}>
        <div className="flex items-center tracking-[0.2em] font-['Cinzel_Decorative','Cinzel',Georgia,serif]">
          <span className="text-[21px] sm:text-[23px] font-black uppercase text-zinc-950 dark:text-zinc-50 leading-none">
            AURA
          </span>
          <span className="ml-2.5 font-['Cinzel',Georgia,serif] text-[18px] sm:text-[20px] font-bold uppercase tracking-[0.24em] text-zinc-800 dark:text-zinc-200 leading-none">
            TALISMAN
          </span>
        </div>

        {showSubtitle && (
          <span className="font-['Cinzel',serif] text-[8.5px] uppercase tracking-[0.42em] text-amber-700/90 dark:text-amber-400/90 font-bold mt-1">
            SACRED ENERGY JEWELLERY
          </span>
        )}
      </div>
    </Link>
  )
}
