package com.inswave.wrm.sample.service;

import java.util.List;
import java.util.Map;

public interface ZipCodeService {
	/**
	 * param의 rowcount에 따라 select
	 * 
	 * @date 2016. 8. 11.
	 * @param param : rpwcount에 select할 count명시. null일 경우 모든 데이터를 반환
	 * @returns <List> rpwcount에 따른 list
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public List selectZipCodeStreet(Map param);

	/**
	 * returnType이 Map인 dao 호출.
	 * 
	 * @date 2016. 8. 17.
	 * @param param SEQ_NO-조회할 row수
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public Map selectZipCodeStreetByDefaultResultHandler(Map param);

	/**
	 * STREET 거리명으로 조회
	 * 
	 * @date 2016. 8. 11.
	 * @param param : STREET(거리명), START_IDX( 시작 index ), END_IDX( 종료 index )
	 * @returns <List> 검색결과 리스트
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public List selectZipCodeStreetByStreet(Map param);

	/**
	 * STREET 거리명으로 조회
	 * 
	 * @date 2016. 8. 11.
	 * @param param : STREET(거리명), START_IDX( 시작 index ), END_IDX( 종료 index )
	 * @returns <List> 검색결과 리스트
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public int selectZipCodeStreetByStreetTotalCnt(Map param);
}
