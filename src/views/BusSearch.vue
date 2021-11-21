<template>
  <div class="bus-search">
    <h1>BUS SEARCH</h1>
    <b-form-input v-model="busSearchParam" @input="debounceSearchParam" placeholder="Enter bus id or route name"></b-form-input>
    <ul v-if="busSearchResults.length !== 0">
      <li v-for="bus in busSearchResults" :key="bus.id">{{ bus.name }}</li>  
    </ul>
    <span v-else> no buses</span>
  </div>
</template>


<script>
import _ from 'lodash'

export default {
  data() {
    return {
      busSearchParam: null,
      busSearchResults: [],
      busSearchIsLoading: false
    }
  },
  created(){},
  methods: {
    debounceSearchParam: _.debounce(function(){
      this.searchBus(this.busSearchParam)
    }, 250),
    searchBus: function(parameter) {
      if (!parameter) return false; 
      fetch(`/api/search/bus/${parameter}`)
        .then(response => response.json())
        .then(data => this.busSearchResults = data)
    }
}
}
</script>
