<template>
  <div class="container">
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>上传营业执照</span>
      </div>
      <div id="title-divider" />
      <el-form ref="uploadForm" :rules="rulesUpload" class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <!--        <el-form-item label="资料名称" :label-width="formLabelWidth" style="padding: 0px">-->
        <!--          <el-input v-model="form.courseName" autocomplete="off" size="small" style="width: 180px" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="文件类型" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">-->
        <!--          <el-input v-model="form.courseID" autocomplete="off" size="small" style="width: 100px" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="上传者身份" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">-->
        <!--          <el-input v-model="form.courseID" autocomplete="off" size="small" style="width: 100px" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="上传者姓名" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">-->
        <!--          <el-input v-model="form.courseID" autocomplete="off" size="small" style="width: 100px" />-->
        <!--        </el-form-item>-->
        <el-form-item label="浏览文件" lable-height="30px" style="padding: 0px;">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="action"
            name="files"
            multiple
            :on-progress="onProgress"
            :data="extraUploadData"
            :limit="1"
            :show-file-list="false"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="fileOnChange"
            :on-success="onSuccess"
            :on-error="onError"
            :before-upload="beforeUpload"
            :on-exceed="onExceed"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button size="small" type="success" style="margin-left: 10px" @click="submitUpload">上传到服务器</el-button>
            <h5 style="margin: 0px;line-height: 1.2">只能上传jpg/jpeg/webp/png文件，且不超过10MB</h5>
          </el-upload>
        </el-form-item>
        <div>
          <el-tag v-if="currentFileName" :disable-transitions="true" :closable="true" size="small" @close="handleClose">{{ currentFileName }}</el-tag>
          <el-progress v-if="percentage!==0" style="margin-right: 24px;margin-top: 8px" :stroke-width="26" :text-inside="true" :percentage="percentage" />
        </div>
        <div class="div-upload-detail-info">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="营业执照" name="picture">
              <el-badge slot="label" :value="pictureFileList.length" class="item">
                <span>营业执照</span>
              </el-badge>
              <el-table :data="pictureFileList" style="width: 100%" fit size="small" height="500">
                <el-table-column
                  prop="insertTime"
                  label="上传日期"
                />
                <el-table-column
                  prop="name"
                  label="文件名"
                />
                <el-table-column
                  prop="usages"
                  label="文件用途"
                />
                <el-table-column fixed="right" label="操作">
                  <template slot-scope="scope">
                    <el-popconfirm
                      title="确定删除该文件？"
                      @onConfirm="deleteFile(scope.row.id)"
                    >
                      <el-button slot="reference" type="text" size="small">删除</el-button>
                    </el-popconfirm>
                    <el-button slot="reference" type="text" size="small" @click="preview('辅助照片',scope.row.name)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getInfo, del } from '@/api/File'
export default {
  data: function() {
    return {
      activeName: 'picture',
      action: this.$store.state.common.fileUploadUrl,
      dialogFormVisible: false,
      form: {
        currentFileUsages: '营业执照'
      },
      currentFilePage: 1,
      nurseryId: 0,
      currentFileName: '',
      percentage: 0,
      extraUploadData: {
        module_name: '营业执照',
        module_id: 0,
        file_usage: ''
      },
      fileList: [],
      showVideoPover: true,
      pictureFileList: [],
      options_files_props: [
        {
          label: '营业执照',
          value: '营业执照'
        }],
      accept: {
        teachingPlanAccept: ['PDF'],
        teachingVideoAccept: ['MP4'],
        teachingAudioAccept: ['MP3'],
        videoAccept: ['MP4'],
        pictureAccept: ['JPG', 'JPEG', 'WEBP', 'PNG'],
        homeworkAccept: ['JPG', 'JPEG', 'WEBP', 'PNG']
      },
      rulesUpload: {
        currentFileUsages: [
          { required: true, message: '请先选择文件用途', trigger: 'change' }
        ]
      },
      fileUsagesList: [],
      upLoadFileList: []
    }
  },
  watch: {
    showSpecialRecordVideoPover: function(newValue) {
      this.$refs.video.pause()
    }
  },
  methods: {
    preview(type, name) {
      console.log('preview')
      this.$emit('preview', type, name)
    },
    opened() {
      this.clear()
      this.upLoadFileList.length = 0
      this.currentFilePage = 1
      this.pictureFileList.splice(0)
      this.queryFileList()
    },
    clear() {
      this.percentage = 0
      this.currentFileName = ''
      this.$refs.upload.clearFiles()
    },
    // 文件数量超过限制
    onExceed(files, fileList) {
      this.$message.error('请先将选择的文件上传或删除')
    },
    // 移除文件上传列表
    handleClose() {
      console.log('点击关闭移除上传列表')
      this.clear()
    },
    // 文件上传之前
    beforeUpload(file) {
      const index = file?.name.lastIndexOf('.')
      const ext = file?.name.substr(index + 1)
      if (!this.accept.pictureAccept.includes(ext.toUpperCase())) {
        this.$message({ message: '[营业执照] 上传文件限定JPG,PNG,WEBP格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
        this.clear()
        return false
      }
    },
    // 文件上传成功
    onSuccess(response, file, fileList) {
      this.$message.success('上传文件成功')
      setTimeout(() => { this.percentage = 0 }, 1000)
      this.clear()
      this.upLoadFileList.splice(0)
      this.pictureFileList.splice(0)
      this.currentFilePage = 1
      this.queryFileList()
    },
    onError(err, file, fileList) {
      this.$message.error('文件上传失败,请重试')
      this.clear()
    },
    // 选择文件，文件上传成功
    fileOnChange(file, fileList) {
      if (file.status === 'ready') {
        this.currentFileName = file.name
      }
    },
    // 文件上传进度回调
    onProgress(event, file, fileList) {
      this.percentage = parseFloat(event.percent.toFixed(2))
      console.log('上传进度回调')
    },
    submitUpload() {
      this.extraUploadData.file_usage = this.form.currentFileUsages
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          console.log('上传文件')
          console.log(this.extraUploadData)
          this.$refs.upload.submit()
        } else {
          return false
        }
      })
    },
    deleteFile(rowId) {
      const form = { id: rowId }
      del(form).then(response => {
        console.log(response)
        const { data, errno, sqlerr } = response.data
        if ((errno === 0) && (sqlerr === 0)) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      }).catch(error => {
        this.$message.error(`抱歉,删除文件失败${error}`)
      }).finally(() => {
        this.upLoadFileList.splice(0)
        this.currentFilePage = 1
        this.upLoadFileList.length = 0
        this.currentFilePage = 1
        this.pictureFileList.splice(0)
        this.queryFileList()
      })
    },
    queryFileList() {
      const form = {
        module_id: this.nurseryId,
        module_name: '营业执照',
        curPage: this.currentFilePage
      }
      getInfo(form).then(response => {
        const { data, totalPageNum, errno } = response.data
        if (errno !== 0) {
          this.$message.error(data.msg)
          return
        }
        data?.forEach(item => {
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, usages: item.file_usage })
          if (item.file_usage === '营业执照') {
            this.pictureFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, usages: item.file_usage })
          }
        })
        this.currentFilePage++
        if (this.currentFilePage <= totalPageNum) {
          this.queryFileList()
        }
      }).catch(error => {
        this.$message.error(`获取已上传课程资料失败,请稍后重试...${error}`)
      })
    },
    showUploadDialog(id) {
      console.log(id)
      this.dialogFormVisible = true
      this.nurseryId = id
      this.extraUploadData.module_id = id
      this.upLoadFileList.length = 0
      this.$nextTick(() => {
        this.courseTableData = []
      })
    }
  }

}

</script>

<style  lang="scss" scoped>
//dialog 默认样式修改

::v-deep .el-dialog {
  width: 650px;
  border: solid 1px #797979;
  padding-bottom: 30px;
  .el-dialog__header, .el-dialog__footer {
    display: none;
  }
  .el-dialog__body {
    padding: 0px;
    width: 100%;
    height: 100%;
    .title {
      height: 36px;
      i {
        margin-left: 20px;
      }
      span {
        line-height: 40px;
        margin-left: 10px;
        font-weight: bold;
      }
    }
    #title-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }
    .foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
      margin-top: 20px;
    }
    .foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }
    .div-upload-detail-info{
      font-size: 12px;
      width: 600px;
      border: black 2px solid;
      border-radius: 5px;
      margin-top: 10px;
      margin-right: 24px;
    }
    .div-footer{
      margin-top: 30px;
      text-align: center;
    }
  }
}
.form{
  ::v-deep .el-form-item {
    margin-bottom: 0;
    line-height: 20px;
  }
  ::v-deep .el-form-item__label {
    padding: 2px 0 5px 0;
    font-weight: normal;
    line-height: 30px;
  }
}

</style>
