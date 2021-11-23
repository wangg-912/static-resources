/**
 * 该框架依赖jquery,请先引入jquery1.5+版本。
 */
define("Ajax",["jquery"],function ($) {
    var jsonType = 'application/json';
    var htmlType = 'text/html';
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var scriptTypeRE = /^(?:text|application)\/javascript/i;
    var xmlTypeRE = /^(?:text|application)\/xml/i;
    var blankRE = /^\s*$/;
    var __type__= ['GET', 'POST', 'PUT', 'DELETE'];
    var Ajax = {
        /**
         * Ajax Get请求
         * @param config Ajax需要参数
         * @param callback ajax结束成功回掉函数
         * @param errorCall ajax结束错误回掉函数
         */
        "get":function (config, callback, errorCall) {
            config.type =__type__[0];
            _ajax(config, callback, errorCall);
        },
        /**
         * Ajax post请求数据格式是JSON，接口使用@RequestParam时使用，使用form表单提交方式
         * @param config Ajax需要参数可只配URL
         * @param callback ajax结束成功回掉函数
         * @param errorCall ajax结束错误回掉函数
         */
        "postForm": function (config, callback, errorCall) {
            config.type = __type__[1];
            config.dataType = 'json';
            if (!config.contentType) {
                config.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
            }
            _ajax(config, callback, errorCall);
        },
        /**
         * Ajax post请求数据格式是JSON
         * 接口使用@RequestBody时使用自动添加contentType以及格式化参数
         * @param config Ajax需要参数可只配URL
         * @param callback ajax结束成功回掉函数
         * @param errorCall ajax结束错误回掉函数
         */
        "post":function (config, callback, errorCall) {
            config.type = __type__[1];
            config.dataType = 'json';
            if (!config.contentType) {
                config.contentType = jsonType;
                config.data = typeof(config.data) == "string" ? config.data : JSON.stringify(config.data);
            }
            _ajax(config, callback, errorCall);
        },
        /**
         * Ajax put请求数据格式是JSON
         * 接口使用@RequestBody时使用自动添加contentType以及格式化参数
         * @param config Ajax需要参数可只配URL
         * @param callback ajax结束成功回掉函数
         * @param errorCall ajax结束错误回掉函数
         */
        "put":function (config, callback, errorCall) {
            config.type = __type__[2];
            config.contentType = jsonType;
            config.dataType = "json";
            if (config.contentType == jsonType) {
                config.data = typeof(config.data) == "string" ? config.data : JSON.stringify(config.data);
            }
            _ajax(config, callback, errorCall);
        },
        /**
         * Ajax delete请求数据格式是JSON
         * 接口使用@RequestBody时使用自动添加contentType以及格式化参数
         * @param config Ajax需要参数可只配URL
         * @param callback ajax结束成功回掉函数
         * @param errorCall ajax结束错误回掉函数
         */
        "delete":function (config, callback, errorCall) {
            config.type = __type__[3];
            config.contentType = jsonType;
            config.dataType = "json";
            if (config.contentType == jsonType) {
                config.data = typeof(config.data) == "string" ? config.data : JSON.stringify(config.data);
            }
            _ajax(config, callback, errorCall);
        }
    };
    function _ajax(config, callback, errorCall) {
        $.ajax({
            url: config.url,
            type: config.type,
            data: config.data,
            dataType: config.dataType,
            contentType: config.contentType,
            timeout: config.timeout,
            async: config.async,
            cache: config.cache || false,
            processData: config.processData,
            success: function (_resultData, textStatus, jqXHR) {
                if (_resultData.success || config.mustCallback) {
                    (callback && typeof(callback) === "function") && callback(_resultData);
                } else {
                    (errorCall && typeof(errorCall) === "function") && errorCall(_resultData.message);
                    console.log(_resultData.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                _handleStatus(XMLHttpRequest.status,textStatus);
            }
        });
    }


    function _handleStatus(status,textStatus) {
        switch (status) {
            case 400:
                console.log('请求参数有误');
                break;
            case 504:
                console.log('请求超时');
                break;
            case 500:
                console.log("服务器系统内部错误");
                break;
            case 404:
                console.log("无效的URL地址");
                break;
            case 403:
                console.log("无权限执行此操作");
                break;
            case 408:
                console.log("请求超时");
                break;
            case 302:
                console.log("重定向拦截");
                top.location.reload();
                break;
            case 200:
                if(textStatus == 'parsererror'){
                    try{
                        top.$("#login_out_form").submit();
                    }catch (e) {
                        $("#login_out_form").submit();
                    }

                }
                break;
            default:
                console.log("未知错误");
                if(status==0 && textStatus=="error"){
                    try{
                        top.$("#login_out_form").submit();
                    }catch (e) {
                        $("#login_out_form").submit();
                    }
                }
                break;
        }
    }
    window.Ajax = Ajax;
    return Ajax;
});