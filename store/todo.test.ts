import { useTodoStore } from "./todo";
import { setActivePinia, createPinia } from "pinia"
import { describe, test, expect, beforeAll, beforeEach, afterEach } from "vitest"

const getFirstTodoId = (store: ReturnType<typeof useTodoStore>) => {
  return store.items[0].id
}

beforeAll(() => {
  setActivePinia(createPinia())
})

describe("useTodoStore", () => {
  let store: ReturnType<typeof useTodoStore>;

  beforeEach(() => {
    store = useTodoStore()
  })

  afterEach(() => {
    store.$reset()
  })

  test("creates a store", () => {
    expect(store).toBeDefined()
  })

  test("initializes with empty items", () => {
    expect(store.items).toStrictEqual([])
  })

  test("creates a todo", () => {
    store.add({ label: "Test my code!" })
    expect(store.items[0]).toBeDefined()
    expect(store.items[0].label).toBe("Test my code!")
  })

  test("gets by id", () => {
    store.add({ label: "Clean home" })
    const id = getFirstTodoId(store)
    const todo = store.getById(id)
    expect(todo?.label).toStrictEqual("Clean home")
  })

  test("gets ordered todos without mutating state", () => {
    const items = [
      { createdAt: new Date(2021, 2, 14) },
      { createdAt: new Date(2019, 2, 14) },
      { createdAt: new Date(2020, 2, 14) }
    ]

    // @ts-ignore
    store.items = items

    const orderedTodos = store.getOrderedTodos

    expect(orderedTodos[0].createdAt.getFullYear()).toBe(2021)
    expect(orderedTodos[1].createdAt.getFullYear()).toBe(2020)
    expect(orderedTodos[2].createdAt.getFullYear()).toBe(2019)
    expect(store.items[0].createdAt.getFullYear()).toBe(2021)
  })

  test("remove a todo", () => {
    store.add({ label: "test" })
    const id = getFirstTodoId(store)
    store.remove(id)

    expect(store.items).toStrictEqual([])
  })

  test("updates a todo done", () => {
    store.add({ label: "test" })
    const id = getFirstTodoId(store)
    store.update(id, { done: true })
    const updated = store.items[0]

    expect(updated.done).toBe(true)
  })

  test("updates a todo label", () => {
    store.add({ label: "test" })
    const id = getFirstTodoId(store)
    store.update(id, { label: "tested" })
    const updated = store.items[0]

    expect(updated.label).toStrictEqual("tested")
  })
})