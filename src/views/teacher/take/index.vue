<template>
  <div class="container">
    <div class="div-tree">
      <!--      <div class="div-tree-title">-->
      <!--        <i class="el-icon-s-claim" />-->
      <!--      </div>-->
      <SelectTree title="请选择课程" show-type="上课" @node-click="handleNodeClick" />
    </div>
    <!--    主界面播放选择控件-->
    <div v-if="currentCourseId !== 0" class="div-play-layout">
      <h1>{{ currentCourseTitle }}课程信息</h1>
      <div class="play">
        <!--      播放控件-->
        <el-carousel ref="PlayElCarousel" :autoplay="false" direction="vertical" indicator-position="none">
          <el-carousel-item name="InfoPage">
            <div class="div-course-info-page">
              <img src="../../../assets/picture/blackboard.png" width="100%" height="100%" alt="">
              <ul style="position: absolute;top: 30px; left: 40px;font-size: 38px;  color: white;z-index:9999">
                <h2 style="font-size: 38px;  color: white;">{{ this.currentCourseTitle1 }}</h2>
                <h2 v-if="!(currentCourseId === 0)" style="font-size: 28px;  color: white;z-index:9999">课程领域：&nbsp;&nbsp;
                  {{ this.types }}</h2>
                <h2 v-if="!(currentCourseId === 0) && showTeachingVideo" style="font-size: 28px;  color: white;z-index:9999">教学视频&nbsp;&nbsp;
                  {{ courseInfo.videoTeachingCount }}份</h2>
                <h2 v-if="!(currentCourseId === 0)" style="font-size: 28px;  color: white;z-index:9999">教学音档&nbsp;&nbsp;
                  {{ courseInfo.audioCount }}份</h2>
                <h2 v-if="!(currentCourseId === 0)" style="font-size: 28px;  color: white;z-index:9999">辅助视频&nbsp;&nbsp;
                  {{ courseInfo.videoCount }}份</h2>
                <h2 v-if="!(currentCourseId === 0)" style="font-size: 28px;  color: white;z-index:9999">辅助照片&nbsp;&nbsp;
                  {{ courseInfo.pictureCount }}份</h2>
              </ul>

              <!--              <el-popover-->
              <!--                style="position: absolute;top: 380px; left: 100px;font-size: 28px;z-index:9999"-->
              <!--                placement="right"-->
              <!--                width="200"-->
              <!--                trigger="click"-->
              <!--              >-->
              <!--                <el-table :data="tableCreateArray" :row-class-name="tableRowClassName" fit >-->
              <!--                  <el-table-column property="order" label="序号" />-->
              <!--                  <el-table-column label="领域">-->
              <!--                    <template slot-scope="scope">-->
              <!--                      <el-link v-if="scope.row.important==1" type="danger" >{{ scope.row.label }}</el-link>-->
              <!--                      <el-link v-else type="info" >{{ scope.row.label }}</el-link>-->
              <!--                    </template>-->
              <!--                  </el-table-column>-->
              <!--                </el-table>-->
              <!--                <el-button slot="reference" style="font-size: 30px" type="text">课程领域</el-button>-->
              <!--              </el-popover>-->
              <!--      音频播放控件-->
              <div v-show="showAudioControl" class="div-audio-float">
                <el-button id="el-button-float" circle size="medium" @click="controlAudio">
                  <svg-icon icon-class="music" />
                </el-button>
                <audio ref="audio" controlsList="nodownload" controls :style="{width:getAudioWidth}">
                  <source :src="currentAudioSrc" type="audio/ogg">
                  您的浏览器不支持 audio 元素。
                </audio>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item name="VideoPage">
            <!--            <el-button  icon="el-icon-copy-document" circle style="position: absolute;right: 30px;top: 30px"></el-button>-->
            <div id="player" />
          </el-carousel-item>
          <el-carousel-item name="PicturePage">
            <el-carousel ref="PictureItemEl" :autoplay="false">
              <el-carousel-item v-for="item in pictureList" :key="item.url">
                <el-image :src="item.url" fit="scale-down" />
              </el-carousel-item>
            </el-carousel>
          </el-carousel-item>
          <el-carousel-item name="teachingPlan">
            <el-carousel ref="TeachingPlanEl" :autoplay="false" arrow="never">
              <!--              <iframe :src="currentPdfSrc" width="100%" height="100%">-->
              <!--                This browser does not support PDFs. Please download the PDF to view it:<a :href="previewUrl">Download PDF</a>-->
              <!--              </iframe>-->
              <div class="pdfControlContainer" style="width: 100%;text-align: center">
                <el-button-group v-if="currentPdfSrc !== ''">
                  <el-button size="mini" type="info" icon="el-icon-search" @click="showDocDialogPreview">全屏查看</el-button>
                  <el-button size="mini" type="info" icon="el-icon-arrow-left" @click="prePage">上一页</el-button>
                  <el-button size="mini" type="info">{{ pageNum+"/"+pageTotalNum }}</el-button>
                  <el-button size="mini" type="info" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
                </el-button-group>
              </div>
              <pdf ref="pdf" :page="pageNum" :src="currentPdfSrc" @num-pages="pageTotalNum=$event" />
            </el-carousel>
          </el-carousel-item>
        </el-carousel>
        <!--      选择控件-->
        <div class="select">
          <el-carousel v-if="showTeachingVideo" ref="SelectTeachPlanVideoElCarousel" :autoplay="false" indicator-position="none" arrow="never">
            <el-carousel-item>
              <el-button class="el-button-select" style="background-color: #4F5C65;color: white" @click="clickTeachingPlan">教案</el-button>
            </el-carousel-item>
            <el-carousel-item>
              <el-card class="box-card" shadow="always">
                <div slot="header" class="box-card-header clearfix">
                  <span>教案</span>
                  <el-button v-if="showBackButton" type="text" @click="goBack(5)">返回</el-button>
                </div>
                <ul v-if="teachingPlanList.length>0" class="list">
                  <li v-for="(item,index) in teachingPlanList" :class="{'teaching-plan-li-active':item.active}" @click="clickTeachingPlanItem(index)">
                    <div class="list-item">
                      <span>{{ item.file_name }}</span>
                    </div>
                  </li>
                </ul>
                <div v-else class="emptyContainer">
                  <svg-icon icon-class="empty" />
                  <p>暂无内容</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
          <el-carousel v-if="showTeachingVideo" id="el-carousel-select-item" ref="SelectTeachingVideoElCarousel" :autoplay="false" indicator-position="none" arrow="never">
            <el-carousel-item>
              <el-button class="el-button-select" style="background-color: #44B6AE;color: white" @click="clickTeachingVideo">教学视频</el-button>
            </el-carousel-item>
            <el-carousel-item>
              <el-card class="box-card" shadow="always">
                <div slot="header" class="box-card-header clearfix">
                  <span>教学视频</span>
                  <el-button v-if="showBackButton" type="text" @click="goBack(4)">返回</el-button>
                </div>
                <ul v-if="videoTeachingList.length>0" class="list">
                  <li v-for="(item,index) in videoTeachingList" :class="{'video-teaching-li-active':item.active}" @click="clickTeachingVideoItem(index)">
                    <div class="list-item">
                      <span>{{ item.file_name }}</span>
                    </div>
                  </li>
                </ul>
                <div v-else class="emptyContainer">
                  <svg-icon icon-class="empty" />
                  <p>暂无内容</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
          <!--        教学音档-->
          <el-carousel ref="SelectAudioElCarousel" :autoplay="false" indicator-position="none" controls-list="nodownload" arrow="never">
            <el-carousel-item>
              <el-button class="el-button-select" style="background-color: #578EBE;color: white" @click="clickAudio">教学音频</el-button>
            </el-carousel-item>
            <el-carousel-item>
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="box-card-header clearfix">
                  <span>教学音频</span>
                  <el-button v-if="showBackButton" type="text" @click="goBack(0)">返回</el-button>
                </div>
                <ul v-if="audioList.length>0" class="list">
                  <li v-for="(item,index) in audioList" :class="{'audio-li-active':item.active}" @click="clickAudioItem(index)">
                    <div class="list-item">
                      <span>{{ item.file_name }}</span>
                    </div>
                  </li>
                </ul>
                <div v-else class="emptyContainer">
                  <svg-icon icon-class="empty" />
                  <p>暂无内容</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
          <!--      辅助视频-->
          <el-carousel ref="SelectVideoElCarousel" class="SelectVideoElCarousel" :autoplay="false" indicator-position="none" arrow="never">
            <el-carousel-item>
              <el-button class="el-button-select" style="background-color: #14AAE4;color: white" @click="clickVideo">辅助视频</el-button>
            </el-carousel-item>
            <el-carousel-item>
              <el-card class="box-card" shadow="always">
                <div slot="header" class="box-card-header clearfix">
                  <span>辅助视频</span>
                  <el-button v-if="showBackButton" type="text" @click="goBack(1)">返回</el-button>
                </div>
                <ul v-if="videoList.length>0" class="list">
                  <li v-for="(item,index) in videoList" :class="{'video-li-active':item.active}" @click="clickVideoItem(index)">
                    <div class="list-item">{{ item.file_name }}</div>
                  </li>
                </ul>
                <div v-else class="emptyContainer">
                  <svg-icon icon-class="empty" />
                  <p>暂无内容</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
          <!--        辅助照片-->
          <el-carousel ref="SelectPictureElCarousel" :autoplay="false" indicator-position="none" arrow="never">
            <el-carousel-item>
              <el-button class="el-button-select" style="background-color: #949FB1;color: white" @click="clickPicture">辅助照片</el-button>
            </el-carousel-item>
            <el-carousel-item>
              <el-card class="box-card" shadow="always">
                <div slot="header" class="box-card-header clearfix">
                  <span>辅助照片</span>
                  <el-button v-if="picturePreviewList.length" style="margin-left: 10px" type="text" @click="onPreview">全屏</el-button>
                </div>
                <ul v-if="pictureList.length>0" class="list">
                  <li v-for="(item,index) in pictureList" :class="{'picture-li-active':item.active}" @click="clickPictureItem(index)">
                    <div class="list-item">{{ item.file_name }}</div>
                  </li>
                </ul>
                <div v-else class="emptyContainer">
                  <svg-icon icon-class="empty" />
                  <p>暂无内容</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="docDialogPreviewVisible" width="80%">
      <div style="width: 100%;text-align: center">
        <el-button-group v-if="currentPdfSrc !== ''">
          <el-button size="mini" type="info" icon="el-icon-arrow-left" @click="prePage">上一页</el-button>
          <el-button size="mini" type="info">{{ pageNum+"/"+pageTotalNum }}</el-button>
          <el-button size="mini" type="info" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-button-group>
      </div>
      <pdf ref="pdf" :key="pdfKey" :page="pageNum" :src="currentPdfSrc" @num-pages="pageTotalNum=$event" />
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      ref="ImageViewer"
      :initial-index="currentPictureIndex"
      :on-close="closeViewer"
      :url-list="picturePreviewList"
    />
  </div>
</template>
<script>
import SelectTree from '@/components/Select/SelectTree'
import { getInfo } from '@/api/File'
import pdf from 'vue-pdf'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: {
    SelectTree, pdf, ElImageViewer
  },
  data() {
    return {
      showViewer: false,
      docDialogPreviewVisible: false,
      tableCreateArray: [],
      pdfKey: 1,
      picurl: '../../../assets/picture/blackboard.png',
      showTeachingVideo: false,
      curFilesPage: 1,
      videoKey: 1,
      showBackButton: false,
      courseInfo: {
        audioCount: 2,
        videoCount: 2,
        pictureCount: 4,
        videoTeachingCount: 8,
        videoTeachingPlanCount: 9
      },
      currentPictureIndex: 0,
      currentCourseId: 0,
      pageNum: 1,
      pageTotalNum: 1,
      showMenu: true,
      audioWidth: 0,
      showAudioControl: false,
      liActive: 'li-active',
      index_list: [],
      is_red_list: [],
      audioControlTimeOut: -1,
      currentAudioSrc: '',
      currentVideoSrc: '',
      currentClassId: '',
      currentPdfSrc: '',
      currentCourseTitle1: '请在课程列表选择课程',
      audioList: [],
      pictureList: [],
      picturePreviewList: [],
      videoList: [],
      videoTeachingList: [],
      teachingPlanList: [],
      types: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      vodPlayerJs: 'https://player.polyv.net/script/player.js',
      vid: '88083abbf5bcf1356e05d39666be527a_8'
    }
  },
  computed: {
    getAudioWidth: function() {
      return this.audioWidth + 'px'
    }
  },
  watch: {
    audioList: {
      handler(newValue) {
        newValue.forEach((item) => {
          if (item.active) {
            this.showAudioControl = true
            return
          }
        })
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.name === 'Prepare') {
      this.showTeachingVideo = true
      console.log('showTeachingVideo' + this.showTeachingVideo)
    }
    this.loadPlayerScript(this.loadPlayer)
  },
  methods: {
    loadPlayerScript(callback) {
      if (!window.polyvPlayer) {
        const myScript = document.createElement('script')
        myScript.setAttribute('src', this.vodPlayerJs)
        myScript.onload = callback
        document.body.appendChild(myScript)
      } else {
        callback()
      }
    },
    loadPlayer() {
      const polyvPlayer = window.polyvPlayer
      this.player = polyvPlayer({
        wrap: '#player',
        height: 630,
        vid: this.vid
      })
    },
    destroyed() {
      if (this.player) {
        this.player.destroy()
      }
    },
    changeVideo() {
      this.player.on('s2j_onPlayOver', () => {
        console.info('视频播放完毕')
        this.player.changeVid(this.vid) // 切换下一个视频
      })
    },
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    controlAudio() {
      this.audioWidth = 300
      clearTimeout(this.audioControlTimeOut)
      this.audioControlTimeOut = setTimeout(() => {
        this.audioWidth = 0
      }, 6000)
    },
    tableRowClassName({ row }) {
      if (row.important == '1') {
        return 'warning-row'
      }
      return 'warning-row'
    },
    showDocDialogPreview() {
      this.docDialogPreviewVisible = true
      this.pdfKey++
    },
    handleNodeClick(data) {
      this.showMenu = false
      this.currentPictureIndex = 0
      console.log(data)
      this.currentClassId = data.classId
      this.currentCourseId = data.id
      this.curFilesPage = 1
      this.teachingPlanList.splice(0)
      this.videoTeachingList.splice(0)
      this.audioList.splice(0)
      this.videoList.splice(0)
      this.pictureList.splice(0)
      this.picturePreviewList.splice(0)
      this.currentAudioSrc = ''
      this.currentVideoSrc = ''
      this.currentPdfSrc = ''
      this.queryCourseFiles()
      this.currentCourseTitle = data.label
      this.currentCourseTitle1 = data.label
      this.courseInfo.audioCount = 0
      this.courseInfo.pictureCount = 0
      this.courseInfo.videoCount = 0
      this.courseInfo.videoTeachingCount = 0
      this.courseInfo.videoTeachingPlanCount = 0
      this.index_list = data.index_list.split(',')
      this.is_red_list = data.is_red_list.split(',')
      this.tableCreateArray.splice(0)
      this.types = data.types
      // table 中添加 各项指标列
      for (let i = 0; i < this.index_list.length; i++) {
        if (this.index_list[i]) {
          this.tableCreateArray.push({ order: (i + 1), label: this.index_list[i], important: this.is_red_list[i], prop: `course${i}` })
        }
      }
      this.$nextTick(() => {
        // 显示课程首页
        this.$refs.PlayElCarousel.setActiveItem(0)
        this.$refs.SelectAudioElCarousel.setActiveItem(0)
        this.$refs.SelectVideoElCarousel.setActiveItem(0)
        this.$refs.SelectPictureElCarousel.setActiveItem(0)
        if (this.showTeachingVideo) {
          this.$refs.SelectTeachingVideoElCarousel.setActiveItem(0)
        }
        if (this.showTeachingVideo) {
          this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(0)
        }
        // 切换课程时，视频正在播放则暂停
        // this.videoKey++
        // this.$refs.video.load()
        this.destroyed()
        // 切换课程时，音频正在播放，则暂停
        if (!this.$refs.audio.paused) {
          this.$refs.audio.load()
        }
      })
    },
    goBack(index) {
      switch (index) {
        case 0: this.$refs.SelectAudioElCarousel.setActiveItem(0)
          break
        case 1: this.$refs.SelectVideoElCarousel.setActiveItem(0)
          break
        case 2: this.$refs.SelectPictureElCarousel.setActiveItem(0)
          break
        case 4: this.$refs.SelectTeachingVideoElCarousel.setActiveItem(0)
          break
        case 5:this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(0)
          break
      }
    },
    clickAudio() {
      // 默认选择音频列表第一个
      if (this.audioList.length <= 0) {
        this.$alert('暂无教学音频...', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$nextTick(() => {
        if (this.audioList.length > 0) {
          this.clickAudioItem(0)
        }
        // this.$refs.video.pause()
        this.destroyed()
      })
      this.$refs.SelectAudioElCarousel.setActiveItem(1)
      this.$refs.PlayElCarousel.setActiveItem(1)
      // 暂停播放视频
      // this.$refs.SelectVideoElCarousel.setActiveItem(0)
      if (this.showTeachingVideo) {
        this.$refs.SelectTeachingVideoElCarousel.setActiveItem(0)
        // 关闭教案
        this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(0)
      }
    },
    clickVideo() {
      // 默认选择视频列表第一项
      if (this.videoList.length <= 0) {
        this.$alert('暂无辅助视频...', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$nextTick(() => {
        if (this.videoList.length > 0) {
          this.clickVideoItem(0)
        }
        this.$refs.audio.pause()
      })
      this.$refs.SelectVideoElCarousel.setActiveItem(1)
      this.$refs.PlayElCarousel.setActiveItem(1)
      // 关闭照片
      this.$refs.SelectPictureElCarousel.setActiveItem(0)
      // 暂停播放音乐
      this.$refs.SelectAudioElCarousel.setActiveItem(0)
      if (this.showTeachingVideo) {
        // 关闭教案
        this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(0)
        // 暂停播放教学视频
        this.$refs.SelectTeachingVideoElCarousel.setActiveItem(0)
      }
    },
    clickTeachingVideo() {
      // 默认选择列表中第一个视频
      if (this.videoTeachingList.length <= 0) {
        this.$alert('暂无教学视频...', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$nextTick(() => {
        if (this.videoTeachingList.length > 0) {
          this.clickTeachingVideoItem(0)
        }
        this.$refs.audio.pause()
      })
      this.$refs.SelectTeachingVideoElCarousel.setActiveItem(1)
      this.$refs.PlayElCarousel.setActiveItem(1)
      // 关闭照片
      this.$refs.SelectPictureElCarousel.setActiveItem(0)
      // 暂停播放辅助视频
      this.$refs.SelectVideoElCarousel.setActiveItem(0)
      // 暂停播放音乐
      this.$refs.SelectAudioElCarousel.setActiveItem(0)
      if (this.showTeachingVideo) {
        // 关闭教案
        this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(0)
      }
    },
    onPreview() {
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    clickPicture() {
      if (this.pictureList.length <= 0) {
        this.$alert('暂无辅助图片...', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$nextTick(() => {
        if (this.pictureList.length > 0) {
          this.clickPictureItem(0)
        }
      })
      this.$refs.SelectPictureElCarousel.setActiveItem(1)
      this.$refs.PlayElCarousel.setActiveItem(2)
      // 关闭辅助视频
      this.$refs.SelectVideoElCarousel.setActiveItem(0)
      if (this.showTeachingVideo) {
        // 关闭教学视频
        this.$refs.SelectTeachingVideoElCarousel.setActiveItem(0)
        // 关闭教案
        this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(0)
      }
    },
    clickTeachingPlan() {
      if (this.teachingPlanList.length <= 0) {
        this.$alert('暂无教案...', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$nextTick(() => {
        if (this.teachingPlanList.length > 0) {
          this.clickTeachingPlanItem(0)
        }
      })
      this.$refs.SelectTeachPlanVideoElCarousel.setActiveItem(1)
      this.$refs.PlayElCarousel.setActiveItem(3)
      // 关闭辅助视频
      this.$refs.SelectVideoElCarousel.setActiveItem(0)
      // 关闭教学视频
      this.$refs.SelectTeachingVideoElCarousel.setActiveItem(0)
      this.$refs.SelectPictureElCarousel.setActiveItem(0)
    },
    clickAudioItem(index) {
      this.audioList[index].active = true
      for (let i = 0; i < this.audioList.length; i++) {
        if (i !== index) {
          this.audioList[i].active = false
        }
      }
      this.currentAudioSrc = this.audioList[index].url
      this.vid = this.audioList[index].fileUrl
      console.log(this.vid)
      this.destroyed()
      this.loadPlayer()
      // 关闭视频跑马切换(列表点击也需要切换)
      this.$refs.SelectVideoElCarousel.setActiveItem(0)
      // this.$refs.audio.load()
      // this.$refs.audio.play()
    },
    clickTeachingPlanItem(index) {
      this.pageNum = 1
      this.teachingPlanList[index].active = true
      for (let i = 0; i < this.teachingPlanList.length; i++) {
        if (i !== index) {
          this.teachingPlanList[i].active = false
        }
      }
      this.currentPdfSrc = this.teachingPlanList[index].url
      console.log(this.currentPdfSrc)
    },
    clickVideoItem(index) {
      this.videoList[index].active = true
      for (let i = 0; i < this.videoList.length; i++) {
        if (i !== index) {
          this.videoList[i].active = false
        }
      }
      this.currentVideoSrc = this.videoList[index].url
      this.vid = this.videoList[index].fileUrl
      console.log(this.vid)
      this.destroyed()
      this.loadPlayer()
      // 关闭音乐跑马切换
      this.$refs.SelectAudioElCarousel.setActiveItem(0)
    },
    clickTeachingVideoItem(index) {
      this.videoTeachingList[index].active = true
      for (let i = 0; i < this.videoTeachingList.length; i++) {
        if (i !== index) {
          this.videoTeachingList[i].active = false
        }
      }
      this.currentVideoSrc = this.videoTeachingList[index].url
      this.vid = this.videoTeachingList[index].fileUrl
      console.log(this.vid)
      this.destroyed()
      this.loadPlayer()
      // 关闭音乐跑马切换
      this.$refs.SelectAudioElCarousel.setActiveItem(0)
    },
    clickPictureItem(index) {
      this.currentPictureIndex = index
      this.pictureList[index].active = true
      for (let i = 0; i < this.pictureList.length; i++) {
        if (i !== index) {
          this.pictureList[i].active = false
        }
      }
      this.$refs.PictureItemEl.setActiveItem(index)
    },
    queryCourseFiles() {
      const form = { module_id: this.currentCourseId, module_name: '课程', curPage: this.curFilesPage }
      getInfo(form).then(response => {
        const { data, totalPageNum } = response.data
        console.log(data)
        const fileBaseUrl = this.$store.state.common.fileUrl
        data.forEach((item, index) => {
          if (item.file_usage === '教案') {
            this.courseInfo.videoTeachingPlanCount++
            this.teachingPlanList.push({ active: false, file_name: item.file_name, fileUrl: item.file_url, url: fileBaseUrl + item.file_name, id: item.id })
          } else if (item.file_usage === '辅助照片') {
            this.courseInfo.pictureCount++
            this.pictureList.push({ active: false, file_name: item.file_name, fileUrl: item.file_url, url: fileBaseUrl + item.file_name, id: item.id })
            this.picturePreviewList.push(fileBaseUrl + item.file_name)
          } else if (item.file_usage === '教学视频') {
            this.courseInfo.videoTeachingCount++
            this.videoTeachingList.push({ active: false, file_name: item.file_name, fileUrl: item.file_url, url: fileBaseUrl + item.file_name, id: item.id })
          } else if (item.file_usage === '辅助视频') {
            this.courseInfo.videoCount++
            this.videoList.push({ active: false, file_name: item.file_name, fileUrl: item.file_url, url: fileBaseUrl + item.file_name, id: item.id })
          } else if (item.file_usage === '教学音频') {
            this.courseInfo.audioCount++
            this.audioList.push({ active: false, file_name: item.file_name, fileUrl: item.file_url, url: fileBaseUrl + item.file_name, id: item.id })
          }
        })
        console.log(this.pictureList)
        this.curFilesPage++
        if (this.curFilesPage <= totalPageNum) {
          this.queryCourseFiles()
        }
      }).catch(error => {
        console.log(error)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
$teachingPlan:#4F5C65;
$audioColor:#578EBE;
$videoColor:#14AAE4;
$pictureColor:#949FB1;
$videoTeachingColor: #44B6AE;
.teaching-plan-li-active{
  background-color: $teachingPlan;
  color: white;
}

.audio-li-active{
  background-color: $audioColor;
  color: white;
}
.video-li-active{
  background-color: $videoColor;
  color: white;
}
.picture-li-active{
  background-color: $pictureColor;
  color: white;
}
.video-teaching-li-active{
  background-color: $videoTeachingColor;
  color: white;
}

.container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  background-color: #EEEEEE;
  //班级选择栏
  .div-tree{
    width: 15%;
    margin-right: 30px;
    margin-left: 40px;
    margin-top: 85px;
    text-align: center;
    .tree{
      width: 100%;
      height: 700px;
      border-radius: 10px;
      .tree-header{
        width: 100%;
        background-color: #F4F4F4;
        #tree-header-span{
          font-size: 19px;
          line-height: 45px;
          margin-left: 18px;
        }
      }
    }
  }

  .div-play-layout{
    width: 70%;
    display: flex;
    margin-left: 30px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .div-audio-float{
      display: flex;
      align-items: center;
      direction: rtl;
      position: fixed;
      bottom: 120px;
      left: 120px;
      &:active audio{
        width: 300px;
      }
      audio{
        width: 0;
        transition: all 1s;
      }
      #el-button-float{
        position: relative;
        left: -54px;
        width: 54px;
        height: 54px;
        font-size: 30px;
        animation: linear 3s animation-music infinite;
        text-align: center;
        @keyframes animation-music {
          from{
            transform: rotate(0);
          }
          to{
            transform: rotate(360deg);
          }

        }
      }
    }
    h1{
      width: 80%;
      padding: 15px;
      margin: 0;
      text-align: center;
      border-radius: 50px;
      background-color: #4CAF50;
      position: relative;
      top: 30px;
    }
    //播放控件
    .play{
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 700px;
      background-color: #FFFFFF;
      border-radius: 15px;
      padding: 20px;
      padding-top: 50px;
      //background-color: #4D647D;
      ::v-deep .el-carousel{
        width: 80%;
        height: 100%;
        .el-carousel__container{
          width: 100%;
          height: 100%;
          .div-course-info-page{
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: contain;
            .el-table .warning-row {
              background: #FEF0F0;
            }
          }

          video{
            width: 100%;
            height: 100%;
          }
          .el-carousel{
            width: 100%;
            height: 100%;
            .el-image{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .select{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 20%;
        height: 100%;
        .el-carousel{
          width: 90%;
          height: 100%;
          &:not(:nth-child(1)){
            margin-top: 10px;
          }
          .el-button-select {
            width: 100%;
            height: 100%;
            margin: 0;
            font-size: 20px;
          }
          ::v-deep .el-card{
            width:100%;
            height:100%;
            background-color: #ffffff;
            .el-card__header{
              height: 20%;
              padding: 8px 8px;
              font-size: 16px;
              .el-button--text{
                margin-left: 30%;
                margin-right: 8px;
                width: 20%;
                padding: 0;
              }
            }
            .el-card__body{
              padding: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              .emptyContainer{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 40%;
                height: 90px;
                font-size: 150px;
                p{
                  font-size: 12px;
                }
              }
              ul{
                width: 100%;
                height: 80%;
                padding: 0;
                margin-bottom: 10px;
                list-style: none;
                overflow-y: auto;
                li{
                  div{
                    width: 100%;
                    font-size: 12px;
                    padding: 4px 8px;
                    span{
                      width: 100%;
                      font-size: 10px;
                      white-space: nowrap;  /*强制span不换行*/
                      display: inline-block;  /*将span当做块级元素对待*/
                      overflow: hidden;  /*超出宽度部分隐藏*/
                      text-overflow: ellipsis;  /*超出部分以点号代替*/
                    }
                    &:hover{
                      //border: 1px #4CAF50 solid;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

</style>
