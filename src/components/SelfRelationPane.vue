<template>
  <div>
    <!-- <ApolloQuery
      :query="require('../graphql/UserFollowingFollowers.gql')"
      :variables="{ id: selectedUser }"
      clientId="b"
      fetch-policy="cache-and-network"
    >
      <template slot-scope="{ result: { data, loading, error } }">
        <p v-if="loading">Loading...</p>

        <div v-else-if="error">
          <p>An error occured while fetching the answers.</p>
        </div>

        <template v-if="data && data.user">
          <h2>{{ data.user.name }}</h2>
          <div>
            <h3>Following: {{ data.user.following.length }}</h3>
            <div class="flex-container" v-if="data.user.following.length">
              <UserItem
                class="user"
                v-for="user of data.user.following"
                v-bind:user="user"
                v-bind:key="user.id"
                v-bind:clientId="$apollo.client"
              />
            </div>
          </div>
          <div>
            <h3>Followers: {{ data.user.followers.length }}</h3>
            <div class="flex-container" v-if="data.user.followers.length">
              <UserItem
                class="user"
                v-for="user of data.user.followers"
                v-bind:user="user"
                v-bind:key="user.id"
                v-bind:clientId="$apollo.client"
              />
            </div>
          </div>
        </template>
      </template>
    </ApolloQuery>-->
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
              class="user"
              v-for="user of data.users"
              v-bind:user="user"
              v-bind:key="user.id"
              v-bind:clientId="$apollo.client"
              v-on:click.self="selectUser(user.id)"
              v-bind:class="{
                selected: selectedUser === user.id,
                following: following[user.id],
                followers: followers[user.id]
              }"
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
import USER_FOLLOW_USER from '../graphql/UserFollowUser.gql'
import USER_UNFOLLOW_USER from '../graphql/UserUnFollowUser.gql'
import USER_QUERY from '../graphql/UserFollowingFollowers.gql'

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
      selectedUser: '',
      following: {},
      followers: {}
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
    selectUser(id) {
      if (!this.selectedUser) {
        this.selectedUser = id
        this.$apollo
          .query({
            query: USER_QUERY,
            variables: {
              id: this.selectedUser
            },
            fetchPolicy: 'network-only'
          })
          .then(data => {
            // Result
            // console.log('success', data)
            const {
              data: {
                user: { following, followers }
              }
            } = data
            this.following = {}
            for (let i = 0; i < following.length; i++) {
              this.$set(this.following, following[i].id, true)
            }
            this.followers = {}
            for (let i = 0; i < followers.length; i++) {
              this.$set(this.followers, followers[i].id, true)
            }
            console.log('success', following)
            console.log('success', followers)
          })
          .catch(error => {
            // Error
            console.error('error', error)
          })
      } else if (this.selectedUser === id) {
        this.selectedUser = ''
        this.following = {}
        this.followers = {}
      } else {
        this.$apollo
          .mutate({
            mutation: this.following[id]
              ? USER_UNFOLLOW_USER
              : USER_FOLLOW_USER,
            variables: {
              id: this.selectedUser,
              follow: id
            },
            update: (store, { data }) => {
              // cacheUserAdd(store, createUser)
              // console.log(data)
            },
            fetchPolicy: 'no-cache'
          })
          .then(data => {
            // Result
            // console.log('success', data)
            const {
              data: {
                updateUser: { following, followers }
              }
            } = data
            this.following = {}
            for (let i = 0; i < following.length; i++) {
              this.$set(this.following, following[i].id, true)
            }
            this.followers = {}
            for (let i = 0; i < followers.length; i++) {
              this.$set(this.followers, followers[i].id, true)
            }

            console.log('success', following)
            console.log('success', followers)
          })
          .catch(error => {
            // Error
            console.error('error', error)
          })
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

  .user
    cursor pointer

  .selected
    border 3px solid red

  .following
    border-top 3px solid green
    border-bottom @border-top

  .followers
    border-left 3px solid yellow
    border-right @border-left

.add-user
  margin-bottom 10px

  label
    display inline-block
    margin-bottom 5px
</style>
