<template>
  <div class="bus-details">
    <h1>BUS DETAILS</h1>
    <h2>{{busDetails.id}} - {{busDetails.name}}</h2>
  </div>
</template>

<script>

export default {
  data() {
    return {
      busId: null,
      busDetails: {},
      busDetailsIsLoading: false
    }
  },
  created(){
    this.busId = this.$route.params.id;
    this.getBusDetail(this.busId);
  },
  methods: {
    getBusDetail: function(parameter) {
      if (!parameter) {
          console.log('goo');
          return false
      }
      fetch(`/api/bus/${parameter}`)
        .then(response => response.json())
        .then(data => this.busDetails = data)
    }
}
}
</script>


