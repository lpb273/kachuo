// pages/index/download/download.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  downloadAppAndroid:function(){
    wx.showModal({
      title: '提示',
      showCancel:false,
      content: '复制下载链接  http://imtt.dd.qq.com/16891/D353BC3525D76C276BCA253755130BCE.apk?fsname=com.kachuo.ionic_8.2.2_822000.apk&csr=1bbd  到浏览器打开即可',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  downloadAppIos:function(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '在AppStore中搜索卡戳,点击下载即可',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})