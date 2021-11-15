<template>
  <div class="container">
    <div class="title">
      <i class="el-icon-notebook-1" />
      <span>学校管理</span>
    </div>

    <!--    标题-->
    <div class="input-stunum">
      <el-input id="el-input-stu" v-model="form.inputStuNo" size="small" clearable placeholder="机构名称/负责人/账号" style="width: 195px" />
      <el-button id="el-button-query" v-loading="queryLoading" size="small" @click="query">查询</el-button>
      <el-button id="el-button-reset" size="small" @click="reset">重置</el-button>
    </div>
    <!--    高级筛选-->
    <span style="margin: 8px auto;display: block">高级筛选▽</span>
    <div class="input-filter">
      <!--      <div class="input-filter-gender">-->
      <!--        <span>机构类型:</span>-->
      <!--        <el-checkbox-group v-model="filter.nurseryTypeCheckList" style="margin-left: 57px;">-->
      <!--          <el-checkbox label="幼儿园" />-->
      <!--          <el-checkbox label="机构" />-->
      <!--        </el-checkbox-group>-->
      <!--      </div>-->
      <div class="input-filter-age">
        <span>地址:</span>
        <v-region style="margin-left: 80px;" :town="false" @values="selectedRegion" />
      </div>
    </div>
    <!--    添加学生-->
    <el-row class="el-row-add">
      <el-col :span="2" :offset="20"> <el-button size="small" style="width: 140px;" @click="showAddDialog">+添加机构</el-button></el-col>
    </el-row>
    <add-nursery ref="AddNurseryComponents" @CommitAddNursery="createNursery" @CommitEditNursery="editNursery" />
    <delete ref="DeleteComponents" title="是否删除该机构的信息" @ConfirmDelete="deleteNursery" />
    <authorization ref="Authorization" @AddAuthorization="createAuthorization" @DelAuthorization="deleteAuthorization" />
    <UploadBusinessLicense ref="UploadBusinessComponents" @preview="showPreviewDialog" />
    <Preview ref="Preview" />
    <!--    表格-->
    <template class="table">
      <el-table v-loading="tableLoading" class="table" :header-cell-style="{'background':'#ECF5FF','color':'#606266','text-align':'center'}" :cell-style="{'text-align':'center'}" :data="tableData" fix style="width: 95%" max-height="700px">
        <el-table-column fixed prop="order" label="序号" />
        <el-table-column fixed prop="name" label="机构名称" />
        <el-table-column prop="contact_people" label="联系人" />
        <el-table-column prop="code" label="账号" />
        <el-table-column prop="business_license" label="机构营业执照" />
        <el-table-column prop="phone" label="联系方式" />
        <el-table-column label="地址">
          <template slot-scope="scope">
            <v-region v-model="scope.row" type="text" style="font-size: 10px" />
            <span style="font-size: 10px">{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="机构类型" :filter-method="filterNurseryType" :filters="[{ text: '机构', value: '机构' }, { text: '幼儿园', value: '幼儿园' }]" />
        <el-table-column prop="insert_time" label="添加时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showEditDialog(scope.row.id)">修改</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id)">删除</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showAutnorizationDialog(scope.row.id)">资料授权</el-button>
            <span>|</span>
            <el-button type="text" size="small" @click="showUploadBusinessDialog(scope.row.id)">营业执照</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="curPage"
        layout="prev, pager, next,jumper"
        :total="totalItem"
        style="margin: 15px 0px"
        @current-change="handleCurrentChange"
      />
    </template>
  </div>
</template>

<script>
import Delete from '@/components/manage/Delete'
import Authorization from '@/views/header-quarters/nursery-info/components/Authorization'
import AddNursery from '@/views/header-quarters/nursery-info/components/AddNursery'
import { fetchQuartersList, createQuarters, updateQuarters, deleteQuarters } from '@/api/nursery'
import { formateSimple } from '@/utils/date'
import { fetchRelationShipList, createRelationShip, updateRelationShipList, deleteRelationShipList } from '@/api/relation'
import UploadBusinessLicense from '@/views/header-quarters/nursery-info/components/UploadBusinessLicense'
import Preview from '@/views/header-quarters/manage-course/components/Preview'

export default {
  components: { Authorization, Delete, AddNursery, UploadBusinessLicense, Preview },
  data() {
    return {
      queryLoading: false,
      tableLoading: false,
      totalItem: 0,
      currentNurseryId: '',
      curPage: 1,
      form: {
        inputStuNo: ''
      },
      filter: {
        nurseryTypeCheckList: [],
        region: {
          areaCode: '',
          cityCode: '',
          provinceCode: ''
        }
      },
      options_age: [{
        label: '3岁',
        value: 3
      }, {
        label: '4岁',
        value: 4
      }, {
        label: '5岁',
        value: 5
      }, {
        label: '6岁',
        value: 6
      }, {
        label: '7岁',
        value: 7
      }, {
        label: '8岁',
        value: 8
      }, {
        label: '9岁',
        value: 9
      }],
      tableData: [],
      rawTableData: [],
      filterTabLeData: [],
      addVisible: false,
      deleteVisible: false,
      editVisible: false
    }
  },
  watch: {
    filter: {
      handler(newValue) {
        console.log(newValue)
        this.filterTable()
      },
      deep: true
    }
  },
  mounted() {
    this.queryNurseryList()
  },
  methods: {
    // 学生添加 删除 修改操作
    showAddDialog: function() {
      this.$refs.AddNurseryComponents.showAddNurseryDialog()
    },
    showEditDialog(rowId) {
      this.rawTableData.forEach((item) => {
        if (rowId === item.id) {
          this.$refs.AddNurseryComponents.showEditNurseryDialog(item)
        }
      })
    },
    showDeleteDialog(rowId) {
      this.currentNurseryId = rowId
      this.$refs.DeleteComponents.showDeleteDialog(rowId)
    },
    showPreviewDialog(type, name) {
      this.$refs.Preview.showPreviewDialog(type, name)
    },
    showAutnorizationDialog(rowId) {
      this.$refs.Authorization.showAuthorizationDialog(rowId)
    },
    showUploadBusinessDialog(rowId) {
      this.$refs.UploadBusinessComponents.showUploadDialog(rowId)
    },
    handleCurrentChange(val) {
      this.curPage = val
      this.queryNurseryList()
    },
    reset() {
      this.form = {
        inputStuNo: ''
      }
      this.filter = {
        nurseryTypeCheckList: [],
        region: {
          areaCode: 0,
          cityCode: 0,
          provinceCode: 0
        }
      }
    },
    selectedRegion(value) {
      console.log(value)
      if (value.area?.key) {
        this.filter.region.areaCode = value.area.key
      } else {
        this.filter.region.areaCode = ''
      }
      if (value.city?.key) {
        this.filter.region.cityCode = value.city.key
      } else {
        this.filter.region.cityCode = ''
      }
      if (value.province?.key) {
        this.filter.region.provinceCode = value.province.key
      } else {
        this.filter.region.provinceCode = ''
      }
    },
    filterNurseryType(value, row, column) {
      return row.type === value
    },
    filterTable() {
      this.tableData = this.filterTabLeData.filter((item, index) => {
        let flag = true
        if (this.filter.nurseryTypeCheckList.length > 0) {
          flag = false
          this.filter.nurseryTypeCheckList.forEach((nurseyItem) => {
            if (nurseyItem === item.type) {
              flag = true
            }
          })
          if (flag !== true) {
            return flag
          }
        }
        if (this.filter.region.provinceCode !== '') {
          console.log(this.filter.region.provinceCode)
          flag = false
          if (this.filter.region.provinceCode === item.province) {
            flag = true
          }
          if (flag !== true) {
            return flag
          }
          if (this.filter.region.cityCode !== '') {
            flag = false
            if (this.filter.region.cityCode === item.city) {
              flag = true
            }
          }
          if (flag !== true) {
            return flag
          }
          if (this.filter.region.areaCode !== '') {
            flag = false
            if (this.filter.region.areaCode === item.area) {
              flag = true
            }
            if (flag !== true) {
              return flag
            }
          }
        }
        return flag
      })
    },
    query() {
      this.curPage = 1
      this.queryNurseryList()
    },
    // 根据条件查询机构列表
    queryNurseryList() {
      this.tableLoading = true
      const formFetch = {
        // studentName: this.form.inputStuNo,
        curPage: this.curPage
      }
      if (this.form.inputStuNo !== '') {
        formFetch.query = this.form.inputStuNo
      }
      this.tableData.length = 0
      fetchQuartersList(formFetch).then(response => {
        console.log(response)
        const { data, totalPageNum } = response.data
        this.totalItem = parseInt(totalPageNum) * this.$store.state.common.pageSize
        this.curPageItemCount = data.length
        this.rawTableData = data
        data.forEach((item, index) => {
          this.tableData.push({
            order: ++index,
            id: item.id,
            name: item.name,
            contact_people: item.contact_people,
            code: item.code,
            business_license: item.business_license,
            type: item.type === '1' ? '机构' : '幼儿园',
            address: item.address,
            province: String(item.province),
            city: String(item.city),
            area: String(item.area),
            phone: String(item.phone),
            town: '0', // 必写，不写不显示
            remark: item.remark,
            insert_time: formateSimple(item.insert_time)
          })
        })
        this.filterTabLeData = JSON.parse(JSON.stringify(this.tableData))
        // this.filterTable()
      }).catch(error => {
        this.$message.error(`抱歉,获取学生信息失败 ${error}`)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    createNursery(form) {
      console.log(form)
      createQuarters(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          // 添加成功，当前页已满，直接加载下一页
          if (this.curPageItemCount === this.$store.state.common.pageSize) {
            // 添加学生成功，重新获取列表
            this.curPage++
          }
          this.queryNurseryList()
        } else {
          this.$message.error(`添加失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddNurseryComponents.cancel()
      })
    },
    editNursery(form) {
      console.log('更新 ：' + JSON.stringify(form))
      updateQuarters(form).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.queryNurseryList()
        } else {
          this.$message.error(`更新失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`更新失败 error:${error} `)
      }).finally(() => {
        this.$refs.AddNurseryComponents.cancel()
      })
    },
    deleteNursery() {
      deleteQuarters({ id: this.currentNurseryId }).then(response => {
        const { data } = response
        console.log(data)
        if ((data.errno === 0) && (data.sqlerr === 0)) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 删除之后，当前页已空，重新加载上一页
          if (this.curPageItemCount === 1) {
            --this.curPage
          }
          this.queryNurseryList()
        } else {
          this.$message.error(`删除失败 sqlerr:${data.errno} errno:${data.errno}`)
        }
      }).catch(error => {
        this.$message.error(`删除失败 error:${error} `)
      })
    },
    createAuthorization(form) {
      createRelationShip(form).then(response => {
        console.log(response)
        this.$message.success('授权课程资料成功')
      }).catch(error => {
        this.$message.error(`授权课程资料失败${error}`)
      }
      ).finally(() => {
        this.$refs.Authorization.refresh()
      })
    },
    deleteAuthorization(form) {
      deleteRelationShipList(form).then(response => {
        console.log(response)
        this.$message.success('取消授权成功')
      }).catch(error => {
        this.$message.error(`取消授权失败${error}`)
      }
      ).finally(() => {
        this.$refs.Authorization.refresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  width: 100%;
  margin-left: 50px;
  .title{
    margin-top: 4px;
    i{
      position: relative;
      top: 4px;
      color: black;
      font-size: 34px;
    }
    span{
      margin-left: 4px;
      color: #333333;
      font-size: 19px;
      font-weight: bold;
    }
  }
  .input-stunum{
    margin-top: 20px;
    .el-input-stu{
    }
    #el-button-query{
      width: 140px;
      margin-left: 22px;
    }
    #el-button-reset{
      width: 140px;
      margin-left: 22px;
    }
  }

  .input-filter{
    font-size: 14px;
    div{
      display: flex;
      justify-content: start;
      align-items: center;
      color: #333333;
      margin: 5px 0px;
    }
    label{
      font-weight: normal;
    }
    .divide{
      margin: 0 4px;
    }
  }
  .el-row-add{
    margin: 15px;
  }
}
</style>
