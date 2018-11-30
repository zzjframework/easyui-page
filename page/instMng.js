var _editRow=[];
$(function () {
    //列表
    $('#table').treegrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线

        //按钮
        toolbar: '#tb',
        data: {},
        idField: 'id',
        treeField: 'name',
        rownumbers:true,
        //要显示的列
        columns: [[
            {
                field: 'id',
                title: 'ID',
                width:120,
            },
            {
                field: 'code',
                title: '机构编号',
                width:120,
            },
            {
                field: 'name',
                title: '机构名称',
                width: 180,
                halign: 'center',
                formatter:function(value,row){
                    if(value){
                        var tool="<span> <div title='添加' onclick='addRow(\""+row.id+"\")' style=\"display:inline-block;width:12px;height:12px;margin-top:6px;background-image:url(../../easyui/themes/icons/edit_add.png) ;background-size: 100% 100%\"></div><span>";
                        tool+="<span> <div title='修改' onclick='editRow(\""+row.id+"\")' style=\"display:inline-block;width:12px;height:12px;margin-top:6px;background-image:url(../../easyui/themes/icons/pencil.png) ;background-size: 100% 100%\"></div><span>";
                        tool+="<span> <div title='删除' onclick='delRow(\""+row.id+"\")' style=\"display:inline-block;width:12px;height:12px;margin-top:6px;background-image:url(../../easyui/themes/icons/edit_remove.png) ;background-size: 100% 100%\"></div><span>";
                        return "<span><span>"+value+"</span><span style='margin-left:16px'>"+tool+"</span></span>";
                    }
                    return value;
                },
                editor:"textbox"
            },
            {
                field: 'pid',
                title: '上级机构',
                width: 100,
            },
            {
                field: 'level',
                title: '机构级别',
                width: 100,
            },
            {
                field: 'flag',
                title: '状态',
                width: 100,
            },
            {
                field: 'remark',
                title: '备注',
                width: 100,
                editor:"textbox"
            },
            {
                field: 'create_datetime',
                title: '创建时间',
                width: 100,
            },
            {
                field: 'modify_datetime',
                title: '修改时间',
                width: 100,
                sortable: true,
            },
            {
                field: 'operator_id',
                title: '操作员',
                width: 100,
                sortable: true,
            }
        ]],
    });
    // $(".datagrid-btable").find("tbody").find(".easyui-linkbutton").linkbutton({
    //     plain:true,
    // });
    query();
});

function query(){
    _editRow=[];
    request({
        url:"Tree@Institution.do",
        data:{"curr_code":"curr_code","flag":"flag","curr_name":"curr_name","operator_id":"operator_id","create_datetime":"2018-08-20 16:09:37","modify_datetime":"2018-11-06 14:45:49","remark":"remark","id":"ce06fc2afba54ddc8841624ab4108a65","curr_des":"curr_des"},
        success:function (res) {

            $("#table").treegrid("loadData",res);
        }
    });
}
function addRow(id){
    var row=$("#table").treegrid("find",id);
    var data=$("#table").treegrid("getData");
    console.log(data);
    var newId="_newRow1";
    var ext=$("#table").treegrid("find",newId);
    while (ext) {
        var index=newId.substring(7);
        newId="_newRow"+(parseInt(index)+1);
        ext=$("#table").treegrid("find",newId);
    }
    var newRow={
        id: newId,
        code: '1',
        name: newId,
        _parentId: row.id,
        pid: row.id,
        level: '1',
        flag: '0000000',
        remark: '123',
        create_datetime: '2018-11-01',
        modify_datetime: '2018-11-01',
        operator_id: '管理员'
    };
    // $("#table").treegrid("expand",row.id).treegrid("append",{
    //     parent: row.id,
    //     data:newRow
    // }).treegrid("beginEdit",newId);
    $("#table").treegrid("insert",{
        after: row.id,
        data:newRow
    }).treegrid("beginEdit",newId);
    _editRow.push(newId);
}
function editRow(id){
    var row=$("#table").treegrid("find",id);
    console.log(row);
    $("#table").treegrid("beginEdit",row.id);
    _editRow.push(row.id);
}

function delRow(id){
    var row=$("#table").treegrid("find",id);
    $.messager.confirm("提示","确定要删除机构["+row.name+"]及其下所有机构？",function(r){
        if(r){
            $("#table").treegrid("remove",row.id);
        }
    });
}
function endEdit(){
    for(var i=0;i<_editRow.length;i++){
        $("#table").treegrid("endEdit",_editRow[i]);
    }
    _editRow=[];
}
function cancelEdit(){
    endEdit();
    $("#table").treegrid("rejectChanges");
    query();
}

function save(){
    endEdit();
    var addRows=$("#table").treegrid("getChanges","inserted");
    var updateRows=$("#table").treegrid("getChanges","updated");
    var deleteRows=$("#table").treegrid("getChanges","deleted");
    var addParas=[],updateParas=[],deleteParas=[];
    var rows=$("#table").treegrid("getData");

    for(var i=0;i<addRows.length;i++){
        addParas.push([addRows[i].pid,addRows[i].code,addRows[i].name,addRows[i].level,addRows[i].flag,addRows[i].operator_id,addRows[i].remark]);
    }
    for(var i=0;i<updateRows.length;i++){
        // bug->获取不到inserted的值，新增的行会添加到updated里面,所有要特殊处理
        if(updateRows[i].id&&updateRows[i].id.substring(0,7)=='_newRow'){
            addParas.push([updateRows[i].pid,updateRows[i].code,updateRows[i].name,updateRows[i].level,updateRows[i].flag,updateRows[i].operator_id,updateRows[i].remark]);
        }else{
            updateParas.push([updateRows[i].pid,updateRows[i].code,updateRows[i].name,updateRows[i].level,updateRows[i].flag,updateRows[i].remark,updateRows[i].operator_id,updateRows[i].id]);

        }
    }

    for(var i=0;i<deleteRows.length;i++){
        deleteParas.push([deleteRows[i].id]);
    }
    console.log("add",addParas);
    console.log("upd",updateParas);
    console.log("del",deleteParas);
    if(addParas&&addParas.length>0){
        var json={para:addParas};
        request({
            url:"Add@Institution.do",
            data:{_JSON_:JSON.stringify(json)},
            success:function(res){
                $.messager.show({
                    title:'提示',
                    msg:res.info||'成功添加'+addParas.length+'条数据!',
                    timeout:3000,
                    showType:'slide'
                });
            }
        });
    }
    if(updateParas&&updateParas.length>0){
        var json={para:updateParas};
        request({
            url:"Update@Institution.do",
            data:{_JSON_:JSON.stringify(json)},
            success:function(res){
                $.messager.show({
                    title:'提示',
                    msg:res.info||'成功更新'+updateParas.length+'条数据!',
                    timeout:3000,
                    showType:'slide'
                });
            }
        });
    }
    if(deleteParas&&deleteParas.length>0){
        var json={para:deleteParas};
        request({
            url:"Delete@Institution.do",
            data:{_JSON_:JSON.stringify(json)},
            success:function(res){
                console.log(res);
                $.messager.show({
                    title:'提示',
                    msg:res.info||'成功删除'+deleteParas.length+'条数据!',
                    timeout:3000,
                    showType:'slide'
                });
            }
        });
    }
    $("#table").treegrid("acceptChanges");
}