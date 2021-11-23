require(["jquery","tyBase"],function ($) {
    var attrExtendUrl = $.getUrlParam("extendurl");
    var indata = parent.indata || {"layoutdata":null,"formthisstory":null,"serverUrl":""};
    require(["jqueryui","Ajax","bootstrap","tyUtil", attrExtendUrl],function (ui, Ajax, bootstrap, util, attrExtend) {
        var layouthistory,__formthisstory= [],
            stopsave = 0,
            startdrag = 0;
        window.demoHtml = $(".ty-est").html();
        $(function () {
            $(".ty-est").css("min-height", $(window).height() - 40);
            initAuto();
        })



        /**
         * 初始化自定义表单
         */
        function initAuto() {
            setIndate();
            restoreData();
            initDrag();
            initContainer();
            initHandler();
        }

        /**
         * 设置初始值
         */
        function setIndate() {
            (indata.layoutdata)? localStorage.setItem("layoutdata",JSON.stringify(indata.layoutdata)):localStorage.setItem("layoutdata","")
            if(indata.formthisstory){
                localStorage.setItem("formthisstory",JSON.stringify(indata.formthisstory))
            }
        }
        /**
         * 装载story对象
         * @returns {boolean}
         */
        function restoreData(){
            if (supportstorage()) {
                layouthistory = localStorage.getItem("layoutdata")?JSON.parse(localStorage.getItem("layoutdata")):null;
                formthisstory = localStorage.getItem("formthisstory")? JSON.parse(localStorage.getItem("formthisstory")):[];

                if (!layouthistory) return false;
                window.demoHtml = layouthistory.list[layouthistory.count-1];
                if (window.demoHtml){
                    $(".ty-est").html(window.demoHtml);
                    setLayoutColumn();
                }
            }
        }
        /**
         * 初始化拖放
         */
        function initDrag() {
            var $nav = $(".sidebar-nav");
            $nav.find(".lyrow").draggable({
                connectToSortable: ".ty-est",
                helper: "clone",
                handle: ".drag",
                start: function(e,t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                drag: function(e, t) {
                    t.helper.width(400)
                },
                stop: function(e, t) {
                    t.helper.width("100%");
                    t.helper.height('auto');
                    setLayoutColumn();
                    $(".ty-est .column").sortable({
                        opacity: .35,
                        connectWith: ".column",
                        start: function(e,t) {
                            if (!startdrag) stopsave++;
                            startdrag = 1;
                        },
                        stop: function(e,t) {
                            if(stopsave>0) stopsave--;
                            startdrag = 0;
                        }
                    });
                    if(stopsave>0) stopsave--;
                    startdrag = 0;
                }
            });
            $nav.find(".box").draggable({
                connectToSortable: ".column",
                helper: "clone",
                handle: ".drag",
                start: function(e,t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                drag: function(e, t) {
                    t.helper.width(400)
                },
                stop: function(e, t) {
                    t.helper.width("100%");
                    t.helper.height(46);
                    editorContanerHandler();
                    if(stopsave>0) stopsave--;
                    startdrag = 0;
                }
            });
        }

        /**
         *
         */
        function setLayoutColumn() {
            var classNames = $(".ty-est").find('[class^=col-lg-]')[0].className,
                _column = 12/Number((classNames.split(" ")[0]).replace(/col-lg-/g,''));
            localStorage.setItem("column",_column);
        }

        /**
         * 初始化事件
         */
        function initHandler() {
            window.clearLayout = clearLayout;
            $("#clear").click(function(e) {
                e.preventDefault();
                clearLayout()
            });
            $("#preview").unbind("click").bind("click",function() {
                var column = localStorage.getItem("column");
                require(["tyUtil", "easyModule", "tyUI"], function (tt, easyloader, ty) {
                    using(["messager","dialog"], function () {
                        ty.createIframeDialog({
                            title: "表单预览",
                            src: "/src/scripts/widget/tyLayoutit/widgetView.html",
                            width: Number(column)*350 || 680,
                            height: 560,
                            indata:{
                                serverUrl:indata.serverUrl,                            },
                            buttons:[],
                            minimizable: false,
                            maximizable: false
                        })
                    })
                    return false
                });
            })
            /*$("#saveHtml").click(function () {
                handleSaveLayout("save");
                //TODO后端接口
            });*/
            $(".ty-est").delegate(".remove", "click", function(e) {
                e.preventDefault();
                $(this).parent().remove();
                $("#extend_table").empty();
                removeCurrentStory($(this).parent());
            })
            $(".view-form-ele").click(function () {
                $("#est_box").removeClass().addClass("col-lg-9 col-md-9 col-ms-9");
                $("#attrs_box").show();
                $(".view-form-ele").removeClass("view-selected");
                $(this).addClass("view-selected");
                loadExtendAttributes($(this));
            })
            $("#__save__").on("click",function () {
                if(checkAttributeForm()){
                    var params = getFromJson($("#base_attributes").serializeArray());
                    if(checkAttribute(params,"attributeId")){
                        callEle(params);
                    }else{
                        $.message({
                            type: "error",
                            text: "保存失败，已存在相同的元素ID！",

                        })
                        return;
                    };
                }else{
                    $.message({
                        type: "error",
                        text: "必填项不能为空！",

                    })
                    return;
                }

            })
            $("#__reset__").click(function () {
                $("#base_attributes")[0].reset();
            })
        }

        /**
         *
         * @returns {boolean}
         */
        function checkAttributeForm() {
            var $input = $("#base_attributes .input-require");
            var flag = true;
            $.each($input,function (i,input) {
                flag = $(input).val() ? true && flag : false&&flag;
                if(!flag){
                    $(input).focus();
                    return false;
                }
            })
            return flag;

        }
        /**
         * 自定义表单编辑容器的事件挂载
         */
        function editorContanerHandler() {
            $(".view-form-ele").unbind("click").click(function () {
                $("#est_box").removeClass().addClass("col-lg-9 col-md-9 col-ms-9");
                $("#attrs_box").show();
                $(".view-form-ele").removeClass("view-selected");
                $(this).addClass("view-selected");
                loadExtendAttributes($(this));
            })
        }

        /**
         * 表单序列化格式键值对改造
         * @param lists
         */
        function getFromJson(lists) {
            var temp = {};
            $.each(lists,function (i,list) {
                temp[list.name] = list.value;
            })
            return temp;
        }

        /**
         * 元素回调逻辑
         * @param opt
         */
        function callEle(opt) {
            if(opt && !$.isEmptyObject(opt)){
                var currentEle = $(".view.view-form-ele.view-selected");
                (opt.attributeIsRequired == "1")?
                    currentEle.find("label").html('<span class="require-label">*</span>'+opt["attributeName"]+":"):
                    currentEle.find("label").html(opt["attributeName"]+":");
                (opt.attributeType == "select" || opt.attributeType == "selecttree")?
                    currentEle.find("select").attr({"param":JSON.stringify(opt)}):
                    currentEle.find("input").attr({"param":JSON.stringify(opt)});
                if(opt.placeholderName){
                    currentEle.find("input").attr({"placeholder":opt.placeholderName});
                }
                if(opt.attributeType == "date" || opt.attributeType == "datetime" || opt.attributeType == "time" && opt.defaultDate){
                    currentEle.find("input").val(opt.defaultDate);
                }
                saveAutoForm(opt);
                currentEle.removeClass("view-selected");
                resetForm();
            }
        }

        /**
         * 检测指定属性是否已经存在
         * @param option
         * @param key
         * @returns {boolean}
         */
        function checkAttribute(option,key) {
            var checkAttr = option[key],
                count = 0;
            var formStory = localStorage.getItem("formthisstory") ? JSON.parse(localStorage.getItem("formthisstory")) : null;
            if(formStory){
                $.each(formStory,function (i,attrs) {
                    if(attrs[key] === checkAttr && option.attributeGuid != attrs.attributeGuid){
                        count ++;
                    }
                })
                return (count==0)?true:false;
            }
            return true;
        }

        /**
         * 保存当前元素指定
         * @param param
         */
        function saveAutoForm(param) {
            var eleGuid = param.attributeGuid;
            var formStory = localStorage.getItem("formthisstory") ? JSON.parse(localStorage.getItem("formthisstory")) : null;
            var isExist = false;
            if(formStory) {
                __formthisstory = formStory;
                $.each(formStory, function (i, attrs) {
                    if (attrs['attributeGuid'] === eleGuid) {
                        isExist = true;
                        formStory[i] = param;
                        return false;
                    }
                })
            }
            if(!isExist) {
                __formthisstory.push(param);
                localStorage.setItem("formthisstory", JSON.stringify(__formthisstory));
            }else{
                localStorage.setItem("formthisstory", JSON.stringify(formStory));
            }
            handleSaveLayout("save");
        }

        /**
         * 重置表单含位置大小和属性表单
         */
        function resetForm() {
            $("#est_box").removeClass().addClass("col-lg-11 col-md-11 col-ms-11");
            $("#attrs_box").hide();
            $("#base_attributes")[0].reset();
            $("#base_attributes select option").removeAttr("selected");
            $("#extend_attributes").hide();
            $("#extend_table").empty();
        }

        /**
         * 检测是否支持story
         * @returns {boolean}
         */
        function supportstorage() {
            if (typeof window.localStorage=='object')
                return true;
            else
                return false;
        }

        /**
         * 容器保存事件
         */
        function handleSaveLayout(status) {
            var e = $(".ty-est").html();
            if (!stopsave && e != window.demoHtml) {
                stopsave++;
                window.demoHtml = e;
                saveLayout(status);
                stopsave--;
            }
        }

        /**
         * 保存事件
         */
        function saveLayout(status){
            var data = layouthistory;


            if (!data) {
                data={};
                data.count = 0;
                data.list = [];
            }

            if (data.list.length>data.count) {
                for (var i=data.count;i<data.list.length;i++)
                    data.list[i]=null;
            }
            data.list[data.count] = window.demoHtml;
            data.count++;
            if (supportstorage()) {
                localStorage.setItem("layoutdata",JSON.stringify(data));
                (status == "save")?
                    $.message({
                        type:"success",
                        text:"自定义表单保存成功！"
                    }):
                    $.message({
                        type:"success",
                        text:"自定义表单更新成功！"
                    })
            }
            layouthistory = data;

        }

        /**
         * 移除元素
         */
        function removeCurrentStory($ele) {
            var type = $ele.find(".view").attr("data-type");
            var __formthisstory = localStorage.getItem("formthisstory")?JSON.parse(localStorage.getItem("formthisstory")):[];
            if(type != "column"){
                deleteEleStory($ele.find(".view").find(".form-control"),__formthisstory)
                var paramString = $ele.find(".view").find(".form-control").attr("param");
                var guid = paramString ? (JSON.parse(paramString)).attributeGuid:null;
                if(guid){
                    $.each(__formthisstory,function (i,item) {
                        if(item.attributeGuid == guid){
                            __formthisstory.splice(i,1);
                            return false;
                        }
                    });
                }
            }else {
                var $column = $ele.find(".view");
                var $eles =$column.find(".view-form-ele");
                $.each($eles,function (i,ele) {
                    _type = $(ele).attr("data-type");
                    deleteEleStory($(ele).find(".form-control"),__formthisstory);
                })
            }
            localStorage.setItem("formthisstory", JSON.stringify(__formthisstory));
            ($(".ty-est .lyrow").length)? handleSaveLayout("update"):clearLayout();

        }

        /**
         *
         * @param ele
         * @param story
         */
        function deleteEleStory(ele,story) {
            var paramString = ele.attr("param");
            var guid = paramString?(JSON.parse(paramString)).attributeGuid:null;
            if(guid){
                $.each(story,function (i,item) {
                    if(item.attributeGuid == guid){
                        story.splice(i,1);
                        return false;
                    }
                });
            }
        }

        /**
         * 清除整个容器和story
         */
        function clearLayout() {
            $(".ty-est").empty();
            layouthistory = null;
            if (supportstorage())
                localStorage.removeItem("layoutdata");
                localStorage.removeItem("formthisstory");
                __formthisstory = [];
            resetForm();
            $("#est_box").removeClass().addClass("col-lg-11 col-md-11 col-ms-11");
            $("#attrs_box").hide();
            $.message({
                type:"info",
                text:"容器已经清空！"
            })
        }

        /**
         * 容器变化监听
         */
        $(window).resize(function() {
            $(".ty-est").css("min-height", $(window).height() - 40)
        });



        /**
         * 初始化容器
         */
        function initContainer(){
            $(".ty-est, .ty-est .column").sortable({
                connectWith: ".column",
                opacity: .35,
                handle: ".drag",
                start: function(e,t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                stop: function(e,t) {
                    if(stopsave>0) stopsave--;
                    startdrag = 0;
                }
            });
        }

        /**
         *
         * @returns {string}
         */
        function guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        /**
         * 加载扩展属性
         * @param $view
         */
        function loadExtendAttributes($view) {
            var $wrap= $("#extend_table");
            var type = $view.data("type");

            if(attrExtend && !$.isEmptyObject(attrExtend)){
                $("#extend_attributes").show();
                if(attrExtend[type] && attrExtend[type].extends){
                    var _extends = attrExtend[type].extends;
                    createExtendsByConfig($wrap,_extends,type);
                }else{
                    $("#extend_attributes").hide();
                    $("#extend_table").empty();
                }
                var $selected = (type == "select" || type== "selecttree") ? getObjByType($view,"select"):getObjByType($view,"input");
                var oldData = $selected.attr("param")?JSON.parse($selected.attr("param")):null;
                if(oldData){
                    loadForm(oldData,$("#base_attributes"));
                }else{
                    $("#base_attributes")[0].reset();
                    $("#base_attributes select option").removeAttr("selected");
                    $('[name="attributeType"]').attr("value",type);
                    $('[name="attributeGuid"]').attr("value",guid());
                }
            }
        }

        /**
         *
         * @param $view
         * @param value
         * @returns {*}
         */
        function getObjByType($view,value) {
            var obj =null;
            switch (value){
                case "input":
                    obj = $view.find("input");
                    break;
                case "select":
                    obj = $view.find("select");
                    break;
            }
            return obj;

        }

        /**
         * 根据配置创建扩展项;
         * @param wrap
         * @param eds
         * @param type
         */
        function createExtendsByConfig(wrap,eds,type) {
            wrap.empty();
            $.each(eds,function (i,ed) {
                var _renderHtml = renderExtend(ed,type);
                wrap.append(_renderHtml);
            });
        }

        /**
         * 渲染扩展属性元素
         * @param param
         * @param type
         * @returns {string}
         */
        function renderExtend(param,type) {
            var __attribute__ = "";
            switch (type){
                case "input":
                case "number":
                case "textarea":
                case "editor":
                    var isRequired = param.required ? "<span class=\"require-label\">*</span>" : "<span>&nbsp;</span>",
                        labelName  = param.labelName,
                        maxLength = param.length ? " maxlength="+param.length+" ":"";
                    var ele="";
                    if(param.type == "dropdown"){
                        var _id = param.id,_name = param.name,_url = param.url,_key = param.key,_value = param.value;
                        _url ? Ajax.get({url:_url,async:false},function (result) {ele =(result.success && $.isArray(result.content))? createDropDown(result.content,_id,_name,_key,_value):createEmptyDropDown(_id,_name);}):ele  = createEmptyDropDown(_id,_name);
                    }else if(param.type == "radio"){
                        ele  = createRadios(param.lists,param.id,param.name);
                    }else{
                        ele = param.required ? '<input type=\"text\" id='+param.id+'  name='+param.name+' placeholder='+param.placeholder+' class="form-control input-require" autocomplete="off" required  '+maxLength+'>': '<input type=\"text\" id='+param.id+'  name='+param.name+' placeholder='+param.placeholder+' class=\"form-control\" autocomplete=\"off\"  '+maxLength+'>';
                    }
                    __attribute__ = '<tr>' +
                        '<td><label class="ty-label">'+isRequired+labelName+':</label></td>' +
                        '<td>'+ele+'</td>' +
                        '</tr>';
                    break;
                case "date":
                case "datetime":
                case "time":
                    var isRequired = param.required ? "<span class='require-label'>*</span>" : "<span>&nbsp;</span>",
                        labelName  = param.labelName,
                        maxLength = param.length ? " maxlength="+param.length+" ":"";
                    var ele="";
                    if(param.type == "dropdown"){
                        var _id = param.id,_name = param.name,_url = param.url,_key = param.key,_value = param.value;
                        _url ? Ajax.get({url:_url,async:false},function (result) {ele =(result.success && $.isArray(result.content))?createDropDown(result.content,_id,_name,_key,_value):createEmptyDropDown(_id,_name);}):ele  = createEmptyDropDown(_id,_name);
                    }else if(param.type == "radio"){
                        ele  = createRadios(param.lists,param.id,param.name);
                    }else{
                        ele = param.required ? '<input type="text" id='+param.id+'  name='+param.name+' placeholder='+param.placeholder+' class="form-control input-require" autocomplete="off" required '+maxLength+'>':'<input type="text" id='+param.id+'  name='+param.name+' placeholder='+param.placeholder+' class="form-control" autocomplete="off" '+maxLength+'>';
                    }
                    __attribute__ = '<tr>' +
                        '<td><label class="ty-label">'+isRequired+labelName+':</label></td>' +
                        '<td>'+ele+'</td>' +
                        '</tr>';
                    break;
                case "select":
                case "selecttree":
                    var isRequired = param.required ? "<span class='require-label'>*</span>" : "<span>&nbsp;</span>",
                        labelName  = param.labelName;
                    var ele="";
                    if(param.type == "dropdown"){
                        var _id = param.id,_name = param.name,_url = param.url,_key = param.key,_value = param.value;
                        _url ? Ajax.get({url:_url,async:false},function (result) {ele =(result.success && $.isArray(result.content))?createDropDown(result.content,_id,_name,_key,_value):createEmptyDropDown(_id,_name);}):ele  = createEmptyDropDown(_id,_name);
                    }else if(param.type == "radio"){
                        ele  = createRadios(param.lists,param.id,param.name);
                    }else{
                        ele = param.required? '<input type="text" id='+param.id+' name='+param.name+' class="form-control input-require" style="width: 166px;height: 28px;line-height: 1; padding: 0 6px;" required/>' : '<input type="text" id='+param.id+' name='+param.name+' class="form-control" style="width: 166px;height: 28px;line-height: 1; padding: 0 6px;"/>';
                    }
                    __attribute__ = $('<tr>' +
                        '<td><label class="ty-label">'+isRequired+labelName+':</label></td>' +
                        '<td>'+ele+'</td>' +
                        '</tr>');
                    break;
            }
            return __attribute__;
        }

        /**
         * 创建Radio
         * @param data
         * @param _name
         * @returns {string}
         */
        function createRadios(data,_id,_name) {
            var ele  = "<div>";
            $.each(data,function (i,list) {
                var id = _id+"_"+ i,
                    code = list.code,
                    name = list.name,
                    status = list.selected ? "checked='checked'":"";
                ele +='<span class="attr-chioce"><input type="radio" name ='+_name+' id='+id+' value='+code+' '+status+' ><label for='+id+'>'+name+'</label></span>'
            })
            ele +="</div>";
            return ele;
        }
        /**
         * 创建非空下拉属性框
         * @param lists
         * @param id
         * @param name
         * @param key
         * @param value
         * @returns {string}
         */
        function createDropDown(lists,id,name,key,value) {
            var ele  = "<select id="+id+" name="+name+" class='form-control' style='height: 26px;padding: 0 4px;line-height: 26px;'>";
            if($.isArray(lists)){
                $.each(lists,function (i,option) {
                    ele += !option ? "<option value='' selected>--</option>":"<option value="+option[key]+">"+option[value]+"</option>";
                })
            }
            ele +="</select>";
            return ele;
        }

        /**
         * 创建空下拉属性框
         * @param _id
         * @param _name
         * @returns {string}
         */
        function createEmptyDropDown(_id,_name) {
            return "<select id="+_id+" name="+_name+" class='form-control' style='height: 26px;padding: 0 4px;line-height: 26px;'>" +
                "<option value='' selected>--</option>" +
                "</select>";
        }

        /**
         * 回显元素数据
         * @param opt
         * @param $form
         */
        function loadForm(opt,$form) {
            for (var attr in opt) {
                var val = opt[attr];
                var obj = $form.find('[name=' + attr + ']'),
                    type = obj.attr("type") || (obj[0].tagName).toLocaleLowerCase();
                switch (type) {
                    case "text":
                    case "textarea":
                    case "number":
                        obj.val(val);
                        break;
                    case "radio":
                    case "checkbox":
                        for (var i = 0; i < obj.length; i++) {
                            obj[i].value == val ? $(obj[i]).attr("checked", true) : $(obj[i]).removeAttr("checked");
                        }
                        break;
                    case "select":
                        val ? obj.find('option[value=' + val + ']').attr("selected", true):obj.find('option:eq(0)').attr("selected", true)
                        break;
                }


            }
        }
    })
});
/**
 * 获取当前表单中的数据
 * @returns {{layoutdata: ({count: number, list: string[]}|indata.layoutdata|{count, list}|null), formthisstory: any}}
 */
function getFormData() {
    var _column = localStorage.getItem("column");
     var _layoutdata =localStorage.layoutdata?JSON.parse(localStorage.layoutdata):"";
        _layoutdata["column"]=+_column;
    return {
        "layoutdata":JSON.stringify(_layoutdata),
        "formthisstory":localStorage.formthisstory ? JSON.parse(localStorage.formthisstory):""
    }
}