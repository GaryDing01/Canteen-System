<template>
<div>
  <p>Global</p>
</div>
</template>

<script>

  export default {
    props:['requester_ID'],
    req_ID:this.requester_ID,
    data() {
      return {
        
      };
    },

    mounted(){
        console.log(this.req_ID);
    },

    methods: {

     

  }
}
</script>

<style>
  
</style>