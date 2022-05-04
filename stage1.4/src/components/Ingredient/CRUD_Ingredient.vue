<template>
  <div>
    <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item>食材管理</el-breadcrumb-item>
        <el-breadcrumb-item>食材信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div>
      <el-dialog
        title="修改原料信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="库存变动" style="width:330px" align="center"></el-form-item>
          <el-form-item label="新的数值" style="width:330px">
            <el-input v-model="form.newvalue" placeholder="请输入增/减库存量" clearable=true></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false, callOff()" class="buteu2_ingre">取 消</el-button>
          <el-button type="primary" @click="onUpdate()" class="buteu1_ingre">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        title="新增原料"
        :visible.sync="dialogVisible1"
        width="30%"
        :before-close="handleClose">
        <el-form ref="add_ingre" :model="form" label-width="120px">
          <el-form-item label="新增原料" style="width:330px" align="center" clearable=true></el-form-item>
          <el-form-item label="新的数值" style="width:330px">
            <el-input v-model="add_ingre.ingre_name" placeholder="请输入原料名称"></el-input>
            <el-date-picker 
              clearable=true
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择购买日期(yyyy-mm-dd)"
              :picker-options="pickerOptions"
              v-model="add_ingre.buy_date" 
            ></el-date-picker>
            <el-input v-model="add_ingre.inventory" placeholder="请输入添加量" clearable=true></el-input>
            <el-input v-model="add_ingre.shelf_life" placeholder="请输入保质期" clearable=true></el-input>
            <el-input v-model="add_ingre.cost" placeholder="请输入花费" clearable=true></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false, callOff()" class="buteu2_ingre">取 消</el-button>
          <el-button type="primary" @click="onUpdate1()" class="buteu1_ingre">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div style="line-height: 30px">
      <el-card class="box-card" style="margin-top: 20px;">
        <el-input style="width:50%;margin-bottom:30px" class="in" placeholder="请输入要查找的食材名称" clearable=true v-model="name"></el-input>
        <el-button type="success" size="mini" style="line-height:20px" @click="inquireIngre()">查询食材</el-button>
        <el-button type="success" size="mini" style="line-height:20px" @click="dialogVisible1=true">新增食材</el-button>
        <el-button icon="el-icon-refresh" circle @click="getAllIngredient()"></el-button>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="tableData.slice((currentPage - 1) * pagesize,currentPage * pagesize)"
          default-sort="{prop:'inventory',order:'descending'},{prop:'buy_date',order:'descending'}"
          @sort-change="sortChange"
          style="width: 80%;margin-bottom:20px;left:110px;"
          max-height="1000"
          border
          stripe
        >
          <el-table-column label="#" align="center" type="index">
            <template slot-scope="scope">
              {{scope.$index+(currentPage - 1) * pagesize+1}}
            </template>
          </el-table-column>
          <el-table-column prop="ingre_name" label="食材名称" width="100%" align="center"></el-table-column>
          <el-table-column prop="inventory" label="该批次库存" sortable="custom" width="150%" align="center"></el-table-column>
          <el-table-column prop="buy_date" label="购买日期" sortable="custom" width="150%" align="center"></el-table-column>
          <el-table-column prop="shelf_life" label="保质期（天）" width="100%" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" width="110%" align="center"
            :filters="[{text: '调味料', value: '调味料'}, {text: '香草香料', value: '香草香料'}, {text: '谷物', value: '谷物'}, 
            {text: '菌类', value: '菌类'},{text: '水产', value: '水产'},{text: '蛋', value: '蛋'},
            {text: '蔬菜', value: '蔬菜'},{text: '肉', value: '肉'},{text: '豆制品', value: '豆制品'},]"
            :filter-method="filterHandler"
          ></el-table-column>
          <el-table-column prop="state" label="状态" width="110%" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="190%">
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
      this.form.ingre_name=row.ingre_name;
      this.form.buy_date=row.buy_date;
      this.form.shelf_life=row.shelf_life;
      this.form.inventory=row.inventory;
      this.form.state=row.state;
      this.form.type=row.type;
    },
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    handleClick(row) {
      this.grid = true;
      console.log(row.ingre_name), (this._ingrename = row.ingre_name);
      this._inventory = row.inventory;
      this.fetchData(row);
    },
    callOff(){
          this.$router.push({path:'/CRUD_Ingredient'});
        },
        //点击确定按钮
    onUpdate(){
          this.dialogVisible = false;
          //库存量：int
          if(/^[0-9]*$/.test(parseInt(parseInt(this.form.newvalue)))===false){
            alert("*库存量应为整数.");
            return;
          }
          this.tuple1=[];
            this.tuple1.push({
              ingre_name: this.form.ingre_name,
              buy_date: this.form.buy_date,
              inventory: this.form.inventory,
              shelf_life: this.form.shelf_life,
              cost: 0,
              state:this.form.state,
              type:this.form.type,
            })
            this.tuple1.push({
              ingre_name: this.form.ingre_name,
              buy_date: this.form.buy_date,
              inventory: parseInt(this.form.newvalue),
              shelf_life: this.form.shelf_life,
              cost: 150,
              state:this.form.state,
              type:this.form.type,
            })
            this.$axios
            .post("/api/Ingredient/updateIngredient",
              this.tuple1,
            )
            .then((response) => {
              switch (response.data) {
                case 2:
                  alert("当天已存在该食材，将进行该食材库存量的更新！");
                  this.getAllIngredient();
                  break;
              }
          })
          .catch((error) => {
            console.log(error);
            alert("请求失败!");
          });
        },
    onUpdate1(){
          this.dialogVisible1 = false;
          //校验食材名:汉字
          if(/^[\u4e00-\u9fa5]*$/.test(this.add_ingre.ingre_name)===false){
            alert("*原料名称由汉字组成.");
            return;
          }
          //库存量：int
          else if(/^[0-9]*$/.test(parseInt(this.add_ingre.inventory))===false){
            alert("*库存量应为整数.");
            return;
          }
          //保质期:int
          else if(/^[0-9]*$/.test(parseInt(this.add_ingre.shelf_life))===false){
            alert("*保质期应为整数.");
            return;
          }
          //花费：int
          else if(/^[0-9]*$/.test(parseInt(this.add_ingre.cost))===false){
            alert("*花费应为整数.");
            return;
          }
          this.$axios.post("/api/Ingredient/addIngredient", {
            ingre_name: this.add_ingre.ingre_name,
            buy_date: this.add_ingre.buy_date,
            inventory: parseInt(this.add_ingre.inventory),
            shelf_life: this.add_ingre.shelf_life,
            cost: parseInt(this.add_ingre.cost),
          })
          .then((response) => {
            //请求成功
            switch (response.data) {
              case -1:
                alert("添加失败!");
                break;
              case 0: //原来没有该食材
                alert("新添加食材成功!");
                this.tableData.push({
                  ingre_name: this.ingre_name,
                  buy_date: this.buy_date,
                  amount: parseInt(this.amount),
                  shelf_life: this.shelf_life,
                  cost: parseInt(this.cost),
                  state: "新添加成功",
                });
                break;
              case 1: //原来已经有该食材，用新的amount覆盖原来的库存
                alert("当日已有该食材，修改成功!");
                this.tableData.push({
                  ingre_name: this.ingre_name,
                  buy_date: this.buy_date,
                  amount: parseInt(this.amount),
                  shelf_life: this.shelf_life,
                  cost: parseInt(this.cost),
                  state: "当日食材修改成功",
                });
                break;
            }
          })
          .catch((error) => {
            console.log(error);
            alert("请求失败!");
          });
        },
    async inquireIngre() {
      //校验食材名:汉字
      if(/^[\u4e00-\u9fa5]*$/.test(this.name)===false){
        alert("*食材名称由汉字组成.");
        return;
        }
      const self = this;
      self.$axios
        .get("/api/Ingredient/isExistenceIngredient", {
          params: {
            name: self.name,
          },
        })
        .then((response) => {
          //请求成功
          console.log("请求成功");
          console.log(response.data);
          switch (response.data[0].cost) {
            case null:
              alert("连接错误!");
              break;
            case 0:
              alert("查找失败!不存在该食材！");
              break;
            default:
              this.msg = response.data;
              alert("查找成功！");
              this.tableData = response.data;
              break;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
    
    },
    async deleteRow(rows) {
      const confirm_result = await this.$confirm(
        "此操作将删除该食材, 是否继续?",
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
          .post("/api/Ingredient/deleteIngredient", {
            ingre_name: rows.ingre_name + "",
            buy_date:rows.buy_date,
          })
          .then((res) => {
            switch (res.data) {
              case 1:
                break;
              default:
                return this.$message.info("食材未移除，请重试！");
            }
          });
          this.$router.push({
            path: "/CRUD_Ingredient",
            });
        this.getAllIngredient();
        return this.$message.success("已删除");
      }
    },

    async fetchData(row) {
      await this.$axios
        .get("/api/Ingredient/isExistenceIngredient", {
          params: {
            name: row.ingre_name + "",
          },
        })
        .then((res) => {
          this.chosen_ingre = res.data;
          console.log(this.chosen_ingre);
        });
    },
    async getAllIngredient() {
      this.loading = true;
      await this.$axios
        .get("/api/Ingredient/getAllIngredient", {})
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
        if (val.column.property == "inventory") {
          this.tableData.sort(this.sortList("inventory"));
        }
        else this.tableData.sort(this.sortList("buy_date"));
      }
      //倒序
      else if (val.column.order == "descending") {
        if (val.column.property == "inventory") {
          this.tableData.sort(this.sortListDesc("inventory"));
        }
        else this.tableData.sort(this.sortListDesc("buy_date"));
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
    this.getAllIngredient();
  },
  data() {
    return {
      search_hint:'',
      name:"",
      _ingrename: "",
      _inventory: 0,
      grid: false,
      _grid:false,
      dialogVisible: false,
      dialogVisible1:false,
      total: 0,
      currentHeight: 522,
      currentPage: 1,
      pagesize: 5,
      tableData: [],
      chosen_ingre: [],
      add_ingre:{
        ingre_name:'',
        inventory:null,
        buy_date:'',
        shelf_life:'',
        cost:'',
        state:'',
        type:'',
      },
      tuple1:[],
      loading: true,
      form: {
          ingre_name: '',
          inventory:0,
          buy_date:'',
          shelf_life:'',
          type:'',
          state:'',
          newvalue:null,
          cost:0,
      },
    };
  },
};
</script>

<style scoped>
 .buteu1_ingre{
  margin-top:-30px;
  position:absolute;
  left:130px;
}

.buteu2_ingre{
  margin-top:-30px;
  position:absolute;
  left:230px;
}
</style>