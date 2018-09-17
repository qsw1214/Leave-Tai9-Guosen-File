<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page--organization">

    <m-breadcrumb :items="breadcrumb" />

    <div class="organization--content">
      <div class="panel panel--buttons block-margin-bottom">
        <div class="buttons">
          <el-button
            v-permission="'1010001,1010002'"
            @click.native="handleExport('image')">导出图状
          </el-button>
          <el-button
            v-permission="'1010001,1010002'"
            @click.native="handleExport('tree')">导出树状
          </el-button>
        </div>
      </div>
      <div class="panel panel--graph">
        <div
          v-loading.body="treeLoading"
          class="tree">
          <el-tree
            node-key="id"
            highlight-current
            ref="tree"
            :data="options"
            :props="defaultProps"
            :indent="16"
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKeys"
            :current-node-key="currentNodeId"
            @node-collapse="handleCollpase"
            @node-click="handleNodeClick" />
        </div>
        <div
          v-loading.body="loadingOrg"
          class="charts">
          <OrgGraph
            ref="graph"
            :graph-data="graphArr"
            @showTeam="showTeam"
            @showOrg="showOrg" />
        </div>
      </div>
      <el-dialog
        title="部门员工"
        :visible.sync="showNumber">
        <div class="number">
          <OrgMember :organization-id="chooseNodeId" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import OrgMember from './Member'
  import OrgGraph from './Graph'

  export default {
    name: 'Organization',
    components: {
      OrgMember,
      OrgGraph,
    },
    data() {
      return {
        breadcrumb: [
          { name: '组织管理' },
          { name: '组织维护', to: '/query' },
          { name: '组织架构图' },
        ],
        options: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        graphArr: [],
        loading: true,
        loadingOrg: false,
        loadingNumber: false,
        showNumber: false,
        defaultExpandedKeys: [],
        currentNodeId: '',
        chooseNodeId: '',
        isOpenTree: false,
        treeLoading: false,
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 组装图形显示数据结构
      buildGraphData(data) {
        const grapArr = []
        const time = new Date()
        const getCurrentNode = (parentNode, parentId) => {
          const temp = {}
          if (parentNode.level !== 1) {
            temp.parent = parentId || ''
          }
          const {
            id: key,
            level,
            leader_name: chargeName,
            leader_sex: chargeSex,
            leader_job: chargeJob,
            user_count: userCount,
            org_count: orgCount,
          } = parentNode

          const { flag } = parentNode
          let {
            name,
            charge_avatar_url: avatar,
          } = parentNode

          const arr = { 0: '', 1: '前台', 2: '中台', 3: '后台' }
          const textEllipsis = (text, number) => {
            let word
            if (text.length > number) {
              word = `${text.substr(0, number)}...`
            } else {
              word = text
            }
            return word
          }
          name = textEllipsis(name, 9)
          avatar = `${avatar}?v=${time.getTime()}`
          const props = arr[Number(flag)]
          /* eslint max-len: 0 */
          Object.assign(
            temp,
            { key, name, level, chargeName, chargeSex, chargeJob, userCount, orgCount, avatar, props }
          )
          if (parentNode.children.length > 0) {
            parentNode.children.forEach(node => getCurrentNode(node, parentNode.id))
          }
          grapArr.unshift(temp)
        }
        getCurrentNode(data)
        this.graphArr = grapArr
      },
      // 获取数据
      // 此处没有采取组件内获取数据，外部获取数据填充
      fetchOrgData() {
        return this.$axios.post(this.$api.common.organizationLevel)
          .then((res) => {
            const { data } = res
            this.options = [data]
            this.currentNodeId = this.options[0].id
            this.defaultExpandedKeys = [this.currentNodeId]
            this.$nextTick(() => {
              this.buildGraphData(data)
              this.setExpandIcon()
            })
          })
          .catch((error) => {
            console.dir(error)
          })
      },
      // 点击树形节点执行函数
      handleNodeClick(data) {
        this.loadingOrg = true
        this.showNumber = false
        this.currentNodeId = data.id
        window.setTimeout(() => {
          this.buildGraphData(data)
          this.loadingOrg = false
        }, 300)
      },
      // 导出操作
      handleExport(type) {
        switch (type) {
        case 'image':
          this.$refs.graph.exportImages()
          break
        case 'tree':
          this.loading = true
          this.$axios.post(this.$api.organization.exportOrgTree)
            .then((res) => {
              this.$utils.tools.windowOpen(res.data.url)
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
              console.dir(error)
            })
          break
        default:
          console.log('参数错误')
        }
      },
      // 折叠顶节点
      handleCollpase(data) {
        const { level, id } = data
        try {
          if (level === 1) {
            this.isOpenTree = !this.isOpenTree
            // 默认展开第一个父菜单
            this.defaultExpandedKeys = []
            if (this.isOpenTree) {
              this.defaultExpandedKeys = [id]
              const pushIdToExpandedKeys = (nodes) => {
                nodes.forEach((node) => {
                  this.defaultExpandedKeys.push(node.id)
                  if (node.children.length > 0) {
                    pushIdToExpandedKeys(node.children)
                  }
                })
              }
              pushIdToExpandedKeys(data.children)
            } else {
              Object.keys(this.$refs.tree.store.nodesMap).forEach((key) => {
                this.$refs.tree.store.nodesMap[key].expanded = false
              })
              this.defaultExpandedKeys = [id]
            }
          }
        } catch (e) {
          console.log(`${e}请查看最新elemUI框架下的Tree组件源码`)
        }
        this.setExpandIcon()
      },
      // 设置顶节点的icon方向
      setExpandIcon() {
        const $el = document.querySelector('.el-tree-node__expand-icon')

        if ($el) {
          $el.className = this.isOpenTree ?
            'el-tree-node__expand-icon el-icon-caret-right expanded' : 'el-tree-node__expand-icon el-icon-caret-right'
        }
      },
      // 初始化拉取数据
      init() {
        this.fetchOrgData().then(() => {
          this.loading = false
        })
      },
      // 显示人员列表
      showTeam(data) {
        this.showNumber = true
        this.chooseNodeId = data.key
      },
      // 显示选中组织
      showOrg(data) {
        const { key: id } = data
        if (this.currentNodeId !== id) {
          this.currentNodeId = id
          let filterData
          const getCurrentTreeById = (node) => {
            if (node.id === id) {
              filterData = node
            } else {
              for (let i = 0; i < node.children.length; i += 1) {
                getCurrentTreeById(node.children[i])
              }
            }
          }
          getCurrentTreeById(this.options[0])
          this.defaultExpandedKeys = [id]
          this.loadingOrg = true
          if (this.chooseNodeId === id) {
            this.showNumber = true
          } else {
            this.showNumber = false
          }
          window.setTimeout(() => {
            this.buildGraphData(filterData)
            this.loadingOrg = false
          }, 300)
        }
      },
    },

    beforeRouteEnter(to, form, next) {
      next(() => {
        const page = document.querySelector('.page')
        if (page) page.style.maxWidth = '100%'
      })
    },

    beforeRouteLeave(to, form, next) {
      next(() => {
        const page = document.querySelector('.page')
        if (page) page.style.maxWidth = '1200px'
      })
    },
  }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .page--organization {
    .organization--content {
      width: 100%;

      .panel {
        width: 100%;
        display: flex;
      }

      .panel--graph {
        .tree {
          height: calc(100vh - 188px - 17px);
          width: 220px;
          margin-right: 15px;
          background: #fff;
          border: 1px solid #d7d7d7;
          overflow-y: scroll;

          .el-tree {
            border: none;
          }

          .el-tree-node {
            white-space: normal;
          }

          .el-tree-node__content {
            line-height: 1.4;
            min-height: 34px;
            padding-top: 5px;
            padding-bottom: 5px;
            height: auto;
            display: flex;
            align-items: center;
          }

          .el-tree-node__label {
            flex: 1;
          }
        }

        .charts {
          flex: 1;
          height: calc(100vh - 188px - 17px);
        }
      }
    }
  }
</style>
