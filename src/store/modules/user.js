import { login, logout, getInfo, userLogin } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import common from '@/store/modules/common'
import { fetchToken } from '@/api/token'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, type } = userInfo
    return new Promise((resolve, reject) => {
      userLogin({ name: username.trim(), password: password, type: type }).then(response => {
        console.log('开始登录。。。。。。。。。。。。。。。。。')
        const { data } = response.data
        console.log(data)
        const roles = []
        if (data.userType === 'headquarters') {
          roles.push('header-quarters')
        } else if (data.userType === 'mechanism' || data.userType === 'organizational') {
          roles.push('nursery')
        } else if (data.userType === 'teacher') {
          roles.push('teacher')
        }
        let token
        if (getToken()) {
          token = JSON.parse(getToken())
        } else {
          token = { roles: '', name: '', username: '', title: '', teacherOrganizationId: 0, password: '', id: 0, nurseryId: 0, access_token: '', token_type: '', expires_in: '', save_time: new Date().getTime() }
        }
        console.log('denglu..........................')
        token.roles = roles
        token.name = data.name
        token.username = username
        token.password = password
        token.id = data.id
        token.nurseryId = data.companyId
        token.teacherOrganizationId = data.teacher?.organizationalId
        token.title = data.teacher?.title
        console.log(token)
        // { roles: roles, name: data.name, username, password: password, id: data.id, nurseryId: data.companyId, access_token: '', token_type: '', expires_in: '', save_time: new Date().getTime() }
        commit('SET_TOKEN', token)
        setToken(token)
        resolve(token)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // 获取学生信息时重置baSEURL
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      let token
      if (getToken()) {
        token = JSON.parse(getToken())
      } else {
        token = { roles: '', name: '', username: '', title: '', teacherOrganizationId: 0, password: '', id: 0, nurseryId: 0, access_token: '', token_type: '', expires_in: '', save_time: new Date().getTime() }
      }
      console.log(token)
      // if (!token.roles) {
      //   reject('getInfo: roles must be a non-null array!')
      // }
      const nowTimeStamp = new Date().getTime()
      if (token.access_token === '' || ((nowTimeStamp - token.save_time) / 1000) > token.expires_in) {
        console.log('获取token33333333。。。。。。。。。。。。。。。。。。。。')

        const form = {
          client_id: 'guetchildedu',
          client_secret: 'secret',
          grant_type: 'password',
          username: 'guetzhb',
          password: '123456'
        }
        fetchToken(form).then(response => {
          console.log('获取token1111111。。。。。。。。。。。。。。。。。。。。')
          const { data } = response
          token.access_token = data.access_token
          token.token_type = data.token_type
          token.expires_in = data.expires_in
          token.save_time = new Date().getTime()
          setToken(token)
          common.nurseryId = token.nurseryId
          common.teacherId = token.id
          common.teacherOrganizationId = token.teacherOrganizationId
          common.title = token.title
          common.userName = token.username
          console.log('重新加载')
          console.log(common.nurseryId)
          console.log(common.teacherId)
          commit('SET_ROLES', token.roles)
          commit('SET_NAME', token.name)
          commit('SET_AVATAR', '')
          commit('SET_INTRODUCTION', '')
          resolve(token)
        }).catch(error => {
          reject(error)
          this.$message.error(`抱歉，获取token失败${error}`)
        })
      } else {
        console.log('获取token4444444444444。。。。。。。。。。。。。。。。。。。。')
        console.log(token)
        common.nurseryId = token.nurseryId
        common.teacherId = token.id
        common.teacherOrganizationId = token.teacherOrganizationId
        common.title = token.title
        common.userName = token.username
        console.log('重新加载')
        console.log(common.nurseryId)
        console.log(common.teacherId)
        commit('SET_ROLES', token.roles)
        commit('SET_NAME', token.name)
        commit('SET_AVATAR', '')
        commit('SET_INTRODUCTION', '')
        resolve(token)
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      /* logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })*/
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

