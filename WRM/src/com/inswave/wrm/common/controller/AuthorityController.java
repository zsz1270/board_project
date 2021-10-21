package com.inswave.wrm.common.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.common.service.AuthorityService;
import com.inswave.wrm.util.Result;

@Controller
public class AuthorityController {

	@Autowired
	private AuthorityService authorityService;

	/**
	 * selectAuthoritySearchItem - 권한 아이템 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} 없음
	 * @returns mv dlt_authroitySearchItem ( 권한 아이템 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/selectAuthoritySearchItem")
	public @ResponseBody Map<String, Object> selectAuthoritySearchItem() {
		Result result = new Result();
		try {
			result.setData("dlt_authoritySearchItem", authorityService.selectAuthoritySearchItem());
			result.setStatusMsg(result.STATUS_SUCESS, "권한 아이템 리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "권한 아이템 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * selectAuthorityList - 조건에 따라 권한 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_search { TYPE :"권한명 또는 권한 코드", CONTENTS :"검색어", IS_USE :"사용여부" }
	 * @returns mv dlt_authroity ( 권한 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/selectAuthorityList")
	public @ResponseBody Map<String, Object> selectAuthorityList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_authority", authorityService.selectAuthorityList((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "권한 리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "권한 리스트를 가져오는 도중 오류가 발생하였습니다,");
		}
		return result.getResult();
	}

	/**
	 * selectAuthorityMemberList - 조건에 따라 권한이 부여된 사용자 리스트를 불러온다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_authority { AUTHORITY_CD :"권한 코드" }
	 * @returns mv dlt_authroityMember ( 권한이 부여된 사용자 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/selectAuthorityMemberList")
	public @ResponseBody Map<String, Object> selectAuthorityMemberList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_authorityMember", authorityService.selectAuthorityMemberList((Map) param.get("dma_authority")));
			result.setStatusMsg(result.STATUS_SUCESS, "권한(" + (String) ((Map) param.get("dma_authority")).get("AUTHORITY_CD") + ")이 부여된 사용자 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "권한이 부여된 사용자 정보를 가져오는 도중 오류가 발생하였습니다,");
		}
		return result.getResult();
	}

	/**
	 * excludeSelectAuthorityMemberList - 권한이 부여되지 않은 직원리스트를 검색조건에 따라 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_search { TYPE :"사원코드  또는 사원명", CONTENTS :"검색어", AUTHORITY_CD :"권한코드" }
	 * @returns mv dlt_member ( 권한이 부여되지 않은 직원 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/excludeSelectAuthorityMemberList")
	public @ResponseBody Map<String, Object> excludeSelectAuthorityMemberList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_member", authorityService.excludeSelectAuthorityMemberList((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "권한이 부여되지 않은 직원 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "권한이 부여되지 않은 직원 리스트 조회중 오류가 발생하였습니다,");
		}
		return result.getResult();
	}

	/**
	 * saveAuthority - 권한리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_authority ( 권한관리 상태인( C,U,D ) 리스트 ), dma_search ( 조회조건 )
	 * @returns mv dlt_result ( 입력,수정,삭제된 건수 및 상태 ), dlt_authority( 변경된 권한리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/saveAuthority")
	public @ResponseBody Map<String, Object> saveAuthority(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = authorityService.saveAuthority((List) param.get("dlt_authority"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "권한이 저장 되었습니다. ", 
					"입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : " + (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "권한 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * saveAuthorityMember 권한별 등록사원 리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_authorityMember ( 권한관리 상태인( C,U,D ) 리스트 ), dma_search ( 조회조건 )
	 * @returns mv dlt_result ( 입력,수정,삭제된 건수 및 상태 ), dlt_authorityMember( 변경된 권한 사용자 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/saveAuthorityMember")
	public @ResponseBody Map<String, Object> saveAuthorityMember(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = authorityService.saveAuthorityMember((List) param.get("dlt_authorityMember"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "권한 사용자가 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : "
					+ (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "권한 사용자 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * saveAuthorityAll - 권한 및 권한별 사원정보를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_authority ( 상태인( C,U,D ) 권한 리스트 ), dlt_authorityMember ( 상태인( C,U,D ) 권한별 등록사원 리스트 )
	 * @returns mv dlt_result (입력,수정,삭제된 건수 및 상태)
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/authority/saveAuthorityAll")
	public @ResponseBody Map<String, Object> saveAuthorityAll(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = authorityService.saveAuthorityAll((List) param.get("dlt_authority"), (List) param.get("dlt_authorityMember"));

			result.setData("dma_result_All", hash);
			result.setMsg(result.STATUS_SUCESS,	"권한 및 권한별 사원정보 정보가 저장 되었습니다. ", 
					"입력 권한 건수: " + (String) hash.get("ICNT_AUTH") + "건  ::  입력 권한별사원 건수: " + (String) hash.get("ICNT_MEM")
					+ "건 :: 수정 권한 건수: " + (String) hash.get("UCNT_AUTH") + "건  ::  수정 권한별사원 건수: " + (String) hash.get("UCNT_MEM") + "건  ::  삭제 권한 건수: "
					+ (String) hash.get("DCNT_AUTH") + "건  ::  삭제 권한별사원 건수: " + (String) hash.get("DCNT_MEM") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "권한 및 권한별 사원정보 삭제도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
}
