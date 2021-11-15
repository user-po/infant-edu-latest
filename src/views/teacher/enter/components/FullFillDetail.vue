<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>{{ title }}</span>
      </div>
      <div id="title-divider" />
      <el-collapse v-model="activeName" accordion>
        <!--        <el-collapse-item title="特别记录" name="1">-->
        <!--          <el-row type="flex" justify="start" :gutter="20" style="width: 600px;margin: 10px  ">-->
        <!--            <el-col :span="12" :offset="2">-->
        <!--              <template>-->
        <!--                <span>文字记录</span>-->
        <!--                <br>-->
        <!--                <el-input-->
        <!--                  type="textarea"-->
        <!--                  :rows="2"-->
        <!--                  placeholder="请输入内容"-->
        <!--                  :disabled="true"-->
        <!--                />-->
        <!--              </template>-->
        <!--            </el-col>-->
        <!--            <el-col :span="12" :offset="1">-->
        <!--              <template>-->
        <!--                <span>视频记录</span>-->
        <!--                <br>-->
        <!--                <el-button type="primary" icon="el-icon-video-camera">查看视频记录</el-button>-->
        <!--              </template>-->
        <!--            </el-col>-->
        <!--          </el-row>-->
        <!--        </el-collapse-item>-->
        <el-collapse-item title="落实情况记录表" name="1">
          <el-row type="flex" justify="start" style="margin-left: 20px;margin-top: 10px">
            <el-col :span="22">
              <el-table
                :data="courseTableData"
                border
                stripe
                size="mini"
                max-height="180px"
                style="width: 100%"
              >
                <el-table-column
                  prop="advise"
                  label="建议措施"
                  width="100"
                />
                <el-table-column
                  prop="measure"
                  label="落实措施"
                  width="300"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.measure" :disabled="!canEdit" size="small" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="isComplete"
                  label="是否完成"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.isComplete" size="small" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :disabled="!canEdit"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>

                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="落实详情文字记录" name="2">
          <template>
            <div class="div-detail">
              <el-popover
                v-if="flag==this.$store.state.common.DIALOGEDIT"
                v-model="showSpecialRecordVideoPover"
                placement="bottom"
                width="400"
                height="400"
                trigger="click"
              >
                <video ref="SpecialRecordVideo" controlsList="nodownload" style="width: 100%;height: 100%" :src="currentVideoSrc" controls />
                <el-button slot="reference" type="primary" :disabled="this.currentVideoSrc==''">{{ getSpecialRecordVideoText() }}</el-button>
              </el-popover>
              <el-button v-if="flag==this.$store.state.common.DIALOGEDIT" style="margin-left: 20px" type="primary" :disabled="this.currentPictureSrc== '' " @click="clickShowViewer">{{ getFullFillPictureText() }}</el-button>
              <el-input
                v-model="workable_detail"
                style="margin-top: 10px"
                :disabled="!canEdit"
                type="textarea"
                placeholder="请输入内容"
                maxlength="60"
                size="medium"
                show-word-limit
              />
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
      <div v-if="canEdit" class="div-footer">
        <el-button id="el-button-add" style="width: 140px;margin-bottom: 30px" size="small" @click="confirm">提交</el-button>
      </div>
      <el-image-viewer
        v-if="showViewer"
        ref="ImageViewer"
        :on-close="closeViewer"
        :url-list="[currentPictureSrc]"
      />
    </el-dialog>
  </div>
</template>

<script>
import { createMeasure } from '@/api/measure'
import { getInfo } from '@/api/File'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  components: {
    ElImageViewer
  },
  data() {
    return {
      showViewer: false,
      flag: this.$store.state.common.DIALOGSHOW,
      title: '',
      activeName: ['1', '2'],
      dialogFormVisible: false,
      canEdit: true,
      form: {
        courseName: '',
        courseID: '',
        gender: '',
        filesProps: '',
        classCheckList: []
      },
      currentID: 0,
      currentFilePage: 1,
      formLabelWidth: '40px',
      currentVideoSrc: '',
      currentPictureSrc: '',
      showSpecialRecordVideoPover: false,
      expertAdviseStaticListToTeacher: [],
      expertAdviseCheckListToTeacher: [],
      completeList: [],
      implement_list: [],
      upLoadFileList: [],
      measureId: 0,
      workable_detail: '',
      courseTableData: [],
      options: [{
        value: '0',
        label: '否'
      }, {
        value: '1',
        label: '是'
      }]
    }
  },
  methods: {
    // 新建教师落实情况记录
    showFullFillDetailDialog(transForm) {
      console.log(transForm)
      this.flag = this.$store.state.common.DIALOGSHOW
      this.canEdit = true
      this.dialogFormVisible = true
      this.title = '添加教师落实情况'
      this.measureId = transForm.id
      this.expertAdviseStaticListToTeacher = transForm.adviceListToTeacher
      this.workable_detail = ''
      // 初始化数据
      this.courseTableData.splice(0)
      for (let i = 0; i < this.expertAdviseStaticListToTeacher.length; i++) {
        if (this.expertAdviseStaticListToTeacher[i] !== '') {
          this.courseTableData.push({ advise: this.expertAdviseStaticListToTeacher[i], measure: '', isComplete: '否' })
        }
      }
    },
    // 显示家长教师落实详情
    showEditFullFillDetailDialog(transFormData) {
      this.flag = this.$store.state.common.DIALOGEDIT
      if (transFormData.role == '家长') {
        this.title = '家长落实情况记录'
      } else {
        this.title = '教师落实情况记录'
      }
      this.currentID = 0
      this.currentFilePage = 1
      this.upLoadFileList.splice(0)
      this.courseTableData.splice(0)
      this.currentPictureSrc = ''
      this.currentVideoSrc = ''
      this.canEdit = false
      const { adviceListToTeacher, adviceListToParent, data } = transFormData
      this.dialogFormVisible = true
      this.workable_detail = data.workable_detail
      if (transFormData.role == '家长') {
        this.expertAdviseStaticListToTeacher = adviceListToParent
      } else {
        this.expertAdviseStaticListToTeacher = adviceListToTeacher
      }
      console.log(transFormData)
      this.currentID = transFormData.data.id
      this.queryImplementFileList()
      const implementList = data.implement_list.split(',')
      const complete_list = data.complete_list.split(',')
      for (let i = 0; i < this.expertAdviseStaticListToTeacher.length; i++) {
        if (this.expertAdviseStaticListToTeacher[i] !== '') {
          this.courseTableData.push({ advise: this.expertAdviseStaticListToTeacher[i], measure: implementList[i], isComplete: complete_list[i] === '1' ? '是' : '否' })
        }
      }
    },
    confirm() {
      this.createNewAchieve()
    },
    cancel() {
      this.dialogFormVisible = false
    },
    clickShowViewer() {
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    queryImplementFileList() {
      const form = {
        module_id: this.currentID,
        module_name: '落实'
      }
      getInfo(form).then(response => {
        const { data, totalPageNum, errno } = response.data
        if (errno !== 0) {
          this.$message.error(data.msg)
          return
        }
        data?.forEach(item => {
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, usages: item.file_usage, file_type: item.file_type })
        })
        this.currentFilePage++
        if (this.currentFilePage <= totalPageNum) {
          this.queryImplementFileList()
        } else {
          if (this.upLoadFileList.length > 0) {
            if (this.upLoadFileList[0].file_type == 'video') {
              this.currentVideoSrc = this.$store.state.common.fileUrl + this.upLoadFileList[0].name
            } else {
              this.currentPictureSrc = this.$store.state.common.fileUrl + this.upLoadFileList[0].name
            }
          }
        }
      }).catch(error => {
        this.$message.error(`获取落实详情文件资料失败,请稍后重试...${error}`)
      })
    },
    getSpecialRecordVideoText() {
      if (this.currentVideoSrc != '') {
        return '查看视频记录'
      } else {
        return '暂无视频记录'
      }
    },
    getFullFillPictureText() {
      if (this.currentPictureSrc != '') {
        return '查看图片记录'
      } else {
        return '暂无图片记录'
      }
    },
    createNewAchieve() {
      const implementList = []
      const implementCompleteList = []
      this.courseTableData.forEach((item) => {
        implementCompleteList.push(item.isComplete)
        implementList.push(item.measure)
      })
      const form = { measures_id: this.measureId, role: '教师', workable_detail: this.workable_detail, implement_list: implementList.toString(), complete_list: implementCompleteList.toString() }
      createMeasure(form).then(response => {
        const { data } = response.data
        console.log(data)
      }).catch(error => {
        this.$message.error(`抱歉,新建教师落实措施失败 error${error}`)
      }).finally(() => {
        this.dialogFormVisible = false
      })
    }

  }
}
</script>

<style  lang="scss" scoped>
//dialog 默认样式修改

::v-deep .el-dialog {
  width: 590px;
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
    #title-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }
    .el-collapse{
      width: 100%;
      .el-collapse-item__header{
        color: #4C4C4C;
        font-weight: bold;
        padding-left: 20px;
      }
      .el-collapse-item__wrap{
        width: 100%;
        .el-collapse-item__content{
          position: relative;
          height: 100%;
          #el-button_info{
            position: absolute;
            right: 40px;
            bottom: 80px;
          }
          .div-detail{
            padding: 18px;
          }
        }
      }
    }
    .foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
    }
    .foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }

    .div-footer{
      margin-top: 13px;
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
    padding:5px 0;
    font-weight: normal;
    line-height: 30px;
  }
}
.div-footer{
  display: flex;
  margin-top: 20px;
  justify-content: space-evenly;
}

</style>

<!--修改dialog的全局样式-->
<style>

</style>
