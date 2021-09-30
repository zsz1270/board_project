<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" language="java" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>업무관리시스템</title>
	<style>
		#line{
			text-decoration-line:none;
		}
	</style>
</head>
<body>
	<div id="contents" style="width:800px;">
		<div id="mainHead" style="margin:0 0 50px 0;">
			<h1>
			  업무관리시스템
			</h1>
		</div>
	</div>
	<div class="공지사항">
		<ul>
			<li><a id="line" href="noticeViews/boardList.do">공지사항</a></li>
			<li><a id="line" href="noticeViews/boardList.do">자료실</li>
			<li><a id="line" href="noticeViews/boardList.do">마이페이지</li>
		</ul>
	</div>
</body>
</html>