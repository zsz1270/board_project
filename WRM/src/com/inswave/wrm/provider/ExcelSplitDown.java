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
import websquare.http.controller.grid.excel.write.IExternalSplitProvider;
import websquare.util.XMLUtil;
 

public class ExcelSplitDown implements IExternalSplitProvider {

	private int offsetRow = 0;
	
	// 페이징 처리 방식으로 데이터를 가져올 최대 Row 수 설정 (PAGE_ROW_COUNT 단위로 Row를 수를 나누어서 데이터를 Fetch함)
	private final int PAGE_ROW_COUNT = 1000;
	
	// Excel 파일로 다운로드 받을 최대 Row 수 설정 
	// MAX_ROW_COUNT은 100000까지 설정이 가능합니다.
	// 100,000 만건 이상을 다운로드 받으시려면 websquare.xml에서 maxRowCount 값을 설정해야 합니다.
	// maxRowCount 값이 너무 큰 경우 Excel 파일 생성 과정에서 OutOfMemory가 발생할 수 있으니 
	// WAS의 Heap Memory 크기를 고려해서 적절하게 설정해야 합니다.
	// <!-- websquare.xml (websquare_home/config) -->
	//	<excel>
	//    <download>
	//   		<!-- 엑셀 파일 다운로드 시 최대 Row 수 -->
	//        <maxRowCount value="1000000" />
	//    </download>
	private final int MAX_ROW_COUNT = 10000;
	private boolean isEnd = false;
	
	
	/**
	 * getData에서 데이터 생성시 OutOfMemory 가 발생하지 않도록 적정선의 데이터를 생성하여 리턴한다.
	 * 
	 * @param requestObj The Document Object of the Request Object
	 * @return String[] 문자열 배열
	 */
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
			paramData.put("OFFSET_ROW", offsetRow);
			paramData.put("PAGE_SIZE", PAGE_ROW_COUNT);
			
			// Call the method of the service
			Object service = wContext.getBean(serviceId);
			Method method = service.getClass().getMethod(methodId, Map.class);
			resultList = (List<HashMap <String, String>>) method.invoke(service, paramData);

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		if ((resultList.size() < PAGE_ROW_COUNT) || (offsetRow >= (MAX_ROW_COUNT - PAGE_ROW_COUNT))) {
			isEnd = true;
		} else {
			offsetRow += PAGE_ROW_COUNT;
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

	/**
	 * sendCompleted 가 true를 리턴하면 getData() 를 더 호출하지 않고 종료된다
	 */
	public boolean sendCompleted() throws Exception {
		return isEnd;
	}
}
