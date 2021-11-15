<template>
  <blockquote>
    <div class="container">
      <div class="div-tree">
        <SelectTree
          v-if="renderComponent"
          v-loading="treeLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          title="请选择要录入的课程"
          show-type="成绩录入"
          @node-click="handleNodeClick"
        ></SelectTree>
      </div>
      <div class="selectOptions">
        <span>请选择一名教师查看：</span>
        <el-select
          v-model="value"
          filterable
          placeholder="请选择教师"
          @change="onSelectChange"
          v-loading="Selectloading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="showEnterDetail" class="div-table">
        <h1>{{ title + "达标率统计" }}</h1>
         <TeacherBasicInfo :teacherId="teacherId" :classId="classId" :realtionId="relationship_id"/>
        <div
          class="quContainer"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <div id="myChart" class="quarter-div"></div>
          <div id="myChart_1" class="quarter-div"></div>
          <!-- <div id="myChart_2" class="quarter-div"></div> -->
          <div id="myChart_3" class="quarter-div"></div>
        </div>
      </div>
    </div>
  </blockquote>
</template>

<script>
import SelectTree from "@/components/Select/SelectTree";
import TeacherBasicInfo from "@/components/TeacherBasicInfo/TeacherBasicInfo";
import { fetchTeacherList } from "@/api/teacher";
import {
  groupUnqualifiedStudentsBySex,
  groupUnqualifiedStudentsByAge,
  groupStudentsQuSituationByScore,
  groupStudentsQuSituationByList
} from "@/api/analysis.js";
var myChart;
var maChart_1;
var myChart_2;
var myChart_3;
export default {
  components: {
    SelectTree,
    TeacherBasicInfo
  },
  data() {
    return {
      currentCom: "",
      drawer: true,
      direction: "rtl",
      options: [],
      value: "",
      loading: false,
      Selectloading: false,
      renderComponent: false,
      showEnterDetail: false,
      title: "",
      teacherId: 0,
      relationship_id: "",
      classId: 0,
      treeLoading: false
    };
  },
  mounted() {
    this.getTeachers();
  },
  unmounted() {
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
    if (maChart_1 != null && maChart_1 != "" && maChart_1 != undefined) {
      maChart_1.dispose();
    }
    // if (myChart_2 != null && myChart_2 != "" && myChart_2 != undefined) {
    //   myChart_2.dispose();
    // }
    if (myChart_3 != null && myChart_3 != "" && myChart_3 != undefined) {
      myChart_3.dispose();
    }
  },
  methods: {
    async getTeachers() {
      this.Selectloading = true;
      const res = await fetchTeacherList({
        organizational_id: this.$store.state.common.nurseryId
      });
      this.Selectloading = false;
      let teachers = res.data.data;
      teachers.map(item => {
        this.options.push({
          label: item.name,
          value: item.id + "," + item.title
        });
      });
    },
    forceRerender() {
      // 从 DOM 中删除 my-component 组件
      this.renderComponent = false;

      this.$nextTick(() => {
        // 在 DOM 中添加 my-component 组件
        this.renderComponent = true;
      });
    },
    onSelectChange(val) {
      this.treeLoading = true;
      this.showEnterDetail = false;
      this.$store.state.common.teacherId = val.split(",")[0];
      this.$store.state.common.title = val.split(",")[1];
      // this.currentCom = 'SelectTree'
      this.forceRerender();
      setTimeout(() => {
        this.treeLoading = false;
      }, 1000);
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
            fontSize: 12,
           
          }
        },
        yAxis: {
          name: "人数",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 14
          },
          interval:1
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
    drawLineThree(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart_3"));
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
          text: "绩点统计"
        },
        xAxis: {
          type: "category",
          data: res.name,
            name: "学生姓名",
          nameLocation: "middle",
          nameTextStyle: {
            fontSize: 12,
           
          }
        },
        yAxis: {
          interval:10,
          type: "value",
          name: "学生本课绩点",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
           
          }
        },
        series: [
          {
            data: res.gpa,
            type: "bar",
            barWidth: 20
          }
        ]
      });
    },
    drawLineFourth(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart_2"));
      myChart.clear();
      let series = [];
      res.red_list_name.map(item => {
        series.push({ type: "bar", barWidth: 20 });
      });
      // 绘制图表
      myChart.setOption({
        title: {
          text: "指标统计"
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ["product"].concat(res.red_list_name),
            ["达标"].concat(res.red_list_up_count),
            ["不达标"].concat(res.red_list_not_up_count)
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
            fontSize: 14,
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: series
      });
    },
    async handleNodeClick(data) {
      this.loading = true;
      if (myChart != null && myChart != "" && myChart != undefined) {
        myChart.dispose();
        myChart.clear();
      }
      if (maChart_1 != null && maChart_1 != "" && maChart_1 != undefined) {
        maChart_1.dispose();
        maChart_1.clear();
      }
      // if (myChart_2 != null && myChart_2 != "" && myChart_2 != undefined) {
      //   myChart_2.dispose();
      //   myChart_2.clear();
      // }
      if (myChart_3 != null && myChart_3 != "" && myChart_3 != undefined) {
        myChart_3.dispose();
        myChart_3.clear();
      }
      this.showEnterDetail = true;
      this.title = data.label;
      this.teacherId = this.$store.state.common.teacherId;
      this.relationship_id = data.relationship_id;
      this.classId = data.classId;
      const result = await groupUnqualifiedStudentsBySex({
        realtionId: this.relationship_id,
        teacherId: this.teacherId
      });
      const result_two = await groupUnqualifiedStudentsByAge({
        realtionId: this.relationship_id,
        teacherId: this.teacherId,
        classId: this.classId
      });
      const result_three = await groupStudentsQuSituationByScore({
        realtionId: this.relationship_id,
        teacherId: this.teacherId
      });
      // const result_four = await groupStudentsQuSituationByList({
      //   realtionId: this.relationship_id,
      //   teacherId: this.teacherId
      // });

      this.drawLineFirst(result.data.data);
      this.drawLineSecond(result_two.data.data);
      this.drawLineThree(result_three.data.data);
      // this.drawLineFourth(result_four.data.data);
      this.loading = false;
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
