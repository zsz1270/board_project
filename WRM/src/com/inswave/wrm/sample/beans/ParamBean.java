package com.inswave.wrm.sample.beans;

public class ParamBean<T> {
	
	private RsMsgBean header;
	
	private T param;

	public RsMsgBean getHeader() {
		return header;
	}

	public void setHeader(RsMsgBean header) {
		this.header = header;
	}	
	
	public T getParam() {
		return param;
	}

	public void setParam(T param) {
		this.param = param;
	}


}
