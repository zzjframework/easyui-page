var yzjson;
$(function() {
  //input框输入限制
  $("#q_cnt")
    .textbox("textbox")
    .bind("keyup", function(e) {
      $("#q_cnt").textbox(
        "setValue",
        $(this)
          .val()
          .replace(/\D/g, "")
      );
    });
  //   加载翻译菜单
  menulist();

  request({
    url: "DictList@Dict.do",
    data: {
      dict_type: "0035",
      pageSize: 10,
      pageIndex: 1
    },
    success: function(res) {
      yzjson=res;
    }
  });
});

function menulist() {
  // 翻译菜单
  request({
    url: "Table@Translate.do",
    data: "",
    success: function(res) {
      console.log(res);
      getmenulist(res);
    }
  });
}

function getmenulist(res) {
  var jsoncd = res;
  var cd = [];
  for (var i = 0; i < jsoncd.data.length; i++) {
    var temp1 = {
      text: jsoncd.data[i].dict_name,
      id: jsoncd.data[i].dict_value
    };
    cd.push(temp1);
  }
  var data = [
    {
      iconCls: "icon-sum",
      state: "open",
      children: cd
    }
  ];
  // $("#tree").sidemenu("destroy");
  // 翻译列表菜单
  $("#tree").sidemenu({
    data: data,
    width: '100%',
    fitColumns: true,
    fit: true,
    onSelect: function(item) {
      console.log(item);
      gettranslatelist(item, 10, 1);
      // console.log(PARA_NAME);
      // $("#search").attr("onclick", "searchlist('"+item.id+"');");
      $("#q_id").val(item.id);
    }
  });
  var item1 = {};
  item1.id = cd[9].id;
  gettranslatelist(item1, 10, 1);
  $("#search").attr("onclick", "searchlist();");
  $("#q_id").val(item1.id);
  // $("#searchlist").attr("onclick", "searchlist(&quot;" + item1 + ","+10+","+1+"&quot;);");
}
//获取翻译列表
function gettranslatelist(item, pageSize, pageIndex, name, cnt) {
  request({
    url: "List@Translate.do",
    data: {
      dict_value: item.id,
      pageSize: pageSize,
      pageIndex: pageIndex,
      name: name,
      cnt: cnt
    },
    success: function(res) {
      console.log(res);
      translatelist(res, pageIndex, pageSize);
    }
  });
}
//加载翻译字段列表
function translatelist(res, pageIndex, pageSize) {
  // var data = res.data;
  var data = {};
  data.rows = res.data;
  data.total = res.total;
  var total = res.total;
  //列表
  $("#table").datagrid({
    // url: "../Json/datagridjson.ashx",
    fit: true,
    striped: true, //是否开启斑马线
    // fitColumns: true,
    fit: true,
    //显示分页控件栏
    pagination: true,
    pageNumber: pageIndex, //初始化的时候在第几页
    pageSize: pageSize, //，每页显示的条数
    pageList: [10, 15, 20], //每页显示的条数
    pageTotal: 10,
    // total:20,
    //通过POST传递到后台，然后进行排序。
    sortName: "createtime",
    sortOrder: "desc",
    singleSelect: true,
    //按钮
    toolbar: "#tb",
    data: data,
    //要显示的列
    columns: [
      [
        {
          field: "name",
          title: "名称(本地)",
          width: 250,
          halign: "center"
        },
        {
          field: "cnt",
          title: "已配置数量",
          width: 100,
          halign: "center"
        },
        {
          field: "remark",
          title: "备注",
          width: 150,
          halign: "center"
        },
        {
          field: "22",
          title: "操作",
          width: 50,
          halign: "center",
          formatter: sz
        }
      ]
    ]
  });
  //分页点击事件
  $("#table")
    .datagrid("getPager")
    .pagination({
      onSelectPage: function(pageNumber, pageSize) {
        $(this).pagination("loading");
        // var name=$("#q_name").val();
        // var cnt=$("#q_cnt").val();
        // var q_id=$("#q_id").val();
        // console.log('name:'+name+',cnt:'+cnt+',q_id:'+q_id);
        // console.log('pageNumber:'+pageNumber+',pageSize:'+pageSize);
        searchlist();
        $(this).pagination("loaded");
      }
    });
  function sz(val, row, index) {
    // return '<div style="padding:5px 0;"><a href="#" class="easyui-linkbutton" onclick="form(&quot;'+row.table_name+','+row.id+'&quot;);">设置</a></div>';
    return (
      '<div style="padding:5px 0;"><a href="#" class="easyui-linkbutton" onclick="form(' +
      index +
      ');">设置</a></div>'
    );
  }
}
// 设置页面加载
function gettable(res) {
  var fy = res.data;

  $("#form").dialog({
    title: "翻译信息",
    iconCls: "icon-form",
    modal: true,
    resizable: true,
    fitColumns: true,
    onClose: function() {
      var t = $("#table1").datagrid("getRows");
      console.log(t);
      if (t != 0) {
        $("#table1").datagrid({
          columns: [[]],
          rownumbers: false,
          pagination: false
        });
      }
    }
  });
  console.log(yzjson);
  var yz = yzjson.data;
  //给修改的文本框赋值
  $("#table1").datagrid({
    //   url: "../Json/datagridjson.ashx",
    fit: true,
    striped: true, //是否开启斑马线
    fitColumns: true,
    //显示分页控件栏
    pagination: false,

    //通过POST传递到后台，然后进行排序。
    sortName: "create_datetime",
    sortOrder: "asc",
    //翻译数据
    data: fy,
    //底部栏
    showFooter: true,
    //只能选择一列
    singleSelect: true,
    //点击编辑
    onClickRow: onClickRow,
    //要显示的列
    columns: [
      [
        {
          field: "language",
          title: "语种",
          halign: "center",
          width: 80,
          editor: "combobox",
          editor: {
            type: "combobox",
            options: {
              valueField: "dict_value",
              textField: "dict_value",
              data: yz,
              required: true,
              editable: false
            }
          }
        },
        {
          field: "table_name",
          title: "表名",
          halign: "center"
        },
        {
          field: "name",
          title: "翻译字段",
          text: "name",
          halign: "center"
        },
        {
          field: "translation",
          title: "翻译内容",
          editor: "text"
        },
        {
          field: "remark",
          title: "备注",
          editor: "text",
          width: 250
        },
        {
          field: "cz1",
          title: "操作",
          width: 80,
          formatter: sz1
        }
      ]
    ]
  });
  function sz1(val, row, index) {
    return (
      '<div style="padding:5px 0;" class="cz2"><a href="#" class="easyui-linkbutton" >编辑</a>|<a href="#" class="easyui-linkbutton" onclick="removeit(' +
      index +
      ');">删除</a></div>'
    );
  }
}

// 设置页面
function form(index) {
  //判断是否选择多条信息
  // var rows = $("#table").datagrid("getSelections");
  $("#table").datagrid("unselectAll");
  var rows = $("#table").datagrid("selectRow", index);
  var rowdata = $("#table").datagrid("getSelected");
  console.log(rowdata);
  var data = { dict_value: rowdata.dict_value, translate_id: rowdata.id };
  request({
    url: "Detail@Translate.do",
    data: data,
    success: function(res) {
      console.log(res);
      // res.name=
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].name = rowdata.name;
      }
      gettable(res);
      // $("#table").treegrid("loadData",res);
    }
  });
}

function cancel(index) {
  // if (editIndex == undefined){return}
  // console.log(editIndex);
  $("#table1").datagrid("cancelEdit", index);
  // $('#table1').datagrid('unselectRow', editIndex);
  $(".cz2:eq(" + index + ") a:eq(1)").attr(
    "onclick",
    "removeit(" + index + ");"
  );
  // editIndex = undefined;
}
// 进入编辑状态
function onClickRow(index) {
  $("#table1")
    .datagrid("selectRow", index)
    .datagrid("beginEdit", index);
  $(".cz2:eq(" + index + ") a:eq(0)").text("保存");
  $(".cz2:eq(" + index + ") a:eq(0)").attr("onclick", "save(" + index + ");");
  $(".cz2:eq(" + index + ") a:eq(1)").text("取消");
  $(".cz2:eq(" + index + ") a:eq(1)").removeAttr("onclick");
  $(".cz2:eq(" + index + ") a:eq(1)").attr("onclick", "cancel(" + index + ");");
}
//保存
function save(index) {
  $("#table1").datagrid("acceptChanges");
  var rows = $("#table1").datagrid("getSelections");
  console.log(rows);
  var json = {
    para: [[rows[0].language, rows[0].translation, rows[0].remark, rows[0].id]]
  };
  request({
    url: "Update@Translate.do",
    data: { _JSON_: JSON.stringify(json) },
    // data: "_JSON_=" + JSON.stringify(json),
    // contentType: "charset=utf-8",
    // type: "get",
    success: function(res) {
      $.messager.confirm("Confirm", "保存成功！", function(r) {
        if (r) {
          form();
        }
      });
      // console.log(res);
      //   getmenulist(res);
    }
  });
}
//删除
function removeit(index) {
  $.messager.confirm("Confirm", "你确定要删除这条数据？", function(r) {
    if (r) {
      var rows = $("#table1").datagrid("getSelections");
      // console.log(rows);
      var json = {
        para: [[rows[0].id]]
      };
      request({
        url: "Delete@Translate.do",
        // data: "_JSON_=" + JSON.stringify(json),
        data: { _JSON_: JSON.stringify(json) },
        // contentType: "charset=utf-8",
        // type: "get",
        success: function(res) {
          console.log(res);
          //   getmenulist(res);
          $("#table1").datagrid("deleteRow", index);
          form();
        }
      });
    }
  });
}
//新增
function append() {
  var rows = $("#table").datagrid("getSelections");
  console.log(rows);
  var newtableName = rows[0].table_name;
  var translate_id = rows[0].id;
  var field_name = rows[0].filed_name;
  var name = rows[0].name;
  $("#table1").datagrid("appendRow", {
    table_name: newtableName,
    translate_id: translate_id,
    field_name: field_name,
    name: name
  });
  var index = $("#table1").datagrid("getRows").length - 1;
  $("#table1")
    .datagrid("selectRow", index)
    .datagrid("beginEdit", index);
  $(".cz2:eq(" + index + ") a:eq(0)").text("添加");
  $(".cz2:eq(" + index + ") a:eq(0)").attr("onclick", "add(" + index + ");");
  $(".cz2:eq(" + index + ") a:eq(1)").text("删除");
  $(".cz2:eq(" + index + ") a:eq(1)").removeAttr("onclick");
  $(".cz2:eq(" + index + ") a:eq(1)").attr("onclick", "del(" + index + ");");
}
//新增点击事件
function add(index) {
  // var rows = $("#table").datagrid("getRows");
  $("#table1").datagrid("acceptChanges");
  var rows = $("#table1").datagrid("getSelections");
  console.log(rows);
  // var rows_length=Object.getOwnPropertyNames(rows[0]).length;
  // console.log(rows_length);
  if (
    rows[0].language == null ||
    rows[0].translation == null ||
    rows[0].language == "" ||
    rows[0].translation == ""
  ) {
    alert("请将信息填写完整!");
    // console.log(index);
    $("#table1").datagrid("deleteRow", index);
    append();
    return;
  }
  var json = {
    para: [
      [
        rows[0].translate_id,
        rows[0].language,
        rows[0].table_name,
        rows[0].field_name,
        rows[0].translation,
        rows[0].remark
      ]
    ]
  };
  request({
    url: "Add@Translate.do",
    // data: "_JSON_=" + JSON.stringify(json),
    data: { _JSON_: JSON.stringify(json) },
    // contentType: "charset=utf-8",
    // type: "get",
    success: function(res) {
      console.log(res);
      //   getmenulist(res);
      form();
    }
  });
}

function del(index) {
  $.messager.confirm("Confirm", "你确定要删除这条数据？", function(r) {
    if (r) {
      $("#table1").datagrid("deleteRow", index);
    } else {
      $(".cz2:eq(" + index + ") a:eq(0)").text("添加");
      $(".cz2:eq(" + index + ") a:eq(0)").attr(
        "onclick",
        "add(" + index + ");"
      );
      $(".cz2:eq(" + index + ") a:eq(1)").text("删除");
      $(".cz2:eq(" + index + ") a:eq(1)").removeAttr("onclick");
      $(".cz2:eq(" + index + ") a:eq(1)").attr(
        "onclick",
        "del(" + index + ");"
      );
    }
  });
}

// 搜索
function searchlist() {
  var options = $("#table")
    .datagrid("getPager")
    .data("pagination").options;
  // console.log(item)
  console.log(options.pageSize + ":" + options.pageNumber);
  var name = $("#q_name").val();
  var cnt = $("#q_cnt").val();
  var q_id = {};
  q_id.id = $("#q_id").val();
  console.log("name:" + name + ",cnt:" + cnt + ",q_id:" + q_id);
  gettranslatelist(q_id, options.pageSize, options.pageNumber, name, cnt);
  // console.log(ttt)
  // console.log()
  // gettranslatelist();
}
