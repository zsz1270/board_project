package com.inswave.wrm.common.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.common.service.CommonService;
import com.inswave.wrm.common.service.LoginService;
import com.inswave.wrm.util.Result;
import com.inswave.wrm.util.UserInfo;

@Controller
public class LoginController {

	@Autowired
	private LoginService loginService;

	@Autowired
	private CommonService commonService;

	@Autowired
	private UserInfo user;

	/**
	 * logout session 삭제 성공 : redirect로 기본 페이지 이동. session 삭제 오류 : 기존 화면으로 오류 메세지 전송
	 * 
	 * @date 2017.12.22
	 * @returns modelAndView
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping(value = "/main/logout")
	public @ResponseBody Map<String, Object> logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Result result = new Result();
		try {
			result.setStatusMsg(Result.STATUS_SUCESS, "정상적으로 로그아웃 되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(Result.STATUS_ERROR, "로그아웃 도중 오류가 발생하였습니다.");
		} finally {
			request.getSession().invalidate();
			user.init();
		}
		return result.getResult();
	}

	/**
	 * login - 요청받은 아이디, 비밀번호를 회원DB와 비교한다.
	 * 
	 * @date 2017.12.22
	 * @param dma_loginCheck { EMP_CD:"사원코드", PASSWORD:"비밀번호" }
	 * @returns mv dma_resLoginCheck { EMP_CD:"사원코드", EMP_NM:"사원명", LOGIN:"상태" }
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping(value = "/main/login")
	public @ResponseBody Map<String, Object> login(@RequestBody Map<String, Object> param, HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		Map memberMap = null;
		String status = null;
		Map loginParam = null;

		Result result = new Result();
		try {
			// loginParam은 param(EMP_CD/PW)의 값을 꺼내는 용도
			loginParam = (Map) param.get("dma_loginCheck");

			memberMap = loginService.selectMemberInfoForLogin(loginParam);
			status = (String) memberMap.get("LOGIN");

			// 로그인 성공
			if (status.equals("success")) {
				String mainLayout = (String) memberMap.get("MAIN_LAYOUT_PAGE_CODE");

				// main setting에 값이 저장되어 있지 않는 경우 insert.
				if (mainLayout == null) {
					mainLayout = user.getDefaultMainLayoutCode();
				}
				
				session.setAttribute("EMP_CD", (String) memberMap.get("EMP_CD"));
				session.setAttribute("EMP_NM", (String) memberMap.get("EMP_NM"));
				session.setAttribute("MAIN_LAYOUT_PAGE_CODE", mainLayout);
				
				// 로그인한 아이디가 시스템 관리자인지 여부를 체크한다.
				// 시스템 관리자 아이디는 websquareConfig.properties 파일의 system.admin.id 속성에 정의하면 된다.
				// 시스템 관자자 아이디가 여러 개일 경우 콤마(",") 구분해서 작성할 수 있다.
				boolean isAdmin = loginService.isAdmin((String) memberMap.get("EMP_CD"));
				session.setAttribute("IS_ADMIN", isAdmin);
				
				// 클라이언트(UI)에 전달하는 IS_ADMIN 정보는 관리자인지의 여부에 따라 화면 제어가 필요한 로직 처리를 위해서만 사용한다.
				// 서버 서비스에서의 로직 처리는 보안을 위해서 클라이언트에서 전달하는 IS_ADMIN 정보가 아닌
				// 서버 서비스에서 관리하는 UserInfo.getIsAdmin()에서 관리자 여부를 받아와서 판단해야 한다.

				// 메뉴 정보 가져오기
				List sessionMList = commonService.selectMenuList(memberMap);
				session.setAttribute("MENU_LIST", (List) sessionMList);

				user.setUserInfo(session);

				result.setStatusMsg(Result.STATUS_SUCESS, "로그인 성공");
			} else if (status.equals("error")) {
				result.setData("errorItem", "PASSWORD");
				result.setMsg(Result.STATUS_WARNING, "로그인 실패(패스워드 불일치)");
			} else {
				result.setData("errorItem", "ID");
				result.setMsg(Result.STATUS_WARNING, "사용자 정보가 존재하지 않습니다.");
			}
		} catch (Exception ex) {// DB커넥션 없음
			ex.printStackTrace();
			result.setMsg(Result.STATUS_ERROR, "처리도중 시스템 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	/**
	 * 로그인한 사용자의 비밀번호를 변경한다.
	 * 
	 * @date 2018.11.29
	 * @param dma_password { PASSWORD: "현재 비밀번호", NEW_PASSWORD: "새로운 비밀번호", RETRY_PASSWORD: "새로운 비밀번호(재입력)" }
	 * @returns mv dlt_result { FOCUS:"포커스를 이동할 컬럼 아이디" }
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/main/updatePassword")
	public @ResponseBody Map<String, Object> updatePassword(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		
		try {
			Map passwordMap = (Map) param.get("dma_password");
			boolean checkCurrPassword = false;
			
			// 시스템 관리자인 경우에는 현재 비밀번호 체크를 하지 않고 비밀번호를 변경한다.
			if (user.getIsAdmin()) {
				checkCurrPassword = true;
				
			// 일반 사용자인 경우에는 현재 비밀번호를 체크하고 비밀번호를 변경한다.
			} else {
				Map memberMap = loginService.selectMemberInfoForLogin(passwordMap);
				String status = (String) memberMap.get("LOGIN");
			   
				// 현재 비밀번호 정상 입력 여부 확인
				if (status.equals("success")) {
					checkCurrPassword = true;
				} else {
					Map resultMap = new HashMap<String, Object>();
					// TODO : FOCUS 정보가 정상적으로 Response에 담기지 않음
					resultMap.put("FOCUS", "PASSWORD");
					result.setData("dma_result", resultMap);
					result.setStatusMsg(result.STATUS_ERROR, "현재 비밀번호를 잘못 입력하셨습니다.");
					return result.getResult();
				}
			}
			
			String newPassword = (String) passwordMap.get("NEW_PASSWORD");
			String retryPassword = (String) passwordMap.get("RETRY_PASSWORD");
			
			if (newPassword.equals(retryPassword)) {
				loginService.updatePassword(passwordMap);
				result.setStatusMsg(result.STATUS_SUCESS, "비밀번호 변경에 성공했습니다.");
			} else {
				Map resultMap = new HashMap<String, Object>();
				resultMap.put("FOCUS", "NEW_PASSWORD");
				result.setData("dma_result", resultMap);
				result.setStatusMsg(result.STATUS_ERROR, "신규 비밀번호와 신규 비밀번호(재입력) 항목의 비밀번호가 다르게 입력 되었습니다.");
			}

		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "비밀번호 변경 중 오류가 발생했습니다.");
		}
		
		return result.getResult();
	}

}
