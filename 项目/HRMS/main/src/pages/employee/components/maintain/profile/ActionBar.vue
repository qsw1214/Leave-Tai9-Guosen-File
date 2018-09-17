<template>
  <div class="operation">

    <router-link to="/maintain/create">
      <el-button
        icon="el-icon-plus"
        style="margin-right: 10px;"
        v-if="isCreated">继续新建
      </el-button>
    </router-link>

    <el-button
      @click="toggleCollapse('all')">{{ fold.all ? '全部折叠' : '全部展开' }}
    </el-button>

    <el-button
      icon="el-icon-caret-left"
      v-if="!isCreated && !isInfo"
      :disabled="!isPrev"
      @click="clickPrev">上一条
    </el-button>

    <el-button
      v-if="!isCreated && !isInfo"
      :disabled="!isNext"
      @click="clickNext">下一条<i class="el-icon-caret-right el-icon--right" />
    </el-button>

  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ActionBar',

    props: {
      // 折叠项
      fold: {
        type: Object,
        default: () => {},
      },

      id: {
        type: String,
        default: '',
      },

      isCreated: {
        type: Boolean,
        default: false,
      },

      isInfo: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      ...mapState({
        ids: state => state.employee.ids,
      }),
      detailsIndex() {
        if (!this.id) return -1
        return this.ids.findIndex(id => id === this.id)
      },
      isPrev() {
        if (this.detailsIndex > 0) return true
        return false
      },
      isNext() {
        if (this.detailsIndex < this.ids.length - 1) return true
        return false
      },
    },

    created() {
    },

    methods: {
      clickPrev() {
        const id = this.ids[this.detailsIndex - 1]
        this.$router.push({
          path: `/maintain/profile/${id}`,
        })
      },

      clickNext() {
        const id = this.ids[this.detailsIndex + 1]
        this.$router.push({
          path: `/maintain/profile/${id}`,
        })
      },

      // 折叠或展开
      toggleCollapse(type) {
        this.$emit('toggleCollapse', type)
      },
    },
  }
</script>
