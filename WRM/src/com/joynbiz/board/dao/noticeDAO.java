package com.joynbiz.board.dao;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;



@Repository
public interface noticeDAO {
	
	//게시글 전체조회
	public List<HashMap<String, Object>> getBoardList(HashMap<String, Object> map);
	
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
	

}