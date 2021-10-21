(function() {
	window["AMFSubmissionHandler"] = function( submissionObj ) {
		["AMFSubmissionHandler"];
		try {
			var submissionID = submissionObj.id;
			var eventObj = { "id" : submissionID };

			if( submissionObj.processMsg != "" ) {
				WebSquare.layer.addSubmissionMessage( submissionID, submissionObj.processMsg );
			}
			
			var ret = WebSquare.event.fireEvent(submissionObj, "xforms-submit", eventObj);		// xforms-submit-error event 발생
			if( typeof ret != "undefined" && ret == false ) {
				WebSquare.logger.printLog("xforms-submit event에서 return이 false이므로 처리를 중단. : " + submissionID);
				WebSquare.ModelUtil.setSubmissionEnd(submissionObj, "submission done" , null);
				WebSquare.layer.deleteSubmissionMessage( submissionID );
				return;
			}

			WebSquare.ModelUtil.doSubmitPreFunc( submissionObj );

			var obfuscator_http = WebSquare.core.getXMLHTTPObject();
			
//			var url = WebSquare.core.getURL(submissionObj.action);
			var url = WebSquare.util.getSubmissionURL(submissionObj.action);
			var async = ( submissionObj.mode == "synchronous" ) ?  false : true;
			var bind = submissionObj.bind;		// 구현안됨
			var target = submissionObj.target;
			var replace = submissionObj.replace;
			var encoding = submissionObj.encoding || "utf-8";
			var mediatype = submissionObj.mediatype || "application/xml";

			var method =  submissionObj.method;
			var action =  submissionObj.action;

			var errorHandler = submissionObj.errorHandler;
			var requestData = submissionObj.requestData;

			var soapaction = submissionObj.soapaction;
			//timeout implemetation by pio
			var timeout = submissionObj.timeout;

			//request Data
			var reqData = getReqData(submissionObj);

			// soap submission일 경우
			var isSoap = false;
			if (typeof reqData != "undefined") {
				if (reqData.indexOf("http://schemas.xmlsoap.org/soap/envelope") > -1) {
					isSoap = true;
				}
			}

			WebSquare.logger.printLog( url );
			obfuscator_http.open(method, url, async);
			if (isSoap) {
				obfuscator_http.setRequestHeader("soapaction",'"' + soapaction + '"');
			}

			if (obfuscator_http.overrideMimeType) {
				obfuscator_http.overrideMimeType('text/plain; charset=x-user-defined');
			} else {
				obfuscator_http.setRequestHeader('Accept-Charset', 'x-user-defined');
			}

			obfuscator_http.setRequestHeader("submissionid", submissionID);
			
			var timeoutID;
			
			if( async ) {
				if(timeout) {
					timeoutID = window.setTimeout(function() {
						obfuscator_http.onreadystatechange = function() {};
						obfuscator_http.abort();
						var errorEventObj = { "id" : submissionID,
							"errorType" : "timeout-error",
							"resourceUri" : url,
							"time": timeout
						};
						WebSquare.ModelUtil.setSubmissionEnd(submissionObj, "submission error", errorEventObj);
						WebSquare.layer.deleteSubmissionMessage( submissionID )	;
						WebSquare.event.fireEvent(submissionObj, "xforms-submit-timeout", errorEventObj);
						window.clearTimeout(timeoutID);	
						return;
					}, timeout);
				}
			
				obfuscator_http.onreadystatechange = function() {
					amfCallback(obfuscator_http, submissionObj, timeoutID);
				}
			}

			if(WebSquare.requestID != "") {
				if(WebSquare.core.getConfiguration("/WebSquare/submission/requestID/@encodeURI") == "true") {
					obfuscator_http.send( WebSquare.requestID + encodeURIComponent(reqData));
				} else {
					obfuscator_http.send( WebSquare.requestID + reqData);
				}
			} else {
				obfuscator_http.send(reqData);
			}

			if( !async ) {
				amfResponseHandler(submissionObj, obfuscator_http, "sync mode");
			}
		} catch(e){
			WebSquare.exception.printStackTrace(e);
			WebSquare.layer.hideProcessMessage();
		}
	}
	
		/**
	 * @plugin	WebSquare.ModelUtil
	 * @cdate	2009-12-11
	 * @version	2.0 
	 * @author	남궁혁
	 * @description
	 *			submisson이 기본 모드면서 async모드 일 경우에 submisson이 끝났을 경우의 동작을 수행합니다.
	 * @param  <Object:Y> obfuscator_http XMLHttpRequest 객체
	 * @param  <Object:Y> submissionObj submission 객체
	 * @param  <Object>	timeoutId timeoutEvenet를 실행시키는 함수
	 * @see
	 * @return
	 * @exception
	 * @sample
	 * @hidden	true
	 */
	var amfCallback = function (obfuscator_http, submissionObj, timeoutID) {
		try{
			if( obfuscator_http.readyState == 4 ) {
			// clear timeoutID
				if(timeoutID) {
					window.clearTimeout(timeoutID);
					//customHandler를 사용하는 기존사이트가 문제없게 하기위해 처리
					window.clearInterval(timeoutID);
					timeoutID = null;
				}

				amfResponseHandler(submissionObj, obfuscator_http, "async mode");
			}
		}catch(e){
			WebSquare.exception.printStackTrace(e);
			WebSquare.layer.hideProcessMessage();
		}
	}

	function getReqData(submissionObj) {

		var reqData, ref = submissionObj.ref, instance = submissionObj.instance;
		var mediatype = submissionObj.mediatype;
		var requestData = submissionObj.requestData;
		
		var instanceElement = null;
		if( instance != '' ) {
			var modelID = submissionObj.parentElement.getAttribute("id");
			if( modelID == null || modelID == '' ) {
				instanceElement = WebSquare.ModelUtil.getInstanceByID( instance );
			} else {
				instanceElement = WebSquare.ModelUtil.getInstanceByID( instance, modelID );
			}
		} else {
			instanceElement = WebSquare.xml.getElementsByTagName( submissionObj.parentElement, "data" )[0];
		}

		var e = null, instanceValue = "", reqData = "", doc;
		if( typeof requestData != "undefined" && requestData != null ) {
			if(mediatype == "application/json") {
				if(typeof requestData == "string") {
					reqData = requestData;
				} else {
					reqData = JSON.stringify(requestData);
				}
			} else {
				reqData = WebSquare.xml.serialize(requestData);
			}
		} else {
			if(ref == "" && mediatype != "application/json") {
				e = instanceElement;
				reqData = WebSquare.xml.serialize(e);
			} else if(mediatype == "application/json") {
				if(ref == "") {
					reqData = "";
				} else if(WebSquare.ModelUtil.getInstanceValue(ref).wq_trim().length > 0) {
					reqData = WebSquare.ModelUtil.getInstanceValue(ref);
				} else {
					e = WebSquare.xml.createNode(instanceElement, ref);
					doc = WebSquare.xml.parse(WebSquare.xml.serialize(e));
					reqData = WebSquare.json.XML2JSONString(doc);
				}
			} else {
				e = WebSquare.xml.createNode(instanceElement, ref);
				reqData = WebSquare.xml.serialize(e);
			}
		}

		return reqData;
	}

	function setResponseObj(obj, contentType, replace, obfuscator_responseObj, jsonObj, isXML) {
		if(contentType.indexOf("json") > -1) {
			if(replace == "instance") {
				obj.responseBody = obfuscator_responseObj;
			}
			obj.responseJSON = jsonObj;
		} else if(contentType.indexOf("xml") > -1) {
			obj.responseBody = obfuscator_responseObj;
		} else if(isXML) {
			obj.responseBody = obfuscator_responseObj;
		} 
	}

	function amfResponseHandler(submissionObj, obfuscator_http, mode) {

		var submissionID = submissionObj.id;
		
		//var url = WebSquare.core.getURL(submissionObj.action);
		var url = WebSquare.util.getSubmissionURL(submissionObj.action);
		var async = ( submissionObj.mode == "synchronous" ) ?  false : true;
		var ref = submissionObj.ref;
		var bind = submissionObj.bind;		// 구현안됨
		var target = submissionObj.target;
		var replace = submissionObj.replace;
		var instance = submissionObj.instance;
		var encoding = submissionObj.encoding;
		var mediatype = submissionObj.mediatype;

		var method =  submissionObj.method;
		var action =  submissionObj.action;

		var errorHandler = submissionObj.errorHandler;
		var requestData = submissionObj.requestData;

		var soapaction = submissionObj.soapaction;
		var requestObj;

		//requestData
		var reqData = getReqData(submissionObj);

		if(mediatype == "application/json") {
			requestObj = reqData ? JSON.parse(reqData) : "";
		} else {
			requestObj = WebSquare.xml.parse(reqData);
		}

		if((obfuscator_http["status"])&&((200 > obfuscator_http.status)||(300 <= obfuscator_http.status))) {
			var errorEventObj = { "id" : submissionID,
						"errorType" : "resource-error",
						"resourceUri" : url,
						"responseHeaders" : WebSquare.ModelUtil.parseResponseHeader( obfuscator_http ),
						"responseStatusCode" : obfuscator_http["status"],
						"responseReasonPhrase" : obfuscator_http["statusText"],
						"requestBody" : requestObj,
						"responseBody" : obfuscator_http.responseText };
			WebSquare.logger.printLog('submission error(E03). Status[' + obfuscator_http.status + '] ' + submissionID);
			
			WebSquare.ModelUtil.setSubmissionEnd(submissionObj, "submission error" , errorEventObj);
			WebSquare.layer.deleteSubmissionMessage( submissionID )
			
			//
			// 서버에서 정상적인 응답을 못했을때 공통 에러 처리를 필요로 했다. @cshan
			//
			var submitErrorHandler = WebSquare.core.getConfiguration("/WebSquare/submission/submitErrorHandler/@value");
			var submitErrorHandlerMode = WebSquare.core.getConfiguration("/WebSquare/submission/submitErrorHandler/@mode");
			if(submitErrorHandler) {
				var obfuscator_evt = errorEventObj;
				if(submitErrorHandlerMode == "only") {
					eval(submitErrorHandler+"(obfuscator_evt)");
				} else if(submitErrorHandlerMode == "after") {
					WebSquare.event.fireEvent(submissionObj, "xforms-submit-error", errorEventObj);		// xforms-submit-error event 발생
					eval(submitErrorHandler+"(obfuscator_evt)");
				} else if(submitErrorHandlerMode == "before") {
					eval(submitErrorHandler+"(obfuscator_evt)");
					WebSquare.event.fireEvent(submissionObj, "xforms-submit-error", errorEventObj);		// xforms-submit-error event 발생
				}
			} else {
				WebSquare.event.fireEvent(submissionObj, "xforms-submit-error", errorEventObj);		// xforms-submit-error event 발생
			}
			if( WebSquare.logger.globalDebug1 || WebSquare.logger.getGlobalDebug() ) {
				var obj = new Object();
				var re = />[\s]*</g;	//Initialize pattern.
				obj["information"] =   "url          : " + url          +
									"\nasync        : " + async        +
									"\nref          : " + ref          +
									"\nbind         : " + bind         +
									"\ntarget       : " + target       +
									"\nreplace      : " + replace      +
									"\ninstance     : " + instance     +
									"\nencoding     : " + encoding     +
									"\nmediatype    : " + mediatype    +
									"\nmethod       : " + method       +
									"\naction       : " + action       +
									"\nerrorHandler : " + errorHandler +
									"\nsoapaction   : " + soapaction   +
									"\nstatus       : " + obfuscator_http["status"] +
									"\nstatus text  : " + obfuscator_http["statusText"] +
									"\nresponseHeaders : " + WebSquare.ModelUtil.parseResponseHeader( obfuscator_http );
				obj["result"] = obfuscator_http.responseText.replace( re ,">\n<");
				obj["input"] = reqData.replace( re ,">\n<");
				WebSquare.logger.showDebugMsg( obj, 'xml', "Default Submission (" + mode + ")" );
			}

			obfuscator_http.onreadystatechange = function() {}
			obfuscator_http = null;
			return;
		}
		
		//응답처리
		try {
			if( typeof convertResponseBodyToText != "undefined" ) {
				var tmp = convertResponseBodyToText(obfuscator_http.responseBody);
				var decodedStr = decodeAMF(tmp).messages[0].body;
			} else {
				var decodedStr = decodeAMF(obfuscator_http.responseText).messages[0].body;
			}
		} catch( ee ) {
			WebSquare.exception.printStackTrace(ee);
		}

		var obfuscator_responseObj = decodedStr, jsonObj, doc, isXML = false, instanceXML, contentType = "plain/text" ;

		if( typeof decodedStr == "string" ) {
			try {
				if(decodedStr && decodedStr.wq_trim().startsWith("<")) {
					obfuscator_responseObj = WebSquare.xml.parse( decodedStr);	// 하위 호환성 보장 코딩
					if(!obfuscator_responseObj) {
						obfuscator_responseObj = decodedStr;
					} else {
						if(replace == "instance") {
							instanceXML = WebSquare.xml.parse(decodedStr);	// model을 rebuild하면 instanceXML의 documentElement 객체가 사라지므로 별도로 파싱한다.
						}
						isXML = true;
						contentType = "application/xml";
					}
				} else if (decodedStr && ( decodedStr.wq_trim().startsWith("[") || decodedStr.wq_trim().startsWith("{") ) ) {
					jsonObj = JSON.parse(decodedStr);
					if(replace == "instance") {
						obj.responseBody = obfuscator_responseObj;
					}
					
					if(replace == "instance") {
						obfuscator_responseObj = WebSquare.json.JSON2XML(jsonObj);
						instanceXML = WebSquare.json.JSON2XML(jsonObj);
					} else if(replace == "text") {
						obfuscator_responseObj = decodedStr;
					} else {
						obfuscator_responseObj = jsonObj;	// 성능을 위한 코딩임.  replace가 instance가 아닌 경우에는 obfucator_responseObj는 에러 핸들러에서만 사용됨. 2012년 3월 5일 김욱래
					}
					contentType = "application/json";
				}
			} catch( e ) {}
		} else {		// JSON
			jsonObj = decodedStr;
			if(replace == "instance") {
				obj.responseBody = obfuscator_responseObj;
			}
			if(replace == "instance") {
				obfuscator_responseObj = WebSquare.json.JSON2XML(jsonObj);
				instanceXML = WebSquare.json.JSON2XML(jsonObj);
			} else if(replace == "text") {
				obfuscator_responseObj = JSON.stringify(decodedStr);
			} else {
				obfuscator_responseObj = jsonObj;	// 성능을 위한 코딩임.  replace가 instance가 아닌 경우에는 obfucator_responseObj는 에러 핸들러에서만 사용됨. 2012년 3월 5일 김욱래
			}
			contentType = "application/json";
		}


		if( errorHandler != ""  && eval( errorHandler + "( obfuscator_responseObj )" ) ) {		// Error 발생
			var errorEventObj = { "id" : submissionID,
						"errorType" : "target-error",
						"resourceUri" : url,
						"responseHeaders" : WebSquare.ModelUtil.parseResponseHeader( obfuscator_http ),
						"responseStatusCode" : obfuscator_http["status"],
						"responseReasonPhrase" : obfuscator_http["statusText"],
						"requestBody" : requestObj,
						"responseText" : decodedStr };
			setResponseObj(errorEventObj, contentType, replace, obfuscator_responseObj, jsonObj, isXML);
			WebSquare.logger.printLog('submission error(E04). Status[' + obfuscator_http.status + '] ' + submissionID);
			
			WebSquare.ModelUtil.setSubmissionEnd(submissionObj, "submission error" , errorEventObj);
			WebSquare.layer.deleteSubmissionMessage( submissionID )
			WebSquare.event.fireEvent(submissionObj, "xforms-submit-error", errorEventObj);		// xforms-submit-error event 발생

			if( WebSquare.logger.globalDebug1 || WebSquare.logger.getGlobalDebug() ) {
				var obj = new Object();
				var re = />[\s]*</g;	//Initialize pattern.
				obj["information"] =   "url          : " + url          +
									"\nasync        : " + async        +
									"\nref          : " + ref          +
									"\nbind         : " + bind         +
									"\ntarget       : " + target       +
									"\nreplace      : " + replace      +
									"\ninstance     : " + instance     +
									"\nencoding     : " + encoding     +
									"\nmediatype    : " + mediatype    +
									"\nmethod       : " + method       +
									"\naction       : " + action       +
									"\nerrorHandler : " + errorHandler +
									"\nsoapaction   : " + soapaction   +
									"\nstatus       : " + obfuscator_http["status"] +
									"\nstatus text  : " + obfuscator_http["statusText"] +
									"\nresponseHeaders : " + WebSquare.ModelUtil.parseResponseHeader( obfuscator_http );
				obj["result"] = decodedStr.replace( re ,">\n<");
				obj["input"] = reqData.replace( re ,">\n<");
				WebSquare.logger.showDebugMsg( obj, 'xml', "Default Submission (" + mode + ")" );
			}

		} else {
			if( replace == "instance" ) {
				WebSquare.WebSquaredoc.models[0].rebuild(instanceXML, target);
				WebSquare.WebSquaredoc.models[0].refresh();
			} else if( replace == "text" ) {
				WebSquare.WebSquaredoc.models[0].rebuild(decodedStr , target);
				WebSquare.WebSquaredoc.models[0].refresh();
			} else if( replace == "none" ) {
			}

			var doneEventObj = { "id" : submissionID,
						"resourceUri" : url,
						"responseHeaders" : WebSquare.ModelUtil.parseResponseHeader( obfuscator_http ),
						"responseStatusCode" : obfuscator_http["status"],
						"responseReasonPhrase" : obfuscator_http["statusText"],
						"requestBody" : requestObj,
						"responseText" : decodedStr };
			setResponseObj(doneEventObj, contentType, replace, obfuscator_responseObj, jsonObj, isXML);
			WebSquare.logger.printLog('submission complete. Status[' + obfuscator_http.status + '] ' + submissionID);

			WebSquare.ModelUtil.setSubmissionEnd(submissionObj, "submission complete" , doneEventObj);
			WebSquare.layer.deleteSubmissionMessage( submissionID )
			WebSquare.event.fireEvent(submissionObj, "xforms-submit-done", doneEventObj);		// xforms-submit-done event 발생

			if( WebSquare.logger.globalDebug1 || WebSquare.logger.getGlobalDebug() ) {
				var obj = new Object();
				var re = />[\s]*</g;	//Initialize pattern.
				obj["information"] =   "url          : " + url          +
									"\nasync        : " + async        +
									"\nref          : " + ref          +
									"\nbind         : " + bind         +
									"\ntarget       : " + target       +
									"\nreplace      : " + replace      +
									"\ninstance     : " + instance     +
									"\nencoding     : " + encoding     +
									"\nmediatype    : " + mediatype    +
									"\nmethod       : " + method       +
									"\naction       : " + action       +
									"\nerrorHandler : " + errorHandler +
									"\nsoapaction   : " + soapaction   +
									"\nstatus       : " + obfuscator_http["status"] +
									"\nstatus text  : " + obfuscator_http["statusText"] +
									"\nresponseHeaders : " + WebSquare.ModelUtil.parseResponseHeader( obfuscator_http );
				obj["result"] = decodedStr.replace( re ,">\n<");
				obj["input"] = reqData.replace( re ,">\n<");
				WebSquare.logger.showDebugMsg( obj, 'xml', "Default Submission (" + mode + ")" );
			}

		}

		obfuscator_http.onreadystatechange = function() {}
		obfuscator_http = null;
	}



if(/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
	var head= document.getElementsByTagName('head')[0];
	var script= document.createElement('script');
	script.type= 'text/vbscript';
	script.src = WebSquare.baseURI + "/externalJS/amf/amfBirdge.vbs";
	head.appendChild(script);

  window["convertResponseBodyToText"] = function (binary) {
    var byteMapping = {};
    for ( var i = 0; i < 256; i++ ) {
        for ( var j = 0; j < 256; j++ ) {
            byteMapping[ String.fromCharCode( i + j * 256 ) ] =
                String.fromCharCode(i) + String.fromCharCode(j);
        }
    }
    var rawBytes = IEBinaryToArray_ByteStr(binary);
    var lastChr = IEBinaryToArray_ByteStr_Last(binary);
    return rawBytes.replace(/[\s\S]/g, function( match ) { return byteMapping[match]; }) + lastChr;
	};
}

if (!Array.prototype.map) {
  Array.prototype.map = function(fun) {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)  {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }
    return res;
  };
}

if( typeof decodeAMF == "undefined" || decodeAMF == null ) {
	var head= document.getElementsByTagName('head')[0];
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src = WebSquare.baseURI + "/externalJS/amf/amf.js";
	head.appendChild(script);
}

})();



