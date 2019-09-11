<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <UsersFeed />
  </div>
</template>

<script>
// @ is an alias to /src
import UsersFeed from '@/components/UsersFeed.vue'

export default {
  name: 'home',
  components: {
    UsersFeed
  }
}
</script>
