<template>
  <div class="customInfTable">

    <div>
      <el-table
       :data="reservationList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
       default-sort ="{prop:'reservation_date',order:'descending'}"
       style="width: 100%"
       :header-cell-style="{background:'#f4fdff',color:'#000000'}"
       :row-style="{height: '20px'}"
       @filter-change="filterChange"
       border>
        <el-table-column
         prop="reservation_id"
         label="预约号"
         width="180"
         align="center">
        </el-table-column>
        <el-table-column
         prop="reservation_date"
         label="日期"
         width="180"
         align="center">
        </el-table-column>
        <el-table-column
         prop="start_time"
         label="开始时间"
         align="center">
        </el-table-column>
        <el-table-column
         prop="end_time"
         label="结束时间"
         align="center">
        </el-table-column>
        <el-table-column
         prop="table_capacity"
         label="餐桌规模"
         align="center">
        </el-table-column>
        <el-table-column
         prop="reservation_state"
         label="预约状态"
         align="center"
         column-key="reservation_state"
         :filters="[{ text: '过期', value: '过期' }, { text: '等待', value: '等待' },{ text: '完成', value: '完成' }]">
          <template slot-scope="scope">
            <el-tag
             :type="returnStyleName(scope)"
             size="mini"
             disable-transitions>{{scope.row.reservation_state}}</el-tag>
          </template>
        </el-table-column>
      </el-table>

       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next"
        :total="reservationList.length">
       </el-pagination>

    </div>

  </div>
</template>

<script>
  export default {

    name:'ReservationInformationPage',

    props:["userID"],

    mounted(){
      this.$axios
        .get('/api/Canteen/getReservationInformation',{
          params:{
            id: this.userID,
          }
        })
        .then(response=> {
          this.reservationList = response.data;
        })
    },

    data(){
      return{
        apiReservationList: null,
        reservationList: null,
        stripe:true,
        currentPage:1,
        pagesize:10,
        total:0,
        scFilter:{}
      }
    },

    methods:{
      handleSizeChange(val) {
        this.pagesize = val;
      },

      handleCurrentChange(val) {
        this.currentPage = val;
      },

      returnStyleName(val){
        if (val.row.reservation_state=='过期'){
          return 'danger';
        }
        else if(val.row.reservation_state=='完成'){
          return 'success';
        }
        return 'primary';
      },

      filterChange(filter){
        this.hint = filter;
        this.$set(this.scFilter , this.userID, filter.reservation_state);
        this.currentPage = 1;
        this.$axios
          .post('/api/Canteen/getReservationForCustomerByState',this.scFilter)
          .then(response=>{
            this.reservationList = response.data;
          });
      },

    }
  }
</script>

<style>

  .customInfTable{
    margin-top: 10px;
  }

  .el-table .warning-row {
    background: oldlace;
  }

</style>
