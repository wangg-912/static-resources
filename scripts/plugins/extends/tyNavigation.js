/**
 * @author yel
 * @date 2018/8/27
 * @version 0.0.1
 * @description 导航控件
 */
;(function ($) {
    "use strict";
    var _itemDatas = [];

    /**
     * 入口函数
     * @param $
     */
    function install($) {
        /**
         * 初始化导航
         * @param opt
         * @param $this
         */
        function init(opt, $this) {
            var defaultOptions = {
                cls: "light" || "dark",
                collapsed: false,
                width: "100%",
                height: "auto",
                expandAllFlg: false,
                data: [],
                itemEvent: function (itemData) {
                    console.log(itemData, "You didn't set itemEvent!");
                }
            };
            $.extend(defaultOptions, opt);
            $this.data("navOpt", defaultOptions);
            render(defaultOptions, $this);
            eventInit($this, defaultOptions);
        }

        /**
         * 渲染导航
         * @param opt
         * @param $this
         */
        function render(opt, $this) {
            var menuStyle = opt.collapsed ? "ty-menu-inline-collapsed ty-menu-vertical" : "ty-menu-inline";
            var _html = '<ul class="ty-menu ty-menu-' + opt.cls + ' ty-menu-root ' + menuStyle + '" role="menu" style="width: ' + opt.width + '; height:' + opt.height + '; overflow:visible;">';
            if (opt.data.length) {
                _html += traversalData(opt.data, "", opt.expandAllFlg, opt.collapsed, "", 1);

            } else {
                _html = "<div style='padding:15px;'>暂无数据！</div>";
            }
            $this.html(_html);
        }

        /**
         * 遍历导航数据，生成html字符串
         * @param data 导航数据
         * @param _ht html字符串
         * @param expandCls 是否展开标识
         * @param renderChild 是否是处理children标识
         * @param tier 层级
         * @returns {*} 返回html字符串
         */
        function traversalData(data, _ht, expandCls, isCollapse, renderChild, tier) {
            var expandLiCls, expandUlCls;
            var menuStyle = isCollapse ? "ty-menu-inline-collapsed ty-menu-vertical" : "ty-menu-inline";
            if (expandCls) {
                expandLiCls = "ty-menu-submenu-open";
                expandUlCls = "";
            } else {
                expandLiCls = "";
                expandUlCls = "ty-menu-hidden";
            }
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].children&&data[i].children.length) {
                    if (tier === 1 && i == 0) {
                        expandLiCls = "ty-menu-submenu-open";
                        expandUlCls = "";
                    }else{
                        expandLiCls = "";
                        expandUlCls = "ty-menu-hidden";
                    }
                    _ht += '<li class="ty-menu-submenu ty-menu-submenu-inline ' + expandLiCls + '" role="menuitem" style="position: relative;">' +
                        '<div class="ty-menu-submenu-title"  style="padding-left: ' + tier * 24 + 'px;" data-id="' + data[i].id + '">' +
                        '<span>';
                    if (data[i].iconCls) {
                        _ht += '<i class="' + data[i].iconCls + '"></i>';
                    } else {
                        _ht += '<i class="iconfont no-icon"></i>';
                    }
                    _ht += '<span>' + data[i].text + '</span>' +
                        '</span>' +
                        '<i class="ty-menu-submenu-arrow"></i>' +
                        '</div>' +
                        '<ul class="ty-menu ty-menu-sub ' + menuStyle + ' ' + expandUlCls + '" role="menu">';
                    _ht = traversalData(data[i].children, _ht, expandCls, isCollapse, "renderChild", tier + 1);
                } else {
                    _itemDatas.push(data[i]);
                    _ht += '<li class="ty-menu-item" role="menuitem" style="padding-left: ' + tier * 24 + 'px;" data-id="' + data[i].id + '">';
                    if (data[i].iconCls) {
                        _ht += '<i class="' + data[i].iconCls + '"></i>';
                    } else {
                        _ht += '<i class="iconfont no-icon"></i>';
                    }
                    _ht += '<span>' + data[i].text + '</span>' +
                        '</li>';
                }
                if (i === l - 1) _ht += "</ul>";
                if (i === l - 1 && renderChild) _ht += "</li>";
            }
            return _ht;
        }

        /**
         * 事件初始化
         * @param $this
         * @param opt
         */
        function eventInit($this, opt) {
            navToggle($this);
            itemClickEvent($this, opt);
        }

        /**
         * 点击菜单item，设置样式
         * @param $this
         */
        function navToggle($this) {
            $this.off("click", '[role="menuitem"]').on("click", '[role="menuitem"]', function () {
                var target = $(this);
                $this.find('[role="menuitem"]').not(target).removeClass("ty-menu-item-selected");
                if (target.hasClass("ty-menu-submenu")) {
                    target.toggleClass("ty-menu-submenu-open");
                    target.hasClass("ty-menu-submenu-open") ?
                        target.children(".ty-menu-sub").removeClass("ty-menu-hidden") :
                        target.children(".ty-menu-sub").addClass("ty-menu-hidden")
                }
                if (target.hasClass("ty-menu-item")) {
                    target.addClass("ty-menu-item-selected");
                }
                return false;
            });
        }

        /**
         * 叶子节点点击事件
         * @param $this
         * @param opt
         */
        function itemClickEvent($this, opt) {
            $this.off("click", ".ty-menu-item").on("click", ".ty-menu-item", function () {
                var dataId = $(this).attr("data-id");
                var itemData = getItemDataById(dataId);
                opt.itemEvent(itemData)
            });
        }

        /**
         * 根据id获取叶子节点数据
         * @param id
         * @returns {*}
         */
        function getItemDataById(id) {
            for (var i = 0, l = _itemDatas.length; i < l; i++) {
                if (_itemDatas[i].id == id) {
                    return _itemDatas[i];
                }
            }
            return {};
        }

        /**
         * 根据id模拟点击item
         * @param id
         */
        function itemTriggerClickById(id, $this) {
            var node = $("[data-id='" + id + "']");
            if (node.length) {
                node.parentsUntil($this, "li.ty-menu-submenu").addClass("ty-menu-submenu-open");
                node.parentsUntil($this, "ul.ty-menu").removeClass("ty-menu-hidden");
                node.trigger("click");
            } else {
                throw "Not find the node";
            }
        }

        /**
         * 展开导航所有节点
         * @param $this 导航容器
         */
        function expandAllItems($this) {
            $this.find("li.ty-menu-submenu").addClass("ty-menu-submenu-open");
            $this.find("ul.ty-menu").not(".ty-menu-root").removeClass("ty-menu-hidden");
        }

        /**
         * 加载数据(已初始化完毕的前提下)
         * @param data {array} 需要加载的数据
         * @param $this
         * @returns {$} 返回当前节点jq对象
         */
        function loadData(data, $this) {
            var opt;
            if (({}).toString.call(data) !== "[object Array]") {
                throw "The second param must be a array!";
            }
            opt = $this.data("navOpt");
            opt.data = data;
            render(opt, $this);
        }

        /**
         * 设置菜单合并|展示
         * @param isCollapsed
         * @param jq
         * @private
         */
        function _setNavCollapsed(isCollapsed, jq) {
            var options = jq.data("navOpt");
            isCollapsed ?
                jq.find('[role=menu]').removeClass("ty-menu-inline").addClass("ty-menu-inline-collapsed ty-menu-vertical") :
                jq.find('[role=menu]').removeClass("ty-menu-inline-collapsed ty-menu-vertical").addClass("ty-menu-inline");
            options.collapsed = isCollapsed;
        }

        /**
         * 创建导航 || 调用导航相关方法
         * @param opt 配置参数对象或方法
         * @description 配置参数对象 {cls:风格, width：宽, height:高, expand:是否展开，data：数据，itemEvent：叶子节点点击事件}
         * @description 方法 string "itemTriggerClickById" || "expandAllItems" || "loadData" || "getItemDataById"
         * @param params 调用方法时，传递的对应参数
         * @private
         */
        $.fn.nav = function (opt, params) {
            if (({}).toString.call(opt) === "[object Object]") {
                init(opt, this);
            } else if (typeof opt === "string") {
                switch (opt) {
                    case "itemTriggerClickById":
                        itemTriggerClickById(params, this);
                        break;
                    case "expandAll":
                        expandAllItems(this);
                        break;
                    case "loadData":
                        loadData(params, this);
                        break;
                    case "getItemDataById":
                        return getItemDataById(params);
                        break;
                    case "setNavCollapsed":
                        return _setNavCollapsed(params, this);
                        break;
                    default:
                        throw "Don't find the function";
                }
            }
            return this;
        }
    }
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], install);
    } else {
        install(jQuery);
    }
})(jQuery);