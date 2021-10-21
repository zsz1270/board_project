package com.inswave.wrm.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PageURIUtil {
	private static String DEF_INDEX_PAGE;
	private static String TAB_INDEX;
	private static String WIN_INDEX;
	private static String LOGIN_PAGE;
	private static String AUTH_CHECK;

	@Value("${w5xml.defIndex}")
	private void setDEF_INDEX_PAGE(String def_index) {
		DEF_INDEX_PAGE = def_index;
	}

	@Value("${w5xml.main.tab}")
	private void setTAB_INDEX(String tab_index) {
		TAB_INDEX = tab_index;
	}

	@Value("${w5xml.main.win}")
	private void setWIN_INDEX(String win_index) {
		WIN_INDEX = win_index;
	}

	@Value("${w5xml.login}")
	private void setLOGIN_PAGE(String login_page) {
		LOGIN_PAGE = login_page;
	}

	@Value("${w5xml.auth.check}")
	private void setAUTH_CHECK(String auth_check) {
		AUTH_CHECK = auth_check;
	}

	/**
	 * getIndexPageURI Main Layout URI 가져오기
	 * 
	 * @date 2016. 08. 08
	 * @param {String} [default:def, tab, win, null]URI정보를 가지고 오기 위한 string.
	 * @returns {String} properties에 등록된 main layout URI정보를 가져온다. default값은 w5xml.defIndex에 등록된 값이다.
	 * @author Inswave Sytems
	 * @example getIndexPageURI("def"); return 예시 : "/test/test.xml"
	 */
	public static String getIndexPageURI(String pageNm) {
		String rsURI = DEF_INDEX_PAGE;
		if (pageNm != null) {
			if (pageNm.equals("T")) {
				rsURI = TAB_INDEX;
			} else if (pageNm.equals("W")) {
				rsURI = WIN_INDEX;
			}
		}
		return rsURI;
	}

	/**
	 * Default Main Layout URI 가져오기
	 * 
	 * @date 2016. 08. 08
	 * @returns {String} properties에 등록된 default main layout URI정보를 가져온다. default값은 w5xml.defIndex에 등록된 값이다.
	 * @author Inswave Sytems
	 * @example getIndexPageURI(); return 예시 : "/test/test.xml"
	 */
	public static String getIndexPageURI() {
		return getIndexPageURI("T");
	}

	/**
	 * Default login page URI 가져오기
	 * 
	 * @date 2016. 08. 08
	 * @returns {String} login page uri
	 * @author Inswave Systems
	 * @example getLoginPage(); return 예시 : "/test/test.xml"
	 */
	public static String getLoginPage() {
		return LOGIN_PAGE;
	}

	/**
	 * 권한없는 페이지 호출시 보여주는 page url 가져오기
	 * 
	 * @date 2016. 09. 12
	 * @returns {String} 권한없는 페이지 호출시 보여주는 page url
	 * @author Inswave Systems
	 * @example getLoginPage(); return 예시 : "/test/test.xml"
	 */
	public static String getAuthCheck() {
		return AUTH_CHECK;
	}
}
