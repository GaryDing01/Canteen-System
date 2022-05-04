<template>
  <div class="customDiv">
    <el-container style="height:100%" direction="vertical">
      <el-head>
        <div class="headDiv">
          <img src="../../assets/picture/logo.png" class="logoStyle">
          <ul>
            <li><a href="#" @click="pageSwitch(0)" :class="{ choosen: isChosen[0] }">首页</a></li>
            <li><a href="#" @click="pageSwitch(1)" :class="{ choosen: isChosen[1] }">点餐</a></li>
            <li><a href="#" @click="pageSwitch(2)" :class="{ choosen: isChosen[2] }">预约</a></li>
            <li><a href="#" @click="pageSwitch(3)" :class="{ choosen: isChosen[3] }">评价</a></li>
            <li><a href="#" @click="pageSwitch(4)" :class="{ choosen: isChosen[4] }">关于我们</a></li>
          </ul>
          <!-- 未登录组件 -->
          <el-button v-if="userID==-1" class="toLoginButton" type="primary" @click="toLogin()">登录</el-button>
          <el-button v-if="userID==-1" class="toRegisterButton" @click="toRegister()">注册</el-button>
          <!-- 登录后组件 -->
          <div class="welcomeText" v-if="userID!=-1">
            <p style="font-weight: 600">欢迎回来！</p>
            <p style="margin-top: -10px">{{currentName}}</p>
          </div>
          <el-button v-if="userID!=-1" class="settingButton" icon="el-icon-s-fold" circle @click="setting()"></el-button>
        </div>
      </el-head>
      <el-main style="background-color:#d3d3d3">
          <transition name="slide-fade" mode="out-in">
            <router-view :userID=userID></router-view>
          </transition>
      </el-main>
    </el-container>

    <!-- 登录对话框 -->
    <el-dialog
      :visible.sync="loginVisible"
      width="500px">
      <div class="loginDia" style="text-align: center">
        <p class="titleText">登录</p>
        <p>
          <input class="loginInput" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="username" :placeholder="usernamePlaceholder"/>
        </p>
        <p>
          <input class="loginInput" oninput ="value=value.replace(/[^A-Za-z0-9]/g,'')" v-model="password" type="password" :placeholder="passwordPlaceholder"/>
        </p>
        <p class="loginHintText">{{loginHint}}</p>
        <el-button class="loginButton" type="primary" @click="login()">登 录</el-button>
        <!-- <el-button v-if="isPhone" class="noteButton" icon="el-icon-message" circle @click="sendNote()" :disabled="!if_can_getCode">{{buttonmessage()}}</el-button> -->
        <el-button v-if="isPhone" class="noteButton" icon="el-icon-message" circle @click="sendNote()"></el-button>
        <div class="switchButton" >
          <el-button :icon="modeIcon" circle @click="switchLoginMode()"></el-button>
          <p>{{switchHint}}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 注册对话框 -->
    <el-dialog
      :visible.sync="registerVisible"
      width="500px">
      <div class="registerDia" style="text-align: center">
        <p class="titleText">注册</p>
        <p>
          <i class="el-icon-user" style="font-size:25px"></i>
          <input  class="registerInput" v-model="registerUsername" placeholder="输入姓名"/>
        </p>
        <p>
          <i class="el-icon-phone-outline"  style="font-size:25px"></i>
          <input class="registerInput" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="registerPhone" placeholder="输入手机号"/>
        </p>
        <p>
          <i class="el-icon-lock"  style="font-size:25px"></i>
          <input class="registerInput" oninput ="value=value.replace(/[^A-Za-z0-9]/g,'')" v-model="registerPassword"  type="password" placeholder="输入密码"/>
        </p>
        <p>
          <i class="el-icon-star-off" style="font-size:25px"></i>
          <el-date-picker
            class="registerDateSel"            
            v-model="registerBirthday"
            align="right"
            type="date"
            placeholder="选择您的生日"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </p>
        <p class="registerHintText">{{registerHint}}</p>
        <el-button class="registerButton" type="primary" @click="register()">注 册</el-button>
      </div>
    </el-dialog>

    <!-- 注册成功对话框 -->
    <el-dialog
      :visible.sync="registerSuccessVisible"
      width="700px">
      <div style="text-align: center">
        <p>
          <i class="el-icon-check" style="font-size:50px"></i>
        </p>
        <p style="font-size:20px;">
          注册成功，您的ID为{{registerSuccessID}}，请牢记！
        </p>
        <p><el-button type="primary" @click="confirm()">确 定</el-button></p>
      </div>
    </el-dialog>

    <!-- 设置抽屉 -->
    <el-drawer
      :visible.sync="settingDrawer"
      direction="rtl">
      <img :src="returnProfile()" class="profile">
      <i class="el-icon-edit" @click="editProfile()"></i>
      <p style="margin-left:100px;font-weight:900;font-size:21px">用户ID：<span style="font-weight:300;font-size:21px">{{userID}}</span></p>
      <p style="margin-left:100px;font-weight:900;font-size:21px">姓名：<span style="font-weight:300;font-size:21px">{{currentName}}</span></p>
      <p style="margin-left:100px;font-weight:900;font-size:21px">生日：<span style="font-weight:300;font-size:21px">{{currentBirthday}}</span></p>
      <p style="margin-left:100px;font-weight:900;font-size:21px">电话：<span style="font-weight:300;font-size:21px">{{currentPhone}}</span></p>
      <p style="margin-left:100px;font-weight:900;font-size:21px">积分：<span style="font-weight:300;font-size:21px">{{currentCredit}}</span></p>
      <p style="margin-left:270px;"><a href="#" @click="setPasswordVisible=true">修改密码</a></p>
      <el-button class="editButton" type="primary" @click="toEdit()">完善/修改个人信息</el-button>
      <el-button class="exitButton" type="danger" @click="exit()">退出登录</el-button>
    </el-drawer>

    <!-- 修改密码抽屉 -->
    <el-drawer
      :visible.sync="setPasswordVisible"
      direction="rtl">
      <p style="margin-left:100px;font-weight:900;font-size:21px">旧密码：</p>
      <p>
        <input class="loginInput" style="margin-left:100px;" oninput ="value=value.replace(/[^A-Za-z0-9]/g,'')" v-model="oldPassword" placeholder="请输入旧密码"/>
      </p>
      <p style="margin-left:100px;font-weight:900;font-size:21px">新密码：</p>
      <p>
        <input class="loginInput" style="margin-left:100px;" oninput ="value=value.replace(/[^A-Za-z0-9]/g,'')" v-model="newPassword" placeholder="请输入新密码"/>
      </p>
      <p style="margin-left:100px;font-weight:900;font-size:21px">再次输入新密码：</p>
      <p>
        <input class="loginInput" style="margin-left:100px;" oninput ="value=value.replace(/[^A-Za-z0-9]/g,'')" v-model="newPasswordCheck" placeholder="再次输入新密码"/>
      </p>
      <p class="setPasswordHintText">{{setPasswordHint}}</p>
      <el-button class="setPasswordButton" type="primary" @click="setPassword()">确认修改</el-button>
      <el-button class="setPasswordReturnButton" @click="setPasswordVisible=false">返回</el-button>
    </el-drawer>

    <!-- 修改头像对话框 -->
    <el-dialog
      title=""
      :visible.sync="editProfileVisible"
      width="30%">
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleFileUploaderChange">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-button style="margin-left:100px;margin-top:50px;" type="primary" @click="setProfile()">上 传</el-button>
      <el-button style="margin-left:50px" @click="editProfileVisible = false">取 消</el-button>
    </el-dialog>

    <!-- 修改个人信息 -->
    <el-dialog
      title=""
      :visible.sync="editInforVisible"
      width="30%">
      <p style="margin-left:60px;font-weight:900;font-size:21px">姓名：
        <input  class="editInput" v-model="editName" placeholder="输入姓名"/>
      </p>
      <p style="margin-left:60px;font-weight:900;font-size:21px">生日：
        <el-date-picker
          class="editDateSel"
          v-model="editBirthday"
          align="right"
          type="date"
          placeholder="选择您的生日"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </p>
      <p style="margin-left:60px;font-weight:900;font-size:21px">电话：
        <input class="editInput" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="editPhone" placeholder="输入手机号"/>
      </p>
      <el-button style="margin-left:100px;margin-top:50px;" type="primary" @click="editInfor()">修 改</el-button>
      <el-button style="margin-left:50px" @click="editInforVisible = false">取 消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import {getbcrypt,debcrypt,AESEncrypt} from '../../../static/js/encrypt'
export default {
  name: 'CustomPage',

  created(){
    this.$set(this.isChosen,0,true);
    this.$router.push({name:"MainPage"});
    let _this = this //很关键是要把父路由的vue实例赋给_this
    this.$bus.$on("getCusInfo", function() {
      _this.getCusInfo();
    });
  },

  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      isChosen:[false,false,false,false,false],
      pageName:["MainPage","OrderPage","ReservationPage","CommentPage","AboutUsPage"],
      userID:-1,

      profileReady:false,

      currentProfile:null,
      imageUrl:null,
      currentName:"",
      currentBirthday:"",
      currentPhone:"",
      currentCredit:0,

      editName:"",
      editBirthday:"",
      editPhone:"",

      loginVisible:false,
      registerVisible:false,
      registerSuccessVisible:false,
      settingDrawer:false,
      editProfileVisible:false,
      editInforVisible:false,
      setPasswordVisible:false,

      isPhone:false,
      username:"",
      password:"",
      loginHint:"",
      switchHint:"切换到手机登录",
      usernamePlaceholder:"请输入您的ID",
      passwordPlaceholder:"请输入您的密码",
      modeIcon:"el-icon-mobile",

      //手机验证码
      curr_reget_time:120,//重复获取还需要的时间
      if_can_getCode: true,//是否可获取
      clock: null,//计时器ss
      //手机验证码

      registerUsername:"",
      registerPassword:"",
      registerBirthday:"",
      registerPhone:"",
      registerHint:"",

      oldPassword:"",
      newPassword:"",
      newPasswordCheck:"",
      setPasswordHint:"",

      registerSuccessID:""
    }
  },

  watch:{

    loginVisible(val){
      if(val==false){
        this.username = "";
        this.password = "";
        this.loginHint = "";
        this.isPhone = false;
      }
    },

    registerVisible(val){
      if(val==false){
        this.registerUsername = "";
        this.registerPassword = "";
        this.registerPhone = "";
        this.registerBirthday = "";
        this.registerHint = "";
      }
    },

    registerSuccessVisible(val){
      if(val==false){
        this.registerSuccessID = "";
        this.registerVisible = false;
      }
    },

    isPhone(val){
      if(val){
        this.switchHint = "切换到账号登录";
        this.usernamePlaceholder = "请输入您的手机";
        this.passwordPlaceholder = "请输入验证码";
        this.modeIcon = "el-icon-user";
      }
      else{
        this.switchHint = "切换到手机登录";
        this.usernamePlaceholder = "请输入您的ID";
        this.passwordPlaceholder = "请输入您的密码";
        this.modeIcon = "el-icon-mobile";
      }
      this.username = "";
      this.password = "";
    },

    editInforVisible(val){
      if(val==false){
        this.editName = "";
        this.editBirthday = "";
        this.editPhone = "";
      }
      else{
        this.editName = this.currentName;
        this.editBirthday = this.currentBirthday;
        this.editPhone = this.currentPhone;
      }
    },

    setPasswordVisible(val){
      if(val==false){
        this.oldPassword = "";
        this.newPassword = "";
        this.newPasswordCheck = "";
        this.setPasswordHint = "";
      }
    },

    userID(val){
      if(val!=-1){
        this.currentProfile = null;
      }
    }

  },

  mounted() {
    this.regainVerCode();
  },

  methods:{

    pageSwitch(val){//页面切换
      for (var i=0 ; i<this.isChosen.length ; i++){
        if (i==val){
          this.$set(this.isChosen,val,true);
          continue;
        }
        this.$set(this.isChosen,i,false);
        this.$router.push({name:this.pageName[val]});
      }
    },

    toLogin(){
      this.loginVisible = true;
    },

    toRegister(){
      this.registerVisible = true;
    },

    switchLoginMode(){
      this.isPhone = !this.isPhone;
    },

    login(){
      if(this.isPhone){
        this.phoneLogin();
      }
      else{
        this.usernameLogin();
      }
    },

    // 短信登录按下发送短信按钮触发逻辑
    sendNote(){
      // 可以使用的一些变量：
      // this.loginHint  出错提示（默认为空字符串）
      if(!this.checkPhone())
      {
        this.loginHint = "*手机号格式错误";
        //console.log('手机号错误')
        return ;
      }
      if (this.if_can_getCode){
        const ver_code =  this.createNumCode();//创建随机验证码
        //console.log(this.username + ver_code);
        localStorage.setItem('verification_code',getbcrypt(this.username + ver_code));
        this.prevertRepeat();
        const encrypt_phone = AESEncrypt(this.username);
        const encrypt_code = AESEncrypt(ver_code);
        //调用短信发送接口
        const self = this;
          self.$axios
            //发送验证码
            .get("/api/Customer/MessageTest",{
              params:{
                cust_phone_AES: encrypt_phone,
                ver_code_AES: encrypt_code,
              }
            })
            .then(response=> {
              console.log(response.data);
              var error_message = '1';
              //var error_message = response.data;
              if (error_message == '1')
              {
                this.loginHint = "发送成功";
              }
              else{
                var code = 2 * parseInt(ver_code) - 1000000;
                this.loginHint = "短信余额不足：" + code;
              }
            })
      }
      else{
        this.$message('还需' + this.curr_reget_time +'秒后才能重新获取');
      }
    },

    // 短信登录按下登录按钮触发逻辑
    phoneLogin(){
      // 可以使用的一些变量：
      // this.username   第一个框中的内容（已保证只包含数字）
      // this.password   第二个框中的内容（已保证只含字母和数字）
      // this.loginHint  出错提示（默认为空字符串）
      if(!this.checkPhone())
      {
        //console.log('手机号格式错误');
        this.loginHint = "*手机号的格式错误";
        return;
      }
      if(!debcrypt(this.username + this.password, localStorage.getItem('verification_code')))
      {
        //console.log('手机号或验证码错误');
        this.loginHint = "*手机号或验证码错误";
        return;
      }
      
      var id = '';
      this.$axios
          //查询是否有该电话
          .post("/api/Customer/checkCustomerandAdd",{
              "phone": this.username
          })
          .then(response=> {
            id = response.data;
            //console.log(id);

            //成功登录的部分，与用户名密码相同
            //这里是原版代码
            // this.$alert('登录成功！', '提示', {
            //   	confirmButtonText: '确定'
            //   });
            //   this.$router.push({
            //     path:'/Reservation/CustomPage',
            //     name:'CustomPage'
            //   });
            //   sessionStorage.setItem("userID",id);
            //   sessionStorage.setItem("customPageTitle","欢迎来到和平饭店");

            this.$message("登陆成功！");
            this.userID = parseInt(id);
            this.username = id;
            this.getCusInfo();
            this.getCusProfile();
            this.loginVisible = false;
          })
    },

    buttonmessage(){
    if (this.if_can_getCode)//按钮的文本
      return '获取验证码';
    else
      return '还需' + this.curr_reget_time +'s';
    },

    regainVerCode(){ //用于刷新、关闭时的恢复
      const REGET_TIME = 120;
      var get_time = localStorage.getItem('get_time');
      var reget_time = REGET_TIME - parseInt( //计算剩余时间
              (new Date().getTime() - get_time) / 1000
          );
      //console.log(reget_time);
      if (reget_time > 0){
        this.if_can_getCode = false;
        this.curr_reget_time = reget_time;
        clearInterval(this.clock);
        this.clock = setInterval(() => {
        if (this.curr_reget_time > 0 && this.curr_reget_time <= REGET_TIME) {
          this.curr_reget_time--;
        } 
        else {
          this.if_can_getCode = true;
          localStorage.removeItem("verification_code");
          clearInterval(this.clock);
          this.clock = null;
        }
        }, 1000)
      } else {
        this.if_can_getCode = true;
        localStorage.removeItem("verification_code");
        //console.log('验证码过期');
      }
    },

    prevertRepeat() {
      const REGET_TIME = 120;//再次申请的时间间隔
      if (this.if_can_getCode) {
        this.if_can_getCode = false;
        this.curr_reget_time = REGET_TIME;
        localStorage.setItem("get_time", new Date().getTime());
        this.clock = setInterval(() => { //计时器
          if (this.curr_reget_time > 0 && this.curr_reget_time <= REGET_TIME) {
            this.curr_reget_time--;
          } 
          else {
            this.if_can_getCode = true;
            localStorage.removeItem("verification_code");
            clearInterval(this.clock);
            this.clock = null;
          }
        }, 1000)
      }
    },
    
    checkPhone(){//0代表不是，1代表是
        
        if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.username))
        {
          // console.log('不是手机号');
          return false;
        }
        else
        {
          // console.log('是手机号');
          return true;
        }
    },

    createNumCode() { //6位数字验证码
      var code = '';
      var codeLength = 6;      //验证码长度
      for (var i = 0; i < codeLength; i++) {
          var num = Math.floor(Math.random() * 9);        //随机数范围为0 ~ 10
          //字符串拼接
          code += num;
      }
      console.log(code);
      return code;
    },

    usernameLogin(){
      if(this.username==''){
        this.loginHint="*请输入用户名";
        return;
      }
      if(this.password==''){
        this.loginHint="*请输入密码";
        return;
      }
      this.$axios
        .get('/api/Customer/checkCustomerAndPwd',{
          params:{
            customer_id: this.username ,
            pwd: this.password
          }
        })
        .then(response=> {
          if(response.data==0){
            this.loginHint="*不存在该用户";
          }
          else if(response.data==2){
            this.loginHint="*密码错误";
          }
          else if(response.data==1){
            this.$message("登陆成功！");
            this.userID = this.username;
            this.getCusInfo();
            this.getCusProfile();
            this.loginVisible = false;
          }
        });
    },

    register(){
      if(this.registerUsername=="" || this.registerPassword=="" || this.registerPhone=="" || this.registerBirthday==""){
        this.registerHint = "*还有信息没有填入";
        return;
      }
      if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.registerPhone)==false){
        this.registerHint = "*请输入正确的手机号";
        return;
      }
      if(/^[A-Za-z0-9]{6,15}$/.test(this.registerPassword)==false){
        this.registerHint = "*密码长度需要在6~15位";
        return;
      }
      this.$axios
        .post('/api/Customer/newCustomer',{
            customer_name: this.registerUsername+'',
            birthday: this.registerBirthday+'',
            phone_num: this.registerPhone+'',
            customer_password: this.registerPassword+''
        })
        .then(response=> {
          if (response.data=="创建失败"){
            this.$message("创建失败，请稍后重试！");
          }
          else{
            this.registerSuccessID = response.data;
            this.registerSuccessVisible = true;
          }
        });
    },

    confirm(){     
      this.registerSuccessVisible = false;
    },

    setting(){
      this.settingDrawer = true;
    },

    getCusInfo(){
      this.$axios
        .get('/api/Customer/getCustomerInformation/'+this.userID)
        .then(response=> {
          this.currentName = response.data.customer_name;
          this.currentBirthday = response.data.birthday;
          this.currentPhone = response.data.phone_num;
          this.currentCredit = response.data.credit;
        });
    },

    getCusProfile(){
      this.profileReady = false;
      this.$axios
        .get('/api/Customer/getCustomerPict',{
          params:{
            customer_id: this.userID
          }
        })
        .then(response=> {
          this.currentProfile = 'data:image/jpeg;base64,' + response.data;
          if(response.data==""){
            this.currentProfile = "";
          }
          this.profileReady = true;
        })
    },

    handleFileUploaderChange(file){
      const self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload  = function(event){
        self.imageUrl = this.result;
      }
    },

    returnProfile(){
      if(this.currentProfile){
        return this.currentProfile;
      }
      return require("../../assets/picture/defaultProfile.jpeg");
    },

    editProfile(){
      if(this.profileReady){
        this.editProfileVisible = true;
        this.imageUrl = this.currentProfile;
      }
      else{
        this.$message("正在拉取头像信息，请稍后再试");
      }
    },

    setProfile(){
      this.$axios
        .post('/api/Customer/setCustomerPict',{
          customer_id: this.userID+'',
          pict: this.imageUrl+''
        })
        .then(response=> {
          this.getCusProfile();
          this.editProfileVisible = false;
        });
    },

    toEdit(){
      this.editInforVisible = true;
    },

    editInfor(){
      if(this.editName=="" || this.editBirthday=="" || this.editPhone==""){
        this.$message("还有未填入的信息哦");
        return;
      }
      if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.editPhone)==false){
        this.$message("请输入正确的手机号");
        return;
      }
      this.$axios
        .post('/api/Customer/setCustomerInfo',{
            customer_id: this.userID+'',
            customer_name: this.editName+'',
            birthday: this.editBirthday+'',
            phone_num: this.editPhone+'',
        })
        .then(response=> {
          if(response.data==1){
            this.$message("修改成功！");
          }
          else{
            this.$message("修改失败！");
          }
          this.getCusInfo();
          this.editInforVisible = false;
        })
    },

    setPassword(){
      if(this.oldPassword=="" || this.newPassword=="" || this.newPasswordCheck==""){
        this.setPasswordHint = "*请输入所有内容";
        return;
      }
      if(/^[A-Za-z0-9]{6,15}$/.test(this.newPassword)==false){
        this.setPasswordHint = "*新密码的长度需为6~15位";
        return;
      }
      if(this.newPassword!=this.newPasswordCheck){
        this.setPasswordHint = "*两次输入的新密码不一致";
        return;
      }
      this.$axios
        .post('/api/Customer/setCustomerPwd',{
            customer_id: this.userID+'',
            customer_password: this.oldPassword+'',
            new_password: this.newPassword+'',
        })
        .then(response=> {
          console.log("success");
          console.log(response.data);
          if(response.data==1){
            this.$message("修改成功！");
            this.setPasswordVisible = false;
          }
          else if(response.data==2){
            this.setPasswordHint = "*原密码错误！";
          }
        })
    },

    exit(){
      this.userID = -1;
      this.settingDrawer = false;
    }

  }
}
</script>

<style scoped>

  /* 主部分 */
  .customDiv{
    height:100%; 
  }

  .headDiv{
    border-bottom: 2px solid rgba(39, 39, 39, 0.37);
    height: 100px;
  }

  .logoStyle{
    position:absolute;
    width:80px;
    height:80px;
    left:70px;
    top:20px;
  }

  .toLoginButton{
    position: absolute;
    top:50px;
    left:1150px;
  }

  .toRegisterButton{
    position: absolute;
    top:50px;
    left:1230px;
  }

  .welcomeText{
    position: absolute;
    left: 1150px;
    top: 30px;
  }

  .settingButton{
    position:absolute;
    left:1250px;
    top:55px;
  }

  /* 登录框 */
  .loginDia{
    height:440px;
  }

  .titleText{
    font-size: 30px;
    font-weight: 600;
  }

  .loginInput{
    text-align: center;
    width: 240px;
    height: 48px;
    margin-bottom: 20px;
    margin-left: 0px;
    border:none;
    border-left:2px solid rgb(202, 202, 202);
    border-right:2px solid rgb(202, 202, 202);
    border-top:2px solid rgb(202, 202, 202);
    border-bottom:2px solid rgb(202, 202, 202);
    border-radius: 28px;
    outline: none;
    font-size: 16px;
    transition: .5s;
  }

  .loginInput:hover{
    border-left:2px solid rgb(157, 216, 255);
    border-right:2px solid rgb(157, 216, 255);
    border-top:2px solid rgb(157, 216, 255);
    border-bottom:2px solid rgb(157, 216, 255);
  }

  .loginHintText{
    position:absolute;
    text-align: left;
    left: 130px;
    top: 310px;
    color: red;
  }

  .loginButton{
    position:absolute;
    width:200px;
    top:370px;
    left:150px;
  }

  .switchButton{
    position:absolute;
    left:200px;
    top:450px;
  }
  
  .noteButton{
    position: absolute;
    top:255px;
    left:315px;
  }

  /* 注册框 */
  .registerDia{
    height:450px;
  }

  .registerInput{
    background-color: rgb(255, 255, 255);
    width: 240px;
    height: 36px;
    margin-bottom: 20px;
    margin-left: 20px;
    border: none;
    border-bottom: 2px solid silver;
    outline: none;
    font-size: 16px;
    transition: .5s;
  }

  .registerInput:hover{
    border-bottom: 2px solid rgb(157, 216, 255);
  }

  .registerDateSel{
    width: 240px;
    height: 36px;
    margin-bottom: 20px;
    margin-left: 20px;
  }

  .registerHintText{
    position:absolute;
    text-align: left;
    left: 105px;
    top: 430px;
    color: red;
  }

  .registerButton{
    position:absolute;
    width:200px;
    top:480px;
    left:160px;
  }

  /* 导航栏 */
  ul{
    position: relative;
    width:80%;
    display: block;
    top: 35px;
    left: 170px;
    padding: 0;
  }

  ul li{
    list-style: none;
    float:left;
  }

  ul li a{
    position: relative;
    display: block;
    text-align: center;
    margin: 0 15px;/*选项间间隔 */
    color: #262626;
    font-size: 22px;
    text-decoration: none;
    text-transform: uppercase;
    transition: .5s;
    padding: 5px 10px;
  }

  .choosen{
    color:#fff;
    background-color: #ffcb3d;
    border-radius: 5px;
  }

  ul li a:hover{
    color:#fff;
    background-color: #ffcb3d;
    border-radius: 5px;
  }

  ul li a:before{
    content: '';
    position:absolute;
    bottom: 12px;
    left: 12px;
    width: 12px;
    height: 12px;
    border: 3px solid #ffcb3d;
    border-width: 0 0 3px 3px;
    transition: .5s;
    opacity: 0;
  }

  ul li a:hover:before{
    bottom: -8px;
    left: -8px;
    opacity: 1;
  }

  ul li a:after{
    content: '';
    position:absolute;
    top: 12px;
    right: 12px;
    width: 12px;
    height: 12px;
    border: 3px solid #ffcb3d;
    border-width: 3px 3px 0 0;
    transition: .5s;
    opacity: 0;
  }

  ul li a:hover:after{
    top: -8px;
    right: -8px;
    opacity: 1;
  }

  .customDivider{
    position: relative;
    bottom: 0;
  }

  /* 切换动画 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter{
    transform: translateX(10px); 
    transform: translateX(10px); 
    opacity: 0;
  } 

  .slide-fade-leave-to{
    transform: translateX(-10px); 
    opacity: 0;
  }

  /* 信息框 */
  .profile{
    width: 178px;
    height: 178px;
    margin-left: 125px;
    border-radius: 50%;
  }

  .el-icon-edit:hover{
    color:#409EFF;
  }

  .editButton{
    position: absolute;
    width: 200px;
    left: 130px;
    top: 580px;
  }

  .exitButton{
    position: absolute;
    width: 200px;
    left: 120px;
    top: 650px;
  }

  /* 编辑头像对话框 */
  .avatar-uploader {
    width:200px;
    height:200px;
    left: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }

  /* 编辑资料对话框 */
  .editInput{
    background-color: rgb(255, 255, 255);
    width: 160px;
    height: 36px;
    margin-bottom: 20px;
    margin-left: 20px;
    border: none;
    border-bottom: 2px solid silver;
    outline: none;
    font-size: 16px;
    transition: .5s;
  }

  .editDateSel{
    width: 160px;
    height: 36px;
    margin-bottom: 20px;
    margin-left: 20px;
  }

  /* 修改密码抽屉 */
  .setPasswordHintText{
    position:absolute;
    text-align: left;
    left: 105px;
    top: 500px;
    color: red;
  }

  .setPasswordButton{
    position: absolute;
    width: 200px;
    left: 130px;
    top: 550px;
  }

  .setPasswordReturnButton{
    position: absolute;
    width: 200px;
    left: 120px;
    top: 620px;
  }

</style>
