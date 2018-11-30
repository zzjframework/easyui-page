var _pageSize=10;//每页大小
var _pageNumber=1;//当前第几页
var checked="";//switchbutton的状态变量

$(function () {
    
    //查询条件下拉列表
    $("#para_name").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:150,
        data:[]

    });
    $("#flag").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:100,
        data:[{id:'1',text:'全部'},{id:'2',text:'有效'},{id:'3',text:'无效'}]
    });
    //添加,修改下拉列表
    $(".inputdom").combobox({
        valueField:'id',
        textField:'text',
        panelHeight:100,
        data:[]
    });
    //var checked="";//switchbutton的状态变量
    //列表
    $('#table').datagrid({
        //url: '../Json/datagridjson.ashx',
        fit: true,
        striped: true,//是否开启斑马线
        singleSelect:true,//只能选择一行

        //显示分页控件栏
        pagination: true,

        //通过POST传递到后台，然后进行排序。
        sortName: 'createtime',
        sortOrder: 'desc',

        //按钮
        toolbar: '#tb',
        //要显示的列
        columns: [[
            {
                field: 'para_type',
                title: '参数类型',
                width: 150,
                align: 'center',
            },
            {
                field: 'para_no',
                title: '参数编号',
                width: 100,
                align: 'center',
            },
            {
                field: 'para_value',
                title: '参数值',
                width: 200,
                align: 'center',
            },
            {
                field: 'para_name',
                title: '翻译参数名',
                width: 200,
                align: 'center',
            },
            {
                field: 'flag1',
                title: '默认状态',
                width: 100,
                align: 'center',
                formatter:function (value,row,index) {
               	 	var rowStr=JSON.stringify(row);
                	var flag1=row.flag;
                	var flag=flag1.substr(0,1);
               	 	if($.trim(flag) == "0"){
               	 		checked=true;
               	 	}else{
               	 		checked=false;
               	 	}
               	 	if(checked){
	               	 	 return "<a onClick='changeFlag1("+checked+","+rowStr+")'><input id='defultFlag' name='sbutton' style='height:20px;width:50px' class='easyui-switchbutton' " +
	               	 	 		"onText='正常' offText='默认' checked readonly/></a>";
               	 	}else{
               	 	 return "<a onClick='changeFlag1("+checked+","+rowStr+")'><input id='defultFlag' name='sbutton' style='height:20px;width:50px' class='easyui-switchbutton' " +
               	 	 		"onText='正常' offText='默认' readonly/></a>";
               	 	}
                   

                }
            },
            {
                field: 'flag2',
                title: '有效|无效状态',
                width: 100,
                align: 'center',
                formatter:function (value,row,index) {
               	 	var rowStr=JSON.stringify(row);
                	var flag1=row.flag;
                	var flag=flag1.substr(1,1);
               	 	if($.trim(flag) == "0"){
               	 		checked=true;
               	 	}else{
               	 		checked=false;
               	 	}
               	 	if(checked){
	               	 	return "<a onClick='changeFlag2("+checked+","+rowStr+")'><input id='paraid' name='sbutton' style='height:20px;width:50px' class='easyui-switchbutton' " +
	               	 			"onText='有效' offText='无效' checked readonly/></a>";
               	 	}else{
	               	 	return "<a onClick='changeFlag2("+checked+","+rowStr+")'><input id='paraid' name='sbutton' style='height:20px;width:50px' class='easyui-switchbutton' " +
	               	 			"onText='有效' offText='无效' readonly/></a>";
               	 	}
                }
            },
            {
                field: 'flag3',
                title: '全局状态',
                width: 150,
                align: 'center',
                formatter:function (value,row,index) {
               	 	var rowStr=JSON.stringify(row);
               	 	var flag1=row.flag;
                	var flag=flag1.substr(2,1);
               	 	if($.trim(flag) == "0"){
               	 		checked=true;
               	 	}else{
               	 		checked=false;
               	 	}
               	 	if(checked){
	               	 	return "<a onClick='changeFlag3("+checked+","+rowStr+")'><input id='operatorid1' name='sbutton' style='height:20px;width:70px' class='easyui-switchbutton' " +
	               	 			"onText='单个有效' offText='全局有效' checked readonly/></a>";
               	 	}else{
	               	 	return "<a onClick='changeFlag3("+checked+","+rowStr+")'><input id='operatorid' name='sbutton' style='height:20px;width:70px' class='easyui-switchbutton' " +
	               	 			"onText='单个有效' offText='全局有效' readonly/></a>";
               	 	}
                }
            },
            {
                field: 'create_datetime',
                title: '录入日期',
                width: 150,
                align: 'center',
            },
            {
                field: 'modify_datetime',
                title: '修改日期',
                width: 150,
                align: 'center',
            },
            {
                field: 'operator_id',
                title: '操作员',
                width: 150,
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
                    return "<a href='#' onclick='editRow("+rowStr+")' style='color:#2A00FF;text-decoration:none'>修改 |&nbsp;</a>" +
                        "<a href='#' onclick='delRow("+rowStr+")' style='color:#2A00FF;text-decoration:none'>删除</a>";
                }
            }
        ]],
        onLoadSuccess:function(){
        	$("input[name='sbutton']").switchbutton({}); 
        },
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
	var para_no=$("#para_no").val();
	var para_name=$("#para_name").val();
	var flag=$("#flag").val();
	if(flag=="2"){
		flag="0";
	}
	else if(flag=="3"){
		flag="1";
	}else{
		flag=""; 
	}
	var json={"para_no":para_no,"para_name":para_name,"flag":flag};
    request({
        url:"List@Para.do",
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
  var para_no = '';
  var para_name = '';
  var flag = '';
  var paraName = [{'id': '', 'text': '全部'}];
  var paraType = [];
  var json={"para_no":para_no,"para_name":para_name,"flag":flag};
  request({
	  url:"List@Para.do",
	  data:{_JSON_:  JSON.stringify(json)},
      success: function (res) {
          var data = {rows: res.data, total: res.total};
          var tmpName = new Array();
          var tmpType = new Array();
          for (var i in data.rows) {
              var para_name = data.rows[i].para_name;
              var para_type = data.rows[i].para_type;
              if (para_name && tmpName.indexOf(para_name)==-1) {
            	  tmpName.push(para_name);
            	  paraName.push({"id": para_name, "text": para_name});
              }
              if (para_type && tmpType.indexOf(para_type)==-1) {
            	  tmpType.push(para_type);
            	  paraType.push({"id": para_type, "text": para_type});
              }
          }
          $("#para_name").combobox("loadData", paraName);
          $(".inputdom").combobox("loadData", paraType);
      }
  });
}


//添加
function add(){
	$('#form').dialog({
        width: 350,
        title: '增加内容',
        iconCls: 'icon-add',
        modal: true,
        buttons: [{
            text: '提交',
            iconCls: 'icon-ok',
            handler: function () {
                var para_type=$("#paraType").val();
                var para_no=$("#paraNo").val();
                var para_value=$("#paraValue").val();
                var para_name_eng=$("#paraNameEng").val();
                var para_name=$("#paraName").val();
                var flag="00000000";
                var operator_id="admin"; 
                var remark=$("#remark").val();
                if(para_type == "" || para_no == "" || para_value == "" || para_name_eng == "" || para_name == "" || flag ==""){
                	$.messager.alert("输入提示","必输项不能为空!");
                	return;
                }
                var json={
                	para:[[para_type,para_no,para_value,para_name_eng,para_name,flag,operator_id,remark]]	
                };
                request({
                	url:"Add@Para.do",
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


//删除
function delRow(row){
	$.messager.confirm('确认','确定要删除吗?',function(r){
		var id=row.id;
		var json={para:[[id]]};
		if(r){
			request({
		        url:"Delete@Para.do",
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
						query();//重新加载数据
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

//修改
function editRow(row){
		var id=row.id;
		//给修改文本框赋值
		$("#uparaType").textbox('setValue',row.para_type);
		$("#uparaNo").textbox('setValue',row.para_no);
		$("#uparaValue").textbox('setValue',row.para_value);
		$("#uparaNameEng").textbox('setValue',row.para_name_eng);
		$("#uparaName").textbox('setValue',row.para_name);
		$("#uremark").textbox('setValue',row.remark);
		$('#edit').dialog({
                width: 350,
                title: '修改内容',
                iconCls: 'icon-edit',
                modal: true,
                buttons: [{
                    text: '提交',
                    iconCls: 'icon-ok',
                    handler: function () {
                    	var para_type=$("#uparaType").val();
                        var para_no=$("#uparaNo").val();
                        var para_value=$("#uparaValue").val();
                        var para_name_eng=$("#uparaNameEng").val();
                        var para_name=$("#uparaName").val();
                        var operator_id="admin";  
                        var remark=$("#uremark").val();
                        if(para_no == "" || para_name_eng == ""){
                        	$.messager.alert("输入提示","必输项不能为空!");
                        	return;
                        }
                        var json = {
                        		para:[[para_type,para_no,para_value,para_name_eng,para_name,operator_id,remark,id]]
                        };
                       
                        $.messager.confirm('确认','确定要修改信息吗?',function(r){
                        	if(r){
                        		request({
                        			url:"Update@Para.do",
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
                                			query();//重新加载数据
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

//改变状态
function changeFlag1(checked,row){
	var operator_id="admin";
	var id=row.id;
	var flag1=row.flag;
	var flag2=flag1.split("");
	if(checked){
		flag2.splice(0,1,"1");
		var flag=flag2.join("");
		$.messager.confirm('确认','确定要切换状态为"默认"?',function(r){
			var json={"id": id, "flag": flag, "operator_id": operator_id};
			flagTips(json,r);
		});
	}else{
		flag2.splice(0,1,"0");
		var flag=flag2.join("");
		$.messager.confirm('确认','确定要切换状态为"正常"?',function(r){
			var json={"id": id, "flag": flag, "operator_id": operator_id};
			flagTips(json,r);
		});
	}	
}

//改变状态
function changeFlag2(checked,row){
	var operator_id="admin";
	var id=row.id;
	var flag1=row.flag;
	var flag2=flag1.split("");
	if(checked){
		flag2.splice(1,1,"1");
		var flag=flag2.join("");
		$.messager.confirm('确认','确定要切换状态为"无效状态"?',function(r){
			var json={"id": id, "flag": flag, "operator_id": operator_id};
			flagTips(json,r);
		});
	}else{
		flag2.splice(1,1,"0");
		var flag=flag2.join("");
		$.messager.confirm('确认','确定要切换状态为"有效状态"?',function(r){
			var json={"id": id, "flag": flag, "operator_id": operator_id};
			flagTips(json,r);
		});
	}
}
//改变状态
function changeFlag3(checked,row){
	var operator_id="admin";
	var id=row.id;
	var flag1=row.flag;
	var flag2=flag1.split("");
	if(checked){
		flag2.splice(2,1,"1");
		var flag=flag2.join("");
		$.messager.confirm('确认','确定要切换状态为"全局状态"?',function(r){
			var json={"id": id, "flag": flag, "operator_id": operator_id};
			flagTips(json,r);
		});
	}else{
		flag2.splice(2,1,"0");
		var flag=flag2.join("");
		$.messager.confirm('确认','确定要切换状态为"单个有效"?',function(r){
			var json={"id": id, "flag": flag, "operator_id": operator_id};
			flagTips(json,r);
		});
	}
}



//修改状态公共提示代码
function flagTips(json,r){
	if(r){
		request({
	        url:"updateFlag@Para.do",
	        data: {_JSON_:  JSON.stringify(json)},
	        success:function (res) {
	        	if(res.info=="成功处理1条记录"){//成功的条件
					$.messager.show({
            			title:'提示信息',
            			msg:'状态切换成功!',
            			timeout:500,
            			showType:'slide',
            			style:{
            				top:200,
            				left:500
            			}
            		});
					query();
            	}else{//失败
            		$.messager.alert({
            			title:'错误信息',
            			msg:'状态切换失败!',
            			timeout:500,
            			showType:'slide',
            		});
            	}
	        }
		});
	}
}