<template>
  <section class="details" v-loading.body="isLoading">
    <div class="details--head">
      <!-- <pre style="position: fixed; right: 20px; padding: 30px; top: 100px; background: #000; color: #fff;">{{ detail }}</pre> -->
      <div class="details--title">
        <span><b :class="{'pub' : detail.status == '1'}">[{{ detail.status == '1' ? '发布中' : '已下架'}}]</b>&nbsp;&nbsp;{{ detail.name }}</span>
        <div class="tag">
          <el-tag type="primary">{{ detail.subType | subType }}类型{{ detail.type | type}}项目</el-tag>
        </div>
      </div>
      <div class="details--statics">
        <div class="details--statics-item target">
          <div class="content">{{ detail.minAmount | exchange}}~{{ detail.maxAmount | exchange }}</div>
          <div class="title">{{ detail.type | type}}金额</div>
        </div>

        <div class="details--statics-item time">
          <div class="content">{{detail.holdTimeMin}}年-{{detail.holdTimeMax}}年</div>
          <div class="title">资金占用时长</div>
        </div>

        <div class="details--statics-item rate">
          <div class="content">{{ detail.revenueRateMin | number}}%-{{ detail.revenueRateMax | number}}%</div>
          <div class="title">预期收益率/年</div>
        </div>
      </div>
    </div>
    <div class="details--content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="项目详情" name="1">
          <div class="item">
            <div class="item--key">
              <span>{{ detail.type | type }}主体:</span>
            </div>
            <div class="item--value" v-if='detail.companyInfo'>
              <span>{{ detail.companyInfo.name }}</span>
            </div>
          </div>
          <div class="item">
            <div class="item--key">
              <span>项目所在地:</span>
            </div>
            <div class="item--value">
              <span>{{ detail.cityInfo }}</span>
            </div>
          </div>
          <div class="item">
            <div class="item--key">
              <span>发布时间:</span>
            </div>
            <div class="item--value">
              <span>{{ detail.ctime | moment }}</span>
            </div>
          </div>
          <!--二级市场-->
          <template v-if="detail.subType == 2">
            <div class="item">
              <div class="item--key">
                <span>{{ detail.type == '1' ? '投顾是否跟投:' : '是否要求项目方跟投:' }}</span>
              </div>
              <div class="item--value">
                <span>{{ detail.ejscInfo.isFlow | commonOption }}</span>
              </div>
            </div>
            <div class="item" v-if="detail.ejscInfo.isFlow == '1'">
              <div class="item--key">
                <span>跟投比例:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.ejscInfo.flowRate | number}}%</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>是否提供安全垫:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.ejscInfo.isAqd | commonOption }}</span>
              </div>
            </div>
            <div class="item" v-if="detail.ejscInfo.isAqd == '1'">
              <div class="item--key">
                <span>安全垫比例:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.ejscInfo.aqdRate | number}}%</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>前后端分成说明:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.ejscInfo.disRemark }}</span>
              </div>
            </div>
          </template>
          <!--股权市场-->
          <template v-if="detail.subType == 3">
            <div class="item">
              <div class="item--key">
                <span>有无回购条款:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.gqInfo.isHgtk | commonOption2 }}</span>
              </div>
            </div>
            <div class="item" v-if="detail.gqInfo.isHgtk == '1'">
              <div class="item--key">
                <span>回购利率:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.gqInfo.hgRate | number}}%</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span><span>{{ detail.type == '1' ? '投顾是否跟投:' : '是否要求项目方跟投:' }}</span></span>
              </div>
              <div class="item--value">
                <span>{{ detail.gqInfo.isFlow | commonOption }}</span>
              </div>
            </div>
            <div class="item" v-if="detail.gqInfo.isFlow == '1'">
              <div class="item--key">
                <span>跟投比例:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.gqInfo.flowRate | number}}%</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>是否提供担保措施:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.gqInfo.isGuarantee | commonOption }}</span>
              </div>
            </div>
            <!--todo 这里好像如果是投资的话是不需要填写的-->
            <div class="item" v-if="detail.gqInfo.isGuarantee == '1' && detail.type == '1'">
              <div class="item--key">
                <span>担保措施说明:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.gqInfo.guaranteeRemark}}</span>
              </div>
            </div>
          </template>
          <!--定增市场-->
          <template v-if="detail.subType == 4">
            <div class="item">
              <div class="item--key">
                <span>{{ detail.type == '1' ? '投顾是否跟投:' : '是否要求项目方跟投:' }}</span>
              </div>
              <div class="item--value">
                <span>{{ detail.dzInfo.isFlow | commonOption }}</span>
              </div>
            </div>
            <div class="item" v-if="detail.dzInfo.isFlow == '1'">
              <div class="item--key">
                <span>跟投比例:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.dzInfo.flowRate | number}}%</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>是否批复/批文:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.dzInfo.isReply | commonOption }}</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>折扣率:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.dzInfo.discountRate | number }}%</span>
              </div>
            </div>
            <!--当为融资类型是需额外提供以下信息-->
            <template v-if="detail.type == '1'">
              <div class="item">
                <div class="item--key">
                  <span>定增规模:</span>
                </div>
                <div class="item--value">
                  <span>{{ detail.dzInfo.scale | exchange }}</span>
                </div>
              </div>

              <div class="item">
                <div class="item--key">
                  <span>单份金额:</span>
                </div>
                <div class="item--value">
                  <span>{{ detail.dzInfo.singlePrice | exchange }}</span>
                </div>
              </div>
              <div class="item">
                <div class="item--key">
                  <span>股票代码:</span>
                </div>
                <div class="item--value">
                  <span>{{ detail.dzInfo.stockCode }}</span>
                </div>
              </div>
              <div class="item">
                <div class="item--key">
                  <span>发行年限:</span>
                </div>
                <div class="item--value">
                  <span>{{ detail.dzInfo.fxYear }}年</span>
                </div>
              </div>
              <div class="item">
                <div class="item--key">
                  <span>定价基准日:</span>
                </div>
                <div class="item--value">
                  <span>{{ detail.dzInfo.priceBaseDate }}</span>
                </div>
            </div>
            </template>
          </template>
          <div class="item">
            <div class="item--key">
              <span>其它{{ detail.type == '1' ? '融' : '投' }}资说明:</span>
            </div>
            <div class="item--value">
              <span>{{ detail.remark }}</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="联系方式" name="2">
          <template v-if="detail.contactInfo">
            <div class="item">
              <div class="item--key">
                <span>联系人:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.contactInfo.name }}</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>性别:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.contactInfo.sex == '1' ? '男' : '女' }}</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>职位:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.contactInfo.position }}</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>联系电话:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.contactInfo.phone }}</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>联系邮箱:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.contactInfo.email }}</span>
              </div>
            </div>
            <div class="item">
              <div class="item--key">
                <span>微信号:</span>
              </div>
              <div class="item--value">
                <span>{{ detail.contactInfo.wxid }}</span>
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
  </section>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'Detail',
    data () {
      return {
        test: '',
        isLoading: false,
        activeNames: ['1', '2'],
        detail: {}
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        const { id: projectId } = this.$route.params
        this.$axios.post('/project/detail', {projectId}).then(res => {
          const { code, data } = res
          if (code === 0) {
            this.detail = data.detail
          }
        })
      }
    },
    filters: {
      type (val) {
        return {'1': '融资', '2': '投资'}[val]
      },
      subType (val) {
        return {'1': '其它', '2': '二级市场', '3': '股权', '4': '定增'}[val]
      },
      moment (val) {
        return moment.unix(Number(val)).format('YYYY-MM-DD HH:mm')
      },
      commonOption (val) {
        return {'1': '是', '2': '否', '-1': '不限'}[val]
      },
      commonOption2 (val) {
        return {'1': '有', '2': '无', '-1': '不限'}[val]
      },
      number (val) {
        return Number(val).toFixed(2)
      },
      exchange (field) {
        if (parseInt(field) >= 10000) {
          field = (parseInt(field) / 10000).toFixed(2) + '亿'
        } else {
          field = parseInt(field) + '万'
        }
        return field
      }
    }
  }
</script>

<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .details {
    width: 800px;
    margin-top: 30px;


    &--head {
      background-color: #fbfdff;
      padding: 30px 24px;
      position: relative;
      border:1px solid #dfe6ec;
      border-bottom: none;
    }

    &--title {
      font-size: 18px;
      margin-bottom:50px;
      text-align: center;
      position: relative;

      .tag {
        position: absolute;
        left: 50%;
        transform:  translateX(-50%);
        top: 30px;
      }
      
      b {
        color: #999;

        &.pub {
          color: #35a9ff;
        }
      }
    }

    &--statics {
      display: flex;
      color: #999;

      .content {
        line-height: 22px; /* no */
      }

      .title {
        font-size: 12px; /* no */
        margin-top: 20px;
      }

      .target {
        .content {
          font-size: 20px; /* no */
          color: #ff8019;
          font-weight: 500;
        }
      }

      .time {
        text-align: center;
        .content {
          font-size: 16px; /* no */
          color: #333;
        }
      }

      .rate {
        text-align: right;

        .content {
          font-size: 16px; /* no */
          color: #666;
        }
      }

    }

    &--statics-item {
      flex: 1;
    }

    .item {
      display: flex;
      align-items: top;
      line-height: 1.5;
      margin-bottom: 8px;

      &--key {
        margin-right: 10px;
      }

      &--value {
        flex: 1;
      }
    }
  }
</style>
