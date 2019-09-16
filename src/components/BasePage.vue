<template>
  <main class="page">
    <div v-if="logged" class="info-block">
      Please sign in to view this content
    </div>
    <div v-else-if="admin" class="info-block warning">
      You don't have access to this content
    </div>
    <slot v-else />
  </main>
</template>

<script>
export default {
  props: {
    logged: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/imports'

.page
  max-width $page-size
  min-height calc(100vh - 270px)
  margin auto
  padding 12px
  box-sizing border-box
</style>
