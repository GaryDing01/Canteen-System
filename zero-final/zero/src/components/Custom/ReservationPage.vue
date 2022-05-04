<template>
  <div>
    <!-- 查看预约 -->
    <el-card class="reservationInformation">
      <p style="margin-top:-10px;font-weight:600;font-size:25px;">我的预约记录</p>
      <!-- <p>{{tableState}}</p> -->
      <!-- <p>{{tableList}}</p> -->
      <!-- <p>{{reservationDate}}</p> -->
      <!-- <p>{{reservationTime}}</p> -->
      <!-- <p>{{reservationCapacity}}</p> -->

      <div v-if="userID==-1">
        <el-empty description="登录后才能看见您的预约信息哦"></el-empty>
      </div>

      <div v-if="userID!=-1">
        <el-table
        :data="reservationList.slice((currentPage-1)*10,currentPage*10)"
        :header-cell-style="{background:'#f4fdff',color:'#000000'}"
        :row-style="{height: '40px'}"
        :cell-style="{padding: '4px'}"
        height="460px"
        @filter-change="filterChange"
        border>

          <el-table-column
          prop="reservation_date"
          label="日期"
          align="center"
          width="100px">
          </el-table-column>

          <el-table-column
          prop="start_time"
          label="开始时间"
          align="center"
          width="110px">
          </el-table-column>

          <el-table-column
          prop="end_time"
          label="结束时间"
          align="center"
          width="110px">
          </el-table-column>

          <el-table-column
          prop="table_id"
          label="用餐餐桌"
          align="center"
          width="110px">
          </el-table-column>

          <el-table-column
          prop="reservation_state"
          label="预约状态"
          align="center"
          column-key="reservation_state"
          :filters="[{ text: '过期', value: '过期' }, { text: '等待', value: '等待' },{ text: '完成', value: '完成' }]">
            <template slot-scope="scope">
              <div @mouseenter="mouseIn(scope)" @mouseleave="mouseOut(scope)">
                <el-tag               
                v-if="tagShow[scope.row.reservation_date] || scope.row.reservation_state!='等待'"
                :type="returnTagStyleName(scope)"
                size="mini"
                disable-transitions>{{scope.row.reservation_state}}</el-tag>
                <el-button 
                v-if="!tagShow[scope.row.reservation_date] && scope.row.reservation_state=='等待'"
                size="mini"
                type="primary"
                @click="cancel(scope)">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :total="reservationList.length">
        </el-pagination>
      </div>

    </el-card>
    <!-- {{tagShow}} -->

    <!-- 进行预约 -->
    <el-card class="reservationSelect">
      <p style="margin-top:-10px;font-weight:600;font-size:25px;">进行预约</p>

      <div style="margin-left:50px">
        选择预约日期：
        <el-date-picker
          v-model="reservationDate"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="getAvailableTable()">
        </el-date-picker>
      </div>

      <div style="margin-top:15px;margin-left:50px;">
        选择预约时间：
        <el-select v-model="reservationTime" placeholder="请选择" @change="getAvailableTable()">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div style="margin-top:15px;margin-left:50px;">
        选择用餐人数：
        <el-select v-model="reservationCapacity" placeholder="请选择" @change="getAvailableTable()">
          <el-option
            v-for="item in capacityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div>
        <ul class="tableOptions">
          <li class="tableLis" v-for="table in tableList" :key="table.table_id">
            <div style="text-align:center;font-size:10px;" 
             :class="returnClass(table.table_id)"
             @click="choose(table.table_id)">
              <p style="margin-top:15px;">餐桌号：{{table.table_id}}</p>
              <p>餐桌规模：{{table.table_capacity}}人</p>
            </div>
          </li>
        </ul>
      </div>

      <el-button class="reserveButton" type="success" @click="reserve()">预约</el-button>
      <p class="chooseHintText">当前选中餐桌：{{chooseHint}}</p>

    </el-card>
    
  </div>
</template>

<script>
export default {
  name: 'ReservationPage',

  props:['userID'],

  mounted(){
    this.getReservationInformation();
    Promise.all([
      this.getTableList()
      ])
    .then(response=>{
      
    });
  },

  watch:{

    userID(val){
      this.initAll();
      this.getReservationInformation();
    }

  },

  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      tableList:{},
      tableState:{},
      tagShow:{},

      reservationDate:null,
      timeOptions:[
        {value:"07:00",label:"07:00~09:00"},
        {value:"10:00",label:"10:00~12:00"},
        {value:"13:00",label:"13:00~15:00"},
        {value:"17:00",label:"17:00~19:00"},
        {value:"20:00",label:"20:00~22:00"}
      ],
      endTime:{
        "07:00":"09:00",
        "10:00":"12:00",
        "13:00":"15:00",
        "17:00":"19:00",
        "20:00":"22:00",
      },
      reservationTime:null,
      capacityOptions:[
        {value:2,label:"1~2人"},
        {value:4,label:"3~4人"},
        {value:6,label:"5~6人"},
        {value:8,label:"7~8人"},
      ],
      reservationCapacity:null,
      reservationID:null,
      chooseHint:"暂未选中餐桌",

      reservationList:[],
      currentPage:1,
      reFilter:[]

    }
  },

  methods:{

    getTableList(){//获取餐桌列表
      return new Promise((resolve,reject)=>{
        this.$axios
        .get('/api/Reservation/getTable',{params:{}})
        .then(response=> {
          this.tableList = response.data;
          this.tableList.forEach(table=>{
            this.tableState[table.table_id] = 0;
          });
          resolve('tableSuccess');
        });
      });
    },

    initAll(){
      this.reservationID=null;
      this.reservationDate=null;
      this.reservationTime=null;
      this.reservationCapacity=null;
      this.chooseHint="暂未选中餐桌";
      this.tableList.forEach(table=>{
        this.$set(this.tableState,table.table_id,0);
      });
    },

    getAvailableTable(){
      if(this.reservationDate==null || this.reservationTime==null || this.reservationCapacity==null){
        return;
      }
      this.$axios
        .get('/api/Reservation/getTable',{params:{
          customer_id: this.userID,
          reservation_date:this.reservationDate+"",
          start_time:this.reservationTime+"",
          people_num:parseInt(this.reservationCapacity)
        }})
        .then(response=> {
          this.tableList.forEach(table=>{
            this.$set(this.tableState,table.table_id,0);
          });
          response.data.forEach(table=>{
            this.$forceUpdate();
            this.$set(this.tableState,table.table_id,1);
          });
          this.reservationID=null;
          this.chooseHint="暂未选中餐桌";
        });
    },

    returnClass(val){
      if(this.tableState[val]==0){
        return "tableDisable";
      }
      else if(this.tableState[val]==1){
        return "tableAvailable";
      }
      else if(this.tableState[val]==2){
        return "tableChosen";
      }
    },

    choose(val){
      if(this.tableState[val]==false){
        return;
      }
      this.$forceUpdate();
      if(this.reservationID!=null){
        this.$set(this.tableState,this.reservationID,1);
      }
      this.reservationID = val;
      this.chooseHint = val;
      this.$set(this.tableState,val,2);
    },

    reserve(){
      if(this.userID==-1){
        this.$message("请登录后再进行预约哦");
        return;
      }
      if(this.reservationID==null){
        this.$message("请选择餐桌");
        return;
      }
      this.$axios
      .post('/api/Reservation/reserveTable',{
          table_id: this.reservationID+"",
          reservation_date: this.reservationDate+"",
          customer_id: this.userID+"",
          start_time: this.reservationTime+"",
          end_time: this.endTime[this.reservationTime]+""
      })
      .then(response=>{
        this.$message("预约成功！");
        this.initAll();
        this.getReservationInformation();
      });
    },

    getReservationInformation(){
      if(this.userID==-1){
        return;
      }
      var data=[this.userID+""];
      this.reFilter.forEach(state=>{
        data.push(state);
      });
      this.$axios
        .post('/api/Reservation/getOnesReservationByState',
          data
        )
        .then(response=>{
          this.reservationList = response.data;
          this.currentPage = 1;
          response.data.forEach(inf=>{
            this.$set(this.tagShow,inf.reservation_date,true);
          });
        })
    },

    filterChange(filter){
      this.reFilter = filter.reservation_state;
      this.getReservationInformation();
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

    mouseIn(val){
      this.$set(this.tagShow,val.row.reservation_date,false);
    },

    mouseOut(val){
      this.$set(this.tagShow,val.row.reservation_date,true);
    },

    cancel(val){
      this.$axios
        .post('/api/Reservation/cancelReservation',{
          reservation_date: val.row.reservation_date+"",
          customer_id: this.userID+""
        })
        .then(response=> {
          this.getReservationInformation();
        })
    }

  },

}
</script>

<style scoped>

  /* .reservationInformation{
    position: relative;
    width: 500px;
    height: 600px;
    left: 550px;
  }

  .reservationSelect{
    position: relative;
    width: 700px;
    height: 600px;
    left: 100px;
    top: -600px;
  } */

  .reservationInformation{
    position: absolute;
    width: 600px;
    height: 570px;
    left: 125px;
  }

  .reservationSelect{
    position: absolute;
    width: 600px;
    height: 570px;
    left: 775px;
  }

  .tableLis{
    list-style: none;
    float: left;
    margin: 5px;
  }

  .tableAvailable{
    width:90px;
    height:70px;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.137);
    background-color: rgba(143, 242, 255, 0.26);
  }

  .tableAvailable:hover{
    background-color: rgba(65, 190, 240, 0.3);
  }

  .tableDisable{
    width:90px;
    height:70px;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.137);
    background-color: rgba(99, 114, 122, 0.096);
    color:rgba(151, 151, 151, 0.87);
  }

  .tableChosen{
    width:90px;
    height:70px;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.137);
    background-color: rgba(31, 201, 82, 0.308);
  }

  .reserveButton{
    position: relative;
    left: 130px;
    top: 120px;
  }

  .chooseHintText{
    position: relative;
    left: -300px;
    top: 65px;
    font-weight: 600;
  }

  .cancelButton{
    height:10px;
    width:20px;
  }

</style>
