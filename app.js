//app.js
var e = require("utils/core.js");
App({
  onLaunch: function () {
    var e = this.getCache("userinfo");
    ("" == e || e.needauth) && this.getUserInfo(function (e) { }, function (e, t) {
      var t = t ? 1 : 0,
        e = e || "";
      //页面重定向
      t && wx.redirectTo({
        url: "/pages/message/auth/index?close=" + t + "&text=" + e
      })
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
        e.post("wxapp/login", {
          code: o.code
        }, function (o) {
          console.log('app.js/login===============================');
          console.log(o.openid);
          n.globalData.openid = o.openid;
          n.globalData.session_key = o.session_key;
          var that = this;
          return o.error ? void e.alert("获取用户登录态失败:" + o.message) : o.isclose && i && "function" == typeof i ? void i(o.closetext, true) : void wx.getUserInfo({
            success: function (i) {
              console.log('app.js/wx.getUserInfo success================');
              console.log(i);
              a = i.userInfo,
                e.get("wxapp/auth", {
                  data: i.encryptedData,
                  iv: i.iv,
                  sessionKey: o.session_key
                }, function (e) {
                  console.log('app.js/wxapp/auth===================');
                  console.log(e);
                  n.judgeUserIsBunding(o.openid);
                  i.userInfo.openid = e.openId,
                    i.userInfo.id = e.id,
                    i.userInfo.uniacid = e.uniacid,
                    i.needauth = 0,
                    n.setCache("userinfo", i.userInfo, 7200),
                    t && "function" == typeof t && t(a)
                })
            },
            fail: function () {
              console.log('app.js/wx.getUserInfo fail================');
              console.log(o.openid);
              e.get("wxapp/check", {
                openid: o.openid
              }, function (e) {
                // var flag = e.openid.lastIndexOf('sns_wa_');
                // var openId = e.openid.substring(flag + 7, e.openid.length);
                // e.openid = openId;
                console.log('app.js/wxapp/check======================')
                console.log(`e.openid:${e.openid}`);
                console.log(`o.openid:${o.openid}`);
                n.judgeUserIsBunding(o.openid);
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
  getSet: function () {
    var t = this;
    "" == t.getCache("sysset") && setTimeout(function () {
      var i = t.getCache("cacheset");
      e.get("cacheset", {
        version: i.version
      }, function (e) {
        e.update && t.setCache("cacheset", e.data),
          t.setCache("sysset", e.sysset, 7200)
      })
    }, 10)
  },
  url: function (e) {
    e = e || {};
    var t = {},
      i = "",
      n = "",
      a = this.getCache("usermid");
    i = e.mid || "",
      n = e.merchid || "",
      "" != a ? ("" != a.mid && void 0 !== a.mid || (t.mid = i), "" != a.merchid && void 0 !== a.merchid || (t.merchid = n)) : (t.mid = i, t.merchid = n),
      this.setCache("usermid", t, 7200)
  },
  judgeUserIsBunding: function (openid) {
    console.log('app.js/judgeUserIsBunding begin===================');
    console.log(`judgeUserIsBunding传入的:${openid}`);
    e.get("wxapp/judge", {
      openid: openid
    }, function (a) {
      console.log('app.js/wxapp/judge===================');
      console.log(a);
      if (a.error == 92000) {
        // n.globalData.bundingFlag = true;
        console.log('index已绑定');
        wx.showToast({
          title: '手机号已绑定',
          icon: 'none',
          duration: 1000
        })
      } else {
        // n.globalData.bundingFlag = false;
        console.log('index没有绑定');
        wx.reLaunch({
          url: '/pages/index/bunding/index',
        })
      }
    })
  },
  globalData: {
    appid: "wxf89184dcfe85875a",
    api: "https://core.kachuo.com/app/ewei_shopv2_api.php?i=5",
    approot: "$https://core.kachuo.com/addons/ewei_shopv2/",
    userInfo: null,
    openid:null,
    session_key:null,
    encryptedData:null,
    iv:null
  }
})