import { describe, test, expect, beforeAll, afterAll, vi } from "vitest"
import { Users, UsersToken } from "./users"
import { PrismaClient, User } from "@prisma/client"
import JWT from "jsonwebtoken"

const client = new PrismaClient()

describe("users - constructor", () => {
  test("throws if options invalid", () => {
    // @ts-ignore: TS2554
    expect(() => new Users()).throws()
  })

  test("returns a Users object", () => {
    const users = new Users(client.user)
    expect(users.UserModel).toBeDefined()
  })
})

describe("users - hashPassword", () => {
  test("throws if options are invalid", async () => {
    // @ts-ignore: TS2554
    await expect(Users.hashPassword()).rejects.toThrow("data and salt arguments required")
  })

  test("hashes a password", async () => {
    const hash = await Users.hashPassword("password")
    expect(hash).toMatch("$2b$10")
  })
})

describe("users = isValidPassword", () => {
  test("returns false if password is incorrect", async () => {
    const result = await Users.isValidPassword("password", "hash")
    expect(result).toBe(false)
  })

  test("returns true if password is correct", async () => {
    const hash = await Users.hashPassword("password")
    const isValid = await Users.isValidPassword("password", hash)
    expect(isValid).toBe(true)
  })
})

describe("users - tokens", () => {
  let user: User;
  let token: UsersToken | undefined

  beforeAll(async () => {
    user = await client.user.create({
      data: {
        id: "1234",
        email: "test@test.com",
        password: "password"
      }
    })

    token = Users.createToken(user)
  })

  afterAll(async () => {
    await client.user.delete({ where: { id: user.id } })
    token = undefined
    vi.restoreAllMocks()
  })
  test("createToken - throws if no user is passed", () => {
    // @ts-ignore: TS2554
    expect(() => Users.createToken()).throws()
  })

  test("createToken - returns a token", () => {
    expect(token).toStrictEqual({
      token: expect.any(String),
      expiryInDays: 7
    })
  })

  test("getUsersInfoFromToken - throws if no token passed", () => {
    // @ts-ignore: TS2554
    expect(() => Users.getUserInfoFromToken()).toThrow()
  })

  test("getUsersInfoFromToken - returns undefined if an error occurs", () => {
    const mock = vi
    .spyOn(JWT, "verify")
    .mockImplementationOnce(() => {
      throw new Error("Error")
    })

    const result = Users.getUserInfoFromToken(token?.token)

    expect(mock).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  test("getUsersInfoFromToken - returns the correct user info", () => {
    const userInfo = Users.getUserInfoFromToken(token?.token)
    expect(userInfo).toStrictEqual({
      id: user.id,
      email: user.email
    })
  })
})

describe("users - add", () => {

  afterAll(async () => {
    await client.user.delete({ where: { email: "test@test.com" } })
  })
  test("throws if options are invalid", async () => {
    // @ts-ignore: TS2554
    await expect(new Users(client.user).add()).rejects.toThrow(
      '"value" is required'
    );
  })
  test("throws if options are invalid", async () => {
    // @ts-ignore: TS2554
    await expect(new Users(client.user).add(null)).rejects.toThrow(
      '"value" must be of type object'
    );
  })
  
  test("throws if options are invalid", async () => {
    // @ts-ignore: TS2554
    await expect(new Users(client.user).add({})).rejects.toThrow(
      '"email" is required'
    );
  })
  
  test("throws if options are invalid", async () => {
    // @ts-ignore: TS2554
    await expect(new Users(client.user).add({ email: null })).rejects.toThrow(
      '"email" must be a string'
    );
  })
  
  test("throws if options are invalid", async () => {
    // @ts-ignore: TS2554
    await expect(new Users(client.user).add({ email: "" })).rejects.toThrow(
      '"email" is not allowed to be empty'
    );
  })

  test("returns a user", async () => {
    const user = await new Users(client.user).add({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password"
    })

    expect(user).toStrictEqual({
      id: expect.any(String),
      email: "test@test.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  test("throws if duplicate email", async () => {
    await expect(new Users(client.user).add({
      email: "test@test.com",
      password: "password",
      passwordConfirm: "password"
    })).rejects.toThrow()
  })
})

describe("users - login", () => {
  let user: User

  beforeAll(async () => {
    const password = await Users.hashPassword("password")
    user = await client.user.create({
      data: {
        id: "1234",
        email: "test@test.com",
        password
      }
    })
  })

  afterAll(async () => {
    await client.user.delete({  where: { id: user.id }})
  })

  test("throws if options invalid", async () => {
    // @ts-ignore: TS2345
    await expect(new Users(client.user).login({})).rejects.toThrow()
  })

  test("returns undefined if the user doesn't exist", async () => {
    const result = await new Users(client.user).login({
      email: "noexist@test.com", password: "password"
    })

    expect(result).toBeUndefined()
  })

  test("returns undefined if password is incorrect", async () => {
    const result = await new Users(client.user).login({
      email: "test@test.com", password: "passwordIncorrect"
    })
    expect(result).toBeUndefined()
  })
  
  test("returns a token if credentials are correct", async () => {
    const result: UsersToken | undefined= await new Users(client.user).login({
      email: user.email, password: "password"
    })
    expect(result).toStrictEqual({
      token: expect.any(String),
      expiryInDays: 7
    })
  })
})