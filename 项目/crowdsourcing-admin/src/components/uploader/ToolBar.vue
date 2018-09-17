<template>
  <div class="toolbar">
    <b class="title">以下是Excel中的机构简称在{{ company }}找不到的机构</b>
    <el-form :inline="true" label-position="left" class="toolbar">
      <el-row>
        <el-form-item label="Excel压缩文件名" style="margin-bottom: 0px;">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :label="item.label"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="right">
          <el-button type="info" @click="query">查询</el-button>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['company'],
    name: 'ToolBar',
    data () {
      return {
        options: [],
        value: ''
      }
    },
    // 创建实例
    created () {
      const zipName = this.$route.query.zipName
      this.value = zipName || ''
      this.getZipList()
    },
    methods: {
      // 获取压缩列表
      getZipList () {
        this.axios.post('/admin/FundCompanyScore/GetZipNameList').then(res => {
          // this.loading = false
          const { code, error, data } = res.data
          const { list } = data
          if (code == 0) {
            let options = list.map(item => {
              return {
                value: item,
                label: item + '.zip'
              }
            })
            this.options = [{
              value: '',
              label: '全部'
            }].concat(options)
          } else {
          }
        })
      },
      // 查询
      query () {
        this.$emit('query', this.value)
      }
    }
  }
</script>


<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .toolbar {
    .title {
      margin: 10px 0px;
    }

    .right {
      display: inline-block;
    }
  }
</style>
