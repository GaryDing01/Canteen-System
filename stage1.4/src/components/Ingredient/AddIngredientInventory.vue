<template>
  <div style="line-height: 10px">
    <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食材管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/CRUD' }">食材信息</el-breadcrumb-item>
        <el-breadcrumb-item>新增食材</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card style="margin-top:25px">
    <div>
      <div class="background" :style="backgroundIm">
        <img :src="backgroundIm" width="100%" height="100%" alt="" />
      </div>
      <div class="addList" name="addInformation">
        <form>
          <p class="titleText" style="line-height:50px">
            请输入新添加的食材信息<br>
            <el-input
              style="width: 15%"
              placeholder="请输入原料名称"
              v-model="ingre_name"
              clearable=true
            ></el-input>
            <el-date-picker
              style="width: 25%"
              v-model="buy_date"
              clearable=true
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择购买日期(yyyy-mm-dd)"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-input
              style="width: 15%"
              placeholder="请输入添加量"
              v-model="amount"
              clearable=true
            ></el-input>
            <el-input
              style="width: 15%"
              placeholder="请输入保质期"
              v-model="shelf_life"
              clearable=true
            ></el-input>
            <el-input
              style="width: 15%"
              placeholder="请输入花费"
              v-model="cost"
              clearable=true
            ></el-input><br>
            <el-button type="success" @click="addIngredient()">确认</el-button>
            <el-button type="warning" @click="goback()">关闭</el-button>
          </p>
        </form>
      </div>
    </div>
    </el-card>
    <el-card style="margin-top:25px">
    <div>
      <el-table :data="tableData" border style="width: 100%" stripe>
        <el-table-column
          prop="ingre_name"
          align="center"
          label="原料名称"
          width="210%"
        ></el-table-column>
        <el-table-column
          prop="buy_date"
          align="center"
          label="购买日期"
          width="210%"
        ></el-table-column>
        <el-table-column
          prop="amount"
          align="center"
          label="添加量"
          width="210%"
        ></el-table-column>
        <el-table-column
          prop="shelf_life"
          align="center"
          label="保质期"
          width="210%"
        ></el-table-column>
        <el-table-column
          prop="cost"
          align="center"
          label="花费"
          width="210%"
        ></el-table-column>
        <el-table-column
          prop="state"
          align="center"
          label="操作状态"
        ></el-table-column>
      </el-table>
    </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      ingre_name: "",
      buy_date: "",
      amount: null,
      shelf_life: "",
      cost: null,
    };
  },
  methods: {
    addIngredient() { //根据库存是否有此食材，区别添加对应食材，覆盖更新库存量等信息
      const self = this;
      self.$axios
        .post("/api/Ingredient/addIngredient", {
          ingre_name: self.ingre_name,
          buy_date: self.buy_date,
          inventory: parseInt(self.amount),
          shelf_life: self.shelf_life,
          cost: parseInt(self.cost),
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
                ingre_name: self.ingre_name,
                buy_date: self.buy_date,
                amount: parseInt(self.amount),
                shelf_life: self.shelf_life,
                cost: parseInt(self.cost),
                state: "新添加成功",
              });
              break;
            case 1: //原来已经有该食材，用新的amount覆盖原来的库存
              alert("当日已有该食材，修改成功!");
              this.tableData.push({
                ingre_name: self.ingre_name,
                buy_date: self.buy_date,
                amount: parseInt(self.amount),
                shelf_life: self.shelf_life,
                cost: parseInt(self.cost),
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
    goback(){
      this.$router.push({
          path:'/CRUD_Ingredient',
         });
    }
  },
};
</script>

<style>
</style>