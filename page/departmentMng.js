$(function () {
    $("#instList").tree({
        lines:true,
        // data:[],
        onClick:function (node) {
            getInstInfo(node.id);
            $("#isInstNew").val("0");
            $("#instSaveBtn").linkbutton("enable");
        },
        onContextMenu: function(e, node){
            e.preventDefault();
            // select the node
            $('#instList').tree('select', node.target);

            $("#instRightMenu").menu('show', {
                left: e.pageX,
                top: e.pageY
            });
            getInstInfo(node.id);
        }
    });
    queryDpt();
});
function queryDpt(){
    function readTree(node,data){
        var children = node.children;
        if(node.name){
            node.text=node.name;
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
                $("#instList").tree({data:data});
                $("#totalcode,#departments").combotree({
                    data:data,
                });
            }
        }
    });
}
function getInstInfo(instId){
    var json={
        instId:instId,
    };
    request({
        url: "InstInfo@Inst.do",
        data: {_JSON_: JSON.stringify(json)},
        success: function (res) {
            if(res&&res.data){
                $("#instForm").form("clear");
                $("#instForm").form("load",res.data[0]);
                 $("#id").val(res.data[0].id);
                 $("#pId").val(res.data[0].pId);
                 $("#domainid").val(res.data[0].domainid);
            }
        }
    });
}
function instAdd(){
    $("#isInstNew").val("1");
    var node=$("#instList").tree("getSelected");
    $("#id").val('');
    $("#pId").val(node.id);
    $("#code,#name,#levels").textbox("setValue","");
    $("#totalcode,#departments").combotree("setValue","");
    $("#disdate").datebox("setValue","");
    $("#instSaveBtn").linkbutton("enable");
}
function instUpdate(){
    $("#isInstNew").val("1");
    $("#instSaveBtn").linkbutton("enable");
}
function instDel(){
    var node=$("#instList").tree("getSelected");
    $.messager.confirm("机构删除",'确认要删除该机构?',function (r){
        if(r){
            var json={
                id:node.id,
            }
            request({
                url: "UserDelete@Inst.do",
                data: {_JSON_: JSON.stringify(json)},
                success: function (res) {
                    queryDpt();
                    $("#instForm").form("clear");
                    $("#instSaveBtn").linkbutton("disable");
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

function instSave(){
    var isNew=$("#isInstNew").val()==='1';
    var url=null;
    if(isNew){
        url="InstAdd@Inst.do";
    }else{
        url="InstUpdate@Inst.do";
    }
    var formData=getFormValues($("#instForm"));
    if($.trim(formData.departments)==""){
        formData.departments="'"+formData.departments+"'";
    }
    if(isNew){
        delete formData.id;
    }

    request({
        url: url,
        data: {_JSON_: JSON.stringify(formData)},
        success: function (res) {
            formData.text=formData.name;
            if(isNew){
                if(res.id){
                    $("#id").val(id);
                    formData.id=res.id;
                    $("#instList").tree("append",{
                        parent:$("#instList").tree("getSelected").target,
                        data:[formData],
                    })
                    $("#instList").tree("select",$("#instList").tree("find",res.id).target);
                }
            }else{
                formData.target=$("#instList").tree("find",formData.id).target;
                $("#instList").tree("update",formData);
            }
            $("#isInstNew").val(0);
            $.messager.show({
                title:'提示',
                msg:res.info||'保存成功！',
                timeout:3000,
                showType:'slide'
            });
        }
    });
}
function getFormValues(dom){
    var d={};
    var t = $(dom).serializeArray();
    $.each(t, function() {
        d[this.name] = this.value;
    });

    // 原始html控件的值
    $(dom).find("input[type=hidden]").each(function(){
        if($(this)[0].hasAttribute("name")){
            d[$(this).attr("name")]=$(this).val();
        }else if($(this)[0].hasAttribute("id") ){
            d[$(this).attr("id")]=$(this).val();
        }
    });
    return d;
}