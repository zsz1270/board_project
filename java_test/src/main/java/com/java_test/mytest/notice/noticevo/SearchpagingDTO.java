package com.java_test.mytest.notice.noticevo;

public class SearchpagingDTO extends pagingDTO{
	private String searchType = "";
	private String keyword = "";
	private String con_dv;
	
	public String getSearchType() {
		return searchType;
	}
	public void setSearchType(String searchType) {
		this.searchType = searchType;
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
		return "SearchCriteria [searchType=" + searchType + ", keyword=" + keyword + "]";
	}
}
