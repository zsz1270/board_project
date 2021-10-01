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
	private int page = 1;
	private int perPageNum = 5;
	private int displayPageNum = 3;
	private int startPage;
	private int endPage;
	private int rowStart;
	private int rowEnd;
	private boolean prev;
	private boolean next;
	private int totalCount = 0;
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public HashMap<String, Object> setCon_dv(HashMap<String, Object> map) { // 게시판 구분자 지정 메소드
		map.put("con_dv", "01");
		logger.info(">>> 게시판 구분자 HashMap 01 : 설정");
		
		return map;
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
		setCon_dv(map);
		
		// DB에 들어갈 페이징 시작과 끝 숫자 계산
		map = calRowStartEnd(map);
		
		logger.info(">>> 게시판 리스트 가져오기" + map.toString());
		
		
		
		// 검색되거나 전체 목록 게시물 리스트 불러오기
		List<HashMap<String, Object>> BoardList = dao.getBoardList(map); 
		
		if (BoardList.size() != 0) { // 검색된 총 페이지 개수 계산
			totalCount = Integer.parseInt(String.valueOf(BoardList.get(0).get("TOTALCOUNT"))); 	
		}
		
		// view단에 나타나는 페이지 계산
		map = calPageStartEnd(map, totalCount);
			
		prev = startPage == 1 ? false : true;
		next = endPage * perPageNum >= totalCount ? false : true;
		
		
		map.put("prev", prev);
		map.put("next", next);
		map.put("BoardList", BoardList);
		map.put("SearchAndPagingData", map);
		
		 	
		return map;	
	}
	
	private HashMap<String, Object> calRowStartEnd(HashMap<String, Object> map) {
		if (map.get("page") != null) {
			this.page = Integer.valueOf((String) map.get("page"));
		}

		rowStart = ((page - 1) * perPageNum) + 1;
		rowEnd = rowStart + perPageNum -1;
				
		map.put("rowStart", rowStart);
		map.put("rowEnd", rowEnd);
		
		return map;
	}


	private HashMap<String, Object> calPageStartEnd(HashMap<String, Object> map, int totalCount) {
		endPage = (int) Math.ceil(page / (double) displayPageNum) * displayPageNum;
		startPage = (endPage - displayPageNum) + 1;	
		
		int tempEndPage = (int) (Math.ceil(totalCount / (double) perPageNum));
		if (endPage > tempEndPage) { // 끝 페이지가 필요한 총 페이지보다 크게되면 그 뒤 페이지들은 필요없어 제거하는 If문
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