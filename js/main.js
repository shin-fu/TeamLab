$(loaded);
//現在参照しているToDoリストのID
var currentList=-1;
var currentTasks=[];
var searchWord="";
//ToDoの要素番号
const TITLE = 0;
const SUMMARY = 1;
const STATE = 2;


function loaded() {
    showList();
    displayTopView();
    // ボタンをクリックしたときに実行するイベントを設定する
    $("#formButton").click(
		// コールバックとしてメ ソッドを引数にわたす
        function() {
            saveTask();
            showTask(currentList);
        });
    //ToDoリストを作成する
    $("#makeListButton").click(
        function(){
            saveList();
            showList();
        });
    //画面切り替え
    $("#top").click(
        function(){
            displayTopView();
        });
    $("#searchButton").click(
        function(){
            displaySearchView();
        });

    $("#search").click(
        function(){
            showSearchResult();
        });   
    //カーソル設定
    $("#top").css("cursor","pointer");
    $("#searchButton").css("cursor","pointer");
    //タスクチェック    
    $("#moveDone").click(
        function(){
            moveDone();
            showTask();
        });
    //サーチ時のタスクチェック
    $("#sMoveDone").click(
        function(){
            moveDone();
            showSearchResult
        });
}
//ビューをTop画面に切り替える
function displayTopView(){
    $("#listContainer").show();
    $("#todoContainer").hide();
    $("#searchContainer").hide();
    showList();
}
//ビューをToDo画面に切り替える
function displayTaskView(){
    $("#listContainer").hide();
    $("#todoContainer").show();
    $("#searchContainer").hide();
    showTask();
}
//ビューを検索画面に切り替える
function displaySearchView(){
    $("#listContainer").hide();
    $("#todoContainer").hide();
    $("#searchContainer").show();
    currentList = -1;

}
/***
*リストを保存する
*key:List#"id"
*value:[タイトル,ToDo1,Todo2.......]
***/
function saveList(){
    var listTitle = $("#listForm");
    console.log(listTitle);
    var val = escapeText(listTitle.val());
    if(checkText(val,true)){
     localStorage.setItem("List#"+(getLastList()+1), JSON.stringify([val]));
        // テキストボックスを空にする
        listTitle.val("");
    }
}

/***
*Todoを保存する
*key:Task#"id"
*value:[タイトル,内容,状態]
***/
function saveTask() {
    // IDをキーにして入力されたテキストを保存する
    var taskTitle = $("#formText");
    var summary = $("#summaryText");
   // var time = new Date();
   var val = [escapeText(taskTitle.val()),escapeText(summary.val()),"TODO"];
   if(checkText(val[0],false)){
    var next = getLastTask()+1;
    localStorage.setItem("Task#"+next, JSON.stringify(val));
    var tasks=JSON.parse(localStorage.getItem("List#"+currentList));
    tasks.push(next);
    localStorage.setItem("List#"+currentList,JSON.stringify(tasks));
    	// テキストボックスを空にする
        taskTitle.val("");
        summary.val("");
    }
}

// 文字をエスケープする
function escapeText(text) {
    return $("<div>").text(text).html();
}

// 入力チェックを行う
function checkText(text,isList) {
    // 文字数が0または20以上は不可
    if (0 === text.length || 20 < text.length) {
     alert("文字数は1〜20字にしてください");
     return false;
 }
    // すでに入力された値があれば不可
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
     var key = localStorage.key(i);
     var value = JSON.parse(localStorage.getItem(key));
    	// 内容が一致するものがあるか比較
        if(isList && key.indexOf("Task#")!=-1)continue;
        if(!isList && key.indexOf("List#")!=-1)continue;
        if (text === value[0]) {

         alert("同じ内容は避けてください");
         return false;
     }
 }
    // すべてのチェックを通過できれば可
    return true;
}
//登録されているToDoの数を応答
function getLastTask(){
    var last = -1;
    for(var i=0;i<localStorage.length;i++){
        var key = localStorage.key(i);
        if(key.indexOf("Task") != -1){
            var num=Number(key.split("#")[1]);
            last=Math.max(num,last);
        }
    }
    return last;
}
//登録されているリストの数を応答
function getLastList(){
    var last = -1;
    for(var i=0;i<localStorage.length;i++){
        var key = localStorage.key(i);
        if(key.indexOf("List") != -1){
            var num=Number(key.split("#")[1]);
            last=Math.max(num,last);
        }
    }
    return last;
}
// ローカルストレージに保存したToDoを再描画する
function showAllTask() {
    // すでにある要素を削除する
    var list = $("#list");
    list.children().remove();
    // ローカルストレージに保存された値すべてを要素に追加する
    var value,key,html = [];
    var keyList = [];
    for(var i=0;i < localStorage.length;i++){
        key = localStorage.key(i);
        if(key.indexOf("Task") != -1){
            var num=Number(key.split("#")[1]);
            keyList.push(num);
        }
    }
    //追加された順にソート
    keyList.sort(function(a, b){return a-b});
    for(var i=keyList.length-1;i>=0;i--){
        console.log(keyList[i]);
        var value = JSON.parse(localStorage.getItem("Task#"+keyList[i]));
        html.push("<p>" + value[0] + "</p>");
    }
    list.append(html.join(''));
}
//タスクを表示
function showTask(){
    var list = $("#list");
    var doneList = $("#doneList");
    list.children().remove();
    doneList.children().remove();
    var value,key,html1=[],html2 = [];
    var all = JSON.parse(localStorage.getItem("List#"+currentList));
    all.sort(function(a,b){return a-b});
    html1.push("<form action=\"\"><section>");
    html2.push("<form action=\"\"><section>");
    for(var i=all.length-1;i>=1;i--){
        var value = JSON.parse(localStorage.getItem("Task#"+all[i]));
        var st = "";
        st += "<input type=\"checkbox\" id=\"check_";
        st += all[i] + "\" value=\"";
        st += value[TITLE] + "\" class=\"checkbox\">";
        st += "<label for=\"check_"+all[i]+"\"class=\"checkbox\">";
        st += value[TITLE]+"</label>";
        console.log(value[STATE]);
        if(value[STATE]==="TODO"){
            html1.push(st);
        }else{
            html2.push(st);
        }
    }
    $("#todoName").children().remove();
    $("#todoName").append("<h2 class=\"sample\">　"+all[TITLE]+"</h2>");
    html1.push("</section></form>");
    html2.push("</section></form>");
    list.append(html1.join(''));
    doneList.append(html2.join(''));
}
//リストを表示
function showList(){
    var list = $("#todoList");
    list.children().remove();
    var value,key,html = [];
    var keyList = [];
    for(var i=0;i<localStorage.length;i++){
        key = localStorage.key(i);
        if(key.indexOf("List")!=-1){
            keyList.push(key.split("#")[1]);
        }
    }
    keyList.sort(function(a,b){return a-b});
    for(var i=keyList.length-1;i>=0;i--){
        var value = JSON.parse(localStorage.getItem("List#"+keyList[i]));
        var st = "<button id=List_"+keyList[i]+" class=\"liststyle\"><b><font size=4>"+value[0]+"</font></b><br>";
        st += (value.length-1)+"個中"+getToDoNum(value)+"個のToDoが未完了</button>";
        console.log(st);
        html.push(st);
    }
    list.append(html.join(''));
    for(var i=keyList.length-1;i>=0;i--){
        $("#List_"+keyList[i]).click(
            function(event){
                currentList=event.target.id.split("_")[1];
                displayTaskView();
                showTask();
            }
            );
        $("#List_"+keyList[i]).css("cursor","pointer");
    }
}
//検索結果を表示
function showSearchResult(){
    $("#list").children().remove();
    $("#doneList").children().remove();
    var list = $("#sList");
    var doneList = $("#sDoneList");
    var word = escapeText($("#searchbox").val());
    if(word==="")word=searchWord;
    list.children().remove();
    doneList.children().remove();
    var value,key,html1=[],html2 = [];
    html1.push("<form action=\"\"><section>");
    html2.push("<form action=\"\"><section>");
    currentTasks=["Result"];
    for(var i=0;i<=getLastTask();i++){
        var value = JSON.parse(localStorage.getItem("Task#"+i));
        if(value[TITLE].indexOf(word) != -1){
            var st = "";
            st += "<input type=\"checkbox\" id=\"check_";
            st += i + "\" value=\"";
            st += value[TITLE] + "\" class=\"checkbox\">";
            st += "<label for=\"check_"+i+"\"class=\"checkbox\">";
            st += value[TITLE]+"</label>";
            console.log(value[STATE]);
            if(value[STATE]==="TODO"){
                html1.push(st);
            }else{
                html2.push(st);
            }
            currentTasks.push(i);
        }
    }
    $("#searchbox").val("");
    console.log(currentTasks);
    $("#searchWord").children().remove();
    $("#searchWord").append("<h2 class=\"sample\">　"+word+"</h2>");
    html1.push("</section></form>");
    html2.push("</section></form>");
    list.append(html1.join(''));
    doneList.append(html2.join(''));
    searchWord=word;
}
//リストに含まれる未完了ToDoの数を応答
function getToDoNum(list){
    var cnt = 0;
    for(var i=1;i < list.length;i++){
        var value = JSON.parse(localStorage.getItem("Task#"+list[i]));
        if(value[STATE]==="TODO"){
            cnt+=1;
        }
    }
    return cnt;
}
//未完了タスクを完了タスクにする
function moveDone(){
    console.log("movedone:"+currentList);
    var all;
    if(currentList===-1){
        all = currentTasks;
    }else{
        all = JSON.parse(localStorage.getItem("List#"+currentList));
    }
    console.log(all);
    for(var i = all.length-1;i>=1;i--){
        var cb =$("#check_"+all[i]);
        console.log(cb);
        if(cb.prop("checked")){
            var value = JSON.parse(localStorage.getItem("Task#"+all[i]));
            value[STATE] = "DONE";
            localStorage.setItem("Task#"+all[i],JSON.stringify(value));
        }
    }
    showSearchResult();
}