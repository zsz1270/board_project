package com.inswave.wrm.common.service.impl;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.inswave.wrm.common.dao.LoginDao;
import com.inswave.wrm.common.service.LoginService;
import com.inswave.wrm.member.dao.MemberDao;

@Service
public class LoginServiceImpl implements LoginService {

	@Resource(name = "loginDao")
	private LoginDao loginDao;

	@Resource(name = "memberDao")
	private MemberDao memberDao;
	
	@Value("${system.admin.id}")
	private String adminId;

	/**
	 * 사용자 정보 조회 (로그인 체크용도로 사용 )
	 */
	@Override
	public Map selectMemberInfoForLogin(Map param) {
		Map memberMap = loginDao.selectMemberInfoForLogin(param);

		// 사용자가 존재하지 않을 경우
		if (memberMap == null) {
			memberMap = new HashMap();
			memberMap.put("LOGIN", "notexist");

			// 사용자가 존재할 경우
		} else {
			String PASSWORD = (String) memberMap.get("PASSWORD");
			String reqPASSWORD = (String) param.get("PASSWORD");

			// 패스워드 일치
			if (PASSWORD.equals(reqPASSWORD)) {

				memberMap.put("PASSWORD", "");
				memberMap.put("LOGIN", "success");

			} else { // 패스워드 불일치
				memberMap.put("LOGIN", "error");
			}
		}
		return memberMap;
	}

	/**
	 * 해당 사용자 아이디가 관리자 아이디인지를 검사한다.
	 */
	@Override
	public boolean isAdmin(String userId) {
		String[] adminIdList = adminId.split(",");
		
		for (String adminId : adminIdList) {
			if (adminId.trim().equals(userId)) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * 사용자의 비밀번호를 업데이트한다.
	 */
	@Override
	public int updatePassword(Map param) {
		return loginDao.updatePassword(param);
	}

}
