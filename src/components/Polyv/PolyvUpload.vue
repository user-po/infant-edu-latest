<template>
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
  </el-upload>
</template>

<script>
export default {
  name: "PolyvUpload",
  data(){
    return {
      extraUploadData: {
        module_name: '课程',
        module_id: 0,
        file_usage: ''
      },
      fileList: [],
    }
  },
  methods:{
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
      if (this.form.currentFileUsages === '教案') {
        if (!this.accept.teachingPlanAccept.includes(ext.toUpperCase())) {
          this.$message({ message: '[教案] 上传文件限定PDF格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
          this.clear()
          return false
        }
      } else if (this.form.currentFileUsages === '教学视频') {
        if (!this.accept.teachingVideoAccept.includes(ext.toUpperCase())) {
          this.$message({ message: '[教学视频] 上传文件限定MP4格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
          this.clear()
          return false
        }
      } else if (this.form.currentFileUsages === '教学音频') {
        if (!this.accept.teachingAudioAccept.includes(ext.toUpperCase())) {
          this.$message({ message: '[教学音频] 上传文件限定MP3格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
          this.clear()
          return false
        }
      } else if (this.form.currentFileUsages === '辅助视频') {
        if (!this.accept.videoAccept.includes(ext.toUpperCase())) {
          this.$message({ message: '[辅助视频] 上传文件限定MP4格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
          this.clear()
          return false
        }
      } else if (this.form.currentFileUsages === '辅助照片') {
        if (!this.accept.pictureAccept.includes(ext.toUpperCase())) {
          this.$message({ message: '[辅助照片] 上传文件限定JPG,PNG格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
          this.clear()
          return false
        }
      } else if (this.form.currentFileUsages === '作业') {
        if (!this.accept.homeworkAccept.includes(ext.toUpperCase())) {
          this.$message({ message: '[作业] 上传文件限定PDF,JPG, JPEG, WEBP, PNG格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
          this.clear()
          return false
        }
      }
    },
    // 文件上传成功
    onSuccess(response, file, fileList) {
      this.$message.success('上传文件成功')
      setTimeout(() => { this.percentage = 0 }, 1000)
      this.clear()
      this.upLoadFileList.splice(0)
      this.teachingPlanFileList.splice(0)
      this.teachingVideoFileList.splice(0)
      this.teachingAudioFileList.splice(0)
      this.videoFileList.splice(0)
      this.pictureFileList.splice(0)
      this.homeworkFileList.splice(0)
      this.observeRecordFileList.splice(0)
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
  }
}
</script>

<style scoped>

</style>
