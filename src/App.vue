<template>
  <div id="app">
    <b-container>

    <div id="nav">

    <div>
      <b-nav tabs fill>
        <b-nav-item active> <router-link :to="{ name: 'BusSearch'}">Bus Search</router-link></b-nav-item>
        <b-nav-item active> <router-link :to="{ name: 'StopSearch'}">Stop Search</router-link></b-nav-item>
        <b-nav-item active> <router-link :to="{ name: 'RoutePlanner'}">Route Planner</router-link></b-nav-item>
        <b-nav-item active> <router-link :to="{ name: 'ClosestStop'}">Closest Stop</router-link></b-nav-item>

      </b-nav>
    </div>
      
    </div>

    <router-view/>
    </b-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
