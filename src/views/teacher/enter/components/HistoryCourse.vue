<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened" @closed="closed">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>成绩信息(最近一次成绩记录)</span>
      </div>
      <div id="title-divider" />
      <el-form class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="学生姓名" :label-width="formLabelWidth" style="padding: 0px">
          <el-input v-model="form.name" :disabled="true" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.stuCode" :disabled="true" autocomplete="off" size="small" style="width: 180px" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.sex" :disabled="true" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.age" :disabled="true" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeName" accordion @change="changeEvent">
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
          <el-row v-if="getSpecialRecordStatus()" type="flex" justify="start" :gutter="20" style="width: 600px;margin: 5px">
            <el-col :span="14" :offset="2" style="margin-left: 10px">
              <template>
                <span>文字记录</span>
                <br>
                <el-input
                  v-model="currentSpecialRecord"
                  type="textarea"
                  :rows="4"
                  placeholder="暂无特别记录"
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
                  <!--                  <video ref="SpecialRecordVideo" controlsList="nodownload" style="width: 100%;height: 100%" :src="currentVideoSrc" controls />-->
                  <div id="player2" />
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
        <el-collapse-item title="历史课程信息" name="3">
          <template>
            <div v-if="this.lineChartData.historyCourseList.length>0">
              <line-chart ref="lineChartComponent" :chart-data="lineChartData" @xAxisTriggerEvent="xAxisTriggerEvent" />
            </div>
            <div v-else class="emptyContainer">
              <svg-icon icon-class="empty" />
              <p>暂无历史课程信息</p>
            </div>
            <el-popover
              style="margin-left: 20px"
              placement="top-start"
              title="历史成绩"
              width="200"
              trigger="hover"
            >
              <el-button v-for="item in lineChartData.historyCourseList" type="text" size="small" @click="xAxisTriggerEvent(item.insert_time)">{{ item.insert_time }}成绩</el-button>
              <el-button slot="reference" type="primary" round size="small">查看历史成绩 </el-button>
            </el-popover>
          </template>
        </el-collapse-item>
      </el-collapse>

    </el-dialog>
  </div>
</template>

<script>
import LineChart from '@/views/teacher/enter/components/chart/LineChart'
import { gap, formatTimeToServe, formatDateToDay } from '@/utils/date'
import { fetchStudentScoreList } from '@/api/score'
import { getInfo } from '@/api/File'

export default {
  components: {
    LineChart
  },
  data() {
    return {
      activeName: '1',
      dialogFormVisible: false,
      studentInfo: {},
      index_list: [],
      currentSpecialRecord: '',
      currentScoreId: '',
      currentFilePage: 1,
      is_red_list: [],
      upLoadFileList: [],
      currentVideoSrc: '',
      form: {
        name: '',
        stuCode: '',
        sex: '',
        age: '',
        classCheckList: []
      },
      formLabelWidth: '40px',
      courseTableData: [],
      // 历史成绩列表
      lineChartData: {
        historyCourseList: [],
        xAxisData: this.$store.state.common.currentIndexList,
        historyCourseQuotaList: []
      },
      scoreHadUpload: true,
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
        wrap: '#player2',
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
      this.queryScore()
      this.queryFileList()
    },
    closed() {
      this.$refs.lineChartComponent.chartDestory()
    },
    // 是否显示特别记录列表
    getSpecialRecordStatus() {
      console.log('判断状态')
      if (this.currentSpecialRecord == 'null' || this.currentSpecialRecord == '') {
        return false
      }
      return true
    },
    queryFileList() {
      const form = {
        module_id: this.currentScoreId,
        module_name: '特别记录'
      }
      getInfo(form).then(response => {
        const { data, totalPageNum, errno } = response.data
        if (errno !== 0) {
          this.$message.error(data.msg)
          return
        }
        data?.forEach(item => {
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, fileUrl: item.file_url, name: item.file_name, usages: item.file_usage })
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
    initFormData(data, scoreList, is_red_list) {
      this.activeName = 1
      this.currentScoreId = data.score_id
      this.form.name = data.name
      this.form.stuCode = data.stuCode
      this.form.sex = data.sex === 1 ? '男' : '女'
      this.form.age = gap(data.birth)
      this.courseTableData.splice(0)
      this.lineChartData.historyCourseList.splice(0)
      this.index_list.splice(0)
      this.currentSpecialRecord = data.special_record
      this.currentFilePage = 1
      this.upLoadFileList.splice(0)
      this.is_red_list = is_red_list
      scoreList.forEach((item, index) => {
        this.courseTableData.push({ order: ++index, name: item.name, score: item.score == -1 ? '重修' : item.score, important: item.important })
        this.index_list.push(item.name)
      })
    },
    showHistoryCourseDialog(scoreHadUpload, data, scoreList, is_red_list) {
      // 没上传过历史成绩，则不显示历史成绩列表
      this.scoreHadUpload = scoreHadUpload
      this.dialogFormVisible = true
      this.initFormData(data, scoreList, is_red_list)
      this.studentInfo.relation_id = data.relationship_id
      this.studentInfo.studentId = data.id
    },
    showEditHistoryCourseDialog(formData) {
      this.dialogFormVisible = true
      // this.form = formData
    },
    xAxisTriggerEvent(value) {
      this.lineChartData.historyCourseList.forEach(item => {
        if (item.insert_time == value) {
          this.showHistoryCourseDetail(item.order)
        }
      })
    },
    showHistoryCourseDetail(order) {
      const transFormData = {}
      this.lineChartData.historyCourseList.forEach(item => {
        if (item.order === order) {
          transFormData.id = item.id
          transFormData.specialRecord = item.special_record
          transFormData.analysis = item.analysis
          transFormData.scoreList = item.scoreList
          transFormData.index_list = this.index_list
          transFormData.is_red_list = this.is_red_list
          transFormData.gpa = item.gpa
          transFormData.rank = item.rank
        }
      })
      this.dialogFormVisible = false
      this.$emit('goCourseDetailEvent', transFormData)
    },
    getSpecialRecordVideoText() {
      if (this.upLoadFileList.length > 0) {
        return '查看视频记录'
      } else {
        return '暂无视频记录'
      }
    },
    tableRowClassName({ row }) {
      if (row.important == 1) {
        return 'warning-row'
      }
      return ''
    },
    confirm() {
      this.dialogFormVisible = false
    },
    cancel() {
      this.dialogFormVisible = false
    },
    changeEvent(a) {
      this.$refs.lineChartComponent.initChart()
      this.$nextTick(() => {
        this.$refs.lineChartComponent.chartResize()
      })
    },
    queryScore() {
      if (!this.scoreHadUpload) {
        return
      }
      const form = { relation_id: this.studentInfo.relation_id, studentId: this.studentInfo.studentId }
      fetchStudentScoreList(form).then(response => {
        const { data } = response.data
        console.log('历史课程信息')
        console.log(data)
        // this.lineChartData.xAxisData.splice(0)
        this.lineChartData.historyCourseQuotaList.splice(0)
        // 去掉个人绩点
        for (let i = 0; i < this.index_list.length - 2; i++) {
          this.lineChartData.historyCourseQuotaList.push({ quotName: this.index_list[i], score: [] })
        }
        data.forEach((item, index) => {
          const scoreList = item.score_list.split(',')
          this.lineChartData.historyCourseList.push({ order: index, analysis: item.analysis, gpa: item.gpa, rank: item.rank, id: item.id, special_record: item.special_record, scoreList: scoreList, insert_time: item.insert_time })
          // this.lineChartData.xAxisData.push(item.insert_time)
          for (let i = 0; i < scoreList.length; i++) {
            const length = this.lineChartData.historyCourseQuotaList[i].score.length
            this.lineChartData.historyCourseQuotaList[i].score[length] = scoreList[i]
          }
          // 保留最后一次的特别记录
          this.currentSpecialRecord = item.special_record
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取历史成绩失败 error${error}`)
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
          .el-button_info{
            position: absolute;
            right: 40px;
            bottom: 100px;
            list-style: none;
          }
          .el-table .warning-row {
            background: #FEF0F0;
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
