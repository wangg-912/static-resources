/**
 * @author  LYM
 * @date 2018/11/16
 * @version 0.0.1
 * @description 由datebox扩展
 */
define('tyDateMonth',["jquery"],function ($) {
    /**
     * 初始化组件
     * @param options，可能应为对象（初始化配置）或者字符串（方法）
     * @param _param 调用方法时所传参数
     * return string
     */
    $.fn.dateMonth = function(options,_param){
        if(typeof options === "string"){
            // 对setValue和getValue方法进行特殊处理
            if(options === "setValue" || options === "getValue"){
                return $.fn.dateMonth.methods[options](this, _param);
            }else{
                this.datebox(options,_param);
            }
        }
        var newOptions = $.extend({}, $.fn.dateMonth.defaults,options);
        initEvents(this,newOptions);
        return this
    };

    /**
     * 绑定各类事件处理方式
     * @param jq
     * @param options
     */
    function initEvents(jq,options) {
        //显示日趋选择对象后再触发弹出月份层的事件，初始化时没有生成月份层
        options.onShowPanel=function () {
            toShowPanel(options,jq)
        };
        options.onChange =function (newValue,oldValue) {
            toChange(options,newValue,oldValue);
        };
        //配置parser，返回选择的日期
        options.parser =function (value) {
            return toParser(options.validateStr,value)
        };
        //配置formatter，只返回年月 之前是这样的d.getFullYear() + '-' +(d.getMonth());
        options.formatter= function (value) {
            var dateString = value;
            if(typeof dateString == "string"){
                return toFormatter(new Date(dateString));
            }
            return toFormatter(value);
        };
        jq.datebox(options);
    }
    /**
     * 面板展开事件处理
     * @param jq
     * @param options
     */
    function toShowPanel(options,jq) {
        options.panel = jq.datebox('panel');
        options.pSpan = options["panel"].find('span.calendar-text');
        options.textInput = jq.next().find('input.textbox-text');
        options.yearInput = options["panel"].find('input.calendar-menu-year');
        options.pHeader = options["panel"].find('.calendar-header');
        options.cBody = options['panel'].find(".calendar-body");
        options.isShow ? options["pHeader"].show() : options["pHeader"].hide();
        options.yearInput.attr("readonly","readonly");
        options.cBody.find(".calendar-last").hide();
        //触发click事件弹出月份层
        var timerOne =  setTimeout(function () {
            options["pSpan"].trigger('click');
            clearTimeout(timerOne);
        },0);
        if (!options.tds){
            //延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔
            var timerTwo = setTimeout(function() {
                options.textInput.focus();
                options.tds = options["panel"].find('div.calendar-menu-month-inner td');
                options["tds"].click(function(e) {
                    //禁止冒泡执行easyui给月份绑定的事件
                    e.stopPropagation();
                    //得到年份
                    var year = /\d{4}/.exec(options["pSpan"].html())[0] ,
                        //月份
                        month = parseInt($(this).attr('abbr'), 10);
                    //隐藏日期对象
                    jq.datebox('hidePanel').datebox('setValue', year + '-' + month);
                });
                clearTimeout(timerTwo);
            }, 300);
        }
        setTimeout(function () {
            options.panel.find(".calendar-body,.calendar-menu").css("height",options.panel.find(".calendar.calendar-noborder.easyui-fluid").outerHeight())
            options.panel.find(".calendar-menu-month-inner").css("height",options.panel.find(".calendar.calendar-noborder.easyui-fluid").outerHeight()-46)
        },0)

    }
    /**
     * change事件处理
     * @param options  配置参数
     * @param newValue
     * @param oldValue
     */
    function toChange(options,newValue,oldValue) {
        if (options.panel) {
            options["pSpan"].trigger('click');
            var timer =  setTimeout(function () {
                options.textInput.focus();
                clearTimeout(timer);
            },10);
            if (options.validateStr.test(newValue)) {
                var arr = newValue.split('-');
                if (arr[1] !== "0" && options.panel && options && options.changeCallBack) {
                    options.changeCallBack(newValue, oldValue);
                }
            }
        }
    }
    function toParser(validateStr,value) {
        if(value.length && (value.length === 7 || value.length === 6)){
            if(validateStr.test(value)){
                var arr = value.split('-');
                if(arr[1] !== "0"){
                    return new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, 1);
                }
            }
        }
        else{
            return false
        }
    }
    /**
     * @param {date} date 时间对象
     * @return {string} 返回时间字符串
     */
    function toFormatter(date) {
        var currentMonth = (date.getMonth()+1);
        var currentMonthStr = currentMonth < 10 ? ('0' + currentMonth) : (currentMonth + '');
        return date.getFullYear() + '-' + currentMonthStr;
    }
    /**
     * 设置值
     * @param jq
     * @param _param
     * @return {string} 返回时间字符串
     */
    function setValue(jq,_param){
        jq.datebox("setValue",toFormatter(new Date(_param)));
    }
    /**
     * 获取值
     * @param jq
     * @return {string} 返回时间字符串
     */
    function getValue(jq){
        return jq.datebox("getValue");
    }
    $.fn.dateMonth.methods = {
        "setValue":function (jq,_param) {
            return setValue(jq,_param);
        },
        "getValue":function (jq) {
            return getValue(jq);
        }
    };
    var currentDate = new Date();
    $.fn.dateMonth.defaults = {
        panel:'',
        tds:false,
        pSpan:'',
        pHeader:'',
        textInput:'',
        yearInput:'',
        isShow:false,
        btnName:"当月",
        currentMonth:new Date(),
        currentText:"当月",
        onShowPanel:'',
        parser:'',
        formatter:'',
        editable:true,
        value:currentDate.getFullYear()+'-'+(currentDate.getMonth()+1),
        validateStr:/^\d{4}-(0[1-9]|[1-9]|1[0-2])$/
    };
    return $;
})