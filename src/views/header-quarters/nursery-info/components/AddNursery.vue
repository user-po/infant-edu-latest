<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>{{ title }}</span>
      </div>
      <div id="title-divider" />
      <el-form ref="form" :rules="rules" class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="机构名称" prop="name" :label-width="formLabelWidth" style="padding: 0px">
          <el-input v-model="form.name" autocomplete="off" size="small" style="width: 180px" />
        </el-form-item>
        <el-form-item label="账号" prop="code" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.code" :disabled="true" placeholder="自动生成" autocomplete="off" size="small" style="width: 150px" />
        </el-form-item>
        <el-form-item label="机构类型" prop="type" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择" size="small" style="width: 120px">
            <el-option v-for="item in options_nurseryType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="地址(省市区)" :label-width="formLabelWidth" style="padding: 0px" prop="area">
          <v-region v-model="areaCode" />
        </el-form-item>
        <el-form-item label="营业执照编号" :label-width="formLabelWidth" style="padding: 0px" prop="business_license">
          <el-input v-model="form.business_license" placeholder="营业执照编号" autocomplete="off" size="small" style="width: 180px;" />
        </el-form-item>
        <br>
        <el-form-item label="详细地址(街道)" :label-width="formLabelWidth" style="padding: 0px" prop="address">
          <el-input v-model="form.address" placeholder="精确到街道地址" autocomplete="off" size="small" style="width: 180px;" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact_people" :label-width="formLabelWidth" style="padding: 0px">
          <el-input v-model="form.contact_people" autocomplete="off" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth" disabled="true" style="padding: 0px">
          <el-input v-model="form.phone" autocomplete="off" size="small" style="width: 160px" />
        </el-form-item>
        <br>
        <el-form-item label="备注" :label-width="formLabelWidth" style="padding: 0px ;width: 90%">
          <el-input v-model="form.remark" type="textarea" :rows="1" placeholder="" style="width: 100%" />
        </el-form-item>
      </el-form>
      <div id="foot-divider" />
      <!--      <span id="foot-title">上传资料</span>-->
      <!--      <div class="div-upload">-->
      <!--        <div class="div-upload-bl">-->
      <!--          <span>营业执照</span>-->
      <!--          <el-upload ref="BusinessUpload" size="small" name="files" :auto-upload="false" :on-change="bussinessFileChange" :on-success="handlebussinessSuccess" :data="uploadParams" class="upload-bussiness-license" :action="action">-->
      <!--            <i v-if="localUrl.bussinessUrl==='' " class="el-icon-plus" />-->
      <!--            <div v-else>-->
      <!--              <img style="width: 80%;height: 80%" class="el-upload-list__item-thumbnail" :src="localUrl.bussinessUrl" alt="">-->
      <!--            </div>-->
      <!--          </el-upload>-->
      <!--        </div>-->
      <!--        <div class="div-upload-ic-front">-->
      <!--          <span>法人代表身份证(国徽)</span>-->
      <!--          <el-upload ref="ICBackUpload" class="upload-ic-front" name="files" :auto-upload="false" :on-change="IDCardBackFileChange" :on-success="handleICFrontSuccess" :action="action">-->
      <!--            <i v-if="localUrl.IDCardBack==='' " class="el-icon-plus" />-->
      <!--            <div v-else>-->
      <!--              <img style="width: 80%;height: 80%" class="el-upload-list__item-thumbnail" :src="localUrl.IDCardBack" alt="">-->
      <!--            </div>-->
      <!--          </el-upload>-->
      <!--        </div>-->
      <!--        <div class="div-upload-ic-back">-->
      <!--          <span>法人表表身份证(头像)</span>-->
      <!--          <el-upload ref="ICFrontUpload" class="upload-ic-back" name="files" :auto-upload="false" :on-change="IDCardFrontFileChange" :on-success="handleICFrontSuccess" :action="action">-->
      <!--            <i v-if="localUrl.IDCardFront==='' " class="el-icon-plus" />-->
      <!--            <div v-else>-->
      <!--              <img style="width: 80%;height: 80%" class="el-upload-list__item-thumbnail" :src="localUrl.IDCardFront" alt="">-->
      <!--            </div>-->
      <!--          </el-upload>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="div-footer">
        <el-button id="el-button-add" style="width: 140px" @click="confirm">提交</el-button>
        <el-button id="el-button-cancel" style="width: 140px" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cal, formatTimeToServe, getTimeStamp } from '@/utils/date'
import { fetchUniqueID } from '@/api/check'
export default {
  data() {
    return {
      title: '',
      dialogLoading: false,
      flag: this.$store.state.common.DIALOGSHOW,
      dialogFormVisible: false,
      addressPlaceHolder: '',
      localUrl: {
        bussinessUrl: '',
        IDCardFront: '',
        IDCardBack: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入机构/学校姓名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择机构类型', trigger: 'change' }
        ],
        birth: [
          { type: 'date', required: true, message: '请选择出生年月日', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        contact_people: [
          { required: true, message: '请输入机构联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请填写机构联系方式', trigger: 'blur' }
        ],
        business_license: [
          { required: true, message: '请填写机构营业执照编号', trigger: 'blur' }
        ]
      },
      action: this.$store.state.common.fileUploadUrl,
      uploadParams: {
        module_name: '成绩',
        module_id: 1,
        file_usage: '展示'
      },
      form: {
        id: 0,
        name: '',
        code: '',
        type: '',
        address: '',
        contact_people: '',
        phone: '',
        remark: '',
        business_license: '',
        admin_code: '',
        lng: '',
        lat: '',
        province: '',
        city: '',
        area: ''
      },
      areaCode: {
        province: '',
        city: '',
        area: '',
        town: ''
      },
      formLabelWidth: '40px',
      options_nurseryType: [{
        label: '幼儿园',
        value: 2
      }, {
        label: '机构',
        value: 1
      }]
    }
  },
  methods: {
    opened() {
      // 只在show时获取
    },
    bussinessFileChange(file, fileList) {
      this.localUrl.bussinessUrl = URL.createObjectURL(file.raw)
    },
    IDCardBackFileChange(file, fileList) {
      this.localUrl.IDCardBack = URL.createObjectURL(file.raw)
    },
    IDCardFrontFileChange(file, fileList) {
      this.localUrl.IDCardFront = URL.createObjectURL(file.raw)
    },
    showAddNurseryDialog() {
      this.title = '添加机构/学校'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.addressPlaceHolder = '拾取坐标'
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.areaCode.area = ''
        this.areaCode.city = ''
        this.areaCode.province = ''
        this.areaCode.town = ''
      })
    },
    showEditNurseryDialog(rawFormData) {
      this.title = '修改机构/学校信息'
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGEDIT
      this.addressPlaceHolder = '查看坐标'
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        console.log(rawFormData)
        this.initEditFormData(rawFormData)
      })
    },
    initEditFormData(rawFormData) {
      console.log(JSON.stringify(rawFormData))
      Object.assign(this.form, rawFormData)
      this.form.type = this.form.type === 1 ? '机构' : '学校'
      this.areaCode.area = String(rawFormData.area)
      this.areaCode.city = String(rawFormData.city)
      this.areaCode.province = String(rawFormData.province)
      this.areaCode.town = ''
      delete this.form.is_delete
      delete this.form.insert_time
      delete this.form.update_time
      delete this.form.teacher_num
      delete this.form.student_num
    },
    ageCal(pickDate) {
      console.log(pickDate)
      this.form.age = cal(Date.now(), pickDate)
    },
    submitUpload() {
      this.$refs.BusinessUpload.submit()
      this.$refs.ICBackUpload.submit()
      this.$refs.ICFrontUpload.submit()
    },
    confirm(formName) {
      // this.loading = true
      this.dialogLoading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.areaCode.area) {
            this.$message.error('请选择机构/学校地址(省市区)')
            return
          }
          this.loading = true
          console.log(this.form)
          const deepForm = JSON.parse(JSON.stringify(this.form))
          deepForm.area = parseInt(this.areaCode.area)
          deepForm.city = parseInt(this.areaCode.city)
          deepForm.province = parseInt(this.areaCode.province)
          deepForm.admin_code = this.areaCode.area
          deepForm.lng = '0'
          deepForm.lat = '0'
          console.log(JSON.stringify(deepForm))
          delete deepForm.id
          delete deepForm.code
          if (this.flag === this.$store.state.common.DIALOGSHOW) {
            this.$emit('CommitAddNursery', deepForm)
          } else {
            // 更新多加一个id
            deepForm.id = this.form.id
            this.$emit('CommitEditNursery', deepForm)
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.loading = false
      this.dialogLoading = false
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
      margin: 8px 0;
    }
    #foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }
    .div-upload{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      margin: 18px;
      .el-upload {
        margin: 10px 0;
        border: #D9D9D9 dashed 1px;
        border-radius: 8px;
        width: 150px;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &:hover{
          border: #20a0ff dashed 1px;
        }
        i{
          font-size: 20px;
        }
      }
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
  ::v-deep .el-form-item__content{
    line-height: 20px;
  }
;
}
.div-footer{
  display: flex;
  margin: 20px 0;
  justify-content: space-evenly;
}

</style>

<!--修改dialog的全局样式-->
<style>

</style>
