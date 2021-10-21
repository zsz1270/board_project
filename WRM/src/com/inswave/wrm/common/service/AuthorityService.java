package com.inswave.wrm.common.service;

import java.util.List;
import java.util.Map;

public interface AuthorityService {

	//권한리스트 조회
	public abstract List selectAuthorityList(Map param);
	public abstract List<Map> selectAuthoritySearchItem();
	
	//권한 부여 사용자 조회
	public abstract List selectAuthorityMemberList(Map param);
	
	//권한이 부여되지 않은 사용자 조회
	public abstract List<Map> excludeSelectAuthorityMemberList(Map param);
	
	//권한리스트 저장, 등록, 삭제
	public abstract Map saveAuthority(List param);
	
	//권한별 등록사원 입력, 수정, 삭제
	public abstract Map saveAuthorityMember(List param);
	
	//권한리스트 및 권한별 사원리스트 입력, 수정, 삭제
	public abstract Map saveAuthorityAll(List paramAuth, List paramAuthMember);

}
