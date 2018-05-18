//index.js
var t = getApp(),
  a = t.requirejs("core"),
  e = (t.requirejs("icons"), t.requirejs("wxParse/wxParse"));
var p = require("../../utils/core.js");
Page({
  data: {
    route: "home",
    icons: t.requirejs("icons"),
    shop: {},
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    storeRecommand: [],
    total: 0,
    page: 1,
    loaded: false,
    loading: true,
    indicatorDotsHot: false,
    autoplayHot: true,
    intervalHot: 5000,
    durationHOt: 1000,
    circularHot: true,
    hotimg: "/static/images/hotdot.jpg",
    notification: "/static/images/notification.png"
  },
  scanCode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: (res) => {
        console.log(res.result);
        wx.navigateTo({
          url: '../index/scanCodeResult/scanCodeResult?url=' + res.result,
        })
      },
      fail: (res) => {
        console.log(res)
      },
      complete: (res) => {
        console.log(res)
      },
    })
  },
  requirejs: function (e) {
    return require("utils/" + e + ".js")
  },
  getCache: function (e, t) {
    var i = +new Date / 1000,
      n = "";
    i = parseInt(i);
    try {
      n = wx.getStorageSync(e + this.globalData.appid),
        n.expire > i || 0 == n.expire ? n = n.value : (n = "", this.removeCache(e))
    } catch (e) {
      n = void 0 === t ? "" : t
    }
    return n = n || ""
  },
  setCache: function (e, t, i) {
    var n = +new Date / 1000,
      a = true,
      o = {
        expire: i ? n + parseInt(i) : 0,
        value: t
      };
    try {
      wx.setStorageSync(e + this.globalData.appid, o)
    } catch (e) {
      a = false
    }
    return a
  },
  removeCache: function (e) {
    var t = true;
    try {
      wx.removeStorageSync(e + this.globalData.appid)
    } catch (e) {
      t = false
    }
    return t
  },
  getUserInfo: function (t, i) {
    var n = this,
      a = n.getCache("userinfo");
    if (a && !a.needauth)
      return void (t && "function" == typeof t && t(a));
    wx.login({
      success: function (o) {
        if (!o.code)
          return void e.alert("获取用户登录态失败:" + o.errMsg);
        p.post("wxapp/login", {
          code: o.code
        }, function (o) {
          console.log('index.js/login')
          console.log(o);
          getApp().globalData.userInfo = o;
          return o.error ? void e.alert("获取用户登录态失败:" + o.message) : o.isclose && i && "function" == typeof i ? void i(o.closetext, true) : void wx.getUserInfo({
            success: function (i) {
              console.log(i);
              console.log('wx.getUserInfo success');
              a = i.userInfo,
                p.get("wxapp/auth", {
                  data: i.encryptedData,
                  iv: i.iv,
                  sessionKey: o.session_key
                }, function (e) {
                  i.userInfo.openid = e.openId,
                    i.userInfo.id = e.id,
                    i.userInfo.uniacid = e.uniacid,
                    i.needauth = 0,
                    n.setCache("userinfo", i.userInfo, 7200),
                    t && "function" == typeof t && t(a)
                })
            },
            fail: function () {
              p.get("wxapp/check", {
                openid: o.openid
              }, function (e) {
                e.needauth = 1,
                  n.setCache("userinfo", e, 7200),
                  t && "function" == typeof t && t(a)
              })
            }
          })
        })
      },
      fail: function () {
        e.alert("获取用户信息失败!")
      }
    })
  },
  changeBundingState:function(){
    
  },
  judgeUserIsBunding: function () {
    console.log('index/judgeUserIsBunding begin===================');
    console.log(t.globalData.openid);
    a.get("wxapp/judge", {
      openid:t.globalData.openid
    }, function (a) {
      console.log('index/wxapp/judge===================');
      console.log(a);
      if (a.error == 92000) {
        t.globalData.bundingFlag = true;
        console.log('index已绑定');
      }else{
        t.globalData.bundingFlag = false;
        console.log('index没有绑定');
        wx.reLaunch({
          url: '/pages/index/bunding/index',
        })
      }
    })
  },
  getShop: function () {
    var t = this;
    a.get("shop/get_shopindex", {}, function (a) {
      e.wxParse("wxParseData", "html", a.copyright, t, "5"),
        t.setData({
          shop: a
        })
    })
  },
  onReachBottom: function () {
    this.data.loaded || this.data.storeRecommand.length == this.data.total || this.getRecommand()
  },
  getRecommand: function () {
    var t = this;
    t.setData({
      loading: true
    }),
      a.get("shop/get_recommand", {
        page: t.data.page
      }, function (a) {
        var e = {
          loading: false,
          total: a.total
        };
        t.setData({
          loading: false,
          total: a.total,
          show: true
        }),
          a.list || (a.list = []),
          a.list.length > 0 && (t.setData({
            storeRecommand: t.data.storeRecommand.concat(a.list),
            page: a.page + 1
          }), a.list.length < a.pagesize && (e.loaded = true))
      })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (a) {
    // this.getUserInfo();
    t.url(a);
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    // this.judgeUserIsBunding();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.judgeUserIsBunding();
    var a = t.getCache("sysset");
    wx.setNavigationBarTitle({
      title: a.shopname || "商城首页"
    }),
      this.getShop(),
      this.getRecommand()
  },

  onShareAppMessage: function () {
    return a.onShareAppMessage()
  },

  imagesHeight: function (t) {
    var a = t.detail.width,
      e = t.detail.height,
      o = t.target.dataset.type,
      i = {},
      s = this;
    wx.getSystemInfo({
      success: function (t) {
        i[o] = t.windowWidth / a * e,
          (!s.data[o] || s.data[o] && i[o] < s.data[o]) && s.setData(i)
      }
    })
  },
})