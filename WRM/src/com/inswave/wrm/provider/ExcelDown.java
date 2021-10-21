package com.inswave.wrm.provider;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.simple.parser.JSONParser;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.w3c.dom.Document;

import com.inswave.wrm.util.MapUtil;

import websquare.http.WebSquareContext;
import websquare.http.controller.grid.excel.write.IExternalGridDataProvider;
import websquare.util.XMLUtil;

public class ExcelDown implements IExternalGridDataProvider {
	
	// Excel 파일로 다운로드 받을 최대 Row 수 설정
	private final int MAX_ROW_COUNT = 10000;

	public String[] getData(Document requestObj) throws Exception {

		// Get WebApplicationContext
		WebSquareContext context = WebSquareContext.getContext();
		HttpServletRequest request = context.getRequest();
		HttpSession httpSession = request.getSession();
		ServletContext sc = httpSession.getServletContext();
		WebApplicationContext wContext = WebApplicationContextUtils.getWebApplicationContext(sc);
		
		List<HashMap <String, String>> resultList = null;
		String keyMap = null;
		
		try {
			// Loading Parameter
			// System.out.println(XMLUtil.indent(requestObj));
			String serviceId = XMLUtil.getText(requestObj, "service");
			String methodId = XMLUtil.getText(requestObj, "method");
			keyMap = XMLUtil.getText(requestObj, "keyMap");
			
			JSONParser parser = new JSONParser();
			Map paramData = (Map) parser.parse(XMLUtil.getText(requestObj, "param"));
			paramData.put("OFFSET_ROW", 0);
			paramData.put("PAGE_SIZE", MAX_ROW_COUNT);
			
			// Call the method of the service
			Object service = wContext.getBean(serviceId);
			Method method = service.getClass().getMethod(methodId, Map.class);
			resultList = (List<HashMap <String, String>>) method.invoke(service, paramData);

		} catch (Exception ex) {
			ex.printStackTrace();
		}

		if ((resultList != null) && (resultList.size() > 0)) {
			if (keyMap != null) {
				return MapUtil.hashMapValuesToArray(resultList, keyMap);
			} else {
				return MapUtil.hashMapValuesToArray(resultList);
			}
		} else {
			return null;
		}
	}

}
