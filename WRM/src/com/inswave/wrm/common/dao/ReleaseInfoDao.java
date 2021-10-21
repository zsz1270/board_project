package com.inswave.wrm.common.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("ReleaseInfoDao")
public interface ReleaseInfoDao {

	public abstract List selectReleaseForSummary(Map param);

	// 메뉴관리 C, U, D
	public abstract int insertRelease(Map param);

	public abstract int deleteRelease(Map param);

	public abstract int updateRelease(Map param);

	public abstract Map selectReleasetTotalCnt();
}