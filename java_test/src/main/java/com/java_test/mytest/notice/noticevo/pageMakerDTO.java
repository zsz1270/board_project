package com.java_test.mytest.notice.noticevo;

import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

public class pageMakerDTO{
	private int totalCount;
	private int startPage;
	private int endPage;
	private boolean prev;
	private boolean next;
	private int displayPageNum = 3;
	private pagingDTO pto;
	private int noticeNum;
	noticeVO nvo= new noticeVO();
	
	public int getNoticeNum() {
		return noticeNum;
	}

	public void setNoticeNum() {
		this.noticeNum= totalCount - Integer.parseInt(nvo.getRn());
	}
	
	public void setPto(pagingDTO pto) {
		this.pto = pto;
	}
	
	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
		calcData();
	}
	
	public int getTotalCount() {
		return totalCount;
	}
	
	public int getStartPage() {
		return startPage;
	}
	
	public int getEndPage() {
		return endPage;
	}
	
	public boolean isPrev() {
		return prev;
	}
	
	public boolean isNext() {
		return next;
	}
	
	public int getDisplayPageNum() {
		return displayPageNum;
	}
	
	public pagingDTO getPto() {
		return pto;
	}
	
	private void calcData() {
		endPage = (int) (Math.ceil(pto.getPage() / (double)displayPageNum) * displayPageNum);
		startPage = (endPage - displayPageNum) + 1;
	  
		int tempEndPage = (int) (Math.ceil(totalCount / (double)pto.getPerPageNum()));
		if (endPage > tempEndPage) {
			endPage = tempEndPage;
		}
		prev = startPage == 1 ? false : true;
		next = endPage * pto.getPerPageNum() >= totalCount ? false : true;
	}
	
	public String makeQuery(int page) {
		UriComponents uriComponents =
		UriComponentsBuilder.newInstance()
						    .queryParam("page", page)
							.queryParam("perPageNum", pto.getPerPageNum())
							.build();
		   
		return uriComponents.toUriString();
	}
	public String makeSearch(int page) {
		UriComponents uriComponents =
	            UriComponentsBuilder.newInstance()
	            .queryParam("page", page)
	            .queryParam("perPageNum", pto.getPerPageNum())
	            .queryParam("searchType", ((SearchpagingDTO)pto).getSearchType())
	            .queryParam("keyword", ((SearchpagingDTO)pto).getKeyword())
	            .build(); 
		
	    return uriComponents.toUriString();
	}
}