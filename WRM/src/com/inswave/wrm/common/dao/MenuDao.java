package com.inswave.wrm.common.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("menuDao")
public interface MenuDao {

	// 메뉴관리 조회
	public abstract List<Map> selectMenu(Map param);
	
	// 메뉴관리 C, U, D
	public abstract int insertMenu(Map param);

	public abstract int deleteMenu(Map param);

	public abstract int saveMenu(Map param);
}
