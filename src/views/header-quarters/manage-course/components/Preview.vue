<template>
  <div class="container">
    <el-dialog :visible.sync="dialogFormVisible" @closed="closed">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-view" />
        <span>{{ title }}</span>
      </div>
      <div id="title-divider" />
      <div class="previewContainer">
        <div v-if="type === '教案'">
          <div class="pdfControlContainer" style="width: 100%;text-align: center">
            <el-button-group>
              <el-button size="mini" type="info" icon="el-icon-arrow-left" @click="prePage">上一页</el-button>
              <el-button size="mini" type="info">{{ pageNum+"/"+pageTotalNum }}</el-button>
              <el-button size="mini" type="info" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
            </el-button-group>
          </div>
          <pdf ref="pdf" :page="pageNum" :src="getFileUrl" style="width:500px" @num-pages="pageTotalNum=$event" />
        </div>
        <div v-else-if="type === '教学视频'||type==='辅助视频'||type === '教学音频'">
          <div id="player" />
        </div>
<!--        <div v-else-if="type === '教学音频'">
          <audio ref="audio" controls style="width:500px" controlsList="nodownload">
            <source :src="getFileUrl" type="audio/ogg">
            您的浏览器不支持 audio 元素。
          </audio>
        </div>-->
        <div v-else-if="type === '辅助照片'||(type==='作业'&&this.accept.pictureAccept.includes(this.fileType))">
          <el-image :src="getFileUrl" fit="scale-down" style="width: 500px">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div v-if="type === '作业'&&this.accept.teachingPlanAccept.includes(this.fileType)">
          <div class="pdfControlContainer" style="width: 100%;text-align: center">
            <el-button-group>
              <el-button size="mini" type="info" icon="el-icon-arrow-left" @click="prePage">上一页</el-button>
              <el-button size="mini" type="info">{{ pageNum+"/"+pageTotalNum }}</el-button>
              <el-button size="mini" type="info" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
            </el-button-group>
          </div>
          <pdf ref="pdf" :page="pageNum" :src="getFileUrl" style="width:500px" @num-pages="pageTotalNum=$event" />
        </div>
        <div v-else />
      </div>
      <div class="div-footer">
        <el-button id="el-button-submit" style="width: 140px; margin-bottom: 30px" type="success" size="small" @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
  },
  data() {
    return {
      title: '预览',
      flag: this.$store.state.common.DIALOGSHOW,
      dialogFormVisible: false,
      courseTableData: [],
      formLabelWidth: '40px',
      type: '教案',
      fileName: '',
      fileBaseUrl: this.$store.state.common.fileUrl,
      fileUrl: '',
      pageNum: 1,
      pageTotalNum: 1,
      fileType: '',
      accept: {
        teachingPlanAccept: ['PDF'],
        teachingVideoAccept: ['MP4'],
        teachingAudioAccept: ['MP3'],
        videoAccept: ['MP4'],
        pictureAccept: ['JPG', 'JPEG', 'WEBP', 'PNG'],
        homeworkAccept: ['PDF', 'JPG', 'JPEG', 'WEBP', 'PNG']
      },
      vodPlayerJs: 'https://player.polyv.net/script/player.js',
      vid: '88083abbf5bcf1356e05d39666be527a_8'
    }
  },
  computed: {
    getFileUrl() {
      return this.fileBaseUrl + this.fileName
    }
  },
  mounted() {
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
        width: 540,
        height: 400,
        vid: this.vid
      })
    },
    destroyed() {
      if (this.player) {
        this.player.destroy()
      }
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
    showPreviewDialog(type, name, fileUrl) {
      const index = name.lastIndexOf('.')
      this.fileType = name.substr(index + 1).toUpperCase()
      this.type = type
      this.fileName = name
      this.fileUrl = this.fileBaseUrl + this.fileName
      this.vid = fileUrl
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      if (type === '教学视频' || type === '辅助视频' || type === '教学音频') {
        // this.$refs.teachingVideo.load()
        console.log('1111111111')
        console.log(this.vid)
        this.loadPlayerScript(this.loadPlayer)
      }
      /*  if (type === '教学音频') {
        this.$refs.audio.load()
      }*/
      if (type === '教案') {
        this.pageNum = 1
        this.pageTotalNum = 1
      }
    },
    cancel() {
      this.dialogFormVisible = false
    },
    closed() {
      if (this.type === '教学视频' || this.type === '辅助视频' || this.type === '教学音频') {
        // this.$refs.teachingVideo.pause()
        this.destroyed()
      }
      /* if (this.type === '教学音频') {
        this.$refs.audio.pause()
      }*/
    }
  }
}
</script>

<style  lang="scss" scoped>
//dialog 默认样式修改

::v-deep .el-dialog {
  width: 590px;
  border: solid 1px #797979;
  .el-dialog__header, .el-dialog__footer {
    display: none;
  }
  .el-dialog__body {
    padding: 0px;
    width: 100%;
    height: 100%;
    .title {
      height: 36px;
      i {
        margin-left: 20px;
      }
      span {
        line-height: 40px;
        margin-left: 10px;
        font-weight: bold;
      }
    }
    .previewContainer{
      margin: 20px 20px;
      padding: 10px;
      border: black 2px solid;
      border-radius: 8px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    #title-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }
    .foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
      margin-top: 20px;
    }
    .foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }
    .div-footer{
      margin-top: 30px;
      text-align: center;
    }
  }
}
.form{
  ::v-deep .el-form-item {
    margin-bottom: 0;
    line-height: 20px;
  }
  ::v-deep .el-form-item__label {
    padding: 15px 0 5px 0;
    font-weight: normal;
    line-height: 30px;
  }
}
.div-footer{
  display: flex;
  margin-top: 20px;
  justify-content: space-evenly;
}

</style>

