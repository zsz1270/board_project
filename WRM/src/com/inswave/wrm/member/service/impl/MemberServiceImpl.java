package com.inswave.wrm.member.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import com.inswave.wrm.member.dao.MemberDao;
import com.inswave.wrm.member.service.MemberService;

@Service
public class MemberServiceImpl implements MemberService {

	@Resource(name = "memberDao")
	private MemberDao memberDao;
	
	@Autowired
	private PlatformTransactionManager transactionManager;

	@Autowired
	private SqlSessionFactory sqlSessionFactory;

	private int familySeq = 0;

	private int projectSeq = 0;
	
	private String imgEmptyProfilePath;

	
	@Value("${resouce.image.img_empty_profile}")
	public void setImgEmptyProfilePath(String imgEmptyProfilePath) {
		this.imgEmptyProfilePath = imgEmptyProfilePath;
	}
	
	public String getImgEmptyProfilePath() {
		return this.imgEmptyProfilePath;
	}

	/**
	 * 대용량 정보 조회시 필요합니다.
	 */
	@Autowired
	private SqlSession sqlsession;

	/**
	 * 인사기본관리(소속)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectMemberBasicOrganization() {
		return memberDao.selectMemberBasicOrganization();
	}

	/**
	 * 인사기본관리(개인기본정보)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectMemberBasic(Map param) {
		return memberDao.selectMemberBasic(param);
	}

	/**
	 * 인사기본관리(사용자 EMP_CD, EMP_NM)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectMemberSearchItem() {
		return memberDao.selectMemberSearchItem();
	}

	/**
	 * 여러 건의 인사기본관리(개인기본정보) 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map saveMemberBasicList(List param) {

		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {

			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += memberDao.insertMemberBasic(data);
			} else if (rowStatus.equals("U")) {
				uCnt += memberDao.updateMemberBasic(data);
			} else if (rowStatus.equals("D")) {
				memberDao.deleteMemberFamily(data);
				memberDao.deleteMemberProject(data);
				dCnt += memberDao.deleteMemberBasic(data);
			}
		}
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;

	}
	
	/**
	 * 개인 정보를 저장한다.
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public Map saveMemberBasic(Map param) {
		
		int uCnt = 0;
		Map result = new HashMap();
		
		String rowStatus = (String) param.get("rowStatus");
		uCnt += memberDao.updateMemberBasic(param);
		
		result.put("UCNT", String.valueOf(uCnt));
		return result;
	}

	/**
	 * 가족 정보를 저장한다.
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public Map saveMemberFamily(List param) {
		
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;
		Map result = new HashMap();
		
		for (int i = 0; i < param.size(); i++) {
			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			System.out.println("패밀리 :: " + rowStatus);
			System.out.println(data);
			if (rowStatus.equals("C")) {
				int SEQ = memberDao.selectMemberFamilyMaxSeq(data);
				data.put("SEQ", SEQ + 1);
				iCnt += memberDao.insertMemberFamily(data);
			} else if (rowStatus.equals("U")) {
				uCnt += memberDao.updateMemberFamily(data);
			} else if (rowStatus.equals("D") || rowStatus.equals("E")) {
				dCnt += memberDao.deleteMemberFamily(data);
			}
		}
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}

	/**
	 * 프로젝트 정보를 저장한다.
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public Map saveMemberProject(List param) {
		
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;
		Map result = new HashMap();
		
		for (int i = 0; i < param.size(); i++) {
			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			System.out.println("프로젝트 :: " + rowStatus);
			System.out.println(data);
			if (rowStatus.equals("C")) {
				int SEQ = memberDao.selectMemberProjectMaxSeq(data);
				data.put("SEQ", SEQ + 1);
				iCnt += memberDao.insertMemberProject(data);
			} else if (rowStatus.equals("U")) {
				uCnt += memberDao.updateMemberProject(data);
			} else if (rowStatus.equals("D") || rowStatus.equals("E")) {
				dCnt += memberDao.deleteMemberProject(data);
			}
		}
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}

	/**
	 * 개인 기본 정보 데이터 정보를 조회한다.
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public List<Map> selectMemberOragn(Map param) {
		// TODO Auto-generated method stub
		return memberDao.selectMemberOragn(param);
	}

	/**
	 * 로그인 정보를 조회한다.
	 * 
	 * @param param
	 * @return
	 */
	public List<Map> getLoginInfo(Map param) {
		return memberDao.getLoginInfo(param);
	}

	/**
	 * 개인별 가족 데이터를 조회한다.
	 * 
	 * @param param
	 * @return
	 */
	public List<Map> selectMemberFamilyList(Map param) {
		return memberDao.selectMemberFamilyList(param);
	}

	/**
	 * 개인별 가족 최대 순번을 조회한다.
	 * 
	 * @param param
	 * @return
	 */
	public int selectMemberFamilyMaxSeq(Map param) {
		return memberDao.selectMemberFamilyMaxSeq(param);
	}

	/**
	 * 개인별 프로젝트 데이터를 조회한다.
	 * 
	 * @param param
	 * @return
	 */
	public List<Map> selectMemberProjectList(Map param) {
		return memberDao.selectMemberProjectList(param);
	}

	/**
	 * 개인별 프로젝트 최대 순번을 조회한다.
	 * 
	 * @param param
	 * @return
	 */
	public int selectMemberProjectMaxSeq(Map param) {
		return memberDao.selectMemberProjectMaxSeq(param);
	}

	/**
	 * 우편번호를 검색한다.
	 * 
	 * @param param
	 */
	@Override
	public List<Map> selectZipCodeList(Map param) {
		System.out.println("IMPL");
		System.out.println(param);
		return memberDao.selectZipCodeList(param);
	}


}
