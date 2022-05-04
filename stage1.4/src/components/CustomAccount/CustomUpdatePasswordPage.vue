<template>
  <div>

    <div>
      <el-form class="inputForm" label-position="left" label-width="120px">
        <div class="inputList">
          <el-form-item label="旧密码">
          <el-input class="inputBox" v-model="oldPassword" placeholder="请输入旧密码" show-password></el-input>
          </el-form-item>
        </div>
        <div class="inputList">
          <el-form-item label="新密码">
          <el-input class="inputBox" v-model="newPassword1" placeholder="请输入新密码" show-password
          @input="newPasswordChange1()"></el-input>
          </el-form-item>
        </div>
        <div class="inputList">
          <el-form-item label="确认新密码">
          <el-input class="inputBox" v-model="newPassword2" placeholder="再次输入新密码" show-password
           @input="newPasswordChange2()"></el-input>
           </el-form-item>
        </div>
        <p class="hintText">{{hint}}</p>
      </el-form>

    </div>

    <div class="updatePasswordSubmitButton">
      <el-button type="primary" @click="updatePasswordSubmit()">提交</el-button>
    </div>

  </div>
</template>

<script>

  export default {

    name: 'CustomLoginPage',

    props:["userID"],

    data () {
      return {
        username:'',
        oldPassword:'',
        newPassword1:'',
        newPassword2:'',
        hint:''
      }
    },

    methods:{

      newPasswordChange1(){
        if(this.newPassword1==this.newPassword2)
          this.hint='';
        else if(this.newPassword1!=this.newPassword2 && this.newPassword2!='')
          this.hint='*两次输入的新密码不一致！';
      },

      newPasswordChange2(){
        if(this.newPassword1!=this.newPassword2){
          this.hint = "*两次输入的新密码不一致！";
          return;
        }
        this.hint='';
      },

      updatePasswordSubmit(){
        if (this.newPassword1!=this.newPassword2){
          return;
        }
        if (this.newPassword1==this.newPassword2 && this.newPassword1==''){
          this.hint = "*新密码不可为空！";
          return;
        }
        this.$axios
          .post('/api/Canteen/changeCustomerPwd',{
              customer_id: this.userID+'',
              customer_password: this.oldPassword+'',
              new_password: this.newPassword1+''
          })
          .then(response=> {
            switch(response.data){
              case 1:
                this.$alert('修改成功！', '提示', {
                  confirmButtonText: '确定'
                });
                break;
              case 2:
                this.$alert('原密码错误，修改失败！', '提示', {
                  confirmButtonText: '确定'
                });
                break;
              case 0:
                this.$alert('修改失败！', '提示', {
                  confirmButtonText: '确定'
                });
                break;
            }
          })
      }

    }
  }
</script>

<style scoped>

  .inputBox{
    width: 200px;
  }

  .inputForm{
    margin-top: 50px;
    margin-left: 50px;
  }

 /* .inputList{
    text-align: right;
    margin-right: 72%;
  } */

  .hintText{
    text-align: left;
    margin-top: 25px;
    color: red;
  }

  .updatePasswordSubmitButton{
    position: absolute;
    left: 350px;
    top: 400px;
  }

</style>
