package com.inswave.wrm.sample.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.sample.dao.EduDao;
import com.inswave.wrm.sample.service.EduService;
import com.inswave.wrm.util.WqLargeResultHandler;

@Service("eduService")
public class EduServiceImpl implements EduService {
	@Resource(name = "eduDao")
	private EduDao eduDao;

	public int insertSpMember(Map param) throws Exception {
		return eduDao.insertSpMember(param);
	}

	public int updateSpMember(Map param) throws Exception {
		return eduDao.updateSpMember(param);
	}

	public Map selectOneSpMember(Map param) throws Exception {
		return eduDao.selectOneSpMember(param);
	}

	public List selectListSpMember(Map param) throws Exception {
		return eduDao.selectListSpMember(param);
	}

	public Map selectListSpMemberByHandler(Map param) throws Exception {
		return eduDao.selectListSpMemberByHandler(param);
	}

	/**
	 * 우편번호 조회 where town = #{town}
	 */
	public List selectListZipCodeByTown(Map param) throws Exception {
		return eduDao.selectListZipCodeByTown(param);
	}

}
