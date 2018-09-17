<template>
  <div class="m-attachment">
    <ul class="m-attachment--list">
      <li
        class="m-attachment--item"
        v-if="(data.length > 1) && isCanDownAll">

        <el-button
          type="text"
          class="download-all"
          @click="downloadAll">全部下载</el-button>
      </li>

      <li
        class="m-attachment--item"
        v-for="(item, index) in data"
        :key="'attachment-' + index">

        <span class="m-attachment--item-name">
          <i
            class="el-icon-picture-outline"
            v-if="isImage(item.name)" />
          <i
            class="el-icon-document"
            v-else />
          {{ item.name }}
        </span>
        <el-button
          type="text"
          v-if="isImage(item.name) && isCanPreview"
          @click="preview(item)">预览</el-button>
        <el-button
          type="text"
          @click="download(item)">下载</el-button>
      </li>
    </ul>

    <el-dialog
      title="预览图片"
      width="90%"
      :visible.sync="isPreview">
      <div class="dialog-preview">
        <img :src="`${currentFile.url}&token=${token}`">
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /*
  * 附件列表，只有图片类型附件才具有预览功能
  */
  export default {
    name: 'MAttachment',
    props: {
      data: {
        type: Array,
        default: () => ([]),
      },
      // eslint-disable-next-line vue/require-default-prop
      downloadAllFn: {
        type: Function,
      },
      isCanDownAll: {
        type: Boolean,
        default: true,
      },
      isCanPreview: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      const { token } = this.$utils.config.headers

      return {
        isPreview: false,
        currentFile: { url: '' },
        token,
        loading: false,
      }
    },

    methods: {
      preview(file) {
        this.currentFile = file
        this.isPreview = true
      },
      download(file) {
        const url = `${file.url}&token=${this.token}`
        this.$utils.tools.windowOpen(url)
      },
      isImage(name) {
        const regx = new RegExp(/\.(jpeg|jpg|png|gif)$/)
        return regx.test(name)
      },
      async downloadAll() {
        if (this.downloadAllFn) return this.downloadAllFn()

        this.loading = true
        await this.$axios
          .post(this.$api.common.attachmentsDownload, {
            aids: this.data.map(item => item.id).join(','),
          })
          .then(({ data }) => {
            this.$utils.tools.windowOpen(`${data.url}&token=${this.token}`)
          })
          .catch((error) => {
            console.dir(error)
          })
        this.loading = false

        return true
      },
    },
  }
</script>
