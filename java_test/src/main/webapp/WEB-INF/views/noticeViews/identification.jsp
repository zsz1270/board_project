<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page contentType = "text/html;charset=utf-8" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>업무관리시스템</title>
	<style type="text/css">
		.contents{
			width:500px;
			height:700px;
			position:absolute;
			left:30%;
		}
		#privateBottom{
			margin:5px 0 0 0;
			width:50%;
			border:1px solid;
			background-color:#EDEDED;
			text-align:center;
		}
		table {
		    width:50%;
			border:1px solid #444444;
			border-collapse: collapse;
		}
		 th, td {
			border:1px solid #444444;
			padding:10px;
		}
		#btnCheck{
			background-color:#6297D5;
			color:white;
			width:80px;
			height:30px;
			border-radius:3px;
		}
		#btnCancel{
			background-color:#BEBEBE;
			color:white;
			width:80px;
			height:30px;
			border-radius:3px;
		}
		.txtBox{
			width:100%; 
			border:0;
			outline:none;
		}
	</style>
</head>
<script>
	window.onload = function(){
		var key = "<c:out value='${key}'/>"; 
		var flag = ${flag}
		console.log(flag);
		
		// 수정 본인인증 판단 후
		if (flag == true && key == 2) {
			alert("수정 본인 인증 성공")
			window.opener.name = "editContent"; // 부모창의 이름 설정
		    document.identify.target = "editContent"; // 타켓을 부모창으로 설정
		    document.identify.key.value = key;
		    document.identify.con_no.value = "${boardInfo.get('con_no')}";
		    document.identify.con_title.value = "${boardInfo.get('con_title')}";
		    document.identify.con_txt.value = "${boardInfo.get('con_txt')}";
		    document.identify.action = "/mytest/noticeViews/editContent.do";
		    document.identify.method = "POST"
		    document.identify.submit();
		    self.close();
		}
		// 삭제 본인인증 판단 후
		else if (flag == true && key == 3) {
			alert("삭제 본인 인증 성공")
			window.opener.name = "deleteContent"; // 부모창의 이름 설정
		    document.identify.target = "deleteContent"; // 타켓을 부모창으로 설정
		    document.identify.key.value = key;
		    document.identify.con_no.value = "${boardInfo.get('con_no')}";
		    document.identify.action = "/mytest/noticeViews/delete.do";
		    document.identify.method = "POST"
		    document.identify.submit();
		    self.close();
		}
		else if (flag == false) { 
			alert("본인 인증 실패")
			window.close();
		}
	};
	// 수정 본인인증
	var submit = function(con_no) {
		
		var form =  document.beforeIdentify;
		form.key.value = 2;
		form.con_no.value = "${boardInfo.get('con_no')}";
		form.con_title.value = "${boardInfo.get('con_title')}";
		form.con_txt.value = "${boardInfo.get('con_txt')}";
		form.submit();
	};
	// 삭제 본인인증
	var del = function(con_no) {
		var choice = confirm("해당 게시물 정말 삭제 하시겠습니까?");
		
		if(choice){
			var form =  document.beforeIdentify;
			form.key.value = 3;
			form.con_no.value = "${boardInfo.get('con_no')}"
			form.submit();
		}
		else {
			alert('삭제가 취소되었습니다.');
			windeo.close();
		}
	};
</script>
<body>
	<div class="contents">
		<div id="privateHead">
			<c:if test="${boardInfo.get('key') eq 2}">
				<h2>수정 본인확인</h2>
			</c:if>
			<c:if test="${boardInfo.get('key') eq 3}">
				<h2>삭제 본인확인</h2>
			</c:if>
		</div>
		<form name="beforeIdentify" action="/mytest/noticeViews/checkIdentify.do" method="POST"> <!-- 본인인증 하기 전 -->
			<div id="privateMain">
			<table>
				<tr>
					<td style="background-color:#EDEDED;">ID</td>
					<td><input type="text" name="con_id" class="txtBox" maxlength="10" placeholder="user name"></td>
				</tr>
				<tr>
					<td style="background-color:#EDEDED;">PW</td>
					<td><input type="password" name="con_password" class="txtBox" maxlength="10" placeholder="＊＊＊＊"></td>
				</tr>
			</table>
		</div>
			<!-- 수정페이지에 전달하기 위해 사용 -->
			<input type="hidden" name="con_no"/>	
			<input type="hidden" name="con_txt"/>	
			<input type="hidden" name="con_title"/>	
			<input type="hidden" name="key" />
		</form>
		
		<!-- 본인인증 된 후  제목, 내용 수정페이지에 전달하기 위해 사용-->
		<form name="identify">
			<input type="hidden" name="key" />
			<input type="hidden" name="con_no"/>
			<input type="hidden" name="con_title" />
			<input type="hidden" name="con_txt" />
		</form>
		
		<div id="privateBottom">
			<p>작성자 본인 확인</p>
			<c:if test="${boardInfo.get('key') eq 2}">
				<div >
					<input class="button-cancel" id="btnCancel" type="button" onclick="window.close();" value="Cancel" />
					<!-- 비동기 처리 수정 -->
					<input class="button" type="button" id="btnCancel" value="OK" onClick="submit(${boardInfo.get('con_no')});"/>
				</div>
			</c:if>
			<c:if test="${boardInfo.get('key') eq 3}">
				<div >
					<input class="button-cancel" id="btnCancel" type="button" onclick="window.close();" value="Cancel" />
					<!-- 비동기 처리 삭제 -->
					<input class="button" id="btnCancel" type="button"  value="OK" onClick="del(${boardInfo.get('con_no')});"/>
				</div>
			</c:if>
		</div>
	</div>
</body>