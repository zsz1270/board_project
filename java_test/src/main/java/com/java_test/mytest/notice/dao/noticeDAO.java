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
	public List<HashMap<String, Object>> getBoardList(SearchpagingDTO scto) ;
	
	//상세게시글 조회
	public HashMap<String,Object> detailContents(HashMap<String,Object> map) ;
	
	//조회수 증가
	public int viewCount(HashMap<String, Object> map) ;
	
	//글작성
	public int insertBoard(HashMap<String, Object> map);
	
	//글수정
	public int updateBoard(HashMap<String, Object> map);

	//개인정보확인
	public boolean isCheckIdentify(HashMap<String, Object> map);

	//삭제
	public int deleteBoard(HashMap<String, Object> map);
	
	//페이징
	public int countBoardList(SearchpagingDTO scto);


}