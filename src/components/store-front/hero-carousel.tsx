"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react"

import { carouselItems } from "@/data/carousel-items"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

export function HeroCarousel(): JSX.Element {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(carouselItems.length)

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = (index: number) => {
    api?.scrollTo(index)
  }

  const scrollPrev = () => {
    api?.scrollPrev()
  }

  const scrollNext = () => {
    api?.scrollNext()
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border/40 shadow-2xl bg-zinc-950">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          loop: true,
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselItems.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative">
              {/* Slide Container */}
              <div className="relative flex min-h-[500px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[640px] w-full items-center overflow-hidden">
                {/* Background Image */}
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                />

                {/* Left/Center Vignette & Gradient Overlay for Perfect Typography Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/25 sm:w-4/5 lg:w-2/3" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

                {/* Content Overlay */}
                <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center space-y-4 p-6 sm:space-y-5 sm:p-10 md:p-14 lg:p-16">
                  {/* Badge */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                      <Sparkles className="size-3.5 text-amber-400" />
                      <span>{slide.badge}</span>
                    </div>
                  </div>

                  {/* Heading */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12] drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-amber-200/90 leading-snug">
                    {slide.subtitle}
                  </p>

                  {/* Description */}
                  <p className="hidden sm:block text-xs sm:text-sm md:text-base text-zinc-300/90 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-semibold shadow-lg shadow-amber-500/25 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base transition-all hover:scale-[1.02]"
                    >
                      <Link href={slide.ctaHref}>
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-md px-5 sm:px-7 py-5 sm:py-6 text-sm sm:text-base font-medium transition-all"
                    >
                      <Link href={slide.secondaryCtaHref}>
                        {slide.secondaryCtaText}
                      </Link>
                    </Button>
                  </div>

                  {/* Trust Badges Bar */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-zinc-300/80 pt-3 border-t border-white/15">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="size-3.5 text-amber-400" />
                      100% Натуральные камни
                    </span>
                    <span className="hidden sm:inline text-white/30">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Truck className="size-3.5 text-amber-400" />
                      Доставка по Алматы и РК
                    </span>
                    <span className="hidden sm:inline text-white/30">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Gift className="size-3.5 text-amber-400" />
                      Подарочный футляр в подарок
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide Counter (Top Right) */}
      <div className="absolute right-4 top-4 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
        <span className="font-bold text-amber-400">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/40">/</span>
        <span>{String(count).padStart(2, "0")}</span>
      </div>

      {/* Left Navigation Arrow */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollPrev}
        aria-label="Предыдущий слайд"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 size-10 sm:size-12 rounded-full border-white/20 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-105 shadow-xl"
      >
        <ChevronLeft className="size-5" />
      </Button>

      {/* Right Navigation Arrow */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollNext}
        aria-label="Следующий слайд"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 size-10 sm:size-12 rounded-full border-white/20 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-105 shadow-xl"
      >
        <ChevronRight className="size-5" />
      </Button>

      {/* Bottom Slide Indicators / Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {carouselItems.map((_, idx) => {
          const isActive = current === idx
          return (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Перейти к слайду ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isActive
                  ? "w-8 bg-amber-400 shadow-md shadow-amber-400/50"
                  : "w-2 bg-white/40 hover:bg-white/70"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
