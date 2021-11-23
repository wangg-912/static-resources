/**
 * @author yel
 * @date 2018/10/22
 * @version 0.0.1
 * @description 分割线组件
 */
define(["jquery"],function () {
    /**
     * 分割线初始化
     * @param opt
     * @description 配置参数对象
     */
    function segmentation(opt) {
        var defaultOpt = {
            el:"",//分割线容器（必填）多个容器以 “,”隔开
            lineDerection:"horizontal" || "vertical",//水平||垂直
            lineType:"solid" || "dashed" || "dotted", //实线||虚线||点线
            lineColor:"#eee", //分割线颜色
            text:"",//分割线文字
            textAlign:"left" || "center" || "right",//分割线文字位置
            textFontSize:"14px",//分割线文字字体大小
            textBackgroundColor:"#fff",//分割线背景颜色
            height:"300px"//垂直分割线高度
        };
        $.extend(defaultOpt,opt);
        createSegmentation(defaultOpt);
    }

    /**
     * 创建分割线
     * @param opt
     * @returns {boolean}
     */
    function createSegmentation(opt) {
        if(!opt.el){
            throw"el can not be undefined";
            return false;
        }
        var el = opt.el.split(",");
        var _html = createStHtml(opt);
        for(var i=0,len=el.length; i<len; i++){
            $(el[i]).html(_html);
        }
    }
    /**
     * 生成分割线html
     * @param opt
     * @returns {string|string}
     */
    function createStHtml(opt) {
        var _html = "",lineStyle,textStyle;
        if(opt.lineDerection === "horizontal"){
            //水平分割线
            lineStyle = "height: 1px;border-top: 1px "+opt.lineType +" "+opt.lineColor +";"+"text-align:"+opt.textAlign;
            if(opt.text){
                textStyle = "position:relative;top: -12px;font-weight:bold;background-color: "+opt.textBackgroundColor+" ;"+"font-size:"+opt.textFontSize+";";
                switch (opt.textAlign){
                    case "left":
                        textStyle += "padding-right:20px;";
                        break;
                    case "center":
                        textStyle += "padding:0 20px;";
                        break;
                    default:
                        textStyle += "padding-left:20px;";
                }
                _html = '<div style="'+lineStyle+'">' +
                    '<span style="'+textStyle+'">'+opt.text+'</span>' +
                    '</div>'
            }else{
                _html = '<div style="'+lineStyle+'"></div>';
            }
        }else{
            //垂直分割线
            _html = '<div style="height: '+opt.height+';border-left: 1px '+opt.lineType +" "+opt.lineColor+';"></div>'
        }
        return _html;
    }
    return  segmentation;
});