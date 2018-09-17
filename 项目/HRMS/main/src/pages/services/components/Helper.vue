<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="page page-helper">

    <m-breadcrumb :items="breadcrumb" />

    <div class="page--content">
      <el-dropdown
        placement="bottom"
        v-if="data.length > 0"
        @command="dropdownCommand">
        <div class="dropdown-trigger">
          <el-button
            type="text">
            {{ currentType.channel_name }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in data"
            :key="'type-' + index"
            :command="item.channel_id">
            {{ item.channel_name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div
        class="content-body no-data"
        v-if="data.length === 0">暂无数据</div>

      <!--- 主要内容 -->
      <div
        class="content-body"
        v-if="data.length > 0">

        <!--- 问题列表 -->
        <div
          class="list-container"
          v-show="!isShowDetails">
          <el-input
            class="search"
            placeholder="输入问题关键字搜索"
            v-model="keyword"
            @keyup.enter.native="search">
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="search" />
          </el-input>

          <ul>
            <li v-if="pageQuestionList.length === 0">暂无数据</li>
            <li
              class="question-item"
              v-for="(item, index) in pageQuestionList"
              :key="'question-' + index">
              <span
                class="question-name"
                @click="clickQuesion(item)">{{ item.question }}</span>
            </li>
          </ul>

          <div
            class="pagination-container"
            v-if="data.length > 0">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="pageIndex"
              :page-sizes="[20, 50, 100]"
              :page-size="pageSize"
              :total="questionList.length"
              @size-change="changePageSize"
              @current-change="changePageIndex" />
          </div>
        </div>

        <!--- 问题详情 -->
        <div
          class="details-container"
          v-if="isShowDetails">
          <div class="return-list">
            <el-button
              type="text"
              icon="el-icon-arrow-left"
              @click="handlerClick('return')">返回列表
            </el-button>
          </div>

          <div class="details-title">问题：{{ currentQuestion.question }}</div>
          <div class="details-title">办事指南</div>

          <div
            class="details-answer"
            ref="answer"
            :class="{'overflow': !isOpennAnswer}"
            v-html="currentQuestion.answer.replace(/\n/g, '<br/>')" />

          <el-button
            type="text"
            size="medium"
            v-if="isShowOpenAnswerAll && !isOpennAnswer"
            @click="handlerClick('answerOpen')">全文展开</el-button>

          <el-button
            type="text"
            size="medium"
            v-if="isShowOpenAnswerAll && isOpennAnswer"
            @click="handlerClick('answerShrink')">收起</el-button>

          <div class="detials-annexs">
            <div class="details-title">附件列表</div>
            <m-attachment
              :download-all-fn="downloadAll"
              :data="currentQuestion.aids" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
  * @description 在线HR小助手
  * @router /helper
  */

  export default {
    name: 'Helper',
    data() {
      return {
        data: [],
        currentType: {},
        currentQuestion: {},
        questionList: [],
        breadcrumb: [
          { name: '员工自助' },
          { name: '在线HR小助手', to: '/helper' },
        ],
        pageIndex: 1,
        pageSize: 20,
        loading: false,
        keyword: '',
        // 是否显示问题详情
        isShowDetails: false,
        // 是否显示办事指南全文展开按钮
        isShowOpenAnswerAll: false,
        // 是否展开办事指南
        isOpennAnswer: false,
      }
    },
    computed: {
      pageQuestionList() {
        return this.questionList
          .slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      },
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        this.loading = true
        this.$axios({
          url: this.$api.services.helper.list,
        }).then(({ data }) => {
          const { id } = this.$route.query
          const { list } = data

          this.loading = false
          this.data = list
          this.currentType = id
            ? list.filter(item => item.channel_id === id)[0] || this.data[0]
            : this.data[0]
          this.questionList = this.currentType.childer
        }).catch(() => {
          this.loading = false
        })
      },
      // 问题下拉选中回调
      dropdownCommand(id) {
        this.currentType = this.data.filter(item => item.channel_id === id)[0]
        this.pageIndex = 1
        this.keyword = ''
        this.isShowDetails = false
        this.questionList = this.currentType.childer
      },
      // 查看问题详细
      clickQuesion(item) {
        this.currentQuestion = item
        this.isShowDetails = true
        this.isShowOpenAnswerAll = true
        // 先收缩页面，页面中有图片，需要等待300ms图片加载完成再判断高度
        const needAwait = item.answer.includes('<img')
        const callback = () => {
          if (this.$refs.answer.clientHeight < 120) {
            this.isShowOpenAnswerAll = false
            this.isOpennAnswer = true
          }
        }
        if (needAwait) setTimeout(callback, 300)
        else this.$nextTick(callback)
      },
      // 关键字查找
      search() {
        this.questionList = this.$utils.tools
          .arraySearch(this.currentType.childer, ['question'], this.keyword.trim())
      },
      changePageSize(value) {
        this.pageIndex = 1
        this.pageSize = value
      },
      changePageIndex(value) {
        this.pageIndex = value
      },
      // 点击类型事件
      handlerClick(type) {
        switch (type) {
        case 'return':
          this.isShowDetails = false
          this.isShowOpenAnswerAll = false
          this.isOpennAnswer = false
          break
        case 'answerOpen':
          this.isOpennAnswer = true
          break
        case 'answerShrink':
          this.isOpennAnswer = false
          break
        default:
          break
        }
      },
      // 下载全部附件
      downloadAll() {
        this.$axios({
          url: this.$api.services.helper.downloadAll,
          method: 'post',
          data: {
            id: this.currentQuestion.id,
          },
        }).then((data) => {
          if (data.code === 0) {
            this.$utils.tools.windowOpen(data.data.url)
          }
        }).catch(() => {})
      },
    },
  }
</script>

<style lang="scss" type="text/scss">
.page-helper {
  .no-data {
    font-size: 16px;
  }

  .page--content {
    .dropdown-trigger {
      font-size: 16px;
      color: #5090f7;
      line-height: 36px;
      height: 36px;
      border: 1px solid #e9e9e9;
      border-bottom: 0;
      background-color: #fff;
      min-width: 120px;
      padding: 0 20px;
    }

    .content-body {
      border: 1px solid #e9e9e9;
      background-color: #fff;
      margin-top: -1px;
      padding: 14px;
    }

    .list-container {
      .search {
        width: 260px;
      }

      & > ul {
        min-height: 200px;
        font-size: 16px;
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          margin-top: 14px;
          line-height: 24px;
          position: relative;

          &.question-item {
            padding-left: 16px;

            &::before {
              position: absolute;
              content: '·';
              left: 0;
              font-size: 24px;
              color: #999;
              top: 1px;
            }
          }

          .question-name {
            cursor: pointer;

            &:hover {
              color: #5090f7;
            }
          }
        }
      }
    }

    .details-container {
      .details-title {
        font-weight: 600;
        margin-top: 14px;
      }

      .details-answer {
        padding-top: 14px;
        line-height: 30px;
        padding-right: 20px;
        margin-bottom: 14px;

        &.overflow {
          position: relative;
          overflow-y: hidden;
          max-height: 120px;

          &::after {
            content: "";
            display: block;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 2em;
            background: linear-gradient(360deg, #fff 5%, rgba(255, 255, 255, 0) 100%);
          }
        }
      }

      .detials-annexs {
        .details-title {
          margin-bottom: 8px;
        }

        .btn-download-all {
          margin-bottom: 8px;
          font-size: 14px;
        }
      }
    }

    .pagination-container {
      margin-top: 20px;
    }
  }
}
</style>
