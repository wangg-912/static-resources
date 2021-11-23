define("attrExtend",function () {
    return{
        "input":{
            extends:[
                {
                    "id":"maxLength",
                    "name":"maxLength",
                    "placeholder":"最大支持长度",
                    "labelName":"最大长度",
                    "length":"3",
                    "required":false
                },
                {
                    "id":"placeholderName",
                    "name":"placeholderName",
                    "placeholder":"提示语",
                    "labelName":"提示语",
                    "length":"24",
                    "required":false
                }
            ]
        },
        "number":{
            extends:[
                {
                    "id":"pointLength",
                    "name":"pointLength",
                    "placeholder":"保留小数位数",
                    "labelName":"小数位数",
                    "length":"3",
                    "required":true
                },
                {
                    "id":"placeholderName",
                    "name":"placeholderName",
                    "placeholder":"提示语",
                    "labelName":"提示语",
                    "length":"24",
                    "required":false
                }
            ]
        },
        "date":{
            extends:[
                {
                    "id":"defaultDate",
                    "name":"defaultDate",
                    "placeholder":"默认日期",
                    "labelName":"默认日期",
                    "length":"10",
                    "required":false
                },
                {
                    "id":"minDate",
                    "name":"minDate",
                    "placeholder":"最小日期",
                    "labelName":"最小日期",
                    "length":"10",
                    "required":false
                },
                {
                    "id":"maxDate",
                    "name":"maxDate",
                    "placeholder":"最大日期",
                    "labelName":"最大日期",
                    "length":"10",
                    "required":false
                }
            ]
        },
        "datetime":{
            extends:[
                {
                    "id":"defaultDate",
                    "name":"defaultDate",
                    "placeholder":"默认日期时间",
                    "labelName":"默认时间",
                    "length":"19",
                    "required":false
                },
                {
                    "id":"minDate",
                    "name":"minDate",
                    "placeholder":"最小日期时间",
                    "labelName":"最小时间",
                    "length":"19",
                    "required":false
                },
                {
                    "id":"maxDate",
                    "name":"maxDate",
                    "placeholder":"最大日期时间",
                    "labelName":"最大时间",
                    "length":"19",
                    "required":false
                }
            ]
        },
        "time":{
            extends:[
                {
                    "id":"defaultDate",
                    "name":"defaultDate",
                    "placeholder":"默认时间",
                    "labelName":"默认时间",
                    "length":"8",
                    "required":false
                },
                {
                    "id":"minDate",
                    "name":"minDate",
                    "placeholder":"最小时间",
                    "labelName":"最小时间",
                    "length":"8",
                    "required":false
                },
                {
                    "id":"maxDate",
                    "name":"maxDate",
                    "placeholder":"最大时间",
                    "labelName":"最大时间",
                    "length":"8",
                    "required":false
                }
            ]
        },
        "select":{
            extends:[
                {
                    "id":"dicLists",
                    "name":"dicLists",
                    "labelName":"字典编码",
                    "required":true
                },
            ]
        },
        "selecttree":{
            extends:[
                {
                    "id":"dicLists",
                    "name":"dicLists",
                    "labelName":"字典编码",
                    "required":true
                },
            ]
        },
        "textarea":{
            extends:[
                {
                    "id":"colspan",
                    "name":"colspan",
                    "placeholder":"合并列数",
                    "labelName":"合并列数",
                    "length":"1",
                    "required":false
                },
                {
                    "id":"maxLength",
                    "name":"maxLength",
                    "placeholder":"内容长度",
                    "labelName":"内容长度",
                    "length":"255",
                    "required":false
                },
                {
                    "id":"maxRow",
                    "name":"maxRow",
                    "placeholder":"默认行数 如2",
                    "labelName":"默认行数",
                    "length":"3",
                    "required":false
                }
            ]
        },
        "editor":{
            extends:[
                {
                    "id":"colspan",
                    "name":"colspan",
                    "placeholder":"合并列数",
                    "labelName":"合并列数",
                    "length":"1",
                    "required":false
                },
                {
                    "id":"maxRow",
                    "name":"maxRow",
                    "placeholder":"容器高度 如130",
                    "labelName":"容器高度",
                    "length":"3",
                    "required":false
                }
            ]
        }
    }
})