<template>
  <div class="container">
    <button @click="importExcel(false)">导入</button>
    <button @click="importExcel(true)">导大文件</button>
    <!--handleCompleted-->
    <div v-if="showImport">
      <m-import
        type="1"
        :is-big-file="isBigFile"
        :data="form"
        :query-progress-url="queryProgressUrl"
        :upload-excel-url="uploadExcelUrl"
        :template-download-url="templateDownloadUrl"
        :show-import.sync="showImport" />
    </div>
  </div>
</template>

<script>

  export default {
    name: 'PageIndex',

    data() {
      return {
        showImport: false,
        uploadExcelUrl: '',
        templateDownloadUrl: '',
        queryProgressUrl: '/user/import-result',
        isBigFile: false,
        form: { type: '1' },
      }
    },

    methods: {
      importExcel(bool) {
        this.showImport = true
        if (bool) {
          this.isBigFile = true
          this.templateDownloadUrl = '/user/download-template?type=1'
          this.uploadExcelUrl = '/user/import'
        } else {
          this.isBigFile = false
          this.templateDownloadUrl = '/org/download-template'
          this.uploadExcelUrl = '/org/import'
        }
      },
    },
  }
</script>
