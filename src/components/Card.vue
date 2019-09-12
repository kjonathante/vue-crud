<template>
  <div class="card">
    <div>
      <slot />
    </div>
    <div>
      <button v-on:click="$emit(`removeUser`)">x</button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid grey;
  padding: 10px;
  margin: 5px;
  width: 150px;
  height: 150px;
}
</style>
