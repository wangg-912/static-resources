var CreatedOKLodopObject, CLodopIsLocal, CLodopJsState;

//==判断是否需要CLodop(那些不支持插件的浏览器):==
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

//==加载引用CLodop的主JS,用双端口8000和18000(以防其中一个被占):==
function loadCLodop() {
    if (CLodopJsState == "loading" || CLodopJsState == "complete") return;
    CLodopJsState = "loading";
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var JS1 = document.createElement("script");
    var JS2 = document.createElement("script");
    JS1.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
    JS2.src = "http://localhost:18000/CLodopfuncs.js";
    JS1.onload  = JS2.onload  = function()    {CLodopJsState = "complete";}
    JS1.onerror = JS2.onerror = function(evt) {CLodopJsState = "complete";}
    head.insertBefore(JS1, head.firstChild);
    head.insertBefore(JS2, head.firstChild);
    CLodopIsLocal = !!((JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i));
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
if (needCLodop()){loadCLodop();}//加载

//==获取LODOP对象主过程,判断是否安装、需否升级:==
function getLodop(oOBJECT, oEMBED) {
    var strHtmInstall = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件未安装!点击这里<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_4.127.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</p>";
    var strHtmUpdate = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件需要升级!点击这里<a href='http://cloud.wisewe.cn:5678/install_lodop32_4.127.exe' target='_self'>执行升级</a>,升级后请重新进入。</p>";
    var strHtm64_Install = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件未安装!点击这里<a href='http://cloud.wisewe.cn:5678/install_lodop64_4.127.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</p>";
    var strHtm64_Update = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>打印控件需要升级!点击这里<a href='http://cloud.wisewe.cn:5678/install_lodop64_4.127.exe' target='_self'>执行升级</a>,升级后请重新进入。</p>";
    var strHtmFireFox = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</p>";
    var strHtmChrome = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</p>";
    var strCLodopInstall_1 = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>Web打印服务CLodop未安装启动，点击这里<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_4.127.exe' target='_self'>下载执行安装</a>，成功后请刷新本页面或重新进入。</p>";
    var strCLodopInstall_2 = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>（若此前已安装过，可<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_4.127.exe' target='_self'>点这里直接再次安装</a>），成功后请刷新本页面或重新进入。</p>";
    var strCLodopUpdate = "<p style='margin: 0;padding:0;font-size: 14px;line-height: 24px;'>Web打印服务CLodop需升级!点击这里<a href='http://cloud.wisewe.cn:5678/CLodop_Setup_4.127.exe' target='_self'>执行升级</a>,升级后请刷新页面或重新进入。</p>";
    var LODOP;
    try {
        var ua = navigator.userAgent;
        var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch (err) {}
            /*if (!LODOP && document.readyState !== "complete") {
                if (CLodopJsState == "loading") alert("网页还没下载完毕，请稍等一下再操作."); else alert("没有加载CLodop的主js，请先调用loadCLodop过程.");
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
                if (CLODOP.CVERSION < "4.1.2.7") {
                    var container = document.getElementById("lodop_container");
                    if(!container){
                        var boxEle = creatdBoxEle();
                        document.body.appendChild(boxEle);
                    }
                    var box = document.getElementById("message_box")
                    box.innerHTML = strCLodopUpdate;
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED); //清理旧版无效元素
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT);
            }
        } else {
            var is64IE = isIE && !!(ua.match(/x64/i));
            //==如果页面有Lodop就直接使用,否则新建:==
            if (oOBJECT || oEMBED) {
                if (isIE)
                    LODOP = oOBJECT;
                else
                    LODOP = oEMBED;
            } else if (!CreatedOKLodopObject) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE)
                    LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else
                    LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodopObject = LODOP;
            } else
                LODOP = CreatedOKLodopObject;
            //==Lodop插件未安装时提示下载地址:==
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
