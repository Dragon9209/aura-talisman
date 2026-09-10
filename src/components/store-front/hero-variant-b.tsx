"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Compass,
  Flame,
  Gem,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ShowcaseItem {
  id: string
  name: string
  subtitle: string
  description: string
  stone: string
  chakra: string
  actionBadge: string
  price: string
  href: string
  image: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "lava",
    name: "Браслет из вулканической лавы & агата",
    subtitle: "Мощный щит от внешнего негатива и заземление",
    description: "Пористая лава сохраняет тепло и стабилизирует эмоциональное состояние, а матовый агат укрепляет силу духа.",
    stone: "Вулканическая лава • Черный агат",
    chakra: "Муладхара (Корневая)",
    actionBadge: "🛡 Заземление & Защита",
    price: "15 900 ₸",
    href: "/kategorie/bransoletki",
    image: "/images/carousel/1.jpg",
  },
  {
    id: "mala",
    name: "Священные чётки Мала 108 бусин",
    subtitle: "Ясность сознания, глубокие медитации и баланс",
    description: "Традиционные 108 бусин из гималайской рудракши и лазурита. Созданы для повторения мантр и фокусировки разума.",
    stone: "Гималайская Рудракша • Лазурит",
    chakra: "Аджна (Третий глаз)",
    actionBadge: "🧘 Ясность ума & Фокус",
    price: "24 500 ₸",
    href: "/kategorie/chetki",
    image: "/images/carousel/2.jpg",
  },
  {
    id: "malachite",
    name: "Чокер из природного уральского малахита",
    subtitle: "Гармония сердца, притяжение любви и достатка",
    description: "Шелковистый изумрудный узор натурального малахита. Раскрывает женственность, притягивает изобилие и вдохновение.",
    stone: "Натуральный малахит • Серебро 925",
    chakra: "Анахата (Сердечная)",
    actionBadge: "✨ Любовь & Изобилие",
    price: "18 900 ₸",
    href: "/kategorie/naszyjniki",
    image: "/images/products/naszyjniki/choker-malachit-1.jpg",
  },
  {
    id: "chakras",
    name: "Комплексный талисман «7 Чакр»",
    subtitle: "Гармонизация всех энергетических центров человека",
    description: "Семь сакральных самоцветов: яшма, сердолик, тигровый глаз, малахит, бирюза, лазурит и аметист в одном изделии.",
    stone: "7 сакральных минералов",
    chakra: "Все 7 энергоцентров",
    actionBadge: "🔮 Полная гармония",
    price: "16 900 ₸",
    href: "/kategorie/bransoletki",
    image: "/images/carousel/6.jpg",
  },
]

const marqueeItems = [
  "100% ПРИРОДНЫЕ МИНЕРАЛЫ",
  "ВУЛКАНИЧЕСКАЯ ЛАВА",
  "ГИМАЛАЙСКАЯ РУДРАКША",
  "УРАЛЬСКИЙ МАЛАХИТ",
  "ТИГРОВЫЙ ГЛАЗ И ПИРИТ",
  "СВЯЩЕННЫЕ ЧЁТКИ 108 БУСИН",
  "БЕСПЛАТНАЯ ДОСТАВКА С ПРИМЕРКОЙ",
  "ПОДАРОЧНЫЙ ФУТЛЯР К КАЖДОМУ ЗАКАЗУ",
  "ИНДИВИДУАЛЬНЫЙ ПОДБОР ПО ДАТЕ РОЖДЕНИЯ",
  "ОЧИЩЕНИЕ В ПОЮЩИХ ЧАШАХ",
]

export function HeroVariantB(): JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  // Auto-rotate items every 4.5 seconds unless paused by mouse hover
  React.useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseItems.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [isPaused])

  const activeItem = showcaseItems[activeIndex]

  return (
    <section className="relative w-full space-y-12 overflow-hidden pt-4 sm:pt-6">
      {/* 1. Aceternity Ambient Aura Background Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 -z-10 h-[550px] w-full max-w-7xl">
        {/* Warm Golden Aura */}
        <div className="absolute top-10 left-1/4 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl animate-aura-glow" />
        {/* Soft Emerald Aura */}
        <div className="absolute top-20 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl animate-aura-glow" style={{ animationDelay: "3s" }} />
        {/* Subtle Rosy Glow */}
        <div className="absolute -top-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-300/10 blur-3xl" />
      </div>

      {/* 2. Hero Split: Editorial Typography (Left) + Aceternity Showcase Card (Right) */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
        {/* Left Column (Editorial Content & CTAs) */}
        <div className="flex flex-col justify-center space-y-6 lg:col-span-6 xl:col-span-7">
          {/* Aceternity / Magic UI Shimmering Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 px-3.5 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-sm backdrop-blur-md transition-all hover:border-amber-500/60">
            <span className="flex size-2 rounded-full bg-amber-500 animate-ping" />
            <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span className="tracking-wide uppercase text-[11px] font-medium">
              Сакральная энергия природных минералов
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[1.12]">
              Природные талисманы и чётки ручной работы,{" "}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent italic">
                заряженные на силу и баланс
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl">
              Авторские изделия из натуральной вулканической лавы, уральского малахита,
              тигрового глаза и священной гималайской рудракши. Каждое изделие создается
              мастером в Алматы и очищается звуком поющих чаш.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Button
              asChild
              size="lg"
              className="group rounded-full bg-zinc-900 hover:bg-black text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-zinc-950 px-7 py-6 text-sm sm:text-base font-semibold shadow-xl shadow-zinc-900/15 transition-all hover:scale-[1.02]"
            >
              <Link href="/kategorie/bransoletki">
                <span>Выбрать свой талисман</span>
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-6 py-6 text-sm sm:text-base font-medium shadow-sm transition-all"
            >
              <Link href="/kategorie/chetki">
                <span>Каталог чёток 108 Мала</span>
              </Link>
            </Button>
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
            {/* Stars & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">4.98 / 5.0</span>
                <span className="ml-1 text-zinc-400">• 420+ отзывов в Казахстане</span>
              </div>
            </div>

            {/* Delivery badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Truck className="size-4 text-amber-600 dark:text-amber-400" />
              <span>Бесплатная примерка по Алматы и РК</span>
            </div>
          </div>
        </div>

        {/* Right Column (Aceternity Interactive Showcase Card) */}
        <div
          className="relative lg:col-span-6 xl:col-span-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Ambient Glow Behind Card */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/15 to-transparent blur-2xl opacity-60" />

          {/* Showcase Main Container */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-2xl transition-all">
            {/* Interactive Mineral Tabs Switcher */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-2 overflow-x-auto scrollbar-none">
              {showcaseItems.map((item, index) => {
                const isActive = activeIndex === index
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all shrink-0",
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-amber-500 dark:text-zinc-950 shadow-md font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                    )}
                  >
                    {item.id === "lava" && <Flame className="size-3 text-amber-400" />}
                    {item.id === "mala" && <Compass className="size-3 text-blue-400" />}
                    {item.id === "malachite" && <Gem className="size-3 text-emerald-400" />}
                    {item.id === "chakras" && <Sparkles className="size-3 text-purple-400" />}
                    <span>{item.name.split(" ")[0]} {item.name.split(" ")[1]}</span>
                  </button>
                )
              })}
            </div>

            {/* Product Image Area */}
            <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
              <Image
                key={activeItem.id}
                src={activeItem.image}
                alt={activeItem.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center transition-all duration-700 ease-out hover:scale-105"
              />

              {/* Floating Aceternity Badges */}
              {/* Badge 1: Top Right */}
              <div className="absolute top-4 right-4 z-10 animate-float-slow">
                <div className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 dark:bg-black/80 px-3 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 shadow-lg backdrop-blur-md">
                  <ShieldCheck className="size-3.5 text-amber-500" />
                  <span>100% Натуральный камень</span>
                </div>
              </div>

              {/* Badge 2: Bottom Left Action / Energy Badge */}
              <div className="absolute bottom-4 left-4 z-10 animate-float-delayed">
                <div className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/90 text-white px-3.5 py-1 text-xs font-semibold shadow-lg backdrop-blur-md">
                  <Sparkles className="size-3.5 text-amber-200" />
                  <span>{activeItem.actionBadge}</span>
                </div>
              </div>

              {/* Slide Counter Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-md">
                  0{activeIndex + 1} / 0{showcaseItems.length}
                </span>
              </div>
            </div>

            {/* Product Meta & Direct Action Bar */}
            <div className="space-y-3 p-5 sm:p-6 bg-white dark:bg-zinc-900">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {activeItem.name}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {activeItem.stone} • <span className="text-amber-600 dark:text-amber-400 font-semibold">{activeItem.chakra}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-zinc-400 block">Стоимость:</span>
                  <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {activeItem.price}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                {activeItem.description}
              </p>

              <div className="pt-2 flex items-center justify-between gap-3">
                {/* Progress Indicators */}
                <div className="flex items-center gap-1.5">
                  {showcaseItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Слайд ${idx + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        activeIndex === idx
                          ? "w-6 bg-amber-500"
                          : "w-2 bg-zinc-200 dark:bg-zinc-700"
                      )}
                    />
                  ))}
                </div>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs px-5 shadow-sm"
                >
                  <Link href={activeItem.href}>
                    <span>Смотреть изделие</span>
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Magic UI Infinite Marquee (Бегущая строка минералов) */}
      <div className="relative -mx-8 py-3.5 border-y border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        {/* Left & Right Gradient Mask for Smooth Fade Out */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee gap-8 items-center text-xs font-medium tracking-widest text-zinc-700 dark:text-zinc-300">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="hover:text-amber-600 transition-colors uppercase cursor-default">
                {item}
              </span>
              <span className="text-amber-500/60 text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bento Highlights: 3 Refined Feature Cards on Light Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:border-amber-500/40">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3.5 transition-transform group-hover:scale-110">
            <Gem className="size-5" />
          </div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            100% Природные камни
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Только цельные природные минералы без прессовки, стеклянных имитаций и синтетических красителей.
          </p>
        </div>

        <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:border-emerald-500/40">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3.5 transition-transform group-hover:scale-110">
            <Sparkles className="size-5" />
          </div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Очищение в поющих чашах
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Перед отправкой каждый талисман очищается вибрациями тибетских поющих чаш и заряжается на гармонию.
          </p>
        </div>

        <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-amber-500/40 hover:shadow-md">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 mb-3.5 transition-transform group-hover:scale-110">
            <HeartHandshake className="size-5" />
          </div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Доставка с примеркой по РК
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Бесплатная примерка курьером в Алматы и экспресс-доставка по всему Казахстану в бархатном футляре.
          </p>
        </div>
      </div>
    </section>
  )
}
