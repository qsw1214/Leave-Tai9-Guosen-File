// 员工服务 PA - Personal Administration
import Index from '~services/components/pa/Index'
import TempCard from '~services/components/pa/TempCard'
import OfficialCard from '~services/components/pa/OfficialCard'
import PersonalCert from '~services/components/pa/PersonalCert'
import OrderFood from '~services/components/pa/OrderFood'
import MaterialPriting from '~services/components/pa/MaterialPrinting'
import HighSpeedMarket from '~services/components/pa/HighSpeedMarket'
import AOExpress from '~services/components/pa/AOExpress'
import BusinessCard from '~services/components/pa/BusinessCard'
import FixedAssets from '~services/components/pa/FixedAssets'
import Car from '~services/components/pa/Car'
import IT from '~services/components/pa/IT'

export default [
  {
    path: '/pa',
    redirect: '/pa/index',
  },
  {
    path: '/pa/index',
    name: 'PAIndex',
    component: Index,
  },
  {
    // 人事证明
    path: '/pa/personal-cert/:code/:id?',
    name: 'PAPersonalCert',
    component: PersonalCert,
  },
  {
    // 临时工卡
    path: '/pa/temp-card/:code/:id?',
    name: 'PATempCard',
    component: TempCard,
  },
  {
    // 正式工卡
    path: '/pa/official-card/:code/:id?',
    name: 'PAOfficialCard',
    component: OfficialCard,
  },
  {
    // 订餐服务
    path: '/pa/order-food/:code',
    name: 'PAOrderFood',
    component: OrderFood,
  },
  {
    // 宣传品印刷制作
    path: '/pa/material-printing/:code/:id?',
    name: 'PAMaterialPrinting',
    component: MaterialPriting,
  },
  {
    // 高速行情
    path: '/pa/high-speed-market/:code/:id?',
    name: 'PAHighSpeedMarket',
    component: HighSpeedMarket,
  },
  {
    // 运营支持办公费用申请
    path: '/pa/ao-express/:code/:id?',
    name: 'PAAOExpress',
    component: AOExpress,
  },
  {
    // 名片制作
    path: '/pa/business-card/:code/:id?',
    name: 'BusinessCard',
    component: BusinessCard,
  },
  {
    // 固定资产申请
    path: '/pa/fixed-assets/:code/:id?',
    name: 'FixedAssets',
    component: FixedAssets,
  },
  {
    // 车辆服务
    path: '/pa/car/:code/:id?',
    name: 'PACar',
    component: Car,
  },
  {
    // IT 服务
    path: '/pa/it/:code/:id?',
    name: 'PAIT',
    component: IT,
  },
]
