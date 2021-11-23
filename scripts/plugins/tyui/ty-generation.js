/**
 * @author wanggang
 * @version 1.0
 * @description 功能调用方法接口
 */
define(["tyBase","tyUtil","tyDialog","/src/scripts/plugins/js/throttle.js"],function (tB,util,dialog) {
    var iframePopupTemplate_func = _.template("<iframe id=\"<%=iframeId %>\" name=\"<%=iframeId %>\" src=\"<%=src %>\" style=\"width:<%=width %>;height:<%=height %>;position:<%=position %>;top:<%=top %>;left:<%=left %>;border:<%=border %>;z-index:<%=zindex %>;visibility:<%=visibility %>;background-color: transparent;\"  allowtransparency=\"true\" frameBorder=\"0\" scrolling=\"no\"></iframe>");
    var ty = {
        //================================
        // 全局提示含消息和提示
        //===============================
        /**
         * @param opts
         * opts duration {number| s} 播放时间 单位秒
         * opts type {string info|error|success|waring} 消息类型
         * opts text {string} 消息文本
         * @returns {*|void}
         */
        message:function(opts){
            return $.message(opts);
        },
        /**
         * @param opts
         * opts isAutoClose {boolean} 是否自动播放
         * opts duration {number | s} 播放时间，依赖isAutoClose为true有效 单位s
         * opts type {string  info|error|success|waring }
         * opts title {string} 提示头信息
         * opts message {string} 提示正文
         * @returns {*|void}
         */
        simpleAlert:function(opts){
            return $.simpleAlert(opts);
        },
        // =====================================================================================================================
        // 弹出提示
        // =====================================================================================================================
        /**
         * 创建确认框
         *
         * @param {} content 内容
         * @param {} callback_yes 确认回调 （可省略）
         * @param {} callback_no 取消回调 （可省略）
         */
        createTopConfirm:function (opts) {
            var param = {
                title:$.fn.__ty__.title.confirm,
                msg:opts.content,
                onBeforeOpen :function(){
                    /*var isDark = (top.localStorage && top.localStorage.skinNew && top.localStorage.skinNew == "dark") ? true : false;
                    isDark ? $(this).parent().find(".window-header").addClass("window-dark") : $(this).parent().find(".window-header").removeClass("window-dark")*/
                    //首页改造后
                    var _storage;
                    try {
                        _storage = top.localStorage;
                    } catch (e) {
                        _storage = window.localStorage;
                    }
                    var hasSkinTheme = (_storage && _storage.getItem('skinTheme')) ? true : false;
                    var $parent = $(this).parent();

                    if (hasSkinTheme) {
                        var skinTheme =  _storage.getItem('skinTheme');
                        $parent.find(".window-header").addClass("window-"+ skinTheme);
                        var timer = setTimeout(function () {
                            $parent.find(".dialog-button").addClass("button-"+skinTheme);
                            clearTimeout(timer);
                            timer = null;
                        }, 0)
                    }
                },
				closable: opts.closable,
                fn:function(r) {
                    if (r) {
                        opts.callback_yes != null ? opts.callback_yes() : false;
                    } else {
                        opts.callback_no != null ? opts.callback_no() : false;
                    }
                }
            };
            param['ok'] = opts && opts.ok;
            param['cancel'] =opts && opts.cancel;
            window.top.$.messager.confirm(param);
        },
        /**
         * 创建提示框
         *
         * @param {} content 内容
         * @param {} icon 图标 （error,warning,ok 对应 【错误】【提示】【成功】）
         * @param {} callback 回调 （可省略）
         */
        createTopAlert:function (options) {
            if (options.icon == null || options.icon == '') {
                options.icon = 'warning';
            }
            var title;
            switch (options.icon) {
                case 'ok' :
                    title = $.fn.__ty__.title.success;
                    break;// 成功
                case 'warning' :
                    title = $.fn.__ty__.title.tip;
                    break;// 提示
                case 'error' :
                    title = $.fn.__ty__.title.error;
                    break;// 错误
                default :
                    break;
            }
            window.top.$.messager.alert(title, options.content, options.icon,options.callback);
        },
        /**
         * /** 创建居中自定关闭提示框
         *
         * @param {} content 内容
         * @param {} timeout 消失时间
         * @param {} type 类型 ok/warning/error : 成功/提示/错误
         * @param {} height 高度
         */
        createAutoAlert:function (opts) {
            var title;
            switch (opts.type) {
                case 'ok' :
                    title = $.fn.__ty__.title.success;
                    break;// 成功
                case 'warning' :
                    title = $.fn.__ty__.title.tip;
                    break;// 提示
                case 'error' :
                    title = $.fn.__ty__.title.error;
                    break;// 错误
                default :
                    title = $.fn.__ty__.title.tip;
                    break;// 提示
            }
            var setting = {
                title : "<span style='color: #fff'>"+title+"</span>",
                //icon: opts.type || "info",
                msg : opts.content,
                timeout : opts.timeout,
                showType : 'none',
                style:{
                    right:'',
                    bottom:''
                }
            };
            if (opts.height != undefined && opts.height != null) {
                setting.height = opts.height;
            }
            window.top.$.messager.show(setting);
        },
        /**
         * /** 创建右下角提示框
         *
         * @param {} content 内容
         * @param {} timeout 消失时间
         * @param {} type 类型 ok/warning/error : 成功/提示/错误
         * @param {} height 高度
         */
        createRightBottomShow:function (opts) {
            var title;
            switch (opts.type) {
                case 'ok' :
                    title = $.fn.__ty__.title.success;
                    break;// 成功
                case 'warning' :
                    title = $.fn.__ty__.title.tip;
                    break;// 提示
                case 'error' :
                    title = $.fn.__ty__.title.error;
                    break;// 错误
                default :
                    title = $.fn.__ty__.title.tip;
                    break;// 提示
            }
            var setting = {
                title : title,
                //icon: opts.type || "info",
                msg : opts.content,
                timeout : opts.timeout,
                showType : 'slide'
            };
            if (opts.height != undefined && opts.height != null) {
                setting.height = opts.height;
            }
            window.top.$.messager.show(setting);
        },
        /**
         * 创建进度条
         *
         * @param {} msg 内容消息
         * @param {} text 进度条上消息,若不设置则显示百分比
         * @return {} 返回 进度条对象
         */
        createTopProgress:function (msg, text) {
            var win = window.top.$.messager.progress({
                title : $.fn.__ty__.title.progress,
                msg : msg,
                text : text == null ? undefined : text,
                interval : null
            });
            var progress = new Object();
            /** 获取进度值 */
            progress.getValue = function() {
                return win.find("div.messager-p-bar").progressbar("getValue");
            }
            /** 设置进度值 */
            progress.setValue = function(v) {
                win.find("div.messager-p-bar").progressbar("setValue", v);
            }
            /** 关闭进度条 */
            progress.close = function() {
                window.top.$.messager.progress('close');
            }
            return progress;
        },
        // =====================================================================================================================
        // 弹窗
        // =====================================================================================================================
        /**
         * 创建iframe的弹窗
         *
         * @param options 参数对象
         * @description {title:标题, src:内容地址, indata:传入参数, width:弹窗宽, height:弹窗高, buttons:按钮对象数组, minimizable:是否最小化, maximizable:是否最大化,callback: 回调函数}
         * @description buttons 按钮对象数组{iconCls: 按钮图标css类, name:按钮名称, funcName: 按钮点击事件方法名} 不写则默认2个按钮，为空则无按钮
         */
        createIframeDialog:function (options) {
            $('body').attr("tabindex","0");
            $('body').focus();
            var dialog;
            options = $.extend({
                callpage : $("body")
            }, options);
            try{
                dialog = window.top.$("<div></div>").appendTo($(window.top.document.body));
            }catch (e) {
                dialog = $("<div></div>").appendTo($(window.document.body));
            }
            dialog.tyDialog(options);
        },
        /**
         * 重置弹窗大小
         *
         * @param {} dialogId
         * @param {} options : {width: 600,height: 400});
         */
        resizeIframeDialog:function (dialogId, options) {
            if (dialogId != undefined && dialogId != null) {
                try{
                    window.top.$("#" + dialogId).tyDialog("resize", options);
                }catch (e) {
                    $("#" + dialogId).tyDialog("resize", options);
                }

            }
        },
        /**
         * 获取传入弹窗数据
         *
         * @param {} dialogId
         * @return {}
         */
        getDataFromIframeDialog:function (dialogId) {
            if (dialogId != undefined && dialogId != null) {
                var Indatas = null;
                try{
                    Indatas = window.top.$("#" + dialogId).tyDialog("getInData");
                }catch (e) {
                    Indatas = window.parent.$("#" + dialogId).tyDialog("getInData");
                }
                return Indatas
            } else {
                return null
            }
        },
        /**
         * 关闭iframe的弹窗
         *
         * @param {} dialogId 弹窗Id （从request中获取dialogId参数；）
         * @param {} callbackdata 回调参数 （可省略）
         */
        closeIframeDialog:function (dialogId, callbackdata) {
            if (dialogId != undefined && dialogId != null) {
                try{
                    window.top.$("#" + dialogId).tyDialog("close", callbackdata);
                }catch (e) {
                    window.parent.$("#" + dialogId).tyDialog("close", callbackdata);
                }
            }
        },
        /**
         * 显示iframe的弹窗按钮
         *
         * @param {} dialogId 弹窗Id （从request中获取dialogId参数；）
         * @param {} funcName 需要显示的按钮对应点击事件方法名
         */
        showIframeDialogButton:function (dialogId, funcName) {
            if (dialogId != undefined && dialogId != null) {
                try{
                    window.top.$("#" + dialogId).tyDialog("showButton", funcName)
                }catch (e) {
                    $("#" + dialogId).tyDialog("showButton", funcName)
                }
            }
        },
        /**
         * 隐藏iframe的弹窗按钮
         *
         * @param {} dialogId 弹窗Id （从request中获取dialogId参数；）
         * @param {} funcName 需要隐藏的按钮对应点击事件方法名
         */
        hideIframeDialogButton:function (dialogId, funcName) {
            if (dialogId != undefined && dialogId != null) {
                try {
                    window.top.$("#" + dialogId).tyDialog("hideButton", funcName);
                }catch (e) {
                    $("#" + dialogId).tyDialog("hideButton", funcName);
                }
            }
        },
        /**
         * 重命名iframe的弹窗按钮
         *
         * @param {} dialogId 弹窗Id （从request中获取dialogId参数；）
         * @param {} funcName 需要重命名的按钮对应点击事件方法名
         * @param {} buttonName 新名称
         */
        renameIframeDialogButton:function (dialogId, funcName, buttonName) {
            if (dialogId != undefined && dialogId != null) {
                try {
                    window.top.$("#" + dialogId).tyDialog("renameButton", {
                        funcName: funcName,
                        buttonName: buttonName
                    });
                }catch (e) {
                    $("#" + dialogId).tyDialog("renameButton", {
                        funcName: funcName,
                        buttonName: buttonName
                    });
                }
            }
        },
        /**
         * 重命名iframe的弹窗标题
         *
         * @param {} dialogId 弹窗Id （从request中获取dialogId参数；）
         * @param {} title 新标题
         */
        renameIframeDialogTitle:function (dialogId, title) {
            if (dialogId != undefined && dialogId != null) {
               try{
                   window.top.$("#" + dialogId).tyDialog("renameTitle", title);
               }catch (e) {
                   $("#" + dialogId).tyDialog("renameTitle", title);
               }
            }
        },

        /** 获取Iframe的全名 */
        getIframeFullName:function (win, suf) {
            if (win.parent != win && win.name != "") {
                suf = (suf == "" || suf == undefined) ? win.name : win.name + "." + suf;
                return getIframeFullName(win.parent, suf);
            } else {
                return suf;
            }
        }
    };
    window.ty = ty;
    return ty;
})



