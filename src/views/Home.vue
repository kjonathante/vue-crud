<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <UsersPane />
  </div>
</template>

<script>
// @ is an alias to /src
import UsersPane from '@/components/UsersPane.vue'

export default {
  name: 'home',
  components: {
    UsersPane
  }
}
</script>
