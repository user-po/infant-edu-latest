<template>
  <div class="container">
    <el-dialog :visible.sync="dialogFormVisible" @opened="open" :append-to-body="inner">
      <!--      标题-->
      <div class="title">
        <i class="el-icon-circle-plus-outline" />
        <span>{{ dialogTitle }}</span>
      </div>
      <div id="map-container" />
      <div class="search">
        <el-autocomplete
          id="location-input"
          v-model="keyWord"
          :fetch-suggestions="querySearch"
          placeholder="搜索地址"
          :trigger-on-focus="false"
          @select="handleSelect"
          clearable>
        </el-autocomplete>
      </div>
      <el-card  v-if="this.address.targetAddress !== ''" class="box-card"  shadow="always">
        <div slot="header" class="clearfix">
          <span>{{addressBoxCardTitle}}</span>
          <el-button v-if="flag === this.$store.state.common.DIALOGPICK" style="float: right; padding: 3px 0" type="text" @click="confirm">确认</el-button>
        </div>
        <div class="text">
          <p>
            <span>地址: </span>
            {{this.address.targetAddress}}
          </p>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  data() {
    return {
      flag:this.$store.state.common.DIALOGSHOW,
      dialogTitle:'',
      addressBoxCardTitle:'',
      keyWord:'',
      address:{
        targetAddress:'',
        targetLng:'',
        targetLat:'',
        targetProvinceCode:0,
        targetCityCode:0,
        targetAreaCode:0
      },
      searchTips:'',
      dialogFormVisible:false,
      marker:null,
      autoComplete: null,
      placeSearch: null,
      regeoCode:null
    }
  },
  props:{
    inner: {type:Boolean,default:false}

  },
  methods: {
    open(){
      this.createMap()
    },
    querySearch(queryString,cb){
      if (this.autoComplete){
        new Promise((resolve,reject)=>{
          this.autoComplete.search(queryString,function (status,result){
            resolve(result)
          })
        }).then((result)=>{
          console.log(result)
          let searchTips = []
          result.tips.forEach((item)=>{
            console.log(item)
            searchTips.push({value:item.name,address:item.address,adcode:item.adcode})
          })
          cb(searchTips)
        }).catch(error=>{
        })
      }
    },
    handleSelect(item){
      if (this.placeSearch){
        console.log(item +"search")
        this.placeSearch.setCity(item.adcode)
        this.placeSearch.search(item.value,function (status,result){
          console.log(result)
        });
      }
    },
    createMap(){
      AMapLoader.load({
        "key": "dc8d43195a9537784f3d935c4946777a",              // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": ['AMap.ToolBar','AMap.Scale','AMap.PlaceSearch','AMap.AutoComplete','AMap.ControlBar','AMap.Geocoder'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {             // 是否加载 AMapUI，缺省不加载
          "version": '1.1',   // AMapUI 缺省 1.1
          "plugins":[],       // 需要加载的 AMapUI ui插件
        },
      }).then((AMap)=>{
        let map = new AMap.Map('map-container',{ // container为容器的id
          zoom: 12, //初始化地图层级
        });
        if (this.flag === this.$store.state.common.DIALOGPICK) {
          map.on('click', (e) => {
            if (this.marker) {
              this.marker.setMap(null);
              this.marker = null;
            }
            console.log(e)
            this.marker = new AMap.Marker({
              position: [e.lnglat.getLng(), e.lnglat.getLat()],
              // offset: new AMap.Pixel(-13, -30)
            });
            this.marker.setMap(map);
            this.address.targetLat = e.lnglat.getLat()
            this.address.targetLng = e.lnglat.getLng()
            this.getAddressBylnglat(e.lnglat)
          });
        }
        this.autoComplete = new AMap.AutoComplete();
        this.placeSearch = new AMap.PlaceSearch({map});
        this.regeoCode = new AMap.Geocoder()
        if (this.flag === this.$store.state.common.DIALOGSHOW){
          map.setCenter([this.address.targetLng,this.address.targetLat],true)
          map.add(new AMap.Marker({
            position:map.getCenter()
          }));
          this.getAddressBylnglat(map.getCenter())
        }
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.ToolBar())
        map.addControl(this.regeoCode)
        map.addControl(this.autoComplete)
        map.addControl(this.placeSearch)
      }).catch(e => {
        console.log(e);
      })
    },

    pickMapDialog(){
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGPICK
      this.dialogTitle = '选取坐标'
      this.addressBoxCardTitle = '选取该地点?'
    },
    showMapDialog(address) {
      this.dialogFormVisible = true
      this.flag = this.$store.state.common.DIALOGSHOW
      this.dialogTitle = '地址信息'
      this.addressBoxCardTitle = '地址详情'
      Object.assign(this.address,address)
      // this.address.targetLng = parseFloat(this.address.targetLng)
      // this.address.targetLat = parseFloat(this.address.targetLat)
      this.address.targetLng = parseInt(address.targetLng);
      this.address.targetLat = parse(address.targetLat);
    },
    getAddressBylnglat(lnglat){
      if (this.regeoCode){
        this.regeoCode.getAddress(lnglat,(status,result)=>{
          if (status === 'complete'&&result.regeocode) {
            console.log(result.regeocode)
            this.address.targetAddress = result.regeocode.formattedAddress
            this.address.targetAreaCode = parseInt(result.regeocode.addressComponent.adcode)
            this.address.targetProvinceCode =  parseInt(result.regeocode.addressComponent.adcode/10000)*10000
            this.address.targetCityCode = parseInt(result.regeocode.addressComponent.adcode/10)*10
          }
        })
      }
    },
    confirm() {
      this.dialogFormVisible = false
      this.$emit('PickComplete',this.address)
    },
    cancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style  lang="scss" scoped>
//dialog 默认样式修改

::v-deep .el-dialog {
  width: 550px;
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
    #map-container{
      width: 548px;
      height: 400px;
    }
    .search{
      position: absolute;
      top: 40px;
      left: 8px;
      #location-input{
        width: 200px;
        transition: all 1s;
        &:focus{
          width: 300px;
        }
      }
    }
    .box-card{
      position: absolute;
      width: 30%;
      top: 40px;
      right: 18px;
      .el-card__header{
        font-size: 14px;
        padding: 10px;
        .clearfix{
         > span{
           display: inline-block;
           padding-top: 3px;
         }
        }
      }
      .el-card__body{
        padding: 10px;
        line-height: 1.3em;
        .text{
          p{
            font-size: 12px;
          }
          span{
            font-size: 12px;
            color: #20a0ff;
          }
        }

      }
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

<!--修改dialog的全局样式-->
<style>

</style>
