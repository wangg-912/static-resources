/**
 * @author yingang
 * @date 2018/10/31
 * @version 0.1.1
 * @description 评星组件
 */
;(function () {
    function setup($) {
        /**
         * 评星组件初始化
         * @param options 配置参数
         * @param param 方法参数
         */
        $.prototype.rate = function (options, param) {
            if (typeof options == 'string') {
                return $.fn.rate.methods[options](this, param);
            }
            options = options || {};
            if(options.type == 'input') {
                var doms = this;
                require(["easyModule",'tyUtil'],function (easyload,tt) {
                    using('numberbox',function () {
                        require(['tyValidateRules'],function () {
                            for(var i=0;i<doms.length;i++) {
                                var state = $.data(doms[i], 'rate');
                                if (state) {
                                    $.extend(state.options, options);
                                } else {
                                    $.data(doms[i], 'rate', {
                                        options: $.extend({}, $.fn.rate.defaults, options)
                                    });
                                }
                                var input = $("<input type='text'>")
                                $(doms[i]).append(input)
                                input.numberbox({
                                    min:0,
                                    max: options.max,
                                    precision:0,
                                    validType: 'number'
                                })
                                state = $.data(doms[i], 'rate')
                                state.inputDom = input
                            }
                        })
                    })
                })
            } else {
                this.each(function () {
                    var state = $.data(this, 'rate');
                    if (state) {
                        $.extend(state.options, options);
                    } else {
                        $.data(this, 'rate', {
                            options: $.extend({}, $.fn.rate.defaults, options)
                        });
                    }
                    createRate(this);
                })
            }
        }
        // 对外句柄
        $.prototype.rate.methods = {
            options: function (jq, param) {
                return $.data(jq[0], 'rate').options;
            },
            getRate: function (jq, param) {
                var results = [];
                jq.each(function () {
                    var state = $.data(this, 'rate')
                    var options = state.options;
                    if (options.type == 'input') {
                        var score = +state.inputDom.numberbox('getValue')||0;
                        var starkey = $(this).attr("starkey")
                        results.push({
                            score: score,
                            totalScore: options.max,
                            starkey: starkey
                        })
                    }
                    else {
                        results.push($.data(this, 'rate').info)
                    }
                })
                return results
            },
            setRate: function (jq, score) {
                jq.each(function () {
                    var rate = score;
                    var state = $.data(this, 'rate')
                    var options = state.options;
                    var key = $(this).attr('starkey');
                    if (score instanceof Object) {
                        rate = score[key]
                    }
                    if (options.type == 'input' && rate) {
                        state.inputDom.numberbox('setValue', rate)
                    } else if (options.type == 'star' && rate) {
                        setRateStatus(this, rate, 'select', state)
                    }
                })
            },
            disable: function (jq) {
                jq.each(function () {
                    var state = $.data(this, 'rate')
                    if (state.options.type == 'input') {
                        state.inputDom.numberbox('disable', true)
                    } else {
                        $(this).off('click mouseenter mouseleave')
                    }

                })
            },
            enable: function (jq) {
                jq.each(function () {
                    var state = $.data(this, 'rate')
                    if (state.options.type == 'input') {
                        state.inputDom.numberbox('enable', true)
                    } else {
                        eventBind(this, state)
                    }
                })
            },
        }

        /**
         * 创建星星组件dom
         * @param target
         */
        function createRate(target) {
            var state = $.data(target, 'rate')
            var opts = state.options;
            var t = $(target).empty()
            // 星星式评星组件
            var total = opts.starTotal || 5;
            for (var i = 0; i < total; i++) {
                $('<i class="iconfont ' + opts.iconClass + '" title="' + (opts.showDesc ? opts.desc[i] : '') + '"></i>').appendTo(t)
            }
            var style = {
                'font-size': opts.size + "px",
                color: opts.deactiveColor
            }
            t.find("i").css(style)
            t.off("click mouseenter mouseleave");
            if (opts.rateAble) {
                eventBind(t, state)
            }
            state.info = {
                starAmount: 0,
                totalStar: opts.starTotal,
                starScore: opts.starScore,
                score: 0,
                starkey: $(target).attr("starkey"),
                target: target
            }
        }

        /**
         * 设定评星组件状态
         * @param dom 组件容器节点
         * @param score 评分
         * @param type 状态类型(select: 单击选择; 其他为鼠标悬浮状态)
         * @param state 状态对象
         */
        function setRateStatus(dom, score, type, state) {
            var stars = $(dom).find('i');
            var options = state.options;
            var rate = scoreToStar(score, options);
            if (type === 'select') {
                $(dom).attr("star", rate)
                state['info'].starAmount = rate;
                state['info'].score = score
            }

            for (var i = 0; i < stars.length; i++) {
                if (i < rate) {
                    if (type == 'select') {
                        $(stars[i]).attr('selected', 'selected')
                    }
                    setActive($(stars[i]), options)
                } else {
                    if (type == 'select') {
                        $(stars[i]).removeAttr('selected');
                        setDeactive($(stars[i]), options)
                    } else {
                        if (!$(stars[i]).attr('selected')) {
                            setDeactive($(stars[i]), options)
                        }
                    }
                }
            }
        }

        /**
         * 星星类型组件事件绑定
         * @param dom 节点
         * @param state 状态参数
         */
        function eventBind(dom, state) {
            var options = state.options;
            $(dom).on('mouseenter', 'i', function (event) {
                var index = $(event.target).index()
                setRateStatus(dom, (index + 1) * options.starScore, 'mouseenter', state)
                options.onMouseEnter(dom, index + 1);
            });
            $(dom).on('mouseleave', 'i', function (event) {
                var index = $(event.target).index()
                var nowStar = $(event.target).parent().attr('star') || 0
                setRateStatus(dom, nowStar * options.starScore, 'mouseleave', state)
                options.onMouseLeave(dom, index + 1);
            });
            $(dom).on('click', 'i', function (event) {
                var index = $(event.target).index()
                $(dom).attr('star', index + 1)
                setRateStatus(dom, (index + 1) * options.starScore, 'select', state)
                // 抛出选择事件句柄, 供外部处理
                options.onChoose(dom, index + 1, $(dom).attr('starkey'));
            })
        }

        /**
         * 分数转换为星星数
         * @param score 分数
         * @param options 配置参数对象
         * @returns {number}
         */
        function scoreToStar(score, options) {
            var starScore = options.starScore || 1;
            return Math.floor(score / starScore)
        }

        /**
         * 设置星星为选中状态
         * @param dom 节点
         * @param options 配置参数对象
         */
        function setActive(dom, options) {
            $(dom).css('color', options.activeColor)
        }
        /**
         * 设定星星为未选中状态
         * @param dom 当前星星节点
         * @options 配置参数对象
         */
        function setDeactive(dom, options) {
            $(dom).css('color', options.deactiveColor)
        }

        /**
         *  默认参数配置对象
         * @type {{activeColor: string, deactiveColor: string, iconClass: string, type: string, size: number, starTotal: number, starScore: number, currentStar: number, rateAble: boolean, rateDesc: string[], showStarDesc: boolean, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onChoose: onChoose}}
         */
        $.fn.rate.defaults = {
            activeColor: '#FEAD2D',   // 激活时的颜色
            deactiveColor: 'gray', // 未激活时的颜色
            iconClass: 'icon-star1',  //
            type: 'star',
            size: 20,
            starTotal: 5,         // 显示的总星数
            starScore: 1,       // 每颗星代表的分数
            rateAble: true,  // 设定是否可以选择评星或者只读不可编辑
            desc: ['非常不好', '不好', '一般', '好', '非常好'],      //  评分说明
            showDesc: true,   //  是否在鼠标悬浮在星星上时显示对应描述信息
            onMouseEnter: function () {
            },
            onMouseLeave: function () {
            },
            onChoose: function () {
            }
        };
    }
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }
})(jQuery)