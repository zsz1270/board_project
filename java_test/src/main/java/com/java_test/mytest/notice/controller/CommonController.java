package com.java_test.mytest.notice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class CommonController {
	
	@GetMapping("/")
	public ModelAndView root() {
		ModelAndView mv = new ModelAndView(); 
		mv.setViewName("/Home");
		return mv;
	}
}