<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="open">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>{{ title }}</span>
      </div>
      <div id="title-divider" />
      <el-form ref="form" :rules="rules" class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="入学年月" :label-width="formLabelWidth" prop="grade">
          <!--          <el-date-picker v-model="form.Intake" type="month" placeholder="选择年月" style="width: 150px" size="small" />-->
          <el-date-picker v-model="form.grade" type="year" placeholder="选择年级" size="small" value-format="yyyy" />
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px" prop="classNum">
          <el-select v-model="form.classNum" placeholder="请选择" size="small" style="width: 120px">
            <el-option
              v-for="item in options_gender"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级序号/名称" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px" prop="class_no">
          <el-input v-model="form.class_no" autocomplete="off" size="small" style="width: 120px" />
        </el-form-item>
        <br>
        <el-form-item label="主班老师" :label-width="formLabelWidth" prop="main_teacherId">
          <el-select v-model="form.main_teacherId" placeholder="请选择" size="small" style="width: 140px" @change="selectMainTeacherChange">
            <el-option
              v-for="item in mainTeacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="副班老师" :label-width="formLabelWidth" prop="teach_teacherId">-->
<!--          <el-select v-model="form.teach_teacherId" placeholder="请选择" size="small" style="width: 140px" @change="selectTeachTeacherChange">-->
<!--            <el-option-->
<!--              v-for="item in teachTeacherList"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="保育老师" :label-width="formLabelWidth" prop="care_teacherId">-->
<!--          <el-select v-model="form.care_teacherId" placeholder="请选择" size="small" style="width: 140px" @change="selectCareTeacherChange">-->
<!--            <el-option-->
<!--              v-for="item in careTeacherList"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="主班老师联系方式" :label-width="formLabelWidth" style="padding: 0px" prop="phone">
          <el-input v-model="mainTeacherPhone" autocomplete="off" size="small" style="width: 140px" :disabled="true" />
        </el-form-item>
<!--        <el-form-item label="副班老师联系方式" :label-width="formLabelWidth" style="padding: 0px" prop="phone">-->
<!--          <el-input v-model="teachTeacherPhone" autocomplete="off" size="small" style="width: 140px" :disabled="true" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="保育老师联系方式" :label-width="formLabelWidth" style="padding: 0px" prop="phone">-->
<!--          <el-input v-model="careTeacherPhone" autocomplete="off" size="small" style="width: 140px" :disabled="true" />-->
<!--        </el-form-item>-->
        <br>
        <el-form-item label="备注" :label-width="formLabelWidth" style="padding: 0px ;width: 90%">
          <el-input v-model="form.remark" type="textarea" :rows="1" placeholder="" style="width: 100%" />
        </el-form-item>
      </el-form>
      <div class="div-footer">
        <el-button id="el-button-add" style="width: 140px" @click="confirm">提交</el-button>
        <el-button id="el-button-cancel" style="width: 140px" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTeacherList } from '@/api/teacher'
export default {
  data() {
    return {
      title: '',
      flag: this.$store.state.common.DIALOGSHOW,
      dialogFormVisible: false,
      rules: {
        grade: [
          { required: true, message: '请选择入学年月', trigger: 'change' }
        ],
        classNum: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        class_no: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        main_teacherId: [
          { required: true, message: '请输入主班教师姓名', trigger: 'blur' }
        ]
        // teach_teacherId: [
        //   { required: true, message: '请输入副班教师姓名', trigger: 'blur' }
        // ],
        // care_teacherId: [
        //   { required: true, message: '请输入保育教师姓名', trigger: 'blur' }
        // ]
      },
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
      mainTeacherList: [],
      teachTeacherList: [],
      careTeacherList: [],
      curTeacherPage: 1,
      form: {
        organization_id: 0,
        grade: '',
        main_teacherId: '',
        teach_teacherId: '',
        care_teacherId: '',
        classNum: '',
        class_no: '',
        remark: ''
      },
      mainTeacherPhone: '',
      teachTeacherPhone: '',
      careTeacherPhone: '',
      formLabelWidth: '40px'
    }
  },
  methods: {
    open() {
      this.teachTeacherList.length = 0
      this.mainTeacherList.length = 0
      this.careTeacherList.length = 0
      this.queryTeacherList()
    },
    initEditFormData(data) {
      this.form.id = data.id
      this.form.main_teacherId = data.mainTeacherId
      this.form.teach_teacherId = data.teachTeacherId
      this.form.care_teacherId = data.careTeacherId
      this.form.grade = data.InTake
      this.form.classNum = data.class
      this.form.class_no = data.class_no
      this.careTeacherPhone = data.careTeacherContact
      this.teachTeacherPhone = data.teachTeacherContact
      this.mainTeacherPhone = data.mainTeacherContact
    },
    selectMainTeacherChange(value) {
      console.log(value)
      this.mainTeacherList.forEach(item => {
        if (item.id === value) {
          this.mainTeacherPhone = item.phone
        }
      })
    },
    selectTeachTeacherChange(value) {
      console.log(value)
      this.teachTeacherList.forEach(item => {
        if (item.id === value) {
          this.teachTeacherPhone = item.phone
        }
      })
    },
    selectCareTeacherChange(value) {
      console.log(value)
      this.careTeacherList.forEach(item => {
        if (item.id === value) {
          this.careTeacherPhone = item.phone
        }
      })
    },
    queryTeacherList() {
      const form = { organizational_id: this.$store.state.common.nurseryId, curPage: this.curRelationPage }
      fetchTeacherList(form).then(response => {
        const { data, totalPageNum } = response.data
        data.forEach((item, index) => {
          if (item.title === '主班老师') {
            this.mainTeacherList.push({
              id: item.id,
              name: item.name,
              phone: item.phone
            })
          }
          if (item.title === '副班老师') {
            this.teachTeacherList.push({
              id: item.id,
              name: item.name,
              phone: item.phone
            })
          }
          if (item.title === '保育老师') {
            this.careTeacherList.push({
              id: item.id,
              name: item.name,
              phone: item.phone
            })
          }
        })
        this.curTeacherPage++
        if (this.curTeacherPage <= totalPageNum) {
          this.queryTeacherList()
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取教师信息失败 ${error}`)
      }).finally(() => {
      })
    },
    showAddClassDialog() {
      this.title = '添加班级'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.teachTeacherPhone = ''
        this.mainTeacherPhone = ''
        this.careTeacherPhone = ''
      })
    },
    showEditClassDialog(rawFormData) {
      this.title = '修改班级信息'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGEDIT
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        console.log(rawFormData)
        this.initEditFormData(rawFormData)
      })
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.form)
          const deepForm = JSON.parse(JSON.stringify(this.form))
          delete deepForm.organization_id
          // 机构id
          deepForm.organizational_id = this.$store.state.common.nurseryId
          deepForm.viceTeacherId = deepForm.teach_teacherId
          deepForm.teacherId = deepForm.main_teacherId
          deepForm.headMasterId = deepForm.main_teacherId
          deepForm.babySitterId = deepForm.care_teacherId
          delete deepForm.teach_teacherId
          delete deepForm.main_teacherId
          delete deepForm.care_teacherId
          console.log(deepForm)
          if (this.flag === this.$store.state.common.DIALOGSHOW) {
            delete deepForm.id
            this.$emit('CommitAddClass', deepForm)
          } else {
            this.$emit('CommitEditClass', deepForm)
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
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
    #title-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }
    #foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 24px 0;
    }
  }
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
.div-footer{
  display: flex;
  margin-top: 24px;
  margin-bottom: 24px;
  justify-content: space-evenly;
}

</style>

<!--修改dialog的全局样式-->
<style>

</style>
