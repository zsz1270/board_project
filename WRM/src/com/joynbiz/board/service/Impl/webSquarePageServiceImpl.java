package com.joynbiz.board.service.Impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joynbiz.board.dao.noticeDAO;
import com.joynbiz.board.service.webSquarePageService;

@Service
public class webSquarePageServiceImpl implements webSquarePageService{

	@Autowired
	private noticeDAO dao;
	
	private int page; 
	private int display; 
	private int rowStart; 
	private int rowEnd;

	public HashMap<String, Object> setCon_dv(HashMap<String, Object> board) { 
		board.put("con_dv", "01");
		
		return board;
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
	@Override
	public HashMap<String, Object> getBoardList(HashMap<String, Object> board) {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		setCon_dv(board);
		
		board = calRowStartEnd(board);
	 
		List<HashMap<String, Object>> BoardList = dao.getBoardList(board); 
		
		result.put("boardList", BoardList);

		return result;
	}

}
