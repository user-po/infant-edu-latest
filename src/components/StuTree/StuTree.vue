<template>
  <el-card class="tree">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <el-scrollbar style="height:100%;width: 100%">
      <el-tree
        accordion
        style="height: 600px;width: 300px"
        :data="treeData"
        :highlight-current="true"
        @node-click="handleNodeClick"
      />
    </el-scrollbar>
  </el-card>
</template>

<script>
import { fetchClassList } from "@/api/class";
import { fetchTeacherAllStudents,fetchTeacherList } from "@/api/teacher";
export default {
  name: "Tree",
  props: {
    title: {
      type: String,
      default: "班级列表"
    }
  },
  data() {
    return {
      curPage: 1,
      defaultTreeData: [
        {
          label: "大班",
          children: []
        },
        {
          label: "中班",
          children: []
        },
        {
          label: "小班",
          children: []
        }
      ],
      treeData: Object.assign({}, this.defaultTreeData),
      headerClassStuList: [],
      middleClassStuList: [],
      babyClassStuList: []
    };
  },
 async  mounted() {
    this.treeData = this.defaultTreeData;
    await this.queryTeacherTitle()   
    await this.queryAllStuList()
    await this.queryClassList();
    
  },
  methods: {
     async queryTeacherTitle(){
      const res = await fetchTeacherList({teacherId:this.$store.state.common.teacherId})
      this.$store.state.common.title  = res.data.data[0].title
     
    },
     async queryAllStuList() {
        const form = {teacherId:this.$store.state.common.teacherId}
      fetchTeacherAllStudents(form)
        .then(response => {
          const { data } = response.data;
          data.forEach(item => {
            if (item.class === "大班") {
              this.headerClassStuList.push({
                label: item.name,
                studentId: item.id
              });
            } else if (item.class === "中班") {
              this.middleClassStuList.push({
                label: item.name,
                studentId: item.id
              });
            } else if (item.class === "小班") {
              this.babyClassStuList.push({
                label: item.name,
                studentId: item.id
              });
            }
          });
        })
        .catch(error => {
          this.$message.error(`抱歉,获取学生信息失败 error${error}`);
        })
    },
    handleNodeClick(data) {
      if (data.studentId) {
        this.$emit("node-click", data);
        
        console.log(data);
      }
    },
    async queryClassList() {
      this.tableLoading = true;
      const formFetch = {
        curPage: this.curPage
      };
      if (this.$store.state.common.title === "主班老师") {
        formFetch.headMasterId = this.$store.state.common.teacherId;
      } else {
        formFetch.viceTeacherId = this.$store.state.common.teacherId;
      }
      fetchClassList(formFetch)
        .then(response => {
          const { data, totalPageNum } = response.data;

        
          data.forEach(async (item, index) => {
            if (item.class === "大班") {
    
              this.treeData[0].children.push({
                label: item.class_no,
                classId: item.id,
                children:this.headerClassStuList
              });
            } else if (item.class === "中班") {
   
              this.treeData[1].children.push({
                label: item.class_no,
                classId: item.id,
                children:this.middleClassStuList
              });
            } else if (item.class === "小班") {
        
              this.treeData[2].children.push({
                label: item.class_no,
                classId: item.id,
                children:this.babyClassStuList
              });
            }
             
          });
        })
        .catch(error => {
          this.$message.error(`抱歉,获取班级信息失败 error${error}`);
        })
        .finally(() => {

        });
    }
  }
};
</script>
