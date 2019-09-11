<template>
  <div>
    <input type="text" v-model="nameInput" />
    <button v-on:click="UserAdd">Add</button>
  </div>
</template>

<script>
import USER_ADD_MUTATION from '../graphql/UserAdd.gql'

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
          }
        })
        .then(data => {
          // Result
          console.log('success', data)
        })
        .catch(error => {
          // Error
          console.error('error', error)
          // We restore the initial user input
          this.nameInput = nameInput
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
