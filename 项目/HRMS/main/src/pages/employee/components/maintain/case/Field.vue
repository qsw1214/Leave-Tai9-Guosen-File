<template>
  <div class="field">
    <div
      class="area"
      @click="open">
      <div
        class="name"
        v-if="condition.name"><span>{{ condition.name }}</span></div>
      <span
        class="placeholder"
        v-else>请选择</span>
      <i
        :class="[
          condition.showDropMenu ? 'is-reverse' : '',
          'el-input__icon',
          'el-icon-arrow-up'
        ]" />
    </div>
    <DropMenu
      :show="condition.showDropMenu"
      @choose= "choose" />
  </div>
</template>

<script>
  import DropMenu from './DropMenu'

  export default {
    name: 'Field',
    components: {
      DropMenu,
    },
    data() {
      return {}
    },
    computed: {
      condition() {
        return this.$store.getters.getConditionByIndex(this.$parent.index)
      },
    },
    methods: {
      // 打开下拉选择框
      open() {
        const bool = !this.condition.showDropMenu
        this.toggle(bool)
      },
      // 关闭下拉选择
      close() {
        this.toggle(false)
      },
      choose(sub) {
        // 更新选择项
        const { field } = sub
        let condition = {
          field,
          label: '',
          value: [],
        }
        const defaultCondition = this
          .$parent.$parent.$parent.$parent.$parent.$parent.$parent
          .staticCondition.filter(item => item.field === field)[0]
        condition = Object.assign({}, condition, defaultCondition, { showDropMenu: false })
        // todo.... 多了一个isChoose
        const { index } = this.$parent
        this.$store.dispatch('update_one_condition', { index, condition })
        this.close()
      },
      toggle(bool) {
        if (bool) {
          window.addEventListener('click', this.check)
        } else {
          window.removeEventListener('click', this.check)
        }
        const { index } = this.$parent
        this.$store.dispatch('update_one_condition_field', { index, field: 'showDropMenu', fieldValue: bool })
      },
      // 关闭dropmenu
      check(e) {
        if (!this.$el.contains(e.target)) {
          this.close()
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .field {
    display: block;
    float: left;
    min-width: 120px;
    margin-right: 20px;
    position: relative;

    .area {
      position: relative;
      width: 260px;
      height: 34px;
      cursor: pointer;
      line-height: 34px;
      font-size: 14px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #d7d7d7;
      color: #333;
      padding: 0 10px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

      .name {
        width: 240px;
        height: 34px;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .placeholder {
        color: #999;
      }

      &:hover {
        border-color: #5090f7;
      }

      .el-input__icon {
        position: absolute;
        color: #999;
        font-size: 14px;
        transition: transform 0.3s;
        transform: rotateZ(180deg);
        line-height: 16px;
        top: 0;
        right: 5px;
        cursor: pointer;
      }

      .is-reverse {
        transform: rotateZ(0);
      }
    }
  }
</style>
