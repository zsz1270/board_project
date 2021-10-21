package com.inswave.wrm.sample.service;

import java.util.List;
import java.util.Map;

public interface EduService {
	public int insertSpMember(Map param) throws Exception;

	public int updateSpMember(Map param) throws Exception;

	public Map selectOneSpMember(Map param) throws Exception;

	public List selectListSpMember(Map param) throws Exception;

	public Map selectListSpMemberByHandler(Map param) throws Exception;

	public List selectListZipCodeByTown(Map param) throws Exception;
}
