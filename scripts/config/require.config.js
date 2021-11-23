/**
 * @description 框架加载总体配置
 * @author wanggang
 */
"use strict";
var _path = location.protocol+"//" + location.hostname+':'+location.port;
var _theme = window.localStorage.getItem('skinTheme')||"light";
require.config({
    urlArgs: +new Date,
    baseUrl: _path + "/",
    map: {"*": {css: "src/bower_components/require/css.min"}},
    paths: {
        text: "src/bower_components/require/text",
        jquery: "src/bower_components/jquery/jquery.min",
        jqueryui: "src/bower_components/jquery-ui/jquery-ui",
        countUp: "src/bower_components/countup/countUp.min",
        bootstrap: "src/bower_components/bootstrap/3.3.7/js/bootstrap.min",
        popover: "src/bower_components/bootstrap/3.3.7/plugins/popover",
        tooltip: "src/bower_components/bootstrap/3.3.7/plugins/tooltip",
        underscore: "src/bower_components/underscore/underscore",
        easyModule: "src/bower_components/jquery-easyui-1.8.6/easyloader",
        easyuiBase: "src/bower_components/jquery-easyui-1.8.6/jquery.easyui.min",
        easyui: "src/bower_components/jquery-easyui-1.8.6/locale/easyui-lang-zh_CN",
        Ajax: "src/scripts/services/service_base",
        zTree: "src/bower_components/zTree_v3/js/jquery.ztree.all",
        blockUI: "src/bower_components/jquery.blockUI/jquery.blockUI",
        eCharts: "src/bower_components/echarts/echarts.min",
        'highcharts': "src/bower_components/highcharts/highcharts",
        'hchart-more': "src/bower_components/highcharts/highcharts-more",
        'hchart-export': "src/bower_components/highcharts/modules/exporting",
        'hchart-sunburst': "src/bower_components/highcharts/modules/sunburst",
        'hchart-funnel': "src/bower_components/highcharts/modules/funnel",
        'hchart-ie': "src/bower_components/highcharts/modules/oldie",
        'hchart-grouped': "src/bower_components/highcharts/grouped-categories",
        'hchart-nodata': "src/bower_components/highcharts/modules/no-data-to-display",
        'hchart-zh': "src/bower_components/highcharts/highcharts-zh_CN",
        'highmaps': "src/bower_components/highmaps/highmaps",
        'hmap-drilldown': "src/bower_components/highmaps/modules/drilldown",
        'hmap-export': "src/bower_components/highmaps/modules/exporting",
        'hmap-zh': "src/bower_components/highmaps/highmaps-zh_CN",
        zeroclipboard: "src/bower_components/ueditor/third-party/zeroclipboard/ZeroClipboard",
        ueCfg: "src/bower_components/ueditor/ueditor.config",
        ueditor: "src/bower_components/ueditor/ueditor.all",
        uploadFile: "src/bower_components/jquery-uploadfile/ajaxfileupload",
        jqprint: "src/bower_components/jquery-jqprint/jquery.jqprint-0.3",

        vue: 'src/bower_components/vue/vue.min',
        vueRouter: 'src/bower_components/vue/vue-router.min',
        vuex: 'src/bower_components/vue/vuex.min',
        resolve: 'src/bower_components/vue/resolve',
        promise: 'src/bower_components/vue/q',
        "ELEMENT": "src/bower_components/element-ui/index",
        sortablejs:"src/bower_components/vue/Sortable.min",
        vuedraggable:"src/bower_components/vue/vuedraggable.umd.min",
        'vue-cropper':"src/bower_components/vue/vue-cropper/index.min",
        'vue-json-view':'src/bower_components/vue/vue-json-view/index',
        'dtree-table':"src/bower_components/vue/drag-tree-table/index",
        tyUtil: "src/scripts/plugins/tyui/ty-util",
        tyBase: "src/scripts/plugins/js/extends",
        tyDynamicForm: "src/scripts/widget/tyLayoutit/tyDynamicForm",
        Gridster: "src/bower_components/jquery-gridster/js/jquery.gridster",
        tyTabs: "src/scripts/plugins/extends/tyTabs_new",
        tyDialog: "src/scripts/plugins/extends/tyDialog",
        tySteps: "src/scripts/plugins/extends/tySteps",
        tyUI: "src/scripts/plugins/tyui/ty-generation",
        tyGridHeader: "src/scripts/plugins/extends/tyGridHeader",
        tyValidateRules: "src/scripts/plugins/extends/tyValidateRules",
        tyNavigation: "src/scripts/plugins/extends/tyNavigation",
        tyAnchor: "src/scripts/plugins/extends/tyAnchor",
        tyRate: "src/scripts/plugins/extends/tyRate",
        tySegmentation: "src/scripts/plugins/extends/tySegmentation",
        tyDateMonth: "src/scripts/plugins/extends/tyDateMonth",
        tyBreadcrumb: "src/scripts/plugins/extends/tyBreadcrumb",
        tyUpload: "src/scripts/plugins/extends/tyUpload",
        tyPersonSelector: "src/scripts/plugins/extends/tyPersonSelector",
        tySelector: "src/scripts/plugins/extends/tySelector",
        idCardApi: "src/scripts/services/idcard_service"
    },
    shim: {
        jquery: {exports: "$"},
        jqueryui: {deps: ["css!src/bower_components/jquery-ui/jquery-ui.css", "jquery"]},
        bootstrap: {
            deps: ["css!src/bower_components/bootstrap/3.3.7/css/bootstrap.css", "jquery"],
            exports: "bootstrap"
        },
        popover: {deps: ["css!src/bower_components/bootstrap/3.3.7/css/bootstrap.css", "jquery", "tooltip"]},
        underscore: {exports: "_"},
        vueRouter: ['vue'],
        ELEMENT: {deps: ["css!src/bower_components/element-ui/index." + _theme+ ".css"]},
        sortablejs:{deps: ['vue']},
        vuedraggable:{deps: ['vue','sortablejs']},
        'vue-cropper':{deps: ['vue']},
        'vue-json-view':{deps: ['vue']},
        'dtree-table':{deps: ['vue']},
        easyuiBase: {deps: ["jquery"], exports: "$"},
        easyui: {deps: ["easyuiBase"], exports: "$"},
        Ajax: {deps: ["jquery"]},
        zTree: {deps: ["css!src/bower_components/zTree_v3/css/metroStyle/metroStyle.css", "jquery"], exports: "$"},
        blockUI: {deps: ["css!src/scripts/plugins/old/old.style.css", "jquery"]},
        eCharts: {deps: ["jquery"]},
        'highcharts': {
            exports: 'Highcharts'
        },
        'hchart-more': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },
        'hchart-export': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },
        'hchart-sunburst': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },
        'hchart-funnel': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },
        'hchart-ie': {
            deps: ["highcharts", "hchart-more", "hchart-export"],
            exports: 'Highcharts'
        },
        'hchart-zh': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },

        'hchart-grouped': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },
        'hchart-nodata': {
            deps: ["highcharts"],
            exports: 'Highcharts'
        },
        'highmaps': {
            exports: 'Highcharts'
        },
        'hmap-export': {
            deps: ['highmaps'],
            exports: 'Highcharts'
        },
        'hmap-drilldown': {
            deps: ['highmaps'],
            exports: 'Highcharts'
        },
        'hmap-zh': {
            deps: ["highmaps"],
            exports: 'Highcharts'
        },
        ueditor: {
            deps: ["zeroclipboard", "ueCfg"], exports: "UE", init: function (e) {
                window.ZeroClipboard = e
            }
        },
        jqprint: {deps: ["jquery"]},
        Gridster: {deps: ["css!src/bower_components/jquery-gridster/css/gridster", "css!src/bower_components/jquery-gridster/css/jquery.gridster.css", "jquery"]},
        tyUtil: {deps: ["jquery"]},
        tyBase: {deps: ["jquery", "underscore", "tyUtil"]},
        tyTabs: {deps: ["jquery", "easyModule"]},
        tyDialog: {deps: ["jquery", "underscore", "easyModule", "tyUtil"]},
        tyUI: {deps: ["jquery", "tyUtil", "tyBase", "tyDialog"]},
        tyNavigation: {deps: ["jquery"]},
        easyModule: {deps: ["jquery"]},
        tyDynamicForm: {deps: ["jquery"]},
        tyAnchor: {deps: ["jquery"]},
        tySegmentation: {deps: ["jquery"]},
        tySteps: {deps: ["jquery"]},
        tyBreadcrumb: {deps: ["jquery"]},
        tyUpload: {deps: []},
        tySelector: {deps: ["jquery", "easyModule"]},
        tyPersonSelector: {deps: ["jquery", "tyUtil", "easyModule", "zTree", "tySelector"]},
        idCardApi: {deps: ["jquery"]}
    }
}), function () {
    document.oncontextmenu = function () {
        return !1
    }, window.UEDITOR_HOME_URL = _path + "/src/bower_components/ueditor/";
    window.UEDITOR_HOME_URL || getUEBasePath()
}(), require(["jquery", "tyBase"], function (n) {
    n(function () {
        n(".hasPermission").each(function (e, s) {
            var r = n(s).attr("permissions");
            if (r) {
                for (var t = r.split("&"), o = !0, c = 0, i = t.length; c < i && (o = n.hasPermission(t[c])); c++) ;
                o || n(s).hide()
            }
        });
        /*var _requestUrl;
        n.ajaxSetup({
            beforeSend:function(event,request,ajaxSetting){
                _requestUrl =request.url
            },
            complete:function(xhr,status){
                if(access(_requestUrl) && xhr.status == 0 && xhr.statusText == "error"){
                    //top.location.reload();
                }
            }
        });*/
        $(document).click(function (ev) {
            try{
                if(parent.app_new.$refs.tag.contextMenuShow){
                    parent.app_new.$refs.tag.closeMenu();
                }
            }catch (e) {

            }
        })

    })

    function access(url) {
        var flag = true;
        switch (url) {
            case "http://127.0.0.1:8080/api/ReadMsg":
                flag = false;
                break;
            default:
                flag = true
                break;
        }
        return flag;
    }
});