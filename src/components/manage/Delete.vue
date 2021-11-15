<template>
  <el-dialog class="el-dialog-delete" :visible.sync="deleteDialogVisible" width="23%" center>
    <i class="el-icon-close" />
    <span>{{title}}</span>
    <div class="div-footer">
      <el-button id="el-button-add" :loading="loading" type="primary" style="width: 140px" @click="confirm">确定</el-button>
      <el-button id="el-button-cancel" type="info" style="width: 140px" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      deleteDialogVisible: false
    }
  },
  props:{
    title:{
      type:String,
      default:'是否删除该信息'
    }
  },
  methods: {
    showDeleteDialog() {
      this.deleteDialogVisible = true
    },
    confirm() {
      this.deleteDialogVisible = false
      this.$emit('ConfirmDelete');
    },
    cancel() {
      this.deleteDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header, ::v-deep .el-dialog__footer{
  display: none;
}
::v-deep .el-dialog{
  height: 211px;
  border: solid 1px #797979;
  border-radius: 12px;
}
::v-deep .el-dialog__body{
  padding: 0px;
  width: 100%;
  height: 100%;
}
.el-dialog-delete{
  i{
    display: inline-block;
    position: relative;
    top: 6px;
    margin-left: 25px;
    margin-top: 40px;
    font-size: 35px;
  }
  span{
    font-size: 16px;
    margin-left: 15px;
  };
  .div-footer{
    display: flex;
    margin-left: 20px;
    margin-right: 40px;
    margin-top: 40px;
    justify-content: space-around;
  }
}

</style>
