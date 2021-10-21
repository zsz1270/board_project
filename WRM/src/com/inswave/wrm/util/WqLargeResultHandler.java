package com.inswave.wrm.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;

public class WqLargeResultHandler implements ResultHandler {

	private int totRowCount = 0;
	private int totColCount = 0;
	private ArrayList<String> columnArr = null;
	private ArrayList<Object> dataArr = null;
	private Map<String, Object> result = null;

	/**
	 * Data객체는 getResult()를 호출하여 반환받는다.
	 */
	public WqLargeResultHandler() {
		dataArr = new ArrayList<Object>();
		result = new HashMap<String, Object>();
	}

	@Override
	public void handleResult(ResultContext context) {
		mapTypeRowHandler((HashMap) context.getResultObject());
	}

	/**
	 * Map타입의 실 data를 생성.
	 * 
	 * @date 2016.08.17
	 * @param rowMap row단위의 Map객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	private void mapTypeRowHandler(HashMap rowMap) {
		if (totRowCount == 0) {
			columnArr = new ArrayList<String>();
			Set keySet = rowMap.keySet();
			Iterator<String> keys = keySet.iterator();
			totColCount = keySet.size();

			while (keys.hasNext()) {
				String key = (String) keys.next();
				columnArr.add(key);
			}
		}

		for (int i = 0; i < totColCount; i++) {
			dataArr.add(rowMap.get(columnArr.get(i)));
		}
		totRowCount++;
	}

	/**
	 * resultType에 따른 Data객체를 반환한다.
	 * 
	 * @date 2016.08.17
	 * @returns <Object> [Map, String]반환 받은 뒤 type변환 필요.
	 * @author Inswave Systems
	 * @example new LargeDataHandler()<br/>
	 *		  - return Map 객체 : {columnInfo:[],data:[],rowCount:0,colCount:0}<br/>
	 * @todo 추가해야 할 작업
	 */
	public Object getResult() {
		result.put("columnInfo", columnArr);
		result.put("data", dataArr);
		result.put("rowCount", "" + totRowCount);
		result.put("colCount", "" + totColCount);
		return result;
	}
}
