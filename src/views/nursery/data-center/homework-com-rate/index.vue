<template>
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
      />
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
      <h1>{{ title + "完成率统计" }}</h1>
      <TeacherBasicInfo :teacherId="teacherId" :classId="classId" />
      <div
        class="quContainer"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div id="myChart" class="quarter-div"></div>
        <div id="myChart_1" class="quarter-div"></div>
        <div id="myChart_2" class="quarter-div"></div>
        <div id="myChart_3" class="quarter-div"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectTree from "@/components/Select/SelectTree";
import TeacherBasicInfo from "@/components/TeacherBasicInfo/TeacherBasicInfo";
import {
  getHomeWorkCompleteRateByClassId,
  getHomeWorkWordCompleteRateByClassId,
  getHomeWorkVideoCompleteRateByClassId,
  getHomeWorkWordAndVideoCompleteRateByClassId
} from "@/api/analysis";
import {fetchTeacherList} from '@/api/teacher'
var myChart;
var myChart_1;
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
    if (maChart_2 != null && maChart_2 != "" && maChart_2 != undefined) {
      maChart_2.dispose();
    }
    if (maChart_3 != null && maChart_3 != "" && maChart_3 != undefined) {
      maChart_3.dispose();
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
    async handleNodeClick(data) {
      this.loading = true;
      this.showEnterDetail = true;
      this.title = data.label;
      this.teacherId = this.$store.state.common.teacherId;
      this.relationship_id = data.relationship_id;
      this.classId = data.classId;

      const res = await getHomeWorkCompleteRateByClassId({
        classId: this.classId
      });
      const res_two = await getHomeWorkWordCompleteRateByClassId({
        classId: this.classId
      });
      const res_three = await getHomeWorkVideoCompleteRateByClassId({
        classId: this.classId
      });
      const res_four = await getHomeWorkWordAndVideoCompleteRateByClassId({
        classId: this.classId
      });
      this.loading = false;

      this.drawLineFirst(res.data.data);
      this.drawLineSecond(res_two.data.data);
      this.drawLineThree(res_three.data.data);
      this.drawLineFourth(res_four.data.data);
    },
    drawLineFirst(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.clear();
      // 绘制图表
      myChart.setOption({
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
    drawLineSecond(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_1 = this.$echarts.init(document.getElementById("myChart_1"));
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
    drawLineThree(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_2 = this.$echarts.init(document.getElementById("myChart_2"));
      myChart_2.clear();
      // 绘制图表
      myChart_2.setOption({
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
    drawLineFourth(res) {
      // 基于准备好的dom，初始化echarts实例
      myChart_3 = this.$echarts.init(document.getElementById("myChart_3"));
      myChart_3.clear();
      // 绘制图表
      myChart_3.setOption({
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
