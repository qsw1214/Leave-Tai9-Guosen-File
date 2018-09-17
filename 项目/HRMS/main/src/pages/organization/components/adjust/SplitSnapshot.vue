<template>
  <div
    class="organization-adjust--panel">

    <div class="organization-adjust--panel-box">
      <div class="page-adjust--box">
        <div class="page-adjust--box-item">
          <div class="page-adjust--box-label">被拆分组织</div>
          <el-input
            style="width: 260px;"
            disabled
            v-model="from.pname" />
        </div>

        <div class="page-adjust--box-item spliter">
          <m-icon-next />
        </div>

        <div class="page-adjust--box-item">
          <div class="page-adjust--box-label">拆分后组织</div>
          <div style="width: 260px;" />
        </div>
      </div>
    </div>

    <div
      class="page-adjust--box receive-panel"
      v-show="to.length">

      <div class="page-adjust--box-item" />
      <div class="page-adjust--box-item spliter" />

      <ul class="page-adjust--box-item receive-panel--list">
        <li
          class="receive-panel--item"
          v-for="(panel, index) in to"
          :key="index"
          :class="{
            'is-active': activedReceivePanel === index,
          }"
          @click="activedReceivePanel = index">
          {{ panel.pname }}
        </li>
      </ul>
    </div>


    <div class="transfer-container disabled">
      <el-transfer
        filterable
        :class="{
          'is-active': (typeof activedReceivePanel === 'number')
        }"
        v-model="to[activedReceivePanel].child_names"
        :titles="transferTitle"
        :data="fromArray[activedReceivePanel]" />

      <div
        class="btn-hack is-disabled">
        <el-button
          class="botton-right"
          disabled
          plain>
          <m-icon-next />
        </el-button>
        <el-button
          class="botton-left"
          disabled
          plain>
          <m-icon-next />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SplitSnapshot',
    props: {
      panel: {
        type: Object,
        required: true,
      },
    },

    data() {
      const { from, to } = this.panel
      from.child_names = from.child_names.map(it => ({ key: it, label: it, disabled: true }))

      const fromArray = to.map((item) => {
        const res = JSON.parse(JSON.stringify(from.child_names))
        const toArray = item.child_names.map(it => ({ key: it, label: it, disabled: true }))

        return res.concat(toArray)
      })

      return {
        transferTitle: ['成员列表', '接收列表'],
        from,
        fromArray,
        to,
        activedReceivePanel: 0,
      }
    },
  }
</script>
