<template>
    <div>
      <!-- <div>{{dishList}}</div>
      <div>{{tableData}}</div>
      <div>{{ungoingList}}</div> -->
      <div>
        <p class="creditText">
          您的积分：{{credit}}
        </p>
        <p>餐桌:
          <el-select v-model="value" :disabled="this.currentOrderState==2" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.label">
            </el-option>
          </el-select>
        </p>
        <p class="creditOption" v-if="this.currentOrderState==2" >
          使用100积分？
        </p>
        <el-radio class="creditOption1" v-if="this.currentOrderState==2" v-model="radio" label='true' :disabled="this.credit<100 || this.credit=='不可使用'">是</el-radio>
        <el-radio class="creditOption2" v-if="this.currentOrderState==2" v-model="radio" label='false' :disabled="this.credit<100 || this.credit=='不可使用'">否</el-radio>
        <p>
          <el-button class="firstOrderButton"
           v-if="this.currentOrderState==2"
           @click="pay()">
          支付</el-button>
        </p>
        <p>
          <el-button class="secondOrderButton"
           type="primary"
           @click="orderSubmit()">
          {{secondButtonText}}</el-button>
        </p>
      </div>
        <div>
            <el-table
            :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
            :height="currentHeight"
            :row-style="{height: '40px'}"
            border
            style="width: 52%">
                <el-table-column
                prop="name"
                label="菜名"
                height="40"
                width="180"
                align="center">
                </el-table-column>
                <el-table-column
                prop="price"
                label="单价"
                height="40"
                width="180"
                align="center">
                </el-table-column>
                <el-table-column
                prop="number"
                label="数量"
                height="40"
                align="center">
                  <template slot-scope="scope">
                    <el-input-number
                    size="mini"
                    v-model="scope.row.number"
                    @change="handleChange(scope.row)"
                    :min="returnMin(scope.row.nume)">
                    </el-input-number>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
            @current-change="handleCurrentChange"
            :page-sizes="[8]"
            :page-size="PageSize"
            layout="total,prev, pager, next"
            :total="tableData.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props:["userID"],

        mounted(){
          this.order_id = sessionStorage.getItem("order_id");
          this.order_date = sessionStorage.getItem("order_date");
          this.currentOrderState = sessionStorage.getItem("currentOrderState");
          this.getMenu();
          this.getCredit();
          if (this.currentOrderState==1){
            this.secondButtonText = "提交";
          }
          else{
            this.secondButtonText = "修改";
            this.$axios.get('/api/Canteen/getCurrentDishForCustomer',{
              params:{
                customer_id:this.userID,
              }
            })
            .then(response=>{
              //更新ungoingList和tableData
              this.ungoingList = response.data;
              this.tableData.forEach(update=>{
                this.ungoingList.forEach(st=>{
                  if (st.dish_id == update.id){
                    update.number = st.dish_num;
                  }
                })
              });
            });
          }
        },

        data() {
            return {
              currentOrderState:1,
              tableData: [],
              currentPage: 1, // 当前页码
              total: 0, // 总条数
              PageSize: 8,
              currentHeight:473,
              options: [{label: "001"}, {label: '002'}, {label: '003'}, {label: '004'}, {label: '005'},{label: '006'}, {label: '007'},
                {label: '008'}, {label: '009'}, {label: '010'},{label: '011'}, {label: '012'}, {label: '013'}, {label: '014'}, {label: '015'},
                {label: '016'}, {label: '017'}, {label: '018'}, {label: '019'}, {label: '020'},{label: '021'}, {label: '022'}],
              value:'',
              dishList:[],
              ungoingList:[],
              secondButtonText:"",
              order_id:'',
              order_date:'',
              credit:0,
              expense:0,
              radio:false,
              flag:false,
            };
        },
        methods: {

          getCredit(){
            this.$axios.get('/api/Canteen/getCredits',{
              params:{
                customer_id:this.userID,
              }
            })
            .then(response=>{
              if (response.data<0){
                this.credit = "不可使用";
                return;
              }
              this.credit = response.data;
            });
          },

          getMenu(){
            this.$axios.get('/api/Canteen/dishInfo',{
               params:{}
            })
            .then(response=>{
              this.dishList = response.data;
              this.dishList.forEach(element => {
                this.tableData.push({id:element.dish_id,name:element.dish_name,price:element.dish_price,number:element.dish_num});
              });
            })
          },

          handleChange(value) {
          },

          handleCurrentChange(val) {
            this.currentPage = val;
          },

          returnMin(val){
            return 0;
          },

          getUngoing(){
            //获取正在进行的订单，更新ungoingList和tableData
            this.$axios.get('/api/Canteen/getCurrentDishForCustomer',{
              params:{
                customer_id:this.userID,
              }
            })
            .then(response=>{
              //更新ungoingList和tableData
              this.ungoingList = response.data;
              this.tableData.forEach(update=>{
                this.ungoingList.forEach(st=>{
                  if (st.dish_id == update.id){
                    update.number = st.dish_num;
                  }
                })
              });
            });
          },

          orderSubmit() {
            if (this.value=='' && this.currentOrderState==1){
              alert("请选择餐桌");
              return;
            }
            this.tableData.forEach(item=>{
              if(item.number!=0){
                this.flag = true;
              }
            });
            if (this.flag){
              if (this.currentOrderState==1){
                let data = [];
                this.tableData.forEach(item=>{
                  data.push({dish_id:item.id, dish_num:item.number})
                });
                this.$axios
                  .post('/api/Canteen/submitDishOrder',{
                    customer_id: this.userID+'',
                    table_id: this.value+'',
                    chosen_dish: data
                  })
                  .then(response=> {
                    console.log(response.data);
                    this.order_id = response.data[0];
                    this.order_date = response.data[1];
                    sessionStorage.setItem("order_id",response.data[0]);
                    sessionStorage.setItem("order_date",response.data[1]);
                  });
                this.getUngoing();
                this.currentOrderState = 2;
                sessionStorage.setItem("currentOrderState",2);
                this.secondButtonText="修改";
                sessionStorage.setItem("tableID",this.value);
                alert("提交成功！");
              }
              else{
                this.tableData.forEach(item=>{
                  this.$axios
                    .post('/api/Canteen/setChosenDishNumberTo',{
                        order_id:this.order_id+'',
                        order_date:this.order_date+'',
                        dish_id:item.id+'',
                        dish_num:parseInt(item.number)
                    })
                    .then(response=> {

                    });
                });
                alert("修改成功！");
                this.getUngoing();
              }
            }
            else{
              alert("请选择菜品");
            }
            this.flag = false;
          },

          pay(){
            if(this.radio){
              this.expense=100;
            }
            else{
              this.expense=0;
            }
            this.$axios
            .post('/api/Canteen/payDishOrder',{
              order_id:this.order_id+'',
              order_date:this.order_date+'',
              expense:parseInt(this.expense)
            })
            .then(response=> {

            });
            this.tableData.forEach(item=>{
              item.number=0;
            });
            this.currentOrderState = 1;
            this.secondButtonText = "提交";
            sessionStorage.setItem("currentOrderState",1);
            this.getMenu();
            this.getCredit();
            this.expense=0;
            this.tableData = [];
            this.ungoingList = [];
            alert("支付成功！");
          }
        },
    }
</script>

<style>

  .creditText{
    z-index:5;
    position:absolute;
    top:90px;
    left:500px;
  }

  .creditOption{
    z-index:5;
    position:absolute;
    top:125px;
    left:500px;
  }

  .creditOption1{
    z-index:5;
    position:absolute;
    top:145px;
    left:610px;
  }

  .creditOption2{
    z-index:5;
    position:absolute;
    top:145px;
    left:660px;
  }

  .firstOrderButton{
    z-index:5;
    position:absolute;
    top:135px;
    left:710px;
  }

  .secondOrderButton{
    z-index:5;
    position:absolute;
    top:135px;
    left:790px;
  }

  .titleText{
    font-size: 25px;
    font-weight: 600;
  }
</style>
