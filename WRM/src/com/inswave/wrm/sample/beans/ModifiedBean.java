package com.inswave.wrm.sample.beans;

import java.util.List;

public class ModifiedBean {

	private String result;

	private List tempList;

	private UserBean userBean;

	public UserBean getUserBean() {
		return userBean;
	}

	public void setUserBean(UserBean userBean) {
		this.userBean = userBean;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public List getTempList() {
		return tempList;
	}

	public void setTempList(List tempList) {
		this.tempList = tempList;
	}

	/**
	 * Constructs a <code>String</code> with all attributes in name = value format.
	 *
	 * @return a <code>String</code> representation of this object.
	 */
	public String toString() {
		final String TAB = "	";

		String retValue = "";

		retValue = "ModifiedBean ( " + super.toString() + TAB + "result = " + this.result + TAB + "tempList = " + this.tempList + TAB + "requestInfo = "
				+ this.userBean + TAB + " )";

		return retValue;
	}

}
