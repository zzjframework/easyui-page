var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页

$(function () {
	//查询条件下拉列表
	$("#q_para_name").combobox({
		valueField:'id',
		textField:'text',
		data:[{id:'1',text:'系统参数'},{id:'2',text:'交易前置'},{id:'3',text:'交易中心'}]
	});
	//列表
    $('#table').datagrid({
        fit: true,
        striped: true,//是否开启斑马线

        //显示分页控件栏
        pagination: true,
        //按钮
        toolbar: '#tb',
		 data:[],
        //要显示的列
        columns: [[
            {
                field: 'para_no',
                title: '编号',
                width: 100,
            },
            {
                field: 'para_name',
                title: '参数名称',
                width: 100,
                halign: 'center',
            },
            {
                field: 'para_type',
                title: '参数类型',
                width: 100,
            },
            {
                field: 'para_value',
                title: '参数值',
                width: 100,
            },
            {
                field: 'flag',
                title: '状态',
                width: 100,
            },{
                field: 'operator_id',
                title: '操作员',
                width: 100,
            }
            ,{
                field: 'remark',
                title: '备注',
                width: 200,
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

    //提交表单
    $('#form').dialog({
        width: 350,
        title: '增加内容',
        iconCls: 'icon-add',
        //初始化时先关闭表单
        closed: true,
        modal: true,
        buttons: [{
            text: '提交',
            iconCls: 'icon-ok',
            handler: function () {
                var formname = $('#formname').val();
                var sex = $('#sex').val();
                if (formname == "" || sex == "") {
                    return;
                }
                else {
                    console.log(formname + ',' + sex);

                }
            }       
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#form').dialog('close');
                $('#formname').val('');
                $('#sex').val('');
            }
        }],
    });

    query();
});
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
function query(){
    var para={};
    var para_no=$("#q_para_no").textbox("getValue");
    var para_name=$("#q_para_name").textbox("getValue");
    var paras=getFormValues($('#query_form'));
    console.log(paras);
    if(para_no!=''){
        para.para_no=para_no;
    }
    if(para_name!=''){
        para.para_name=para_name;
    }
    var json={para:para};

    request({
        url:"List@Para.do",
        data:{_JSON_:JSON.stringify(json),pageIndex:_pageNumber,pageSize:_pageSize},
        success:function (res) {
            var data={rows:res.data,total:res.total};
            $("#table").datagrid("loadData",data)
        }
    });
}

function add(){

}
function edit(){

}
function save(){

}
function remove(){

}

function getFormValues(dom){
    var d={};
    var t = $(dom).serializeArray();
    $.each(t, function() {
        d[this.name] = this.value;
    });
    return d;
}