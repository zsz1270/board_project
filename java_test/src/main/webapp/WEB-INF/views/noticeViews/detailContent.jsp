<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" language="java" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>업무관리시스템</title>
	<style type="text/css">
		#ctBottom{
			margin:5px 0 0 0;
		}
		table {
		    width:100%;
			border:1px solid #444444;
			border-collapse: collapse;
		}
		
		 th, td {
			border:1px solid #444444;
			padding:10px;
		}
		#btnUpdate{
			background-color:#6297D5;
			color:white;
		}
		#btnDelete{
			background-color:#5E5E5E;
			color:white;
		}
		.btn{
			border-radius:3px;
		}
		#btnback{
			background-color:#6297D5;
			color:white;
			width:80px;
			height:30px;
			border-radius:3px;
		}
	</style>
	<script>
	var identification = function(key,con_no){ 
		
		var form = document.content;
		form.con_no.value = con_no;
		form.key.value = key;
		form.con_title.value = "${detailContents.get('CON_TITLE')}";
		form.con_txt.value = "${detailContents.get('CON_TXT')}";
		window.open("","content","toolbar=no, width = 600, height = 600, left = 450");
		form.action = "<c:url value='/noticeViews/identification.do' />";
		form.target="content"
	    form.method = "POST"
	    form.submit();
	
	};
	var move = function(data){
		var form = document.content;
		form.con_no.value = data;
		form.key.value = 0;
		form.con_title.value = "${detailContents.get('CON_TITLE')}";
		form.con_txt.value = "${detailContents.get('CON_TXT')}";
	    form.action = "<c:url value='/noticeViews/detailContent.do' />";
	    form.method = "POST";
	    form.submit();
	};
</script>
</head>
<body>
	
	<div class="contents" style="width:800px;">
		<div class="back">
			<input id="btnback" type="button" onclick="location.href='/mytest/noticeViews/boardList.do'" value="전체목록"/>		
		</div>
		<div id="ctHead" style="margin:0 0 50px 0;">
			<h2>상세내용</h2>
		</div>
		<div id="ctMain">
			<table id="tbMain">
				<colgroup>
					<col style="width:60px;"/>
				</colgroup>
				<tr>
					<td style="background-color:#EDEDED;">제목</td>
					<td colspan="3"><span style="font:20px bold;">${detailContents.get("CON_TITLE")}</span></td>
				</tr>
				<tr>
					<td style="background-color:#EDEDED;">내용</td>
					<td colspan="3"><span style="font:20px bold; word-break:keep-all;">${detailContents.get("CON_TXT")}</span></td>
				</tr>
			</table>
		</div>
		<div id="ctBottom" style="height:25px; text-align:center;">
			<input type="button" class="btn" id="btnBefore" onclick="move(${detailContents.get("CON_NO")-1})" value="&lt;&lt;" />
			<input type="button" class="btn" id="btnUpdate" onclick="identification(2, ${detailContents.get("CON_NO")});"value="수정" />
			<input type="button" class="btn" id="btnDelete" onclick="identification(3, ${detailContents.get("CON_NO")});" value="삭제" />
			<input type="button" class="btn" id="btnNext" onclick="move(${detailContents.get("CON_NO")+1});" value="&gt;&gt;" />
		</div>
	</div>
	<form name="content" style="width:0px; height:0px;">
		<input type="hidden" name="con_no" />
		<input type="hidden" name="key" />
		<input type="hidden" name="con_title" />
		<input type="hidden" name="con_txt"/>
	</form>
</body>
</html>