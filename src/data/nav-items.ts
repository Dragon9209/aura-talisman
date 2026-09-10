import { type NavItem } from "@/types"

export const mainNavItems = [
  {
    title: "Браслеты",
    slug: "bransoletki",
    href: "/kategorie/bransoletki",
    description: "Энергетические браслеты из камней",
    subItems: [
      {
        title: "Из вулканической лавы",
        description: "Очищение и внутренняя сила",
        slug: "lava",
        href: "/kategorie/bransoletki",
      },
      {
        title: "По 7 чакрам",
        description: "Гармония центров энергии",
        slug: "chakry",
        href: "/kategorie/bransoletki",
      },
      {
        title: "На достаток и успех",
        description: "Тигровый глаз, пирит, цитрин",
        slug: "izobilie",
        href: "/kategorie/bransoletki",
      },
      {
        title: "Все браслеты-талисманы",
        description: "Полный каталог браслетов",
        slug: "wszystkie",
        href: "/kategorie/bransoletki",
      },
    ],
  },
  {
    title: "Чётки и малы",
    slug: "chetki",
    href: "/kategorie/chetki",
    description: "Чётки для духовных практик",
    subItems: [
      {
        title: "108 бусин (мала)",
        description: "Для глубоких медитаций",
        slug: "108-busin",
        href: "/kategorie/chetki",
      },
      {
        title: "33 бусины",
        description: "Компактные карманные чётки",
        slug: "33-businy",
        href: "/kategorie/chetki",
      },
      {
        title: "Лава и рудракша",
        description: "Традиционные священные семена",
        slug: "rudraksha",
        href: "/kategorie/chetki",
      },
      {
        title: "Все чётки",
        description: "Смотреть всю коллекцию",
        slug: "wszystkie",
        href: "/kategorie/chetki",
      },
    ],
  },
  {
    title: "Чокеры и колье",
    slug: "naszyjniki",
    href: "/kategorie/naszyjniki",
    description: "Авторские колье из самоцветов",
    subItems: [
      {
        title: "Натуральный малахит",
        description: "Камень преображения и защиты",
        slug: "malahit",
        href: "/kategorie/naszyjniki",
      },
      {
        title: "Коралл и нефрит",
        description: "Спокойствие и долголетие",
        slug: "koral",
        href: "/kategorie/naszyjniki",
      },
      {
        title: "Барочный жемчуг",
        description: "Нежность и природная грация",
        slug: "zhemchug",
        href: "/kategorie/naszyjniki",
      },
      {
        title: "Все колье и чокеры",
        description: "Смотреть каталог колье",
        slug: "wszystkie",
        href: "/kategorie/naszyjniki",
      },
    ],
  },
  {
    title: "Серьги и кольца",
    slug: "kolczyki",
    href: "/kategorie/kolczyki",
    description: "Украшения с кристаллами",
    subItems: [
      {
        title: "Горный хрусталь",
        description: "Чистота и ясность мыслей",
        slug: "hrustal",
        href: "/kategorie/kolczyki",
      },
      {
        title: "Сырой пирит",
        description: "Природные золотистые друзы",
        slug: "pirit",
        href: "/kategorie/kolczyki",
      },
      {
        title: "Яшма и серебро",
        description: "Авторская фактурная оправа",
        slug: "yashma",
        href: "/kategorie/kolczyki",
      },
      {
        title: "Все серьги",
        description: "Смотреть каталог серег",
        slug: "wszystkie",
        href: "/kategorie/kolczyki",
      },
    ],
  },
] satisfies NavItem[]

export const sidebarNavItems = [] satisfies NavItem[]

export const footerNavItems = [
  {
    title: "О бренде",
    href: "/",
    subItems: [
      {
        title: "О мастере",
        href: "/",
        external: false,
      },
      {
        title: "Сила минералов",
        href: "/",
        external: false,
      },
      {
        title: "Контакты",
        href: "/",
        external: false,
      },
    ],
  },
  {
    title: "Покупателям",
    href: "/",
    subItems: [
      {
        title: "Условия заказа",
        href: "/",
        external: false,
      },
      {
        title: "Политика конфиденциальности",
        href: "/",
        external: false,
      },
      {
        title: "Частые вопросы (FAQ)",
        href: "/",
        external: false,
      },
    ],
  },
  {
    title: "Сервис",
    href: "/",
    subItems: [
      {
        title: "Личный кабинет",
        href: "/",
        external: false,
      },
      {
        title: "Доставка и оплата по Казахстану",
        href: "/",
        external: false,
      },
      {
        title: "Индивидуальный подбор камней",
        href: "/",
        external: false,
      },
    ],
  },
] satisfies NavItem[]

export const adminNavItems = [
  {
    title: "Панель управления",
    slug: "admin",
    href: "/admin",
    icon: "dashboard",
    external: false,
    disabled: false,
  },
  {
    title: "Заказы",
    slug: "zamowienia",
    href: "/admin/zamowienia",
    icon: "shoppingCart",
    external: false,
    disabled: false,
  },
  {
    title: "Товары и талисманы",
    slug: "produkty",
    href: "/admin/produkty",
    icon: "box",
    external: false,
    disabled: false,
  },
  {
    title: "Категории",
    slug: "kategorie",
    href: "/admin/kategorie",
    icon: "categories",
    external: false,
    disabled: false,
  },
  {
    title: "Подкатегории",
    slug: "podkategorie",
    href: "/admin/podkategorie",
    icon: "subcategories",
    external: false,
    disabled: false,
  },
  {
    title: "Теги камней",
    slug: "tagi",
    href: "/admin/tagi",
    icon: "tag",
    external: false,
    disabled: false,
  },
  {
    title: "Покупатели",
    slug: "klienci",
    href: "/admin/klienci",
    icon: "users",
    external: false,
    disabled: false,
  },
  {
    title: "Пользователи",
    slug: "uzytkownicy",
    href: "/admin/uzytkownicy",
    icon: "userCog",
    external: false,
    disabled: false,
  },
  {
    title: "Статистика и отчеты",
    slug: "statystyki",
    href: "/admin/statystyki",
    icon: "barChart",
    external: false,
    disabled: false,
  },
  {
    title: "Промокоды и акции",
    slug: "promocje",
    href: "/admin/promocje",
    icon: "percent",
    external: false,
    disabled: false,
  },
  {
    title: "Витрина магазина",
    slug: "sklep",
    href: "/",
    icon: "home",
    external: false,
    disabled: false,
  },
] satisfies NavItem[]

export const clientSettingsNavItems = [
  {
    title: "Личные данные",
    href: "/panel-klienta/ustawienia/dane-osobowe",
    slug: "dane-osobowe",
    external: false,
  },
  {
    title: "Адреса доставки",
    href: "/panel-klienta/ustawienia/adresy-wysylki",
    slug: "adresy-wysylki",
    external: false,
  },
  {
    title: "Способы оплаты",
    href: "/panel-klienta/ustawienia/metody-platnosci",
    slug: "metody-platnosci",
    external: false,
  },
  {
    title: "Смена пароля",
    href: "/panel-klienta/ustawienia/zmiana-hasla",
    slug: "zmiana-hasla",
    external: false,
  },
  {
    title: "Удаление аккаунта",
    href: "/panel-klienta/ustawienia/usuwanie-konta",
    slug: "usuwanie-konta",
    external: false,
  },
] satisfies NavItem[]
