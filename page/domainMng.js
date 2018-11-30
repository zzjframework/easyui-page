var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页

$(function () {
    //列表
    $('#table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线

        //显示分页控件栏
        pagination: true,
        pageNumber: 1,//初始化的时候在第几页
        pageSize: 10,//，每页显示的条数
        pageList: [5, 10, 15, 20],//每页显示的条数

        //按钮
        toolbar: '#tb',
        data:query(),
        //rownumbers:true,
        onClickRow: update,
        //要显示的列
        columns: [[
            {
                field: 'rowNumbers',
                title: '序号',
                align: 'center',
                width: '5%',
                formatter: function (val, rec, index) {
                    var op = $('#table').datagrid('options');
                    return op.pageSize * (op.pageNumber - 1) + (index + 1);
                }
            },
            {
                field: 'id',
                title: '选择',
                checkbox: true,
            },
            {
                field: 'domain_code',
                title: '企业域编码',
                width: '20%',
                halign: 'center',
                editor: "text",
            },
            {
                field: 'domain_name',
                title: '企业域名称',
                width: '36%',
                halign: 'center',
                editor: "text",
            },
            {
                field: 'act_code',
                title: '激活码',
                width: '36%',
                halign: 'center',
                editor: "text",
            }
            ]],
    });
    //设置分页控件
    var p = $('#table').datagrid('getPager');
    $(p).pagination({
        pageSize: _pageSize,//每页显示的记录条数，默认为10
        pageNumber:_pageNumber,
        pageList: [5,10,15,20],//可以设置每页记录条数的列表
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onSelectPage:function (pageNumber, pageSize) {
            _pageNumber=pageNumber;
            _pageSize=pageSize;
            query();
        },
        onChangePageSize:function(){
            _pageNumber:1;
            $(p).pagination({pageNumber:1});
        }
    });
    query();
});

function query() {
    var data = [{id:"001",domain_code:"0001",domain_name:"开",act_code:"64F7BF4CBBDC49E7F4418A5E01A54E"},
        {id:"002",domain_code:"0002",domain_name:"不顾一切",act_code:"64F7BF4CBBDC49E7F48A5E01A54E"},
        {id:"003",domain_code:"0003",domain_name:"看得",act_code:"64F7BF4CBBDC49E7F48A5E01A54E"},
        {id:"004",domain_code:"0004",domain_name:"鳞片",act_code:"64F7BF4CBBDC49E7F48A5E0154E"},
        {id:"005",domain_code:"0005",domain_name:"国元证券",act_code:"64F7BF4CBBDC497F48A5E01A54E"},
        {id:"006",domain_code:"0006",domain_name:"牙齿",act_code:"64F7BF4CBBDC49E7F8A5E01A54E"},
        {id:"007",domain_code:"0007",domain_name:"苯佐卡因糊剂",act_code:"64F7BF4CBBDC497F48A5E01A54E"}];
    return data;
}

function update(index) {
    if (endEditing()){
        $("#table")
            .datagrid("selectRow", index)
            .datagrid("beginEdit", index);
        endEditing();
    }
}

function add() {
    // $("#table").datagrid("appendRow", {
    //     index: 0,
    //     row: {},
    // }).datagrid("getRows").length-1;
    // $("#table").datagrid('beginEdit',$("#table").datagrid("getRows").length - 1)
    if (endEditing()){
        $('#table').datagrid('appendRow',{status:'P'});
        editIndex = $('#table').datagrid('getRows').length-1;
        $('#table').datagrid('selectRow', editIndex)
            .datagrid('beginEdit', editIndex);
    }
}

function remove() {
    if (editIndex == undefined){return}
    $('#table').datagrid('cancelEdit', editIndex)
        .datagrid('deleteRow', editIndex);
    editIndex = undefined;
    // var obj = document.getElementsByName("id");
    // var check_val = [];
    // for(k in obj){
    //     if(obj[k].checked)
    //         check_val.push(obj[k].value);
    // }
    // console.log(check_val);
    // var editIndex = $('#table').datagrid('getRows').length-1 ;
    // $('#table').datagrid('deleteRow', editIndex);
    // editIndex = undefined;
}

function save() {
    $("#table").datagrid("acceptChanges");
    var rows = $("#table").datagrid("getSelections");
    if(rows.length>1){
        alert('每次只能保存一条');
    }else{
        var reqData={};
        for (var i = 0; i<rows.length;i++){
            var row=rows[i];
            var req={};
            reqData.domain_code=row.domain_code;
            reqData.domain_name=row.domain_name;
            reqData.act_code=row.act_code;
            req.data=reqData;
            req.action="discountSaveRow";
        }
    }
    //var change = $('#table').datagrid('getChanges');
    // console.log(reqData);
    // request({
    //     url: "",
    //     data:reqData,
    //     type: "post",
    // });
}
var editIndex = undefined;
function endEditing(){
    if (editIndex == undefined){return true}
    if ($('#table').datagrid('validateRow', editIndex)){
        var ed = $('#table').datagrid('getEditor', {index:editIndex,field:'productid'});
        var productname = $(ed.target).combobox('getText');
        $('#table').datagrid('getRows')[editIndex]['productname'] = productname;
        $('#table').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}
function onClickRow(index){
    if (editIndex != index){
        if (endEditing()){
            $('#table').datagrid('selectRow', index)
                .datagrid('beginEdit', index);
            editIndex = index;
        } else {
            $('#table').datagrid('selectRow', editIndex);
        }
    }
}
