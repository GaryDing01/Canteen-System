<template>

  <div>

    <div class="background" :style="backgroundIm"></div>

    <div class="loginList">
      <form>
        <p class="titleText">顾客登录</p>
        <input :placeholder="firstInputHolder"  v-model="username"/>
        <input :placeholder="secondInputHolder" :type="secondInputType" v-model="password"/>
        <p class="hintText">{{hint}}</p>
      </form>
    </div>

    <div>
      <button :class="{ codeButton:!this.loginModel}"
      @click="sendmessage()" :disabled="codeButtonDisabled || !if_can_getCode">{{buttonmessage()}}</button>
    </div>

    <div>
      <button class="loginButton" @click="login()">登录</button>
      <button class="butallexitcl" @click="exitall()">返回主页面</button>
    </div>

    <div>
      <a href="javascript::"
       @click="changeMethod()"
       class="changeHint">
       {{methodHint}}
      </a>
    </div>

    <div>
      <router-link class="registerHref" :to="'/CustomAccount/CustomRegisterPage'">还没有账号？点击这里注册</router-link>
    </div>

  </div>

</template>



<script>
import {getbcrypt,debcrypt,AESEncrypt} from '../../../static/js/encrypt'
//import {getbcrypt,debcrypt,MD5SaltEncrypt,CheckPWD,AESEncrypt,AESDecrypt,MessageAES, MD5Encrypt} from '../../static/js/encrypt'
export default {

  name: 'CustomLoginPage',

  watch:{
    loginModel(val){
      this.username = '';
      this.password = '';
      this.codeButtonDisabled = val;
      this.hint = '';
      if(val){
        this.methodHint="切换到手机登录",
        this.firstInputHolder="用户名";
        this.secondInputHolder="密码";
        this.secondInputType = 'password';
      }
      else{
        this.methodHint="切换到账号登录",
        this.firstInputHolder="手机号";
        this.secondInputHolder="验证码";
        this.secondInputType = '';
      }
    }
  },

  data () {
    return {
      backgroundIm:{
        backgroundImage: "url(" + require("../../assets/mainBackground.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      },
      hint:'',
      username:'',
      password:'',
      loginModel:true,
      methodHint:"切换到手机登录",
      secondInputType:"password",
      firstInputHolder:"用户名",
      secondInputHolder:"密码",
      codeButtonDisabled:true,

      curr_reget_time:120,//重复获取还需要的时间
      if_can_getCode: true,//是否可获取
      clock: null,//计时器ss
    }
  },

mounted() {
  this.regainVerCode();
},

  methods:{

    changeMethod(){
      this.loginModel = (!this.loginModel);
    },

    exitall(){
      this.$router.push({
        path:'/',
      });
    },

    login(){
      if(this.loginModel){
        this.usernameLogin()
      }
      else{
        this.phoneLogin();
      }
      sessionStorage.setItem("currentOrderState","1");
    },

    usernameLogin(){
      if(this.password==''){
        this.hint = "*输入的密码不能为空";
        return;
      }
      console.log('usernameLogin')
      this.$axios
        .get('/api/Customer/checkCustomerAndPwd',{
          params:{
            customer_id: this.username ,
            pwd: this.password
          }
        })
        .then(response=> {
          this.test = response.data;
          switch(response.data){
            case 0:
              this.hint = "*用户名不存在";
              break;
            case 1:
              this.$alert('登录成功！', '提示', {
              	confirmButtonText: '确定'
              });
              this.$router.push({
                path:'/Reservation/CustomPage',
                name:'CustomPage'
              });
              sessionStorage.setItem("userID",this.username);
              sessionStorage.setItem("customPageTitle","欢迎来到和平饭店");
              break;
            case 2:
              this.hint = "*密码错误，请重新输入";
              break;
          }
        })
    },

    //手机登录状态下登录按钮按下响应事件
    phoneLogin(){
      if(!this.checkPhone())
      {
        //console.log('手机号格式错误');
        this.hint = "*手机号的格式错误";
        return;
      }
      if(!debcrypt(this.username + this.password, localStorage.getItem('verification_code')))
      {
        //console.log('手机号或验证码错误');
        this.hint = "*手机号或验证码错误";
        return;
      }
  //成功登录
      var id = '';
      this.$axios
          //查询是否有该电话
          .post("/api/Customer/checkCustomerandAdd",{
              "phone": this.username
          })
          .then(response=> {
            id = response.data;
            console.log(id);
            //以用户id登录
            this.$alert('登录成功！', '提示', {
              	confirmButtonText: '确定'
              });
              this.$router.push({
                path:'/Reservation/CustomPage',
                name:'CustomPage'
              });
              sessionStorage.setItem("userID",id);
              sessionStorage.setItem("customPageTitle","欢迎来到和平饭店");
          })
      },

    returnCodeButtonStyle(){
      if (!this.loginModel){
        return "codeButton";
      }
      return "";
    },

    //获取验证码按钮按下响应事件
    sendmessage()
    {
      if(!this.checkPhone())
      {
        this.hint = "*手机号格式错误";
        //console.log('手机号错误')
        return ;
      }
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
          .get("/api/Canteen/MessageTest",{
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
              this.hint = "发送成功";
            }
            else{
              var errorcode = 2 * parseInt(ver_code) - 1000000
              this.hint = "短信余额不足:" + errorcode;
            }
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
          //console.log('不是手机号');
          return false;
        }
        else
        {
          //console.log('是手机号');
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


  }
}
</script>



<style scoped>

  .background{
    width:100%;
    height:100%;
    z-index:1;
    position: absolute;
  }

  .changeHint{
    z-index: 3;
    text-decoration:none;
    position:absolute;
    left: 50%;
    margin-left: 50px;
    top: 50%;
    margin-top:70px;
  }

  .loginList{
    z-index:1;
    position: absolute;
    width: 400px;
    height: 430px;
    top: 50%;
    margin-top: -200px;
    left: 50%;
    margin-left: -200px;
    background-color: aliceblue;
    border-radius: 25px;
    text-align: center;
    padding: 5px 40px;
    box-sizing: border-box;
  }

  .titleText{
    font-size: 42px;
    font-weight: 600;
  }

  .hintText{
    text-align: left;
    margin-top: 10px;
    margin-bottom: -60px;
    color: red;
  }

  input{
    background-color: aliceblue;
    width: 100%;
    height: 48px;
    margin-bottom: 10px;
    border: none;
    border-bottom: 2px solid silver;
    outline: none;
    font-size: 22px;
  }

  .codeButton{
    z-index:5;
    position:absolute;
    left: 50%;
    margin-left: 80px;
    top: 50%;
    margin-top:0px;
    height:56px;
    background-color:aliceblue;
    border:none;
  }

  .codeButtonHidden{
    z-index:-100;
  }

  .loginButton{
    z-index: 3;
    position:absolute;
    left: 50%;
    margin-left: -55px;
    top: 50%;
    margin-top: 110px;
    background-color: #2268ff;
    width: 110px;
    height: 48px;
    border-radius: 8px;
    font-size: 28px;
    font-weight: 600;
    color: white;
  }

  .loginButton:hover{
    background-color:#349dff ;
  }

  .registerHref{
    z-index: 3;
    position:absolute;
    left: 50%;
    margin-left: -95px;
    top: 50%;
    margin-top: 170px;
  }

 .butallexitcl{
    z-index:3;
    position: absolute;
    width:100px;
    height:45px;
    top:20px;
    right:20px
  }
</style>
