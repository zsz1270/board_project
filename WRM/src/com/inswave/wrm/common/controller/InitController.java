package com.inswave.wrm.common.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Iterator;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.inswave.wrm.member.service.MemberService;
import com.inswave.wrm.util.PageURIUtil;
import com.inswave.wrm.util.UserInfo;

@Controller
public class InitController {
	
	@Autowired
	private MemberService service;

	@Autowired
	private UserInfo userInfo;

	/**
	 * 기본 Root Url 처리
	 * 
	 * @date 2017.12.22
	 * @author Inswave Systems
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String IndexBase(HttpServletRequest request, Model model) throws Exception {
		model.addAttribute("movePage", getLoginPage(request.getParameter("w2xPath")));
		return "websquare/websquare";
	}
	
	/**
	 * Popup Url 처리
	 * 
	 * @date 2017.12.22
	 * @author Inswave Systems
	 */
	@RequestMapping(value = "/popup", method = RequestMethod.GET)
	public String IndexWebSquare(HttpServletRequest request, Model model) throws Exception {
		model.addAttribute("movePage", getLoginPage(request.getParameter("w2xPath")));
		return "websquare/popup";
	}

	/**
	 * 로그인 페이지 Url을 반환한다.
	 * 
	 * @param w2xPath w2xPath 파라미터
	 * @return 로그인 페이지 Url
	 */
	private String getLoginPage(String w2xPath) {
		String movePage = w2xPath;

		// session이 없을 경우 login 화면으로 이동.
		if (!userInfo.isLogined()) {
			// session이 있고 w2xPath가 없을 경우 index화면으로 이동.
			movePage = PageURIUtil.getLoginPage();
		} else {
			if (movePage == null) {
				// DB 설정조회 초기 page 구성
				movePage = PageURIUtil.getIndexPageURI(userInfo.getMainLayoutCode());

				// DB에 값이 저장되어 있지 않은 경우 기본 index화면으로 이동
				if (movePage == null) {
					movePage = PageURIUtil.getIndexPageURI();
				}
			}
		}
		return movePage;
	}
}
