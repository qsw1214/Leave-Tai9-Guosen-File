const config = {
  // 待入职岗位编码
  toEntry(modlue) {
    return {
      // 柜台岗
      200013001: `GT${modlue}Form`,
      // 人事岗
      200013002: `RS${modlue}Form`,
      // 运营经理'
      200013003: `YY${modlue}Form`,
      // 招聘岗
      200013004: `ZP${modlue}Form`,
    }
  },
  entry(modlue) {
    return {
      // 人事岗（员工ID）
      200014001: `RS${modlue}Form`,
      // 合规岗
      200014002: `HG${modlue}Form`,
      // IT岗
      200014003: `IT${modlue}Form`,
      // 行政岗
      200014004: `XZ${modlue}Form`,
      // 人事岗（密钥指纹）
      200014005: `RS2${modlue}Form`,
      // 人事岗（合同签订）
      200014006: `RS3${modlue}Form`,
      // 人力行政部
      200014007: `PX${modlue}Form`,
    }
  },
}

const createData = (res) => {
  const components = {
    data() {
      return {
        formType: res,
      }
    },
  }

  return components
}

export default {
  toEntryApproving: createData(config.toEntry('Approving')),
  toEntryApproved: createData(config.toEntry('Approved')),
  entryApproving: createData(config.entry('Approving')),
  entryApproved: createData(config.entry('Approved')),
}
