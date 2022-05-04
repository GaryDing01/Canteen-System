<template>

  <div>

    <div class="background" :style="backgroundIm">
    </div>

    <div class="registerList">
      <form>
        <p class="titleText">顾客注册</p>
        <p class="inputLine">
          姓名：<input v-model="customer_name"/>
        </p>
        <p class="inputLine">
          生日：<el-date-picker
                 v-model="birthday"
                 align="right"
                 type="date"
                 placeholder="选择日期"
                 value-format="yyyy-MM-dd">
                </el-date-picker>
        </p>
        <p class="inputLine">
          电话：<input v-model="phone_num"/>
        </p>
        <p class="inputLine">
          密码：<input v-model="customer_password"/>
        </p>
        <p class="hintText">{{hint}}</p>
      </form>
    </div>

    <div>
      <button class="registerButton" @click="register()">注册</button>
      <button class="butallexitcr" @click="exitall()">返回主页面</button>
    </div>

    <div>
      <router-link class="registerHref" :to="'/CustomAccount/CustomLoginPage'">返回登录</router-link>
    </div>

  </div>

</template>



<script>
export default {

  name: 'CustomRegisterPage',

  data () {
    return {
      backgroundIm:{
        backgroundImage: "url(" + require("../../assets/mainBackground.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      },
      customer_name:'',
      birthday:'',
      phone_num:'',
      customer_password:'',
      hint:''
    }
  },

  methods:{
    register(){
      if (this.customer_name=='' || this.birthday=='' || this.phone_num=='' || this.customer_password==''
      ){
        this.hint="*还有未输入的信息";
        return;
      }
      if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.customer_password)===false)
      {
        this.hint="*密码必须同时且只包含数字和字母。"
        return;
      }
      if(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone_num)===false)
      {
        this.hint="*电话输入错误。"
        return;
      }
      this.$axios
        .post('/api/Canteen/newCustomer',{
            customer_name: this.customer_name+'',
            birthday: this.birthday+'',
            phone_num: this.phone_num+'',
            customer_password: this.customer_password+''
        })
        .then(response=> {
          switch(response.data){
            case "创建失败":
              this.$alert('注册失败，请重试！', '提示', {
                confirmButtonText: '确定'
              });
              break;
            default:
              this.$alert('注册成功！您的登录ID为：'+response.data+'，请牢记！', '提示', {
                confirmButtonText: '确定'
              });
              break;
          }
        })
    },
    exitall(){
      this.$router.push({
        path:'/',
      });
    },
  }
}
</script>



<style scoped>

  .background{
    width:100%;
    height:100%;
    z-index:-1;
    position: absolute;
  }

  .registerList{
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

  .hintText{
    text-align: left;
    margin-top: -20px;
    color: red;
  }

  .titleText{
    font-size: 42px;
    font-weight: 600;
  }

  input{
    background-color: aliceblue;
    margin-bottom: 10px;
    border: none;
    border-bottom: 2px solid silver;
    width:80%;
    outline: none;
  }

  .registerButton{
    z-index: 3;
    position:absolute;
    left: 50%;
    margin-left: -55px;
    top: 50%;
    margin-top: 150px;
    background-color: #008800;
    width: 110px;
    height: 48px;
    border-radius: 8px;
    font-size: 28px;
    font-weight: 600;
    color: white;
  }

  .registerButton:hover{
    background-color: #004444 ;
  }

  .registerHref{
    z-index: 3;
    position:absolute;
    left: 50%;
    margin-left: -160px;
    top: 50%;
    margin-top: 170px;
  }

  .inputLine{
    text-align: left;
  }

  .butallexitcr{
    z-index:3;
    position: absolute;
    width:100px;
    height:45px;
    top:20px;
    right:20px
  }

</style>
