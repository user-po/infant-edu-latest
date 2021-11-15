import PlvVideoUpload from '@polyv/vod-upload-js-sdk'
import md5 from 'js-md5'

export var fileSetting = { // 文件上传相关信息设置
  title: '', // 标题
  desc: '', // 描述
  cataid: '', // 上传分类目录ID
  tag: '', // 标签
  luping: 0, // 是否开启视频课件优化处理，对于上传录屏类视频清晰度有所优化：0为不开启，1为开启
  keepsource: 0, // 是否源文件播放（不对视频进行编码）：0为编码，1为不编码
  state: '' // 用户自定义信息，如果提交了该字段，会在服务端上传完成回调时透传返回。
}

export function setFileSetting(title, desc, cataid, tag, luping, keepsource, state) {
  fileSetting.title = title
  fileSetting.desc = desc
  fileSetting.cataid = cataid
  fileSetting.tag = tag
  fileSetting.luping = luping
  fileSetting.keepsource = keepsource
  fileSetting.state = state
}

// 此方法主要用于加密一些保利威的专用参数 如果是后端传递的 可以打掉
function getToken(videoUpload) {
  const ptime = Date.now()
  const userid = '04210852c0'
  const secretkey = '8YVpMlpreJ'
  const writeToken = '089fa07f-fbdc-4056-9722-5ffd2a7e2b68'
  const hash = md5(ptime + writeToken)
  const sign = md5(secretkey + ptime)
  videoUpload.updateUserData({ ptime, hash, sign, userid })
}

// 由于保利威的一些机制 你需要三分钟就重新加密你的 ptime 如果你打掉了就不行
function autoUpdateUserData(timer, videoUpload) {
  getToken(videoUpload)
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  timer = setTimeout(() => {
    autoUpdateUserData(timer, videoUpload)
  }, 3 * 50 * 1000)
}

/**
 * @Date: 2021/3/26
 * @param: files -> 一个文件的数组 注意 是【数组】
 * @param: fileSetting -> 主要是用来传递给保利威的属性
 * @param: callback -> 上传进度，成功，失败 的回调 tips：回调太多 我就拿了这三个比较有用的
 */
export function uploadFile(file, fileSetting, callback) {
  const videoUpload = new PlvVideoUpload()
  autoUpdateUserData(null, videoUpload)
  const uploader = videoUpload.addFile(file, {
    // 上传视频进度的回调
    FileProgress: ({ progress }) => {
      const progressSize = (progress * 100).toFixed(2)
      callback.progress(progressSize)
      // console.log('开始上传')
      // console.log(progressSize)
    },
    // 上传视频成功的回调
    FileSucceed: ({ fileData }) => {
      callback.success(fileData)
      // console.log('上传成功')
    },
    // 上传视频失败的回调
    onFileFailed: ({ errData }) => {
      callback.error(errData)
      // console.log('上传失败')
    }
  }, fileSetting)

  /**
   * 这里的调用是上传全部
   * 本来我也是一个一个调的
   * 但是考虑到对于有多选上传的童鞋不是很友好
   * 就无论你传递几个视频 这里都统一一起上传
   * */
  videoUpload.startAll()
}
