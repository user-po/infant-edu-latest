<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>重修成绩录入</span>
      </div>
      <div id="title-divider" />
      <el-form class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px">
        <el-form-item label="学生姓名" :label-width="formLabelWidth" style="padding: 0px">
          <el-input v-model="form.name" :disabled="true" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.stuCode" :disabled="true" autocomplete="off" size="small" style="width: 180px" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.sex" :disabled="true" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" lable-height="30px" style="padding: 0px">
          <el-input v-model="form.age" :disabled="true" autocomplete="off" size="small" style="width: 100px" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="start" style="margin-left: 20px;margin-top: 10px">
        <el-col :span="22">
          <el-table
            :data="courseTableData"
            border
            stripe
            size="mini"
            max-height="180px"
            style="width: 100%"
          >
            <el-table-column
              prop="order"
              label="序号"
              width="100"
            />
            <el-table-column
              prop="name"
              label="指标名称"
              width="280"
            />
            <el-table-column
              prop="score"
              label="分数"
              width="140"
            >
              <template slot-scope="scope">
                <el-input v-model.number.lazy="scope.row.score" placeholder="请填写"  :disabled="disabledInputTableColumn(scope.row)" type="number" size="mini" style="width: 90px" @input="tableInputValueChange" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="div-footer">
        <el-button id="el-button-add" style="width: 140px;margin-bottom: 30px" size="small" @click="confirm">提交</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { gap } from '@/utils/date'
export default {
  data() {
    return {
      activeName: '1',
      dialogFormVisible: false,
      form: {
        name: '',
        stuCode: '',
        sex: '',
        age: '',
        classCheckList: []
      },
      formLabelWidth: '40px',
      courseTableData: []
    }
  },
  methods: {
    initFormData(data, scoreList) {
      this.form.name = data.name
      this.form.stuCode = data.stuCode
      this.form.sex = data.sex === 1 ? '男' : '女'
      this.form.age = gap(data.birth)
      this.courseTableData.splice(0)
      scoreList.forEach((item, index) => {
        this.courseTableData.push({ order: ++index, name: item.name, score: item.score })
        if (item.name === '班级排名') {
          this.courseTableData[index].score = '重修不统计班级排名'
        }
      })
    },
    showRetakeCourseScoreDialog(data, scoreList) {
      this.dialogFormVisible = true
      this.initFormData(data, scoreList)
    },
    showEditHistoryCourseDialog(formData) {
      this.dialogFormVisible = true
      // this.form = formData
    },
    showHistoryCourseDetail() {
      this.dialogFormVisible = false
      this.$emit('goCourseDetailEvent')
    },
    confirm() {
      for (let i = 0; i < this.courseTableData.length -2; i++) {
        if (this.courseTableData[i].score === '') {
          this.$message.error('抱歉,请输入每项指标的成绩~')
          return
        }
      }
      const scoreList = []
      for (let i = 0; i < this.courseTableData.length - 2; i++) {
        scoreList.push(this.courseTableData[i].score)
      }
      const form = {
        scoreList: scoreList,
        gpa: this.courseTableData[this.courseTableData.length - 2].score
      }
      // 每项成绩不为空
      this.$emit('RetakeCourseScore', form)
    },
    cancel() {
      this.dialogFormVisible = false
    },
    // 根据名称判断input 输入框能不能编辑
    disabledInputTableColumn(row) {
      if (row.name === '个人绩点' || row.name === '班级排名') {
        return true
      } else {
        return false
      }
    },
    tableInputValueChange() {
      let totalScore = 0
      const totalNum = this.courseTableData.length - 2
      // 统计绩点时，排除最后两项 个人绩点和班级排名
      for (let i = 0; i < totalNum; i++) {
        totalScore = totalScore + this.courseTableData[i].score
      }
      this.courseTableData[totalNum].score = (totalScore / (10 * totalNum) * 100).toFixed(2)
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
    .foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
    }
    .foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }

    .div-footer{
      margin-top: 13px;
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
    padding:5px 0;
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
