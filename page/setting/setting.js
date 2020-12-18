//智能管家
Page({
  data: {
    swiperH:'',//swiper高度
    nowIdx:0,//当前swiper索引，如果是正被索引的图片便使用leimage的子类le-active样式，不是则直接用leimage这个父类样式
    imgList:[//图片列表
      "/image/1.jpg",
      "/image/2.jpg",
      "/image/3.jpg",
      "/image/4.jpg",
      "/image/5.jpg",
    ]
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '智能管家'
    })
  },
  home1:function(){
      wx.navigateTo({
        url: '/home/home1/home1'
       })
  },
  home2:function(){
    wx.navigateTo({
      url: '/home/home2/home2'
     })
  },
  //获取swiper高度，并使之大小适配屏幕
getHeight:function(e){
  var winWid = wx.getSystemInfoSync().windowWidth - 2*50;//获取当前屏幕的宽度
  var imgh = e.detail.height;//图片高度
  var imgw = e.detail.width;
  var sH = winWid * imgh / imgw + "px"
  this.setData({
    swiperH: sH//设置高度
  })
},
//swiper滑动事件
swiperChange:function(e){
  this.setData({
    nowIdx: e.detail.current
  })
},
})
