<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      colorArray: ['#EBCAFE', '#FF005A', '#3888fa', '#4CAF50', '#F5BD00', '#CCAFEF', '#EB9FC1', '#95C2F1'],
      series: [],
      seriesIndex: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log('val')
        console.log(val)
        this.setOptions(val)
      }
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.initChart()
  //   })
  // },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    chartDestory() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
      console.log('destory')
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.$nextTick((thisContext) => {
        this.setOptions(this.chartData)
        const myChart = this.chart
        const indexList = this.seriesIndex
        console.log('indexList')
        console.log(indexList)
        myChart.getZr().on('mousemove', function(params) {
          const { topTarget } = params
          // 给折线的鼠标悬浮 变为 小手
          if (topTarget?.z === 2) {
            myChart.getZr().setCursorStyle('pointer')
          }
        })
        // myChart.on('click', (param) => {
        //   console.log('1111111111111111111111111111111')
        //   console.log(param)
        //   // param.value: "2021-08-13 10:41:16"
        //   this.$emit('xAxisTriggerEvent', param.value)
        // })
      })
    },
    chartResize() {
      console.log('resize')
      this.chart.resize()
    },
    setOptions(data) {
      const series = []
      const title = []
      console.log('data')
      console.log(data)
      let scoreList = []
      data.historyCourseList.forEach((item, index) => {
        title.push(item.insert_time)
        scoreList = item.scoreList.slice()
        this.seriesIndex.push(index)
        series.push({
          name: item.insert_time, itemStyle: {
            normal: {
              color: this.colorArray[index % this.colorArray.length],
              lineStyle: {
                color: this.colorArray[index % this.colorArray.length],
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: item.scoreList,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        })
      })
      for (let i = 0; i < scoreList.length; i++) {
        scoreList[i] = 4
      }
      title.push('达标')
      series.push({
        name: '达标', itemStyle: {
          normal: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 1
            }
          }
        },
        smooth: true,
        type: 'line',
        data: scoreList,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      })
      this.chart.setOption({
        xAxis: {
          data: data.xAxisData,
          boundaryGap: true,
          axisTick: {
            show: false
          },
          nameTextStyle: {
            width: 30
          },
          triggerEvent: true,
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function(params) {
              var newParamsName = ''
              var paramsNameNumber = params.length
              var provideNumber = 4 // 一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''
                  var start = p * provideNumber
                  var end = start + provideNumber
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: title,
          type: 'scroll'
        },
        series: series
      })
    }
  }
}
</script>
