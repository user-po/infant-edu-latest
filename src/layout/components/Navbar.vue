<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-badge v-if="$store.state.common.title" :value="this.messageCount" style="right: 30px;margin-bottom: 3px;" size="mini">
        <i class="el-icon-message-solid" style="font-size: 26px" @click="messageDialogVisible=true" />
      </el-badge>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-user-solid" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="editUserPassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      v-loading="loading"
      width="30%"
      title="修改密码"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="重复输入" :label-width="formLabelWidth" prop="repeatPassword">
          <el-input v-model="form.repeatPassword" autocomplete="off" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="loading"
      width="40%"
      title="消息列表"
      :visible.sync="messageDialogVisible"
      @opened="opened"
    >
      <div class="infinite-list-wrapper" style="overflow:auto">
        <ul
          v-if="messageList.length>0"
          class="list"
        >
          <li v-for="item in messageList" @click="showMessageDetail(item)">
            <el-row :gutter="20">
              <el-col :span="3">
                <i class="el-icon-chat-line-square" style="font-size: 50px" />
              </el-col>
              <el-col :span="18">
                <div style="margin-top: 0px">
                  <el-badge :value="item.isRecommend==0?'new':''" class="item">
                    <p style="margin-top: 8px;margin-bottom: 0;font-size: 16px;color: black">{{ item.title }}</p>
                  </el-badge>
                  <p style="margin-top: 0;margin-bottom: 0;font-size: 12px;">{{ formate(item.releaseTime) }}</p>
                </div>
              </el-col>
              <el-col :span="3">
                <p style="color: black;">></p>
              </el-col>
            </el-row>
          </li>
        </ul>
        <div v-else class="emptyContainer">
          <svg-icon icon-class="empty" />
          <p>没有更多消息</p>
        </div>
      </div>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="10"
        :current-page="curPage"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
    <el-dialog
      width="30%"
      title="消息详情"
      :visible.sync="messageDetailDialogVisible"
    >
      <el-descriptions v-if="messageDetail" v-model="messageDetail" class="margin-top" title="" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            学生姓名
          </template>
          {{ messageDetail.student.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            年龄
          </template>
          {{ messageDetail.student.age }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone" />
            年级
          </template>
          {{ messageDetail.student.stuclass }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone" />
            班级
          </template>
          {{ messageDetail.student.classNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline" />
            学号
          </template>
          {{ messageDetail.student.stucode }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets" />
            课程
          </template>
          <el-tag size="small">{{ messageDetail.title }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            专家意见(对教师)
          </template>
          {{ messageDetail.content }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { consumeArticle, fetchArticle, fetchArticleCount, updatePassword } from '@/api/check'
import { formateSimple } from '@/utils/date'

// import {updatePassWord} from "@/api/nursery";
// import { updatePassWord } from '@/api/nursery'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== '') {
        this.checkPassword(value, callback)
      }
    }
    return {
      curPage: 1,
      dialogFormVisible: false,
      formLabelWidth: '110',
      messageDialogVisible: false,
      messageDetailDialogVisible: false,
      messageCount: 0,
      messageList: [],
      unqualifiedCourseList: [],
      messageDetail: '',
      total: 0,
      loading: false,
      listLoading: false,
      count: 10,
      form: {
        password: '',
        repeatPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '密码组合为6-16个字符', trigger: 'blur', max: 16, min: 6 }
        ],
        repeatPassword: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (this.$store.state.common.title) {
      this.fetchTeacherArticleCount()
    }
  },
  methods: {
    load() {
      this.listLoading = true
      setTimeout(() => {
        this.count = this.count + 10
        this.listLoading = false
      }, 3000)
    },
    formate(data) {
      return formateSimple(data)
    },
    editUserPassword() {
      this.dialogFormVisible = true
    },
    showMessageItem() {

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.curPage = val
      this.fetchTeacherArticle(val, 10)
    },
    showMessageDetail(item) {
      this.messageDetailDialogVisible = true
      this.messageDetail = item
      item.isRecommend = 1
      this.consumeTeacherArticle(item.id)
    },
    checkPassword(phone, callback) {
      if (this.form.password == this.form.repeatPassword) {
        callback()
        return
      } else {
        callback(new Error('两次密码输入不一致'))
      }
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const postForm = { username: this.$store.state.common.userName, passWord: this.form.repeatPassword }
          updatePassword(postForm).then(response => {
            const { data } = response.data
            this.$message.success('提示,修改密码成功')
          }).catch(error => {
            this.$message.error(`抱歉,修改密码失败,错误信息~ ${error}`)
          }).finally(() => {
            this.loading = false
            this.dialogFormVisible = false
          })
        } else {
          return false
        }
      })
    },
    // 获取新消息条数
    fetchTeacherArticleCount() {
      const form = { userid: this.$store.state.common.teacherId, isrecomment: 0 }
      fetchArticleCount(form).then(response => {
        const { data } = response.data
        this.messageCount = data
      }).catch(error => {
        this.$message.error(`抱歉,获取未读消息总数错误,错误信息~ ${error}`)
      })
    },
    // 获取消息总数
    fetchTeacherAllArticleCount() {
      const form = { userid: this.$store.state.common.teacherId, isrecomment: 3 }
      fetchArticleCount(form).then(response => {
        const { data } = response.data
        this.total = data
      }).catch(error => {
        this.$message.error(`抱歉,获取未读消息总数错误,错误信息~ ${error}`)
      })
    },
    fetchTeacherArticle(page, limit) {
      this.messageList.splice(0)
      const form = { userid: this.$store.state.common.teacherId, isrecomment: 3, page, limit }
      fetchArticle(form).then(response => {
        const { data } = response.data
        data.forEach(item => {
          this.messageList.push(item)
        })
      }).catch(error => {
        this.$message.error(`抱歉,获取教师消息失败,错误信息~ ${error}`)
      })
    },
    consumeTeacherArticle(id) {
      const form = { id }
      consumeArticle(form).then(response => {
        const { data } = response.data
      }).catch(error => {
        this.$message.error(`抱歉,确认教师信息失败,错误信息~ ${error}`)
      })
    },
    opened() {
      this.fetchTeacherAllArticleCount()
      this.fetchTeacherArticle(1, 10)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

    ::v-deep .el-dialog__body{
    padding-top: 8px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .el-dialog{
    .emptyContainer{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 150px;
      font-size: 150px;
      p{
        font-size: 16px;
      }
    }

  }
    .infinite-list-wrapper{
      .list{
        padding-left: 8px;
        margin-bottom: 80px;
        .list-item{
          height: 30px;
          list-style: none;
          div{
            &:hover{
              background-color: #ECF5FF;
            }
          }
        }
      }
    }

  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .el-icon-user-solid {
          font-size: 28px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
