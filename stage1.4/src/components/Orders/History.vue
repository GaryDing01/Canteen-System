<template>
<div>

  <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

  <!-- 日期选择器 -->
  <div class="block" style="line-height:30px;margin-top:20px;">
    <el-date-picker
      v-model="formData.createTime"
      type="daterange"     
      value-format="yyyy-MM-dd"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions" 
      >
      <!-- :picker-options="pickerOptions" -->
    </el-date-picker>
    <el-button type="primary" icon="el-icon-search" circle @click="timeSearch()"></el-button>
    <el-button icon="el-icon-refresh" circle @click="getOrderList()"></el-button>
  </div>
  <div>
    <!-- 输入框，查询某一顾客的所有订单 -->
  </div>

  <div style="line-height:30px">     
    <el-card class="box-card" style="margin-top:20px">
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
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="s_id"
        label="流水编号"
        width="140"
        align="center">
      </el-table-column>
      <el-table-column
        prop="s_time"
        label="流水时间" 
        width="220"   
        align="center">
      </el-table-column>
      <el-table-column
        prop="customer_id"
        label="顾客编号"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="table_id"
        label="餐桌号"
        width="110"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expense"
        label="总价"
        width="110"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleClick(scope.$index,scope.row)">查看</el-button>
          <el-button size="mini" type="text" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
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
      <el-table :data="chosen_dish" 
      v-loading="dloading" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="dish_id" label="菜品编号" width="150" align="center"></el-table-column>
        <el-table-column prop="dish_name" label="名称" width="150" align="center"></el-table-column>
        <el-table-column prop="dish_price" label="单价" align="center"></el-table-column>
        <el-table-column prop="dish_num" label="数量" width="130" align="center"></el-table-column>
        <!-- <el-table-column fixed="right" label=""  align="center">
          <template slot-scope="subscope">
            <el-button  size="mini" type="text" @click="handleEdit(subscope.row,_orderid,_date)">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-drawer>
  </div>
</div>
</template>

<script>
export default {
  methods: {
      handleClick(index,row) {
        this.grid=true
        this.dloading=true
        this._orderid=row.order_id
        this._date=row.order_date
        this._tableid=row.table_id
        this._tprice=row.expense
        this.fetchData(row)
      },
      handleEdit(row,o_id,o_date){
        this.$prompt('请修改'+ row.dish_num +'的数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: '请输入0或正整数'
        }).then(({ value }) => {          
          this.$axios.post('/api/Dish_order/setChosenDishNumberTo',{
            order_id:o_id+'',
            order_date:o_date+'',
            dish_id:row.dish_id+'',
            dish_num:parseInt(value)
          }).then(resp=>{
            switch(resp.data){
              case 1:
                this.$message({
                  type: 'success',
                  message: '数量更改为: ' + value
                });
                this.fetchData(row)
                this.getOrderList()
                // this._tprice=o_tprice
                break;
              case 0:
                this.$message.error('修改失败，请重试');
                break;
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
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
          .post('/api/Dish_order/deleteOrder',{             //删除历史订单？
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
      await this.$axios.get('/api/Dish_order/getChoose',{
        params:{
          order_id:row.order_id+'',
          order_date:row.order_date+''
        }
      })
      .then(res=>{
        this.chosen_dish=res.data
        //遍历，如果数量为0就不显示
      })
      this.dloading=false
    },
    async getOrderList() {
      this.loading=true
      await this.$axios.get('/api/Dish_order/getHistoryOrder',{})
        .then(response=>{
          this.orderlist=response.data
          this.total = response.data.total
        }) 
        this.loading=false
    },
    timeSearch(){
      this.loading=true
      this.$axios.get('/api/Dish_order/getOrderDuring',{
        params:{
          start_date:this.formData.createTime[0]+'',
          end_date:this.formData.createTime[1]+''
        }
      })
      .then(response=>{
        this.orderlist=response.data
        console.log(this.formData.createTime),
        this.total=response.data.total
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
  mounted () {
    this.getOrderList()
  },
  data(){
    return{
      msg:'历史订单',
      //日期选择器
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      _orderid:'',
      _date:'',
      _tableid:'',
      _tprice:'',
      formData: {
        createTime:[],
      },
      total: 0,
      currentHeight:522,
      currentPage:1,
      pagesize:5,
      orderlist: [],
      chosen_dish:[],
      grid:false,
      loading: true,
      dloading:true
    }
  }
}
</script>

<style scoped>

</style>