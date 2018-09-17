<template>
  <div class="graph">
    <div id="myDiagramDiv" />
  </div>
</template>

<script>
  /**
   * A graph in organization page.
   * Created on 2017/8/28
   * @module components/organization/graph
   * @param {Array} organization - Required, Array of organization.
   * @author Yangleilei
   */
  import '../../../../../static/vendor/go-simple'

  let myDiagram = null
  const $ = window.go.GraphObject.make
  const { go } = window
  export default {
    name: 'Graph',
    props: {
      graphData: {
        required: true,
        type: Array,
      },
    },
    data() {
      const isdev = process.env.NODE_ENV === 'development'
      const baseGroupPic = '/static/images/organization-graph_group.png'
      const groupPic = isdev ? baseGroupPic : `/web/system${baseGroupPic}`
      const baseOrgPic = '/static/images/organization-graph_org.png'
      const orgPic = isdev ? baseOrgPic : `/web/system${baseOrgPic}`

      return {
        groupPic,
        orgPic,
        nodeWidth: 200,
        nodeHeight: 230,
        once: true,
      }
    },
    watch: {
      /* eslint func-names: ["error", "never"] */
      /* eslint object-shorthand: 0 */
      graphData: function () {
        this.updatedDiagram()
      },
    },
    mounted() {
      this.initDiagram()
    },
    methods: {
      // 初始化画布
      initDiagram() {
        myDiagram = $(go.Diagram, 'myDiagramDiv', {
          initialViewportSpot: go.Spot.TopCenter,
          initialDocumentSpot: go.Spot.TopCenter,
          initialContentAlignment: go.Spot.TopCenter,
          'undoManager.isEnabled': true,
          layout: $(
            go.TreeLayout,
            {
              angle: 90,
              nodeSpacing: 20,
              layerSpacing: 90,
              arrangement: go.TreeLayout.AlignmentCenterChildren,
            }
          ),
        })

        myDiagram.nodeTemplate =
          $(
            go.Node, 'Vertical',
            { selectionObjectName: 'BODY', selectable: false },
            { click: (e, node) => { this.showHighLight(node) } },
            $(
              go.Panel, 'Auto',
              { name: 'NodePanel', width: 180, height: 230, defaultAlignment: go.Spot.Top },
              // 边框和白色背景
              $(
                go.Shape,
                { name: 'NodeShape', width: 178, height: 228, fill: '#fff' },
                new go.Binding('stroke', 'isHighlighted', h => (h ? '#9fb2c6' : '#dbdbdc')).ofObject()
              ),
              // 蓝色背景
              $(
                go.Panel, 'Auto',
                { name: 'NodePanel', width: 178, height: 88 },
                $(go.Shape, 'Rectangle', { strokeWidth: 0, fill: $(go.Brush, 'Linear', { start: go.Spot.Left, end: go.Spot.Right, 0: '#B0C1D5', 1: '#9DB1C5' }) })
              ),
              // 所有内容
              $(
                go.Panel, 'Vertical',
                { width: 178, height: 228 },
                $(
                  go.TextBlock,
                  { name: 'departmentName', font: '14px Microsoft YaHei', width: 178, height: 16, margin: new go.Margin(12, 0, 0, 0), stroke: '#fff', textAlign: 'center' },
                  new go.Binding('text', 'name')
                ),
                $(
                  go.TextBlock,
                  { name: 'departmentName', font: '12px Microsoft YaHei', width: 178, height: 14, margin: new go.Margin(5, 0, 0, 0), stroke: '#6F7882', textAlign: 'center' },
                  new go.Binding('text', 'props')
                ),
                // 头像
                $(
                  go.Panel, 'Spot',
                  { defaultAlignment: go.Spot.Center, margin: new go.Margin(10, 0, 0, 0) },
                  $(go.Shape, 'Circle', { width: 64, strokeWidth: 0, fill: '#fff' }),
                  $(
                    go.Panel, 'Spot',
                    { isClipping: true },
                    $(go.Shape, 'Circle', { width: 60, strokeWidth: 0 }),
                    $(
                      go.Picture,
                      { click: this.showTeam },
                      { width: 60, height: 60, cursor: 'pointer', sourceCrossOrigin: () => 'Anonymous' },
                      new go.Binding('source', 'avatar')
                    )
                  )
                ),
                $(
                  go.TextBlock,
                  { name: 'leaderName', font: '20px Microsoft YaHei', width: 178, height: 24, margin: new go.Margin(15, 0, 0, 0), stroke: '#333', textAlign: 'center' },
                  new go.Binding('text', 'chargeName')
                ),
                $(
                  go.TextBlock,
                  { name: 'leaderJob', font: '14px Microsoft YaHei', width: 178, height: 16, margin: new go.Margin(8, 0, 0, 0), stroke: '#999', textAlign: 'center' },
                  new go.Binding('text', 'chargeJob')
                ),
                // 管辖部门和管辖人数
                $(
                  go.Panel, 'Horizontal',
                  {
                    margin: new go.Margin(15, 0, 0, 0),
                    defaultAlignment: go.Spot.Center,
                    cursor: 'pointer',
                  },
                  $(
                    go.Panel, 'Horizontal',
                    { click: this.showOrg },
                    { margin: new go.Margin(0, 10, 0, 0) },
                    $(
                      go.Picture,
                      { width: 16, height: 16, background: 'transparent', source: this.orgPic }
                    ),
                    $(
                      go.TextBlock,
                      { font: '16px Microsoft YaHei', margin: new go.Margin(3, 0, 0, 8), stroke: '#999', textAlign: 'center' },
                      new go.Binding('text', 'orgCount')
                    )
                  ),
                  $(
                    go.Panel, 'Horizontal',
                    { click: this.showTeam },
                    { margin: new go.Margin(0, 0, 0, 10) },
                    $(
                      go.Picture,
                      { width: 20, height: 20, background: 'transparent', source: this.groupPic }
                    ),
                    $(
                      go.TextBlock,
                      { font: '16px Microsoft YaHei', margin: new go.Margin(3, 0, 0, 8), stroke: '#999', textAlign: 'center' },
                      new go.Binding('text', 'userCount')
                    )
                  )
                )
              )
            ),
            $('TreeExpanderButton')
          )

        myDiagram.linkTemplate = $(
          go.Link,
          { selectable: !1, routing: go.Link.Orthogonal, corner: 1 },
          $(go.Shape, { strokeWidth: 1, stroke: '#D8D8D8' })
        )
        const model = $(go.TreeModel)
        model.nodeDataArray = this.graphData
        myDiagram.model = model
      },
      // 让超出viewPort的节点居中显示
      makePosCenter() {
        if (this.graphData[0].key) {
          const { x } = myDiagram.findNodeForKey(this.graphData[0].key).position
          myDiagram.scrollToRect(new go.Rect(x, 0, 100, 100))
        }
      },
      // 展示两层
      showLevel2() {
        myDiagram.findTreeRoots().each((n) => {
          n.collapseTree(2)
        })
      },
      // 高光显示当前节点
      showHighLight(node) {
        const { diagram } = node
        diagram.startTransaction('highlight')
        diagram.clearHighlighteds()
        node.isHighlighted = true
        diagram.commitTransaction('highlight')
      },
      // 显示当前团队人员组成
      showTeam(e, t) {
        // 权限检测
        if (!this.$permission.valid('1030001,1030002')) {
          return undefined
        }

        const { userCount } = t.part.data
        if (Number(userCount) === 0) {
          this.$message.error('该组织暂无员工！')
        } else {
          this.$emit('showTeam', t.part.data)
        }

        return true
      },
      // 显示当前
      showOrg(e, t) {
        this.$emit('showOrg', t.part.data)
      },
      // 更新canvas
      updatedDiagram() {
        const model = $(go.TreeModel)
        model.nodeDataArray = this.graphData
        myDiagram.model = model
        if (this.once) {
          this.once = false
          this.showLevel2()
        }
        setTimeout(() => {
          this.makePosCenter()
        }, 1000)
      },
      // 导出数据为图片
      exportImages() {
        const nodeLevels = this.graphData.map(item => Number(item.level))
        nodeLevels.sort((x, y) => (x - y))
        // 统计出每个level的总个数
        const res = []
        for (let i = 0; i < nodeLevels.length;) {
          let count = 0
          for (let j = i; j < nodeLevels.length; j += 1) {
            if (nodeLevels[i] === nodeLevels[j]) {
              count += 1
            }
          }
          res.push({ level: nodeLevels[i], count: count })
          i += count
        }
        const maxCount = res.map(item => item.count).sort((x, y) => (x - y)).pop()
        const scale = maxCount > 50 ? 0.8 : 1
        console.log(maxCount, scale)
        // levels allLevel size 以下3个注释不要删除，人为计算导出尺寸。 为了兼容特大数据删除
        // const levels = res.map(item => item.level).sort((x, y) => (x - y))
        // const allLevel = (levels[levels.length - 1] - levels[0]) + 1
        const imgURl = myDiagram.makeImageData({
          type: 'image/jpeg',
          details: 1,
          maxSize: new go.Size(Infinity, Infinity),
          // size: new go.Size(((maxCount * this.nodeWidth) + 50), allLevel * this.nodeHeight),
          padding: new go.Margin(50, 50, 50, 50),
          scale,
          background: '#fff',
        })
        const link = document.createElement('a')
        link.href = imgURl
        link.download = `organization_${new Date().getTime()}`
        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        link.dispatchEvent(event)
      },
    },
  }
</script>


<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .graph {
    color: #fff;
    width: 100%;
    outline: none;

    #myDiagramDiv {
      height: calc(100vh - 188px - 17px);
    }

    canvas {
      outline: none;
    }
  }
</style>
