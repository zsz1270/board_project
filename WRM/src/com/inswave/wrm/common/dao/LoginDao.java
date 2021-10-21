package com.inswave.wrm.common.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("loginDao")
public interface LoginDao {

	// 사용자 정보 조회 (로그인 체크용도로 사용 )
	public abstract Map selectMemberInfoForLogin(Map param);

	// 사용자의 비밀번호를 업데이트한다.
	public abstract int updatePassword(Map param);

}
