define(['jquery','tyUtil'],function ($) {
    var __timer;

    /**
     * 身份证读卡器Web接口
     * @param param
     */
    function idCardRequest(param) {
        return idCardInit(param);
    }

    /**
     * 初始化
     * 首次使用会立刻唤醒接口
     * @param param
     */
    function idCardInit(param) {
        $.ajax({
            url:'http://127.0.0.1:8080/api/Version',
            complete:function (XMLHttpRequest, textStatus) {
                if(textStatus == "error"){
                    $.simpleAlert({
                        ele:"body",
                        type: 'warning',
                        title: "警告",
                        message: "检测到身份证读卡器驱动未安装，请安装新中新读卡器驱动 <a href='javascript:void(0)' onclick='return window.location.href = \"http://cloud.wisewe.cn:5678/新中新webapi读卡服务3.0.3.exe\"'> 点击立刻安装</a>如果您的驱动已经安装完毕请重启驱动，仍然无法使用，请检查读卡器是否正确连接电脑终端。",

                    })
                }else{
                    getIdCardInfos(param);
                }

            },


        })
    }

    /**
     * 获取身份证信息
     * @param opts
     */
    function getIdCardInfos(opts) {
        $.get("http://127.0.0.1:8080/api/ReadMsg", function (result) {
            switch(result.retcode){
                case "0x1"://身份证读卡器未连接
                    idCardPoll(opts)
                    $.simpleAlert({
                        ele:"body",
                        isAutoClose:true,
                        type: 'error',
                        timer:3000,
                        title: "错误",
                        message: "未检测到身份证读卡器终端，请检查读卡器是否正确连接电脑。"
                    })

                    break
                case "0x41"://身份证未正确放置或者没有检测到
                    $.simpleAlert({
                        ele:"body",
                        isAutoClose:true,
                        type: 'error',
                        timer:3000,
                        title: "错误",
                        message: "身份证读卡器未检测到身份证，请放置身份证。"
                    })
                    idCardPoll(opts);
                    break
                case  "0x90 0x1"://成功返回
                    opts.poll? idCardPoll(opts):idCardClear();
                    break
                default://默认情况
                    $.simpleAlert({
                        ele:"body",
                        isAutoClose:true,
                        type: 'error',
                        timer:3000,
                        title: "错误",
                        message: "身份证读卡器未知错误，请联系管理员。"
                    })
                    idCardPoll(opts);
                    break
            }
            result["success"] = (result.retcode == "0x90 0x1");
            opts.callback && opts.callback(result);
        });
    }

    /**
     * 管理身份证读卡器是否继续轮询
     * @param opt
     */
    function idCardPoll(opt) {
        __timer ? idCardClear() : null;
        __timer = setTimeout(function () {
            getIdCardInfos(opt);
        }, opt.time || 3500);
    }

    /**
     * 关闭轮询
     */
    function idCardClear() {
        clearTimeout(__timer)
    }
    return idCardRequest;
})