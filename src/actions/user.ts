"use server"

import crypto from "crypto"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import bcryptjs from "bcryptjs"
import { eq } from "drizzle-orm"

import { db, isDbConfigured } from "@/config/db"
import {
  psCheckIfUserExists,
  psDeleteUserById,
  psGetUserByEmail,
  psGetUserByEmailVerificationToken,
  psGetUserById,
  psGetUserByResetPasswordToken,
} from "@/db/prepared-statements/user"
import { mockRegisteredUsers } from "@/data/mock-store-data"
import { users, type User } from "@/db/schema"
import {
  addUserAsAdminSchema,
  checkIfUserExistsSchema,
  deleteUserSchema,
  getUserByEmailSchema,
  getUserByEmailVerificationTokenSchema,
  getUserByIdSchema,
  getUserByResetPasswordTokenSchema,
  updateUserAsAdminSchema,
  type AddUserAsAdminInput,
  type CheckIfUserExistsInput,
  type DeleteUserInput,
  type GetUserByEmailInput,
  type GetUserByEmailVerificationTokenInput,
  type GetUserByIdInput,
  type GetUserByResetPasswordTokenInput,
  type UpdateUserAsAdminInput,
} from "@/validations/user"

export async function getUserById(
  rawInput: GetUserByIdInput
): Promise<User | null> {
  const validatedInput = getUserByIdSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return (
      mockRegisteredUsers.find(
        (u) => u.id === rawInput.id || u.email === rawInput.id
      ) ||
      mockRegisteredUsers[0] ||
      null
    )
  }

  try {
    noStore()
    const [user] = await psGetUserById.execute({ id: validatedInput.data.id })
    return (
      user ||
      mockRegisteredUsers.find(
        (u) => u.id === rawInput.id || u.email === rawInput.id
      ) ||
      mockRegisteredUsers[0] ||
      null
    )
  } catch (error) {
    return (
      mockRegisteredUsers.find(
        (u) => u.id === rawInput.id || u.email === rawInput.id
      ) ||
      mockRegisteredUsers[0] ||
      null
    )
  }
}

export async function getUserByEmail(
  rawInput: GetUserByEmailInput
): Promise<User | null> {
  const validatedInput = getUserByEmailSchema.safeParse(rawInput)
  if (!validatedInput.success) return null

  if (!isDbConfigured) {
    return (
      mockRegisteredUsers.find((u) => u.email === rawInput.email) || null
    )
  }

  try {
    noStore()
    const [user] = await psGetUserByEmail.execute({
      email: validatedInput.data.email,
    })
    return (
      user ||
      mockRegisteredUsers.find((u) => u.email === rawInput.email) ||
      null
    )
  } catch (error) {
    return (
      mockRegisteredUsers.find((u) => u.email === rawInput.email) || null
    )
  }
}

export async function getUserByResetPasswordToken(
  rawInput: GetUserByResetPasswordTokenInput
): Promise<User | null> {
  try {
    const validatedInput = getUserByResetPasswordTokenSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByResetPasswordToken.execute({
      token: validatedInput.data.token,
    })
    return user || null
  } catch (error) {
    return null
  }
}

export async function getUserByEmailVerificationToken(
  rawInput: GetUserByEmailVerificationTokenInput
): Promise<User | null> {
  try {
    const validatedInput =
      getUserByEmailVerificationTokenSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [user] = await psGetUserByEmailVerificationToken.execute({
      token: validatedInput.data.token,
    })
    return user || null
  } catch (error) {
    return null
  }
}

export async function checkIfUserExists(
  rawInput: CheckIfUserExistsInput
): Promise<"invalid-input" | boolean> {
  const validatedInput = checkIfUserExistsSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    return mockRegisteredUsers.some((u) => u.id === validatedInput.data.id)
  }

  try {
    noStore()
    const exists = await psCheckIfUserExists.execute({
      id: validatedInput.data.id,
    })

    return exists ? true : false
  } catch (error) {
    return mockRegisteredUsers.some((u) => u.id === validatedInput.data.id)
  }
}

export async function addUserAsAdmin(
  rawInput: AddUserAsAdminInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  const validatedInput = addUserAsAdminSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const exists = mockRegisteredUsers.some(
      (u) => u.email.toLowerCase() === validatedInput.data.email.toLowerCase()
    )
    if (exists) return "exists"

    mockRegisteredUsers.push({
      id: crypto.randomUUID(),
      role: validatedInput.data.role,
      name: validatedInput.data.name,
      surname: validatedInput.data.surname,
      email: validatedInput.data.email,
      emailVerified: new Date(),
      passwordHash: null,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    revalidatePath("/admin/uzytkownicy")
    return "success"
  }

  try {
    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (user) return "exists"

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)

    const newUser = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        role: validatedInput.data.role,
        name: validatedInput.data.name,
        surname: validatedInput.data.surname,
        email: validatedInput.data.email,
        emailVerified: new Date(),
        passwordHash,
      })
      .returning()

    return newUser ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function updateUserAsAdmin(
  rawInput: UpdateUserAsAdminInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  const validatedInput = updateUserAsAdminSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const user = mockRegisteredUsers.find((u) => u.id === validatedInput.data.id)
    if (!user) return "not-found"
    user.role = validatedInput.data.role
    user.updatedAt = new Date()
    revalidatePath("/admin/uzytkownicy")
    return "success"
  }

  try {
    const exists = await checkIfUserExists({ id: validatedInput.data.id })
    if (!exists || exists === "invalid-input") return "not-found"

    noStore()
    const updatedUser = await db
      .update(users)
      .set({
        role: validatedInput.data.role,
      })
      .where(eq(users.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/uzytkownicy")
    revalidatePath("/panel-klienta/dane")

    return updatedUser ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function updateUserAsCustomer() {}

export async function deleteUserAsAdmin(
  rawInput: DeleteUserInput
): Promise<"invalid-input" | "error" | "success"> {
  const validatedInput = deleteUserSchema.safeParse(rawInput)
  if (!validatedInput.success) return "invalid-input"

  if (!isDbConfigured) {
    const idx = mockRegisteredUsers.findIndex(
      (u) => u.id === validatedInput.data.id
    )
    if (idx !== -1) mockRegisteredUsers.splice(idx, 1)
    revalidatePath("/admin/uzytkownicy")
    return "success"
  }

  try {
    const deleted = await psDeleteUserById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/uzytkownicy")
    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

export async function deleteUserAsCustomer() {}
