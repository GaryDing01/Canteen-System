<template>
  <div>

    <div>
      <p class="customInf">ID：{{userID}}</p>
      <el-divider class="textDivide"></el-divider>
      <p class="customInf">姓名：{{name}}
        <el-button class="changeInfButton" v-if="this.name=='未知'" type="primary"
        @click="dialogNameVisible = true">补充信息</el-button>

        <el-dialog title="修改姓名" :visible.sync="dialogNameVisible">
          <el-form class="newNameForm">
            <p>请输入您的姓名：
              <el-input class="inputBox" v-model="newName" placeholder="姓名" ></el-input>
            </p>
            <el-button type="primary" @click="submitNewInformation('name')">确定</el-button>
          </el-form>
        </el-dialog>

      </p>
      <el-divider class="textDivide"></el-divider>
      <p class="customInf">生日：{{birthday}}
        <el-button class="changeInfButton" v-if="this.birthday=='未知'" type="primary"
        @click="dialogBirthdayVisible = true">补充信息</el-button>

        <el-dialog title="修改生日" :visible.sync="dialogBirthdayVisible">
          <el-form class="newNameForm">
            <p>请选择您的生日：
              <el-date-picker
               v-model="newBirthday"
               align="right"
               type="date"
               placeholder="生日"
               value-format="yyyy-MM-dd">
              </el-date-picker>
            </p>
            <el-button type="primary" @click="submitNewInformation('birthday')">确定</el-button>
          </el-form>
        </el-dialog>

      </p>
      <el-divider class="textDivide"></el-divider>
      <p class="customInf">电话：{{phone}}</p>
      <el-divider class="textDivide"></el-divider>
      <p class="customInf">积分：{{credit}}</p>
      <el-divider class="textDivide"></el-divider>
    </div>

  </div>
</template>

<script>
  export default {

    name: 'CustomInformationPage',

    props:["userID"],

    mounted(){
      this.getInformation();
    },

    data(){
      return{
          name: '未知',
          birthday: '未知',
          phone: '未知',
          credit: '未知',
          dialogNameVisible:false,
          dialogBirthdayVisible:false,
          newName:'',
          newBirthday:''
      }
    },

    methods:{
      getInformation(){
        this.$axios
          .get('/api/Canteen/getCustomerInformation',{
            params:{
              id: this.userID,
            }
          })
          .then(response=> {
            this.name = response.data.customer_name;
            this.birthday = response.data.birthday;
            this.phone = response.data.phone_num;
            this.newName = response.data.customer_name;
            this.newBirthday = response.data.birthday;
            if (this.name=='')
              this.name="未知";
            if (this.birthday=='')
              this.birthday="未知";
            if (this.phone=='')
              this.phone="未知";
            if (response.data.credit==-1)
              this.credit = "您还不是我们的会员哦";
            else if (response.data.credit>=0)
              this.credit = response.data.credit;
            else
              this.credit = "未知";
          })
      },

      submitNewInformation(val){
        this.$axios
          .post('/api/Canteen/updateCustomer',{
            customer_id:this.userID+'',
            customer_name:this.newName+'',
            birthday:this.newBirthday+''
          })
          .then(response=>{
            console.log("response");
            console.log(response);
          });
        if (val=="name"){
          this.dialogNameVisible=false;
        }
        else if (val=="birthday"){
          this.dialogBirthdayVisible=false;
        }
        this.getInformation();
      }
    }
  }
</script>

<style>

  .customInf{
    margin-left:50px;
    margin-top:50px;
  }

  .changeInfButton{
    position:absolute;
    left:33%;
    margin-top:-5px;
  }

  .textDivide{
    margin-left:50px;
    background-color:#dcecff;
    width:200px;
  }

  .newNameForm{
    text-align: center;
  }

</style>
