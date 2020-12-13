//首页，设置闹钟
const util = require('../../utils/utill.js')//调用时间，并规范化方便后面运算
const defaultLogName = {
  sleep: '睡眠'
}
const actionName = {
  stop: '停止',
  start: '开始'
}

const initDeg = {
  left: 45,
  right: -45,
}

Page({

  data: {
    remainTimeText: '',//圆形框中显示的文本
    timerType: 'sleep',
    log: {},
    completed: false,//判断倒计时是否走完
    isRuning: false,//判断是否开始倒计时
    leftDeg: initDeg.left,
    rightDeg: initDeg.right,
    sleepTime:0//用户设定的时长
  },
//初始状态
  onShow: function() {
    if (this.data.isRuning) return
    this.setData({
      remainTimeText: "Stitch"
    })
  },
//倒计时开始
  startTimer: function(e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = 'sleep'
    let showTime = this.data.sleepTime
    let keepTime = showTime*60*60* 1000//方便后面进行时分秒的运算
    let logName = this.logName || defaultLogName[timerType]
    if (!isRuning) {
      this.timer = setInterval((function() {//设定一个计时器
        this.updateTimer()//实时显示所剩时间
        this.startNameAnimation()//动画效果
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }
    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00'+':00',
      taskName: logName
    })
    this.data.log = {
      name: logName,
      startTime: Date.now(),//开始时间
      keepTime: keepTime,
      endTime: keepTime + startTime,//结束时间
      action: actionName[isRuning ? 'stop' : 'start'],//开始or结束
      type: timerType
    }
    this.saveLog(this.data.log)
  },
//动画效果
  startNameAnimation: function() {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },
//计时停止
  stopTimer: function() {
    // 重置进度条
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right,
      remainTimeText: "Stitch"
    })
    // 重置计时器
    this.timer && clearInterval(this.timer)
  },

  updateTimer: function() {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)//通过【预计的时间】减【现在的实时时间】得到【所剩的时间】
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')//算出小时数
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')//算出分钟数
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')//算出秒数
    let halfTime
    // 更新文本
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true//状态改为停止
      })
      this.stopTimer()
      wx.vibrateLong()//手机震动提示
      return
    }
    // 更新进度条
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },
//通过输入小时数设定时间
  changesleepTime: function(e) {
    if ((e.detail.value) >=1&&(e.detail.value) <=24){
     　this.setData({
      sleepTime: e.detail.value
     })}//更新小时数
     else if (!(e.detail.value)){
      this.setData({
        sleepTime: 0
       })  
     }//输入框里无内容即为0
     else{
      wx.showModal({
        title: '注意',
        content: '请输入正确的闹钟时间',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
     }//防止用户输入其他内容
  },
//本地储存睡眠记录，传给log页面
  saveLog: function(log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  }
})
