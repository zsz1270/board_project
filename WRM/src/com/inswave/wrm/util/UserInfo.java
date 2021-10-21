package com.inswave.wrm.util;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserInfo implements Serializable {

	// EMP_CD
	private String userId;

	// EMP_NM
	private String userName;
	
	// 시스템 관리자 여부
	private boolean isAdmin;
	
	// MAIN_LAYOUT_PAGE_CODE - 메인화면 layout
	private String mainLayoutCode;

	// FAVORITE_STORAGE - 즐겨찾기 저장 위치
	private String isUseShortCut;

	@Value("${main.setting.default.layout}")
	private String defaultMainLayoutCode;

	@Value("${main.setting.default.isUseShortCut}")
	private String defaultIsUseShortCut;

	public String getUserId() {
		return userId;
	}

	private void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	private void setUserName(String userName) {
		this.userName = userName;
	}
	
	public boolean getIsAdmin() {
		return isAdmin;
	}

	public void setIsAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public String getMainLayoutCode() {
		return mainLayoutCode;
	}

	public void setMainLayoutCode(String mainLayoutCode) {
		if (mainLayoutCode == null || mainLayoutCode.equals("")) {
			this.mainLayoutCode = this.defaultMainLayoutCode;
		} else {
			this.mainLayoutCode = mainLayoutCode;
		}
	}

	public String getDefaultMainLayoutCode() {
		return this.defaultMainLayoutCode;
	}

	public String getDefaultIsUseShortCut() {
		return this.defaultIsUseShortCut;
	}

	public Map<String, Object> getUserInfo() {
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("EMP_CD", this.getUserId());
		userInfo.put("EMP_NM", this.getUserName());
		userInfo.put("MAIN_LAYOUT", this.getMainLayoutCode());
		return userInfo;
	}

	public Map<String, Object> getUserInfoWithoutUserID() {
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("EMP_NM", this.getUserName());
		userInfo.put("MAIN_LAYOUT", this.getMainLayoutCode());
		return userInfo;
	}

	/**
	 * Map객체에 사원번호만 담아서 return한다.
	 * 
	 * @date 2016.08.22
	 * @returns <Map> EMP_CD가 담긴 map
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public Map getUserInfoByBase() {
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("EMP_CD", this.getUserId());
		return userInfo;
	}

	/**
	 * session 값을 참조하여 dataSetting
	 * 
	 * @date 2016.08.19
	 * @param session 사용자 정보가 담긴 session객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public void setUserInfo(HttpSession session) {
		this.setUserId((String) session.getAttribute("EMP_CD"));
		this.setUserName((String) session.getAttribute("EMP_NM"));
		this.setIsAdmin((Boolean) session.getAttribute("IS_ADMIN"));
		this.setMainLayoutCode((String) session.getAttribute("MAIN_LAYOUT_PAGE_CODE"));
	}

	/**
	 * session 값을 참조하여 Main Layout 업데이트
	 * 
	 * @date 2016.08.19
	 * @param session 사용자 정보가 담긴 session객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public void updateMainLayoutCode(HttpSession session, String mainLayoutPageCode) {
		this.setMainLayoutCode(mainLayoutPageCode);
		session.setAttribute("MAIN_LAYOUT_PAGE_CODE", this.getMainLayoutCode());
	}

	/**
	 * Map값을 참조하여 dataSetting
	 * 
	 * @date 2016.08.19
	 * @param memberInfo 사용자 정보가 담긴 map객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public void setUserInfo(Map memberInfo) {
		this.setUserId((String) memberInfo.get("EMP_CD"));
		this.setUserName((String) memberInfo.get("EMP_NM"));
		this.setMainLayoutCode((String) memberInfo.get("MAIN_LAYOUT_PAGE_CODE"));
	}

	/**
	 * data 초기화
	 * 
	 * @date 2016.08.19
	 * @returns <void> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public void init() {
		this.setUserId(null);
		this.setUserName(null);
		this.setMainLayoutCode(null);
	}

	/**
	 * 사용자(로그인) 정보가 있는 경우
	 * 
	 * @date 2016.08.19
	 * @returns <Boolean> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public Boolean isLogined() {
		String userId = this.getUserId();
		if (userId == null || userId.equals("")) {
			return false;
		}
		return true;
	}
}
