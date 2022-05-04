<template>
  <div style="line-height: 20px">
    
      <div class="background" :style="backgroundIm">
        <img :src="backgroundIm" width="100%" height="100%" alt="" />
      </div>
      
    

    <div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        default-sort="{prop:'s_id',order:'descending'},
                      {prop:'inventory',order:'descending'},
                      {prop:'cost',order:'descending'},"
        @sort-change="sortChange"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="name"
          label="器材名称"
          width="250%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="s_id"
          label="流水号"
          width="250%"
          sortable='custom'
        ></el-table-column>
        <el-table-column
          align="center"
          prop="s_time"
          label="流水时间"
          type="date"
          width="300%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="inventory"
          label="库存量"
          width="250%"
          sortable='custom'
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cost"
          label="花费"
          sortable='custom'
        ></el-table-column>
      </el-table>
    </div>

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
</template>

<script>
export default {
  props: ["requester_ID"],

  data() {
    return {
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      dateTime: "",
      s_id: "",
      s_time: "",
      currentPage: 1,
      pagesize: 10,
      total: 0,
      currentHeight: 522,
      utensil_name: "",
    };
  },

  mounted() { //查看所有器材信息
    const self = this;
    self.$axios
      .get("/api/Canteen/getAllUtensil", {
        params: {},
      })
      .then((response) => {
        switch (response.data) {
          case null:
            alert("输入数据有误!");
            break;
          default:
            this.tableData = response.data;
            break;
        }
      });
  },

  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form));
  },

  methods: {

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
        if (val.column.property == "s_id") {
          this.tableData.sort(this.sortList("s_id"));
        }
        if (val.column.property == "cost") {
          this.tableData.sort(this.sortList("cost"));
        }
      }
      //倒序
      else if (val.column.order == "descending") {
        if (val.column.property == "inventory") {
          this.tableData.sort(this.sortListDesc("inventory"));
        }
        if (val.column.property == "s_id") {
          this.tableData.sort(this.sortListDesc("s_id"));
        }
        if (val.column.property == "cost") {
          this.tableData.sort(this.sortListDesc("cost"));
        }
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
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}
</style>