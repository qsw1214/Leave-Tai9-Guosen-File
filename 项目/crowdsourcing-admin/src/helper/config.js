var isDEV = VERSION == 'DEV'
export default {
  // 接口请求地址
  baseURL: isDEV ? 'http://test.twisted.fincgo.com' : 'http://twisted.fincgo.com',
  uploadUri: isDEV ? 'http://test.twisted.fincgo.com/admin/FundCompanyScore/Upload' : 'http://twisted.fincgo.com/admin/FundCompanyScore/Upload'
}
