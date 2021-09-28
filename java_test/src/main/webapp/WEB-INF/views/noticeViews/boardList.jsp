<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" language="java" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>업무관리시스템</title>
	<style type="text/css">
		table {
		    width:100%;
			border:1px solid #444444;
			border-collapse:collapse;
		}
		 th, td {
			border:1px solid #444444;
			padding:10px;
		}
		.ulPage li{
			border:1px solid none;
			width:30px;
			height:30px;
			float:left;
			margin:0 2px 0 2px;
			border-radius:3px;
			background-color:#f4f4f4;
		}
		#btnEdit{
			background-color:#6297D5;
			color:white;
			width:80px;
			height:30px;
			border-radius:3px;
		}
		#btnSearch{
			background-color:#5E5E5E;
			color:white;
			border-radius:3px;
		}
	</style>
	<script>
		//게시물 상세페이지 이동
		var content= function(data){
			
			var form = document.content;
			form.con_no.value = data;
			form.key.value = 0;
		    form.action = "<c:url value='/noticeViews/detailContent.do' />";
		    form.method = "POST";
		    form.submit();
		};
		
		var key = function(data){
			var form = document.content;
			form.con_no.value = null;
			form.key.value = data;
		    form.action = "<c:url value='/noticeViews/editContent.do' />";
		    form.method = "POST";
		    form.submit();
		};
		
	</script>
</head>

<body>
	<form name="content" style="width:0px; height:0px;">
		<input type="hidden" name="con_no"/>
		<input type="hidden" name="key"/>
	</form>
	<div id="contents" style="width:800px;">
		<div id="mainHead" style="margin:0 0 50px 0;">
			<h2>
			  공지사항
			</h2>
		</div>
		<div id="tbArea" style="width:100%;">
			<div id="tbHead" style="height: 25px; margin:0 0 10px 0;">
				<div id="searchBar" style="width:300px; text-align:right; float:right;">
				<form action='<c:url value="/noticeViews/boardList.do" />' method="GET">
					<select name="searchType" >
						<option value="title">제목</option>
						<option value="id">작성자</option>
					</select>
					<input type="text" name="keyword" placeholder="내용을 입력해주세요."/>
					<input type="submit" id="btnSearch" value="검색"/>
				</form>
				</div>
			</div>
			<div id="tbMain" style="margin:0 0 10px 0;">
				<table style="width:100%;">
					<colgroup>
						<col style="width:10px;" />
						<col style=""/>
						<col style="width:100px;" />
						<col style="width:100px;" />
						<col style="width:100px;" />
					</colgroup>
					<tr style="background-color:#EAEAEA;">
						<td>No.</td><td style="text-align:center">제목</td><td>작성자</td><td>등록일</td><td>조회수</td>
					</tr>
					<c:forEach items="${boardList}" var="boardList">
					<tr>
						<td><c:out value="${boardList.getRn()}" /></td>
						<td><a href="javascript:content(${boardList.getCon_no()});"><c:out value='${boardList.getCon_title()}'/></a> </td>
						<td><c:out value="${boardList.getCon_id()}" /></td>
						<td><c:out value="${boardList.getReg_date()}"/></td>
						<td><c:out value="${boardList.getRead_count()}" /></td>
					</tr>
					</c:forEach>
				</table>
			</div>
		</div>
			
		<div id="tbBottom" style="height:25px; text-align:center;">
			<div id="pagebar" style="display:inline-block;">
				<ul class="ulPage" style="list-style:none; margin:0px; padding:0px;">
			 		<c:if test="${pageMaker.prev}">
			    	<li><a href="boardList.do${pageMaker.makeSearch(pageMaker.startPage - 1)}">&lt;</a></li>
				   	</c:if> 
			
				   	<c:forEach begin="${pageMaker.startPage}" end="${pageMaker.endPage}" var="idx">
				   	<li><a href="boardList.do${pageMaker.makeSearch(idx)}">${idx}</a></li>
				   	</c:forEach>
			
				   	<c:if test="${pageMaker.next && pageMaker.endPage > 0}">
				   	<li><a href="boardList.do${pageMaker.makeSearch(pageMaker.endPage + 1)}">&gt;</a></li>
				 	</c:if>
				 </ul>
					
			</div>
			<div id="write_btn" style="float:right; display:inline-block; width:100px; text-align:right;">
				<input type="button" id="btnEdit" onclick="key(1)" value="글쓰기" />
			</div>
		</div>
	</div>
</body>
</html>