package com.java_test.mytest.notice.noticevo;
public class noticeVO {
	private String con_dv;
	private String con_no;
	private String con_title;
	private String con_txt;
	private String con_id;
	private String con_password;
	private int read_count;
	private String del_yn;
	private String reg_ip;
	private String reg_date;
	private String upd_date;	
	private int key;
	private String rn;
	

	public String getRn() {
		return rn;
	}




	public void setRn(String rn) {
		this.rn = rn;
	}




	public String getCon_dv() {
		return con_dv;
	}




	public String getCon_no() {
		return con_no;
	}




	public String getCon_title() {
		return con_title;
	}




	public String getCon_txt() {
		return con_txt;
	}




	public String getCon_id() {
		return con_id;
	}




	public String getCon_password() {
		return con_password;
	}




	public int getRead_count() {
		return read_count;
	}




	public String getDel_yn() {
		return del_yn;
	}




	public String getReg_ip() {
		return reg_ip;
	}




	public String getReg_date() {
		return reg_date;
	}




	public String getUpd_date() {
		return upd_date;
	}




	public int getKey() {
		return key;
	}




	public void setCon_dv(String con_dv) {
		this.con_dv = con_dv;
	}




	public void setCon_no(String con_no) {
		this.con_no = con_no;
	}




	public void setCon_title(String con_title) {
		this.con_title = con_title;
	}




	public void setCon_txt(String con_txt) {
		this.con_txt = con_txt;
	}




	public void setCon_id(String con_id) {
		this.con_id = con_id;
	}




	public void setCon_password(String con_password) {
		this.con_password = con_password;
	}




	public void setRead_count(int read_count) {
		this.read_count = read_count;
	}




	public void setDel_yn(String del_yn) {
		this.del_yn = del_yn;
	}




	public void setReg_ip(String reg_ip) {
		this.reg_ip = reg_ip;
	}




	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}




	public void setUpd_date(String upd_date) {
		this.upd_date = upd_date;
	}




	public void setKey(int key) {
		this.key = key;
	}




	@Override
	public String toString() {
		return "BoardDTO [con_dv=" + con_dv + ", con_no=" + con_no + ", con_title=" + con_title + ", con_txt="
				+ con_txt + ", con_id=" + con_id + ", con_password=" + con_password + ", read_count=" + read_count + ", del_yn="
				+ del_yn + ", reg_ip=" + reg_ip + ", reg_date=" + reg_date + ", upd_date=" + upd_date + ", key=" + key
				+ ", rn=" + rn + "]";
	}
}