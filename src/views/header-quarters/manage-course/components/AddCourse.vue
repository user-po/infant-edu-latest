<template>
  <div class="container">
    <el-dialog :visible.sync="dialogFormVisible">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>{{ title }}</span>
      </div>
      <div id="title-divider" />
      <el-form ref="form" :rules="rules" class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="课程名称" :label-width="formLabelWidth" style="padding: 0px" prop="name">
          <el-input v-model="form.name" autocomplete="off" size="small" style="width: 180px" />
        </el-form-item>
        <el-form-item label="课程编码" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px" prop="code">
          <el-input v-model="form.code"  autocomplete="off" size="small" style="width: 150px" />
        </el-form-item>
        <el-form-item label="适合年级" :label-width="formLabelWidth" prop="classLevel">
          <el-select v-model="form.classLevel" placeholder="请选择" size="small" style="width: 120px">
            <el-option
              v-for="item in options_gender"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="课程领域" :label-width="formLabelWidth" style="padding: 0px" prop="types">
          <el-checkbox-group v-model="form.types">
            <el-checkbox label="健康" />
            <el-checkbox label="社会" />
            <el-checkbox label="科学" />
            <el-checkbox label="语言" />
            <el-checkbox label="艺术" />
          </el-checkbox-group>
        </el-form-item>
        <br>
      </el-form>
      <div class="foot-divider" />
      <span class="foot-title">课程指标</span>
      <el-row :gutter="20" style="margin-top: 8px;margin-left: 10px">
        <el-col :span="5">
          <el-input v-model="currentCourseQuota.quotaName" size="small" placeholder="指标名称" />
        </el-col>
        <el-col :span="5">
          <el-select v-model="currentCourseQuota.important" placeholder="请选择" size="small">
            <el-option
              v-for="item in options_isRed"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary" @click="addCourseQuota">添加指标</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" style="margin-left: 20px;margin-top: 10px">
        <el-col :span="22">
          <el-table
            v-if="courseTableData.length"
            :data="courseTableData"
            :row-class-name="tableRowClassName"
            border
            fix
            max-height="180px"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="指标名称"
            />
            <el-table-column
              prop="importantLabel"
              label="重要性"
            />
            <el-table-column
              fixed="right"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteQuarters(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="div-footer">
        <el-button id="el-button-submit" style="width: 140px; margin-bottom: 30px" size="small" @click="confirm">提交</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { upload } from '@/api/File'
import { formatTimeToServe } from '@/utils/date'
export default {
  data() {
    return {
      title: '',
      flag: this.$store.state.common.DIALOGSHOW,
      dialogFormVisible: false,
      innerVisible: false,
      currentCourseQuota: {
        order: 0,
        quotaName: '',
        important: 0
      },
      options_isRed: [
        {
          label: '重要',
          value: 1
        }, {
          label: '一般',
          value: 0
        }],
      courseTableData: [],
      rules: {
        name: [
          { required: true, message: '请输入课程名', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入课程编码', trigger: 'blur' }
        ],
        classLevel: [
          { required: true, message: '课程所属年级', trigger: 'change' }
        ],
        types: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ]
      },
      // 上传的文件列表
      fileList: [],
      form: {
        id: 0,
        name: '',
        code: '',
        classLevel: '',
        index_list: [],
        is_red_list: '',
        filesProps: '',
        types: []
      },
      formLabelWidth: '40px',
      options_gender: [{
        label: '大班',
        value: '大班'
      }, {
        label: '中班',
        value: '中班'
      }, {
        label: '小班',
        value: '小班'
      }],
      selectFiles: [
        {
          insertTime: '2021-06-29 12:33:33',
          name: '东跑西跑(作业)'
        }
      ],
      rawFormData: []
    }
  },
  watch: {
    fileList: function(value) {
      console.log(value)
    }
  },
  methods: {
    initEditFormData(rawFormData) {
      this.form.id = rawFormData.id
      this.form.name = rawFormData.name
      this.form.code = rawFormData.code
      this.form.classLevel = rawFormData.class
      this.form.types = rawFormData.types.split(',')
      const courseQuotaName = rawFormData.index_list.split(',')
      const courseQuotaImportant = rawFormData.is_red_list.split(',')
      for (let i = 0; i < courseQuotaName.length; i++) {
        if (courseQuotaName[i] !== '') {
          this.courseTableData.push({ id: Date.now() + i, name: courseQuotaName[i], important: courseQuotaImportant[i], importantLabel: courseQuotaImportant[i] == 1 ? '重要' : '一般' })
        }
      }
    },
    showAddCourseDialog() {
      this.title = '添加课程信息'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.courseTableData = []
      })
    },
    showEditCourseDialog(rawFormData) {
      this.title = '修改课程信息'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGEDIT
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.courseTableData.splice(0)
        console.log(rawFormData)
        this.initEditFormData(rawFormData)
      })
    },
    tableRowClassName({ row }) {
      if (row.important == 1) {
        return 'warning-row'
      }
      return ''
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const deepForm = JSON.parse(JSON.stringify(this.form))
          const typeString = []
          for (let i = 0; i < deepForm.types.length; i++) {
            typeString.push(deepForm.types[i])
          }
          deepForm.types = typeString.toString().trimEnd(',')
          const quotaList = []
          const is_red_list = []
          for (let i = 0; i < this.courseTableData.length; i++) {
            quotaList.push(this.courseTableData[i].name)
            is_red_list.push(this.courseTableData[i].important)
          }
          deepForm.is_red_list = is_red_list.toString().trimEnd(',')
          deepForm.index_list = quotaList.toString().trimEnd(',')
          // 课程号
          deepForm.course_no = Date.now()
          console.log(deepForm)
          const commitForm = [deepForm]
          if (this.form.index_list === '') {
            this.$message.error('请添加课程指标')
            return
          }
          if (this.flag === this.$store.state.common.DIALOGSHOW) {
            delete deepForm.id
            this.$emit('CommitAddCourse', commitForm)
          } else {
            // 更新多加一个id
            deepForm.id = this.form.id
            this.$emit('CommitEditCourse', deepForm)
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    addCourseQuota() {
      if (this.currentCourseQuota.quotaName) {
        this.courseTableData.push({ id: Date.now(), name: this.currentCourseQuota.quotaName, important: this.currentCourseQuota.important, importantLabel: this.currentCourseQuota.important === 1 ? '重要' : '一般' })
        this.currentCourseQuota.quotaName = ''
      } else {
        this.$message.error('请输入指标名称')
      }
    },
    deleteQuarters(id) {
      this.courseTableData = this.courseTableData.filter((item) => {
        if (id === item.id) {
          return false
        } else {
          return true
        }
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
    .el-table{
      font-size: 12px!important;
      th{
        padding: 0;
      }
      td{
        padding: 3px;
      }
    }
    .el-table .warning-row {
      background: #FEF0F0;
    }
    #title-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }
    .foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
      margin-top: 20px;
    }
    .foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }
    .div-upload-detail-info{
      width: 546px;
      height: 144px;
      border: black 2px solid;
      border-radius: 5px;
      margin-top: 10px;
      margin-right: 24px;
      ul{
        list-style: none;
        padding-left: 0px;
        li{
          span:nth-child(1){
            margin-left: 8px;
          }
          span:nth-child(2){
            margin-left: 50px;
          }
          span:nth-child(3){
            margin-left: 150px;
          }
          &:hover{
            background-color: #20a0ff;
          }
        }
      }

    }
    .div-footer{
      margin-top: 30px;
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
    padding: 15px 0 5px 0;
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

