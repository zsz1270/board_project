package com.java_test.mytest.notice.service;


import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.java_test.mytest.notice.IPconfig.IPConfig;
import com.java_test.mytest.notice.dao.noticeDAO;
import com.java_test.mytest.notice.dao.noticeRepository;
import com.java_test.mytest.notice.noticevo.SearchDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;
import com.java_test.mytest.notice.noticevo.pagingDTO;

@Service
public class noticeServiceImpl implements noticeService{
	@Autowired
	private noticeDAO dao;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public noticeVO setCon_dv(noticeVO noticevo) {
		noticevo.setCon_dv("01");
		logger.info(">>> 게시판 구분자 : " + noticevo.getCon_dv()+" 설정");
		return noticevo;
	}
	
	@Override
	public List<noticeVO> getBoardList(HashMap<String, Object> map) {
		logger.info(">>> 게시판 리스트 가져오기");
		
		noticeVO nvo = new noticeVO();
		nvo = (noticeVO) map.get("nvo");
		setCon_dv(nvo);
		map.put("nvo", nvo);
		
		return dao.getlist(map);
	}
	
	@Override
	public List<noticeVO> getSearchedBoardList(HashMap<String, Object> map) {
		SearchDTO sto = new SearchDTO();
		sto = (SearchDTO) map.get("search");
		sto.setCon_dv("01");
		map.put("search", sto);
		logger.info(">>> 글  검색");
		
		return dao.selectSearchBoard(map);
	}
	
	@Override
	public noticeVO detailContents(noticeVO noticevo){
		// TODO Auto-generated method stub
		setCon_dv(noticevo);
		dao.viewCount(noticevo);
		logger.info(">>> 조회수증가");
		logger.info(">>> 상세내용보기 "+noticevo.toString());
		return dao.detailContents(noticevo);
	}

	@Override
	public int writeBoard(HttpServletRequest request, noticeVO noticevo) {
		IPConfig ip = new IPConfig();
		String yourIP = ip.getIPConfig(request);
		logger.info(">>> IP가져오기 ");
		setCon_dv(noticevo);
		logger.info(">>> 게시글작성 ");
		noticevo.setReg_ip(yourIP);
		logger.info(">>> 게시글 작성");
		logger.info(">>> write.do" + noticevo.toString());
		return dao.insertBoard(noticevo);
	}

	@Override
	public int editContent(noticeVO noticevo) {
		setCon_dv(noticevo);
		logger.info(">>> 게시글 수정");
		
		return dao.updateBoard(noticevo);
	}

	@Override
	public boolean checkIdentify(noticeVO nvo) {
		setCon_dv(nvo);
		logger.info(">>> 신원 확인"+ nvo.toString() );
		
		return dao.isCheckIdentify(nvo);
	}

	@Override
	public int deleteContent(noticeVO nvo) {
		setCon_dv(nvo);
		logger.info(">>> 글  삭제");
		
		return dao.deleteBoard(nvo);
	}

	

	@Override
	public int countBoardList(SearchDTO sto) {

	sto.setCon_dv("01");

	return dao.countBoardList(sto);	
	}

}
