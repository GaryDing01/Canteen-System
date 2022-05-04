<template>
  <div>
    <!-- <p>主界面</p> -->
    <el-card class="specialCard" v-show="cardsp">
  <div slot="header" class="special_div1">
    <span class="special_span1">欢迎来到和平饭店！</span>
  </div>

  <div class="specialDish1">
    <el-image style="width:250px;height:250px;margin-top:15px;margin-left:10px;" 
    :src="'data:image/jpeg;base64,' + specialt1" @click.native="showSP1()">
    </el-image>
    <p class="sD1_p">特色菜：{{this.st1}}</p>
  </div>
  <div class="specialDish2">
    <el-image style="width:250px;height:250px;margin-top:15px;margin-left:10px;" 
    :src="'data:image/jpeg;base64,' + specialt2" @click.native="showSP2()">
    </el-image>
    <p class="sD2_p">特色菜：{{this.st2}}</p>
  </div>
  <div class="specialDish3">
    <el-image style="width:250px;height:250px;margin-top:15px;margin-left:10px;" 
    :src="'data:image/jpeg;base64,' + specialt3" @click.native="showSP3()">
    </el-image>
    <p class="sD3_p">特色菜：{{this.st3}}</p>
  </div>
  <div class="specialDish4">
    <el-image style="width:250px;height:250px;margin-top:15px;margin-left:10px;" 
    :src="'data:image/jpeg;base64,' + specialt4" @click.native="showSP4()">
    </el-image>
    <p class="sD4_p">特色菜：{{this.st4}}</p>
  </div>

  <div class="special_div2">
    <span class="special_span2">点击图片可查看特色菜详细信息！</span>
  </div>


</el-card>


<!-- 展示图片信息弹窗卡片 -->
<div style="z-index:99;width:1500px;height:540px;" @click="closeSP()">
<!-- 图片 -->
<div >
  <el-card class="sp_Pic" v-show="cardsp_Pic">
    <el-image style="width:360px;height:360px;margin-top:-20px;margin-left:-20px;" 
    :src="'data:image/jpeg;base64,' + choosespecial" @click.native="closeSP()">
    </el-image>
  </el-card>
</div>

<!-- 信息 -->
<div>
  <el-card class="sp_Info" v-show="cardsp_Info">
    <div class="sp_info_title"><span>{{this.choosename}}</span></div>
    <div><p class="sp_info_context">{{"\xa0\xa0"}}{{this.chooseInfo}}</p></div>
    <div class="sp_info_foot"><span>请点击任意一处返回</span></div>
  </el-card>
</div>

</div>


  </div>
</template>

<script>
export default {
  name: 'MainPage',

  mounted(){
    this.getspecial();
  },


  data () {
    return {
      specialt1:null, st1:"", stInfo1:"",
      specialt2:null, st2:"", stInfo2:"",
      specialt3:null, st3:"", stInfo3:"",
      specialt4:null, st4:"", stInfo4:"",

      // 卡片开关
      choosespecial:null,
      choosename:'',
      chooseInfo:"",
      cardsp:true,
      cardsp_Pic:false,
      cardsp_Info:false,
    }
  },

  methods:{
    // 获得前四图片
    getspecial(){
      this.$axios.get("/api/Dish/getTOP4",{
      }).then(response=>{
        console.log("response.data");
        console.log(response.data);
        this.specialt1=response.data[0].dish_pict; this.st1=response.data[0].dish_name; this.stInfo1=response.data[0].dish_info;
        this.specialt2=response.data[1].dish_pict; this.st2=response.data[1].dish_name; this.stInfo2=response.data[1].dish_info;
        this.specialt3=response.data[2].dish_pict; this.st3=response.data[2].dish_name; this.stInfo3=response.data[2].dish_info;
        this.specialt4=response.data[3].dish_pict; this.st4=response.data[3].dish_name; this.stInfo4=response.data[3].dish_info;
        // this.per_pic=response.data;
      }).catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
    },

    // 获得特色菜信息
    showSP1(){
      this.cardsp=false;
      // console.log('SP1');

      this.choosespecial=this.specialt1;
      this.choosename=this.st1;
      this.chooseInfo=this.stInfo1;

      this.cardsp_Pic=true;
      this.cardsp_Info=true;
    },

    showSP2(){
      this.cardsp=false;
      // console.log('SP1');

      this.choosespecial=this.specialt2;
      this.choosename=this.st2;
      this.chooseInfo=this.stInfo2;

      this.cardsp_Pic=true;
      this.cardsp_Info=true;
    },

    showSP3(){
      this.cardsp=false;
      // console.log('SP1');

      this.choosespecial=this.specialt3;
      this.choosename=this.st3;
      this.chooseInfo=this.stInfo3;

      this.cardsp_Pic=true;
      this.cardsp_Info=true;
    },

    showSP4(){
      this.cardsp=false;
      // console.log('SP1');

      this.choosespecial=this.specialt4;
      this.choosename=this.st4;
      this.chooseInfo=this.stInfo4;
      console.log(this.chooseInfo);

      this.cardsp_Pic=true;
      this.cardsp_Info=true;
    },

    //关闭卡片
    closeSP(){
      this.cardsp=true;
      this.cardsp_Pic=false;
      this.cardsp_Info=false;
    }
  }
}
</script>

<style scoped>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .special_div1:before,
  .special_div1:after {
    display: table;
    content: "";
  }
  .special_div1:after {
    clear: both
  }

  .specialCard {
    width: 1350px;
    height:500px;
    position:absolute;
    left:100px;
  }

  .special_div2{
    position:absolute;
    left:520px;
    top:450px;
  }
  
  /* 欢迎来到和平饭店文字 */
  .special_span1{
    font-size:23px;
    margin-left:560px;
  }

  /* 点击图片...文字 */
  .special_span2{
    font-size:20px;
    color:rgb(156, 148, 148)
  }

  /* 四道菜的图片 */
  .specialDish1{
    /* background-color: aqua; */
    width:300px;
    position:absolute;
    left:30px;
  }

  .specialDish2{
    /* background-color: green; */
    width:300px;
    position:absolute;
    left:370px;
  }

  .specialDish3{
    /* background-color: orange; */
    width:300px;
    position:absolute;
    left:710px;
  }

  .specialDish4{
    /* background-color:chocolate; */
    width:360px;
    position:absolute;
    left:1050px;
  }

  /* 四个菜的文字 */
  .sD1_p{
    margin-left:50px;
    font-size:20px;
  }

  .sD2_p{
    margin-left:50px;
    font-size:20px;
  }

  .sD3_p{
    margin-left:50px;
    font-size:20px;
  }

  .sD4_p{
    margin-left:50px;
    font-size:20px;
  }

  /* 图片卡片 */
  .sp_Pic{
    width:360px;
    height:360px;
    z-index:8;
    background-color:rgb(231, 247, 141);
    position:absolute;
    left:300px;
    top:200px;
  }

  /* 信息卡片 */
  .sp_Info{
    width:360px;
    height:360px;
    z-index:8;
    background-color:rgb(236, 247, 181);
    position:absolute;
    right:300px;
    top:200px;
  }

  .sp_info_title{
    /* margin-left:125px; */
    font-size:20px;
    width:100%;
    text-align:center;
  }

  .sp_info_context{
    margin-top:60px;
  }

  .sp_info_foot{
    /* margin-left:80px;
    margin-top:100px; */
    position:absolute;
    right:105px;
    top:300px;
    color:rgb(156, 148, 148);
  }

</style>
