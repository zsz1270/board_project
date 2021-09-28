package com.java_test.mytest.notice.service;


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
	
	@Override
	public List<noticeVO> getBoardList(SearchpagingDTO scto) {
		logger.info(">>> 게시판 리스트 가져오기");
		
		setSctoCon_dv(scto);
		return dao.getBoardList(scto);
	}
	
	
	
	@Override
	public noticeVO detailContents(noticeVO nvo){
		// TODO Auto-generated method stub
		setBoardCon_dv(nvo);
		dao.viewCount(nvo);
		logger.info(">>> 조회수증가");
		logger.info(">>> 상세내용보기 "+nvo.toString());
		return dao.detailContents(nvo);
	}

	@Override
	public int writeBoard(HttpServletRequest request, noticeVO nvo) {
		IPConfig ip = new IPConfig();
		String yourIP = ip.getIPConfig(request);
		logger.info(">>> IP가져오기 ");
		setBoardCon_dv(nvo);
		logger.info(">>> 게시글작성 ");
		nvo.setReg_ip(yourIP);
		logger.info(">>> 게시글 작성");
		logger.info(">>> write.do" + nvo.toString());
		return dao.insertBoard(nvo);
	}

	@Override
	public int editContent(noticeVO nvo) {
		setBoardCon_dv(nvo);
		logger.info(">>> 게시글 수정");
		
		return dao.updateBoard(nvo);
	}

	@Override
	public boolean checkIdentify(noticeVO nvo) {
		setBoardCon_dv(nvo);
		logger.info(">>> 신원 확인"+ nvo.toString() );
		
		return dao.isCheckIdentify(nvo);
	}

	@Override
	public int deleteContent(noticeVO nvo) {
		setBoardCon_dv(nvo);
		logger.info(">>> 글  삭제");
		
		return dao.deleteBoard(nvo);
	}

	

	@Override
	public int countBoardList(SearchpagingDTO scto) {
	setSctoCon_dv(scto);
	return dao.countBoardList(scto);	
	}

}
