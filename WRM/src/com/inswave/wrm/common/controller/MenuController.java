package com.inswave.wrm.common.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.common.service.MenuService;
import com.inswave.wrm.util.Result;

@Controller
public class MenuController {

	@Autowired
	private MenuService menuService;

	/**
	 * searchMenu - 조회조건에 따른 메뉴관리 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_search { TYPE:"메뉴명 또는 메뉴코드 또는 부모메뉴명 또는 메뉴레벨", CONTENTS:"검색어", IS_USE:"사용여부" }
	 * @returns mv dlt_menu ( 메뉴관리 리스트 ) author InswaveSystems
	 * @example
	 */
	@RequestMapping("/menu/searchMenu")
	public @ResponseBody Map<String, Object> searchMenu(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_menu", menuService.selectMenu((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "메뉴 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "메뉴 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * saveMenu - 메뉴관리 리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_menu ( 메뉴관리 상태인( C,U,D ) 리스트 ), dma_search { TYPE:"메뉴명 또는 메뉴코드 또는 부모메뉴명 또는 메뉴레벨", CONTENTS:"검색어" }
	 * @returns mv dlt_result ( 입력,수정,삭제된 건수 및 상태 ), dlt_menu ( 메뉴관리 리스트 ) author InswaveSystems
	 * @example
	 */
	@RequestMapping("/menu/saveMenu")
	public @ResponseBody Map<String, Object> saveMenu(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = menuService.saveMenu((List) param.get("dlt_menu"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "메뉴관리 정보가 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : "
					+ (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "메뉴관리 정보 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
}
