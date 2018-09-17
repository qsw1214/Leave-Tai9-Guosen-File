<template>
  <section class="condition">
    <div
      class="switch"
      @click="toggle">
      <IconClose v-if="show" />
      <IconOpen v-else />
      <span>{{ show ? '收起' : '全部' }}条件</span>
    </div>
    <m-section
      is-form>
      <el-form
        class="m-section--form"
        label-width="120px"
        ref="approvalForm">

        <el-form-item
          style="margin-top: 15px; margin-bottom: 0;"
          label="已选条件列表">
          <span
            style="display: inline-block; vertical-align: top; line-height: 32px;"
            v-if="conditions.length === 0"
            :style="{ 'margin-bottom': show ? '14px' : '' }">不限</span>
          <div
            class="tags"
            v-else>
            <tag
              v-for="(item, key) in conditions"
              :key="key"
              :item="item"
              @remove="remove" />
          </div>
        </el-form-item>

        <template v-if="show">
          <el-form-item
            label="资料所属部门"
            key="orgs">
            <multiple-select
              multiple
              collapse-tags
              filterable
              size="medium"
              placeholder="默认不限"
              clearable
              v-model="orgs"
              @visible-change="visibleChange"
              @remove-tag="removeTag">
              <el-option
                v-for="item in data.orgs"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </multiple-select>
          </el-form-item>

          <el-form-item
            label="资料所属年份"
            key="years">
            <multiple-select
              multiple
              collapse-tags
              filterable
              clearable
              size="medium"
              placeholder="默认不限"
              v-model="years"
              @visible-change="visibleChange"
              @remove-tag="removeTag">
              <el-option
                v-for="item in data.years"
                :key="item.value"
                :label="item.name"
                :value="item.code" />
            </multiple-select>
          </el-form-item>

          <el-form-item
            style="margin-bottom: 0;"
            label="资料类型"
            key="types">
            <multiple-select
              multiple
              collapse-tags
              filterable
              clearable
              size="medium"
              placeholder="默认不限"
              v-model="types"
              @visible-change="visibleChange"
              @remove-tag="removeTag">
              <el-option
                v-for="item in data.types"
                :key="item.value"
                :label="item.name"
                :value="item.code" />
            </multiple-select>
          </el-form-item>
        </template>
      </el-form>
    </m-section>
  </section>
</template>

<script>
  import IconOpen from '../icon/IconOpen'
  import IconClose from '../icon/IconClose'
  import Tag from './Tag'

  export default {
    name: 'Condition',

    components: {
      IconOpen,
      IconClose,
      Tag,
    },

    props: {
      data: {
        type: Object,
        default: () => ({
          orgs: [],
          years: [],
          type: [],
        }),
      },
    },

    data() {
      return {
        show: false,
        orgs: [],
        years: [],
        types: [],
      }
    },

    computed: {
      conditions() {
        const orgs = this.data.orgs.filter(item => this.orgs.includes(item.id))
        const years = this.data.years.filter(item => this.years.includes(item.code))
        const types = this.data.types.filter(item => this.types.includes(item.code))
        return [...orgs, ...years, ...types]
      },
    },

    methods: {
      remove(item) {
        const { origin } = item
        const index = this[origin].indexOf(item)
        this[origin].splice(index, 1)

        this.$nextTick(() => {
          this.$emit('change')
        })
      },
      toggle() {
        this.show = !this.show
      },

      visibleChange(show) {
        if (!show) this.$emit('change')
      },

      removeTag() {
        this.$emit('change')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .condition {
    position: relative;

    .el-tag {
      display: none;
    }

    .m-section {
      margin: 0;
      border: none;

      .m-section--form {
        .el-form-item {
          margin: 0 0 15px 0;
        }
      }
    }

    .switch {
      position: absolute;
      right: 20px;
      cursor: pointer;
      line-height: 20px;
      top: 5px;
      color: #5090f7;
    }
  }
</style>
