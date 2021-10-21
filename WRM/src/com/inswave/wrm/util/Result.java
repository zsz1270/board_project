package com.inswave.wrm.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Result {

	private Map<String, Object> resultMap = new HashMap<String, Object>();

	// 성공메세지
	public final static String STATUS_SUCESS = "S";

	// 성공 메세지
	public final static String STATUS_SUCESS_MESSAGE = "정상 처리되었습니다.";

	// 오류메세지
	public final static String STATUS_ERROR = "E";

	// 기본 에러 상세 코드
	public final static String STATUS_ERROR_DEFAULT_DETAIL_CODE = "E9999";

	// 오류메세지
	public final static String STATUS_ERROR_MESSAGE = "처리 도중 오류가 발생 되었습니다.";

	// 경고메세지
	public final static String STATUS_WARNING = "W";

	// 경고메세지
	public final static String STATUS_WARNING_MESSAGE = "처리 도중 경고가 발생 되었습니다.";

	// 기본(map 타입) 웹스퀘어 view
	public final static String VIEW_DEFAULT = "wqView";

	// 결과값에 대한 메세지 key명
	public final static String MESSAGE_KEY = "rsMsg";

	// viewType이 VIEW_STRING 일 경우 참조하는 key
	public final static String RESULT_KEY_DEFAULT = "result";

	public void setData(String id, String data) {
		resultMap.put(id, data);
	}

	public void setData(String id, Map data) {
		resultMap.put(id, data);
	}

	public void setData(String id, List data) {
		resultMap.put(id, data);
	}

	public Map<String, Object> getResult() {
		if (resultMap.get(MESSAGE_KEY) == null) {
			setMsg("");
		}

		return resultMap;
	}

	/**
	 * 메세지 처리 - 상태 기본 메세지 처리
	 * 
	 * @date 2017.12.02
	 * @memberOf
	 * @param {} status : 메세지 상태
	 * @returns void
	 * @author Inswave Systems
	 * @example WqModel.setMsg( STATUS_SUCCESS );
	 */
	public void setMsg(String status) {
		String msg = "";
		if (status == STATUS_ERROR) {
			msg = STATUS_ERROR_MESSAGE;
		} else if (status == STATUS_SUCESS) {
			msg = STATUS_SUCESS_MESSAGE;
		} else if (status == STATUS_WARNING) {
			msg = STATUS_WARNING_MESSAGE;
		}
		setMsg(status, msg);
	}

	/**
	 * 메세지 처리
	 * 
	 * @date 2017.12.02
	 * @memberOf
	 * @param status 처리결과 코드
	 * @param message 처리결과 메시지
	 * @returns void
	 * @author Inswave Systems
	 * @example WqModel.setMsg(returnData, MsgUtil.STATUS_SUCCESS, "정상 처리되었습니다." , exception 객체);
	 */
	public void setMsg(String status, String message) {
		Map<String, Object> result = new HashMap<String, Object>();
		
		if (status.equals(STATUS_SUCESS)) {
			result.put("statusCode", STATUS_SUCESS);
			result.put("message", getDefaultStatusMessage(message, STATUS_SUCESS_MESSAGE));
		} else if (status.equals(STATUS_WARNING)) {
			result.put("statusCode", STATUS_WARNING);
			result.put("message", getDefaultStatusMessage(message, STATUS_WARNING_MESSAGE));
		} else if (status.equals(STATUS_ERROR)) {
			result.put("statusCode", STATUS_ERROR);
			result.put("message", getDefaultStatusMessage(message, STATUS_ERROR_MESSAGE));
		}

		resultMap.put(MESSAGE_KEY, result);
	}
	
	/**
	 * 메세지 처리
	 * 
	 * @date 2020.12.19
	 * @memberOf
	 * @param status 처리결과 코드
	 * @param message 처리결과 메시지
	 * @param statusMsg 처리결과 상태 메시지 (메인 화면 상태 메시지 바에 출력할 메시지)
	 * @returns void
	 * @author Inswave Systems
	 * @example WqModel.setMsg(returnData, MsgUtil.STATUS_SUCCESS, "정상 처리되었습니다.");
	 */
	public void setMsg(String status, String message, String statusMsg) {

		Map<String, Object> result = new HashMap<String, Object>();

		if (status.equals(STATUS_SUCESS)) {
			result.put("statusCode", STATUS_SUCESS);
			result.put("message", getDefaultStatusMessage(message, STATUS_SUCESS_MESSAGE));
			result.put("statusMsg", getDefaultStatusMessage(statusMsg, STATUS_SUCESS_MESSAGE));
		} else if (status.equals(STATUS_WARNING)) {
			result.put("statusCode", STATUS_WARNING);
			result.put("message", getDefaultStatusMessage(message, STATUS_WARNING_MESSAGE));
			result.put("statusMsg", getDefaultStatusMessage(statusMsg, STATUS_SUCESS_MESSAGE));
		} else if (status.equals(STATUS_ERROR)) {
			result.put("statusCode", STATUS_ERROR);
			result.put("message", getDefaultStatusMessage(message, STATUS_ERROR_MESSAGE));
			result.put("statusMsg", getDefaultStatusMessage(statusMsg, STATUS_SUCESS_MESSAGE));
		}

		resultMap.put(MESSAGE_KEY, result);
	}
	
	/**
	 * 상태 코드를 설정한다.
	 * 
	 * @date 2020.12.19
	 * @memberOf
	 * @param status 처리결과 코드
	 * @param statusMsg 처리결과 상태 메시지 (메인 화면 상태 메시지 바에 출력할 메시지)
	 * @returns void
	 * @author Inswave Systems
	 * @example WqModel.setMsg(returnData, MsgUtil.STATUS_SUCCESS);
	 */
	public void setStatus(String status) {

		Map<String, Object> result = new HashMap<String, Object>();

		if (status.equals(STATUS_SUCESS)) {
			result.put("statusCode", STATUS_SUCESS);
		} else if (status.equals(STATUS_WARNING)) {
			result.put("statusCode", STATUS_WARNING);
		} else if (status.equals(STATUS_ERROR)) {
			result.put("statusCode", STATUS_ERROR);
		}

		resultMap.put(MESSAGE_KEY, result);
	}
	
	/**
	 * 상태 코드와 메시지를 설정한다.
	 * 
	 * @date 2020.12.19
	 * @memberOf
	 * @param status 처리결과 코드
	 * @param statusMsg 처리결과 상태 메시지 (메인 화면 상태 메시지 바에 출력할 메시지)
	 * @returns void
	 * @author Inswave Systems
	 * @example WqModel.setMsg(returnData, MsgUtil.STATUS_SUCCESS, "정상 처리되었습니다.");
	 */
	public void setStatusMsg(String status, String statusMsg) {

		Map<String, Object> result = new HashMap<String, Object>();

		if (status.equals(STATUS_SUCESS)) {
			result.put("statusCode", STATUS_SUCESS);
			result.put("statusMsg", getDefaultStatusMessage(statusMsg, STATUS_SUCESS_MESSAGE));
		} else if (status.equals(STATUS_WARNING)) {
			result.put("statusCode", STATUS_WARNING);
			result.put("statusMsg", getDefaultStatusMessage(statusMsg, STATUS_WARNING_MESSAGE));
		} else if (status.equals(STATUS_ERROR)) {
			result.put("statusCode", STATUS_ERROR);
			result.put("statusMsg", getDefaultStatusMessage(statusMsg, STATUS_ERROR_MESSAGE));
		}

		resultMap.put(MESSAGE_KEY, result);
	}
	

	public String getDefaultStatusMessage(String message, String defMessage) {
		if (message == null) {
			return defMessage;
		}
		return message;
	};
}