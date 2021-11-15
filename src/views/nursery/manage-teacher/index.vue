<template>
  <div class="container">
    <div class="title">
      <i class="el-icon-notebook-1" />
      <span>教师管理</span>
    </div>
    <!--    标题-->
    <div class="input-stunum">
      <el-input id="el-input-stu" v-model="form.inputStuNo" size="small" clearable placeholder="账号/姓名/课程名称" style="width: 195px" />
      <el-button id="el-button-query" size="small" :loading="queryLoading" @click="query">查询</el-button>
      <el-button id="el-button-reset" size="small" @click="reset">重置</el-button>
    </div>
    <!--    添加学生-->
    <el-row class="el-row-add">
      <el-col :span="2" :offset="20"> <el-button size="small" style="width: 140px;" @click="showAddDialog">+添加教师</el-button></el-col>
    </el-row>
    <add-teacher ref="AddTeacherComponents" @CommitAddTeacher="createTeacher" @CommitEditTeacher="editTeacher" />
    <delete ref="DeleteComponents" title="是否删除该机构的信息" @ConfirmDelete="deleteTeacher" />
    <!--    表格-->
    <template class="table">
      <el-table v-loading="tableLoading" :data="tableData" border style="width: 95%" max-height="500px" fix :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column fixed prop="order" label="序号" />
        <el-table-column prop="teacherName" label="教师姓名" />
        <el-table-column prop="title" label="教师类别" :filter-method="filterTeacherType" :filters="[{ text: '主班老师', value: '主班老师' }, { text: '副班老师', value: '副班老师' },{ text: '保育老师', value: '保育老师' }]" />
        <el-table-column prop="lengthOfServiceSeniority" label="工龄" />
<!--        <el-table-column prop="account" label="账号" />-->
        <el-table-column prop="phoneNumber" label="手机号" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="sex" label="性别" :filter-method="filterGender" :filters="[{ text: '男', value: '男' }, { text: '女', value: '女' }]" />
        <el-table-column prop="address" label="家庭地址" />
        <el-table-column prop="class" label="所带班级">
          <template slot-scope="scope">
            <el-popover placement="right" title="所带班级" width="200" trigger="click">
              <el-tree :props="defaultProps" lazy :load="loadNode" />
              <el-button slot="reference" type="text" size="small" @click="showPopover(scope.row)">详细信息 >></el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showEditDialog(scope.row.id)">修改</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="totalItem"
        :current-page="curPage"
        layout="prev, pager, next,jumper"
        style="margin: 15px 0px"
        @current-change="handleCurrentChange"
      />
    </template>
  </div>
</template>

<script>
import AddTeacher from '@/views/nursery/manage-teacher/components/AddTeacher'
import Delete from '@/components/manage/Delete'
import { createTeacher, fetchTeacherList, deleteTeacher, updateTeacher, checkCourseIsLogScore } from '@/api/teacher'
import { gap } from '@/utils/date'
import { fetchClassList } from '@/api/class'
export default {
  components: { AddTeacher, Delete },
  data() {
    return {
      queryLoading: false,
      curPage: 1,
      classCurPage: 1,
      totalItem: 10,
      tableLoading: false,
      curPageItemCount: 0,
      currentTeacherId: 0,
      currentTeacherTitle: '',
      headerClassCourseList: [],
      middleClassCourseList: [],
      babyClassCourseLise: [],
      scoreHadUpload: false,
      form: {
        inputStuNo: '',
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
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      tableData: [],
      rawTableData: [],
      addVisible: false,
      deleteVisible: false,
      editVisible: false
    }
  },
  watch: {
    filter: {
      handler(newValue) {
        console.log(newValue)
        // this.filterTable()
      },
      deep: true
    }
  },
  mounted() {
    this.queryTeacherList()
  },
  methods: {
    showPopover(row) {
      this.currentTeacherId = row.id
      this.currentTeacherTitle = row.title
    },
    // 学生添加 删除 修改操作
    showAddDialog: function() {
      this.$refs.AddTeacherComponents.showAddTeacherDialog()
    },
    showEditDialog(rowId) {
      this.rawTableData.forEach((item) => {
        if (item.id === rowId) {
          this.$refs.AddTeacherComponents.showEditTeacherDialog(item)
        }
      })
    },
    showDeleteDialog(rowId) {
      this.currentTeacherId = parseInt(rowId)
      this.$refs.DeleteComponents.showDeleteDialog(rowId)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.curPage = val
    },
    reset() {
      this.form.inputStuNo = ''
    },
    filterTeacherType(value, row, column) {
      return row.title === value
    },
    filterGender(value, row, column) {
      return row.sex === value
    },
    query() {
      this.curPage = 1
      this.queryTeacherList()
    },
    // 根据条件查询学生列表
    queryTeacherList() {
      this.tableLoading = true
      const formFetch = {
        // studentName: this.form.inputStuNo,
        curPage: this.curPage,
        organizational_id: this.$store.state.common.nurseryId
      }
      if (this.form.inputStuNo !== '') {
        formFetch.query = this.form.inputStuNo
      }
      this.tableData.length = 0
      fetchTeacherList(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        this.totalItem = parseInt(totalPageNum) * this.$store.state.common.pageSize
        this.curPageItemCount = data.length
        this.rawTableData = data
        data.forEach((item, index) => {
          this.tableData.push({
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
      }).catch(error => {
        this.$message.error(`抱歉,获取教师信息失败,请重试 error：${error}`)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    createTeacher(form) {
      console.log(form)
      createTeacher(form).then(response => {
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
          this.queryTeacherList()
        } else {
          this.$message.error(`添加失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddTeacherComponents.cancel()
      })
    },
    editTeacher(form) {
      console.log('更新 ：' + JSON.stringify(form))
      updateTeacher(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.queryTeacherList()
        } else {
          this.$message.error(`更新失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`更新失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddTeacherComponents.cancel()
      })
    },
    deleteTeacher() {
      deleteTeacher({ id: this.currentTeacherId }).then(response => {
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
          this.queryTeacherList()
        } else {
          this.$message.error(`删除失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      })
    },
    queryClassList(value, resolve) {
      const formFetch = {
        curPage: this.classCurPage
      }
      if (this.currentTeacherTitle === '主班老师') {
        formFetch.headMasterId = this.currentTeacherId
      } else if (this.currentTeacherTitle === '副班老师') {
        formFetch.viceTeacherId = this.currentTeacherId
      } else if (this.currentTeacherTitle === '保育老师') {
        formFetch.babySitterId = this.currentTeacherId
      }
      fetchClassList(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        data.forEach((item, index) => {
          if (item.class === '大班') {
            this.headerClassCourseList.push({ label: item.class_no, leaf: true })
          } else if (item.class === '中班') {
            this.middleClassCourseList.push({ label: item.class_no, leaf: true })
          } else if (item.class === '小班') {
            this.babyClassCourseLise.push({ label: item.class_no, leaf: true })
          }
        })
        this.classCurPage++
        if (this.classCurPage <= totalPageNum) {
          this.queryClassList(value, resolve)
        } else {
          if (value === '大班') {
            return resolve(this.headerClassCourseList)
          } else if (value === '中班') {
            return resolve(this.middleClassCourseList)
          } else if (value === '小班') {
            return resolve(this.babyClassCourseLise)
          }
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取班级信息失败 error${error}`)
      }).finally(() => {
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ label: '大班' }, { label: '中班' }, { label: '小班' }])
      }
      if (node.level > 1) return resolve([])
      console.log(node)
      this.classCurPage = 1
      this.headerClassCourseList.splice(0)
      this.middleClassCourseList.splice(0)
      this.babyClassCourseLise.splice(0)
      this.queryClassList(node.label, resolve)
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

