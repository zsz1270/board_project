// =============================================================================
/**
 * 각 WFrame Scope별로 공유되는 Scope 전역 변수와 공통 함수를 작성한다.
 *
 * @date 2020.09.09
 * @author Inswave Systems
 * @namespace com
 * @description
1. com 및 하위 객체(ex. com.sbm, com.data, ..)는 WFrame Scope 업무 개발자가 호출해야할 공통 함수만을 정의한다.
2. com 및 하위 객체는 WFrame Scope 별로 생성되기 때문에 com 객체 내에 정의된 함수에서의 선언된 $p 객체는
  해당 함수를 호출한 화면의 WFrame Scope 내의 $p를 참조하게 된다.
3. com 및 하위 객체는 반드시 Empty Object 형태로 선언해야 한다.
4. Scope별로 생성되는 com 및 하위 객체에 데이터 저장을 위해서 변수(int, string, object, array)를 생성해야할 경우 
   객체 선언 시 변수를 생성하지 마시고, com 및 com 하위 객체에 선언된 함수 스크립트에서 생성하시기 바랍니다.
 
   // 잘못된 사용 예제
   var com.win = { windowSeq : 1 };
   
   // 올바른 사용 예제
   com.win.init = function() {
	   com.win.winodwSeq = 1;
   };
 */
// =============================================================================

var com = {};

// =============================================================================
/**
 * 통신 함수(submission 또는 ajax 통신)를 작성한다.
 *
 * @namespace com.sbm
 * @memberOf com
 * @author Inswave Systems
 */
// =============================================================================

com.sbm = {};

/**
 * 서버 통신 확장 모듈, Submission를 실행합니다.
 *
 * @memberOf com.sbm
 * @function com.sbm.execute
 * @date 2017.11.30
 * @param {Object} sbmObj submission 객체
 * @param {Object} requestData [Default : null, JSON, XML] 요청 데이터로 submission에 등록된 ref를 무시하고 현재의 값이 할당된다.
 * @param {Object} compObj [Default : null] 전송중 disable시킬 컴포넌트
 * @author InswaveSystems
 * @example 
// Submission ID : sbm_init 존재할 경우 
com.executeSubmission(sbm_Init); 
// return 예시) sbm_init 통신 실행

// Submission ID : sbm_init 존재하지 않을 경우 
com.executeSubmission(sbm_Init); 
// return 예시) alert - submission 객체[sbm_init]가 존재하지 않습니다.
 */
com.sbm.execute = function(sbmObj, requestData, compObj) {
	if (sbmObj) {
		var sbmObj = (typeof sbmObj == 'object') ? sbmObj : (typeof sbmObj == 'string') ? $p.getSubmission(sbmObj) : sbmObj;

		if (com.util.isEmpty(sbmObj.action)) {
			var alertMsg = com.data.getMessage("MSG_CM_00002", "action");
			com.win.alert(alertMsg);
			return false;
		}
		
		$p.executeSubmission(sbmObj, requestData, compObj);
	}
};


/**
 * Submission를 동적으로 생성해서 실행합니다.
 *
 * @memberOf com.sbm
 * @function com.sbm.executeDynamic
 * @date 2020.05.16
 * @param {Object} options com.sbm.create의 options 참고
 * @param {Object} requestData 요청 데이터
 * @param {Object} obj 전송중 disable시킬 컴퍼넌트
 * @author Inswave Systems
 * @example
var searchCodeGrpOption = {
	 id : "sbm_searchCodeGrp",
	 action : "serviceId=CD0001&action=R",
	 target : 'data:json,{"id":"dlt_codeGrp","key":"data"}',
	 submitDoneHandler : scwin.searchCodeGrpCallback, isProcessMsg : false };
com.sbm.executeDynamic(searchCodeGrpOption);
 */
com.sbm.executeDynamic = function(options, requestData, obj) {
	var submissionObj = com.util.getComponent(options.id);

	if (submissionObj === null) {
		com.sbm.create(options);
		submissionObj = com.util.getComponent(options.id);
	} else {
		$p.deleteSubmission(options.id);
		com.sbm.create(options);
		submissionObj = com.util.getComponent(options.id);
	}

	com.sbm.execute(submissionObj, requestData, obj);
};

/**
 * workflow를 실행합니다.
 *
 * @date 2020.05.16
 * @param {Object} options workflow 객체 or workflow 아이디
 * @memberOf com.sbm
 * @author Inswave Systems
 * @example
com.sbm.executeWorkflow(wkf_basicInfo);
 */
com.sbm.executeWorkflow = function(workflowObj) {
	$p.executeWorkflow(workflowObj);
};


/**
 * Submission 객체를 동적으로 생성한다.
 *
 * @date 2020.05.16
 * @param {Object} options Submission 생성 옵션 JSON 객체
 * @param {String} options.id submission 객체의 ID. 통신 모듈 실행 시 필요.
 * @param {String} options.ref 서버로 보낼(request) DataCollection의 조건 표현식.(조건에 때라 표현식이 복잡하다) 또는 Instance Data의 XPath.
 * @param {String} options.target 서버로 응답(response) 받은 데이터가 위치 할 DataCollection의 조건 표현식. 또는 Instance Data의 XPath.
 * @param {String} options.action 통신 할 서버 측 URI.(브라우저 보안 정책으로 crossDomain은 지원되지 않는다.)
 * @param {String} options.method [default: get, post, urlencoded-post]
 * - get : 파라메타를 url에 붙이는 방식 (HTML과 동일).
 * - post : 파라메타를 body 구간에 담는 방식 (HTML과 동일)
 * - urlencoded-post : urlencoded-post.
 * @param {String} options.mediatype [default: application/xml, text/xml, application/json, application/x-www-form-urlencoded]
 * application/x-www-form-urlencoded 웹 form 방식(HTML방식). application/json : json 방식. application/xml : XML 방식. text/xml : xml방식
 * (두 개 차이는 http://stackoverflow._com/questions/4832357 참조)
 * @param {String} options.mode [default: synchronous, synchronous] 서버와의 통신 방식.  asynchronous:비동기식.  synchronous:동기식
 * @param {String} options.encoding [default: utf-8, euc-kr, utf-16] 서버 측 encoding 타입 설정 (euc-kr/utf-16/utf-8)
 * @param {String} options.replace [default: none, all, instance] action으로부터 받은 response data를 적용 구분 값.
 *   - all : 문서 전체를 서버로부터 온 응답데이터로 교체.
 *   - instance : 해당되는 데이터 구간.
 *   - none : 교체안함.
 * @param {String} options.processMsg submission 통신 중 보여줄 메세지.
 * @param {String} options.errorHandler submission오류 발생 시 실행 할 함수명.
 * @param {String} options.customHandler submssion호출 시 실행 할 함수명.
 * @param {requestCallback} options.submitHandler {script type="javascript" ev:event="xforms-submit"} 에 대응하는 함수.
 * @param {requestCallback} options.submitDoneHandler {script type="javascript" ev:event="xforms-submit-done"} 에 대응하는 함수
 * @param {requestCallback} options.submitErrorHandler {script type="javascript" ev:event="xforms-submit-error"} 에 대응하는 함수
 * @memberOf com.sbm
 * @author Inswave Systems
 * @example
com.sbm.create(options);
 */
com.sbm.create = function(options) {
	var ref = options.ref || "";
	var target = options.target || "";
	var action = options.action; // ajax 서비스 요청 주소
	var mode = options.mode || gcm.DEFAULT_OPTIONS_MODE; // asynchronous(default)/synchronous
	var mediatype = options.mediatype || gcm.DEFAULT_OPTIONS_MEDIATYPE; // application/x-www-form-urlencoded
	var method = (options.method || "post").toLowerCase(); // get/post/put/delete
	var processMsg = options.processMsg || "";
	var instance = options.instance || "none";

	var submitHandler = (typeof options.submitHandler === "function") ? options.submitHandler
			: ((typeof options.submitHandler === "string") ? $p.id + options.submitHandler : "");
	var submitDoneHandler = (typeof options.submitDoneHandler === "function") ? options.submitDoneHandler
			: ((typeof options.submitDoneHandler === "string") ? $p.id + options.submitDoneHandler : "");
	var submitErrorHandler = (typeof options.submitErrorHandler === "function") ? options.submitErrorHandler
			: ((typeof options.submitErrorHandler === "string") ? $p.id + options.submitErrorHandler : "");

	var resJson = null;

	if ((options.isProcessMsg === true) && (processMsg === "")) {
		processMsg = "해당 작업을 처리중입니다";
	} else if (options.isProcessMsg === false) {
		processMsg = "";
	}
	
	var submissionObj = {
		"id" : options.id, // submission 객체의 ID. 통신 모듈 실행 시 필요.
		"ref" : ref, // 서버로 보낼(request) DataCollection의 조건 표현식.(조건에 때라 표현식이 복잡하다) 또는 Instance Data의 XPath.
		"target" : target, // 서버로 응답(response) 받은 데이터가 위치 할 DataCollection의 조건 표현식. 또는 Instance Data의 XPath.
		"action" : action, // 통신 할 서버 측 URI.(브라우저 보안 정책으로 crossDomain은 지원되지 않는다.)
		"method" : method, // [default: post, get, urlencoded-post] get:파라메타를 url에 붙이는 방식 (HTML과 동일).
						   // post:파라메타를 body 구간에 담는 방식 (HTML과 동일). urlencoded-post:urlencoded-post.
		"mediatype" : mediatype, // application/json
		"encoding" : "UTF-8", // [default: utf-8, euc-kr, utf-16] 서버 측 encoding 타입 설정 (euc-kr/utf-16/utf-8)
		"mode" : mode, // [default: synchronous, synchronous] 서버와의 통신 방식. asynchronous:비동기식. synchronous:동기식
		"processMsg" : processMsg, // submission 통신 중 보여줄 메세지.
		"submitHandler" : submitHandler,
		"submitDoneHandler" : submitDoneHandler,
		"submitErrorHandler" : submitErrorHandler
	};

	$p.createSubmission(submissionObj);
};


/**
 * 서버에서 전송한 통신 결과 코드를 반환한다.
 *
 * @date 2020.05.16
 * @private
 * @param {Object} e submission 후 callback의 상태값
 * @memberOf com.sbm
 * @author Inswave Systems
 * @return {String} 상태 코드
 * @example
// 통신결과 코드가 있을 경우
com.sbm.getResultCode(e);
// return 예시) E || S || W

// 통신결과 코드가 없을 경우
com.sbm.getResultCode(e);
// return 예시) 웹스퀘어5 로그창 - 결과 상태 메세지가 없습니다.: com.sbm.getResultCode
 */
com.sbm.getResultCode = function(e) {
	var rsCode = gcm.MESSAGE_CODE.STATUS_ERROR;
	try {
		rsCode = e.responseJSON.rsMsg.statusCode;
	} catch (ex) {
		console.error("결과 상태 메세지가 없습니다.", ex);
	}

	return rsCode;
};


/**
 * 서버에서 전송한 통신 결과 상태 메시지를 반환한다.
 *
 * @date 2021.02.19
 * @private
 * @param {Object} e submission 후 callback의 상태값
 * @memberOf com.sbm
 * @author Inswave Systems
 * @return {String} 상태 메시지
 * @example
// 통신결과 코드가 있을 경우
com.sbm.getStatusMessage(e);

// 통신결과 코드가 없을 경우
com.sbm.getStatusMessage(e);
 */
com.sbm.getStatusMessage = function(e) {
	try {
		return e.responseJSON.rsMsg.statusMsg;
	} catch (ex) {
		console.error("결과 상태 메세지가 없습니다.", ex);
		return "";
	}
};


/**
 * statusCode값에 따라 message를 출력한다.
 *
 * @date 2020.05.16
 * @private
 * @param {Object} resultData 상태코드값 및 메시지가 담긴 JSON.
 * @param {String} resultData.message 메시지
 * @param {String} resultData.statusCode 상태코드값
 * @memberOf com.sbm
 * @author Inswave Systems
 */
com.sbm.resultMsg = function(resultData) {
	if (com.util.isEmpty(resultData.statusCode)) {
		return;
	}
	
	var message = resultData.message || resultData.statusMsg || "";
	var msgCode = gcm.MESSAGE_CODE;

	switch (resultData.statusCode) {
		case msgCode.STATUS_ERROR:
			if (resultData.errorCode == "E0001") {
				var alertMsg = com.data.getMessage("MSG_CM_00003", message);
				com.win.alert(alertMsg, "com.win.goHome");
			} else if (resultData.errorCode == "E9998") { // HTTP ERROR ex) 404,500,0
				com.win.alert(message);
			} else if (resultData.errorCode == "E9999") { // business logic error
				com.win.alert(message);
			} else if (com.util.isEmpty(message) === false) {
				com.win.alert(message);
			}
			break;
		case "E":
			if (com.util.isEmpty(message) === false) {
				com.win.alert(message);
			}
			break;
		case "S" :
			if (com.util.isEmpty(message) === false) {
				com.win.showToastMessage(gcm.MESSAGE_CODE.STATUS_SUCCESS, message); 
			}
			break;			
		case "I" :
			com.win.showToastMessage(gcm.MESSAGE_CODE.STATUS_INFO, message); 
			break;
		case "N":
			com.win.alert(com.data.getMessage("MSG_CM_00004"));
			break;
	}
};

/**
 * submission action 을 변경한다.
 *
 * @date 2020.05.16
 * @private
 * @memberOf com.sbm
 * @param {Object} sbmObj 서브미션 객체
 * @param {String} sbmAction 서브미션 action
 * @author Inswave Systems
 * @example com.sbm.setAction(sbm_search,"/cust/crgd/v1/user")
 */
com.sbm.setAction = function(sbmObj, sbmAction) {
	try {
		if (!com.util.isEmpty(sbmObj)) {
			sbmObj.isDefultSubmissionAction = null;
			sbmObj.action = sbmAction || "";
		}
	} catch(ex) {
		console.error(ex);
	}
};

// =============================================================================
/**
 * 공통 코드 & 메세지, DataCollection 제어, 글로벌 데이터 제어(gcm의 함수를 호출), 화면 간 데이터 전달, 데이터 유효성 검사 함수를 작성한다.
 *
 * @date 2020.05.16
 * @author Inswave Systems
 * @class data
 * @namespace com.data
 */
// =============================================================================

com.data = {};

/**
 * 코드성 데이터와 컴포넌트의 nodeSet(아이템 리스트)연동 기능을 제공한다.
 *
 * cdGrp별로 JSON객체를 생성하여 array에 담아 첫번째 파라메터로 넘겨준다.
 *
 * @date 2020.05.16
 * @param {Object} codeOptions {"cdGrp" : "코드그룹", "compID" : "적용할 컴포넌트명"}
 * @param {requestCallback} callbackFunc 콜백 함수
 * @memberOf com.data
 * @author Inswave Systems
 * @example
var codeOptions = [ { cdGrp : "00001", compID : "sbx_Duty" },
					{ cdGrp : "00002", compID : "sbx_Postion" },
					{ cdGrp : "00021", compID : "sbx_JoinClass" },
					{ cdGrp : "00005", compID : "sbx_CommCodePart1, sbx_CommCodePart2"},
					{ cdGrp : "00024", compID : "grd_CommCodeSample:JOB_CD"} ];
com.data.setCommonCode(codeOptions);
 */
com.data.setCommonCode = function(codeOptions, callbackFunc) {
	var codeOptionsLen = 0;

	if (codeOptions) {
		codeOptionsLen = codeOptions.length;
	} else {
		console.error("=== com.setCommonCode Parameter Type Error ===\nex) com.setCommonCode([{\"code:\":\"04\",\"compID\":\"sbx_Gender\"}],\"scwin.callbackFunction\")\n===================================");
		return;
	}

	var i, j, codeObj, dltId, dltIdArr = [], paramCode = "", compArr, compArrLen, tmpIdArr;
	var dataListOption = _getCodeDataListOptions(gcm.COMMON_CODE_INFO.FILED_ARR);

	for (i = 0; i < codeOptionsLen; i++) {
		codeObj = codeOptions[i];

		try {
			dltId = gcm.DATA_PREFIX + codeObj.code;
			if (typeof gcm.commonCodeList[dltId] === "undefined") {
				dltIdArr.push(dltId);

				if (i > 0) {
					paramCode += ",";
				}
				paramCode += codeObj.code;
				dataListOption.id = dltId;
				$p.data.create(dataListOption); // 동일한 id의 DataCollection이 존재할 경우, 삭제 후 재생성함
			} else {
				dataListOption.id = dltId;
				$p.data.create(dataListOption);
				var dataListObj = $p.getComponentById(dataListOption.id);
				dataListObj.setJSON(com.util.getJSON(gcm.commonCodeList[dltId]));
			}

			if (codeObj.compID) {
				compArr = (codeObj.compID).replaceAll(" ", "").split(",");
				compArrLen = compArr.length;
				
				for (j = 0; j < compArrLen; j++) {
					tmpIdArr = compArr[j].split(":");
					
					if (tmpIdArr.length === 1) {
						var comp = $p.getComponentById(tmpIdArr[0]);
						comp.setNodeSet("data:" + dltId, gcm.COMMON_CODE_INFO.LABEL, gcm.COMMON_CODE_INFO.VALUE);
					} else {
						var gridObj = $p.getComponentById(tmpIdArr[0]);
						gridObj.setColumnNodeSet(tmpIdArr[1], "data:" + dltId, gcm.COMMON_CODE_INFO.LABEL, gcm.COMMON_CODE_INFO.VALUE);
					}
				}
			}
		} catch (ex) {
			console.error(ex);
		}
	}

	var searchCodeGrpOption = {
		id : "_sbm_searchCode",
		action : "/common/selectCodeList",
		target : "data:json," + com.str.serialize(dltIdArr),
		isProcessMsg : false
	};

	searchCodeGrpOption.submitDoneHandler = function(e) {
		for (codeGrpDataListId in e.responseJSON) {
			if (codeGrpDataListId.indexOf(gcm.DATA_PREFIX) > -1) {
				gcm.commonCodeList[codeGrpDataListId] = com.str.serialize(e.responseJSON[codeGrpDataListId]);
			}
		}

		if (typeof callbackFunc === "function") {
			callbackFunc();
		}
	}

	if (paramCode !== "") {
		com.sbm.create(searchCodeGrpOption);
		var sbmObj = com.util.getComponent(searchCodeGrpOption.id);
		var reqData = {
			"dma_commonCode" : {
				"GRP_CD" : paramCode,
				"DATA_PREFIX" : gcm.DATA_PREFIX
			}
		};
		sbmObj.setRequestData(reqData);
	} else {
		if (typeof callbackFunc === "function") {
			callbackFunc();
		}
	}

	// dataList를 동적으로 생성하기 위한 옵션 정보를 반환한다.
	function _getCodeDataListOptions(infoArr) {
		var option = {
			"type" : "dataList",
			"option" : {
				"baseNode" : "list",
				"repeatNode" : "map"
			},
			"columnInfo" : []
		};

		for ( var idx in infoArr) {
			option.columnInfo.push({
				"id" : infoArr[idx]
			});
		}
		return option;
	}
};


/**
 * 특정 공통 코드를 저장하는 DataList 객체를 반환한다.
 * 
 * @description 서버에서 전달된 데이터가 아닌 화면 상에서 데이터 가공이 필요한 경우 DataList 객체를 전달 받아서 필터링하거나 데이터를 조작할 수 있다.
 * @date 2020.06.16
 * @param {String} cdGrp 코드그룹
 * @memberOf com.data
 * @author Inswave Systems
 * @example
var comDataList1 = com.data.getCommonCodeDataList("00024");
comDataList1.setColumnFilter( 
    {type:'regExp', colIndex:'COM_CD', key:/01|02|04|05/gi, condition:'and'}
);
 */
com.data.getCommonCodeDataList = function(cdGrp) {
    return com.util.getComponent(gcm.DATA_PREFIX + cdGrp);
};


/**
 * 공통 코드를 로딩하는 Submission을 실행한다.
 * 
 * @date 2020.06.16
 * @param {String} cdGrp 코드그룹
 * @memberOf com.data
 * @author Inswave Systems
 * @description 
scwin.onpageload 이벤트에 정의된 com.data.setCommonCode 함수를 통해서 생성된 공통 코드 조회 Submission은 scwin.ondataload 함수가 실행되기 전에 
UI 공통 프레임워크 내에서 자동으로 실행시켜 준다.
하지만, TabControl의 alwaysDraw=false 등의 옵션 적용 등으로 인해서 화면이 로딩된 이후에 어떤 이벤트 시점 이후에 공통 코드를 로딩하려면
com.data.executeCommonCode() 함수를 실행하면 된다.
 * @example
var codeOptions = [ { code : "00002", compID : "sbx_Postion" },
                    { code : "00024", compID : "grd_CommCodeSample:JOB_CD"} ];
com.data.setCommonCode(codeOptions);
com.data.executeCommonCode();
 */
com.data.executeCommonCode = function() {
    var sbmSearchCode = com.util.getComponent("_sbm_searchCode");
    com.sbm.execute(sbmSearchCode);
};


/**
 * 파라미터를 읽어 온다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {String} 파라미터 키
 * @author Inswave Systems
 * @return {Object} 파라미터 값
 * @example
var code = com.data.getParameter("code");  // 특정 파라미터 값을 얻어오기
var param = com.data.getParameter();	   // 전체 파라미터 값을 얻어오기
 */
com.data.getParameter = function (paramKey) {
	var paramData = "";
	try {
		paramData = $p.getParameter("paramData");
		if ((com.util.isEmpty(paramData) === false) && com.util.isJSON(paramData)) {
			if (com.util.isEmpty(paramKey) === false) {
				return paramData[paramKey];
			} else {
				return paramData;
			}
		} else {
			paramData = getUrlParameter("paramData");
			if (com.util.isEmpty(paramData) === false) {
				paramData = com.util.getJSON(WebSquare.text.BASE64Decode(paramData));
				if (com.util.isEmpty(paramKey) === false) {
					return paramData[paramKey];
				} else {
					return paramData;
				}
			}
		}
	} catch (ex) {
		console.error(ex);
		return "";
	}
	
	return paramData;
	
	function getUrlParameter(paramKey) {
		var param = [];
		var paramArray = location.search.split(/[\&\?\#]/);
		for (var i = 0; i < paramArray.length; i++) {
			if (com.util.isEmpty(paramArray[i]) === false) {
				var valueIdx = paramArray[i].indexOf("=");
				if (valueIdx > 0) {
					var key = paramArray[i].substring(0, valueIdx);
					var value = paramArray[i].substring(valueIdx + 1);
					if (key === paramKey) {
						return value;
					}
				}
			}
		}
	}
};


/**
 * 특정 컴포넌트에 바인된 DataList나 DataMap의 컬럼 이름을 반환한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {Object} comObj 컴포넌트 객체
 * @return {String} 컬럼명
 * @example
com.data.getColumnName(ibx_name);
 */
com.data.getColumnName = function (comObj) {
	try {
		if ((typeof comObj.getRef) === "function") {
			var ref = comObj.getRef();
			var refArray = ref.substring(5).split(".");
			var dataCollectionName = refArray[0];
			var columnId = refArray[1];

			if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
				var dataCollection = comObj.getScopeWindow().$p.getComponentById(dataCollectionName);
				var dataType = dataCollection.getObjectType().toLowerCase();
				if (dataType === "datamap") {
					return dataCollection.getName(columnId);
				} else if (dataType === 'datalist') {
					return dataCollection.getColumnName(columnId);
				}
			} else {
				return "";
			}
		}
	} catch (ex) {
		console.error(ex);
	} finally {
		dataCollection = null;
	}
};


/**
 * 특정 컴포넌트에 바인된 DataList나 DataMap의 정보를 반환한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {Object} comObj callerObj 컴포넌트 객체
 * @returns {Object} dataCollection정보
 * @example
com.data.getDataCollection(ibx_applUserId);
 */
com.data.getDataCollection = function(comObj) {
	try {
		if ((typeof comObj !== "undefined") && (typeof comObj.getRef === "function")) {
			if (comObj.getPluginName() === "gridView") {
				return comObj.getDataListInfo();
			} else {
				var ref = comObj.options.ref;
				if ((typeof ref !== "undefined") && (ref !== "")) {
					var refArray = ref.substring(5).split(".");
					if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
						var dataObjInfo = {};
						dataObjInfo.runtimeDataCollectionId = comObj.getScopeWindow().$p.getFrameId() + "_" + refArray[0];
						dataObjInfo.dataColletionId = refArray[0];
						dataObjInfo.columnId = refArray[1];
						return dataObjInfo;
					} else {
						return null;
					}
				} else {
					return null;
				}
			}
		}
	} catch (e) {
		console.error("[com.data.getDataCollection] Exception :: " + e.message);
	} finally {
		dataCollection = null;
	}
};


/**
 * 공통 메시지에 코드에 해당하는 공통 메시지 코드를 반환합니다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {String} sysMsgId 메시지 ID , Array 형식인 경우는 첫번째 인덱스가 sysMsgId가 되고 두번째 인덱스부터 치환문자가 됨
 * @param {String} arguments 메시지 치환 문자열 (메시지 ID에서 치환이 필요한 만큼 문자열 매개변수를 전달함)
 * @author Inswave Systems
 * @example
com.data.getMessage("MSG_CM_00001");  // "변경된 데이터를 저장하시겠습니까?"
com.data.getMessage("MSG_CM_00002", com.str.attachPostposition("전화번호"));  // "전화번호는 필수입력값입니다."
com.data.getMessage("MSG_CM_00003", "세션이 종료되어");  // "세션이 종료되어 로그인 화면으로 이동하겠습니다."
 */
com.data.getMessage = function(msgId) {
	var message = ""
	if (com.util.isEmpty(msgId) === false) {
		message = WebSquare.WebSquareLang[msgId];
	}

	if (com.util.isEmpty(message) === false) {
		var tmpMessage = message;

		if (arguments.length > 1) {
			for(var i = 1; i < arguments.length; i++) {
				tmpMessage = (tmpMessage.indexOf("$[" + (i-1) + "]") != -1) ? com.str.replaceAll(tmpMessage, "$[" + (i-1) + "]", arguments[i]) : tmpMessage;
			}
			return tmpMessage;
		} else {
			return tmpMessage;
		}
	} else {
		return "";
	}
};


/**
 * DataCollection 객체의 변경된 데이터가 있는지 검사한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {Object} dcObjArr DataCollection 또는 배열
 * @author Inswave Systems
 * @returns {Boolean} 검사결과 (true or false)
 * @example
if (com.data.validateGridView(grd_indexPage, valInfo) && com.data.isModified(dlt_grdAllData)) {
	com.win.confirm("저장하시겠습니까?", "scwin.saveData");
};
 */
com.data.isModified = function (dcObjArr) {
	var result = false;
	
	if (com.util.getObjectType(dcObjArr) === "array") {
		for (var idx in dcObjArr) {
			if (com.util.getObjectType(dcObjArr[idx]) === "object") {
				if (isModified(dcObjArr[idx]) === true) {
					result = true;
				}
			}
		}
	} else if (com.util.getObjectType(dcObjArr) === "object") {
		result = isModified(dcObjArr);
	}
	
	return result;

	function isModified(dcObj) {
		if ((typeof dcObj !== "undefined") && (typeof dcObj !== null)) {
			var modifiedIndex = dcObj.getModifiedIndex();
			if (modifiedIndex.length === 0) {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
};


/**
 * DataList의 데이터를 엑셀 파일로 저장한다.
 *
 * @param {Object}	options.common							JSON형태로 저장된 dataList의 엑셀 다운로드 옵션
 * @param {String}	options.common.fileName					[default: excel.xls] 다운로드하려는 파일의 이름
 * @param {Boolean}   options.common.showProcess			[default: true] 다운로드 시 프로세스 창을 보여줄지 여부
 * @param {String}	options.common.multipleSheet			[default: true] 다운로드시 dataList별 sheet분리 출력유무
 * @param {Object}	options.common.printSet					JSON형태로 저장된 Excel Print관련 설정
 * @param {String}	options.common.printSet.fitToPage		[default: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
 * @param {String}	options.common.printSet.landScape		[default: false] 엑셀 프린터 출력시 가로 방향 출력 유무
 * @param {String}	options.common.printSet.fitWidth		[default: 1] 엑셀 프린터 출력시 용지너비
 * @param {String}	options.common.printSet.fitHeight		[default: 1] 엑셀 프린터 출력시 용지높이
 * @param {String}	options.common.printSet.scale			[default: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
 * @param {String}	options.common.printSet.pageSize		[default: A4] 엑셀 프린터 출력시 인쇄 용지 크기 (예: "A3", "A4", "A5", "B4") 단, fitToPage: true 인 경우에만 유효.
 * @param {Array}	 [options.excelInfo]					JSON형태로 저장된 dataList의 옵션 정보
 * @param {String}	options.excelInfo.dataListId			[default: 없음] excel의 sheet에 저장한 DataList의 아이디
 * @param {String}	options.excelInfo.sheetName				[default: sheet] excel의 sheet의 이름
 * @param {String}	options.excelInfo.removeColumns			[default: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
 * @param {String}	options.excelInfo.foldColumns			[default: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
 * @param {Number}	options.excelInfo.startRowIndex			[default: 0] excel파일에서 dataList의 데이터가 시작되는 행의 번호(헤더 포함)
 * @param {Number}	options.excelInfo.startColumnIndex		[default: 0] excel파일에서 dataList의 데이터가 시작되는 열의 번호(헤더 포함)
 * @param {String}	options.excelInfo.headerColor			[default: #33CCCC] excel파일에서 dataList의 header부분의 색
 * @param {String}	options.excelInfo.headerFontName		[default: 없음] excel파일에서 dataList의 header부분의 font name
 * @param {String}	options.excelInfo.wframeId				[default: 현재 WFrame Id] DataList가 위치한 WFrame Id 정보
 * @param {Array}	 options.excelInfo.infoArr				dataList에 대한 내용을 추가로 다른 셀에 표현하는 경우 사용하는 배열
 * @param {Number}	options.excelInfo.infoArr.rowIndex		내용을 표시할 행번호
 * @param {Number}	options.excelInfo.infoArr.colIndex		내용을 표시할 열번호
 * @param {Number}	options.excelInfo.infoArr.rowSpan		병합할 행의 수
 * @param {Number}	options.excelInfo.infoArr.colSpan		병합할 열의 수
 * @param {String}	options.excelInfo.infoArr.text			표시할 내용
 * @param {String}	options.excelInfo.infoArr.textAlign		표시할 내용의 정렬 방법 (left, center, right)
 * @param {String}	options.excelInfo.infoArr.fontSize		font size 설정 ( ex) "20px" )
 * @param {String}	options.excelInfo.infoArr.fontName		font name 설정
 * @param {String}	options.excelInfo.infoArr.color			font color 설정 ( ex) "red" )
 * @param {String}	options.excelInfo.infoArr.fontWeight	font weight 설정 ( ex) "bold" )
 * @param {String}	options.excelInfo.infoArr.drawBorder	cell의 border 지정 ( ex) true )
 * @param {String}	options.excelInfo.infoArr.wordWrap		cell의 줄 바꿈 기능 ( ex) "true" )
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example

// id가 a,b,c,d,e인 5개 컬럼이 존재하는 DataList
var options = {
	common: {
		fileName : "excel_data.xlsx",
		showProcess : true,
		multipleSheet : true,
		printSet : {
			landScape : "true",
			fitToPage : "true",
			fitWidth : "1",
			fitHeight : "1",
			scale : "222"
		}
	},
	excelInfo: [
		{
			dataListId : "dlt_data1",
			sheetName : "첫번째 sheet",
			removeColumns : "1,3",
			foldColumns : "2",
			startRowIndex : 3,
			startColumnIndex : 0,
			headerColor : "#DBEEF3",
			bodyColor : "#92CDDC",
			infoArr : [
				{
					rowIndex : 1, colIndex : 3, rowSpan : 1, colSpan : 2, text : "데이터표시" , textAlign : "center"
				}
			]
		},
		{
			dataListId : "dlt_data2",
			sheetName : "두번째 sheet",
			removeColumns : "1,3",
			foldColumns : "2",
			startRowIndex : 3,
			startColumnIndex : 0,
			headerColor : "#DBEEF3",
			bodyColor : "#92CDDC",
			infoArr : [
				{
					rowIndex : 1, colIndex : 3, rowSpan : 1, colSpan : 2, text : "데이터표시" , textAlign : "center"
				}
			]
		}
	]
};
com.data.downloadMultipleDataList(options);

 */
com.data.downloadMultipleDataList = function (optionsParam, infoArrParam) {
	var options = {
		common: {
			fileName : optionsParam.common.fileName || "dataList.xlsx",
			showProcess :  optionsParam.common.showProcess || true,
			autoSizeColumn : optionsParam.common.autoSizeColumn || true,
			multipleSheet : optionsParam.common.multipleSheet || true,
			printSet : optionsParam.common.printSet || {}
		},
		excelInfo: []
	};

	if (optionsParam.excelInfo.length > 0) {
		var excelInfoCount = optionsParam.excelInfo.length;

		for (var idx = 0; idx < excelInfoCount; idx++) {
			var wframeId = optionsParam.excelInfo[idx].wframeId || $p.getFrameId();
			var dataListId = optionsParam.excelInfo[idx].dataListId;
			
			var dataListObj = null;
			if (com.util.isEmpty(wframeId) === false) {
				dataListObj = $p.getComponentById(wframeId + "_" + dataListId);
			} else {
				dataListObj = $p.getComponentById(dataListId);
			}
			
			if (typeof dataListObj === "undefined") {
				console.log("[com.data.downloadMultipleDataList] excelInfo.dataListId에 설정된 " + dataListId + " DataList를 찾을 수 없습니다.");
				return;
			}

			var excelInfo = {
				dataListId : dataListId,
				sheetName : optionsParam.excelInfo[idx].sheetName || dataListId,
				removeColumns : optionsParam.excelInfo[idx].removeColumns || "",
				foldColumns : optionsParam.excelInfo[idx].foldColumns || "",
				startRowIndex : optionsParam.excelInfo[idx].startRowIndex || 0,
				startColumnIndex : optionsParam.excelInfo[idx].startColumnIndex || 0,
				headerColor : optionsParam.excelInfo[idx].headerColor || "#33CCCC",
				bodyColor : optionsParam.excelInfo[idx].bodyColor || "#FFFFFF",
				wframeId : wframeId,
				infoArr : optionsParam.excelInfo[idx].infoArr
			};

			options.excelInfo.push(excelInfo);
		}
	} else {
		console.log("[com.data.downloadMultipleDataList] options.excelInfo 정보가 입력되지 않았습니다.");
		return;
	}

	WebSquare.util.multipleDataListDownload(options, infoArrParam);
};


/**
 * DataList의 데이터를 엑셀 파일로 저장한다.
 *
 * @param {Object}	options.common							JSON형태로 저장된 dataList의 엑셀 다운로드 옵션
 * @param {String}	options.common.fileName					[default: excel.xls] 다운로드하려는 파일의 이름
 * @param {Boolean}   options.common.showProcess			[default: true] 다운로드 시 프로세스 창을 보여줄지 여부
 * @param {String}	options.common.multipleSheet			[default: true] 다운로드시 dataList별 sheet분리 출력유무
 * @param {Object}	options.common.printSet					JSON형태로 저장된 Excel Print관련 설정
 * @param {String}	options.common.printSet.fitToPage		[default: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
 * @param {String}	options.common.printSet.landScape		[default: false] 엑셀 프린터 출력시 가로 방향 출력 유무
 * @param {String}	options.common.printSet.fitWidth		[default: 1] 엑셀 프린터 출력시 용지너비
 * @param {String}	options.common.printSet.fitHeight		[default: 1] 엑셀 프린터 출력시 용지높이
 * @param {String}	options.common.printSet.scale			[default: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
 * @param {String}	options.common.printSet.pageSize		[default: A4] 엑셀 프린터 출력시 인쇄 용지 크기 (예: "A3", "A4", "A5", "B4") 단, fitToPage: true 인 경우에만 유효.
 * @param {Array}	 [options.excelInfo]					JSON형태로 저장된 dataList의 옵션 정보
 * @param {String}	options.excelInfo.gridId				[default: 없음] excel의 sheet에 저장한 GridView의 아이디
 * @param {String}	options.excelInfo.sheetName				[default: sheet] excel의 sheet의 이름
 * @param {String}	options.excelInfo.removeColumns			[default: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
 * @param {String}	options.excelInfo.foldColumns			[default: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
 * @param {Number}	options.excelInfo.startRowIndex			[default: 0] excel파일에서 dataList의 데이터가 시작되는 행의 번호(헤더 포함)
 * @param {Number}	options.excelInfo.startColumnIndex		[default: 0] excel파일에서 dataList의 데이터가 시작되는 열의 번호(헤더 포함)
 * @param {String}	options.excelInfo.headerColor			[default: #33CCCC] excel파일에서 dataList의 header부분의 색
 * @param {String}	options.excelInfo.headerFontName		[default: 없음] excel파일에서 dataList의 header부분의 font name
 * @param {String}	options.excelInfo.wframeId				[default: 현재 WFrame Id] DataList가 위치한 WFrame Id 정보
 * @param {Array}	 options.excelInfo.infoArr				dataList에 대한 내용을 추가로 다른 셀에 표현하는 경우 사용하는 배열
 * @param {Number}	options.excelInfo.infoArr.rowIndex		내용을 표시할 행번호
 * @param {Number}	options.excelInfo.infoArr.colIndex		내용을 표시할 열번호
 * @param {Number}	options.excelInfo.infoArr.rowSpan		병합할 행의 수
 * @param {Number}	options.excelInfo.infoArr.colSpan		병합할 열의 수
 * @param {String}	options.excelInfo.infoArr.text			표시할 내용
 * @param {String}	options.excelInfo.infoArr.textAlign		표시할 내용의 정렬 방법 (left, center, right)
 * @param {String}	options.excelInfo.infoArr.fontSize		font size 설정 ( ex) "20px" )
 * @param {String}	options.excelInfo.infoArr.fontName		font name 설정
 * @param {String}	options.excelInfo.infoArr.color			font color 설정 ( ex) "red" )
 * @param {String}	options.excelInfo.infoArr.fontWeight	font weight 설정 ( ex) "bold" )
 * @param {String}	options.excelInfo.infoArr.drawBorder	cell의 border 지정 ( ex) true )
 * @param {String}	options.excelInfo.infoArr.wordWrap		cell의 줄 바꿈 기능 ( ex) "true" )
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example

// id가 a,b,c,d,e인 5개 컬럼이 존재하는 DataList
var options = {
	common: {
		fileName : "excel_data.xlsx",
		showProcess : true,
		multipleSheet : true,
		printSet : {
			landScape : "true",
			fitToPage : "true",
			fitWidth : "1",
			fitHeight : "1",
			scale : "222"
		}
	},
	excelInfo: [
		{
			gridId : "grd_data1",
			sheetName : "첫번째 sheet",
			removeColumns : "1,3",
			foldColumns : "2",
			startRowIndex : 3,
			startColumnIndex : 0,
			headerColor : "#DBEEF3",
			bodyColor : "#92CDDC",
			infoArr : [
				{
					rowIndex : 1, colIndex : 3, rowSpan : 1, colSpan : 2, text : "데이터표시" , textAlign : "center"
				}
			]
		},
		{
			gridId : "grd_data2",
			sheetName : "두번째 sheet",
			removeColumns : "1,3",
			foldColumns : "2",
			startRowIndex : 3,
			startColumnIndex : 0,
			headerColor : "#DBEEF3",
			bodyColor : "#92CDDC",
			infoArr : [
				{
					rowIndex : 1, colIndex : 3, rowSpan : 1, colSpan : 2, text : "데이터표시" , textAlign : "center"
				}
			]
		}
	]
};
com.data.downloadMultipleGridView(options);

 */
com.data.downloadMultipleGridView = function (optionsParam, infoArrParam) {
	var options = {
		common: {
			fileName : optionsParam.common.fileName || "gridView.xlsx",
			showProcess :  optionsParam.common.showProcess || true,
			autoSizeColumn : optionsParam.common.autoSizeColumn || true,
			multipleSheet : optionsParam.common.multipleSheet || true,
			printSet : optionsParam.common.printSet || {}
		},
		excelInfo: []
	};

	if (optionsParam.excelInfo.length > 0) {
		var excelInfoCount = optionsParam.excelInfo.length;

		for (var idx = 0; idx < excelInfoCount; idx++) {
			var wframeId = optionsParam.excelInfo[idx].wframeId || $p.getFrameId();
			var gridId = optionsParam.excelInfo[idx].gridId;

			var gridObj = null;
			if (com.util.isEmpty(wframeId) === false) {
				gridObj = $p.getComponentById(wframeId + "_" + gridId);
			} else {
				gridObj = $p.getComponentById(gridId);
			}
			
			if (typeof gridObj === "undefined") {
				console.log("[com.data.downloadMultipleDataList] excelInfo.gridId에 설정된 " + gridId + " GridView를 찾을 수 없습니다.");
				return;
			}

			var excelInfo = {
				gridId : gridId,
				sheetName : optionsParam.excelInfo[idx].sheetName || gridId,
				removeColumns : optionsParam.excelInfo[idx].removeColumns || "",
				foldColumns : optionsParam.excelInfo[idx].foldColumns || "",
				startRowIndex : optionsParam.excelInfo[idx].startRowIndex || 0,
				startColumnIndex : optionsParam.excelInfo[idx].startColumnIndex || 0,
				headerColor : optionsParam.excelInfo[idx].headerColor || "#33CCCC",
				bodyColor : optionsParam.excelInfo[idx].bodyColor || "#FFFFFF",
				wframeId : wframeId,
				infoArr : optionsParam.excelInfo[idx].infoArr
			};

			options.excelInfo.push(excelInfo);
		}
	} else {
		console.log("[com.data.downloadMultipleGridView] options.excelInfo 정보가 입력되지 않았습니다.");
		return;
	}

	WebSquare.util.multipleExcelDownload(options, infoArrParam);
};


/**
 * 설정된 옵션으로 엑셀을 다운로드 한다.
 *
 * @param {Object}	grdObj GridView 객체
 * @param {Object}	options JSON형태로 저장된 그리드의 엑셀 다운로드 옵션
 * @param {Boolean} options.hiddenVisible			[default: false] GridView 내 Hidden 컬럼을 엑셀 다운로드 시 포함시킬지 여부 (true : 포함, false : 미포함)
 * @param {String}	options.fileName				[default: excel.xls] 다운로드하려는 파일의 이름으로 필수 입력 값이다.
 * @param {String}	options.sheetName				[default: sheet] excel의 sheet의 이름
 * @param {String}	options.type					[default: 0] type이 0인 경우 실제 데이터 1인 경우 눈에 보이는 데이터를 2이면 들어가 있는 data 그대로(filter무시 expression 타입의 셀은 나오지 않음)
 * @param {String}	options.removeColumns			[default: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
 * @param {String}	options.removeHeaderRows		[default: 없음] 다운로드시 excel에서 삭제하려는 Header의 row index(여러 개일 경우 ,로 구분)
 * @param {String}	options.foldColumns				[default: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
 * @param {Number}	options.startRowIndex			[default: 0] excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
 * @param {Number}	options.startColumnIndex		[default: 0] excel파일에서 그리드의 데이터가 시작되는 열의 번호(헤더 포함)
 * @param {String}	options.headerColor				[default: #33CCCC] excel파일에서 그리드의 header부분의 색
 * @param {String}	options.headerFontName			[default: 없음] excel파일에서 그리드의 header부분의 font name
 * @param {String}	options.headerFontSize			[default: 10] excel파일에서 그리드의 header부분의 font size
 * @param {String}	options.headerFontColor			[default: 없음] excel파일에서 그리드의 header부분의 font색
 * @param {String}	options.bodyColor				[default: #FFFFFF] excel파일에서 그리드의 body부분의 색
 * @param {String}	options.bodyFontName			[default: 없음] excel파일에서 그리드의 body부분의 font name
 * @param {String}	options.bodyFontSize			[default: 10] excel파일에서 그리드의 body부분의 font size
 * @param {String}	options.bodyFontColor			[default: 없음] excel파일에서 그리드의 body부분의 font색
 * @param {String}	options.subTotalColor			[default: #CCFFCC] excel파일에서 그리드의 subtotal부분의 색
 * @param {String}	options.subTotalFontName		[default: 없음] excel파일에서 그리드의 subtotal부분의 font name
 * @param {String}	options.subTotalFontSize		[default: 10] excel파일에서 그리드의 subtotal부분의 font size
 * @param {String}	options.subTotalFontColor		[default: 없음] excel파일에서 그리드의 subtotal부분의 font색
 * @param {String}	options.footerColor				[default: #008000] excel파일에서 그리드의 footer부분의 색
 * @param {String}	options.footerFontName			[default: 없음] excel파일에서 그리드의 footer부분의 font name
 * @param {String}	options.footerFontSize			[default: 10] excel파일에서 그리드의 footer부분의 font size
 * @param {String}	options.footerFontColor			[default: 없음] excel파일에서 그리드의 footer부분의 font색
 * @param {String}	options.oddRowBackgroundColor	[default: 없음] excel파일에서 그리드 body의 홀수줄의 배경색
 * @param {String}	options.evenRowBackgroundColor	[default: 없음] excel파일에서 그리드 body의 짝수줄의 배경색
 * @param {String}	options.rowNumHeaderColor		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 배경색
 * @param {String}	options.rowNumHeaderFontName	[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트이름
 * @param {String}	options.rowNumHeaderFontSize	[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트크기
 * @param {String}	options.rowNumHeaderFontColor	[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트색상
 * @param {String}	options.rowNumBodyColor			[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 배경색
 * @param {String}	options.rowNumBodyFontName		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트이름
 * @param {String}	options.rowNumBodyFontSize		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트크기
 * @param {String}	options.rowNumBodyFontColor		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트색상
 * @param {String}	options.rowNumFooterColor		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 배경색
 * @param {String}	options.rowNumFooterFontName	[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트이름
 * @param {String}	options.rowNumFooterFontSize	[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트크기
 * @param {String}	options.rowNumFooterFontColor	[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트색상
 * @param {String}	options.rowNumSubTotalColor		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 배경색
 * @param {String}	options.rowNumSubTotalFontName  [default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트이름
 * @param {String}	options.rowNumSubTotalFontSize  [default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트크기
 * @param {String}	options.rowNumSubTotalFontColor [default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트색상
 * @param {String}	options.rowNumHeaderValue		[default: 없음] rowNumVisible 속성이 true인 경우 순서출력 Header 영역의 출력값
 * @param {String}	options.rowNumVisible			[default: false] 순서출력 유무
 * @param {Boolean}   options.showProcess			[default: true] 다운로드 시 프로세스 창을 보여줄지 여부
 * @param {Boolean}   options.massStorage			[default: true] 대용량 다운로드 여부 (default는 true 이 옵션을 true로 하고 showConfirm을 false로 한 경우에 IE에서 신뢰할만한 사이트를 체크하는 옵션이 뜬다.)
 * @param {Boolean}   options.numberToText			[default: false] numberExtraction="true"이고 dataType="number"로 설정된 열의 데이터를 Excel 파일로 다운로드할 때 콤마 등 포맷에 포함된 기호를 유지.
 * @param {Boolean}   options.showConfirm			[default: false] 다운로드 확인창을 띄울지 여부(옵션을 킨 경우 advancedExcelDownload를 호출후 사용자가 window의 버튼을 한번더 클릭해야 한다. massStorage는 자동으로 true가 된다)
 * @param {String}	options.dataProvider			[default: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Provider Package
 * @param {String}	options.splitProvider			[default: 없음] 대량데이터 처리를 위해 데이터를 분할해서 처리할 수 있는 Provider Package
 * @param {String}	options.providerRequestXml		[default: 없음] Provider 내부에서 사용할 XML 문자열
 * @param {String}	options.userDataXml				[default: 없음] 사용자가 서버모듈 개발 시 필요한 데이터를 전송 할 수 있는 변수
 * @param {Boolean}   options.bodyWordwrap			[default: false] 다운로드시 body의 줄 바꿈 기능
 * @param {Boolean}   options.subtotalWordwrap		[default: false] 다운로드시 subtotal의 줄 바꿈 기능
 * @param {Boolean}   options.footerWordwrap		[default: false] 다운로드시 footer의 줄 바꿈 기능
 * @param {String}	options.useEuroLocale			[default: false] 다운로드시 유로화 처리 기능(,와 .이 반대인 경우처리)
 * @param {String}	options.useHeader				[default: true] 다운로드시 Header를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
 * @param {String}	options.useSubTotal				[default: false] 다운로드시 SubTotal을 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력), expression을 지정한 경우 avg,sum,min,max,targetColValue,숫자를 지원 함.
 * @param {String}	options.useFooter				[default: true] 다운로드시 Footer를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
 * @param {String}	options.useHeaderCheckBoxLabel	[default: false] 다운로드시 header가 checkbox인 경우 checked 값 대신 label을 출력 할지 여부( "true"인경우 header column value 출력, "false"인경우 checked값 출력)
 * @param {String}	options.separator				[default: ,] 다운로드시 서버로 데이터 전송할때, 데이터를 구분짓는 구분자, default는 comma(,)
 * @param {Number}	options.subTotalScale			[default: -1] 다운로드시 subTotal 평균계산시 소수점 자리수를 지정
 * @param {String}	options.subTotalRoundingMode	[default: 없음] 다운로드시 subTotal 평균계산시 Round를 지정 한다. ("CEILING","FLOOR","HALF_UP")
 * @param {String}	options.useStyle				[default: false] 다운로드시 css를 제외한, style을 excel에도 적용할 지 여부 (배경색,폰트)
 * @param {String}	options.freezePane				[default: ""] 틀고정을 위한 좌표값 및 좌표값의 오픈셋 ( ex) freezePane="3,4" X축 3, Y축 4에서 틀고정, freezePane="0,1,0,5" X축 0, Y축 1에서 X축으로 0, Y축으로 5로 틀공정 )
 * @param {String}	options.autoSizeColumn			[default: false] 너비자동맞춤 설정 유무
 * @param {String}	options.displayGridlines		[default: false] 엑셀 전체 셀의 눈금선 제거 유무
 * @param {String}	options.colMerge				[default: false] colMerge된 컬럼을 Merge해서 출력 할 지 여부
 * @param {String}	options.colMergeTextAlign		[default: center] colMerge된 컬럼의 textAlign설정 (bottom, center, top 설정)
 * @param {String}	options.mergeCell				[default: false] gridView mergeCell API로 cell 머지시, excel에도 동일하게 머지되어 다운로드 할지 여부
 * @param {String}	options.useDataFormat			[default: 없음] "true"인 경우 dataType에 따라 Excel 파일에 표시 형식을 출력. dataType="text"인 셀은 Excel의 표시형식에 '텍스트' 출력, dataType="number" 혹은 "bigDecimal" 셀은 "숫자" 출력.
 * @param {String}	options.indent					[default: 없음] 그리드 dataType이 drilldown인 경우, indent 표시를 위한 공백 삽입 개수, default값은 0
 * @param {String}	options.columnMove				[default: false] 그리드 컬럼이동시 이동된 상태로 다운로드 유무 ( "true"인경우 컬럼이동 순서대로 출력 )
 * @param {String}	options.columnOrder				[default: 없음] 엑셀 다운로드시 다운로드되는 컬럼 순서를 지정 할 수 있는 속성 ( ex) "0,3,2,1"로 지정시 지정한 순서로 다운로드된다 )
 * @param {String}	options.columnMoveWithFooter	[default: 없음] 그리드 컬럼이동시 Footer영역이 이동된 상태로 다운로드 유무
 * @param {String}	options.optionParam				[default: 없음] DRM 연계시 사용자 정의 class에 HashMap 인자로 전달할 값. key는 "optionParam"으로 참조한다.
 * @param {String}	options.rowHeight				[default: 없음] 엑셀 파일로 다운로드 할 때 엑셀의 셀 높이. (단위: pixel)
 * @param {String}	options.pwd						[default: 없음] 엑셀 파일로 다운로드할 때 비밀번호를 설정. 사용 조건: (1) 비밀번호는 BASE64로 인코딩후 전송해야 함. (2) websquare.xml에 <encrypt tempDir>을 설정해야 함. (3) POI 3.10으로 업그레이드 필요.
 * @param {String}	options.maxCellCount			[default: 없음] 엑셀 다운로드를 제한할 셀 개수 ( ex) 1000 설정시 grid의 셀 개수가 1000개를 넘어가면 서버로 요청을 보내지 않는다. )
 * @param {String}	options.maxRowCount			 	[default: 없음] 엑셀 다운로드를 제한할 행 개수 ( ex) 1000 설정시 grid의 행 개수가 1000개를 넘어가면 서버로 요청을 보내지 않는다. )
 * @param {String}	options.headerAutoFilter		[default: false] Header에 filter를 적용할지 여부
 * @param {String}	options.filterRowIndex			[default: -1] filter를 적용할 header의 row Index
 * @param {Object}	options.printSet				JSON형태로 저장된 Excel Print관련 설정
 * @param {String}	options.printSet.fitToPage		[default: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
 * @param {String}	options.printSet.landScape		[default: false] 엑셀 프린터 출력시 가로 방향 출력 유무
 * @param {String}	options.printSet.fitWidth		[default: 1] 엑셀 프린터 출력시 용지너비
 * @param {String}	options.printSet.fitHeight		[default: 1] 엑셀 프린터 출력시 용지높이
 * @param {String}	options.printSet.scale			[default: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
 * @param {String}	options.printSet.pageSize		[default: A4] 엑셀 프린터 출력시 인쇄 용지 크기 (예: "A3", "A4", "A5", "B4") 단, fitToPage: true 인 경우에만 유효.
 * @param {Number}	options.timeout					[default: 없음] 요청 최대 대기시간. millisecond 단위. timeout까지 응답이 오지 않을 시 다운로드를 fail 처리한다.
 * @param {Number}	options.checkInterval			[default: 1000] 응답 확인 간격. millisecond 단위. 지정된 주기마다 응답을 확인한다.
 * @param {Function}  options.onSuccessCallback		[default: 없음] 요청 성공 시 불리는 callback 함수.
 * @param {Function}  options.onFailureCallback		[default: 없음] 요청 실패 시 불리는 callback 함수.
 *
 * @param {Object[]}  [infoArr]						subTotalFontName 그리드에 대한 내용을 추가로 다른 셀에 표현하는 경우 사용하는 배열
 * @param {Number}	infoArr.rowIndex				내용을 표시할 행번호
 * @param {Number}	infoArr.colIndex				내용을 표시할 열번호
 * @param {Number}	infoArr.rowSpan					병합할 행의 수
 * @param {Number}	infoArr.colSpan					병합할 열의 수
 * @param {String}	infoArr.text					표시할 내용
 * @param {String}	infoArr.textAlign				표시할 내용의 정렬 방법 (left, center, right)
 * @param {String}	infoArr.fontSize				font size 설정 ( ex) "20px" )
 * @param {String}	infoArr.fontName				font name 설정
 * @param {String}	infoArr.color					font color 설정 ( ex) "red" )
 * @param {String}	infoArr.fontWeight				font weight 설정 ( ex) "bold" )
 * @param {String}	infoArr.drawBorder				cell의 border 지정 ( ex) true )
 * @param {String}	infoArr.borderColor				cell의 border color를 지정 ( ex) "#FF0000", "red" )
 * @param {String}	infoArr.borderWidth				cell의 border width 지정 ( "thin", "medium", "thick" )
 * @param {String}	infoArr.wordWrap				cell의 줄 바꿈 기능 ( ex) "true" )
 * @param {String}	infoArr.bgColor					cell의 배경 color 설정 ( ex) "red" )
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @return {file} <b>Excel file</b>
 * @author Inswave Systems
 * @example
var gridId = "grd_advancedExcel";
var infoArr = {};
var options = {
   fileName : "downLoadExcel.xlsx" //[default : excel.xlsx] options.fileName 값이 없을 경우 default값 세팅
};
com.data.downloadGridViewExcel(grdObj, options, infoArr);
 */
com.data.downloadGridViewExcel = function(grdObj, options, infoArr) {
	if (com.util.isEmpty(options)) {
		options = {};
	}
	
	if (typeof infoArr === "undefined") {
		infoArr = {};
	}
	
	gcm.data._downloadGridView(grdObj, options);

	var opts = {
		fileName: options.fileName || "excel.xlsx", //String, [defalut: excel.xlsx] 다운로드하려는 파일의 이름으로 필수 입력 값이다.
		sheetName: options.sheetName || "sheet", //String, [defalut: sheet] excel의 sheet의 이름
		type: options.type || "0", //String, [defalut: 0] type이 0인 경우 실제 데이터 1인 경우 눈에 보이는 데이터를  2이면 들어가 있는 data 그대로(filter무시 expression 타입의 셀은 나오지 않음)
		removeColumns: options.removeColumns || "", //String, [defalut: 없음] 다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분)
		removeHeaderRows: options.removeHeaderRows || "", //String, [defalut: 없음]	다운로드시 excel에서 삭제하려는 Header의 row index(여러 개일 경우 ,로 구분)
		foldColumns: options.foldColumns || "", //String, [defalut: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분)
		useHeaderCheckBoxLabel : options.useHeaderCheckBoxLabel || "true", // String, [default: false] 다운로드시 header가 checkbox인 경우 checked 값 대신 label을 출력 할지 여부 ("true"는 value를 출력, "false"는 checked 값 출력.)
		startRowIndex: options.startRowIndex || 0, //Number, excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
		startColumnIndex: options.startColumnIndex || 0, //Number, excel파일에서 그리드의 데이터가 시작되는 열의 번호(헤더 포함)
		headerColor: options.headerColor || "#eeeeee", //String, excel파일에서 그리드의 header부분의 색
//		headerColor: options.headerColor || "#33CCCC", //String, excel파일에서 그리드의 header부분의 색
		headerFontName: options.headerFontName || "", //String, [defalut: 없음] excel파일에서 그리드의 header부분의 font name
		headerFontSize: options.headerFontSize || "10", //String, excel파일에서 그리드의 header부분의 font size
		headerFontColor: options.headerFontColor || "", //String, excel파일에서 그리드의 header부분의 font색
		bodyColor: options.bodyColor || "#FFFFFF", //String, excel파일에서 그리드의 body부분의 색
		bodyFontName: options.bodyFontName || "", //String, [defalut: 없음] excel파일에서 그리드의 body부분의 font name
		bodyFontSize: options.bodyFontSize || "10", //String, excel파일에서 그리드의 body부분의 font size
		bodyFontColor: options.bodyFontColor || "", //String, excel파일에서 그리드의 body부분의 font색
		subTotalColor: options.subTotalColor || "#CCFFCC", //String, [defalut: #CCFFCC] excel파일에서 그리드의 subtotal부분의 색
		subTotalFontName: options.subTotalFontName || "", //String, [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font name
		subTotalFontSize: options.subTotalFontSize || "10", //String, [defalut: 10] excel파일에서 그리드의 subtotal부분의 font size
		subTotalFontColor: options.subTotalFontColor || "", //String, [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font색
		footerColor: options.footerColor || "#008000", //String, [defalut: #008000] excel파일에서 그리드의 footer부분의 색
		footerFontName: options.footerFontName || "", //String, [defalut: 없음] excel파일에서 그리드의 footer부분의 font name
		footerFontSize: options.footerFontSize || "10", //String, [defalut: 10] excel파일에서 그리드의 footer부분의 font size
		footerFontColor: options.footerFontColor || "", //String, [defalut: 없음] excel파일에서 그리드의 footer부분의 font색
		oddRowBackgroundColor: options.oddRowBackgroundColor || "", //String, excel파일에서 그리드 body의 홀수줄의 배경색
		evenRowBackgroundColor: options.evenRowBackgroundColor || "", //String, [defalut: 없음] excel파일에서 그리드 body의 짝수줄의 배경색
		rowNumHeaderColor: options.rowNumHeaderColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 배경색
		rowNumHeaderFontName: options.rowNumHeaderFontName || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트이름
		rowNumHeaderFontSize: options.rowNumHeaderFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트크기
		rowNumHeaderFontColor: options.rowNumHeaderFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 header 영역의 폰트색상
		rowNumBodyColor: options.rowNumBodyColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 배경색
		rowNumBodyFontName: options.rowNumBodyFontName || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트이름
		rowNumBodyFontSize: options.rowNumBodyFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트크기
		rowNumBodyFontColor: options.rowNumBodyFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Body 영역의 폰트색상
		rowNumFooterColor: options.rowNumFooterColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 배경색
		rowNumFooterFontName: options.rowNumFooterFontName || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트이름
		rowNumFooterFontSize: options.rowNumFooterFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트크기
		rowNumFooterFontColor: options.rowNumFooterFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Footer 영역의 폰트색상
		rowNumSubTotalColor: options.rowNumSubTotalColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 배경색
		rowNumSubTotalFontName: options.rowNumSubTotalFontName || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트이름
		rowNumSubTotalFontSize: options.rowNumSubTotalFontSize || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트크기
		rowNumSubTotalFontColor: options.rowNumSubTotalFontColor || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Subtotal 영역의 폰트색상
		rowNumHeaderValue: options.rowNumHeaderValue || "", //String, [defalut: 없음] rowNumVisible 속성이 true인 경우 순서출력 Header 영역의 출력값
		rowNumVisible: options.rowNumVisible || "false", //String, [defalut: false] 순서출력 유무
		showProcess: WebSquare.util.getBoolean(options.showProcess) || true, //Boolean, [defalut: true] 다운로드 시 프로세스 창을 보여줄지 여부
		massStorage: WebSquare.util.getBoolean(options.massStorage) || true, //Boolean, [defalut: true] 대용량 다운로드 여부 (default는 true 이 옵션을 true로 하고 showConfirm을 false로 한 경우에 IE에서 신뢰할만한 사이트를 체크하는 옵션이 뜬다.)
		showConfirm: WebSquare.util.getBoolean(options.showConfirm) || false, //Boolean, [defalut: false] 다운로드 확인창을 띄울지 여부(옵션을 킨 경우 advancedExcelDownload를 호출후 사용자가 window의 버튼을 한번더 클릭해야 한다. massStorage는 자동으로 true가 된다)
		dataProvider: options.dataProvider || "", //String, [defalut: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Provider Package
		splitProvider : options.splitProvider || "", // String, [defalut: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Split Provider Package
		providerRequestXml: options.providerRequestXml || "", //String, [defalut: 없음] Provider 내부에서 사용할 XML 문자열
		userDataXml: options.userDataXml || "", //String, [defalut: 없음] 사용자가 서버모듈 개발 시 필요한 데이터를 전송 할 수 있는 변수
		bodyWordwrap: WebSquare.util.getBoolean(options.bodyWordwrap) || false, //Boolean, [defalut: false] 다운로드시 바디의 줄 바꿈 기능
		useEuroLocale: options.useEuroLocale || "false", //String, [defalut: false] 다운로드시 유로화 처리 기능(,와 .이 반대인 경우처리)
		useHeader: options.useHeader || "true", //String, [defalut: true] 다운로드시 Header를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
		useSubTotal: options.useSubTotal || "false", //String, [defalut: false] 다운로드시 SubTotal을 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력), expression을 지정한 경우 avg,sum,min,max,targetColValue,숫자를 지원 함.
		useFooter: options.useFooter || "true", //String, [defalut: true] 다운로드시 Footer를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력)
		separator: options.separator || ",", //String, [defalut: ,] 다운로드시 서버로 데이터 전송할때, 데이터를 구분짓는 구분자, default는 comma(,)
		subTotalScale: options.subTotalScale || -1, //Number, [defalut: -1] 다운로드시 subTotal 평균계산시 소수점 자리수를 지정
		subTotalRoundingMode: options.subTotalRoundingMode || "", //String, [defalut: 없음] 다운로드시 subTotal 평균계산시 Round를 지정 한다. ("CEILING","FLOOR","HALF_UP")
		useStyle: options.useStyle || "", //String, [defalut: false] 다운로드시 css를 제외한, style을 excel에도 적용할 지 여부 (배경색,폰트)
		freezePane: options.freezePane || "", //String, [defalut: ""] 틀고정을 위한 좌표값 및 좌표값의 오픈셋 ( ex) freezePane="3,4" X축 3, Y축 4에서 틀고정, freezePane="0,1,0,5" X축 0, Y축 1에서 X축으로 0, Y축으로 5로 틀공정  )
		autoSizeColumn: options.autoSizeColumn || "true", //String, [defalut: false] 너비자동맞춤 설정 유무 - 2016.08.18 옵션 설정을 true로 변경
		displayGridlines: options.displayGridlines || "", //String, [defalut: false] 엑셀 전체 셀의 눈금선 제거 유무
		colMerge: options.colMerge || "", //String, [defalut: false] colMerge된 컬럼을 Merge해서 출력 할 지 여부
		useDataFormat: options.useDataFormat || "", //String, [defalut: 없음] 그리드 dataType이 text인 경우, 엑셀의 표시형식 '텍스트' 출력 유무( "true"인 경우 표시형식 텍스트, "false"인 경우 표시형식 일반 출력)
		indent: options.indent || "", //String, [defalut: 없음] 그리드 dataType이 drilldown인 경우, indent 표시를 위한 공백 삽입 개수, default값은 0
		columnMove: options.columnMove || "", //String, [defalut: false] 그리드 컬럼이동시 이동된 상태로 다운로드 유무 ( "true"인경우 컬럼이동 순서대로 출력 )
		columnOrder: options.columnOrder || "", //String, [defalut: 없음] 엑셀 다운로드시 다운로드되는 컬럼 순서를 지정 할 수 있는 속성 ( ex) "0,3,2,1"로 지정시 지정한 순서로 다운로드된다 )
		fitToPage: options.fitToPage || "false", //String, [defalut: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무
		landScape: options.landScape || "false", //String, [defalut: false] 엑셀 프린터 출력시 가로 방향 출력 유무
		fitWidth: options.fitWidth || "1", //String, [defalut: 1] 엑셀 프린터 출력시 용지너비
		fitHeight: options.fitHeight || "1", //String, [defalut: 1] 엑셀 프린터 출력시 용지높이
		scale: options.scale || "100", //String, [defalut: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다.
		pageSize: options.pageSize || "A4", //String, [defalut: A4] 엑셀 프린터 출력시 인쇄용지 설정 ( ex) "A3", "A4", "A5", "B4" )
		onSuccessCallback : function (e) {
		},
		onFailureCallback : function (e) {
		}
	};

	grdObj.advancedExcelDownload(opts, infoArr);
};


/**
 * 설정된 옵션으로 CSV파일을 다운로드 한다.
 *
 * @param {Object}   grdObj GridView Object
 * @param {Object[]} options 					JSON형태로 저장된 그리드의 엑셀 다운로드 옵션
 * @param {String}   options.fileName			[default: csvfile.csv] 엑셀파일 선택 대화상자가 나타날 때 기본으로 지정 될 파일 이름
 * @param {String}   options.type				[default: 1, 0] Grid 저장 형태 (0이면 데이터 형태,1이면 표시 방식)
 * @param {String}   options.delim				[default: ';'] CSV 파일에서 데이터를 구분할 구분자
 * @param {String}   options.removeColumns		[default: 없음] 저장 하지 않을 columns index, 여러컬럼인 경우 콤마(,)로 구분해서 정의 한다.
 * @param {String}   options.header				[default: 1, 0] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
 * @param {Number}   options.hidden				[default: 0, 1] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
 * @param {String}   options.checkButton		[default: 1, 0] Grid의 Control(Check, Radio, Button) Column에 대해 히든 여부 (0이면 control Coliumn히든,1이면 보여줌)
 * @param {Array}	options.saveList			[default: 없음] hidden에 관계없이 최우선순위로 저장할 column id들의 array
 * @param {String}   options.columnMove			[default: false] 그리드 컬럼이동시 이동된 상태로 다운로드 유무 ( "true"인경우 컬럼이동 순서대로 출력 )
 * @param {String}   options.columnOrder		[default: 없음] csv 다운로드시 다운로드되는 컬럼 순서를 지정 할 수 있는 속성 ( ex) "0,3,2,1"로 지정시 지정한 순서로 다운로드된다 )
 * @param {String}   options.spanAll			[default: false] drilldown gridView인 경우 전체목록을 펼쳐서 다운로드 할 수 있는 속성. (true이면 전체출력, false면 보여지는 목록만 출력)
 * @param {String}   options.aposPrefixOnNum	[default: 0, 1] dataType이 number이고 length가 12자리이상인 경우 '(apos)를 붙일지 여부 (0 이면 apos를 붙이지않음, 1이면 붙임)
 * @param {String}   options.ignoreSpan			[default: 0, 1] span되어 있는 경우 span을 무시하고 데이터를 채울지 여부 (0이면 저장하지 않음, 1이면 저장)
 * @param {String}   options.removeQuotation	[default: 0, 1] value에 ", ' 가 들어있는 경우 ", '를 지울지 여부 (0이면 지원지 않음, 1이면 지움)
 * @param {String}   options.removeNewLine		[default: 1, 0] value내에 \r\n이 있을 경우 삭제유무 (0이면 지원지 않음, 1이면 지움)
 * @param {String}   options.optionParam		[default: 없음] DRM 연계시 사용자 정의 class에 HashMap 인자로 전달할 값. key는 "optionParam"으로 참조한다.
 * @memberOf com.data
 * @date 2020.05.16
 * @return {file} CSV file
 * @author Inswave Systems
 * @example
var gridId = "grd_AdvancedExcel";
var options = {
	fileName : "downLoadCSV.csv" //[default : excel.csv] options.fileName 값이 없을 경우 default값 세팅
};
com.data.downloadGridViewCSV(grdObj, options);
//return 예시) 엑셀 파일 다운로드
 */
com.data.downloadGridViewCSV = function(grdObj, options) {
	if (com.util.isEmpty(options)) {
		options = {};
	}
	
	gcm.data._downloadGridView(grdObj, options);
	
	var opts = {
		fileName: options.fileName || "excel.csv", //[default: excel.csv] 저장 될 파일 이름
		type: options.type || "1", //[default: 1] Grid 저장 형태 (0이면 데이터 형태,1이면 표시 방식)
		delim: options.delim || ",", //[default: ,] CSV 파일에서 데이터를 구분할 구분자
		removeColumns: options.removeColumns || "", //[default: 없음] 저장 하지 않을 columns index, 여러컬럼인 경우 콤마(,)로 구분해서 정의 한다.
		header: options.header || "1", //[default: 1] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
		hidden: options.hidden || 0, //[defalut: 0] Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장)
		checkButton: options.checkButton || "1", //[default: 1] Grid의 Control(Check, Radio, Button) Column에 대해 히든 여부 (0이면 control Column히든,1이면 보여줌)
		saveList: options.saveList || "" //[default: 없음] hidden에 관계없이 저장할 column id들의 array
	}
	
	grdObj.saveCSV(opts);
};


/**
 * 엑셀 xls, xlsx 업로드
 *
 * @param {Object} grdObj GridView Object
 * @param {Object} options JSON형태로 저장된 그리드의 엑셀 업로드 옵션
 *
 * @param {String}  options.type				[default: 0] 1이면 엑셀 파일이 그리드의 보이는 결과로 만들어져있을때 0이면 엑셀 파일이 그리드의 실제 데이터로 구성되어있을때
 * @param {Number}  options.sheetNo				[default: 0] excel파일에서 그리드의 데이터가 있는 sheet번호
 * @param {Number}  options.startRowIndex		[default: 0] excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
 * @param {Number}  options.startColumnIndex	[default: 0] excel파일에서 그리드의 데이터가 시작되는 열의 번호
 * @param {Number}  options.endColumnIndex		[default: 0] excel파일에서 그리드의 데이터가 끝나는 열의 index ( 엑셀컬럼수가 그리드컬럼수 보다 작은 경우 그리드 컬러수를 설정)
 * @param {String}  options.headerExist			[default: 0] excel파일에서 그리드의 데이터에 header가 있는지 여부(1이면 header 존재 0이면 없음)
 * @param {String}  options.footerExist			[default: 1] excel파일에서 그리드의 데이터에 footer가 있는지 여부(1이면 footer 존재 0이면 없음 기본값은 1 그리드에 footer가 없으면 적용되지 않음)
 * @param {String}  options.append				[default: 0] excel파일에서 가져온 데이터를 그리드에 append시킬지 여부(1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
 * @param {String}  options.hidden				[default: 0] 읽어들이려는 엑셀파일에 hidden column이 저장되어 있는지 여부를 설정하는 int형 숫자(0이면 엑셀파일에 hidden 데이터가 없으므로 그리드 hidden column에 빈 데이터를 삽입 1 : 엑셀파일에 hidden 데이터가 있으므로 엑셀 파일로부터 hidden 데이터를 삽입 )
 * @param {String}  options.fillHidden			[default: 0] Grid에 hiddenColumn에 빈 값을 넣을지를 결정하기 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden column이 저장되어있지 않은 Excel File이라 간주하고 hidden Column에 빈 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
 * @param {String}  options.skipSpace			[default: 0] 공백무시 여부(1이면 무시 0이면 포함)
 * @param {Array}   options.insertColumns		radio, checkbox와 같은 컬럼을 엑셀에서 받아 오지 않고, 사용자 컬럼 설정 으로 업로드 ( 데이터 구조 : [ { columnIndex:1, columnValue:"1" } ] )
 * @param {String}  options.removeColumns		[default: 없음] 저장 하지 않을 column index, 여러컬럼인 경우 콤마(,)로 구분해서 정의 한다.
 * @param {String}  options.popupUrl			업로드시에 호출할 popup의 url
 * @param {String}  options.delim				업로드시 데이터를 구분하는 구분자 (default: , )
 * @param {String}  options.status				[default: R]업로드된 데이터의 초기 상태값, 설정하지 않으면 "R"로 설정되며 "C"값을 설정 할 수 있다.
 * @param {String}  options.pwd					엑셀파일에 암호가 걸려 있는 경우, 비밀번호
 * @param {String}  options.optionParam			[default: 없음] DRM 연계시 사용자 정의 class에 HashMap 인자로 전달할 값. key는 "optionParam"으로 참조한다.
 * @param {String}  options.cellDataConvertor	[default: true] 컬럼값을 사용자가 수정할수 있는 연계 클래스의 전체 패키지명. (AbstractCellDataProvider class를 상속후 convertValue method를 구현해야 함.
 * @param {String}  options.decimal				[default: 4] 셀의 데이터가 소수인 경우, 최종 소수점 자리수. (기본값: 4) (예: 3인경우 4자리에서 반올림해서 3자리를 최종 표시.)
 * @param {String}  options.useModalDisable		[default: false] 업로드 팝업창이 활성화 될때 부모창의 컴포넌트 disabled 처리 유무.
 * @param {String}  options.useMaxByteLength	[default: false] ignoreChar 속성으로 설정한 문자를 제외하고 maxByteLength 속성으로 설정한 길이만큼의 데이터만 업로드.
 * @param {String}  options.dateFormat			[default: yyyy-MM-dd] 엑셀의 셀포맷이 날짜형식으로 되어 있는경우 format. 기본값은 "yyyy-MM-dd"
 * @param {String}  options.byteCheckEncoding	[default: EUC-KR] useMaxByteLength 설정되어 있는경우 byte처리시 지정할 인코딩. EUC-KR인경우 2byte처리 UTF-8일경우 3byte처리한다. (default는 EUC-KR)
 * @param {String}  options.features			upload화면이 뜰 때 string 형식의 스타일 정보. 지정되지 않은경우 upload창이 기본 스타일로 생성
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var gridId = "grd_AdvancedExcel";
var type = "xlsx";
var options = {
	fileName : "gridDataUpload.xlsx" // default값이 존재하지 않으므로 꼭 fileName 값을 넣어야 한다.
};
com.data.uploadGridViewExcel(grd_basicInfo,  options);
 */
com.data.uploadGridViewExcel = function (grdObj, options) {
	if (com.util.isEmpty(options)) {
		options = {};
	}
	
	var width = "490";
	var height = "218";
	var top = ((document.body.offsetHeight / 2) - (parseInt(height) / 2) + $(document).scrollTop());
	var left = ((document.body.offsetWidth / 2) - (parseInt(width) / 2) + $(document).scrollLeft());
	
	var opts = {
		type: options.type || "0", //String, 1이면 엑셀 파일이 그리드의 보이는 결과로 만들어져있을때  0이면 엑셀 파일이 그리드의 실제 데이터로 구성되어있을때
		sheetNo: options.sheetNo || 0, //Number, excel파일에서 그리드의 데이터가 있는 sheet번호
		startRowIndex: options.startRowIndex || 1, //Number, [defalut:0] excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함)
		startColumnIndex: options.startColumnIndex || 0, //Number, [defalut:0] excel파일에서 그리드의 데이터가 시작되는 열의 번호
		endColumnIndex: options.endColumnIndex || 0, //Number, [defalut: 0] excel파일에서 그리드의 데이터가 끝나는 열의 index
		//( 엑셀컬럼수가 그리드컬럼수 보다 작은 경우 그리드 컬러수를 설정)
		headerExist: options.headerExist || "0", //String, [defalut:0] excel파일에서 그리드의 데이터에 header가 있는지 여부
												 //(1이면 header 존재 0이면 없음)
		footerExist: options.footerExist || "1", //String, [defalut: 1] excel파일에서 그리드의 데이터에 footer가 있는지 여부
		//(1이면 footer 존재 0이면 없음 기본값은 1 그리드에 footer가 없으면 적용되지 않음)
		append: options.append || "0", //String, [defalut: 0] excel파일에서 가져온 데이터를 그리드에 append시킬지 여부
									   // (1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
		hidden: options.hidden || "0", //String, [defalut: 0] 읽어들이려는 엑셀파일에 hidden column이 저장되어 있는지 여부를 설정하는 int형 숫자(0이면
									   // 엑셀파일에 hidden 데이터가 없으므로 그리드 hidden column에 빈 데이터를 삽입
									   // 1 : 엑셀파일에 hidden 데이터가 있으므로 엑셀 파일로부터 hidden 데이터를 삽입 )
		fillHidden: options.fillHidden || "0", //String, [defalut: 0] Grid에 hiddenColumn에 빈 값을 넣을지를 결정하기
											   // 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden
											   // column이 저장되어있지 않은 Excel  File이라 간주하고 hidden Column에 빈
											   // 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
		skipSpace: options.skipSpace || "0", //String, [defalut: 0] 공백무시 여부(1이면 무시 0이면 포함)
		insertColumns: options.insertColumns || "",//Array, radio, checkbox와 같은 컬럼을 엑셀에서 받아 오지 않고
												   //사용자 컬럼 설정 으로 업로드 ( 데이터 구조 : [ { columnIndex:1, columnValue:"1" } ] )
		popupUrl: options.popupUrl || "", //String, 업로드시에 호출할 popup의 url
		status: options.status || "R", //String, [defalut: R]업로드된 데이터의 초기 상태값, 설정하지 않으면 "R"로 설정되며 "C"값을 설정 할 수 있다.
		pwd: options.pwd || "", //String, 엑셀파일에 암호가 걸려 있는 경우, 비밀번호
		features : "top="+top+",height="+height+",left="+left+",width="+width+",location=no,menubar=no,resizable=yes,scrollbars=auto,status=no,titlebar=yes,toolbar=no",
		wframe: true
	};

	grdObj.advancedExcelUpload(opts);
};


/**
 *  엑셀 CSV 업로드
 *
 * @param {String}  options.type			[default: 1, 0]데이터 형태 (0이면 실 데이터 형태,1이면 display 표시 방식)
 * @param {String}  options.header			[default: 1, 0]Grid header 존재 유무 (0이면 header row수를 무시하고 전부 업로드하고 1이면 header row수 만큼 skip한다.)
 * @param {String}  options.delim			[default: ',']CSV 파일에서 데이터를 구분할 구분자
 * @param {String}  options.escapeChar		CSV 데이터에서 제거해야 되는 문자셋 ( ex) '\'' )
 * @param {Number}  options.startRowIndex 	[default: 0] csv파일에서 그리드의 데이터가 시작되는 행의 번호, startRowIndex가 설정되면, header 설정은 무시된다.
 * @param {String}  options.append			[default: 0, 1]csv파일에서 가져온 데이터를 그리드에 append시킬지 여부(1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
 * @param {Number}  options.hidden			[default: 0, 1]hidden Column에 대한 저장 여부(0이면 저장하지않음,1이면 저장)
 * @param {String}  options.fillHidden		[default: 0, 1]hidden Column에 빈 값을 넣을지를 결정하기 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden column이 저장되어있지 않은 csv File이라 간주하고 hidden Column에 빈 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
 * @param {String}  options.skipSpace		[default: 0, 1]공백무시 여부(1이면 무시 0이면 포함)
 * @param {String}  options.expression		[default: 1, 0]expression 컬럼 데이터를 포함하고 있는지 여부, 기본값은 미포함(1이면 미포함, 0이면 포함)
 * @param {String}  options.popupUrl		업로드시에 호출할 popup의 url
 * @param {String}  options.status			[default: R]업로드된 데이터의 초기 상태값, 설정하지 않으면 "R"로 설정되며 "C"값을 설정 할 수 있다.
 * @param {String}  options.ignoreSpan		[default: 0, 1] span되어 있는 경우 span을 무시하고 데이터를 읽을지 여부 (0이면 머지되어 있는 컬럼을 하나로 본다, 1이면 머지되어 있는 컬럼을 각각읽는다)
 * @param {String}  options.optionParam		[default: 없음] DRM 연계시 사용자 정의 class에 HashMap 인자로 전달할 값. key는 "optionParam"으로 참조한다.
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var gridId = "grd_advancedExcel";
var options = {};
com.data.uploadGridViewCSV(gridId,  options);
// return 예시) 엑셀 파일(.CSV) 업로드
 */
com.data.uploadGridViewCSV = function (grdObj, options) {
	if (com.util.isEmpty(options)) {
		options = {};
	}
	
	var width = "490";
	var height = "218";
	var top = ((document.body.offsetHeight / 2) - (parseInt(height) / 2) + $(document).scrollTop());
	var left = ((document.body.offsetWidth / 2) - (parseInt(width) / 2) + $(document).scrollLeft());
	
	var opts = {
		type: options.type || "0",					// String, [default: 1, 0]데이터 형태 (0이면 실 데이터 형태,1이면 display 표시 방식)
		header: options.header || "0",				// String, [default: 1, 0]Grid header 존재 유무 (0이면 header row수를 무시하고 전부 업로드하고 1이면 header row수 만큼 skip한다.)
		delim: options.delim || ",", 				// String, [default: ',']CSV 파일에서 데이터를 구분할 구분자
		escapeChar: options.escapeChar || "",		// String, CSV 데이터에서 제거해야 되는 문자셋 ( ex) '\'' )
		startRowIndex: options.startRowIndex || 0,	// Number, [defalut: 0] csv파일에서 그리드의 데이터가 시작되는 행의 번호, startRowIndex가 설정되면, header 설정은 무시된다.
		append: options.append || "0", 				// String, [defalut: 0, 1]csv파일에서 가져온 데이터를 그리드에 append시킬지 여부(1이면 현재 그리드에 데이터를 추가로 넣어줌 0이면 현재 그리드의 데이터를 삭제하고 넣음)
		hidden: options.hidden || 1, 				// Number, [defalut: 0, 1]hidden Column에 대한 저장 여부(0이면 저장하지않음,1이면 저장)
		fillHidden: options.fillHidden || "0",		// String, [defalut: 0, 1]hidden Column에 빈 값을 넣을지를 결정하기 위한 int형 숫자(1이면 hidden Column에 빈 값을 저장하지 않음,0이면 hidden column이 저장되어있지 않은 csv File이라 간주하고 hidden Column에 빈 값을 넣어줌)(hidden이 0인 경우에는 fillhidden은 영향을 끼치지 않음)
		skipSpace: options.skipSpace || "0", 		// String, [defalut: 0, 1]공백무시 여부(1이면 무시 0이면 포함)
		expression: options.expression || "1",		// String, [defalut: 1, 0]expression 컬럼 데이터를 포함하고 있는지 여부, 기본값은 미포함(1이면 미포함, 0이면 포함)
		popupUrl: options.popupUrl || "", 			// String, 업로드시에 호출할 popup의 url
		features : "top="+top+",height="+height+",left="+left+",width="+width+",location=no,menubar=no,resizable=yes,scrollbars=auto,status=no,titlebar=yes,toolbar=no",
		wframe: true
	}
	
	grdObj.readCSV(opts);
};

/**
 * 그룹안에 포함된 컴포넌트의 입력 값에 대한 유효성을 검사한다.
 *
 * 컴포넌트 속성 유효성 검사를 수행하고, valInfoArr 유효성 검사 옵션에 대해서 유효성 검사를 수행한다.
 * valInfoArr 유효성 검사 옵션 파라미터를 전달하지 않은 경우 컴포넌트 속성(mandatory, allowChar, ignoreChar, maxLength, maxByteLength, minLength, minByteLength)에 대해서만 유효성 검사를 수행한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {Object} grpObj 그룹 컴포넌트 객체
 * @param {Object[]} options 유효성 검사 옵션 <br/>
 * @param {String} options[].id 유효성 검사 대상 DataCollection 컬럼 아이디
 * @param {String} options[].label 유효성 검사 실패 시 출력할 레이블 명 (DataCollection 컬럼명을 참조하지 않고 싶은 경우 사용함)
 * @param {Boolean} options[].mandatory 필수 입력 값 여부
 * @param {Number} options[].minLength 최소 입력 자리수
 * @param {Number} options[].minByteLength 최소 입력 자리수 (Byte 단위)
 * @param {Boolean} options[].isEmail 이메일 유효성 검사 실행
 * @param {Boolean} options[].isPhone 전화번호 유효성 검사 수행
 * @param {requestCallback} options[].valFunc 사용자 유효성 검사 함수
 * @param {String} tacId 그룹이 포함된 TabControl 컴포넌트 아이디
 * @param {String} tabId 그룹이 포함된 TabControl 컴포넌트의 Tab 아이디
 * @returns {Boolean} 유효성 검사 결과
 * @example

if (com.data.validateGroup(grp_LoginInfo)) {
	if (confirm("변경된 데이터를 저장하시겠습니까?")) {
		com.sbm.execute("sbm_saveData");
	}
}

var valInfo = [ { id : "grpCd", mandatory : true, minLength : 5 },
				{ id : "grpNm", mandatory : true } ];

if (com.data.validateGroup(grp_LoginInfo, valInfo)) {
	if (confirm("변경된 데이터를 저장하시겠습니까?")) {
		com.sbm.execute("sbm_saveCode");
	}
}

var valInfo = [ { id : "grpCd", label : "공통그룹코드", mandatory : true, minLength : 5 },
				{ id : "grpNm", label : "공통그룹명", mandatory : true } ];

if (com.data.validateGroup(grp_code, valInfo)) {
	if (win.com.win.confirm("변경된 데이터를 저장하시겠습니까?")) {
		com.sbm.execute("sbm_saveCode");
	}
};

var valInfo = [ { id : "prntMenuCd", mandatory : true },
				{ id : "menuCd", mandatory : true,
					valFunc : function(value) {
						if (dmaMenu.get("prntMenuCd") == dmaMenu.get("menuCd")) {
							return "상위 메뉴 코드와 메뉴 코드가 같아서는 안됩니다.";
						}
					} },
				 { id : "menuNm", mandatory : true },
				 { id : "menuLevel", mandatory : true },
				 { id : "menuSeq", mandatory : true },
				 { id : "urlPath", mandatory : true },
				 { id : "isUse", mandatory : true } ];

if (com.data.validateGroup(tblMenuInfo, valInfo, tacMenuInfo, "tabMenuInfo1") == false) {
	return false;
}

 * @description
필수 입력, 입력 허용 문자, 입력 허용 불가 문자, 최대, 최소 입력 문자수 설정은 컴포넌트의 속성에서 설정한다. <br/>
- mandatory : 필수 입력 항목 여부 <br/>
- allowChar : 입력 허용 문자 <br/>
- ignoreChar : 입력 허용 불가 문자 <br/>
- maxLength : 최대 입력 문자수 <br/>
- maxByteLength : 최대 입력 바이트수 <br/>
 */
com.data.validateGroup = function (grpObj, valInfoArr, tacObj, tabId) {
	var objArr = com.util.getChildren(grpObj, {
		includePlugin: "checkbox checkcombobox datePicker editor input inputCalendar multiselect radio selectbox searchbox secret textarea",
		recursive: true
	});

	var errors = [];

	try {
		for (var objIdx in objArr) {
			var obj = objArr[objIdx];

			var dataObjInfo = com.data.getDataCollection(obj);
			var dataCollection = null;
			var columnId = null;
			var value = null;

			if ((dataObjInfo !== undefined) && (dataObjInfo !== null)) {
				dataCollection = $p.getComponentById(dataObjInfo.runtimeDataCollectionId);
				columnId = dataObjInfo.columnId;
			}

			if ((dataCollection !== null) && (dataCollection.getObjectType() === "dataMap")) {
				value = dataCollection.get(dataObjInfo.columnId);
				if (typeof value === "string") {
					value = value.trim();
				}
			} else {
				var tempIdArr = obj.getID().split("_");
				if (obj.getPluginName() !== "editor") {
					if ((typeof obj.getValue === "function")) {
						value = obj.getValue();
						if (typeof value === "string") {
							value = value.trim();
						}
					} else {
						continue;
					}
				} else {
					value = obj.getHTML();
					if (typeof value === "string") {
						value = value.trim();
					}
				}
			}

			var valInfo = { id : columnId };
			var isVaild = false;

			for (var valIdx in valInfoArr) {
				if ((typeof valInfoArr[valIdx].id !== "undefined") && (valInfoArr[valIdx].id === columnId)) {
					valInfo = valInfoArr[valIdx];
					isVaild = true;
					break;
				}
			}

			if ((typeof objArr[objIdx].options.mandatory !== "undefined") && (objArr[objIdx].options.mandatory)) {
				valInfo.mandatory = true;
				isVaild = true;
			}

			if ((typeof objArr[objIdx].options.minlength !== "undefined") && (objArr[objIdx].options.minlength > 0)
					&& (objArr[objIdx].getPluginName() !== "inputCalendar")) {
				valInfo.minLength = objArr[objIdx].options.minlength;
				isVaild = true;
			}

			if ((typeof objArr[objIdx].options.minByteLength !== "undefined") && (objArr[objIdx].options.minByteLength > 0)
					&& (objArr[objIdx].getPluginName() !== "inputCalendar")) {
				valInfo.minByteLength = objArr[objIdx].options.minByteLength;
				isVaild = true;
			}

			if (isVaild === true) {
				_setResult(dataCollection, obj.getID(), valInfo, value);
			}
		}

		if (errors.length > 0) {
			if ((typeof tacObj !== "undefined") && (typeof tabId !== "undefined") && (tabId !== "")) {
				var tabIndex = tacObj.getTabIndex(tabId);
				tacObj.setSelectedTabIndex(tabIndex);
			}

			var option = {
				callBackParam : {
					"objId" : errors[0].objId
				}
			}

			com.win.alert(errors[0].message, function(param) {
				var obj = $p.getComponentById(param.objId);
				obj.focus();
			}, option);

			return false;
		} else {
			return true;
		}

		function _setResult(dataCollection, objId, valInfo, value) {
			var msgInfo = gcm.data._getValResultMsg(valInfo, value);

			if (com.util.isEmpty(msgInfo.message) === false) {
				var comObj = $p.getComponentById(objId);

				var errIdx = errors.length;
				errors[errIdx] = {};
				errors[errIdx].columnId = valInfo.id;
				errors[errIdx].objId = objId;

				if (com.util.isEmpty(valInfo.label) === false) {
					errors[errIdx].columnName = valInfo.label;
				} else if (com.util.isEmpty(dataCollection) === false) {
					var scope = gcm.win._getScope(dataCollection);
					errors[errIdx].columnName = scope.com.data.getColumnName(comObj);
				} else if (typeof comObj.getInvalidMessage === "function") {
					errors[errIdx].columnName = comObj.getInvalidMessage();
				}

				if (msgInfo.msgType == "2") {
					errors[errIdx].message = msgInfo.message;
				} else {
					if (com.util.isEmpty(errors[errIdx].columnName) === false) {
						errors[errIdx].message = com.str.attachPostposition(errors[errIdx].columnName) + " " + msgInfo.message;
					} else {
						errors[errIdx].message = msgInfo.message;
					}
				}
			}
		}
	} catch (ex) {
		console.error("Exception :: Object Id : " + obj.getID() + ", Plug-in Name: " + obj.getPluginName() + ", " + ex.message);
	} finally {
		objArr = null;
	}
};


/**
 * GridView를 통해서 입력된 데이터에 대해서 유효성을 검증한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {Object} gridViewObj GridView 객체
 * @param {Object[]} options 데이터 유효성 검증 옵션
 * @param {String} options[].id 유효성 검사 대상 DataCollection 컬럼 아이디
 * @param {Boolean} options[].mandatory 필수 입력 값 여부
 * @param {Number} options[].minLength 최소 입력 자리수
 * @param {Boolean} options[].isEmail 이메일 유효성 검사 실행
 * @param {Boolean} options[].isPhone 전화번호 유효성 검사 수행
 * @param {requestCallback} options[].valFunc 사용자 유효성 검사 함수
 * @param {Object} tacObj GridView가 포함된 TabControl 컴포넌트 객체
 * @param {String} tabId GridView가 포함된 TabControl 컴포넌트의 Tab 아이디
 * @returns {Boolean} 유효성검사 결과
 * @example
var valInfo = [ {id: "grpCd", mandatory: true, minLength: 5},
			   {id: "grpNm", mandatory: true} ];

if (com.data.validateGridView(grd_MenuAuthority, valInfo)) {
   if (confirm("변경된 데이터를 저장하시겠습니까?")) {
	   scwin.saveGroup();
   }
}

var valInfo = [ {id: "grpCd", label : "공통그룹코드", mandatory: true, minLength: 5},
			   {id: "grpNm", label : "공통그룹명", mandatory: true} ];

if (com.data.validateGridView(grd_MenuAuthority, valInfo)) {
   if (confirm("변경된 데이터를 저장하시겠습니까?")) {
	   scwin.saveGroup();
   }
}

var valInfo = [ { id : "prntMenuCd", mandatory : true },
				{ id : "menuCd", mandatory : true,
				  valFunc : function() {
					if (dmaMenu.get("prntMenuCd") == dmaMenu.get("menuCd")) {
						return "상위 메뉴 코드와 메뉴 코드가 같아서는 안됩니다.";
					}
				  }
				},
				{ id : "menuNm", mandatory : true },
				{ id : "menuLevel", mandatory : true },
				{ id : "menuSeq", mandatory : true },
				{ id : "urlPath", mandatory : true },
				{ id : "isUse", mandatory : true } ];

if (com.data.validateGridView(grd_MenuAuthority, valInfo, tacMenuInfo, "tabMenuInfo1") == false) {
   return false;
}

 * @description
입력 허용 문자, 입력 허용 불가 문자, 최대 입력 문자수 설정은 GridView의 Column의 속성에서 설정한다. <br/>
- allowChar : 입력 허용 문자 <br/>
- ignoreChar : 입력 허용 불가 문자 <br/>
- maxLength : 최대 입력 문자수 <br/>
- maxByteLength : 최대 입력 바이트수 <br/>
 */
com.data.validateGridView = function (gridViewObj, valInfoArr, tacObj, tabId) {
	if (gridViewObj === null) {
		return false;
	} else {
		gridViewObj.removeFocusedCell();
	}

	var dataList = com.util.getGridViewDataList(gridViewObj);
	if (dataList === null) {
		console.log("Can not find the datalist of '" + gridViewObjId + "' object.");
		return false;
	}

	var errors = [];

	try {
		var modifiedIdx = dataList.getModifiedIndex();
		for (var dataIdx = 0; dataIdx < modifiedIdx.length; dataIdx++) {
			var valInfo = {};
			var isVaild = false;

			var modifiedData = dataList.getRowJSON(modifiedIdx[dataIdx]);
			if (modifiedData.rowStatus === "D") {
				continue;
			}

			for (var valIdx in valInfoArr) {
				if ((typeof valInfoArr[valIdx].id !== "undefined") && (modifiedData[valInfoArr[valIdx].id] !== "undefined")) {
					var value = modifiedData[valInfoArr[valIdx].id];
					if (typeof value === "string") {
						value = value.trim();
					}
					_setResult(modifiedIdx[dataIdx], dataList, gridViewObj.getID(), valInfoArr[valIdx], value);
				}
			}
		}

		if (errors.length > 0) {
			if ((typeof tacObj !== "undefined") && (typeof tabId !== "undefined") && (tabId !== "")) {
				var tabIndex = tacObj.getTabIndex(tabId);
				tacObj.setSelectedTabIndex(tabIndex);
			}

			var option = {
				callBackParam : {
					"objId" : errors[0].objId,
					"columnId" : errors[0].columnId,
					"rowIndex" : errors[0].rowIndex,
				}
			};

			com.win.alert(errors[0].message, function(param) {
				var grdiViewObj = $p.getComponentById(param.objId);
				grdiViewObj.setFocusedCell(param.rowIndex, param.columnId, true);
			}, option);

			return false;
		} else {
			return true;
		}

		function _setResult(rowIndex, dataList, gridViewObjId, valInfo, value) {

			var msgInfo = gcm.data._getValResultMsg(valInfo, value);

			if (com.util.isEmpty(msgInfo.message) === false) {
				var errIdx = errors.length;
				errors[errIdx] = {};
				errors[errIdx].columnId = valInfo.id;
				errors[errIdx].objId = gridViewObjId;
				if (com.util.isEmpty(valInfo.label) === false) {
					errors[errIdx].columnName = valInfo.label;
				} else {
					errors[errIdx].columnName = dataList.getColumnName(valInfo.id);
				}
				errors[errIdx].rowIndex = rowIndex;

				if (msgInfo.msgType == "2") {
					errors[errIdx].message = msgInfo.message;
				} else {
					errors[errIdx].message = com.str.attachPostposition(errors[errIdx].columnName) + " " + msgInfo.message;
				}
			}
		}
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * DataList를 동적으로 생성한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {String} dsId	:: I :: Y ::  :: DataList의 아이디
 * @param {Array} colArr   :: I :: Y ::  :: 컬럼정보
 * @param {Array} typeArr  :: I :: Y ::  :: 컬럼들의 dataType 정의
 * @param {Object} options :: I :: N ::  :: dataCollection의 속성[baseNode, repeatNode, saveRemovedData, scwinObj]
 * @return {Object} dataCollection(dataList)
 * @author Inswave Systems
 * @example
var dcoptions = {
	baseNode : "list",
	repeatNode : "map",
	saveRemovedData : "true"
};
var dlObj = com.data.createDataList("dlt_code", ["cdGrp", "cd", "nm","ord"], ["text", "text", "text", "text"] , dcoptions);
 */
com.data.createDataList = function(dsId, colArr, typeArr, options) {
	try {
		var dltObj = com.util.getComponent(dsId);
		if (!com.util.isEmpty(dltObj)) {
			$p.data.remove( dsId );
		}

		var colInfoJSON = [];
		if (typeof colArr !== "undefined") {

			colInfoJSON = [];

			for (var i=0; i < colArr.length; i++) {
				var dataType = "text";
				if (typeof typeArr !== "undefined") {
					dataType = typeArr[i];
				}
				var colInfo = {
					"id" : colArr[i],
					"dataType" : dataType,
					"name" : colArr[i]
				};
				colInfoJSON.push(colInfo);
			}
		}

		if (typeof options === "undefined") {
			options = {};
			options.baseNode = "list";
			options.repeatNode = "map";
			options.saveRemovedData = "true";
		};

		var dataCollectionJSON = {
			id : dsId,
			type : "dataList",
			option : {
				"baseNode" : options.baseNode || "list",
				"repeatNode" : options.repeatNode || "map",
				"saveRemovedData" : options.saveRemovedData || "true",
			},
			columnInfo : colInfoJSON
		};

		var codeDataObj = $p.data.create(dataCollectionJSON);
		return com.util.getComponent(dsId);
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * DataMap을 동적으로 생성한다.
 *
 * @memberOf com.data
 * @date 2020.05.16
 * @param {String} dsId	:: I :: Y ::  :: dataMap 의 아이디
 * @param {Array} colArr   :: I :: Y ::  :: 컬럼정보
 * @param {Object} options :: I :: N ::  :: DataMap 생성 옵션
 * @author Inswave Systems
 * @return {Object} dataCollection(dataMap)
 * @example
var mapObj = com.data.createDataMap("dma_test", ["col1", "col2", "col3"] , ["text", "text", "text"]);
 */
com.data.createDataMap = function(dsId, colArr, typeArr, options) {
	try{
		var dltObj = com.util.getComponent(dsId);
		if (!com.util.isEmpty(dltObj)) {
			$p.data.remove( dsId );
		}

		var colInfoJSON = [];
		if (typeof colArr !== "undefined") {
			colInfoJSON = [];
			for (var i=0; i < colArr.length; i++) {
				var dataType = "text";
				if (typeof typeArr !== "undefined") {
					dataType = typeArr[i];
				}
				var colInfo = {
					"id" : colArr[i],
					"type" : dataType,
					"name" : colArr[i]
				};
				colInfoJSON.push(colInfo);
			}
		}

		if (typeof options === "undefined") {
			options = {
				"baseNode" :  "map",
			};
		};

		var dataCollectionJSON = {
			"id" : dsId,
			"type" : "dataMap",
			"option" : {
				"baseNode" : options.baseNode || "map",
			},
			"keyInfo" : colInfoJSON
		};

		$p.data.create(dataCollectionJSON);
		return com.util.getComponent(dsId);
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 전체 데이터를 초기 설정 된 데이터(originalData)로 바꾸고 행의 상태를 초기화(R) 시킨다.
 * 초기 설정 된 데이터 란 setJSON, setXML 등과 같은 API들을 통해 설정 된 데이터가 이에 속한다.
 * 추가(C)된 행은 제거한다
 *
 * @param {String} dltId DataList 객체 또는 DataList 아이디
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
com.data.undoAll(dlt_grdAllData);
 */
com.data.undoAll = function(dltId) {
	try {
		var dltObj = null;
		if (typeof dltId === "string") {
			dltObj = com.util.getComponent(dltId);
		} else {
			dltObj = dltId;
		}

		var rowCount = dltObj.getRowCount();
		var removeIdx = [];
		var undoIdx =[];

		dltObj.setBroadcast(false);

		for (var i = 0; i <rowCount; i++) {
			if(dltObj.getRowStatus(i) == "C") {
				removeIdx.push(i);
				continue;
			}
			undoIdx.push(i)
		}

		dltObj.removeRows(removeIdx);
		dltObj.undoRows(undoIdx);

		dltObj.setBroadcast(true, true);
	} catch (ex) {
		console.error(ex)
	}
};

/**
 * 지정한 GridView에 선택컬럼(chk)이 체크된 Row들을 취소(Undo) 처리한다.
 *
 * @param {String} dltId DataList 객체 또는 DataList 아이디
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
com.data.undoRow(dlt_data1);
 */
com.data.undoRow = function(dltId) {
	try {
		var dltObj = null;
		if (typeof dltId === "string") {
			dltObj = com.util.getComponent(dltId);
		} else {
			dltObj = dltId;
		}

		var checkedIdx = dltObj.getMatchedIndex("chk", "1");

		dltObj.setBroadcast(false);

		for (var idx = checkedIdx.length - 1; idx >= 0; idx--) {
			if(dltObj.getRowStatus(checkedIdx[idx]) == "C") {
				dltObj.removeRow(checkedIdx[idx]);
			} else {
				dltObj.undoRow(checkedIdx[idx]);
			}
		}

		dltObj.setBroadcast(true, true);
	} catch (ex) {
		console.error(ex);
	}
};



/**
 * 지정한 GridView에 선택컬럼(chk)이 체크된 Row들을 삭제(Delete) 처리한다.
 *
 * @param {String} dltId DataList 객체 또는 DataList 아이디
 * @memberOf com.data
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
com.data.deleteRow(dlt_data1);
 */
com.data.deleteRow = function(dltId) {
	try {
		var dltObj = null;
		if (typeof dltId === "string") {
			dltObj = com.util.getComponent(dltId);
		} else {
			dltObj = dltId;
		}

		var checkedIdx = dltObj.getMatchedIndex("chk", "1");

		dltObj.setBroadcast(false);

		for (var idx = checkedIdx.length - 1; idx >= 0; idx--) {
			if(dltObj.getRowStatus(checkedIdx[idx]) == "C") {
				dltObj.removeRow(checkedIdx[idx]);
			} else {
				dltObj.deleteRow(checkedIdx[idx]);
				dltObj.setCellData(checkedIdx[idx], "chk", "");
			}
		}

		dltObj.setBroadcast(true, true);
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 검색 조건에 맞는 데이터를 반환한다.
 * @date 2021.02.16
 * @memberOf com.data
 * @author Inswave Systems
 * @param {Object} dataListObj : DataList Id 또는 DataList 객체
 * @param {Array|Object} condArr 비교 조건
 * @param {String} condArr.columnId 컬럼 아이디
 * @param {String} condArr.operator 비교 연산자 ( ==, !=, >, <, >=, <=, LIKE )
 * @param {String|Number|Boolean} condArr.value 비교 값
 * @param {String} condArr.logical 논리 연산자 ( &&, ||)
 * @returns {Object} DataList Id 또는 DataList 객체
 * @example
com.data.getMatchedJSON(dlt_memberList, { columnId : "POSITION_CD", operator : "==", value : "03"});

com.data.getMatchedJSON(dlt_memberList, [
	{ columnId : "POSITION_CD", operator : "==", value : "03" },
	{ columnId : "DUTY_CD", operator : "==", value : "02", logical : "&&" }
]);

com.data.getMatchedJSON(dlt_memberList, [
	{ columnId : "POSITION_CD", operator : "==", value : "03" },
	{ columnId : "DUTY_CD", operator : "==", value : "02" }
]);

com.data.getMatchedJSON(dlt_memberList, [
	{ columnId : "POSITION_CD", operator : "==", value : "03"},
	{ columnId : "DUTY_CD", operator : "lIKE", value : "0", logical : "||" }
]);
};
 */
com.data.getMatchedJSON = function(dataListObj, condArr) {
	if (typeof dataListObj === "string") {
		dataListObj = $p.getComponentById(dataListObj);
	}
	
	var returnData = [];
	var allData = dataListObj.getAllJSON();

	if (com.util.isArray(condArr) === false) {
		condArr = [ condArr ];
	}
	
	for (var idx = 0; idx < allData.length; idx++) { 
		var result = true;
		
		for (var conIdx = 0; conIdx < condArr.length; conIdx++) {
			var colValue = allData[idx][condArr[conIdx].columnId.trim()];
			var value = condArr[conIdx].value;
			var operator = condArr[conIdx].operator.trim();
			var logical = (condArr[conIdx].logical || "&&").trim();

			if (operator === "==") {
				if (colValue == value) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&"){
						result = false;
					}
				}
			} else if (operator === "!=") {
				if (colValue != value) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&") {
						result = false;
					}
				}
			} else if (operator === ">") {
				if (colValue > value) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&") {
						result = false;
					}
				}
			} else if (operator === "<") {
				if (colValue < value) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&") {
						result = false;
					}
				}
			} else if (operator === ">=") {
				if (colValue >= value) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&") {
						result = false;
					}
				}
			} else if (operator === "<=") {
				if (colValue <= value) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&") {
						result = false;
					}
				}
			} else if (operator === "LIKE") {
				if (colValue.indexOf(value) > -1) {
					if (logical === "||") {
						result = true;
						break;
					}
				} else {
					if (logical === "&&") {
						result = false;
					}
				}
			} else {
				result = false;
			}
		}
		
		if (result === true) {
			returnData.push(allData[idx]);
		}
	}
	
	return returnData;
};

// =============================================================================
/**
 * 웹스퀘어 컴포넌트 제어, 엑셀 파일 업로드/다운로드, 파일 업로드/다운로드, 기타 유틸리티 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class util
 * @namespace com.util
 */
// =============================================================================

com.util = {};

/**
 * JSON Object로 변환해서 반환한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {String|XML} value JSON 문자열 또는 XML Document
 * @return {Object} JSON 객체 or null
 * @author Inswave Systems
 * @example
// 유효하지 않은 JSON 문자열 일 경우
com.util.getJSON("");
// return 예시)	null

// 유효한 JSON 문자열
var json = '{"tbx_sPrjNm":"1","tbx_sPrtLv":"2","tbx_sReqLv":"3"}';
com.util.getJSON(json);
// return 예시)	{tbx_sPrjNm: "1", tbx_sPrtLv: "2", tbx_sReqLv: "3"}
 */
com.util.getJSON = function (value) {
	try {
		if (com.util.isXmlDoc(value) === true) {
			return JSON.parse(WebSquare.json.XML2JSONString(value));
		} else {
			return JSON.parse(value);
		}
	} catch (ex) {
		return value;
	}
};


/**
 * JSON Object인지 여부를 검사한다.
 *
 * @param {Object} jsonObj JSON Object가 맞는지 검사할 JSON Object
 * @memberOf com.util
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} true or false
 * @example
com.util.isJSON("123");
// return 예시) false
com.util.isJSON([1,2,3]);
// return 예시) false
com.util.isJSON([{"name" : "홍길동"}, {"name" : "허균"}]);
// return 예시) true
com.util.isJSON( {"tbx_sPrjNm": "1", "tbx_sPrtLv": "2", "tbx_sReqLv": "3"} );
// return 예시) true
 */
com.util.isJSON = function(json) {
	try {
		if (typeof json === "object") {
			try {
				if (com.util.isArray(json)) {
					if (com.util.isPlainObject(json[0])) {
						return true;
					} else {
						return false;
					}
				} else {
					if (com.util.isPlainObject(json)) {
						return true;
					} else {
						return false;
					}
				}
			} catch (ex) {
				return false;
			}
		} else if ((typeof json === "string") && com.util.isPlainObject(json)) {
			try {
				var jsonObj = JSON.parse(json);
				if (com.util.isArray(jsonObj)) {
					if (com.util.isPlainObject(jsonObj[0])) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			} catch (ex) {
				console.error(ex);
				return false;
			}
		}
		return false;
	} catch (ex) {
		console.error(ex);
		return false;
	}
};


/**
 * 배열 객체인지 여부를 확인한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {Object}  array :: I :: N :: :: Array Object or String
 * @return {Boolean} Array 배열 판단 여부(Array 객체인 경우 true, 아닌경우 false)
 * @author Inswave Systems
 * @example
com.util.isArray(arrObject); // return true
 */
com.util.isArray = function(array) {
	try {
		if ((typeof array !== "undefined") && (array !== null) && (typeof array == "object")) {
			if (array.constructor.name && array.constructor.name.toLowerCase() == "array")
				return true;
			if (array.constructor && array.constructor == Array)
				return true;
		}
		return false;
	} catch (ex) {
		console.error(ex);
		return false;
	}
};


/**
 * 값이 Empty 상태(undefined, null, "")인지 판별한다.
 * @memberOf com.util
 * @date 2020.05.16
 * @param value Empty 여부를 판단할 값
 * @return Empty 여부 (true : Empty, false : Not Empty)
 * @example
if (com.util.isEmpty(empCd) === false) {
	console.log("empCd : " + empCd);
}
 */
com.util.isEmpty = function(value) {
	if ((typeof value === "undefined") || (value === null) || (value === "")) {
		return true;
	} else {
		return false;
	}
};


/**
 * 객체의 typeof 값을 반환하며 typeof의 값이 object인 경우 array, json, xml, null로 체크하여 반환한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {Object} obj type을 반환 받을 객체(string,boolean,number,object 등)
 * @author Inswave Systems
 * @return {String} 객체의 타입으로 typeof가 object인 경우 array, json, xml, null로 세분화하여 반환한다. 그외 object타입이 아닌경우 원래의 type(string,boolean,number 등)을 반환한다.
 * @example
 com.util.getObjectType("WebSquare");
 // return 예시) "string"

 com.util.getObjectType({"name":"WebSquare"});
 // return 예시) "json"

 com.util.getObjectType(["1","2"]);
 // return 예시) "array"
*/
com.util.getObjectType = function (obj) {
	var objType = typeof obj;
	if (objType !== "object") {
		return objType;
	} else if (com.util.isArray(obj)) {
		return "array";
	} else if (com.util.isJSON(obj)) {
		return "json";
	} else if (objType === "object" && (com.util.isJSON(obj) === false)) {
		return "object";
	} else if (obj === null) {
		return "null";
	} else {
		var tmpDoc = WebSquare.xml.parse("<data></data>");
		if (obj.constructor === tmpDoc.constructor || obj.constructor === tmpDoc.childNodes[0].constructor) {
			return "xml";
		} else {
			return objType;
		}
	}
};


 
 /**
  * 값이 Plain Object인지 검사한다. 
  *
 * @memberOf com.util
 * @date 2021.04.19
 * @param {Object} obj Plain Object인지 검사할 값
 * @author Inswave Systems
 * @return Plain 객체 여부
 * @example
com.util.isPlainObject(1); // false
com.util.isPlainObject("name"); // false
com.util.isPlainObject([1,2,3]); // false
com.util.isPlainObject({}); // true
com.util.isPlainObject({ "name" : "홍길동"}); // true
com.util.isPlainObject([{ "name" : "홍길동"}]); // false
*/
com.util.isPlainObject = function(obj) {
	var consObj, protObj;

	if (Object.prototype.toString.call(obj) !== '[object Object]') return false;

	consObj = obj.constructor;
	if (consObj === undefined) return true;

	protObj = consObj.prototype;
	if (Object.prototype.toString.call(protObj) !== '[object Object]') return false;

	if (protObj.hasOwnProperty('isPrototypeOf') === false) {
		return false;
	}

	return true;
};

/**
 * 현재 클라이언트 브라우저 환경의 모바일 여부를 반환한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @author Inswave Systems
 */
com.util.isMobile = function () {
	return WebSquare.util.isMobile();
};


/**
 * XML Document 객체인지 여부를 검사한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {Object} data XML Document 객체인지 여부를 검사한다.
 * @author Inswave Systems
 * @return {Boolean} true or false
 */
com.util.isXmlDoc = function(data) {
	if (typeof data != 'object')
		return false;
	if ((typeof data.documentElement != 'undefined' && data.nodeType == 9)
			|| (typeof data.documentElement == 'undefined' && data.nodeType == 1)) {
		return true;
	}
	return false;
};


/**
 * GridView Row 삭제를 위한 CheckBox 동작을 세팅한다.
 * GridView에 삭제용 CheckBox가 있을 경우 onPageLoad 이벤트에서 com.util.setGridViewDelCheckBox 함수를 호출한다.
 * 이 함수가 정상 동작하려면 GridView의 Delete 처리용 CheckBox의 ColumnId와 Header Id를 "chk"로 설정해야 한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @author Inswave Systems
 * @param {Array} gridViewObj GridView 객체 배열
 * @example
com.util.setGridViewDelCheckBox(grd_OrganizationBasic);
com.util.setGridViewDelCheckBox([grd_Menu, grd_MenuAccess]);
 */
com.util.setGridViewDelCheckBox = function (gridViewObjArr) {
	try {
		if (com.util.getObjectType(gridViewObjArr) === "array") {
			for (idx in gridViewObjArr) {
				setGridViewDelCheckBox(gridViewObjArr[idx]);
			}
		} else {
			setGridViewDelCheckBox(gridViewObjArr);
		}

		function setGridViewDelCheckBox(gridViewObj) {
			gridViewObj.bind("oncellclick",
				function (row, col) {
					var columnId = gridViewObj.getColumnID(col);
					if (columnId == "chk") {
						var dltObj = com.util.getGridViewDataList(this);
						var realRowIndex = this.getRealRowIndex(row);

						if(dltObj.getFilterList().length >0){
							realRowIndex = dltObj.getFilteredRowIndex(realRowIndex);
						}
						var newValue = dltObj.getCellData(realRowIndex, columnId);
						com.util._setGridViewRowCheckBox(this, realRowIndex, newValue === "1" ? true : false);
					}
				}
			);
			gridViewObj.bind("onheaderclick",
				function (headerId) {
					if (headerId == "chk") {
						var newValue = this.getHeaderValue(headerId);
						var dltObj = com.util.getGridViewDataList(this);
						var rowCount = dltObj.getRowCount();
						var removeIdx = [];
						var deleteIdx = [];
						var undoIdx =[];
						for (var i = 0; i <rowCount; i++) {
							var realRowIndex = dltObj.getRealRowIndex(i);

							if (dltObj.getFilterList().length > 0) {
								realRowIndex = dltObj.getFilteredRowIndex(realRowIndex);
							} 
							
							if (dltObj.getRowStatus(realRowIndex) == "C") {
								removeIdx.push(realRowIndex);
								continue;
							} 
							
							if (newValue) {
								deleteIdx.push(realRowIndex);
							} else {
								undoIdx.push(realRowIndex)
							}
						}

						if (newValue) {
							dltObj.deleteRows(deleteIdx);
							dltObj.removeRows(removeIdx);
						} else {
							dltObj.undeleteRows(undoIdx);
						}

					}
				}
			);
		}
	} catch (ex) {
		console.error(ex);
	}
};


com.util._setGridViewRowCheckBox = function (gridViewObj, rowIndex, newValue) {
	var rowIndexArr = gridViewObj.getChildrenRowIndexArray(rowIndex);
	var dltObj = com.util.getGridViewDataList(gridViewObj);

	for (var idx in rowIndexArr) {
		var childRowIndexArr = gridViewObj.getChildrenRowIndexArray(rowIndexArr[idx]);

		if (childRowIndexArr.length > 0) {
			com.util._setGridViewRowCheckBox( gridViewObj, rowIndexArr[idx], newValue);
		} else {
			com.util._deleteGridViewRow(gridViewObj, rowIndexArr[idx], newValue);
		}
	}

	com.util._deleteGridViewRow(gridViewObj, rowIndex, newValue);
};


com.util._deleteGridViewRow = function (gridViewObj, rowIndex, newValue) {
	gridViewObj.setCellChecked(rowIndex, "chk", newValue);
	var dltObj = com.util.getGridViewDataList(gridViewObj);

	if (newValue) {
		var rowStatus = dltObj.getRowStatus(rowIndex);
		if (rowStatus == "C") {
			dltObj.deleteRow(rowIndex);
			dltObj.removeRow(rowIndex);
		} else {
			dltObj.deleteRow(rowIndex);
		}
	} else {
		dltObj.undeleteRow(rowIndex);
	}
}


/**
 * 특정 컴포넌트의 자식 컴포넌트를 배열로 반환한다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {Object} comObj 컴포넌트 객체
 * @param {Object} options 하위 컴포넌트 검색 옵션 정보
 * @param {String} options.includeId 포함할 컴포넌트 id. 인자가 여러 개일 경우 공백을 구분자로 사용함.
 * @param {String} options.includePlugin 포함 컴포넌트 플러그인 이름. 인자가 여러 개일 경우 공백을 구분자로 사용함.
 * @author Inswave Systems
 * @example
com.util.getChildren(grp_content);
com.util.getChildren(grp_content, {excludePlugin : "trigger input", excludeId : "treeview1_tooltip windowContainer1_tooltip");
com.util.getChildren(grp_content, {includeId : "ibx_name sbx_payTy"});
com.util.getChildren(grp_content, {includePlugin : "selectbox"});
com.util.getChildren(grp_content, {includeId : "ibx_name sbx_payTy", includePlugin : "input selectbox"});
 */
com.util.getChildren = function(comObj, options) {
	return WebSquare.util.getChildren(comObj, options);
};


/**
 * GridView와 바인딩된 DataList 객체를 반환한다.
 *
 * @param {Object} gridViewObj 바인딩 된 DataList가 존재하는지 검증할 GridView 객체
 * @memberOf com.util
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} 바인딩 된 DataList 객체 반환 (바인된 객체가 없을 경우 null 반환)
 * @example
// 바인딩 되어있는 경우
com.util.getGridViewDataList(grd_First);
// return 예시) "dlt_first"

// 바인딩 되어있지 않은 경우
com.util.getGridViewDataList(grd_First);
// return 예시) undefined
 */
com.util.getGridViewDataList = function (gridViewObj) {
	var dataListId = gridViewObj.getDataList();

	if (dataListId !== "") {
		var dataList = $p.getComponentById(dataListId);
		if ((typeof dataList === "undefined") || (dataList === null)) {
			console.log("DataList(" + dataListId + ")를 찾을 수 없습니다.");
			return null;
		} else {
			return dataList;
		}
	} else {
		console.log(gridViewObj.getID() + "는 DataList가 세팅되어 있지 않습니다.");
		return null;
	}
};


/**
 * 주어진 아이디에 해당하는 웹스퀘어 컴포넌트를 찾아 반환한다.
 *
 * @param {String} compId 컴포넌트 아이디
 * @memberOf com.util
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} 바인딩 된 DataList 객체 반환 (바인된 객체가 없을 경우 null 반환)
 * @example
var object = com.util.getGridViewDataList(compId);
 */
com.util.getComponent = function(compId) {
	var object = $p.getComponentById(compId);
	if (typeof object === "undefined") {
		return null;
	} else {
		return object
	}
};


/**
 * 주어진 인자를 통해 동적으로 Component를 생성합니다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {String} strCompId 컴포넌트 ID
 * @param {String} strCompName 컴포넌트 태그명
 * @param {Object} option 컴포넌트 옵션
 * @param {String} parent 컴포넌트 생성 부모 노드 위치
 * @param {Object} itemSet 컴포넌트 setItemset 옵션
 * @return {Object} 생성된 컴포넌트 객체
 * @author Inswave Systems
 * @example
com.util.createComponent("ibx_input1", "input" );
com.util.createComponent("ibx_input2", "input", { style: "width:120px; height:40px; float:left; margin : 20px;" });
com.util.createComponent("ibx_input2", "input", { style: "width:120px; height:40px; float:left; margin : 20px;" }, grp_content1);
 */
com.util.createComponent = function(strCompId, strCompName, option, parent, itemSet) {
	try {
		if ((typeof strCompId !== "undefined") && (strCompId !== "") && (typeof strCompName !== "undefined") && (strCompName !== "")) {

			if (typeof option == "undefined") {
				option = {};
			}

			if (typeof parent == "undefined") {
				parent = "";
			}

			if (typeof itemSet == "undefined") {
				itemSet = "";
			}

			return $p.dynamicCreate(strCompId, strCompName, option, parent, itemSet);
		}
	} catch (ex) {
		console.error(ex);
		return null;
	}
};


/**
 * 사용자가 지정한 함수가 주기적으로 실행된다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {Function} func	실행할 함수
 * @param {Object} options	options인자로는 아래와 같은 인자가 사용된다.
 * @param {String} options.key timer를 구별하기 위한 키값. 이 값이 지정되지 않은 경우 키값을 func.toString().slice(0,30)을 키값으로 사용한다.
 * @param {Number} options.delay setInterval의 2번째 인자값. func함수가 delay시간 이후에 실행되도록 한다.  기본값은 1이다.
 * @param {Object} options.caller func내에서 this값을 caller로 변경한다.
 * @param {Object} options.args func에 전달할 인자값. array형태로 인자를 전달한다.
 * @param {Function} options.before_call : func 함수가 실행되기 직전에 실행할 함수. func함수와 마찬가지로 data를 인자로 받는다.
 * @param {Function} options.callback : func함수가 실행된 후에 실행할 함수. func함수의 return값을 인자로 받는다
 * @author Inswave Systems
 * @description
실행할 함수를 함수를 setInterval로 등록하여 함수가 주기적으로 계속 실행되도록 한다.SPA모드에서 페이지 이동 시 이 함수로 등록한 타이머를 자동으로 제거한다.
 * @example
com.util.setInterval(
	function() {
		com.win.alert("처리가 완료 되었습니다");
	},
	{ caller : grd_data1, delay : 2000, key : "interval1" }
);
 */
com.util.setInterval = function(func, options) {
	$p.setInterval(func, options);
};


/**
 * com.util.setInterval API를 이용하여 등록 한 함수를 직접 Clear시킨다.
 *
 * @memberOf com.util
 * @date 2020.10.23
 * @param {String} keyName	key로 지정한 값. ( com.util.setInterval API 호출 시 options에 등록 한 key명)
 * @param {Boolean} force	keyName으로 지정 된 Interval 객체를 해제하기 전 해당 함수를 한 번 실행할지에 대한 여부. 기본값은 false.
 * @author Inswave Systems
 * @description
실행할 함수를 함수를 setInterval로 등록하여 함수가 주기적으로 계속 실행되도록 한다.SPA모드에서 페이지 이동 시 이 함수로 등록한 타이머를 자동으로 제거한다.
 * @example
com.util.clearInterval("timer1");
 */
com.util.clearInterval = function(func, options) {
	$p.clearInterval(func, options);
};


/**
 * 사용자가 지정한 함수가 일정 시간 후에 실행된다.
 *
 * @memberOf com.util
 * @date 2020.05.16
 * @param {Function} func	실행할 함수
 * @param {Object} options	options인자로는 아래와 같은 인자가 사용된다.
 * @param {String} options.key timeout을 구별하기 위한 키값. 이 값이 지정되지 않은 경우 키값을 func.toString().slice(0,30)을 키값으로 사용한다.
 * @param {Number} options.delay func로 지정한 함수가 실행 될 간격으로 기본값은 1ms(millisecond / 1000분의 1초)이다. javascript setTimeout의 2번째 인자값.
 * @param {Object} options.caller func로 지정한 함수내에서 this값으로 지정 할 객체(웹스퀘어 컴포넌트 포함).
 * @param {Object} options.args func에 전달할 인자값. array형태로 인자를 전달한다.
 * @param {Function} options.before_call : func로 지정한 함수가 실행되기 직전에 실행 할 함수. func함수와 마찬가지로 data를 인자로 받는다.
 * @param {Function} options.callback : func로 지정한 함수가 실행된 후에 실행 할 함수. func로 지정한 함수의 return값을 인자로 받는다.
 * @author Inswave Systems
 * @description
실행할 함수를 함수를 setInterval로 등록하여 함수가 주기적으로 계속 실행되도록 한다.SPA모드에서 페이지 이동 시 이 함수로 등록한 타이머를 자동으로 제거한다.
 * @example
com.util.setTimeout(
	function() {
		com.win.alert("5분이 지났습니다.");
	},
	{ delay : 300000, key : "loginTimeout" }
);
 */
com.util.setTimeout = function(func, options) {
	$p.setTimeout(func, options);
};




/**
 * com.util.setTimer API를 이용하여 등록 한 함수를 직접 Clear시킨다.
 *
 * @memberOf com.util
 * @date 2020.10.23
 * @param {String} keyName	key로 지정한 값. ( com.util.setTimeout API 호출 시 options에 등록 한 key명)
 * @param {Boolean} force	keyName으로 지정 된 Interval 객체를 해제하기 전 해당 함수를 한 번 실행할지에 대한 여부. 기본값은 false.
 * @author Inswave Systems
 * @description
실행할 함수를 함수를 setInterval로 등록하여 함수가 주기적으로 계속 실행되도록 한다.SPA모드에서 페이지 이동 시 이 함수로 등록한 타이머를 자동으로 제거한다.
 * @example
com.util.clearTimeout("timer1");
 */
com.util.clearTimeout = function(func, options) {
	$p.clearTimeout(func, options);
};


/**
 * 입력 가능한 컴포넌트(input, textarea 등) 객체의 내용을 클립보드에 저장한다.
 *
 * @param {Object} 컴포넌트 객체
 * @memberOf com.util
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
// ibx_message InputBox내 Text가 Select 되면서 Clipboard에 복사된다.
com.util.copyClipboard(ibx_message);

 * @descripton
※ 주의사항
- IE 10+, Chrome 43+, Opera 29+, Firefox에서만 사용 가능함
- IE의 경우 클립복드 복사 허용을 묻는 확인 창이 뜸
 */
com.util.copyClipboard = function(comObj) {
	if (typeof comObj !== "undefined") {
		comObj.select();
	}
	document.execCommand("Copy");
};


/**
 * 문자열을 함수로 반환한다.
 *  
 * @param {String} functionName 함수명
 * @memberOf com.util
 * @date 2020.11.23
 * @author Inswave Systems
 * @example
var func = com.util.getFunctionByName(options.func , window );
 */
com.util.getFunctionByName = function (functionName, context ) {
	var rtnFunc;
	try {
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for (var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		rtnFunc =  context[func];
	} catch (ex) {
		rtnFunc = null;
	}
	return rtnFunc;
};


// =============================================================================
/**
 * 업무 화면 영역 제어(권한, 업무 화면 공통 UI 요소 및 버튼 제어, 개인화 등) 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class win
 * @namespace com.win
 */
// =============================================================================

com.win = {};

/**
 * 최상위 page를 index화면으로 이동 (/)
 * 
 * @date 2016.08.05
 * @memberOf com.win
 * @author Inswave Systems
 */
com.win.goHome = function() {
	if (gcm.CONTEXT_PATH == "") {
		top.window.location.href = "/";
	} else {
		top.window.location.href = gcm.CONTEXT_PATH;
	}
};

/**
 * 로그아웃으로 WAS의 사용자 session을 삭제한다.
 * 정상 처리 : /로 이동.
 * 오류 발생 : 기존 화면으로 오류 메세지 전송
 * 
 * @date 2016.08.08
 * @memberOf com.win
 * @author Inswave Systems
 * @example
 * com.win.logout();
 */
com.win.logout = function() {
	var logoutGrpOption = {
		id : "_sbm_Logout",
		action : "/main/logout",
		target : "",
		submitDoneHandler : "com.win.goHome",
		isProcessMsg : false
	};
	com.sbm.executeDynamic(logoutGrpOption);
};

/**
 * 로그인한 사용자가 시스템 관리자 인지의 여부를 반환한다.
 * 
 * @date 2018.12.01
 * @memberOf com.win
 * @author Inswave Systems
 */
com.win.isAdmin = function() {
	scwin.isAdmin = $p.top().wfm_side.getWindow().dma_defInfo.get("IS_ADMIN");
	if (scwin.isAdmin === "Y") {
		return true;
	} else {
		return false;
	}
}

/**
 * 사용자의 권한에 따른 화면 컴포넌트 제어를 한다.
 *
 * @private
 * @memberOf com.win
 * @date 2020.05.26
 * @author Inswave Systems
 */
com.win._setProgramAuthority = function() {
	var param = com.data.getParameter();
	if ((typeof param !== "undefined") && (typeof param.menuCode !== "undefined") && (param.menuCode.trim() !== "")) {
		var menuCd = param.menuCode;
		var menuInfoList = $p.top().wfm_side.getWindow().dlt_menu.getMatchedJSON("MENU_CD", menuCd);

		if (menuInfoList.length > 0) {
			var programAuthorityList = $p.top().wfm_side.getWindow().dlt_programAuthority.getMatchedJSON("PROGRAM_CD", menuInfoList[0].PROGRAM_CD);

			if (programAuthorityList.length > 0) {
				var programAuthority = programAuthorityList[0];
				var objArr = com.util.getChildren($p.getFrame(), {
					excludePlugin : "group textbox output calendar image span",
					recursive : true
				});

				for (var i = 0; i < objArr.length; i++) {
					if ((objArr[i].getPluginName() === "anchor") || (objArr[i].getPluginName() === "trigger")) {
						if (objArr[i].getOriginalID().indexOf("btn_search") > -1) {
							if (programAuthority.IS_AUTH_SELECT !== "Y") {
								objArr[i].hide();
							}
						} else if (objArr[i].getOriginalID().indexOf("btn_add") > -1) {
							if (programAuthority.IS_AUTH_SAVE !== "Y") {
								objArr[i].hide();
							}
						} else if (objArr[i].getOriginalID().indexOf("btn_cancel") > -1) {
							if (programAuthority.IS_AUTH_SAVE !== "Y") {
								objArr[i].hide();
							}
						} else if (objArr[i].getOriginalID().indexOf("btn_save") > -1) {
							if (programAuthority.IS_AUTH_SAVE !== "Y") {
								objArr[i].hide();
							}
						} else if (objArr[i].getOriginalID().indexOf("btn_excel") > -1) {
							if (programAuthority.IS_AUTH_EXCEL !== "Y") {
								objArr[i].hide();
							}
						}
					}
				}
			}
		}
	}
}


/**
 * 공통 코드, 권한, 개인화 처리를 위한 Workflow를 실행한다.
 *
 * @private
 * @memberOf com.win
 * @date 2020.05.27
 * @author Inswave Systems
 */
com.win._processCommonData = function() {
	var commonDataWorkflow = {
		"id" : "wkf_commonDataWorkflow",
		"processMsg" : "",
		"step" : [],
		"resolveCallback" : "",
		"rejectCallback" : ""
	};
	
	if (typeof scwin.ondataload === "function") {
		commonDataWorkflow["resolveCallback"] = scwin.ondataload;
	}

	var sbmSearchCode = com.util.getComponent("_sbm_searchCode");

	if (com.util.isEmpty(sbmSearchCode) === false) {
		commonDataWorkflow.step = [
			{ "type" : "submit", "action" : "_sbm_searchCode" },
			{ "type" : "submitDone", "action" : "_sbm_searchCode" }
		];
	}
	
	var sbmSelectShortcutList = com.util.getComponent("_sbm_selectShortcutList");
	
	if (com.util.isEmpty(sbmSelectShortcutList) === false) {
		commonDataWorkflow.step.push({ "type" : "submit", "action" : "_sbm_selectShortcutList" });
		commonDataWorkflow.step.push({ "type" : "submitDone", "action" : "_sbm_selectShortcutList" });
	}

	if (commonDataWorkflow.step.length > 0) {
		com.sbm.executeWorkflow(commonDataWorkflow);
	}
};


/**
 * contextRoot가 포함된 path를 반환한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @param {String} path 파일경로(Context가 포함되지 않은)
 * @return {String} Context가 포함된 파일경로
 * @example
// context가 /sample 인경우
com.win.getFullPath("/ui/dev/common/commonCode1.xml");
 */
com.win.getFullPath = function(path) {
	var rtn_path = "";
	if (gcm.CONTEXT_PATH == "") {
		rtn_path = path;
	} else {
		rtn_path = gcm.CONTEXT_PATH + path;
	}
	return rtn_path;
};


/**
 * 해당 그룹 안의 컴포넌트에서 엔터키가 발생하면 해당 컴포넌트의 값을 DataColletion에 저장하고 objFunc 함수를 실행한다.
 *
 * @param {Object} grpObj 그룹 객체
 * @param {Object} objFunc 함수 객체
 * @param {Number} rowIndex DataList가 바인딩된 gridView인 경우 ==> 현재 포커스된 focusedRowIndex [ex. gridViewId.getFocusedRowIndex()]
 *				 <br/>아닌 경우 ==> rowIndex는 생략
 * @memberOf com.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
com.win.setEnterKeyEvent(grp_AuthorityDetail, scwin.search);
// return 예시) "엔터키가 발생 -> 해당 함수 실행 및 DataColletion에 UI 컴포넌트에 입력된 데이터를 DataCollection에 저장"
 */
com.win.setEnterKeyEvent = function(grpObj, objFunc) {
	var objArr = com.util.getChildren(grpObj, {
		includePlugin: "checkbox checkcombobox editor input inputCalendar multiselect radio selectbox searchbox secret textarea autoComplete",
		recursive: true
	});

	try {
		for (var i = 0; i < objArr.length; i++) {
			try {
				if (typeof objFunc === "function") {
					objArr[i].bind("onkeyup", function (e) {
						if (e.keyCode === 13) {
							if (typeof this.getRef === "function") {
								var ref = this.getRef();
								var refArray = ref.substring(5).split(".");
								if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
									var dataCollectionName = refArray[0];
									var columnId = refArray[1];
									var dataCollection = this.getScopeWindow().$p.getComponentById(dataCollectionName);
									var dataType = dataCollection.getObjectType().toLowerCase();
									if (dataType === "datamap") {
										dataCollection.set(columnId, this.getValue());
									} else if ((dataType === 'datalist') && (typeof rowIndex !== "undefined")) {
										dataCollection.setCellData(dataCollection.getRowPosition(), columnId, this.getValue());
									}
								}
								objFunc();
							}
						}
					});
				}
			} catch (e) {
				console.error("[com.win.setEnterKeyEvent] Exception :: " + e.message);
			} finally {
				dataCollection = null;
			}
		}
	} catch (ex) {
		console.error(ex);
	} finally {
		objArr = null;
	}
};


/**
 * Alert 메시지 창을 호출한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @param {String} messageStr 메시지
 * @param {String} closeCallbackFncName 콜백 함수명
 * @author Inswave Systems
 * @example
com.win.alert("우편번호를 선택하시기 바랍니다.");
com.win.alert("우편번호를 선택하시기 바랍니다.", "scwin.alertCallBack");

// 공통메시지 아이디를 전달하면 메시지로 변경하여 보여줌
com.win.alert("com.cfm.0002") // 저장하시겠습니까?

// 공통메시지에 치환값이 있는 경우는 Array로 전달
com.win.alert(["bbs.cfm.0001",  "MA0101", "MA010101"]) //"카테고리 [MA0101]를 삭제하시겠습니까?\n삭제 시, [MA0101]로 등록한 게시글을 조회할 수 없습니다."

// 존재하지 않는 공통메시지 아이디인경우 String 인경우
com.win.alert("com.cfm.002") // "com.cfm.002"

// 존재하지 않는 공통메시지 아이디인경우 Array 인경우
com.win.alert(["bbs.cfm.0001",  "MA0101", "MA010101"]) //메시지 없음
 */
com.win.alert = function(messageStr, closeCallbackFncName, opts) {
	if(typeof opts !=="object") {
		opts ={};
	}
	com.win._messagBox("alert", messageStr, closeCallbackFncName, opts);
};


/**
 * Confirm 메시지 창을 호출한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @param {String} messageStr 메시지
 * @param {String} closeCallbackFncName 콜백 함수명
 * @author Inswave Systems
 * @example
com.win.confirm("변경된 코드 그룹 정보를 저장하시겠습니까?", "scwin.saveCodeGrpConfirmCallback");
com.win.confirm("하위에 새로운 조직을 추가하시겠습니까?", "scwin.insertConfirmCallBack");
 */
com.win.confirm = function(messageStr, closeCallbackFncName, opts) {
	if(typeof opts !=="object") {
		opts ={};
	}
	com.win._messagBox("confirm", messageStr, closeCallbackFncName, opts);
};


/**
 * 메세지 팝업을 호출한다.
 *
 * @private
 * @param {String} messageType 팝업창 타입 (alert || confirm)
 * @param {String} messageStr 메시지
 * @param {String} closeCallbackFncName 콜백 함수명
 * @param {String} title 팝업창 타이틀
 * @memberOf com.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
//alert창을 띄울 경우
scwin.callback = function(){
	console.log("콜백 함수입니다.");
};
com.win._messagBox("alert", "보낼 메시지", "callback");

//confirm창을 띄울 경우
scwin.callback = function(){
	console.log("콜백 함수입니다.");
};
com.win._messagBox("confirm", "보낼 메시지", "callback");
 */
com.win._messagBox = function(messageType, messageStr, closeCallbackFncName, opts) {
	var messageStr = messageStr || "";
	var messageType = messageType || "alert";
	var popId = messageType || "Tmp";

	popId = popId + (Math.random() * 16).toString().replace(".","");

	if (typeof opts.callBackParam !=="object") {
		opts.callBackParam = {};
	}

	if (com.util.isArray(messageStr)) {
		var sysMsg = com.data.getMessage(messageStr);
		if (typeof sysMsg === "string" &&  sysMsg !="") {
			messageStr = sysMsg;
		} else {
			messageStr = "";
		}
	} else {
		var sysMsg = com.data.getMessage(messageStr);
		if (typeof sysMsg === "string" && com.util.isEmpty(sysMsg) === false) {
			messageStr = sysMsg;
		}
	}

	var data = {
		"message": messageStr,
		"callbackFn": closeCallbackFncName,
		"messageType": messageType,
		"id": popId,
		"callBackParam" : opts.callBackParam
	};
	var options = {
		id: popId,
		popupName: messageType== "alert" ? com.data.getMessage("MSG_CM_00046") : com.data.getMessage("MSG_CM_00047"),
		width: 380,
		height: 223,
		className : "messagebox"
	};

	com.win.openPopup("/cm/xml/messageBox.xml", options, data);
};

/**
 * 토스트 메시지를 보여준다.
 *
 * @memberOf com.win
 * @date 2021.03.11
 * @param {String} 메시지 종류 ( 에러 : gcm.MESSAGE_CODE.STATUS_ERROR, 성공 : gcm.MESSAGE_CODE.STATUS_SUCCESS, 경고 : gcm.MESSAGE_CODE.STATUS_WARNING, 정보 : gcm.MESSAGE_CODE.STATUS_INFO )
 * @param {String} 메시지
 * @author Inswave Systems
 * @example
com.win.showToastMessage(gcm.MESSAGE_CODE.STATUS_SUCCESS, e.responseJSON.rsMsg.statusMsg);
 */
com.win.showToastMessage = function(messageType, message) {
	if (com.util.isEmpty($p.top().wfm_footer)) {
		return;
	}
	
	var wfmFooter = $p.top().wfm_footer.getWindow();
	var className = "";
	
	if (gcm.MESSAGE_CODE.STATUS_ERROR === messageType) {
		className = "error";
	} else if (gcm.MESSAGE_CODE.STATUS_SUCCESS === messageType) {
		className = "success";
	} else if (gcm.MESSAGE_CODE.STATUS_WARNING === messageType) {
		className = "warning";
	} else {
		className = "info";
	}
	
	wfmFooter.$p.dynamicCreate("grp_notice" + gcm.MESSAGE_IDX, "group", { style: "opacity: 0.0" }, wfmFooter.grp_noticeArea);
	var grpNotice = wfmFooter.$p.getComponentById("grp_notice" + gcm.MESSAGE_IDX);
	grpNotice.addClass("notice");
	
	wfmFooter.$p.dynamicCreate("grp_noticeInfo" + gcm.MESSAGE_IDX, "group", { style: "opacity: 0.0" }, grpNotice);
	var grpNoticeInfo = wfmFooter.$p.getComponentById("grp_noticeInfo" + gcm.MESSAGE_IDX);
	grpNoticeInfo.addClass(className);
	
	wfmFooter.$p.dynamicCreate("tbx_message" + gcm.MESSAGE_IDX, "textbox", { style: "display:inline; margin-left:3px", label : message}, grpNoticeInfo);

	$("#" + grpNotice.getID()).fadeTo(1000, 1);
	$("#" + grpNoticeInfo.getID()).fadeTo(1000, 1);
	
	com.util.setTimeout(
		function(idx) {
			var grpNotice = wfmFooter.$p.getComponentById("grp_notice" + idx);
			$("#" + grpNotice.getID()).fadeTo(1000, 0);
			
			var grpNoticeInfo = wfmFooter.$p.getComponentById("grp_noticeInfo" + idx);
			$("#" + grpNoticeInfo.getID()).fadeTo(1000, 0);

			com.util.setTimeout(
				function(idx) {
					wfmFooter.$p.getComponentById("tbx_message" + idx).remove();
					wfmFooter.$p.getComponentById("grp_noticeInfo" + idx).remove();
					wfmFooter.$p.getComponentById("grp_notice" + idx).remove();
					
					var objArr = com.util.getChildren(wfmFooter.grp_noticeArea, {
						includePlugin: "group textbox",
						recursive: true
					});
					
					for (var i = 0; i < objArr.length; i++) {
						if (com.num.parseInt(objArr[i].getStyle("opacity")) === 0) {
							objArr[i].remove();
						}
					}
				},
				{ delay : 1500, args : [idx], key :"MessageRemove" + idx}	
			);

		},
		{ delay : 3000, args : [gcm.MESSAGE_IDX], key : "MessageFadeOut" + gcm.MESSAGE_IDX}
	);	
	
	gcm.MESSAGE_IDX++;
};

/**
 * 언어 코드를 반환한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @return {String} 언어코드 (ex. "ko", "en")
 * @author Inswave Systems
 * @example
var lang = com.win.getLanguage();
 */
com.win.getLanguage = function() {
	var language = navigator.language || navigator.userLanguage || navigator.systemLanguage;
	if ((com.util.isEmpty(language) === false) && (language.length > 1)) {
		return language.substring(0,2);
	} else {
		return "";
	}
}

/**
 *
 * 팝업아이디구하기
 * 초기 설정 된 데이터 란 setJSON, setXML 등과 같은 API들을 통해 설정 된 데이터가 이에 속한다.
 * 추가(C)된 행은 제거한다
 *
 * @param {String} dltId  데이터리스트의 아이디
 * @memberOf com.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
com.win.getPopupId();
 */
com.win.getPopupId = function() {
	var parent = opener || parent;

	if ($p.getPopupId()) {
		return $p.getPopupId();
	} else {
		return window.scwin.$w.getPopupId();
	}
};


/**
 *
 * 팝업창을 연다.
 *
 * @param {String} url url 화면경로
 * @param {Array} options Popup창 옵션
 * @param {String} [options.id] Popup창 아이디
 * @param {String} [options.type] 화면 오픈 타입 ("wframePopup", "browserPopup")
 * @param {String} [options.width] Popup창 넓이
 * @param {String} [options.height] Popup창 높이
 * @param {String} [options.popupName] useIframe : true시 popup 객체의 이름으로 popup 프레임의 표시줄에 나타납니다.
 * @param {String} [options.useIFrame] [default : false] true : IFrame 을 사용하는 WebSquare popup / false: window.open 을 사용하는 popup
 * @param {String} [options.style] Popup의 스타일을 지정합니다. 값이 있으면 left top width height는 적용되지 않습니다.
 * @param {String} [options.resizable] [default : false]
 * @param {String} [options.modal] [default : false]
 * @param {String} [options.scrollbars] [default : false]
 * @param {String} [options.title] [default : false]
 * @param {String} [options.notMinSize] [default : false]
 * @param {Object} data 팝업 화면에 전달할 데이터 객체 (type이 wframePopup인 경우만 지원)
 * @memberOf com.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var data = { data : dma_authority.getJSON(), callbackFn : "scwin.insertMember" };
var options = { id : "AuthorityMemberPop",
				popupName : "직원 조회",
				modal : true,
				width : 560, height: 400 };
com.win.openPopup("/ui/BM/BM002P01.xml", options, data);
 */
com.win.openPopup = function(url, opt, data) {
	com.win._openPopup(url, opt, data);
};


com.win._openPopup = function(url, opt, data) {
	var _dataObj = {
		type : "json",
		data : data,
		name : "paramData"
	};
	var width = opt.width || 500;
	var height = opt.height || 500;
	
	try {
		var deviceWidth = parseFloat($("body").css("width"));
		var deviceHeight = parseFloat($("body").css("height"));

		if (!opt.notMinSize) {
			var borderSize = 4;
			if(opt.type != "browserPopup"){
				borderSize = 4
				if (deviceWidth > 0 && width > deviceWidth) {
					width = deviceWidth - borderSize; // 팝업 border 고려
				}

				if (deviceHeight > 0 && height > deviceHeight) {
					height = deviceHeight - borderSize; // 팝업 border 고려
				}

			} else {
				if (window.screen.availHeight <= height) {
					height = window.screen.availHeight-100;
				}
			}
		}
	} catch (ex) {
		console.error(ex);
	}
	
	opt.type = opt.type || "wframePopup";

	if (opt.type == "browserPopup") {
		var top = Math.floor(((window.screen.availHeight- 50 - com.num.parseInt(height)))/ 2) + (window.screen.availTop|| 0) + "px";
		var left = Math.floor((window.screen.availWidth - com.num.parseInt(width)) / 2) + (window.screen.availLeft || 0 ) + "px";
	} else {
		var top = ((document.body.offsetHeight / 2) - (com.num.parseInt(height) / 2) + $(document).scrollTop()) + "px";
		var left = ((document.body.offsetWidth / 2) - (com.num.parseInt(width) / 2) + $(document).scrollLeft()) + "px";
	}

	if (typeof _dataObj.data !== "undefined") {
		if (typeof _dataObj.data.callbackFn == "function") {
			var cbFuncIdx = ++gcm.CB_FUNCTION_MANAGER["cbFuncIdx"];
			var idx = "__close_callback_Func__" + new Date().getTime() + "_" + cbFuncIdx;
			gcm.CB_FUNCTION_MANAGER["cbFuncSave"][$p.id + idx] = _dataObj.data.callbackFn;
			_dataObj.data.callbackFn = $p.id + idx;
		} else if (typeof _dataObj.data.callbackFn === "undefined") {
			_dataObj.data.callbackFn = "";
		} else if (typeof _dataObj.data.callbackFn === "string") {
			_dataObj.data.callbackFn = $p.id + _dataObj.data.callbackFn;
		}
	}
	
	var paramUrl = "";

	if ((opt.type !== "wframePopup") && (com.util.isEmpty(_dataObj.data) === false)) {
		paramUrl = "&" + _dataObj.name + "=" + WebSquare.text.BASE64Encode(com.str.serialize(_dataObj.data)) ;
	}

	var options = {
		id : opt.id,
		popupName : opt.popupName || "",
		type : opt.type || "wframePopup",
		width : width + "px",
		height : height + "px",
		top : opt.top || top || "140px",
		left : opt.left || left || "500px",
		modal : (opt.modal == false) ? false : true,
		dataObject : _dataObj,
		alwaysOnTop : opt.alwaysOnTop || false,
		useModalStack : (opt.useModalStack == false) ? false : true,
		resizable : (opt.resizable == false) ? false : true,
		useMaximize : opt.useMaximize || false,
		className :opt.className || "",
		scrollbars : true,
		popupUrl : "../popup"
	};
	
	if (options.type !== "wframePopup") {
		$p.openPopup(url + paramUrl, options);
	} else {
		$p.openPopup(gcm.CONTEXT_PATH + url + paramUrl, options);
	}
}


/**
 * 팝업창을 닫는다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @param {String} popId popup창 id로 값이 없을 경우 현재창의 아이디
 * @param {String|Object} 부모 창에 전달한 데이터
 * @author Inswave Systems
 * @example
com.win.closePopup();
com.win.closePopup("scwin.zipPopupCallback" , '{message:"정상처리되었습니다"}');
com.win.closePopup("scwin.zipPopupCallback" , '정상처리되었습니다.');
 */
com.win.closePopup = function(callbackFnStr, retObj) {
	com.win._closePopup(com.win.getPopupId(), callbackFnStr, com.str.serialize(retObj));
};

com.win._closePopup = function (popId, callbackFnStr, retStr) {
	var func;
	
	if ((typeof callbackFnStr !== "undefined") && (callbackFnStr !== "")) {
		if (callbackFnStr.indexOf("__close_callback_Func__") > -1) {
			func = gcm.CB_FUNCTION_MANAGER["cbFuncSave"][callbackFnStr];
			delete gcm.CB_FUNCTION_MANAGER["cbFuncSave"][callbackFnStr];
		} else {
			func = window.WebSquare.util.getGlobalFunction(callbackFnStr);
		}
	}

	if ($p.isWFramePopup()) {
		$p.closePopup(popId);
		if (func) {
			func(com.util.getJSON(retStr));
		}
	} else {
		$w.closePopup();
		var funcArr = callbackFnStr.split(".");
		var caller = opener || parent;
		if (caller[funcArr[0]] && typeof caller[funcArr[0]][funcArr[1]] == "function") {
			caller[funcArr[0]][funcArr[1]]
			func = caller[funcArr[0]][funcArr[1]];
			func(com.util.getJSON(retStr));
		}
	}
};


/**
 * 현재 오픈된 전체 팝업창을 닫는다.
 *
 * @memberOf com
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
com.win.closeAllPopup();
 */
com.win.closeAllPopup = function() {
	// WebSquare.uiplugin.popup.popupList 속성은 엔진 내 비공개 속성으로 공통에서만 제한적으로 사용함(업무 화면 소스 사용 금지)
	var popupList = WebSquare.uiplugin.popup.popupList;
	for (var idx = 0; idx < popupList.length; idx++) {
		$p.closePopup(WebSquare.uiplugin.popup.popupList[idx].id);
	}
};


/**
 * 현재 화면이 팝업 인지의 여부를 반환한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @return {Boolean} 팝업인 경우 true, 팝업이 아닌 경우 false
 * @author Inswave Systems
 * @example
if (com.win.isPopup()) {
	com.win.alert("현재 화면은 팝업입니다.");
};
 */
com.win.isPopup = function() {
	return $p.isPopup();
};

/**
 * 특정 메뉴를 오픈한다.
 * 
 * @date 2021.02.16
 * @param {String} menuNm 메뉴명 - 단위화면에서 해당 값으로 title을 설정한다.
 * @param {String} url 화면 파일 경로
 * @param {String} menuCode 메뉴코드 - DB에 저장되어있는 메뉴 코드
 * @param {Object} paramObj
 * @param {String} menuType 메뉴타입 ("SP" : 샘플화면)
 * @param {Boolean} closeable 닫기버튼 보여주기 여부
 * @author Inswave Systems
 * @example
com.win.openMenu("인사조회","/tmp/tmp01.xml","010001");
 */
com.win.openMenu = function(menuNm, url, menuCode, paramObj, menuType, closable) {
	gcm.win.openMenu($p, menuNm, url, menuCode, paramObj, menuType, closable);
};

/**
 * 현재 화면을 특정 URL로 이동한다.
 * 
 * @date 2021.04.14
 * @param {String} moveUrl 화면 파일 경로
 * @param {Object} paramObj
 * @author Inswave Systems
 * @example
var param = {
	id : "00001",
	name : "홍길동"
};
com.win.moveUrl("/tmp/tmp01.xml", param);
 */
com.win.moveUrl = function(moveUrl, paramObj) {
	var paramObj = {
		"dataObject" : {
			"type" : "json",
			"name" : "paramData",
			"data" : paramObj
		}
	};
	
	$p.getFrame().setSrc(gcm.CONTEXT_PATH + moveUrl, paramObj);
};

/**
 * wframe안의 스크립트 영역에서 이 함수를 호출할 경우 자신을 감싼 wframe object를 반환한다. 전역스크립트에서 호출 시에는 null을 반환한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} 자신을 감싼 wframe object
 * @example
var frameObj = com.win.getFrame();
 */
com.win.getFrame = function() {
	try {
		return $p.getFrame();
	} catch (ex) {
		console.error(ex);
	}
};

/**
 * 자신의 부모 WFrame 객체를 찾아 반환한다.
 *
 * @memberOf com.win
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} 자신을 감싼 wframe object의 부모 wfrmae 객체
 * @example
var parentFrame = com.win.getParentFrame();
var dltObj = parentFrame.getObj("dlt_dataList1"); // 자기 부모 프레임 내에 있는 dlt_dataList1에 접근
var pScwinObj = parentFrame.getObj("scwin"); // 자기 부모 프레임에 있는 scwin 객체에 접근
if (!com.util.isEmpty(pScwinObj){
	pScwinObj.search(); // 부모화면에 있는 scwin.search 함수를 호출
}
 */
com.win.getParentFrame = function() {
	try {
		var frameObj = com.win.getFrame();
		if (!com.util.isEmpty(frameObj) && typeof frameObj.getParentFrame == "function") {
			return frameObj.getParentFrame();
		} else {
			return null;
		}
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 언어 코드를 설정한다.
 *
 * @memberOf com.win
 * @date 2019.11.22
 * @param {String} langCode 언어코드 (한국어 : "ko", 영어 : "en", 중국어 : "zh");
 * @author Inswave Systems
 * @example
com.win.setLangCode("ko");
com.win.setLangCode("en");
*/
com.win.setLangCode = function(langCode) {
	WebSquare.cookie.setCookie("system_language", langCode);
};


/**
 * 언어 코드를 반환한다.
 *
 * @memberOf com.win
 * @date 2019.11.22
 * @return langCode 언어코드 (한국어 : "ko", 영어 : "en", 중국어 : "zh");
 * @author Inswave Systems
 * @example
com.win.getLangCode();
*/
com.win.getLangCode = function(langCode) {
	return WebSquare.cookie.getCookie("system_language");
};


// =============================================================================
/**
 * 숫자 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class num
 * @namespace com.num
 */
// =============================================================================

com.num = {};

/**
 * 반올림 처리를 한다.
 *
 * @param {String|Number} value 반올림 처리를 할 값
 * @param {Number} point 반올림 처리를 할 소수점 자리 수 (Default : 0, 정수 값으로 반올림 처리)
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Number} 반올림 처리를 한 숫자 값
 * @example
com.num.round(23.4567); // return 예시) 23
com.num.round(23.5567); // return 예시) 24
com.num.round(23.5567, 2); // return 예시) 23.56
com.num.round(23.5564, 3); // return 예시) 23.556
 */
com.num.round = function(value, point) {
	var num = 1;
	if (typeof point !== "undefined") {
		num = Math.pow(10, point);
	}

	return Math.round(Number(value) * num) / num;
};


/**
 * 내림 처리를 한다.
 *
 * @param {String|Number} value 내림 처리를 할 값
 * @param {Number} point 내림 처리를 할 소수점 자리 수 (Default : 0, 정수 값으로 내림 처리)
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Number} 내림 처리를 한 숫자 값
 * @example
com.num.floor(23.5567); // return 예시) 23
com.num.floor(23.5567, 2); // return 예시) 23.55
 */
com.num.floor = function(value, point) {
	var num = 1;
	if (typeof point !== "undefined") {
		num = Math.pow(10, point);
	}

	return Math.floor(Number(value) * num) / num;
};


/**
 * 올림 처리를 한다.
 *
 * @param {String} value 올림 처리를 할 값 (String 또는 Number 타입 지원)
 * @param {Integer} point 올림 처리를 할 소수점 자리 수 (Default : 0, 정수 값으로 올림 처리)
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Number} 올림 처리를 한 숫자 값
 * @example
com.num.ceil(23.5567); // return 예시) 24
com.num.ceil(23.5567, 2); // return 예시) 23.56
 */
com.num.ceil = function(value, point) {
	var num = 1;
	if (typeof point !== "undefined") {
		num = Math.pow(10, point);
	}

	return Math.ceil(Number(value) * num) / num;
};


/**
 * ex)세번째자리마다 콤마 표시, 금액, setDisplayFormat("#,###&#46##0", "fn_userFormatter2") - 입력된 str에 포메터를 적용하여 반환한다.<p>
 *
 * @param {String|Number} value 포멧터를 적용할 값
 * @param {String} type 적용할 포멧터 형식(Default:null,dollar,plusZero,won)
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 문자열
 * @example
com.num.formatMoney("12345"); // 12,345
com.num.formatMoney("12345", "dollar"); // $12,345
com.num.formatMoney("12345", "plusZero"); // 123,450
com.num.formatMoney("12345", "won"); // 12,345원
 */
com.num.formatMoney = function (value, type) {
	var amount;

	if (type == "plusZero") {
		amount = new String(value) + "0";
	} else {
		amount = new String(value);
	}

	amount = amount.split(".");

	var amount1 = amount[0].split("").reverse();
	var amount2 = amount[1];

	var output = "";
	for (var i = 0; i <= amount1.length - 1; i++) {
		output = amount1[i] + output;
		if ((i + 1) % 3 == 0 && (amount1.length - 1) !== i)
			output = ',' + output;
	}

	if (type == "dollar") {
		if (!amount2) {
			output = "$ " + output;
		} else {
			output = "$ " + output + "." + amount2;
		}
	} else if (type == "won") {
		if (!amount2) {
			output = output + "원";
		} else {
			output = output + "." + amount2 + "원";
		}
	} else {
		if (!amount2) {
			output = output;
		} else {
			output = output + "." + amount2;
		}
	}

	return output;
};


/**
 * 세째자리마다 콤마를 추가해서 반환한다.
 *
 * @param {String|Number} value 포멧터를 적용할 값
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 문자열
 * @example
com.num.formatNumber("12345677"); // "12,345,677"
com.num.formatNumber(12345677); // "12,345,677"
com.num.formatNumber(-12345677); // "-12,345,677"
 */
com.num.formatNumber = function (value) {
	return WebSquare.util.setNumber(value);
};


/**
 * 숫자가 맞는지 여부를 검사한다.
 *
 * @param {String|Number} value 검사할 숫자 값
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} 숫자 여부 (숫자이면 true, 아니면 false 반환)
 * @example
com.num.isNumber("123"); // true;
com.num.isNumber(123); // true;
com.num.isNumber("123.123"); // true;
com.num.isNumber(123.123); // true;
com.num.isNumber("-123.123"); // true;
com.num.isNumber(-123.123); // true;
com.num.isNumber("a123"); // false;
 */
com.num.isNumber = function (value) {
	return !isNaN(value);
};


/**
 * 홀수가 맞는지 여부를 검사한다.
 *
 * @param {String|Number} value 검사할 값
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} 홀수 여부 (홀수이면 true, 아니면 false 반환)
 * @example
com.num.isOdd("123"); // true;
com.num.isOdd(123); // true;
com.num.isOdd("122"); // false;
com.num.isOdd(122); // false;
 */
com.num.isOdd = function (value) {
	return WebSquare.util.isOdd(value);
};


/**
 * 문자열을 정수형으로 변환한다.
 *
 * @param {String} value 변환할 문자열
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Number} 변환된 정수형 값
 * @example
com.num.parseInt("5231"); // 5231;
 */
com.num.parseInt = function (value) {
	return WebSquare.util.parseInt(value);
};


/**
 * 문자열을 실수형으로 변환한다.
 *
 * @param {String} value 변환할 문자열
 * @memberOf com.num
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Number} 변환된 실수형 값
 * @example
com.num.parseFloat("5231.22"); // 5231.22;
 */
com.num.parseFloat = function (value) {
	return WebSquare.util.parseFloat(value);
};


/**
 * 바이트 값을 적절한 단위(KB, MB, GB)를 변환해서 반환한다.
 *
 * @memberOf com.num
 * @date 2020.05.16
 * @param {String} value 변환할 값
 * @author Inswave Systems
 * @example
com.num.formatByte(32132);
 */
com.num.formatByte = function(value) {
	var unitType = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	if (value == 0 || value == "0" || isNaN(value)) {
		return 0 + " " + unitType[0];
	}
	var index = Math.floor(Math.log(value) / Math.log(1024));
	return (value / Math.pow(1024, index)).toFixed(1) + " " + unitType[index];
};


// =============================================================================
/**
 * 문자열 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class str
 * @namespace com.str
 */
// =============================================================================

com.str = {};

/**
 * XML, JSON 객체를 String 타입으로 반환한다.
 *
 * @param {Object} object String으로 변환할 JSON 객체
 * @param {String} replacer 치환할 문자열
 * @param {Number} space 여백 수
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} String으로 변환된 객체
 */
com.str.serialize = function (object, replacer, space) {
	if (typeof object === 'string') {
		return object;
	} else if (com.util.isJSON(object)) {
		return JSON.stringify(object, replacer, space);
	} else if (com.util.isXmlDoc(object)) {
		return WebSquare.xml.serialize(object);
	} else {
		return object;
	}
};


/**
 * 좌측에 문자열 채우기
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @param {String} str 포멧터를 적용할 문자열
 * @param {Number} length 0 으로 채울 길이
 * @param {String} char : 채우고자하는 문자(char)
 * @return {String} 일정길이 만큼 char 으로 채워진 문자열
 * @example
com.str.lpad("24", 4, "0"); // "0024"
com.str.lpad("11321", 8, "A"); // "AAA11321"
 */
com.str.lpad = function(str, length, char) {
	if (typeof str === "number") {
		str = str.toString();
	}
	
	if (char.length > length) {
		console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
		return str + "";
	}
	
	while (str.length < length) {
		str = char + str;
	}

	str = str.length >= length ? str.substring(0, length) : str;
	return str;
};


/**
 * 우측에 문자열 채우기
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @param {String} str 포멧터를 적용할 문자열
 * @param {Number} length 0 으로 채울 길이
 * @param {String} char : 채우고자하는 문자(char)
 * @return {String} 일정길이 만큼 char 으로 채워진 문자열
 * @example
com.str.rpad("24", 4, "0"); // "2400"
com.str.rpad("11321", 8, "A"); // "11321AAA"
 */
com.str.rpad = function(str, length, char) {
	if (char.length > length) {
		console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
		return str + "";
	}
	while (str.length < length)
		str += char;
	str = str.length >= length ? str.substring(0, length) : str;
	return str;
};


/**
 * 주민번호 문자열에 Formatter(######-#######)를 적용하여 반환한다.
 *
 * @param {String} str 주민번호 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 주민번호 문자열
 * @example
com.str.formatSSN("1234561234567");  // "123456-1234567"
 */
com.str.formatSSN = function (str) {
	var front = String(str).substr(0, 6);
	var back = String(str).substr(6, 7);
	var output = front + "-" + back;

	return output;
};


/**
 * 문자열에 전화번호 형식 Formatter를 적용하여 반환한다.
 *
 * @param {String} str 포멧터를 적용할 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 문자열
 * @example
com.str.formatPhone("0212345678");  // "02-1234-5678"
com.str.formatPhone("05051234567"); // "0505-123-4567"
com.str.formatPhone("03112345678"); // "031-1234-5678"
com.str.formatPhone("0311234567");  // "031-123-4567"
 */
com.str.formatPhone = function (str) {
	  try {
		  str = str.replace(/\s+/g,"");
		  var commCdList = ["0505"]; // 4자리 국번 ,예외가 되는 국번 확인
		  var commCdNum = str.substr(0,4); // 국번 4자리 확인
		  if(commCdList.indexOf(commCdNum) >-1){ //국번이 0505 인경우
			  return str.replace(/^(01[0136789]{1}|02|0[3-9]{1}[0-9]{1}[0-9]{1})-?([*0-9]{3,4})-?([0-9]{4})$/,"$1-$2-$3");
		  }else if(str.length <=11){
			  return str.replace(/^(01[0136789]{1}|02|0[3-9]{1}[0-9]{1})-?([*0-9]{3,4})-?([0-9]{4})$/,"$1-$2-$3");
		  }else{
			  return str;
		  }
	  } catch (ex) {
		  console.error(ex);
	  }
};


/**
 * 문자열에 시간 형식 Formatter를 적용하여 반환한다.
 *
 * @param {String} str 포멧터를 적용할 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 문자열
 * @author Inswave Systems
 * @example
com.str.formatTime("123402"); // 12:34:02
com.str.formatTime("1234"); // 12:34:02
*/
com.str.formatTime = function(str) {
	try {
		var hour = String(str).substr(0, 2);
		var minute = String(str).substr(2, 2);
		var second = String(str).substr(4, 2);
		if (com.util.isEmpty(second)) {
			return hour + ":" + minute;
		} else {
			return hour + ":" + minute + ":" + second;
		}
	} catch (ex) {
		console.error(ex);
		return str;
	}
};


/**
 * 문자(char)의 유형을 리턴한다.
 *
 * @param {String} str 어떤 유형인지 리턴받을 문자
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Number} 유니코드 기준 <br><br>
 * 한글음절[ 44032 ~ 55203 ] => 1 <br>
 * 한글자모[ 4352 ~ 4601 ] => 2 <br>
 * 숫자[ 48 ~ 57 ] => 4 <br>
 * 특수문자[ 32 ~ 47 || 58 ~ 64 || 91 ~ 96 || 123 ~ 126 ] => 8 <br>
 * 영문대[ 65 ~ 90 ] => 16 <br>
 * 영문소[ 97 ~ 122 ] => 32 <br>
 * 기타[그외 나머지] => 48
 * @example
com.str.getLocale("가"); // 1
com.str.getLocale("ㅏ"); // 2
com.str.getLocale("1");  // 4
com.str.getLocale("!");  // 8
com.str.getLocale("A");  // 16
com.str.getLocale("a");  // 32
com.str.getLocale("¿");  // 48
 */
com.str.getLocale = function (str) {
	var locale = 0;
	if (str.length > 0) {
		var charCode = str.charCodeAt(0);

		if (charCode >= 0XAC00 && charCode <= 0XD7A3) { // 한글음절.[ 44032 ~ 55203 ]
			locale = 0X1; // 1
		} else if ((charCode >= 0X1100 && charCode <= 0X11F9) || (charCode >= 0X3131 && charCode <= 0X318E)) { // 한글자모.[ 4352 ~ 4601 ]
			locale = 0X2; // 2
		} else if (charCode >= 0X30 && charCode <= 0X39) { // 숫자.[ 48 ~ 57 ]
			locale = 0X4; // 4
		} else if ((charCode >= 0X20 && charCode <= 0X2F) || (charCode >= 0X3A && charCode <= 0X40) || (charCode >= 0X5B && charCode <= 0X60)
			|| (charCode >= 0X7B && charCode <= 0X7E)) { // 특수문자
			locale = 0X8; // 8
		} else if (charCode >= 0X41 && charCode <= 0X5A) { // 영문 대.[ 65 ~ 90 ]
			locale = 0X10; // 16
		} else if (charCode >= 0X61 && charCode <= 0X7A) { // 영문 소.[ 97 ~ 122 ]
			locale = 0X20; // 32
		} else { // 기타
			locale = 0X30; // 48
		}
	}
	return locale;
};


/**
 * 입력받은 문자열에 한글이 포함되어 있는지 여부를 검사한다.
 *
 * @param {String} value 한글 유형인지 검증할 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} true or false
 * @example
com.str.existKorean("abc"); // false
com.str.existKorean("abc무궁화"); // true
com.str.existKorean("무궁화꽃이"); // true
 */
com.str.existKorean = function (value) {
	check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
	if (check.test(value)) {
		return true;
	} else {
		return false;
	}
};


/**
 * 입력받은 문자열 전체가 한글인지를 검사한다.
 *
 * @param {String} str 한글이 포함되어 있는지 검증 받을 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} true or false
 * @example
com.str.isKorean("abcd"); // false
com.str.isKorean("abcd무궁화"); // false
com.str.isKorean("무궁화"); // true
 */
com.str.isKorean = function (str) {
	var result = false;

	for (var i = 0; i < str.length; i++) {
		c = str.charAt(i);
		if (!com.str.existKorean(c)) {
			result = false;
			break;
		} else {
			result = true;
		}

	}
	return result;
};


/**
 * 종성이 존재하는지 여부를 검사한다.
 *
 * @param {String} str 종성의 여부를 검사할 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Boolean} true or false
 * @example
com.str.isFinalConsonant("종서")
// return 예시) false

com.str.isFinalConsonant("종성")
// return 예시) true

com.str.isFinalConsonant("입니다")
// return 예시) false

com.str.isFinalConsonant("입니당")
// return 예시) true
 */
com.str.isFinalConsonant = function (str) {
	var code = str.charCodeAt(str.length - 1);
	if ((code < 44032) || (code > 55197)) {
		return false;
	}
	if ((code - 16) % 28 == 0) {
		return false;
	}
	return true;
};


/**
 * 단어 뒤에 '은'이나 '는'을 붙여서 반환한다.
 *
 * @param {String} str 은, 는 붙일 문자열
 * @memberOf com.str
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 변환된 문자열
 * @example
com.str.attachPostposition("나");
// return 예시)"나는"

com.str.attachPostposition("나와 너");
// return 예시)"나와 너는"

com.str.attachPostposition("그래서");
// return 예시)"그래서는"

com.str.attachPostposition("그랬습니다만");
// return 예시)"그랬습니다만은"
 */
com.str.attachPostposition = function (str) {
	if (com.win.getLanguage("ko") === true) {
		if (com.str.isFinalConsonant(str)) {
			str = str + "은";
		} else {
			str = str + "는";
		}
		return str;
	} else {
		return str;
	}
};


/**
 * 사업자번호 유효성을 검사한다.
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @param {String} str 사업자번호 문자열
 * @return {Boolean} 정상이면 true, 비정상이면 false를 반환
 * @example
com.str.isBizID("1102112345"); // false
com.str.isBizID("1078616054"); // true
com.str.isBizID("2208139938"); // true
com.str.isBizID("1248100998"); // true
 */
com.str.isBizID = function (str) {
	var sum = 0;
	var aBizID = new Array(10);
	var checkID = new Array("1", "3", "7", "1", "3", "7", "1", "3", "5");

	for (var i = 0; i < 10; i++) {
		aBizID[i] = str.substring(i, i + 1);
	}
	
	for (var i = 0; i < 9; i++) {
		sum += aBizID[i] * checkID[i];
	}
	
	sum = sum + parseInt((aBizID[8] * 5) / 10);
	temp = sum % 10;
	temp1 = 0;

	if (temp != 0) {
		temp1 = 10 - temp;
	} else {
		temp1 = 0;
	}
	
	if (temp1 != aBizID[9]) {
		return false;
	}
	
	return true;
};


/**
 * 내외국인 주민등록번호 유효성을 검사한다.
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @param {String} str 문자열
 * @returns {Boolean} 정상이면 true, 비정상이면 false를 반환
 * @example
com.str.isSSN("9701011234567");
 */
com.str.isSSN = function (str) {
	var checkID = new Array(2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5);
	var i = 0, sum = 0;
	var temp = 0;
	var yy = "";

	if (str.length != 13) {
		return false;
	}
	
	for (i = 0; i < 13; i++) {
		if (str.charAt(i) < '0' || str.charAt(i) > '9') {
			return false;
		}
	}

	// foreigner PersonID Pass
	if (str.substring(6, 13) == "5000000" || str.substring(6, 13) == "6000000" || str.substring(6, 13) == "7000000"
		|| str.substring(6, 13) == "8000000") {
		return true;
	}
	
	for (i = 0; i < 12; i++) {
		sum += str.charAt(i) * checkID[i];
	}
	
	temp = sum - Math.floor(sum / 11) * 11;
	temp = 11 - temp;
	temp = temp - Math.floor(temp / 10) * 10;

	// 나이 (-) 체크
	if (str.charAt(6) == '1' || str.charAt(6) == '2' || str.charAt(6) == '5' || str.charAt(6) == '6') {
		yy = "19";
	} else {
		yy = "20";
	}

	if (parseInt(com.date.getServerDateTime("yyyy")) - parseInt(yy + str.substring(0, 2)) < 0) {
		return false;
	}

	// 외국인 주민번호 체크로직 추가
	if (str.charAt(6) != '5' && str.charAt(6) != '6' && str.charAt(6) != '7' && str.charAt(6) != '8') {
		if (temp == com.num.parseInt(str.charAt(12))) {
			return true;
		} else {
			return false;
		}
	} else {
		if ((temp + 2) % 10 == com.num.parseInt(str.charAt(12))) {
			return true;
		} else {
			return false;
		}
	}
	
	return false;
};


/**
 * 이메일 주소의 유효성을 검사한다.
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @param {String} str 메일주소
 * @return {Boolean} 정상이면 true, 비정상이면 false를 반환
 * @example
com.str.isEmail("emailTest@email.com");  // true
 */
com.str.isEmail = function (str) {
	if (typeof str != "undefined" && str != "") {
		var format = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if (format.test(str)) {
			return true;
		} else {
			return false;
		}
	}
	
	return true;
};


/**
 * 전화번호의 유효성을 검사한다.
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @param {String} str :: I :: Y :: :: 전화번호
 * @return {Boolean} 정상이면 true 그외는 false 반환
 * @author Inswave Systems
 * @example
com.str.isPhone("01094832134"); // true
com.str.isPhone("02094832134"); // false
 */
com.str.isPhone = function(str) {
	try {
		var phoneNum = com.str.formatPhone(str);
		var isDash = (phoneNum.indexOf("-")>1);
		return isDash;
	} catch (ex) {
		console.error(exx);
		return false;
	}
};


/**
* 문자열을 치환한다.
*
* @memberOf com.str
 * @date 2020.05.16
* @param	{String} str 문자열
* @param	{String} orgStr 검색할 문자
* @param	{String} repStr 치환할 문자
* @return   {String} 치환문자열
* @author 	Inswave Systems
* @example	com.str.replaceAll(obj.getValue(), "/", "");
*/
com.str.replaceAll = function( str, orgStr, repStr ){
	try {
		str = ""+str;
		return str.split(orgStr).join(repStr);
	} catch (ex) {
		console.error(ex);
		return str;
	}
};


/**
 * 입력된 문자열의 좌우측 공백을 제거한 문자열을 구한다.
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @param {String} str 좌우측 공백문자를 제거하려는 문자열
 * @return {String} 입력된 문자열에서 좌우측 공백이 제거된 문자열
 * @author Inswave Systems
 * @example com.str.trim("   a   ");  // return "a"
 */
com.str.trim = function(str) {
	try {
		if (typeof str == "undefined" || str == null) {
			str ="";
		}
		if (typeof str !== "string") {
			str = str + "";
		}
		return str.trim();
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 문자열의 바이트 기준 문자열 길이를 반환한다.
 *
 * @memberOf com.str
 * @date 2020.05.16
 * @param {String} str 문자열
 * @param {String} ignoreChar 길이 측정 시 무사할 문자열
 * @return {Number} 문자열 길이
 * @author Inswave Systems
 * @example
com.str.getByteLength("1231aABC");  // 8
com.str.getByteLength("1231a한글");  // 9
 */
com.str.getByteLength = function(str, ignoreChar) {
	return WebSquare.util.getStringByteSize(str, ignoreChar);
};


// =============================================================================
/**
 * 날짜 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class date
 * @namespace com.date
 */
// =============================================================================

com.date = {};

/**
 * 입력된 날짜에 지정된 만큼의 분을 더한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} pYmd 날짜 형식의 문자열 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} offset 더할 분 수.
 * @return {String} 지정된 offset만큼의 날짜가 더해진 입력 날짜.
 * @author Inswave Systems
 * @example
com.date.addMinute("201708191210", 10); // "201708191220"
com.date.addMinute("201708191210", -10); // "201708191200"
 */
com.date.addMinute = function(pYmd, offset) {
	return WebSquare.date.dateTimeAdd(pYmd, offset, "minute");
};


/**
 * 입력된 날짜에 지정된 만큼의 시간을 더한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} pYmd 날짜 형식의 문자열 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} offset 더할 시간 수.
 * @return {String} 지정된 offset만큼의 날짜가 더해진 입력 날짜.
 * @author Inswave Systems
 * @example
com.date.addHour("2017081912", 10); // "2017081922"
com.date.addHour("2017081912", -10); // "2017081902"
 */
com.date.addHour = function(pYmd, offset) {
	return WebSquare.date.dateTimeAdd(pYmd, offset, "hour");
};


/**
 * 입력된 날짜에 지정된 만큼의 날을 더한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} pYmd 날짜 형식의 문자열 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} offset 더할 날짜 수.
 * @return {String} 지정된 offset만큼의 날짜가 더해진 입력 날짜.
 * @author Inswave Systems
 * @example
com.date.addDate("20170819", 2); // "20170821"
com.date.addDate("20170819", -10); // "20170809"
 */
com.date.addDate = function(pYmd, offset) {
	return WebSquare.date.dateAdd(pYmd, offset);
};


/**
 * 입력된 날짜에 지정된 만큼의 달을 더한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} pYmd 날짜 형식의 문자열 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} offset 더할 개월 수.
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author Inswave Systems
 * @example
com.date.addMonth("20170819", 2); // "20171019"
com.date.addMonth("20170819", -10); // "20161019"
 */
com.date.addMonth = function(pYmd, offset) {
	try {
		var date = "";
		var isDate = com.date.isDate(pYmd);

		if (!isDate) {
			return;
		}
		if (typeof offset == "undefined" || isNaN(offset)) {
			offset = 0;
		}

		var dY = (pYmd + "").substring(0, 4);
		var dM = (pYmd + "").substring(4, 6);
		var dD = (pYmd + "").substring(6, 8);
		var dTime = (pYmd + "").substring(8);
		dM = (dM * 1) + (offset * 1);
		
		if (dM > 0) {
			dY = (dY * 1) + Math.floor(dM / 12);
			dM = dM % 12;
		} else {
			dY = (dY * 1) - Math.floor((dM * -1 + 12) / 12);
			dM = dM % 12 + 12;
		}
		
		if (Number(dD) >= 30) {
			var chkMonth1 = [ 2 ];
			var chkMonth2 = [ 4, 6, 9, 11 ];

			if (chkMonth1.indexOf(dM) > -1) {
				if (comf.isLeafYear(dY + "01" + "01")) {
					dD = "29";
				} else {
					dD = "28";
				}
			} else if (chkMonth2.indexOf(dM) > -1) {
				if (Number(dD) > 30) {
					dD = "30";
				}
			}
		}
		var cDate = new Date(dY, dM - 1, dD);
		var cYear = cDate.getFullYear();
		var cMonth = cDate.getMonth() + 1;
		if ((cMonth + "").length < 2) {
			cMonth = "0" + cMonth;
		}
		var cDay = cDate.getDate();
		if ((cDay + "").length < 2) {
			cDay = "0" + cDay;
		}
		date = cYear + "" + cMonth + "" + cDay + "" + dTime;
		return date;
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 서버 날짜 반환한다. (default format: yyyyMMdd)
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String:N} sDateFormat 날짜 포맷<br/>
 * y Year 1996; 96<br/>
 * M Month in year 07<br/>
 * d Day in month 10<br/>
 * H Hour in day (0-23) 0<br/>
 * m Minute in hour 30<br/>
 * s Second in minute 55<br/>
 * S Millisecond 978<br/>
 * @return  String 현재날짜
 * @example
com.date.getServerDateTime("yyyy-MM-dd HH:mm:ss SSS");
com.date.getServerDateTime("yyyy-MM-dd");
com.date.getServerDateTime();
 */
com.date.getServerDateTime = function (sDateFormat) {
	if (com.util.isEmpty(sDateFormat)) {
		sDateFormat = "yyyyMMdd";
	}

	return WebSquare.date.getCurrentServerDate(sDateFormat);
};


/**
 * 문자열에 날짜 Formatter를 적용하여 반환한다.
 *
 * @param {String} str 포멧터를 적용할 파라메터 (String 또는 Number 타입 지원)
 * @param {String} type 적용할 포멧터 형식 Default:null,slash,date
 * @memberOf com.date
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 문자열
 * @example
com.date.formatDate(20120319, "slash");
// return 예시) 12/03/19

com.date.formatDate(20120319, "date");
// return 예시) 2012/03/19

com.date.formatDate(20120319, "colon");
// return 예시) 2012:03:19

com.date.formatDate(20120319);
// return 예시) 2012년 03월 19일
 */
com.date.formatDate = function (str, type) {
	var output = "";
	var date = new String(str);

	if (type == "slash") {
		date = date.substring(2, date.length);
		for (var i = 0; i <= date.length - 1; i++) {
			output = output + date[i];
			if ((i + 1) % 2 == 0 && (date.length - 1) !== i)
				output = output + "/";
		}
	} else if (type == "date") {
		if (date.length == 8) {
			output = date.substr(0, 4) + "/" + date.substr(4, 2) + "/" + date.substr(6, 2);
		}
	} else if (type == "colon") {
		if (date.length == 8) {
			output = date.substr(0, 4) + ":" + date.substr(4, 2) + ":" + date.substr(6, 2);
		}
	} else {
		var year = date.substr(0, 4);
		var month = date.substr(4, 2);
		var day = date.substr(6, 2);
		var output = year + "년 " + month + "월 " + day + "일";
	}
	
	return output;
};


/**
 * 시간 - 입력된 String 또는 Number에 포메터를 적용하여 반환한다.
 *
 * @param {String} value 시간 Formatter를 적용한 값 (String 또는 Number 타입 지원)
 * @memberOf com.date
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {String} 포멧터가 적용된 문자열
 * @example
com.date.formatTime("123402");
// return 예시) "12:34:02"
 */
com.date.formatTime = function (value) {
	var hour = String(value).substr(0, 2);
	var minute = String(value).substr(2, 2);
	var second = String(value).substr(4, 2);
	var output = hour + ":" + minute + ":" + second;

	return output;
};


/**
 * 날짜 객체에 포매팅을 적용한다. (default format: yyyyMMdd)
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {Date} 포맷팅을 적용할 날짜 객체
 * @param {String:N} sDateFormat 날짜 포맷<br/>
 * y Year 1996; 96<br/>
 * M Month in year 07<br/>
 * d Day in month 10<br/>
 * H Hour in day (0-23) 0<br/>
 * m Minute in hour 30<br/>
 * s Second in minute 55<br/>
 * S Millisecond 978<br/>
 * @return {String} 현재날짜
 * @example
com.date.formatDateTime(new Date());  // "20190822"
com.date.formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss SSS");  // "2019-08-22 15:55:35 705"
 */
com.date.formatDateTime = function (value, sDateFormat) {
	if (com.util.isEmpty(sDateFormat)) {
		sDateFormat = "yyyyMMdd";
	}

	return WebSquare.date.getFormattedDate(value, sDateFormat);
};


/**
 * 입력된 값이 Date 형식의 값인지 확인한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String|number} sDate 날짜 문자열 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Boolean} timeChk 시간체크. (true/false)
 * @return {Boolean} Date 형식에 일치하면 true, 아니면 false
 * @author Inswave Systems
 * @example
com.date.isDate("20170819"); // return true
 */
com.date.isDate = function(sDate, timeChk) {
	var flag = true;
	try {
		if (sDate.length == 8) {
			sDate = sDate + "000000";
		}
		
		var y1 = parseInt(sDate.substring(0, 4), 10);
		var m1 = parseInt(sDate.substring(4, 6), 10);
		var d1 = parseInt(sDate.substring(6, 8), 10);
		var h1 = parseInt(sDate.substring(8, 10), 10);
		var t1 = parseInt(sDate.substring(10, 12), 10);
		var s1 = parseInt(sDate.substring(12), 10);
		if (isNaN(y1) || isNaN(m1) || isNaN(d1) || isNaN(h1) || isNaN(t1) || isNaN(s1))
			flag = false;

		if (m1 < 1 || m1 > 12)
			flag = false;

		var maxDay = 31;
		if (m1 == 2) {
			maxDay = ((y1 % 400 == 0) || ((y1 % 4 == 0) && (y1 % 100 != 0))) ? 29
					: 28;
		} else if (m1 == 4 || m1 == 6 || m1 == 9 || m1 == 11) {
			maxDay = 30;
		}
		
		if (d1 < 1 || d1 > maxDay) {
			flag = false;
		}
		
		if (h1 + t1 + s1 != "") {
			if (h1 < 0 || h1 > 24) {
				flag = false;
			} else if (h1 == 24) {
				if(typeof timeChk == "boolean" && !timeChk)
					flag = false;
				if (t1 > 0)
					flag = false;
				if (s1 > 0)
					flag = false;
			}
			if (t1 < 0 || t1 > 59)
				flag = false;
			if (s1 < 0 || s1 > 59)
				flag = false;
		}
	} catch (ex) {
		console.error(ex);
		flag = false;
	}
	return flag;
};


/**
 * fromDate, toDate 를 입력받아 두 날짜의 차이를 반환한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} fromDate 시작일자 (date형식은 yyyyMMdd or yyyyMMddHHmmss)
 * @param {String} toDate 종료일자 (date형식은 yyyyMMdd or yyyyMMddHHmmss)
 * @return {Number} 종료일자에서 시작일자의 날짜 차이 수.
 * @author Inswave Systems
 * @example
com.date.diffDate("20170821", "20180621"); // 304
 */
com.date.diffDate = function(fromDate, toDate) {
	try {
		if (!com.date.isDate(fromDate) || !com.date.isDate(toDate)) {
			return;
		}
		var diffDate = WebSquare.date.dateDiff(fromDate, toDate);
		return diffDate;
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 입력된 양력의 날짜가 윤년인지 검사한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} pYmd :: I :: Y ::  :: 윤달 확인 날짜.
 * @return {boolean} 윤달 유무( true : 윤달)
 * @author Inswave Systems
 * @example
com.date.isLeafYear("20201212");  // return true
 */
com.date.isLeafYear = function(pYmd) {
	try{
		var isLeafYear = false;
		if (!com.date.isDate(pYmd)) {
			return;
		} else {
			pYmd = pYmd.substr(0, 8);
			var y1 = parseInt( pYmd.substr(0, 4), 10);
			isLeafYear = ((y1 % 400 == 0 ) || ((y1 % 4 == 0) && (y1 % 100 != 0))) ? true : false;
		}
		return isLeafYear;
	} catch (ex) {
		console.error(ex);
	}
};


/**
 * 특정 날짜의 요일을 반환한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} value "yyyyMMdd" 포맷 형태의 날짜를 나타내는 문자열 ("20190801")
 * @param {String} type 반환형식 기본값은 날짜를 한글로 반환 , num 인경우 숫자로 반환 일요일 :  1 ~ 토요일 : 7
 * @return {String} 요일
 * @example
com.date.getDay("20190822");  // "목요일"
com.date.getDay("20190824");  // "토요일"

com.date.getDay("20191010","num");  // "5"


 */
com.date.getDay = function (value,type) {
	var dayVal;
	if (type == "num") {
		var dayVal = WebSquare.date._getDay(value);
		if (dayVal == 0 ) {
			return "7";
		}else{
			return String(dayVal);
		}
	} else {
		return WebSquare.date.getDay(value);
	}
};

/**
 * 특정 날짜의 음력 날짜를 반환한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} "yyyyMMdd" 포맷 형태의 날짜를 나타내는 문자열
 * @return {String} 음력 날짜
 * @example
com.date.getLunar("20190824");  // "20190724"
 */
com.date.getLunar = function (value) {
	return  WebSquare.date.toLunar(value);
};


/**
 * 해당 월의 마지막 날짜를 반환한다.
 *
 * @memberOf com.date
 * @date 2020.05.16
 * @param {String} yearMonth 년월 문자열 (yyyyMM)
 * @return 마지막 날짜
 * @author Inswave Systems
 * @example
com.date.getLastDateOfMonth("201510");  // 31
 */
com.date.getLastDateOfMonth = function(yearMonth) {
	try {
		if (typeof yearMonth !== "string") {
			yearMonth = com.str.serialize(yearMonth);
		}

		var year = yearMonth.substring(0, 4);
		var month = yearMonth.substring(4, 6);

		return (new Date(year, month, 0)).getDate();
	} catch(ex) {
		console.error(ex);
		return null;
	}
};

// =============================================================================
/**
 * 단축키 관련 함수를 생성한다.
 *
 * @author Inswave Systems
 * @class hkey
 * @namespace com.hkey
 */
// =============================================================================

com.hkey = {};

/**
 * 단축키 데이터를 조회하기 위한 Submission을 생성한다.
 * 
 * @memberOf com.hkey
 * @date 2021.03.19
 * @author Inswave Systems
 */
com.hkey._setShortKey = function(frame) {

	var frameP = null;
	if (typeof frame === "object") {
		frameP = frame.$p;
	} else {
		frameP = $p;
	}
	
	var programCd = frameP.getMetaValue("meta_programId");

	if (com.util.isEmpty(programCd) === false) {
		var searchCodeGrpOption = { 
			id : "_sbm_selectShortcutList", action : "/main/selectShortcutList", 
			target : '', method : "post",
			mediatype : "application/json", mode : "asynchronous", isProcessMsg : false,
			submitDoneHandler : function(e) {
				var rsMsg = e.responseJSON.rsMsg;
				
				if (rsMsg.statusCode == gcm.MESSAGE_CODE.STATUS_SUCCESS) {
					var searchShortcutList = e.responseJSON.dlt_shortcutList;
					
					for (var i = 0; i < searchShortcutList.length; i++) {
						var isExistRow = $p.top().com.data.getMatchedJSON("dlt_shortcutList", [
							{ columnId : "PROGRAM_CD", operator : "==", value : searchShortcutList[i]["PROGRAM_CD"], logical : "&&" },
							{ columnId : "COMPLEX_KEY", operator : "==", value : searchShortcutList[i]["COMPLEX_KEY"], logical : "&&" },
							{ columnId : "LAST_KEY", operator : "==", value : searchShortcutList[i]["LAST_KEY"], logical : "&&" }
						]);
						
						if (isExistRow && isExistRow.length > 0) {
							gcm.hkey.dataList.setRowJSON(0, searchShortcutList[i], true);
						} else {
							var idx = gcm.hkey.dataList.insertRow();
							gcm.hkey.dataList.setRowJSON(idx, searchShortcutList[i], true);
						}
					}
					gcm.hkey.dataList.removeColumnFilterAll();
					gcm.hkey.dataList.reform();
				}
			}
		}
		
		var param = {
			dma_shortcut : {
				PROGRAM_CD : programCd
			}
		};
		
		com.sbm.create(searchCodeGrpOption);
		
		var subObj = com.util.getComponent("_sbm_selectShortcutList");
		subObj.setRequestData(param);
	}
};


// =============================================================================
/**
 * 외부 솔루션 연동 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class ext
 * @namespace com.ext
 */
// =============================================================================

com.ext = {};


// =============================================================================
/**
 * 디버그 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class console
 * @namespace console
 */
// =============================================================================

// =============================================================================
/**
 * 디버그용 개발자도구 Console 로그 출력 관련 함수를 작성한다.
 *
 * @author Inswave Systems
 * @class console
 * @namespace console
 */
// =============================================================================

//웹스퀘어 엔진이 디버그 모드가 아닐 경우 경우 console 로그가 출력되지 않도록 한다.
if (WebSquare.core.getConfiguration("debug") === "false") {
	
	// 운영 환경(gcm.DEBUG_MODE = false)에서 디버깅을 위해서 Console 로그 출력이 필요한 경우에 
	// debugMode 파라미터를 true로 설정하면 Console 로그가 출력된다.
	// ex) http://127.0.0.1/?debugMode=true
	var debugMode = $p.getParameter("debugMode");
	if (debugMode == "true") {
		gcm.DEBUG_MODE = true
	} else {
		gcm.DEBUG_MODE = false
	}
}

/**
 * 일반 메시지를 웹 브라우저 콘솔에 출력한다.
 *
 * 추가 매개변수와 함께 문자열 치환을 사용할 수 있다.
 *
 * @param {Object} 출력할 메시지 문자열 또는 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var user = { name : "홍길동", tel : "010-2344-2323" };
console.log(user);

var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.log(userList);

console.log("사용자 등록이 완료되었습니다.");
console.log("%s님의 %d번째 등록이 완료되었습니다", "홍길동", 5);
 */
console.log = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.log, console);
	} else {
		return new Function();
	}
})();


/**
 * 정보 메시지를 웹 브라우저 콘솔에 출력한다.
 *
 * 추가 매개변수와 함께 문자열 치환을 사용할 수 있다.
 *
 * @param {Object} 출력할 메시지 문자열 또는 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var user = { name : "홍길동", tel : "010-2344-2323" };
console.info(user);

var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.info(userList);

console.info("사용자 등록이 완료되었습니다.");
console.info("%s님의 %d번째 등록이 완료되었습니다", "홍길동", 5);
 */
console.info = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.info, console);
	} else {
		return new Function();
	}
})();


/**
 * 스택 출력을 웹 브라우저 콘솔에 출력한다.
 *
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
console.trace();
 */
console.trace = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.trace, console);
	} else {
		return new Function();
	}
})();


/**
 * 정보 메시지를 웹 브라우저 콘솔에 출력한다.
 *
 * 추가 매개변수와 함께 문자열 치환을 사용할 수 있다.
 *
 * @param {Object} 출력할 메시지 문자열 또는 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var user = { name : "홍길동", tel : "010-2344-2323" };
console.error(user);

var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.error(userList);

console.error("사용자 등록에 실패 했습니다.");
console.error("%s님의 %d번째 등록에 실패 했습니다.", "홍길동", 5);

try {
	var idx = idx2;
} catch(ex) {
	console.error(ex);
}
 */
console.error = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.error, console);
	} else {
		return new Function();
	}
})();


/**
 * 경고 메시지를 웹 브라우저 콘솔에 출력한다.
 *
 * 추가 매개변수와 함께 문자열 치환을 사용할 수 있다.
 *
 * @param {Object} 출력할 메시지 문자열 또는 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var user = { name : "홍길동", tel : "010-2344-2323" };
console.warn(user);

var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.warn(userList);

console.warn("사용자 등록이 완료되었습니다.");
console.warn("%s님의 %d번째 등록이 완료되었습니다", "홍길동", 5);
 */
console.warn = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.warn, console);
	} else {
		return new Function();
	}
})();


/**
 * 디버그용 메시지를 웹 브라우저 콘솔에 출력한다.
 *
 * 추가 매개변수와 함께 문자열 치환을 사용할 수 있다.
 *
 * @param {Object} 출력할 메시지 문자열 또는 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
var user = { name : "홍길동", tel : "010-2344-2323" };
console.debug(user);

var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.debug(userList);

console.debug("사용자 등록이 완료되었습니다.");
console.debug("%s님의 %d번째 등록이 완료되었습니다", "홍길동", 5);
 */
console.debug = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.debug, console);
	} else {
		return new Function();
	}
})();


/**
 * 인자로 전달된 객체를 덤프해서 보기 쉽게 표시한다.
 *
 * JSON이나 Array를 Console창에 출력 시에 적합함
 *
 * @param {Object} Console에 출력할 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} 콘솔 로그 출력
 * @example
var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.dir(userList);
 */
console.dir = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.dir, console);
	} else {
		return new Function();
	}
})();


/**
 * 인자로 전달된 객체를 테이블 형식으로 표시한다.
 *
 * IE에서는 console.log 함수와 동일하게 동작함. (IE에서는 console.table() 미지원)
 *
 * JSON이나 Array를 Console창에 출력 시에 적합함.
 *
 * @param {Object} Console에 출력할 객체
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Object} 콘솔 로그 출력
 * @example
var userList = [
	{ name : "홍길동", tel : "010-2344-2323" },
	{ name : "김용수", tel : "010-2112-7562" },
	{ name : "박찬용", tel : "010-4241-2322" }
];
console.table(userList);
 */
if (gcm.util._getUserAgent() !== "msie") {
	console.table = (function() {
		if (gcm.DEBUG_MODE === true) {
			return Function.prototype.bind.call(console.table, console);
		} else {
			return new Function();
		}
	})();
} else {
	console.table = (function() {
		if (gcm.DEBUG_MODE === true) {
			return Function.prototype.bind.call(console.log, console);
		} else {
			return new Function();
		}
	})();
}


/**
 * 특정 행이 몇 번 실행되었는지 확인하기 위해서 사용한다.
 *
 * @param {String} 카운터 레이블 (행의 카운터 체크를 위한 레이블)
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @example
for (var idx = 0; idx < 100; idx++) {
	console.count("Level1");
	if (idx % 5 === 0) {
		console.count("Level2");
	}
}
 */
console.count = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.count, console);
	} else {
		return new Function();
	}
})();


/**
 * 콘솔 창에 시간 측정을 시작한다. (밀리초 단위로 표시됨)
 *
 * @param {String} 시간 측정 아이디 (console.timeEnd 실행 시 console.time 아이디와 동일해야 함)
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Date} 시간 출력
 * @example
console.time("Check-1");
for (var i = 0; i < 1000000; i++) { }
console.timeEnd("Check-1");
 */
console.time = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.time, console);
	} else {
		return new Function();
	}
})();


/**
 * 콘솔 창에 시간 측정을 종료한다. (밀리초 단위로 표시됨)
 *
 * @param {String} 시간 측정 아이디 (console.timeEnd 실행 시 console.time 아이디와 동일해야 함)
 * @memberOf console
 * @date 2020.05.16
 * @author Inswave Systems
 * @return {Time} 시간 출력
 * @example
console.time("Check-1");
for (var i = 0; i < 1000000; i++) { }
console.timeEnd("Check-1");
 */
console.timeEnd = (function() {
	if (gcm.DEBUG_MODE === true) {
		return Function.prototype.bind.call(console.timeEnd, console);
	} else {
		return new Function();
	}
})();

