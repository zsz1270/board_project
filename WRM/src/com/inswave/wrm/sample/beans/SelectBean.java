package com.inswave.wrm.sample.beans;

import java.util.List;

public class SelectBean {

	private UserBean userInfo;
	private List tempList;

	public UserBean getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserBean userInfo) {
		this.userInfo = userInfo;
	}

	public List getTempList() {
		return tempList;
	}

	public void setTempList(List tempList) {
		this.tempList = tempList;
	}
}
