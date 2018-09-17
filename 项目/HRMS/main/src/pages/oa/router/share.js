import Mine from '../components/share/Mine'
import MineEdit from '../components/share/MineEdit'
import MineDetails from '../components/share/MineDetails'
import Warehouse from '../components/share/Warehouse'
import WarehouseDetails from '../components/share/WarehouseDetails'
import Index from '../components/share/Index'

export default [
  {
    path: '/share',
    name: 'share',
    component: Index,
  },

  {
    path: '/share/mine',
    name: 'shareMine',
    component: Mine,
    meta: { permission: '1070006' },
  },

  {
    path: '/share/warehouse',
    name: 'shareWarehouse',
    component: Warehouse,
    meta: { permission: '1070005' },
  },

  {
    path: '/share/mine/edit',
    name: 'shareMineEdit',
    component: MineEdit,
    meta: { permission: '1070006' },
  },

  {
    path: '/share/mine/details/:id',
    name: 'shareMineDetails',
    component: MineDetails,
    meta: { permission: '1070006' },
  },

  {
    path: '/share/warehouse/details/:id',
    name: 'warehouseDetails',
    component: WarehouseDetails,
    meta: { permission: '1070006' },
  },
]
