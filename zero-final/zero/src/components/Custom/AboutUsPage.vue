<template>
  <div>
    <el-card class="mapCard">
      <div style="width: 800px; height: 500px;">
        <amap
          :zoom="15"
          :center="[121.22188825819777, 31.28782255781357]"
        >
          <amap-marker
            :position="[121.22188825819777, 31.28782255781357]"
            :label="{
              content: '和平饭店',
              direction: 'bottom',
            }"
          />
        </amap>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {

  name: 'AboutUsPage',

  mounted(){
  },

  data() {
      return { 
       
      };
    },
    methods: {


    }

}
</script>

<style scoped>

  .mapCard{
    position: relative;
    left: 300px;
    width: 840px;
  }

</style>
