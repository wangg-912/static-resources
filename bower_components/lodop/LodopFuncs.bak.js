var CreatedOKLodop7766 = null, CLodopIsLocal;

//====判断是否需要 Web打印服务CLodop:===
//===(不支持插件的浏览器版本需要用它)===
function needCLodop() {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i))
            return true;
        if (ua.match(/iPhone|iPod|iPad/i))
            return true;
        if (ua.match(/Android/i))
            return true;
        if (ua.match(/Edge\D?\d+/i))
            return true;

        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if ((!verTrident) && (!verIE) && (x64))
            return true;
        else if (verFF) {
            verFF = verFF[0].match(/\d+/);
            if ((verFF[0] >= 41) || (x64))
                return true;
        } else if (verOPR) {
            verOPR = verOPR[0].match(/\d+/);
            if (verOPR[0] >= 32)
                return true;
        } else if ((!verTrident) && (!verIE)) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0] >= 41)
                    return true;
            }
        }
        return false;
    } catch (err) {
        return true;
    }
}

//====页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (needCLodop()) {
    var src1 = "http://localhost:8000/CLodopfuncs.js?priority=1";
    var src2 = "http://localhost:18000/CLodopfuncs.js?priority=0";

    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var oscript = document.createElement("script");
    oscript.setAttribute("defer","defer");
    oscript.src = src1;
    head.insertBefore(oscript, head.firstChild);
    oscript = document.createElement("script");
    oscript.setAttribute("defer","defer");
    oscript.src = src2;

    head.insertBefore(oscript, head.firstChild);
    CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i));
}
function renderCLodop() {
    var src1 = "/src/bower_components/lodop/CLodopfuncs.8000.js?priority=1";
    var src2 = "/src/bower_components/lodop/CLodopfuncs.18000.js?priority=0";

    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var oscript = document.createElement("script");
    oscript.setAttribute("defer","defer");
    oscript.src = src1;
    head.insertBefore(oscript, head.firstChild);
    oscript = document.createElement("script");
    oscript.setAttribute("defer","defer");
    oscript.src = src2;
    head.insertBefore(oscript, head.firstChild);
    CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i));
}
function creatdBoxEle() {
    var boxContainer = document.createElement("div");
    boxContainer.id="lodop_container";
    boxContainer.style.cssText= "position: absolute;height: 220px;z-index: 99999;width: 400px;top: 50%;left: 50%;margin: -110px 0 0 -200px;background: #ffffff;border-radius: 5px;box-shadow: 0px 2px 8px #000; overflow: hidden;";
    var boxs = document.createElement("div");
    var boxHead = document.createElement("div");
    boxHead.style.cssText = "height: 40px;background: #ff9900;color: white;font-size: 14px;line-height: 40px;text-indent: 12px;";
    boxHead.innerHTML= "提示";
    var box = document.createElement("div");
    box.style.cssText = "height: 140px; padding: 12px 20px;";
    box.id = "message_box";
    boxs.appendChild(boxHead);
    boxs.appendChild(box);
    boxContainer.appendChild(boxs);
    return boxContainer;
}
//====获取LODOP对象的主过程：====
    function getLodop(oOBJECT, oEMBED) {
    var strHtmInstall = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件未安装!点击这里<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</p>";
    var strHtmUpdate = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件需要升级!点击这里<a href='http://cloud.wisewe.cn:5678/install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</p>";
    var strHtm64_Install = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件未安装!点击这里<a href='http://cloud.wisewe.cn:5678/install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</p>";
    var strHtm64_Update = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件需要升级!点击这里<a href='http://cloud.wisewe.cn:5678/install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</p>";
    var strHtmFireFox = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</p>";
    var strHtmChrome = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</p>";
    var strCLodopInstall_1 = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>Web打印服务CLodop未安装启动，点击这里<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_for_Win32NT.exe' target='_self'>下载执行安装</a>，成功后请刷新本页面或重新进入。</p>";
    var strCLodopInstall_2 = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>（若此前已安装过，可<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_for_Win32NT.exe' target='_self'>点这里直接再次安装</a>），成功后请刷新本页面或重新进入。</p>";
    var strCLodopUpdate = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>Web打印服务CLodop需升级!点击这里<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面或重新进入。</p>";
    var LODOP;
    try {
        var ua = navigator.userAgent;
        var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch (err) {}
            /*if (!LODOP && document.readyState !== "complete") {
                alert("网页还没下载完毕，请稍等一下再操作.");
                return;
            }*/
            if (!LODOP) {
                var container = document.getElementById("lodop_container");
                if(!container){
                    var boxEle = creatdBoxEle();
                    document.body.appendChild(boxEle);
                }
                var box = document.getElementById("message_box")
                box.innerHTML = strCLodopInstall_1 + (CLodopIsLocal ? strCLodopInstall_2 : "");
                return false;
            } else {
                if (CLODOP.CVERSION < "3.0.7.5") {
                    var container = document.getElementById("lodop_container");
                    if(!container){
                        var boxEle = creatdBoxEle();
                        document.body.appendChild(boxEle);
                    }
                    var box = document.getElementById("message_box")
                    box.innerHTML = strCLodopUpdate;
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED);
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT);
            }
        } else {
            var is64IE = isIE && !!(ua.match(/x64/i));
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT || oEMBED) {
                if (isIE)
                    LODOP = oOBJECT;
                else
                    LODOP = oEMBED;
            } else if (!CreatedOKLodop7766) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE)
                    LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else
                    LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766 = LODOP;
            } else
                LODOP = CreatedOKLodop7766;
            //=====Lodop插件未安装时提示下载地址:==========
            if ((!LODOP) || (!LODOP.VERSION)) {
                var container = document.getElementById("lodop_container");
                if(!container){
                    var boxEle = creatdBoxEle();
                    document.body.appendChild(boxEle);
                }
                var box = document.getElementById("message_box")
                var agent=navigator.userAgent.toLowerCase();
                if(agent.indexOf("win64")>=0||agent.indexOf("wow64")>=0){
                    box.innerHTML = strHtm64_Install;
                }else{
                    box.innerHTML = strHtmInstall;
                }
                if (ua.indexOf('Chrome') >= 0)
                    box.innerHTML = strHtmChrome;
                if (ua.indexOf('Firefox') >= 0)
                    box.innerHTML = strHtmFireFox;

                return LODOP;
            }
        }
        if (LODOP.VERSION < "6.2.2.6") {
            if (!needCLodop())
                if(!container){
                    var boxEle = creatdBoxEle();
                    document.body.appendChild(boxEle);
                }
            var box = document.getElementById("message_box");
            if(agent.indexOf("win64")>=0||agent.indexOf("wow64")>=0){
                box.innerHTML = strHtm64_Update;
            }else{
                box.innerHTML = strHtmUpdate;
            }
            //box.innerHTML = (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML;
            return LODOP;
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==
        LODOP.SET_LICENSES("成都中教智汇信息技术有限公司","AA9314729B89DFA41FA945F05D108ADC051","成都中教智匯信息技術有限公司","E524A93E698A247E79E0C63497CA7273EA9");
        LODOP.SET_LICENSES("THIRD LICENSE","","Chengdu Zhongjiao Zhihui Information Technology Co., Ltd.","95AE5864C91078C8E4F9060E1F2C324E127");

        //=======================================================
        return LODOP;
    } catch (err) {
        alert("getLodop出错:" + err);
    }
}
