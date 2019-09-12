<template>
  <div>
    <ApolloQuery
      :query="require('../graphql/Users.gql')"
      fetch-policy="cache-and-network"
    >
      <template slot-scope="{ result: { data, loading, error } }">
        <template v-if="data && data.users && data.users.length">
          <p
            v-for="user of data.users"
            v-bind:key="user.id"
            v-on:click="UserRemove(user.id)"
          >
            {{ user.name }}
          </p>
        </template>
      </template>
    </ApolloQuery>

    <div>
      <input type="text" v-model="nameInput" />
      <button v-on:click="UserAdd">Add</button>
    </div>
  </div>
</template>

<script>
import USER_ADD_MUTATION from '../graphql/UserAdd.gql'
import USER_REMOVE_MUTATION from '../graphql/UserRemove.gql'

import { cacheUserAdd } from '../cache/users'

export default {
  data() {
    return {
      nameInput: ''
    }
  },

  methods: {
    UserAdd() {
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
        .then(data => {
          // Result
          //console.log('success', data)
        })
        .catch(error => {
          // Error
          //console.error('error', error)
          // We restore the initial user input
          this.nameInput = nameInput
        })
    },
    UserRemove(id) {
      // Call to the graphql mutation
      this.$apollo
        .mutate({
          mutation: USER_REMOVE_MUTATION,
          variables: {
            id
          }
          // update: (store, { data: { createUser } }) => {
          //   cacheUserAdd(store, createUser)
          // }
        })
        .then(data => {
          // Result
          console.log('success', data)
        })
        .catch(error => {
          // Error
          console.error('error', error)
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
