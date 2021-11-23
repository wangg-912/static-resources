/**
 * @author wanggang
 * @date 2018/8/12
 * @version 0.0.1
 * @description 控件方法
 */
// ============jQuery扩展组件===============


define(["jquery","tyUtil"],function ($) {
    $.extend({
        /**
         * 生成带参数的URL
         * @param url
         * @param params
         * @returns {string}
         */
        genParamUrl: function (url, params) {
            url = url.indexOf('?') == -1 ? url + '?' : url + '&';
            var paramArray = [];
            $.each(params, function (k, v) {
                paramArray.push(k + "=" + v);
            });
            return url + paramArray.join("&");
        },
        /**
         * 获取URL参数
         * @param name
         * @returns {*}
         */
        getUrlParam: function (name) {
            var sReg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var sResult = window.location.search.substr(1).match(sReg);
            if (sResult != null)
                return unescape(sResult[2]);
            return null;
        },
        /**
         * 判断是否有指定的权限
         * @param {string} permission
         * @return {Boolean} 返回登录用户是否拥有权限
         * 获取主页的workspaceVo对象
         * 根据用户权限，决定操作按钮的显示还是隐藏
         * 通过permissionsCSS类获取元素，和自定义属性permissions判断该按钮是否隐藏
         */
        hasPermission: function (permission) {
            if (permission && permission.indexOf("$")>0) {
                permission = permission.split(/\$/);
                if (permission.length > 1) {
                    var resourceCode = permission[0];
                    var operationCode = permission[1];
                    if (top.workspaceVo && top.workspaceVo.permissions && top.workspaceVo.permissions[resourceCode]) {
                        var operations = top.workspaceVo.permissions[resourceCode];
                        for (var i = 0; i < operations.length; i++) {
                            if (operations[i] === operationCode) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        },
        searchTree : function (treeId, searchText) {
            var tree = $("#" + treeId);
            var node;
            try {
                node = tree.tree('getRoots')
            } catch (e) {
            }
            try {
                node = tree.treegrid('getRoots')
            } catch (e) {
            }
            for (var i = 0; i < node.length; i++) {
                treeSearchMatcher(node[i], searchText);
            }
            function treeSearchMatcher(node, searchText) {
                var ret = false;
                if (node.children && node.children.length > 0) {
                    for (var i = 0; i < node.children.length; i++) {
                        var f = treeSearchMatcher(node.children[i], searchText);
                        if (f) {
                            ret = true;
                        }
                    }
                }
                if (!ret && node.text.indexOf(searchText) < 0) {
                    if (node.domId) {
                        $("#" + node.domId).hide();
                    } else {
                        $("tr[node-id=" + node.id + "]").hide();
                    }
                } else {
                    if (node.domId) {
                        $("#" + node.domId).show();
                    } else {
                        $("tr[node-id=" + node.id + "]").show();
                    }
                    ret = true;
                }
                return ret;
            }
        }
    });
    /**
     * 将表单序列化为对象格式
     * @return {object} serializeObj 表单数据对象
     */
    $.fn.serializeJson = function () {
        var serializeObj = {};
        $(this.serializeArray()).each(function () {
            serializeObj[this.name] = this.value ? this.value : "";
        });
        return serializeObj;
    };

    /**
     * 将表单序列化为对象格式
     * 同一个name多个值已逗号的方式拼接为字符串
     * @return {object} serializeObj 表单数据对象
     */
    $.fn.serializeJson_joint = $.fn.serializeString = function () {
        var serializeObj = {};
        $(this.serializeArray()).each(function () {
            this.value ? serializeObj[this.name] ? serializeObj[this.name] += ',' + this.value : serializeObj[this.name] = this.value : serializeObj[this.name] = "";
        });
        return serializeObj;
    };
    return $.fn;
})
