<template>
  <div class="stop-details">
    <h1>Stop DETAILS</h1>
    <h2>{{stopDetails.name}} ({{stopDetails.district}})</h2>
  </div>
</template>

<script>

export default {
  data() {
    return {
      stopId: null,
      stopDetails: {},
      stopDetailsIsLoading: false
    }
  },
  created(){
    this.stopId = this.$route.params.id;
    this.getStopDetail(this.stopId);
  },
  methods: {
    getStopDetail: function(parameter) {
      if (!parameter) {
          return false
      }
      fetch(`/api/stop/${parameter}`)
        .then(response => response.json())
        .then(data => this.stopDetails = data)
    }
}
}
</script>


