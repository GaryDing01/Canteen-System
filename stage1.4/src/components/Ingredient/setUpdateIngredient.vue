<template>
  <div style="line-height: 10px">
    <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食材管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/CRUD_Ingredient' }">食材信息</el-breadcrumb-item>
        <el-breadcrumb-item>更新食材信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-card class="box-card" style="margin-top: 20px">
      <div class="addList" name="addInformation" style="line-height: 30px">
        <form>
          <el-container style="width: 15%" v-model="ingre_name1">原原料名称：  {{ingre_name1}}</el-container>
          <el-container style="width: 15%" v-model="buy_date1">原购买日期：   {{buy_date1}}</el-container>
        </form>
        <form>
          <el-input style="width: 15%" placeholder="请输入现原料名称" v-model="ingre_name2"></el-input>
          <el-date-picker style="width: 15%" v-model="buy_date2" align="right" type="date" 
              value-format="yyyy-MM-dd" placeholder="请选择现购买日期(yyyy-mm-dd)" :picker-options="pickerOptions"></el-date-picker>
          <el-input style="width: 15%" placeholder="请输入现库存量" v-model="inventory2"></el-input>
          <el-input style="width: 15%" placeholder="请输入现保质期" v-model="shelf_life2"></el-input>
          <el-input style="width: 15%" placeholder="请输入现花费" v-model="cost2"></el-input>
        </form>
        <el-button type="primary" @click="setUpdateIngredient()" class="butUI">确认</el-button>
        <el-button type="warning" @click="goback()">关闭</el-button>
      </div>
      </el-card>
    </div>
    <div>
      <el-card style="margin-top:25px">
      <el-table :data="tableData" border style="width: 100%" stripe class="tUI">
        <el-table-column align="center" prop="ingre_name" label="原料名称" width="150%"></el-table-column>
        <el-table-column align="center" prop="buy_date" label="购买日期" width="150%"></el-table-column>
        <el-table-column align="center" prop="inventory" label="现库存" width="150%"></el-table-column>
        <el-table-column align="center" prop="shelf_life" label="保质期" width="150%"></el-table-column>
        <el-table-column align="center" prop="cost" label="花费" width="150%"></el-table-column>
        <el-table-column align="center" prop="state" label="操作状态"></el-table-column>
      </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default{
  data() {
    return {
      ingre_name1: this.$route.query.ingre_name,
      buy_date1: this.$route.query.buy_date,
      ingre_name2: this.$route.query.ingre_name,
      buy_date2: this.$route.query.buy_date,
      inventory2: null,
      shelf_life2: '',
      cost2: null,
      state: null,
      tableData: [],
      tuple1:[],
    };
  },
  methods: {
    setUpdateIngredient() {
      const self = this;
      self.tuple1.push({
        ingre_name: self.ingre_name1,
        buy_date: self.buy_date1,
        inventory: 0,
        shelf_life: '',
        cost: 0,
      })
      self.tuple1.push({
        ingre_name: self.ingre_name2,
        buy_date: self.buy_date2,
        inventory: parseInt(self.inventory2),
        shelf_life: self.shelf_life2,
        cost: parseInt(self.cost2)
      })
      self.$axios
        .post("/api/Ingredient/updateIngredient",
          this.tuple1,
        )
        .then((response) => {
          switch (response.data) {
            case -2:
              alert("元组数量异常!");
              break;
            case -1:
              alert("连接失败!");
              break;
            case 0:
              alert("查找旧食材信息失败!");
              break;
            case 1:
              alert("更新成功!");
              this.tableData.push({
                ingre_name: self.ingre_name2,
                buy_date: self.buy_date2,
                inventory: parseInt(self.inventory2),
                shelf_life: self.shelf_life2,
                cost: parseInt(self.cost2),
                state: "更新成功1",
              });
              break;
            case 2:
              alert("当天已存在该食材，将只进行该食材库存量的更新！");
              this.tableData.push({
                ingre_name: self.ingre_name2,
                buy_date: self.buy_date2,
                inventory: parseInt(self.inventory2),
                shelf_life: self.shelf_life2,
                cost: parseInt(self.cost2),
                state: "更新成功2",
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
.butUI{
  margin-top:15px;
}
.tUI{
  margin-top:15px;
}
</style>