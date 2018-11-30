var _pageSize = 10;//每页大小
var _pageNumber = 1;//当前第几页
$(function () {
    //查询条件下拉列表
    $("#flag1").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: [{id: '1', text: '全部'}, {id: '2', text: '正常'}, {id: '3', text: '停用'}]
    });
    //币种名称查询
    $("#curr_name1").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: []
    });

    //新增下拉列表
    $("#flag2").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: [{id: '2', text: '正常'}, {id: '3', text: '停用'}]
    });
    //修改下拉列表
    $("#flag3").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: [{id: '2', text: '正常'}, {id: '3', text: '停用'}]
    });
    //列表
    $('#table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true, //是否开启斑马线
        //显示分页控件栏
        pagination: true,

        sortName: 'createtime',
        sortOrder: 'desc',
        //按钮
        toolbar: '#tb',
        //要显示的列
        columns: [
            [
                {
                    field: 'curr_code',
                    title: '币种编号',
                    width: 100,
                    halign: 'center',
                }, {
                field: 'curr_name',
                title: '翻译币种名称',
                width: 200,
                halign: 'center',
            },
                {
                    field: 'curr_des',
                    title: '币种描述',
                    width: 100,
                },
                {
                    field: 'flag',
                    title: '状态',
                    width: 100,
                    formatter: function (value, row, index) {
                        if (value == '00000000') {
                            return '<span style="color: #2A00FF">正常</span>'
                        } else if (value == '10000000') {
                            return '<span style="color: red">停用</span>'
                        }
                    }
                },
                {
                    field: 'create_datetime',
                    title: '录入时间',
                    width: 200,
                    sortable: true,
                },
                {
                    field: 'modify_datetime',
                    title: '修改时间',
                    width: 200,
                    sortable: true,
                },
                {
                    field: 'operator_id',
                    title: '操作员',
                    width: 300,
                    halign: 'center',
                },
                {
                    field: 'remark',
                    title: '备注',
                    width: 200,
                    halign: 'center',
                },
                {
                    field: 'operation',
                    title: '操作',
                    width: 100,
                    halign: 'center',
                    formatter: function (value, row, index) {
                        var rowStr = JSON.stringify(row);
                        return "<a href='#' onclick='editRow(" + rowStr + ");' style='text-decoration: none;color: #2A00FF''>修改 </a>|" +
                            "<a href='#' onclick='deleteRow(" + rowStr + ");'style='text-decoration: none ;color: #2A00FF''> 删除</a>"
                    }
                }
            ]
        ]
    });
    var p = $('#table').datagrid('getPager');
    $(p).pagination({
        pageSize: _pageSize,//每页显示的记录条数，默认为10
        pageNumber: _pageNumber,
        pageList: [10, 20, 30, 40],//可以设置每页记录条数的列表
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onSelectPage: function (pageNumber, pageSize) {
            _pageNumber = pageNumber;
            _pageSize = pageSize;
            query();
        },
        onChangePageSize: function () {
            _pageNumber:1;
            $(p).pagination({pageNumber: 1});
        }
    });
    //查询
    query();
});

//查询
function handleSearch() {
    _pageSize = 10;
    _pageNumber = 1;
    var p = $('#table').datagrid('getPager');
    $(p).pagination({
        pageSize: _pageSize,
        pageNumber: _pageNumber,
    });
    query();
}

//分页
function query() {
    var curr = {};
    var curr_code = $("#curr_code1").textbox("getValue");
    var curr_name = $("#curr_name1").textbox("getValue");
    var flag = $("#flag1").textbox("getValue");
    if (flag == 2) {
        flag = "00000000";
    } else if (flag == 3) {
        flag = "10000000";
    } else {
        flag = "";
    }
    if (curr_code != '') {
        curr.curr_no = curr_code;
    }
    if (curr_name != '') {
        curr.curr_name = curr_name;
    }
    var json = {curr: curr};

    request({
        url: "CurrencyList@Currency.do",
        data: {curr_code: curr_code, curr_name: curr_name, flag: flag, pageIndex: _pageNumber, pageSize: _pageSize},
        success: function (res) {
            var data = {rows: res.data, total: res.total};
            $("#table").datagrid("loadData", data);
            initList();
        }
    });
}


//重置
function reset() {
    $('#formId').form('clear');
}

//新增
function add() {
    //$('#form').dialog();
    $('#form').dialog({
        width: 500,
        title: '新增',
        iconCls: 'icon-add',
        //初始化时先关闭表单
        //closed: true,
        modal: true,
        left: 150,
        top: 50,
        buttons: [{
            text: '提交',
            iconCls: 'icon-ok',
            handler: function () {
                var curr_code = $('#curr_code2').val();
                var curr_name = $('#curr_name2').val();
                var curr_des = $('#curr_des2').val();
                var remark = $('#remark2').val();
                var operator_id = $('#remark2').val();
                var flag = $("#flag2").val();
                if (flag == 2) {
                    flag = "00000000";
                } else if (flag == 3) {
                    flag = "10000000";
                }
                if (curr_code == "" || curr_name == "" || curr_des == "" || flag == "") {
                    $.messager.alert("输入提示", "必输项不能为空!");
                    return;
                }
                var add = [];
                add.push(curr_code, curr_name, curr_des, flag, operator_id, remark);
                addCurry(add);
                console.log(curr_code + ',' + curr_name + ',' + curr_des + ',' + flag + ',' + operator_id + ',' + remark);

            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#form').dialog('close');
                $('#curr_code2').val('');
                $('#curr_name2').val('');
                $('#curr_des2').val('');
                $('#flag2').val('');
                $('#remark2').val('');

            }
        }],
    });
    $('#form').window('center');
}

function addCurry(add) {
    var json = {para: [add]};
    request({
        url: "CurrencyAdd@Currency.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            query();
            console.log(res.data);
        }
    });
    $('#form').form('clear');
    $('#form').dialog("close");
}

//删除
function deleteRow(row) {
    //$.messager.alert("提示","123");
    $.messager.confirm('确认', '确定要删除吗?', function (r) {
        console.log(row);
        var id = row.id;
        console.log(id);
        var json = {
            para: [[id]]
        };
        if (r) {
            request({
                url: "CurrencyDelete@Currency.do",
                data: "_JSON_=" + JSON.stringify(json),
                success: function (res) {
                    console.log(res.info);
                    if (res.info == "成功处理1条记录") {//删除成功的条件
                        $.messager.show({
                            title: '提示信息',
                            msg: '删除信息成功!',
                            timeout: 500,
                            showType: 'slide',
                            style: {
                                top: 200,
                                left: 500
                            }
                        });
                        //重新加载数据

                        query();
                    } else {//删除失败
                        $.messager.alert({
                            title: '错误信息',
                            msg: '删除信息失败!',
                            timeout: 2000,
                            showType: 'slide',
                        });
                    }
                }
            });
        }
    });
}

//修改
function editRow(row) {
    var id = row.id;
    $('#curr_code3').textbox('setValue', row.curr_code);
    $('#curr_name3').textbox("setValue", row.curr_name);
    $('#curr_des3').textbox("setValue", row.curr_des);
    $('#flag3').textbox("setValue", flag(row.flag));

    function flag(flag) {
        if (flag == '00000000') {
            return '正常';
        } else if (flag == '10000000') {
            return '停用';
        }
    };
    console.log(id);
    $('#edit').dialog({
        width: 350,
        title: '修改内容',
        iconCls: 'icon-edit',
        modal: true,
        buttons: [{
            text: '提交',
            iconCls: 'icon-ok',
            handler: function () {
                var curr_code = $("#curr_code3").val();
                var curr_name = $("#curr_name3").val();
                var curr_des = $("#curr_des3").val();
                var flag = $("#flag3").val();
                if (flag == 2 || flag == "正常") {
                    flag = "00000000";
                } else if (flag == 3 || flag == "停用") {
                    flag = "10000000";
                }
                var operator_id = $("#curr_code3").val();
                var remark = $("#remark3").val();

                var json = {
                    para: [[curr_code, curr_name, curr_des, flag, operator_id, remark, id]]
                };

                $.messager.confirm('确认', '确定要修改信息吗?', function (r) {
                    if (r) {
                        request({
                            url: "CurrencyUpdate@Currency.do",
                            data: {_JSON_: JSON.stringify(json)},
                            success: function (res) {
                                console.log(res.info);
                                if (res.info == "成功处理1条记录") {
                                    $('#edit').dialog('close');//关闭对话框
                                    $.messager.show({
                                        title: '提示信息',
                                        msg: '修改信息成功!',
                                        timeout: 1000,
                                        showType: 'slide',
                                        style: {
                                            top: 200,
                                            left: 500
                                        }
                                    });
                                    //重新加载数据
                                    //$('#table').datagrid('reload');
                                    query();
                                } else {//修改失败
                                    $.messager.alert({
                                        title: '错误信息',
                                        msg: '修改信息失败!',
                                        timeout: 2000,
                                        showType: 'slide',
                                    });
                                }


                            }
                        });
                    }
                });
            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#edit').dialog('close');
                $('#curr_code3').val('');
                $('#curr_name3').val('');
            }
        }]
    });
}

//初始化
function initList() {
    var curr_code = '';
    var curr_name = '';
    var flag = '';
    var CurencyList = [{'id': '', 'text': '全部'}];
    request({
        url: "CurrencyList@Currency.do",
        data: {curr_code: curr_code, curr_name: curr_name, flag: flag, pageIndex: _pageNumber, pageSize: _pageSize},
        success: function (res) {
            var data = {rows: res.data, total: res.total};
            var arry = new Array();
            for (var i in data.rows) {
                var curr_name = data.rows[i].curr_name;
                if (curr_name && arry.indexOf(curr_name) == -1) {
                    arry.push(curr_name);
                    CurencyList.push({"id": data.rows[i].curr_name, "text": data.rows[i].curr_name});
                }
                ;
            }
            $("#curr_name1").combobox("loadData", CurencyList);
        }
    });
}

