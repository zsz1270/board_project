package com.java_test.mytest.notice.service;


import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.java_test.mytest.notice.IPconfig.IPConfig;
import com.java_test.mytest.notice.dao.noticeDAO;
import com.java_test.mytest.notice.noticevo.SearchpagingDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;
import com.java_test.mytest.notice.noticevo.pageMakerDTO;
import com.java_test.mytest.notice.noticevo.pagingDTO;

@Service
public class noticeServiceImpl implements noticeService{
	@Autowired
	private noticeDAO dao;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public HashMap<String, Object> setCon_dv(HashMap<String, Object> map) { // 게시판 구분자 지정 메소드
		map.put("con_dv", "01");
		logger.info(">>> 게시판 구분자 HashMap 01 : 설정");
		
		return map;
	}
	public SearchpagingDTO setSptoCon_dv(SearchpagingDTO spto) { // 게시판  검색 구분자 지정 메소드
		spto.setCon_dv("01");
		logger.info(">>> 게시판 구분자 Scri 01 : 설정");
		
		return spto;
	}
	
	//게시글리스트
	/*@Override
	public HashMap<String, Object> getBoardList(SearchpagingDTO spto) {
		logger.info(">>> 게시판 리스트 가져오기");

		setSptoCon_dv(spto);
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<HashMap<String, Object>> BoardList = dao.getBoardList(spto);
		// oracle 데이터 형식 때문에 TotalCount (게시물 총 개수) 정수로 변환
		int totalCount = 0;
		if (BoardList.size() != 0) {
			totalCount = Integer.parseInt(String.valueOf(BoardList.get(0).get("TOTALCOUNT")));
		}
		
		pageMakerDTO pageMaker = new pageMakerDTO();
		
		pageMaker.setPto(spto);
		pageMaker.setTotalCount(totalCount);
		
		map.put("BoardList", BoardList);
		map.put("pageMaker", pageMaker);
		map.put("searchData", spto);
		
		logger.info(">>> result Map : " + map.get("BoardList").toString());
		logger.info(">>> result 게시물 총 갯수 : " + totalCount);
		
		return map;
	}*/
	//게시글리스트
		@Override
		public HashMap<String, Object> getBoardList(HashMap<String, Object> map) {
			logger.info(">>> 게시판 리스트 가져오기");

			setCon_dv(map);
			
			List<HashMap<String, Object>> BoardList = dao.getBoardList(map);
			map.put("BoardList", BoardList);
			map.put("searchData", map);
			return map;
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