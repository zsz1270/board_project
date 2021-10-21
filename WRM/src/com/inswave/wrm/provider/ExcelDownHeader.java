package com.inswave.wrm.provider;

import org.w3c.dom.Document;

import websquare.http.controller.grid.excel.write.IExternalGridDataProvider;

public class ExcelDownHeader implements IExternalGridDataProvider {

	public String[] getData(Document requestObj) throws Exception {
		String[] returnData = { "" };
		return returnData;
	}

}
