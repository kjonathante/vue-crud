<template>
  <BasePage class="home">
    <div class="container">
      <img alt="Vue logo" src="../assets/logo.png" />
      <div>
        <h1>Vue + Apollo + GraphQL</h1>
        <h2>Featuring Subscription</h2>
        <a href="https://github.com/kjonathante/vue-crud">
          <p>https://github.com/kjonathante/vue-crud</p>
        </a>
      </div>
    </div>
    <UsersPane />
  </BasePage>
</template>

<script>
// @ is an alias to /src
import BasePage from '@/components/BasePage.vue'
import UsersPane from '@/components/UsersPane.vue'

export default {
  name: 'home',
  components: {
    BasePage,
    UsersPane
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/imports'

.container
  display flex
  flex-wrap wrap
  justify-content center
  align-items center
</style>
