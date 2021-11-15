<template>
  <div class="container">
    <div class="div-tree">
      <StuTree
        @node-click="handleNodeClick"
        v-if="renderComponent"
        v-loading="treeLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        title="请选择学生"
        show-type="成绩录入"
      />
    </div>
    <SelectTeacher @handleChange="handleChange" />
    <div v-if="showEnterDetail" class="div-table">
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
import SelectTeacher from "@/components/SelectTeacher/SelectTeacher";
var myChart;
export default {
  components: {
    StuTree,
    StudentBasicInfo,
    SelectTeacher
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
      treeLoading: false,
      studentId: 0,
      loading: false
    };
  },
  unmounted() {
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
  },
  methods: {
    handleChange(val) {
      this.treeLoading = true;
      this.showEnterDetail = false;
      this.$store.state.common.teacherId = Number(val.split(",")[0]);
      this.$store.state.common.title = val.split(",")[1];
      this.currentCom = "Tree";
      this.forceRerender();
      setTimeout(() => {
        this.treeLoading = false;
      }, 1000);
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
      // 绘制图表
      myChart.setOption({
        title: {
          text: "课程信息统计"
        },
        xAxis: {
          type: "category",
          data: res.course_names,
          name: "课程名称",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12
          },
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          interval: 10,
          type: "value",
          min: 0,
          max: 100,
          name: "课程绩点",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 12,
            color: "#333"
          }
        },

        series: [
          {
            name: "course",
            data: res.course_gpa,
            type: "line",
            markLine: {
             symbol:'none',
               itemStyle: {
                    normal: {
                        borderWidth: 1,
                        lineStyle: {
                            type: 'solid',
                            color: '#333 ',
                            width: 2,
                        },
                        label: {
                            formatter: '及格线',
                            textStyle: {
                                fontSize: 16,
                                fontWeight: "bolder",
                            },
                        }
                    },


                },
              data: [
                {
                  yAxis: 40 //这里设置false是隐藏不了的，可以设置为-1
                }
              ]
            }
          }
        ]
      });
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
