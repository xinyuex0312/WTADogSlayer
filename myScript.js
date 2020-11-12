

//function userInfo(){
//    $.ajax({
//           type: "GET",
//           url: "users.txt",//本地json文件路径
//           dataType: "json",
//           success: function (data) {
//           console.info(data);
//
//           }
//           });
//}
var activityJson;

//set socket status
function setSocketStatus(){
    
    if(ws==null){
        document.getElementById("socketStatus").value = "\u7f51\u7edc\u63a5\u53e3\u672a\u6253\u5f00";
        
        document.getElementById("socketStatus").style.backgroundColor = "#B0C4DE";
    }
    else{
        var status = ws.readyState;
        switch(status){
            case 0:
                document.getElementById("socketStatus").value = "\u7f51\u7edc\u63a5\u53e3\u8fde\u63a5\u4e2d.....";
                
                document.getElementById("socketStatus").style.backgroundColor = "#FF8C00";
                
                break;
            case 1:
                document.getElementById("socketStatus").value = "\u7f51\u7edc\u63a5\u53e3\u5df2\u8fde\u63a5!!";
                
                document.getElementById("socketStatus").style.backgroundColor = "#00FF7F";
                break;
            case 2:
                document.getElementById("socketStatus").value = "\u7f51\u7edc\u63a5\u53e3\u6b63\u5728\u5173\u95ed.....";
                document.getElementById("socketStatus").style.backgroundColor = "#FF4500";
                
                break;
            case 3:
                document.getElementById("socketStatus").value = "\u7f51\u7edc\u63a5\u53e3\u5df2\u5173\u95ed";
                document.getElementById("socketStatus").style.backgroundColor = "#B22222";
                
                break;
            default:
                document.getElementById("socketStatus").value = "\u9519\u8bef";
                break;
        }
    }
    
}

//get date difference
function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    var dateSpan,tempDate,iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
}

function getRealMonth(month){
    return parseInt(month)+1;
}

function getMonth(month){
    return parseInt(month)-1;
}


function mousePosition(ev){
    ev = ev || window.event;
    if(ev.pageX || ev.pageY){
        return {x:ev.pageX, y:ev.pageY};
    }
    return {
    x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y:ev.clientY + document.body.scrollTop - document.body.clientTop
    };
    
}


function window_onload() {
    
    
    console.log("page opened");
    
    loadOptionsOfSelect();
    var tdate = new Date();
    document.getElementById("todayDate").value = tdate.getFullYear()+"-"+getRealMonth(tdate.getMonth())+"-"+tdate.getDate();
    setInterval(setSocketStatus,500);
    
    setInterval(checkLocalTime, 500);
    
    
    
}

function loadOptionsOfSelect(){
    document.getElementById("timeZoneOffsetHour").length = 12;
    for(var i=0;i<12;i++){
        document.getElementById("timeZoneOffsetHour").options[i]=new Option(i,i);
    }
    
    document.getElementById("offsetSeconds").length = 50;
    for(var i=0;i<50;i++){
        document.getElementById("offsetSeconds").options[i]=new Option(i+1,i+1);
    }
}

function getActivityIds(data){
    activityJson = JSON.parse(data);
    
    var tableData = "<tr>";
    
    for(var i=0;i<activityJson.length;i++){
        tableData += "<td name='bstBlock'>"+activityJson[i].buy_start_time+"-"+activityJson[i].buy_end_time+"</td>";
    }
    
    tableData += "</tr><tr>";
    
    for(var i=0;i<activityJson.length;i++){
        tableData += "<td name='priceBlock'>"+activityJson[i].price_min+"-"+activityJson[i].price_max+"</td>";
    }
    
    tableData += "</tr><tr>";
    
    for(var i=0;i<activityJson.length;i++){
        tableData += "<td name='profitBlock'>"+activityJson[i].profit_cycle_show+"</td>";
    }
    
    tableData += "</tr><tr>";
    
    for(var i=0;i<activityJson.length;i++){
        tableData += "<td id='"+i+"label'>"+activityJson[i].activity_id+"</td>";
    }
    
    tableData += "</tr><tr>";
    
    for(var i=0;i<activityJson.length;i++){
        tableData += "<td><input type='radio' name = 'radioSet'  value='"+activityJson[i].activity_id+"' checked='false' onclick='getValue()'></td>"
    }
    
    tableData += "</tr>";
    
    $("#tbody0").html(tableData);
    
    document.getElementById("tableDate").value = activityJson[0].buy_start_time_out.substring(0,10);
}

//get selected activity start time
function getValue(){
    for (var i=0;i<document.getElementsByName("radioSet").length;i++){
        if(document.getElementsByName("radioSet")[i].checked){
            document.getElementById("aid").value = document.getElementsByName("radioSet")[i].value;
            document.getElementById("aid").style.backgroundColor = "#00FF7F";
            document.getElementsByName("bstBlock")[i].style.backgroundColor = "#00FFFF";
            document.getElementsByName("priceBlock")[i].style.backgroundColor = "#00FFFF";
            document.getElementsByName("profitBlock")[i].style.backgroundColor = "#00FFFF";
            document.getElementById(i+"label").style.backgroundColor = "#00FFFF";
            
            if(isSupervised){
                
                
                for(var j=0;j<9;j++){
                    if(j<i){
                        document.getElementsByName("utimeBlock")[j].style.backgroundColor = "#B0C4DE";
                    }
                    else if(j==i){
                        document.getElementsByName("utimeBlock")[j].style.backgroundColor = "#00FFFF";
                    }
                    else{
                        document.getElementsByName("utimeBlock")[j].style.backgroundColor = "#FFFFFF";
                    }
                }
            }
            
            
            cvalue = activityJson[i].buy_start_time;
            console.log(cvalue);
        }
        else{
            document.getElementsByName("bstBlock")[i].style.backgroundColor = "#FFFFFF";
            document.getElementsByName("priceBlock")[i].style.backgroundColor = "#FFFFFF";
            document.getElementsByName("profitBlock")[i].style.backgroundColor = "#FFFFFF";
            document.getElementById(i+"label").style.backgroundColor = "#FFFFFF";
        }
    }
}

function updateActivityIds(){
    
    
    for(var i=0;i<updateDays;i++){
        update();
    }
    
    
    document.getElementById("plus").disabled = true;
    document.getElementById("tableDate").style.backgroundColor = "#00FF7F";
   
}

function update(){
    for(var i=0;i<activityJson.length;i++){
        activityJson[i].activity_id = activityJson[i].activity_id + 9;
        document.getElementsByName("radioSet")[i].value = activityJson[i].activity_id;
        document.getElementById(i+"label").innerHTML = activityJson[i].activity_id;
        //console.log(document.getElementsByName("radioSet")[i].value);
    }
    
    var str = document.getElementById("tableDate").value;
    var tempDate = new Date(str.split("-")[0], getMonth(str.split("-")[1]), str.split("-")[2]);
    
    document.getElementById("tableDate").value = addDate(tempDate, 1);
    console.log(addDate(tempDate, 1));
}

function addDate(date, days){
    var date = new Date(date);
    date.setDate(date.getDate()+days);
    var m = date.getMonth()+1;
    return date.getFullYear()+"-"+m+"-"+date.getDate();
}

var cvalue = null;



var userJson = null;
var ws = null;



function closeSocket(){
    console.log("socket closing");
    ws.close();
    ws.onclose = function(event) {
        console.log("socket closed");
    };
}

var updateDays = null;

function iptTable(){
    var selectedFile = document.getElementById("tablefiles").files[0];//获取读取的File对象
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小ipt
    console.log("filename:"+name+"size:"+size);
    
    var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
    reader.readAsText(selectedFile);//读取文件的内容
    
    reader.onload = function(){
        //activityJson = JSON.parse();
        //console.log(userJson[0].checkId);
        getActivityIds(this.result);
        //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
        
        var tdateString = document.getElementById("tableDate").value;
        var tdate0 = document.getElementById("todayDate").value;
        //var tdate1 = new Date(tdateString.split("-")[0],tdateString.split("-")[1],tdateString.split("-")[2]);
        updateDays = datedifference(tdateString,tdate0)+1;
        
    };
    
    
    
    
}

function ipt(){
    var selectedFile = document.getElementById("files").files[0];
    var name = selectedFile.name;
    var size = selectedFile.size;
    console.log("filename:"+name+"size:"+size);
    
    var reader = new FileReader();
    reader.readAsText(selectedFile);
    
    reader.onload = function(){
        userJson = JSON.parse(this.result);
        console.log(userJson[0].checkId);
        creatTable(userJson);
        
        
    };
    
}

function generateSelectCodeToString(id){
    var s = "<td id = '"+id+"activity0block'><input type='checkbox' id='"+id+"activity0'/></td>";
    s += "<td id = '"+id+"activity1block'><input type='checkbox' id='"+id+"activity1'/></td>";
    s += "<td id = '"+id+"activity2block'><input type='checkbox' id='"+id+"activity2'/></td>";
    s += "<td id = '"+id+"activity3block'><input type='checkbox' id='"+id+"activity3'/></td>";
    s += "<td id = '"+id+"activity4block'><input type='checkbox' id='"+id+"activity4'/></td>";
    s += "<td id = '"+id+"activity5block'><input type='checkbox' id='"+id+"activity5'/></td>";
    s += "<td id = '"+id+"activity6block'><input type='checkbox' id='"+id+"activity6'/></td>";
    s += "<td id = '"+id+"activity7block'><input type='checkbox' id='"+id+"activity7'/></td>";
    s += "<td id = '"+id+"activity8block'><input type='checkbox' id='"+id+"activity8'/></td>";
    
    return s;
}




function creatTable(data){
    //import users json data
    
    var tableData="<tr><td>\u6807\u7b7e</td><td>userID</td><td>Info</td><td name='utimeBlock'>1400</td><td name='utimeBlock'>1500</td><td name='utimeBlock'>1630</td><td name='utimeBlock'>1700</td><td name='utimeBlock'>1730</td><td name='utimeBlock'>1930</td><td name='utimeBlock'>2000</td><td name='utimeBlock'>2030</td><td name='utimeBlock'>2100</td><td>\u662f\u5426\u62a2\u72d7</td><td>\u670d\u52a1\u5668\u56de\u590d</td><td>\u62a2\u72d7\u7ed3\u679c</td><td>\u524d\u6b21\u7ed3\u679c</td>"
    
    //add td dynamicly
    for(var i=0;i<data.length;i++){
        tableData+="<tr><td id = 'userBlock"+i+"'>"+data[i].tag+"</td>"+"<td>"+data[i].userId+"</td><td><input type = 'text' name='infoMes'>"+"</td>"+generateSelectCodeToString(i)+"<td><input id="+"'"+i+"check"+"'"+" type='checkbox' value=''/></td>"+"<td><input id="+"'"+i+"result"+"'"+" type='text' value='' readonly='readonly' /></td>"+"<td><input id="+"'"+i+"cmessage"+"'"+" type='text' value='' readonly='readonly' /></td><td><input id = '"+i+"lastResult' type = 'text' readonly='true'>"+"</tr>"
    }
    
    tableData+="</tr>"
    
    //generate table
    $("#tbody1").html(tableData)
    
    for(var i=0;i<data.length;i++){
        
        for(var j=0;j<9;j++){
            
            
            document.getElementById(i+"activity"+j+"block").onmouseover = function(e){
                var timeTip;
                switch(this.id.split("activity")[1].split("block")[0]){
                    case "0":timeTip="14:00";break;
                    case "1":timeTip="15:00";break;
                    case "2":timeTip="16:30";break;
                    case "3":timeTip="17:00";break;
                    case "4":timeTip="17:30";break;
                    case "5":timeTip="19:30";break;
                    case "6":timeTip="20:00";break;
                    case "7":timeTip="20:30";break;
                    case "8":timeTip="21:00";break;
                    default: timeTip="error";break;
                }
                showTip(data[parseInt(this.id.split("activity")[0])].tag+"    "+timeTip);
                
            };
            document.getElementById(i+"activity"+j+"block").onmouseout = function(){closeTip()};
            
            document.getElementById("userBlock"+i).onmouseover = function(){
                var tempInfoStr = "";
                for(var p in getUserActivityList().split(";")[this.id.split("userBlock")[1]].split(":")[1].split(",")){
                    switch(getUserActivityList().split(";")[this.id.split("userBlock")[1]].split(":")[1].split(",")[p]){
                        case "0":tempInfoStr+="14:00   ";break;
                        case "1":tempInfoStr+="15:00   ";break;
                        case "2":tempInfoStr+="16:30   ";break;
                        case "3":tempInfoStr+="17:00   ";break;
                        case "4":tempInfoStr+="17:30   ";break;
                        case "5":tempInfoStr+="19:30   ";break;
                        case "6":tempInfoStr+="20:00   ";break;
                        case "7":tempInfoStr+="20:30   ";break;
                        case "8":tempInfoStr+="21:00   ";break;
                        default: tempInfoStr+="";break;
                    }
                }
                if(tempInfoStr==""){
                    tempInfoStr = "   /";
                }
                showTip(userJson[this.id.split("userBlock")[1]].tag+":    "+ tempInfoStr);
            };
            document.getElementById("userBlock"+i).onmouseout = function(){closeTip()};
        }
        
    }
}

function showTip(tip){
    var div3 = document.getElementById('div3'); //将要弹出的层
    div3.style.display="block"; //div3初始状态是不可见的，设置可为可见
    //window.event代表事件状态，如事件发生的元素，键盘状态，鼠标位置和鼠标按钮状.
    //clientX是鼠标指针位置相对于窗口客户区域的 x 坐标，其中客户区域不包括窗口自身的控件和滚动条。
    div3.style.left=event.pageX+10; //鼠标目前在X轴上的位置，加10是为了向右边移动10个px方便看到内容
    div3.style.top=event.pageY+5;
    div3.style.position="absolute"; //必须指定这个属性，否则div3层无法跟着鼠标动
    div3.style.backgroundColor="#33FFF5";
    div3.innerHTML=tip;
}

function closeTip(){
    var div3 = document.getElementById('div3');
    div3.style.display="none";
}




function getIndex(id, data){
    var jdata = JSON.parse(data);
    for(var i=0;i<jdata.length;i++){
        if(jdata[i].userId==id){
            return i;
        }
        
    }
}

function socketLink(){
    
    
    ws.onopen = function(){
        //console.log("connection succeed");
    }
    
    ws.onmessage = function(e){
        //console.log(e.data);
    }
}

function confirmMessageTostring(cmessage){
    var pstring = cmessage.split("_")[0];
    switch(pstring){
        case "": return "\u7b49\u5f85\u4e2d..."; break;
        case "1": return "\u6210\u529f!"; break;
        case "2": return "\u5931\u8d25"; break;
        default: return cmessage; break;
    }
}

function confirmMessageToColor(cmessage){
    var pstring = cmessage.split("_")[0];
    switch(pstring){
        case "": return "#FF8C00"; break;
        case "1": return "#00FF7F"; break;
        case "2": return "#B22222"; break;
        default: return cmessage; break;
    }
}

function qgMessageToColor(qgMessage){
    if(qgMessage=="ok"){
        return "#00FF7F";
    }
    else{
        return "#FFF5EE";
    }
}

function qg(activityId, userId, checkId, queueGroup){
    
    
    
    if(ws.readyState!=1){
        console.log(ws.readyState);
        socketLink();
    }
    else{
        ws.send(activityId+","+userId+","+queueGroup+","+0+","+1+","+1+","+checkId);
        //console.log(activityId+","+userId+","+0+","+0+","+1+","+1+","+checkId);
        ws.onmessage = function(e){
            console.log(e.data);
            
            //tempMessage = e.data;
            if(e.data.indexOf("_")==-1){
                
                for(var i=0;i<userJson.length;i++){
                    if(document.getElementById(i+"check").checked){
                        document.getElementById(i+"result").value = e.data;
                        document.getElementById(i+"result").style.backgroundColor = qgMessageToColor(e.data);
                    }
                }
                //document.getElementById(getIndex(userId, JSON.stringify(userJson))+"result").value = e.data;
            }
            else{
                for(var i=0;i<userJson.length;i++){
                    if(userJson[i].userId == e.data.split(",")[1]){
                        document.getElementById(i+"cmessage").value = confirmMessageTostring(e.data);
                        document.getElementById(i+"cmessage").style.backgroundColor = confirmMessageToColor(e.data);
                    }
                }
            }
            
            $("#logArea").append(userId+"_messageReceived:"+e.data);
            //setFocusLast(document.getElementById("logArea"));
            
            
        }
    }
    
}



function cx(activityId, userId){
    if(ws.readyState!=1){
        console.log(ws.readyState);
        socketLink();
    }
    else{
        ws.send(activityId+","+userId);
        ws.onmessage = function(e){
            console.log(userId+"_messageReceived:"+e.data);
            
            
            for(var i=0;i<userJson.length;i++){
                if(userJson[i].userId == e.data.split(",")[1]&&e.data.indexOf("_")!=-1){
                    document.getElementById(i+"cmessage").value = confirmMessageTostring(e.data);
                    document.getElementById(i+"cmessage").style.backgroundColor = confirmMessageToColor(e.data);
                }
            }
            
            
            
            //document.getElementById(getIndex(userId, JSON.stringify(userJson))+"cmessage").value = e.data;
            
            //$("#logArea").append(userId+"_messageReceived:"+e.data);
            //setFocusLast(document.getElementById("logArea"));
        }
        
        
    }
}

function checkDog(activityId, userId){
    if(ws.readyState!=1){
        console.log(ws.readyState);
        socketLink();
        
        
    }
    else{
        ws.send(activityId+","+userId);
        ws.onmessage = function(e){
            console.log(userId+"_messageReceived:"+e.data);
            
            if(e.data.split("_")[0]==1){
                number = number + 1;
            }
            
            
//            for(var i=0;i<userJson.length;i++){
//                if(userJson[i].userId == e.data.split(",")[1]&&e.data.indexOf("_")!=-1){
//                    document.getElementById(i+"cmessage").value = confirmMessageTostring(e.data);
//                    document.getElementById(i+"cmessage").style.backgroundColor = confirmMessageToColor(e.data);
//                }
//            }
            
            
            
            //document.getElementById(getIndex(userId, JSON.stringify(userJson))+"cmessage").value = e.data;
            
            //$("#logArea").append(userId+"_messageReceived:"+e.data);
            //setFocusLast(document.getElementById("logArea"));
        }
        
        
    }
}
var number = 0;

function addNumberOfDog(){
    
    if(ws==null){
        ws = new WebSocket("ws://203.107.42.6:2000");
    }
    
//    for(var i=0;i<1000;i++){
//
//        number +=checkDog(2204,i);
//    }
    var i=24673; // from 21000
    
    setInterval(function(){
                checkDog(2204,i);
                document.getElementById("number").value = number;
                i = i+1;
                },200);
    
    
    
}

function Slayer(){
    
    
    for(var i=0;i<userJson.length;i++){
        if(document.getElementById(i+"check").checked){
            qg(document.getElementById("aid").value, userJson[i].userId, document.getElementsByName("infoMes")[i].value.split("+")[12].substring(1,33), document.getElementsByName("infoMes")[i].value.split("+")[4]);
        }
    }
}

function Checker(){
    for(var i=0;i<userJson.length;i++){
        if(document.getElementById(i+"check").checked){
            cx(document.getElementById("aid").value, userJson[i].userId);
        }
    }
}

//changing

//function reconnect(){
//    if(ws.readyState!=1){
//        ws = null;
//        ws = new WebSocket("ws://203.107.42.6:2000");
//    }
//}

//changing

var isStop = false;

function sendSlayer(){
    
    document.getElementById("doo").disabled = true;
    
    document.getElementById("reset").disabled = false;
    
    for(var i=0;i<userJson.length;i++){
        if(!document.getElementById(i+"check").checked&&document.getElementById(i+"result").value!=""){
            document.getElementById(i+"result").style.backgroundColor = "#B0C4DE";
        }
    }
    
    isStop = false;
    if(ws==null){
        ws = new WebSocket("ws://203.107.42.6:2000");
        ws.onclose=function(e){
            ws = null;
            countConnectionTime = 0;
        };
        
        
    }
    var interval = setInterval(function(){
                               if(isStop||ws==null){
                               clearInterval(interval);
                               reset();
                               
                               if(ws!=null){
                                    ws.close();
                               }
                               //ws = null;
                               }
                               else{
                               //console.log("slayered");
                               Slayer();
                               }
                
                
                },500);
    
   
}

function sendChecker(){
    
    document.getElementById("doc").disabled = true;
    document.getElementById("reset").disabled = false;
    
    for(var i=0;i<userJson.length;i++){
        if(!document.getElementById(i+"check").checked&&document.getElementById(i+"cmessage").value!=""){
            document.getElementById(i+"cmessage").style.backgroundColor = "#B0C4DE";
        }
    }
    
    isStop = false;
    if(ws==null){
        ws = new WebSocket("ws://203.107.42.6:2000");
        ws.onclose=function(e){
            ws = null;
            countConnectionTime = 0;
        };
    }
    
    var interval = setInterval(function(){
                               if(isStop||ws==null){
                               clearInterval(interval);
                               reset();
                               if(ws!=null){
                                    ws.close();
                               }
                               
                               //ws = null;
                               }
                               else{
                               
                               Checker();
                               }
                               
                               
                               },1000);
    
    
}


function reset(){
    isStop = true;
    
    document.getElementById("doo").disabled = false;
    document.getElementById("doc").disabled = false;
    document.getElementById("reset").disabled = true;
    
    if(ws!=null&&ws.readyState==3){
        ws = null;
    }
}




//         重
//         写
//         时间匹配
//         方法，用小时分钟拆分成秒的的计算方法，加入提前分钟数
function isTimeMatched(date, chosedtime, offsetSeconds, offsetMinutes){
    var currentHour = date.getHours();
    var currentMinutes = date.getMinutes();
    var currentSeconds = date.getSeconds();
    
    var timeZoneOffset;
    
        switch(document.getElementById("timeZoneOffsetType").value){
            case "plus":
                timeZoneOffset = parseInt(document.getElementById("timeZoneOffsetHour").value);
                break;
            case "minus":
                timeZoneOffset = -parseInt(document.getElementById("timeZoneOffsetHour").value);
                break;
            default:
                timeZoneOffset = null;
                alert("timeZoneOffset Error");
        }
    
    var chosedHour = parseInt(chosedtime.split(":")[0]);
    var chosedMinutes = parseInt(chosedtime.split(":")[1]);
    
    var currentTimeInSeconds = currentHour*3600+currentMinutes*60+currentSeconds;
    
    var chosedTimeInSeconds = (chosedHour+timeZoneOffset)*3600+chosedMinutes*60;
    
    var offsetInSeconds = offsetMinutes*60+offsetSeconds;
    
    if(currentTimeInSeconds>=chosedTimeInSeconds+offsetInSeconds){
        return true;
    }
    else{
        return false;
    }
}



function checkLocalTime(){
    var currentDate = new Date();
    //console.log(currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds());
    
    document.getElementById("ctime").innerHTML = currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds();
    

    
    
}

function checkMessagesFromServer(){
    var isAllOk = true;
    for(var i=0;i<userJson.length;i++){
        if(document.getElementById(i+"check").checked&&document.getElementById(i+"result").value!="ok"){
            isAllOk = false;
        }
        
    }
    
    return isAllOk;
}

function checkConfirmMessage(){
    var isAllOk = true;
    for(var i=0;i<userJson.length;i++){
        if(document.getElementById(i+"check").checked){
        if(document.getElementById(i+"cmessage").value!="\u6210\u529f!"&&document.getElementById(i+"cmessage").value!="\u5931\u8d25"){
                isAllOk = false;
            }
            
        }
        
        
        
    }
    
    return isAllOk;
}

var isSetTime = false;

var countConnectionTime = 0;

var waitingSecond = 0;

//auto dog slayer executor
function autoExecutor(){
    
    if(checkMessagesFromServer()){
        if(checkConfirmMessage()){
            
            
            for(var i=0;i<userJson.length;i++){
                
                if(document.getElementById(i+"lastResult").value!=""){
                    document.getElementById(i+"lastResult").style.backgroundColor = "#B0C4DE";
                }
                
                if(document.getElementById(i+"cmessage").value=="\u6210\u529f!"||document.getElementById(i+"cmessage").value=="\u5931\u8d25"){
                    document.getElementById(i+"lastResult").value = cvalue + document.getElementById(i+"cmessage").value;
                }
                
                
                if(document.getElementById(i+"lastResult").value==cvalue+"\u6210\u529f!"){
                    document.getElementById(i+"lastResult").style.backgroundColor = confirmMessageToColor("1");
                    document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#00FF7F";
                }
                else if(document.getElementById(i+"lastResult").value==cvalue+"\u5931\u8d25"){
                    document.getElementById(i+"lastResult").style.backgroundColor = confirmMessageToColor("2");
                    document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#B22222";
                }
            
            }
            
            stopAutoSlayer();
            
            waitingSecond = 0;
            
            for(var i=0;i<activityJson.length;i++){
                if(document.getElementsByName("radioSet")[i].checked){
                    sActivityIndex = i+1;
                    
                }
            }
            document.getElementsByName("radioSet")[sActivityIndex].click();
            
            
        }
        else{
            
            var dateForWait = new Date();
            
            var timeOffsetSeconds;
            var timeOffsetMinutes;
            switch(document.getElementById("offsetType").value){
                case "before":
                    timeOffsetSeconds = -parseInt(document.getElementById("offsetSeconds").value);
                    timeOffsetMinutes = -parseInt(document.getElementById("offsetMinutes").value);
                    break;
                case "after":
                    timeOffsetSeconds = parseInt(document.getElementById("offsetSeconds").value);
                    timeOffsetMinutes = parseInt(document.getElementById("offsetMinutes").value);
                    break;
                default:
                    timeOffset = null;
                    alert("error");
                    break;
            }
            
            

            if(isTimeMatched(dateForWait, cvalue, timeOffsetSeconds, timeOffsetMinutes+12)){
                
                for(var i=0;i<userJson.length;i++){
                    
                    if(document.getElementById(i+"lastResult").value!=""){
                        document.getElementById(i+"lastResult").style.backgroundColor = "#B0C4DE";
                    }
                    
                    if(document.getElementById(i+"cmessage").value=="\u6210\u529f!"||document.getElementById(i+"cmessage").value=="\u5931\u8d25"||document.getElementById(i+"cmessage").value=="\u7b49\u5f85\u4e2d..."){
                        document.getElementById(i+"lastResult").value = cvalue + document.getElementById(i+"cmessage").value;
                    }
                    
                    
                    if(document.getElementById(i+"lastResult").value==cvalue+"\u6210\u529f!"){
                        document.getElementById(i+"lastResult").style.backgroundColor = confirmMessageToColor("1");
                        document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#00FF7F";
                    }
                    else if(document.getElementById(i+"lastResult").value==cvalue+"\u5931\u8d25"){
                        document.getElementById(i+"lastResult").style.backgroundColor = confirmMessageToColor("2");
                        document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#B22222";
                    }
                    else if(document.getElementById(i+"lastResult").value==cvalue+"\u7b49\u5f85\u4e2d..."){
                        document.getElementById(i+"lastResult").style.backgroundColor = confirmMessageToColor("");
                        document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#FF8C00";
                    }
                    
                }
                
                stopAutoSlayer();
                
                
                
                waitingSecond = 0;
                
                for(var i=0;i<activityJson.length;i++){
                    if(document.getElementsByName("radioSet")[i].checked){
                        sActivityIndex = i+1;
                        
                    }
                }
                document.getElementsByName("radioSet")[sActivityIndex].click();
                
               
            }
            else{
                if(ws == null){
                    sendSlayer();
                    sendChecker();
                }
                else{
                    
                    if(document.getElementById("doc").disabled==false){
                        sendChecker();
                    }
                    
                    if(ws.readyState==0){
                        countConnectionTime += 1;
                        console.log("waiting for: "+countConnectionTime+"c");
                        if(countConnectionTime>5){
                            reset();
                            countConnectionTime = 0;
                        }
                    }
                    
                }
            }
            
            
        }
    }
    
    else{
        if(ws == null){
            sendSlayer();
        }
        else{
            
            if(ws.readyState==0){
                countConnectionTime += 1;
                console.log("waiting for: "+countConnectionTime+"c");
                if(countConnectionTime>5){
                    reset();
                    countConnectionTime = 0;
                }
            }
            
        }
        
    }
    
    
}


function autoSlayer(){
    var date = new Date();
    
    var timeOffsetSeconds;
    var timeOffsetMinutes;
    switch(document.getElementById("offsetType").value){
        case "before":
            timeOffsetSeconds = -parseInt(document.getElementById("offsetSeconds").value);
            timeOffsetMinutes = -parseInt(document.getElementById("offsetMinutes").value);
            break;
        case "after":
            timeOffsetSeconds = parseInt(document.getElementById("offsetSeconds").value);
            timeOffsetMinutes = parseInt(document.getElementById("offsetMinutes").value);
            break;
        default:
            timeOffset = null;
            alert("error");
            break;
    }
    
    
    
    if(isTimeMatched(date, cvalue,timeOffsetSeconds, timeOffsetMinutes)){
        
        isSetTime = true;
        
    }
    
    if(isSetTime){
        autoExecutor();
    }
    else{
        clearAllMessages();
        if(ws!=null){
            reset();
            
        }
        
    }
    
    console.log("auto...");
}

var isAuto = false;

function clearMessages(){
    for(var i=0;i<userJson.length;i++){
        if(document.getElementById(i+"check").checked){
            document.getElementById(i+"result").value = "";
            document.getElementById(i+"result").style.backgroundColor="#FFFFFF";
            document.getElementById(i+"cmessage").value = "";
            document.getElementById(i+"cmessage").style.backgroundColor="#FFFFFF";
        }
        else{
            if(document.getElementById(i+"result").value != ""){
                document.getElementById(i+"result").style.backgroundColor="#B0C4DE";
            }
            if(document.getElementById(i+"cmessage").value != ""){
                document.getElementById(i+"cmessage").style.backgroundColor="#B0C4DE";
            }
            
            
        }
        
    }
}

function sendAutoSlayer(){
    
    isAuto = true;
    
    document.getElementById("autoOn").disabled = true;
    document.getElementById("autoOff").disabled = false;
    
    document.getElementById("autoMessage").innerHTML = "\u81ea\u52a8\u6267\u884c\u8005\u5de5\u4f5c\u4e2d..."+getCountdownString();
    document.getElementById("autoMessage").style.backgroundColor = "#00FF7F";
    
    clearMessages();
    
    var interval = setInterval(function(){
                               if(isAuto){
                               document.getElementById("autoMessage").innerHTML = "\u81ea\u52a8\u6267\u884c\u8005\u5de5\u4f5c\u4e2d..."+getCountdownString();
                               autoSlayer();
                               
                               }
                               else{
                               clearInterval(interval);
                               reset();
                               }
                               },500);
    
 
}

function clearAllMessages(){
    for(var i=0;i<userJson.length;i++){
        document.getElementById(i+"result").value = "";
        document.getElementById(i+"result").style.backgroundColor = "#FFFFFF";
        document.getElementById(i+"cmessage").value = "";
        document.getElementById(i+"cmessage").style.backgroundColor = "#FFFFFF";
    }
}

function stopAutoSlayer(){
    isAuto = false;
    isSetTime = false;
    
    document.getElementById("autoMessage").innerHTML = "\u81ea\u52a8\u6267\u884c\u8005\u5df2\u505c\u6b62";
    document.getElementById("autoMessage").style.backgroundColor = "#B0C4DE";

    
    
    document.getElementById("autoOn").disabled = false;
    document.getElementById("autoOff").disabled = true;
    
    reset();
    
    clearAllMessages();
    
    console.log("auto stop");
}

//get countdown string
function getCountdownString(){
    var date = new Date();
    
    
    var timeOffsetSeconds;
    var timeOffsetMinutes;
    switch(document.getElementById("offsetType").value){
        case "before":
            timeOffsetSeconds = -parseInt(document.getElementById("offsetSeconds").value);
            timeOffsetMinutes = -parseInt(document.getElementById("offsetMinutes").value);
            break;
        case "after":
            timeOffsetSeconds = parseInt(document.getElementById("offsetSeconds").value);
            timeOffsetMinutes = parseInt(document.getElementById("offsetMinutes").value);
            break;
        default:
            timeOffset = null;
            alert("error");
            break;
    }
    
    var timeZoneOffset;
    switch(document.getElementById("timeZoneOffsetType").value){
        case "plus":
            timeZoneOffset = parseInt(document.getElementById("timeZoneOffsetHour").value);
            break;
        case "minus":
            timeZoneOffset = -parseInt(document.getElementById("timeZoneOffsetHour").value);
            break;
        default:
            timeZoneOffset = null;
            alert("timeZoneOffset Error");
    }
    
    var cseconds = parseInt(date.getHours())*3600 + parseInt(date.getMinutes())*60 + parseInt(date.getSeconds());
    var sseconds = (parseInt(cvalue.split(":")[0])+timeZoneOffset)*3600 + (parseInt(cvalue.split(":")[1])+timeOffsetMinutes)*60 + timeOffsetSeconds;
    
    var h = Math.floor((sseconds-cseconds)/3600);
    var m = Math.floor((sseconds-cseconds)%3600/60);
    var s = Math.floor((sseconds-cseconds)%3600%60);
    
    if(sseconds>cseconds){
        if(h>0){
            return h+"\u5c0f\u65f6"+m+"\u5206"+s+"\u79d2"+"\u540e\u6267\u884c";
        }
        else{
            if(m>0){
                return m+"\u5206"+s+"\u79d2"+"\u540e\u6267\u884c";
            }
            else{
                return s+"\u79d2"+"\u540e\u6267\u884c";
            }
        }
        
    }
    else{
        return "---\u6267\u884c\u4e2d---";
    }
}

sActivityIndex = null;

isSupervised = false;


function sendSupervisor(){
    
    //getUserAcitvityListWindow();
    
    isSupervised = true;
    
    document.getElementById("supervisorOn").disabled = true;
    document.getElementById("supervisorOff").disabled = false;
    
    if(document.getElementById("plus").disabled==false){
        updateActivityIds();
    }
    
    var timeZoneOffset;
    switch(document.getElementById("timeZoneOffsetType").value){
        case "plus":
            timeZoneOffset = -parseInt(document.getElementById("timeZoneOffsetHour").value);
            break;
        case "minus":
            timeZoneOffset = parseInt(document.getElementById("timeZoneOffsetHour").value);
            break;
        default:
            timeZoneOffset = null;
            alert("timeZoneOffset Error");
    }
    
    var startActivity = null;
    
    var date = new Date();
    switch(date.getHours()+timeZoneOffset){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
            startActivity = 0;
            break;
        case 14:
            startActivity = 1;
            break;
        case 15:
            startActivity = 2;
            break;
        case 16:
            if(date.getMinutes()<30){
                startActivity = 2;
            }
            else{
                startActivity = 3;
            }
            break;
        case 17:
            if(date.getMinutes()<30){
                startActivity = 4;
            }
            else{
                startActivity = 5;
            }
            break;
        case 18:
            startActivity = 5;
            break;
        case 19:
            if(date.getMinutes()<30){
                startActivity = 5;
            }
            else{
                startActivity = 6;
            }
            break;
        case 20:
            if(date.getMinutes()<30){
                startActivity = 7;
            }
            else{
                startActivity = 8;
            }
            break;
        default:
            startActivity = null;
            break;
            
    }
    
    console.log(date.getHours()+timeZoneOffset);
    
    sActivityIndex = startActivity;
    
    document.getElementsByName("radioSet")[sActivityIndex].click();
    
    
    
    var interval = setInterval(function(){
                               
                if(isSupervised){
                    setSelectedBlockColor();
                    supervisor();
                    
                }
                else{
                    clearInterval(interval);
                }
                },5000);
    
    
    document.getElementById("supervisorLog").innerHTML = "---\u6258\u7ba1\u4e2d---";
    document.getElementById("supervisorLog").style.backgroundColor = "#00FFFF";
}

function setSelectedBlockColor(){
    for(var i=0;i<userJson.length;i++){
        for(var j=0;j<9;j++){
            if(document.getElementById(i+"activity"+j).checked){
            if(document.getElementById(i+"activity"+j+"block").style.backgroundColor!="rgb(0, 255, 127)"&&document.getElementById(i+"activity"+j+"block").style.backgroundColor!="rgb(178, 34, 34)"&&document.getElementById(i+"activity"+j+"block").style.backgroundColor!="rgb(255, 140, 0)"){
                    document.getElementById(i+"activity"+j+"block").style.backgroundColor="#00FFFF";
                    
                }
                
            }
            else{
                document.getElementById(i+"activity"+j+"block").style.backgroundColor="#D8D8D8";
            }
        }
    }
}

function stopSupervisor(){
    isSupervised = false;
    document.getElementById("supervisorOn").disabled = false;
    document.getElementById("supervisorOff").disabled = true;
    
    document.getElementById("supervisorLog").innerHTML = "\u6258\u7ba1\u505c\u6b62";
    document.getElementById("supervisorLog").style.backgroundColor = "#B0C4DE";
}

function setActivityToPool(){
    
    if(!document.getElementsByName("radioSet")[sActivityIndex].checked){
        document.getElementsByName("radioSet")[sActivityIndex].click;
    }
    var isEmpty = true;
    for(var i=0;i<userJson.length;i++){
        if(document.getElementById(i+"activity"+sActivityIndex).checked){
            isEmpty = false;
        }
        
    }
    
    
    if(!isEmpty){
        for(var i=0;i<userJson.length;i++){
            if(document.getElementById(i+"activity"+sActivityIndex).checked){
                if(!document.getElementById(i+"check").checked){
                    document.getElementById(i+"check").click();
                }
            }
            else{
                if(document.getElementById(i+"check").checked){
                    document.getElementById(i+"check").click();
                }
            }
        }
    }
    else{
        sActivityIndex += 1;
        document.getElementsByName("radioSet")[sActivityIndex].click();
    }
    
    
}

function supervisor(){
    
    setActivityToPool();
    
    if(!document.getElementById("autoOn").disabled){
        sendAutoSlayer();
    }
    
}

function getUserActivityList(){
    var s = "";
    for(var i=0;i<userJson.length;i++){
        s += userJson[i].userId+":";
        for(var j=0;j<9;j++){
            if(document.getElementById(i+"activity"+j).checked){
                s += j+",";
            }
        }
        s += ";";
    }
    
    return s;
}

function loadUserActivityList(s){
    var usersList = s.split(";");
    for(var i=0;i<usersList.length;i++){
        for(var k=0;k<userJson.length;k++){
            if(userJson[k].userId==usersList[i].split(":")[0]){
                for(var a=0;a<usersList[i].split(":")[1].split(",").length-1;a++){
                    if(!document.getElementById(k+"activity"+usersList[i].split(":")[1].split(",")[a]).checked){
                        document.getElementById(k+"activity"+usersList[i].split(":")[1].split(",")[a]).click();
                    }
                }
            }
        }
    }
}

var isScan = false;

function scanResults(){
    isScan = true;
    setSelectedBlockColor();
    
    sActivityIndex = 0;
    
    var checkedc = 0;
    
    var interval = setInterval(function(){
                               
                               if(isScan){
                               for(var i=0;i<9;i++){
                               if(document.getElementsByName("radioSet")[i].checked){
                               sActivityIndex = i;
                               }
                               }
                               
                               setActivityToPool();
                               
                               if(ws==null){
                               sendChecker();
                               }
                               
                               for(var i=0;i<userJson.length;i++){
                               if(document.getElementById(i+"check").checked&&document.getElementById(i+"cmessage").value!=""){
                               
                               switch(document.getElementById(i+"cmessage").value){
                               case "\u7b49\u5f85\u4e2d...":
                               document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#FF8C00";
                               break;
                               case "\u6210\u529f!":
                               document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#00FF7F";
                               break;
                               case "\u5931\u8d25":
                               document.getElementById(i+"activity"+sActivityIndex+"block").style.backgroundColor = "#B22222";
                               break;
                               default : break;
                               }
                               
                               }
                               }
                               
                               clearAllMessages;
                               }
                               else{
                               clearInterval(interval);
                               }
                               
 
                               },2000);
    
}



function stopScan(){
    isScan = false;
    reset();
    clearAllMessages();
}

function getExpectedBill(list){
    var tempList = list.split(";");
    
    var minBill = 0;
    var maxBill = 0;
    
    
    
    for(var i=0;i<tempList.length;i++){
        
        if(tempList[i].split(":").length>1&&tempList[i].split(":")[0]!="281190"&&tempList[i].split(":")[0]!="279258"&&tempList[i].split(":")[0]!="327596"&&tempList[i].split(":")[0]!="2716"&&tempList[i].split(":")[0]!="347673"&&tempList[i].split(":")[0]!="415747"&&tempList[i].split(":")[0]!="15377"&&tempList[i].split(":")[0]!="2052"){
            for(var j=0;j<tempList[i].split(":")[1].split(",").length;j++){
                switch(tempList[i].split(":")[1].split(",")[j]){
                    case "0": minBill += 901*0.125*0.15; maxBill += 2500*0.125*0.15; break;
                    case "1": minBill += 100*0.21*0.15; maxBill += 300*0.21*0.15; break;
                    case "2": minBill += 301*0.09*0.15; maxBill += 900*0.09*0.15; break;
                    case "3": minBill += 6001*0.4*0.15; maxBill += 15000*0.4*0.15; break;
                    case "4": minBill += 901*0.21*0.15; maxBill += 2500*0.21*0.15; break;
                    case "5": minBill += 301*0.15*0.15; maxBill += 900*0.15*0.15; break;
                    case "6": minBill += 901*0.05*0.15; maxBill += 2500*0.05*0.15; break;
                    case "7": minBill += 2501*0.14*0.15; maxBill += 6000*0.14*0.15; break;
                    case "8": minBill += 2501*0.18*0.15; maxBill += 6000*0.18*0.15; break;
                }
            }
        }
        
        
    }
    
    return {max:Math.floor(maxBill), min:Math.floor(minBill)};
    
}


