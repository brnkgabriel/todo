<template>
  <div class="w-full min-h-screen bg-gray-100">
    <section class="text-center">
      <div class="w-24 h-24 bg-red-500 inline-block"></div>
      <h1 class="text-4xl pt-5 text-gray-800 font-bold">What are we doing today?</h1>
    </section>
    <section class="w-9/12 max-w-lg mx-auto mt-7 bg-white shadow p-5 rounded">
      <TodoInput v-model="newTodo" @save="saveNewTodo" :error="error" />
      <TodoList :items="todoStore.getOrderedTodos" />
    </section>
    <div>{{ data }}</div>
  </div>
</template>

<script setup lang="ts">
  import TodoList from '../components/TodoList.vue';
  import { useTodoStore } from '../store/todo';

  const todoStore = useTodoStore()
  const newTodo = ref("")
  const error = ref(false)
  const { data } = await useFetch("/api/stuff", { pick: ["zechariah"] })

  watch(error, (value: boolean) => {
    if (value) {
      setTimeout(() => {
        error.value = false
      }, 3000);
    }
  })

  const saveNewTodo = () => {
    if (newTodo.value.length <= 0) {
      error.value = true
      return
    }

    todoStore.add({ label: newTodo.value })

    newTodo.value = ""
  }
</script>