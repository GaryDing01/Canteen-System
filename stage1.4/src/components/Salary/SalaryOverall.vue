<template>
<div style="line-height: 20px">
    <div>
    <el-form label-width="300px" size="mini">
 <div>
  <!-- <el-form-item size="middle" label="查询某日发放的工资：" style="width:900px">
    <el-date-picker
    style="width:500px"
  placeholder="请选择日期"
  value-format="yyyy-MM-dd"
  v-model="s_date"
  clearable
  :picker-options="pickerOptions">
</el-date-picker>
    <el-button type="primary" @click="showStaff()">查询</el-button>
    <el-button type="primary" @click="showAllSalary()" class="butsao">查看全部薪水</el-button>
  </el-form-item> -->
      </div>
</el-form>
</div>

  <el-table
     :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    style="width: 100%"
    max-height="500px"
    :default-sort = "{prop: 'staff_id', order: 'ascending'}"
    :row-class-name="tableRowClassName"
    >
    <el-table-column
      prop="staff_id"
      label="员工编号"
      sortable
      width="200px" 
      align="center">
    </el-table-column>

    <el-table-column
      prop="name"
      label="姓名"
      width="200px" 
      align="center">
    </el-table-column>

    <el-table-column
      prop="basic_salary"
      label="基础工资"
      sortable
      width="200px" 
      align="center">
    </el-table-column>

    <el-table-column
      prop="bonus"
      label="奖金"
      sortable
      width="200px" 
      align="center">
    </el-table-column>

    <el-table-column
      prop="job"
      label="工作"
      width="200px" 
      column-key="job"
      align="center"
      :filters="[{text: '经理', value: '经理'}, {text: '财务', value: '财务'}, {text: '厨师', value: '厨师'}, 
      {text: '服务员', value: '服务员'},]"
      :filter-method="filterHandler">
    </el-table-column>

    <el-table-column
      prop="s_time"
      label="发放日期"
      sortable
      width="200px" 
      align="center">
    </el-table-column>

  </el-table>

<el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next"
        :total="tableData.length">
       </el-pagination>

</div>
</template>


<script>
  export default {
    props:['requester_ID'],
    
    mounted(){
      this.$axios
      .get("/api/Canteen/getAllSalary", {
        params: {
        // requester_id:this.requester_ID+'',
        }
        })
        .then(response=> {
            console.log(response.data);
            this.tableData=response.data;
          })
          .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
    },
    
  data() {
    return {
       stripe:true,
        currentPage:1,
        pagesize:10,
        total:0,
        currentHeight:522,
      staff_id:'',
      tableData:[]
    };
  },

    methods: {
       handleSizeChange(val) {
        this.pagesize = val;
        if(val==5)
          this.currentHeight = 285;
        else if(val==10)
          this.currentHeight = 522;
      },

      handleCurrentChange(val) {
        this.currentPage = val;
      },

      //查找指定员工编号的元组
      showStaff(){
      this.$axios.get("/api/Canteen/getEmployeeInfobyAttr", {
      params: {
      attribute:"staff_id",
      value:this.staff_id,
      }
      })
      .then(response=> {
        console.log(response.data);
            alert("找到相关员工！");
            this.tableData=response.data;
      })
      .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
    },

      //显示所有的员工薪水
      showAllSalary(){
          console.log('别闪退');
        this.$axios
      .get("/api/Canteen/getAllSalary", {
        params: {
        // requester_id:this.requester_ID+'',
        }
        })
        .then(response=> {
            console.log(response.data);
            this.tableData=response.data;
          })
          .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
      },

      tableRowClassName({row,rowIndex}) {
        if (row.job === '经理') {
          return 'manager';
        } 
        else if (row.job === '财务') {
          return 'finance';
        }
        return '';
      },
     filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      handleEdit(index, row) {
        console.log(index, row);
      }
    }
  }
</script>

<style>
  .el-table .manager {
    background: rgba(143, 143, 177, 0.6);
  }

  .el-table .finance {
    background: rgba(112, 23, 1, 0.6);
  }

  /* .el-table .broken-row {
    background: rgba(128, 128, 128, 0.6);
  } */

</style>