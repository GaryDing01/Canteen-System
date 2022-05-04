<template>
    <div>
        <el-col :span="14" class="col1">
            <div v-if="show_test1" class="show_test1">
                <SalaryOverall></SalaryOverall>
            </div>
        </el-col>

        <el-col :span="8" class="col2">
            <div v-if="show_test2" class="show_test2">
                <!-- afljldfaniwailnvafie -->
                <Dish1></Dish1>
            </div>
        </el-col>
        
        
        
    </div>
    
</template>

<script>

import crypto from 'crypto';
import SalaryOverall from '@/components/Salary/SalaryOverall';
import Dish1 from '@/components/Admin/Dish1';
// import StaffShow from '@/components/GRightShow/StaffShow';
import StaffOverall from '@/components/People/StaffOverall'

  export default {
    components:{
        SalaryOverall,
        Dish1,
        // StaffShow,
        StaffOverall,
    },
  
   props:['requester_ID'],

    data () {
      return {
          hint:'',
          form:{
            oldPwd:'',
            newPwd:'',
            againPwd:'',
          },
          temp1:'',
          temp2:'',
          show_test1:true,
          show_test2:true,
      }
    },

    methods:{
      equalN(){
        if(this.form.newPwd!=this.form.againPwd&&this.form.againPwd!='')
        {
          this.hint="*密码不匹配！";
        }
        else{
          this.hint="";
        }
      },

      equalNA(){
        if(this.form.newPwd!=this.form.againPwd)
        {
          this.hint="*密码不匹配！";
        }
        else{
          this.hint="";
        }
      },

      findOld(){
        //加密
        let md5 = crypto.createHash('md5');
        md5.update(this.form.oldPwd+this.requester_ID);
        // alert('到这里来');

        this.$axios.get("/api/Employee/checkEmployeeAndPwd", {
      params: {
      "staff_id":this.requester_ID,
      "pwd":md5.digest('hex')
      }
      })
      .then(response=> {
        console.log(response.data);
            switch(response.data){
              case 2:
                alert('初始密码错误，请重新输入！');
                this.callOff();
                break;
              case 3:
                alert('数据库连接失败！'); 
                this.callOff();
                break;
              default:
                this.changePwd();
                break;
            }
      })
      .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
      },

      changePwd(){
        if(this.hint==="")
        {
          // this.temp1=md5.digest('hex');
        let md5 = crypto.createHash('md5');
        md5.update(this.form.againPwd+this.requester_ID);
        this.temp2=md5.digest('hex');

        this.$axios.post('/api/Canteen/updateEmployee', {
          "staff_id":this.requester_ID+"",
          "attribute":'password',
          "newvalue":this.temp2,
        })

        .then(response=> {

        console.log(response);
        console.log(response.data);
        console.log(response.status);
            switch(response.data){
              case 0:
              	alert("没有该员工！");
                this.msg="没有该员工！";
              	break;
                case -1:
              	alert("您没有权限更改！");
                this.msg="您没有权限更改！";
              	break;
              default:
                alert("更新成功！");
                this.msg=response.data;
                break;
            }
            console.log(response.data);
          })
          .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
        }
        else 
        {
          alert('您两次输入的密码不一样！');
          this.callOff();
        }
        
      },

      callOff(){
        this.form.oldPwd='';
        this.form.newPwd='';
        this.form.againPwd='';
        this.hint="";
      },

    }
  }
</script>

<style scoped>
.hintText{
    text-align: left;
    margin-top: 10px;
    margin-bottom: -60px;
    color: red;
  }

.butcp1{
  margin-top:50px;
  position:absolute;
  left:0px;
}

.butcp2{
  margin-top:50px;
  position:absolute;
  left:100px;
}
</style>