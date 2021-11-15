<template>
  <el-card class="tree">
    <div slot="header" class="clearfix">
      <span>课程列表</span>
    </div>
    <el-scrollbar style="height:100%;width: 100%">
      <el-tree  accordion style="height: 600px;width: 300px" :data="treeData" :highlight-current="true" @node-click="handleNodeClick" />
    </el-scrollbar>
  </el-card>
</template>

<script>
import {fetchClassList} from "@/api/class";
import {fetchTeacherCourseList,fetchTeacherList} from "@/api/teacher";
import {checkCourseIsLogScore} from "@/api/teacher";
export default {
  name: "SelectTree",
  props: {
    title:{
      type:String,
      default:'课程列表'
    },
    showType:{
      type:String,
      default:'上课'
    }
  },
  data(){
    return{
      curPage:1,
      defaultTreeData:[{
        label: '大班',
        children: []
      }, {
        label: '中班',
        children: []
      }, {
        label: '小班',
        children: []
      }],
      treeData: Object.assign({},this.defaultTreeData),
      headerClassCourseList:[],
      middleClassCourseList:[],
      babyClassCourseList:[]
    }
  },
  async mounted() {
    this.treeData = this.defaultTreeData
   await this.queryTeacherTitle()
    this.queryAllCourseList()
  },
  methods:{
    handleNodeClick(data){
      if (data.classId){
        this.$emit('node-click',data)
        console.log(data)
      }
    },
    async queryTeacherTitle(){
      const res = await fetchTeacherList({teacherId:this.$store.state.common.teacherId})
      this.$store.state.common.title = res.data.data[0].title;
    },
    queryAllCourseList(){
      const form = {teacherId:this.$store.state.common.teacherId}
      fetchTeacherCourseList(form).then(response=>{
        const { data } = response.data
        console.log(data);
        data.forEach(item=>{
          
          if (item.class === '大班'){
            this.headerClassCourseList.push({ label:item.name,id:item.id,scoreHadUpload:false,classId:0,types:item.types,index_list:item.index_list,is_red_list:item.is_red_list,relationship_id:item.relationship_id })
          }else if (item.class === '中班'){
            this.middleClassCourseList.push({ label:item.name,id:item.id,scoreHadUpload:false, classId:0 ,types:item.types,index_list:item.index_list,is_red_list:item.is_red_list,relationship_id:item.relationship_id})
          }else if (item.class === '小班'){
            this.babyClassCourseList.push({ label:item.name,id:item.id,scoreHadUpload:false, classId:0 ,types:item.types,index_list:item.index_list,is_red_list:item.is_red_list,relationship_id:item.relationship_id })
          }
        })
      }).catch(error=>{
        this.$message.error(`抱歉,获取课程信息失败 error${error}`)
      }).finally(()=>{
        this.queryClassList()
      })
    },
    queryClassList() {
      console.log(this.$store.state.common.teacherId)
      this.tableLoading = true
      const formFetch = {
        curPage: this.curPage,
      }
      
      if (this.$store.state.common.title === '主班老师'){
        formFetch.headMasterId = this.$store.state.common.teacherId
      }else {
        formFetch.viceTeacherId = this.$store.state.common.teacherId
      }
      fetchClassList(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        
        data.forEach((item, index) => {
          console.log(item)
          if (item.class === '大班'){
            const tempHeaderClassCourseList = JSON.parse(JSON.stringify(this.headerClassCourseList))
            for (let i = 0; i < tempHeaderClassCourseList.length; i++) {
              tempHeaderClassCourseList[i].classId = item.id
            }
            this.treeData[0].children.push({label:item.class_no,id:item.id,children:tempHeaderClassCourseList})
            for (let i = 0; i < tempHeaderClassCourseList.length ; i++) {
              this.checkCourseIsLog(tempHeaderClassCourseList[i])
            }
          }else if (item.class === '中班'){
            const tempMiddleClassCourseList = JSON.parse(JSON.stringify(this.middleClassCourseList))
            for (let i = 0; i < tempMiddleClassCourseList.length; i++) {
              tempMiddleClassCourseList[i].classId = item.id
            }
            this.treeData[1].children.push({label:item.class_no,id:item.id,children:tempMiddleClassCourseList})
            for (let i = 0; i < tempMiddleClassCourseList.length ; i++) {
              this.checkCourseIsLog(tempMiddleClassCourseList[i])
            }
          }else if (item.class === '小班'){
            const tempBabyClassCourseList = JSON.parse(JSON.stringify(this.babyClassCourseList))
            for (let i = 0; i < tempBabyClassCourseList.length; i++) {
              tempBabyClassCourseList[i].classId = item.id
            }
            this.treeData[2].children.push({label:item.class_no,id:item.id,children:tempBabyClassCourseList})
            for (let i = 0; i < tempBabyClassCourseList.length ; i++) {
              this.checkCourseIsLog(tempBabyClassCourseList[i])
            }
          }
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取班级信息失败 error${error}`)
      }).finally(() => {
      })
    },
    // 查询成绩是否上传过
    checkCourseIsLog(item) {
      const form = {
        teacherId: this.$store.state.common.teacherId,
        classId: item.classId,
        relationId: item.relationship_id
      }
      checkCourseIsLogScore(form).then(response => {
        const { data } = response.data
        console.log(data)
        item.scoreHadUpload = data.status
        if (data.status){
          if (this.showType==='上课'){
            item.label = item.label+"(已完成)"
          }else {
            item.label = item.label+"(已录入)"
          }
        }
      }).catch(error => {
        this.$message.error(`抱歉,获取课程录入状态失败 error${error}`)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.el-card{
  margin-bottom: 30px;
  .el-card__body{
    padding: 5px;
  }
}

</style>
