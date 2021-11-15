<template>
  <div class="container">
    <div class="div-tree">
      <!--      <div class="div-tree-title">-->
      <!--        <i class="el-icon-s-claim" />-->
      <!--      </div>-->
      <SelectTree title="请选择要录入的课程" show-type="成绩录入" @node-click="handleNodeClick" />
    </div>
    <div v-if="showEnterDetail" class="div-table">
      <h1>{{ title + '成绩录入' }}</h1>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        max-height="610"
        border
        fit
        :show-overflow-tooltip="true"
        :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @current-change="currentRowChange"
      >
        <el-table-column label="序号" fixed width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="学号"
          prop="stuCode"
          fixed
          width="100"
        />
        <el-table-column
          label="姓名"
          prop="name"
          fixed
          width="100"
        />
        <el-table-column
          v-for="item in tableCreateArray"
          :label="item.label"
        >
          <template slot="header" slot-scope="scope">
            <el-link :type="checkIndexIsImportant(item.important)">{{ item.label }}</el-link>
          </template>
          <template slot-scope="scope">
            <el-input v-model.number.lazy="scope.row[item.prop]" :disabled="scoreHadUpload" type="number" size="small" @input="tableInputValueChange" />
          </template>
        </el-table-column>
        <el-table-column
          label="个人绩点"
          fixed="right"
          width="90"
        >
          <template slot-scope="scope">
            <el-tag type="info">{{ showGpa(scope.row.gpa) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="scoreHadUpload"
          label="重修成绩录入"
          width="60"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showRetakeCourseScore(scope.row)">操作</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="特别记录"
          fixed="right"
          width="120"
        >
          <template slot-scope="scope">
            <!--            // 未上传成绩显示 提交成绩后添加 提交成绩后检查 特别记录字段是否为 null 是则显示 添加记录，否则显示查看记录-->
            <el-button v-if="!scoreHadUpload" type="text" size="small">请先提交成绩</el-button>
            <el-button v-if="scoreHadUpload&&(scope.row.special_record !== 'null' )" type="text" size="small" @click="showSpecialRecord(scope.row)">查看记录</el-button>
            <span v-if="scoreHadUpload&&(scope.row.special_record !== 'null' )">|</span>
            <el-button v-if="scoreHadUpload" type="text" size="small" @click="showAddUploadDialog(scope.row)">添加(修改)记录</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="scoreHadUpload"
          label="作业完成情况"
          fixed="right"
          width="60"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="作业"
              width="200"
              trigger="hover"
            >
              <el-button type="text" size="small" @click="showHomeWorkDialog(scope.row)">作业详情</el-button>
              <span>|</span>
              <el-button type="text" size="small" @click="showHomeWorkImplementDetailDialog(scope.row)">学生完成情况</el-button>
              <el-button slot="reference" type="text" size="mini">{{ getHomeWorkStatus(scope.row) }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          v-if="scoreHadUpload"
          label="作业文字"
          fixed="right"
          width="60"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="作业"
              width="200"
              trigger="hover"
            >
              <el-button type="text" size="small" @click="showHomeWorkDialog(scope.row)">作业详情</el-button>
              <span>|</span>
              <el-button type="text" size="small" @click="showHomeWorkImplementDetailDialog(scope.row)">学生完成情况</el-button>
              <el-button slot="reference" type="text" size="mini">{{ getHomeWorkWordStatus(scope.row) }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          v-if="scoreHadUpload"
          label="作业视频"
          fixed="right"
          width="60"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="作业"
              width="200"
              trigger="hover"
            >
              <el-button type="text" size="small" @click="showHomeWorkDialog(scope.row)">作业详情</el-button>
              <span>|</span>
              <el-button type="text" size="small" @click="showHomeWorkImplementDetailDialog(scope.row)">学生完成情况</el-button>
              <el-button slot="reference" type="text" size="mini">{{ getHomeWorkVideoStatus(scope.row) }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          v-if="scoreHadUpload"
          label="历史成绩"
          prop="stuName"
          fixed="right"
          width="60"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showHistoryCourseInfo(scope.row)">详情>></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="!scoreHadUpload" type="success" style="margin-top:50px;width: 120px;" @click="submit"> 提交 </el-button>
    </div>
    <special-record ref="SpecialRecordComponents" />
    <history-course ref="HistoryRecordComponents" @goCourseDetailEvent="goCourseDetail" />
    <course-detail ref="CourseDetailComponents" @goFullFillDetailEvent="goFullFillDetail" @goFullFillEditDetailEvent="goFullFillEditDetail" />
    <full-fill-detail ref="FullFillDetailComponents" />
    <RetakeCourseScore ref="RetakeCourseScore" @RetakeCourseScore="retakeCourseScore" />
    <SpecialRecordUpload ref="SpecialRecordUpload" @SpecialRecordUpload="uploadSpecialRecord" />
    <HomeWorkImplementDetail ref="HomeWorkImplementDetail" />
    <el-dialog :visible.sync="docDialogPreviewVisible" width="80%">
      <div style="width: 100%;text-align: center">
        <el-button-group v-if="currentPdfSrc !== ''">
          <el-button size="mini" type="info" icon="el-icon-arrow-left" @click="prePage">上一页</el-button>
          <el-button size="mini" type="info">{{ pageNum+"/"+pageTotalNum }}</el-button>
          <el-button size="mini" type="info" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-button-group>
        <h1 v-else>暂无作业详情</h1>
      </div>
      <pdf ref="pdf" :key="pdfKey" :page="pageNum" :src="currentPdfSrc" @num-pages="pageTotalNum=$event" />
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      ref="ImageViewer"
      :on-close="closeViewer"
      :url-list="[currentHomeWorkPic]"
    />
  </div>
</template>
<script>
import SelectTree from '@/components/Select/SelectTree'
import SpecialRecord from '@/views/teacher/enter/components/SpeicalRecord'
import HistoryCourse from '@/views/teacher/enter/components/HistoryCourse'
import CourseDetail from '@/views/teacher/enter/components/CourseDetail'
import FullFillDetail from '@/views/teacher/enter/components/FullFillDetail'
import { fetchAllStudents } from '@/api/class'
import { createStudentScore, updateStudentScore } from '@/api/score'
import { checkCourseIsLogScore, getTeacherStudentsCourse } from '@/api/teacher'
import RetakeCourseScore from '@/views/teacher/enter/components/RetakeCourseScore'
import SpecialRecordUpload from '@/views/teacher/enter/components/SpecialRecordUpload'
import HomeWorkImplementDetail from '@/views/teacher/enter/components/HomeWorkImplementDetail'
import { fetchHomeWorkId } from '@/api/homework'
import { fetchHomeWorkDetail } from '@/api/course'
import pdf from 'vue-pdf'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: {
    ElImageViewer,
    SpecialRecordUpload,
    RetakeCourseScore,
    SelectTree, SpecialRecord, HistoryCourse, CourseDetail, FullFillDetail, HomeWorkImplementDetail, pdf
  },
  data() {
    return {
      loading: false,
      showViewer: false,
      docDialogPreviewVisible: false,
      pdfKey: 1,
      pageNum: 1,
      pageTotalNum: 1,
      title: '',
      showMenu: true,
      tableCurrentRow: 1,
      tableData: [],
      tableCreateArray: [],
      index_list: [],
      is_red_list: [],
      currentInput: '',
      scoreHadUpload: false,
      showEnterDetail: false,
      currentStudentId: 0,
      currentClassId: 0,
      relationship_id: 0,
      currentScoreId: 0,
      currentPdfSrc: '',
      currentHomeWorkPic: ''
    }
  },
  methods: {
    handleNodeClick(data) {
      this.showEnterDetail = true
      this.relationship_id = data.relationship_id
      this.title = data.label
      this.tableCreateArray.length = 0
      this.index_list = data.index_list.split(',')
      this.$store.state.common.currentIndexList.splice(0)
      this.currentClassId = data.classId
      this.is_red_list = data.is_red_list.split(',')
      this.currentPdfSrc = ''
      this.currentHomeWorkPic = ''
      console.log(data)
      // table 中添加 各项指标列
      for (let i = 0; i < this.index_list.length; i++) {
        if (this.index_list[i]) {
          this.tableCreateArray.push({ label: this.index_list[i], important: this.is_red_list[i], prop: `course${i}` })
          this.$store.state.common.currentIndexList.push(this.index_list[i])
        }
      }
      this.checkCourseIsLog(this.$store.state.common.teacherId, this.relationship_id)
    },
    showGpa(data) {
      if (isNaN(data)) {
        return '自动计算'
      } else {
        return data
      }
    },
    checkIndexIsImportant(important) {
      if (parseInt(important) === 1) {
        return 'danger'
      }
      return 'info'
    },
    showSubmitButton() {
      if (this.scoreHadUpload) {
        return '成绩已录入'
      } else {
        return '提交'
      }
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    currentRowChange(newRow, oldRow) {
      this.tableCurrentRow = newRow
      console.log(newRow)
    },
    showRetakeCourseScore(data) {
      // 赋值 studentid 重修记录上传时用到
      this.currentStudentId = data.id
      const index_list_length = this.tableCreateArray.length
      const scoreList = []
      for (let j = 0; j < index_list_length; j++) {
        scoreList.push({ name: this.index_list[j], score: '' })
      }
      scoreList.push({ name: '个人绩点', score: '' })
      scoreList.push({ name: '班级排名', score: '' })
      this.$refs.RetakeCourseScore.showRetakeCourseScoreDialog(data, scoreList)
    },
    showHistoryCourseInfo(row) {
      console.log(row)
      this.currentStudentId = row.id
      const index_list_length = this.tableCreateArray.length
      const scoreList = []
      for (let j = 0; j < index_list_length; j++) {
        const prop = `course${j}`
        scoreList.push({ name: this.index_list[j], score: row[prop], important: this.is_red_list[j] })
      }
      scoreList.push({ name: '个人绩点', score: row.gpa, important: 0 })
      scoreList.push({ name: '班级排名', score: row.rank, important: 0 })
      this.$refs.HistoryRecordComponents.showHistoryCourseDialog(this.scoreHadUpload, row, scoreList, this.is_red_list)
    },
    goCourseDetail(data) {
      this.$refs.CourseDetailComponents.showHistoryCourseDetailDialog(data)
    },
    goFullFillDetail(transform) {
      this.$refs.FullFillDetailComponents.showFullFillDetailDialog(transform)
    },
    goFullFillEditDetail(data) {
      this.$refs.FullFillDetailComponents.showEditFullFillDetailDialog(data)
    },
    showSpecialRecord(data) {
      this.$refs.SpecialRecordComponents.showSpecialRecordDialog(data)
    },
    showAddUploadDialog(data) {
      this.currentScoreId = data.score_id
      this.$refs.SpecialRecordUpload.showUploadDialog(data)
    },
    showHomeWorkImplementDetailDialog(data) {
      this.$refs.HomeWorkImplementDetail.showHomeWorkImplementDetailDialog(data)
    },
    showHomeWorkDialog(data) {
      this.currentScoreId = data.score_id
      this.currentHomeWorkPic = ''
      this.currentPdfSrc = ''
      this.fetchHomeWorkId()
    },
    getHomeWorkStatus(raw) {
      if (this.scoreHadUpload && (raw.works[0]?.is_completed === 1)) {
        return '✓'
      } else {
        return '❌'
      }
    },
    getHomeWorkWordStatus(raw) {
      if (this.scoreHadUpload && (raw.works[0]?.is_upload_word === 1)) {
        return '✓'
      } else {
        return '❌'
      }
    },
    getHomeWorkVideoStatus(raw) {
      if (this.scoreHadUpload && (raw.works[0]?.is_upload_video === 1)) {
        return '✓'
      } else {
        return '❌'
      }
    },
    tableInputValueChange(value) {
      for (let i = 0; i < this.tableData.length; i++) {
        const index_list_length = this.tableCreateArray.length
        let totalScore = 0
        const item = this.tableData[i]
        for (let j = 0; j < index_list_length; j++) {
          const prop = `course${j}`
          totalScore = totalScore + parseInt(item[prop])
        }
        item.gpa = (totalScore / (10 * index_list_length) * 100).toFixed(2)
      }
    },

    // 查询成绩是否上传过
    checkCourseIsLog(teacherId, relationId) {
      const form = {
        teacherId: teacherId,
        relationId: relationId,
        classId: this.currentClassId
      }
      checkCourseIsLogScore(form).then(response => {
        const { data } = response.data
        console.log(data)
        this.scoreHadUpload = data.status
        // 已经录过成绩
        if (data.status) {
          this.getTeacherStudentsCourse()
        } else {
          this.queryStudentListByClassID()
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取课程录入状态失败 error${error}`)
      })
    },
    // 获取该班级该课程下所有的学生
    queryStudentListByClassID() {
      const form = { classId: this.currentClassId }
      fetchAllStudents(form).then(response => {
        const { data } = response.data
        this.tableData = data
      }).catch(error => {
        this.$message.error(`抱歉,获取学生信息失败,请重试 error：${error}`)
      }).finally(() => {

      })
    },
    // 已经录过成绩，查询所有学生成绩
    getTeacherStudentsCourse() {
      const form = { teacherId: this.$store.state.common.teacherId, relationId: this.relationship_id, classId: this.currentClassId }
      getTeacherStudentsCourse(form).then(response => {
        const { data } = response.data
        this.tableData.splice(0)
        data.forEach(item => {
          if (item.class_id === this.currentClassId) {
            // relation_id 单独赋值
            item.relationship_id = this.relationship_id
            item.score_id = item.scores[item.scores.length - 1].score_id
            item.special_record = item.scores[item.scores.length - 1].special_record
            item.rank = item.scores[item.scores.length - 1].rank
            if (item.scores.length > 1) {
              item.name = item.name + '[重修]'
            }
            this.tableData.push(item)
          }
        })
        for (let i = 0; i < this.tableData.length; i++) {
          const indexList = this.tableData[i].scores[this.tableData[i].scores.length - 1].score_list.split(',')
          for (let j = 0; j < indexList.length; j++) {
            const prop = `course${j}`
            this.tableData[i][prop] = indexList[j]
          }
        }
        this.tableInputValueChange()
      }).catch(error => {
        this.$message.error(`抱歉,获取学生成绩列表失败,请重试 error：${error}`)
      })
    },
    // 特别记录上传
    uploadSpecialRecord(record) {
      const form = { id: this.currentScoreId, special_record: record }
      updateStudentScore(form).then(response => {
        const { data } = response.data
        this.$message.success('更新学生特别记录成功~')
        this.$refs.SpecialRecordUpload.cancel()
      }).catch(error => {
        this.$message.error(`抱歉,更新学生特别记录失败 error${error}`)
        this.$refs.SpecialRecordUpload.cancel()
      }).finally(() => {
        this.getTeacherStudentsCourse()
      })
    },
    // 获取学生作业id
    fetchHomeWorkId() {
      this.loading = true
      const fetchForm = {
        id: this.currentScoreId
      }
      fetchHomeWorkId(fetchForm).then(response => {
        const { data } = response.data
        this.currentHomeWordId = data[data.length - 1].id
        if (this.currentHomeWordId != 0) {
          this.fetchHomeWorkDetail()
        }
      }).catch(error => {
        this.$message.error(`获取作业Id失败,请稍后重试...${error}`)
        this.loading = false
      })
    },
    // 获取学生落实详情
    fetchHomeWorkDetail() {
      const fetchForm = {
        homeWorkId: this.currentHomeWordId
      }
      fetchHomeWorkDetail(fetchForm).then(response => {
        const { data } = response.data
        if (data[0].CourseHomeWorkInfo.length > 0) {
          const fileName = this.$store.state.common.fileUrl + data[0].CourseHomeWorkInfo[0]?.file_name
          const index = fileName.lastIndexOf('.')
          const ext = fileName.substr(index + 1)
          if (ext.toUpperCase() === 'PDF') {
            this.currentPdfSrc = this.$store.state.common.fileUrl + data[0].CourseHomeWorkInfo[0]?.file_name
          } else {
            this.currentHomeWorkPic = this.$store.state.common.fileUrl + data[0].CourseHomeWorkInfo[0]?.file_name
          }
        }
        // 显示作业ui
        if (this.currentPdfSrc != '') {
          console.log('333333333333333')
          this.docDialogPreviewVisible = true
          this.pageNum = 1
        } else if (this.currentHomeWorkPic != '') {
          console.log('22222222222222')
          this.showViewer = true
        } else {
          this.$message({ message: '[作业] 抱歉该课程暂未上传作业~', type: 'error', duration: 6000 })
        }
      }).catch(error => {
        this.$message.error(`获取作业详情失败,请稍后重试...${error}`)
      }).finally(() => {
        this.loading = false
      })
    },
    // 重修成绩上传
    retakeCourseScore(form) {
      let stand = true
      const index_list_length = this.tableCreateArray.length
      for (let j = 0; j < index_list_length; j++) {
        // stand位false后不允许在进入
        if (this.tableCreateArray[j].important == '1' && stand) {
          stand = !(parseInt(form.scoreList[j]) <= 4)
        }
      }
      const submitForm = {
        studentId: this.currentStudentId,
        relation_id: this.relationship_id,
        score_list: form.scoreList,
        is_up_to_standard: stand,
        rank: -1,
        gpa: form.gpa
      }
      createStudentScore([submitForm]).then(response => {
        const { data } = response.data
        this.$message.success('上传学生重修成绩信息成功')
      }).catch(error => {
        this.$message.error(`抱歉,上传学生重修信息失败,请重试 error：${error}`)
      }).finally(() => {
        this.$refs.RetakeCourseScore.cancel()
        this.getTeacherStudentsCourse()
      })
    },
    submit() {
      const form = []
      // 重点指标里有低于等于4分的即属于未达标
      for (let i = 0; i < this.tableData.length; i++) {
        let stand = true
        const index_list_length = this.tableCreateArray.length
        const index_list = []
        for (let j = 0; j < index_list_length; j++) {
          const prop = `course${j}`
          index_list.push(this.tableData[i][prop])
          // stand位false后不允许在进入
          if (this.tableCreateArray[j].important == '1' && stand) {
            stand = !(parseInt(this.tableData[i][prop]) <= 4)
          }
        }
        form.push({
          studentId: this.tableData[i].id,
          relation_id: this.relationship_id,
          score_list: index_list.toString(),
          gpa: this.tableData[i].gpa,
          is_up_to_standard: stand
        })
      }
      form.sort(function(a, b) {
        return b.gpa - a.gpa
      })
      form.forEach((item, index) => {
        item.rank = ++index
      })
      console.log(form)
      createStudentScore(form).then(response => {
        const { data } = response.data
        this.$message.success('上传学生成绩信息成功')
        // this.getTeacherStudentsCourse()
        this.checkCourseIsLog(this.$store.state.common.teacherId, this.relationship_id)
      }).catch(error => {
        this.$message.error(`抱歉,上传学生信息失败,请重试 error：${error}`)
      }).finally(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 65px;
  margin-left: 20px;
  width: 100%;
  height: 100%;
  padding: 60px 20px;
  .div-tree{
    width: 15%;
    margin-right: 30px;
    text-align: center;
    .tree{
      width: 100%;
      height: 700px;
      border-radius: 10px;
      .tree-header{
        width: 100%;
        background-color: #F4F4F4;
        #tree-header-span{
          font-size: 19px;
          line-height: 45px;
          margin-left: 18px;
        }
      }
    }
  }
  .div-table {
    width: 83%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background-color: white;
    border-radius: 18px;
    padding: 0 20px 50px 20px;
    text-align: center;
    h1{
      width: 80%;
      padding: 15px;
      border-radius: 50px;
      background-color: #4CAF50;
      position: relative;
      top: -50px;
    }
  }
}
</style>
