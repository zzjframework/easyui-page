var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页

$(function () {
    //查询条件下拉列表
    $("#form_enclo_type").combobox({
        valueField:'dict_value',
        textField:'dict_name',
        //data:typeList()
    });
    typeList();

    $("#form_enclo_state").combobox({
        valueField:'id',
        textField:'text',
        data:stateList()
    });
    //列表
    $('#table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线
        singleSelect: true,
        //显示分页控件栏
        pagination: true,
        pageNumber: 1,//初始化的时候在第几页
        pageSize: 10,//，每页显示的条数
        pageList: [5, 10, 15, 20],//每页显示的条数

        //按钮
        toolbar: '#tb',
        data:[],
        //要显示的列
        columns: [[
            {
                field: 'id',
                title: '选择',
                checkbox: true,
            },
            {
                field: 'anx_name',
                title: '附件名称',
                width: '11%',
                halign: 'center',
            },
            {
                field: 'anx_type',
                title: '附件类型',
                width: '11%',
                halign: 'center',
            },
            {
                field: 'anx_path',
                title: '附件路径',
                width: '11%',
                halign: 'center',
            },
            {
                field: 'anx_class',
                title: '文件类型',
                width: '11%',
            },
            {
                field: 'anx_size',
                title: '文件大小',
                width: '11%',
            },
            {
                field: 'anx_ip',
                title: '上传IP',
                width: '11%',
            },
            {
                field: 'flag',
                title: '状态',
                width: '11%',formatter: function (value, row, index) {
                    if (value == '00000000') {
                        return '<span style="color: #2A00FF">有效</span>'
                    } else if (value != '00000000') {
                        return '<span style="color: red">无效</span>'
                    }
                }
            },
            {
                field: 'remark',
                title: '备注',
                width: '11%',
            },
            {
                field: 'operation',
                title: '操作',
                width: '11%',
                align: 'center',
                formatter:function (value,row,index) {
                    //return"<a href='#' onclick='reOnload()' style='color:#2A00FF '>重新上传</a>"
                    return"</div> <input type=\"file\" id=\"btn_file\" onchange=\"reOnload(this.files)\" style=\"display:none\">\n" +
                        "<button type=\"button\" onclick=\"reOnload()\">重新上传</button>\n" +
                        "</div>"
                }
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



//工具栏上
manager_tool = {
    //添加
    add: function () {
        //打开表单
        $('#form').dialog('open');
    },
    //删除
    remove: function () {
        alert('删除');
    },
    //编辑
    edit: function () {
        //判断是否选择多条信息
        var rows = $('#table').datagrid('getSelections');
        if (rows.length != 1) {
            $.messager.alert("提示", "只能选择一行！");
        } else {
            var rowdata = $('#table').datagrid('getSelected');
            var id = rowdata.id;
            var name = rowdata.name;
            var sex = rowdata.sex;

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
                        var formname_edit = $('#formname_edit').val();
                        var sex_edit = $('#sex_edit').val();

                        if (formname_edit == "" || sex_edit == "") {
                            return;
                        } else {
                            console.log(formname_edit+','+sex_edit);
                        }
                    }
                }, {
                    text: '取消',
                    iconCls: 'icon-cancel',
                    handler: function () {
                        $('#edit').dialog('close');
                        $('#formname_edit').val('');
                        $('#sex_edit').val('');
                    }
                }]
            });

            //给修改的文本框赋值
            $('#formname_edit').val(name);
            $('#sex_edit').val(sex);
        }
    }
};

/**下载附件*/
$(function(){
    $("#download").click(function(){
        var obj = document.getElementsByName("id");
        check_val = [];
        for(k in obj){
            if(obj[k].checked)
                check_val.push(obj[k].value);
        }
        if(check_val.length>1){
            alert('只能选择一条');
        }else{
            var url = "http://localhost:8080/ewap/"+"AnnexDownload@Annex.do?_JSON_={id:"+check_val[0]+"}";
            window.open(url);
        }
    })

});

/**查询*/
function query() {
        var anx_name = $("#form_enclo_name").val();
        var anx_type = $("#form_enclo_type").val();
        var flag = $("#form_enclo_state").val();
        var json={"anx_name":anx_name,"anx_type":anx_type,"flag":flag=="-1"?null:flag};
        request({
        url:"AnnexList@Annex.do",
        data:{_JSON_:JSON.stringify(json),pageIndex:_pageNumber,pageSize:_pageSize},
        type:"post",
        success:function (res) {
            var data={rows:res.data,total:res.total};
            console.log(data);
            $("#table").datagrid("loadData",data);
        },
        error:function () {
            console.log("网络错误");
        }
    });
}
//类型下拉列表
function  typeList() {
    var url="http://localhost:8080/ewap/GetByType@Dict.do?_JSON_={dict_type:0021}";
    var types = null;
    $.ajax({
        type: "get",
        url: url,
        cache: false,
        dataType: "json",
        success: function (res){
            types = res.data;
            $("#form_enclo_type").combobox("loadData",types);
        },
        error:function (error) {
            console.log("请求失败！");
        }
    });
}

//状态下拉列表
function stateList() {
    var data = [{id:"-1",text:'全部'},{id:'00000000',text:'有效'},{id:'10000000',text:'无效'}];
    return data;
}

/**删除附件*/
$(function(){
    $("#remove").click(function(){
        var obj = document.getElementsByName("id");
        check_val = [];
        for(k in obj){
            if(obj[k].checked)
                check_val.push(obj[k].value);
        }
        console.log(check_val);
        alert("删除成功");
    })
});

/**恢复附件*/
$(function(){
    $("#regain").click(function(){
        var obj = document.getElementsByName("id");
        check_val = [];
        for(k in obj){
            if(obj[k].checked)
                check_val.push(obj[k].value);
        }
        console.log(check_val);
        alert("已恢复");
    })
});

//上传
function  reOnload(files) {
    document.getElementById("btn_file").click();
    // var form = document.getElementById('btn_file'),
    //     formData = new FormData(form);
    //var formData = new FormData();
    //formData.append("myfile", $("#btn_file").files[0]);
    console.log(files);
    // $.ajax({
    //     url: "https://172.16.1.20:8084/AnnexMng/reUploadFile",
    //     type: "post",
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     success: function (res) {
    //         if (res.status == "00000000") {
    //             alert("上传成功！");
    //         }
    //         console.log(res);
    //         $("#pic").val("");
    //         $(".showUrl").html(res);
    //         $(".showPic").attr("src", res);
    //     },
    //     error: function (err) {
    //         alert("网络连接失败,稍后重试", err);
    //     }
    // })
    request({
        url:"AnnexList@Annex.do",
        data:files,
        contentType: false,
        processData: false,
        success:function (res) {
            if (res.status == "true") {
                alert("上传成功！");
            }
            if (res.status == "error") {
                alert(data.msg);
            }
        }
    });
}

//重置
function reset() {
    $('input').val("");
}