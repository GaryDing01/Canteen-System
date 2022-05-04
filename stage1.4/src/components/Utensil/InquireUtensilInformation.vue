<template>
  <div style="line-height: 20px">
    <div>
      <div class="background" :style="backgroundIm">
        <img :src="backgroundIm" width="100%" height="100%" alt="" />
      </div>
      <div class="inquireList" name="inquireInformation">
        <form>
          <p class="titleText">
            查找器材：
            <el-input
              style="width: 40%"
              placeholder="请输入器材名称"
              v-model="utensil_name"
            ></el-input>
            <el-button
              class="inquireButton"
              type="primary"
              @click="getUtensil()"
              >确认</el-button
            >
          </p>
        </form>
      </div>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          align="center"
          prop="name"
          label="器材名称"
          width="300%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="inventory"
          label="库存"
          width="300%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="state"
          label="状态"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      utensil_name: "",
    };
  },
  methods: {
    getUtensil() { //查找某器材详细信息
      const self = this;
      self.$axios
        .get("/api/Canteen/getUtensil", {
          params: {
            name: self.utensil_name,
          },
        })
        .then((response) => {
          //请求成功
           console.log(response.data.cost);
          switch (response.data.inventory) {
            case 0:
              alert("没有该器具!");
              break;
            case -1:
              alert("连接失败!");
              break;
            default:
              alert("查找器材成功!");
              this.tableData.push({
                name: response.data.name,
                inventory: response.data.inventory,
                state: "正常",
              });
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