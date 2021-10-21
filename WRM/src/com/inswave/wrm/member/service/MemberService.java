package com.inswave.wrm.member.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface MemberService {
	
	// Empty Profile 이미지 경로 
	public void setImgEmptyProfilePath(String imgEmptyProfilePath);
	
	public String getImgEmptyProfilePath();

	// 인사기본관리(기본정보) 조회
	public List<Map> selectMemberBasicOrganization();

	public List<Map> selectMemberBasic(Map param);

	public List<Map> selectMemberSearchItem();

	// 인사기본관리 저장(기본정보) 저장
	public Map saveMemberBasicList(List param);
	
	public List<Map> selectMemberOragn(Map param);

	public List<Map> getLoginInfo(Map param);

	public Map saveMemberBasic(Map param);

	public List<Map> selectMemberFamilyList(Map param);

	public int selectMemberFamilyMaxSeq(Map param);

	public Map saveMemberFamily(List param);

	public List<Map> selectMemberProjectList(Map param);

	public int selectMemberProjectMaxSeq(Map param);

	public Map saveMemberProject(List param);

	public List<Map> selectZipCodeList(Map param);

}
