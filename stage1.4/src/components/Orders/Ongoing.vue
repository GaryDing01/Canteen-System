<template>
<div>
  <div style="line-height:50px">
  <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>进行中订单</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 订单表格 -->
  <div style="line-height:20px">  
      <el-card class="box-card" style="margin-top:15px">
      <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"

      :data="orderlist.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
      max-height="400" border stripe>
      <el-table-column label="#" type="index"></el-table-column>  
      <el-table-column
        prop="order_id"
        label="订单号"
        sortable
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="order_date"
        label="日期"
        sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="customer_id"
        label="顾客编号"     
        align="center">
      </el-table-column>
      <el-table-column
        prop="table_id"
        label="餐桌号"
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expense"
        label="总价"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="210"
        align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleClick(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next"
      :total="orderlist.length">
    </el-pagination>
  </el-card>
  </div>
  <!-- 抽屉区域 -->
  <div style="line-height:20px;">
    <el-drawer 
      title="订单详情"
      :visible.sync="grid"
      direction="rtl"
      size="40%">
      <p style="text-align:left;margin-left:20px;"> 订单号：{{_orderid}}
        <br> 日期：{{_date}}
        <br> 餐桌号：{{_tableid}}
        <br> 总价：{{_tprice}}</p>
      <el-table :data="chosen_dish" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="dish_id" label="菜品编号" width="150"></el-table-column>
        <el-table-column prop="dish_name" label="名称" width="150"></el-table-column>
        <el-table-column prop="dish_num" label="数量" width="150"></el-table-column>
        <el-table-column prop="dish_price" label="单价"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</div>
</template>

<script>
export default {
  methods: {
      handleClick(row){
        this.grid = true
        this._orderid=row.order_id
        this._date=row.order_date
        this._tableid=row.table_id
        this._tprice=row.expense
        console.log(row.order_date)
        this.fetchData(row)
      },
      async deleteRow(index, rows) {
        const confirm_result= await this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
           this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        if(confirm_result!=='confirm'){
          return this.$message.info('已取消删除')
        }
        else{
          const {data: res} =  this.$axios
          .post('/api/Dish_order/deleteOrder',{
            order_id: rows.order_id+'',
            order_date: rows.order_date+'',
          })
          .then(res=>{
            switch(res.data){
              case 1:
                break;
              default:
                return this.$message.info('订单未移除，请重试！');
            }
          })
          this.getOrderList();
          return this.$message.success('已删除')
        }
      },
      async fetchData(row){
        await this.$axios.get('/api/Canteen/getCurrentDish',{
          params:{
            order_id:row.order_id+'',
            order_date:row.order_date+''            
          }
        })
        .then(res=>{
          this.chosen_dish=res.data
          // for(var i = 0; i < res.data.length; i++) {
          //   if(this.chosen_dish[i].dish_num==0)
          //   {
          //     this.chosen_dish.splice(i,1)
          //   }
          // }
          console.log(this.chosen_dish)        
          //遍历，如果数量为0就不显示
        })
        
      },
      async getOrderList() {
        this.loading=true
        await this.$axios.get('/api/Canteen/getCurrentOrder',{})
        .then(response=>{
          this.orderlist=response.data
          this.total = response.data.total
        }) 
        this.loading=false
      },
    handleSizeChange(val) {
      this.pagesize = val;
      if(val==5)
        this.currentHeight = 285;
      else if(val==10)
        this.currentHeight = 522;
        this.getOrderList()
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList()
    },
  
  },
  mounted() {
    this.getOrderList();
  },
  data(){
    return{
      _orderid:'',
      _date:'',
      _tableid:'',
      _tprice:'',
      grid:false,
      total: 0,
      currentHeight:522,
      currentPage:1,
      pagesize:10,
      orderlist: [],
      chosen_dish:[],
      loading:true  
    }
  }
}
</script>

<style scope>

</style>