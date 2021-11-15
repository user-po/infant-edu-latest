<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>上传课程资料</span>
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
          <!--          <el-upload
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
          </el-upload>-->
          <el-upload
            ref="PolyvUpload"
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
            :http-request="uploadPolyv"
          >
            <el-button slot="trigger" size="small" type="primary">选取视频/音频文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择文件用途" lable-height="30px" style="padding: 0px" prop="currentFileUsages">
          <el-select ref="select" v-model="form.currentFileUsages" :disabled="true" placeholder="请选择" size="small" style="width: 120px">
            <el-option v-for="item in options_files_props" :key="item.value" :disabled="true" :label="item.label" :value="item.value" />
          </el-select>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-form-item>
        <div>
          <el-tag v-if="currentFileName" :disable-transitions="true" :closable="true" size="small" @close="handleClose">{{ currentFileName }}</el-tag>
          <el-progress v-if="percentage!==0" :percentage="percentage" />
        </div>
        <h6 style=" color:red;margin: 0px;line-height: 1.2;margin-top: 15px">支持上传文件格式MP4</h6>
        <div class="div-upload-detail-info">
          <el-table :data="upLoadFileList" style="width: 100%" fit size="small">
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
              </template>
            </el-table-column>
          </el-table>
        </div>
        <h4>特别记录文字内容:</h4>
        <div class="div-upload-detail-info">
          <el-input v-model="specialRecordText" type="textarea" :rows="4" placeholder="请输入特别记录文字内容" />
        </div>
      </el-form>
      <div class="div-footer">
        <el-button id="el-button-submit" type="primary" style="width: 140px; margin-bottom: 30px" size="small" @click="confirm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formateSimple, formatTimeToServe } from '@/utils/date'
import { getInfo, del, uploadPolyvInfo } from '@/api/File'
import { fileSetting, setFileSetting, uploadFile } from '@/utils/poly'
export default {
  data: function() {
    return {
      fileTypePolyv: '视频/音频',
      fileType: '视频/音频',
      action: this.$store.state.common.fileUploadUrl,
      dialogFormVisible: false,
      form: {
        currentFileUsages: '特别记录'
      },
      currentFilePage: 1,
      scoreId: 0,
      currentFileName: '',
      specialRecordText: '',
      percentage: 0,
      extraUploadData: {
        module_name: '特别记录',
        module_id: 0,
        file_usage: ''
      },
      fileList: [],
      options_files_props: [
        {
          label: '教案',
          value: '教案'
        }, {
          label: '教学视频',
          value: '教学视频'
        }, {
          label: '教学音频',
          value: '教学音频'
        }, {
          label: '辅助视频',
          value: '辅助视频'
        }, {
          label: '辅助照片',
          value: '辅助照片'
        }, {
          label: '作业',
          value: '作业'
        }, {
          label: '观察记录表',
          value: '观察记录表'
        }, {
          label: '特别记录',
          value: '特别记录'
        }],
      rulesUpload: {
        currentFileUsages: [
          { required: true, message: '请先选择文件用途', trigger: 'change' }
        ]
      },
      fileUsagesList: [],
      upLoadFileList: [],
      accept: {
        teachingPlanAccept: ['PDF'],
        teachingVideoAccept: ['MP4'],
        teachingAudioAccept: ['MP3'],
        videoAccept: ['MP4'],
        pictureAccept: ['JPG', 'JPEG', 'WEBP', 'PNG'],
        homeworkAccept: ['PDF']
      },
      currentFileVID: ''
    }
  },
  methods: {
    uploadPolyDateInfo() {
      const form = {
        module_id: this.scoreId,
        module_name: '特别记录',
        file_name: this.currentFileName,
        file_url: this.currentFileVID,
        file_usage: this.form.currentFileUsages
      }
      uploadPolyvInfo(form).then(response => {
        const { data } = response.data
        this.$message.success(`同步文件信息成功`)
      }).catch(error => {
        this.$message.error(`抱歉,同步文件信息失败，请重新上传${error}`)
      }).finally(() => {
        this.clear()
        this.upLoadFileList.splice(0)
        this.currentFilePage = 1
        this.queryFileList()
      })
    },
    uploadPolyv() {
      console.log(this.fileList)
      let polyFile = null
      this.fileList.forEach(item => {
        setFileSetting(item.name, item.name)
        polyFile = item.raw
        this.currentFileName = item.name
      })
      const polyCallBack = {
        success: (data) => {
          console.log('上传成功')
          console.log(data)
          this.$message.success('上传文件成功')
          this.percentage = 0
          this.clear()
          this.currentFileVID = data.vid
          this.currentFileName = data.title
          this.uploadPolyDateInfo()
        },
        error: (data) => {
          console.log('上传失败')
          this.percentage = 0
          this.$message.error('抱歉，上传文件失败,请重试~')
        },
        progress: (size) => {
          console.log(`上传进度：${size}`)
          this.percentage = parseInt(size)
        }
      }
      console.log('1111111112333333')
      console.log(polyFile)
      uploadFile(polyFile, fileSetting, polyCallBack)
    },
    opened() {
      this.clear()
      this.upLoadFileList.length = 0
      this.queryFileList()
    },
    clear() {
      this.percentage = 0
      this.currentFileName = ''
      if (this.fileType == this.fileTypePolyv) {
        this.$refs.PolyvUpload.clearFiles()
      } else {
        this.$refs.upload.clearFiles()
      }
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
      if (this.upLoadFileList.length > 0) {
        this.$message({ message: '[特别记录] 上传或修改特别记录视频内容,请先删除文件列表已上传特别记录视频', type: 'error', duration: 6000 })
        return false
      }
      const index = file?.name.lastIndexOf('.')
      const ext = file?.name.substr(index + 1)
      if (!this.accept.teachingVideoAccept.includes(ext.toUpperCase())) {
        this.$message({ message: '[特别记录] 上传文件限定MP4格式,暂不支持其他格式文件,请重新选择', type: 'error', duration: 6000 })
        this.clear()
        return false
      }
    },
    // 文件上传成功
    onSuccess(response, file, fileList) {
      this.$message.success('上传文件成功')
      setTimeout(() => { this.percentage = 0 }, 1000)
      this.clear()
      this.upLoadFileList.length = 0
      this.queryFileList()
    },
    onError(err, file, fileList) {
      this.$message.error('文件上传失败,请重试')
      this.clear()
    },
    // 选择文件，文件上传成功
    fileOnChange(file, fileList) {
      console.log(file)
      console.log('fileList')
      console.log(fileList)
      if (file.status === 'ready') {
        this.currentFileName = file.name
      }
      this.fileList = fileList
    },
    // 文件上传进度回调
    onProgress(event, file, fileList) {
      this.percentage = event.percent.toFixed(2)
      console.log('上传进度回调')
      console.log(event)
      console.log(file)
      console.log(fileList)
    },
    submitUpload() {
      this.extraUploadData.file_usage = this.form.currentFileUsages
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          if (this.fileType === this.fileTypePolyv) {
            this.$refs.PolyvUpload.submit()
          } else {
            this.$refs.upload.submit()
          }
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
        this.queryFileList()
      })
    },
    queryFileList() {
      const form = {
        module_id: this.scoreId,
        module_name: '特别记录'
      }
      getInfo(form).then(response => {
        const { data, totalPageNum, errno } = response.data
        if (errno !== 0) {
          this.$message.error(data.msg)
          return
        }
        data?.forEach(item => {
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
        })
        this.currentFilePage++
        if (this.currentFilePage <= totalPageNum) {
          this.queryFileList()
        }
      }).catch(error => {
        this.$message.error(`获取已上传课程资料失败,请稍后重试...${error}`)
      })
    },
    showUploadDialog(data) {
      console.log(data)
      this.dialogFormVisible = true
      this.scoreId = data.score_id
      this.extraUploadData.module_id = data.score_id
      this.upLoadFileList.length = 0
      this.specialRecordText = data.special_record != 'null' ? data.special_record : ''

      this.$nextTick(() => {
        this.courseTableData = []
      })
    },
    showEditUploadDialog(rawFormData) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(rawFormData)
      })
    },
    confirm() {
      if (this.specialRecordText === '') {
        this.$message.error('请输入特别记录文字内容')
        return
      }
      // 暂不判断特别记录视频内容的上传
      // if (this.upLoadFileList.length === 0) {
      //   this.$message.error('请上传特别记录视频内容')
      //   return
      // }
      this.$emit('SpecialRecordUpload', this.specialRecordText)
    },
    cancel() {
      this.dialogFormVisible = false
    }
  }

}

</script>

<style  lang="scss" scoped>
//dialog 默认样式修改

::v-deep .el-dialog {
  width: 650px;
  border: solid 1px #797979;
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
    .el-table{
      font-size: 12px!important;
      th{
        padding: 0;
      }
      td{
        padding: 3px;
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
    h4{
      margin-top: 25px;
      margin-bottom: 3px;
    }
    .div-upload-detail-info{
      font-size: 12px;
      width: 600px;
      max-height: 800px;
      border: black 2px solid;
      border-radius: 5px;
      margin-top: 10px;
      margin-right: 24px;
      ul{
        list-style: none;
        padding-left: 0px;
        li{
          span:nth-child(1){
            margin-left: 8px;
          }
          span:nth-child(2){
            margin-left: 50px;
          }
          span:nth-child(3){
            margin-left: 150px;
          }
          &:hover{
            background-color: #20a0ff;
          }
        }
      }

    }
    .div-footer{
      margin-top: 18px;
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
    padding: 15px 0 5px 0;
    font-weight: normal;
    line-height: 30px;
  }
}

</style>
