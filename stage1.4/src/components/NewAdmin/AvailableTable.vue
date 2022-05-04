//餐桌管理
<template>
  <div class="app">
    
    <div class="menu">
       <div class="menu_title">
          <a style="color: #515A6E;">
            <li class="li2">
            <span>查看可用餐桌</span>
            </li>
            <!-- <li class="li" v-for="(item,index) in menu" :key="index" :class="{active: index ===  currentIndex}" @click='itemClick(index)'>
              <span>{{item.name}}</span>
            </li> -->
          </a>
      </div>
               <div class="freeTableButton">
                <el-button type="success" plain size="middle" style="height: 50px" @click="allTable()">查看所有餐桌</el-button>
              </div>  
    </div>

    <div style="padding: 0px 10.5%;">
      <div style="padding: 20px;">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in tableData" :key="index" :ref="'popover-' + index">
              <el-popover placement="bottom" width="300" title="餐桌信息" trigger="click" v-model="item.visible" v-if="item.using_state == '空闲'">
                <p>餐桌编号：{{item.table_id}}</p>
                <p class="informationTable">餐桌规模：{{item.table_capacity}}</p>
                <p class="informationTable">餐桌状态：{{item.using_state}}</p>
                <div class="informationButton">
                  <el-button plain size="middle" @click="item.visible = false">返 回</el-button>
                  <el-button type="primary" plain size="middle" @click="modifyThe(item.visible)">修 改</el-button>
                </div>
                <div class="grid-content bg-purple-free" slot="reference">
                  <div class="information">
                    <p class="informationTable2">编号：{{item.table_id}}</p>
                    <p class="informationTable2">状态：{{item.using_state}}</p>
                  </div>
                </div>
              </el-popover>
            <el-popover placement="bottom" title="餐桌信息" width="300" trigger="click" v-model="item.visible"  v-if="item.using_state == '使用'">
              <p>餐桌编号：{{item.table_id}}</p>
              <p class="informationTable">餐桌规模：{{item.table_capacity}}</p>
              <p class="informationTable">餐桌状态：{{item.using_state}}</p>
              <p class="informationTable">订单编号：{{item.order_id}}</p>
              <p class="informationTable">下单时间：{{item.order_date}}</p>
              <div class="informationButton">
                <el-button plain size="middle" @click="item.visible = false">返 回</el-button>
                <el-button type="primary" plain size="middle" @click="modifyThe(item.visible)">修 改</el-button>
              </div>
              <div class="grid-content bg-purple-use" slot="reference">
                <div class="information">
                  <p class="informationTable2">编号：{{item.table_id}}</p>
                  <p class="informationTable2">状态：{{item.using_state}}</p>
                </div>
              </div>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="餐桌编号">
          <el-input v-model="form.table_id" placeholder="请输入餐桌编号（字母+数字）" clearable style="width: 65%;" :rules="[{ required: true, message: '餐桌编号不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="餐桌规模">
          <el-input v-model="form.table_capacity" placeholder="请输入餐桌规模（数字）" clearable style="width: 65%;" :rules="[{ required: true, message: '餐桌规模不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="餐桌状态">
          <el-select v-model="form.using_state" placeholder="请选择状态" style="width: 65%;">
            <el-option label="空闲" value="空闲"></el-option>
            <el-option label="使用" value="使用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" v-if="form.using_state == '使用'">
          <el-input v-model="form.order_id" placeholder="请输入订单编号（数字）" clearable style="width: 65%;" :rules="[{ required: true, message: '订单编号不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" v-if="form.using_state == '使用'">
          <el-date-picker type="datetime" placeholder="请选择日期" v-model="form.order_date" style="width: 65%;"></el-date-picker>
        </el-form-item>
         <p style="color:red;" class="alter-style">{{this.alter_hint}}</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="checkSubmit()">确 定</el-button>
     </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      reviewVisible: true,
      dialogVisible: false,
      currentIndex: 0,
      table_id :'',
      table_capacity: '',
      using_state:'',
      order_id:'',
      order_date:'',
      tableData:[],

      form: {
        table_id: '',
        table_capacity: '',
        using_state: '',
        order_id: '',
        order_date: ''
      },
      alter_hint:''
    }
  },
  mounted(){
      this.$axios.get("/api/Dining_table/getAllEmptyTable", {
        params: {
        requester_id:this.requester_ID+'',
        }
        })
        .then(response=> {
            switch(response.data.id){
              case null:
              	alert("没有餐桌！");
              	break;
              default:
                this.tableData=response.data;
                break;
            }
          })
    },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit('tabClick', index)
    },
    // eslint-disable-next-line no-unused-vars
    modifyThe(visible) {
      this.dialogVisible = true;
      visible = false;
    },
    allTable(){
      this.$router.push({
        path: "/NewTable1",
      });
    },
    close() {
      this.form = {};
      this.dialogVisible = false;
    },
    // onSubmit() {
    //   this.form = {};
    //   this.dialogVisible = false;
    // },
     submit(){
      this.$axios
        .post('/api/Dining_table/setTable',{
            table_id : this.form.table_id+'',
            table_capacity: parseInt(this.form.table_capacity),
            using_state:this.form.using_state+'',
            order_id:this.form.order_id+'',
            order_date:this.form.order_date+''
        })
        .then(response=> {
        //请求成功
          console.log("请求成功");
          console.log(response.data);
          switch(response.data){
            case 0:
              alert("修改失败！");
              break;
            case 1:
              alert("修改成功！");
              this.form = {};
              this.dialogVisible = false;
              // this.tableData=[];
              // this.tableData.push({
              //   table_id: this.form.table_id,
              //   table_capacity: parseInt(this.form.table_capacity),
              //   using_state:this.form.using_state,
              //   order_id:this.form.order_id,
              //   order_date:this.form.order_date
              //    });
              
              break;
          }
        })
         .catch((error) => {
          console.log("请求失败");
          console.log(error);
          alert("请求失败!");
        })
    },
    checkSubmit(){
    if( this.form.table_id==''||this.form.table_capacity==''||this.form.using_state=='')
    {
      this.alter_hint='*输入不能为空！';
      return ;
    }
    if(this.form.using_state=="使用")
    {
    if(this.form.order_id==''||this.form.order_date=='')
    {
      this.alter_hint='*输入不能为空！';
      return ;
    }
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.table_id)===true)
    {
      this.alter_hint="*餐桌编号中不含有汉字！"
      return;
    }
    if(/^[0-9]*$/.test(this.form.table_capacity)===false)
      {
        this.alter_hint="*餐桌规模由数字组成！"
        return;
      }
    if(this.form.using_state=="使用")
    {
      if(/^[0-9]*$/.test(this.form.order_id)===false)
      {
        this.alter_hint="*订单编号由数字组成！"
        return;
      }
    }
    this.alter_hint=""
    this.submit()
  },
    
  }
}
</script>

<style scoped>

  
html,body,.app{
  height: 100%;
  background-color: #EFF3F5;
}
.menu {
  width: 100%;
  height: 80px;
  background-color: white;
}
.menu_title {
  padding: 0px 10.5%;
}
.ul .li {
  display:inline;
  font-size: 15px;
  line-height: 80px;
  float: left;
  padding: 0px 22px;
}
 .li2 {
  margin-left: 44%;
  display:inline;
  font-size: 20px;
  line-height: 80px;
  float:left;
  padding: 0px 0px;
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-use {
  background: rgba(255, 165, 0, 0.5);
  font-size:unset;
}
.bg-purple-free {
  background: rgba(7, 222, 0, 0.5);
  font-size:unset;
  /* letter-spacing:0px; */
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {

  /* width:260px; */
  /* grid-template-columns:repeat(4,1fr);  */
  position: relative;
  border-radius: 5px;
  min-height: 150px;
  box-shadow:5px 5px 10px gray;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.active {
  color: #3D7EFF;
  border-bottom: 2px solid #3D7EFF;
}
.information {
  position: absolute;
  left:0px;
  right:0px;
  bottom: 0px;
  bottom: 0px;
  background-color: ivory;
  padding: 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.informationTable {
  padding-top: 5px;
}
.informationTable2 {
  margin:2% 1%;
}
.informationButton {
  padding-top: 10px;
  text-align: center;
}
.freeTableButton {
  padding-left: 1080px;
  padding-top: 15px;
  text-align: center;
}
.alter-style{
  text-align: center;
}
</style>
