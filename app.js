//app.js
const defaultTime = {
    defaultsleepTime: 3,
  }
  
  App({
      onLaunch: function() {
        let sleepTime = wx.getStorageSync('sleepTime')
        if (!sleepTime) {
          wx.setStorage({
            key: 'sleepTime',
            data: defaultTime.defaultsleepTime
          })
        }
      }
    })

    