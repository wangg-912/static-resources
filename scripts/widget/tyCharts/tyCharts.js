define('tyCharts',["jquery","Ajax","eCharts","tyChartsConfig","tyUtil"],function ($,Ajax,echarts,chartConfig) {
    /**
     * 初始化
     * @param jq
     * @returns {*}
     */
    function init(jq) {
        var options = jq.data("tyCharts").options;
        options.$el = jq;
        return render(jq,options);
    }

    /**
     * 渲染入口TODO
     * @param jq
     * @param opts
     * @returns {render}
     */
    function render(jq,opts) {
        (opts.isShowButton)?
            ($.isArray(opts.buttons) && opts.buttons.length) ?
                createChartsButtonsList(jq,opts) :
                $.message({type: "error", text: "加载失败，未设置图表按钮队列！"}):
                getCurrentChartConfigForAdpr(jq,opts);
        return this;
    }

    /**
     * 创建缩略图按钮列表
     * @param jq
     * @param opts
     */
    function createChartsButtonsList(jq,opts) {
        var direction = opts.direction;
        direction == "horizontal" ? createButtonsContainer(jq,opts,"horizontal"): createButtonsContainer(jq,opts,"vertical");
    }

    /**
     * 创建迷你图表容器
     * @param jq
     * @param opts
     * @param type
     */
    function createButtonsContainer(jq,opts,type) {
        var _w = (type == "horizontal")? jq.innerWidth() : opts.width+20,
            _h = "auto";
        var $buttonWrap = $("<ul class='chart-list'></ul>").css({
            "margin":"0",
            "padding":"0",
            "width":_w,
            "height":_h
        }).appendTo(jq);
        createButton(jq,opts,$buttonWrap);

    }

    /**
     * 创建min图表并挂载事件
     * @param jq
     * @param opts
     * @param parent
     */
    function createButton(jq,opts,parent) {
        $.each(opts.buttons,function (i,chart) {
            $("<li></li>").attr({
                type:chart
            }).css({
                width:opts.width,
                height:opts.height,
                margin:"4px 4px 0 4px",
                cursor:"pointer",
                display:(opts.direction =="horizontal") ? "inline-block":"block"
            }).addClass(chart+"-chart chart-bord").bind("click",{"type":chart,"jq":jq, "params":opts},bindChartsConfig).appendTo(parent);
        })
    }

    /**
     * 绑定图表单个点击事件
     * @param event
     */
    function bindChartsConfig(event) {
        event.stopPropagation();
        var currentData = event.data;
        getCurrentChartConfig(currentData.params,currentData.type);
    }

    /**
     * 获取当前图表配置
     * @param jq
     * @param opts
     */
    function getCurrentChartConfigForAdpr(jq,opts) {
        var id =jq.attr("id"),
            type = opts["chartType"];
        var config = chartConfig[type];
        opts.container = id;
        (config) ? getRequestByConfig(opts,config):$.message({type: "error", text: "图表配置不能为空！"});

        
    }
    /**
     * 根据类型获取当前图表配置
     * @param type
     */
    function getCurrentChartConfig(params,type){
        var config = chartConfig[type];
        (config.option && config.dynamicConfig) ?
            getRequestByConfig(params,config):
            $.message({type: "error", text: "图表配置不能为空！"})
    }

    /**
     * 根据配置获取返回收据
     * @param params
     * @param chartConfig
     */
    function getRequestByConfig(params,chartConfig) {
        params.beforeRenderChart.call(this,params);
        params.queryParams["dynamicConfig"] = chartConfig.dynamicConfig
        var result = {
            "title.text":'未来一周气温变化',
            "legend.data":['最高气温','最低气温'],
            "xAxis.data":['周一','周二','周三','周四','周五','周六','周日'],
            "yAxis.axisLabel.formatter":'{value} °C',
            "series":[
                {
                    name:'最高气温',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'最低气温',
                    type:'line',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [
                            {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'},
                            [{
                                symbol: 'none',
                                x: '90%',
                                yAxis: 'max'
                            }, {
                                symbol: 'circle',
                                label: {
                                    normal: {
                                        position: 'start',
                                        formatter: '最大值'
                                    }
                                },
                                type: 'max',
                                name: '最高点'
                            }]
                        ]
                    }
                }
            ]
        };
        setChartOptionByData(params,chartConfig,result);
        return;
        //TODO
        Ajax.post({
            url:params.url,
            data:params.queryParams
        },function (result) {
            (result.success)?
                setChartOptionByData(params,chartConfig,result.content):
                $.message({type: "warning", text: "动态获取依赖配置为空！"})

        },function (error) {
            $.message({type: "error", text: "动态获取依赖配置失败！"})
        })
    }

    /**
     * 根据获取的数据重置图表的配置
     * @param options
     * @param config
     * @param data
     */
    function setChartOptionByData(options,config,data) {
        $.each(config.dynamicConfig,function (i,attr) {
            var req = data[attr],
                isEval =(attr.indexOf(".")>0) ? true : null;
            if(isEval){
                var temp = attr.split("."),
                    __option__ = temp[temp.length-1];
                temp.splice((temp.length-1),1);
                var _attribute = "config.option."+temp.join('.'),
                    targetAttr = eval(_attribute);
                targetAttr[__option__] = req;
            }else{
                config.option[attr] = req;
            }
        })
        var options = options.$el.data("tyCharts").options;
        options.config = config.option;
        renderChartsByData(options,config.option);
    }

    /**
     * 渲染图表根据重置后的完整配置
     * @param opts
     * @param config
     */
    function renderChartsByData(opts,config) {
        var _c = document.getElementById(opts.container),
            _charts = echarts.init(_c);
        if (config && typeof config === "object") {
            _charts.setOption(config, true);
        }
    }
    /**
     * 追加自定义配置参数
     * @param jq
     * @param opts
     * @returns {appendSearchCondition}
     */
    function appendSearchCondition(jq,opts){
        var options = jq.data("tyCharts").options;
        options.queryParams = opts;
        return this;
    }

    function renderCharts(jq,opts){
        //TODO
    }

    /**
     * 组件入口处理机制
     * @param options
     * @param params
     * @returns {*}
     */
    $.fn.tyCharts = function(options, params) {
        if (typeof options == "string") {
            return $.fn.tyCharts.methods[options](this, params);
        }
        options = options || {};
        var datas = this.data("tyCharts");
        datas ? $.extend(datas.options, options) : this.data("tyCharts", {
            options: $.extend({}, $.fn.tyCharts.defaults, $.fn.tyCharts.parseOptions(this, options))
        });
        init(this);
        return this;
    };
    /**
     * 组件配置预处理机制
     * @param jq
     * @param options
     * @returns {any | {}}
     */
    $.fn.tyCharts.parseOptions = function (jq, options) {
        return $.extend({}, options);
    };
    /**
     * 默认事件
     * @type {{appendQueryParam: (function(*=, *=): appendSearchCondition), renderCharts: (function(*=, *=): *)}}
     */
    $.fn.tyCharts.methods = {
        appendQueryParam:function (jq,param) {
            return appendSearchCondition(jq,param)
        },
        renderCharts:function (jq,param) {
            return renderCharts(jq,param);
        }
    }
    /**
     * 默认配置
     * @type {{$el: null, container: string, buttons: string[], direction: string, isShowButton: boolean, chartType: string, width: number, height: number, borderCls: string, queryParams: null, beforeRenderChart: *, renderChart: *, callback: *}}
     */
    $.fn.tyCharts.defaults = {
        $el:null,                //容器对象，自动封装
        container:"",            //图表预览|渲染对象容器
        buttons:["line","bar","pie","gauge","adar"],
        direction: "horizontal", //目前支持水平（`horizontal`）和竖直（`vertical`）两种方向
        isShowButton:false,      //是否显示缩略图按钮
        chartType:"",            //图表类型
        width:50,                // 每个缩略元素宽度
        height:50,               // 每个缩略元素高度
        borderCls:"chart-bord",            //边框的宽度
        queryParams:null,        //条件配置
        beforeRenderChart:$.noop(),//图表的缩略图事件
        renderChart:$.noop(),    //预览|渲染图表
        callback:$.noop()        //回调函数
    }

    return $;
})