//查询指定菜品的信息
<template>
  <div style="line-height: 20px">
     <div>
    <el-form ref="form" :model="sizeForm" label-width="300px" size="mini">
 <div class="inquireList" name="inquireInformation">
  <el-form-item size="middle" label="查询指定菜品的信息" style="width:900px">
    <el-input
    style="width:500px"
  placeholder="请输入菜品编号"
  v-model="dish_id"
  clearable>
</el-input>
    <el-button type="primary" @click="getDish()">查询</el-button>
  </el-form-item>
      </div>
</el-form>
</div>
    <div>
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
       stripe border max-height="600px" style="width: 100%" highlight-current-row >
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
        dish_id:'',
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
     getDish() {
      const self = this;
      self.$axios
        .get("/api/Canteen/getDish", {
          params: {
            dish_id: self.dish_id,
          },
        })
        .then((response) => {
          console.log("请求成功");
          console.log(response.data);
          switch (response.data) {
            default:
              alert("请稍等,正在返回数据...");
              this.tableData=[];
              this.tableData.push({
                dish_id: self.dish_id,
                dish_name: response.data.dish_name,
                dish_price:response.data.dish_price,
                ingre_name:response.data.ingre_name,
              });
              break;
          }
        })
        .catch((error) => {
          console.log("请求失败");
          console.log(error);
          alert("请求失败!");
        });
    },
  },
};
</script>

<style>
</style>