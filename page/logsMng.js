var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页

$(function () {
    queryTransList();
    queryUser();
    /*request({
        url:'GetInstAndUserTree@Base.do',
        data:{_JSON_: JSON.stringify({
                "includeUser": true,
                "treeMode": "root",
                "instId": "0000",
                "page_": "comm.html"
            })},
        success:function(res){
            var oldData = [];
            if (res) {
                oldData = res.data;
                for (var i in oldData) {
                    readTree(oldData[i], oldData);
                }
            }
            console.log(res.data);

        }
    });*/


    //$('#startTime').datebox('setValue', getCurentDateStr());
    $('#startTime').datebox('calendar').calendar({
        validator : function(date){
            var now = new Date();
            var d1 = new Date(now.getFullYear(),now.getMonth(),now.getDate()-1);
            return date <= d1;
        }
    });
    $('#endTime').datebox('setValue', getCurentDateStr());
    $('#endTime').datebox('calendar').calendar({
        validator : function(date){
            var now = new Date();
            var d1 = new Date(now.getFullYear(),now.getMonth(),now.getDate());
            return date <= d1;
        }
    });

    function getCurentDateStr()
    {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var clock = year + "-";
        if(month < 10) clock += "0";
        clock += month + "-";
        if(day < 10) clock += "0";
        clock += day;
        return clock;
    }

    //查询条件下拉列表
    $("#flags").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: [{id: '1', text: '全部'}, {id: '2', text: '正常'}, {id: '3', text: '失败'}]
    });
    //列表
    $('#table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线

        //显示分页控件栏
        pagination: true,
        //按钮
        toolbar: '#tb',
        //data: [],
        //要显示的列
        columns: [[
            {
                field: 'transdate',
                title: '交易发生时间',
                width: 100
            },
            {
                field: 'username',
                title: '操作员',
                width: 100,
                // halign: 'center',
            },
            {
                field: 'funccode',
                title: '交易编码',
                width: 100,
            },
            {
                field: 'transdata',
                title: '交易信息',
                width: 100,
            },

            {
                field: 'funcname',
                title: '交易名称',
                width: 100,
            },
            {
                field: 'succflag',
                title: '状态',
                width: 100,
                formatter: function (value, row, index) {

                    if (value == '成功') {
                        return '<span style="color: #2A00FF">正常</span>'
                    }
                    else if (value == '失败') {
                        return '<span style="color: red">失败</span>'
                    }
                }
            },
            {
                field: 'remark',
                title: '备注',
                width: 200,
            }
        ]],
    });
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

function queryTransList() {
    function readTree1(node,data){
        var children = node.children;
        if(node.name){
            node.text=node.name;
        }
        if(children&&children.length==0)delete node.children;
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                readTree1(children[i],data);
            }
        }else{
            return data;
        }
    }
    request({
       url:"GetTransList@Trans.do",
       success:function (res) {
           console.log(res.data);
           var data=null;
           if(res){
               data=res.data;
               for(var i=0,len=data.length;i<len;i++){
                   readTree1(data[i],data);
               }
               $('#transId').combotree('loadData',data);
               $('#transId').combotree({
                   panelHeight: 200,
                   editable: true,
               });

           }

       } 
    });
}
function queryUser(){

    function readTree(node,data){
        var children = node.children;
        if(node.name){
            node.text=node.name;
        }
        if (node.type == "i") {
            node.iconCls = "icon-tip";
        } else {
            node.iconCls = "icon-man";
        }
        if(children&&children.length==0)delete node.children;
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                readTree(children[i],data);
            }
        }else{
            return data;
        }
    }
    var json={
        includeUser:true,
        //treeMode:'root',
        //instId:'0000',
    }
    request({
        url: "GetInstAndUserTree@Base.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            console.log("查询");
            var data=null;
            if(res){
                data=res.data;
                for(var i=0,len=data.length;i<len;i++){
                    readTree(data[i],data);
                }
                //$('#userId').combotree('loadData',data);

                $('#userId').combotree({
                    data:data,
                    panelHeight: 'auto',
                    editable: true,
                });

            }
        }
    });
}
function handleSearch(){
    _pageSize=10;
    _pageNumber=1;
    var p = $('#table').datagrid('getPager');
    $(p).pagination({
        pageSize:_pageSize,
        pageNumber:_pageNumber,
    });
    query();
}
function query() {

    var time_start = $("#startTime").datebox('getValue');
    var time_end = $("#endTime").datebox('getValue');
    var userId = $("#userId").textbox('getValue');
    //var funcId=$("#transId").combobox('getValue');
    /*var flag = $("#flags").combobox('getValue');
    if(flag==2){

        flag="y";
    }else if (flag==3){
        flag="n";
    } else{
        flag="";
    }*/

    request({
        url: "LogList@Base.do",
        data: {"startDate":time_start,"endDate":time_end,"seleFunc":"","seleUser":userId,pageIndex:_pageNumber,pageSize:_pageSize},
        success: function (res) {
            console.log(res.data);
            var data={rows:res.data,total:res.total};
            $("#table").datagrid("loadData",data)
        }
    });
}
function reset() {
    $('#form_reset').form('clear');
}