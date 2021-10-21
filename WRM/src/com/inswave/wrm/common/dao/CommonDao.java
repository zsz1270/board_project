package com.inswave.wrm.common.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public interface CommonDao {

	// 메뉴 조회 (로그인 사용자에게 권한이 있는 메뉴만 조회함)
	public abstract List<HashMap<String, Object>> selectMenuList(Map param);
	
	// 사용자별 프로그램 권한 리스트 조회 (로그인 사용자에게 권한이 있는 프로그램 권한만 조회함)
	public abstract List selectProgramAuthorityList(Map param);

	public abstract List selectCommonSearchItem();

	// 공통코드 및 코드 그룹 조회
	public abstract List selectCommonGroup(Map param);

	public abstract List selectCommonCode();

	public abstract List selectCommonCodeList(Map param);

	// 공통코드 그룹 C, U, D
	public abstract int deleteCommonGrp(Map param);

	public abstract int insertCommonGrp(Map param);

	public abstract int saveCommonGrp(Map param);

	// 공통코드 C, U, D
	public abstract int deleteCommonCode(Map param);

	public abstract int insertCommonCode(Map param);

	public abstract int updateCommonCode(Map param);

	// 공통코드
	public abstract List<Map> selectCodeList(Map param);

	// 사용자별 즐겨찾기 리스트
	public abstract List<Map> selectFavListByEmpCd(String empCd);

	public abstract int insertBmFavorite(Map param);

	public abstract int deleteBmFavorite(Map param);

	public abstract int updateBmFavorite(Map param);

	// MAIN SETTING 관리
	public abstract int insertBmMainSetting(Map param);

	public abstract int updateBmMainSetting(Map param);

	/**
	 * select BM_MAIN_SETTING by EMP_CD
	 * 
	 * @date 2016. 8. 10.
	 * @param param EMP_CD가 담긴 MAP
	 * @returns <Map> 단건 BM_MAIN_SETTING - FAVORITE_STORAGE, MAIN_LAYOUT_PAGE_CODE
	 * @author Inswave Systems
	 */
	public abstract Map selectBmMainSetting(Map param);

	/**
	 * 그룹코드로 세부코드 정보 한번에 삭제하기
	 * 
	 * @date 2016. 12. 05.
	 * @param
	 * @returns
	 * @author Inswave Systems
	 */
	public abstract int deleteCommonCodeAll(Map param);

	/**
	 * 프로그램 코드로 단축키 조회하기
	 * 
	 * @date 2019. 03. 21.
	 * @param
	 * @returns
	 * @author Inswave Systems
	 */
	public abstract List selectShortcutList(String programCd);

	/**
	 * 프로그램 코드로 단축키 조회하기
	 * 
	 * @date 2019. 03. 21.
	 * @param
	 * @returns
	 * @author Inswave Systems
	 */
	public abstract int insertShortcut(Map param);

	/**
	 * 프로그램 코드로 단축키 조회하기
	 * 
	 * @date 2019. 03. 21.
	 * @param
	 * @returns
	 * @author Inswave Systems
	 */
	public abstract int updateShortcut(Map param);

	/**
	 * 프로그램 코드로 단축키 조회하기
	 * 
	 * @date 2019. 03. 21.
	 * @param
	 * @returns
	 * @author Inswave Systems
	 */
	public abstract int deleteShortcut(Map param);
}