package com.java_test.mytest.notice.noticevo;

public class SearchDTO {
	private String search_option;
	private String keyword;
	private String con_dv;
	
	public String getSearch_option() {
		return search_option;
	}
	public void setSearch_option(String search_option) {
		this.search_option = search_option;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public String getCon_dv() {
		return con_dv;
	}
	public void setCon_dv(String con_dv) {
		this.con_dv = con_dv;
	}
	@Override
	public String toString() {
		return "SearchDTO [search_option=" + search_option + ", keyword=" + keyword +  ", con_div=" + con_dv + "]";
	}
}
