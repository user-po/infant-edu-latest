<template>
  <div class="container">
    <div class="title">
      <i class="el-icon-notebook-1" />
      <span>学生信息管理</span>
    </div>
    <!--    标题-->
    <div class="input-stunum">
      <el-input id="el-input-stu" v-model="form.inputStuNo" size="small" clearable placeholder="学号/学生姓名" style="width: 195px" />
      <el-button id="el-button-query" size="small" @click="query">查询</el-button>
      <el-button id="el-button-reset" size="small" @click="reset">重置</el-button>
    </div>
    <!--    高级筛选-->
    <!--    <span style="margin: 8px auto;display: block">高级筛选▽</span>-->
    <!--    <div class="input-filter">-->
    <!--      <div class="input-filter-gender">-->
    <!--        <span>年级:</span>-->
    <!--        <el-checkbox-group v-model="filter.genderCheckList" style="margin-left: 57px;">-->
    <!--          <el-checkbox v-for="(item) in options_grade" :label="item+'级'" />-->
    <!--        </el-checkbox-group>-->
    <!--      </div>-->

    <!--      <div class="input-filter-class">-->
    <!--        <span>班级:</span>-->
    <!--        <el-checkbox-group v-model="filter.classCheckList" style="margin-left: 57px;">-->
    <!--          <el-checkbox label="大班" />-->
    <!--          <el-checkbox label="中班" />-->
    <!--          <el-checkbox label="小班" />-->
    <!--        </el-checkbox-group>-->
    <!--      </div>-->

    <!--      <div class="input-filter-sex">-->
    <!--        <span>性别:</span>-->
    <!--        <el-checkbox-group v-model="filter.sexRadio" style="margin-left: 57px;">-->
    <!--          <el-checkbox label="男" />-->
    <!--          <el-checkbox label="女" />-->
    <!--        </el-checkbox-group>-->
    <!--      </div>-->

    <!--      <div class="input-filter-age">-->
    <!--        <span>年龄:</span>-->
    <!--        <el-select v-model="filter.startAge" placeholder="请选择" size="small" style="width: 120px;margin-left: 57px">-->
    <!--          <el-option-->
    <!--            v-for="item in options_age"-->
    <!--            :key="item.value"-->
    <!--            :label="item.label"-->
    <!--            :value="item.value"-->
    <!--          />-->
    <!--        </el-select>-->
    <!--        <span id="divide">~</span>-->
    <!--        <el-select v-model="filter.endAge" placeholder="请选择" size="small" style="width: 120px">-->
    <!--          <el-option-->
    <!--            v-for="item in options_age"-->
    <!--            :key="item.value"-->
    <!--            :label="item.label"-->
    <!--            :value="item.value"-->
    <!--          />-->
    <!--        </el-select>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    添加学生-->
    <el-row class="el-row-add">
      <el-col :span="2" :offset="20"> <el-button size="small" style="width: 140px;" @click="showAddDialog">+添加学生</el-button></el-col>
    </el-row>
    <add-student ref="AddStudentComponents" @CommitAddStudent="createStudent" @CommitEditStudent="editStudent" />
    <delete-student ref="DeleteStudentComponents" title="是否删除该学生的信息(家长信息同时删除)？" @ConfirmDelete="deleteStudent" />

    <!--    表格-->
    <template class="table">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :data="tableData"
        :stripe="true"
        border
        fix
        style="width: 95%"
        max-height="650px"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.4)"
        @filter-change="beforeFilter"
      >
        <el-table-column fixed prop="order" label="序号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="studentNo" label="学号" />
        <el-table-column prop="sex" label="性别" column-key="sex" :filter-method="filterGender" :filters="[{ text: '男', value: '男' }, { text: '女', value: '女' }]" />
        <el-table-column prop="age" label="年龄" column-key="age" :filter-method="filterAge" :filters="ageFilterArray" />
        <el-table-column prop="grade" label="年级" column-key="grade" :filter-method="filterIntake" :filters="inTakeFilterArray" />
        <el-table-column prop="class" label="班级" column-key="class" :filter-method="filterGrade" :filters="[{ text: '大班', value: '大班' }, { text: '中班', value: '中班' },{text: '小班', value: '小班'}]" />
        <el-table-column prop="class_no" label="班号" />
        <el-table-column label="家庭地址">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showMap(scope.row.id)">{{ scope.row.address }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="parentName" label="家长姓名" />
        <el-table-column prop="contact" label="联系方式" />
        <!--        <el-table-column label="学生课程信息">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button type="text" size="small" @click="showStudentCourseInfo(scope.row.id)">详情 >></el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="添加时间" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showEditDialog(scope.row.id)">修改</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :total="totalItem" :page-size.sync="singlePageSize" :current-page="curPage" layout="prev, pager, next,jumper" style="margin: 15px 0px" @current-change="handleCurrentChange" />
    </template>
  </div>
</template>

<script>
import AddStudent from '@/views/teacher/manage-student/components/AddStudent'
import DeleteStudent from '@/components/manage/Delete'
import { fetchStudentList, createStudent, updateStudent, deleteStudent } from '@/api/student'
import { fetchTeacherAllStudents } from '@/api/teacher'
import { getOrganizationDetailById } from '@/api/nursery'
export default {
  components: { AddStudent, DeleteStudent },
  data() {
    return {
      queryLoading: false,
      tableLoading: false,
      totalItem: 0,
      singlePageSize: 10,
      currentStudentId: '',
      curPage: 1,
      curPageItemCount: 0,
      relationship_id: 0,
      form: {
        inputStuNo: ''
      },
      filter: {
        genderCheckList: [],
        classCheckList: [],
        sexRadio: [],
        startAge: '',
        endAge: ''
      },
      options_grade: [
      ],
      options_age: [{
        label: '3岁',
        value: 3
      }, {
        label: '4岁',
        value: 4
      }, {
        label: '5岁',
        value: 5
      }, {
        label: '6岁',
        value: 6
      }, {
        label: '7岁',
        value: 7
      }, {
        label: '8岁',
        value: 8
      }, {
        label: '9岁',
        value: 9
      }],
      tableData: [],
      rawTableData: [],
      filterTabLeData: [],
      ageFilterArray: [{
        text: '1岁', value: '1'
      }, {
        text: '2岁', value: '2'
      }, {
        text: '3岁', value: '3'
      }, {
        text: '4岁', value: '4'
      }, {
        text: '5岁', value: '5'
      }, {
        text: '6岁', value: '6'
      }, {
        text: '7岁', value: '7'
      }, {
        text: '8岁', value: '8'
      }, {
        text: '9岁', value: '9'
      }, {
        text: '10岁', value: '10'
      }],
      inTakeFilterArray: [{
        text: '2018', value: '2018'
      }, {
        text: '2019', value: '2019'
      }, {
        text: '2020', value: '2020'
      }, {
        text: '2021', value: '2021'
      }, {
        text: '2022', value: '2022'
      }, {
        text: '2023', value: '2023'
      }, {
        text: '2024', value: '2024'
      }],
      addVisible: false,
      deleteVisible: false,
      editVisible: false
    }
  },
  watch: {
    filter: {
      handler(newValue) {
        console.log(newValue)
        this.filterTable()
      },
      deep: true
    }
  },
  mounted() {
    this.queryStudentList()
  },
  methods: {
    showMap(nurseryId) {
      this.rawTableData.forEach((item) => {
        if (item.id === nurseryId) { // 450303
          this.$refs.MapComponents.showMapDialog({ targetAddress: '', targetLat: item.lat, targetLng: item.lng,
            targetProvinceCode: item.province,
            targetCityCode: item.city,
            targetAreaCode: item.area })
        }
      })
    },
    // 学生添加 删除 修改操作
    showAddDialog: function() {
      this.$refs.AddStudentComponents.showAddStudentDialog()
    },
    showEditDialog(row) {
      this.rawTableData.forEach((item) => {
        if (item.id === row) {
          this.$refs.AddStudentComponents.showEditStudentDialog(item)
        }
      })
    },
    showDeleteDialog(row) {
      this.currentStudentId = parseInt(row)
      this.$refs.DeleteStudentComponents.showDeleteDialog(row)
    },
    showStudentCourseInfo(row) {

    },
    handleCurrentChange(val) {
      this.curPage = val
      console.log(val)
      this.queryStudentList()
    },
    reset() {
      this.form = {
        inputStuNo: ''
      }
      this.filter = {
        genderCheckList: [],
        classCheckList: [],
        sexRadio: [],
        startAge: '',
        endAge: ''
      }
    },
    filterAge(value, row, column) {
      return row.age === parseInt(value)
    },
    filterGender(value, row, column) {
      return row.sex === value
    },
    filterIntake(value, row, column) {
      return row.grade === value
    },
    filterGrade(value, row, column) {
      return row.class === value
    },
    beforeFilter(value) {
      console.log(value)
      if (value.grade?.length > 0 || value.class?.length > 0 || value.age?.length > 0 || value.sex?.length > 0) {
        this.singlePageSize = 100
      } else {
        this.singlePageSize = 10
      }
    },
    filterTable() {
      this.tableData = this.filterTabLeData.filter((item, index) => {
        let flag = true
        if (this.filter.genderCheckList.length > 0) {
          flag = false
          this.filter.genderCheckList.forEach((genderItem) => {
            if (parseInt(genderItem) === parseInt(item.grade)) {
              flag = true
            }
          })
          if (flag !== true) {
            return flag
          }
        }
        if (this.filter.classCheckList.length > 0) {
          flag = false
          this.filter.classCheckList.forEach((classItem) => {
            flag = false
            if (classItem === item.class) {
              flag = true
            }
          })
          if (flag !== true) {
            return flag
          }
        }
        if (this.filter.sexRadio.length > 0) {
          flag = false
          const sex = this.filter.sexRadio[0]
          if (sex === String(item.sex)) {
            flag = true
          }
          if (flag !== true) {
            return flag
          }
        }
        if (this.filter.startAge > 0) {
          flag = false
          if (item.age >= this.filter.startAge) {
            flag = true
          }
          console.log(flag)

          if (flag !== true) {
            return flag
          }
        }
        if (this.filter.endAge > 0) {
          flag = false
          if (item.age <= this.filter.endAge) {
            flag = true
          }
          if (flag !== true) {
            return flag
          }
        }
        return flag
      })
    },
    query() {
      this.curPage = 1
      this.queryStudentList()
    },
    // 根据条件查询学生列表
    queryStudentList() {
      this.tableLoading = true
      const formFetch = {
        teacherId: this.$store.state.common.teacherId,
        curPage: this.curPage
      }
      if (this.form.inputStuNo !== '') {
        formFetch.query = this.form.inputStuNo
      }
      this.tableData.length = 0
      fetchTeacherAllStudents(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        this.totalItem = parseInt(totalPageNum) * this.$store.state.common.pageSize
        this.curPageItemCount = data.length
        this.rawTableData = data
        data.forEach((item, index) => {
          if (!this.options_grade.includes(item.grade)) {
            this.options_grade.push(item.grade)
          }
          this.tableData.push({
            order: ++index,
            id: item.id,
            name: item.name,
            studentNo: item.stuCode,
            sex: item.sex === 1 ? '男' : '女',
            age: item.age,
            grade: item.grade,
            class: item.class,
            class_no: item.class_no,
            address: item.address,
            parentName: item.parent_name,
            contact: item.parent_phone,
            courseInfo: '详细信息',
            remark: item.remark,
            createTime: item.insert_time
          })
        })
        this.filterTabLeData = JSON.parse(JSON.stringify(this.tableData))
        this.filterTable()
      }).catch(error => {
        this.$message.error(`抱歉,获取学生信息失败 ${error}`)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    createStudent(form) {
      console.log(form)
      createStudent(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          // 添加成功，当前页已满，直接加载下一页
          if (this.curPageItemCount === this.$store.state.common.pageSize) {
            // 添加学生成功，重新获取列表
            this.curPage++
          }
          this.queryStudentList()
        } else {
          this.$message.error(`添加失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddStudentComponents.cancel()
      })
    },
    editStudent(form) {
      console.log('更新 ：' + JSON.stringify(form))
      updateStudent(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.queryStudentList()
        } else {
          this.$message.error(`更新失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`更新失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddStudentComponents.cancel()
      })
    },
    deleteStudent() {
      deleteStudent({ id: this.currentStudentId }).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 删除之后，当前页已空，重新加载上一页
          if (this.curPageItemCount === 1) {
            --this.curPage
          }
          this.queryStudentList()
        } else {
          this.$message.error(`删除失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container{
    width: 100%;
    margin-left: 50px;
    .title{
      margin-top: 4px;
      i{
        position: relative;
        top: 4px;
        color: black;
        font-size: 34px;
      }
      span{
        margin-left: 4px;
        color: #333333;
        font-size: 19px;
        font-weight: bold;
      }
    }
    .input-stunum{
      margin-top: 20px;
      .el-input-stu{
      }
      #el-button-query{
        width: 140px;
        margin-left: 22px;
      }
      #el-button-reset{
        width: 140px;
        margin-left: 22px;
      }
    }

    .input-filter{
      font-size: 14px;
      div{
        display: flex;
        justify-content: start;
        align-items: center;
        color: #333333;
        margin: 5px 0px;
      }
      label{
        font-weight: normal;
      }
      .input-filter-age{
        #divide{
          margin-left: 15px;
          margin-right: 15px;
        }
      }
    }
    .el-row-add{
      margin: 15px;
    }
  }
</style>
