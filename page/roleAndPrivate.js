$(function () {
    $("#roleList").tree({
        lines:true,
        data:[],
        onClick:function (node) {
            $("#isRoleNew").val("n");
            if(node.isLeaf){
                $("#f_role_name").textbox("setValue",node.name);
                $("#f_role_id").textbox("setValue",node.id);
                $("#roleSaveBtn").linkbutton("enable");
                if(node&&node.id){
                    queryPrivate(node.id);
                }
            }else{
                $("#f_role_name").textbox("setValue",null);
                $("#f_role_id").textbox("setValue",null);
                $("#roleSaveBtn").linkbutton("disable");
                renderMenuPrivate({});
            }

        },
        onContextMenu: function(e, node){
            e.preventDefault();
            // select the node
            $('#roleList').tree('select', node.target);
            // display context menu
            var obj=null;
            if(!node.pId){
                obj=$("#roleGroupRightMenu");
            }else{
                obj=$("#roleRightMenu");
            }
            $("#rightMenuClickedRowId").val(node.id);
            obj.menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        }
    });
    //菜单列表
    $('#menu_table').treegrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线
        title:'权限列表',
        //显示分页控件栏
        pagination: false,
        //按钮
        // toolbar: '#tb',
        data: null,
        idField: 'id',
        treeField: 'name',
        rownumbers:true,
        //要显示的列
        columns: [[
            {
                field: 'id',
                title: '菜单ID',
                width:120,
            },
            {
                field: 'name',
                title: '菜单名称',
                width:200,
            },

            {
                field: 'private',
                title: '功能权限',
                width:250,
                formatter:function(value,row,index){
                    if(!row.isLeaf){
                        return '';
                    }
                    var tool="";
                    var op1=row.op&&row.op.indexOf("1")!=-1;
                    var op2=row.op&&row.op.indexOf("2")!=-1;
                    var rowId=row.id;
                    var name="menuCheckbox-"+rowId;
                    if(op1){
                        tool+= '<input type="checkbox" name="'+name+'" value="1" checked="checked" >拥有(本菜单)';
                    }else{
                        tool+= '<input type="checkbox"  name="'+name+'" value="1" >拥有(本菜单)';
                    }
                    if(op2){
                        tool+= '<input type="checkbox" name="'+name+'" value="2" checked="checked" style="margin-left:8px" >办理(本菜单发起之流程)';
                    }else{
                        tool+= '<input type="checkbox"  name="'+name+'" value="2" style="margin-left:8px" >办理(本菜单发起之流程)';
                    }


                    return tool;
                }
            },
        ]],

    });

    //业务功能列表
    $('#bus_table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线
        title:'权限列表',
        //显示分页控件栏
        pagination: false,
        //按钮
        // toolbar: '#tb',
        data: null,
        idField: 'id',
        singleSelect:true,
        //要显示的列
        columns: [[
            {
                field: 'index',
                title: '序号',
                width:30,
                formatter:function(value,row,index){
                    return index+1;
                }
            },
            {
                field: 'id',
                title: 'ID',
                width:120,
            },
            {
                field: 'name',
                title: '菜单名称',
                width:200,
            },

            {
                field: 'trans',
                title: '交易(功能)',
                width:850,
                autoSizeColumn:true,
                formatter:function(value,row,index){
                    var str=""
                    if(value&&Array.isArray(value)&&value.length>0){
                        str+="<table style='border-width:0'>"
                        for(var i=0,len=value.length;i<len;i++){
                            if(i%5==0){
                                if(i==0){
                                    str+="<tr style='border-width:0'>";
                                }else {
                                    str+="</tr><tr>";
                                }
                            }
                            if(row.op&&row.op.indexOf(value[i].id)!=-1){
                                str+='<td style=\'border-width:0\'><input type="checkbox" name="busiCheckbox" value="'+value[i].id+'" checked="checked" />'+value[i].name+'<span style="margin-left:8px"></span></td>'
                            }else{
                                str+='<td style=\'border-width:0\'><input type="checkbox" name="busiCheckbox" value="'+value[i].id+'"/>'+value[i].name+'<span style="margin-left:8px"></span></td>'
                            }

                        }
                        if(str.substr(-1,5)!="</tr>"){
                            str+="</tr>"
                        }
                        str+="</table>"
                    }
                    return str;
                }
            },
        ]],

    });

    //机构用户列表
    $('#user_table').treegrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线
        title:'权限列表',
        //显示分页控件栏
        pagination: false,
        //按钮
        // toolbar: '#tb',
        data: null,
        idField: 'id',
        treeField: 'name',
        rownumbers:true,
        checkbox:function(node){
            if (node.type == "u"){
                return true;
            }else{
                return false;
            }
        },
        //要显示的列
        columns: [[
            {
                field: 'id',
                title: 'ID',
                width:120,
            },
            {
                field: 'name',
                title: '机构及人员名称',
                width:200,
            },
            {
                field: 'code',
                title: '机构及人员编码',
                width:200,
            },
            {
                field: 'type',
                title: '类别',
                width:200,
            }
        ]],

    });

    queryRoles();
    queryMenuList();
    queryBusTrans();
    queryInstUser();
});
function queryRoles(){
    function readRoleTree(node,data){
        var children = node.children;
        if(node.name){
            node.text=node.name;
        }
        if(children&&children.length==0)delete node.children;
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                readRoleTree(children[i],data);
            }
        }else{
            return data;
        }
    }
    request({
        url: "GetRoleTree@Base.do",
        data: {_JSON_: ''},
        success: function (res) {
            var data=null;
            if(res){
                data=res.data;
                for(var i in data){
                    readRoleTree(data[i],data);
                }
                $("#roleList").tree("loadData",data);
            }

        }
    });
}
function queryPrivate(roleId){
    //查询菜单权限
    var json={
        para:[roleId,'r+m',true]
    }
    request({
        url: "GetPrivateInfo@Base.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            renderMenuPrivate(res.op);
        }
    });
    //查询业务权限
    json={
        para:[roleId,'r+t',true]
    }
    request({
        url: "GetPrivateInfo@Base.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            renderBusiPrivate(res.op);
        }
    });
    //查询用户角色
    json={
        para:[roleId,'u+r',false]
    }
    request({
        url: "GetPrivateInfo@Base.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            renderUserPrivate(res.op);
        }
    });
}

function renderMenuPrivate(op){
    $('#menu_table').datagrid('getPanel').find("input[name^=menuCheckbox]").prop("checked",false);
    for(var key in op){
        var op1=op[key].split(",")[0];
        var op2=op[key].split(",")[1];
        var name="menuCheckbox-"+key;
        if(op1==='1'||op2==='1'){
            $('#menu_table').datagrid('getPanel').find("input[name="+name+"][value=1]").prop("checked",true);
        }
        if(op1==='2'||op2==='2'){
            $('#menu_table').datagrid('getPanel').find("input[name="+name+"][value=2]").prop("checked",true);
        }

    }
}

//查询菜单树
function queryMenuList(){
    var readMenuTree=function(node,data){
        var children = node.children;
        delete node.iconCls;
        if(node.pid){
            node._parentId=node.pid;
        }
        if(children&&children.length==0)delete node.children;
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                readMenuTree(children[i],data);
            }
        }else{
            return data;
        }
    }
    request({
        url: "GetMenuTree@Base.do",
        data: {_JSON_: null},
        async:false,
        success: function (res) {
            var data=null;
            if(res){
                data=res.data;
                for(var i in data){
                    readMenuTree(data[i],data);
                }
                $("#menu_table").treegrid("loadData",data);
            }
        }
    });

}


function getUUID(){
    var uuid=null;
    request({
        url: "$!.do",
        data: {_activityid: 7,type: 'uuid'},
        async:false,
        success: function (res) {
            uuid=res.info||null;
        }
    });
    return uuid
}

function addRoleGroup(){
    $("#isRoleGroupNew").val("y");
    $("#f_group_id").textbox("setValue",'');
    $("#f_group_name").textbox("setValue",'');
    $("#roleGroupModal").dialog("open");

    var id=getUUID();
    $("#f_group_id").textbox("setValue",id);
}
function editRoleGroup(){
    $("#isRoleGroupNew").val("n");
    var nodeId=$("#rightMenuClickedRowId").val();
    if(nodeId){
        var node=$("#roleList").tree("find",nodeId);
        if(node){
            $("#f_group_id").textbox("setValue",nodeId);
            $("#f_group_name").textbox("setValue",node.name);
            $("#roleGroupModal").dialog("open");
        }
    }
}
function delRoleGroup(){
    var nodeId=$("#rightMenuClickedRowId").val();
    $.messager.confirm("删除角色组",'确认要删除该角色组?',function (r){
        if(r){
            var json={
                id:nodeId,
            }
            request({
                url: "GroupDelete@Role.do",
                data: {_JSON_: JSON.stringify(json)},
                success: function (res) {
                    queryRoles();
                    $.messager.show({
                        title:'提示',
                        msg:res.info||'删除成功！',
                        timeout:3000,
                        showType:'slide'
                    });
                }
            });
        }
    });
}

//角色组保存
function roleGroupSave(){
    var isNew= $("#isRoleGroupNew").val();//是否新增 y-是 n-否
    var url=null;
    if(isNew==="y"){
        url="GroupAdd@Role.do";
    }else{
        url="GroupUpdate@Role.do";
    }
    var id=$("#f_group_id").textbox("getValue");
    var group_name=$("#f_group_name").textbox("getValue");


    if(id==''){
        $.messager.alert("提示",'请输入组名称ID！');
        return;
    }

    if(group_name==''){
        $.messager.alert("提示",'请输入组名称！');
        return;
    }
    var json={
        id:id,
        name:group_name
    }
    request({
        url: url,
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            $("#roleGroupModal").dialog("close");
            queryRoles();
            $.messager.show({
                title:'提示',
                msg:res.info||'保存成功！',
                timeout:3000,
                showType:'slide'
            });
        }
    });
}

function addRole(){
    $("#roleSaveBtn").linkbutton("enable");
    $("#isRoleNew").val("y");//是否新增 y-是 n-否
    var nodeId=$("#rightMenuClickedRowId").val();
    $("#f_role_name").textbox("setValue","");
    $("#f_role_id").textbox("setValue",getUUID());

    renderMenuPrivate({});
    renderBusiPrivate({});
    renderUserPrivate({});
}
function editRole(){
    $("#roleSaveBtn").linkbutton("enable");
    $("#isRoleNew").val("n");//是否新增 y-是 n-否
    var nodeId=$("#rightMenuClickedRowId").val();
    var node=$("#roleList").tree("find",nodeId);

    $("#f_role_name").textbox("setValue",node.name);
    $("#f_role_id").textbox("setValue",node.id);
    queryPrivate(nodeId);
}
function delRole(){
    var id=$("#f_group_id").textbox("getValue");
    $.messager.confirm("删除角色",'确认要删除该角色?',function (r){
        if(r){

        }
    });
}

//角色保存
function saveRole(){
    var isNew=$("#isRoleNew").val();//是否新增 y-是 n-否
    var id=$("#f_role_id").textbox("getValue");
    var name=$("#f_role_name").textbox("getValue");
    var groupId=$("#rightMenuClickedRowId").val();

    if(id==""){
        $.messager.alert("提示","id不能为空!","error");
        return;
    }
    if(name==""){
        $.messager.alert("提示","角色名称不能为空!","error");
        return;
    }

    //组装菜单权限参数
    var menusPara=[];
    var menusObj={};
    $('#menu_table').datagrid('getPanel').find("input:checked[name^=menuCheckbox]").each(function(){
        var name=$(this).attr("name");
        var r_id=name.split("-")[1];
        var value=$(this).attr("value");
        var obj=$('#menu_table').datagrid('getPanel').find("input:checked[name="+name+"]").not($(this));
        var p=[];
        p.push(value);
        if(obj.length>0){
            p.push($(obj).val());
        }
        menusObj[r_id]=p;
    });

    for(var key in menusObj){
        menusPara.push([key,menusObj[key].join(",")]);
    }

    //组装业务权限参数
    var busArr=[];
    $('#bus_table').datagrid('getPanel').find("input:checked[name=busiCheckbox]").each(function(){
        busArr.push("'"+$(this).val()+"'");
    });

    //参数中至少有一个参数 ->解决where id in ()的情况
    if(busArr.length<1)busArr.push("''");

    var busPara=busArr.join(",");
    //组装用户参数
    var nodes=$("#user_table").treegrid("getCheckedNodes");
    var instArr=[],userArr=[];
    for(var i=0,len=nodes.length;i<len;i++){
        if(nodes[i].type==="i"){
            instArr.push("'"+nodes[i].id+"'");
        }
        if(nodes[i].type==="u"){
            userArr.push("'"+nodes[i].id+"'");
        }
    }

    //参数中至少有一个参数 ->解决where id in ()的情况
    if(instArr.length<1)instArr.push("''");
    if(userArr.length<1)userArr.push("''");

    var instPara=instArr.join(",");
    var userPara=userArr.join(",");

    var json={
            id:id,
            name:name,
            menus:menusPara,
            transList:busPara,
            insts:instPara,
            users:userPara,
        };
    var url=null;
    if(isNew=="y"){
        json.pId=groupId;
        url="RoleAdd@Role.do";
    }else{
        url="RoleUpdate@Role.do";
    }
    request({
        url: url,
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            if(isNew=="y"){
                var newNode={
                    id:id,
                    name:name,
                    text:name,
                    pId:groupId,
                    isLeaf:true,
                }
                $("#roleList").tree("append",{
                    parent:$("#roleList").tree("find",groupId).target,
                    data:[newNode],
                })
            }else{
                var node=$("#roleList").tree("find",id);
                node.name=name;
                node.text=name;
                $("#roleList").tree("update",{target:$("#roleList").tree("find",id).target,row:node});
            }
            $("#roleList").tree("select",$("#roleList").tree("find",id).target);
            $.messager.show({
                title:'提示',
                msg:res.info||'保存成功！',
                timeout:3000,
                showType:'slide'
            });
        }
    });
}


/********************业务权限*********************/
function queryBusTrans(){
    request({
        url: "GetBusiAndTrans@Base.do",
        data: {_JSON_: ''},
        success: function (res) {
            var data=null;
            if(res){
                data=res.data;
                $("#bus_table").datagrid("loadData",data);
            }
        }
    });
}

/*******************机构用户列表*********************/
function queryInstUser(){
    function readUserTree(node,data){
        var children = node.children;
        if(node.name){
            node.text=node.name;
        }
        if(children&&children.length==0)delete node.children;
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                readUserTree(children[i],data);
            }
        }else{
            return data;
        }
    }
    var json={
        includeUser:true
    }
    request({
        url: "GetInstAndUserTree@Base.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            var data=null;
            if(res){
                data=res.data;
                for(var i in data){
                    readUserTree(data[i],data);
                }
                $("#user_table").treegrid("loadData",data);
            }
        }
    });
}

function renderBusiPrivate(op){
    $('#bus_table').datagrid('getPanel').find("input[name=busiCheckbox]").prop("checked",false);

    for(var key in op){
        // $("#user_table").find("input[type=checkbox]").attr("checked",true);
        $('#bus_table').datagrid('getPanel').find("input:checkbox[value='"+key+"']").prop("checked",true);
    }

}
function renderUserPrivate(op){
    var nodes=$("#user_table").treegrid("getCheckedNodes");
    for(var i=0,len=nodes.length;i<len;i++){
        $("#user_table").treegrid("uncheckNode",nodes[i].id);
    }
    for(var key in op){
        $("#user_table").treegrid("checkNode",key);
    }

}