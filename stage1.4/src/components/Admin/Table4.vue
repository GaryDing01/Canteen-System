//修改餐桌使用状态
<template>
<div style="line-height: 20px">
    <div>
    <el-form ref="form" :model="sizeForm" label-width="200px" size="mini">
 <div class="inquireList" name="inquireInformation">
  <el-form-item size="middle" label="修改餐桌使用状态" style="width:1200px">
    <el-input style="width:300px" placeholder="请输入要修改状态的餐桌编号" v-model="table_id" clearable>
    </el-input>
    <el-input style="width:300px" placeholder="请输入要修改状态的餐桌规模" v-model="table_capacity" clearable>
    </el-input>
    <el-input style="width:300px" placeholder="请输入新状态" v-model="using_state" clearable>
    </el-input>
    <el-button type="primary" @click="submit()">修改</el-button>
  </el-form-item>
      </div>
</el-form>
</div>

  <el-table
    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    style="width: 100%"
    max-height="600px"
    highlight-current-row
    :default-sort = "{prop: 'table_id', order: 'ascending'}"
    :row-class-name="tableRowClassName"
    @sort-change="sortChange"
    >
    <el-table-column
      prop="table_id"
      label="餐桌编号"
      sortable
      width="400px"
      align="center" >
    </el-table-column>
    <el-table-column
      prop="table_capacity"
      label="餐桌规格"
      sortable
      width="400px" 
      align="center"
      column-key="table_capacity"
      :filters="[{text: 2, value: 2}, {text: 4, value: 4}, {text: 6, value: 6}, 
      {text: 8, value: 8}, {text: 10, value: 10}]"
      :filter-method="filterHandler">
    </el-table-column>
    <el-table-column
      prop="using_state"
      align="center"
      label="餐桌当前使用状态"
      :filters="[{text: '空闲', value: '空闲'}, {text: '使用', value: '使用'}, 
      {text: '损坏', value: '损坏'}]"
      :filter-method="filterHandler">
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
      .get("/api/Canteen/getAllTableState", {
        params: {
        requester_id:this.requester_ID+'',
        }
        })
        .then(response=> {
            switch(response.data.table_id){
              case null:
              	alert("没有餐桌！");
              	break;
              default:
                this.tableData=response.data;
                break;
            }
          })
    },
    
  data() {
    return {
       stripe:true,
        currentPage:1,
        pagesize:10,
        total:0,
        currentHeight:522,
      table_id :'',
      table_capacity: '',
      using_state:'',
      tableData:[]
    };
  },

    methods: {
      sortChange(val) {
        //正序
        if (val.column.order == "ascending") {
          //table_id标签排序
          if (val.column.property == "table_id") {
            this.tableData.sort(this.sortList("table_id"));
          }
          else if(val.column.property == "table_capacity") {
            this.tableData.sort(this.sortList("table_capacity"));
          }
        }
        //倒序
      	else if (val.column.order == "descending") {
          //table_id标签排序
          if (val.column.property == "table_id") {
            this.tableData.sort(this.sortListDesc("table_id"));
          }
          else if (val.column.property == "table_capacity") {
            this.tableData.sort(this.sortListDesc("table_capacity"));
          }
        }
      },
       //排序规则
      sortList(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        };
      },
      sortListDesc(property) {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        };
      },

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
      submit(){
      this.$axios
        .post('/api/Canteen/setTableState',{
            table_id : this.table_id+'',
            table_capacity: parseInt(this.table_capacity),
            using_state:this.using_state+''
        })
        .then(response=> {
        //请求成功
          console.log("请求成功");
          console.log(response.data);
          switch(response.data){
            case 0:
              alert("修改失败！");
              break;
            case 1:
              alert("修改成功！");
              this.tableData=[];
              this.tableData.push({
                table_id: this.table_id,
                table_capacity: parseInt(this.table_capacity),
                using_state:this.using_state
                 });
              break;
          }
        })
         .catch((error) => {
          console.log("请求失败");
          console.log(error);
          alert("请求失败!");
        })
    },
      tableRowClassName({row,rowIndex}) {
        if (row.using_state === '空闲') {
          return 'empty-row';
        } 
        else if (row.using_state === '使用') {
          return 'using-row';
        }
        else if (row.using_state === '损坏') {
          return 'broken-row';
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
  .submitButton{
    margin-top: 50px;
  }
  .el-table .empty-row {
    background: rgba(82, 211, 82, 0.6);
  }

  .el-table .using-row {
    background: rgba(209, 107, 107, 0.6);
  }

  .el-table .broken-row {
    background: rgba(128, 128, 128, 0.6);
  }
</style>