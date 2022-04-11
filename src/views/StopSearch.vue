<template>
  <div class="stop-search">
    <h1>STOP SEARCH</h1>
    <b-form-input v-model="stopSearchParam" @input="debounceSearchParam" placeholder="Enter stop name"></b-form-input>
    <ul v-if="stopSearchResults.length !== 0">
      <li v-for="stop in stopSearchResults" :key="stop.id"><router-link :to="{ name: 'StopDetails', params: {id: stop.id }}">{{ stop.name }} ({{ stop.district }})</router-link> </li>  
    </ul>
    <span v-else> no stops</span>
  </div>
</template>


<script>
import _ from 'lodash'

export default {
  data() {
    return {
      stopSearchParam: null,
      stopSearchResults: [],
      stopSearchIsLoading: false
    }
  },
  created(){},
  methods: {
    debounceSearchParam: _.debounce(function(){
      this.searchStop(this.stopSearchParam)
    }, 250),
    searchStop: function(parameter) {
      if (!parameter) return false; 
      fetch(`/api/search/stop/${parameter}`)
        .then(response => response.json())
        .then(data => this.stopSearchResults = data)
    }
}
}
</script>
