package com.inswave.wrm.sample.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.inswave.wrm.sample.service.TemplateService;
import com.inswave.wrm.util.Result;
import com.inswave.wrm.util.UserInfo;

@Controller
public class TemplateController {

	@Autowired
	private UserInfo userInfo; // 로그인된 사용자의 정보를 사용하기 위한 객체

	@Resource(name = "templateService")
	private TemplateService tmplateService;

	@RequestMapping("/temp/getMemberInfo")
	public @ResponseBody Map<String, Object> getMemberInfo(@RequestBody Map<String, Object> param) throws Exception {
		String empCd = null;
		Map memMap = null;
		List favList = null;
		Result result = new Result();

		try {
			empCd = userInfo.getUserId(); // 로그인 된 사용자 코드를 가져온다.
			param.put("EMP_CD", empCd);

			// 단건
			memMap = tmplateService.selectMemberInfoForTemplate(param);
			// 다건
			favList = tmplateService.selectMemberFavoriteForTemplate(param);

			result.setData("dma_userInfo", memMap);
			result.setData("dlt_favorite", favList);

			result.setStatusMsg(result.STATUS_SUCESS, "정상 처리 되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "처리 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
}
