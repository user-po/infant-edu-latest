<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="open">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-document-add" />
        <span>正在授权课程资料</span>
      </div>
      <el-divider />
      <el-row type="flex" style="margin-left: 28px;margin-top: 30px">
        <el-col :span="4">
          <span id="body-span-title">关联课程</span>
        </el-col>
        <el-col :span="8" :offset="4">
          <el-switch
            id="elSwitch"
            v-model="canEdit"
            height="100%"
            style="display: block"
            active-text="编辑"
            inactive-text="查看"
          />
        </el-col>
      </el-row>
      <div class="body-div-select">
        <div class="div-gender">
          <el-cascader-panel
            ref="cascader"
            :key="elCascaderKey"
            v-model="selectArray"
            v-loading="checkLoading"
            :options="options"
            :props="props"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            @expand-change="change()"
          />
          <!--          <span>请选择课程所属年级:</span>-->
          <!--          <el-checkbox-group v-model="form.genderCheckList" class="el-c-group-gender">-->
          <!--            <el-checkbox label="大班" />-->
          <!--            <el-checkbox label="中班" />-->
          <!--            <el-checkbox label="小班" />-->
          <!--          </el-checkbox-group>-->
          <!--        </div>-->
          <!--        <div class="div-course">-->
          <!--          <span>请选择课程(多选):</span>-->
          <!--          <el-checkbox-group v-model="form." class="el-c-group-course">-->
          <!--            <el-checkbox v-for="" label="大班" />-->
          <!--          </el-checkbox-group>-->
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { fetchCoursesList } from '@/api/course'
import { fetchRelationShipList, createRelationShip, updateRelationShipList, deleteRelationShipList } from '@/api/relation'
export default {
  data() {
    return {
      dialogFormVisible: false,
      props: { multiple: true, emitPath: false },
      selectArray: [],
      selectArraySet: new Set(),
      nurseryId: 0,
      courseList: [],
      relationList: [],
      flag: false,
      elCascaderKey: 1,
      curCoursePage: 1,
      curRelationPage: 1,
      courseLoading: false,
      relationLoading: false,
      canEdit: false,
      currentChangeNodeValue: -1,
      form: [],
      options: [{
        label: '大班',
        children: [
          {}
        ]
      }, {
        label: '中班',
        children: [
          {}
        ]
      }, {
        label: '小班',
        children: [
          {}
        ]
      }],
      formLabelWidth: '40px'
    }
  },
  computed: {
    checkLoading() {
      return this.courseLoading && this.relationLoading
    }
  },
  watch: {
    canEdit: function(newValue) {
      const value = !newValue
      this.options[0].children.forEach(item => {
        item.disabled = value
      })
      this.options[1].children.forEach(item => {
        item.disabled = value
      })
      this.options[2].children.forEach(item => {
        item.disabled = value
      })
      this.elCascaderKey++
    },
    selectArray: function(newValue, oldValue) {
      if (!this.canEdit) {
        return
      }
      console.log('旧课程')
      console.log(oldValue)
      console.log('新课程')
      console.log(newValue)
      // console.log('2222222222222222222222')
      // console.log(this.$refs.cascader.getCheckedNodes())
      // 勾选了新的课程
      if (newValue.length > oldValue.length) {
        const addCourse = newValue.filter((newItem) => {
          let flag = true
          oldValue.forEach((oldItem) => {
            if (oldItem === newItem) {
              flag = false
            }
          })
          return flag
        })
        console.log('打印+')
        console.log(addCourse)
        if (addCourse.length >= 1) {
          this.currentChangeNodeValue = addCourse[0]
          this.addRelation(addCourse)
        }
      } else if (oldValue.length > newValue.length) {
        const delCourse = oldValue.filter((newItem) => {
          let flag = true
          newValue.forEach((oldItem) => {
            if (oldItem === newItem) {
              flag = false
            }
          })
          return flag
        })
        console.log('打印-')
        console.log(delCourse)
        if (delCourse.length >= 1) {
          this.currentChangeNodeValue = delCourse[0]
          this.delRelation(delCourse)
        }
      }
    }
  },
  methods: {
    change() {
      console.log('4523654')
      console.log('4523654')
    },
    open() {
      this.canEdit = false
      this.refresh()
    },
    queryCourseList() {
      this.courseLoading = true
      const queryForm = {
        curPage: this.curCoursePage
      }
      fetchCoursesList(queryForm).then(response => {
        const { data, totalPageNum } = response.data
        data.forEach((item, index) => {
          this.courseList.push({
            id: item.id,
            name: item.name,
            class: item.class,
            types: item.types,
            code: item.code,
            remark: item.remark,
            insert_time: item.insert_time
          })
        })
        this.curCoursePage++
        if (this.curCoursePage <= totalPageNum) {
          this.queryCourseList()
        } else {
          this.filterCourseList()
          this.queryRelationList()
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取课程信息失败 ${error}`)
      }).finally(() => {
        this.courseLoading = false
      })
    },
    queryRelationList() {
      this.relationLoading = true
      const form = { organizational_id: this.nurseryId, curPage: this.curRelationPage }
      fetchRelationShipList(form).then(response => {
        const { data, totalPageNum } = response.data
        data.forEach((item, index) => {
          this.relationList.push({
            id: item.id,
            course_id: item.course_id
          })
        })
        this.curRelationPage++
        if (this.curRelationPage <= totalPageNum) {
          this.queryRelationList()
        } else {
          this.relationList.forEach((item) => {
            // 不允许重复
            if (!this.selectArray.includes(item.course_id)) {
              this.courseList.forEach(courseItem => {
                if (courseItem.id === item.course_id) {
                  this.selectArray.push(item.course_id)
                }
              })
            }
          })
          this.flag = true
          this.elCascaderKey++
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取机构课程绑定信息失败 ${error}`)
      }).finally(() => {
        this.relationLoading = false
        this.expendBeforeNodes()
      })
    },
    showAuthorizationDialog(nurseryId) {
      this.nurseryId = nurseryId
      this.courseList.length = 0
      this.relationList.length = 0
      this.dialogFormVisible = true
    },
    showEditNurseryDialog(formData) {
      this.dialogFormVisible = true
      // this.form = formData
    },
    // 展开之前打开的列表
    expendBeforeNodes() {
      console.log(this.$refs.cascader.getNodeByValue(this.currentChangeNodeValue))
      if (this.currentChangeNodeValue !== -1 && this.$refs.cascader.getNodeByValue(this.currentChangeNodeValue) != null) {
        this.$refs.cascader.expandNodes(this.$refs.cascader.getNodeByValue(this.currentChangeNodeValue)?.parent?.pathNodes)
      }
      this.$nextTick(() => {
        this.$refs.cascader.wrap.scrollTop = 200
      })
    },
    filterCourseList() {
      this.options[0].children.length = 0
      this.options[1].children.length = 0
      this.options[2].children.length = 0
      this.courseList.forEach(item => {
        const showLabel = `${item.name}(${item.code})`
        if (item.class === '大班') {
          this.options[0].children.push({ label: showLabel, value: item.id, disabled: !this.canEdit })
        } else if (item.class === '中班') {
          this.options[1].children.push({ label: showLabel, value: item.id, disabled: !this.canEdit })
        } else {
          this.options[2].children.push({ label: showLabel, value: item.id, disabled: !this.canEdit })
        }
      })
    },
    addRelation(values) {
      this.form.length = 0
      for (let i = 0; i < values.length; i++) {
        this.form.push({ organizational_id: this.nurseryId, course_id: values[i] })
      }
      this.$emit('AddAuthorization', this.form)
    },
    delRelation(values) {
      this.form.length = 0
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < this.relationList.length; j++) {
          if (this.relationList[j].course_id === values[i]) {
            this.form.push({ id: this.relationList[j].id })
          }
        }
      }
      this.$emit('DelAuthorization', this.form)
    },
    refresh() {
      this.curCoursePage = 1
      this.curRelationPage = 1
      this.courseList.splice(0)
      this.relationList.splice(0)
      this.selectArray.splice(0)
      ++this.elCascaderKey
      this.queryCourseList()
    },
    cancel() {
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
  width: 683px;
  height: 390px;
  border: solid 1px #797979;
}
::v-deep .el-dialog__body{
  padding: 0px;
  width: 100%;
  height: 100%;
  //#elSwitch{
  //  position: absolute;
  //  top: 50px;
  //  right: 20px;
  //}
}

.title{
  height: 60px;
  text-align: center;
  position: relative;
  i{
    position: absolute;
    left: 20px;
    font-size: 36px;
    line-height: 60px;
  }
  span{
    line-height: 60px;
    font-size: 22px;
    font-weight: bold;
    color: #333333;
  }
}
.el-divider{
  margin: 0;
}
#body-span-title{
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

.body-div-select{
  display: flex;
  flex-direction: row;
  .div-gender {
    margin-top: 18px;
    margin-left: 51px;
    .el-c-group-gender {
      display: flex;
      flex-direction: column;
      border: 1px solid #797979;
      border-radius: 4px;
      width: 247px;
      height: 145px;
      margin-top: 17px;
      padding-left: 17px;
      padding-top: 30px;
    }
  }
  .div-course{
    margin-top: 18px;
    margin-left: 92px;
    .el-c-group-course{
      display: flex;
      flex-direction: column;
      border: 1px solid #797979;
      border-radius: 4px;
      width: 247px;
      height: 145px;
      margin-top: 17px;
      padding-left: 17px;
      padding-top: 30px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
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
