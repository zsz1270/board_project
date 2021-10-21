package com.inswave.wrm.sample.service;

import java.util.List;
import java.util.Map;

import com.inswave.wrm.sample.beans.TempBean;
import com.inswave.wrm.sample.beans.UserBean;

public interface SampleService {

	// 샘플목록 조회
	public List<Map> selectSample(Map param);

	// 샘플목록 저장
	public Map saveSample(List param);
	
	// 리스트 조회
	public List select(Map param);
	
	// resultHandler를 이용한 조회 - Array 사용 
	public Map selectResultHandler(Map param);

	// Main Setting 업데이트
	public Map update(List param);

	// Bean 방식 조회
	public List selectBean(UserBean userbean) throws Exception;

	public List<TempBean> selectBeanReturn(UserBean bean) throws Exception;

	// Main Setting 업데이트 - Bean방식
	// public Map updateBean(ModifiedBean mbean);
	public Map updateBean(List<TempBean> tListbean);

	// Array 방식 조회
	public List selectArrayByDefaultResultHandler(Map param);
}
