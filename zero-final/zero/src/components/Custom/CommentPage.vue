<template>
  <div>
    <el-container>
      <el-main>
        <el-card class="comments">
          <el-rate
            v-model="value"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
          <br/>
          <table>
            <tbody>
              <tr v-for="(comment,index) in tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)" :key="index">
                <div class="tableTitle"><span class="midText"></span></div>
                <el-descriptions :column="4" :colon=false>
                  <el-descriptions-item>
                    {{comment.customer_id}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    {{comment.evaluation_time}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <el-rate
                      :value="comment.evaluation_score"
                      type="number"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <div v-if="comment.customer_id==userID">
                      <el-button
                      type="danger" 
                      icon="el-icon-delete" 
                      size="mini"
                      circle 
                      @click="cmtDel(comment.evaluation_time)">
                      </el-button>
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <img style="width:80px;height:80px;margin-top:15px;margin-left:10px;" :src="'data:image/jpeg;base64,'+picture[(currentPage-1)*PageSize+index]">
                  </el-descriptions-item>
                  <el-descriptions-item>
                    {{comment.evaluation_text}}
                  </el-descriptions-item>
                </el-descriptions>
              </tr>
            </tbody>
          </table>
          <div class="tableTitle"><span class="midText"></span></div>
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="PageSize"
            layout="total,prev, pager, next"
            :total="tableData.length">
          </el-pagination>
        </el-card>
        <el-card class="submit">
          <el-rate v-model="vsub"></el-rate>
          <br/>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            maxlength="150"
            show-word-limit>
          </el-input>
          <br/><br/>
          <el-button type="primary" @click="addEvaluation()">评论</el-button>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'CommentPage',
  props:['userID'],
  data () {
    return {
      value: 0,
      vsub:0,
      PageSize: 5,
      currentPage: 1,
      comment:{"customer_id": '',"evaluation_time": '',"evaluation_text": '',"evaluation_score": 0},
      tableData:[],
      selection:[],
      options:[{value:1,label:1},{value:2,label:2},{value:3,label:3},{value:4,label:4},{value:5,label:5}],
      textarea:'',
      picture:[]
    }
  },
  mounted(){
    this.getComment();
  },

  methods: {
    getComment(){
      this.$axios.get('/api/Evaluation/getEvaluation',{params:{}})
      .then(response=>{
        this.tableData=response.data;
        var cnt = 0, ttl = 0;
        for (var i = 0; i < this.tableData.length; i++) { 
          ++cnt;
          ttl+=this.tableData[i].evaluation_score;
          this.getIcon(this.tableData[i].customer_id,i);
        }
        this.value = ttl/cnt;
        this.value = this.value.toFixed(1);
      })
    },
    filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
    },
    addEvaluation()
    {
      this.$axios
        .post('/api/Evaluation/addEvaluation',{
          customer_id:this.userID,
          evaluation_text: this.textarea,
          evaluation_score: this.vsub
        })
        .then(response=> {
          this.textarea = '';
          this.vsub=0;
          switch(response.data){
            case 1:
              this.$message("评论成功");
              this.getComment();
              break;
            case -1:
              this.$message("连接失败");
              break;
          }
        });
    },
    cmtDel(val)
    {
      this.$axios
        .post('/api/Evaluation/deleteEvaluation',{
          customer_id:this.userID,
          evaluation_time:val
        })
        .then(response=> {
          switch(response.data){
            case 1:
              this.$message("删除成功");
              this.getComment();
              break;
            case 0:
              this.$message("不存在评论");
              break;
            case -1:
              this.$message("连接失败");
              break;
          }
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getIcon(val,index)
    {
      this.$axios
        .get('/api/Customer/getCustomerPict',{params:{customer_id:val}})
        .then(response=> {
          //if(!this.picture[this.tableData[i].customer_id])
          //this.picture[index] = response.data;
          this.$set(this.picture,index,response.data);
        });
    }
  }
}
</script>

<style scoped>
  .orderDiv{
    height:95%;
  }

  .selectBar{
    position:relative;
    left:150px;
    top: 20px;
    height:500px;
    width:150px;
  }

  .dishMain{
    position:relative;
    height:530px;
    width:960px;
  }
  .el-footer {
    position: fixed;
    width: 1480px;
    height: 400px;
    bottom: 120px
  }
  .tableTitle {
    position: relative;
    margin: 0 auto;
    width: 1400px;
    height: 1px;
    background-color: #d4d4d4;
    text-align:left;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }
  
</style>
