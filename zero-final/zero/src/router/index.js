import Vue from 'vue'
import Router from 'vue-router'

import CustomPage from '@/components/Custom/CustomPage'
import ReservationPage from '@/components/Custom/ReservationPage'
import OrderPage from '@/components/Custom/OrderPage'
import MainPage from '@/components/Custom/MainPage'
import AboutUsPage from '@/components/Custom/AboutUsPage'
import CommentPage from '@/components/Custom/CommentPage'
import PayPage from '@/components/Custom/PayPage'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CustomPage',
      component: CustomPage,
      children:[
        {
          path: '/MainPage',
          name: 'MainPage',
          component: MainPage
        },
        {
          path: '/ReservationPage',
          name: 'ReservationPage',
          component: ReservationPage
        },
        {
          path: '/OrderPage',
          name: 'OrderPage',
          component: OrderPage
        }, 
        {
          path: '/PayPage',
          name: 'PayPage',
          component: PayPage
        },    
        {
          path: '/AboutUsPage',
          name: 'AboutUsPage',
          component: AboutUsPage
        }, 
        {
          path: '/CommentPage',
          name: 'CommentPage',
          component: CommentPage
        },          
      ]
    }
  ]
})
