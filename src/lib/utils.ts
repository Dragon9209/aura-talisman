import { clsx, type ClassValue } from "clsx"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "PLN" | "KZT"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "KZT", notation = "standard" } = options

  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

export function formatId(id: string) {
  return `#${id.padStart(4, "0")}`
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function slugify(str: string): string {
  const translitMap: { [key: string]: string } = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
  }

  return str
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function unslugify(str: string): string {
  return str.replace(/-/g, " ")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function translateFilterNamesToPolish(name: string): string {
  const nameTranslations: Record<string, string> = {
    orders: "заказам",
    customers: "клиентам",
    products: "товарам",
    category: "категориям",
    names: "названию",
    subcategories: "подкатегориям",
    tags: "тегам",
    email: "email",
    "adresy email": "email",
  }

  return nameTranslations[name.toLowerCase()] || name
}

export function translateColumnNamesToPolish(name: string): string {
  const nameTranslations: Record<string, string> = {
    id: "ID",
    name: "Название",
    email: "Email",
    role: "Роль",
    customer: "Клиент",
    category: "Категория",
    categoryName: "Категория",
    subcategoryName: "Подкатегория",
    price: "Цена",
    status: "Статус оплаты",
    state: "Статус",
    importance: "Приоритет",
    inventory: "Остаток",
    quantity: "Количество",
    amount: "Сумма",
    visibility: "Видимость",
    createdAt: "Дата добавления",
    updatedAt: "Дата изменения",
    totalspent: "Сумма покупок",
    orderplaced: "Кол-во заказов",
  }

  return nameTranslations[name] || nameTranslations[name.toLowerCase()] || name
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export function generateId(length = 32) {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length
  )()
}
