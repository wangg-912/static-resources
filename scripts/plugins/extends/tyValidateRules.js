define('tyValidateRules',["jquery"],function ($) {
    if(!$.fn.validatebox){
        require(["easyModule"],function (eloader) {
            using('textbox',function () {
                _extend();
            })
        })
    }else{
        _extend();
    }
    function _extend() {
        $.extend($.fn.validatebox.defaults.rules, {
            ip: {
                validator: function (value) {
                    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;
                    if (re.test(value)) {
                        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
                            return true;
                    }
                    return false;
                },
                message: $.fn.__ty__.error.ip
            },
            phoneRex: {
                validator: function (value) {
                    var rex = /^1[3-8]+\d{9}$/;
                    var rex2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                    return (rex.test(value) || rex2.test(value));
                },
                message: '请输入正确的电话号码'
            },
            /**
             *
             */
            number: {
                validator: function (value) {
                    var re = /^[0-9]*$/g;
                    return re.test(value);
                },
                message: $.fn.__ty__.error.number
            },
            number2: {
                validator: function (value) {
                    var re = /^[0-9]*$/g;
                    return re.test(value);
                },
                message: $.fn.__ty__.error.number
            },
            // 验证输入内容是否为全空格
            isAllSpace: {
                validator: function (value) {
                    var reg = /^\s+$/;
                    return !reg.test(value);
                },
                message: "输入内容不能为空格"
            },
            maxLength: {
                validator: function(value, param){
                    return param[0] >= value.length;
                },
                message: '请输入最大{0}位字符.'
            },
            date:{
                validator: function (value) {
                    var reg = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
                    return reg.test(value);
                },
                message: "输入正确的日期值."
            },
            datetime:{
                validator:function (value) {
                    var reg = /((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})\/(((0[13578]|1[02])\/(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)\/(0[1-9]|[12][0-9]|30))|(02\/(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))\/02\/29))\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
                    return reg.test(value);
                },
                message: "输入正确的日期时间值."
            },
            time:{
                validator:function (value) {
                    var reg = /([0-9]{1,2}:[0-9]{1,2})?(:[0-5]{0,1}[0-9]{1})?/;
                    return reg.test(value);
                },
                message: "输入正确的时间值."
            }
        });
    }
    return $;
})
