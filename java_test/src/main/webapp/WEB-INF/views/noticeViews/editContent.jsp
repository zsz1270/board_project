<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page contentType = "text/html;charset=utf-8" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>업무관리시스템</title>
	<style type="text/css">
		#writeBottom{
			float:right;
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
		#btnEdit{
			background-color:#6297D5;
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
		#txtContents{
			resize:none;
		}
	</style>
</head>
<body>
	<form action=<c:if test="${boardInfo.getKey() eq 1}">"<c:url value="/noticeViews/write.do" />"</c:if> 
				 <c:if test="${boardInfo.getKey() eq 2}">"<c:url value="/noticeViews/edit.do" />"</c:if> method="POST">
	
	<div class="contents" style="width:800px;">
		<div id="writeHead" style="margin:0 0 50px 0;">
		<c:if test="${boardInfo.getKey() eq 1}">
			<h2>게시물작성</h2>
		</c:if>
		<c:if test="${boardInfo.getKey() eq 2}">
			<h2>게시물수정</h2>
		</c:if>
			
		</div>
		<div id="writeMain">
			<table id="tbMain">
				<colgroup>
					<col style="width:60px;"/>
				</colgroup>
				<tr>
					<td style="background-color:#EDEDED;">제목</td>
					<td>
						<input type="hidden" name="con_no" value="${boardInfo.getCon_no()}" />
						<input type="text" name="con_title" class="txtBox" size="50" maxlength="40" placeholder="제목을 입력하세요." value="${boardInfo.getCon_title()}">
					</td>
				</tr>
				<tr>
					<td style="background-color:#EDEDED;">내용</td>
					<td>					
						<textarea name="con_txt" class="txtBox" id="txtContents" cols="50" rows="20" maxlength="1000" placeholder="내용을 입력하세요.">${boardInfo.getCon_txt()}</textarea>
					</td>
				</tr>
			</table>
		<c:if test="${boardInfo.getKey() eq 1}">
			<table>
				<colgroup>
					<col style="width:60px;"/>
				</colgroup>
				<tr>
					<td style="background-color:#EDEDED;">ID</td>
					<td><input type="text" name="con_id" class="txtBox" maxlength="10" placeholder="user name"></td>
					<td style="background-color:#EDEDED;">P.W</td>
					<td><input type="password" class="txtBox" name="con_password" maxlength="10" placeholder="＊＊＊＊"></td>
				</tr>
			</table>
		</div>
		</c:if>
		<div id="writeBottom">
				<input type="submit" id="btnEdit" value="등록"/>
		</div>		
	</div>
	</form>
</body>
</html>