import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { apolloClient } from './clientA'
import { apolloClient as apolloClientB } from './clientB'

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  clients: {
    a: apolloClient,
    b: apolloClientB
  },
  defaultClient: apolloClient
})

export { apolloProvider }
