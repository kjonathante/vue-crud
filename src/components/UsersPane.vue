<template>
  <div>
    <ApolloQuery
      :query="require('../graphql/Users.gql')"
      fetch-policy="cache-and-network"
    >
      <template slot-scope="{ result: { data, loading, error } }">
        <p v-if="loading">Loading...</p>

        <div v-else-if="error">
          <p>An error occured while fetching the answers.</p>
        </div>

        <template v-if="data && data.users && data.users.length">
          <div class="flex-container">
            <UserItem
              v-for="user of data.users"
              v-bind:user="user"
              v-bind:key="user.id"
            />
          </div>
        </template>
      </template>
    </ApolloQuery>

    <div>
      <input type="text" v-model="nameInput" />
      <button v-on:click="userAdd">Add</button>
    </div>
  </div>
</template>

<script>
import UserItem from './UserItem'
import USER_ADD_MUTATION from '../graphql/UserAdd.gql'

import { cacheUserAdd } from '../cache/users'

export default {
  components: {
    UserItem
  },

  data() {
    return {
      nameInput: ''
    }
  },

  methods: {
    userAdd() {
      // We save the user input in case of an error
      const nameInput = this.nameInput
      // We clear it early to give the UI a snappy feel
      this.nameInput = ''
      // Call to the graphql mutation
      this.$apollo
        .mutate({
          mutation: USER_ADD_MUTATION,
          variables: {
            name: nameInput
          },
          update: (store, { data: { createUser } }) => {
            cacheUserAdd(store, createUser)
          }
        })
        .then(() => {
          //data => {
          // Result
          //console.log('success', data)
        })
        .catch(() => {
          //error => {
          // Error
          //console.error('error', error)
          // We restore the initial user input
          this.nameInput = nameInput
        })
    }
  }
}
</script>
<style lang="scss">
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
</style>
