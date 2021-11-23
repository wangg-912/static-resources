/**
 * @description 框架加载总体配置
 * @author wanggang
 */
"use strict";
var _path = location.protocol + "//" + location.hostname + ':' + location.port;
var _theme = window.localStorage.getItem('skinTheme') || "light";
require.config({
    urlArgs: +new Date,
    baseUrl: "https://cdn.jsdelivr.net/gh/wangg-912/static-resources/",
    map: { "*": { css: "bower_components/require/css.min" } },
    paths: {
        text: "bower_components/require/text",
        jquery: "bower_components/jquery/jquery.min",
        jqueryui: "bower_components/jquery-ui/jquery-ui",
        countUp: "bower_components/countup/countUp.min",
        bootstrap: "bower_components/bootstrap/3.3.7/js/bootstrap.min",
        popover: "bower_components/bootstrap/3.3.7/plugins/popover",
        tooltip: "bower_components/bootstrap/3.3.7/plugins/tooltip",
        underscore: "bower_components/underscore/underscore",
        easyModule: "bower_components/jquery-easyui-1.8.6/easyloader",
        easyuiBase: "bower_components/jquery-easyui-1.8.6/jquery.easyui.min",
        easyui: "bower_components/jquery-easyui-1.8.6/locale/easyui-lang-zh_CN",
        Ajax: "scripts/services/service_base",
        zTree: "bower_components/zTree_v3/js/jquery.ztree.all",
        blockUI: "bower_components/jquery.blockUI/jquery.blockUI",
        eCharts: "bower_components/echarts/echarts.min",
        'highcharts': "bower_components/highcharts/highcharts",
        'hchart-more': "bower_components/highcharts/highcharts-more",
        'hchart-export': "bower_components/highcharts/modules/exporting",
        'hchart-sunburst': "bower_components/highcharts/modules/sunburst",
        'hchart-funnel': "bower_components/highcharts/modules/funnel",
        'hchart-ie': "bower_components/highcharts/modules/oldie",
        'hchart-grouped': "bower_components/highcharts/grouped-categories",
        'hchart-nodata': "bower_components/highcharts/modules/no-data-to-display",
        'hchart-zh': "bower_components/highcharts/highcharts-zh_CN",
        'highmaps': "bower_components/highmaps/highmaps",
        'hmap-drilldown': "bower_components/highmaps/modules/drilldown",
        'hmap-export': "bower_components/highmaps/modules/exporting",
        'hmap-zh': "bower_components/highmaps/highmaps-zh_CN",
        zeroclipboard: "bower_components/ueditor/third-party/zeroclipboard/ZeroClipboard",
        ueCfg: "bower_components/ueditor/ueditor.config",
        ueditor: "bower_components/ueditor/ueditor.all",
        uploadFile: "bower_components/jquery-uploadfile/ajaxfileupload",
        jqprint: "bower_components/jquery-jqprint/jquery.jqprint-0.3",

        vue: 'bower_components/vue/vue.min',
        vueRouter: 'bower_components/vue/vue-router.min',
        vuex: 'bower_components/vue/vuex.min',
        resolve: 'bower_components/vue/resolve',
        promise: 'bower_components/vue/q',
        "ELEMENT": "bower_components/element-ui/index",
        sortablejs: "bower_components/vue/Sortable.min",
        vuedraggable: "bower_components/vue/vuedraggable.umd.min",
        'vue-cropper': "bower_components/vue/vue-cropper/index.min",
        'vue-json-view': 'bower_components/vue/vue-json-view/index',
        'dtree-table': "bower_components/vue/drag-tree-table/index",
        tyUtil: "scripts/plugins/tyui/ty-util",
        tyBase: "scripts/plugins/js/extends",
        tyDynamicForm: "scripts/widget/tyLayoutit/tyDynamicForm",
        Gridster: "bower_components/jquery-gridster/js/jquery.gridster",
        tyTabs: "scripts/plugins/extends/tyTabs_new",
        tyDialog: "scripts/plugins/extends/tyDialog",
        tySteps: "scripts/plugins/extends/tySteps",
        tyUI: "scripts/plugins/tyui/ty-generation",
        tyGridHeader: "scripts/plugins/extends/tyGridHeader",
        tyValidateRules: "scripts/plugins/extends/tyValidateRules",
        tyNavigation: "scripts/plugins/extends/tyNavigation",
        tyAnchor: "scripts/plugins/extends/tyAnchor",
        tyRate: "scripts/plugins/extends/tyRate",
        tySegmentation: "scripts/plugins/extends/tySegmentation",
        tyDateMonth: "scripts/plugins/extends/tyDateMonth",
        tyBreadcrumb: "scripts/plugins/extends/tyBreadcrumb",
        tyUpload: "scripts/plugins/extends/tyUpload",
        tyPersonSelector: "scripts/plugins/extends/tyPersonSelector",
        tySelector: "scripts/plugins/extends/tySelector",
        idCardApi: "scripts/services/idcard_service"
    },
    shim: {
        jquery: { exports: "$" },
        jqueryui: { deps: ["css!bower_components/jquery-ui/jquery-ui.css", "jquery"] },
        bootstrap: {
            deps: ["css!bower_components/bootstrap/3.3.7/css/bootstrap.css", "jquery"],
            exports: "bootstrap"
        },
        popover: { deps: ["css!bower_components/bootstrap/3.3.7/css/bootstrap.css", "jquery", "tooltip"] },
        underscore: { exports: "_" },
        vueRouter: ['vue'],
        ELEMENT: { deps: ["css!bower_components/element-ui/index." + _theme + ".css"] },
        sortablejs: { deps: ['vue'] },
        vuedraggable: { deps: ['vue', 'sortablejs'] },
        'vue-cropper': { deps: ['vue'] },
        'vue-json-view': { deps: ['vue'] },
        'dtree-table': { deps: ['vue'] },
        easyuiBase: { deps: ["jquery"], exports: "$" },
        easyui: { deps: ["easyuiBase"], exports: "$" },
        Ajax: { deps: ["jquery"] },
        zTree: { deps: ["css!bower_components/zTree_v3/css/metroStyle/metroStyle.css", "jquery"], exports: "$" },
        blockUI: { deps: ["css!scripts/plugins/old/old.style.css", "jquery"] },
        eCharts: { deps: ["jquery"] },
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
        jqprint: { deps: ["jquery"] },
        Gridster: { deps: ["css!bower_components/jquery-gridster/css/gridster", "css!bower_components/jquery-gridster/css/jquery.gridster.css", "jquery"] },
        tyUtil: { deps: ["jquery"] },
        tyBase: { deps: ["jquery", "underscore", "tyUtil"] },
        tyTabs: { deps: ["jquery", "easyModule"] },
        tyDialog: { deps: ["jquery", "underscore", "easyModule", "tyUtil"] },
        tyUI: { deps: ["jquery", "tyUtil", "tyBase", "tyDialog"] },
        tyNavigation: { deps: ["jquery"] },
        easyModule: { deps: ["jquery"] },
        tyDynamicForm: { deps: ["jquery"] },
        tyAnchor: { deps: ["jquery"] },
        tySegmentation: { deps: ["jquery"] },
        tySteps: { deps: ["jquery"] },
        tyBreadcrumb: { deps: ["jquery"] },
        tyUpload: { deps: [] },
        tySelector: { deps: ["jquery", "easyModule"] },
        tyPersonSelector: { deps: ["jquery", "tyUtil", "easyModule", "zTree", "tySelector"] },
        idCardApi: { deps: ["jquery"] }
    }
}), function () {
    document.oncontextmenu = function () {
        return !1
    }, window.UEDITOR_HOME_URL = "/bower_components/ueditor/";
    window.UEDITOR_HOME_URL || getUEBasePath()
}(), require(["jquery", "tyBase"], function (n) {
    n(function () {
        n(".hasPermission").each(function (e, s) {
            var r = n(s).attr("permissions");
            if (r) {
                for (var t = r.split("&"), o = !0, c = 0, i = t.length; c < i && (o = n.hasPermission(t[c])); c++);
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
            try {
                if (parent.app_new.$refs.tag.contextMenuShow) {
                    parent.app_new.$refs.tag.closeMenu();
                }
            } catch (e) {

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