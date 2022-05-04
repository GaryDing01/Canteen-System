<template>
  <div>
    <div class="foodCarousel">
      <el-carousel trigger="click" :interval="3000" height="450px" arrow="always" style="width:1000px" type=card>
        <el-carousel-item v-for="item in imgList" :key="item.name">
          <img :src="item.src" style="height:100%;width:100%;" alt="图片丢失了" :title="item.title" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CustomShowPage',

    data () {
      return {
        imgList: [
          {
            name: "M5",
            src: require("@/assets/Dish/M5.png"),
            title: "pictureM5"
          },
          {
            name: "M2",
            src: require("@/assets/Dish/M2.png"),
            title: "pictureM2"
          },
          {
            name: "M3",
            src: require("@/assets/Dish/M3.png"),
            title: "pictureM3"
          },
          {
            name: "M4",
            src: require("@/assets/Dish/M4.png"),
            title: "pictureM4"
          }
        ]
      }
    },

    methods:{

    }
  }
</script>

<style scoped>
  .foodCarousel{
    position: absolute;
    left:50%;
    margin-left:-400px;
    top:180px;
  }
</style>
