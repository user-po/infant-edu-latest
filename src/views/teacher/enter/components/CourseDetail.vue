<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>课程详细信息</span>
      </div>
      <div id="title-divider" />
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="成绩" name="1">
          <el-row type="flex" justify="start" style="margin-left: 20px;margin-top: 10px">
            <el-col :span="22">
              <el-table
                :data="courseTableData"
                border
                size="mini"
                max-height="180px"
                :row-class-name="tableRowClassName"
                style="width: 100%"
              >
                <el-table-column
                  prop="order"
                  label="序号"
                  width="100"
                />
                <el-table-column
                  prop="name"
                  label="指标名称"
                  width="300"
                />
                <el-table-column
                  prop="score"
                  label="分数"
                  width="120"
                />
              </el-table>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="特别记录" name="2">
          <el-row v-if="getSpecialRecordStatus()" type="flex" justify="start" :gutter="20" style="width: 600px;margin: 10px  ">
            <el-col :span="14" :offset="2" style="margin-left: 10px">
              <template>
                <span>文字记录</span>
                <br>
                <el-input
                  v-model="specialRecordText"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  :disabled="true"
                />
              </template>
            </el-col>
            <el-col :span="6" :offset="1">
              <template>
                <span>视频记录</span>
                <br>
                <el-popover
                  v-model="showSpecialRecordVideoPover"
                  placement="bottom"
                  width="400"
                  height="400"
                  trigger="click"
                >
                  <div id="player1" />
                  <!--                  <video ref="SpecialRecordVideo" controlsList="nodownload" style="width: 100%;height: 100%" :src="currentVideoSrc" controls />-->
                  <el-button slot="reference" type="primary" :disabled="this.upLoadFileList.length == 0">{{ getSpecialRecordVideoText() }}</el-button>
                </el-popover>
              </template>
            </el-col>
          </el-row>
          <div v-else class="emptyContainer">
            <svg-icon icon-class="empty" />
            <p>暂无特别记录</p>
          </div>
        </el-collapse-item>
        <el-collapse-item title="专家分析" name="3">
          <template>
            <div class="div-span-title" />
            <div v-if="this.form.analysis !== 'null'" class="div-advise">
              <div>
                <span>专家分析:</span>
                <div class="div-advise-container">
                  <el-checkbox-group v-model="expertAnalysisAdviseCheckList">
                    <el-checkbox v-for="item in expertAdviseAnalysisStaticList" :label="item" />
                  </el-checkbox-group>
                </div>
              </div>
              <div>
                <span>教师落实措施:</span>
                <div class="div-advise-container">
                  <el-checkbox-group v-model="expertAdviseCheckListToTeacher">
                    <el-checkbox v-for="item in expertAdviseStaticListToTeacher" :label="item" />
                  </el-checkbox-group>
                </div>
              </div>
              <div>
                <span>家长落实措施:</span>
                <div class="div-advise-container">
                  <el-checkbox-group v-model="expertAdviseCheckLisToParent">
                    <el-checkbox v-for="item in expertAdviseStaticListToParent" :label="item" />
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div v-else class="emptyContainer">
              <svg-icon icon-class="empty" />
              <p>暂无专家意见</p>
            </div>
          </template>
        </el-collapse-item>
        <!--        <el-collapse-item title="教师落实情况" name="4">-->
        <!--          <el-row>-->
        <!--            <el-col :span="2" :offset="21">-->
        <!--              <el-button size="small" :disabled="!(expertAdviseStaticListToTeacher.length>0)" class="el-button-add" type="primary" @click="showFullFillDetail(0)">添加</el-button>-->
        <!--            </el-col>-->
        <!--          </el-row>-->
        <!--          <template>-->
        <!--            <div v-if="teacherFullFill.length>0" class="div-upload-detail-info">-->
        <!--              <div class="div-upload-detail-info-container">-->
        <!--                <ul>-->
        <!--                  <li v-for="item in teacherFullFill" @click="showFullFillEditDetail('教师',item)">-->
        <!--                    <span>{{ item.insert_time }}</span>-->
        <!--                    <el-button style="color:black ;" type="text" size="small" @click.stop="showTeacherFullFillUpload(item)"> 添加照片/视频 </el-button>-->
        <!--                  </li>-->
        <!--                </ul>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            <div v-else class="emptyContainer">-->
        <!--              <svg-icon icon-class="empty" />-->
        <!--              <p>暂无教师落实情况</p>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-collapse-item>-->
        <!--        <el-collapse-item title="家长落实情况" name="5">-->
        <!--          <template>-->
        <!--            <div v-if="parentFullFill.length>0" class="div-upload-detail-info">-->
        <!--              <div class="div-upload-detail-info-container">-->
        <!--                <ul>-->
        <!--                  <li v-for="item in parentFullFill" @click="showFullFillEditDetail('家长',item)">-->
        <!--                    <span>{{ item.insert_time }}</span>-->
        <!--                    <el-button style="color:black;" type="text" size="small"> >> </el-button>-->
        <!--                  </li>-->
        <!--                </ul>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            <div v-else class="emptyContainer">-->
        <!--              <svg-icon icon-class="empty" />-->
        <!--              <p>暂无家长落实情况</p>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-collapse-item>-->
      </el-collapse>
    </el-dialog>
    <teacher-full-fill-upload ref="TeacherFullFillUpload" />
  </div>
</template>

<script>
import { fetchAdviseList } from '@/api/advise'
import { fetchMeasureDetailList, fetchMeasureList } from '@/api/measure'
import { getInfo } from '@/api/File'
import TeacherFullFillUpload from '@/views/teacher/enter/components/TeacherFullFillUpload'

export default {
  components: { TeacherFullFillUpload },
  data() {
    return {
      activeName: '1',
      dialogFormVisible: false,
      teacherMeasureId: 0,
      parentMeasureId: 0,
      specialRecordText: '',
      upLoadFileList: [],
      currentVideoSrc: '',
      currentFilePage: 1,
      curImplementPage: 1,
      form: {
        scoreId: 0,
        analysis: '',
        courseName: '',
        courseID: '',
        gender: '',
        filesProps: '',
        classCheckList: []
      },
      is_red_list: [],
      formLabelWidth: '40px',
      expertAdviseAnalysisStaticList: [],
      expertAdviseStaticListToParent: [],
      expertAdviseStaticListToTeacher: [],
      expertAnalysisAdviseCheckList: [],
      expertAdviseCheckLisToParent: [],
      expertAdviseCheckListToTeacher: [],
      courseTableData: [],
      teacherFullFill: [],
      parentFullFill: [],
      showSpecialRecordVideoPover: false,
      vodPlayerJs: 'https://player.polyv.net/script/player.js',
      vid: '88083abbf5bcf1356e05d39666be527a_8'
    }
  },
  watch: {
    showSpecialRecordVideoPover: function(newValue) {
      // this.$refs.SpecialRecordVideo.pause()
      if (newValue) {
        this.loadPlayerScript(this.loadPlayer)
      } else {
        this.destroyed()
      }
    }
  },
  methods: {
    loadPlayerScript(callback) {
      if (!window.polyvPlayer) {
        const myScript = document.createElement('script')
        myScript.setAttribute('src', this.vodPlayerJs)
        myScript.onload = callback
        document.body.appendChild(myScript)
      } else {
        callback()
      }
    },
    loadPlayer() {
      const polyvPlayer = window.polyvPlayer
      this.player = polyvPlayer({
        wrap: '#player1',
        width: 380,
        height: 200,
        vid: this.vid
      })
    },
    destroyed() {
      if (this.player) {
        this.player.destroy()
      }
    },
    opened() {
      this.queryExpertAdviseList()
      this.queryFileList()
    },
    // 是否显示特别记录列表
    getSpecialRecordStatus() {
      console.log('判断状态')
      if (this.specialRecordText === 'null' || this.specialRecordText === '') {
        return false
      }
      return true
    },
    showHistoryCourseDetailDialog(data) {
      console.log(data)
      this.activeName = 1
      this.dialogFormVisible = true
      this.specialRecordText = data.specialRecord
      this.currentFilePage = 1
      this.is_red_list = data.is_red_list
      this.courseTableData.splice(0)
      this.upLoadFileList.splice(0)
      this.expertAdviseAnalysisStaticList.splice(0)
      this.expertAdviseStaticListToTeacher.splice(0)
      this.expertAdviseStaticListToParent.splice(0)
      this.expertAnalysisAdviseCheckList.splice(0)
      this.expertAdviseCheckLisToParent.splice(0)
      this.expertAdviseCheckListToTeacher.splice(0)
      this.parentFullFill.splice(0)
      this.teacherFullFill.splice(0)
      const analysis = data.analysis.split(',')
      const rank = data.rank
      const gpa = data.gpa
      console.log('rank')
      console.log(rank)
      console.log('gpa')
      console.log(gpa)
      analysis.forEach(item => {
        if (item !== '') {
          this.expertAdviseAnalysisStaticList.push(item)
          this.expertAnalysisAdviseCheckList.push(item)
        }
      })
      this.form.scoreId = data.id
      this.form.analysis = data.analysis
      for (let i = 0; i < data.index_list.length; i++) {
        if (data.index_list[i] !== '') {
          const order = (i + 1)
          this.courseTableData.push({ order: order, name: data.index_list[i], score: 0, important: this.is_red_list[i] })
        }
      }
      for (let i = 0; i < this.courseTableData.length; i++) {
        this.courseTableData[i].score = data.scoreList[i]
        console.log(this.courseTableData[i].name)
        if (this.courseTableData[i].name == '个人绩点') {
          this.courseTableData[i].score = gpa
        }
        if (this.courseTableData[i].name == '班级排名') {
          const rankValue = rank == -1 ? '重修' : rank
          this.courseTableData[i].score = rankValue
        }
      }
    },
    showTeacherFullFillUpload(data) {
      this.$refs.TeacherFullFillUpload.showUploadDialog(data)
    },
    confirm() {
      this.dialogFormVisible = false
    },
    cancel() {
      this.dialogFormVisible = false
    },
    tableRowClassName({ row }) {
      if (row.important == 1) {
        return 'warning-row'
      }
      return ''
    },
    showFullFillDetail(index) {
      this.dialogFormVisible = false
      const transForm = { type: index, id: this.teacherMeasureId, adviceListToTeacher: this.expertAdviseStaticListToTeacher }
      this.$emit('goFullFillDetailEvent', transForm)
    },
    showFullFillEditDetail(role, data) {
      this.dialogFormVisible = false
      const transForm = { role, adviceListToTeacher: this.expertAdviseStaticListToTeacher, adviceListToParent: this.expertAdviseStaticListToParent, data: data }
      this.$emit('goFullFillEditDetailEvent', transForm)
    },
    getSpecialRecordVideoText() {
      if (this.upLoadFileList.length > 0) {
        return '查看视频记录'
      } else {
        return '暂无视频记录'
      }
    },
    queryFileList() {
      const form = {
        module_id: this.form.scoreId,
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
        } else {
          if (this.upLoadFileList.length > 0) {
            this.currentVideoSrc = this.$store.state.common.fileUrl + this.upLoadFileList[0].name
            this.vid = this.upLoadFileList[0].fileUrl
          }
        }
      }).catch(error => {
        this.$message.error(`获取已上传课程资料失败,请稍后重试...${error}`)
      })
    },
    queryAchieveForTeacherAndParent(measureId) {
      const form = { measures_id: measureId }
      fetchMeasureList(form).then(response => {
        const { data } = response.data
        data.forEach(item => {
          if (item.role === '教师') {
            if (item.measures_id === measureId) {
              this.teacherFullFill.push(item)
            }
          } else if (item.role === '家长') {
            if (item.measures_id === measureId) {
              this.parentFullFill.push(item)
            }
          }
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取家长教师落实详情失败 error${error}`)
      })
    },
    // 获取专家意见接口
    queryExpertAdviseList() {
      const form = { score_id: this.form.scoreId }
      fetchAdviseList(form).then(response => {
        const { data, totalPageNum } = response.data
        console.log('获取的专家意见')
        console.log(data)
        data.forEach(item => {
          if (item.role === '教师') {
            this.teacherMeasureId = item.id
            const measures = item.measures_for_details.split(',')
            measures.forEach(item => {
              if (item !== '') {
                this.expertAdviseStaticListToTeacher.push(item)
                this.expertAdviseCheckListToTeacher.push(item)
              }
            })
            this.queryAchieveForTeacherAndParent(item.id)
          } else if (item.role === '家长') {
            this.parentMeasureId = item.id
            const measures = item.measures_for_details.split(',')
            measures.forEach(item => {
              if (item !== '') {
                this.expertAdviseStaticListToParent.push(item)
                this.expertAdviseCheckLisToParent.push(item)
              }
            })
            this.queryAchieveForTeacherAndParent(item.id)
          }
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取专家意见失败 error${error}`)
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
          .div-span-title{
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
          }
          .el-table .warning-row {
            background: #FEF0F0;
          }
          .el-button-add{
            float: right;
            font-weight: bold;
          }
          .div-advise{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: start;
            .div-advise-container{
              border: black 1px solid;
              padding: 10px;
              .el-checkbox-group{
                display: flex;
                flex-direction: column;
              }
            }
          }
          .div-upload-detail-info{
            position: relative;
            .div-upload-detail-info-container{
              margin: 12px 20px 20px 18px;
              width: 546px;
              height: 144px;
              border: black 2px solid;
              border-radius: 5px;
              ul{
                list-style: none;
                padding-left: 0px;
                li{
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  padding: 0 20px;
                  &:hover{
                    background-color: #20a0ff;
                  }
                }
              }

            }
          }
          .emptyContainer{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 150px;
            font-size: 150px;
            p{
              font-size: 16px;
            }
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
