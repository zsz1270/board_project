package com.inswave.wrm.common.service;

import java.util.List;
import java.util.Map;

public interface CommonService {

	// 사용자별 메뉴 리스트 조회 (로그인 사용자에게 권한이 있는 메뉴만 조회함)
	public abstract List selectMenuList(Map param);
	
	// 사용자별 프로그램 권한 리스트 조회 (로그인 사용자에게 권한이 있는 프로그램 권한만 조회함)
	public abstract List selectProgramAuthorityList(Map param);

	// 공통코드관리 조회
	public abstract List selectCommonGroup(Map param);

	public abstract List selectCommonCodeAll();

	public abstract List selectCommonCodeList(Map param);

	public abstract List selectCommonSearchItem();

	// 공통관리 코드그룹 저장
	public abstract Map saveCodeGrpList(List param);

	// 공통관리 코드 저장
	public abstract Map saveCodeList(List param);

	// 공통관리 코드그룹 저장
	public abstract Map saveCodeGrpListAll(List paramCodeGrp, List paramCode);

	// 공통코드 조회
	public abstract List<Map> selectCodeList(Map param);

	// Main Setting 저장
	public abstract int insertBmMainSetting(Map param);

	// Main Setting 업데이트
	public abstract int updateBmMainSetting(Map param);

	// EMP_CD로 단건 BmMainSetting 조회
	public abstract Map selectBmMainSetting(Map param);

	// 즐겨찾기 삭제
	public abstract int deleteBmFavorite(Map param);

	// 즐겨찾기 추가
	public abstract int insertBmFavorite(Map param);

	// select 사용자별 즐겨찾기 리스트
	public abstract List selectFavListByEmpCd(String empCd);

	// 상태 값에 따라 즐겨찾기 추가/삭제/업데이트
	public abstract int updateBmFavorite(Map param);

	// select 프로그램별 단축키 리스트
	public abstract List selectShortcutList(String programCd);

	// select 프로그램별 단축키 리스트
	public abstract Map updateShortcutList(List param);
	
}
