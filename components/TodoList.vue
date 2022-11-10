<template>
  <section v-if="items.length > 0">
    <TodoItem v-for="item in items" :key="item.id" :todo="item" />
  </section>
</template>
<script setup lang="ts">
import { Todo } from '~~/store/interfaces/iTodos';

const props = defineProps<{
  items: Todo[]
}>()
</script>
<style lang="">
  
</style>