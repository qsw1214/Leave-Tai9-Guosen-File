/*
 * name 特殊流程的配置方法
 * output 输出接口默认值
 * default 字段默认值
 * format 输入格式化值
 * formatBack 输出格式化值
 * approval_form_type_selectList 16/17/13/14/15接口获取的选项列表，可为空
 */

export default {
  // 字段配置内容
  data() {
    // 200019因公外出
    const F200019 = {
      is_org_leader: {
        output: '',
        default: '',
        format: value => (value ? String(value) : ''),
        formatBack: value => Number(value),
      },
      org_line: {
        output: '',
        default: [],
        format: (value) => {
          if (!value) return []
          const data = this.dictionary.process2000MoveOrgLine
          const arr = []
          Object.keys(data).forEach((key) => {
            // eslint-disable-next-line no-bitwise
            if (value & key) arr.push(key)
          })
          return arr
        },
        formatBack: value => value
          .reduce((s, v) => Number(s) + Number(v), 0),
      },
      org_flag: {
        output: '',
        default: [],
        format: (value) => {
          if (!value) return []
          const data = this.dictionary.process2000OrgFlag
          const arr = []
          Object.keys(data).forEach((key) => {
            // eslint-disable-next-line no-bitwise
            if (value & key) arr.push(key)
          })
          return arr
        },
        formatBack: value => value
          .reduce((s, v) => Number(s) + Number(v), 0),
      },
    }

    // 200021出差
    const F200021 = Object.assign({}, F200019, {
      day_range: {
        output: '',
        default: [],
        format: value => (!value ? [] : value.split(',')),
        formatBack: value => value.join(','),
      },
    })

    // 200018请假
    const F200018 = Object.assign({}, F200021, {
      kqqj_type: {
        output: '',
        default: [],
        format: (value) => {
          if (!value) return []
          const data = this.dictionary.process200018KqqjType
          const arr = []
          Object.keys(data).forEach((key) => {
            // eslint-disable-next-line no-bitwise
            if (value & key) arr.push(key)
          })
          return arr
        },
        formatBack: value => value
          .reduce((s, v) => Number(s) + Number(v), 0),
      },
    })

    return {
      // 200001人事证明
      F200001: {
        rszm_type: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process200001RszmType
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
      },

      // 200005宣传品印刷制作
      F200005: {
        is_need_make: {
          output: '',
          default: '',
          format: value => (value === '' ? '' : Number(value)),
          formatBack: value => value,
        },
        money_range: {
          output: '',
          default: [],
          format: value => (!value ? [] : value.split(',')),
          formatBack: value => value.join(','),
        },
      },

      // 200007行政运营支持办公费申请
      F200007: {
        money_range: {
          output: '',
          default: [],
          format: value => (!value ? [] : value.split(',')),
          formatBack: value => value.join(','),
        },
      },

      // 200016人事调动管理
      F200016: {
        approval_form_type: {
          output: '',
          default: '',
          format: value => value,
          formatBack: value => value,
        },
        rsddgl_job_reason: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process200016RsddglJobReason
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
        is_move_in_org: {
          output: '',
          default: '',
          format: value => (value === '' ? '' : Number(value)),
          formatBack: value => value,
        },
        is_move_out_org: {
          output: '',
          default: '',
          format: value => (value === '' ? '' : Number(value)),
          formatBack: value => value,
        },
        move_org_line: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process2000MoveOrgLine
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
        move_org_flag: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process2000OrgFlag
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
        is_need_move_customers: {
          output: '',
          default: '',
          format: value => (value ? String(value) : ''),
          formatBack: value => Number(value),
        },
        is_diff_line: {
          output: '',
          default: '',
          format: value => (value ? String(value) : ''),
          formatBack: value => Number(value),
        },
      },

      // 200017人事转正管理
      F200017: {
        approval_form_type: {
          output: '',
          default: '',
          format: value => value,
          formatBack: value => value,
        },
        rszzgl_type: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process200017RszzglType
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
        approval_is_end_zz: {
          output: '',
          default: '',
          format: value => (value ? String(value) : ''),
          formatBack: value => value,
        },
        zz_org_line: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process2000MoveOrgLine
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
        zz_org_flag: {
          output: '',
          default: [],
          format: (value) => {
            if (!value) return []
            const data = this.dictionary.process2000OrgFlag
            const arr = []
            Object.keys(data).forEach((key) => {
              // eslint-disable-next-line no-bitwise
              if (value & key) arr.push(key)
            })
            return arr
          },
          formatBack: value => value
            .reduce((s, v) => Number(s) + Number(v), 0),
        },
      },

      // 200013-4-5人事待入职、入职、离职管理
      F200013: {
        approval_form_type: {
          output: '',
          default: '',
          format: value => value,
          formatBack: value => value,
        },
      },

      F200014: {
        approval_form_type: {
          output: '',
          default: '',
          format: value => value,
          formatBack: value => value,
        },
      },

      F200015: {
        approval_form_type: {
          output: '',
          default: '',
          format: value => value,
          formatBack: value => value,
        },
      },

      F200018,
      F200019,
      F200020: F200019,
      F200021,
      F200023: F200021,

      approval_form_type_selectList: {},
    }
  },

  // 表单特殊字段表单校验
  detDataRules: {
    rszm_type: [{
      required: true, message: '请选择证明类型', trigger: ['blur', 'change'],
    }],
    is_need_make: [{
      required: true, message: '请选择是否需要制作', trigger: ['blur', 'change'],
    }],
    money_range: [{
      required: true, message: '请选择核价结果范围', trigger: ['blur', 'change'],
    }],
    money_range2: [{
      required: true, message: '请选择预算金额范围', trigger: ['blur', 'change'],
    }],

    approval_form_type: [{
      required: true, message: '请选择审批表单类型', trigger: ['blur', 'change'],
    }],

    rsddgl_job_reason: [{
      required: true, message: '请选择异动类型', trigger: ['blur', 'change'],
    }],
    is_move_in_org: [{
      required: true, message: '请选择是否判断调入部门', trigger: ['blur', 'change'],
    }],
    is_move_out_org: [{
      required: true, message: '请选择是否判断调出部门', trigger: ['blur', 'change'],
    }],
    move_org_line: [{
      required: true, message: '请选择组织条线', trigger: ['blur', 'change'],
    }],
    move_org_flag: [{
      required: true, message: '请选择组织属性', trigger: ['blur', 'change'],
    }],
    is_need_move_customers: [{
      required: true, message: '请选择是否需要划转客户', trigger: ['blur', 'change'],
    }],
    is_diff_line: [{
      required: true, message: '请选择是否跨业务线', trigger: ['blur', 'change'],
    }],

    rszzgl_type: [{
      required: true, message: '请选择异动类型', trigger: ['blur', 'change'],
    }],
    approval_is_end_zz: [{
      required: true, message: '请选择是否终止转正', trigger: ['blur', 'change'],
    }],
    zz_org_line: [{
      required: true, message: '请选择组织条线', trigger: ['blur', 'change'],
    }],
    zz_org_flag: [{
      required: true, message: '请选择组织属性', trigger: ['blur', 'change'],
    }],

    day_range: [{
      required: true, message: '请选择天数范围', trigger: ['blur', 'change'],
    }],
    kqqj_type: [{
      required: true, message: '请选择请假类型', trigger: ['blur', 'change'],
    }],
    is_org_leader: [{
      required: true, message: '请选择是否为部门负责人', trigger: ['blur', 'change'],
    }],
    org_line: [{
      required: true, message: '请选择组织条线', trigger: ['blur', 'change'],
    }],
    org_flag: [{
      required: true, message: '请选择组织属性', trigger: ['blur', 'change'],
    }],
  },
}
