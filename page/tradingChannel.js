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
    $("#agent_name1").combobox({
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

        fit: true,
        striped: true, //是否开启斑马线

        //显示分页控件栏
        pagination: true,
        /*      pageNumber: 1, //初始化的时候在第几页
              pageSize: 10, //，每页显示的条数
              pageList: [10, 15, 20], //每页显示的条数*/

        //通过POST传递到后台，然后进行排序。
        sortName: 'createtime',
        sortOrder: 'desc',

        //按钮
        toolbar: '#tb',

        //要显示的列
        columns: [[
            /* {
                field: 'id',
                title: '编号',
                //checkbox: true,
            }, */
            {
                field: 'agent_id',
                title: '渠道编号',
                width: 400,
                halign: 'center',
            }, {
                field: 'agent_name',
                title: '渠道名称',
                width: 100,
                halign: 'center',
            },
            {
                field: 'flag',
                title: '状态',
                width: 100,
                formatter: function (value, row, index) {
                    if (value == '00000000') {
                        return '<span style="color: #2A00FF">正常</span>'
                    }
                    else if (value == '10000000') {
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
                width: 100,
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
        ]]
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

    var agent = {};
    var agent_id = $("#agent_id1").textbox("getValue");
    var agent_name = $("#agent_name1").textbox("getValue");
    var flag = $("#flag1").textbox("getValue");
    if (flag == 2) {
        flag = "00000000";
    } else if (flag == 3) {
        flag = "10000000";
    } else {
        flag = "";
    }
    if (agent_id != '') {
        agent.agent_id = agent_id;
    }
    if (agent_name != '') {
        agent.agent_name = agent_name;
    }
    if (agent_id != '') {
        agent.curr_no = agent_id;
    }
    if (agent_name != '') {
        agent.curr_name = agent_name;
    }
    var json = {agent: agent};

    request({
        url: "List@Agent.do",
        data: {agent_id: agent_id, agent_name: agent_name, flag: flag, pageIndex: _pageNumber, pageSize: _pageSize},
        success: function (res) {
            var data = {rows: res.data, total: res.total};
            $("#table").datagrid("loadData", data)
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
                var agent_id = $('#agent_id2').val();
                var agent_name = $('#agent_name2').val();
                var agent_des = $('#agent_des2').val();
                var flag = $('#flag2').val();
                var remark = $('#remark2').val();
                var flag = $("#flag2").val();
                if (flag == 2) {
                    flag = "00000000";
                } else if (flag == 3) {
                    flag = "10000000";
                }
                if (agent_id == "" || agent_name == "" || agent_des == "" || flag == "") {
                    $.messager.alert("输入提示", "必输项不能为空!");
                    return;
                }
                var operator_id = "";
                var add = [];
                add.push(agent_id, agent_name, agent_des, flag, operator_id, remark);
                addTrad(add);
                console.log(agent_id + ',' + agent_name + ',' + agent_des + ',' + flag + ',' + operator_id + ',' + remark);

            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#form').dialog('close');
                $('#agent_id2').val('');
                $('#agent_name2').val('');
                $('#agent_des2').val('');
                $('#flag2').val('');
                $('#remark2').val('');

            }
        }],
    });
    $('#form').window('center');
}

//新增
function addTrad(add) {
    var json = {para: [add]};
    request({
        url: "Add@Agent.do",
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
                url: "Delete@Agent.do",
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
    $('#agent_id3').textbox('setValue', row.agent_id);
    $('#agent_name3').textbox("setValue", row.agent_name);
    $('#agent_des3').textbox("setValue", row.agent_des);
    $('#flag3').textbox("setValue", flag(row.flag));

    function flag(flag) {
        if (flag == '00000000') {
            return '正常';
        } else if (flag == '10000000') {
            return '停用';
        }
    };

    $('#edit').dialog({
        width: 350,
        title: '修改内容',
        iconCls: 'icon-edit',
        modal: true,
        buttons: [{
            text: '提交',
            iconCls: 'icon-ok',
            handler: function () {
                var agent_id = $("#agent_id3").val();
                var agent_name = $("#agent_name3").val();
                var agent_des = $("#agent_des3").val();
                var flag = $("#flag3").val();
                if (flag == 2 || flag == "正常") {
                    flag = "00000000";
                } else if (flag == 3 || flag == "停用") {
                    flag = "10000000";
                }
                var operator_id = $("#agent_id2").val();
                var remark = $("#remark3").val();

                var json = {
                    para: [[agent_id, agent_name, agent_des, flag, operator_id, remark, id]]
                };
                $.messager.confirm('确认', '确定要修改信息吗?', function (r) {
                    if (r) {
                        request({
                            url: "Update@Agent.do",
                            data: {_JSON_: JSON.stringify(json)},
                            success: function (res) {
                                console.log(res.info);
                                if (res.info == "成功处理1条记录") {
                                    $('#edit').dialog('close');//关闭对话框
                                    $.messager.show({
                                        title: '提示信息',
                                        msg: '修改信息成功!',
                                        timeout: 300,
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
                                        timeout: 300,
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
                $('#agent_id3').val('');
                $('#agent_name3').val('');
            }
        }]
    });
}

//初始化
function initList() {
    var agent_id = '';
    var agent_name = '';
    var flag = '';
    var AgentList = [{'id': '', 'text': '全部'}];
    request({
        url: "List@Agent.do",
        data: {agent_id: agent_id, agent_name: agent_name, flag: flag, pageIndex: _pageNumber, pageSize: _pageSize},
        success: function (res) {
            var data = {rows: res.data, total: res.total};
            var arry = new Array();
            for (var i in data.rows) {
                var agent_name = data.rows[i].agent_name;
                if (agent_name && arry.indexOf(agent_name) == -1) {
                    arry.push(agent_name);
                    AgentList.push({"id": data.rows[i].agent_name, "text": data.rows[i].agent_name});
                }
                ;
            }
            $("#agent_name1").combobox("loadData", AgentList);
        }
    });
}
