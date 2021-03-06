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
	
	//게시글전체조회
	public HashMap<String, Object> getBoardList(HashMap<String, Object> map);
	
	//상세게시글 ,조회수
	public HashMap<String, Object> detailContents(HashMap<String, Object> map);
		
	//글작성
	public int writeBoard(HttpServletRequest request, HashMap<String, Object> map);
	
	//글수정
	public int editContent(HashMap<String, Object> map);

	//개인정보확인
	public boolean checkIdentify(HashMap<String, Object> map);

	//삭제
	public int deleteContent(HashMap<String, Object> map);
}
