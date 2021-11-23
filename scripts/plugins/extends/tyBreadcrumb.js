/**
 * @author czq
 * @date 2018/10/26
 * @version 0.0.1
 * @description 面包屑组件
 */
define(["jquery","tyUI"],function ($,ty) {
    /**
     * 面包屑初始化
     * @param opt
     * @description 配置参数对象
     */
    function crumbs(options) {
        var defaults ={
            el:"",
            width:"100%",
            height:null,
            data:[{title:"暂无数据"}],
            itemEvent:function (targetIndex,item) {}
        };
        $.extend(defaults,options);
        render(defaults);
    }

    /**
     * 渲染
     * @param opt
     */
    function render(opt) {
        var _html = '<li>当前位置:</li>';
        if(Object.prototype.toString.call(opt) ==="[object Object]"){
            if(!opt.data.length){
                return $('<li>暂无数据!</li>').appendTo($(opt.el));
            }else {
                $.each(opt.data,function (i,el) {
                    var _el_ = escape(JSON.stringify(el));
                    if(i === opt.data.length - 1)
                        _html += '<li data-event="event" data-row='+_el_+' class="active"><a style="color: #777171;">'+el.title+'</a></li>';
                    else
                        _html += '<li data-event="event" data-row='+_el_+'><a >'+el.title+'</a></li>';
                });
            }
        }else {
            $.message({type: "warning", text: "传递数据必须是对象!"});
            return false;
        }
        $(opt.el).empty().html(_html);
        _eventClick(opt);
    }

    /**
     * 事件（开放）
     * @param opt
     * @private
     */
    function _eventClick(opt) {
        $('[data-event="event"]').unbind('click').click(function (e) {
            var targetIndex = $(this).index();
            var targetRow = JSON.parse((unescape($(this).attr('data-row'))));
            opt.itemEvent(targetIndex,targetRow);
        });
        $(".active").trigger("click");
    }
    return crumbs;
});