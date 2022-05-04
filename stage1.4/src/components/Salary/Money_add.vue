<template>
    <div>
        <el-form ref="form" :model="form" label-width="120px">
        
        <el-form-item label="员工编号" style="width:360px;">
            <el-input v-model="form.staff_id"></el-input>
        </el-form-item>
        
        <el-form-item label="奖金" style="width:360px;">
            <el-input v-model="form.bonus"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="addSalary()" class="butsa1">确定</el-button>
            <el-button @click="callOff()" class="butsa2">取消</el-button>
            <el-button type="primary" @click="backtoAll()" class="butsa3">返回工资汇总</el-button>
        </el-form-item>
        </el-form>
    </div>

</template>

<script>

  export default {
  
  props:['requester_ID'],

    data () {
      return {
        form: {
          job: '',
          name: '',
          phone: '',
          ID_num: '',
          }
      }
    },

    methods:{

      addSalary(){
        this.$axios.post("/api/Canteen/addEmployeeSalaryandPay", {

        "staff_id": this.form.staff_id,
        bonus: parseInt(this.form.bonus),
        
        })
        .then(response=> {
            switch(response.data){
              case 0:
              	alert("添加员工薪水失败！");
                this.msg="添加员工薪水失败！";
              	break;
              default:
                alert("添加员工薪水成功！请通过查看功能进行验证");
                this.msg=response.data;
                break;
            }
          })
          .catch((error)=>{
            console.log('请求失败');
            console.log(error);
          })
        },

        backtoAll(){
          this.$router.push({path:'/SalaryOverall'})
        },

        callOff(){
          this.form.staff_id='';
          this.form.basic_salary='';
          this.form.bonus='';
          this.$router.push({path:'/SalaryRewrite'});
        },
    }
  }
  
</script>

<style>
.butsa1{
  margin-top:0px;
  position:absolute;
  left:0px;
}

.butsa2{
  margin-top:0px;
  position:absolute;
  left:100px;
}
.butsa3{
    position:fixed;
    left:1360px;
    top:80px;
    z-index: 1;
  }
</style>