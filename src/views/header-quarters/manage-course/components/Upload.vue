<template>
  <div class="container">
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>上传课程资料</span>
      </div>
      <div id="title-divider" />
      <el-radio-group v-model="fileType" size="mini" style="margin-top: 20px;margin-left: 20px">
        <el-radio-button label="视频/音频" />
        <el-radio-button label="其他" />
      </el-radio-group>
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
            v-if="!(fileType === fileTypePolyv) "
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
          <el-upload
            v-else
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
        <br>
        <el-form-item label="选择文件用途" lable-height="30px" style="padding: 0px" prop="currentFileUsages">
          <el-select ref="select" v-model="form.currentFileUsages" placeholder="请选择" size="small" style="width: 120px">
            <el-option v-for="item in options_files_props" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <br>
        <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div>
          <el-tag v-if="currentFileName" :disable-transitions="true" :closable="true" size="small" @close="handleClose">{{ currentFileName }}</el-tag>
          <el-progress v-if="percentage!==0" style="margin-right: 24px;margin-top: 8px" :stroke-width="26" :text-inside="true" :percentage="percentage" />
        </div>
        <h6 style="margin: 0px;line-height: 1.2;margin-top: 15px">支持上传文件格式: 照片：jpg/jpeg/webp/png文件, 视频：mp4, 音频：mp3, 文档：pdf</h6>
        <div class="div-upload-detail-info">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="教案" name="teachingPlan">
              <el-badge slot="label" :value="teachingPlanFileList.length" class="item">
                <span>教案</span>
              </el-badge>
              <el-table :data="teachingPlanFileList" style="width: 100%" fit size="small" height="500">
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
                    <el-button slot="reference" type="text" size="small" @click="preview('教案',scope.row.name,scope.row.fileUrl)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="教学视频" name="teachingVideo">
              <el-badge slot="label" :value="teachingVideoFileList.length" class="item">
                <span>教学视频</span>
              </el-badge>
              <el-table :data="teachingVideoFileList" style="width: 100%" fit size="small" height="500">
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
                    <el-button slot="reference" type="text" size="small" @click="preview('教学视频',scope.row.name,scope.row.fileUrl)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="教学音频" name="audio">
              <el-badge slot="label" :value="teachingAudioFileList.length" class="item">
                <span>教学音频</span>
              </el-badge>
              <el-table :data="teachingAudioFileList" style="width: 100%" fit size="small" height="500">
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
                    <el-button slot="reference" type="text" size="small" @click="preview('教学音频',scope.row.name,scope.row.fileUrl)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="辅助视频" name="video">
              <el-badge slot="label" :value="videoFileList.length" class="item">
                <span>辅助视频</span>
              </el-badge>
              <el-table :data="videoFileList" style="width: 100%" fit size="small" height="500">
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
                    <el-button slot="reference" type="text" size="small" @click="preview('辅助视频',scope.row.name,scope.row.fileUrl)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="辅助照片" name="picture">
              <el-badge slot="label" :value="pictureFileList.length" class="item">
                <span>辅助照片</span>
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
                    <el-button slot="reference" type="text" size="small" @click="preview('辅助照片',scope.row.name,scope.row.fileUrl)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="作业" name="homework">
              <el-badge slot="label" :value="homeworkFileList.length" class="item">
                <span>作业</span>
              </el-badge>
              <el-table :data="homeworkFileList" style="width: 100%" fit size="small" height="500">
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
                    <el-button slot="reference" type="text" size="small" @click="preview('作业',scope.row.name,scope.row.fileUrl)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!--            <el-tab-pane label="观察记录表" name="observeRecord">-->
            <!--              <el-table :data="observeRecordFileList" style="width: 100%" fit size="small" height="500">-->
            <!--                <el-table-column-->
            <!--                  prop="insertTime"-->
            <!--                  label="上传日期"-->
            <!--                />-->
            <!--                <el-table-column-->
            <!--                  prop="name"-->
            <!--                  label="文件名"-->
            <!--                />-->
            <!--                <el-table-column-->
            <!--                  prop="usages"-->
            <!--                  label="文件用途"-->
            <!--                />-->
            <!--                <el-table-column fixed="right" label="操作">-->
            <!--                  <template slot-scope="scope">-->
            <!--                    <el-popconfirm-->
            <!--                      title="确定删除该文件？"-->
            <!--                      @onConfirm="deleteFile(scope.row.id)"-->
            <!--                    >-->
            <!--                      <el-button slot="reference" type="text" size="small">删除</el-button>-->
            <!--                    </el-popconfirm>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--              </el-table>-->
            <!--            </el-tab-pane>-->
          </el-tabs>

        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { formateSimple, formatTimeToServe } from '@/utils/date'
import { getInfo, del, uploadPolyvInfo } from '@/api/File'
import { setFileSetting, uploadFile, fileSetting } from '@/utils/poly'
export default {
  data: function() {
    return {
      fileTypePolyv: '视频/音频',
      fileType: '视频/音频',
      activeName: 'teachingPlan',
      action: this.$store.state.common.fileUploadUrl,
      dialogFormVisible: false,
      form: {
        currentFileUsages: ''
      },
      currentFilePage: 1,
      courseId: 0,
      currentFileName: '',
      percentage: 0,
      extraUploadData: {
        module_name: '课程',
        module_id: 0,
        file_usage: ''
      },
      fileList: [],
      teachingPlanFileList: [],
      teachingVideoFileList: [],
      teachingAudioFileList: [],
      videoFileList: [],
      showVideoPover: true,
      pictureFileList: [],
      homeworkFileList: [],
      observeRecordFileList: [],
      accept: {
        teachingPlanAccept: ['PDF'],
        teachingVideoAccept: ['MP4'],
        teachingAudioAccept: ['MP3'],
        videoAccept: ['MP4'],
        pictureAccept: ['JPG', 'JPEG', 'WEBP', 'PNG'],
        homeworkAccept: ['PDF', 'JPG', 'JPEG', 'WEBP', 'PNG']
      },
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
        }],
      rulesUpload: {
        currentFileUsages: [
          { required: true, message: '请先选择文件用途', trigger: 'change' }
        ]
      },
      fileUsagesList: [],
      upLoadFileList: [],
      currentFileVID: ''
    }
  },
  watch: {
    showSpecialRecordVideoPover: function(newValue) {
      this.$refs.video.pause()
    }
  },
  methods: {
    preview(type, name, fileUrl) {
      this.$emit('preview', type, name, fileUrl)
    },
    opened() {
      this.clear()
      this.upLoadFileList.length = 0
      this.currentFilePage = 1
      this.teachingPlanFileList.splice(0)
      this.teachingVideoFileList.splice(0)
      this.teachingAudioFileList.splice(0)
      this.videoFileList.splice(0)
      this.pictureFileList.splice(0)
      this.homeworkFileList.splice(0)
      this.observeRecordFileList.splice(0)
      this.queryFileList()
    },
    clear() {
      this.fileList.splice(0)
      this.percentage = 0
      this.currentFileName = ''
      if (this.fileType == this.fileTypePolyv) {
        this.$refs.PolyvUpload.clearFiles()
      } else {
        this.$refs.upload.clearFiles()
      }
    },
    uploadPolyDateInfo() {
      const form = {
        module_id: this.courseId,
        module_name: '课程',
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
        this.teachingPlanFileList.splice(0)
        this.teachingVideoFileList.splice(0)
        this.teachingAudioFileList.splice(0)
        this.videoFileList.splice(0)
        this.pictureFileList.splice(0)
        this.homeworkFileList.splice(0)
        this.observeRecordFileList.splice(0)
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
      this.fileList = fileList
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
        this.currentFilePage = 1
        this.upLoadFileList.length = 0
        this.currentFilePage = 1
        this.teachingPlanFileList.splice(0)
        this.teachingVideoFileList.splice(0)
        this.teachingAudioFileList.splice(0)
        this.videoFileList.splice(0)
        this.pictureFileList.splice(0)
        this.homeworkFileList.splice(0)
        this.observeRecordFileList.splice(0)
        this.queryFileList()
      })
    },
    teachingVideoPoverClose() {
      console.log('34123513345')
      this.$refs.teachingVideo.pause()
    },
    queryFileList() {
      const form = {
        module_id: this.courseId,
        module_name: '课程',
        curPage: this.currentFilePage
      }
      getInfo(form).then(response => {
        const { data, totalPageNum, errno } = response.data
        if (errno !== 0) {
          this.$message.error(data.msg)
          return
        }
        data?.forEach(item => {
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          if (item.file_usage === '教案') {
            this.teachingPlanFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          } else if (item.file_usage === '教学视频') {
            this.teachingVideoFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          } else if (item.file_usage === '教学音频') {
            this.teachingAudioFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          } else if (item.file_usage === '辅助视频') {
            this.videoFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          } else if (item.file_usage === '辅助照片') {
            this.pictureFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          } else if (item.file_usage === '作业') {
            this.homeworkFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          } else if (item.file_usage === '观察记录表') {
            this.observeRecordFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
          }
        })
        this.currentFilePage++
        if (this.currentFilePage <= totalPageNum) {
          this.queryFileList()
        } else {
          if (this.teachingPlanFileList.length > 0) {
            this.activeName = 'teachingPlan'
          } else if (this.teachingVideoFileList.length > 0) {
            this.activeName = 'teachingVideo'
          } else if (this.teachingAudioFileList.length > 0) {
            this.activeName = 'teachingAudio'
          } else if (this.videoFileList.length > 0) {
            this.activeName = 'video'
          } else if (this.pictureFileList.length > 0) {
            this.activeName = 'picture'
          } else if (this.homeworkFileList.length > 0) {
            this.activeName = 'homework'
          } else if (this.observeRecordFileList.length > 0) {
            this.activeName = 'observeRecord'
          }
          if (this.form.currentFileUsages !== '') {
            if (this.form.currentFileUsages === '教案') {
              this.activeName = 'teachingPlan'
            } else if (this.form.currentFileUsages === '教学视频') {
              this.activeName = 'teachingVideo'
            } else if (this.form.currentFileUsages === '教学音频') {
              this.activeName = 'teachingAudio'
            } else if (this.form.currentFileUsages === '辅助视频') {
              this.activeName = 'video'
            } else if (this.form.currentFileUsages === '辅助照片') {
              this.activeName = 'picture'
            } else if (this.form.currentFileUsages === '作业') {
              this.activeName = 'homework'
            } else if (this.form.currentFileUsages === '观察记录表') {
              this.activeName = 'observeRecord'
            }
          }
        }
      }).catch(error => {
        this.$message.error(`获取已上传课程资料失败,请稍后重试...${error}`)
      })
    },
    showUploadDialog(id) {
      console.log(id)
      this.dialogFormVisible = true
      this.courseId = id
      this.extraUploadData.module_id = id
      this.upLoadFileList.length = 0
      this.$nextTick(() => {
        this.courseTableData = []
      })
    },
    showEditUploadDialog(rawFormData) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(rawFormData)
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
