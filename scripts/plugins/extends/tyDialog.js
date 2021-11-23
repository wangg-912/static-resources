/**
 * @author wanggang
 * @date 2018/8/23
 * @version 0.0.1
 * @description 弹窗组件配合dialog使用
 */
;(function () {
    'use strict'

    function setup($) {
        /**
         * 弹窗初始化
         * @param jq
         */
        function init(jq) {
            var options = jq.data("tyDialog").options;
            // 定义窗体
            var panel = $("<div id=\"panel_" + options.dialogId + "\"></div>").appendTo(jq);
            var $iframe = $('<iframe></iframe>').attr({
                id: options.iframeId,
                name: options.iframeId,
                frameborder: 0,
                scrolling: 'no'
            }).css({
                width: '100%',
                height: '98.8%'
            }).appendTo(panel);

            var btns = [];
            // 默认按钮
            if (!options.buttons || _.isString(options.buttons)) {
                btns.unshift({
                    id: options.dialogId + "_btn_dialogOk",
                    text: '确定',
                    cls: "btn-primary",
                    handler: function () {
                        var $btn = $(this);
                        $btn.attr("disabled", true);
                        var timer = setTimeout(function () {
                            $btn.removeAttr("disabled");
                            clearTimeout(timer)
                            timer =null;
                        },1500)
                        if (window.frames[options.iframeId].dialogOk) {
                            window.frames[options.iframeId].dialogOk();
                        } else if (window.frames[options.iframeId].contentWindow["dialogOk"]) {
                            window.frames[options.iframeId].contentWindow["dialogOk"]();
                        }
                    }
                });
                btns.unshift({
                    id: options.dialogId + "_btn_dialogCancel",
                    text: '取消',
                    handler: function () {
                        if (window.frames[options.iframeId].dialogCancel) {
                            window.frames[options.iframeId].dialogCancel();
                        } else if (window.frames[options.iframeId].contentWindow["dialogCancel"]) {
                            window.frames[options.iframeId].contentWindow["dialogCancel"]();
                        }
                    }
                });
            }
            // 自定义按钮
            else if (options.buttons && options.buttons.length > 0) {
                $.each(options.buttons, function (i, n) {
                    btns.push({
                        id: options.dialogId + "_btn_" + n.funcName,
                        iconCls: (n.iconCls == undefined || n.iconCls == null) ? "" : n.iconCls,
                        text: n.name,
                        handler: function () {
                            var $btn = $(this);
                            $btn.attr("disabled", true)
                            var timer = setTimeout(function () {
                                $btn.removeAttr("disabled");
                                clearTimeout(timer)
                                timer =null;
                            },1500)
                            if (window.frames[options.iframeId][n.funcName]) {
                                window.frames[options.iframeId][n.funcName]();
                            } else if (window.frames[options.iframeId].contentWindow[n.funcName]) {
                                window.frames[options.iframeId].contentWindow[n.funcName]();
                            }
                        }
                    });
                });
            }
            // 渲染窗体
            panel.dialog({
                iconCls: options.iconCls,
                title: "<em class='ty-dialog-title'>" + options.title + "</em>",
                width: options.width,
                height: options.height + 81,
                minimizable: options.minimizable,
                maximizable: options.maximizable,
                closable: options.closable,
                resizable: false,
                cache: false,
                modal: true,
                onBeforeOpen: function () {
                    var _storage;
                    try {
                        _storage = top.localStorage;
                    } catch (e) {
                        _storage = window.localStorage;
                    }
                    //首页改造前
                    /*var hasSkinTheme = (_storage && _storage.skinNew && _storage.skinNew == "dark") ? true : false;*/
                    //首页改造后
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
                    // else {
                    //     $parent.find(".window-header").removeClass("window-dark")
                    //     $parent.find(".dialog-button").removeClass("button-dark")
                    // }
                },
                onBeforeClose: function () {
                    // 销毁iframe
                    var frame = $("#" + options.iframeId);
                    if (frame.length > 0) {
                        try {
                            frame.src = 'about:blank';
                            frame[0].contentWindow.document.write('');
                            frame[0].contentWindow.clear();
                        } catch (e) {
                        }
                        frame[0].contentWindow.close();
                        frame.remove();
                    }
                    if (!$.support.leadingWhitespace) {
                        try{
                            CollectGarbage();
                        }catch (e){

                        }
                    }
                },
                onClose: function () {
                    closeTyDialog(jq);
                },
                buttons: btns.length == 0 ? null : btns
            });
            if (!(/^(http|https|www)/g.test(options.src))) {
                $iframe.attr("src", options.src);
                if ($iframe[0].attachEvent) {
                    $iframe[0].attachEvent("onload", function (e) {
                        var ifDoc = $iframe[0].contentDocument || {'title': 'error'},
                            ifTitle = (ifDoc.title) && (ifDoc.title.toLowerCase());
                        (ifTitle.indexOf("error") >= 0) && ($iframe[0].src = '/src/404.html?dialogId=' + options.dialogId);
                    });
                } else {
                    $iframe[0].onload = function (e) {
                        var ifDoc = $iframe[0].contentDocument || {'title': 'error'},
                            ifTitle = (ifDoc.title) && (ifDoc.title.toLowerCase());
                        (ifTitle.indexOf("error") >= 0) && ($iframe[0].src = '/src/404.html?dialogId=' + options.dialogId);

                    };
                }
            } else {
                $iframe.attr("src", options.src);
            }
        };

        /**
         * 显示按钮
         * @param jq
         * @param funcName
         */
        function showButton(jq, funcName) {
            var options = jq.data("tyDialog").options;
            $("#" + options.dialogId + "_btn_" + funcName).show();
        };

        /**
         * 隐藏按钮
         * @param jq
         * @param funcName
         */
        function hideButton(jq, funcName) {
            var options = jq.data("tyDialog").options;
            $("#" + options.dialogId + "_btn_" + funcName).hide();
        };

        /**
         * 标题重命名
         * @param jq
         * @param title
         */
        function renameTitle(jq, title) {
            var options = jq.data("tyDialog").options;
            $("#panel_" + options.dialogId).dialog("setTitle", title);
        };

        /**
         * 按钮重命名
         * @param jq
         * @param funcName
         * @param buttonName
         */
        function renameButton(jq, funcName, buttonName) {
            var options = jq.data("tyDialog").options;
            $("#" + options.dialogId + "_btn_" + funcName).linkbutton({
                text: buttonName
            });
        };

        /**
         * 关闭对话框
         * @param jq
         * @param params
         */
        function closeTyDialog(jq, params) {
            var options = jq.data("tyDialog").options;
            // 校验
            if (options.validator.length > 0) {
                try {
                    for (var i = 0, a = options.validator, len = a.length; i < len; i++) {
                        if (_.isFunction(a[i]) && !a[i](params)) {
                            return;
                        }
                    }
                } catch (e) {
                }
            }
            // 销毁
            $("#panel_" + options.dialogId).dialog("destroy");
            // 回调
            if (options.callback.length > 0) {
                try {
                    for (var j = 0, b = options.callback, size = b.length; j < size; j++) {
                        if (_.isFunction(b[j]) && !b[j](params)) {
                        }
                    }
                } catch (e) {
                }
            }
            $(jq).remove();
        };

        /**
         * 重置对话框大小
         * @param jq
         * @param params
         */
        function resizeTyDialog(jq, params) {
            var setting = $.extend({}, params, {
                top: parseInt(($(window).outerHeight() - params.height) / 2),
                left: parseInt(($(window).outerWidth() - params.width) / 2)
            });
            var options = jq.data("tyDialog").options;
            $("#panel_" + options.dialogId).dialog("resize", setting);
        };

        /**
         * 获取传入参数
         * @param jq
         * @returns {*}
         */
        function getInData(jq) {
            var options = jq.data("tyDialog").options;
            return options.indata;
        }

        /**
         * 弹窗主体方法
         * @param options
         * @param params
         * @returns {*}
         */
        $.fn.tyDialog = function (options, params) {
            if (typeof options == "string") {
                return $.fn.tyDialog.methods[options](this, params);
            }
            options = options || {};
            var datas = this.data("tyDialog");
            if (datas) {
                $.extend(datas.options, options);
            } else {
                this.data("tyDialog", {
                    options: $.extend({}, $.fn.tyDialog.defaults, $.fn.tyDialog.parseOptions(this, options))
                });
            }
            init(this);
            return this;
        };
        /**
         * 弹窗预处理机制
         * @param jq
         * @param options
         * @returns {*}
         */
        $.fn.tyDialog.parseOptions = function (jq, options) {
            var randomInt = parseInt(100000 + Math.random() * 100000);
            var dialogId = "dialog_" + randomInt;
            jq.attr("id", dialogId);
            return $.extend({}, options, {
                dialogId: dialogId,
                iframeId: "iframe_" + randomInt,
                src: (options.src.indexOf('?') == -1 ? options.src + '?dialogId=' + dialogId : options.src + '&dialogId=' + dialogId),
                validator: _.isArray(options.validator) ? options.validator : [options.validator],
                callback: _.isArray(options.callback) ? options.callback : [options.callback]
            });
        };
        /**
         * 扩展方法
         * @type {{getInData: (function(*=): *), showButton: $.fn.tyDialog.methods.showButton, hideButton: $.fn.tyDialog.methods.hideButton, renameTitle: $.fn.tyDialog.methods.renameTitle, renameButton: $.fn.tyDialog.methods.renameButton, close: $.fn.tyDialog.methods.close, resize: $.fn.tyDialog.methods.resize}}
         */
        $.fn.tyDialog.methods = {
            getInData: function (jq) {
                return getInData(jq);
            },
            showButton: function (jq, funcName) {
                showButton(jq, funcName);
            },
            hideButton: function (jq, funcName) {
                hideButton(jq, funcName);
            },
            renameTitle: function (jq, title) {
                renameTitle(jq, title);
            },
            renameButton: function (jq, params) {
                if ("funcName" in params && "buttonName" in params) {
                    renameButton(jq, params.funcName, params.buttonName);
                }
            },
            close: function (jq, params) {
                closeTyDialog(jq, params);
            },
            resize: function (jq, params) {
                resizeTyDialog(jq, params);
            }
        };
        /**
         * 配置项管理
         * @type {{dialogId: string, iframeId: string, title: string, src: string, indata: null, width: number, height: number, iconCls: string, buttons: string, minimizable: boolean, maximizable: boolean, closable: boolean, validator: Array, callback: Array}}
         */
        $.fn.tyDialog.defaults = {
            dialogId: "",
            iframeId: "",
            title: "",
            indata: null,
            width: 600,
            height: 400,
            iconCls: '',
            buttons: "default",
            minimizable: false,
            maximizable: false,
            closable: true,
            validator: [],
            callback: []


        };
    }

    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }
})();