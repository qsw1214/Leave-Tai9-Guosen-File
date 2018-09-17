<template>
  <transition name="el-zoom-in-top">
    <div class="dropmenu2--wrap">
      <div class="dropmenu">
        <div class="dropmenu--search">
          <el-input
            placeholder="输入字段名称搜索"
            icon="search"
            v-model="keyword"
            :on-icon-click="filterHead"
            @input="inputField"
            @keyup.enter.native= "filterHead" />
        </div>
        <div
          class="dropmenu--default"
          v-if="!isSearch">
          <div
            class="node"
            v-for="(head, pos) in headOptions"
            :key="pos">
            <div
              class="node--title"
              @click="expandNode(pos, head.isOpen)">
              <span class="icon icon--expand">{{ head.isOpen ? '-' : '+' }}</span>
              <span @click.stop="chooseSubALlNode(pos)">{{ head.name }}</span>
            </div>
            <div
              class="node--child"
              v-if="head.isOpen">
              <template v-for="(sub, index) in head.sub" >
                <p
                  v-if="sub.isVisible"
                  :key="index">
                  <el-checkbox
                    :value="sub.isChoose"
                    @change="toggleChoose(sub, pos, index)">{{ sub.name }}</el-checkbox>
                </p>
              </template>
            </div>
          </div>
        </div>
        <div
          class="dropmenu--default dropmenu--search__body"
          v-else>
          <div v-if="hasSearchResult">
            <div
              class="node"
              v-for="(head, pos) in searchOptions"
              v-if="head.hasKeyword"
              :key="pos">
              <div class="node--title">
                <span class="icon icon--expand">-</span>
                <span>{{ head.name }}</span>
              </div>
              <div class="node--child">
                <template v-for="(sub, index) in head.sub" >
                  <p
                    v-if="sub.isVisible"
                    :key="index">
                    <el-checkbox
                      :value="sub.isChoose"
                      @change="toggleSearchChoose(sub)">{{ sub.name }}</el-checkbox>
                  </p>
                </template>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="empty">没有包含关键字'<span>{{ copyKeyword }}</span>'的字段</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'FieldDropMenu',
    data() {
      return {
        keyword: '',
        copyKeyword: '',
        isSearch: false,
      }
    },
    computed: {
      hasSearchResult() {
        return this.searchOptions.filter(options => options.hasKeyword).length > 0
      },
      searchOptions() {
        return this.$store.getters.searchOptions(this.copyKeyword)
      },
      ...mapGetters({
        headOptions: 'getHeadOptions',
      }),
    },
    methods: {
      toggleChoose(sub, pos, index) {
        const bool = !sub.isChoose
        this.$store.dispatch('choose_head_options', { bool, pos, index })
      },
      toggleSearchChoose(sub) {
        const { pos, index } = sub
        this.toggleChoose(sub, pos, index)
      },
      expandNode(pos, bool) {
        const field = 'isOpen'
        this.$store.dispatch('toggle_head_options', { pos, field, fieldValue: !bool })
      },
      chooseSubALlNode(pos) {
        const field = 'isOpen'
        this.$store.dispatch('toggle_head_options', { pos, field, fieldValue: true })
        this.$store.dispatch('choose_sub_all_node', { pos })
      },
      filterHead() {
        if (this.keyword === '') {
          this.isSearch = false
          this.copyKeyword = ''
        } else {
          this.isSearch = true
          this.copyKeyword = this.keyword
        }
      },
      inputField() {
        if (this.keyword === '') this.isSearch = false
      },
    },
  }
</script>


<style lang="scss">
  .dropmenu2--wrap {
    width: 300px;
    height: 500px;
    border: 1px solid #b3b3b3;
    background-color: #fff;
    box-sizing: border-box;

    .dropmenu {
      position: relative;
      padding-top: 54px;

      &--search {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid #b3b3b3;
      }

      &--default {
        height: 444px;
        overflow-y: scroll;

        .empty {
          text-align: center;
          color: #333;

          span {
            color: #666;
          }
        }
      }
    }

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
        .el-checkbox__label {
          font-weight: normal;
        }

        p {
          padding-left: 35px;
          padding-right: 10px;
          padding-top: 4px;
          min-height: 28px;
          line-height: 1;
          margin: 0;

          label {
            cursor: pointer;
          }

          &:hover {
            background: #ccc;
          }
        }
      }
    }
  }
</style>
