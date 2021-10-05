package com.java_test.mytest.notice.controller;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.java_test.mytest.notice.noticevo.SearchDTO;
import com.java_test.mytest.notice.noticevo.SearchpagingDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;
import com.java_test.mytest.notice.noticevo.pageMakerDTO;
import com.java_test.mytest.notice.noticevo.pagingDTO;
import com.java_test.mytest.notice.service.noticeService;

@RequestMapping("/noticeViews")
@Controller
public class noticeController {
	
	@Autowired
	private noticeService ns;
	
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	//공지사항 루트페이지(redirect로 바로 리스트페이지 띄움)
	@GetMapping("/")
	public ModelAndView root() {
		ModelAndView mv = new ModelAndView(); 
		logger.info(">>> /");
		mv.setViewName("redirect:/noticeViews/boardList.do");
		return mv;
	}
	/*게시물 리스트 및 검색 화면
	 * 리스트 출력용 boardList
	 * 검색및 페이징용 SearchAndPagingData
	 */
	@GetMapping("/boardList.do")
	public ModelAndView boardList(@RequestParam HashMap<String, Object> map) {
		
		map= ns.getBoardList(map);
		ModelAndView mv = new ModelAndView();
		
		logger.info(">>> detailContent.do");
		
		mv.setViewName("/noticeViews/boardList");
		mv.addObject("boardList",map.get("BoardList"));
		mv.addObject("SearchAndPagingData", map.get("SearchAndPagingData"));
		return mv;
	}
	/*@GetMapping("/boardList.do")
	public ModelAndView boardList(@RequestParam HashMap<String,Object>map , SearchpagingDTO spto) {
		ModelAndView mv = new ModelAndView();
		map = ns.getBoardList(spto);
		
		mv.setViewName("/noticeViews/boardList");		
		
		mv.addObject("boardList", map.get("BoardList"));
		mv.addObject("pageMaker", map.get("pageMaker"));
		mv.addObject("searchData", map.get("searchData"));
		
		return mv;
		
	}*/
	/*게시물 리스트 및 검색 화면  LIST만 HASHMAP 적용
	@GetMapping("/boardList.do")
	public ModelAndView boardList(SearchpagingDTO scto) {
		
		pageMakerDTO pageMaker = new pageMakerDTO();
		pageMaker.setPto(scto);
		pageMaker.setTotalCount(ns.countBoardList(scto));
		
		List<HashMap<String, Object>> BoardList = ns.getBoardList(scto);	
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("/noticeViews/boardList");
		mv.addObject("boardList", BoardList);
		mv.addObject("pageMaker", pageMaker);
		
		logger.info(">>> list.do"+BoardList.toString());
		
		return mv;
	}*/
	
	/* 게시물 리스트 및 검색 화면DTO
	@GetMapping("/boardList.do")
	public ModelAndView boardList(SearchpagingDTO scto) {
		
		pageMakerDTO pageMaker = new pageMakerDTO();
		pageMaker.setPto(scto);
		pageMaker.setTotalCount(ns.countBoardList(scto));
		
		List<noticeVO> BoardList = ns.getBoardList(scto);	
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("/noticeViews/boardList");
		mv.addObject("boardList", BoardList);
		mv.addObject("pageMaker", pageMaker);
		
		logger.info(">>> list.do");
		
		return mv;
	}*/
	
	// 게시물 상세화면
	@PostMapping("/detailContent.do")
	public ModelAndView detailContent(@RequestParam HashMap<String,Object>map)  {
		
		HashMap<String,Object> detailContents= ns.detailContents(map);
		ModelAndView mv = new ModelAndView();
		logger.info(">>> detailContent.do");
		mv.setViewName("/noticeViews/detailContent");
		mv.addObject("detailContents",detailContents);
		return mv;
	}
	 
	/* 게시물 상세리스트 DTO
	 * @PostMapping("/detailContent.do")
	public ModelAndView detailContent(noticeVO nvo)  {
		noticeVO detailcon = ns.detailContents(nvo);
		ModelAndView mv = new ModelAndView();
		logger.info(">>> detailContent.do");
		mv.setViewName("/noticeViews/detailContent");
		mv.addObject("detailcon",detailcon);
		return mv;
	}*/
	
	//게시물 작성 ,수정 화면
	@PostMapping("/editContent.do")
	public ModelAndView editContent(@RequestParam HashMap<String,Object>map) {
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("/noticeViews/editContent");
		mv.addObject("boardInfo", map);
		logger.info(">>> editContent.do" + map.toString());
		
		return mv;
	}
	/*게시물 작성 ,수정 화면 dto사용
	 * @PostMapping("/editContent.do")
	public ModelAndView editContent(noticeVO nvo) throws Exception {
		ModelAndView mv = new ModelAndView(); 
		logger.info(">>> editContent.do");
		mv.setViewName("/noticeViews/editContent");
		mv.addObject("boardInfo",nvo);
		return mv;
	}*/
	
	//본인 인증 화면
	@PostMapping("/identification.do")
	public ModelAndView identification(@RequestParam HashMap<String, Object> map) {
		
		ModelAndView mv = new ModelAndView();
				
		mv.setViewName("/noticeViews/identification");
		mv.addObject("boardInfo", map);
		logger.info(">>> identification.do" + map.toString());
		
		return mv;
	}
	
	/*본인 인증 화면 DTO
		@PostMapping("/identification.do")
		public ModelAndView identification(noticeVO nvo) {
			ModelAndView mv = new ModelAndView(); 
			mv.setViewName("/noticeViews/identification");
			mv.addObject("boardInfo",nvo);
			return mv;
		}*/
	
	// 본인 인증 처리
	// key = 2 수정, 3 삭제
	@PostMapping("/checkIdentify.do")
	public ModelAndView checkIdentify(@RequestParam HashMap<String, Object> map) { 
		
		ModelAndView mv = new ModelAndView();
		boolean isCheckedUser = ns.checkIdentify(map);
		
		mv.setViewName("/noticeViews/identification");
		mv.addObject("flag", isCheckedUser); // 본인 인증 확인 성공 실패 여부 True or False
		mv.addObject("key", map.get("key")); // 수정인지 삭제 인증 요청이었는지 판단
		mv.addObject("boardInfo", map);			
		logger.info(">>> checkIdentify.do 본인인증 처리 결과 : " + isCheckedUser + " " + map.get("key"));
		
		return mv;
	}
		
	/* 본인 인증 처리 DTO
		@PostMapping("/checkIdentify.do")
		public ModelAndView checkIdentify(noticeVO nvo) { // key = 2 수정, 3 삭제
			
			ModelAndView mv = new ModelAndView();
			
			mv.setViewName("/noticeViews/identification");
			mv.addObject("flag", ns.checkIdentify(nvo)); // 본인 인증 확인 성공 실패 여부 True or False
			mv.addObject("key", nvo.getKey()); // 수정인지 삭제 인증 요청이었는지 판단
			mv.addObject("boardInfo", nvo);			
			logger.info(">>> checkIdentify.do 본인인증 처리 결과 : " + ns.checkIdentify(nvo) + " " + nvo.getKey());
			
			return mv;
		}*/
	
	// 새 게시물 작성
	@PostMapping("/write.do")
	public ModelAndView write(HttpServletRequest request, @RequestParam HashMap<String, Object> map) {
					
		ModelAndView mv = new ModelAndView();		
		ns.writeBoard(request, map);
			
		mv.setViewName("redirect:/noticeViews/");
						
		return mv;
	}
	
	/* 새 게시물작성 DTO
		@PostMapping("/write.do")
		public ModelAndView write(HttpServletRequest request, noticeVO nvo) {
						
			ModelAndView mv = new ModelAndView();
			logger.info(">>> write.do" + nvo.toString());
			ns.writeBoard(request, nvo);
			mv.setViewName("redirect:/noticeViews/");
				
						
			return mv;
		}*/
	
	// 게시물 삭제
		@PostMapping("/delete.do")
		public ModelAndView delete(@RequestParam HashMap<String, Object> map) {
			
			ModelAndView mv = new ModelAndView();		
			ns.deleteContent(map);
			
			mv.setViewName("redirect:/noticeViews/");
			logger.info(">>> delete.do");
			
			return mv;
		}
	
	/* 게시물 삭제 DTO
		@PostMapping("/delete.do")
		public ModelAndView delete(noticeVO nvo) {
					
			ModelAndView mv = new ModelAndView();		
			ns.deleteContent(nvo);
					
			mv.setViewName("redirect:/noticeViews/");
			logger.info(">>> delete.do");
					
			return mv;
		}*/
	
	// 게시물 수정
	@PostMapping("/edit.do")
	public ModelAndView edit(@RequestParam HashMap<String, Object> map) {
			
		ModelAndView mv = new ModelAndView();
		ns.editContent(map);
			
		mv.setViewName("redirect:/noticeViews/");
		logger.info(">>> edit.do" + map.toString());
			
		return mv;
	}
		
	/*게시물 수정 DTO
		@PostMapping("/edit.do")
		public ModelAndView edit(noticeVO nvo) {
			
			ModelAndView mv = new ModelAndView();
			logger.info(">>> edit.do" + nvo.toString());
			
			ns.editContent(nvo);
			
			mv.setViewName("redirect:/noticeViews/");
			return mv;
		}*/
	
}
