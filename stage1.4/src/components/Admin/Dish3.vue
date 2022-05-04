//管理员查看菜品信息包括原料
<template>
  <div style="line-height: 20px">
 <div>
    <el-form ref="form" :model="sizeForm" label-width="200px" size="mini">
 <div class="inquireList" name="inquireInformation">
  <el-form-item size="middle" label="添加菜品" style="width:1150px">
    <el-input style="width:200px" placeholder="请输入要添加的菜品编号" v-model="dish_id" clearable>
    </el-input>
    <el-input style="width:200px" placeholder="请输入要添加的菜品名称" v-model="dish_name" clearable>
    </el-input>
    <el-input style="width:200px" placeholder="请输入要添加的菜品价格" v-model="dish_price" clearable>
    </el-input>
    <el-input style="width:200px" placeholder="请输入要添加菜品的食材需求" v-model="ingre_name" clearable>
    </el-input>
    <el-button type="primary" @click="submit()">确认</el-button>
  </el-form-item>
      </div>
</el-form>
</div>

    <div>
      <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
       stripe border max-height="550px" style="width: 100%" highlight-current-row>
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
        dish_name:'',
        dish_price:'',
        ingre_name:'',
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
    submit(){
      this.$axios
        .post('/api/Canteen/addDish',{
            dish_id: this.dish_id+'',
            dish_name: this.dish_name+'',
            dish_price:parseInt(this.dish_price),
            ingre_name:[this.ingre_name]
        })
        .then(response=> {
        //请求成功
          console.log("请求成功");
          console.log(response.data);
          switch(response.data){
            case 0:
              alert("已存在菜品，添加失败！");
              break;
            case 1:
              alert("添加成功！");
              this.tableData=[];
              this.tableData.push({
                 dish_id: this.dish_id+'',
                 dish_name:this.dish_name+'',
                 dish_price: parseInt(this.dish_price),
                 ingre_name:[this.ingre_name]
                 });
              break;
            case -1:
              alert("连接错误！");
              break;
            case -2:
              alert("id不合规范！（请输入A-Z的字母来指示菜品类型，例如：M:meat,V:vegetable,S:soup,C:表示其他）");
              break;
          }
        })
         .catch((error) => {
          console.log("请求失败");
          console.log(error);
          alert("请求失败!");
        })
    }
  },
};
</script>

<style>
</style>