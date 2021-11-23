/**
 * describe 适用于各种模式的步骤条
 * author WG
 * time 2018/10/22 10:23:54
 */
define('tySteps', ["jquery", "tyUtil"], function ($) {
    /**
     * 初始化
     * @param jq
     */
    function init(jq) {
        var options = jq.data("tySteps").options;
        render(jq, options);
    }
    /**
     * 检测是否支持Flex布局
     * @returns {boolean}
     */
    function isFlexSupported() {
        if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
            var documentElement = window.document.documentElement;

            return 'flex' in documentElement.style || 'webkitFlex' in documentElement.style || 'Flex' in documentElement.style || 'msFlex' in documentElement.style;
        }
        return false;
    }

    /**
     * 渲染步骤条
     * @param jq
     * @param opts
     */
    function render(jq, opts) {
        jq.empty('');
        var cb = createStepContainer(jq);
        var hb = opts.direction === "horizontal" ?
            $('<div class="ty-steps ty-steps-horizontal ty-steps-label-horizontal"></div>').appendTo(cb) :
            $('<div class="steps-title"><div class="ty-steps ty-steps-vertical"></div></div>').appendTo(cb);
        var cc = createStepContent(cb, opts),
            cf = createStepFooter(jq, cb, opts);
        createSteps(jq,hb, opts);
        /**
         * 针对IE9设定规则
         */
        if (!isFlexSupported()) {
            if (navigator.appVersion.match("MSIE 9.0")) {
                jq.find(".ty-steps-horizontal .ty-steps-item").css({
                    "width": "calc(100%/3.1)"
                })
            }
        }
    }

    /**
     * 创建步骤条容器
     * @param jq
     * @returns {jQuery}
     */
    function createStepContainer(jq) {
        return $('<div class="steps-box" id="steps_wrap" style="padding: 20px; height: calc(100% - 40px);"></div>').appendTo(jq);
    }

    /**
     *创建正文主体容器
     * @param jq
     * @param opts
     * @returns {jQuery}
     */
    function createStepContent(jq, opts) {
        var _content = opts.direction == "horizontal" ?
            $('<div class="steps-content" id="steps_body"></div>').appendTo(jq) :
            $('<div class="steps-container"><div class="steps-content" id="steps_body"></div></div>').appendTo(jq);
        (opts.direction == "horizontal")? jq.find("#steps_body").css("height",jq.innerHeight()-70) : jq.find("#steps_body").css("height",jq.innerHeight());
        if(opts.isiframe){
            var $iframe = $("<iframe src=''></iframe>").css({
                width:"100%",
                height:opts.height ? opts.height+"px":"inherit",
                'overflow-x':'auto',
                'display':'block'
            }).attr({
                frameborder:'0',
                scrolling:'no',
                id:"steps_body_iframe",
                step:opts.currentx
            }).appendTo(jq.find("#steps_body"));
        }
        return _content;
    }

    /**
     * 创建按钮容器
     * @param jq
     * @param cb
     * @param opts
     * @returns {jQuery}
     */
    function createStepFooter(jq, cb, opts) {
        var cf = opts.direction == "horizontal" ? $('<div class="steps-action" id="steps_footer"></div>').appendTo(cb) :
            $('<div class="steps-action" id="steps_footer"></div>').appendTo(cb.find(".steps-container"));
        createStepButtons(jq, cf, opts);
        return cf;
    }

    /**
     * 创建底部按钮
     * @param jq
     * @param cf
     * @param opts
     */
    function createStepButtons(jq, cf, opts) {
        cf.empty();
        $('<button type="button" data-role="prev" class="btn btn-default btn-lg"><span>'+opts.prevName+'</span></button>').bind("click", {
            "$obj": jq,
            "params": opts
        }, prevSteps).appendTo(cf).hide();
        $('<button type="button" data-role="next" class="btn btn-default btn-lg"><span>'+opts.nextName+'</span></button>').bind("click", {
            "$obj": jq,
            "params": opts
        }, nextSteps).appendTo(cf).hide();
        $('<button type="button" data-role="end" class="btn btn-default btn-lg"><span>'+opts.endName+'</span></button>').bind("click", {
            "$obj": jq,
            "params": opts
        }, endSteps).appendTo(cf).hide();
        setSteps(jq, opts)
    }

    /**
     * 创建步骤控件的步骤条
     * @param _parent
     * @param opts
     */
    function createSteps(jq,_parent, opts) {
        (opts.direction === "horizontal") ?
            $.each(opts.steps, function (i, step) {
                var cls = opts.current == i ? opts.currentCls : opts.defaultCls;
                $('<div class="ty-steps-item ' + cls + '">\n' +
                    '            <div class="ty-steps-item-tail"></div>\n' +
                    '            <div class="ty-steps-item-icon"><span class="ty-steps-icon">' + (i + 1) + '</span></div>\n' +
                    '            <div class="ty-steps-item-content">\n' +
                    '                <div class="ty-steps-item-title">' + step.title + '</div>\n' +
                    '            </div>\n' +
                    '        </div>').appendTo(_parent);
            }) :
            $.each(opts.steps, function (i, step) {
                var cls = opts.current == i ? opts.currentCls : opts.defaultCls;
                $('<div class="ty-steps-item ' + cls + '">\n' +
                    '                <div class="ty-steps-item-tail"></div>\n' +
                    '                <div class="ty-steps-item-icon">\n' +
                    '                <span class="ty-steps-icon">' + (i + 1) + '</span>\n' +
                    '                </div>\n' +
                    '                <div class="ty-steps-item-content">\n' +
                    '                    <div class="ty-steps-item-title">' + step.title + '</div>\n' +
                    '                    <div class="ty-steps-item-description">\n' +
                    '                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>').appendTo(_parent.find(".ty-steps-vertical"));
            });
        (!opts.isiframe) ?
            (opts.steps[opts.current].templateUrl) ?
                $.get((opts.steps[opts.current].templateUrl),function (ele) {jq.find("#steps_body").empty().html(ele);}):
                jq.find("#steps_body").empty().html(opts.steps[opts.current].content) :
            jq.find("#steps_body_iframe").attr({"src":opts.steps[opts.current].templateUrl+"?t="+(+new Date())});

    }
    /**
     * 前一步逻辑控制
     * @param e
     * @param opts
     */
    function prevSteps(e, opts) {
        var jq = e.data.$obj,
            opts = opts || e.data.params;
        var oldStepNumber = opts.current;
        if (oldStepNumber !== 0) {
            var $stepsTitles = jq.find("#steps_wrap .ty-steps-item");
            opts.current--;
            $stepsTitles.eq(oldStepNumber).removeClass("ty-steps-item-process ty-steps-item-finish").addClass("ty-steps-item-wait").find(".ty-steps-icon").html((oldStepNumber + 1));
            $stepsTitles.eq(opts.current).removeClass("ty-steps-item-wait ty-steps-item-finish").addClass("ty-steps-item-process").find(".ty-steps-icon").html((opts.current + 1));
            if(!opts.isiframe){
                if(opts.steps[opts.current].templateUrl){
                    $.get((opts.steps[opts.current].templateUrl),function (ele) {
                        jq.find("#steps_body").empty().html(ele);
                    })
                }else{
                    jq.find("#steps_body").empty().html(opts.steps[opts.current].content);
                }
            }else{
                jq.find("#steps_body_iframe").attr({
                    "src":opts.steps[opts.current].templateUrl+"?t="+(+new Date())
                })
            }
            setSteps(jq, opts);
            (opts.prevHandler && typeof (opts.prevHandler) == "function") ? opts.prevHandler.call(this,jq):null;
        };
    }

    /**
     * 下一步逻辑控制
     * @param e
     * @param opts
     */
    function nextSteps(e, opts) {
        var jq = e.data.$obj,
            opts = opts || e.data.params;
        var oldStepNumber = opts.current;
        if (oldStepNumber !== opts.steps.length - 1) {
            var isAllowNext = checkStepCall(opts);
            if (isAllowNext) {
                (opts.nextHandler && typeof (opts.nextHandler) == "function") ? opts.nextHandler.call(this,jq):null;
                var $stepsTitles = jq.find("#steps_wrap .ty-steps-item");
                opts.current++;
                $stepsTitles.eq(oldStepNumber).removeClass("ty-steps-item-wait ty-steps-item-process").addClass("ty-steps-item-finish").find(".ty-steps-icon").html(opts.finishIconEle);
                $stepsTitles.eq(opts.current).removeClass("ty-steps-item-wait ty-steps-item-finish").addClass("ty-steps-item-process");
                if(!opts.isiframe){
                    if(opts.steps[opts.current].templateUrl){
                        $.get((opts.steps[opts.current].templateUrl),function (ele) {
                            jq.find("#steps_body").empty().html(ele);
                        })
                    }else{
                        jq.find("#steps_body").empty().html(opts.steps[opts.current].content);
                    }
                }else{
                    jq.find("#steps_body_iframe").attr({
                        "src":opts.steps[opts.current].templateUrl+"?t="+(+new Date())
                    });
                }
                setSteps(jq, opts);

            }
        }
    }

    /**
     * 检查函数的挂载方式
     * @param opts
     * @returns {boolean}
     */
    function checkStepCall(opts) {
        var flag = false,
            currentCall = opts.steps[opts.current].handler;
        if(!opts.isiframe){
            if(typeof currentCall === "string"){
                /**
                 * 检测挂载在页面的片段函数，必须以字符串的形式挂载，并要求挂载函数内部存在return 返回对象；
                 */
                var cc = eval(currentCall)();
                return cc;
            }
            if(typeof currentCall === "function"){
                /**
                 * 检测挂载函数内部有自己的return 标识，则运行自己的函数；如果挂载函数没有return，则直接返回true；
                 */
                return (opts.steps[opts.current].handler).toString().match(/return/g) ? (opts.steps[opts.current].handler).call(this, opts.nextHandler) : true;
            }
        }else{
            /**
             * iframe嵌套的函数调用只能挂载函数名，字符串类型
             */
            if (window.frames["steps_body_iframe"][currentCall]) {
                return (window.frames["steps_body_iframe"][currentCall]());
            }else if (window.frames["steps_body_iframe"].contentWindow[currentCall]) {
                return (window.frames["steps_body_iframe"].contentWindow[currentCall]());
            }
        }
        return flag;

    }

    /**
     * 完成逻辑操作
     * @param e
     * @param opts
     */
    function endSteps(e, opts) {
        var jq = e.data.$obj,
            opts = opts || e.data.params;
        (opts.endHandler && typeof (opts.endHandler) == "function") ? opts.endHandler.call(this,jq):null;
        (opts.callBack && typeof (opts.callBack) == "function") ? opts.callBack.call(this,jq):null;
    }

    /**
     * 设置底部按钮的操作
     * @param jq
     * @param opts
     */
    function setSteps(jq, opts) {
        var cp = jq.find('[data-role="prev"]'),
            cn = jq.find('[data-role="next"]'),
            end = jq.find('[data-role="end"]');
        if (opts.current === 0) {
            cp.removeClass("btn-primary").hide();
            cn.addClass("btn-primary").show();
            end.removeClass("btn-primary").hide();
        } else if (opts.current < opts.steps.length - 1) {
            cp.removeClass("btn-primary").show();
            cn.addClass("btn-primary").show();
            end.removeClass("btn-primary").hide();
        } else if (opts.current === opts.steps.length - 1) {
            cp.removeClass("btn-primary").show();
            cn.removeClass("btn-primary").hide();
            end.addClass("btn-primary").show();
        } else if (opts.current > 0) {
            cp.removeClass("btn-primary").show();
            cn.addClass("btn-primary").show();
        }
    }

    /**
     * 设置步骤缓存数据
     * @param jq
     * @param params
     */
    function setStepData(jq,params){
        var options = jq.data("tySteps").options;
        var currentStory = "step_"+options.current;
        options.stepStory[currentStory] = params;
    }

    /**
     * 获取缓存数据
     * @param jq
     * @returns {{}}
     */
    function getStepData(jq){
        var options = jq.data("tySteps").options;
        return options.stepStory;
    }

    /**
     * 清空缓存数据
     * @param jq
     */
    function clearStepData(jq){
        var options = jq.data("tySteps").options;
        options.stepStory = {};
    }

    /**
     * 获取当前步骤的索引
     * @param jq
     * @returns {*}
     */
    function getStepIndex(jq){
        var options = jq.data("tySteps").options;
        return options.current;
    }
    /**
     * 对外句柄
     * @param options
     * @param params
     * @returns {*}
     */
    $.fn.tySteps = function (options, params) {
        if (typeof options == "string") {
            return $.fn.tySteps.methods[options](this, params);
        }
        options = options || {};
        var datas = this.data("tySteps");
        datas ? $.extend(datas.options, options) : this.data("tySteps", {
            options: $.extend({}, $.fn.tySteps.defaults, $.fn.tySteps.parseOptions(this, options))
        });
        init(this);
        return this;
    };
    /**
     * 预处理机制
     * @param jq
     * @param options
     * @returns {*}
     */
    $.fn.tySteps.parseOptions = function (jq, options) {
        return $.extend({}, options);
    };
    /**
     * 步骤条的默认配置
     * @type {{el: string, current: number, direction: string, size: string, status: string, isframe: boolean, stepNumber: number, prevHandler: $.fn.tySteps.defaults.prevHandler, nextHandler: $.fn.tySteps.defaults.nextHandler, endHandler: $.fn.tySteps.defaults.endHandler, callBack: $.fn.tySteps.defaults.callBack}}
     */
    $.fn.tySteps.defaults = {
        current: 0, //当前步骤
        direction: "horizontal", //目前支持水平（`horizontal`）和竖直（`vertical`）两种方向
        size: "default", //步骤条的规格大小 `default`| `small`
        status: "wait", //步骤条的状态 `wait`|`process`|`finish`|`error`
        currentCls: "ty-steps-item-process",
        isiframe:false,
        width:"",
        height:"",
        stepStory:{},
        defaultCls: "ty-steps-item-wait",
        finishIconEle: '<i class="step-icon step-icon-check ty-steps-finish-icon"><svg viewBox="64 64 896 896" class="" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path></svg></i>',
        steps: [{
            title: '第一步',
            content: '第一',
            handler: function () {}
        }, {
            title: '第二步',
            content: '第二',
            handler: function () {}
        }, {
            title: '最后步',
            content: '最后',
            handler: function () {}
        }],
        prevName:"上一步",
        nextName:"下一步",
        endName:"完成",
        prevHandler: function () {},
        nextHandler: function () {},
        endHandler: function () {},
        callBack: function () {}
    }
    /**
     * 待处理，可能用不上
     * @type {{prev: $.fn.tySteps.methods.prev, next: $.fn.tySteps.methods.next, end: $.fn.tySteps.methods.end, steps: $.fn.tySteps.methods.steps}}
     */
    $.fn.tySteps.methods = {
        "setStepData": function (jq,opts) {
            return setStepData(jq,opts);
        },
        "getStepData": function (jq) {
            return getStepData(jq);
        },
        "clearStepData": function (jq) {
            return clearStepData(jq);
        },
        "getStepIndex":function (jq) {
            return getStepIndex(jq);
        }
    }
    return $;
})