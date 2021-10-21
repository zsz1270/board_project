package com.inswave.wrm.common.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.common.dao.MenuDao;
import com.inswave.wrm.common.service.MenuService;

@Service
public class MenuServiceImpl implements MenuService {

	@Resource(name = "menuDao")
	private MenuDao menuDao;

	/**
	 * 메뉴관리 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectMenu(Map param) {
		return menuDao.selectMenu(param);
	}

	/**
	 * 여러 건의 메뉴관리(개인기본정보) 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 리스트 객체
	 */
	@Override
	public Map saveMenu(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {

			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += menuDao.insertMenu(data);
			} else if (rowStatus.equals("U")) {
				uCnt += menuDao.saveMenu(data);
			} else if (rowStatus.equals("D")) {
				dCnt += menuDao.deleteMenu(data);
			}
		}
		
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}
}
