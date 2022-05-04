<template>
  <div>
    <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>器材管理</el-breadcrumb-item>
        <el-breadcrumb-item>器材信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div>
      <el-dialog
        title="修改器材信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form ref="modify_utensil" :model="form" label-width="120px">
          <el-form-item label="库存变动" style="width:330px" align="center"></el-form-item>
          <el-form-item label="新的数值" style="width:330px">
            <el-input v-model="modify_utensil.newvalue" placeholder="请输入增/减库存量" clearable=true></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false, callOff()" class="buteu2_ut">取 消</el-button>
          <el-button type="primary" @click="onUpdate()" class="buteu1_ut">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    
    <div style="line-height: 50px">
      <el-card class="box-card" style="margin-top: 20px">
        <el-input style="width: 20%" placeholder="请输入新增加器材名称" v-model="name1" clearable=true></el-input>
        <el-input style="width: 20%" placeholder="请输入新增加器材的量" v-model="inventory1" clearable=true></el-input>
        <el-input style="width: 20%" placeholder="请输入新增加器材的金额" v-model="cost" clearable=true></el-input>
        <el-button type="success" size="mini" style="line-height:20px" @click="addNewUtensil()">新增器材</el-button>
        <el-input style="width: 15%" placeholder="请输入待查询器材名称" v-model="name2" clearable=true></el-input>
        <el-button type="primary" icon="el-icon-search" circle @click="inquireUtensil()"></el-button>
        <el-button icon="el-icon-refresh" circle @click="getAllUtensil()"></el-button>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="tableData.slice((currentPage - 1) * pagesize,currentPage * pagesize)"
          default-sort="{prop:'inventory',order:'descending'},"
          @sort-change="sortChange"
          style="width: 80%;margin-top:20px;margin-bottom:20px;left:80px"
          max-height="1000"
          border
          stripe
          
        >
          <el-table-column label="#" align="center" type="index">
            <template slot-scope="scope">
              {{scope.$index+(currentPage - 1) * pagesize+1}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="器材名称" width="130%" align="center"></el-table-column>
          <el-table-column prop="s_id" label="流水单号" width="140%" align="center"></el-table-column>
          <el-table-column prop="s_time" label="购买时间" width="220%" align="center"></el-table-column>
          <el-table-column prop="inventory" label="数量" sortable="custom" width="120%" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" width="130%" align="center"
            :filters="[{text: '炊具', value: '炊具'}, {text: '电器', value: '电器'}, {text: '厨具', value: '厨具'}, 
            {text: '餐具', value: '餐具'},{text: '洗涤用品', value: '洗涤用品'}]"
            :filter-method="filterHandler"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="170%">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="dialogVisible=true, copyData(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next"
          :total="tableData.length"
        >
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    copyData(row){
      this.modify_utensil.name=row.name;
      this.modify_utensil.s_id=row.s_id;
      this.modify_utensil.s_time=row.s_time;
      this.modify_utensil.cost=row.cost;
      this.modify_utensil.type=row.type;
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    callOff(){
          this.$router.push({path:'/CRUD_Utensil'});
        },
        //点击确定按钮
    onUpdate(){
          this.dialogVisible = false;
          //库存量：int
          if(/^[0-9]*$/.test(parseInt(this.modify_utensil.newvalue))===false){
            alert("*库存量应为整数.");
            return;
          }
          const self = this;
          self.$axios
            .post("/api/Utensil/setUtensilAmount", {
              name: this.modify_utensil.name,
              s_id:this.modify_utensil.s_id,
              s_time:this.modify_utensil.s_time,
              inventory: parseInt(this.modify_utensil.newvalue),
              cost: parseInt(this.modify_utensil.cost),
              type:this.modify_utensil.type,
            })
            .then((response) => {
              //请求成功
              console.log(response.data);
              switch (response.data) {
                case -1:
                  alert("没有该器材，修改失败!");
                  break;
                case -2:
                  alert("连接失败!");
                  break;
                default:
                  alert("修改成功!");
                  this.getAllUtensil();
                  break;
              }
            })
            .catch((error) => {
              console.log(error);
              alert("请求失败!");
            });
        },
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },

    async addNewUtensil() { //添加器具
      //校验食材名:汉字
      if(/^[\u4e00-\u9fa5]*$/.test(this.name1)===false){
        alert("*器材名称由汉字组成.");
        return;
        }
      //库存量：int
      else if(/^[0-9]*$/.test(parseInt(this.inventory1))===false){
        alert("*库存量应为整数.");
        return;
        }
      //花费:int
      else if(/^[0-9]*$/.test(parseInt(this.cost))===false){
        alert("*花费应为整数.");
        return;
      }
      const self = this;
      self.$axios
        .post("/api/Utensil/addUtensil", {
          name: self.name1,
          inventory: parseInt(self.inventory1),
          cost: parseInt(self.cost),
        })
        .then((response) => {
          //请求成功
          console.log(response.data);
          switch (response.data) {
            case 1:
              alert("添加器材成功!");
              this.$router.push({
                path: "/CRUD_Utensil",
              });
              break;
            case -1:
              alert("连接失败!");
              break;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
    
    },
    async inquireUtensil() {
      //校验器材名:汉字
      if(/^[\u4e00-\u9fa5]*$/.test(this.name2)===false){
        alert("*器材名称由汉字组成.");
        return;
        }
      this.loading=true
      this.$axios.get('/api/Utensil/getUtensil',{
        params:{
          name:this.name2
        }
      })
      .then(response=>{
        console.log(response.data);
        if(response.data.length==0){
          alert("找不到该器具!");
        }
        else{
          this.tableData=response.data;
        }
      })
      this.loading=false
    },
    async deleteRow(rows) {
      const confirm_result = await this.$confirm(
        "此操作将删除该批器材, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      if (confirm_result !== "confirm") {
        //return this.$message.info("已取消删除");
      } else {
        const { data: res } = this.$axios
          .post("/api/Utensil/deleteUtensil", {
            name: rows.name + "",
            s_id:rows.s_id,
            s_time:rows.s_time,
          })
          .then((res) => {
            switch (res.data) {
              case 1:
                break;
              default:
                return this.$message.info("器材未移除，请重试！");
            }
          });
        this.getAllUtensil();
        return this.$message.success("已删除");
      }
    },
    async getAllUtensil() {
      this.loading = true;
      this.tableData=[];
      await this.$axios
        .get("/api/Utensil/getAllUtensil", {})
        .then((response) => {
          this.tableData = response.data;
        });
      this.loading = false;
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
        this.tableData.sort(this.sortList("inventory"));
      }
      //倒序
      else if (val.column.order == "descending") {
        this.tableData.sort(this.sortListDesc("inventory"));
      }
    },

    //排序规则
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
    this.getAllUtensil();
  },
  data() {
    return {
      name1:"",
      name2:"",
      cost:null,
      inventory1:null,
      _name: "",
      _inventory: 0,
      s_id:"",
      s_time:"",
      grid: false,
      total: 0,
      currentHeight: 522,
      currentPage: 1,
      pagesize: 5,
      tableData: [],
      utensilList:[],
      chosen_utensil: [],
      modify_utensil:{
        name:'',
        s_id:'',
        s_time:'',
        newvalue:null,
        cost:null,
      },
      loading: true,
      dialogVisible: false,
    };
  },
};
</script>

<style scoped>
 .buteu1_ut{
  margin-top:-30px;
  position:absolute;
  left:130px;
}

.buteu2_ut{
  margin-top:-30px;
  position:absolute;
  left:230px;
}
</style>