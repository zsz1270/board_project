package com.joynbiz.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class FirstPageController {
	
	/*
	 * 시스템 메인화면 메뉴를 이용해 각 세부페이지로 이동
	 */
	@GetMapping("/board")
	public ModelAndView root() {
		ModelAndView mv = new ModelAndView(); 
		mv.setViewName("/Home");
		return mv;
	}
}