<%@page contentType="text/html; charset=utf-8" language="java"%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:ev='http://www.w3.org/2001/xml-events' xmlns:w2='http://www.inswave.com/websquare' xmlns:xf='http://www.w3.org/2002/xforms'>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
		<link rel="shortcut icon" href="../../favicon.ico" />
		<title>WRM</title>
		<script type="text/javascript">
			var WebSquareExternal = {
				"baseURI": "${pageContext.request.contextPath}/websquare/", 
				"w2xPath" : "${pageContext.request.contextPath}" + "<%= (String)request.getAttribute("movePage") %>"
			};
		</script>
		<script type="text/javascript" src="${pageContext.request.contextPath}/javascript.wq?q=/bootloader"></script>
		<script type="text/javascript">
			window.onload = init;
			
			function init() {
				try {
					gcm.CONTEXT_PATH = "${pageContext.request.contextPath}";
					WebSquare.startApplication(WebSquareExternal.w2xPath);
				} catch(e) {
					alert(e.message);
				}
			}
			
		</script>
	</head>
<body>
</body>
</html>