package com.inswave.wrm.sample.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.sample.dao.LargeDataDao;
import com.inswave.wrm.sample.dao.ZipCodeStreetDao;
import com.inswave.wrm.sample.service.ZipCodeService;

@Service("zipCodeService")
public class ZipCodeServiceImpl implements ZipCodeService {

	@Resource(name = "largeDataDao")
	private LargeDataDao largeDataDao;

	@Resource(name = "zipCodeStreetDao")
	private ZipCodeStreetDao zipCodeStreetDao;

	@Override
	public List selectZipCodeStreet(Map param) {
		return largeDataDao.selectZipCodeStreet(param);
	}

	public Map selectZipCodeStreetByDefaultResultHandler(Map param) {
		return largeDataDao.selectZipCodeStreetByDefaultResultHandler(param);
	}

	public List selectZipCodeStreetByStreet(Map param) {
		return zipCodeStreetDao.selectZipCodeStreetByStreetPaging(param);
	}

	public int selectZipCodeStreetByStreetTotalCnt(Map param) {
		return zipCodeStreetDao.selectZipCodeStreetByStreetTotalCnt(param);
	}
}
