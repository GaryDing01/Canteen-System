<template>
  <div style="line-height: 20px">
    <div style="line-height: 50px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/StaffEnter' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>器材管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/CRUD_Utensil' }">器材信息</el-breadcrumb-item>
        <el-breadcrumb-item>修改器材</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div>
      <div class="background" :style="backgroundIm">
        <img :src="backgroundIm" width="100%" height="100%" alt="" />
      </div>
      <div class="modifyList" name="modifyInformation">
        <form>
          <p class="titleText">
            修改器材库存：
            <el-input style="width: 25%" placeholder="请输入器材名称" v-model="name" clearable=true></el-input>
            <el-input style="width: 25%" placeholder="请输入修改数量" v-model="inventory" clearable=true></el-input>
            <el-input style="width: 25%" placeholder="请输入花费金额" v-model="cost" clearable=true></el-input>
            <el-button class="modifyButton" type="primary" @click="setUtensilAmount()">确认</el-button>
            <el-button type="warning" @click="goback()">关闭</el-button>
          </p>
        </form>
      </div>
      <div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="name" label="器材名称" width="310%"></el-table-column>
          <el-table-column align="center" prop="inventory" label="现有库存" width="310%"></el-table-column>
          <el-table-column align="center" prop="cost" label="本批器材花费金额" width="310%"></el-table-column>
          <el-table-column align="center" prop="state" label="操作状态"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      name: this.$route.query.uten_name,
      inventory: null,
      cost: null,
    };
  },
  methods: {
    setUtensilAmount()
    {
      const self = this;
      self.$axios
        .post("/api/Utensil/setUtensilAmount", {
          name: self.name,
          inventory: parseInt(self.inventory),
          cost: parseInt(self.cost),
        })
        .then((response) => {
          //请求成功
          switch (response.data.inventory) {
            case -1:
              alert("没有该器材，修改失败!");
              break;
            case -2:
              alert("连接失败!");
              break;
            default:
              alert("修改成功!");
              console.log(response.data)
              this.tableData.push({
                name: self.name,
                inventory: response.data,
                cost: self.cost,
                state: "修改成功",
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
          path:'/CRUD_Utensil',
         });
    }
  },
};
</script>

<style>
</style>