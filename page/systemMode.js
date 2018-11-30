$(function () {
    
    $('#table').datagrid({
        //url: 'GetInfo@AccDate.do',
        fit: true,
        striped: true,//是否开启斑马线

        //显示分页控件栏
        pagination: true,
        pageNumber: 1,//初始化的时候在第几页
        pageSize: 10,//，每页显示的条数
        pageList: [10, 15, 20],//每页显示的条数

        /*//通过POST传递到后台，然后进行排序。
        sortName: 'createtime',
        sortOrder: 'desc',*/

        rownumbers:true,
        //要显示的列
        columns: [[
     
            {
                field: 'sys_ver',
                title: '系统版本',
                width: 100,
                align: 'center',
            },
            {
                field: 'sys_name',
                title: '系统名称',
                width: 100,
                align: 'center',
            },
            {
                field: 'last_accdate',
                title: '上一会计工作日期',
                width: 150,
                align: 'center',
            },
            {
                field: 'curr_accdate',
                title: '当前会计工作日期',
                width: 150,
                align: 'center',
            },
            {
                field: 'flag',
                title: '状态',
                width: 100,
                align: 'center',
                formatter:function(value,row,index){
                    if(value=='10000000'){return '<span style="color: #2A00FF">正常</span>'}
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
                field: 'operator_name',
                title: '操作员',
                width: 80,
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
                width: 150,
                align: 'center',
                formatter:function (value,row,index) {
               	 	var rowStr=JSON.stringify(row);
               	 	var str="";
               	 	if($.trim(row.flag)=="10000000"){
               	 		str="<a href='#' id='lock' onclick='lock("+rowStr+")' style='color:#2A00FF; text-decoration:none'>锁定</a>"+
                        "<span style='color: #2A00FF'>&nbsp;|&nbsp;</span>" ;
               	 	}else{
               	 		str="<a href='#' id='lock' onclick='lock("+rowStr+")' style='color:#FF0000; text-decoration:none'>解锁</a>"+
                        "<span style='color: #2A00FF'>&nbsp;|&nbsp;</span>";
               	 	}
                    return str+"<a href='#' onclick='swd("+rowStr+")' style='color:#2A00FF; text-decoration:none'>切换工作日</a>";

                }
            }
        ]],
    });
    query();
});
//查询
function query(){
    request({
        url:"GetInfo@AccDate.do",
        data:{},
        success:function (res) {
        	console.log(res.data);
            $("#table").datagrid("loadData",res.data);
        }
    });
}

//锁定/解锁
function lock(row){
    //$.messager.alert("提示","123");
	var flag=row.flag;
	if($.trim(flag)=="00000000"){
		$.messager.confirm('确认','确定要解锁系统?',function(r){
			var flag="10000000";
			var operator_id="admin";
			var json={"flag":flag,"operator_id":operator_id};
			if(r){
				request({
			        url:"updateFlag@AccDate.do",
			        data: {_JSON_:  JSON.stringify(json)},
			        success:function (res) {
			        	if(res.info=="成功处理1条记录"){//成功的条件
							$.messager.show({
	                			title:'提示信息',
	                			msg:'系统解锁成功!',
	                			timeout:2000,
	                			showType:'slide',
	                			style:{
	                				top:200,
	                				left:500
	                			}
	                		});
	                		//重新加载数据
							query();
	                	}else{
	                		$.messager.alert({
	                			title:'错误信息',
	                			msg:'系统解锁失败!',
	                			timeout:2000,
	                			showType:'slide',
	                		});
	                	}
			        }
			 
				
				});
			}
		});
	}else if($.trim(flag)=="10000000"){
		$.messager.confirm('确认','确定要锁定系统?',function(r){
			var flag="00000000";
			var operator_id="admin";
			var json={"flag":flag,"operator_id":operator_id};
			if(r){
				request({
			        url:"updateFlag@AccDate.do",
			        data: {_JSON_:  JSON.stringify(json)},
			        success:function (res) {
			        	if(res.info=="成功处理1条记录"){//成功的条件
							$.messager.show({
	                			title:'提示信息',
	                			msg:'系统锁定成功!',
	                			timeout:2000,
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
	                			msg:'系统锁定失败!',
	                			timeout:2000,
	                			showType:'slide',
	                		});
	                	}
			        }
				});
			}
		});
	}
}

//切换工作日
function swd(row){	
	$.messager.confirm('确认','确定切换工作日?',function(r){
		var operator_id="admin";
		var json={"operator_id":operator_id};
		if(r){
			request({
		        url:"Next@AccDate.do",
		        data: {_JSON_:  JSON.stringify(json)},
		        success:function (res) {
		        	if(res.info=="成功处理1条记录"){//成功的条件
						$.messager.show({
                			title:'提示信息',
                			msg:'切换工作日成功!',
                			timeout:2000,
                			showType:'slide',
                			style:{
                				top:200,
                				left:500
                			}
                		});
                		//重新加载数据
						query();
                	}else{//失败
                		$.messager.alert({
                			title:'错误信息',
                			msg:'切换工作日失败!',
                			timeout:2000,
                			showType:'slide',
                		});
                	}
		        }
			});
		}
	});
}
