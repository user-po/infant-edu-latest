<template>
  <div class="main">
    <div class="center">
      <div class="item">
          <p>年级：</p>
          <span>{{Grade}}</span>
      </div>
      <div class="item">
          <p>班级：</p>
         <span>{{classLevel}}</span>
      </div>
      <div class="item">
          <p>学生姓名：</p>
          <span>{{studentName}}</span>
      </div>
      <div class="item">
          <p>已完成课程数量：</p>
          <span>{{completedCourseNum}}</span>
      </div>
        <div class="item">
          <p>未完成课程数量：</p>
         <span>{{unCompletedCourseNum}}</span>
      </div>
       <div class="item">
          <p>缺勤课程数量：</p>
         <span>{{absenceCourseNum}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchStudentList,getAbsenceCourseNum } from "@/api/student";
import {getStudentsCompletedCourse} from '@/api/analysis'
export default {
  name: "StudentBasicInfo",
  props: {
    studentId: {
      type: Number
    }
  },
  data() {
    return {
      unCompletedCourseNum:0,
      completedCourseNum: 0,
      absenceCourseNum:"",
      studentName: "",
      classLevel: "",
      Grade: ""
    };
  },
  mounted() {
      this.fetchStudentAndGrade(this.studentId)
      this.fetchCompletedAndUnCompletedCourse(this.studentId)
      this.fetchAbsenceCourseNum(this.studentId)

  },
  methods: {
    async fetchStudentAndGrade(studentId) {
        
      const res = await fetchStudentList({
        studentId
      });
     this.studentName = res.data.data[0].name
     this.Grade = res.data.data[0].grade;
     this.classLevel = res.data.data[0].class
    },
    async fetchCompletedAndUnCompletedCourse(studentId){
      const res = await getStudentsCompletedCourse({
          studentId
      })
      this.unCompletedCourseNum = res.data.data.un_completed;
      this.completedCourseNum = res.data.data.completed
  },

    async fetchAbsenceCourseNum(studentId){
      const res = await getAbsenceCourseNum({
         studentId
      })
      console.log(res);
      this.absenceCourseNum = res.data.data.absence_num;

    }
  },
  
};
</script>

<style scoped lang="scss">
.main{
     display: flex;
    height: 22%;
    align-items: flex-start;
    margin-top: -5%;


     .center{
         display: flex;
         flex-direction: row;
         .item{
                 margin-right: 15px;
                   span{
                   font-weight: bold;
                   font-size: 20px;
                 }
         }
     }
}
</style>
