/**
 * @author  LYM
 * @date 2018/10/18
 * @version 0.0.1
 * @description 穿梭框组件
 */
define("tySelector", ["jquery", "underscore", "easyModule"], function ($, _, easyModule) {
    /**
     * 组件入口方法
     * @param options 配置对象或方法名
     * @param params 方法调用的参数
     */
    $.fn.tySelector = function (options, params) {
        if (typeof options === "string") {
            return $.fn.tySelector.methods[options](this, params);
        }
        this.data("tySelector", preOptions(options || {}, this));
        init(this);
        return this;
    };

    /**
     *  * 预处理参数
     * @param options
     * decription 对单选、是否展示复选框进行处理
     * 删除因为单选而删除的勾选框
     * 增加当配置为单选时，将表格的两个全部移动的按钮删除
     */
    function preOptions(options, jq) {
        var checkBoxJson = {
            field: 'id',
            title: 'ck',
            align: 'left',
            checkbox: true
        };
        var datas = jq.data("tySelector");
        var idstr = +(new Date());
        options = $.extend({}, $.fn.tySelector.defaults, options);
        !options.sourceGridId && (options.sourceGridId = 'source' + idstr);
        !options.targetGridId && (options.targetGridId = 'target' + idstr);
        !options.sourceConfig.columns[0][0].checkbox && options.sourceConfig.columns[0].unshift(checkBoxJson);
        !options.targetConfig.columns[0][0].checkbox && options.targetConfig.columns[0].unshift(checkBoxJson);
        if (options.singleSelect && options.singleSelect !== false) {
            options.isAllOp = false;
            options.sourceConfig.singleSelect = true;
            options.targetConfig.singleSelect = true;
        }
        options.targetConfig = extendObj(options, options.targetConfig);
        options.sourceConfig = extendObj(options, options.sourceConfig);
        return datas ? $.extend(datas.options, options) : {options: options}
    }

    /**
     * 对配置对象中的targetConfig和sourceConfig处理
     * @param options 配置对象
     * @param config 需要合并的表格配置
     * @decription
     * 增加两个表格的禁用样式，
     * 增加禁用时的勾选禁用
     */
    function extendObj(options, config) {
        return $.extend({
            idFiled: options.eleAttr,
            fit: true,
            border: false,
            fitColumns: true,
            striped: true,
            nowrap: false,
            scrollbarSize: 0,
            rowStyler: function (index, row) {
                if (options.forbidElement && row[options.forbidElement]) {
                    return 'color:#dfdfdf';
                }
            },
            onBeforeCheck: function (index, row) {
                if (options.forbidElement && row[options.forbidElement]) {
                    return false;
                }
                return true
            },
            onBeforeSelect: function (index, row) {
                if (options.forbidElement && row[options.forbidElement]) {
                    return false;
                }
                return true
            }
        }, config);
    }

    /**
     * 初始化
     * @param jq
     * return {*}
     */
    function init(jq) {
        using(["datagrid"], function () {
            var options = jq.data("tySelector").options;
            return render(jq, options);
        });
    }

    /**
     * 渲染函数
     * @param jq
     * @param options
     * @decription 修改成使用underscore模板
     * 修改异步创建改为同步创建表格根节点
     * 修改按钮绑定事件在render中触发
     */
    function render(jq, options) {
        var template = _.template("" +
            "<div class=\"<%=data.fitLayout.isFit && data.fitLayout.fitColumn.length?'ty-shuttle-height col-xs-' + data.fitLayout.fitColumn[0]:'ty-shuttle-left'%> ty-shuttle-border\">" +
            "   <div id=\"<%=data.sourceGridId%>\"></div>" +
            "</div>" +
            "<div class=\"<%=data.fitLayout.isFit && data.fitLayout.fitColumn.length?'ty-shuttle-height col-xs-' + data.fitLayout.fitColumn[1]:'ty-shuttle-center'%>\">" +
            "   <ul class='ty-shuttle-wrap' id='btnWrap'>" +
            "       <li>" +
            "           <span id='shuttleAddOne' class='fa-button'>" +
            "                 <i class='icon iconfont icon-jiantouzuo arrow'></i>" +
            "           </span>" +
            "       </li>" +
            "<%if(data.isAllOp){%>" +
            "       <li>" +
            "           <span id='shuttleAddAll' class='fa-button'>" +
            "                 <i class='icon iconfont icon-doubleangleright arrow'></i>" +
            "           </span>" +
            "       </li>" +
            "<%}%>" +
            "       <li>" +
            "           <span id='shuttleReduceOne' class='fa-button'>" +
            "                 <i class='icon iconfont icon-jiantouyou arrow'></i>" +
            "           </span>" +
            "       </li>" +
            "<%if(data.isAllOp){%>" +
            "       <li>" +
            "           <span id='shuttleReduceAll' class='fa-button'>" +
            "                 <i class='icon iconfont icon-doubleangleleft arrow'></i>" +
            "           </span>" +
            "       </li>" +
            "<%}%>" +
            "   </ul>" +
            "</div>" +
            "<div class=\"<%=data.fitLayout.isFit && data.fitLayout.fitColumn.length?'ty-shuttle-height col-xs-' + data.fitLayout.fitColumn[2]:'ty-shuttle-right'%> ty-shuttle-border\">" +
            "   <div id=\"<%=data.targetGridId%>\"></div>" +
            "</div>");

        jq.empty().append(template({
            data: options
        }));
        createTargetGrid(jq, options.targetGridId, options.targetConfig);
        createSourceGrid(jq, options.sourceGridId, options.sourceConfig);
        initBindClick(jq);
    }

    /**
     * 渲染源表格
     * @param jq
     * @param sourceGridId 源表格id（动态生成）
     * @param config 源表格配置
     */
    function createSourceGrid(jq, sourceGridId, config) {
        var options = jq.data("tySelector").options;
        /**
         * 对源表格loadFilter和onDblClickRow事件进行处理
         */
        config.onDblClickRow = function (index, row) {
            if (options.forbidElement && row[options.forbidElement]) {
                return false
            }
            opGridData(options, [row], 'ADD');
        };
        config.loadFilter = function (data) {
            if ($.isArray(data)) {
                options.localData = toContrast(options, data, options.targetData);
                return data
            } else {
                if (data.success) {
                    return toContrast(options, ($.isArray(data.content) ? data.content : data.content.rows || []), options.targetData) || [];
                } else {
                    $.message({type: "warning", text: data.message});
                }
            }
        }
        $("#" + sourceGridId).datagrid(config);
    }

    /**
     * 渲染源已选表格
     * @param jq
     * @param targetGridId 已选表格id （动态生成）
     * @param config 已选表格配置
     */
    function createTargetGrid(jq, targetGridId, config) {
        var options = jq.data("tySelector").options;
        /**
         * 对已选表格data数据和onDblClickRow事件进行处理
         */
        config.data ? options.targetData = config.data : config.data = options.targetData;
        config.onDblClickRow = function (index, row) {
            if (options.forbidElement && row[options.forbidElement]) {
                return false
            }
            opGridData(options, [row], '');
        };
        $("#" + targetGridId).datagrid(config);
    }

    /**
     * 为操作按钮绑定事件
     * @param jq
     */
    function initBindClick(jq) {
        var options = jq.data("tySelector").options;
        jq.find("#shuttleAddOne").off().on("click", function (event) {
            event.stopPropagation();
            handleRole(options, options.sourceGridId, "ADD", false);
        });
        jq.find("#shuttleAddAll").off().on("click", function (event) {
            event.stopPropagation();
            handleRole(options, options.sourceGridId, "ADD", true);
        });
        jq.find("#shuttleReduceOne").off().on("click", function (event) {
            event.stopPropagation();
            handleRole(options, options.targetGridId, "reduce", false);
        });
        jq.find("#shuttleReduceAll").off().on("click", function (event) {
            event.stopPropagation();
            handleRole(options, options.targetGridId, "reduce", true);
        });
    }

    /**
     * 穿梭事件
     * @param options
     * @param tableId 被选择数据表格id
     * @param state 增加或者删除
     * @param isAll 是否全选
     */
    function handleRole(options, tableId, state, isAll) {
        var $idSelect = $("#" + tableId);
        if (isAll) {
            $idSelect.datagrid("checkAll");
        }
        var gridRows = $idSelect.datagrid('getChecked');
        opGridData(options, gridRows, state);
    }

    /**
     * 根据穿梭事件类型处理数据并刷新
     * @param options
     * @param selectedRows 被选择的数据
     * @param state 增加或者删除
     * @description 四个按钮的事件和搜索的集成
     * 增加了单选时数据移动的逻辑，
     * 增加了禁用数据移动的逻辑判断，
     */
    function opGridData(options, selectedRows, state) {
        var $sourceTable = $("#" + options.sourceGridId),
            $targetTable = $("#" + options.targetGridId),
            len = selectedRows.length;
        if (!len) {
            $.message({type: "warning", text: '请选择要操作的数据！'});
            return false
        }
        if (options.forbidElement && isForbid(selectedRows, options.forbidElement)) {
            $.message({type: "warning", text: '存在禁止操作的数据！'});
            return false
        }

        if (options.singleSelect && options.singleSelect !== "false" && !options.localData) {
            options.targetData = []
        }

        options.targetData = state === 'ADD' ? options.targetData.concat(selectedRows) : toContrast(options, options.targetData, selectedRows);

        // 如果源表格是加载的本地数据
        if (options.localData) {
            if (state !== 'ADD') {
                options.localData = options.localData.concat(selectedRows);
            } else {
                if (options.singleSelect && options.singleSelect !== "false") {
                    if (!isForbid(options.targetData, options.forbidElement)) {
                        options.localData = options.localData.concat(options.targetData);
                        options.targetData = selectedRows;
                    } else {
                        $.message({type: "error", text: '已勾选的或右侧表格存在禁用数据！'});
                        return false
                    }
                }
            }
            $sourceTable.datagrid("loadData", options.localData);
        } else {
            $sourceTable.datagrid("reload");
        }
        // 如果是在条件搜索的情况下只显示条件搜索后的数据
        $targetTable.datagrid("loadData", options.searchTargetValue ? findSearchData(options) : options.targetData);
        $sourceTable.datagrid('clearSelections');
        $targetTable.datagrid('clearSelections');
        return true
    }

    /**
     *  从一个数组中检测是否有禁用项
     * @param arr
     * @param forbid
     * @description 增加了检测禁用项的逻辑
     */
    function isForbid(arr, forbid) {
        for (var d = 0, len = arr.length; d < len; d++) {
            if (arr[d][forbid]) {
                return true
            }
        }
        return false
    }

    /**
     *  搜索目标表格数据
     * @param jq
     *  @param params
     */
    function searchTarget(jq, params) {
        var options = jq.data("tySelector").options;
        options.searchTargetValue = '';
        if ($.isArray(params.searchElement) && params.searchElement.length && params.value) {
            options.searchTargetValue = params.value;
            options.searchTargetElement = params.searchElement;
            reloadTarget(jq, findSearchData(options));
        } else {
            reloadTarget(jq, options.targetData);
        }
    }

    /**
     *  根据条件筛选出相应的目标表格数据
     *  @param options
     */
    function findSearchData(options) {
        var newValue = options.searchTargetValue;
        var result = options.targetData.filter(function (item) {
            if ((item[options.searchTargetElement[0]].indexOf(newValue) > -1) || (item[options.searchTargetElement[1]].indexOf(newValue) > -1)) {
                return true
            } else {
                return false
            }
        });
        return result || []
    }

    /**
     * 去重
     * @param options
     * @param oldArr 源数据
     * @param selectedArr 需去重数据
     */
    function toContrast(options, oldArr, selectedArr) {
        if (oldArr.length > 0) {
            for (var i = 0; i < oldArr.length; i++) {
                for (var j = 0, len2 = selectedArr.length; j < len2; j++) {
                    if (oldArr[i][options.eleAttr] && selectedArr[j][options.eleAttr]) {
                        if (oldArr[i][options.eleAttr] === selectedArr[j][options.eleAttr]) {
                            oldArr.splice(i, 1);//如果重复删除对应下标的元素
                            i = i - 1;
                            break;
                        }
                    }
                }
            }
        }
        return oldArr || []
    }

    /**
     * jq
     * 根据不同参数重新新渲染表格
     * @param newParams 接口参数
     */
    function reload(jq, newParams) {
        var options = jq.data("tySelector").options;
        if (options.sourceConfig.url && ($.isPlainObject(newParams) || !newParams)) {
            $("#" + options.sourceGridId).datagrid("reload", newParams);
        }
    }

    /**
     * jq
     * 重新加载已选列表，只针对加载本地数据
     * @param newData 重新加载的列表数据
     */
    function reloadTarget(jq, newData) {
        var options = jq.data("tySelector").options;
        $("#" + options.targetGridId).datagrid("loadData", newData);
    }

    /**
     * 获取已选表格中数据
     * @param jq
     * @return array
     */
    function getData(jq) {
        var options = jq.data("tySelector").options,
            rows = $("#" + options.targetGridId).datagrid("getRows");
        return rows;
    }

    /**
     * @param jq
     * 获取源表格id
     */
    function getSourceId(jq) {
        return jq.data("tySelector").options.sourceGridId;
    }

    /**
     *  获取已选表格id
     * @param jq

     */
    function getTargetId(jq) {
        return jq.data("tySelector").options.targetGridId;
    }

    /**
     *  清除可选表格内容
     * @param jq
     */
    function cleanGrid(jq) {
        var sourceTableId = jq.data("tySelector").options.sourceGridId;
        $("#" + sourceTableId).datagrid("loadData", []);
    }

    /**
     * tySelector默认配置对象
     */
    $.fn.tySelector.defaults = {
        sourceConfig: '',
        targetConfig: '',
        targetData: [],
        sourceGridId: '',
        targetGridId: '',
        eleAttr: 'id',
        isAllOp: true,
        localData: '',
        singleSelect: false,
        fitLayout: {
            // isFit:false,//是否按照bootstrap栅格布局，如果为true则fitColumn属性必填
            // fitColumn:[6,2,6] //左中右bootstrap栅格布局比例为 6 2 6
        },
        forbidElement: '',
        searchTargetValue: '',
        searchTargetElement: [],
        searchTargetData: []
    };

    /**
     * tySelector方法
     */
    $.fn.tySelector.methods = {
        "getData": function (jq) {
            return getData(jq)
        },
        "getSourceId": function (jq) {
            return getSourceId(jq)
        },
        "getTargetId": function (jq) {
            return getTargetId(jq)
        },
        "reload": function (jq, params) {
            return reload(jq, params);
        },
        "reloadTarget": function (jq, data) {
            return reloadTarget(jq, data);
        },
        "searchTarget": function (jq, params) {
            return searchTarget(jq, params);
        },
        "cleanGrid": function (jq) {
            return cleanGrid(jq);
        }
    };
    return $;
});