<template>
  <div class="card" v-on="$listeners">
    <div>
      <p>{{ user.name }}</p>
    </div>
    <div>
      <div v-show="canEdit">
        <input type="text" ref="nameinput" v-model="nameInput" />
        <BaseButton icon="cancel" class="icon-button" v-on:click="toggleEdit" />
        <BaseButton icon="save" class="icon-button" v-on:click="userUpdate" />
      </div>
      <div v-show="!canEdit">
        <BaseButton
          icon="delete"
          class="icon-button secondary"
          v-on:click="userRemove"
        />
        <BaseButton
          icon="edit"
          class="icon-button secondary"
          v-on:click="toggleEdit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import USER_REMOVE_MUTATION from '../graphql/UserRemove.gql'
import USER_UPDATE_MUTATION from '../graphql/UserUpdate.gql'

import { cacheUserRemove } from '../cache/users'

import BaseButton from './BaseButton'

export default {
  components: {
    BaseButton
  },

  inheritAttrs: false,

  props: {
    user: {
      type: Object,
      required: true
    },
    clientId: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      nameInput: '',
      canEdit: false
    }
  },

  methods: {
    toggleEdit() {
      this.canEdit = !this.canEdit
      if (this.canEdit) {
        this.$nextTick(function() {
          this.$refs.nameinput.focus()
        })
      }
    },

    userRemove() {
      // Call to the graphql mutation
      this.$apollo.mutate({
        mutation: USER_REMOVE_MUTATION,
        client: this.clientId,
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
          client: this.clientId,
          variables: {
            id: this.user.id,
            name: nameInput
          }
        })
        .then(() => {
          // data => {
          // Result
          // console.log('success', data)
          this.toggleEdit()
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

<style lang="stylus" scoped>
@import '../styles/imports'

.card
  border 1px solid grey
  padding 10px
  margin 5px
  width 150px
  height 150px

  p
    ellipsis()
    margin-bottom 16px

.icon-button
  margin 5px
</style>
