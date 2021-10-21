package com.inswave.wrm.member.service;

import java.util.List;
import java.util.Map;

public interface OrganizationService {

	// 조직기본관리 정보 조회
	public List<Map> selectOrganization(Map param);

	public List<Map> selectOrganizationBoss();

	public List<Map> selectOrganizaionSearchItem();

	public List<Map> selectOrganizaionBasicList(Map param);

	// 조직기본관리 저장(기본정보)
	public Map saveOrganizaionBasicList(List param);
}
