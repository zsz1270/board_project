package com.inswave.wrm.sample.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.sample.beans.TempBean;
import com.inswave.wrm.sample.beans.UserBean;
import com.inswave.wrm.sample.dao.LargeDataDao;
import com.inswave.wrm.sample.dao.SampleDao;
import com.inswave.wrm.sample.service.SampleService;

@Service
public class SampleServiceImpl implements SampleService {

	@Resource(name = "largeDataDao")
	private LargeDataDao largeDataDao;

	@Resource(name = "sampleDao")
	private SampleDao sampleDao;

	/**
	 * 샘플목록 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectSample(Map param) {
		return sampleDao.selectSample(param);
	}

	/**
	 * 여러 건의 샘플 목록 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 리스트 객체
	 */
	@Override
	public Map saveSample(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {
			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += sampleDao.insertSample(data);
			} else if (rowStatus.equals("U")) {
				uCnt += sampleDao.updateSample(data);
			} else if (rowStatus.equals("D")) {
				dCnt += sampleDao.deleteSample(data);
			}
		}
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}
	
	/**
	 * 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List select(Map param) {
		return sampleDao.select(param);
	}

	/**
	 * resultHandler를 이용한 조회 - Array 사용 
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map selectResultHandler(Map param) {
		return largeDataDao.selectResultHandler(param);
	}
	
	/**
	 * 여러 건의 코드 그룹 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map update(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {

			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += sampleDao.insert(data);
			} else if (rowStatus.equals("U")) {
				uCnt += sampleDao.update(data);
			} else if (rowStatus.equals("D")) {
				dCnt += sampleDao.delete(data);
			}
		}
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;

	}

	/**
	 * 조회 - Bean방식
	 * 
	 * @param param Client 전달한 데이터 bean
	 */
	public List selectBean(UserBean userbean) throws Exception {
		List tempList = new ArrayList();
		tempList = sampleDao.selectBean(userbean);

		return tempList;
	}

	public List<TempBean> selectBeanReturn(UserBean ibean) throws Exception {

		List<TempBean> tbeanList = new ArrayList<TempBean>();

		tbeanList = sampleDao.selectBean(ibean);

		return tbeanList;
	}

	/**
	 * 여러 건의 코드 그룹 데이터를 변경(등록, 수정, 삭제)한다. - Bean방식
	 * 
	 * @param param Client 전달한 데이터 bean
	 */
	@Override
	public Map updateBean(List<TempBean> tListbean) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < tListbean.size(); i++) {

			TempBean tempbean = new TempBean();

			Map map = (Map) tListbean.get(i);

			String s_id = map.get("id").toString();
			String s_seq = map.get("seq").toString();

			tempbean.setCustNm(map.get("custNm").toString());
			tempbean.setCustTelNo(map.get("custTelNo").toString());
			tempbean.setCustEmail(map.get("custEmail").toString());
			tempbean.setPrdtCmpnyNm(map.get("prdtCmpnyNm").toString());

			String rowStatus = map.get("rowStatus").toString();

			if (rowStatus.equals("C")) {
				iCnt += sampleDao.insertBean(tempbean);
			} else if (rowStatus.equals("U")) {
				tempbean.setId(Integer.parseInt(s_id));
				tempbean.setSeq(Integer.parseInt(s_seq));
				uCnt += sampleDao.updateBean(tempbean);
			} else if (rowStatus.equals("D")) {
				tempbean.setId(Integer.parseInt(s_id));
				tempbean.setSeq(Integer.parseInt(s_seq));
				dCnt += sampleDao.deleteBean(tempbean);
			}
		}

		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}
	
	/**
	 * 조회 - Array방식
	 * 
	 * @param param Client 전달한 데이터 bean
	 */
	public List selectArrayByDefaultResultHandler(Map param) {
		return largeDataDao.selectArrayByDefaultResultHandler(param);
	}

}
