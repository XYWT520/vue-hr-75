<template>
  <div>
    数字:{{ value }}
    <button @click="btn">+1</button>
  </div>

</template>

<script>
export default {
  props: {
    value: { type: Number, required: true }
  },

  methods: {
    btn() {
      this.$emit('input', this.value + 1)
    }
  }
}
</script>

<style>

</style>
