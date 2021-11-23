/**
 * @author wanggang
 * @date 2018/8/23
 * @version 0.0.1
 * @description 扩展textbox组件 使用场景为输入框必填的情况|校验框有效的情况
 */
;(function () {
    function setup($) {
        $.fn.validatebox.defaults = $.extend({},$.fn.validatebox.defaults,{tipPosition:"bottom"});
        /**
         * 为表单验证扩展
         */
        $.extend($.fn.validatebox.defaults.rules, {
            ip_check : {
                validator : function(value) {
                    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g
                    if (re.test(value)) {
                        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
                            return true;
                    }
                    return false;
                },
                message : $.fn.__ty__.error.ip
            },
            all_str : {
                validator : function(value, param) {
                    var min_length = param[0];
                    var max_length = param[1];
                    if (value.length < min_length || value.length > max_length) {
                        return false;
                    } else {
                        return true;
                    }
                },
                message : $.fn.__ty__.error.all_str
            },

            text_cn_en_str : {
                validator : function(value, param) {
                    var min_length = param[0];
                    var max_length = param[1];
                    if (value.length < min_length || value.length > max_length) {
                        return false;
                    }
                    var pattern = /^[A-Za-z0-9_\-\u4E00-\u9FA5\uFE30-\uFFA0\u3002\uFF1B\uFF0C\uFF1A\u201C\u201D\uFF08\uFF09\u3001\uFF1F\u300A\u300B]+$/;
                    if (pattern.test(value)) {
                        return true;
                    };
                    return false;
                },
                message : $.fn.__ty__.error.text_str
            },

            phone_str : {
                validator : function(value) {
                    var pattern = /(^\d{3}\-\d{8}$)|(^\d{4}\-\d{7}$)|(^\d{11}$)/;
                    if (pattern.test(value)) {
                        return true;
                    };
                    return false;
                },
                message : $.fn.__ty__.error.phone_str
            },
            minLength : {
                validator : function(value, param) {
                    return value.length >= param[0];
                },
                message : $.fn.__ty__.error.min_length
            },
            maxLength : {
                validator : function(value, param) {
                    return value.length <= param[0];
                },
                message : $.fn.__ty__.error.max_length
            },
            equals : {
                validator : function(value, param) {
                    return value == $(param[0]).val();
                },
                message : $.fn.__ty__.error.equals
            }
        });
    }
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }
})();