<template>
  <div class="container">
    <div class="title">
      <i class="el-icon-notebook-1" />
      <span>课程管理</span>
    </div>
    <!--    标题-->
    <div class="input-stunum">
      <el-input id="el-input-stu" v-model="form.inputStuNo" size="small" clearable placeholder="课程名称" style="width: 195px" />
      <el-button id="el-button-query" size="small" :loading="queryLoading" @click="query">查询</el-button>
      <el-button id="el-button-reset" size="small" @click="reset">重置</el-button>
    </div>
    <!--    高级筛选-->
    <!--    <span style="margin: 8px auto;display: block">高级筛选▽</span>-->
    <!--    <div class="input-filter">-->
    <!--      <div class="input-filter-class">-->
    <!--        <span>适合年级:</span>-->
    <!--        <el-checkbox-group v-model="filter.classCheckList" style="margin-left: 57px;">-->
    <!--          <el-checkbox label="大班" />-->
    <!--          <el-checkbox label="中班" />-->
    <!--          <el-checkbox label="小班" />-->
    <!--        </el-checkbox-group>-->
    <!--      </div>-->

    <!--      <div class="input-filter-course-type">-->
    <!--        <span>课程类型:</span>-->
    <!--        <el-checkbox-group v-model="filter.courseTypeCheckList" style="margin-left: 57px;">-->
    <!--          <el-checkbox label="健康" />-->
    <!--          <el-checkbox label="社会" />-->
    <!--          <el-checkbox label="科学" />-->
    <!--          <el-checkbox label="语言" />-->
    <!--          <el-checkbox label="艺术" />-->
    <!--        </el-checkbox-group>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    添加学生-->
    <el-row class="el-row-add">
      <el-col :span="2" :offset="20"> <el-button size="small" style="width: 140px;" @click="showAddDialog">+添加课程</el-button></el-col>
    </el-row>
    <add-course ref="AddCourseComponents" @CommitAddCourse="createCourse" @CommitEditCourse="editCourse" />
    <delete ref="DeleteCourseComponents" title="是否删除该课程的信息？" @ConfirmDelete="deleteCourse" />
    <Upload ref="Upload" @preview="showPreviewDialog" />
    <Preview ref="Preview" />
    <!--    表格-->
    <template class="table">
      <el-table v-loading="tableLoading" :data="tableData" border style="width: 95%" max-height="700px" fix :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column fixed prop="order" label="序号" />
        <el-table-column prop="code" label="课程代码" fixed />
        <el-table-column prop="name" label="课程" fixed />
        <el-table-column prop="class" label="适合年级" :filter-method="filterGrade" :filters="[{ text: '大班', value: '大班' }, { text: '中班', value: '中班' },{ text: '小班', value: '小班' }]" />
        <el-table-column prop="types" label="课程类型" :filter-method="filterCourseType" :filters="[{ text: '健康', value: '健康' }, { text: '社会', value: '社会' },{ text: '语言', value: '语言' },{ text: '科学', value: '科学' },{ text: '艺术', value: '艺术' }]" />
        <!--          <el-table-column label="课程教材" width="150">-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-button type="text" size="small" @click="showCourseDataInfo(scope.row.id)">课程教材 >></el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <el-table-column prop="insert_time" label="添加时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showEditDialog(scope.row.id)">修改</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id)">删除</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showUploadDialog(scope.row.id)">上传课程资料</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="curPage" background layout="prev, pager, next,jumper" :total="totalItem" style="margin: 15px 0px" @current-change="handleCurrentChange" />
    </template>
  </div>
</template>

<script>
import Delete from '@/components/manage/Delete'
import AddCourse from '@/views/header-quarters/manage-course/components/AddCourse'
import { createCourse, deleteCourse, updateCourse, fetchCoursesList } from '@/api/course'
import Upload from '@/views/header-quarters/manage-course/components/Upload'
import Preview from '@/views/header-quarters/manage-course/components/Preview'
export default {
  components: { Delete, AddCourse, Upload, Preview },
  data() {
    return {
      queryLoading: false,
      totalItem: 10,
      tableLoading: false,
      curPage: 1,
      form: {
        inputStuNo: ''
      },
      filter: {
        classCheckList: [],
        courseTypeCheckList: []
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
      tableData: [],
      curPageItemCount: 0,
      currentCourseId: 0,
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
        this.filterTable()
      },
      deep: true
    }
  },
  mounted() {
    this.queryCourseList()
  },
  methods: {
    // 学生添加 删除 修改操作
    showAddDialog: function() {
      this.$refs.AddCourseComponents.showAddCourseDialog()
    },
    showEditDialog(rowId) {
      this.rawTableData.forEach(item => {
        if (item.id === rowId) {
          this.$refs.AddCourseComponents.showEditCourseDialog(item)
        }
      })
    },
    showDeleteDialog(rowId) {
      console.log(rowId)
      this.currentCourseId = rowId
      this.$refs.DeleteCourseComponents.showDeleteDialog(rowId)
      console.log(this.currentCourseId)
    },
    showUploadDialog(id) {
      this.$refs.Upload.showUploadDialog(id)
    },
    showCourseDataInfo(row) {
    },
    showPreviewDialog(type, name, fileUrl) {
      this.$refs.Preview.showPreviewDialog(type, name, fileUrl)
    },
    handleCurrentChange(val) {
      this.curPage = val
      this.queryCourseList()
    },
    reset() {
      this.form = {
        inputStuNo: ''
      }
      this.filter = {
        classCheckList: [],
        courseTypeCheckList: []
      }
    },
    filterGrade(value, row, column) {
      return row.class === value
    },
    filterCourseType(value, row, column) {
      return row.types.indexOf(value) !== -1
    },
    filterTable() {
      this.tableData = this.filterTabLeData.filter((item, index) => {
        let flag = true
        if (this.filter.courseTypeCheckList.length > 0) {
          flag = false
          this.filter.courseTypeCheckList.forEach((courseTypeItem) => {
            console.log(courseTypeItem)
            console.log(item.types)
            if (item.types.search(courseTypeItem) !== -1) {
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
        return flag
      })
    },
    query() {
      this.curPage = 1
      this.queryCourseList()
    },
    // 根据条件查询课程列表
    queryCourseList() {
      this.queryLoading = true
      this.tableLoading = true
      const formFetch = {
        // studentName: this.form.inputStuNo,
        curPage: this.curPage
      }
      if (this.form.inputStuNo !== '') {
        formFetch.query = this.form.inputStuNo
      }
      this.tableData.length = 0
      fetchCoursesList(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        console.log(data)
        this.totalItem = parseInt(totalPageNum) * this.$store.state.common.pageSize
        this.curPageItemCount = data.length
        this.rawTableData = data
        data.forEach((item, index) => {
          this.tableData.push({
            order: ++index,
            id: item.id,
            name: item.name,
            class: item.class,
            types: item.types,
            code: item.code,
            remark: item.remark,
            insert_time: item.insert_time
          })
        })
        this.filterTabLeData = JSON.parse(JSON.stringify(this.tableData))
        // this.filterTable()
      }).catch(error => {
        this.$message.error(`抱歉,获取课程信息失败 ${error}`)
      }).finally(() => {
        this.tableLoading = false
        this.queryLoading = false
      })
    },
    createCourse(form) {
      console.log(form)
      createCourse(form).then(response => {
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
          this.queryCourseList()
        } else {
          this.$message.error(`添加失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddCourseComponents.cancel()
      })
    },
    editCourse(form) {
      console.log('更新 ：' + JSON.stringify(form))
      updateCourse(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.queryCourseList()
        } else {
          this.$message.error(`更新失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`更新失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddCourseComponents.cancel()
      })
    },
    deleteCourse() {
      console.log(this.currentCourseId)
      deleteCourse({ id: this.currentCourseId }).then(response => {
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
          this.queryCourseList()
        } else {
          this.$message.error(`删除失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      })
    },
    // 获取年纪列表
    queryClassList() {
      this.$store.dispatch('class_/fetchClassList').then(response => {
        this.options_grade = Array.from(this.$store.state.class_.gradeList)
        console.log(this.options_grade)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
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
