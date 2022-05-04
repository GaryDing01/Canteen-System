//管理员查看菜品信息包括原料
<template>
  <div style="line-height: 20px">
    <div>
      <el-table 
    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
       stripe border max-height="600px" style="width: 100%" highlight-current-row>
        <el-table-column prop="dish_id" label="菜品编号" width="300px" align="center">
        </el-table-column>
        <el-table-column prop="dish_name" label="菜品名称" width="300px" align="center">
        </el-table-column>
        <el-table-column prop="dish_price" label="菜品价格" width="300px" align="center">
        </el-table-column>
        <el-table-column prop="ingre_name" label="食材需求" align="center">
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
  </div>
</template>

<script>
export default {
    
  props:['requester_ID'],
    
    mounted(){
      this.$axios.get("/api/Canteen/dishMoreInfo", {
        params: {
        requester_id:this.requester_ID+'',
        }
        })
        .then(response=> {
            switch(response.data.id){
              case null:
              	alert("没有菜品！");
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
  },
};
</script>

<style>
</style>