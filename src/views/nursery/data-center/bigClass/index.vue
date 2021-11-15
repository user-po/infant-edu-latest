<template>
  <blockquote>
    <div class="buttons">
      <blockquote v-for="(item, index) in classInfo" :key="index">
        <el-button
          :type="types[index % types.length]"
          @click="showTeacherInfo(item.teacher_id, item.class_no)"
          >{{ item.class_no }}</el-button
        >
      </blockquote>
    </div>
    <div class="container">
      <div class="div-table">
        <h1 class="first_h1">课程累积达标率</h1>

        <div
          class="quContainer"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
        <div class="right">
            <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="getTimeRange"
        >
        </el-date-picker>
        </div>
          <div id="myChart" class="quarter-div"></div>
          <div id="myChart_1" class="quarter-div"></div>
          <div id="myChart_2" class="quarter-div"></div>
        </div>
      </div>
    </div>
    <div class="container second">
      <div class="div-table">
        <h1>作业累积完成率</h1>
        <div
          class="quContainer"
          v-loading="homework_loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <div id="myChart_1_1" class="quarter-div"></div>
          <div id="myChart_1_2" class="quarter-div"></div>
          <div id="myChart_1_3" class="quarter-div"></div>
          <div id="myChart_1_4" class="quarter-div"></div>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column
          property="name"
          label="班主任姓名"
          width="200"
        ></el-table-column>
        <el-table-column
          property="title"
          label="职称"
          width="200"
        ></el-table-column>
        <el-table-column
          property="phone"
          label="电话"
          width="200"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </blockquote>
</template>

<script>
import {
  groupGradeStudentsBySex,
  groupGradeStudentsByAge,
  groupGradeStudentsByScore,
  getClassInfo,
  getHomeWorkCompleteRateByClassId,
  getHomeWorkWordCompleteRateByClassId,
  getHomeWorkVideoCompleteRateByClassId,
  getHomeWorkWordAndVideoCompleteRateByClassId
} from "@/api/analysis";
import { fetchTeacherList } from "@/api/teacher";
var myChart;
var myChart_1;
export default {
  components: {},
  data() {
    return {
      loading: false,
      classInfo: [],
      types: ["", "primary", "success", "info", "warning", "danger"],
      title: "",
      dialogTableVisible: false,
      gridData: [],
      homework_loading: false,
      date:"",
      level:"大班"
    };
  },
  mounted() {
    this.loading = true;
    this.homework_loading = true;
    this.fetchgroupGradeStudentsBySex();
    this.fetchgroupGradeStudentsByAge();
    this.fetchgroupGradeStudentsByScore();
    this.fetchClassInfo();
    this.fetchHomeWorkCompleteRateByGrade();
    this.fetchHomeWorkWordCompleteRateByGrade();
    this.fetchHomeWorkVideoCompleteRateByGrade();
    this.fetchHomeWorkWordAndVideoCompleteRateByGrade()
    setTimeout(() => {
      this.loading = false;
      this.homework_loading = false;
    }, 300);
  },
  unmounted() {
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
    if (myChart_1 != null && myChart_1 != "" && myChart_1 != undefined) {
      myChart_1.dispose();
    }
  },
  methods: {
    getTimeRange(val){
        let startTime = val[0]
        let endTime = val[1]
      this.loading = true;
    this.homework_loading = true;
    this.fetchgroupGradeStudentsBySex(startTime,endTime);
    this.fetchgroupGradeStudentsByAge(startTime,endTime);
    this.fetchgroupGradeStudentsByScore(startTime,endTime);
    this.fetchClassInfo();
    this.fetchHomeWorkCompleteRateByGrade(startTime,endTime);
    this.fetchHomeWorkWordCompleteRateByGrade(startTime,endTime);
    this.fetchHomeWorkVideoCompleteRateByGrade(startTime,endTime);
    this.fetchHomeWorkWordAndVideoCompleteRateByGrade(startTime,endTime)
    setTimeout(() => {
      this.loading = false;
      this.homework_loading = false;
    }, 300);
    },
    async showTeacherInfo(teacherId, class_no) {
      const res = await fetchTeacherList({ teacherId });
      this.dialogTableVisible = true;
      this.title = class_no;
      this.gridData = res.data.data;
    },
    async fetchgroupGradeStudentsBySex(startTime,endTime) {
      const res = await groupGradeStudentsBySex({ level:this.level,startTime,endTime });

      this.drawLineFirst(res.data.data);
    },
    async fetchClassInfo() {
      const res = await getClassInfo({ level:this.level});
      this.classInfo = res.data.data;
    },
    async fetchgroupGradeStudentsByAge(startTime,endTime) {
      const res = await groupGradeStudentsByAge({ level: this.level,startTime,endTime });

      this.drawLineSecond(res.data.data);
    },

    async fetchgroupGradeStudentsByScore(startTime,endTime) {
      const res = await groupGradeStudentsByScore({ level: this.level,startTime,endTime });

      this.drawLineThree(res.data.data);
    },
    async fetchHomeWorkCompleteRateByGrade(startTime,endTime) {
      const res = await getHomeWorkCompleteRateByClassId({
        level: this.level,
        startTime,endTime
      });
      this.drawLineFirst_1(res.data.data);
    },
    async fetchHomeWorkWordCompleteRateByGrade(startTime,endTime) {
      const res = await getHomeWorkWordCompleteRateByClassId({
        level: this.level,
        startTime,endTime
      });
      this.drawLineSecond_1(res.data.data);
    },
    async fetchHomeWorkVideoCompleteRateByGrade(startTime,endTime) {
      const res = await getHomeWorkVideoCompleteRateByClassId({
        level: this.level,
        startTime,endTime
      });
      this.drawLineThree_1(res.data.data)
    },
    async fetchHomeWorkWordAndVideoCompleteRateByGrade(startTime,endTime){
     const res = await getHomeWorkWordAndVideoCompleteRateByClassId({
        level: this.level,
        startTime,endTime
      });
      this.drawLineFourth_1(res.data.data)
    },
    drawLineFirst(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.clear();
      // 绘制图表
      myChart.setOption({
        title: {
          text: "性别统计"
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
            fontSize: 12
          }
        },
        yAxis: {
          name: "人数",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 14
          },
          interval: 1
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: "bar", barWidth: 60 },
          { type: "bar", barWidth: 60 }
        ]
      });
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
        tooltip: {},
        xAxis: {
          type: "category",
          data: res.ages_name,
          name: "年龄",
          nameLocation: "end"
        },
        yAxis: {
          type: "value",
          interval: 1,
          name: "个数",
          nameLocation: "end"
        },
        series: [
          {
            data: res.ages,
            type: "bar"
          }
        ]
      });
    },
    drawLineThree(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart_2"));
      myChart.clear();
      // 绘制图表
      myChart.setOption({
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            left: "93%",
            start: 0,
            end: 100
          },
          {
            type: "inside",
            xAxisIndex: [0],
            start: 1,
            end: 35
          },
          {
            type: "inside",
            yAxisIndex: [0],
            start: 29,
            end: 36
          }
        ],
        title: {
          text: "年级绩点统计"
        },
        tooltip: {},
        xAxis: {
          type: "category",
          data: res.names,
          name: "班级",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12
          }
        },
        yAxis: {
          interval: 150,
          type: "value",
          name: "绩点",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            data: res.totals,
            type: "bar",
            barWidth: 20
          }
        ]
      });
    },
    drawLineFirst_1(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_1 = this.$echarts.init(document.getElementById("myChart_1_1"));
      myChart_1.clear();
      // 绘制图表
      myChart_1.setOption({
        title: {
          text: "作业完成率",
          x: "center"
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
            name: "完成率",
            type: "pie",
            radius: "50%",
            data: [
              { value: res.completed, name: "完成" },
              { value: res.not_completed, name: "未完成" }
            ],
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
    drawLineSecond_1(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_1 = this.$echarts.init(document.getElementById("myChart_1_2"));
      myChart_1.clear();
      // 绘制图表
      myChart_1.setOption({
        title: {
          text: "文本作业完成率",
          x: "center"
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
            name: "完成率",
            type: "pie",
            radius: "50%",
            data: [
              { value: res.completed, name: "完成" },
              { value: res.not_completed, name: "未完成" }
            ],
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
    drawLineThree_1(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_1 = this.$echarts.init(document.getElementById("myChart_1_3"));
      myChart_1.clear();
      // 绘制图表
      myChart_1.setOption({
        title: {
          text: "视频作业完成率",
          x: "center"
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
            name: "完成率",
            type: "pie",
            radius: "50%",
            data: [
              { value: res.completed, name: "完成" },
              { value: res.not_completed, name: "未完成" }
            ],
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
    drawLineFourth_1(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_1 = this.$echarts.init(document.getElementById("myChart_1_4"));
      myChart_1.clear();
      // 绘制图表
      myChart_1.setOption({
        title: {
          text: "文字和视频作业完成率",
          x: "center"
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
            name: "完成率",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: res.videoAndWordCompletedStu[0],
                name: "视频和文字作业全部完成"
              },
              {
                value: res.videoAndWordCompletedStu[1],
                name: "视频和文字作业未全部完成"
              }
            ],
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
    }
  }
};
</script>

<style scoped lang="scss">
.selectOptions {
  position: absolute;
  right: 50px;
  top: 30px;
}
.buttons {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 65px;
  margin-left: 20px;
  width: 100%;
  height: 100%;
  padding: 60px 20px;
  position: relative;
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
    .first_h1{
        top:-100px;
    }
    .right{
        position: absolute;
        top: 98px;
        right: 276px;
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
.second {
  margin-top: -82px;
}
</style>
