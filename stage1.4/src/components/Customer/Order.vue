<template>
  <div>
    <div>
      <el-table
       :data="orderList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
       default-sort ="{prop:'reservation_date',order:'descending'}"
       style="width: 50%"
       :header-cell-style="{background:'#f4fdff',color:'#000000'}"
       :row-style="{height: '20px'}"
       @filter-change="filterChange"
       border>
        <el-table-column
         prop="order_id"
         label="订单号"
         width="180"
         align="center">
        </el-table-column>
        <el-table-column
         prop="order_date"
         label="日期"
         width="180"
         align="center">
        </el-table-column>
        <el-table-column
         prop="table_id"
         label="桌号"
         width="123"
         align="center">
        </el-table-column>
        <el-table-column
         prop="expense"
         label="花费"
         align="center">
        </el-table-column>
      </el-table>

       <el-pagination
        @current-change="handleCurrentChange"
        :page-sizes="[5,10]"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="orderList.length">
       </el-pagination>
    </div>
  </div>

</template>

<script>
  export default {

    name:'Order',

    props:["userID"],

    mounted(){
      this.$axios
        .get('/api/Canteen/getOrderForCustomer',{
          params:{
            customer_id: this.userID
          }
        })
        .then(response=> {
          this.orderList = response.data;
        })
    },

    data(){
      return{
        orderList:[],
        pagesize:10,
        currentPage:1
      }
    },

    methods:{
      handleSizeChange(val) {
        this.pagesize = val;
      },

      handleCurrentChange(val) {
        this.currentPage = val;
      },


    }
  }
</script>

<style>



</style>
