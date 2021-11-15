<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>意见与措施</span>
        <el-checkbox v-model="checked" style="float: right">历史意见</el-checkbox>
      </div>
      <el-scrollbar style="height:100%;width: 100%">
        <el-tree :key="key" style="width: 300px;height: 600px" :data="treeData" accordion :props="treeProps" @node-click="handleNodeClick">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-tag v-if="data.studentsNumber" type="danger" size="mini" style="margin-left: 16px">+{{ data.studentsNumber }}</el-tag>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </el-card>
    <div v-if="showUnQualifiedDetail" class="course_container">
      <div class="course_container_title"><i class="el-icon-s-marketing" /></div>
      <h2>{{ currentTitle }}课程信息</h2>
      <el-table :key="tableKey" v-loading="tableLoading" size="small" height="500px" :data="unqualifiedCourseList" border style="overflow-y: auto;width: 95%;" fit :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column fixed prop="order" label="序号" />
        <el-table-column fixed prop="studentName" label="姓名" />
        <el-table-column prop="class" label="年级" />
        <el-table-column prop="class_no" label="班级" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="types" label="课程类型" />
        <!--        <el-table-column prop="index_list" label="课程指标" />-->
        <!--        <el-table-column prop="score_list" label="指标成绩" />-->
        <el-table-column prop="gpa" label="绩点" />
        <el-table-column prop="insert_time" label="添加时间" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="!checked" type="text" size="small" @click="showAddExpertAdviseDialog(scope.row)">{{ checked?'已录入专家意见':'专家意见' }}</el-button>
            <el-button v-if="!checked" type="text" size="small" @click="checkAdvised(scope.row)">已阅</el-button>
            <el-button v-if="checked" type="text" size="small" @click="showAddExpertAdviseDialog(scope.row)">{{ scope.row.is_read?'已阅':'已录入专家意见' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-expert-advised ref="AddExpertAdvise" />
  </div>
</template>

<script>
import AddExpertAdvised from '@/views/header-quarters/expert-advise/components/AddExpertAdvise'
import { getUnqualifiedStudentList, getSpecialRecordStudentList, getUnqualifiedStudentsHistory } from '@/api/nursery'
import { fetchSpecialReCordList, fetchUnqualifiedScoreList, fetchUnqualifiedStudentsScoresHistory } from '@/api/student'
import { getInfo } from '@/api/File'
import { readOk } from '@/api/score'
export default {
  components: {
    AddExpertAdvised
  },
  data() {
    return {
      key: 1,
      tableKey: 1,
      treeData: JSON.parse(JSON.stringify(this.$store.state.common.region)),
      treeProps: {
        label: 'name',
        children: 'children'
      },
      tableLoading: false,
      currentStudentId: 0,
      showUnQualifiedDetail: false,
      unqualifiedStudentList: [],
      specialRecordStudentList: [],
      unqualifiedCourseList: [],
      currentTitle: '',
      checked: false
    }
  },
  watch: {
    checked: function(newValue, oldValue) {
      this.unqualifiedCourseList.splice(0)
      this.specialRecordStudentList.splice(0)
      this.unqualifiedStudentList.splice(0)
      this.treeData = JSON.parse(JSON.stringify(this.$store.state.common.region))
      if (!this.checked) {
        this.queryUnqualifiedStudentList()
      } else {
        this.queryUnqualifiedStudentHistoryList()
      }
    }
  },
  mounted() {
    if (!this.checked) {
      this.queryUnqualifiedStudentList()
    } else {
      this.queryUnqualifiedStudentHistoryList()
    }
  },
  methods: {

    getReadStatus(data) {
      console.log(data)
    },
    checkAdvised(data) {
      this.tableLoading = true
      const form = { id: data.scoreId }
      readOk(form).then(response => {
        const { data } = response.data
        this.$message.success(`上传已阅记录成功`)
      }).catch(error => {
        this.$message.error(`抱歉,上传已阅记录失败${error}`)
      }).finally(() => {
        this.tableLoading = false
        if (!this.checked) {
          this.queryUnqualifiedCourseList(this.currentStudentId)
        } else {
          this.queryUnqualifiedCourseHistoryList(this.currentStudentId)
        }
      })
    },
    queryUnqualifiedCourseList(studentId) {
      this.tableLoading = true
      this.unqualifiedCourseList.splice(0)
      const form = { studentId: studentId }
      fetchUnqualifiedScoreList(form).then(response => {
        const { data } = response.data
        data.forEach((item, index) => {
          const unqualifiedCourse = {}
          for (let i = 0; i < this.unqualifiedStudentList.length; i++) {
            if (item.studentId === this.unqualifiedStudentList[i].student_id) {
              unqualifiedCourse.studentName = this.unqualifiedStudentList[i].student_name
            }
          }
          unqualifiedCourse.order = ++index
          unqualifiedCourse.id = item.id
          unqualifiedCourse.studentId = item.studentId
          unqualifiedCourse.studentName = item.stuName
          unqualifiedCourse.class_no = item.stuClassNo
          unqualifiedCourse.class = item.stuGrade
          unqualifiedCourse.score_list = item.score_list
          unqualifiedCourse.gpa = item.gpa
          unqualifiedCourse.scoreId = item.score_id
          unqualifiedCourse.insert_time = item.scoreInertTime
          unqualifiedCourse.courseName = item.course_name
          unqualifiedCourse.index_list = item.course_index_list
          unqualifiedCourse.types = item.course_types
          unqualifiedCourse.code = item.code
          unqualifiedCourse.rank = item.rank
          unqualifiedCourse.birth = item.stuBirth
          unqualifiedCourse.address = item.stuAddress
          unqualifiedCourse.relation_id = item.relation_id
          unqualifiedCourse.is_red_list = item.course_is_red_list

          this.unqualifiedCourseList.push(unqualifiedCourse)
        })
        console.log(this.unqualifiedCourseList)
      }).catch(error => {
        this.$message.error(`抱歉,获取学生课程详情失败${error}`)
        this.tableKey++
      }).finally(() => {
        this.tableLoading = false
      })
    },
    querySpecialCourseList(studentId) {
      this.tableLoading = true
      this.unqualifiedCourseList.splice(0)
      const form = { studentId: studentId }
      fetchSpecialReCordList(form).then(response => {
        const { data } = response.data
        data.forEach((item, index) => {
          const unqualifiedCourse = {}
          for (let i = 0; i < this.unqualifiedStudentList.length; i++) {
            if (item.studentId === this.unqualifiedStudentList[i].student_id) {
              unqualifiedCourse.studentName = this.unqualifiedStudentList[i].student_name
            }
          }
          unqualifiedCourse.order = ++index
          unqualifiedCourse.id = item.id
          unqualifiedCourse.studentId = item.studentId
          unqualifiedCourse.studentName = item.stuName
          unqualifiedCourse.class_no = item.stuClassNo
          unqualifiedCourse.class = item.stuGrade
          unqualifiedCourse.score_list = item.score_list
          unqualifiedCourse.gpa = item.gpa
          unqualifiedCourse.scoreId = item.score_id
          unqualifiedCourse.insert_time = item.scoreInertTime
          unqualifiedCourse.courseName = item.course_name
          unqualifiedCourse.index_list = item.course_index_list
          unqualifiedCourse.types = item.course_types
          unqualifiedCourse.code = item.code
          unqualifiedCourse.rank = item.rank
          unqualifiedCourse.birth = item.stuBirth
          unqualifiedCourse.address = item.stuAddress
          unqualifiedCourse.relation_id = item.relation_id
          unqualifiedCourse.is_red_list = item.course_is_red_list
          this.unqualifiedCourseList.push(unqualifiedCourse)
        })
        console.log(this.unqualifiedCourseList)
      }).catch(error => {
        this.$message.error(`抱歉,获取学生课程详情失败${error}`)
        this.tableKey++
      }).finally(() => {
        this.tableLoading = false
      })
    },
    queryUnqualifiedStudentList() {
      this.tableLoading = true
      getUnqualifiedStudentList().then(response => {
        const { data } = response.data
        Object.assign(this.unqualifiedStudentList, data)
        this.dataAnalysis(0, this.unqualifiedStudentList)
      }).catch(error => {
        this.$message.error(`抱歉,获取不达标学生信息失败${error}`)
      }).finally(() => {
        // 暂时取消查询
        // this.querySpecialRecordStudentList()
        this.tableLoading = false
      })
    },
    queryUnqualifiedStudentHistoryList() {
      this.tableLoading = true
      this.unqualifiedStudentList.splice(0)
      getUnqualifiedStudentsHistory().then(response => {
        const { data } = response.data
        Object.assign(this.unqualifiedStudentList, data)
        this.dataAnalysis(0, this.unqualifiedStudentList)
      }).catch(error => {
        this.$message.error(`抱歉,获取不达标学生信息失败${error}`)
      }).finally(() => {
        // 暂时取消查询
        // this.querySpecialRecordStudentList()
        this.tableLoading = false
      })
    },
    queryUnqualifiedCourseHistoryList(studentId) {
      this.tableLoading = true
      this.unqualifiedCourseList.splice(0)
      const form = { studentId: studentId }
      fetchUnqualifiedStudentsScoresHistory(form).then(response => {
        const { data } = response.data
        data.forEach((item, index) => {
          const unqualifiedCourse = {}
          for (let i = 0; i < this.unqualifiedStudentList.length; i++) {
            if (item.studentId === this.unqualifiedStudentList[i].student_id) {
              unqualifiedCourse.studentName = this.unqualifiedStudentList[i].student_name
            }
          }
          unqualifiedCourse.order = ++index
          unqualifiedCourse.id = item.id
          unqualifiedCourse.studentId = item.studentId
          unqualifiedCourse.studentName = item.stuName
          unqualifiedCourse.class_no = item.stuClassNo
          unqualifiedCourse.class = item.stuGrade
          unqualifiedCourse.score_list = item.score_list
          unqualifiedCourse.gpa = item.gpa
          unqualifiedCourse.scoreId = item.score_id
          unqualifiedCourse.insert_time = item.scoreInertTime
          unqualifiedCourse.courseName = item.course_name
          unqualifiedCourse.index_list = item.course_index_list
          unqualifiedCourse.types = item.course_types
          unqualifiedCourse.code = item.code
          unqualifiedCourse.rank = item.rank
          unqualifiedCourse.birth = item.stuBirth
          unqualifiedCourse.address = item.stuAddress
          unqualifiedCourse.relation_id = item.relation_id
          unqualifiedCourse.is_red_list = item.course_is_red_list
          unqualifiedCourse.analysis = item.analysis
          unqualifiedCourse.is_read = item.is_read?.data[0]
          this.unqualifiedCourseList.push(unqualifiedCourse)
        })
        console.log(this.unqualifiedCourseList)
      }).catch(error => {
        this.$message.error(`抱歉,获取学生历史课程详情失败${error}`)
        this.tableKey++
      }).finally(() => {
        this.tableLoading = false
      })
    },
    querySpecialRecordStudentList() {
      getSpecialRecordStudentList().then(response => {
        const { data } = response.data
        Object.assign(this.specialRecordStudentList, data)
        this.dataAnalysis(1, this.specialRecordStudentList)
      }).catch(error => {
        this.$message.error(`抱歉,获取特别记录学生信息失败${error}`)
      })
    },
    dataAnalysis(id, studentList) {
      studentList.forEach(studentItem => {
        // 遍历省
        this.treeData.forEach(provinceItem => {
          if (studentItem.organizational_province == provinceItem.code) {
            if (Object.prototype.hasOwnProperty.call(provinceItem, 'studentsNumber')) {
              console.log('++++')
              provinceItem.studentsNumber++
            } else {
              provinceItem.studentsNumber = 1
            }
            // 遍历市区
            provinceItem.children.forEach(cityItem => {
              if (cityItem.code == studentItem.organizational_city) {
                if (Object.prototype.hasOwnProperty.call(cityItem, 'studentsNumber')) {
                  cityItem.studentsNumber++
                } else {
                  cityItem.studentsNumber = 1
                }
                // 遍历区县
                cityItem.children.forEach(areaItem => {
                  if (areaItem.code == studentItem.organizational_area) {
                    if (Object.prototype.hasOwnProperty.call(areaItem, 'studentsNumber')) {
                      areaItem.studentsNumber++
                    } else {
                      areaItem.studentsNumber = 1
                    }
                    // 检查是否有children
                    if (!Object.prototype.hasOwnProperty.call(areaItem, 'children')) {
                      areaItem.children = []
                    }
                    let hasThisNursery = false
                    for (let i = 0; i < areaItem.children.length; i++) {
                      if (areaItem.children[i].code == studentItem.organizational_id) {
                        hasThisNursery = true
                      }
                    }
                    // 没有则新建改机构
                    if (!hasThisNursery) {
                      // 新建该机构
                      // areaItem.children.push({ code: studentItem.organizational_id, name: studentItem.organizational_name, children: [{ code: 0, name: '未达标', children: [] }, { code: 1, name: '特别记录', children: [] }] })
                      // areaItem.children.push({ code: studentItem.organizational_id, name: studentItem.organizational_name, children: [{ code: 0, name: '未达标', children: [] }] })
                      areaItem.children.push({ code: studentItem.organizational_id, name: studentItem.organizational_name, children: [] })
                    }
                    const nurseryItem = areaItem.children
                    for (let i = 0; i < nurseryItem.length; i++) {
                      if (nurseryItem[i].code == studentItem.organizational_id) {
                        if (Object.prototype.hasOwnProperty.call(nurseryItem[i], 'studentsNumber')) {
                          nurseryItem[i].studentsNumber++
                        } else {
                          nurseryItem[i].studentsNumber = 1
                        }
                        /* for (let j = 0; j < nurseryItem[i].children.length; j++) {
                          if (id == nurseryItem[i].children[j].code) {
                            if (Object.prototype.hasOwnProperty.call(nurseryItem[i].children[j], 'studentsNumber')) {
                              nurseryItem[i].children[j].studentsNumber++
                            } else {
                              nurseryItem[i].children[j].studentsNumber = 1
                            }
                            nurseryItem[i].children[j].children.push({ code: studentItem.student_id, name: studentItem.student_name, student_id: studentItem.student_id, flag: 'leaf' })
                          }
                        }*/
                        console.log('1111111111111')
                        console.log(nurseryItem[i])
                        /* for (let j = 0; j < nurseryItem[i].length; j++) {*/
                        // if (id == nurseryItem[i].children[j].code) {
                        // if (Object.prototype.hasOwnProperty.call(nurseryItem[i].children[j], 'studentsNumber')) {
                        //   nurseryItem[i].children[j].studentsNumber++
                        // } else {
                        //   nurseryItem[i].children[j].studentsNumber = 1
                        // }
                        console.log('22222222222')
                        console.log(nurseryItem[i].children)
                        nurseryItem[i].children.push({ code: studentItem.student_id, name: studentItem.student_name, student_id: studentItem.student_id, flag: 'leaf' })
                        // }
                        // }
                      }
                    }
                  }
                })
              }
            })
          }
        })
      })
      this.key++
    },
    handleNodeClick(data, node, nodeIndex) {
      if (Object.prototype.hasOwnProperty.call(data, 'flag')) {
        this.currentStudentId = data.student_id
        if (!this.checked) {
          this.queryUnqualifiedCourseList(data.student_id)
        } else {
          this.queryUnqualifiedCourseHistoryList(data.student_id)
        }
      }
    },
    showAddExpertAdviseDialog(data) {
      this.$refs.AddExpertAdvise.showAddExpertAdviseDialog(data, this.checked)
    }
  }
}
</script>

<style lang="scss"   scoped>
.container{
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items:center;
  width:100%;
  height:100%;
  ::v-deep .box-card{
    width: 17%;
    height: 100%;
    margin-top: 60px;
    margin-left: 40px;
    margin-bottom: 40px;
    .el-card__body{
      padding: 8px 0px 8px 8px;
      height: 620px;
      overflow:hidden;
      ::v-deep .el-tree{
        .el-tree-node__content{
          width: 300px;
          .custom-tree-node {
            width: 300px;
            display: flex;
            align-items: center;
            justify-content: start;
            font-size: 14px;
            padding-right: 8px;
          }
        }
      }
    }
  }
  .course_container{
    position: relative;
    width: 75%;
    height: 670px;
    background-color: #ffffff;
    border-radius: 8px;
    margin-left: 50px;
    padding: 40px;
    .course_container_title{
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -20px;
      left: 20px;
      width: 63px;
      height: 63px;
      border-radius: 4px;
      background-color: #53AC57;
      i{
        color: #ffffff;
        font-size: 35px;
      }
    }
    .el-table{
      margin-top: 20px;
    }
  }
}

</style>
