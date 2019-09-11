# Something

## Setup

### Required Packages

```
yarn add vue-apollo graphql apollo-client apollo-link apollo-link-http apollo-link-ws subscriptions-transport-ws apollo-cache-inmemory graphql-tag apollo-utilities
```

### Webpack GraphQL Loader

```javascript
// vue.config.js

module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
  }
}
```
