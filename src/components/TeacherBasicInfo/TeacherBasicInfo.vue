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
          <p>班主任老师：</p>
          <span>{{teacherName}}</span>
      </div>
      <div class="item">
          <p>学生人数：</p>
         <span>{{stuNum}}</span>
      </div>
      <div class="item">
          <p>缺勤人数：</p>
         <span>{{absence_num}}</span>
      </div>
       <div class="item">
          <p>实上课人数：</p>
         <span>{{real_num}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchTeacherList } from "@/api/teacher";
import {fetchClassList} from '@/api/class'
export default {
  name: "TeacherBasicInfo",
  props: {
    teacherId: {
      type: Number
    },
    classId: {
      type: Number
    },
    realtionId:{
      type:Number
    }
  },
  data() {
    return {
      stuNum: 0,
      teacherName: "",
      classLevel: "",
      Grade: "",
      absence_num:"",
      real_num:""
    };
  },
  mounted() {
      this.fetchTeacher(this.teacherId)
      this.fetchGradeAndClass(this.classId,this.realtionId)
  },
  methods: {
    async fetchTeacher(teacherId) {
        
      const res = await fetchTeacherList({
        teacherId
      });
     this.teacherName = res.data.data[0].name
    },
    async fetchGradeAndClass(classId,realtionId){
        const res = await fetchClassList({
             classId,
             realtionId
        })
        this.Grade = res.data.data[0].grade;
        this.classLevel = res.data.data[0].class + res.data.data[0].class_no;
        this.stuNum = res.data.data[0].class_people_num;
        this.absence_num = res.data.additional;
        this.real_num = parseInt(this.stuNum) - parseInt(this.absence_num);
        this.$store.state.common.real_num = this.real_num;
    }
  }
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
