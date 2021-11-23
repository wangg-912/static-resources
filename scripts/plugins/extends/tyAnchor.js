/**
 * @author yel
 * @date 2018/10/19
 * @version 0.0.1
 * @description 锚点组件
 */
define(["jquery"],function ($) {
    /**
     * 锚点初始化
     * @param opt 配置参数对象
     *  @description 配置参数对象 {isOpenHide：是否高亮锚点目标，isOpenHide：false}
     */
    function anchor(opt){
        var defaultOpt = {
            isOpenHide:false,
            anchorAimMark:true,
        };
        $.extend(defaultOpt,opt);
        listenAnchorEvent(defaultOpt);
    }
    /**
     * 监听锚点事件
     * @param opt
     */
    function listenAnchorEvent(opt) {
        $(".ty-anchor").click(function (event) {
            var $anchorAim = $($(this).attr("href"));
            $(".ty-anchor-aim").removeClass("ty-anchor-aim-active");
            if(opt.isOpenHide){
                $anchorAim.parents().show();
            }
            if(opt.anchorAimMark){
                $anchorAim.addClass("ty-anchor-aim-active");
            }
        })
    }

    /**
     * 清空所有锚点目标高亮
     */
    anchor.clearAnchorAimMark = function () {
        $(".ty-anchor-aim").removeClass("ty-anchor-aim-active");
    };
    return anchor;
});