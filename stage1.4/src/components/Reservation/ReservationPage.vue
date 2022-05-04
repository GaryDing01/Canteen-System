<template>

  <div>

    <el-form class="reservationForm" label-position="top">
      <div class="dateSelector">
        <el-form-item label="预约日期">
          <el-date-picker
           v-model="reservation_date"
           align="right"
           type="date"
           placeholder="预约日期"
           :picker-options="pickerOptions"
           value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </div>

    <div class="timeSelector">
      <el-form-item label="预约时间段">
        <el-time-select
            placeholder="起始时间"
            v-model="start_time"
            :picker-options="{
              start: '08:00',
              step: '00:30',
              end: '22:00'
            }">
          </el-time-select>
          ~
          <el-time-select
            placeholder="结束时间"
            v-model="end_time"
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '23:00',
              minTime: start_time
            }">
          </el-time-select>
        </el-form-item>
    </div>

    <div class="capacitySelector">
      <el-form-item label="选择餐桌规模">
        <el-select v-model="table_capacity" placeholder="餐桌规模">
          <el-option
           v-for="item in options"
           :key="item.value"
           :label="item.label"
           :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </div>

    <div class="reservationSubmitButton">
      <el-button type="primary" @click="submit()">提交</el-button>
    </div>
    </el-form>

  </div>

</template>



<script>
export default {
  name: 'ReservationPage',

  props:["userID"],

  data(){
    return{
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      reservation_date:'',
      start_time:'',
      end_time:'',
      options: [{
                value: 2,
                label: 2
              }, {
                value: 4,
                label: 4
              }, {
                value: 6,
                label: 6
              }, {
                value: 8,
                label: 8
              }, {
                value: 10,
                label: 10
              }],
      table_capacity:''
    }
  },

  methods:{
    submit(){
	  if (this.reservation_date=='' || 
    this.start_time=='' || 
    this.end_time=='' || 
    this.table_capacity==''){
		  alert("还有选项没有选择！");
		  return;
	  }
      this.$axios
        .post('/api/Canteen/reserveTable',{
            reservation_date: this.reservation_date+'',
            start_time: this.start_time+'',
            end_time: this.end_time+'',
            table_capacity: parseInt(this.table_capacity),
            customer_id: this.userID+''
        })
        .then(response=> {
          switch(response.data){
            case 1:
              alert("预约成功！");
              break;
            case 2:
              alert("所选时间段内预约人数已满，预约失败！");
              break;
            case 3:
              alert("这一天已经有预约了，预约失败！");
              break;
            case 4:
              alert("数据库连接失败！");
              break;
          }
        })
    }
  },

}
</script>



<style>

  .reservationForm{
    margin-top: -50px;
    margin-left: 50px;
  }

  .titleText{
    font-size: 25px;
    font-weight: 600;
  }

  .dateSelector{
    margin-top: 50px;
  }

  .timeSelector{
    margin-top: 25px;
  }

  .capacitySelector{
    margin-top: 25px;
  }

  .reservationSubmitButton{
    margin-top: 40px;
  }

</style>
