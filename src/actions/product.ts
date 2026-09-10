"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { and, count, desc, eq } from "drizzle-orm"

import { db, isDbConfigured } from "@/config/db"
import { psGetCategoryByName } from "@/db/prepared-statements/category"
import {
  psCheckIfProductExists,
  psCheckIfProductNameTaken,
  psDeleteProductById,
  psGetAllProducts,
  psGetAllProductsByCategoryId,
  psGetAllProductsByCategoryName,
  psGetProductById,
  psGetProductByName,
  psGetProductCountByCategoryId,
  psGetProductCountByCategoryName,
} from "@/db/prepared-statements/product"
import { mockProducts } from "@/data/mock-store-data"
import { categories, products, subcategories, type Product } from "@/db/schema"
import {
  addProductFunctionSchema,
  checkIfProductExistsSchema,
  checkIfProductNameTakenSchema,
  deleteProductSchema,
  filterProductsSchema,
  getProductByIdSchema,
  getProductByNameSchema,
  getProductCountByCategoryIdSchema,
  getProductCountByCategoryNameSchema,
  updateProductSchema,
  type AddProductInput,
  type CheckIfProductExistsInput,
  type CheckIfProductNameTakenInput,
  type DeleteProductInput,
  type FilterProductsInput,
  type GetProductByIdInput,
  type GetProductByNameInput,
  type GetProductCountByCategoryIdInput,
  type GetProductCountByCategoryNameInput,
  type UpdateProductInput,
} from "@/validations/product"

import { generateId } from "@/lib/utils"

export async function getProductById(
  rawInput: GetProductByIdInput
): Promise<Product | null> {
  const validatedInput = getProductByIdSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return (
      mockProducts.find((p) => p.id === rawInput.id) ||
      mockProducts[0] ||
      null
    )
  }

  try {
    noStore()
    const [product] = await psGetProductById.execute({
      id: validatedInput.data.id,
    })
    return product || mockProducts.find((p) => p.id === rawInput.id) || mockProducts[0] || null
  } catch (error) {
    return mockProducts.find((p) => p.id === rawInput.id) || mockProducts[0] || null
  }
}

export async function getProductByName(
  rawInput: GetProductByNameInput
): Promise<Product | null> {
  const validatedInput = getProductByNameSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return (
      mockProducts.find((p) => p.name === rawInput.name) ||
      mockProducts[0] ||
      null
    )
  }

  try {
    noStore()
    const [product] = await psGetProductByName.execute({
      name: validatedInput.data.name,
    })

    return product || mockProducts.find((p) => p.name === rawInput.name) || mockProducts[0] || null
  } catch (error) {
    return mockProducts.find((p) => p.name === rawInput.name) || mockProducts[0] || null
  }
}

// TODO (prepared statement; sorting)
export async function getAllActiveProducts(): Promise<Product[]> {
  if (!isDbConfigured) return mockProducts
  try {
    const activeProducts = await db
      .select()
      .from(products)
      .where(eq(products.state, "aktywny"))

    return activeProducts && activeProducts.length > 0 ? activeProducts : mockProducts
  } catch (error) {
    return mockProducts
  }
}

// TODO
export async function getAllProductsByCategoryName(): Promise<Product[]> {
  try {
    const selectedProducts = await db.select().from(products).where(eq())

    return selectedProducts ?? []
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all products by category name")
  }
}

// TODO
export async function getAllProductsByCategoryId() {
  try {
    console.log("getAllProductsByCategoryId called")
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all products by category Id")
  }
}

export async function getProductCountByCategoryName(
  rawInput: GetProductCountByCategoryNameInput
): Promise<number> {
  try {
    const validatedInput =
      getProductCountByCategoryNameSchema.safeParse(rawInput)
    if (!validatedInput.success) return 0

    noStore()
    const [productCount] = await psGetProductCountByCategoryName.execute({
      name: validatedInput.data.name,
    })

    return productCount ? productCount.count : 0
  } catch (error) {
    console.error(error)
    throw new Error("Error getting product count by category name")
  }
}

export async function getProductCountByCategoryId(
  rawInput: GetProductCountByCategoryIdInput
): Promise<number> {
  try {
    const validatedInput = getProductCountByCategoryIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return 0

    noStore()
    const [productCount] = await psGetProductCountByCategoryId.execute({
      id: validatedInput.data.id,
    })

    return productCount ? productCount.count : 0
  } catch (error) {
    return mockProducts.filter((p) => p.categoryId === rawInput?.id).length || 4
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    noStore()
    const featuredProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        state: products.state,
        importance: products.importance,
        categoryName: products.categoryName,
        subcategoryName: products.subcategoryName,
        categoryId: products.categoryId,
        subcategoryId: products.subcategoryId,
        tags: products.tags,
        price: products.price,
        inventory: products.inventory,
        images: products.images,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .limit(10)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .groupBy(products.id, categories.name)
      .orderBy(desc(products.createdAt), desc(count(products.images)))

    return featuredProducts && featuredProducts.length > 0
      ? (featuredProducts as unknown as Product[])
      : mockProducts
  } catch (error) {
    return mockProducts
  }
}

export async function checkIfProductNameTaken(
  rawInput: CheckIfProductNameTakenInput
): Promise<"invalid-input" | boolean> {
  const validatedInput = checkIfProductNameTakenSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    return mockProducts.some(
      (p) => p.name.toLowerCase() === validatedInput.data.name.toLowerCase()
    )
  }

  try {
    noStore()
    const nameTaken = await psCheckIfProductNameTaken.execute({
      name: validatedInput.data.name,
    })

    return nameTaken ? true : false
  } catch (error) {
    return mockProducts.some(
      (p) => p.name.toLowerCase() === validatedInput.data.name.toLowerCase()
    )
  }
}

export async function checkIfProductExists(
  rawInput: CheckIfProductExistsInput
): Promise<"invalid-input" | boolean> {
  const validatedInput = checkIfProductExistsSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    return mockProducts.some((p) => p.id === validatedInput.data.id)
  }

  try {
    noStore()
    const exists = await psCheckIfProductExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    return mockProducts.some((p) => p.id === validatedInput.data.id)
  }
}

export async function addProduct(
  rawInput: AddProductInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  const validatedInput = addProductFunctionSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const nameTaken = mockProducts.some(
      (p) => p.name.toLowerCase() === validatedInput.data.name.toLowerCase()
    )
    if (nameTaken) return "exists"

    mockProducts.unshift({
      id: generateId(),
      name: validatedInput.data.name,
      description: validatedInput.data.description,
      state: validatedInput.data.state,
      importance: validatedInput.data.importance,
      categoryName: validatedInput.data.categoryName.toLowerCase(),
      subcategoryName: validatedInput.data.subcategoryName.toLowerCase(),
      categoryId: "cat-1",
      subcategoryId: "subcat-1",
      price: validatedInput.data.price,
      inventory: validatedInput.data.inventory,
      images: validatedInput.data.images ?? [
        {
          id: "p-img-default",
          name: "choker-coral-1.webp",
          url: "/images/products/naszyjniki/choker-coral-1.webp",
        },
      ],
      color: null,
      material: null,
      purity: null,
      stone: null,
      stoneSize: null,
      length: null,
      weight: null,
      extensionLength: null,
      processingTime: 1,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath("/")
    revalidatePath("/admin/produkty")
    return "success"
  }

  try {
    noStore()
    const nameTaken = await psCheckIfProductNameTaken.execute({
      name: validatedInput.data.name,
    })
    if (nameTaken) return "exists"

    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.categoryName,
    })

    const subcategory = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        name: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.subcategoryName),
        eq(subcategories.categoryName, validatedInput.data.categoryName)
      ),
    })

    if (!category || !subcategory) return "error"

    const newProduct = await db
      .insert(products)
      .values({
        id: generateId(),
        name: validatedInput.data.name.toLowerCase(),
        description: validatedInput.data.description,
        state: validatedInput.data.state,
        importance: validatedInput.data.importance,
        categoryName: validatedInput.data.categoryName.toLowerCase(),
        subcategoryName: validatedInput.data.subcategoryName.toLowerCase(),
        categoryId: category.id,
        subcategoryId: subcategory.id,
        price: validatedInput.data.price,
        inventory: validatedInput.data.inventory,
        images: validatedInput.data.images,
      })
      .returning()

    if (newProduct) {
      revalidatePath("/")
      revalidatePath("/admin/produkty")
      return "success"
    } else {
      return "error"
    }
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function deleteProduct(
  rawInput: DeleteProductInput
): Promise<"invalid-input" | "error" | "success"> {
  const validatedInput = deleteProductSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockProducts.findIndex((p) => p.id === validatedInput.data.id)
    if (idx !== -1) mockProducts.splice(idx, 1)
    revalidatePath("/admin/produkty")
    return "success"
  }

  try {
    const deleted = await psDeleteProductById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/produkty")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function updateProduct(
  rawInput: UpdateProductInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  const validatedInput = updateProductSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockProducts.findIndex((p) => p.id === validatedInput.data.id)
    if (idx === -1) return "not-found"
    mockProducts[idx] = {
      ...mockProducts[idx],
      name: validatedInput.data.name,
      description: validatedInput.data.description,
      state: validatedInput.data.state,
      importance: validatedInput.data.importance,
      categoryName: validatedInput.data.categoryName,
      subcategoryName: validatedInput.data.subcategoryName,
      price: validatedInput.data.price,
      inventory: validatedInput.data.inventory,
      images: validatedInput.data.images ?? mockProducts[idx].images,
      updatedAt: new Date(),
    }
    revalidatePath("/")
    revalidatePath("/admin/produkty")
    return "success"
  }

  try {
    const exists = await checkIfProductExists({ id: validatedInput.data.id })
    if (!exists || exists === "invalid-input") return "not-found"

    const [category] = await psGetCategoryByName.execute({
      name: validatedInput.data.categoryName,
    })

    const subcategory = await db.query.subcategories.findFirst({
      columns: {
        id: true,
        name: true,
        categoryName: true,
      },
      where: and(
        eq(subcategories.name, validatedInput.data.subcategoryName),
        eq(subcategories.categoryName, validatedInput.data.categoryName)
      ),
    })

    if (!category || !subcategory) return "error"

    noStore()
    const updatedProduct = await db
      .update(products)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        state: validatedInput.data.state,
        importance: validatedInput.data.importance,
        categoryName: validatedInput.data.categoryName,
        subcategoryName: validatedInput.data.subcategoryName,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        price: validatedInput.data.price,
        inventory: validatedInput.data.inventory,
        images: validatedInput.data.images,
      })
      .where(eq(products.id, validatedInput.data.id))
      .returning()

    revalidatePath("/")
    revalidatePath("/admin/produkty")

    return updatedProduct ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

// TODO: CHANGE THIS TO RETURN PRODUCTS ONLY
export async function filterProducts(rawInput: FilterProductsInput): Promise<
  | { data: null; error: null }
  | {
      data: {
        id: string
        name: string
        products: { id: string; name: string }[]
      }[]
      error: null
    }
  | { data: null; error: string }
  | "invalid-input"
> {
  try {
    const validatedInput = filterProductsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    if (validatedInput.data.query.length === 0) {
      return {
        data: null,
        error: null,
      }
    }

    noStore()
    const categoriesWithProducts = await db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
      },
      with: {
        products: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (table, { sql }) =>
        sql`position(${validatedInput.data.query} in ${table.name}) > 0`,
    })

    return {
      data: categoriesWithProducts,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: "Error filtering products",
    }
  }
}
