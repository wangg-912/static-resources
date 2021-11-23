/**
 * @author wanggang
 * @version 1.0
 * @description 顶层功能调用方法接口
 */
// =====================================================================================================================
// 框架HashMap
// =====================================================================================================================
/** HashMap类
 * @use new HashMap
 * @property {number} size 长度
 * @property {Object} entry 全对象
 * @property {Function(key,value)} put 存
 * @property {Function(key)} get 取
 * @property {Function(key)} remove 删
 * @property {Function} clear 清
 * @property {Function(key)} containsKey 是否存在key
 * @property {Function} containsValue 是否存在Value
 * @property ...
 * */
function HashMap() {
    /** Map 大小 */
    var size = 0;
    /** 对象 */
    var entry = new Object();
    /** 存 */
    this.put = function(key, value) {
        if (!this.containsKey(key)) {
            size++;
        }
        entry[key] = value;
    };
    /** 取 */
    this.get = function(key) {
        if (this.containsKey(key)) {
            return entry[key];
        } else {
            return null;
        }
    };
    /** 删除 */
    this.remove = function(key) {
        if (delete entry[key]) {
            size--;
        }
    };
    /** 清除 */
    this.clear = function() {
        entry = new Object();
        size = 0;
    };
    /** 是否包含 Key */
    this.containsKey = function(key) {
        return (key in entry);
    };
    /** 是否包含 Value */
    this.containsValue = function(value) {
        for (var prop in entry) {
            if (entry[prop] == value) {
                return true;
            }
        }
        return false;
    };
    /** 所有 Value */
    this.values = function() {
        var values = new Array();
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    };
    /** 所有 Key */
    this.keys = function() {
        var keys = new Array();
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    };
    /** Map Size */
    this.size = function() {
        return size;
    };
}
// =====================================================================================================================
// 遮罩
// =====================================================================================================================
/**
 * 打开加载遮罩
 *
 * @param {} maskMsg 遮罩说明（可省略）
 * @param {} timeout 遮罩超时（可省略）
 */
function openMask(option) {
    var option = option || {};
    option.message = option.message || $.fn.tellyesTips.mask.message;
    top.$.blockUI($.extend({},$.blockUI.defaults,option));
}
/** 关闭加载遮罩
 * @param {}
 * */
function closeMask() {
    top.$.unblockUI();
}
(function () {
    top.hashMaps?'':top.hashMaps = new HashMap();
})();