//菜品管理
<template>
  <div class="app">
    
    <div class="menu">
      <div class="menu_title">
          <a style="color: #515A6E;">
            <li class="li2">
            <span>欢迎来到菜品管理页面！</span>
            </li>
            <!-- <li class="li" v-for="(item,index) in menu" :key="index" :class="{active: index ===  currentIndex}" @click='itemClick(index)'>
              <span>{{item.name}}</span>
            </li> -->
          </a>
              <div class="addDishButton">
                <el-button type="success" plain size="middle" style="height: 50px"  @click="addNewDish()">添加新菜品</el-button>
              </div>      
      </div>
    </div>

    <div style="padding: 0px 10.5%;">
      <div style="padding: 20px;">
        <el-row  :gutter="20">
          <!-- <el-col :span="4"> 一行放六个 -->
          <el-col :span="4" v-for="(item,index) in tableData" :key="index" :ref="'popover-' + index">
            <el-popover gutter="20" placement="bottom" title="菜品信息" width="300" trigger="click" v-model="item.visible">
              <p>菜品编号：{{item.dish_id}}</p>
              <p class="dishInformationTable">菜品名称：{{item.dish_name}}</p>
              <param name="菜品类型：" value="item.dish_type" valuetype="object"/>
              <p class="dishInformationTable">菜品价格：{{item.dish_price}}</p>
              <p class="dishInformationTable">菜品类型：{{item.dish_type[0]}}{{item.dish_type[1]}}{{item.dish_type[2]}}{{item.ingre_name[3]}}{{item.ingre_name[4]}}{{item.ingre_name[5]}}</p>
              <p class="dishInformationTable">菜品食材：{{item.ingre_name[0]}}{{item.ingre_name[1]}}{{item.ingre_name[2]}}{{item.ingre_name[3]}}{{item.ingre_name[4]}}{{item.ingre_name[5]}}</p>
              <div class="dishInformationButton">
                <el-button plain size="middle" @click="item.visible = false">返 回</el-button>
                <el-button type="primary" plain size="middle" @click="modifyThe()">修 改</el-button>
              </div>
              <div class="grid-content2 bg-dish" slot="reference">
                <div class="dishInformation">
                  <p class="dishInformationTable2">名称：{{item.dish_name}}</p>
                  <p class="dishInformationTable2">价格：{{item.dish_price}}</p>
                </div>
              </div>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog title="修改" :visible.sync="alterDishVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜品编号">
          <!-- <p style="width: 65%;">{{form.dish_id}}</p> -->
          <el-input placeholder="请输入菜品编号（字母+数字）" v-model="form.dish_id" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品编号不能为空'},]" ></el-input>
        </el-form-item>
        <el-form-item label="菜品名称">
          <el-input placeholder="请输入菜品名称（汉字）" v-model="form.dish_name" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品名称不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格">
          <el-input placeholder="请输入菜品价格（数字）" v-model="form.dish_price" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品价格不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="菜品类型">
          <el-input placeholder="请输入菜品类型（汉字）" v-model="form.dish_type" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品类型不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="菜品食材">
          <el-input placeholder="请输入菜品食材（汉字）" v-model="form.ingre_name" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品食材不能为空'},]"></el-input>
        </el-form-item>
         <p style="color:red;" class="empAdd-style">{{this.empAlter_hint}}</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button plain size="middle" @click="alterclose()">取 消</el-button>
      <el-button type="primary" plain size="middle" @click="checkAlter()">确 定</el-button>
     </span>
    </el-dialog>

   <el-dialog title="添加新菜品" :visible.sync="newDishVisible" width="30%">
      <el-form ref="form_add" :model="form" label-width="80px">
        <el-form-item label="菜品编号">
          <el-input placeholder="请输入菜品编号（字母+数字）" v-model="form.dish_id" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品编号不能为空'},]" ></el-input>
        </el-form-item>
        <el-form-item label="菜品名称">
          <el-input placeholder="请输入菜品名称（汉字）" v-model="form.dish_name" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品名称不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格">
          <el-input placeholder="请输入菜品价格（数字）" v-model="form.dish_price" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品价格不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="菜品类型">
          <el-input placeholder="请输入菜品类型（汉字）" v-model="form.dish_type" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品类型不能为空'},]"></el-input>
        </el-form-item>
        <el-form-item label="菜品食材">
          <el-input placeholder="请输入菜品食材（汉字）" v-model="form.ingre_name" clearable style="width: 65%;" :rules="[{ required: true, message: '菜品食材不能为空'},]"></el-input>
        </el-form-item>
         <p style="color:red;" class="empAdd-style">{{this.empAdd_hint}}</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="addClose()">取 消</el-button>
      <el-button type="primary" @click="checkAdd()">确 定</el-button>
     </span>
    </el-dialog>

  </div>
</template>

<script>
export default {

  // props:
  // {
  //   dish_type: object
  // },

  data () {
    return {
      reviewVisible: true,
      alterDishVisible: false,
      newDishVisible: false,
      currentIndex: 3,
      // dishTypeList = [],
      dish_type:[],
      dishClass:["","特色菜","主食","荤菜","素菜","经典小食","干锅类","家常小炒","群鲜荟萃","汤类","酒水饮料"],
      tableData:[],
      dishImage:[],
      form: {
        dish_id: '',
        dish_name: '',
        dish_price: '',
        dish_type: [],
        ingre_name: []
      },
      empAdd_hint:'',
      empAlter_hint:""
    }
  },

  mounted(){
        this.$axios
        .get("/api/Dish/getAllDishDetail", {params: { }})
        .then(response=> {
                this.tableData=response.data;
                this.tableData.dish_type=response.data.dish_type;
          })

    },
  methods: {
    // getArrayItem(dish_type)
    // {
    //   num=-1;
    //   while(dish_type[++num]!="")
    //   {
    //     item.dish_type[num];
    //   }
    // },

    itemClick(index) {
      this.currentIndex = index;
      this.$emit('tabClick', index)
    },
    // eslint-disable-next-line no-unused-vars
    modifyThe() {
      this.alterDishVisible = true;
      visible = false;
    },
    addNewDish() {
      this.newDishVisible = true;
      // visible = false;
    },
    alterclose() {
      this.form = {};
      this.alterDishVisible = false;
      this.empAlter_hint='';
    },
    addClose() {
      this.form = {};
      this.newDishVisible = false;
      this.empAdd_hint='';
    },
    // onSubmit() {
    //   this.form = {};
    //   this.alterDishVisible = false;
    // },

    alterDishConfirm(){
      var reg=/\s+/;
      var dish_type3=this.form.dish_type.split(reg);
      var ingre_name3=this.form.ingre_name.split(reg);
      this.$axios
        .post('/api/Dish/setDish',{
            dish_id: this.form.dish_id+'',
            dish_name: this.form.dish_name+'',
            dish_price:parseInt(this.form.dish_price),
            dish_type:dish_type3,
            ingre_name:ingre_name3
        })
        .then(response=> {
          console.log("请求成功");
          console.log(response.data);
          switch(response.data){
            case 0:
              alert("不存在菜品，修改失败！");
              break;
            case 1:
              alert("修改成功！");
              this.form = {};
              this.alterDishVisible = false;
              //直接空着不写可能会失败，但是先打个空格再删去能够成功
              // this.tableData=[];
              // this.tableData.push({
              //    dish_id: this.form.dish_id+'',
              //    dish_name:this.form.dish_name+'',
              //    dish_price: parseInt(this.form.dish_price),
              //    ingre_name:[this.form.ingre_name],
              //    dish_type:[this.form.dish_type]
              //    });
              break;
            case -1:
              alert("连接错误！");
              break;
          }
        })
         .catch((error) => {
          console.log("请求失败");
          console.log(error);
          alert("请求失败!");
        })
    },
    checkAlter(){
    if( this.form.dish_id==''||this.form.dish_name==''||this.form.dish_price==''||this.form.dish_type==''||this.form.ingre_name=='')
    {
      this.empAlter_hint='*输入不能为空！';
      return ;
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.dish_id)===true)
    {
      this.empAlter_hint="*菜品编号中不含有汉字！"
      return;
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.dish_name)===false)
    {
      this.empAlter_hint="*菜品名称由汉字组成！"
      return;
    }
    if(/^[0-9]*$/.test(this.form.dish_price)===false)
      {
        this.empAlter_hint="*菜品价格由数字组成！"
        return;
      }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.dish_type)===false)
    {
      this.empAlter_hint="*菜品类型由汉字组成！"
      return;
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.ingre_name)===false)
    {
      this.empAlter_hint="*菜品食材由汉字组成！"
      return;
    }
    this.empAlter_hint=""
    this.alterDishConfirm()
  },

    addDishConfirm(){
      var reg=/\s+/;
      var dish_type2=this.form.dish_type.split(reg);
      var ingre_name2=this.form.ingre_name.split(reg);
      this.$axios
        .post('/api/Dish/addDish',{
            dish_id: this.form.dish_id+'',
            dish_name: this.form.dish_name+'',
            dish_price:parseInt(this.form.dish_price),
            dish_type:dish_type2,
            ingre_name:ingre_name2
        })
        .then(response=> {
          switch(response.data){
            case 0:
              alert("已存在菜品，添加失败！");
              break;
            case 1:
              alert("添加成功！");
              this.form = {};
              this.newDishVisible = false;
              // this.tableData=[];
              // this.tableData.push({
              //    dish_id: this.form.dish_id+'',
              //    dish_name:this.form.dish_name+'',
              //    dish_price: parseInt(this.form.dish_price),
              //    dish_type:[this.form.dish_type],
              //    ingre_name:[this.form.ingre_name]
              //  });
              break;
            case -1:
              alert("连接错误！");
              break;
            case -2:
              alert("id不合规范！（请输入A-Z的字母来指示菜品类型，例如：M:meat,V:vegetable,S:soup,C:表示其他）");
              break;
          }
        })
    },
    checkAdd(){
    if( this.form.dish_id==''||this.form.dish_name==''||this.form.dish_price==''||this.form.dish_type==''||this.form.ingre_name=='')
    {
      this.empAdd_hint='*输入不能为空！';
      return ;
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.dish_id)===true)
    {
      this.empAdd_hint="*菜品编号中不含有汉字！"
      return;
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.dish_name)===false)
    {
      this.empAdd_hint="*菜品名称由汉字组成！"
      return;
    }
    if(/^[0-9]*$/.test(this.form.dish_price)===false)
      {
        this.empAdd_hint="*菜品价格由数字组成！"
        return;
      }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.dish_type)===false)
    {
      this.empAdd_hint="*菜品类型由汉字组成！"
      return;
    }
    if(/^[\u4e00-\u9fa5]*$/.test(this.form.ingre_name)===false)
    {
      this.empAdd_hint="*菜品食材由汉字组成！"
      return;
    }
    this.empAdd_hint="";
    this.addDishConfirm();
  },
  }
}
</script>

<style scoped>


html,body,.app{
  height: 100%;
  background-color: #EFF3F5;
}
.menu {
  width: 100%;
  height: 80px;
  background-color: white;
}
.menu_title {
  padding: 0px 10.5%;
}
.ul .li {
  display:inline;
  font-size: 15px;
  line-height: 80px;
  float: left;
  padding: 0px 22px;
}
 .li2 {
  margin-left: 40%;
  display:inline;
  font-size: 20px;
  line-height: 80px;
  float:left;
  padding: 0px 0px;
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}

.bg-purple-dark {
  background: #99a9bf;
}
.bg-dish {
  background: rgba(255, 165, 0, 0.5);
  font-size:unset;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content2 {
  position: relative;
  border-radius: 5px;
  min-height: 130px;
  box-shadow:5px 5px 10px gray;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.active {
  color: #3D7EFF;
  border-bottom: 2px solid #3D7EFF;
}
.dishInformation {
  position: absolute;
  left:0px;
  right:0px;
  bottom: 0px;
  background-color:ivory;
  padding:5%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.dishInformationTable {
  padding-top: 5px;
}
.dishInformationTable2 {
  font-size:15px;
  margin:2% 1%;
}
.dishInformationButton {
  padding-top: 10px;
  text-align: center;
}
.addDishButton {
  padding-left: 980px;
  padding-top: 15px;
  text-align: center;
}
.empAdd-style,.empAdd-style{
  text-align: center;
}
</style>
