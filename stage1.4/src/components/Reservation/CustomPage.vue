<template>

  <div>

      <div>

        <el-container class="customContainer">
          <el-header class="customPageHeader">
            <img src="../../assets/logo.png" class="logoStyle">
            <p class="titleText">{{title}}</p>
            <el-button class="exitButton" type="danger" @click="exit()">退出当前用户</el-button>
            <el-divider></el-divider>
          </el-header>

          <el-container>
          <el-aside
          class="customAside"
          width="200px">
            <el-menu
            class="sideOption"
            router>

              <el-submenu index="1">
                <template slot="title">用户信息</template>
                <el-menu-item-group>
                  <el-menu-item index='/Reservation/CustomInformationPage' @click="titleChange('我的信息')">我的信息</el-menu-item>
                  <el-menu-item index='/CustomAccount/CustomUpdatePasswordPage' @click="titleChange('修改密码')">修改密码</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">预约</template>
                <el-menu-item-group>
                  <el-menu-item index='/Reservation/ReservationInformationPage' @click="titleChange('我的预约')">我的预约</el-menu-item>
                  <el-menu-item index='/Reservation/ReservationPage' @click="titleChange('我要预约')">我要预约</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">订单</template>
                <el-menu-item-group>
                  <el-menu-item index='/Order' @click="titleChange('我的订单')">历史订单</el-menu-item>
                  <el-menu-item index='/Ordering' @click="titleChange('我要点餐')">我要点餐</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>



            <el-main>
              <router-view :userID="userID"></router-view>
            </el-main>
          </el-container>

        </el-container>

      </div>

      <!-- <div>
        <p>{{userID}}</p>
        <button @click="test()">nomarl</button>
        <button @click="test2()">xxx</button>
      </div> -->

  </div>

</template>

<script>

export default {

  name: 'CustomPage',

  created(){
      this.userID = sessionStorage.getItem("userID");
      this.title = sessionStorage.getItem("customPageTitle");
      this.$router.push({
        path:'/Show/CustomShowPage',
        name:'CustomShowPage'
      });
  },

  data () {
    return {
      userID: -1,
      title: "欢迎来到提瓦特大饭店"
    }
  },
  
mounted() {
  this.return_to_login();
},

  methods: {
    return_to_login(){
      if(sessionStorage.getItem('userID') == null)
      {
        alert("请先登录!");
        console.log("用户未登录");
                this.$router.push({
                path: '/',
                name: 'MainPage',
              });
      }
    },
    exit(){
      this.$router.push({
        path:'/CustomAccount/CustomLoginPage',
        name:'CustomLoginPage'
      });
    },

    titleChange(title){
      /* sessionStorage.setItem("customPageTitle",title);
      this.title = sessionStorage.getItem("customPageTitle"); */
    }
  }

}

</script>

<style>

  .logoStyle{
    position:absolute;
    width:80px;
    height:80px;
  }

  .exitButton{
    position: absolute;
    width:150px;
    top:30px;
    right:50px
  }

  .customAside{
    z-index:3;
  }

  .customContainer{
    height:740px;
  }

  .sideOption{
    height:100%;
  }

  .titleText{
    font-size: 25px;
    font-weight: 600;
    top: 10px;
    margin-left: 100px;
  }

  .customPageHeader{
    height:90px !important;
  }

</style>
