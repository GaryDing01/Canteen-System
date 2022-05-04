<template>
    <div>
        <el-form ref="form" :model="form" label-width="120px">
        
        <el-form-item label="员工编号" style="width:360px;">
            <el-input v-model="form.staff_id"></el-input>
        </el-form-item>
<!--         
        <el-form-item label="基础工资" style="width:360px;">
            <el-input v-model="form.basic_salary"></el-input>
        </el-form-item>
        <el-form-item label="奖金" style="width:360px;">
            <el-input v-model="form.bonus"></el-input>
        </el-form-item> -->

        <el-form-item>
            <el-button type="primary" @click="deleteSalary()" class="butsd1">确定</el-button>
            <el-button @click="callOff()" class="butsd2">取消</el-button>
            <el-button type="primary" @click="backtoAll()" class="butsd3">返回工资汇总</el-button>
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

      deleteSalary(){
        this.$axios.post("/api/Canteen/deleteEmployeeSalary", {

        "staff_id": this.form.staff_id,
        
        })
        .then(response=> {
            switch(response.data){
              case 0:
              	alert("删除员工薪水失败！");
                this.msg="删除员工薪水失败！";
              	break;
              default:
                alert("删除员工薪水成功！请通过查看功能进行验证");
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
.butsd1{
  margin-top:0px;
  position:absolute;
  left:0px;
}

.butsd2{
  margin-top:0px;
  position:absolute;
  left:100px;
}
.butsd3{
    position:fixed;
    left:1360px;
    top:80px;
    z-index: 1;
  }
</style>