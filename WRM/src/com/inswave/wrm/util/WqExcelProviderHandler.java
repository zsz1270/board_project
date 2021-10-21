package com.inswave.wrm.util;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;

public class WqExcelProviderHandler implements ResultHandler {

	private ArrayList<Object> dataArr = null;
	private String[] keyCode = new String[0];

	/**
	 * Data객체는 getResult()를 호출하여 반환받는다.
	 */
	public WqExcelProviderHandler() {
		dataArr = new ArrayList();
	}

	public void setKeyCode(String[] keys) {
		keyCode = keys.clone();
	}
	
	@Override
	public void handleResult(ResultContext context) {
		HashMap data = (HashMap)context.getResultObject();

		for (int i = 0; i < keyCode.length; i++) {
			String key = keyCode[i];
			if (data.get(key) == null) {
				dataArr.add("");
			} else {
				dataArr.add(String.valueOf(data.get(key)));
			}
		}
	}


	/**
	 * String[] 데이타를 반환한다.
	 * 
	 * @date 2016.08.17
	 * @returns <Object> String[]
	 * @author Inswave Systems
	 * @example
	 * @todo 추가해야 할 작업
	 */
	public Object getResult() {
		/*
		returnData = new String[dataArr.size()];
		for (int i = 0; i < dataArr.size(); i++) {
			returnData[i] = String.valueOf(dataArr.get(i));
		}
		*/
		String returnData[] = new String[dataArr.size()];
		dataArr.toArray(returnData);
		return returnData;
	}

	public int getSize() {
		return dataArr.size();
	}

}
