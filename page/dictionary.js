var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页

$(function () {

    //查询条件下拉列表
    $("#dict_type").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:150,
        data:[]

    });
    $("#dict_name").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:200,
        data:[]
    });
    $("#dict_flag").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:100,
        data:[{id:'',text:'全部'},{id:'00000000',text:'正常',},{id:'10000000',text:'停用'}]
    });
    //添加,修改的复选框
    $(".upinput").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:150,
        data:[]

    });
    //添加,修改标志下拉框
    $(".inputdom").combobox({
        valueField:'id',
        textField:'text',      
        panelHeight:70,
        data:[{id:'00000000',text:'正常'},{id:'10000000',text:'停用'}]
    });
    $('#dictflag').combobox('select', '00000000');//默认选择第一个
    //列表
    $('#table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线
        singleSelect:true,//只能选择一行

        //显示分页控件栏
        pagination: true,

       /* //通过POST传递到后台，然后进行排序。
        sortName: 'createtime',
        sortOrder: 'desc',*/

        //按钮
        toolbar: '#tb',
        // data:{},
        //要显示的列
        columns: [[
            {
                field: 'dict_type',
                title: '字典类型',
                width: 150,
                align: 'center',
            },
            {
                field: 'dict_value',
                title: '字典值',
                width: 100,
                align: 'center',
            },
            {
                field: 'dict_name',
                title: '字典名',
                width: 150,
                align: 'center',
            },
            {
                field: 'flag',
                title: '标志',
                width: 50,
                align: 'center',
                formatter:function(value,row,index){
                    if(value=='00000000'){return '<span style="color: #2A00FF">正常</span>'}
                    else{return '<span style="color: red">停用</span>'}
                }
            },
            {
                field: 'create_datetime',
                title: '录入日期',
                width: 200,
                align: 'center',
            },
            {
                field: 'modify_datetime',
                title: '修改日期',
                width: 200,
                align: 'center',
            },
            {
                field: 'operator_id',
                title: '操作员',
                width: 100,
                align: 'center',
            },
            {
                field: 'remark',
                title: '备注',
                width: 100,
                align: 'center',
            },
            {
                field: 'operation',
                title: '操作',
                width: 100,
                align: 'center',
                formatter:function (value,row,index) {
                	 var rowStr=JSON.stringify(row);
                    return"<a href='#' onclick='editRow("+rowStr+")' style='color:#2A00FF;text-decoration:none'>修改 |&nbsp;</a>" +
                        "<a href='#' onclick='delRow("+rowStr+")' style='color:#2A00FF;text-decoration:none'>删除</a>"

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

//重置
function reset(){
    $('#formId').form('clear');
}

//搜索按钮
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

//查询
function query(){
	var dict_type=$("#dict_type").val();
	var dict_name=$("#dict_name").val();
	var flag=$("#dict_flag").val();
	var json={"dict_type":dict_type,"dict_name":dict_name,"flag":flag};
    request({
        url:"DictList@Dict.do",
        data:{_JSON_:  JSON.stringify(json),pageIndex:_pageNumber,pageSize:_pageSize},
        success:function (res) {
            var data={rows:res.data,total:res.total};
            $("#table").datagrid("loadData",data);
            initcombo();
        }
    });
}

//下拉框
function initcombo() {
  var dict_type = '';
  var dict_name = '';
  var flag = '';
  var dictionName = [{'id': '', 'text': '全部'}];
  var dictionType = [{'id': '', 'text': '全部'}];
  var diction_type = [];
  var json={"dict_type":dict_type,"dict_name":dict_name,"flag":flag};
  request({
	  url:"DictList@Dict.do",
	  data:{_JSON_:  JSON.stringify(json)},
      success: function (res) {
          var data = {rows: res.data, total: res.total};
          var tmpType = new Array();
          var tmpName = new Array();
          for (var i in data.rows) {
              var dict_name = data.rows[i].dict_name;
              var dict_type = data.rows[i].dict_type;
              if (dict_name && tmpName.indexOf(dict_name) == -1){
            	  tmpName.push(dict_name);
            	  dictionName.push({"id": dict_name, "text": dict_name});   
              }
              if (dict_type && tmpType.indexOf(dict_type)==-1){
            	  tmpType.push(dict_type);
            	  dictionType.push({"id": dict_type, "text": dict_type});
            	  diction_type.push({"id": dict_type, "text": dict_type});
              }
          }
          $("#dict_name").combobox("loadData", dictionName);
          $("#dict_type").combobox("loadData", dictionType);
          $(".upinput").combobox("loadData", diction_type);
      }
  });
}
//删除
function delRow(row){
	$.messager.confirm('确认','确定要删除吗?',function(r){
		var id=row.id;
		var json={
				para:[[id]]
		};
		if(r){
			request({
		        url:"DictDelete@Dict.do",
		        data: {_JSON_:  JSON.stringify(json)},
		        success:function (res) {
		        	if(res.info=="成功处理1条记录"){//删除成功的条件
						$.messager.show({
                			title:'提示信息',
                			msg:'删除信息成功!',
                			timeout:500,
                			showType:'slide',
                			style:{
                				top:200,
                				left:500
                			}
                		});
                		//重新加载数据
						query();
                	}else{//删除失败
                		$.messager.alert({
                			title:'错误信息',
                			msg:'删除信息失败!',
                			timeout:500,
                			showType:'slide',
                		});
                	}
		        }
			});
		}
	});
}

//添加
function add(){
	$('#form').dialog({
        width: 350,
        title: '增加内容',
        iconCls: 'icon-add',
        //初始化时先关闭表单
        //closed: true,
        modal: true,
        buttons: [{
            text: '提交',
            iconCls: 'icon-ok',
            handler: function () {
                var dict_type=$("#dictTypeName").val();
                var dict_value=$("#dictValue").val();
                var dict_name_eng=$("#dictEnglishName").val();
                var dict_name=$("#dictName").val();
                var flag=$("#dictflag").val();
                var operator_id="admin";
                var remark=$("#remark").val();
                if(dict_type == "" || dict_value == "" || dict_name_eng == "" || dict_name == "" || flag == ""){
                	$.messager.alert("输入提示","必输项不能为空!");
                	return;
                }
                var json={
                	para:[[dict_type,dict_value,dict_name_eng,dict_name,flag,operator_id,remark]]	
                };
                
                request({
                	url:"DictAdd@Dict.do",
                	data: {_JSON_:  JSON.stringify(json)},
                	success:function(res){
                		if(res.info=="成功处理1条记录"){
                			$('#form').dialog('close');//关闭对话框
                    		$.messager.show({
                    			title:'提示信息',
                    			msg:'添加信息成功!',
                    			timeout:500,
                    			showType:'slide',
                    			style:{
                    				top:200,
                    				left:500
                    			}
                    		});
                    		$("#add_form").form("clear");
                    		query();
                    	}else{//添加失败
                    		$.messager.alert({
                    			title:'错误信息',
                    			msg:'添加信息失败!',
                    			timeout:500,
                    			showType:'slide',
                    		});
                		}
                	}
                });
            }
       
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#form').dialog('close');//关闭对话框
            }
        }],
    });
}

//修改
function editRow(row){
		//给修改文本框赋值
		$("#udictTypeName").textbox('setValue',row.dict_type);
		$("#udictValue").textbox('setValue',row.dict_value);
		$("#udictEnglishName").textbox('setValue',row.dict_name_eng);
		$("#udictName").textbox('setValue',row.dict_name);
		$("#uremark").textbox('setValue',row.remark);
		var id=row.id;
		var flag1 = row.flag;
		if(flag1=="00000000"){
			flag1="正常";
        }else if(flag1=="10000000"){
        	flag1="停用";
        }
		$("#uflag").textbox('setValue',flag1);
		//打开修改框
		$('#edit').dialog({
                width: 350,
                title: '修改内容',
                iconCls: 'icon-edit',
                modal: true,
                buttons: [{
                    text: '提交',
                    iconCls: 'icon-ok',
                    handler: function () {
                    	//获取文本框中的值
                        var dict_type = $('#udictTypeName').val();
                        var dict_value = $('#udictValue').val();
                        var dict_name_eng = $('#udictEnglishName').val();
                        var dict_name = $('#udictName').val();
                        var flag = $('#uflag').val();
                        var operator_id = "admin";
                        var remark = $('#uremark').val();
                        if(dict_name_eng == "" || flag == ""){
                        	$.messager.alert("输入提示","必输项不能为空!");
                        	return;
                        }
                        if(flag == "正常"){
                        	flag="00000000";
                        }else if(flag == "停用"){
                        	flag="10000000";
                        }
                        var json = {
                        		para:[[dict_type,dict_value,dict_name_eng,dict_name,flag,operator_id,remark,id]]
                        };
                       
                        $.messager.confirm('确认','确定要修改信息吗?',function(r){
                        	if(r){
                        		request({
                        			url:"DictUpdate@Dict.do",
                        			data: {_JSON_:  JSON.stringify(json)},
                                	success:function(res){
                                		if(res.info=="成功处理1条记录"){
                                			$('#edit').dialog('close');//关闭对话框
                                			$.messager.show({
                                    			title:'提示信息',
                                    			msg:'修改信息成功!',
                                    			timeout:500,
                                    			showType:'slide',
                                    			style:{
                                    				top:200,
                                    				left:500
                                    			}
                                    		});
                                			//重新加载数据
                                			query();
                                		}else{//修改失败
                                    		$.messager.alert({
                                    			title:'错误信息',
                                    			msg:'修改信息失败!',
                                    			timeout:500,
                                    			showType:'slide',
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
                    }
                }]
            });
}
