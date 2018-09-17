<template>
  <div class="tag-multiple">
    <el-tag
      v-for="(item, index) in showTags"
      :key="'tag-multiple-item' + index">
      <span
        class="tag-multiple--item"
        v-for="(attr, jIndex) in attrs"
        :class="{'tag-multiple--item_ellipsis': !attr.all}"
        :key="'tag-multiple-span' + jIndex">
        <template v-if="attr.render">
          <i :title="attr.render(item, attr)">{{ attr.render(item, attr) }}</i>
        </template>
        <template v-else>
          <i :title="item[attr.key || attr]">{{ item[attr.key || attr] }}</i>
        </template>
      </span>
    </el-tag>
    <span
      class="el-icon-zoom-in"
      v-if="data.length > 3"
      @click="previewMore" />
  </div>
</template>

<script>
  export default {
    name: 'TagMultiple',
    props: {
      /*
      * 字符串和对象混合数组
      * 例：attrs = [
          'name',
          {
            key: 'code', //对象属性key值
            all: true, //是否显示全部，不带省略号
            render: Function // 输出处理函数
          }
        ]
      */
      attrs: {
        type: Array,
        default() {
          return ['name']
        },
      },
      data: {
        type: Array,
        default: () => ([]),
        required: true,
      },
    },
    computed: {
      showTags() {
        return this.data.slice(0, 3)
      },
    },
    methods: {
      // 预览更多回调
      previewMore() {
        this.$emit('more', this.data)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tag-multiple {
    line-height: 1;
    margin-bottom: -4px;

    .el-icon-zoom-in {
      cursor: pointer;
      vertical-align: top;
      height: 24px;
      line-height: 24px;
      margin-bottom: 4px;
    }

    .el-tag {
      min-width: 80px;
      width: auto;
      height: auto;
      margin: 0 4px 4px 0;
      line-height: 1;
      text-align: center;
    }

    &--more {
      cursor: pointer;
      margin-top: 5px;
      margin-bottom: 5px;
      vertical-align: top;
    }

    &--item {
      display: inline-block;
      vertical-align: middle;
      line-height: 22px;

      i {
        font-style: normal;
      }
    }

    &--item_ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60px;
    }
  }
</style>
