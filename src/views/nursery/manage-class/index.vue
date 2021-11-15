<template>
  <div class="container">
    <div class="title">
      <i class="el-icon-notebook-1" />
      <span>班级管理</span>
    </div>
    <!--    标题-->
    <div class="input-stunum">
      <el-input id="el-input-stu" v-model="form.input" size="small" clearable placeholder="班级名称/年级" style="width: 195px" />
      <el-button id="el-button-query" :loading="queryLoading" size="small" @click="query">查询</el-button>
      <el-button id="el-button-reset" size="small" @click="reset">重置</el-button>
    </div>
    <!--    添加学生-->
    <el-row class="el-row-add">
      <el-col :span="2" :offset="20"> <el-button size="small" style="width: 140px;" @click="showAddDialog">+添加班级</el-button></el-col>
    </el-row>
    <add-nursery ref="AddClassComponents" @CommitAddClass="createClass" @CommitEditClass="editClass" />
    <delete ref="DeleteClassComponents" title="是否删除该班级的信息" @ConfirmDelete="deleteClass" />
    <!--    表格-->
    <template class="table" :fit="true">
      <el-table :key="key" v-loading="tableLoading" :data="tableData" border style="width: 95%" max-height="800px" fix :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column fixed prop="order" label="序号" />
        <el-table-column prop="class" label="年级" :filter-method="filterGrade" :filters="[{ text: '大班', value: '大班' }, { text: '中班', value: '中班' },{ text: '小班', value: '小班' }]" />
        <el-table-column prop="class_no" label="班级名称" />
        <el-table-column prop="InTake" label="入学年月" :filter-method="filterIntake" :filters="inTakeFilterArray" />
        <el-table-column prop="mainTeacher" label="主班老师" />
<!--        <el-table-column prop="teachTeacher" label="副班老师" />-->
<!--        <el-table-column prop="careTeacher" label="保育老师" />-->
        <el-table-column prop="studentsNumber" label="班级人数" />
        <el-table-column prop="mainTeacherContact" label="主班老师联系方式" />
<!--        <el-table-column prop="teachTeacherContact" label="副班老师联系方式" />-->
<!--        <el-table-column prop="careTeacherContact" label="保育老师联系方式" />-->
        <el-table-column prop="createTime" label="添加时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showEditDialog(scope.row)">修改</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :total="totalItem" :current-page="curPage" layout="prev, pager, next,jumper" style="margin: 15px 0px" @current-change="handleCurrentChange" />
      <!--        @size-change="" @current-change="" @prev-click="" @next-click=""-->
    </template>
  </div>
</template>

<script>
import AddNursery from '@/views/nursery/manage-class/components/AddClass'
import Delete from '@/components/manage/Delete'
import { createClass, fetchClassList, deleteClass, updateClass } from '@/api/class'
import { fetchTeacherList } from '@/api/teacher'
import { gap } from '@/utils/date'
export default {
  components: { AddNursery, Delete },
  data() {
    return {
      queryLoading: false,
      tableLoading: false,
      totalItem: 10,
      curPage: 1,
      curPageItemCount: 0,
      currentClassId: 0,
      curTeacherPage: 1,
      teacherList: [],
      key: 0,
      form: {
        input: '',
        genderCheckList: [],
        classCheckList: [],
        sexRadio: '',
        startAge: '',
        endAge: ''
      },
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
      tableData: [],
      rawTableData: [],
      addVisible: false,
      deleteVisible: false,
      editVisible: false
    }
  },
  mounted() {
    // 先访问 班级表，成功后再放问教师表，做班主任姓名的匹配
    this.queryTeacherList()
  },
  methods: {
    // 学生添加 删除 修改操作
    showAddDialog: function() {
      this.$refs.AddClassComponents.showAddClassDialog()
    },
    showEditDialog(data) {
      // this.currentClassId = rowId
      this.$refs.AddClassComponents.showEditClassDialog(data)
    },
    showDeleteDialog(rowId) {
      this.currentClassId = rowId
      this.$refs.DeleteClassComponents.showDeleteDialog(rowId)
    },
    handleCurrentChange(val) {
      this.curPage = val
      this.queryClassList()
    },
    filterGrade(value, row, column) {
      return row.class === value
    },
    filterIntake(value, row, column) {
      return row.InTake === value
    },
    reset() {
      this.form.inputStuNo = ''
    },
    query() {
      this.curPage = 1
      this.queryClassList()
    },
    // 根据条件查询班级列表
    queryClassList() {
      this.tableLoading = true
      const formFetch = {
        curPage: this.curPage,
        organizationalId: this.$store.state.common.nurseryId
      }
      if (this.form.input !== '') {
        formFetch.query = this.form.input
      }
      // formFetch.teacherId = this.form.input,
      // formFetch.classNum = this.form.input,
      // formFetch.class_no = this.form.input,
      // formFetch.grade = this.form.input,
      fetchClassList(formFetch).then(response => {
        console.log(response)
        this.tableData.length = 0
        const { data, totalPageNum } = response.data
        this.totalItem = parseInt(totalPageNum) * this.$store.state.common.pageSize
        this.curPageItemCount = data.length
        this.rawTableData = data
        data.forEach((item, index) => {
          console.log(item)
          const classItem = {
            order: ++index,
            id: item.id,
            InTake: item.grade,
            studentsNumber: item.class_people_num,
            class: item.class,
            class_no: item.class_no,
            remark: item.remark === true ? '无' : item.remark,
            createTime: item.insert_time
          }
          for (let i = 0; i < this.teacherList.length; i++) {
            if (this.teacherList[i].id === item.headmaster_id) {
              classItem.mainTeacher = this.teacherList[i].teacherName
              classItem.mainTeacherContact = this.teacherList[i].phoneNumber
              classItem.mainTeacherId = item.headmaster_id
            }
            if (this.teacherList[i].id === item.viceTeacherId) {
              classItem.teachTeacher = this.teacherList[i].teacherName
              classItem.teachTeacherContact = this.teacherList[i].phoneNumber
              classItem.teachTeacherId = item.viceTeacherId
            }
            if (this.teacherList[i].id === item.babySitterId) {
              classItem.careTeacher = this.teacherList[i].teacherName
              classItem.careTeacherContact = this.teacherList[i].phoneNumber
              classItem.careTeacherId = item.babySitterId
            }
          }
          this.tableData.push(classItem)
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取班级信息失败 error${error}`)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    queryTeacherList() {
      const formFetch = { curPage: this.curTeacherPage, organizational_id: this.$store.state.common.nurseryId }
      fetchTeacherList(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        data.forEach((item, index) => {
          this.teacherList.push({
            order: ++index,
            id: item.id,
            teacherName: item.name,
            title: item.title,
            lengthOfServiceSeniority: gap(item.working_time),
            account: '12988934',
            phoneNumber: item.phone,
            age: gap(item.birth),
            sex: item.sex === 0 ? '女' : '男',
            address: item.address,
            class: '',
            remark: item.remark,
            createTime: item.insert_time
          })
        })
        this.curTeacherPage++
        if (this.curTeacherPage <= totalPageNum) {
          this.queryTeacherList()
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取教师信息失败,请重试 error：${error}`)
      }).finally(() => {
        this.queryClassList()
      })
    },
    createClass(form) {
      console.log(form)
      createClass(form).then(response => {
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
          this.queryClassList()
        } else {
          this.$message.error(`添加失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddClassComponents.cancel()
      })
    },
    editClass(form) {
      console.log('更新 ：' + JSON.stringify(form))
      updateClass(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.queryClassList()
        } else {
          this.$message.error(`更新失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`更新失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddClassComponents.cancel()
      })
    },
    deleteClass() {
      deleteClass({ id: this.currentClassId }).then(response => {
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
          this.queryClassList()
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

