define('tyDynamicForm',["jquery","tyBase"],function ($,base) {
    var $iframe;
    /**
     *
     * @param jq
     */
    function init(jq){
        var options = jq.data("tyDynamicForm").options;
        render(jq,options);
    }

    /**
     *
     * @param options
     */
    function render(jq,options){
        createWrap(jq,options)
    }

    /**
     *
     * @param opts
     */
    function createWrap(jq,opts){
        var aeu = opts.attrsExtendUrl || "";
        var $iframe = $('<iframe></iframe>').attr({
            id : opts.iframeId,
            name : opts.iframeId,
            frameborder : 0,
            scrolling : 'no',
            src : "/src/scripts/widget/tyLayoutit/widgetForm.html?t="+(+new Date()+"&extendurl="+aeu)
        }).css({
            width : opts.width,
            height : opts.height || "inherit;"
        }).appendTo(jq);
        window.indata = opts.indata;
    }

    /**
     *
     * @param jq
     * @returns {*}
     */
    function getInData(jq) {
        var options = jq.data("tyDynamicForm").options;
        return options.indata;
    }

    /**
     *
     * @param jq
     * @param param
     */
    function setInData(jq,param){
        var options = jq.data("tyDynamicForm").options;
        options.indata = param;
    }

    /**
     * 获取动态表单的数据
     * @returns {*}
     */
    function getFormData(jq){
        var options = jq.data("tyDynamicForm").options,
        tempData = null;
        if (window.frames[options.iframeId].getFormData) {
            tempData = window.frames[options.iframeId].getFormData();
        }else if (window.frames[options.iframeId].contentWindow["getFormData"]) {
            tempData = window.frames[options.iframeId].contentWindow["getFormData"]();
        }
        return tempData
    }
    /**
     * 清空动态表单数据
     * @returns {*}
     */
    function clearFormData(jq){
        var options = jq.data("tyDynamicForm").options;
        if (window.frames[options.iframeId].clearLayout) {
            window.frames[options.iframeId].clearLayout();
        }else if (window.frames[options.iframeId].contentWindow["clearLayout"]) {
            window.frames[options.iframeId].contentWindow["clearLayout"]();
        }
    }

    /**
     *
     * @param options
     * @param params
     * @returns {*}
     */
    $.fn.tyDynamicForm = function (options, params) {
        if (typeof options == "string") {
            return $.fn.tyDynamicForm.methods[options](this, params);
        }
        options = options || {};
        var datas = this.data("tyDynamicForm");
        datas ? $.extend(datas.options, options) : this.data("tyDynamicForm", {
            options: $.extend({}, $.fn.tyDynamicForm.defaults, $.fn.tyDynamicForm.parseOptions(this, options))
        });
        init(this);
        return this;
    }
    /**
     *
     * @param jq
     * @param options
     * @returns {*}
     */
    $.fn.tyDynamicForm.parseOptions = function (jq, options) {
        return $.extend({}, options,{
            iframeId : "iframe_"+(+new Date()),
        });
    };
    /**
     *
     * @type {{setInData: (function(*=): void), getInData: (function(*=): *)}}
     */
    $.fn.tyDynamicForm.methods = {
        setInData:function (jq) {
            return setInData(jq);
        },
        getInData:function (jq) {
            return getInData(jq);
        },
        getFormData:function (jq) {
           return getFormData(jq);
        },
        clearFormData:function (jq) {
            return clearFormData(jq);
        }
    };
    /**
     *
     * @type {{el: string, iframeId: string, width: string, height: string, indata: null, callback: *}}
     */
    $.fn.tyDynamicForm.defaults = {
        iframeId : "",
        attrsExtendUrl:"",
        width:"100%",
        height:"99.8%",
        indata:null,
        callback:$.noop
    };

    return $
})