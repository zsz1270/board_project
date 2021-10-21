package com.inswave.wrm.sample.beans;

import java.util.List;

public class DataBean<T> {
	
	private RsMsgBean rsMsg;
	
	private List<T> data;

	public RsMsgBean getRsMsg() {
		return rsMsg;
	}

	public void setRsMsg(RsMsgBean rsMsg) {
		this.rsMsg = rsMsg;
	}

	public List<T> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}
}