import USERS_QUERY from '../graphql/Users.gql'

export function cacheUserAddToList(list, item) {
  const index = list.findIndex(i => i.id === item.id)
  if (index === -1) {
    list.splice(0, 0, item)
    // list.push(item)
  }
}

export function cacheUserRemoveFromList(list, item) {
  const index = list.findIndex(i => i.id === item.id)
  if (index !== -1) {
    list.splice(index, 1)
  }
}

export function cacheUserAdd(store, item) {
  const query = {
    query: USERS_QUERY
  }

  // Read the cache
  const data = store.readQuery(query)

  // Transformation
  cacheUserAddToList(data.users, item)

  // Write the result to the cache
  store.writeQuery({ ...query, data })
}

export function cacheUserRemove(store, item) {
  const query = {
    query: USERS_QUERY
  }

  // Read the cache
  const data = store.readQuery(query)

  // Transformation
  cacheUserRemoveFromList(data.users, item)

  // Write the result to the cache
  store.writeQuery({ ...query, data })
}
