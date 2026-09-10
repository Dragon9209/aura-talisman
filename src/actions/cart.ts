"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import {
  addToCartSchema,
  deleteCartItemSchema,
  deleteCartItemsSchema,
  getCartItemsSchema,
  updateCartItemSchema,
  type AddToCartInput,
  type CartItem,
  type CartLineItem,
  type DeleteCartItemInput,
  type DeleteCartItemsInput,
  type GetCartItemsInput,
  type UpdateCartItemInput,
} from "@/validations/cart"
import { mockProducts } from "@/data/mock-store-data"

function getCookieCart(): CartItem[] {
  try {
    const raw = cookies().get("local_cart")?.value
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function setCookieCart(items: CartItem[]): void {
  cookies().set("local_cart", JSON.stringify(items), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  })
}

export async function getCart(): Promise<CartLineItem[]> {
  try {
    const items = getCookieCart()
    if (!items || items.length === 0) return []

    return items
      .map((item) => {
        const prod =
          mockProducts.find((p) => p.id === item.productId) || mockProducts[0]
        if (!prod) return null

        return {
          id: prod.id,
          name: prod.name,
          images: prod.images ?? [],
          price: prod.price,
          inventory: prod.inventory,
          categoryName: prod.categoryName,
          subcategoryName: prod.subcategoryName,
          quantity: item.quantity,
        }
      })
      .filter(Boolean) as CartLineItem[]
  } catch (error) {
    console.error("Error in getCart:", error)
    return []
  }
}

export async function addToCart(
  rawInput: AddToCartInput
): Promise<"invalid-input" | "out-of-stock" | "error" | "success"> {
  try {
    const validatedInput = addToCartSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const items = getCookieCart()
    const existing = items.find(
      (item) => item.productId === validatedInput.data.productId
    )

    if (existing) {
      existing.quantity += validatedInput.data.quantity
    } else {
      items.push({
        productId: validatedInput.data.productId,
        quantity: validatedInput.data.quantity,
      })
    }

    setCookieCart(items)
    revalidatePath("/", "layout")
    return "success"
  } catch (error) {
    console.error("Error in addToCart:", error)
    return "error"
  }
}

export async function updateCartItem(
  rawInput: UpdateCartItemInput
): Promise<"invalid-input" | "error" | CartItem[]> {
  try {
    const validatedInput = updateCartItemSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    let items = getCookieCart()
    if (validatedInput.data.quantity <= 0) {
      items = items.filter(
        (item) => item.productId !== validatedInput.data.productId
      )
    } else {
      const target = items.find(
        (item) => item.productId === validatedInput.data.productId
      )
      if (target) {
        target.quantity = validatedInput.data.quantity
      } else {
        items.push({
          productId: validatedInput.data.productId,
          quantity: validatedInput.data.quantity,
        })
      }
    }

    setCookieCart(items)
    revalidatePath("/", "layout")
    return items
  } catch (error) {
    console.error("Error in updateCartItem:", error)
    return "error"
  }
}

export async function deleteCartItem(
  rawInput: DeleteCartItemInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteCartItemSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const items = getCookieCart().filter(
      (item) => item.productId !== validatedInput.data.productId
    )
    setCookieCart(items)
    revalidatePath("/", "layout")
    return "success"
  } catch (error) {
    console.error("Error in deleteCartItem:", error)
    return "error"
  }
}

export async function deleteCartItems(
  rawInput: DeleteCartItemsInput
): Promise<"invalid-input" | "error" | CartItem[]> {
  try {
    const validatedInput = deleteCartItemsSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const items = getCookieCart().filter(
      (item) => !validatedInput.data.productIds.includes(item.productId)
    )
    setCookieCart(items)
    revalidatePath("/", "layout")
    return items
  } catch (error) {
    console.error("Error in deleteCartItems:", error)
    return "error"
  }
}

export async function getCartItems(
  rawInput?: GetCartItemsInput
): Promise<"invalid-input" | CartItem[]> {
  try {
    return getCookieCart()
  } catch (error) {
    console.error("Error in getCartItems:", error)
    return []
  }
}

export async function deleteCart(): Promise<"error" | "success"> {
  try {
    setCookieCart([])
    revalidatePath("/", "layout")
    return "success"
  } catch (error) {
    console.error("Error in deleteCart:", error)
    return "error"
  }
}

export async function clearCart(): Promise<void> {
  try {
    setCookieCart([])
    revalidatePath("/", "layout")
  } catch (error) {
    console.error("Error in clearCart:", error)
  }
}
