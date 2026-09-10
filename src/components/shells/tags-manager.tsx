"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export interface MineralTag {
  id: string
  name: string
  category: string
  productCount: number
  description: string
  createdAt: string
}

const INITIAL_TAGS: MineralTag[] = [
  {
    id: "tag-1",
    name: "#вулканическая_лава",
    category: "Базовые минералы",
    productCount: 48,
    description: "Заземление, снятие стресса, связь с огненной стихией Земли",
    createdAt: "2026-06-01",
  },
  {
    id: "tag-2",
    name: "#черный_агат",
    category: "Обереги и защита",
    productCount: 36,
    description: "Мощный энергетический щит от сглаза и негатива",
    createdAt: "2026-06-05",
  },
  {
    id: "tag-3",
    name: "#тигровый_глаз",
    category: "Успех и достаток",
    productCount: 29,
    description: "Притяжение удачи, концентрация воли, финансовая уверенность",
    createdAt: "2026-06-10",
  },
  {
    id: "tag-4",
    name: "#малахит",
    category: "Самоцветы",
    productCount: 19,
    description: "Трансформация, открытие сердечной чакры (Анахата), гармония",
    createdAt: "2026-06-15",
  },
  {
    id: "tag-5",
    name: "#шунгит",
    category: "Обереги и защита",
    productCount: 24,
    description: "Нейтрализация электромагнитных излучений, очищение биополя",
    createdAt: "2026-06-20",
  },
  {
    id: "tag-6",
    name: "#рудракша",
    category: "Духовные практики",
    productCount: 18,
    description: "Священные зерна для глубокой медитации, спокойствия ума и ясности",
    createdAt: "2026-06-25",
  },
  {
    id: "tag-7",
    name: "#горный_хрусталь",
    category: "Кристаллы",
    productCount: 15,
    description: "Усиление намерений, кристальная чистота мыслей, космическая связь",
    createdAt: "2026-07-01",
  },
  {
    id: "tag-8",
    name: "#барочный_жемчуг",
    category: "Органические минералы",
    productCount: 12,
    description: "Женская интуиция, мягкая чувственность и природное сияние",
    createdAt: "2026-07-05",
  },
  {
    id: "tag-9",
    name: "#пирит",
    category: "Успех и достаток",
    productCount: 14,
    description: "Камень огненной энергии, богатства и решительных действий",
    createdAt: "2026-07-10",
  },
  {
    id: "tag-10",
    name: "#нефрит",
    category: "Гармония и здоровье",
    productCount: 21,
    description: "Камень благородства, долголетия и внутренней гармонии",
    createdAt: "2026-07-15",
  },
]

export function TagsManager() {
  const { toast } = useToast()
  const [tags, setTags] = React.useState<MineralTag[]>(INITIAL_TAGS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [currentTag, setCurrentTag] = React.useState<MineralTag | null>(null)

  // Form states
  const [tagName, setTagName] = React.useState("")
  const [tagCategory, setTagCategory] = React.useState("Базовые минералы")
  const [tagDescription, setTagDescription] = React.useState("")

  const filteredTags = React.useMemo(() => {
    if (!searchQuery.trim()) return tags
    const q = searchQuery.toLowerCase()
    return tags.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
  }, [tags, searchQuery])

  const totalProductsLinked = React.useMemo(() => {
    return tags.reduce((sum, t) => sum + t.productCount, 0)
  }, [tags])

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) return

    const formattedName = tagName.trim().startsWith("#")
      ? tagName.trim().toLowerCase().replace(/\s+/g, "_")
      : `#${tagName.trim().toLowerCase().replace(/\s+/g, "_")}`

    const newTag: MineralTag = {
      id: `tag-${Date.now()}`,
      name: formattedName,
      category: tagCategory.trim() || "Минералы",
      productCount: 0,
      description: tagDescription.trim() || "Энергетический минерал",
      createdAt: new Date().toISOString().split("T")[0] ?? "2026-09-09",
    }

    setTags((prev) => [newTag, ...prev])
    setTagName("")
    setTagDescription("")
    setIsAddOpen(false)
    toast({
      title: "Тег успешно добавлен",
      description: `Тег ${formattedName} привязан к системе тегов магазина.`,
    })
  }

  const handleEditTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentTag || !tagName.trim()) return

    const formattedName = tagName.trim().startsWith("#")
      ? tagName.trim().toLowerCase().replace(/\s+/g, "_")
      : `#${tagName.trim().toLowerCase().replace(/\s+/g, "_")}`

    setTags((prev) =>
      prev.map((t) =>
        t.id === currentTag.id
          ? {
              ...t,
              name: formattedName,
              category: tagCategory.trim() || t.category,
              description: tagDescription.trim() || t.description,
            }
          : t
      )
    )
    setIsEditOpen(false)
    setCurrentTag(null)
    toast({
      title: "Тег обновлен",
      description: `Изменения для ${formattedName} успешно сохранены.`,
    })
  }

  const handleDeleteTag = (id: string, name: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id))
    toast({
      title: "Тег удален",
      description: `Тег ${name} удален из каталога.`,
    })
  }

  const openEditDialog = (tag: MineralTag) => {
    setCurrentTag(tag)
    setTagName(tag.name)
    setTagCategory(tag.category)
    setTagDescription(tag.description)
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Активных тегов камней
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            {tags.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Все свойства и классификации минералов
          </div>
        </Card>
        <Card className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Товаров привязано
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            {totalProductsLinked}
          </div>
          <div className="text-xs text-muted-foreground">
            Браслеты, чётки, чокеры и кольца
          </div>
        </Card>
        <Card className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Категорий минералов
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            {new Set(tags.map((t) => t.category)).size}
          </div>
          <div className="text-xs text-muted-foreground">
            Обереги, Чакры, Достаток, Кристаллы
          </div>
        </Card>
      </div>

      {/* Main tags panel */}
      <Card className="rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
                Теги камней и минералов
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Управление метками натуральных камней, свойствами и привязкой к талисманам
              </CardDescription>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="h-9 gap-2">
                  <Icons.plusCircle className="size-4" />
                  <span>Добавить тег</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleAddTag}>
                  <DialogHeader>
                    <DialogTitle>Добавить новый тег минерала</DialogTitle>
                    <DialogDescription>
                      Введите название минерала или энергии, категорию и ключевые метафизические свойства.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tag-name">Название тега (напр. лазурит, чароит)</Label>
                      <Input
                        id="tag-name"
                        placeholder="#лазурит"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tag-cat">Группа / Направление</Label>
                      <Input
                        id="tag-cat"
                        placeholder="Обереги и защита"
                        value={tagCategory}
                        onChange={(e) => setTagCategory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tag-desc">Свойства и действие камня</Label>
                      <Input
                        id="tag-desc"
                        placeholder="Интуиция, вдохновение, гармонизация горловой чакры (Вишудха)"
                        value={tagDescription}
                        onChange={(e) => setTagDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button type="submit">Создать тег</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search bar */}
          <div className="pt-2">
            <div className="relative max-w-sm">
              <Icons.search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по тегам, минералам или свойствам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Тег</th>
                    <th className="px-4 py-3">Группа</th>
                    <th className="px-4 py-3">Свойства камня</th>
                    <th className="px-4 py-3 text-center">Товаров</th>
                    <th className="px-4 py-3">Создан</th>
                    <th className="px-4 py-3 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTags.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-24 text-center text-muted-foreground">
                        Теги не найдены по заданному запросу.
                      </td>
                    </tr>
                  ) : (
                    filteredTags.map((tag) => (
                      <tr key={tag.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {tag.name}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                            {tag.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-md truncate text-muted-foreground">
                          {tag.description}
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {tag.productCount}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {tag.createdAt}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label="Открыть меню"
                              >
                                <Icons.dotsHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openEditDialog(tag)}
                              >
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => handleDeleteTag(tag.id, tag.name)}
                              >
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleEditTag}>
            <DialogHeader>
              <DialogTitle>Редактировать тег</DialogTitle>
              <DialogDescription>
                Измените название, категорию или описание свойств камня.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tag-name">Название тега</Label>
                <Input
                  id="edit-tag-name"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tag-cat">Группа</Label>
                <Input
                  id="edit-tag-cat"
                  value={tagCategory}
                  onChange={(e) => setTagCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tag-desc">Свойства минерала</Label>
                <Input
                  id="edit-tag-desc"
                  value={tagDescription}
                  onChange={(e) => setTagDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
