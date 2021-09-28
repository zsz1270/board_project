package com.java_test.mytest.notice.dao;


import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.java_test.mytest.notice.noticevo.SearchDTO;
import com.java_test.mytest.notice.noticevo.SearchpagingDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;
import com.java_test.mytest.notice.noticevo.pagingDTO;

@Repository
public interface noticeDAO {
	
	//게시글 전체조회
	public List<noticeVO> getBoardList(SearchpagingDTO scto) ;
	
	//상세게시글 조회
	public noticeVO detailContents(noticeVO noticevo) ;
	
	//조회수 증가
	public int viewCount(noticeVO noticevo) ;
	
	//글작성
	public int insertBoard(noticeVO noticevo);
	
	//글수정
	public int updateBoard(noticeVO noticevo);

	//개인정보확인
	public boolean isCheckIdentify(noticeVO nvo);

	//삭제
	public int deleteBoard(noticeVO nvo);
	
	//페이징
	public int countBoardList(SearchpagingDTO scto);
}