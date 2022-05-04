import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'

import CustomLoginPage from '@/components/CustomAccount/CustomLoginPage'
import CustomRegisterPage from '@/components/CustomAccount/CustomRegisterPage'
import CustomUpdatePasswordPage from '@/components/CustomAccount/CustomUpdatePasswordPage'

import ReservationPage from '@/components/Reservation/ReservationPage'
import CustomPage from '@/components/Reservation/CustomPage'
import CustomInformationPage from '@/components/Reservation/CustomInformationPage'
import ReservationInformationPage from '@/components/Reservation/ReservationInformationPage'
import AllReservationPage from '@/components/Reservation/AllReservationPage'

import EmployeeLoginPage from '@/components/EmployeeAccount/EmployeeLoginPage'

import CustomShowPage from '@/components/Show/CustomShowPage'

//进入员工操作页面
import StaffEnter from '@/components/Enter/StaffEnter'

//个人信息
import EPersonalInfo from '@/components/People/EPersonalInfo'
import EChangePwd from '@/components/People/EChangePwd'
import EChangePwd_test from '@/components/People/EChangePwd_test'

//会员
import VIP1 from '@/components/People/VIP1'
import VIP2 from '@/components/People/VIP2'
import VIP00 from '@/components/People/VIP00'
import VIP200 from '@/components/People/VIP200'
import VIPmessage from '@/components/People/VIPmessage'

//员工管理
import StaffOverall from '@/components/People/StaffOverall'
import StaffSearch from '@/components/People/StaffSearch'
import StaffRewrite from '@/components/People/StaffRewrite'

//员工（旧版本）
import Employee2 from '@/components/People/Employee2'
import Employee2_add from '@/components/People/Employee2_add'
import Employee2_delete from '@/components/People/Employee2_delete'
import Employee2_update from '@/components/People/Employee2_update'

//员工（新版本）
import StaffManagement from '@/components/People_new/StaffManagement'
import SidePer from '@/components/People_new/SidePer'
import AllManagement from '@/components/People_new/AllManagement'
import SalaryManagement from '@/components/People_new/SalaryManagement'

//工资
import SalaryOverall from '@/components/Salary/SalaryOverall'
import SalaryRewrite from '@/components/Salary/SalaryRewrite'
import Money_Add from '@/components/Salary/Money_add'
import Money_Delete from '@/components/Salary/Money_delete'
import Money_Update from '@/components/Salary/Money_update'

//餐桌
import Table1 from '@/components/Admin/Table1'
import Table2 from '@/components/Admin/Table2'
import Table3 from '@/components/Admin/Table3'
import Table4 from '@/components/Admin/Table4'

//餐桌（新）
import NewTable1 from '@/components/NewAdmin/NewTable1'
import AvailableTable from '@/components/NewAdmin/AvailableTable'

//菜单
import Dish1 from '@/components/Admin/Dish1'
import Dish2 from '@/components/Admin/Dish2'
import Dish3 from '@/components/Admin/Dish3'

//菜单（新）
import NewDish1 from '@/components/NewAdmin/NewDish1'

//订单
import Ongoing from '@/components/Orders/Ongoing'
import History from '@/components/Orders/History'

//流水
import StatementManage from '@/components/Statement/StatementManage'

//食材
import AddIngredientInventory from '@/components/Ingredient/AddIngredientInventory'
import setUpdateIngredient from '@/components/Ingredient/setUpdateIngredient'
import CRUD_Ingredient from '@/components/Ingredient/CRUD_Ingredient'

//器材
import AddUtensilInventory from '@/components/Utensil/AddUtensilInventory'
import InquireUtensilInformation from '@/components/Utensil/InquireUtensilInformation'
import ModifyUtensilInventory from '@/components/Utensil/ModifyUtensilInventory'
import ViewAllUtensil from '@/components/Utensil/ViewAllUtensil'
import CRUD_Utensil from '@/components/Utensil/CRUD_Utensil'

//顾客点菜
import Ordering from '@/components/Customer/Ordering'
import Order from '@/components/Customer/Order'

//测试
import test_p from '@/components/People_new/test_p'
import test_p2 from '@/components/People_new/test_p2'

//设置部分
import Calendar from '@/components/Setting/Calendar'
import Global from '@/components/Setting/Global'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },

    {
      path: '/CustomAccount/CustomLoginPage',
      name: 'CustomLoginPage',
      component: CustomLoginPage
    },
    {
      path: '/CustomAccount/CustomRegisterPage',
      name: 'CustomRegisterPage',
      component: CustomRegisterPage
    },

    {
      path: '/EmployeeAccount/EmployeeLoginPage',
      name: 'EmployeeLoginPage',
      component: EmployeeLoginPage
    },

    {
      path: '/Reservation/CustomPage',
      name: 'CustomPage',
      component: CustomPage,
      children:[
        {
          path:'/Reservation/ReservationPage',
          name: 'ReservationPage',
          component: ReservationPage
        },
        {
          path:'/Reservation/CustomInformationPage',
          name: 'CustomInformationPage',
          component: CustomInformationPage
        },
        {
          path:'/Reservation/ReservationInformationPage',
          name: 'ReservationInformationPage',
          component: ReservationInformationPage
        },

        {
          path: '/CustomAccount/CustomUpdatePasswordPage',
          name: 'CustomUpdatePasswordPage',
          component: CustomUpdatePasswordPage
        },

        {
          path: '/Show/CustomShowPage',
          name: 'CustomShowPage',
          component: CustomShowPage
        },
        //顾客点菜
        {
          path:'/Ordering',
          component:Ordering
        },
        {
          path:'/Order',
          component:Order
        },
        {
          path: '/Ordering/:order_id',
          component: Ordering,
          props: {default:true}
        },
        {
          path: '/Ordering/:order_date',
          component: Ordering,
          props: {default:true}
        },
        {
          path: '/Ordering/:table_id',
          component: Ordering,
          props: {default:true}
        },
      ]
    },

    {
      path: '/StaffEnter',
      name:'StaffEnter',
      component: StaffEnter,
      children:[
        //个人信息
        {
          path:'/EPersonalInfo',
          component:EPersonalInfo
        },
        {
          path:'/EChangePwd',
          component:EChangePwd
        },
        {
          path:'/EChangePwd_test',
          component:EChangePwd_test
        },
        //会员
        {
          path:'/VIP1',
          component:VIP1
        },
        
        {
          path:'/VIP2',
          component:VIP2,
        },

        {
          path:'/VIP00',
          component:VIP00,
        },
        {
          path:'/VIP200',
          component:VIP200,
        },
        {
          path:'/VIPmessage',
          component:VIPmessage,
        },
        
        //员工
        {
          path:'/StaffOverall',
          component:StaffOverall
        },
        {
          path:'/StaffSearch',
          component:StaffSearch
        },
        {
          path:'/StaffRewrite',
          component:StaffRewrite
        },
        //员工（旧版本）
        {
          path:'/Employee2',
          component:Employee2
        },
        {
          path:'/Employee2_add',
          component:Employee2_add
        },
        {
          path:'/Employee2_delete',
          component:Employee2_delete
        },
        {
          path:'/Employee2_update',
          component:Employee2_update
        },
        //员工（新版本）
        {
          path:'/StaffManagement',
          component:StaffManagement
        },
        {
          path:'/test_p',
          component:test_p
        },
        {
          path:'/test_p2',
          component:test_p2
        },
        {
          path:'/SidePer',
          component:SidePer
        },
        {
          path:'/AllManagement',
          component:AllManagement
        },
        {
          path:'/SalaryManagement',
          component:SalaryManagement
        },

        //工资
        {
          path:'/SalaryOverall',
          component:SalaryOverall
        },
        {
          path:'/SalaryRewrite',
          component:SalaryRewrite
        },
        {
          path:'/Money_Add',
          component:Money_Add
        },
        {
          path:'/Money_Delete',
          component:Money_Delete
        },
        {
          path:'/Money_Update',
          component:Money_Update
        },
        //餐桌
        {
          path:'/Table1',
          component:Table1
        },
        {
          path:'/Table2',
          component:Table2
        },
        {
          path:'/Table3',
          component:Table3
        },
        {
          path:'/Table4',
          component:Table4
        },
        //餐桌（新）
        {
          path:'/NewTable1',
          component:NewTable1
        },
        {
          path:'/AvailableTable',
          component:AvailableTable
        },

        //菜单
        {
          path:'/Dish1',
          component:Dish1
        },
        {
          path:'/Dish2',
          component:Dish2
        },
        {
          path:'/Dish3',
          component:Dish3
        },
        //菜单（新）
        {
          path:'/NewDish1',
          component:NewDish1
        },

        //订单
        {
          path: '/Ongoing',
          name: 'Ongoing',
          component: Ongoing
        },
        {
          path: '/History',
          name: 'History',
          component: History
        },
        //预约
        {
          path:'/Reservation/AllReservationPage',
          name: 'AllReservationPage',
          component: AllReservationPage
        },
        //流水
        {
          path: '/StatementManage',
          name: 'StatementManage',
          component: StatementManage
        },
        //食材
        {
          path: '/AddIngredientInventory',
          name: 'AddIngredientInventory',
          component: AddIngredientInventory
        },
        {
          path: '/setUpdateIngredient',
          name: 'setUpdateIngredient',
          component: setUpdateIngredient
        },
        {
          path: '/CRUD_Ingredient',
          name: 'CRUD_Ingredient',
          component: CRUD_Ingredient
        },
        //器材管理
        {
          path: '/AddUtensilInventory',
          name: 'AddUtensilInventory',
          component: AddUtensilInventory
        },
        {
          path: '/InquireUtensilInformation',
          name: 'InquireUtensilInformation',
          component: InquireUtensilInformation
        },
        {
          path: '/ModifyUtensilInventory',
          name: 'ModifyUtensilInventory',
          component: ModifyUtensilInventory
        },
        {
          path: '/ViewAllUtensil',
          name: 'ViewAllUtensil',
          component: ViewAllUtensil
        },
        {
          path: '/CRUD_Utensil',
          name: 'CRUD_Utensil',
          component: CRUD_Utensil
        },
        //设置
        {
          path: '/Calendar',
          name: 'Calendar',
          component: Calendar
        },
        {
          path: '/Global',
          name: 'Global',
          component: Global
        },
      ]
    },

  ]
})
