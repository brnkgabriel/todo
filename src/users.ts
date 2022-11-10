import { Prisma, User } from "@prisma/client"
import { v4 as uuid } from "uuid"
import JWT from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import Joi from "joi"

const TOKEN_EXPIRY_IN_DAYS = 7

export interface UsersAddOptions {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface UsersLoginOptions {
  email: string;
  password: string
}

export interface UsersToken {
  token: string;
  expiryInDays: number;
}

const usersAddOptionsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required()
}).required()

const usersLoginOtionsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).required()

export class Users {
  declare UserModel: Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
  constructor(
    UserModel: Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>
  ) {
    if (UserModel === undefined || UserModel.create === undefined) {
      throw new Error('"UserModel" is required')
    }
    this.UserModel = UserModel
  }

  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  static async isValidPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  }

  static createToken(user: User): UsersToken {
    if (user === undefined) {
      throw new Error("user is required")
    }
    const { id, email } = user
    const token = JWT.sign({id, email}, process.env.JWT_TOKEN_SECRET, {
      expiresIn: `${TOKEN_EXPIRY_IN_DAYS}d`
    })
    return { token, expiryInDays: TOKEN_EXPIRY_IN_DAYS }
  }

  static getUserInfoFromToken(token: string | undefined): {id: string, email: string} | undefined {
    if (token === undefined) {
      throw new Error("token is required")
    }

    try {
      const { id, email } =  JWT.verify(token, process.env.JWT_TOKEN_SECRET) as { id: string, email: string }
      console.log("token secret =", process.env.JWT_TOKEN_SECRET)
      return { id, email }
    } catch (error) {
      return undefined
    }
  }
  // hash password
  // create user
  async add(options: UsersAddOptions): Promise<Omit <User, "password">> {
    const params: UsersAddOptions = await usersAddOptionsSchema.validateAsync(options)

    const hashedPassword = await Users.hashPassword(params.password)
    const id = uuid()

    return this.UserModel.create({
      data: { id, email: params.email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })
  }

  // check credentials
  // create a token
  async login(options: UsersLoginOptions): Promise<UsersToken | undefined> {
    const params: UsersLoginOptions = await usersLoginOtionsSchema.validateAsync(options)

    const user = await this.UserModel.findUnique({
      where: {
        email: params.email
      }
    })

    if (!user) {
      return undefined
    }

    const isValidPassword = await Users.isValidPassword(params.password, user.password)

    if (!isValidPassword) {
      return undefined
    }

    
    return Users.createToken(user)
  }
}