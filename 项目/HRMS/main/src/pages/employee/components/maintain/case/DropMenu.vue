<template>
  <transition name="el-zoom-in-top">
    <div
      class="dropmenu--wrap"
      v-if="show">
      <div
        class="dropmenu"
        ref="dropMenu">
        <div
          class="dropmenu--search"
          v-if="isSearch">
          <el-input
            placeholder="请选择日期"
            icon="search"
            v-model="input2"
            :on-icon-click="handleIconClick" />
        </div>
        <div class="dropmenu--default">
          <div
            class="node"
            v-for="(condition, pos) in conditionOptions"
            :key="pos">
            <div
              class="node--title"
              @click="expandNode(pos, condition.isOpen)">
              <span class="icon icon--expand">{{ condition.isOpen ? '-' : '+' }}</span>
              <span>{{ condition.name }}</span>
            </div>
            <div
              class="node--child"
              v-if="condition.isOpen">
              <template v-for="(sub, index) in condition.sub" >
                <p
                  :key="index"
                  @click="chooseItem(sub, pos, index)">{{ sub.name }}</p>
              </template>
            </div>
          </div>
        </div>
        <div
          class="dropmenu--search__body"
          v-if="isSearch">
          <div class="parent">
            <div class="parent--content">
              <span class="expand" />
              <span>个人信息</span>
            </div>
            <div class="child">
              <el-checkbox v-model="checked">备选项</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'DropMenu',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      isSearch: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        test: '',
        checked: true,
        input2: '',
      }
    },
    computed: mapGetters({
      conditionOptions: 'getConditionOptions',
    }),
    methods: {
      chooseItem(sub, pos, index) {
        const { field: oldField } = this.$parent.condition
        if (oldField === sub.field) return
        // 将默认选择数据重置为false&将刚选择的字段置为true
        this.$store.dispatch('choose_condition_options', { oldField, pos, index })
        // 告知外部数据
        this.$emit('choose', sub)
      },
      expandNode(pos, bool) {
        const field = 'isOpen'
        this.$store.dispatch('toggle_condition_options', { pos, field, fieldValue: !bool })
      },
    },
  }
</script>


<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
  .dropmenu--wrap {
    width: 100%;
    min-height: 150px;
    max-height: 320px;
    position: absolute;
    left: 0;
    top: 35px;
    z-index: 1001;
    border: 1px solid #b3b3b3;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
    margin: 5px 0;
    overflow-y: scroll;

    .node {
      min-height: 34px;

      &--title {
        font-size: 14px;
        line-height: 34px;
        color: #333;
        background: #fff;
        cursor: pointer;
        padding: 0 15px;

        &:hover {
          background: #ccc;
        }

        .icon {
          display: inline-block;
          width: 10px;
          font-size: 16px;
          margin-right: 0;
        }
      }

      &--child {
        p {
          padding: 10px 10px 10px 35px;
          min-height: 34px;
          line-height: 1.2;
          margin: 0;
          cursor: pointer;

          &:hover {
            background: #ccc;
          }
        }
      }
    }
  }
</style>
