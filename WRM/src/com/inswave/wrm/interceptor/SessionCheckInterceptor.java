package com.inswave.wrm.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.inswave.wrm.util.UserInfo;

public class SessionCheckInterceptor extends HandlerInterceptorAdapter {

	@Autowired
	private UserInfo userInfo;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		String loginInfo = null;
		HttpSession session = request.getSession();
		String reqUrl = request.getRequestURI();
		String w2xPath = request.getParameter("w2xPath");
		boolean result = true;

		try {
			loginInfo = (String) session.getAttribute("EMP_CD");

			if (loginInfo != null) {
				userInfo.setUserInfo(session);
			} else {
				if (!isSkipURI(request)) {
					if ((w2xPath != null) || (reqUrl.indexOf(".xml") > -1)) {
						// 웹스퀘어 화면 호출 시 세션이 종료된 경우, 로그인 페이지로 Redirect 처리한다.
						result = false;
						response.setContentType("text/xml");
						response.setCharacterEncoding("UTF-8");
						response.getWriter().write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
						response.getWriter().write("<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:ev=\"http://www.w3.org/2001/xml-events\" ");
						response.getWriter().write("xmlns:w2=\"http://www.inswave.com/websquare\" xmlns:xf=\"http://www.w3.org/2002/xforms\">");
						response.getWriter().write("<head>");
						response.getWriter().write("<w2:buildDate/>");
						response.getWriter().write("<xf:model><xf:instance><data xmlns=\"\"/></xf:instance></xf:model>");
						response.getWriter().write("<script type=\"javascript\" lazy=\"false\"><![CDATA[ ");
						response.getWriter().write("scwin.onpageload = function() { com.win.alert(\"Session이 종료 되었습니다. 로그인 화면으로 이동하겠습니다.\", \"com.win.goHome\", true); };");
						response.getWriter().write("scwin.onpageunload = function() { };");
						response.getWriter().write("]]></script>");
						response.getWriter().write("</head>");
						response.getWriter().write("<body ev:onpageload=\"scwin.onpageload\" ev:onpageunload=\"scwin.onpageunload\"></body>");
						response.getWriter().write("</html>");
					} else {
						// 서비스 호출 시 세션이 종료된 경우, Session 종료 Alert 후, 로그인 페이지로 Redirect 처리 한다.
						result = false;
						response.setContentType("application/json");
						response.setCharacterEncoding("UTF-8");
						response.getWriter().write("{\"rsMsg\":{\"statusCode\":\"E\", \"errorCode\" : \"E0001\", \"message\":\"Session이 종료 되었습니다.\",\"status\":\"Error\"}}");
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		response.addHeader("X-Frame-Options", "DENY");
	}

	/**
	 * Session 체크 대상에서 예외 URI 구성
	 * 
	 * @date 2020.03.06
	 * @param request HttpServletRequest 객체
	 * @returns <boolean> 예외처리 대상 URL 여부
	 * @author Inswave Systems
	 */
	private boolean isSkipURI(HttpServletRequest request) {
		String[] skipUrl = { "/", "/I18N", "/main/login", "/favicon.ico" };
		boolean result = false;
		String uri = (request.getRequestURI()).replace(request.getContextPath(), "");

		for (int i = 0; i < skipUrl.length; i++) {
			if (uri.equals(skipUrl[i])) {
				result = true;
				break;
			}
		}
		return result;
	}
}
