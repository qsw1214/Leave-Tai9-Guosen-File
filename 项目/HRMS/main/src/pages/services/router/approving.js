// 待审批
import Index from '~services/components/approving/Index'
import TempCard from '~services/components/approving/TempCard'
import OfficialCard from '~services/components/approving/OfficialCard'
import PersonalCert from '~services/components/approving/PersonalCert'
import MaterialPrinting from '~services/components/approving/MaterialPrinting'
import HighSpeedMarketing from '~services/components/approving/HighSpeedMarket'
import AOExpress from '~services/components/approving/AOExpress'
import BusinessCard from '~services/components/approving/BusinessCard'
import FixedAssets from '~services/components/approving/FixedAssets'
import Car from '~services/components/approving/Car'
import IT from '~services/components/approving/IT'

export default [
  {
    path: '/approving',
    redirect: '/approving/index',
  },
  {
    path: '/approving/index',
    name: 'ApprovingIndex',
    component: Index,
  },
  {
    path: '/approving/personal-cert/:code/:id',
    name: 'ApprovingPersonalCert',
    component: PersonalCert,
  },
  {
    path: '/approving/temp-card/:code/:id',
    name: 'ApprovingTempCard',
    component: TempCard,
  },
  {
    path: '/approving/official-card/:code/:id',
    name: 'ApprovingOfficialCard',
    component: OfficialCard,
  },
  {
    path: '/approving/material-printing/:code/:id',
    name: 'ApprovingMaterialPrinting',
    component: MaterialPrinting,
  },
  {
    path: '/approving/high-speed-market/:code/:id',
    name: 'ApprovingHighSpeedMarketing',
    component: HighSpeedMarketing,
  },
  {
    path: '/approving/ao-express/:code/:id',
    name: 'ApprovingAOExpress',
    component: AOExpress,
  },
  {
    path: '/approving/business-card/:code/:id',
    name: 'ApprovingBusinessCard',
    component: BusinessCard,
  },
  {
    // 固定资产申请
    path: '/approving/fixed-assets/:code/:id',
    name: 'ApprovingFixedAssets',
    component: FixedAssets,
  },
  {
    // 车辆服务
    path: '/approving/car/:code/:id',
    name: 'ApprovingCar',
    component: Car,
  },
  {
    // IT 服务
    path: '/approving/it/:code/:id',
    name: 'ApprovingIT',
    component: IT,
  },
]
