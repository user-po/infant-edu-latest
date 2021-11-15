import { fetchClassList, createClass, updateClass, deleteClass } from '@/api/class'
import common from "@/store/modules/common";
const state = {
  gradeList: new Set(),
  classList: []
}

const mutations = {
  SET_GENDER_LIST: (state, classList) => {
    classList.forEach((value) => {
      state.gradeList.add(value.grade)
    })
  },
  SET_CLASS_LIST: (state, classList) => {
    state.classList = classList
  }
}

const actions = {
  fetchClassList({ commit, state }) {
    return new Promise((resolve, reject) => {
      const form = { organizational_id: commit.state.nurseryId }
      fetchClassList(form).then(response => {
        const { data } = response
        commit('SET_GENDER_LIST', data.data)
        commit('SET_CLASS_LIST', data.data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
