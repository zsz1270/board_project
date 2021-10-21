package com.joynbiz.board.service;

import java.util.HashMap;

import org.springframework.stereotype.Repository;

@Repository
public interface webSquarePageService {
	
	public HashMap<String, Object> getBoardList(HashMap<String, Object> board);
}
