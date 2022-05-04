<template>
    <div>
        <p>订单ID: {{order_id}}</p>
        <div>
            <el-table
            :data="dishList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
            :height="currentHeight"
            :row-style="{height: '40px'}"
            stripe border
            style="width: 100%">
                <el-table-column
                prop="dish_name"
                label="菜名"
                height="40"
                width="180">
                </el-table-column>
                <el-table-column
                prop="dish_price"
                label="单价"
                height="40"
                width="180">
                </el-table-column>
                <el-table-column
                prop="dish_num"
                label="数量"
                height="40">
                    <template slot-scope="scope">
                        <el-input-number
                        v-model="scope.row.dish_num"
                        @change="handleChange(scope.row)"
                        :min='0'>
                        </el-input-number>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            
            :page-sizes="[5,10]"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next"
            :total="dishList.length">
            </el-pagination>
        </div>
        <p><el-button type="primary" @click="orderSubmit()">添加菜品</el-button></p>
    </div>
</template>
<script>
export default {
    mounted(){
        this.order_id = sessionStorage.getItem("order_id_zpw");
        this.$axios.get('/api/Canteen/dishInfo',
        {
            params:{}
        })
        .then(response=>{
            console.log(response);
            this.dishList = response.data;
        })
    },
    data() {
        return {
            input: '',
            currentPage: 1, // 当前页码
            total: 0, // 总条数
            PageSize: 10,
            currentHeight:522,
            dishList:[]
        }
    },
    methods:{
        handleChange(value) {
            console.log(value);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        handleSizeChange(val){
            this.currentPage = 1;
            this.PageSize = val;
            if(val==5)
                this.currentHeight=285;
            else if(val == 10)
                this.currentHeight=522;
        },
    }
}
</script>


<style>
</style>