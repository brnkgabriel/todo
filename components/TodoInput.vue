<template>
  <form 
    @submit.prevent 
    class="w-10/12 sm:w-8/12 max-w-lg mx-auto h-24 bg-white rounded-md shadow-sm py-5 px-10 flex items-center justify-between mb-5">

    <input
      type="text"
      :class="{
        'border-red-300': error,
        'border-gray-300': !error
      }"
      class="border rounded py-2 px-4 w-9/12 focus:outline-1 focus:outline-blue-100"
      placeholder="Create a todo"
      v-model="localState"
      @keypress.enter="$emit('save')"/>

    <button
      class="w-3/12 py-2 ml-2 rounded border border-gray-300 hover:bg-green-100 transition-all duration-200"
      @click="$emit('save')">Save</button>
  </form>
</template>
<script setup lang="ts">
  const props = defineProps<{
    modelValue: string;
    error: boolean;
  }>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "save"): void;
  }>();

  const localState = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits("update:modelValue", value)
    }
  })
</script>
<style lang="">
  
</style>