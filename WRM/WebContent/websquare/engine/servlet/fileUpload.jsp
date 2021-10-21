<%@ page contentType="text/html; charset=UTF-8" language="java" errorPage="" %><%
String ref = request.getHeader("referer");
String param = request.getParameter("gridID");
if(ref == null || ref.equals("") || param == null || param.equals("")) {
	response.setStatus(HttpServletResponse.SC_NOT_FOUND);
	return;
}
// 사용자 세션 정보를 이용한  접근제거 필요한 경우 아래 추가

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:xf="http://www.w3.org/2002/xforms" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:w2="http://www.inswave.com/websquare">
<head>
<meta http-equiv=Content-Type content="text/html;charset=UTF-8" />
<meta http-equiv=Cache-Control content=No-Cache />
<meta http-equiv=Pragma	content=No-Cache />
<title>FILE UPLOAD</title>
<script type="text/javascript" src="../../../message/htmlCommon.js"></script>
<script language="JavaScript">
	var vActionUrl		= "";
	var vCallbackMethod	= "";
	var domain = "";
	window.onload = doInit;
	function doInit() {
	    try {
	        domain = getParameter("domain");  
	        if(domain) {
	            document.domain = domain;   
	        }
	    } catch (e) {
	    	//$l("exception:" + e.message);
	    }

	    //  header, append, hidden, columnNum, hiddenColumns, action
		vheader = getParameter("header");
		vappend = getParameter("append");
		vhidden = getParameter("hidden");
		vcolumnNum = getParameter("columnNum");
		vhiddenColumns = getParameter("hiddenColumns");
		vheaderRows = getParameter("headerRows");
		actionUrl = getParameter("action");
		delim = getParameter("delim");
		gridID = getParameter("gridID");
		fillHidden = getParameter("fillHidden");
		gridStartRow = getParameter("gridStartRow");
		expressionColumns = getParameter("expressionColumns");
		type = getParameter("type");
		
		document.getElementById("header").value = vheader;
		document.getElementById("columnNum").value = vcolumnNum;
		document.getElementById("hiddenColumns").value = vhiddenColumns;
		document.getElementById("headerRows").value = vheaderRows;
		document.getElementById("hidden").value = vhidden;
		document.getElementById("delim").value = delim;
		document.getElementById("fillHidden").value = fillHidden;
		document.getElementById("gridStartRow").value = gridStartRow;
		document.getElementById("expressionColumns").value = expressionColumns;
		document.getElementById("domain").value = domain;
		
		with( document.__uploadForm__ ) {
			action = actionUrl;
		}
		
        if(isSafari) {
            setTimeout(function() {
                var bottomMargin = parseInt(document.height - document.documentElement.offsetHeight, 10) * -1||0;     
                if( bottomMargin != 0 ) {
                    self.resizeBy(0, bottomMargin);
                }
            }, 1);
        }
	}
	function upload( thisForm ) {
		try {
			// file type check
			var filename = document.getElementById("filename").value;
			if( !filename )
				return;
			
			var isXlsFile = filename.toLowerCase().indexOf(".xls") >= 0;
			var isXlsType = document.__uploadForm__.action.indexOf("excelToGrid") >= 0;
			
			var isCSVFile = endsWith(filename.toLowerCase(), ".csv") >= 0 ||
							endsWith(filename.toLowerCase(), ".txt") >= 0;
			var isCSVType = document.__uploadForm__.action.indexOf("csvToXML") >= 0;

			if( !(isXlsFile && isXlsType) && !(isCSVFile && isCSVType) ){
				alert( "FileType에 맞지 않는 File의 확장자입니다." );
				return;
			}
			
			var frm = window.frames;
			var find = false;
			for( var i = 0; i < frm.length; i++ ) {
			    if( frm[i].name == thisForm.target ) {
			    	find = true;
			    }
			}
			if( !find ) {
				var layerUP= document.createElement("div");
				var src = "";
				layerUP.style.border="1px solid blue";
				layerUP.style.width="100px";
				layerUP.style.height="100px";
				layerUP.style.visibility = "hidden";
				document.body.appendChild(layerUP);
				src = opener.WebSquare.net.getSSLBlankPage();
				layerUP.innerHTML = "<iframe frameborder='0px' name='" + thisForm.target + "' scrolling='no' style='width:100px; height:100px' " + src + "></iframe>";
			}
			thisForm.submit();
		} catch(e) {
			alert(e.description);
		}
	}

	function returnData( vData ) {
		
		var doc = opener.WebSquare.xml.parse( vData );

		var exception = doc.getElementsByTagName("Exception");
		if(exception.length > 0) {
			var msg = doc.getElementsByTagName("message")[0].firstChild.nodeValue;
			alert(msg);
		} else {

			if( typeof vappend =="string"){
				vappend = opener.WebSquare.util.getBoolean(vappend);
			}
			var child = (doc.getElementsByTagName("array"))[0].firstChild.nodeValue;

			try {
				if (type == "true" ){
					opener.window[gridID].setDataFile(child, vappend);
				}else{
					opener.window[gridID].setData(child, vappend);
				}

				var fileNameDom = document.getElementById("filename")
				var fileName = fileNameDom.value;
				var fileNameArr = fileName.split("\\"); //fileName에 대해서 IE에서는 파일 경로가 나오는데 FF chrome은 나오지 않는다. 따라서 '\\'기준으로 나눠준다.
				opener.window[gridID].fireFileReadEnd( fileNameArr[fileNameArr.length-1] );
				window.self.close();
			} catch (e) {
				opener.WebSquare.exception.printStackTrace(e);
				alert( "그리드 반영에 실패하였습니다" );			
			}
		}
	}
</script>

</head>
<body style='margin : 0px 0px 3px 0px;'>
	<form name="__uploadForm__" method="post" action="" enctype="multipart/form-data" target="__targetFrame__">
		<table width="400">
			<tr style="height:30px">
				<td colspan="2">
					<input type="file" id="filename" name="filename" style="margin-left:8px; width:380px; font-family:Verdana; font-size:12px;" />
				</td>
			</tr>
	
			<tr style="height:30px">
				<td style="font-family:Verdana; font-size:12px;">
					옵션: <select name="skip_space" style="font-family:Verdana; font-size:12px;">
						<option value="true">공백무시</option>
						<option value="false">공백포함</option>
					</select>		
				</td>
				<td align="right">
					<input type="button" name="sendFILE" style="width:90px; height:20px;  font-family:Verdana; font-size:12px;" value="파일올리기" onclick="javascript:upload(this.form)" />
				</td>
			</tr>
		</table>
		<!-- working start -->
        <input type="hidden" id="domain" name="domain" value="" />
		<input type="hidden" id="header" name="header" value="1" />
		<input type="hidden" id="columnNum" name="columnNum" value="" />
		<input type="hidden" id="hiddenColumns" name="hiddenColumns" value="" />
		<input type="hidden" id="headerRows" name="headerRows" value="" />
		<input type="hidden" id="hidden" name="hidden" value="" />
		<input type="hidden" id="delim" name="delim" value="" />
		<input type="hidden" id="fillHidden" name="fillHidden" value="" />		
		<input type="hidden" id="gridStartRow" name="gridStartRow" value="" />		
		<input type="hidden" id="expressionColumns" name="expressionColumns" value="" />		
	</form>
</body>
</html>