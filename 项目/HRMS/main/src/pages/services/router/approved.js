// 已审核
import Index from '~services/components/approved/Index'
import TempCard from '~services/components/approved/TempCard'
import OfficialCard from '~services/components/approved/OfficialCard'
import PersonalCert from '~services/components/approved/PersonalCert'
import MaterialPrinting from '~services/components/approved/MaterialPrinting'
import HighSpeedMarket from '~services/components/approved/HighSpeedMarket'
import AOExpress from '~services/components/approved/AOExpress'
import BusinessCard from '~services/components/approved/BusinessCard'
import FixedAssets from '~services/components/approved/FixedAssets'
import Car from '~services/components/approved/Car'
import IT from '~services/components/approved/IT'

export default [
  {
    path: '/approved',
    redirect: '/approved/index',
  },
  {
    path: '/approved/index',
    name: 'ApprovedIndex',
    component: Index,
  },
  {
    path: '/approved/personal-cert/:code/:id',
    name: 'ApprovedPersonalCert',
    component: PersonalCert,
  },
  {
    path: '/approved/temp-card/:code/:id',
    name: 'ApprovedTempCard',
    component: TempCard,
  },
  {
    path: '/approved/official-card/:code/:id',
    name: 'ApprovedOfficialCard',
    component: OfficialCard,
  },
  {
    path: '/approved/material-printing/:code/:id',
    name: 'ApprovedMaterialPrinting',
    component: MaterialPrinting,
  },
  {
    path: '/approved/high-speed-market/:code/:id',
    name: 'ApprovedHighSpeedMarket',
    component: HighSpeedMarket,
  },
  {
    path: '/approved/ao-express/:code/:id',
    name: 'ApprovedAOExpress',
    component: AOExpress,
  },
  {
    path: '/approved/business-card/:code/:id',
    name: 'ApprovedBusinessCard',
    component: BusinessCard,
  },
  {
    // 固定资产申请
    path: '/approved/fixed-assets/:code/:id?',
    name: 'ApprovedFixedAssets',
    component: FixedAssets,
  },
  {
    // 车辆服务
    path: '/approved/car/:code/:id?',
    name: 'ApprovedCar',
    component: Car,
  },
  {
    // IT 服务
    path: '/approved/it/:code/:id?',
    name: 'ApprovedIT',
    component: IT,
  },
]
