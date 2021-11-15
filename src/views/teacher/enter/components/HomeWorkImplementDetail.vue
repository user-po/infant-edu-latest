<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" @opened="opened">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>作业详情</span>
      </div>
      <div id="title-divider" />
      <div class="contentContainer">
        <el-row type="flex" justify="start" :gutter="20" style="width: 600px;margin: 5px  ">
          <el-col :span="14" :offset="2" style="margin-left: 10px">
            <template>
              <span>完成详情</span>
              <br>
              <el-input
                v-model="specialRecordText"
                type="textarea"
                :rows="4"
                placeholder="暂无落实详情"
                :disabled="flag !== $store.state.common.DIALOGEDIT"
              />
            </template>
          </el-col>
          <el-col :span="6" :offset="1">
            <template>
              <span>视频详情</span>
              <br>
              <el-popover
                v-model="showSpecialRecordVideoPover"
                placement="bottom"
                width="400"
                height="400"
                trigger="click"
              >
                <video ref="SpecialRecordVideo" controlsList="nodownload" style="width: 100%;height: 100%" :src="currentVideoSrc" controls />
                <el-button slot="reference" type="primary" :disabled="this.currentVideoSrc == ''">{{ getSpecialRecordVideoText() }}</el-button>
              </el-popover>
            </template>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchHomeWorkId } from '@/api/homework'
import { fetchHomeWorkDetail } from '@/api/course'
import {fetchHomeWorkByScoreID} from "@/api/score";
export default {
  data() {
    return {
      dialogFormVisible: false,
      flag: this.$store.state.common.DIALOGSHOW,
      currentScoreId: 0,
      currentHomeWordId: 0,
      specialRecordText: '',
      currentFilePage: 1,
      currentVideoSrc: '',
      showSpecialRecordVideoPover: false,
      form: {
        name: '',
        stuCode: '',
        sex: '',
        age: '',
        classCheckList: []
      }
    }
  },
  watch: {
    showSpecialRecordVideoPover: function(newValue) {
      this.$refs.SpecialRecordVideo.pause()
    }
  },
  methods: {
    opened() {
      this.fetchHomeWorkId()
    },
    getSpecialRecordVideoText() {
      if (this.currentVideoSrc != '') {
        return '查看视频记录'
      } else {
        return '暂无视频记录'
      }
    },
    initFormData(data, scoreList) {
      this.specialRecordText = data.special_record
      this.currentScoreId = data.score_id
      this.currentFilePage = 1
      this.currentHomeWordId = 0
      this.currentVideoSrc = ''
      this.currentHomeWordId = 0
    },
    showHomeWorkImplementDetailDialog(data) {
      this.flag = this.$store.state.common.DIALOGSHOW
      this.dialogFormVisible = true
      this.initFormData(data)
    },
    confirm() {
      this.dialogFormVisible = false
    },
    cancel() {
      this.dialogFormVisible = false
    },
    fetchHomeWorkId() {
      const fetchForm = {
        scoreId: this.currentScoreId
      }
      fetchHomeWorkByScoreID(fetchForm).then(response => {
        const { data } = response.data
        this.currentHomeWordId = data[data.length - 1].id
        if (this.currentHomeWordId != 0) {
          this.fetchHomeWorkDetail()
        }
      }).catch(error => {
        this.$message.error(`获取作业Id失败,请稍后重试...${error}`)
      })
    },
    fetchHomeWorkDetail() {
      const fetchForm = {
        homeWorkId: this.currentHomeWordId
      }
      fetchHomeWorkDetail(fetchForm).then(response => {
        const { data } = response.data
        const length = data.length
        this.specialRecordText = data[length - 1].word
        const videoLength = data[length - 1].HomeWorkInfoFileDetail?.length
        if (data[length - 1].HomeWorkInfoFileDetail && data[length - 1]?.HomeWorkInfoFileDetail[videoLength - 1]?.file_name !== undefined) {
          this.currentVideoSrc = this.$store.state.common.fileUrl + data[length - 1].HomeWorkInfoFileDetail[videoLength-1]?.file_name
        }
      }).catch(error => {
        this.$message.error(`获取作业详情失败,请稍后重试...${error}`)
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
