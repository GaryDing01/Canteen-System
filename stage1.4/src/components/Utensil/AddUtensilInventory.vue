<template>
  <div style="line-height: 20px">
    <div>
      <div class="background" :style="backgroundIm">
        <img :src="backgroundIm" width="100%" height="100%" alt="" />
      </div>
      <div class="addList" name="addInformation">
        <form>
          <p class="titleText">
            添加新器材：
            <el-input
              style="width: 25%"
              placeholder="请输入器材名称"
              v-model="name"
            ></el-input>
            <el-input
              style="width: 25%"
              placeholder="请输入库存"
              v-model="inventory"
            ></el-input>
            <el-input
              style="width: 25%"
              placeholder="请输入金额"
              v-model="cost"
            ></el-input>
            <el-button
              class="inquireButton"
              type="primary"
              @click="addUtensil()"
              >添加</el-button
            >
          </p>
        </form>
      </div>
      <div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            align="center"
            prop="name"
            label="器材名称"
            width="450%"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="inventory"
            label="库存"
            width="450%"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="cost"
            label="金额"
          ></el-table-column>
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
      name: "",
      inventory: null,
      cost: null,
    };
  },
  methods: {
    addUtensil() { //添加器具，没有同名器材成功添加，已有，添加失败
      const self = this;
      self.$axios
        .post("/api/Canteen/addUtensil", {
          name: self.name,
          inventory: parseInt(self.inventory),
          cost: parseInt(self.cost),
        })
        .then((response) => {
          //请求成功
          switch (response.data) {
            case 1:
              alert("添加器材成功!");
              this.tableData.push({
                name: self.name,
                inventory: parseInt(self.inventory),
                cost: parseInt(self.cost),
              });
              break;
            case 0:
              alert("已存在器具，添加失败!");
              break;
            case -1:
              alert("连接失败!");
              break;
            default:
              break;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("请求失败!");
        });
    },
  },
};
</script>

<style>
</style>