/**
 * @author wanggang
 * @date 2018/8/23
 * @version 0.0.1
 * @description Tab组件
 */
;(function () {
	"use strict";
	function setup($){
		/**
		 * 初始化
		 * @param jq
		 */
		function init(jq) {
			var options = jq.data("tyTab").options;
			var tabHeader = $("<div class='tabs-header'>" +
				"<div class='tabs-scroller-left' style='display: none;'></div>" +
				"<div class='tabs-scroller-right' style='display: none;'></div>" +
				"</div>").appendTo(jq);
			var tabContainer = $("<div class='ty-tab-context'></div>").appendTo(jq);
			// 设置Tab高度宽度
			jq.addClass("easyui-tabs tabs-container ty-tab");
			if (options.position == "top") {
				jq.addClass("easyui-fluid ty-tab-top");
			} else if (options.position == "left") {
				jq.addClass("ty-tab-left");
				tabHeader.addClass("tabs-header-left");
				tabContainer.addClass("tabs-panels-right")
			}
			// 定义Tab按钮栏
			var tabUL = $("<div class=\"tabs-wrap\">" +
				"<ul class='tabs ty-tabs-header'></ul></div>").appendTo(tabHeader);
			// 定义Tab内容
			var tabContext = tabContainer;
			// 添加tab选项卡
			if (options.position == "top") {
				$.each(options.tabs, function(i, n) {
					if ("url" in n) {
						addTopIframeTab(jq, n,options);
					} else {
						addTopDivTab(jq, n,options);
					}
				});
			} else if (options.position == "left") {
				$.each(options.tabs, function(i, n) {
					if ("url" in n) {
						addLeftIframeTab(jq, n,options);
					} else {
						addLeftDivTab(jq, n,options);
					}
				});
			}

			if (options.fit) {
				autoResize(jq.attr("id"), true)
				eventsBind(jq.attr("id"));
			} else {
				if (options.position == "top") {
					jq.css({
						width : options.width,
						height : options.height
					});
					tabContext.css({
						width : options.width,
						height : options.height - 22
					})
				} else if (options.position == "left") {
					jq.css({
						width : options.width,
						height : options.height
					});
					tabUL.width(options.leftTabWidth);
					tabUL.height(options.height);
					tabContext.css({
						width : options.width - options.leftTabWidth - 3,
						height : options.height
					})
				}
			}

			if (typeof options.afterInit == "function") {
				options.afterInit(jq);
				top.$('#ty-tab-menu').length?null:createContextMenu();
			}
		};

		/**
		 * 扩展框架创建静态右键
		 */
		function createContextMenu() {
			var $menu = $('<div id="ty-tab-menu" class="easyui-menu" style="width: auto;display: none;">\n' +
				'    <div id="refresh" data-options="iconCls:\'iconfont icon-shuaxin\'">刷新</div>\n' +
				'    <div class="menu-sep"></div>\n' +
				'    <div id="close" data-options="iconCls:\'iconfont  icon-guanbi1\'">关闭</div>\n' +
				'    <div id="closeAll" data-options="iconCls:\'iconfont icon-cuowu1\'">全部关闭</div>\n' +
				'    <div id="closeOther" data-options="iconCls:\'fa fa-flag-o\'">除此之外全部关闭</div>\n' +
				'    <div class="menu-sep"></div>\n' +
				'    <div id="closeRight" data-options="iconCls:\'iconfont icon-return2fanhuiyou\'">当前页右侧全部关闭</div>\n' +
				'    <div id="closeLeft" data-options="iconCls:\'iconfont icon-returnfanhuizuo\'">当前页左侧全部关闭</div>\n' +
				'</div>').appendTo(top.$('body'));
		}

		/**
		 * 关闭TAB(私有)
		 * @param event
		 */
		function closeTab(event) {
			event.stopPropagation();
			var tabId = $(this).attr("ty-tab-id");
			__destroy(tabId);
			var jq = $("#" + event.data.id),
				options = jq.data("tyTab").options,
				// 移除tabs缓存
				tabs = options.tabs,
				results = $.grep(tabs, function(n, i) {
					return n.id !== tabId;
				});
			options.tabs = results;
			if (options.selectedTabId == tabId) {
				var tabLI = jq.find("ul").children("li[id^='_ty_tab_item_']").eq(options.tabs.length-1);
				tabLI.trigger("click");
			}
			checkIsScroll(jq);
			/*var wrap = jq.find('>div.tabs-header>div.tabs-wrap');
			wrap.animate({scrollLeft: 0},0);*/
		}

		/**
		 * 回收内存
		 * @param iframeId
		 * @private
		 */
		function __destroy(iframeId){
			var frame = $("#_ty_tab_item_container_" + iframeId);
			if (frame.length > 0) {
				try{
					if (window.frames["_ty_tab_item_container_"+iframeId].beforeTabClose) {
						window.frames["_ty_tab_item_container_"+iframeId].beforeTabClose();
					} else if (window.frames["_ty_tab_item_container_"+iframeId].contentWindow["beforeTabClose"]) {
						window.frames["_ty_tab_item_container_"+iframeId].contentWindow["beforeTabClose"]();
					}
				}catch (e) {

				}
				frame[0].src = 'about:blank';
				try{
					frame[0].contentWindow.document.write('');
					frame[0].contentWindow.clear();
				}catch (e) {
					console.log("err:"+e);
				}
				frame[0].contentWindow.close();
				frame[0].parentNode.removeChild(frame[0]);
			}
			if (!$.support.leadingWhitespace) {
				CollectGarbage();
			}
			$("#_ty_tab_item_" + iframeId).remove();
		}
		/**
		 * 关闭当前TAB(公有)
		 * @param tabId
		 */
		function close(jq,tabId) {
			var _li = jq.find("#_ty_tab_item_"+tabId);try{
				if (window.frames["_ty_tab_item_container_"+tabId].beforeTabClose) {
					window.frames["_ty_tab_item_container_"+tabId].beforeTabClose();
				} else if (window.frames["_ty_tab_item_container_"+tabId].contentWindow["beforeTabClose"]) {
					window.frames["_ty_tab_item_container_"+tabId].contentWindow["beforeTabClose"]();
				}
			}catch (e) {

			}
			_li.find(".tabs-close.ty-tab-closable").trigger("click");
		}

		/**
		 * 全部关闭
		 * @param jq
		 */
		function closeAll(jq) {
			var options = jq.data("tyTab").options;
			var tabs = options.tabs;
			$.each(tabs,function (i,tab) {
				if(tab.id !== "home"){
					var _li = jq.find("#_ty_tab_item_"+tab.id);
					_li.find(".tabs-close.ty-tab-closable").trigger("click");
				}
			})
		}

		/**
		 * 关闭其他TAB
		 * @param jq
		 * @param tabId
		 */
		function closeOther(jq,tabId) {
			var options = jq.data("tyTab").options;
			var tabs = options.tabs;
			$.each(tabs,function (i,tab) {
				if(tab.id !== "home" && tab.id !== tabId){
					var _li = jq.find("#_ty_tab_item_"+tab.id);
					_li.find(".tabs-close.ty-tab-closable").trigger("click");
				}
			})
		}

		/**
		 * 验证TAB是否存在
		 * @param jq
		 * @param tabId
		 * @returns {boolean}
		 */
		function isTabExist(jq, tabId) {
			var options = jq.data("tyTab").options;
			var tabs = options.tabs;
			var exists = $.grep(tabs, function(n, i) {
				return n.id === tabId;
			});
			return exists.length > 0;
		}

		/**
		 * 获取tab组件初始数据 | 获取指定tabId的默认初始数据
		 * @param jq
		 * @param tabId
		 * @returns {null|{}|inData|{}}
		 */
		function getTabInData(jq,tabId){
			var options = jq.data("tyTab").options;
			if(tabId){
				var tabs = options.tabs,
					currentTab = $.grep(tabs, function(tab, i) {
						return (tab.id === tabId)
					});
				return (currentTab[0] && currentTab[0].inData) ? currentTab[0].inData:null;
			}
			return options.inData;
		}

		/**
		 * 获取当前tab的外部宽度
		 * @param jq
		 * @returns {number}
		 */
		function getTabWidth(jq) {
			var w=0;
			var tabUL = jq.find("ul");
			tabUL.children().each(function(){
				w+=$(this).outerWidth(true);
			});
			return w;
		};
		/**
		 * 增加顶部Iframe TAB
		 * @param jq
		 * @param tab
		 */
		function addTopIframeTab(jq, tab,opts) {
			var tabUL = jq.find("ul");
			var tabContext = jq.find(".ty-tab-context");
			var tabHtml = "";
			if ("closable" in tab && tab.closable) {
				tabHtml += "<a href=\"javascript:;\" class=\"tabs-inner\"><span class=\"tabs-title\">";
				tabHtml += tab.name;
				tabHtml += "</span><span class=\"tabs-icon\"></span></a>" +
					"&nbsp;<a href=\"javascript:;\" class=\"tabs-close ty-tab-closable\" ty-tab-id=\"" + tab.id + "\">&nbsp;&nbsp;</a>";
				var tabLI = $("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id,
					url : tab.url
				}, clickTab).append(tabHtml).appendTo(tabUL);
				tabLI.find(".tabs-close.ty-tab-closable").bind('click', {
					id : jq.attr("id")
				}, closeTab);

			} else {
				tabHtml += "<a href=\"javascript:;\" class=\"tabs-inner\"><span class=\"tabs-title\">";
				tabHtml += tab.name;
				tabHtml += "</span><span class=\"tabs-icon\"></span></a>";
				$("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id,
					url : tab.url
				}, clickTab).append(tabHtml).appendTo(tabUL);
			}
			var _url = (tab && tab.url) ? tab.url+"?t="+(+new Date()) : "";
			var $iframe = $("<iframe frameborder=\"0\" scrolling=\"no\" style=\"width: 100%; height: 100%; overflow-y: auto;display: none;\"></iframe>").attr(
				{
					id : "_ty_tab_item_container_" + tab.id,
					name : "_ty_tab_item_container_" + tab.id
				});
			if(!(/^(http|https|www)/g.test(_url))){
				$iframe.attr("src",_url).appendTo(tabContext)
				if ($iframe[0].attachEvent){
					$iframe[0].attachEvent("onload", function(e){
						var ifDoc = $iframe[0].contentDocument||{'title':'error'},
							ifTitle = (ifDoc.title)&&(ifDoc.title.toLowerCase());
						(ifTitle.indexOf("error")>=0 ) && ($iframe[0].src = '/src/404.html');
					});
				} else {
					$iframe[0].onload = function (e) {
						var ifDoc = $iframe[0].contentDocument||{'title':'error'},
							ifTitle = (ifDoc.title)&&(ifDoc.title.toLowerCase());
						(ifTitle.indexOf("error")>=0 ) && ($iframe[0].src = '/src/404.html');

					};
				}
			}else{
				$iframe.attr("src",_url).appendTo(tabContext)
			}
			$.mask({"timeout":450,"top":125});
			checkIsScroll(jq);
			eventHandler(jq,opts);
		}

		/**
		 * 计算tab内部真实宽度
		 * @param jq
		 */
		function checkIsScroll(jq) {
			var _tabInnerWidth_ = getTabWidth(jq);
			var _tabOuterWidth_ = jq.innerWidth();
			if(_tabInnerWidth_ > _tabOuterWidth_){
				jq.find(".tabs-scroller-right,.tabs-scroller-left").css({
					"display":"block",
					"width":"18px",
					"height":"44px",
					"borderRadius":"4px"
				});
				jq.find(".tabs-wrap").css({
					width:(_tabOuterWidth_-36)+"px",
					marginLeft:18,
					marginRight:18
				});
				dynimicTabScoll(jq,(_tabInnerWidth_-_tabOuterWidth_+36));
			}else{
				jq.find(".tabs-scroller-right,.tabs-scroller-left").css({
					"display":"none"
				})
				jq.find(".tabs-wrap").css({
					width:_tabOuterWidth_+"px",
					marginLeft:0,
					marginRight:0
				});
				(jq.find('>div.tabs-header>div.tabs-wrap')[0].scrollLeft) && dynimicTabScoll(jq,0);
			}
			return false;
		}

		/**
		 * 动态设置滚动条
		 * @param jq
		 * @param distance
		 */
		function dynimicTabScoll(jq,distance) {
			jq.tyTab('scrollBy', {
				"type":"right",
				"deltaX":distance
			});
		}
		/**
		 * 增加顶部Div TAB
		 * @param jq
		 * @param tab
		 */
		function addTopDivTab(jq, tab) {
			var tabUL = jq.find("ul");
			var tabContext = jq.find(".ty-tab-context");

			var tabHtml = "";
			if ("closable" in tab && tab.closable) {
				tabHtml += "<a href=\"javascript:;\" class=\"tabs-inner pad-right-8\"><span class=\"tabs-title\">";
				tabHtml += tab.name;
				tabHtml += "</span><span class=\"tabs-icon\"></span></a>" +
					"&nbsp;<a href=\"javascript:;\" class=\"tabs-close ty-tab-closable\" ty-tab-id=\"" + tab.id + "\">&nbsp;&nbsp;</a>";

				var tabLI = $("<li style=\"padding-right:5px;\"></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id
				}, clickTab).append(tabHtml).appendTo(tabUL);
				tabLI.find(".ty-tab-closable").bind('click', {
					id : jq.attr("id")
				}, closeTab);

			} else {
				tabHtml += "<a href=\"javascript:;\" class=\"tabs-inner\"><span class=\"tabs-title\">";
				tabHtml += tab.name;
				tabHtml += "</span><span class=\"tabs-icon\"></span></a>";

				$("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id
				}, clickTab).append(tabHtml).appendTo(tabUL);
			}

			$("<div id=\"_ty_tab_item_container_" + tab.id + "\" style=\"width: 100%; height: inherit; overflow-y: auto;display: none;\"></div>")
				.appendTo(tabContext);
		}

		/**
		 * 增加左侧Iframe TAB
		 * @param jq
		 * @param tab
		 */
		function addLeftIframeTab(jq, tab,opts) {
			var tabUL = jq.find("ul");
			var tabContext = jq.find(".ty-tab-context");

			var tabHtml = "";
			if ("closable" in tab && tab.closable) {
				tabHtml += '<a href="javascript:;" class="tabs-inner"><span class="tabs-title">'+tab.name+'</span><span class="tabs-icon"></span></a>' +
					'<a href="javascript:;" class="tabs-close ty-tab-closable" ty-tab-id='+tab.id+'></a>';
				var tabLI = $("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id,
					url : tab.url
				}, clickTab).append(tabHtml).appendTo(tabUL);

				tabLI.find(".tabs-close.ty-tab-closable").bind('click', {
					id : jq.attr("id")
				}, closeTab);

			} else {
				tabHtml = '<a href="javascript:;" class="tabs-inner"><span class="tabs-title">'+tab.name+'</span><span class="tabs-icon"></span></a>';
				$("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id,
					url : tab.url
				}, clickTab).append(tabHtml).appendTo(tabUL);
			}
			var _url = (tab && tab.url) ? tab.url+"?t="+(+new Date()) : "";
			var $iframe = $("<iframe frameborder=\"0\" scrolling=\"no\" src="+_url+" style=\"width: 100%; height: 100%; overflow-y: auto;display: none;\"></iframe>").attr(
				{
					id : "_ty_tab_item_container_" + tab.id,
					name : "_ty_tab_item_container_" + tab.id
				});
			if(!(/^(http|https|www)/g.test(_url))){
				$iframe.attr("src",_url).appendTo(tabContext);
				if ($iframe[0].attachEvent){
					$iframe[0].attachEvent("onload", function(e){
						var ifDoc = $iframe[0].contentDocument||{'title':'error'},
							ifTitle = (ifDoc.title)&&(ifDoc.title.toLowerCase());
						(ifTitle.indexOf("error")>=0 ) && ($iframe[0].src = '/src/404.html');
					});
				} else {
					$iframe[0].onload = function (e) {
						var ifDoc = $iframe[0].contentDocument||{'title':'error'},
							ifTitle = (ifDoc.title)&&(ifDoc.title.toLowerCase());
						(ifTitle.indexOf("error")>=0 ) && ($iframe[0].src = '/src/404.html');
					};
				}
			}else{
				$iframe.attr("src",_url).appendTo(tabContext);
			}
		}

		/**
		 * 增加左侧Div TAB
		 * @param jq
		 * @param tab
		 */
		function addLeftDivTab(jq, tab) {
			var tabUL = jq.find("ul");
			var tabContext = jq.find(".ty-tab-context");

			var tabHtml = "";
			if ("closable" in tab && tab.closable) {
				tabHtml += '<a href="javascript:;" class="tabs-inner"><span class="tabs-title">'+tab.name+'</span><span class="tabs-icon"></span></a>' +
					'<a href="javascript:;" class="tabs-close ty-tab-closable" ty-tab-id='+tab.id+'></a>';

				var tabLI = $("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id
				}, clickTab).append(tabHtml).appendTo(tabUL);

				tabLI.find(".ty-tab-closable").bind('click', {
					id : jq.attr("id")
				}, closeTab);

			} else {
				tabHtml = '<a href="javascript:;" class="tabs-inner"><span class="tabs-title">'+tab.name+'</span><span class="tabs-icon"></span></a>';

				$("<li></li>").attr("id", "_ty_tab_item_" + tab.id).bind("click", {
					jqId : jq.attr("id"),
					id : tab.id
				}, clickTab).append(tabHtml).appendTo(tabUL);
			}

			$("<div id=\"_ty_tab_item_container_" + tab.id + "\" style=\"width: 100%; height: inherit; overflow-y: auto;display: none;\"></div>")
				.appendTo(tabContext);
		}

		/**
		 * 点击选项卡事件
		 * @param e
		 * @param params
		 */
		function clickTab(e, params) {
			var data = e.data;
			// 记录选中的选显卡
			var jq = $("#" + data.jqId);
			var options = jq.data("tyTab").options;
			options.selectedTabId = data.id;
			// 选中
			$(this).addClass("tabs-selected").siblings().removeClass("tabs-selected");
			/*var url = data.url;
			if (url) {
				url = params == undefined ? url : $.genParamUrl(url, params);
				var oldUrl = $("#_ty_tab_item_container_" + data.id).attr("src");
				if (oldUrl != url) {
					$("#_ty_tab_item_container_" + data.id).attr("src", url);
				}
			}*/
			$("#_ty_tab_item_container_" + data.id).siblings().hide();
			$("#_ty_tab_item_container_" + data.id).show();
			if (typeof options.itemSelectHandler == "function") {
				options.itemSelectHandler(data);
			}
		}

		/**
		 * 选中指定选项卡
		 * @param jq
		 * @param params
		 */
		function selectTab(jq, params) {
			var newSelectedId,
				oldSelectedId = jq.find('>div.tabs-header>div.tabs-wrap .ty-tabs-header .tabs-selected').attr("id");
			if (typeof params == "string") {
				$("#_ty_tab_item_" + params).trigger("click");
				newSelectedId = params;
			} else {
				$("#_ty_tab_item_" + params.id).trigger("click", params.params);
				newSelectedId = params.id
			}
			resetTabScroll(jq, newSelectedId, oldSelectedId)
		};

		/**
		 * 自动重置高度
		 * @param e
		 * @param init
		 */
		function autoResize(e, init) {
			var jqId = typeof e == "string" ? e : e.data;
			var jq = $("#" + jqId);
			var options = jq.data("tyTab").options;
			// 排除exclusions
			var ele = $(options.el) || $("body");
			var excWidth = options.excWidth;// 水平排除 数值
			var excHeight = options.excHeight;// 垂直排除 数值
			var excHorizontal = options.excHorizontal;// 水平排除 标签id
			var excVertical = options.excVertical;// 垂直排除 标签id
			var eleWidth = ele.outerWidth();
			var eleHeight = ele.outerHeight();
			if (excVertical.length > 0) {
				$.each(excVertical, function(i, n) {
					if ($("#" + n).not(":hidden").length > 0) {
						excHeight += $("#" + n).outerHeight()
					}
				});
			}
			if (excHorizontal.length > 0) {
				$.each(excHorizontal, function(i, n) {
					if ($("#" + n).not(":hidden").length > 0) {
						excWidth += $("#" + n).outerHeight()
					}
				});
			}
			var height = ele.innerHeight();
			if (options.position == "top") {
				jq.css({
					width : eleWidth - excWidth,
					height : eleHeight - excHeight
				});
				jq.find(".ty-tab-context").css({
					width : eleWidth - excWidth - 2,
					height : eleHeight - excHeight - 46
				});
			} else if (options.position == "left") {
				jq.css({
					width : eleWidth - excWidth,
					height : eleHeight - excHeight
				});
				jq.find(".tabs-header-left,.tabs-wrap").width(options.leftTabWidth);
				jq.find(".ty-tabs-header").width(options.leftTabWidth-4)
				jq.find(".tabs-header-left,.tabs-wrap,.ty-tabs-header").height(eleHeight - excHeight - 2);
				jq.find(".ty-tab-context").css({
					width : eleWidth - excWidth - options.leftTabWidth - 3,
					height : eleHeight - excHeight - 2
				});
			}

			if (typeof options.afterResize == "function" && !init) {
				options.afterResize(jq);
			}
		};
		/**
		 * 浏览器大小事件绑定
		 * @param jqId
		 */
		function eventsBind(jqId) {
			$(window).resize(jqId, autoResize);
		}

		/**
		 *
		 */
		function resetTabScroll(jq,newId,oldId) {
			var fullWidth =0,dis=0,disState=true,oldDis=0,oldDisState=true;
			var containerWidth = jq.find('>div.tabs-header>div.tabs-wrap').outerWidth();
			var _tabs = jq.find('>div.tabs-header>div.tabs-wrap');
			var _tabsli = _tabs.find('li');
			$.each(_tabsli,function (i,tab) {
				var _thisWidth = $(tab).outerWidth();
				fullWidth +=_thisWidth;
				if(disState){
					dis += _thisWidth;
					disState = $(tab).attr("id") == '_ty_tab_item_'+newId?false:true;
				}
				if(oldDisState){
					oldDis += _thisWidth;
					oldDisState = $(tab).attr("id") == oldId?false:true;
				}
			})
			if(fullWidth > containerWidth){
				if(dis > oldDis){//当前节点在上一个节点之后 向右
					jq.tyTab('scrollBy', {
						"type":"right",
						"deltaX":(dis-oldDis+24/2)
					});
				}else{//当前节点在上一个节点之前 向左
					jq.tyTab('scrollBy', {
						"type":"left",
						"deltaX":-(oldDis-dis)
					});
				}
			}
		}
		/**
		 * 绑定左右滑动事件
		 * @param jq
		 * @param opts
		 */
		function eventHandler(jq,opts){
			var L = jq.find(".tabs-scroller-left"),
				R = jq.find(".tabs-scroller-right");
			if (!!L.length){
				L.unbind("click").click(function () {
					jq.tyTab('scrollBy', {
						"type":"left",
						"deltaX":-opts.scrollIncrement
					});
				})

			}
			if (!!R.length){
				R.unbind("click").click(function () {
					jq.tyTab('scrollBy', {
						"type":"right",
						"deltaX":opts.scrollIncrement
					});
				})
			}
		}

		/**
		 * tab的右键事件
		 * @param jq
		 */
		function contextMenu(jq){
			var options = jq.data("tyTab").options;
			var $header = $(jq).find(".ty-tabs-header");
			$header.unbind("contextmenu").bind("contextmenu", function (e) {
				var li = $(e.target).closest("li");
				if (li.hasClass("tabs-disabled")) {
					return;
				}
				if (li.length) {
					options.onContextMenu.call(jq, e, (li.attr("id")).replace(/_ty_tab_item_/g,''), getTabIndex(li));
				}
			});
		}

		/**
		 * 获取Tab在配置中的索引
		 * @param $li
		 * @returns {number}
		 */
		function getTabIndex($li){
			var index = 0;
			$li.parent().children("li").each(function (i) {
				if ($li[0] == this) {
					index = i;
					return false;
				}
			});
			return index;
		}

		/**
		 *
		 * @param options
		 * @param params
		 * @returns {*}
		 */
		$.fn.tyTab = function(options, params) {
			if (typeof options == "string") {
				return $.fn.tyTab.methods[options](this, params);
			}
			options = options || {};
			var datas = this.data("tyTab");
			if (datas) {
				$.extend(datas.options, options);
			} else {
				this.data("tyTab", {
					options : $.extend({}, $.fn.tyTab.defaults, $.fn.tyTab.parseOptions(this, options))
				});
			}
			init(this);
			contextMenu(this);
			return this;
		};
		/**
		 * 预处理机制
		 * @param jq
		 * @param options
		 * @returns {*}
		 */
		$.fn.tyTab.parseOptions = function(jq, options) {
			return $.extend({}, options);
		};
		/**
		 *扩展方法
		 * @type {{selectTab: $.fn.tyTab.methods.selectTab, isTabExist: (function(*=, *=): *), addTab: $.fn.tyTab.methods.addTab, getTab: (function(*, *): *), getSelectedTab: $.fn.tyTab.methods.getSelectedTab, resize: $.fn.tyTab.methods.resize}}
		 */
		$.fn.tyTab.methods = {
			selectTab : function(jq, params) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					top.app_new.handleActiveTag(params);
				} else {
					selectTab(jq, params);
				}
			},
			isTabExist : function(jq, tabId) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					var isExist = false;
					for (var i = 0; i< top.app_new.activeMenus.length;i++) {
						if (top.app_new.activeMenus[i].id == tabId) {
							isExist = true;
							break
						}
					}
					return isExist
				} else {
					return isTabExist(jq, tabId);
				}

			},
			addTab : function(jq, tab) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					top.app_new.$store.dispatch('setFlatteningTreeData', $.extend(tab, {path: [{id: tab.id,text:tab.text}]}));
					if (top.app_new.activeMenus.every(function (item) {
						return item.id !== tab.id
					})) {
						top.app_new.activeMenus.push($.extend(tab, {text: tab.name}));
					}
				} else {
					if (("id" in tab) && ("name" in tab)) {
						var options = jq.data("tyTab").options;
						options.tabs.push(tab);
						("url" in tab) ? (options.position == "left") ? addLeftIframeTab(jq, tab, options) : addTopIframeTab(jq, tab, options) : (options.position == "left") ? addLeftDivTab(jq, tab) : addTopDivTab(jq, tab);
					}
				}
			},
			getTab : function(jq, tabId) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					return top.app_new.getTagById(tabId)
				} else {
					return jq.find("#_ty_tab_item_container_" + tabId);
				}
			},
			getTabInitData:function(jq,tabId){
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					var inData = null;
					for (var i = 0; i< top.app_new.activeMenus.length;i++) {
						if (top.app_new.activeMenus[i].id == tabId) {
							inData = top.app_new.activeMenus[i].inData;
							break
						}
					}
					return inData
				} else {
					return getTabInData(jq,tabId);
				}

			},
			getSelectedTab : function(jq) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					return top.app_new.activeNavObj;
				} else {
					var options = jq.data("tyTab").options;
					var selectedTabId = options.selectedTabId;
					var tabs = options.tabs;
					if (selectedTabId && tabs) {
						for (var i = 0; i < tabs.length; i++) {
							if (tabs[i].id == selectedTabId) {
								return tabs[i];
							}
						}
						return null;
					} else {
						return null;
					}
				}

			},
			getAllTab : function(jq) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					return top.app_new.activeMenus
				} else {
					var options = jq.data("tyTab").options;
					var tabs = options.tabs;
					return tabs;
				}
			},
			closeAll :function(jq){
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					return top.app_new.closeAllTag();
				} else {
					return closeAll(jq);
				}
			},
			closeOther:function(jq,tabId){
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					return top.app_new.closeOtherTag(tabId);
				} else {
					return closeOther(jq,tabId);
				}
			},
			resize : function(jq, params) {
				autoResize(jq.attr("id"));
			},
			scrollBy : function(jq, params){
				var opts = jq.data("tyTab").options;
				var wrap = jq.find('>div.tabs-header>div.tabs-wrap');
				var deltaX = params.deltaX;
				var scrollType = params.type;
				var _tabInnerWidth = getTabWidth(jq);
				if(scrollType == "right"){
					var lw = (_tabInnerWidth-wrap[0].scrollLeft)-wrap.outerWidth();
					if(lw>0 && (!wrap[0].scrollLeft || wrap[0].scrollLeft)){
						var pos = lw>deltaX ? Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth()):Math.min(wrap._scrollLeft() + lw, getMaxScrollWidth());
						wrap.animate({scrollLeft: pos}, opts.scrollDuration);
					}else if(lw<0 && wrap[0].scrollLeft){
						var pos = Math.min(wrap._scrollLeft() + lw, getMaxScrollWidth());
						wrap.animate({scrollLeft: pos}, opts.scrollDuration);
					}else{
						return;
					}
				}else{
					if(Math.abs(deltaX) > Math.abs(wrap[0].scrollLeft)){
						var _X = -wrap[0].scrollLeft;
						var pos = Math.min(wrap._scrollLeft() + _X, getMaxScrollWidth());
					}else{
						var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
					}
					wrap.animate({scrollLeft: pos}, opts.scrollDuration);
				}
				function getMaxScrollWidth(){
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function(){
						w += jq.outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			},
			getTabIndex:function(jq,tabId){
				var options = jq.data("tyTab").options;
				var _tabs=options.tabs;
				//TODO
				for(var i=0;i<_tabs.length;i++){
					if(_tabs[i].id ==tabId){
						return i;
					}
				}
				return -1;
			},
			refreshTab:function(jq,tabId){
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					var pageNow = top.document.getElementById('page_'+tabId);
					pageNow.contentWindow.location.reload();
				} else {
					return $("#_ty_tab_item_container_" + tabId)[0].contentWindow.location.reload();
				}

			},
			close:function (jq,tabId) {
				if (top.app_new && typeof top.app_new == 'object' && top.app_new._isVue && !jq.data("tyTab")) {
					top.app_new.closeTag(tabId)
				} else {
					close(jq,tabId);
				}
			}
		};
		// ===========================
		/**
		 * 配置参数说明
		 * @type {{fit: boolean, width: string, height: string, position: string, leftTabWidth: number, excWidth: number, excHeight: number, excHorizontal: Array, excVertical: Array, tabs: Array, afterResize: null, itemSelectHandler: null}}
		 */
		$.fn.tyTab.defaults = {
			fit : true,
			width : "100%",
			height : "600",
			position : "top",
			leftTabWidth : 30,
			excWidth : 0,// 横向排除宽度
			excHeight : 0,// 纵向排除高度
			excHorizontal : [],// 横向排除元素宽度
			excVertical : [],// 纵向排除元素宽度
			tabs : [],
			inData:null,
			afterResize : null,
			itemSelectHandler : null,
			scrollIncrement:140,
			scrollDuration:400,
			onContextMenu:function(e,id,index){}
		};
	}
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}
})();
