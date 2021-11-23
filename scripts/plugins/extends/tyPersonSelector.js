/**
 * @author  LYM
 * @date 2018/11/27
 * @version 0.0.1
 * @description 人员选择器组件，由穿梭框组件扩展。
 */
define("tyPersonSelector", ["tySelector", "zTree",  "tyUtil"], function (ts, zTree,tu) {
    /**
     * 组件入口方法
     * @param options
     * @param params
     * @return {*}
     */
    $.fn.tyPersonSelector = function (options, params) {
        if (typeof options == "string") {
            return $.fn.tyPersonSelector.methods[options](this, params);
        }
        this.data("tyPersonSelector", preOptions(options || {}, this));
        init(this);
        return this;
    };

    /**
     *  * 预处理参数
     * @param options
     * decription 对单选、是否展示复选框进行处理
     * @decription 将所有的配置处理在这个函数
     */
    function preOptions(options, jq) {
        var datas = jq.data("tyPersonSelector");
        return datas ? $.extend(datas.options, options) :{options: $.extend({}, $.fn.tyPersonSelector.defaults, $.fn.tyPersonSelector.parseOptions(jq, options))};
    }

    /**
     * 初始化
     * @param jq
     */
    function init(jq) {
        using(['datagrid', 'searchbox'], function () {
            var options = jq.data("tyPersonSelector").options;
            return render(jq, options);
        });
    }

    /**
     * 渲染
     * @param jq
     * @param options
     * @returns {*}
     */
    function render(jq, options) {
        var template = _.template("" +
            "<div class='row ty-personSelector-commom-height' style='padding-right: 3px;'>" +
            "<%if(data.treeConfig && data.treeConfig.treeData && data.treeConfig.treeData.__proto__ === Array.prototype){%>"+
            "   <div class='col-xs-3 col-sm-3 ty-personSelector-commom-height'>" +
            "<%if(data.treeTitle){%>" +
            "       <p style='line-height: 43px;margin: 0;padding-left: 6px;border-bottom: 1px solid #dfdfdf;'><%=data.treeTitle%></p>" +
            "<%}%>" +
            "       <div id='shuttleDepartment' class='ztree ty-personSelector-contentBox' style='width:100%'></div>" +
            "   </div>" +
            "<%}%>"+
            "   <div class=\"<%=data.treeConfig && data.treeConfig.treeData && data.treeConfig.treeData.__proto__ === Array.prototype?'col-xs-9 col-sm-9 col-md-9':'col-xs-12 col-sm-12  col-md-12'%> ty-personSelector-commom-height\">" +
            "       <div id='shuttleGridBox' style='position:relative;width: 100%;height: 100%'></div>" +
            "   </div>" +
            "<div/>" +
            "<div class='datagrid-toolbar' id='targetGridId'>" +
            "   <form class='ty-form'>" +
            "       <table class='grid-toolbar alone'>" +
            "           <tr>" +
            "               <td><label><%=data.targetTitle%></label></td>" +
            "           </tr>" +
            "       </table>" +
            "   </form>" +
            "</div>" +
            "<%if(data.showToolbar){%>"+
            "<div class='datagrid-toolbar' id='sourceGridId'>" +
            "   <form class='ty-form'>" +
            "       <table class='grid-toolbar alone'>" +
            "           <tr>" +
            "               <td><input id='shuttleToSearch' type='text'/></td>" +
            "           </tr>" +
            "       </table>" +
            "   </form>" +
            "</div>" +
            "<%}%>");

        jq.empty().append(template({
            data: options
        }));

        (options.treeConfig && options.treeConfig.treeData && options.treeConfig.treeData.__proto__ === Array.prototype) && createOriTree(jq, options);
        createSeacrh(jq, options);
        createShuttle(jq, options);
        return this;
    }

    /**
     * 初始化部门树
     * @param jq
     * @param options
     */
    function createOriTree(jq, options) {
        var treeSetting = {
            view: {
                showIcon: true,
                showLine: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    options.gridParams.treeNode = treeNode;
                    if (options.showToolbar) {
                        jq.find("#shuttleToSearch").searchbox("clear");
                        options.gridParams.searchName = '';
                    }
                    refreshSourceGrid.apply(options, [jq, options.gridParams]);
                }
            }
        };
        options.treeSetting = $.extend({}, treeSetting, options.treeConfig.setting);
        $.fn.zTree.init(jq.find("#shuttleDepartment"), options.treeSetting, options.treeConfig.treeData);
        var treeObj = $.fn.zTree.getZTreeObj("shuttleDepartment");
        // 触发树加载完成事件
        if (options.treeConfig.treeLoadSuccess) {
            options.treeConfig.treeLoadSuccess(treeObj, options.treeConfig.treeData);
        }
    }

    /**
     * 初始化搜索框
     * @param jq
     * @param options
     */
    function createSeacrh(jq, options) {
        if (options.showToolbar) {
            jq.find("#shuttleToSearch").searchbox({
                prompt: options.searchPrompt,
                validType: 'nameLength[0,20]',
                searcher: function (value, name) {
                    options.gridParams.searchName = value;
                    refreshSourceGrid.apply(options, [jq, options.gridParams]);
                }
            });
        }
    }

    /**
     * 初始化穿梭框
     * @param jq
     * @param options
     */
    function createShuttle(jq, options) {
        options.sourceConfig.toolbar = "#sourceGridId";
        options.targetConfig.toolbar = "#targetGridId";
        jq.find("#shuttleGridBox").tySelector({
            //左边列表配置
            "sourceConfig": options.sourceConfig,
            //右边列表配置
            "targetConfig": options.targetConfig,
            //左边和右边列表所需挂载的id，可以不写，组件自动生成
            "sourceGridId": options.sourceGridId,
            "targetGridId": options.targetGridId,
            //每条数据的唯一标志，可以不写，默认为id
            "eleAttr": options.eleAttr,
            //是否显示双箭头按钮,默认可全选
            "isAllOp": options.isAllOp,
            "singleSelect": options.singleSelect
        });
    }

    /**
     *  刷新可选列表
     *  @param jq
     *  @return {jQuery}
     */
    function refreshSourceGrid(jq, _params) {
        return jq.find("#shuttleGridBox").tySelector("reload", this.beforeReload(_params));
    }

    /**
     * 获取已选列表数据
     * @param jq
     * @return array
     */
    function getData(jq) {
        return jq.find("#shuttleGridBox").tySelector("getData");
    }

    /**
     * 刷新组织架构树
     * @param jq
     * @param nodes
     * @return {*}
     */
    function refreshTree(jq, nodes) {
        var options = jq.data("tyPersonSelector").options;
        return $.fn.zTree.init(jq.find("#shuttleDepartment"), options.treeSetting, nodes);
    }

    /**
     * 预处理机制
     * @param jq
     * @param options
     * @returns {*}
     */
    $.fn.tyPersonSelector.parseOptions = function (jq, options) {
        return $.extend({}, options);
    };
    /**
     * tyPersonSelector的默认配置对象
     * @type {{treeData: string, showToolbar: string, sourceConfig: string, targetConfig: string, showTree: boolean, sourceGridId: string, targetGridId: string, eleAttr: string, isAllOp: boolean, treeTitle: string, targetTitle: string, searchPrompt: string, singleSelect: boolean, gridParams: {treeNode: string, searchName: string, status: number}}}
     */
    $.fn.tyPersonSelector.defaults = {
        // treeConfig: {  //树需要配置
        //     treeData: [],//树列表所需数据
        //     setting: {}//树列表所需配置，不必填
        // },
        sourceConfig: '',//左边列表,
        targetConfig: '',//右边列表配置,
        // 以下为选填配置
        showToolbar: '',//是否展示搜索框,
        // showTree:true, // 是否显示树
        sourceGridId: '',//左边列表所需挂载的id，可以不写，组件自动生成
        targetGridId: '',//右边列表所需挂载的id，可以不写，组件自动生成
        eleAttr: 'id', //每条数据的唯一标志，可以不写，默认为id
        isAllOp: true,  //是否显示双箭头按钮
        treeTitle: '',    //树上标题
        targetTitle: '已选人员',//已选列表标题
        searchPrompt: '输入姓名/学号',// 搜索框提示,
        singleSelect: false,
        gridParams: {"treeNode": "", "searchName": "", "status": 0}
    };
    /**
     * tyPersonSelector方法
     * @type {{getData: (function(): *), refreshSourceGrid: (function(*=): void), refreshTree: (function(*=): void)}}
     */
    $.fn.tyPersonSelector.methods = {
        /**
         * 获取已选列表数据
         *  @param jq
         */
        "getData": function (jq) {
            return getData(jq);
        },
        /**
         * 刷新时需要的参数
         * @param jq
         * @param _param
         */
        "refreshSourceGrid": function (jq, _param) {
            return refreshSourceGrid(jq, _param);
        },
        /**
         * @param jq
         * @param 刷新树
         */
        "refreshTree": function (jq, nodes) {
            return refreshTree(jq, nodes);
        }
    };
    return $;
});