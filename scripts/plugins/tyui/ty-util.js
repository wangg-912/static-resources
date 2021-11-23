/**
 * @author wanggang
 * @date 2018/8/12
 * @version 0.0.1
 * @description 工具方法
 */
define(["jquery"],function ($) {
    $.fn.__ty__ = {
        // 标题
        title : {
            tip : "提示",
            error : "错误",
            confirm : "<i style='font-style: normal; color: #fff'>确认</i>",
            success : "成功",
            progress : "请稍后……"
        },
        // 初始化
        init : {
            success : '初始化成功！',
            error : '初始化失败（服务器或网络异常）！'
        },
        // 创建
        create : {
            success : '创建成功！',
            error : '创建失败（服务器或网络异常）！'
        },
        // 添加
        add : {
            success : '添加成功！',
            error : '添加失败（服务器或网络异常）！'
        },
        fileUpload:{
            loading:"文件上传中..."
        },
        // 修改
        modify : {
            init : '初始数据失败！',
            more : '请至少选择一条数据！',
            one : '请选择一条数据！',
            success : '操作成功！',
            error : '操作失败（服务器或网络异常）！'
        },
        // 保存
        save : {
            success : '保存成功！',
            error : '保存失败（服务器或网络异常）！'
        },
        // 查看
        view : {
            one : '请选择一条数据查看',
            onlyOne : '请至少选择一条数据查看'
        },
        // 删除
        del : {
            body : '确认删除吗?',
            check : '已阅读以上信息',
            more : '请至少选择一条数据删除！',
            one : '请选择一条数据删除！',
            success : '删除成功！',
            error : '删除失败（服务器或网络异常）！'
        },
        // 遮罩
        mask : {
            message : "系统处理中……"
        },
        // 验证信息
        error : {
            ip : '请输入有效的IP',
            number : '请输入有效的数字',
            all_str : '输入长度必须介于{0}和{1}之间',
            text_str : '输入内容含字母、数字、"_"、"-"或中文字符，长度必须介于{0}和{1}之间',
            equals : '两次输入的密码不一致',
            unknown: '未知错误，请联系管理员！'
        },
        // 首页顶部
        top : {
            alarm : "通知",
            logout : "退出",
            help : "帮助",
            about : "关于"
        }
    };
    /**
     * 遮罩初始化
     * @param target
     * @param options
     * @returns {*|HTMLElement}
     */
    function init(target, options) {
        var wrap = $(target);
        if ($("div.mask", wrap).length)
            wrap.mask("hide");
        wrap.attr("position", wrap.css("position"));
        wrap.attr("overflow", wrap.css("overflow"));
        wrap.css("position", "relative");
        wrap.css("overflow", "hidden");
        var maskCss = {
            position : "absolute",
            right : 0,
            top : 0,
            cursor : "default",
            background : "#ccc",
            opacity : options.opacity,
            filter : "alpha(opacity=" + options.opacity * 100 + ")",
            display : "none"
        };
        var maskMsgCss = {
            position : "fixed",
            width : "18px",
            height: "18px",
            cursor : "default",
            display : "none",
            background : 'none',
            border :"none",
            opacity : 1,
            filter : "alpha(opacity=100)"
        };
        var width, height, right, top;
        if (target == 'body') {
            width = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
            height = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
        } else {
            width = wrap.outerWidth() || "100%";
            height = wrap.outerHeight() || "100%";
        }
        $('<div class="ty-mask"></div>').css($.extend({}, maskCss, {
            display : 'block',
            width : width,
            height : height,
            zIndex : options.zIndex
        })).appendTo(wrap);
        var maskm = $('<div class="ty-mask-msg"><div class="spinner" role="spinner"><div class="spinner-icon"></div></div></div>').appendTo(wrap).css(maskMsgCss);
        if (target == 'body') {
            right = 15;
            top = options.top || 15;
        } else {
            right = (wrap.width() - $('div.ty-mask-msg', wrap).outerWidth()) / 2;
            top = (wrap.height() - $('div.ty-mask-msg', wrap).outerHeight()) / 2;
        }
        maskm.css({
            display : 'block',
            zIndex : options.zIndex + 1,
            right : right+"px",
            top : top+"px"
        });
        options.top ? maskm.find('.spinner').css("top",options.top+"px") : null;
        $.mask.timer = setTimeout(function() {
            wrap.mask("hide");
            $.mask.timer = null;
        }, options.timeout);
        return wrap;
    }

    /**
     * 元素原型遮罩方法
     * @param options
     * @returns {*}
     */
    $.fn.mask = function(options) {
        if (typeof options == 'string') {
            return $.fn.mask.methods[options](this);
        }
        options = $.extend({}, $.fn.mask.defaults, options);
        return init(this, options);
    };
    /**
     * 不依赖元素的遮罩方法
     * @param options
     * @returns {*}
     */
    $.mask = function(options) {
        if (typeof options == 'string') {
            return $.fn.mask.methods[options]("body");
        }
        options = $.extend({}, $.fn.mask.defaults, options);
        return init("body", options);
    };
    /**
     * 关闭遮罩窗体
     */
    $.mask.hide = function() {
        $("body").mask("hide");
    };
    /**
     * 关闭遮罩窗体 默认
     */
    $.closeMask = function(){
        $.mask.hide();
    }
    /**
     * 扩展方法
     * @type {{hide: (function(*): *)}}
     */
    $.fn.mask.methods = {
        hide : function(jq) {
            clearTimeout($.mask.timer);
            return jq.each(function() {
                var wrap = $(this);
                $("div.ty-mask", wrap).fadeOut(function() {
                    $(this).remove();
                });
                $("div.ty-mask-msg", wrap).fadeOut(function() {
                    $(this).remove();
                    wrap.css("position", wrap.attr("position"));
                    wrap.css("overflow", wrap.attr("overflow"));
                });
            });
        }
    };
    /**
     * 配置管理项
     * @type {{maskMsg: string, zIndex: number, timeout: number, opacity: number}}
     */
    $.fn.mask.defaults = {
        zIndex : 100000,
        timeout : 30000,
        opacity : 0
    };

    /**
     * 全局加载进度条(私有)
     * @param jq
     * @param options
     * @private
     */
    function __load(jq,options) {
        var wrap = $(jq) || $(options.el);
        (wrap.find(".ty-loader-bar").length) && (wrap.find(".ty-loader-bar").remove())
        var progressCls = {
            duration:options.time || 650,
            start:0,
            end:100
        };
        $('<div class="ty-loader-bar is-loading"><div class="ty-progress" style="transition: width 0.4s ease 0s; width: 0%;"></div></div>').appendTo(wrap);
        $({property:progressCls.start}).animate({property:progressCls.end},{
            duration:progressCls.duration,
            step:function(props,jq){
                wrap.find(".ty-progress").css('width',(Math.round(this.property))+"%");
                if(props == 100){
                    wrap.find(".ty-loader-bar").removeClass("is-loading");
                }

            }})


    };
    /**
     * 全局加载进度条( 对外)
     * @param options
     */
    $.loading = function (options) {
        if (typeof options == 'string' || typeof options == "number") {
            return __load("body",{
                time:options
            })
        }
        return __load(options);
    }
    /**
     * 全局消息组件
     * @returns {{init: init, render: render, _duration: _duration}}
     * @private
     */
    function __message() {
        this.NoticeType = 'info' || 'success' || 'error' || 'warning';
        var iconCls = {
            "info":"icon-xiangqing",
            "success":"icon-chenggong",
            "error":"icon-cuowu1",
            "warning":"icon-warningo"
        }
        this.text = "操作提醒！";
        return {
            /**
             * 初始化
             * @param options
             */
            init:function (options) {
                var len = $(".ty-message").length;
                this.id = "message_"+(+new Date());
                this.prefixCls = "ty-message";
                this.duration = options.duration || 2;
                this.top = options.top || 16;
                this.NoticeType = options.type;
                this.text = options.text || this.text;
                this.render();
            },
            /**
             * 渲染
             */
            render:function(){
                var cls = iconCls[this.NoticeType] || iconCls.info;
                var _top = this.top+"px";
                if(!$("."+this.prefixCls).length){
                    $('<div class='+this.prefixCls+'><span></span></div>').css("top",_top).appendTo($('body'))
                }
                $('<div class="ty-message-notice" id='+this.id+'>\n' +
                    '<div class="ty-message-notice-content">\n' +
                    '       <div class="ty-message-custom-content ty-message-'+this.NoticeType+'">\n' +
                    '         <i class="anticon iconfont '+cls+'"></i>\n' +
                    '         <span>'+this.text+'</span>\n' +
                    '      </div>\n' +
                    '   </div>\n' +
                    '  </div>').appendTo($('.'+this.prefixCls).find("span:eq(0)"));
                this._duration();
            },
            /**
             * 定时机制
             * @private
             */
            _duration:function () {
                var self = this;
                clearTimeout(timer);
                var timer = setTimeout(function () {
                    var $obj = $("#"+self.id);
                    $obj.addClass('move-up-leave move-up-leave-active');
                    clearTimeout(_s);
                    var _s = setTimeout(function () {
                        $obj.remove();
                    },300);

                },(self.duration*1000));
            }
        }
    }

    /**
     * 全局提示组建
     * @returns {{init: init, render: render, closeHandler: closeHandler, close: close, autoPlay: autoPlay}}
     * @private
     */
    function __alert(){
        var iconCls ={
            "info":"icon-xiangqing",
            "success":"icon-chenggong",
            "error":"icon-cuowu1",
            "warning":"icon-warningo"
        }
        var defaults = {
            ele:"body",
            id:"message_"+(+new Date()),
            duration:2,
            isAutoClose:false,
            top:16,
            prefixCls:"ty-alert",
            title:"",
            timer:null,
            onClose:null
        }
        return{
            /**
             * 初始化
             * @param opts
             */
            init:function (opts) {
                this.setting = $.extend({},defaults,opts);
                this.render();
            },
            /**
             * 渲染
             */
            render:function () {
                var self = this,
                    cls = iconCls[(this.setting.type)];
                $(self.setting.ele).find(".ty-alert-container").remove();
                $('<div id='+this.setting.id+' class="ty-alert-container"><div class="ty-alert ty-alert-'+this.setting.type+' ty-alert-with-description">\n' +
                    '    <i class="anticon ty-alert-icon iconfont '+cls+'"></i>\n' +
                    '    <span class="ty-alert-message">'+this.setting.title+'</span>\n' +
                    '    <span class="ty-alert-description">'+this.setting.message+'</span>\n' +
                    '     <a class="ty-alert-close-icon"><i class="anticon iconfont icon-cuohao" data-role="close"></i></a>\n' +
                    '</div>' +
                    '</div>').appendTo($(self.setting.ele));
                this.autoPlay();
                this.closeHandler();
            },
            /**
             * 关闭事件监听
             */
            closeHandler:function(){
                var self = this;
                $(".ty-alert-container").on("click",function (e) {
                    if(self.setting.onClose && typeof (self.setting.onClose) == "function"){
                        self.setting.onClose.call(this,self)
                    }else{
                        var target = $(e.target);
                        if(target.attr("data-role")=="close"){
                            self.close();
                            return false;
                        }
                    }
                    return false;
                })
            },
            /**
             * 关闭事件
             */
            close:function () {
                clearTimeout(this.setting.timer)
                $("#"+this.setting.id).remove();
            },
            /**
             * 自动播放事件
             */
            autoPlay:function () {
                var self = this;
                if(this.setting.isAutoClose){
                    self.setting.timer = setTimeout(function () {
                        if(self.setting.onClose && typeof (self.setting.onClose) == "function"){
                            self.setting.onClose.call(this,self)
                        }else{
                            $("#"+self.setting.id).remove();
                        }
                    },(self.setting.duration*1000))
                }
            }
        }
    }

    /**
     * POST 传参的方式下载文件
     * @param param
     * @param param {url:"服务端接口",data:"接口参数"}
     * @private
     */
    function __ajaxDownFile(param){
        var form = $('<form method="POST" enctype="multipart/form-data" action="' + param.url + '">');
        $.each(param.data, function (k, v) {
            form.append($('<input style="width: 0; height: 0; border: 0;" type="hidden" name="' + k +'" value="' + v + '">'));
        });
        $('body').append(form);
        form.submit();
    }

    //调用各个浏览器提供的进入全屏方法
     function handleFullScreen () {
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        } else if (de.msRequestFullscreen) {
            de.msRequestFullscreen();
        }
        else {
            $.message({type:'warning',text:'当前浏览器不支持全屏！'});
        }

    };
    //调用各个浏览器提供的退出全屏方法
    function exitFullscreen() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    $.extend({
        message:function (opts){
            return __message().init(opts);
        },
        simpleAlert:function (opts) {
            return __alert().init(opts)
        },
        ajaxDownFile:function (opts) {
            return __ajaxDownFile(opts);
        },
        screenFull:function () {
            return handleFullScreen()
        },
        exitScreenFull:function () {
            return exitFullscreen()
        }
    })
    return $;
})

