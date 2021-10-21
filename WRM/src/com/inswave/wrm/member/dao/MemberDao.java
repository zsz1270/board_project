package com.inswave.wrm.member.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("memberDao")
public interface MemberDao {

	// 사용자 권한 정보 조회 (로그인시 )
	public List<Map> selectLoginAuthCheck(Map param);

	// 인사기본관리 조회
	public List<Map> selectMemberBasicOrganization();

	public List<Map> selectMemberBasic(Map param);

	public List<Map> selectMemberSearchItem();
	
	public List<Map> selectMemberOragn(Map param);

	public List<Map> getLoginInfo(Map param);

	public int insertMemberBasic(Map param);

	public int updateMemberBasic(Map param);

	public int deleteMemberBasic(Map param);
	
	// 가족 정보
	public List<Map> selectMemberFamilyList(Map param);

	public int selectMemberFamilyMaxSeq(Map param);

	public int insertMemberFamily(Map param);

	public int updateMemberFamily(Map param);

	public int deleteMemberFamily(Map param);

	// 프로젝트 정보
	public List<Map> selectMemberProjectList(Map param);

	public int selectMemberProjectMaxSeq(Map param);

	public int insertMemberProject(Map param);

	public int updateMemberProject(Map param);

	public int deleteMemberProject(Map param);

	// 우편번호 조회
	public List<Map> selectZipCodeList(Map param);
}
