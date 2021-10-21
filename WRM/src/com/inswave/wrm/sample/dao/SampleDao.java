package com.inswave.wrm.sample.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.inswave.wrm.sample.beans.TempBean;
import com.inswave.wrm.sample.beans.UserBean;

@Repository("sampleDao")
public interface SampleDao {

	// 샘플 목록 조회
	public List<Map> selectSample(Map param);

	// 샘플 목록 C, U, D
	public int insertSample(Map param);

	public int deleteSample(Map param);

	public int updateSample(Map param);	

	// 리스트 조회
	public List<Map> select(Map param);

	// 업데이트 정보 입력,수정,삭제
	public int insert(Map param);

	public int update(Map param);

	public int delete(Map param);

	// bean 방식
	public List selectBean(UserBean userbean);

	// 업데이트 정보 입력,수정,삭제 - bean 방식
	public int insertBean(TempBean tempbean);

	public int updateBean(TempBean tempbean);

	public int deleteBean(TempBean tempbean);

}
