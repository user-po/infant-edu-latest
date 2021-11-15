<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-plus" />
        <span>{{ title }}</span>
      </div>
      <el-divider />
      <el-form ref="form" :rules="rules" class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="教师姓名" :label-width="formLabelWidth" prop="name" style="padding: 0px">
          <el-input v-model="form.name" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" lable-height="30px" prop="account" style="padding: 0px">
          <el-input v-model="form.account" :disabled="true" placeholder="自动生成" autocomplete="off" size="small" style="width: 140px" />
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth" disabled="true" prop="birth" style="padding: 0px">
          <el-date-picker v-model="form.birth" type="date" placeholder="选择年月" style="width: 140px" size="small" />
        </el-form-item>
        <el-form-item label="参加工作日期" :label-width="formLabelWidth" prop="working_time">
          <el-date-picker v-model="form.working_time" type="month" placeholder="选择年月" style="width: 120px" size="small" />
        </el-form-item>
        <br>
        <el-form-item label="家庭地址" :label-width="formLabelWidth" prop="address" style="padding: 0px">
          <el-input v-model="form.address" autocomplete="off" size="small" style="width: 250px" />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone" style="padding: 0px">
          <el-input v-model="form.phone" autocomplete="off" size="small" style="width: 160px" />
        </el-form-item>
<!--        <el-form-item label="教师类别" :label-width="formLabelWidth" prop="title" style="padding: 0px">
          <el-select v-model="form.title" placeholder="请选择" size="small" style="width: 120px">
            <el-option
              v-for="item in options_teacherType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>-->
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex" style="padding: 0px">
          <el-select v-model="form.sex" placeholder="请选择" size="small" style="width: 100px">
            <el-option
              v-for="item in options_sexType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="备注" :label-width="formLabelWidth" style="padding: 0px ;width: 90%">
          <el-input v-model="form.remark" type="textarea" :rows="1" placeholder="" style="width: 100%" />
        </el-form-item>
      </el-form>
      <!--      <span id="foot-title">关联班级</span>-->
      <!--      <el-form ref="formRelation" :rules="rules">-->
      <!--        <el-form-item>-->
      <!--          <div class="block">-->
      <!--            <el-cascader-->
      <!--              v-model="form.class"-->
      <!--              :options="options_class"-->
      <!--              :props="props"-->
      <!--              placeholder="请选择"-->
      <!--              collapse-tags-->
      <!--              clearable-->
      <!--            />-->
      <!--          </div>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <div class="div-footer">
        <el-button id="el-button-add" type="primary" :loading="loading" style="width: 140px" @click="confirm">提交</el-button>
        <el-button id="el-button-cancel" type="info" style="width: 140px" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatTimeToServe } from '@/utils/date'
import { fetchClassList } from '@/api/class'
import { checkPhoneUsed } from '@/api/check'

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== '') {
        this.checkPhoneHadUsed(value, callback)
      }
    }
    return {
      title: '添加教师',
      flag: this.$store.state.common.DIALOGSHOW,
      loading: false,
      dialogFormVisible: false,
      classList: [],
      currentTeacherPage: 1,
      rules: {
        name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, type: 'number', message: '请选择性别', trigger: 'change' }
        ],
        birth: [
          { required: true, message: '请选择出生年月日', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入家庭地址', trigger: 'blur' }
        ],
        working_time: [
          { required: true, message: '请输入参加工作日期', trigger: 'blur' }
        ],
        phone: [
          { validator: validatePass, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请选择教师类别', trigger: 'blur' }
        ]
      },
      oldTeacherPhone: '',
      form: {
        name: '',
        account: '',
        sex: '',
        birth: new Date(),
        working_time: new Date(),
        title: '主班老师',
        class: [],
        address: '',
        phone: '',
        remark: ''
      },
      formLabelWidth: '40px',
      options_teacherType: [{
        label: '主班老师',
        value: '主班老师'
      }],
      options_sexType: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 0
      }],
      options_class: [],
      props: { multiple: true }
    }
  },
  mounted() {

  },
  methods: {
    initEditFormData(rawFormData) {
      this.form.name = rawFormData.name
      this.form.address = rawFormData.address
      this.form.id = rawFormData.id
      this.form.phone = rawFormData.phone
      this.form.sex = rawFormData.sex
      this.form.title = rawFormData.title
      this.form.working_time = rawFormData.working_time
      this.form.birth = rawFormData.birth
      if (this.flag === this.$store.state.common.DIALOGEDIT) {
        this.oldTeacherPhone = rawFormData.phone
      }
    },
    showAddTeacherDialog() {
      this.title = '添加教师'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    showEditTeacherDialog(rawFormData) {
      this.title = '修改教师信息'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGEDIT
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        console.log(rawFormData)
        this.initEditFormData(rawFormData)
      })
    },
    checkPhoneHadUsed(phone, callback) {
      if (this.flag === this.$store.state.common.DIALOGEDIT) {
        if (phone == this.oldTeacherPhone) {
          callback()
          return
        }
      }
      const form = { username: phone }
      checkPhoneUsed(form).then(response => {
        const { data } = response
        console.log(data)
        if (data.code === 200) {
          if (data.data >= 1) {
            callback(new Error('该联系方式已存在,请更换'))
          } else {
            callback()
          }
        }
        console.log(data)
      }).catch(error => {
        this.$message.error(`抱歉,查询联系方式失败,请重试 error：${error}`)
      })
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const deepForm = JSON.parse(JSON.stringify(this.form))
          deepForm.organizational_id = this.$store.state.common.nurseryId
          deepForm.admin_code = 0
          deepForm.Intake = formatTimeToServe(deepForm.Intake)
          deepForm.birth = formatTimeToServe(deepForm.birth)
          deepForm.age = parseInt(deepForm.age)
          console.log(deepForm)
          if (this.flag === this.$store.state.common.DIALOGSHOW) {
            this.$emit('CommitAddTeacher', deepForm)
          } else {
            console.log('edit')
            this.$emit('CommitEditTeacher', deepForm)
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.loading = false
      this.dialogFormVisible = false
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
  height: 420px;
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
    padding: 15px 0 5px 0;    font-weight: normal;
    line-height: 30px;
  }
}
#foot-divider{
  width: 100%;
  height: 1px;
  background-color: #DCDFE6;
  margin: 8px 0;
}
#foot-title{
  color: #4C4C4C;
  font-weight: bold;
  margin-left: 18px;
}
.block{
  margin-left: 18px;
  margin-top: 8px;
}

.div-footer{
  display: flex;
  margin-top: 30px;
  justify-content: space-evenly;
}

</style>

<!--修改dialog的全局样式-->
<style>

</style>
