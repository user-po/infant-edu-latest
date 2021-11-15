<template>
  <div class="container">
    <div class="div-tree">
      <Tree @node-click="handleNodeClick" />
    </div>
    <div v-if="showEnterDetail" class="div-table">
      <h1>{{ title + "累加达标率统计" }}</h1>
       <TeacherBasicInfo :teacherId="teacherId" :classId="classId"/>
      <div class="quContainer"
       v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <!-- <div id="myChart" class="quarter-div"></div>
        <div id="myChart_1" class="quarter-div"></div>
        <div id="myChart_2" class="quarter-div"></div>
        <div id="myChart_3" class="quarter-div"></div> -->
        <div id="myChart" class="quarter-div"></div>
         <div id="myChart_1" class="quarter-div"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from "@/components/Tree/Tree";
import TeacherBasicInfo from '@/components/TeacherBasicInfo/TeacherBasicInfo'
import {groupAllStudentsQuSituationBySex,groupAllStudentsQuSituationByAge} from '@/api/analysis'
var myChart;
export default {
  components: {
    Tree,
    TeacherBasicInfo
  },
  data() {
    return {
      showEnterDetail: false,
      title: "",
      teacherId: 0,
      loading: false,
      classId: 0
    };
  },
  unmounted(){
        if (myChart != null && myChart != "" && myChart != undefined) {
          myChart.dispose();
        }
          if (maChart_1 != null && maChart_1 != "" && maChart_1 != undefined) {
      maChart_1.dispose();
    }
  },
  methods: {
    async handleNodeClick(data) {
      this.loading = true
      this.showEnterDetail = true;
      this.title = data.label;
      this.teacherId = this.$store.state.common.teacherId;
      this.classId = data.classId;
     const res =  await this.groupAllStudentsQuSituationBySex(this.classId)
     const res_two = await this.groupAllStudentsQuSituationByAge(this.classId)
     this.loading=false;
     this.drawLineFirst(res.data.data)
     this.drawLineSecond(res_two.data.data)
    },
        drawLineSecond(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart_1"));
      myChart.clear();
      // 绘制图表
      myChart.setOption({
        title: {
          text: "年龄统计",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: res,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
      drawLineFirst(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.clear()
      // 绘制图表
      myChart.setOption({
        title: {
          text: "性别累计统计"
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ["product", "男", "女"],
            ["达标", res.Q[0], res.Q[1]],
            ["不达标", res.UNQ[0], res.UNQ[1]]
          ]
        },
        xAxis: { 
          type: "category",
           name: "达标情况",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
           
          }

           },
        yAxis: {
          interval:1,
           name: "人数",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
           
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: "bar", barWidth: 60 },
          { type: "bar", barWidth: 60 }
        ]
      });
    },
    async groupAllStudentsQuSituationBySex(classId){
          const res =  await groupAllStudentsQuSituationBySex({classId})
         return res;
    },
       async groupAllStudentsQuSituationByAge(classId){
          const res =  await groupAllStudentsQuSituationByAge({classId})
         return res;
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 65px;
  margin-left: 20px;
  width: 100%;
  height: 100%;
  padding: 60px 20px;
  .div-tree {
    width: 15%;
    margin-right: 30px;
    text-align: center;
    .tree {
      width: 100%;
      height: 700px;
      border-radius: 10px;
      .tree-header {
        width: 100%;
        background-color: #f4f4f4;
        #tree-header-span {
          font-size: 19px;
          line-height: 45px;
          margin-left: 18px;
        }
      }
    }
  }
  .div-table {
    width: 83%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 700px;
    background-color: white;
    border-radius: 18px;
    padding: 0 20px 50px 20px;
    text-align: center;
    .quContainer {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      .quarter-div {
        width: 50%;
        height: 50%;
      }
    }
    h1 {
      width: 80%;
      padding: 15px;
      border-radius: 50px;
      background-color: #4caf50;
      position: relative;
      top: -50px;
    }
  }
}
</style>
