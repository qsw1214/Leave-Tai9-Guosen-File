// 我到发起
import Index from '~services/components/application/Index'
import TempCard from '~services/components/application/TempCard'
import OfficialCard from '~services/components/application/OfficialCard'
import PersonalCert from '~services/components/application/PersonalCert'
import OrderFood from '~services/components/application/OrderFood'
import MaterialPrinting from '~services/components/application/MaterialPrinting'
import HighSpeedMarket from '~services/components/application/HighSpeedMarket'
import AOExpress from '~services/components/application/AOExpress'
import BusinessCard from '~services/components/application/BusinessCard'
import FixedAssets from '~services/components/application/FixedAssets'
import Car from '~services/components/application/Car'
import IT from '~services/components/application/IT'

export default [
  {
    path: '/application',
    redirect: '/application/index',
  },
  {
    path: '/application/index',
    name: 'ApplicationIndex',
    component: Index,
  },
  {
    path: '/application/personal-cert/:code/:id',
    name: 'ApplicationPersonalCert',
    component: PersonalCert,
  },
  {
    path: '/application/temp-card/:code/:id',
    name: 'ApplicationTempCard',
    component: TempCard,
  },
  {
    path: '/application/official-card/:code/:id',
    name: 'ApplicationOfficialCard',
    component: OfficialCard,
  },
  {
    path: '/application/order-food/:code/:id',
    name: 'ApplicationOrderFood',
    component: OrderFood,
  },
  {
    path: '/application/material-printing/:code/:id',
    name: 'ApplicationMaterialPrinting',
    component: MaterialPrinting,
  },
  {
    path: '/application/high-speed-market/:code/:id',
    name: 'ApplicationHighSpeedMarket',
    component: HighSpeedMarket,
  },
  {
    path: '/application/ao-express/:code/:id',
    name: 'ApplicationAOExpress',
    component: AOExpress,
  },
  {
    path: '/application/business-card/:code/:id',
    name: 'ApplicationBusinessCard',
    component: BusinessCard,
  },
  {
    path: '/application/fixed-assets/:code/:id',
    name: 'ApplicationFixedAssets',
    component: FixedAssets,
  },
  {
    path: '/application/car/:code/:id',
    name: 'ApplicationCar',
    component: Car,
  },
  {
    path: '/application/it/:code/:id',
    name: 'ApplicationIT',
    component: IT,
  },
]
