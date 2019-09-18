<template>
  <div>
    {{ choosenUser }}
    <div class="add-user">
      <label for="name-input">Create New User</label>
      <input
        type="text"
        id="name-input"
        v-model="nameInput"
        placeholder="e.g. Kit Jonathan Te"
        v-on:keyup.enter="userAdd"
      />
    </div>
    <ApolloQuery
      :query="require('../graphql/Users.gql')"
      clientId="b"
      fetch-policy="cache-and-network"
    >
      <ApolloSubscribeToMore
        :document="require('../graphql/UserAdded.gql')"
        :update-query="onUserAdded"
      />
      <ApolloSubscribeToMore
        :document="require('../graphql/UserRemoved.gql')"
        :update-query="onUserRemoved"
      />
      <ApolloSubscribeToMore
        :document="require('../graphql/UserUpdated.gql')"
      />
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
              v-bind:clientId="$apollo.client"
              v-on:click.self="handleUserClick(user.id)"
            />
          </div>
        </template>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import UserItem from './UserItem'

import USER_ADD_MUTATION from '../graphql/UserAdd.gql'

import {
  cacheUserAdd,
  cacheUserAddToList,
  cacheUserRemoveFromList
} from '../cache/users'

export default {
  apollo: {
    $client: 'b'
  },

  components: {
    UserItem
  },

  data() {
    return {
      nameInput: '',
      choosenUser: ''
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
          // console.log('success', data)
        })
        .catch(() => {
          //error => {
          // Error
          // console.error('error', error)
          // We restore the initial user input
          this.nameInput = nameInput
        })
    },
    onUserAdded(previousResult, { subscriptionData }) {
      const newResult = {
        users: [...previousResult.users]
      }
      cacheUserAddToList(newResult.users, subscriptionData.data.user.node)
      return newResult
    },
    onUserRemoved(previousResult, { subscriptionData }) {
      const newResult = {
        users: [...previousResult.users]
      }
      cacheUserRemoveFromList(
        newResult.users,
        subscriptionData.data.user.previousValues
      )
      return newResult
    },
    handleUserClick(id) {
      console.log(!this.choosenUser)
      if (!this.choosenUser) {
        this.choosenUser = id
      }
      console.log(id)
    }
  }
}
</script>
<style lang="stylus" scoped>
.flex-container
  display flex
  flex-wrap wrap
  align-items flex-start

.add-user
  margin-bottom 10px

  label
    display inline-block
    margin-bottom 5px
</style>
