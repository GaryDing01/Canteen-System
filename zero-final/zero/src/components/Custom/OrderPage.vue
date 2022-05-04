<template>
  <div class="orderDiv">

    <el-card class="table">
      <div class="tableText">餐桌号</div>
    </el-card>

    <el-select class="tableSelector" 
      v-model="orderTable" 
      placeholder="选择"
      @change="selectTable()"
      :disabled="this.userID==-1">
      <el-option
        v-for="item in tableList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <el-card class="selectBar">

      <nav class="shell">
        <ul class="options">
          <li><a href="#" class="lisa" :class={chosen:isChosen[0]} @click="classSwitch(0)">全部</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[1]} @click="classSwitch(1)">特色菜</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[2]} @click="classSwitch(2)">主食</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[3]} @click="classSwitch(3)">荤菜</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[4]} @click="classSwitch(4)">素菜</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[5]} @click="classSwitch(5)">经典小食</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[6]} @click="classSwitch(6)">干锅类</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[7]} @click="classSwitch(7)">家常小炒</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[8]} @click="classSwitch(8)">群鲜荟萃</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[9]} @click="classSwitch(9)">汤类</a></li>
          <li><a href="#" class="lisa" :class={chosen:isChosen[10]} @click="classSwitch(10)">酒水饮料</a></li>
        </ul>
      </nav>

    </el-card>

    <el-card class="dishMain">
      <!-- <p>menu:{{menuList}}</p> -->
      <!-- <p>show:{{showList}}</p> -->
      <!-- <p>cart:{{cartList}}</p> -->
      <!-- <p>{{dishCount}}</p> -->
      <!-- <p>{{tableList}}</p> -->
      <!-- <p>{{orderTable}}</p> -->
      <!-- {{picture}} -->
      <ul class="dishOptions">
        <li class="dishLis" v-for="dish in showList" :key="dish.dish_id">
          <div class="dishDiv">
            <img style="width:160px;height:160px;margin-top:15px;margin-left:10px;" :src="'data:image/jpeg;base64,' + picture[dish.dish_id]">
            <p class="dishNameText">{{dish.dish_name}}</p>
            <p class="dishPriceText">{{dish.dish_price}}元</p>

            <el-button 
            class="plusButton"
            circle 
            icon="el-icon-plus" 
            size="mini"
            @click="plusDish(dish.dish_id)"></el-button>

            <el-button v-if="dish.dish_num!=0" 
            class="minusButton"
            circle 
            icon="el-icon-minus" 
            size="mini"
            @click="minusDish(dish.dish_id)">
            </el-button>

            <div class="dishNumText" v-if="dish.dish_num!=0">{{dish.dish_num}}</div>

          </div>
        </li>
      </ul>
    </el-card>

    <el-card class="expenseHint">
      <div class=""><div class="expenseText">小计：{{expense}}元</div></div> 
    </el-card>

    <el-badge v-if="dishCount>0" :value="dishCount" class="item"></el-badge>


    <el-button class="cartButton" @click="toCart()" type="warning">
      <i class="el-icon-shopping-cart-2"></i>
      <el-divider direction="vertical"></el-divider>
      去提交
    </el-button>

    <div v-if="showCart">
      <!-- 遮罩 -->
      <div class="mask" @click="showCart=false"></div>

      <!-- 订单预览 -->
      <el-card class="cartList">
        <el-empty v-if="expense==0" description="您还没有选购菜品哦"></el-empty>
        <ul class="cartOptions">
          <li class="cartLis" v-for="dish in cartList" :key="dish.dish_id">
            <div class="cartDiv">
              <img style="width:90px;height:90px;margin-top:20px;margin-left:20px;" :src="'data:image/jpeg;base64,' + picture[dish.dish_id]">
              <p class="cartNameText">{{dish.dish_name}}</p>
              <p class="cartPriceText">{{dish.dish_price}}元</p>

              <el-button 
              class="cartPlusButton"
              circle 
              icon="el-icon-plus" 
              size="mini"
              @click="plusDish(dish.dish_id)"></el-button>

              <el-button v-if="dish.dish_num!=0" 
              class="cartMinusButton"
              circle 
              icon="el-icon-minus" 
              size="mini"
              @click="minusDish(dish.dish_id)">
              </el-button>

              <div class="cartNumText" v-if="dish.dish_num!=0">{{dish.dish_num}}</div>

            </div>
          </li>
        </ul>
        <!-- <div style="height:150px"></div> -->
      </el-card>

      <!-- 支付选项 -->
      <el-card class="payCard">
        <p style="font-weight:900;font-size:21px">订单详情</p>
        <p>订单日期：{{tempOrder.order_date}}</p>
        <p>用餐桌号：{{tempOrder.table_id}}</p>
        <p>订单编号：{{tempOrder.order_id}}</p>
        <p>创建用户：{{tempOrder.customer_id}}</p>
        <el-divider></el-divider>
        <p>菜品数目：{{dishCount}}</p>
        <p>总价：{{expense}}元</p>
        <el-divider></el-divider>
        <p style="font-weight:600">本单可使用优惠：</p>
        <p style="left:30px">您当前拥有的积分：{{curCredit}}</p>
        <!-- <el-radio-group v-model="useCredit"> -->
        <p><el-radio style="left:30px" v-model="useCredit" :label=20 :disabled="expense<20 || curCredit<20">使用20积分抵扣10元</el-radio></p>
        <p><el-radio style="left:30px" v-model="useCredit" :label=100 :disabled="expense<100 || curCredit<100">使用100积分抵扣50元</el-radio></p>
        <p><el-radio style="left:30px" v-model="useCredit" :label=0>不使用积分</el-radio></p>
        <!-- </el-radio-group> -->
        <p style="color:red;font-size:5px">注意：积分最多只能抵扣总价的一半哦！</p>
        <el-divider></el-divider>
        <p style="font-weight:900;font-size:18px">实付价格：{{expense-useCredit*0.5}}元</p>
        <p style="color:red;font-size:5px">支付成功这笔订单将获得{{((expense-useCredit*0.5)-(expense-useCredit*0.5)%10)/10}}积分</p>
        <el-button class="payButton" type="success" @click="pay()" :disabled="expense==0">支付</el-button>
      </el-card>

    </div>

  </div>
</template>

<script>
export default {

  name: 'OrderPage',

  props:['userID'],

  mounted(){
    Promise.all([
      this.getMenu(),
      this.getTempOrder(),
      this.getTable(),
      this.getCredit(),
      this.getPicture()
      ])
    .then(response=>{
      this.temperToMenu();
      this.getDishCount();
      this.classSwitch(0);
      this.changeShowList(0);
    });
  },

  data () {
    return {
      menuList:[],
      showList:[],
      cartList:[],
      tableList:[],
      tempOrder:{},
      picture:[],
      orderTable:"",
      useCredit: 0,
      curCredit: 0,
      dishCount:0,
      expense:0,
      showCart:false,
      isChosen:[true,false,false,false,false,false,false,false,false,false,false],
      dishClass:["","特色菜","主食","荤菜","素菜","经典小食","干锅类","家常小炒","群鲜荟萃","汤类","酒水饮料"]
    }
  },

  watch:{

    userID(val){
      if(val==-1){
        Promise.all([
        this.getMenu(),
        this.getTable()])
        .then(response=>{
          this.tempOrder = {};
          this.orderTable = null;
          this.changeShowList(0);
          this.expense = 0;
          this.dishCount = 0;
        });
        return;
      }
      Promise.all([
        this.getMenu(),
        this.getTempOrder(),
        this.getTable(),
        this.getCredit()])
      .then(response=>{
        this.temperToMenu();
        this.getDishCount();
        this.classSwitch(0);
        this.changeShowList(0);
      });
    },

  },

  methods:{

    classSwitch(val){//分类切换
      for (var i=0 ; i<this.isChosen.length ; i++){
        if (i==val){
          this.$set(this.isChosen,val,true);
          continue;
        }
        this.$set(this.isChosen,i,false);
      }
      this.changeShowList(val);
    },

    getMenu(){//获取菜单
      return new Promise((resolve,reject)=>{
        this.$axios
        .get('/api/Dish/getAllDish',{params:{}})
        .then(response=> {
          this.menuList = response.data;
          this.menuList.forEach(dish=>{
            dish.dish_num = 0;
          });
          resolve('menuSuccess');
        });
      });
    },

    getPicture(){//获取图片
      return new Promise((resolve,reject)=>{
        this.$axios
        .get('/api/Dish/getAllDishPict')
        .then(response=> {
          this.picture = response.data;
          console.log(response.data);
          resolve('pictureSuccess');
        });
      });
    },

    getTable(){//获取餐桌
      return new Promise((resolve,reject)=>{
        this.$axios
        .get('/api/Dining_table/getAllEmptyTable',{params:{}})
        .then(response=> {
          this.tableList=[];
          response.data.forEach(table=>{
            this.tableList.push({value:table.table_id,label:table.table_id});
            resolve("tableSuccess");
          });
        });
      });
    },

    getCredit(){//获取积分
      return new Promise((resolve,reject)=>{
        if(this.userID==-1){
          resolve("noCustom");
        }
        else{
          this.$axios
          .get('/api/Customer/getCredit',{params:{
            customer_id: this.userID
          }})
          .then(response=> {
            this.curCredit = response.data;
            resolve("creditSuccess");
          });
        }
      });
    },

    selectTable(){
      this.submitTempOrder();
      Promise.all([
        this.getTable()]);
    },

    changeShowList(val){
      this.showList = [];
      if(val==0){
        this.menuList.forEach(menuDish=>{
          this.showList.push(menuDish);
        });
        return;
      }
      this.menuList.forEach(menuDish=>{
        menuDish.dish_type.forEach(type=>{
          if(type==this.dishClass[val]){
            this.showList.push(menuDish);
          }
        });
      });
    },

    getTempOrder(){//获取暂存订单
      return new Promise((resolve,reject)=>{
        if(this.userID==-1){
          resolve("noCustom");
        }
        else{
          this.$axios
            .get('/api/Dish_order/getTemporaryOrder',{
              params:{
                customer_id:this.userID
              }})
            .then(response=> {
              this.orderTable = response.data.table_id;
              this.expense = response.data.expense;
              this.cartList = response.data.chosen_dish;
              if(this.cartList.length>0){
                this.$message("已为您加载上次未提交的订单");
              }
              resolve("cartSuccess");
            })
        }
      });
    },

    getTempOrderNoMessage(){//获取暂存订单
      return new Promise((resolve,reject)=>{
        if(this.userID==-1){
          resolve("noCustom");
        }
        else{
          this.$axios
            .get('/api/Dish_order/getTemporaryOrder',{
              params:{
                customer_id:this.userID
              }})
            .then(response=> {
              this.orderTable = response.data.table_id;
              this.expense = response.data.expense;
              this.cartList = response.data.chosen_dish;
              resolve("cartSuccess");
            })
        }
      });
    },

    getTempOrderFunction(){
      return new Promise((resolve,reject)=>{
        if(this.userID==-1){
          resolve("noCustom");
        }
        else{
          this.$axios
            .get('/api/Dish_order/getTemporaryOrder',{
              params:{
                customer_id:this.userID
              }})
            .then(response=> {
              this.tempOrder = response.data;
              this.tempOrder.chosen_dish = [];
              resolve("cartSuccess");
            })
        }
      });
    },

    temperToMenu(){//同步暂存订单
      this.cartList.forEach(cartDish=>{
        this.menuList.forEach(menuDish=>{
            if(menuDish.dish_id==cartDish.dish_id){
              menuDish.dish_num = cartDish.dish_num;
            }
          }
        )
      });
    },

    getDishCount(){
      this.dishCount=0;
      this.cartList.forEach(dish=>{
        this.dishCount += parseInt(dish.dish_num);
      });
    },

    minusDish(val){
      this.menuList.forEach(dish=>{
        if(dish.dish_id==val){
          if(dish.dish_num>0){
            dish.dish_num--;
            if(dish.dish_num==0){
              for(var i=0;i<this.cartList.length;i++){
                if (this.cartList[i].dish_id == val){
                  break;
                }
              }
              this.cartList.splice(i,1);
            }
            else{
              this.cartList.forEach(tempDish=>{
                if(tempDish.dish_id==val){
                  tempDish.dish_num = dish.dish_num;
                }
              });
            }
          }
          this.submitTempOrder();
          this.dishCount--;
          this.expense = this.expense-dish.dish_price;
          return;
        }
      });
    },

    plusDish(val){
      if(this.userID==-1){
        this.$message("请登录后再进行点餐哦");
        return;
      }
      if(this.orderTable==null){
        this.$message("请选择好餐桌号再进行点餐哦");
        return;
      }
      this.menuList.forEach(dish=>{
        if(dish.dish_id==val){
          dish.dish_num++;
          if(dish.dish_num==1){
            this.cartList.push(dish);
          }
          else{
            this.cartList.forEach(tempDish=>{
              if(tempDish.dish_id==val){
                tempDish.dish_num = dish.dish_num;
              }
            });
          }
          this.submitTempOrder();
          this.dishCount++;
          this.expense = this.expense+dish.dish_price;
          return;
        }
      });
    },

    submitTempOrder(){//提交暂存订单
      if(this.userID==-1){
        return;
      }
       this.$axios
        .post('/api/Dish_order/saveOrder',{
            customer_id: this.userID+'',
            table_id: this.orderTable+'',
            chosen_dish:this.menuList
        })
        .then(response=> {
          
        });
    },

    toCart(){
      if(this.userID==-1){
        this.$message("请登录后再进行点餐哦");
        return;
      }
      if(this.expense==0){
        this.$message("您的购物车里还没有菜品哦");
        return;
      }
      Promise.all([
        this.getTempOrderFunction()])
      .then(response=>{
        this.temperToMenu();
        this.getDishCount();
        this.showCart = true;
        this.useCredit = 0;
      });
    },

    toSubmit(){
      if(this.userID==-1){
        this.$message("请登录后再进行点餐哦");
        return;
      }
      this.$router.push({name:"PayPage"});
    },

    payOrder(){
      return new Promise((resolve,reject)=>{
        this.$axios
        .post('/api/Dish_order/payOrder',{
          customer_id: this.userID,
          credit: this.useCredit
        })
        .then(response=> {
          resolve('paySuccess');
        });
      });
    },

    pay(){
      Promise.all([
        this.payOrder()])
      .then(response=>{
        this.showCart = false;
        this.$message("支付成功！");
        Promise.all([
          this.getMenu(),
          this.getTempOrderNoMessage(),
          this.getTable(),
          this.getCredit()])
        .then(response=>{
          this.temperToMenu();
          this.getDishCount();
          this.classSwitch(0);
          this.changeShowList(0);
          this.$bus.$emit("getCusInfo");
        });
      });
    }
    
  }
}
</script>

<style scoped>

  .mask {
    background-color: rgb(0, 0, 0);
    opacity: 0.8;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 8;
  }

  /* .orderDiv{
    
  } */

  /* 导航栏 */
  .selectBar{
    position:relative;
    left:150px;
    top: -30px;
    /* height:500px; */
    width:150px;
  }

  .options{
    list-style-type: none;  
    text-align: center;
    margin-left: -58px;
    width: 150px;
  }

  .lisa{
    position: relative;
    display: block;
    text-align: center;
    color: #262626;
    font-size: 20px;
    text-decoration: none;
    text-transform: uppercase;
    transition: .5s;
    padding: 15px 10px;
  }

  .lisa:hover{
    color:#262626;
    background-color: #a8eeff65;
    border-radius: 7px;
  }

  .chosen{
    color:#262626;
    background-color: #a8eeff;
    border-radius: 5px;
  }

  /* 餐桌选择 */
  .table{
    position: relative;
    left: 150px;
    top: 0px;
    width: 60px;
    height: 38px;
  }

  .tableText{
    position: relative;
    left: -13px;
    top: -13px;
    width:100px;
    font-weight: 600;
  }

  .tableSelector{
    position: relative;
    left: 220px;
    top: -40px;
    width: 82px;
  }

  /* 主体 */
  .dishMain{
    position:relative;
    left:320px;
    top: -773px;
    /* height:530px; */
    width:960px;
  }

  .dishLis{
    list-style: none;
    float: left;
    margin: 12px;
  }

  .dishDiv{
    width:180px;
    height:250px;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.137);
    background-color: rgb(241, 251, 252, 0.3);
  }

  .dishNameText{
    position: relative;
    font-weight: 900;
    left: 10px;
    top: 0px;
  }

  .dishPriceText{
    position: relative;
    left: 10px;
    top: -10px;
  }

  .minusButton{
    position: relative;
    left: 40px;
    top: -60px;
    z-index:3;
  }

  .dishNumText{
    position: relative;
    left: 120px;
    top: -85px;
    z-index:2;
  }

  .plusButton{
    position: relative;
    left: 140px;
    top: -60px;
    z-index:3;
  }

  /* 购物车 */
  .shoppingCart{
    position: fixed;
    width: 1200px;
    height: 125px;

    left: 125px;
    bottom: -50px;

    background-color: rgb(227, 248, 151);

    border-top:4px solid rgba(180, 178, 178, 0.836);
    border-radius: 25px;
    box-sizing: border-box;

    z-index: 10;
  }

  .submitBack{
    position: relative;
    width:70px;
    top:20px;
    left:1090px
  }

  .expenseHint{
    position:fixed;
    width:116px;
    height:38px;
    left:1320px;
    top:600px;
    z-index:6;
  }

  .expenseText{
    position: relative;
    width: 200px;
    left: -8px;
    top: -10px;
    font-size: 15px;
  }

  .cartButton{
    position:fixed;
    width:120px;
    height:40px;
    left:1320px;
    top:650px;
    z-index:6;
  }

  /* .submitButton{
    position:fixed;
    width:120px;
    height:40px;
    left:1310px;
    top:700px;
    z-index:10;
  } */

  .item{
    position: fixed;
    left: 1313px;
    top: 645px;
    z-index: 7;
  }

  /* 购物车选菜预览 */

  .cartList{
    position:fixed;
    width:580px;
    height:700px;
    top:25px;
    left:260px;
    z-index:9;
    overflow-y:auto;
  }

  .cartLis{
    list-style: none;
    margin: 12px;
  }

  .cartDiv{
    height:130px;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.137);
    background-color: rgb(241, 251, 252, 0.3);
  }

  .cartNameText{
    position: relative;
    font-weight: 900;
    left: 150px;
    top: -100px;
  }

  .cartPriceText{
    position: relative;
    left: 150px;
    top: -90px;
  }

  .cartNumText{
    position: relative;
    left: 390px;
    top: -180px;
    z-index:2;
  }

  .cartMinusButton{
    position: relative;
    left: 300px;
    top: -156px;
    z-index:3;
  }

  .cartPlusButton{
    position: relative;
    left: 420px;
    top: -156px;
    z-index:3;
  }

  /* 购物车支付详情 */
  .payCard{
    position:fixed;
    width:380px;
    height:700px;
    top:25px;
    left:900px;
    z-index:9;
  }

  .payButton{
    position: relative;
    left: 250px;
    top: -50px;
  }

</style>
