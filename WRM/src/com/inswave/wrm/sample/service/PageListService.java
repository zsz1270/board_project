package com.inswave.wrm.sample.service;

import java.util.List;
import java.util.Map;

public interface PageListService {

	// 리스트 조회 - 페이지 리스트에서 사용
	public List select(Map param);

	// 리스트 조회 - 전체 조회
	public List selectList();

	// 총건수 조회
	public Map selectTotalCNT();

	// Main Setting 업데이트
	public Map update(Map param);
}
