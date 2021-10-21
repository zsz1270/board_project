requires("uiplugin.popup");

// =============================================================================
/**
 * 전체 Scope에서 공유되는 Global 전역 변수, 상수, 공통 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class gcm
 * @namespace gcm
 * @description
- gcm 객체는 WFrame Scope이 고려될 필요가 없고, com 공통 함수 객체나 전역에서 사용할 함수만을 작성한다.
- gcm 객체는 WFrame Scope별로 생성되지 않고, 전역 객체로 1개만 생성된다.
- gcm 객체 내에서는 함수를 호출한 화면의 Scope을 찾을 수 없기 때문에 Scope 확인이 필요한 경우 $p 객체를 파라미터로 전달해야 한다.

※ 주의사항
- gcm 객체 내 변수와 함수는 업무 화면 개발 시에는 사용 금지
 */
// =============================================================================

var gcm = {
	// 서버 통신 서비스 호출을 위한 Context Path
	CONTEXT_PATH : "",

	// 서버 통신 서비스 호출을 위한 Service Url (Context Path 이하 경로)
	SERVICE_URL : "",

	// 서버 통신 기본 모드 ( "asynchronous" / "synchronous") - "synchronous"는 비권장 통신 방식임
	DEFAULT_OPTIONS_MODE : "asynchronous",

	// 서버 통신 기본 미디어 타입
	DEFAULT_OPTIONS_MEDIATYPE : "application/json",

	// 통신 상태 코드
	MESSAGE_CODE : {
		STATUS_ERROR : "E",
		STATUS_SUCCESS : "S",
		STATUS_WARNING : "W",
		STATUS_INFO : "I"
	},
	
	// 메시지 레이어 인덱스
	MESSAGE_IDX : 1,
	
	// 공통 코드 저장을 위한 DataList 속성 정보
	DATA_PREFIX : "dlt_commonCode",

	COMMON_CODE_INFO : {
		LABEL : "CODE_NM",
		VALUE : "COM_CD",
		FILED_ARR : [ "GRP_CD", "COM_CD", "CODE_NM" ]
	},
	
	// 공통 코드 데이터
	commonCodeList : [],

	// 메세지 알림 콜백 Function 정보 저장
	CB_FUNCTION_MANAGER : {
		cbFuncIdx : 0, // 정보 저장 Index Key
		cbFuncSave : {} // 정보 저장 객체
	},
	
	FILE_DOWNLOAD_URL : "/file/downloadFile/",
	
	// Console Log Debugg 설정 (DEBUG_MODE가 false이면 Console 객체를 통해서 남긴 로그가 개발자 도구 Console 창에 남지 않도록 함
	DEBUG_MODE : true
};


// =============================================================================
/**
 * 화면 제어와 관련된 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class win
 * @namespace gcm.win
 */
// =============================================================================
gcm.win = {};

/**
 * 다국어 처리함수
 * 
 * @date 2016.08.02
 * @private
 * @param {String} xmlUrl 전체 URL중 w2xPath이하의 경로
 * @memberOf gcm.win
 * @author InswaveSystems
 * @example 
 * com.getI18NUrl( "/ui/DEV/result.xml" ); 
 * //return 예시)"/websquare/I18N?w2xPath=/ui/DEV/result.xml"
 * gcm._getI18NUrl( "/ui/SW/request.xml" ); 
 * //return 예시)"/websquare/I18N?w2xPath=/ui/SW/request.xml"
 */
gcm.win._getI18NUrl = function(xmlUrl) {
	
	var baseURL = gcm.CONTEXT_PATH + "/I18N";
	var rsUrl = "";
	var locale = WebSquare.cookie.getCookie("locale");
	var bXml = "/blank.xml";
	
	xmlUrl = gcm.util._getParameter("w2xPath", xmlUrl) || xmlUrl;
	xmlUrl = xmlUrl.replace(/\?.*/, "");
	
	if (xmlUrl.search(bXml) > -1 && xmlUrl.search(WebSquare.baseURI) == -1) {
		xmlUrl = WebSquare.baseURI + "/blank.xml";
	}
	rsURL = baseURL + "?w2xPath=" + xmlUrl;

	if (locale != null && locale != '') {
		rsURL = rsURL + "&locale=" + unescape(locale);
	}

	return rsURL;
};


/**
 * 특정 컴포넌트가 속한 WFrame Scope을 반환한다.
 *
 * @param {Object} 컴포넌트 객체 또는 아이디(WFrame Scope 경로를 포함한 Full Path Id)
 * @memberOf gcm.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} Scope 객체
 */
gcm.win._getScope = function(comObj) {
	try {
		if (typeof comObj === "string") {
			var scopeObj = com.util.getComponent(comObj);
			if (scopeObj !== null) {
				return scopeObj.getScopeWindow();
			}
		} else {
			return comObj.getScopeWindow();
		}
	} catch (ex) {
		console.error(ex);
		return null;
	}
};

/**
 * 현재 활성화된 실행 프레임 정보를 윈도우를 반환한다.
 * 
 * @date 2019.03.13
 * @memberOf com.win
 * @author InswaveSystems
 * @returns {Object} 현재 Active Window 정보 반환
 * @returns {String} activeinfo.type : 액티브 윈도우 타입 [P : 팝업, T: 탭컨텐츠, W: 윈도우컴포넌트]
 * @returns {Object} activeinfo.window : 액티브 윈도우 객체
 * @returns {String} activeinfo.programCd : 액티브 윈도우 프로그램 코드
 */
gcm.win.getActiveWindowInfo = function() {
	var activeInfo = {
		"type" : "", // T:Tabcontrol, W:windowContainer, P:popup
		"window" : "", // Window객체
		"programCd" : "" // 프로그램 코드 (팝업인경우는 예외)
	};

	var popupList = $p.getPopupWindowList();
	var popupWindow = null;

	if (popupList.length > 0) {
		for (var i = popupList.length - 1; i > -1; i--) {
			if (document.activeElement.id + "_wframe" === popupList[i].$p.getFrameId()) {
				popupWindow = $p.getPopupWindow(document.activeElement.id);
			}
		}
	} 
	
	if (popupWindow !== null) {
		// WFrame Popup 방식으로 오픈된 팝업 화면
		activeInfo["type"] = "P";
		activeInfo["programCd"] = popupWindow.$p.getMetaValue("meta_programId");
		activeInfo["window"] = popupWindow;
	} else if (typeof $p.top().scwin.getLayoutId === "function") {
		// TabControl 또는 WindowContainer를 통해서 오픈된 업무 화면
		activeInfo["type"] = $p.top().scwin.getLayoutId();
		if (activeInfo["type"] == "T") {
			var selectedTabId = $p.top().tac_layout.getSelectedTabID();
			var findProgramList = gcm.menuComp.getMatchedJSON("MENU_CD", selectedTabId, true);
			if (findProgramList.length > 0) {
				activeInfo["programCd"] = findProgramList[0].PROGRAM_CD;
			}
			activeInfo["window"] = $p.top().tac_layout.getWindow(selectedTabId);
		} else if (activeInfo["type"] == "M") {
			var selectedWindowId = $p.top().wdc_main.getSelectedWindowId();
			var findProgramList = gcm.menuComp.getMatchedJSON("MENU_CD", selectedWindowId, true);
			if (findProgramList.length > 0) {
				activeInfo["programCd"] = findProgramList[0].PROGRAM_CD;
			}
			activeInfo["window"] = $p.top().wdc_main.getWindow(selectedWindowId);
		}
	} else {
		
		// Window Popup 방식으로 오픈된 팝업 화면
		activeInfo["type"] = "P";
		activeInfo["programCd"] = $p.getMetaValue("meta_programId");
		activeInfo["window"] = $p.getFrame();
	}

	return activeInfo;
};


/**
 * 특정 메뉴를 오픈한다.
 * @date 2021.02.16
 * @param {String} menuNm 메뉴명 - 단위화면에서 해당 값으로 title을 설정한다.
 * @param {String} url 화면 파일 경로
 * @param {String} menuCode 메뉴코드 - DB에 저장되어있는 메뉴 코드
 * @param {Object} paramObj
 * @param {String} menuType 메뉴타입 ("SP" : 샘플화면)
 * @param {Boolean} closeable 닫기버튼 보여주기 여부
 * @author Inswave Systems
 * @example
 * gcm.win.openMenu("인사조회","/tmp/tmp01.xml","010001");
 */
gcm.win.openMenu = function($p, menuNm, url, menuCode, paramObj, menuType, closable) {
	// client에서 url 숨기기 메뉴일 경우에는 새 창으로 띄우기 적용 
	if (url == "/") {
		var url = document.location.href + "/";
		window.open(url, "", "width=1200, height=700, left=450, top=100");
	} else {
		menuCode = menuCode || "";
		var layout = $p.top().scwin.getLayoutId();
		var tmpUrl;
		var menuCodeParm = menuCode;
		var frameMode;
		var data;

		if (url.indexOf("/") !== 0) {
			url = "/" + url;
		}
		url = gcm.CONTEXT_PATH + url;

		if ((typeof paramObj !== "undefined") && (paramObj !== null)) {
			data = paramObj;
		} else {
			data = {};
		}	
		
		data.menuNm = menuNm;
		data.menuCode = menuCode;
		data.menuType = menuType;
		
		var frameMode = "";
		if (layout == "T") {
			var tabObj = { 
				closable : (closable == false) ? false : true, //탭 닫기 기능 제공
				openAction : "select", // exist 는 기존 탭을 갱신, new 는 항상 새로, select는 동일 id 가 존재하면 선택, last: 기존 tab을 마지막 tab으로 이동후 선택
				label : menuNm 
			};
			
			var contObj = {
				frameMode : "wframePreload",
				scope : true,
				src : url,
				alwaysDraw : false,
				title : menuNm,
				dataObject : { 
					type : "json", 
					name : "paramData", 
					data : data
				}
			};
			
			$p.top().tac_layout.addTab(menuCode, tabObj, contObj);

			// tabObj의 openAction의 last값의 동작 특이 사항으로 선택이 되지 않은 경우 선택하는 로직 추가
			if ($p.top().tac_layout.getSelectedTabID() !== menuCode) {
				var tabIndex = $p.top().tac_layout.getTabIndex(menuCode);
				if (tabIndex) {
					$p.top().tac_layout.setSelectedTabIndex(tabIndex);
				}
			}
		} else if (layout == "M") {
			var options = {
				title : menuNm,
				src : url,
				windowTitle : menuNm,
				windowId : menuCode,
				openAction : "existWindow",
				frameMode : "wframe",
				fixed : (closable == false) ? true : false,
				closeAction : function(title) {
					if (title === "메인") {
						return false;
					} else {
						return true;
					}
				},
				dataObject : { 
					type : "json", 
					name : "paramData", 
					data : data
				}
			}
			$p.top().wdc_main.createWindow(options);
		}
	}
};

// =============================================================================
/**
 * Top 영역의 전역 DataCollection 및 전역 데이터 제어와 관련된 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class data
 * @namespace gcm.data
 */
// =============================================================================

gcm.data = {};

/**
 * 유효성 검사 결과 메시지를 반환한다.
 *
 * @param {Object} valInfo 유효성 검사 옵션
 * @param {String} value 값
 * @return {Object} msgInfo 유효성 검사 결과 메시지 정보 <br/>
msgInfo.msgType {String} 메시지 타입("1" : 기본 검사 항목, "2" : 사용자 정의 함수(valInfo) 검사 항목) <br/>
msgInfo.message {String} 검사 결과 메시지 내용
 * @memberOf gcm.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
gcm.data._getValResultMsg(valInfo, value);
 */
gcm.data._getValResultMsg = function(valInfo, value) {
	var msgInfo = { msgType : "1", message : "" };

	if ((typeof valInfo.mandatory !== "undefined") && (valInfo.mandatory === true) && (value.length === 0)) {
		msgInfo.message = "필수 입력 항목 입니다.";
	} else if ((typeof valInfo.minLength !== "undefined") && (valInfo.minLength > 0) && (value.length < valInfo.minLength)) {
		msgInfo.message = "최소 길이 " + valInfo.minLength + "자리 이상으로 입력해야 합니다.";
	} else if ((typeof valInfo.minByteLength !== "undefined") && (valInfo.minByteLength > 0) && (com.str.getByteLength(value) < valInfo.minByteLength)) {
		msgInfo.message = "최소 길이 " + valInfo.minByteLength + "자리 이상으로 입력해야 합니다.";
	} else if ((typeof valInfo.isEmail !== "undefined") && (valInfo.isEmail) && (com.util.isEmpty(value) === false) && (com.str.isEmail(value) === false)) {
		msgInfo.message = "유효한 이메일 주소가 아닙니다.";
	} else if ((typeof valInfo.isPhone !== "undefined") && (valInfo.isPhone) && (com.util.isEmpty(value) === false) && (com.str.isPhone(value) === false)) {
		msgInfo.message = "유효한 전화번호가 아닙니다.";
	} else if (typeof valInfo.valFunc === "function") {
		var resultMsg = valInfo.valFunc(value);
		if (com.util.isEmpty(resultMsg) === false) {
			msgInfo.msgType = "2";
			msgInfo.message = resultMsg;
		}
	}

	return msgInfo;
};


/**
 * InputCalendar Validator를 수행한다.
 *
 * @param {String} value 입력된 날짜 문자열
 * @memberOf gcm.data
 * @date 2020.05.16
 * @author Inswave Systems
 */
gcm.data._validateInputCalendar = function(value, compId) {
	return value;
	try {
		var compObj = com.util.getComponent(compId);
		if (com.util.isEmpty(value) === false) {
			if (com.date.isDate(value) === false) {
				com.win.alert("날짜 형식이 올바르지 않습니다.");
			}
		}
		return value;
	} catch (ex) {
		return value;
	}
};


/**
 * 엑셀 다운로드 옵션을 설정한다.
 *
 * @date 2020.10.23
 * @param {Object} grdObj GridView Object
 * @param {Array} options JSON형태로 저장된 그리드의 엑셀 다운로드 옵션
 * @memberOf gcm.data
 * @author InswaveSystems
 * @example
gcm.data._downloadGridView(grdObj, options);
 */
gcm.data._downloadGridView = function(grdObj, options) {
	if (typeof options === "undefined") {
		options = {
			hiddenVisible: false
		}
	}

	var fileName = options.fileName;

	if (com.util.isEmpty(fileName)) {
		var dataCollectionId = com.data.getDataCollection(grdObj).id;
		if (com.util.isEmpty(dataCollectionId) === false) {
			fileName = dataCollectionId;
		} else {
			fileName = "excel_download";
		}
		
		if (options.fileType == undefined || options.fileType == "") {
			fileName = fileName + ".xlsx";
		} else {
			fileName = fileName + "." + options.fileType;
		}
		options.fileName = fileName;
	}

	fileName = fileName.toLowerCase();
	
	if (options.useProvider == "true") {
		options.dataProvider = "com.inswave.wrm.provider.ExcelDown";
	}
	if (options.useSplitProvider == "true") {
		options.splitProvider = "com.inswave.wrm.provider.ExcelSplitDown";
	}

	if (options.useProvider || options.useSplitProvider) {
		var colCnt = grdObj.getColumnCount();
		var columnsIDArr = new Array();

		for (var i = 0; i < colCnt; i++) {
			var isRemoveCol = false;
			if (typeof options.excludeColumns != "undefined" && options.excludeColumns != null && options.excludeColumns.length > 0) {
				for (var k = 0; k < options.excludeColumns.length; k++) {
					if (grdObj.getColumnID(i) == options.excludeColumns[k]) {
						isRemoveCol = true;
						break;
					}
				}
			}
			if (isRemoveCol) {
				continue;
			}
			columnsIDArr.push(grdObj.getColumnID(i));
		}

		var xmlDoc = WebSquare.xml.parse(options.providerRequestXml, false);
		WebSquare.xml.setValue(xmlDoc, "data/keyMap", columnsIDArr.join(","));
		options.providerRequestXml = WebSquare.xml.serialize(xmlDoc);
		delete options.useProvider;
		delete options.useSplitProvider;
	}
	
	// options.hiddenVisible=true 설정 시 화면내의 hidden컬럼을 removeColumns에 포함시켜서 엑셀 다운로드를 하지 않도록 한다.
	if ((typeof options.hiddenVisible === "undefined") || (options.hiddenVisible == false)) {
		var grdCnt = grdObj.getColCnt();

		var hiddenColIndex = [];
		for (var idx = 0; idx < grdCnt; idx++) {
			if (!grdObj.getColumnVisible(idx)) {
				hiddenColIndex.push(idx);
			}
		}

		if (hiddenColIndex.length > 0) {
			if ((typeof options.removeColumns !== "undefined") && (options.removeColumns.length > 0)) {
				options.removeColumns = options.removeColumns + "," + hiddenColIndex.join(',');
			} else {
				options.removeColumns = hiddenColIndex.join(',');
			}

			// 중복 요소 제거
			var _removeColumnArr = options.removeColumns.split(",");
			options.removeColumns = _removeColumnArr.reduce(function (a, b) {
				if (a.indexOf(b) < 0) {
					a.push(b);
				}
				return a;
			}, []).join(',');
		}
	}
};


// =============================================================================
/**
 * 서비스 통신과 관련된 공통 로직 제어와 관련된 함수를 작성한다.
 *
 * config.xml에 정의된 Submission PreSubmit, CallSubmitFunc, ExnteralHandler 함수를 gcm.sbm 객체 아래에 작성한다.
 *
 * @author Inswave Systems
 * @class sbm
 * @namespace gcm.sbm
 */
// =============================================================================

gcm.sbm = {};

/**
 * submission의 공통 설정에서 사용.
 * submisison 통신 직전 호출.
 * return true일 경우 통신 수행, return false일 경우 통신 중단
 *
 * @param {Object} sbmObj 서브미션 객체
 * @memberOf gcm.sbm
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} true or false
 */
gcm.sbm._preSubmitFunction = function(sbmObj) {
	if ((com.util.isEmpty(gcm.CONTEXT_PATH) === false) && (sbmObj.action.indexOf(gcm.CONTEXT_PATH) !== 0)) {
		sbmObj.action = gcm.CONTEXT_PATH + sbmObj.action;
	}
};


/**
 * 모든 submission의 defaultCallback - com.sbm_errorHandler 보다 먼저 수행됨. (400 Error) config.xml에 설정
 *
 * @param {Object} resObj responseData 객체
 * @param {Object} sbmObj Submission 객체
 * @memberOf gcm.sbm
 * @date 2020.05.16
 * @author Inswave Systems
 */
gcm.sbm._callbackSubmitFunction = function(resObj, sbmObj) {
	var scopeCom = gcm.win._getScope(sbmObj).com;

	// server와 연결을 할 수 없을 경우 responseStatusCode가 0으로 발생.
	if ((resObj.responseStatusCode < 100) || (resObj.responseStatusCode > 599)) {
		var detailStr = "HTTP STATUS INFO";
		detailStr += resObj.responseStatusCode;
		detailStr += " - URI:";
		detailStr += resObj.resourceUri;

		var msgObj = {
			statusCode : "E",
			errorCode : resObj.responseStatusCode,
			message : "서버와 연결할 수 없습니다. 자세한 내용은 관리자에게 문의하시기 바랍니다.",
			messageDetail : detailStr
		};

		scopeCom.sbm.resultMsg(msgObj);
		return false;
	}

	var rsJSON = resObj.responseJSON || null;
	if (rsJSON && rsJSON.rsMsg) {
		scopeCom.sbm.resultMsg(rsJSON.rsMsg);
	}
};


/**
 * submission중 에러가 발생한 경우 호출되는 함수 - 서버 오류(500 error)
 *
 * @param {Object} resObj responseData 객체
 * @memberOf gcm.sbm
 * @date 2020.05.16
 * @author Inswave Systems
 */
gcm.sbm._errorHandler = function(resObj) {
	var scopeCom = gcm.win._getScope(resObj.id).com;

	var detailStr = "HTTP STATUS INFO";
	detailStr += resObj.responseReasonPhrase;
	detailStr += " ";
	detailStr += resObj.responseStatusCode;
	detailStr += "URI:";
	detailStr += resObj.resourceUri;
	detailStr += resObj.responseBody;

	var msgObj = {
		statusCode : "E",
		errorCode : "E9998",
		message : "서버 오류입니다. 자세한 내용은 관리자에게 문의하시기 바랍니다.",
		messageDetail : detailStr
	};

	scopeCom.sbm.resultMsg(msgObj);
};


// =============================================================================
/**
 * 웹스퀘어 컴포넌트 제어, 엑셀 파일 업로드/다운로드, 파일 업로드/다운로드, 기타 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class util
 * @namespace gcm.util
 */
// =============================================================================

gcm.util = {};

/**
 * 접속한 사용자의 웹 브라우저 종류를 반환한다.
 *
 * @memberOf gcm.util
 * @date 2020.05.16
 * @return {String} 웹 브라우저 종류
 * @author  Inswave Systems
 * @example
var userAgent = gcm.util._getUserAgent();
 */
gcm.util._getUserAgent = function() {
	try {
		var agt = navigator.userAgent.toLowerCase();
		if (agt.indexOf("edg") != -1) {
			return 'Edge';
		} else if (agt.indexOf("chrome") != -1) {
			return 'Chrome';
		} else if (agt.indexOf("opera") != -1) {
			return 'Opera';
		} else if (agt.indexOf("staroffice") != -1) {
			return 'Star Office';
		} else if (agt.indexOf("webtv") != -1) {
			return 'WebTV';
		} else if (agt.indexOf("beonex") != -1) {
			return 'Beonex';
		} else if (agt.indexOf("chimera") != -1) {
			return 'Chimera';
		} else if (agt.indexOf("netpositive") != -1) {
			return 'NetPositive';
		} else if (agt.indexOf("phoenix") != -1) {
			return 'Phoenix';
		} else if (agt.indexOf("firefox") != -1) {
			return 'Firefox';
		} else if (agt.indexOf("safari") != -1) {
			return 'Safari';
		} else if (agt.indexOf("skipstone") != -1) {
			return 'SkipStone';
		} else if (agt.indexOf("msie") != -1 || agt.indexOf("trident") != -1) {
			return 'msie';
		} else if (agt.indexOf("netscape") != -1) {
			return 'Netscape';
		} else if (agt.indexOf("mozilla/5.0") != -1) {
			return 'Mozilla';
		} else {
			return '';
		}
	} catch (ex) {
		return '';
	}
};


/**
 * GET 방식으로 전달한 파라미터를 읽어 온다.
 *
 * @memberOf gcm.util
 * @date 2021.02.16
 * @param {String} param 파라미터 키
 * @param {String} url URL
 * @author 박상규
 * @return {Object} 파라미터 값
 * @example
var codeValue = gcm.util._getParameter("code");  // 특정 파라미터 값을 얻어오기
 */
gcm.util._getParameter = function(param, url) {
	if (com.util.isEmpty(url)) {
		url = unescape(location.href);
	}
	var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&");
	var value = "";

	for(var i = 0 ; i < paramArr.length ; i++) {
		var temp = paramArr[i].split("=");

		if(temp[0].toUpperCase() == param.toUpperCase()) {
			value = paramArr[i].split("=")[1];
			break;
		}
	}

	return value;
};


// =============================================================================
/**
 * 단축키 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class hkey
 * @namespace gcm.hkey
 */
// =============================================================================

gcm.hkey = {}

/**
 * 단축키 이벤트 관리 객체를 정의한다.
 *
 * @memberOf gcm.hkey
 * @date 2019.03.13
 * @author  Inswave Systems
 */
gcm.hkey.event = {
	loadingEvent : "Y",
	keydownEvent : function(e) {
		if (gcm.hkey.event.loadingEvent == "Y") {
			var exTag = [ "INPUT" ];
			var activeTag = document.activeElement.tagName;
			if (exTag.indexOf(activeTag) == -1) {
				gcm.hkey.event["checkEvent"].apply(this, [ e ]);
			}
		}
	},
	
	checkEvent : function(e) {
		try {
			var lastKey = e.which || e.keyCode;
			var complexKey = "";

			if (e.ctrlKey && e.altKey) {
				complexKey = "ctrlAltKey";
			} else if (e.ctrlKey && e.shiftKey) {
				complexKey = "ctrlShiftKey";
			} else if (e.altKey && e.shiftKey) {
				complexKey = "altShiftKey";
			} else {
				if (e.altKey) {
					complexKey = "altKey";
				} else if (e.ctrlKey) {
					complexKey = "ctrlKey";
				} else if (e.shiftKey) {
					complexKey = "shiftKey";
				} else {
					complexKey = "singleKey";
				}
			}

			// (Ctrl, Alt, Shift)가 아닌 lastKey가 인식될 경우
			if (e.key != "Control" && e.key != "Alt" && e.key != "Shift") {
				var codeKey = (complexKey != "") ? (complexKey + "_" + lastKey) : lastKey;
				var browser = "";

				// 브라우저에 따라 Key 값이 변형됨.
				if (browser == "FF") {
					// 파이어폭스 인경우.
					lastKey = e.key.toUpperCase();
					gcm.hkey.event.runEvent.apply(e, [ complexKey, codeKey, lastKey ]);
				} else {
					if (!isNaN(Number(lastKey))) {
						if (lastKey >= 112 && lastKey <= 123) {
							var f_number = [ "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12" ];
							lastKey = f_number[lastKey - 112];
						} else if (lastKey == 9) {
							lastKey = "TAB";
						} else if (!isNaN(Number(e.key)) && Number(e.key) > -1 && Number(e.key) < 10) {
							lastKey = e.key;
						} else {
							lastKey = String.fromCharCode(lastKey).toUpperCase();
						}

						gcm.hkey.event.runEvent.apply(e, [ complexKey, lastKey ]);
					}
				}
			}
		} catch (ex) {
			console.error(ex);
		}
	},

	// 단축키 실행 함수.
	runEvent : function(complex, eventKey) {
		try {
			var charCode = eventKey.charCodeAt(0);
			if ((charCode == 13) || (charCode == 39)) {
				return;
			}
			
			var checkShortcut = {};
			var programCd = "";

			var activeWindowInfo = gcm.win.getActiveWindowInfo();
			var findframe = activeWindowInfo["window"]; // 단축키가 감지된 프레임
			
			var searchEvent = com.data.getMatchedJSON(gcm.hkey.dataList.getID(), [
				{ columnId : "PROGRAM_CD", operator : "==", value : activeWindowInfo["programCd"], logical : "&&" },
				{ columnId : "COMPLEX_KEY", operator : "==", value : complex, logical : "&&" },
				{ columnId : "LAST_KEY", operator : "==", value : eventKey, logical : "&&" }
			]);
			
			if (typeof searchEvent == "undefined" || searchEvent.length == 0) {
				searchEvent = com.data.getMatchedJSON(gcm.hkey.dataList.getID(), [
					{ columnId : "PROGRAM_CD", operator : "==", value :'TOP', logical : "&&" },
					{ columnId : "COMPLEX_KEY", operator : "==", value : complex, logical : "&&" },
					{ columnId : "LAST_KEY", operator : "==", value : eventKey, logical : "&&" }
				]);
			}

			if (typeof searchEvent != "undefined" && searchEvent.length > 0) {
				var shortuctObj = searchEvent[0];
				if (shortuctObj["EVENT_TYPE"] === "F") {
					if (shortuctObj["EVENT_YN"] == "Y") {
						var funcTokenArr = shortuctObj["EVENT_TARGET"].split(".");
						var runFunction = findframe;
						if (funcTokenArr.length > 0) {
							for (var i = 0; i < funcTokenArr.length; i++) {
								runFunction = runFunction[funcTokenArr[i].trim()];
							}
						} else {
							runFunction = false;
						}

						if (typeof runFunction == "function") {
							runFunction();
						}
					}
				} else if (shortuctObj["EVENT_TYPE"] === "B") {
					if (shortuctObj["EVENT_YN"] == "Y") {
						var runComponent = findframe.$p.getComponentById(shortuctObj["EVENT_TARGET"].trim());
						if (runComponent) {
							runComponent.trigger("click");
						}
					}
				}
			}
			gcm.hkey.dataList.removeColumnFilterAll();
		} catch (ex) {
			console.error(ex);
		}
	},

	// 단축키 등록 추가 함수.
	addEvent : function(object) {
		var successFlag = false;
		try {
			var programCd = (object["PROGRAM_CD"] || "");
			var keyCodeObj = gcm.hkey.event._keyToken(object.shortCutKey.toUpperCase());
			var eventTarget = (object["EVENT_TARGET"] || "");
			var eventName = (object["EVENT_NAME"] || "");
			var eventDetail = (object["EVENT_DETAIL"] || "");
			var eventType = (object["EVENT_TYPE"].toUpperCase() == "B" || object["EVENT_TYPE"].toUpperCase() == "BUTTON") ? "B" : "F";
			var eventYn = (object["EVENT_YN"] || "Y");
			if (programCd == "" || eventTarget == "") {
				return false;
			} else {
				var isKey = com.data.getMatchedJSON(gcm.hkey.dataList.getID(), [
					{ columnId : "PROGRAM_CD", operator : "==", value : object["PROGRAM_CD"], logical : "&&" },
					{ columnId : "COMPLEX_KEY", operator : "==", value : keyCodeObj["COMPLEX_KEY"], logical : "&&" },
					{ columnId : "LAST_KEY", operator : "==", value : keyCodeObj["LAST_KEY"], logical : "&&" },
				]);
				
				if (isKey.length > 0) {
					var index = gcm.hkey.dataList.getRealRowIndex(0);
					gcm.hkey.dataList.setRowJSON(insertIdx, {
						"PROGRAM_CD" : programCd,
						"COMPLEX_KEY" : keyCodeObj["COMPLEX_KEY"],
						"LAST_KEY" : keyCodeObj["LAST_KEY"],
						"EVENT_TARGET" : eventTarget,
						"EVENT_NAME" : eventName,
						"EVENT_DETAIL" : eventDetail,
						"EVENT_TYPE" : eventType,
						"EVENT_YN" : eventYn
					}, true);
				} else {
					var insertIdx = gcm.hkey.dataList.insertRow();
					gcm.hkey.dataList.setRowJSON(insertIdx, {
						"PROGRAM_CD" : programCd,
						"COMPLEX_KEY" : keyCodeObj["COMPLEX_KEY"],
						"LAST_KEY" : keyCodeObj["LAST_KEY"],
						"EVENT_TARGET" : eventTarget,
						"EVENT_NAME" : eventName,
						"EVENT_DETAIL" : eventDetail,
						"EVENT_TYPE" : eventType,
						"EVENT_YN" : eventYn
					}, true);
				}
				gcm.hkey.dataList.removeColumnFilterAll();
				return true;
			}
		} catch (ex) {
			console.error(ex);
		}

		return WebSquare.util.getBoolean(successFlag);
	},

	_keyToken : function(keyCode) {
		try {
			var rtnVal = {
				"COMPLEX_KEY" : "",
				"LAST_KEY" : ""
			};
			var token = keyCode.split("+");
			// 단축키 등록.
			if (token.length > 2) {
				var firstKey = token[0].toUpperCase();
				var secondKey = token[1].toUpperCase();
				var lastKey = isNaN(Number(token[2])) ? token[2] : "NUM" + token[2];
				if (firstKey == "ALT") {
					rtnVal["COMPLEX_KEY"] = "altShiftKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else if (firstKey == "CTRL") {
					if (secondKey == "SHIFT") {
						rtnVal["COMPLEX_KEY"] = "ctrlShiftKey";
						rtnVal["LAST_KEY"] = lastKey;
					} else {
						rtnVal["COMPLEX_KEY"] = "ctrlAltKey";
						rtnVal["LAST_KEY"] = lastKey;
					}
				}
			} else if (token.length == 2) {
				var firstKey = token[0].toUpperCase();
				var lastKey = isNaN(Number(token[1])) ? token[1] : "NUM" + token[1];
				if (firstKey == "CTRL" || firstKey == "CTRLKEY") {
					rtnVal["COMPLEX_KEY"] = "ctrlKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else if (firstKey == "ALT" || firstKey == "ALTKEY") {
					rtnVal["COMPLEX_KEY"] = "altKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else if (firstKey == "SHIFT" || firstKey == "SHIFTKEY") {
					rtnVal["COMPLEX_KEY"] = "shiftKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else if (firstKey == "ALTSHIFTKEY") {
					rtnVal["COMPLEX_KEY"] = "altShiftKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else if (firstKey == "CTRLSHIFTKEY") {
					rtnVal["COMPLEX_KEY"] = "ctrlShiftKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else if (firstKey == "CTRLALTKEY") {
					rtnVal["COMPLEX_KEY"] = "ctrlAltKey";
					rtnVal["LAST_KEY"] = lastKey;
				} else {
					rtnVal["COMPLEX_KEY"] = "singleKey";
					rtnVal["LAST_KEY"] = lastKey;
				}
			} else {
				var lastKey = isNaN(Number(token[0])) ? token[0] : "NUM" + token[0];
				rtnVal["COMPLEX_KEY"] = "singleKey";
				rtnVal["LAST_KEY"] = lastKey;
			}
			return rtnVal;
		} catch (ex) {
			console.error(ex);
		}
	},

	// 단축키 등록 삭제 함수.
	delEvent : function(keyCode, options) {
		var rtnVal = true;
		try {
			if (keyCode.lastIndexOf("+") > 0) {
				keyCode = keyCode.toUpperCase();
				var _idx = keyCode.lastIndexOf("+");
				var lastKey = keyCode.slice(_idx + 1);
				var complex = keyCode.slice(0, _idx);
				var complexArr = "";
				if (!isNaN(Number(lastKey))) {
					lastKey = "NUM" + lastKey;
				}

				if (complex == "ALT" || complex == "ALTKEY") {
					complexArr = "altKey";
				} else if (complex == "CTRL" || complex == "CTRLKEY") {
					complexArr = "ctrlKey";
				} else if (complex == "SHIFT" || complex == "SHIFTKEY") {
					complexArr = "shiftKey";
				} else if (complex == "ALT+SHIFT" || complex == "ALTSHIFTKEY") {
					complexArr = "altShiftKey";
				} else if (complex == "CTRL+SHIFT" || complex == "CTRLSHIFTKEY") {
					complexArr = "ctrlShiftKey";
				} else if (complex == "CTRL+ALT" || complex == "CTRLALTKEY") {
					complexArr = "ctrlAltKey";
				} else if (complex == "SINGLE" || complex == "SINGLEKEY") {
					complexArr = "singleKey";
				}

				var isKey = com.data.getMatchedJSON(gcm.hkey.dataList.getID(), [
					{ columnId : "PROGRAM_CD", operator : "==", value : options["PROGRAM_CD"], logical : "&&" },
					{ columnId : "COMPLEX_KEY", operator : "==", value : complexArr, logical : "&&" },
					{ columnId : "LAST_KEY", operator : "==", value : lastKey, logical : "&&" }
				]);
				
				if (isKey.length > 0) {
					gcm.hkey.dataList.removeRow(0);
				}
				gcm.hkey.dataList.removeColumnFilterAll();
			}
		} catch (ex) {
			console.error(ex);
			rtnVal = false;
		}
		return rtnVal;
	}
};

/**
 * 사용자 지정 단축키 기능을 초기화한다.
 */
gcm.hkey.init = function($p) {
	try {
		var dataListCreationOpt = {
			id : "dlt_shortcutList",
			type : "dataList",
			option : {
				"baseNode" : "list",
				"repeatNode" : "map",
				"saveRemovedData" : "true"
			},
			columnInfo : [
				{"id" : "SHORTCUT_SEQ", "dataType" : "text", "name" : "단축키순번"},
				{"id" : "PROGRAM_CD", "dataType" : "text", "name" : "프로그램코드"},
				{"id" : "COMPLEX_KEY", "dataType" : "text", "name" : "복합키"},
				{"id" : "LAST_KEY", "dataType" : "text", "name" : "단축키"},
				{"id" : "EVENT_TYPE", "dataType" : "text", "name" : "이벤트타입"},
				{"id" : "EVENT_TARGET", "dataType" : "text", "name" : "이벤트타겟"},
				{"id" : "EVENT_DETAIL", "dataType" : "text", "name" : "이벤트설명"},
				{"id" : "EVENT_YN", "dataType" : "text", "name" : "사용여부"},
				{"id" : "EVENT_NAME", "dataType" : "text", "name" : "이벤트명"}
			]
		};
	
		$p.data.create(dataListCreationOpt);
		gcm.hkey.dataList = $p.getComponentById("dlt_shortcutList");
			
		var shortcutTargetElement = document;
		if (shortcutTargetElement.attachEvent) {
			shortcutTargetElement.detachEvent("keydown", gcm.hkey.event.keydownEvent);
			shortcutTargetElement.attachEvent("keydown", gcm.hkey.event.keydownEvent);
		} else {
			shortcutTargetElement.onkeydown = gcm.hkey.event.keydownEvent;
		}
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 단축키 사용 여부를 설정한다.
 * 
 * @date 2019.03.26
 * @memberOf com.win
 * @author Inswave Systems
 * @param {String} shortcutFlag 단축키 사용 여부 (Y: 사용, N: 미사용)
 */
gcm.hkey.isUseShortCut = function(shortcutFlag) {
	try {
		if (shortcutFlag == "Y") {
			gcm.hkey.event.loadingEvent = "Y";
			document.onkeydown = gcm.hkey.event["checkEvent"];
		} else {
			gcm.hkey.event.loadingEvent = "N";
			document.onkeydown = null;
		}
	} catch (ex) {
		console.error(ex);
	}
};

/**
 * 컴포넌트에 설정된 이벤트를 중지시킨다.
 * 
 * @date 2019.03.13
 * @memberOf com.win
 * @author Inswave Systems
 * @param {String} _targetComp : 설정 컴포넌트 객체ID
 * @param {Boolean} _flag : 이벤트 설정 여부 값 [default: false(실행), true(중지)]
 * @param {Object} _eventList : 중지 이벤트 리스트 값(배열) [default:null (모든 이벤트)]
 */
gcm.hkey.setEventPause = function(_targetComp, _flag, _eventList) {
	try {
		var comp = $p.getComponentById(_targetComp);
		var flag = WebSquare.util.getBoolean(_flag);
		var eventList = typeof _eventList != "undefined" ? _eventList : null;
		if (typeof comp == "undefined")
			return -1;

		if (comp.options.pluginName == "dataList") {
			comp.setBroadcast(flag);

			if (flag) {
				comp.broadcast({
					"linkedDataList" : [ "notifyDataChanged" ],
					"gridView" : [ "notifyDataChanged" ],
					"generalComp" : "both"
				});
			}

			comp.setEventPause(eventList, flag);
			for ( var i in comp.childCompHash) {
				var childComp = ngmf.object(comp.childCompHash[i].id);
				if (typeof childComp != "undefined") {
					childComp.setEventPause(eventList, flag);
				}
			}

			for ( var i in comp.refCompHash) {
				var refComp = ngmf.object(comp.refCompHash[i].id);
				if (typeof refComp != "undefined") {
					refComp.setEventPause(eventList, flag);
				}
			}

			if (flag) {
				WebSquare.event.fireEvent(comp, "ondataload");
			}
		} else {
			comp.setEventPause(eventList, !flag);
		}
	} catch (ex) {
		console.error(ex);
	}
};


// =============================================================================
/**
 * 외부 솔루션 연동과 관련된 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class ext
 * @namespace gcm.ext
 */
// =============================================================================

gcm.ext = {}

