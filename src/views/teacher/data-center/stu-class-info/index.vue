<template>
  <div class="container">
    <div class="div-tree">
      <StuTree @node-click="handleNodeClick" />
    </div>
    <div v-if="showEnterDetail" class="div-table">
      <h1>{{ title + "同学课程信息" }}</h1>
      <StudentBasicInfo :studentId="studentId" />
      <div
        class="quContainer"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div id="myChart" class="quarter-div"></div>
      </div>
    </div>
  </div>
</template>

<script>
import StuTree from "@/components/StuTree/StuTree";
import StudentBasicInfo from "@/components/StudentBasicInfo/StudentBasicInfo";
import { groupStudentsGpaByStuId } from "@/api/analysis";
var myChart;
export default {
  components: {
    StuTree,
    StudentBasicInfo
  },
  data() {
    return {
      title: "",
      studentId: 0,
      loading: false,
      showEnterDetail: false
    };
  },
  unmounted() {
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
  },
  methods: {
    drawLineFirst(res) {
      console.log(res);
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart"));
      let option = {
        title: {
          text: "课程信息统计"
        },
        xAxis: {
          type: "category",
          data: res.course_names,
          name: "课程名称",
          nameLocation: "end",

          axisLabel: {
            interval: 0,
            rotate: 40,
            // color: function (value, index) { return value == 0 ? 'green' : 'red'; },
            fontSize:12,
          }
        },
        yAxis: {
         
          type: "value",
          name: "课程绩点",
          interval: 10,
          type: "value",
          min: 0,
          max: 100,
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
            color: "#333"
          }
        },
        visualMap: {
          show: false,
          dimension: 1,
          pieces: [], //pieces的值由动态数据决定
          outOfRange: {
            color: "green"
          }
        },
        series: [
          {
            type: "line",
            markLine: {
              symbol: "none",
              itemStyle: {
                normal: {
                  borderWidth: 1,
                  lineStyle: {
                    type: "solid",
                    color: "red",
                    width: 2
                  },
                  label: {
                    formatter: "及格线",
                    textStyle: {
                      fontSize: 16,
                      fontWeight: "bolder"
                    }
                  }
                }
              },
              data: [
                {
                  yAxis: 40 //这里设置false是隐藏不了的，可以设置为-1
                }
              ]
            }
          }
        ]
      };
      option.series[0].data = res.course_gpa; 
      var j = 0;
      for (let i = 0; i < res.course_gpa.length; i++) {
        if (res.course_gpa[i] === 0) {
          option.visualMap.pieces[j] = { gte: i, lte: i+1, color: "red" };
          option.xAxis.axisLabel.color = function(value,index){return index==i?'orange':'black'}
          j++;
        }
      }
      
      // 绘制图表
      myChart.setOption(option);
    },
    async handleNodeClick(data) {
      this.loading = true;
      this.showEnterDetail = true;
      this.title = data.label;
      this.studentId = data.studentId;
      const res = await this.fetchStuGpa(this.studentId);
      this.loading = false;
      this.drawLineFirst(res.data.data);
    },
    async fetchStuGpa(studentId) {
      return await groupStudentsGpaByStuId({ studentId });
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
        width: 100%;
        height: 100%;
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
