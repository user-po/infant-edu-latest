<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-plus" />
        <span>{{ title }}</span>
      </div>
      <el-divider />
      <el-form ref="form" class="form" :rules="rules" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="学生姓名" :label-width="formLabelWidth" prop="name" style="padding: 0px">
          <el-input v-model="form.name" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" lable-height="30px" prop="sex" style="padding: 0px">
          <el-select v-model="form.sex" placeholder="请选择" size="small" style="width: 90px">
            <el-option
              v-for="item in options_sex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" prop="stuCode" style="padding: 0px">
          <el-input v-model="form.stuCode" :disabled="true" autocomplete="off" size="small" style="width: 220px" />
        </el-form-item>
        <el-form-item label="入学年月" :label-width="formLabelWidth" prop="Intake">
          <el-date-picker v-model="form.Intake" type="month" placeholder="选择年月" style="width: 120px" size="small" />
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth" prop="class_no" style="padding: 0px">
          <el-select v-model="form.class_no" placeholder="请选择" size="small" style="width: 120px" @change="pickClass">
            <el-option
              v-for="item in options_class"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月日" :label-width="formLabelWidth" prop="birth" style="padding: 0px">
          <el-date-picker v-model="form.birth" type="date" style="width: 160px" size="small" placeholder="选择日期 " @change="ageCal" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" prop="age" style="padding: 0px">
          <el-input v-model="form.age" :disabled="true" autocomplete="off" size="small" style="width: 120px" />
        </el-form-item>
        <br>
        <el-form-item label="家庭地址" :label-width="formLabelWidth" prop="address" style="padding: 0px">
          <el-input v-model="form.address" autocomplete="off" size="small" style="width: 160px" />
        </el-form-item>
        <el-form-item label="家长姓名" :label-width="formLabelWidth" prop="parent_name" style="padding: 0px">
          <el-input v-model="form.parent_name" autocomplete="off" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="parent_phone" style="padding: 0px">
          <el-input v-model="form.parent_phone" autocomplete="off" size="small" style="width: 120px" />
        </el-form-item>
        <br>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark" style="padding: 0px ;width: 90%">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="" style="width: 100%" />
        </el-form-item>
      </el-form>
      <div class="div-footer">
        <el-button id="el-button-add" type="primary" :loading="loading" style="width: 140px" @click="confirm('form')">提交</el-button>
        <el-button id="el-button-cancel" type="info" style="width: 140px" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cal, getTimeStamp, formatTimeToServe } from '@/utils/date'
import { fetchClassList } from '@/api/class'
import { getOrganizationDetailById } from '@/api/nursery'
import {fetchUniqueID} from "@/api/check";
export default {
  data() {
    return {
      title: '',
      flag: this.$store.state.common.DIALOGSHOW,
      dialogFormVisible: false,
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        stuCode: [
          { required: true, message: '请输入学号', trigger: 'change' }
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
        ],
        nurseryUniqueID: [
          { required: true, message: '未获取到ID,请稍后再试~', trigger: 'blur' }
        ]
      },
      options_class: [],
      options_sex: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 0
      }],
      form: {
        name: '',
        sex: '',
        age: '',
        stuCode: '',
        Intake: new Date(),
        birth: new Date(),
        class_no: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        remark: '',
        class_id: '',
        grade: '',
        classLevel: '',
        lng: '0',
        lat: '0',
        admin_code: '0',
        nurseryUniqueID: ''
      },
      formLabelWidth: '40px',
      classCurPage: 1,
      rawTableClasData: []
    }
  },
  watch: {
    form: function(newValue) {
      console.log(newValue.Intake)
      console.log(newValue.birth)
    }
  },
  methods: {
    opened() {
      this.fetchUniqueStudentID()
    },
    pickClass(value) {
      this.rawTableClasData.forEach((item) => {
        if (item.id === value) {
          console.log('格式化：' + JSON.stringify(item))
          this.form.class_id = item.id
          this.form.classLevel = item.class
          this.form.class_no = item.class_no
          this.form.grade = item.grade
        }
      })
    },
    initEditFormData(rawFormData) {
      rawFormData.Intake = getTimeStamp(rawFormData.Intake)
      rawFormData.birth = getTimeStamp(rawFormData.birth)
      rawFormData.age = cal(Date.now(), rawFormData.birth)
      console.log(JSON.stringify(rawFormData))
      // this.form.name = rawFormData.name
      // this.form.sex = rawFormData.sex
      // this.form.stuCode = rawFormData.stuCode
      // this.form.Intake = rawFormData.Intake
      // this.form = rawFormData
      Object.assign(this.form, rawFormData)
    },
    ageCal(pickDate) {
      console.log(pickDate)
      this.form.age = cal(Date.now(), pickDate)
    },
    showAddStudentDialog() {
      this.title = '添加学生'
      this.classCurPage = 1
      this.options_class.splice(0)
      this.rawTableClasData.splice(0)
      this.queryClassList()
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    showEditStudentDialog(rawFormData) {
      this.title = '修改学生信息'
      this.classCurPage = 1
      this.options_class.splice(0)
      this.rawTableClasData.splice(0)
      this.queryClassList()
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGEDIT
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        console.log(rawFormData)
        this.initEditFormData(rawFormData)
      })
    },
    confirm(formName) {
      // this.loading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          console.log('原始form：' + this.form.Intake)
          const deepForm = JSON.parse(JSON.stringify(this.form))
          deepForm.Intake = formatTimeToServe(deepForm.Intake)
          deepForm.birth = formatTimeToServe(deepForm.birth)
          deepForm.age = parseInt(deepForm.age)
          console.log('转化form：' + deepForm.Intake)
          if (this.flag === this.$store.state.common.DIALOGSHOW) {
            this.$emit('CommitAddStudent', deepForm)
          } else {
            // 更新多加一个id
            deepForm.id = this.form.id
            this.$emit('CommitEditStudent', deepForm)
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.loading = false
      this.dialogFormVisible = false
    },
    fetchUniqueStudentID() {
      fetchUniqueID().then(response => {
        const { data } = response.data
        this.form.stuCode = data?.stuno
      }).catch(error => {
        this.$message({ message: `获取学生学号失败->学号 ERROR:${error} `, type: 'error', duration: 10000 })
      })
    },
    // 获取年纪列表
    queryClassList() {
      const form = { curPage: this.classCurPage, organizationalId: this.$store.state.common.teacherOrganizationId }
      fetchClassList(form).then(response => {
        const { data, totalPageNum } = response.data
        data.forEach(item => {
          if (item.headmaster_id === this.$store.state.common.teacherId){
            this.options_class.push({ value: item.id, label: `${item.class}(${item.class_no})` })
            this.rawTableClasData.push(item)
          }
        })
        this.classCurPage++
        if (this.classCurPage <= totalPageNum) {
          this.queryClassList()
        }
      }).catch(error => {
        this.$message.error(`删除失败 sqlerr:${error}`)
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
//dialog 默认样式修改
::v-deep .el-dialog__header, ::v-deep .el-dialog__footer{
  display: none;
}
::v-deep .el-dialog{
  width: 590px;
  height: 520px;
  border: solid 1px #797979;
}
::v-deep .el-dialog__body{
  padding: 0px;
  width: 100%;
  height: 100%;
}

  .title{
    height: 40px;
    i{
      margin-left: 20px;
    }
    span{
      line-height: 40px;
      margin-left: 10px;
    }
  }
  .el-divider{
    margin: 0;
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

<!--修改dialog的全局样式-->
<style>

</style>
