package com.joynbiz.board.service.Impl;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;


@Service
public class noticeServiceImpl implements com.joynbiz.board.service.noticeService{
	@Autowired
	private com.joynbiz.board.dao.noticeDAO dao;
	private int page ;
	private int perPageNum = 5;		//한페이지 리스트갯수
	private int displayPageNum = 4; //한번에 보여줄 페이지갯수
	private int startPage;
	private int endPage;
	private int rowStart;
	private int rowEnd;
	private boolean prev;
	private boolean next;
	private int totalCount = 0;
	private int display; 
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	// 게시판 구분자 지정 메소드
	public HashMap<String, Object> setCon_dv(HashMap<String, Object> map) { 
		map.put("con_dv", "01");
		logger.info(">>> 게시판 구분자 HashMap 01 : 설정");
		
		return map;
	}
	
	
	//게시글리스트 DTO 사용
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
		page = 1;
		setCon_dv(map);
		
		// DB에 들어갈 페이징 시작과 끝 숫자 계산
		map = startEndNum(map);
		
		logger.info(">>> 게시판 리스트 가져오기" + map.toString());
		
			
		// 검색되거나 전체 목록 게시물 리스트 불러오기
		List<HashMap<String, Object>> BoardList = dao.getBoardList(map); 
		
		// 검색된 총 페이지 개수 계산
		if (BoardList.size() != 0) { 
			totalCount = Integer.parseInt(String.valueOf(BoardList.get(0).get("TOTALCOUNT"))); 	
		}
		
		// view단에 나타나는 페이지 계산
		map = pageStartEnd(map, totalCount);
			
		//페이징단 이전,다음 페이징 묶음으로 이동값
		prev = startPage == 1 ? false : true;
		next = endPage * perPageNum >= totalCount ? false : true;
		
		
		map.put("prev", prev);
		map.put("next", next);
		map.put("BoardList", BoardList);
		map.put("SearchAndPagingData", map);
		
		 	
		return map;	
	}
	
	// DB에 들어갈 페이징 시작과 끝 숫자 계산 (한페이지에 보여줄 리스트 번호 시작 ,끝)
	private HashMap<String, Object> startEndNum(HashMap<String, Object> map) {
		if (map.get("page") != null) {
			this.page = Integer.valueOf((String) map.get("page"));
		}
		
		rowStart = ((page - 1) * perPageNum) + 1;
		rowEnd = ((page - 1) * perPageNum) + perPageNum;
				
		map.put("rowStart", rowStart);
		map.put("rowEnd", rowEnd);
		
		return map;
	}

	// view단에 나타나는 페이지 계산(한번에 보여줄 페이징버튼 시작과 끝)
	private HashMap<String, Object> pageStartEnd(HashMap<String, Object> map, int totalCount) {
		endPage = (int) Math.ceil(page / (double) displayPageNum) * displayPageNum;
		startPage = ((int) Math.ceil(page / (double) displayPageNum) * displayPageNum )- displayPageNum + 1;	
		
		//리스트 값이 없어도 생성될 페이지 제거
		int tempEndPage = (int) (Math.ceil(totalCount / (double) perPageNum));
		if (endPage > tempEndPage) { 
			endPage = tempEndPage;
		}
		
		map.put("startPage", startPage);
		map.put("endPage", endPage);
		
		return map;
	}


	/*public HashMap<String, Object> pageMaker(HashMap<String, Object> map) {
		int listcount= 5;	//페이지 리스트수
		int pageper = 3;	//한번에 보여줄 페이지 갯수
		int page = 1 ;		//첫페이지
		
		map.put("listcount",listcount);
		map.put("pageper", pageper);
		map.put("now_page", page);

		firstEndNum(map);
		return map;
	}
	
	//페이지 글시작 및 끝번호
	public HashMap<String, Object> firstEndNum(HashMap<String, Object> map) {
		
		int firstnum = (Integer) map.get("listcount")* (Integer) map.get("now_page") - (Integer) map.get("listcount")+1;
		int endnum = (Integer) map.get("listcount") * (Integer) map.get("now_page");
		
		map.put("firstnum",firstnum);
		map.put("endnum", endnum);
		
		firstEndPage(map);
		return map;
	}
	//페이지 한화면 시작 끝번호
	public HashMap<String,Object> firstEndPage(HashMap<String,Object> map){
		int firstpagenum = (int)Math.ceil((double)(Integer)map.get("now_page")/(Integer)map.get("pageper"));
		int endpagenum =(int)Math.ceil((double)(Integer)map.get("now_page")/(Integer)map.get("pageper"))*(Integer)map.get("pageper");
		map.put("firstpagenum", firstpagenum);
		map.put("endpagenum", endpagenum);
		return map;
	}*/
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
		
		String yourIP = getIPConfig(request);
		
		
		map.put("con_dv", "01");
		map.put("reg_ip", yourIP);
		logger.info(">>> 게시판 글쓰기 , 작성자 IP:"+yourIP);
		
		return dao.insertBoard(map);
	}
	//작성자 IP주소 가져오기
	public String getIPConfig(HttpServletRequest request) {
		String ip = request.getHeader("X-FORWARDED-FOR");
		if (ip == null) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_Client_IP:"+ip);
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR:"+ip);
		}
		if (ip == null) {
			ip = request.getRemoteAddr();
		}
		
		logger.info(" IP : " + ip);
		return ip;
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
	@Override
	public HashMap<String, Object> wsgetBoardList(HashMap<String, Object> board) {
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