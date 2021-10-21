package com.inswave.wrm.sample.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("pageListDao")
public interface PageListDao {

	// 리스트 조회 - 페이지 리스트에서 사용
	public List<Map> select(Map param);

	// 리스트 전체 조회
	public List<Map> selectList();

	// 총건수 조회
	public Map selectTotalCNT();

	// 메인화면의 업데이트 정보 입력,수정,삭제
	public int insert(Map param);

	public int update(Map param);

	public int delete(Map param);
}
