"use client"

import * as React from "react"
import { ReactLenis } from "@studio-freight/react-lenis"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({
  children,
}: Readonly<SmoothScrollProviderProps>) {
  return (
    <ReactLenis root options={{ lerp: 0.15, duration: 0.8, syncTouch: false }}>
      {children}
    </ReactLenis>
  )
}
