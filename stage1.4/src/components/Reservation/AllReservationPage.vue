<template>
  <div class="allRservationInfTable">

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
         align="center"
        >
        </el-table-column>
        <el-table-column
         prop="customer_id"
         label="顾客编号"
         align="center">
        </el-table-column>
        <el-table-column
         prop="customer_name"
         label="顾客姓名"
         align="center">
        </el-table-column>
        <el-table-column
         prop="reservation_date"
         label="日期"
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
         prop="table_id"
         label="餐桌编号"
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
             :type="returnTagStyleName(scope)"
             size="mini"
             disable-transitions>{{scope.row.reservation_state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
         prop="table_capacity"
         label="操作"
         width="180"
         align="center">
         <template slot-scope="scope">
           <el-button
            class="tableButton"
            :icon="returnButtonIcon(scope)"
            :type="returnButtonStyleName(scope)"
            :disabled="scope.row.reservation_state != '等待'"
            @click="clickEvent(scope)"
            size="mini"
            disable-transitions>{{returnButtonText(scope)}}</el-button>
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

    name:'AllReservationPage',

    mounted(){
      this.getAllReservationList();
    },

    data(){
      return{
        apiReservationList: null,
        reservationList: null,
        stripe:true,
        currentPage:1,
        pagesize:10,
        total:0,
        hint:'',
        scFilter:''
      }
    },

    methods:{
      getAllReservationList(){
        console.log('getAllReservationList');
        this.$axios
          .get('/api/Reservation/getAllReservation')
          .then(response=> {
            this.reservationList = response.data;
          })
      },

      handleSizeChange(val) {
        this.pagesize = val;
      },

      handleCurrentChange(val) {
        this.currentPage = val;
      },

      returnTagStyleName(val){
        if (val.row.reservation_state=='过期'){
          return 'danger';
        }
        else if(val.row.reservation_state=='完成'){
          return 'success';
        }
        return 'primary';
      },

      clickEvent(val){
        
        if (val.row.reservation_state=='等待'){
          this.$axios
            .post('/api/Reservation/finishReservation',{
              reservation_id: val.row.reservation_id+'',
              reservation_date: val.row.reservation_date+'',
            })
            .then(
              response=>{
               val.row.reservation_state='完成';
            }
            );
          this.$axios
            .post('/api/Reservation/getReservationByState',this.scFilter.reservation_state)
            .then(response=>{
              this.reservationList = response.data;
            });
        }
      },

      returnButtonStyleName(val){
        if (val.row.reservation_state=='等待'){
          return 'primary';
        }
        else if(val.row.reservation_state=='完成'){
          return 'success';
        }
        return 'danger';
      },

      returnButtonText(val){
        if (val.row.reservation_state=='等待'){
          return '完成';
        }
        else if(val.row.reservation_state=='完成'){
          return '已完成';
        }
        return '已过期';
      },

      returnButtonIcon(val){
        if (val.row.reservation_state=='等待'){
          return '';
        }
        else if(val.row.reservation_state=='完成'){
          return 'el-icon-check';
        }
        return 'el-icon-close';
      },

      filterChange(filter){
        this.scFilter = filter;
        this.currentPage = 1;
        this.$axios
          .post('/api/Reservation/getReservationByState',filter.reservation_state)
          .then(response=>{
            this.reservationList = response.data;
          });
      },

    }
  }
</script>

<style>

  .allRservationInfTable{
    margin-top: -15px;
  }

  .tableButton{
    width:80px;
  }

</style>
