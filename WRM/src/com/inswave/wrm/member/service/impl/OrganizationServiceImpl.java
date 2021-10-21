package com.inswave.wrm.member.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.member.dao.OrganizationDao;
import com.inswave.wrm.member.service.OrganizationService;

@Service
public class OrganizationServiceImpl implements OrganizationService {

	@Resource(name = "organizationDao")
	private OrganizationDao organizationDao;

	/**
	 * 조직기본관리(기본정보)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectOrganization(Map param) {
		return organizationDao.selectOrganizaion(param);
	}

	/**
	 * 조직기본관리(책임자)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectOrganizationBoss() {
		return organizationDao.selectOrganizaionBoss();
	}

	/**
	 * 조직기본관리 조회(검색어)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectOrganizaionSearchItem() {
		return organizationDao.selectOrganizaionSearchItem();
	}

	/**
	 * 조직선택 조회(검색어)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectOrganizaionBasicList(Map param) {
		// TODO Auto-generated method stub
		return organizationDao.selectOrganizaionBasicList(param);
	}

	/**
	 * 여러 건의 조직기본관리(개인기본정보) 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map saveOrganizaionBasicList(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {

			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += organizationDao.insertOrganizaionBasic(data);
			} else if (rowStatus.equals("U")) {
				uCnt += organizationDao.updateOrganizaionBasic(data);
			} else if (rowStatus.equals("D")) {
				dCnt += organizationDao.deleteOrganizaionBasic(data);
			}
		}
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}

}
