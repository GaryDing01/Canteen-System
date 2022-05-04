<template>
  <div>
    <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item>流水管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="line-height: 30px">
      <el-card class="box-card" style="margin-top: 20px" align="left">
        <template>
          <span class="demonstration" style="margin-right:50px">选择门店:</span>
           <el-select v-model="value1" placeholder="请选择" clearable style="margin-bottom:20px">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <div class="block">
            <span class="demonstration" style="margin-right:50px">类别筛选:</span>
            <el-cascader
            ref="cascader"
            :options="options"
            :props="props"
            @change="change"
            collapse-tags
            clearable
            style="margin-bottom:20px"></el-cascader>
          </div>
        </template>

        <div class="block">
        <span class="demonstration"  style="margin-right:50px">记账日期:</span>
        <el-date-picker
          v-model="date_start"
          align="center"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择起始日期："
          :picker-options="pickerOptions"
          style="margin-bottom:20px"
        >
        </el-date-picker>
        <span class="middle">-</span>
        <el-date-picker
          v-model="date_end"
          align="right"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择截止日期："
          :picker-options="pickerOptions"
          style="margin-bottom:20px"
        >
        </el-date-picker>
        <el-button class="inquireButton" style="margin-left:50px" type="primary" @click="inquire()"
          >查询</el-button>
          <el-button icon="el-icon-refresh" circle @click="refresh()"></el-button>
        </div>
        <div>
          <div>
            <el-table
              :data="tableData.slice((currentPage - 1) * pagesize,currentPage * pagesize)"
              default-sort="{prop:'s_amount',order:'descending'},{prop:'s_time',order:'descending'}"
              @sort-change="sortChange"
              style="float:left;width:55%;left:30px;"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              border
              stripe
            >
              <el-table-column label="#" align="center" type="index">
                <template slot-scope="scope">
                  {{scope.$index+(currentPage - 1) * pagesize+1}}
                </template>
              </el-table-column>
              <el-table-column prop="s_id" label="明细单号" width="130%" align="center"></el-table-column>
              <el-table-column prop="s_time" label="记账日期" width="212%" align="center"></el-table-column>
              <el-table-column prop="s_amount" label="流水金额(元)" sortable="custom" width="150%" align="center"></el-table-column>
              <el-table-column prop="s_type" label="流水类型" width="130%" align="center"></el-table-column>
            </el-table>
            <div id="pieReport" style="width:500px;height:500px;margin-left:710px" align="right"></div>
          </div>
          
        </div>
        <!-- 分页器 -->
        <div style="line-height:50px;margin-top:75px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
        
        
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options1: [{
          value: '选项1',
          label: '和平饭店'
        }, ],
      value1: '和平饭店',
      props: { multiple: true },
      options: [{
          value: 1,
          label: '收入',
          children: [{
            value: 2,
            label: '营业额',
            children: [
              { value: 3, label: '营业额' },
            ]
          }, ]
        }, {
          value: 4,
          label: '支出',
          children: [{
            value: 5,
            label: '营运费用',
            children: [
              { value: 6,
              label: '人力',
              children:[
                {value: 7, label: '工资'},
                ]
              },
            ]
          }, {
            value: 8,
            label: '成本',
            children: [
              { value: 9, label: '原料' },
              { value: 10, label: '器具' }
            ]
          }, ]
        }],
      nodeValue:[3,7,9,10],
      oriData:[],
      periodData:[],
      date_start:"2021-7-1",
      date_end:"2021-9-30",
      s_id:"",
      s_time:"",
      s_amount:null,
      s_type:"",
      name:"",
      charts: "",
      opinion: ["收入", "工资", "原料", "器具"],
      opinionData: [
        { value: 0, name: "收入", itemStyle: "#FF9200" },
        { value: 0, name: "工资", itemStyle: "#3F92D2" },
        { value: 0, name: "原料", itemStyle: "#00AF64" },
        { value: 0, name: "器具", itemStyle: "#79d2c0" },
      ],
      value:null,
      total: 0,
      currentHeight: 522,
      currentPage: 1,
      pagesize: 10,
      tableData: [],
      loading: false,
    };
  },
  methods: {
    change(){
      let nodesObj = this.$refs['cascader'].getCheckedNodes();
      this.nodeValue=[];
      for(let i=0;i<nodesObj.length;i++){
        if(nodesObj[i].hasChildren==true)continue;
        this.nodeValue.push(nodesObj[i].data.value);
      }
    },
    refresh(){
      this.loading=true;
      this.tableData=[];
      this.opinionData=[
        { value: null, name: "收入", itemStyle: "#FF9200" },
        { value: null, name: "工资", itemStyle: "#3F92D2" },
        { value: null, name: "原料", itemStyle: "#00AF64" },
        { value: null, name: "器具", itemStyle: "#79d2c0" },
      ];
      this.drawPie("pieReport");
      this.loading=false;
    },
    inquire() {
      this.loading = true;
      this.$axios.get("/api/Statement/getStatement",{
          params:{
            startDate:this.date_start+"",
            endDate:this.date_end+"",
          },
        })
        .then((response) => {
          this.tableData=[];
          this.oriData = response.data;
          for(let i=0;i<this.nodeValue.length;i++){
            if(this.nodeValue[i]==3){         //收入
              this.selectData("收入");
            }else if(this.nodeValue[i]==7){   //工资
              this.selectData("工资");
            }else if(this.nodeValue[i]==9){   //原料
              this.selectData("原料");
            }else if(this.nodeValue[i]==10){  //器具
              this.selectData("器具");
            }
          }
        });
        this.fetchData();
        this.loading = false;
    },
    selectData(val){
      for(let i=0;i<this.oriData.length;i++){
        if(this.oriData[i].s_type==val){
          this.tableData.push({
            s_id:this.oriData[i].s_id,
            s_time:this.oriData[i].s_time,
            s_amount:this.oriData[i].s_amount,
            s_type:this.oriData[i].s_type,
          })
        }
      }
    },
    async fetchData(){
      this.periodData=[];
      //查询某段时间内收入总额
      this.$axios.get("/api/Statement/getIncome",{
          params:{
            startDate:this.date_start+"",
            endDate:this.date_end+"",
          },
        })
        .then((response) => {
          this.periodData.push({ //收入
            s_type:response.data[0].s_type,
            s_amount:response.data[0].s_amount,
          });
        });
      //查询某段时间内支出额，并分类返回
      this.$axios.get("/api/Statement/getExpenditure",{
          params:{
            startDate:this.date_start+"",
            endDate:this.date_end+"", 
          },
        })
        .then((response) => {
          this.periodData.push({ //工资
            s_type:response.data[2].s_type,
            s_amount:response.data[2].s_amount,
          });
          this.periodData.push({ //原料
            s_type:response.data[0].s_type,
            s_amount:response.data[0].s_amount,
          });
          this.periodData.push({ //器具
            s_type:response.data[1].s_type,
            s_amount:response.data[1].s_amount,
          });
          for(let i=0;i<this.nodeValue.length;i++){
            if(this.nodeValue[i]==3){         //收入
              this.opinionData[0].value=this.periodData[0].s_amount;
            }else if(this.nodeValue[i]==7){   //工资
              this.opinionData[1].value=this.periodData[1].s_amount;
            }else if(this.nodeValue[i]==9){   //原料
              this.opinionData[2].value=this.periodData[2].s_amount;
            }else if(this.nodeValue[i]==10){  //器具
              this.opinionData[3].value=this.periodData[3].s_amount;
            }
            this.drawPie("pieReport");
          }
        });
    },
    drawPie(id) {
      this.loading=true;
      this.charts = this.$echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: this.opinion
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            avoidLabelOverlap: true,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              color: function(params) {
                //自定义颜色
                var colorList = ["#FF9200","#3F92D2","#00AF64", "#79d2c0"];
                return colorList[params.dataIndex];
              }
            },
            data: this.opinionData
          }
        ]
      });
      //console.log(this.opinionData);
      this.loading=false;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      if (val == 5) this.currentHeight = 285;
      else if (val == 10) this.currentHeight = 522;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    sortChange(val) {
      //正序
      if (val.column.order == "ascending") {
        if (val.column.property == "s_amount") {
          this.tableData.sort(this.sortList("s_amount"));
        }
        else this.tableData.sort(this.sortList("s_time"));
      }
      //倒序
      else if (val.column.order == "descending") {
        if (val.column.property == "s_amount") {
          this.tableData.sort(this.sortListDesc("s_amount"));
        }
        else this.tableData.sort(this.sortListDesc("s_time"));
      }
    },
    sortList(property) {
      return function (a, b) {
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        return value1 - value2;
      };
    },
    sortListDesc(property) {
      return function (a, b) {
        var value1 = parseInt(a[property]);
        var value2 = parseInt(b[property]);
        return value2 - value1;
      };
    },
  },
  mounted() {
    this.$axios.get("/api/Statement/getStatement",{
          params:{
            startDate:this.date_start,
            endDate:this.date_end,
          },
        })
        .then((response) => {
          this.tableData=response.data;
        });
    this.fetchData();
  },
};
</script>

<style scoped>
</style>