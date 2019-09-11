<template>
  <div v-if="usersConnection">
    <div class="div">
      <p v-for="user in usersConnection.edges" :key="user.node.id">
        {{ user.node.name }}
      </p>
    </div>
    <button v-if="usersConnection.pageInfo.hasNextPage" v-on:click="handleMore">
      More
    </button>
  </div>
</template>

<script>
import USERS_CONNECTION from '@/graphql/usersConnection.gql'

const model = 'usersConnection'

export default {
  apollo: {
    [model]: USERS_CONNECTION
  },

  methods: {
    handleMore() {
      this.$apollo.queries[model].fetchMore({
        variables: {
          after: this[model].pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult

          return {
            [model]: {
              __typename: fetchMoreResult[model].__typename,
              edges: [
                ...previousResult[model].edges,
                ...fetchMoreResult[model].edges
              ],
              pageInfo: { ...fetchMoreResult[model].pageInfo }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.div {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
}
</style>
