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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.java_test.mytest.notice.noticevo.SearchDTO;
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
	
	@GetMapping("/")
	public ModelAndView root() {
		ModelAndView mv = new ModelAndView(); 
		logger.info(">>> /");
		mv.setViewName("redirect:/noticeViews/boardList.do");
		return mv;
	}
	
	@GetMapping("/boardList.do")
	public ModelAndView boardList(SearchDTO sto ,noticeVO nvo ,pagingDTO pto, HashMap<String, Object> map) {
		
		map.put("nvo", nvo);
		map.put("pto", pto);
		
		pageMakerDTO pageMaker = new pageMakerDTO();
		pageMaker.setPto(pto);
		pageMaker.setTotalCount(ns.countBoardList(sto));
		
		List<noticeVO> BoardList = ns.getBoardList(map);	
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("/noticeViews/boardList");
		mv.addObject("getlist", BoardList);
		mv.addObject("pageMaker", pageMaker);
		logger.info(">>> list.do");
		return mv;
	}
	@PostMapping("/search.do")
	public ModelAndView search(SearchDTO sto,pagingDTO pto, HashMap<String, Object> map) {
		map.put("search", sto);
		map.put("pto", pto);
		
		List<noticeVO> SearchedBoardList = ns.getSearchedBoardList(map);	
		ModelAndView mv = new ModelAndView();
		
		pageMakerDTO pageMaker = new pageMakerDTO();
		pageMaker.setPto(pto);
		pageMaker.setTotalCount(ns.countBoardList(sto));
		
		if (sto.getKeyword() == "") {
			mv.setViewName("redirect:/noticeViews/list.do");		
			logger.info(">>> search.do >> redirect:list.do");

		} else {
			mv.setViewName("/noticeViews/boardList");	
			mv.addObject("getlist", SearchedBoardList);
			mv.addObject("pageMaker", pageMaker);
			logger.info(">>> search.do " + sto.toString());
			
		}
		
		return mv;
		
	}
	
	@PostMapping("/detailContent.do")
	public ModelAndView detailContent(noticeVO nvo)  {
		noticeVO detailcon = ns.detailContents(nvo);
		ModelAndView mv = new ModelAndView(); 
		logger.info(">>> detailContent.do");
		mv.setViewName("/noticeViews/detailContent");
		mv.addObject("detailcon",detailcon);
		return mv;
	}
	
	@PostMapping("/editContent.do")
	public ModelAndView editContent(noticeVO nvo) throws Exception {
		ModelAndView mv = new ModelAndView(); 
		logger.info(">>> editContent.do");
		mv.setViewName("/noticeViews/editContent");
		mv.addObject("boardInfo",nvo);
		return mv;
	}
	
	@PostMapping("/identification.do")
	public ModelAndView identification(noticeVO nvo) {
		ModelAndView mv = new ModelAndView(); 
		mv.setViewName("/noticeViews/identification");
		mv.addObject("boardInfo",nvo);
		return mv;
	}
	// 본인 인증 처리 단계
		@PostMapping("/checkIdentify.do")
		public ModelAndView checkIdentify(noticeVO nvo) { // key = 2 수정, 3 삭제
			
			ModelAndView mv = new ModelAndView();
			
			mv.setViewName("/noticeViews/identification");
			mv.addObject("flag", ns.checkIdentify(nvo)); // 본인 인증 확인 성공 실패 여부 True or False
			mv.addObject("key", nvo.getKey()); // 수정인지 삭제 인증 요청이었는지 판단
			mv.addObject("boardInfo", nvo);			
			logger.info(">>> checkIdentify.do 본인인증 처리 결과 : " + ns.checkIdentify(nvo) + " " + nvo.getKey());
			
			return mv;
		}
	
	@PostMapping("/write.do")
	public ModelAndView write(HttpServletRequest request, noticeVO nvo) {
				
		ModelAndView mv = new ModelAndView();
		logger.info(">>> write.do" + nvo.toString());
		ns.writeBoard(request, nvo);
		mv.setViewName("redirect:/noticeViews/");
		
				
		return mv;
	}
	
	@PostMapping("/delete.do")
	public ModelAndView delete(noticeVO nvo) {
				
		ModelAndView mv = new ModelAndView();		
		ns.deleteContent(nvo);
				
		mv.setViewName("redirect:/noticeViews/");
		logger.info(">>> delete.do");
				
		return mv;
	}
	
	@PostMapping("/edit.do")
	public ModelAndView edit(noticeVO nvo) {
		
		ModelAndView mv = new ModelAndView();
		logger.info(">>> edit.do" + nvo.toString());
		
		ns.editContent(nvo);
		
		mv.setViewName("redirect:/noticeViews/");
		return mv;
	}
	
}
