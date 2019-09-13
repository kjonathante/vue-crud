<template>
  <div class="card">
    <div>
      <p>{{ user.name }}</p>
    </div>
    <div>
      <button v-on:click="userRemove">delete</button>
      <input type="text" v-model="nameInput" />
      <button v-on:click="userUpdate">update</button>
    </div>
  </div>
</template>

<script>
import USER_REMOVE_MUTATION from '../graphql/UserRemove.gql'
import USER_UPDATE_MUTATION from '../graphql/UserUpdate.gql'

import { cacheUserRemove } from '../cache/users'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      nameInput: ''
    }
  },

  methods: {
    userRemove() {
      // Call to the graphql mutation
      this.$apollo.mutate({
        mutation: USER_REMOVE_MUTATION,
        variables: {
          id: this.user.id
        },
        update: (store, { data: { deleteUser } }) => {
          cacheUserRemove(store, deleteUser, this.user.id)
        }
      })
    },
    userUpdate() {
      // We save the user input in case of an error
      const nameInput = this.nameInput
      // We clear it early to give the UI a snappy feel
      this.nameInput = ''
      // Call to the graphql mutation
      this.$apollo
        .mutate({
          mutation: USER_UPDATE_MUTATION,
          variables: {
            id: this.user.id,
            name: nameInput
          }
        })
        .then(() => {
          // data => {
          // Result
          // console.log('success', data)
        })
        .catch(() => {
          // error => {
          // Error
          // console.error('error', error)
          // We restore the initial user input
          this.nameInput = nameInput
        })
    }
  }
}
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
