require(['jquery'], function ($) {
    $(function () {
        try{
            document.addEventListener("click", onbeforeEvent, true);
            document.attachEvent("click", onbeforeEvent);
        }catch(error){
        }
        setBodyFocus();

        function onbeforeEvent(e) {
            //a或button元素或null
            var $trueElement = returnTrueElement($(e.target));
            if ($trueElement && $trueElement.length) {
                $('body').focus();
                if ($trueElement.attr("data-fastclick")) {
                    e.stopPropagation();
                    return false;
                } else {
                    var t;
                    $trueElement.attr("data-fastclick", true);
                    t = setTimeout(function () {
                        $trueElement.removeAttr("data-fastclick");
                        clearTimeout(t);
                        t = null;
                    }, 300);
                }
            }
        }
        //判断触发事件的元素或父元素有没有a/button，如果有，返回该button/a，如果没有返回null
        function returnTrueElement($el) {
            var elArr = ['button', 'a']
            for (var i = 0, len = elArr.length; i < len; i++) {
                //触发的元素是不是a/button
                if (elArr[i] == $el[0].localName) {
                    return $el;
                //判断触发元素的外层有没有类为.l-btn.l-btn-plain的元素并且这个元素是不是a/button
                //能进入这个判断一般是easyui的linkbutton
                } else if (elArr[i] == ($el.closest(".l-btn.l-btn-plain")[0] && $el.closest(".l-btn.l-btn-plain")[0].localName)) {
                    return $el.closest(".l-btn.l-btn-plain");
                //判断触发元素的外层有没有类为.btn.btn-default的元素并且这个元素是不是a/button
                //能进入这个判断一般是
                    // <button type="button" class="btn btn-default btn-sm" plain="true">
                    // <i class="iconfont icon-add"></i>新增
                    // </button>
                } else if (elArr[i] == ($el.closest(".btn.btn-default")[0] && $el.closest(".btn.btn-default")[0].localName)) {
                    return $el.closest(".btn.btn-default");
                //判断触发元素的外层有没有类为.el-button的元素并且这个元素是不是a/button
                //能进入这个判断一般是vue的el-button
                } else if (elArr[i] == ($el.closest(".el-button")[0] && $el.closest(".el-button")[0].localName)){
                    return $el.closest(".el-button");
                }
            }
            return null
        }
        //给body设置聚焦属性
        function setBodyFocus() {
            $('body').attr('tabindex', 0).attr('hidefocus', true).css("outline", 'none');
        }
        //移除给body添加的聚焦属性
        function resetBodyFocus() {
            $('body').removeAttr('tabindex').removeAttr('hidefocus');
        }
        //页面卸载时移除事件监听
        $(window).off().on('beforeunload', function () {
            resetBodyFocus();
            try {
                document.removeEventListener("click");
                document.detachEvent("click");
            }catch(err){

            }
        });
    })
})
