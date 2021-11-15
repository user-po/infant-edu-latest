<template>
  <div class="selectOptions">
    <span>请选择一名教师查看：</span>
    <el-cascader
      v-model="value"
      :options="options"
      
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
import { getTeachersFromOrganization } from "@/api/analysis";
import { fetchTeacherList } from "@/api/teacher";
export default {
  name: "SelectTeacher",
  data() {
    return {
      value: [],
      options: []
    };
  },
  async mounted() {
    let options = await getTeachersFromOrganization();
    this.options = options.data.data;
  },

  methods: {
    async getTeacherTitle(id) {
      let res = await fetchTeacherList({ teacherId:id });
      return res.data.data[0].title;
    },
    async handleChange(value) {
      let title = await this.getTeacherTitle(value[1]);
      this.$emit("handleChange", value[1] + "," + title);
    }
  }
};
</script>

<style lang="scss">
.selectOptions {
  position: absolute;
  right: 50px;
  top: 30px;
}
</style>
