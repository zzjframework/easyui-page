$(function () {
    $("#agentid1").combogrid({
        panelWidth: 200,
        panelHeight: 'auto',
        idField: 'id',
        textField: 'name',
        editable:false,
        columns: [[
            {field:'id',title:'id',width:80},
            {field:'name',title:'名称',width:120},
        ]],
        // fitColumns: true

    });
    initList();
    $("#department").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: []
    });

    $('#add_save_save').linkbutton().hide();
    $('#add_save_updata').linkbutton().hide();
    $("#status").combobox({
        valueField: 'id',
        textField: 'text',
        panelHeight: 'auto',
        data: [{id: '1', text: '启用'}, {id: '2', text: '停用'}]
    });
    //保存增加
    $('#add_save_save').bind('click', function () {
        add();
    });
    //右键菜单删除
    $('#tree-delete').bind('click', function () {
        console.log("删除");
        var id = $('#Id').val();
        console.log(status);
        if (status == 1) {
            status = 1;
        } else {
            status = 0;
        }
        var json = {"id": id, "page_": "comm.html"};
        console.log("删除参数");
        console.log(json);
        remove(json);
    });
    //点击菜单节点修改
    $('#add_save_updata').bind('click', function () {

        var code = $('#code').textbox("getValue");
        var name = $('#name').textbox("getValue");
        var newpassword = $('#newpassword').textbox("getValue");
        var department = $('#department').combobox("getValue");
        console.log(department);
        var telephone = $('#telephone').textbox("getValue");
        var email = $('#email').textbox("getValue");
        var agentid = $('#agentid1').combogrid("getValue");
        var endip = $('#endip').textbox("getValue");
        var startip = $('#startip').textbox("getValue");
        var status = $('#status').combobox("getValue");
        var pId = $('#pId').val();
        var domainid = $('#domainid').val();
        var id = $('#Id').val();
        var roles = $()
        console.log(status);
        if (status == 1) {
            status = 1;
        } else {
            status = 0;
        }
        if (code == '' || name == '' || newpassword == '') {
            $.messager.alert("提示", "请输入必填信息！");
            return;
        }
        var json = {
            "code": code, "telephone": telephone, "startip": startip,
            "name": name, "email": email, "endip": endip, "newpassword": newpassword,
            "agentid": agentid, "status": status, "department": department, "insts": "'0000'",
            "pId": pId, "domainid": domainid,
            "id": id, "page_": "comm.html"
        };
        console.log("参数");
        console.log(json);
        update(json);
    });
    $("#MenuTree").tree({
        lines:true,
        dnd:true,
        // data:[],
        onBeforeDrop:function(target,source){
            // 这个方法的效果是拖动 a 节点 到 b节点 (释放时) 触发。
            var targetNode = $(this).tree('getNode',target);
            console.log("目标节点ID："+targetNode.id);

            var pId = targetNode.id;
            var id = source.id;
            if(targetNode.type=="i"){
                var dispid =0;
            }
            if(targetNode.type=="u"){
                var dispid =targetNode.dispid;
            }

            console.log("目标节点顺序："+targetNode.dispid);
            console.log("选中节点id："+source.id);
            if(targetNode.type=="u"){

                $.messager.alert("提示", "操作错误！");
               queryUser();
            }
            if(targetNode.type=="i"){
                request({
                    url:"modifyUserPid@Inst.do",
                    data:{
                        _JSON_: JSON.stringify({
                            "pId": pId,
                            "id": id,
                            "dispDid":[],
                            "dispUid": [[dispid,id]],
                            "page_": "comm.html"
                        })
                    },

                    success:function (res) {
                        queryUser();

                    }
                })
            }
        },
        onClick:function (node) {
            getUserInfo(node);
            //$("#isInstNew").val("0");
            //$("#instSaveBtn").linkbutton("enable");
        },
        onContextMenu: function(e, node){
            var insts = node.code;
            $('#tree-edit').click(function () {
                $('#add_save_save').linkbutton().hide();
                $('#add_save_updata').linkbutton().show();
                $("input").attr("disabled", false);
                $('#status').combobox({hasDownArrow: true, editable: false, disabled: false});
                $('#agentid1').combogrid({hasDownArrow: true, editable: false, disabled: false});
                $('#department').combobox({hasDownArrow: true, editable: false, disabled: false});
                $('#insts').combobox({hasDownArrow: true, editable: false, disabled: false});
                $('#Id').val(node.id);
                $('#code').textbox('textbox').focus();
                initInst(node);
                edit1(node.id);
            });
            $('#tree-add').click(function () {
                $("input").attr("disabled", false);
                $('#status').combobox({hasDownArrow: true, editable: false, disabled: false});
                $('#agentid1').combogrid({hasDownArrow: true, editable: false, disabled: false});
                $('#department').combobox({hasDownArrow: true, editable: false, disabled: false});
                $('#insts').combobox({hasDownArrow: true, editable: false, disabled: false});
                $('#form1').form('clear');
                $('#pId').val(node.id);
                //$("#status").combobox("setValue", "启用");

                //光标焦点跳到输入框
                $('#code').textbox('textbox').focus();
                $('#add_save_save').linkbutton().show();
                $('#add_save_updata').linkbutton().hide();
                $('#insts').combobox("setValue", insts);
            });
            e.preventDefault();  //阻止右键默认事件
            var root = $('#MenuTree').tree('getParent', node.target)//判断该结点有没有父结点
            if (root == null || node.type == "i") {  //若成立则为根结点，添加一个右键样式，可以添加子节点
                $('#parentNode').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            } else {
                $('#leaf').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });

            }
        }
    });
    queryUser();
    queryDpt()
});
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
                $("#MenuTree").tree({data:data});

            }
        }
    });
}
function queryDpt(){
    function readTree(node,data){
        var children = node.children;
        if(node.name){
            node.text=node.name;
        }
        if (node.type == "i") {
            node.iconCls = "icon-tip";
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
        includeUser:false,
        // treeMode:'root',
        // instId:'0000',
    }
    request({
        url: "GetInstAndUserTree@Base.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            var data=null;
            if(res){
                data=res.data;
                for(var i=0,len=data.length;i<len;i++){
                    readTree(data[i],data);
                }
                $("#totalcode,#insts").combotree({
                    data:data,
                });
            }
        }
    });
}
function getUserInfo(node){
    console.log('选中的树的节点信息');
    console.log(node);
    console.log(node.state);
    var root = $('#MenuTree').tree('getParent', node.target);
    // var root2 = $('#MenuTree').tree('getChildren', node.target);
    var id = node.id;

    if (root == null || node.type == "i") {  //若成立则为根结点，添加一个右键样式，可以添加子节点
        /* $('#tt').tabs('select','机构管理');*/
        $('#form1').form("clear");
        $('#add_save_updata').linkbutton().hide();
        $("input").attr("disabled", true);
        $('#status').combobox({hasDownArrow: false, editable: false, disabled: true});
        $('#agentid1').combogrid({hasDownArrow: false, editable: false, disabled: true});
        $('#department').combobox({hasDownArrow: false, editable: false, disabled: true});
        $('#insts').combobox({hasDownArrow: false, editable: false, disabled: true});

    } else {
        $('#tt').tabs('select', '用户管理');
        $('#add_save_save').linkbutton().hide();
        $("input").attr("disabled", false);
        $('#status').combobox({hasDownArrow: true, editable: false, disabled: false});
        $('#agentid1').combogrid({hasDownArrow: true, editable: false, disabled: false});
        $('#department').combobox({hasDownArrow: true, editable: true, disabled: false});
        $('#insts').combobox({hasDownArrow: true, editable: false, disabled: false});
        edit1(id);
    }
}
function initList() {
    var agentList = [{'id': '', 'text': '请选择'}];
    request({
        url: "UserSelect@Inst.do",
        data: {
            _JSON_: JSON.stringify({
                "instId": "0000",
                "page_": "comm.html"
            })
        },
        success: function (res) {
            $("#agentid1").combogrid("grid").datagrid("loadData", res.data);
        }
    });
}
function edit1(id) {
    initList();
    request({
        url: "UserInfo@Inst.do",
        data: {_JSON_: JSON.stringify({"userId": id, "page_": "comm.html"})},
        success: function (res) {

            var status = res.data[0].status;
            //$('#form1').form('clear')
            $('#code').textbox("setValue", res.data[0].code);
            $('#name').textbox("setValue", res.data[0].name);
            $('#newpassword').textbox("setValue", res.data[0].newpassword);
            $('#department').combobox("setValue", res.data[0].department);
            $('#telephone').textbox("setValue", res.data[0].telephone);
            $('#email').textbox("setValue", res.data[0].email);
            $('#agentid1').combogrid("setValue", res.data[0].agentid);
            $('#endip').textbox("setValue", res.data[0].endip);
            $('#startip').textbox("setValue", res.data[0].startip);
            $('#pId').val(res.data[0].pId);
            $('#domainid').val(res.data[0].domainid);
            $('#insts').val(res.data[0].insts);
            $('#Id').val(id);
            if (status == 1) {
                $("#status").combobox("setValue", "启用");
            } else {
                $("#status").combobox("setValue", "停用");
            }
            $('#add_save_updata').show();

        }
    });

}
function add() {
    var code = $('#code').textbox("getValue");
    var name = $('#name').textbox("getValue");
    var newpassword = $('#newpassword').textbox("getValue");
    var department = $('#department').textbox("getValue");
    var telephone = $('#telephone').textbox("getValue");
    var email = $('#email').textbox("getValue");
    var agentid = $('#agentid1').combogrid("getValue");
    var endip = $('#endip').textbox("getValue");
    var startip = $('#startip').textbox("getValue");
    var status = $('#status').combobox("getValue");
    var pId = $('#pId').val();
    var domainid = $('#domainid').val();
    var insts = $('#insts').combobox("getValue");
    insts = "'" + insts + "'";
    console.log(status);
    if (status == 1) {
        status = 1;
    } else {
        status = 0;
    }
    /*"roles":"''","menus":[],"transList":"''",*/
    var json = {
        "code": code, "telephone": telephone, "startip": startip,
        "name": name, "email": email, "endip": endip, "newpassword": newpassword,
        "agentid": agentid, "status": status, "department": department, "insts": insts,
        "pId": pId, "domainid": domainid, "page_": "comm.html"
    };
    console.log("新增用户");
    console.log(json);
    if (code == "" || name == "" || newpassword == "") {
        return;
    } else {
        request({
            url: "UserAdd@Inst.do",
            data: {_JSON_: JSON.stringify(json)},
            success: function (res) {
                console.log(res);
                $.messager.alert("提示", "添加用户成功！");
                //刷新菜单栏
                queryUser();
            }

        });
    }

}

//修改用户信息
function update(json) {
    request({
        url: "UserUpdate@Inst.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            $.messager.alert("提示", "修改成功！");
            queryUser();
        }
    });
}

function remove(json) {

    request({
        url: "UserDelete@Inst.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function () {
            $.messager.alert("提示", "删除成功")
            queryUser();
        }
    });

}

