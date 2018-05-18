// pages/index/bunding/index.js
var t = getApp(),
  a = t.requirejs("core"),
  e = (t.requirejs("icons"), t.requirejs("wxParse/wxParse"));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHoldVal: '获取验证码',
    inputValue: '',
    phoneNumIsLegal: false,
    btnDisabled: false,
    time: 60,
    timerData: null,
    codeValue: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 清除input框的值
  clearInputVal:function(){
    this.setData({
      inputValue:'',
      codeValue:''
    })
  },
  // 初始化数据
  initData() {
    clearInterval(this.data.timerData);
    this.setData({
      time: 60,
      phoneNumIsLegal: false,
      btnDisabled: false,
      placeHoldVal:'获取验证码'
    })
  },
  // 获取输入验证码
  bindCodeInput: function (e) {
    this.setData({
      codeValue: e.detail.value
    })
  },
  // 跳转请求
  jumpToGoodList: function () {
    if (this.data.inputValue && this.data.codeValue){
      a.get("wxapp/veri", {
        tel: Number(this.data.inputValue),
        code: Number(this.data.codeValue)
      }, function (res) {
        console.log(res);
        if (res.error == 0) {
          t.globalData.bundingFlag = true;
          wx.reLaunch({
            url: '../bundingSuccess/bundingSuccess',
          })
        } else if (res.error == 90001) {
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 1000
          })
        } else if (res.error == 90021) {
          wx.showToast({
            title: '手机号有误',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else if (!this.data.inputValue){
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
    } else if (!this.data.codeValue){
      wx.showToast({
        title: '验证码有误',
        icon: 'none',
        duration: 1000
      })
    }else{
      return;
    }
  },
  // 倒计时
  changeTime: function () {
    var time = this.data.time;
    if (time > 0) {
      time--;
      this.setData({
        time: time,
        placeHoldVal: time + 's'
      });
    } else {
      clearInterval(this.data.timerData);
      this.setData({
        placeHoldVal: '获取验证码',
        btnDisabled: false
      })
    }
  },
  // 验证码请求
  getData() {
    var phoneNum = Number(this.data.inputValue);
    console.log(getApp().globalData);
    a.get("wxapp/generate", {
      tel: phoneNum,
      openid: getApp().globalData.openid
    }, function (a) {
      console.log(a);
      console.log('手机号已发送');
    })
  },
  // 验证手机格式并设置倒计时
  getVerificationCode: function () {
    console.log('发送验证码');
    console.log(getApp().globalData.openid);
    var regExp = /^[1][3,4,5,7,8][0-9]{9}$/;
    this.initData();
    if (regExp.test(this.data.inputValue)) {
      this.setData({
        phoneNumIsLegal: true,
        btnDisabled: true
      });
      wx.showToast({
        title: '验证码已发送',
        icon: 'none',
        duration: 1000
      })
      this.getData();
      var timer = setInterval(() => {
        this.changeTime();
      }, 1000);
      this.setData({
        timerData: timer
      })
    } else {
      this.initData();
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 获取input框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 获取用户信息
  bindGetUserInfo: function (e) {
    console.log(e);
    t.globalData.encryptedData = e.detail.encryptedData;
    t.globalData.iv = e.detail.iv;
    t.globalData.userInfo = e.detail.userInfo;
    console.log(t.globalData);
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '綁定手机号'
    })
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
    this.initData();
    this.clearInputVal();
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