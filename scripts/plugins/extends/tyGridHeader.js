;(function () {
    function setup($) {
        /**
         * 为datagrid、treegrid增加表头菜单，用于显示或隐藏列，注意：冻结列不在此菜单中
         * @param e
         * @param field
         */
        var createGridHeaderContextMenu = function(e, field) {
            e.preventDefault();
            var grid = $(this);// grid本身
            var headerContextMenu = this.headerContextMenu;// grid上的列头菜单对象
            if (!headerContextMenu) {
                var tmenu = $('<div style="width:120px;"></div>').appendTo('body');
                var fields = grid.datagrid('getColumnFields');
                var count = 0;
                for (var i = 0; i < fields.length; i++) {
                    var fildOption = grid.datagrid('getColumnOption', fields[i]);
                    if (!fildOption.deephidden && !fildOption.checkbox) {
                        var titleName = fildOption.title;
                        if (!fildOption.hidden) {
                            $('<div iconCls="icon-ok" field="' + fields[i] + '" style="height:26px;"/>').html(titleName).appendTo(tmenu);
                        } else {
                            $('<div iconCls="icon-empty" field="' + fields[i] + '" style="height:26px;"/>').html(titleName).appendTo(tmenu);
                        }
                        count++;
                    }
                }
                headerContextMenu = this.headerContextMenu = tmenu.menu({
                    onClick : function(item) {
                        var fields = grid.datagrid('getColumnFields');
                        var count_show = 0;
                        for (var i = 0; i < fields.length; i++) {
                            var fildOption = grid.datagrid('getColumnOption', fields[i]);
                            if (!fildOption.deephidden && !fildOption.checkbox) {
                                if (!fildOption.hidden) {
                                    count_show++;
                                }
                            }
                        }
                        var field = $(item.target).attr('field');
                        if (item.iconCls == 'icon-ok') {
                            if (count_show == 1) {
                                //createTopAlert("不能隐藏所有列", "warning");
                                return;
                            }
                            grid.datagrid('hideColumn', field);
                            $(this).menu('setIcon', {
                                target : item.target,
                                iconCls : 'icon-empty'
                            });
                        } else {
                            grid.datagrid('showColumn', field);
                            $(this).menu('setIcon', {
                                target : item.target,
                                iconCls : 'icon-ok'
                            });
                        }
                    }
                });
                // 调整菜单显示不完全bug 22为单个高度
                tmenu.height(22 * count);
            }
            headerContextMenu.menu('show', {
                left : e.pageX,
                top : e.pageY
            });
        };
        /*/!**
         * 扩展树形列表 暂时不做扩展，有问题
         *
         * @type {createGridHeaderContextMenu}
         *!/
        $.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;*/

        /**
         * 扩展列表
         * @type {createGridHeaderContextMenu}
         */
        $.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;

    }
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }
})();