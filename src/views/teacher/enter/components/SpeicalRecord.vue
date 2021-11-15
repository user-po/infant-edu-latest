<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>特别记录</span>
      </div>
      <div id="title-divider" />
      <div class="contentContainer">
        <el-row type="flex" justify="start" :gutter="20" style="width: 600px;margin: 5px  ">
          <el-col :span="14" :offset="2" style="margin-left: 10px">
            <template>
              <span>文字记录</span>
              <br>
              <el-input
                v-model="specialRecordText"
                type="textarea"
                :rows="4"
                placeholder="暂无特别记录"
                :disabled="flag !== $store.state.common.DIALOGEDIT"
              />
            </template>
          </el-col>
          <el-col :span="6" :offset="1">
            <template>
              <span>视频记录</span>
              <br>
              <el-popover
                v-model="showSpecialRecordVideoPover"
                placement="bottom"
                width="400"
                height="400"
                trigger="click"
              >
                <div id="player" />
                <el-button slot="reference" type="primary" :disabled="this.upLoadFileList.length == 0">{{ getSpecialRecordVideoText() }}</el-button>
              </el-popover>
            </template>
          </el-col>
        </el-row>
      </div>
      <div id="title-divider" />
      <el-form class="form" :model="form" label-position="top" :inline="true" style="margin-left: 22px" />
    </el-dialog>
  </div>
</template>

<script>
import { gap } from '@/utils/date'
import { fetchStudentScoreList } from '@/api/score'
import { getInfo } from '@/api/File'
export default {
  data() {
    return {
      dialogFormVisible: false,
      flag: this.$store.state.common.DIALOGSHOW,
      currentScoreId: 0,
      specialRecordText: '',
      currentFilePage: 1,
      currentVideoSrc: '',
      upLoadFileList: [],
      showSpecialRecordVideoPover: false,
      form: {
        name: '',
        stuCode: '',
        sex: '',
        age: '',
        classCheckList: []
      },
      vodPlayerJs: 'https://player.polyv.net/script/player.js',
      vid: '88083abbf5bcf1356e05d39666be527a_8'
    }
  },
  watch: {
    showSpecialRecordVideoPover: function(newValue) {
      // this.$refs.SpecialRecordVideo.pause()
      if (newValue) {
        this.loadPlayerScript(this.loadPlayer)
      } else {
        this.destroyed()
      }
    }
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
        width: 380,
        height: 200,
        vid: this.vid
      })
    },
    destroyed() {
      if (this.player) {
        this.player.destroy()
      }
    },
    opened() {
      this.queryFileList()
    },
    getSpecialRecordVideoText() {
      if (this.upLoadFileList.length > 0) {
        return '查看视频记录'
      } else {
        return '暂无视频记录'
      }
    },
    initFormData(data, scoreList) {
      this.specialRecordText = data.special_record
      this.currentScoreId = data.score_id
      this.currentFilePage = 1
      this.upLoadFileList.splice(0)
    },
    showSpecialRecordDialog(data) {
      this.flag = this.$store.state.common.DIALOGSHOW
      this.dialogFormVisible = true
      this.initFormData(data)
    },
    showEditSpecialRecordDialog(data) {
      this.flag = this.$store.state.common.DIALOGEDIT
      this.dialogFormVisible = true
    },
    confirm() {
      this.dialogFormVisible = false
    },
    cancel() {
      this.dialogFormVisible = false
    },
    queryFileList() {
      const form = {
        module_id: this.currentScoreId,
        module_name: '特别记录'
      }
      getInfo(form).then(response => {
        const { data, totalPageNum, errno } = response.data
        if (errno !== 0) {
          this.$message.error(data.msg)
          return
        }
        data?.forEach(item => {
          this.upLoadFileList.push({ id: item.id, insertTime: item.create_time, name: item.file_name, fileUrl: item.file_url, usages: item.file_usage })
        })
        this.currentFilePage++
        if (this.currentFilePage <= totalPageNum) {
          this.queryFileList()
        } else {
          if (this.upLoadFileList.length > 0) {
            this.currentVideoSrc = this.$store.state.common.fileUrl + this.upLoadFileList[0].name
            this.vid = this.upLoadFileList[0].fileUrl
            console.log(this.vid)
          }
        }
      }).catch(error => {
        this.$message.error(`获取已上传课程资料失败,请稍后重试...${error}`)
      })
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
    #title-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
    }
    .contentContainer{
      margin-top: 30px;
      margin-bottom: 30px;
      .el-row{
        .el-col{
          .el-input{
            margin-top: 8px;
          }
        }
      }
    }
    .foot-divider{
      width: 100%;
      height: 1px;
      background-color: #DCDFE6;
      margin: 8px 0;
    }
    .foot-title{
      color: #4C4C4C;
      font-weight: bold;
      margin-left: 18px;
    }

    .div-footer{
      margin-top: 13px;
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
    padding:5px 0;
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

<!--修改dialog的全局样式-->
<style>

</style>
