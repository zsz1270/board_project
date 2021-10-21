package com.inswave.wrm.common.service;

import java.util.List;
import java.util.Map;

public interface MenuService {

	// 메뉴관리 조회
	public abstract List<Map> selectMenu(Map param);

	// 메뉴관리 저장(기본정보)
	public abstract Map saveMenu(List param);
	
}
