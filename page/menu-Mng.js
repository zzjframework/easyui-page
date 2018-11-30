var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页

$(function () {
    //按钮置灰
    $('#add_save_save').linkbutton('disable').hide();
    $('#add_save_remove').linkbutton('disable').hide();
    $('#add_save_cudo').linkbutton('disable').hide();
    $("input").attr("disabled",true);

    //用于判断菜单添加还是更新的标识
    var addcode = 0;
	//日志记录标志
	$("#logFlag").combobox({
		valueField:'id',
		textField:'text',
		data:[{id:'00000000',text:'记录日志',"selected":true},{id:'00000001',text:'不记录日志'}]
	});

    //日志记录标志修改
    /*$("#logFlag_edit").combobox({
        editable:false,
        valueField:'id',
        textField:'text',
        Data:[{id:'00000000',text:'记录日志'},{id:'00000001',text:'不记录日志'}],
    });*/

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
                field: 'id',
                title: '编号',
                //hidden:true,
                checkbox: true,
            },
            {
                field: 'code',
                title: '功能编码',
                width: 240,
                halign: 'center',
            },
            {
                field: 'name',
                title: '功能名称',
                width: 240,
                halign: 'center',
            },
            {
                field: 'menuname',
                title: '所属菜单',
                width: 240,
                halign: 'center',
            },
            {
                field: 'path',
                title: '接口路径',
                width: 240,
                sortable: true,
                halign: 'center',
            },
            {
                field: 'flag',
                title: '记录标志',
                width: 240,
                sortable: true,
                halign: 'center',
                formatter:function(value,row,index){
                    if(value=='00000000'){return '<span style="color: #2A00FF">记录日志</span>'}
                    else{return '<span style="color: red">不记录日志</span>'}
                }
            },
            {
                field: 'remark',
                title: '备注',
                width: 240,
                sortable: true,
                halign: 'center',
            }/*,
            {
                field: 'caozuo',
                title: '操作',
                width: 200,
                halign: 'center',
                formatter: function (value, row, index) {
                    return '<div style="padding:5px 0;"><a href="#" class="easyui-linkbutton" onclick="function_management.edit(value);">修改</a>||<a href="#" class="easyui-linkbutton" onclick="add-save.remove();">删除</a></div>';
                }
            }*/
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
            funcMenu();
        },
        onChangePageSize:function(){
            _pageNumber:1;
            $(p).pagination({pageNumber:1});
        }
    });

    //功能管理
    function_management = {
        //添加
        add: function () {
            //判断选择菜单
            var nodes = $('#MenuTree').tree('getSelected');	// get checked nodes
            console.log(nodes);
            if (nodes==null) {
                $.messager.alert("提示", "请选择所属菜单后操作！");
            } else {
                //打开表单
                $('#form').dialog('open').window('center');
                $('#menuName').textbox("setValue",nodes.fname).textbox('readonly');
                $('#code').textbox("setValue","");
                $('#funcName').textbox("setValue","");
                $('#apiPath').textbox("setValue","");
                $('#form_remark').textbox("setValue","");
            }
        },
        //删除
        remove: function () {
            //var removedata = $('#table').datagrid('getSelected');
            var rows = $('#table').datagrid('getSelections');
            var id_remove = [];
            for(var i in rows){
                var array = [];
                console.log(rows[i].id);
                array.push(rows[i].id);
                id_remove.push(array);
            }
            console.log('id_remove');
            console.log(id_remove);
            request({
                url:"funcDelete@MenuMng.do",
                data: {_JSON_:  JSON.stringify({"para":id_remove})},
                success:function (res) {
                    console.log('删除菜单功能成功');
                    //菜单功能列表的刷新
                    funcMenu();
                    //提示操作成功
                    success_messager();
                }
            });
        },
        //修改
        edit: function () {
            //判断是否选择多条信息
            var rows = $('#table').datagrid('getSelections');
            console.log(rows);
            if (rows.length != 1) {
                $.messager.alert("提示", "只能选择一行！");
            } else {
                var rowdata = $('#table').datagrid('getSelected');
                console.log('rowdata');
                console.log(rowdata);

                var code = rowdata.code;
                var fMenuName = rowdata.fmenuname;
                var flag = rowdata.flag;
                var funcId = rowdata.funcId;
                var menuId = rowdata.menuId;
                var menuName = rowdata.menuname;
                var name = rowdata.name;
                var path = rowdata.path;
                var remark = rowdata.remark;
                var id_edit = rowdata.id;

                //编辑
                $('#edit').dialog({
                    width: 350,
                    title: '修改内容',
                    iconCls: 'icon-edit',
                    modal: true,
                    buttons: [{
                        text: '提交',
                        iconCls: 'icon-ok',
                        handler: function () {
                            var menuName_edit = $('#menuName_edit').val();
                            var code_edit = $('#code_edit').textbox("getValue");
                            var funcName_edit = $('#funcName_edit').textbox("getValue");
                            var apiPath_edit = $('#apiPath_edit').textbox("getValue");
                            var logFlag_edit = $('#logFlag_edit').textbox("getValue");
                            var flag = function () {
                                if(logFlag_edit=='记录日志'){
                                    return '00000000';
                                }else {
                                    return '00000001';
                                }
                            };
                            console.log('logFlag_edit');
                            console.log(flag());
                            var remark_edit = $('#remark_edit').textbox("getValue");
                            console.log('id_edit');
                            console.log(id_edit);

                            if (menuName_edit == "" || code_edit == ""|| funcName_edit == ""|| apiPath_edit == ""|| flag() == ""|| remark_edit == "") {
                                return;
                            } else {
                                console.log(menuName_edit+','+code_edit+','+funcName_edit+','+apiPath_edit+','+flag()+','+remark_edit);
                                request({
                                    url:"funcUpdate@MenuMng.do",
                                    data: {_JSON_:  JSON.stringify({"para":[[code_edit,funcName_edit,apiPath_edit,flag(),remark_edit,id_edit]]})},
                                    success:function (res) {
                                        console.log('菜单功能更新成功');
                                        //关闭编辑框
                                        edit_close();
                                        //更新列表
                                        funcMenu();
                                    }
                                });
                            }
                        }
                    }, {
                        text: '取消',
                        iconCls: 'icon-cancel',
                        handler: function () {
                            console.log('')
                            $('#edit').dialog('close');
                            $('#menuName_edit').val('');
                            $('#code_edit').val('');
                            $('#funcName_edit').val('');
                            $('#apiPath_edit').val('');
                            $('#logFlag_edit').val('');
                            $('#remark_edit').val('');
                        }
                    }]
                });

                var logFlag_edit = function (flag) {
                    if(flag==00000000){
                        return '记录日志';
                    }else {
                        return '不记录日志';
                    }
                };

                console.log(logFlag_edit());
                //给修改的文本框赋值
                $('#menuName_edit').textbox("setValue",menuName);
                $('#code_edit').textbox("setValue",code);
                $('#funcName_edit').textbox("setValue",name);
                $('#apiPath_edit').textbox("setValue",path);
                $('#logFlag_edit').combobox('setValue',logFlag_edit(flag));
                $('#remark_edit').textbox("setValue",remark);
            }
        }
    }

    //菜单管理
    add_save = {
        //返回
        cudo:function(){
           // history.go(-1);
           //window.location.reload();
            //重置menu页面
            menuInit();
        },
        //添加
        add: function () {
            addcode = 1;
            //判断选择菜单
            var nodes = $('#MenuTree').tree('getSelected');	// get checked nodes
            console.log(nodes);
            if (nodes==null) {
                //$.messager.alert("提示", "请选择所属菜单后操作！");
                //按钮取消置灰
                $('#add_save_save').linkbutton('enable').show();
                $('#add_save_remove').linkbutton('enable').show();
                $('#add_save_cudo').linkbutton('enable').show();
                $('#add_save_add').linkbutton('disable').hide();
                $("input").attr("disabled",false);

                $('#pname').textbox("setValue","").textbox('readonly');
            } else {
                $('#add_save_cudo').linkbutton('enable').show();
                $('#add_save_add').linkbutton('disable').hide();

                //清空表单
               /* $(':input','#menu_form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .removeAttr('checked')
                    .removeAttr('selected');*/
                $('#pname').textbox("setValue",nodes.fname);
                $('#display_code').textbox("setValue","");
                $('#fname').textbox("setValue","");
                $('#name_eng').textbox("setValue","");
                $('#language_key').textbox("setValue","");
                $('#path').textbox("setValue","");
                $('#model').textbox("setValue","");
                $('#page').textbox("setValue","");
                $('#flag').textbox("setValue",'正常');
                $('#icon').textbox("setValue","");
                $('#remark').textbox("setValue","");
            }
        },
        //删除
        remove: function () {
            console.log('菜单列表删除');
            var node = $('#MenuTree').tree('getSelected');
            var nodeId = node.id;
            request({
                url:"menuDelete@MenuMng.do",
                data: {_JSON_:  JSON.stringify({"para":[[nodeId]]})},
                success:function (res) {
                    console.log('菜单删除成功')
                    //重置menu页面
                    menuInit();
                    //提示操作成功
                    success_messager();
                }
            });
        },
        //保存
        save: function () {
            var pname = $('#pname').textbox("getValue");
            var display_code = $('#display_code').textbox("getValue");
            var fname = $('#fname').textbox("getValue");
            var name_eng = $('#name_eng').textbox("getValue");
            var language_key = $('#language_key').textbox("getValue");
            var path = $('#path').textbox("getValue");
            var model = $('#model').textbox("getValue");
            var flag = $('#flag').combobox("getValue");
            console.log(flag);
            console.log('flag');
            var icon = $('#icon').textbox("getValue");
            var remark = $('#remark').textbox("getValue");
            var page = $('#page').textbox("getValue");
            var menu = $('#MenuTree').tree('getSelected');
            var pid;
            var id;

            if(addcode==1){
                if(menu){
                    pid = menu.id;
                }else{
                    pid = '';
                }
                request({
                    url:"menuAdd@MenuMng.do",
                    data: {_JSON_:  JSON.stringify({"para":[[pid,fname,name_eng,language_key,path,page,model,icon,display_code,flag,remark]]})},
                    success:function (res) {
                        console.log('菜单添加成功')
                        console.log(pid,fname,name_eng,language_key,path,page,model,icon,display_code,flag,remark)
                        //重置menu页面
                        menuInit();
                        success_messager();

                        addcode=0;
                    }
                });
            }else if(addcode==0){
                pid = menu.pid;
                id = menu.id;
                request({
                    url:"menuUpdate@MenuMng.do",
                    data: {_JSON_:  JSON.stringify({"para":[[pid,fname,name_eng,language_key,path,page,model,icon,display_code,flag,remark,id]]})},
                    success:function (res) {
                        console.log('菜单更新成功');
                        console.log([pid,fname,name_eng,language_key,path,page,model,icon,display_code,flag,remark,id]);
                        //重置menu页面
                        menuInit();
                        //右下角弹出提示信息
                        success_messager();
                    }
                });
            }
        }
    };

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
                var menu = $('#MenuTree').tree('getSelected');
                var menu_id = menu.id;
                var code = $('#code').val();
                var name = $('#funcName').val();
                var path = $('#apiPath').val();
                var flag = $('#logFlag').val();
                var remark = $('#form_remark').val();
                if (menu_id == "" || code == ""|| name == ""|| path == ""|| flag == ""|| remark == "") {
                    return;
                } else {
                    console.log(menu_id + ',' + code+ ',' + name+ ',' + path+ ',' + flag+ ',' + remark);
                    request({
                        url:"funcAdd@MenuMng.do",
                        data: {_JSON_:  JSON.stringify({"para":[[menu_id,code,name,path,flag,remark]]})},
                        success:function (res) {
                            console.log('菜单功能添加成功');
                            //关闭窗口
                            form_close();
                            //刷新列表
                            funcMenu();
                            success_messager();
                        }
                    });
                }
            }       
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#form').dialog('close');
                $('#menuName').val('');
                $('#code').val('');
                $('#funcName').val('');
                $('#apiPath').val('');
                $('#logFlag').val('');
                $('#form_remark').val('');
            }
        }],
    });

    //加载菜单树
    request({
        url:"menuQuery@MenuMng.do",
        data: {_JSON_:  JSON.stringify({"language":"zh-CN"})},
        success:function (res) {
            console.log('menuQuery@MenuMng.do')
            console.log(res)
            $('#MenuTree').tree({
                data: res,
                onSelect: function(node){
                    console.log('选中的树的节点信息');
                    console.log(node);

                    //功能查询
                    funcMenu();

                    //按钮取消置灰
                    $('#add_save_save').linkbutton('enable').show();
                    $('#add_save_remove').linkbutton('enable').show();
                    if($('#add_save_add').hide()){
                        $('#add_save_add').linkbutton('enable').show();
                        $('#add_save_cudo').linkbutton('disable').hide();
                    }
                    $("input").attr("disabled",false);

                    //给修改的文本框赋值
                    $('#pname').textbox("setValue",node.pname).textbox('readonly');
                    $('#display_code').textbox("setValue",node.display_code);
                    $('#fname').textbox("setValue",node.fname);
                    $('#name_eng').textbox("setValue",node.name_eng);
                    $('#language_key').textbox("setValue",node.language_key);
                    $('#path').textbox("setValue",node.path);
                    $('#model').textbox("setValue",node.model);
                    $('#page').textbox("setValue",node.page);
                    $('#flag').combobox('setValue',node.flag);
                    /**
                     *绑定状态，设置默认值，根据数据取值
                     */
                   /* $('#flag').combobox({
                        onLoadSuccess : function() {
                            if(node.flag=='00000000'){
                                $("#flag").combobox("select", "正常");
                                $("#flag").combobox("setValue", 00000000);
                            }else {
                                $("#flag").combobox("select", "停用");
                                $("#flag").combobox("setValue", 00000001);
                            }
                        }
                    });*/
                    $("#flag").combobox("setValue", node.flag);
                    $('#icon').textbox("setValue",node.icon);
                    $('#remark').textbox("setValue",node.remark);

                }

            });
            //迭代循环
            var oldData = [];
            if(res){
                oldData=res;
                for(var i in oldData){
                    readTree(oldData[i],oldData);
                }
            }
            $("#MenuTree").tree({data:res});
        }
    });
});
//为菜单树添加text
function readTree(node,data){
    var children = node.children;
    if(node.fname){
        node.text=node.fname;
    }
    if(children&&children.length==0)delete node.children;
    if (children && children.length) {
        for (var i = 0; i < children.length; i++) {
            readTree(children[i],data);
        }
    }else{
        return data;
    }
};

//关闭编辑窗口
function edit_close(){
    $('#edit').dialog('close');
}
//关闭添加窗口
function form_close(){
    $('#form').dialog('close');
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

//刷新菜单功能列表
function funcMenu(){
    //功能查询
    var menu = $('#MenuTree').tree('getSelected');
    var menu_id = menu.id;
    request({
        url:"funcQuery@MenuMng.do",
        data: {_JSON_:  JSON.stringify({"language":"zh-CN","menu_id":menu_id}),pageIndex:_pageNumber,pageSize:_pageSize},
        success:function (res) {
            console.log("功能data");
            console.log(res.data);
            //刷新table
            var data={rows:res.data,total:res.total};
            $("#table").datagrid("loadData",data);
        }
    });
}

//刷新菜单列表树
function Menutree(){
    request({
        url:"menuQuery@MenuMng.do",
        data: {_JSON_:  JSON.stringify({"language":"zh-CN"})},
        success:function (res) {
            //迭代循环
            var oldData = [];
            if(res){
                oldData=res;
                for(var i in oldData){
                    readTree(oldData[i],oldData);
                }
            }
            $("#MenuTree").tree({data: res});
        }
    })
}

//右下角提示操作成功
function success_messager() {
    $.messager.show({
        title:'消息提示',
        msg:'操作成功',
        timeout:3000,
        showType:'slide'
    });
}
//右下角提示操作失败
function fail_messager() {
    $.messager.show({
        title:'消息提示',
        msg:'操作失败',
        timeout:3000,
        showType:'slide'
    });
}
//初始化menu页面
function menuInit() {
    Menutree();
    $("input").attr("disabled",true);
    $('#add_save_save').linkbutton('disable').hide();
    $('#add_save_remove').linkbutton('disable').hide();
    $('#add_save_cudo').linkbutton('disable').hide();
    $('#add_save_add').linkbutton('enable').show();
    //清空table
    $('#table').datagrid('loadData', { total: 0, rows: [] });
}