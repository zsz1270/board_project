package com.joynbiz.board.service.Impl;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class webSquarePageServiceImpl implements com.joynbiz.board.service.webSquarePageService{

	@Autowired
	private com.joynbiz.board.dao.noticeDAO dao;
	private int page; 
	private int display; 
	private int rowStart; 
	private int rowEnd;

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public HashMap<String, Object> setCon_dv(HashMap<String, Object> board) { 
		board.put("con_dv", "01");
		
		logger.info(">>> 게시판 구분자 HashMap 01 : 설정");

		return board;
	}
	@Override
	public HashMap<String, Object> getBoardList(HashMap<String, Object> board) {
		logger.info(board.toString());
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		setCon_dv(board);
		
		board = calRowStartEnd(board);
	 
		List<HashMap<String, Object>> BoardList = dao.getBoardList(board); 
		
		result.put("boardList", BoardList);

		return result;
	}
	public HashMap<String, Object> calRowStartEnd(HashMap<String, Object> board) {
		
		this.page = Integer.valueOf(String.valueOf(board.get("page")));
		this.display = Integer.valueOf(String.valueOf(board.get("display")));
	
		rowStart = ((page - 1) * display) + 1;
		rowEnd = rowStart + display -1;
				
		board.put("rowStart", rowStart);
		board.put("rowEnd", rowEnd);
		
		return board;
	}
	

}
