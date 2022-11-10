import { Users } from "../../src/users"
import { PrismaClient } from "@prisma/client"
import { tryWrap } from "../../helpers/trywraps"

const client = new PrismaClient()
const users = new Users(client.user)

export default defineEventHandler(async event => {
  const body = useBody(event)
  const { result, error } = await tryWrap(async () => {
    const { email, password, passwordConfirm } = body
    const user = await users.add({
      email,
      password,
      passwordConfirm
    })

    return user
  })

  return { result, error: error.message }
})