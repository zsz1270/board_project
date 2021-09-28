package com.java_test.mytest.notice.service;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.java_test.mytest.notice.noticevo.SearchDTO;
import com.java_test.mytest.notice.noticevo.SearchpagingDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;
import com.java_test.mytest.notice.noticevo.pagingDTO;

@Repository
public interface noticeService {
	
	//게시글 전체조회
	public List<noticeVO> getBoardList(SearchpagingDTO scto);
	
	//상세게시글 조회,조회수 증가
	public noticeVO detailContents(noticeVO nvo) ;
	
	//글작성
	public int writeBoard(HttpServletRequest request, noticeVO nvo);

	//글수정
	public int editContent(noticeVO nvo);

	//개인정보확인
	public boolean checkIdentify(noticeVO nvo);

	//삭제
	public int deleteContent(noticeVO nvo);
	
	//페이징
	public int countBoardList(SearchpagingDTO scto);
}
