<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/self-relation">Self Relation</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="stylus">
@import './styles/main'
</style>
