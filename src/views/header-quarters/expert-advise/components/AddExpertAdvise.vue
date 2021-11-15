<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @closed="closed" @opened="opened">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>添加建议与措施</span>
      </div>
      <div id="title-divider" />
      <el-form ref="form" class="form" :rules="rules" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="学生姓名" :label-width="formLabelWidth" style="padding: 0px">
          <el-input v-model="form.studentName" autocomplete="off" size="small" style="width: 100px" :disabled="true" />
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.address" autocomplete="off" size="small" style="width: 180px" :disabled="true" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.age" autocomplete="off" size="small" style="width: 40px" :disabled="true" />
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.class" autocomplete="off" size="small" style="width: 80px" :disabled="true" />
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.class_no" autocomplete="off" size="small" style="width: 90px" :disabled="true" />
        </el-form-item>
        <el-form-item label="课程" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.courseName" autocomplete="off" size="small" style="width: 200px" :disabled="true" />
        </el-form-item>
        <el-form-item label="备注" label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.remark" autocomplete="off" size="small" style="width: 300px" :disabled="true" />
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeName" accordion @change="changeEvent">
        <el-collapse-item title="成绩" name="1">
          <el-row type="flex" justify="start" style="margin-left: 20px;margin-top: 10px">
            <el-col :span="22">
              <el-table
                :data="courseTableData"
                border
                :row-class-name="tableRowClassName"
                size="mini"
                max-height="180px"
                style="width: 100%"
                fix
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
                  width="100"
                />
              </el-table>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="特别记录" name="2">
          <el-row v-if="getSpecialRecordStatus()" type="flex" justify="start" :gutter="20" style="width: 600px;margin: 5px">
            <el-col :span="14" :offset="2" style="margin-left: 20px">
              <template>
                <span>文字记录</span>
                <br>
                <el-input
                  v-model="currentSpecialRecordText"
                  type="textarea"
                  :rows="4"
                  placeholder="暂无特别记录内容"
                  :disabled="true"
                />
              </template>
            </el-col>
            <el-col :span="8" :offset="1">
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
                  <video ref="SpecialRecordVideo" controlsList="nodownload" style="width: 100%;height: 100%" :src="currentVideoSrc" controls />
                  <el-button slot="reference" type="primary" :disabled="this.upLoadFileList.length === 0">{{ getSpecialRecordVideoText() }}</el-button>
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
            <div>
              <line-chart ref="lineChartComponent" :chart-data="lineChartData" />
            </div>
            <!--            <div v-else class="emptyContainer">-->
            <!--              <svg-icon icon-class="empty" />-->
            <!--              <p>暂无历史课程信息</p>-->
            <!--            </div>-->
          </template>
        </el-collapse-item>
        <el-collapse-item title="专家分析:" name="4">
          <div class="advice_container">
            <div class="div-advise">
              <el-scrollbar style="height:100%">
                <el-row style="margin-top: 20px;margin-left: 10px;width: 100%">
                  <el-col :span="14">
                    <el-input v-model="expertAdvice" placeholder="手动填写" size="mini" />
                  </el-col>
                  <el-col v-if="!checked" :span="6" :offset="1">
                    <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addExpertAdvice" />
                    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="deleteAdviceToServe" />
                  </el-col>
                </el-row>
                <el-checkbox-group v-model="expertAnalysisAdviseCheckList">
                  <el-checkbox v-for="item in expertAdviseAnalysisStaticList" :disabled="checked" :label="item" />
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="建议和措施(教师):" name="5">
          <div class="advice_container">
            <div class="div-advise">
              <el-scrollbar style="height:100%">
                <el-row style="margin-top: 20px;margin-left: 10px;width: 100%">
                  <el-col :span="14">
                    <el-input v-model="adviceToTeacher" placeholder="手动填写" size="mini" />
                  </el-col>
                  <el-col v-if="!checked" :span="6" :offset="1">
                    <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addAdviseToTeacher" />
                    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="deleteTeacherAdviceToServe" />
                  </el-col>
                </el-row>
                <el-checkbox-group v-model="expertAdviseCheckListToTeacher">
                  <el-checkbox v-for="item in expertAdviseStaticListToTeacher" :disabled="checked" :label="item" />
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="建议和措施(家长):" name="6">
          <div class="advice_container">
            <div class="div-advise">
              <el-scrollbar style="height:100%">
                <el-row style="margin-top: 20px;margin-left: 10px;width: 100%">
                  <el-col :span="14">
                    <el-input v-model="adviceToParent" placeholder="手动填写" size="mini" />
                  </el-col>
                  <el-col v-if="!checked" :span="6" :offset="1">
                    <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addAdviseToParent" />
                    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="deleteParentAdviceToServe" />
                  </el-col>
                </el-row>
                <el-checkbox-group v-model="expertAdviseCheckLisToParent">
                  <el-checkbox v-for="item in expertAdviseStaticListToParent" :disabled="checked" :label="item" />
                </el-checkbox-group>
              </el-scrollbar>
            </div></div>
        </el-collapse-item>
      </el-collapse>
      <div class="div-footer">
        <el-button v-if="!checked" id="el-button-add" :loading="submitLoading" style="width: 140px;margin-bottom: 30px" size="small" @click="confirm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LineChart from '@/views/teacher/enter/components/chart/LineChart'
import {
  createCommonText,
  createExpertAdviseRecord,
  deleteCommonText,
  fetchCommonText,
  fetchStudentScoreList,
  updateStudentScore
} from '@/api/score'
import { gap } from '@/utils/date'
import { createNewAdvise, fetchAdviseList } from '@/api/advise'
import { getInfo } from '@/api/File'
export default {
  components: {
    LineChart
  },
  data() {
    return {
      submitLoading: false,
      flag: this.$store.state.common.DIALOGSHOW,
      activeName: '1',
      dialogFormVisible: false,
      showSpecialRecordVideoPover: false,
      expertAdvice: '',
      adviceToTeacher: '',
      adviceToParent: '',
      currentSpecialRecordText: '',
      currentVideoSrc: '',
      curFilePage: '',
      upLoadFileList: [],
      rules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        Intake: [
          { type: 'date', required: true, message: '请选择入学年月', trigger: 'change' }
        ],
        class_no: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        birth: [
          { type: 'date', required: true, message: '请选择出生年月日', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入家庭地址', trigger: 'blur' }
        ],
        parent_name: [
          { required: true, message: '请输入家长姓名', trigger: 'blur' }
        ],
        parent_phone: [
          { required: true, message: '请填写家长联系方式', trigger: 'blur' }
        ]
      },
      form: {
        studentId: '',
        studentName: '',
        gpa: '',
        code: '',
        address: '',
        class: '',
        class_no: '',
        courseName: '',
        courseID: '',
        grader: '',
        index_list: [],
        types: [],
        score_list: [],
        is_red_list: [],
        age: ''
      },
      rawFormData: [],
      formLabelWidth: '40px',
      rawExpertAdviceFromServer: [],
      expertAdviseAnalysisStaticList: [],
      expertAnalysisAdviseCheckList: [],
      expertAdviseStaticListToParent: [],
      expertAdviseCheckLisToParent: [],
      expertAdviseStaticListToTeacher: [],
      expertAdviseCheckListToTeacher: [],
      courseTableData: [],
      // 历史成绩列表
      lineChartData: {
        historyCourseList: [],
        historyCourseQuotaList: [],
        xAxisData: []
      }
    }
  },
  watch: {
    showSpecialRecordVideoPover: function(newValue) {
      this.$refs.SpecialRecordVideo.pause()
    }
  },
  mounted() {

  },
  methods: {
    opened() {
      if (!this.checked) {
        this.fetchExpertAdvise()
      } else {
        this.queryExpertAdviseList()
      }
    },
    closed() {
      this.$refs.lineChartComponent.chartDestory()
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
          } else if (item.role === '家长') {
            this.parentMeasureId = item.id
            const measures = item.measures_for_details.split(',')
            measures.forEach(item => {
              if (item !== '') {
                this.expertAdviseStaticListToParent.push(item)
                this.expertAdviseCheckLisToParent.push(item)
              }
            })
          }
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取专家意见失败 error${error}`)
      })
    },
    // 是否显示特别记录列表
    getSpecialRecordStatus() {
      console.log('判断状态')
      if (this.currentSpecialRecordText === 'null' || this.currentSpecialRecordText === '') {
        return false
      }
      return true
    },
    deleteParentAdviceToServe() {
      this.$confirm('此操作将永久删除该建议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteIdArray = []
        this.expertAdviseCheckLisToParent.forEach(item => {
          this.rawExpertAdviceFromServer.forEach(rawItem => {
            if (rawItem.type === 2 && item == rawItem.content) {
              deleteIdArray.push({ id: rawItem.id })
            }
          })
        })
        if (deleteIdArray.length >= 1) {
          this.deleteExpertAdviseToServe(deleteIdArray)
        } else {
          this.$message.error('请至少选择一项意见进行删除')
        }
      }).catch(() => {

      })
    },
    deleteTeacherAdviceToServe() {
      this.$confirm('此操作将永久删除该建议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteIdArray = []
        this.expertAdviseCheckListToTeacher.forEach(item => {
          this.rawExpertAdviceFromServer.forEach(rawItem => {
            if (rawItem.type === 3 && item == rawItem.content) {
              deleteIdArray.push({ id: rawItem.id })
            }
          })
        })
        if (deleteIdArray.length >= 1) {
          this.deleteExpertAdviseToServe(deleteIdArray)
        } else {
          this.$message.error('请至少选择一项意见进行删除')
        }
      }).catch(() => {

      })
    },
    deleteAdviceToServe() {
      this.$confirm('此操作将永久删除该建议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteIdArray = []
        this.expertAnalysisAdviseCheckList.forEach(item => {
          this.rawExpertAdviceFromServer.forEach(rawItem => {
            if (rawItem.type === 1 && item == rawItem.content) {
              deleteIdArray.push({ id: rawItem.id })
            }
          })
        })
        if (deleteIdArray.length >= 1) {
          this.deleteExpertAdviseToServe(deleteIdArray)
        } else {
          this.$message.error('请至少选择一项意见进行删除')
        }
      }).catch(() => {

      })
    },
    addAdviseToTeacher() {
      if (this.adviceToTeacher) {
        // this.expertAdviseStaticListToTeacher.unshift(this.adviceToTeacher)
        this.expertAdviseCheckListToTeacher.push(this.adviceToTeacher)
        this.addExpertAdviseToServe(this.adviceToTeacher, 3)
      }
    },
    addAdviseToParent() {
      if (this.adviceToParent) {
        // this.expertAdviseStaticListToParent.unshift(this.adviceToParent)
        this.expertAdviseCheckLisToParent.push(this.adviceToParent)
        this.addExpertAdviseToServe(this.adviceToParent, 2)
      }
    },
    addExpertAdvice() {
      if (this.expertAdvice) {
        // this.expertAdviseAnalysisStaticList.unshift(this.expertAdvice)
        this.expertAnalysisAdviseCheckList.push(this.expertAdvice)
        this.addExpertAdviseToServe(this.expertAdvice, 1)
      }
    },
    initFormData(data, checked) {
      console.log('11111111')
      console.log(data)
      // 默认展开
      this.checked = checked
      this.activeName = '1'
      this.upLoadFileList.splice(0)
      this.rawExpertAdviceFromServer.splice(0)
      this.expertAdviseStaticListToTeacher.splice(0)
      this.expertAdviseStaticListToParent.splice(0)
      this.expertAdviseAnalysisStaticList.splice(0)
      this.expertAdviseCheckLisToParent.splice(0)
      this.expertAdviseCheckListToTeacher.splice(0)
      this.expertAnalysisAdviseCheckList.splice(0)
      this.lineChartData.historyCourseList.splice(0)
      this.lineChartData.xAxisData.splice(0)
      this.form.studentId = data.studentId
      this.form.studentName = data.studentName
      this.form.gpa = data.gpa
      this.form.scoreId = data.scoreId
      this.form.code = data.code
      this.form.address = data.address
      this.form.age = gap(data.birth)
      this.form.class = data.class
      this.form.class_no = data.class_no
      this.form.courseName = data.courseName
      this.form.courseID = data.course_no
      this.form.grader = data.class
      this.form.index_list = data.index_list
      this.form.types = data.types
      this.form.score_list = data.score_list
      this.form.relation_id = data.relation_id
      this.form.class_no = data.class_no
      this.form.is_red_list = data.is_red_list?.split(',')
      // 历史模式
      if (this.checked) {
        const list = data.analysis.split(',')
        list.forEach(item => {
          console.log(',')
          this.expertAdviseAnalysisStaticList.push(item)
          this.expertAnalysisAdviseCheckList.push(item)
        })
      }
      // 初始化成绩信息
      const indexArray = data.index_list?.split(',')
      const scoreArray = data.score_list?.split(',')
      this.courseTableData.splice(0)
      this.lineChartData.xAxisData = indexArray
      this.lineChartData.historyCourseQuotaList.splice(0)
      for (let i = 0; i < indexArray?.length; i++) {
        let index = i
        if (indexArray[i] !== '') {
          this.courseTableData.push({ order: ++index, name: indexArray[i], score: scoreArray[i], important: this.form.is_red_list[i] })
          // echarts 数据初始化
          this.lineChartData.historyCourseQuotaList.push({ quotName: indexArray[i], score: [] })
        }
        if (i === (indexArray.length - 1)) {
          this.courseTableData.push({ order: ++index, name: '个人绩点', score: data.gpa, important: 0 })
          this.courseTableData.push({ order: ++index, name: '班级排名', score: data.rank == -1 ? '重修' : data.rank, important: 0 })
        }
      }
    },
    showAddExpertAdviseDialog(data, checked) {
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.initFormData(data, checked)
      this.queryScore()
      this.queryFileList()
    },
    changeEvent() {
      this.$refs.lineChartComponent.initChart()
      this.$nextTick(() => {
        this.$refs.lineChartComponent.chartResize()
      })
    },
    tableRowClassName({ row }) {
      if (row.important == 1) {
        return 'warning-row'
      }
      return ''
    },
    confirm() {
      // this.dialogFormVisible = false
      if (!(this.expertAnalysisAdviseCheckList.length > 0)) {
        this.$message.error('请填写专家分析意见')
        return
      }
      if (!(this.expertAdviseCheckListToTeacher.length > 0)) {
        this.$message.error('请填写建议和措施(教师)')
        return
      }
      if (!(this.expertAdviseCheckLisToParent.length > 0)) {
        this.$message.error('请填写建议和措施(家长)')
        return
      }
      this.updateStudentsScore()
    },
    cancel() {
      this.dialogFormVisible = false
    },
    queryScore() {
      console.log(this.form.relation_id)
      console.log(this.form.studentId)
      const form = { relation_id: this.form.relation_id, studentId: this.form.studentId }
      fetchStudentScoreList(form).then(response => {
        const { data } = response.data
        data.forEach((item, index) => {
          const scoreList = item.score_list.split(',')
          this.lineChartData.historyCourseList.push({ scoreId: item.id, scoreList: scoreList, insert_time: item.insert_time })
          if (item.id === this.form.scoreId) {
            this.currentSpecialRecordText = item.special_record
          }
          for (let i = 0; i < scoreList.length; i++) {
            const length = this.lineChartData.historyCourseQuotaList[i].score.length
            this.lineChartData.historyCourseQuotaList[i].score[length] = scoreList[i]
          }
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取历史成绩失败 error${error}`)
      })
    },
    updateStudentsScore() {
      const form = { id: this.form.scoreId, analysis: this.expertAnalysisAdviseCheckList.toString() }
      updateStudentScore(form).then(response => {
        const { data } = response.data
        this.$message.success('更新学生成绩信息成功~')
        this.createNewAdvise('教师', this.expertAdviseCheckListToTeacher.toString())
        this.createNewAdvise('家长', this.expertAdviseCheckLisToParent.toString())
        this.createAdviseRecord()
      }).catch(error => {
        this.$message.error(`抱歉,更新学生成绩失败 error${error}`)
        this.dialogFormVisible = false
      })
    },
    createNewAdvise(role, adviseDetails) {
      const form = { score_id: this.form.scoreId, role: role, measures_for_details: adviseDetails }
      createNewAdvise(form).then(response => {
        const { data } = response.data
        this.$message.success('上传专家意见成功')
      }).catch(error => {
        this.$message.error(`抱歉,上传专家意见失败 error${error}`)
      }).finally(() => {
        this.dialogFormVisible = false
      })
    },
    createAdviseRecord() {
      const form = {
        student_id: this.form.studentId,
        score_id: this.form.scoreId,
        teacher_measure: this.expertAdviseCheckListToTeacher.toString(),
        parent_measure: this.expertAdviseCheckLisToParent.toString()
      }
      createExpertAdviseRecord([form]).then(response => {
        const { data } = response.data
        this.$message.success('上传专家意见记录成功')
      }).catch(error => {
        this.$message.error(`抱歉,上传专家意见记录失败 error${error}`)
      })
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
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, usages: item.file_usage })
        })
        this.currentFilePage++
        if (this.currentFilePage <= totalPageNum) {
          this.queryFileList()
        } else {
          if (this.upLoadFileList.length > 0) {
            this.currentVideoSrc = this.$store.state.common.fileUrl + this.upLoadFileList[0].name
          }
        }
      }).catch(error => {
        this.$message.error(`获取已上传课程资料失败,请稍后重试...${error}`)
      })
    },
    fetchExpertAdvise() {
      this.expertAdviseAnalysisStaticList.splice(0)
      this.expertAdviseStaticListToParent.splice(0)
      this.expertAdviseStaticListToTeacher.splice(0)
      this.rawExpertAdviceFromServer.splice(0)
      const fetchForm = { username: 'admin' }
      fetchCommonText(fetchForm).then(response => {
        const { data } = response.data
        data.reverse()
        data.forEach(item => {
          this.rawExpertAdviceFromServer.push(item)
          if (item.type == 1) {
            // 专家意见
            this.expertAdviseAnalysisStaticList.push(item.content)
          } else if (item.type == 2) {
            // 家长建议
            if (this.expertAdviseStaticListToParent.indexOf(item.content) === -1) {
              this.expertAdviseStaticListToParent.push(item.content)
            }
          } else {
            // 教师建议
            if (this.expertAdviseStaticListToTeacher.indexOf(item.content) === -1) {
              this.expertAdviseStaticListToTeacher.push(item.content)
            }
          }
        })
      }).catch(error => {
        this.$message.error(`获取专家分析失败,请稍后重试...${error}`)
      })
    },
    addExpertAdviseToServe(content, type) {
      const form = {
        user_name: 'admin',
        content: content,
        type: type
      }
      createCommonText([form]).then(response => {
        const { data } = response.data
        this.$message.success('添加成功')
      }).catch(error => {
        this.$message.error(`创建专家建议失败,请稍后重试...${error}`)
      }).finally(() => {
        this.fetchExpertAdvise()
      })
    },
    deleteExpertAdviseToServe(form) {
      deleteCommonText(form).then(response => {
        const { data } = response.data
        this.$message.success('删除成功')
      }).catch(error => {
        this.$message.error(`删除专家建议失败,请稍后重试...${error}`)
      }).finally(() => {
        this.fetchExpertAdvise()
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

    #title-divider {
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }

    .el-collapse {
      width: 100%;

      .el-collapse-item__header {
        color: #4C4C4C;
        font-weight: bold;
        padding-left: 20px;
      }

      .el-collapse-item__wrap {
        width: 100%;

        .el-collapse-item__content {
          position: relative;
          height: 100%;

          #el-button_info {
            position: absolute;
            right: 40px;
            bottom: 80px;
          }
          .el-table .warning-row {
            background: #FEF0F0;
          }
          .emptyContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 150px;
            font-size: 150px;

            p {
              font-size: 16px;
            }
          }

        }
        .advice_container{
          display: flex;
          justify-content: center;
          align-items: center;
          .div-advise {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 300px;
            height: 220px;
            border: #304156 2px solid;
            border-radius: 5px;
            margin-top: 10px;
            margin-right: 24px;
            .el-scrollbar__wrap {
              overflow-x: hidden;
              .el-checkbox-group {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: start;
                margin: 12px 12px;
              }
            }
          }
        }
      }
    }

    .foot-divider {
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
    }

    .foot-title {
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }

    .div-footer {
      margin-top: 13px;
      text-align: center;
    }
  }

  .form {
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

  .div-footer {
    display: flex;
    margin-top: 20px;
    justify-content: space-evenly;
  }
}

</style>

<!--修改dialog的全局样式-->
<style>

</style>
