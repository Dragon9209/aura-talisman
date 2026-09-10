"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import type { StoredFile } from "@/types"
import { and, eq, not } from "drizzle-orm"

import { db, isDbConfigured } from "@/config/db"
import {
  psCheckIfCategoryExists,
  psCheckIfCategoryNameTaken,
  psCheckIfSubcategoryExists,
  psDeleteCategoryById,
  psDeleteSubcategoryById,
  psGetAllCategories,
  psGetAllSubcategories,
  psGetCategoryById,
  psGetCategoryByName,
  psGetSubcategoriesByCategoryId,
  psGetSubcategoriesByCategoryName,
  psGetSubcategoryById,
  psGetSubcategoryByName,
} from "@/db/prepared-statements/category"
import { mockCategories, mockSubcategories } from "@/data/mock-store-data"
import {
  categories,
  subcategories,
  type Category,
  type Subcategory,
} from "@/db/schema"
import {
  addCategoryFunctionSchema,
  addSubcategorySchema,
  checkIfCategoryExistsSchema,
  checkIfCategoryNameTakenSchema,
  checkIfSubcategoryExistsSchema,
  deleteCategorySchema,
  deleteSubcategorySchema,
  getCategoryByIdSchema,
  getCategoryByNameSchema,
  getSubcategoriesByCategoryIdSchema,
  getSubcategoriesByCategoryNameSchema,
  getSubcategoryByIdSchema,
  getSubcategoryByNameSchema,
  updateCategorySchema,
  updateSubcategorySchema,
  type AddCategoryInput,
  type AddSubcategoryInput,
  type CheckIfCategoryExistsInput,
  type CheckIfCategoryNameTakenInput,
  type CheckIfSubcategoryExistsInput,
  type DeleteCategoryInput,
  type DeleteSubcategoryInput,
  type GetCategoryByIdInput,
  type GetCategoryByNameInput,
  type GetSubcategoriesByCategoryIdInput,
  type GetSubcategoriesByCategoryNameInput,
  type GetSubcategoryByIdInput,
  type GetSubcategoryByNameInput,
  type UpdateCategoryInput,
  type UpdateSubcategoryInput,
} from "@/validations/category"

import { generateId } from "@/lib/utils"

export async function getCategoryById(
  rawInput: GetCategoryByIdInput
): Promise<Category | null> {
  const validatedInput = getCategoryByIdSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return mockCategories.find((c) => c.id === rawInput.id) || mockCategories[0] || null
  }

  try {
    noStore()
    const [category] = await psGetCategoryById.execute({
      id: validatedInput.data.id,
    })
    return category || mockCategories.find((c) => c.id === rawInput.id) || mockCategories[0] || null
  } catch (error) {
    return mockCategories.find((c) => c.id === rawInput.id) || mockCategories[0] || null
  }
}

export async function getSubcategoryById(
  rawInput: GetSubcategoryByIdInput
): Promise<Subcategory | null> {
  const validatedInput = getSubcategoryByIdSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return mockSubcategories.find((s) => s.id === rawInput.id) || mockSubcategories[0] || null
  }

  try {
    noStore()
    const [subcategory] = await psGetSubcategoryById.execute({
      id: validatedInput.data.id,
    })
    return subcategory || mockSubcategories.find((s) => s.id === rawInput.id) || mockSubcategories[0] || null
  } catch (error) {
    return mockSubcategories.find((s) => s.id === rawInput.id) || mockSubcategories[0] || null
  }
}

export async function getCategoryByName(
  rawInput: GetCategoryByNameInput
): Promise<Category | null> {
  const validatedInput = getCategoryByNameSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return mockCategories.find((c) => c.name.toLowerCase() === rawInput.name.toLowerCase()) || null
  }

  try {
    noStore()
    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.name,
    })

    return category || mockCategories.find((c) => c.name.toLowerCase() === rawInput.name.toLowerCase()) || null
  } catch (error) {
    return mockCategories.find((c) => c.name.toLowerCase() === rawInput.name.toLowerCase()) || null
  }
}

export async function getSubcategoryByName(
  rawInput: GetSubcategoryByNameInput
): Promise<Subcategory | null> {
  const validatedInput = getSubcategoryByNameSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return mockSubcategories.find((s) => s.name.toLowerCase() === rawInput.name.toLowerCase()) || null
  }

  try {
    noStore()
    const [subcategory] = await psGetSubcategoryByName.execute({
      name: validatedInput.data.name,
    })

    return subcategory || mockSubcategories.find((s) => s.name.toLowerCase() === rawInput.name.toLowerCase()) || null
  } catch (error) {
    return mockSubcategories.find((s) => s.name.toLowerCase() === rawInput.name.toLowerCase()) || null
  }
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isDbConfigured) return mockCategories
  try {
    noStore()
    const categories = await psGetAllCategories.execute()
    return categories && categories.length > 0 ? categories : mockCategories
  } catch (error) {
    return mockCategories
  }
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  if (!isDbConfigured) return mockSubcategories
  try {
    noStore()
    const subcategories = await psGetAllSubcategories.execute()
    return subcategories && subcategories.length > 0
      ? subcategories
      : mockSubcategories
  } catch (error) {
    return mockSubcategories
  }
}

export async function getSubcategoriesByCategoryId(
  rawInput: GetSubcategoriesByCategoryIdInput
): Promise<Subcategory[] | null> {
  try {
    const validatedInput =
      getSubcategoriesByCategoryIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    const subcategoriesByCategoryId =
      await psGetSubcategoriesByCategoryId.execute({
        categoryId: validatedInput.data.id,
      })

    return subcategoriesByCategoryId ? subcategoriesByCategoryId : null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting subcategories by category id")
  }
}

export async function getSubcategoriesByCategoryName(
  rawInput: GetSubcategoriesByCategoryNameInput
): Promise<Subcategory[] | null> {
  try {
    const validatedInput =
      getSubcategoriesByCategoryNameSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const subcategoriesByCategoryName =
      await psGetSubcategoriesByCategoryName.execute({
        categoryName: validatedInput.data.name,
      })

    return subcategoriesByCategoryName ? subcategoriesByCategoryName : null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting subcategories by category name")
  }
}

export async function checkIfCategoryNameTaken(
  rawInput: CheckIfCategoryNameTakenInput
): Promise<"invalid-input" | boolean> {
  const validatedInput = checkIfCategoryNameTakenSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    return mockCategories.some((c) => c.name.toLowerCase() === validatedInput.data.name.toLowerCase())
  }

  try {
    noStore()
    const nameTaken = await psCheckIfCategoryNameTaken.execute({
      name: validatedInput.data.name,
    })

    return nameTaken ? true : false
  } catch (error) {
    return mockCategories.some((c) => c.name.toLowerCase() === validatedInput.data.name.toLowerCase())
  }
}

export async function checkIfCategoryExists(
  rawInput: CheckIfCategoryExistsInput
): Promise<"invalid-input" | boolean> {
  const validatedInput = checkIfCategoryExistsSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    return mockCategories.some((c) => c.id === validatedInput.data.id)
  }

  try {
    noStore()
    const exists = await psCheckIfCategoryExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    return mockCategories.some((c) => c.id === validatedInput.data.id)
  }
}

export async function checkIfSubcategoryExists(
  rawInput: CheckIfSubcategoryExistsInput
): Promise<"invalid-input" | boolean> {
  const validatedInput = checkIfSubcategoryExistsSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    return mockSubcategories.some((s) => s.id === validatedInput.data.id)
  }

  try {
    noStore()
    const exists = await psCheckIfSubcategoryExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    return mockSubcategories.some((s) => s.id === validatedInput.data.id)
  }
}

export async function addCategory(
  rawInput: AddCategoryInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  const validatedInput = addCategoryFunctionSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const exists = mockCategories.some(
      (c) => c.name.toLowerCase() === validatedInput.data.name.toLowerCase()
    )
    if (exists) return "exists"
    mockCategories.push({
      id: generateId(),
      name: validatedInput.data.name.toLowerCase(),
      description: validatedInput.data.description ?? null,
      visibility: validatedInput.data.visibility,
      images: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    revalidatePath("/")
    revalidatePath("/admin/kategorie")
    return "success"
  }

  try {
    noStore()
    const nameTaken = await psCheckIfCategoryNameTaken.execute({
      name: validatedInput.data.name.toLowerCase(),
    })
    if (nameTaken) return "exists"

    noStore()
    const newCategory = await db
      .insert(categories)
      .values({
        id: generateId(),
        name: validatedInput.data.name.toLowerCase(),
        description: validatedInput.data.description,
        visibility: validatedInput.data.visibility,
        images: JSON.stringify(rawInput.images) as unknown as StoredFile[],
      })
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/kategorie")
    return newCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function addSubcategory(
  rawInput: AddSubcategoryInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  const validatedInput = addSubcategorySchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const exists = mockSubcategories.some(
      (s) =>
        s.name.toLowerCase() === validatedInput.data.name.toLowerCase() &&
        s.categoryName === validatedInput.data.categoryName
    )
    if (exists) return "exists"
    mockSubcategories.push({
      id: generateId(),
      name: validatedInput.data.name.toLowerCase(),
      description: validatedInput.data.description ?? null,
      categoryName: validatedInput.data.categoryName,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    revalidatePath("/")
    revalidatePath("/admin/podkategorie")
    return "success"
  }

  try {
    noStore()
    const nameTaken = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.name.toLowerCase()),
        eq(subcategories.categoryName, validatedInput.data.categoryName)
      ),
    })
    if (nameTaken) return "exists"

    noStore()
    const newCategory = await db
      .insert(subcategories)
      .values({
        id: generateId(),
        name: validatedInput.data.name.toLowerCase(),
        description: validatedInput.data.description,
        categoryName: validatedInput.data.categoryName,
      })
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/podkategorie")
    return newCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function deleteCategory(
  rawInput: DeleteCategoryInput
): Promise<"invalid-input" | "error" | "success"> {
  const validatedInput = deleteCategorySchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockCategories.findIndex((c) => c.id === validatedInput.data.id)
    if (idx !== -1) mockCategories.splice(idx, 1)
    revalidatePath("/admin/kategorie")
    return "success"
  }

  try {
    const deleted = await psDeleteCategoryById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/kategorie")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function deleteSubcategory(
  rawInput: DeleteSubcategoryInput
): Promise<"invalid-input" | "error" | "success"> {
  const validatedInput = deleteSubcategorySchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockSubcategories.findIndex((s) => s.id === validatedInput.data.id)
    if (idx !== -1) mockSubcategories.splice(idx, 1)
    revalidatePath("/admin/podkategorie")
    return "success"
  }

  try {
    const deleted = await psDeleteSubcategoryById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/podkategorie")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function updateCategory(
  rawInput: UpdateCategoryInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  const validatedInput = updateCategorySchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockCategories.findIndex((c) => c.id === validatedInput.data.id)
    if (idx === -1) return "not-found"
    mockCategories[idx] = {
      ...mockCategories[idx],
      name: validatedInput.data.name,
      description: validatedInput.data.description,
      visibility: validatedInput.data.visibility,
      updatedAt: new Date(),
    }
    revalidatePath("/")
    revalidatePath("/admin/kategorie")
    return "success"
  }

  try {
    const exists = await checkIfCategoryExists({ id: validatedInput.data.id })
    if (!exists || exists === "invalid-input") return "not-found"

    noStore()
    const updatedCategory = await db
      .update(categories)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        visibility: validatedInput.data.visibility,
      })
      .where(eq(categories.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/kategorie")

    return updatedCategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function updateSubcategory(
  rawInput: UpdateSubcategoryInput
): Promise<"invalid-input" | "not-found" | "exists" | "error" | "success"> {
  const validatedInput = updateSubcategorySchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockSubcategories.findIndex((s) => s.id === validatedInput.data.id)
    if (idx === -1) return "not-found"
    mockSubcategories[idx] = {
      ...mockSubcategories[idx],
      name: validatedInput.data.name,
      description: validatedInput.data.description,
      updatedAt: new Date(),
    }
    revalidatePath("/")
    revalidatePath("/admin/podkategorie")
    return "success"
  }

  try {
    const exists = await checkIfSubcategoryExists({
      id: validatedInput.data.id,
    })
    if (!exists || exists === "invalid-input") return "not-found"

    noStore()
    const newNameTaken = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.name.toLowerCase()),
        eq(subcategories.categoryName, validatedInput.data.categoryName),
        not(eq(subcategories.id, validatedInput.data.id))
      ),
    })
    if (newNameTaken) return "exists"

    noStore()
    const updatedSubcategory = await db
      .update(subcategories)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
      })
      .where(eq(subcategories.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/podkategorie")

    return updatedSubcategory ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}
