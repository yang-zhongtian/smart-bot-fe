<script setup lang="ts">
defineProps({
  status: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <ATag v-if="status" color="green">
    Active
  </ATag>
  <ATag v-else color="red">
    Inactive
  </ATag>
</template>

<style scoped>

</style>
