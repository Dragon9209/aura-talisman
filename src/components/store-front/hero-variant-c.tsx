"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IntentOption {
  id: string
  label: string
  title: string
  chakra: string
  description: string
  minerals: string
  price: string
  image: string
  href: string
}

const intentOptions: IntentOption[] = [
  {
    id: "protection",
    label: "Защита и сила",
    title: "Браслет из вулканической лавы и агата",
    chakra: "Корневой центр • Муладхара",
    description:
      "Мощный защитный оберег. Пористая вулканическая лава стабилизирует эмоции и заземляет, а матовый агат укрепляет внутреннюю стойкость в стрессовых ситуациях.",
    minerals: "Вулканическая лава, чёрный агат, серебро 925",
    price: "15 900 ₸",
    image: "/images/carousel/1.jpg",
    href: "/kategorie/bransoletki",
  },
  {
    id: "wealth",
    label: "Изобилие и успех",
    title: "Талисман из золотистого пирита и тигрового глаза",
    chakra: "Центр воли и достатка • Манипура",
    description:
      "Древний камень лидеров и купцов. Золотистый пирит активирует энергию изобилия, а шелковистый тигровый глаз обостряет деловую интуицию и привлекает успех.",
    minerals: "Искрящийся пирит, тигровый глаз ювелирной огранки",
    price: "17 500 ₸",
    image: "/images/carousel/3.jpg",
    href: "/kategorie/bransoletki",
  },
  {
    id: "love",
    label: "Любовь и гармония",
    title: "Чокер из натурального уральского малахита",
    chakra: "Сердечный центр • Анахата",
    description:
      "Глубокие изумрудные узоры природного малахита раскрывают женственность, открывают сердце для искренней любви и защищают биополе своей владелицы.",
    minerals: "Цельный уральский малахит, ювелирный амулет «Солнце»",
    price: "18 900 ₸",
    image: "/images/products/naszyjniki/choker-malachit-1.jpg",
    href: "/kategorie/naszyjniki",
  },
  {
    id: "meditation",
    label: "Осознанность и мала",
    title: "Священные чётки Мала 108 бусин",
    chakra: "Центр мудрости • Аджна",
    description:
      "Традиционные гималайские чётки для глубоких медитаций, чтения мантр и концентрации. Дарят ясность мыслей, душевный покой и внутреннее равновесие.",
    minerals: "Гималайская рудракша 5 Мукхи, лазурит, сандал",
    price: "24 500 ₸",
    image: "/images/carousel/2.jpg",
    href: "/kategorie/chetki",
  },
  {
    id: "chakras",
    label: "Баланс 7 чакр",
    title: "Комплексный талисман «7 чакр»",
    chakra: "Гармония всех энергоцентров",
    description:
      "Семь сакральных камней в одном гармоничном изделии: яшма, сердолик, тигровый глаз, малахит, бирюза, лазурит и аметист для комплексной перезагрузки биополя.",
    minerals: "7 природных самоцветов, вулканическая лава",
    price: "16 900 ₸",
    image: "/images/carousel/6.jpg",
    href: "/kategorie/bransoletki",
  },
]

export function HeroVariantC(): JSX.Element {
  const [selectedIntentId, setSelectedIntentId] = React.useState<string>("love")
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

  // Auto-switch every 8.5 seconds (slower pace for comfortable reading)
  React.useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setSelectedIntentId((currentId) => {
        const currentIndex = intentOptions.findIndex((o) => o.id === currentId)
        const nextIndex = (currentIndex + 1) % intentOptions.length
        return intentOptions[nextIndex].id
      })
    }, 8500)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentOption =
    intentOptions.find((o) => o.id === selectedIntentId) ?? intentOptions[0]

  const handleSelect = (id: string) => {
    setSelectedIntentId(id)
  }

  return (
    <section className="relative w-full space-y-9 pt-2 pb-4">
      {/* 1. Clean Editorial Header - Single line title on desktop */}
      <div className="mx-auto max-w-5xl text-center space-y-3 px-4">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight whitespace-normal sm:whitespace-nowrap">
          Камни, которые{" "}
          <span className="italic font-semibold text-amber-700 dark:text-amber-400">
            выбирают вас
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
          Подберите природный талисман под ваше намерение. Ручная работа мастера и живая энергия натуральных камней.
        </p>

        {/* 2. Minimalist Transparent Intent Pills - No beige background */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
          {intentOptions.map((option) => {
            const isSelected = option.id === selectedIntentId
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm sm:text-base transition-all duration-300 bg-transparent",
                  isSelected
                    ? "border-2 border-zinc-900 text-zinc-950 font-semibold shadow-sm dark:border-zinc-100 dark:text-zinc-50"
                    : "border border-zinc-300/80 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100"
                )}
              >
                {isSelected && (
                  <span className="size-1.5 rounded-full bg-amber-700 dark:bg-amber-400" />
                )}
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Spacious, Minimalist Hero Showcase (Pauses rotation on hover) */}
      <div
        className="mx-auto max-w-5xl px-4"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-[#FCFBF9] dark:bg-zinc-900/60 shadow-sm flex flex-col md:flex-row items-center">
          {/* Left: Clean, Large Jewelry Photo */}
          <div className="relative h-80 sm:h-96 md:h-[480px] w-full md:w-1/2 shrink-0 overflow-hidden bg-stone-100">
            <Image
              key={currentOption.id}
              src={currentOption.image}
              alt={currentOption.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-700 ease-out hover:scale-105"
            />
          </div>

          {/* Right: Elegant Typography & CTA - Scaled up font sizes */}
          <div className="flex flex-1 flex-col justify-between p-7 sm:p-10 md:p-12 space-y-6 w-full">
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {currentOption.chakra}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-[34px] lg:text-4xl font-normal text-zinc-900 dark:text-zinc-100 leading-tight">
                {currentOption.title}
              </h3>

              <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">
                {currentOption.description}
              </p>

              <div className="pt-1 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Состав: </span>
                {currentOption.minerals}
              </div>
            </div>

            {/* Price & Warm Luxury Button */}
            <div className="pt-5 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider font-medium block">
                  Стоимость
                </span>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                  {currentOption.price}
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-full bg-amber-700 hover:bg-amber-800 text-white font-medium px-8 py-6 text-base shadow-sm transition-all hover:scale-[1.02]"
              >
                <Link href={currentOption.href}>
                  <span>Смотреть изделие</span>
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Single Elegant Trust Line - Strictly single line on desktop */}
      <div className="mx-auto w-full max-w-6xl px-2 sm:px-4 pt-3 pb-2 text-center">
        <div className="flex flex-nowrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-7 whitespace-nowrap font-serif text-[15px] sm:text-[17px] md:text-[18px] font-medium tracking-[0.015em] text-zinc-950 dark:text-zinc-50 overflow-x-auto no-scrollbar py-1">
          <span className="inline-flex items-center gap-2 shrink-0">
            <Sparkles className="size-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>100% Натуральные минералы</span>
          </span>
          <span className="text-zinc-400 dark:text-zinc-600 select-none shrink-0">•</span>
          <span className="shrink-0">Бесплатная примерка по Алматы</span>
          <span className="text-zinc-400 dark:text-zinc-600 select-none shrink-0">•</span>
          <span className="shrink-0">Подарочный футляр</span>
          <span className="text-zinc-400 dark:text-zinc-600 select-none shrink-0">•</span>
          <span className="shrink-0">Очищение поющими чашами</span>
        </div>
      </div>
    </section>
  )
}
