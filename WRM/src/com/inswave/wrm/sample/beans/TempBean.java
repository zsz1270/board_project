package com.inswave.wrm.sample.beans;

public class TempBean {

	private int id;
	private int seq;
	private String custNm;
	private String custTelNo;
	private String custEmail;
	private String prdtCmpnyNm;
	private String rowStatus;
	private String statusValue;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public String getCustNm() {
		return custNm;
	}

	public void setCustNm(String custNm) {
		this.custNm = custNm;
	}

	public String getCustTelNo() {
		return custTelNo;
	}

	public void setCustTelNo(String custTelNo) {
		this.custTelNo = custTelNo;
	}

	public String getCustEmail() {
		return custEmail;
	}

	public void setCustEmail(String custEmail) {
		this.custEmail = custEmail;
	}

	public String getPrdtCmpnyNm() {
		return prdtCmpnyNm;
	}

	public void setPrdtCmpnyNm(String prdtCmpnyNm) {
		this.prdtCmpnyNm = prdtCmpnyNm;
	}

	public String getStatusValue() {
		return statusValue;
	}

	public void setStatusValue(String statusValue) {
		this.statusValue = statusValue;
	}

	public String getRowStatus() {
		return rowStatus;
	}

	public void setRowStatus(String rowStatus) {
		this.rowStatus = rowStatus;
	}

	/**
	 * Constructs a <code>String</code> with all attributes in name = value format.
	 *
	 * @return a <code>String</code> representation of this object.
	 */
	public String toString() {
		final String TAB = "	";

		String retValue = "";

		retValue = "TempBean ( " + super.toString() + TAB + "id = " + this.id + TAB + "SEQ = " + this.seq + TAB + "CUST_NM = " + this.custNm + TAB
				+ "CUST_TEL_NO = " + this.custTelNo + TAB + "CUST_EMAIL = " + this.custEmail + TAB + "PRDT_CMPNY_NM = " + this.prdtCmpnyNm + TAB + " )";

		return retValue;
	}
}
