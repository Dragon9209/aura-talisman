export interface CarouselSlide {
  id: string
  badge: string
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
  src: string
  tag: string
}

export const carouselItems: CarouselSlide[] = [
  {
    id: "slide-1",
    tag: "Вулканическая лава & Агат",
    badge: "✦ КОЛЛЕКЦИЯ ЭНЕРГЕТИЧЕСКИХ ТАЛИСМАНОВ",
    title: "Сила природных минералов и энергия стихий",
    subtitle: "Авторские браслеты из вулканической лавы, нефрита и натуральных самоцветов",
    description:
      "Каждое изделие собирается вручную и заряжается на защиту от негатива, внутреннее спокойствие и притяжение достатка.",
    ctaText: "Смотреть коллекцию",
    ctaHref: "/kategorie/bransoletki",
    secondaryCtaText: "Подобрать браслет",
    secondaryCtaHref: "/kategorie/bransoletki",
    src: "/images/carousel/1.jpg",
  },
  {
    id: "slide-2",
    tag: "Священная Рудракша",
    badge: "✦ ДУХОВНЫЕ ПРАКТИКИ И МЕДИТАЦИЯ",
    title: "Священные чётки Мала 108 бусин для ясности ума",
    subtitle: "Традиционные чётки из гималайской рудракши, лазурита и сандала",
    description:
      "Мощный духовный оберег для концентрации, повторения аффирмаций и глубокого погружения в практики медитации.",
    ctaText: "Каталог чёток",
    ctaHref: "/kategorie/chetki",
    secondaryCtaText: "О свойствах Малы",
    secondaryCtaHref: "/kategorie/chetki",
    src: "/images/carousel/2.jpg",
  },
  {
    id: "slide-3",
    tag: "Тигровый глаз & Пирит",
    badge: "✦ ТАЛИСМАНЫ ИЗОБИЛИЯ И УСПЕХА",
    title: "Притяжение финансового роста и несокрушимая стойкость",
    subtitle: "Золотистый пирит и переливчатый тигровый глаз в авторском исполнении",
    description:
      "Пирит с древности называют камнем купцов и победителей, а тигровый глаз оберегает от зависти и обостряет деловую интуицию.",
    ctaText: "Выбрать талисман",
    ctaHref: "/kategorie/bransoletki",
    secondaryCtaText: "Камни изобилия",
    secondaryCtaHref: "/kategorie/bransoletki",
    src: "/images/carousel/3.jpg",
  },
  {
    id: "slide-4",
    tag: "Уральский малахит",
    badge: "✦ ЖЕНСКИЕ ОБЕРЕГИ И ЧОКЕРЫ",
    title: "Натуральный малахит и природные самоцветы",
    subtitle: "Глубокие изумрудные узоры для гармонии сердечной чакры (Анахата)",
    description:
      "Малахит исполняет заветные намерения, раскрывает женственность и защищает биополе своей обладательницы.",
    ctaText: "Смотреть колье",
    ctaHref: "/kategorie/naszyjniki",
    secondaryCtaText: "Все чокеры",
    secondaryCtaHref: "/kategorie/naszyjniki",
    src: "/images/carousel/4.jpg",
  },
  {
    id: "slide-5",
    tag: "Баланс 7 Центров",
    badge: "✦ ГАРМОНИЯ ВСЕХ ЭНЕРГЕТИЧЕСКИХ ЦЕНТРОВ",
    title: "Комплекс «7 Чакр» — баланс тела, мыслей и души",
    subtitle: "Семь сакральных камней в одном гармоничном изделии",
    description:
      "Яшма, сердолик, тигровый глаз, малахит, бирюза, лазурит и аметист. Комплексная активация жизненных ресурсов.",
    ctaText: "Заказать 7 Чакр",
    ctaHref: "/kategorie/bransoletki",
    secondaryCtaText: "Узнать о чакрах",
    secondaryCtaHref: "/kategorie/bransoletki",
    src: "/images/carousel/6.jpg",
  },
]
