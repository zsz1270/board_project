package com.java_test.mytest.notice.service;


import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.java_test.mytest.notice.IPconfig.IPConfig;
import com.java_test.mytest.notice.dao.noticeDAO;
import com.java_test.mytest.notice.noticevo.SearchpagingDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;

@Service
public class noticeServiceImpl implements noticeService{
	@Autowired
	private noticeDAO dao;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public noticeVO setBoardCon_dv(noticeVO nvo) {
		nvo.setCon_dv("01");
		logger.info(">>> 게시판 구분자 Board 01 " + nvo.getCon_dv()+" 설정");
		return nvo;
	}
	
	public SearchpagingDTO setSctoCon_dv(SearchpagingDTO scto) {
		scto.setCon_dv("01");
		logger.info(">>> 게시판 구분자 Scri 01  " + scto.getCon_dv()+" 설정");
		return scto;
	}
	
	//게시글 전체조회 ,검색확인
	@Override
	public List<HashMap<String, Object>> getBoardList(SearchpagingDTO scto) {
		logger.info(">>> 게시판 리스트 가져오기");
		
		setSctoCon_dv(scto);
		return dao.getBoardList(scto);
	}
	
	//상세화면보기 ,조회수
	@Override
	public HashMap<String, Object> detailContents(HashMap<String, Object> map) {
		map.put("con_dv","01");
		//카운팅
		dao.viewCount(map);
		logger.info(">>> 조회수증가");
		
		logger.info(">>> 상세내용보기 "+map.toString());
		return dao.detailContents(map);
	}
	
	//개인정보 확인
	@Override
	public boolean checkIdentify(HashMap<String, Object> map) {
		map.put("con_dv", "01");
		logger.info(">>> 신원 확인"+ map.toString() );
		
		return dao.isCheckIdentify(map);
	}
	
	@Override
	public int countBoardList(SearchpagingDTO scto) {
	setSctoCon_dv(scto);
	return dao.countBoardList(scto);	
	}

	//게시글 작성
	@Override
	public int writeBoard(HttpServletRequest request, HashMap<String, Object> map) {
		IPConfig ip = new IPConfig();
		String yourIP = ip.getIPConfig(request);

		map.put("con_dv", "01");
		map.put("reg_ip", yourIP);
		logger.info(">>> 게시판 글쓰기");
		
		return dao.insertBoard(map);
	}

	//게시글 수정
	@Override
	public int editContent(HashMap<String, Object> map) {
		map.put("con_dv", "01");
		logger.info(">>> 글 수정");
		
		return dao.updateBoard(map);
	}

	//게시글 삭제
	@Override
	public int deleteContent(HashMap<String, Object> map) {
		map.put("con_dv", "01");
		logger.info(">>> 글  삭제");
		
		return dao.deleteBoard(map);
	}

	
}