package com.inswave.wrm.common.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.common.dao.CommonDao;
import com.inswave.wrm.common.service.CommonService;

@Service
public class CommonServiceImpl implements CommonService {

	@Resource(name = "commonDao")
	private CommonDao commonDao;

	/**
	 * 헤더메뉴, 사이드메뉴 조회 (로그인 사용자에게 권한이 있는 메뉴만 조회함)
	 * 
	 * @param param 사용자 로그인 아이디가 저장된 맵 객체
	 */
	@Override
	public List selectMenuList(Map param) {
		return commonDao.selectMenuList(param);
	}
	
	/**
	 * 사용자별 프로그램 권한 리스트 조회 (로그인 사용자에게 권한이 있는 프로그램 권한만 조회함)
	 * 
	 * @param param 사용자 로그인 아이디가 저장된  맵 객체
	 */
	public List selectProgramAuthorityList(Map param) {
		return commonDao.selectProgramAuthorityList(param);
	}	
	

	/**
	 * 공통그룹 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List selectCommonGroup(Map param) {
		return commonDao.selectCommonGroup(param);
	}

	/**
	 * 모든 공통코드 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List selectCommonCodeAll() {
		return commonDao.selectCommonCode();
	}

	/**
	 * 공통코드 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List selectCommonCodeList(Map param) {
		return commonDao.selectCommonCodeList(param);
	}

	/**
	 * 공통코드 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectCodeList(Map param) {
		return commonDao.selectCodeList(param);
	}

	/**
	 * 공통관리 조회(검색어)
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List selectCommonSearchItem() {
		return commonDao.selectCommonSearchItem();
	}

	/**
	 * 여러 건의 코드 그룹 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map saveCodeGrpList(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {
			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += commonDao.insertCommonGrp(data);
			} else if (rowStatus.equals("U")) {
				uCnt += commonDao.saveCommonGrp(data);
			} else if (rowStatus.equals("D")) {
				dCnt += commonDao.deleteCommonGrp(data);
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
	 * 여러 건의 코드 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map saveCodeList(List param) {

		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {
			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += commonDao.insertCommonCode(data);
			} else if (rowStatus.equals("U")) {
				uCnt += commonDao.updateCommonCode(data);
			} else if (rowStatus.equals("D")) {
				dCnt += commonDao.deleteCommonCode(data);
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
	 * update Main Setting update된 것이 없을 경우 (입력된 정보가 없을 경우) insert.
	 * 
	 * @date 2016.08.08
	 * @param <Map> MAIN_LAYOUT_PAGE_CODE, UPDATED_ID, EMP_CD
	 * @returns <int> 0일 경우 실패
	 * @author Inswave Systems
	 */
	public int updateBmMainSetting(Map param) {
		int rs = 0;
		rs = commonDao.updateBmMainSetting(param);
		if (rs == 0) {
			rs = commonDao.insertBmMainSetting(param);
		}
		return rs;
	}

	/**
	 * update Main Setting update된 것이 없을 경우 (입력된 정보가 없을 경우) insert.
	 * 
	 * @date 2016.08.08
	 * @param <Map> MAIN_LAYOUT_PAGE_CODE, UPDATED_ID, EMP_CD
	 * @returns <int> 0일 경우 실패
	 * @author Inswave Systems
	 */
	public int insertBmMainSetting(Map param) {
		return commonDao.insertBmMainSetting(param);
	}

	/**
	 * EMP_CD로 단건 BmMainSetting 조회
	 * 
	 * @date 2016. 8. 10.
	 * @param <Map> EMP_CD가 담긴 Map
	 * @returns <Map> BmMainSetting - MAIN_LAYOUT_PAGE_CODE
	 * @author Inswave Systems
	 * @todo 추가해야 할 작업
	 */
	public Map selectBmMainSetting(Map param) {
		return commonDao.selectBmMainSetting(param);
	}

	/**
	 * select 사용자별 즐겨찾기 리스트
	 * 
	 * @date 2016. 8. 24.
	 * @param String #{EMP_CD}
	 * @author Inswave Systems
	 */
	@Override
	public List selectFavListByEmpCd(String empCd) {
		return commonDao.selectFavListByEmpCd(empCd);
	}

	/**
	 * insert bmFavorite
	 * 
	 * @date 2016. 8. 24.
	 * @param <MAP> #{EMP_CD}, #{MENU_CD}
	 * @author Inswave Systems
	 */
	public int insertBmFavorite(Map param) {
		return commonDao.insertBmFavorite(param);
	}

	/**
	 * delete bmFavorite
	 * 
	 * @date 2016. 8. 24.
	 * @param <MAP> #{EMP_CD}, #{MENU_CD}
	 * @author Inswave Systems
	 */
	public int deleteBmFavorite(Map param) {
		return commonDao.insertBmFavorite(param);
	}

	/**
	 * STATUS의 값에 따라 insert,delete,update 실행.
	 * 
	 * @date 2016. 8. 24.
	 * @param <MAP> #{EMP_CD}, #{MENU_CD}, STATUS:[I|D|U]
	 * @author Inswave Systems
	 */
	public int updateBmFavorite(Map param) {
		int rs = 0;
		String status = (String) param.get("STATUS");
		if (status != null) {
			if (status.equals("I")) {
				commonDao.deleteBmFavorite(param);
				rs = commonDao.insertBmFavorite(param);
			} else if (status.equals("D")) {
				rs = commonDao.deleteBmFavorite(param);
			} else if (status.equals("U")) {
				rs = commonDao.updateBmFavorite(param);
			}
		}
		return rs;
	}

	/**
	 * 메뉴관리정보 삭제시 하위의 메뉴 접근 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 리스트 객체
	 */
	@Override
	public Map saveCodeGrpListAll(List paramCodeGrp, List paramCode) {

		int iCnt_grp = 0; // 등록한 그룹코드 건수
		int iCnt_code = 0; // 등록한 세부코드 건수
		int uCnt_grp = 0; // 수정한 그룹코드 건수
		int uCnt_code = 0; // 수정한 세부코드 건수
		int dCnt_grp = 0; // 삭제한 그룹코드 건수
		int dCnt_code = 0; // 삭제한 세부코드 건수

		for (int i = 0; i < paramCodeGrp.size(); i++) {
			Map dataGrp = (Map) paramCodeGrp.get(i);
			String rowStatusGrp = (String) dataGrp.get("rowStatus");
			if (rowStatusGrp.equals("C")) {
				iCnt_grp += commonDao.insertCommonGrp(dataGrp);

				for (int j = 0; j < paramCode.size(); j++) {
					Map dataGrpCode = (Map) paramCode.get(j);
					String rowStatusMenuAuth = (String) dataGrpCode.get("rowStatus");
					if (rowStatusMenuAuth.equals("C")) {
						iCnt_code += commonDao.insertCommonCode(dataGrpCode);
					}
				}
			} else if (rowStatusGrp.equals("U")) {
				for (int j = 0; j < paramCode.size(); j++) {
					Map dataGrpCode = (Map) paramCode.get(j);
					String rowStatusMenuAuth = (String) dataGrpCode.get("rowStatus");
					if (rowStatusMenuAuth.equals("C")) {
						iCnt_code += commonDao.insertCommonCode(dataGrpCode);
					} else if (rowStatusMenuAuth.equals("U")) {
						uCnt_code += commonDao.updateCommonCode(dataGrpCode);
					} else if (rowStatusMenuAuth.equals("D")) {
						dCnt_code += commonDao.deleteCommonCode(dataGrpCode);
					}
				}
				uCnt_grp += commonDao.saveCommonGrp(dataGrp);
			} else if (rowStatusGrp.equals("D")) {
				commonDao.deleteCommonCodeAll(dataGrp); // 하위 코드 정보는 전체 삭제
				dCnt_grp += commonDao.deleteCommonGrp(dataGrp);
			}

		}
		
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT_GRP", String.valueOf(iCnt_grp));
		result.put("ICNT_CODE", String.valueOf(iCnt_code));
		result.put("UCNT_GRP", String.valueOf(uCnt_grp));
		result.put("UCNT_CODE", String.valueOf(uCnt_code));
		result.put("DCNT_GRP", String.valueOf(dCnt_grp));
		result.put("DCNT_CODE", String.valueOf(dCnt_code));
		return result;
	}

	@Override
	public List selectShortcutList(String programCd) {
		return commonDao.selectShortcutList(programCd);
	}

	@Override
	public Map updateShortcutList(List updateList) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;		
		for (int i = 0; i < updateList.size(); i++) {
			Map data = (Map) updateList.get(i);
			String rowStatus = (String) data.get("rowStatus");
			System.out.println("업데이트 단축키 :: " + data);
			if (rowStatus.equals("C")) {
				iCnt += commonDao.insertShortcut(data);
			} else if (rowStatus.equals("U")) {
				uCnt += commonDao.updateShortcut(data);
			} else if (rowStatus.equals("D") || rowStatus.equals("E")) {
				dCnt += commonDao.deleteShortcut(data);
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
