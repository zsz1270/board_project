<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isErrorPage="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Error</title>
</head>
<body>
	요청 처리 과정에서 에러가 발생하였습니다.<br>
	<br>
	에러 타입 : <%= exception.getClass().getName() %><br>
	에러 메세지 : <%= exception.getMessage() %>
</body>
</html>