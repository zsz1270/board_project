package com.joynbiz.board.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.inswave.wrm.util.Result;

@RequestMapping("/websViews")

@Controller
public class webSquareBoardController {
	
	@Autowired
	private com.joynbiz.board.service.noticeService ns;
	private com.joynbiz.board.service.webSquarePageService ws;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	//공지사항 루트페이지(redirect로 바로 리스트페이지 띄움)
	@RequestMapping("/")
	public ModelAndView root() {
		ModelAndView mv = new ModelAndView();
		logger.info("ws >>> /");
		mv.setViewName("redirect:/websViews/wsBoardList.do");
		return mv;
	}
	/* 게시물 리스트 및 검색 화면
	 * 리스트 출력용 boardList
	 * 검색및 페이징용 SearchAndPagingData
	 */
	//리스트
	@RequestMapping(value = "/wsBoardList.do", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> wsBoardList(@RequestBody HashMap<String, Object> param) {
		param = (HashMap<String, Object>) param.get("searchParam");
		 Map result = new HashMap<String, Object>();
		 logger.info(">>> wsboardList.do");
		 
		 param = ns.getBoardList(param);
		 
		 result.put("BoardList", param.get("BoardList"));
		 
		 return result;
	}
	//상세글
	@RequestMapping(value = "/wsdetailContent.do", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> wsdetailContent(@RequestBody HashMap<String, Object> param)  {
		param = (HashMap<String, Object>) param.get("detailno");
		 Map result = new HashMap<String, Object>();
		 logger.info(param.toString());
		 logger.info(">>> wsdetailContent.do");
		 
		 param = ns.detailContents(param);
		 
		 result.put("detailcon", param);
		 
		 return result;
		
	}
	//글작성
	@RequestMapping(value = "/wswrite.do", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> wswrite(HttpServletRequest request,@RequestBody HashMap<String, Object> param) {
		param = (HashMap<String , Object>) param.get("new_content");
		
		Map result = new HashMap<String,Object>();		
		
		
		logger.info(param.toString());
		logger.info(">>> wswrite.do");
		
		
		ns.writeBoard(request,param);
		
		return result;
	}
	
	//개인정보확인
	@RequestMapping(value = "/wscheckIdentify.do")
	public @ResponseBody Map<String, Object> wscheckIdentify(@RequestBody HashMap<String, Object> param) {
		
		param = (HashMap<String, Object>) param.get("identiInfo");
		boolean isCheckedUser = ns.checkIdentify(param);
		

		
		Map result = new HashMap();
		param.put("result", isCheckedUser);

		result.put("identifyCheck", param);
		
		return result;
	}
	
	//삭제
	@PostMapping("/delete.do")
	public @ResponseBody Map<String, Object> delete(@RequestBody HashMap<String, Object> param) {
		param = (HashMap<String, Object>) param.get("delcon");
		
		int del_result = ns.deleteContent(param);
		
		
		Map result = new HashMap();
		
		param.put("result", del_result);
		result.put("delResult", param);
		
		return result;
	}
	@PostMapping(value ="/editcon.do")
	public @ResponseBody Map<String, Object> editcon(@RequestBody HashMap<String, Object> param) {
		param = (HashMap<String, Object>) param.get("con_no_map");
		 Map result = new HashMap<String, Object>();
		 logger.info(param.toString());
		 logger.info(">>> wseditcon.do");
		 
		 param = ns.detailContents(param);
		 
		 result.put("con_data", param);
		 
		 return result;
		
	}
	//수정
	@PostMapping("/edit.do")
	public @ResponseBody Map<String, Object> edit(@RequestBody HashMap<String, Object> param) {
		
		param = (HashMap<String, Object>) param.get("edit_con_data");
		
		System.out.println(param.toString());
		int edit_result = ns.editContent(param);
		
		Map result = new HashMap();
		
		param.put("result", edit_result);
		result.put("edit_result", param);

		return result;
	}
}