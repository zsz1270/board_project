package com.joynbiz.board.service;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
@Repository
public interface webSquarePageService {
	
	public HashMap<String, Object> getBoardList(HashMap<String, Object> board);
}
