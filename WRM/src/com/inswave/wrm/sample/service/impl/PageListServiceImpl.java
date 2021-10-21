package com.inswave.wrm.sample.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.sample.dao.PageListDao;
import com.inswave.wrm.sample.service.PageListService;

@Service
public class PageListServiceImpl implements PageListService{
	
	@Resource(name="pageListDao")
	private PageListDao pageListDao;
	
	/**
	 *  조회
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List select(Map param) {
		return pageListDao.select(param);
	}	
	
	public List selectList() {
		return pageListDao.selectList();
	}
	
	public Map selectTotalCNT() {
		return pageListDao.selectTotalCNT();
	}
	
	/**
	 * 여러 건의 코드 그룹 데이터를 변경(등록, 수정, 삭제)한다.
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public Map update(Map param) {
		
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;
			
		String status = (String) param.get("STATUS");
		
		if (status.equals("C")) {
			Map updateCntMap = pageListDao.selectTotalCNT();
			
			// 업데이트 순번을 생성한다.
			int iseq = (Integer) updateCntMap.get("CNT") + 1;
			String seq = Integer.toString(iseq);
			
			if(seq.length() == 1){
				seq = "u000" + seq;
			}else if(seq.length() == 2){
				seq = "u00" + seq;
			}else if(seq.length() == 3){
				seq = "u0" + seq;
			}else if(seq.length() == 4){
				seq = "u" + seq;
			}
			
			// 생성된 업데이트 순번을 UPT_SEQ에 담는다.
			param.put("UPT_SEQ", seq);
			iCnt += pageListDao.insert(param);
		} else if (status.equals("D")) {
			dCnt += pageListDao.delete(param);
		} else if (status.equals("U")) {
			uCnt += pageListDao.update(param);
		}
		
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
		
	}
}
