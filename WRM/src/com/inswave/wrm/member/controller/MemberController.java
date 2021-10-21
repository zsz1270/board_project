package com.inswave.wrm.member.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.member.service.MemberService;
import com.inswave.wrm.util.FileUtil;
import com.inswave.wrm.util.Result;

import websquare.WebSquareConfig;

@Controller
public class MemberController {
	
	@Autowired
	private MemberService service;

	/**
	 * searchMemberBasicOrganization - 조회조건에 따른 인사기본관리 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @returns mv dlt_memberOrganization ( 인사관리 소속 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/member/searchMemberBasicOrganization")
	public @ResponseBody Map<String, Object> searchMemberBasicOrganization() {
		Result result = new Result();
		try {
			result.setData("dlt_memberOrganization", service.selectMemberBasicOrganization());
			result.setStatusMsg(result.STATUS_SUCESS, "인사기본 소속 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "인사기본 소속 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * selectMemberSearchItem - 인사기본관리 아이템 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} 없음
	 * @returns mv dlt_memberSearchItem ( 인사기본관리 아이템 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/member/selectMemberSearchItem")
	public @ResponseBody Map<String, Object> selectMemberSearchItem() {
		Result result = new Result();
		try {
			result.setData("dlt_memberSearchItem", service.selectMemberSearchItem());
			result.setStatusMsg(result.STATUS_SUCESS, "인사기본관리 아이템 리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "인사기본관리 아이템 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * searchMemberBasic - 조회조건에 따른 인사기본관리 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_search { TYPE:"사원명 또는 사원코드 또는 직위 또는 소속", CONTENTS:"검색어", IS_USE:"사용여부" }
	 * @returns mv dlt_memberBasic ( 인사기본관리 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/member/searchMemberBasic")
	public @ResponseBody Map<String, Object> searchMemberBasic(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_memberBasic", service.selectMemberBasic((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "인사기본관리 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "인사기본관리 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * updateMemberBasic - 인사관리 리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_memberBasic ( 인사기본관리 상태인( C,U,D ) 리스트 )
	 * @returns mv dlt_result ( 입력,수정,삭제된 건수 및 상태 ), dlt_memberBasic ( 인사기본관리 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/member/updateMemberBasic")
	public @ResponseBody Map<String, Object> updateMemberBasic(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		System.out.println("등록");
		System.out.println(param);
		try {
			Map hash = service.saveMemberBasicList((List) param.get("dlt_memberBasic"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "인사기본관리 정보가 저장 되었습니다.", 
					"입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : " + (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "인사기본관리 정보 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	/**
	 * 개인 기본 데이터를 조회한다.
	 * 
	 * @param param 클라이언트에서 전달한 데이터 맵 객체
	 * @return
	 */
	@RequestMapping(value = "/member/selectMemberOragn")
	public @ResponseBody Map<String, Object> selectMemberOragn(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("data", service.selectMemberOragn((Map) param.get("dma_memberBasic")));
			result.setStatusMsg(result.STATUS_SUCESS, "개인 기본 데이터가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "개인 기본 데이터 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * 가족정보 데이터를 조회한다.
	 * 
	 * @param param 클라이언트에서 전달한 데이터 맵 객체
	 * @return
	 */
	@RequestMapping(value = "/member/selectMemberFamily")
	public @ResponseBody Map<String, Object> selectMemberFamily(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		System.out.println(param);
		try {
			result.setData("data", service.selectMemberFamilyList((Map) param.get("dma_memberBasic")));
			result.setStatusMsg(result.STATUS_SUCESS, "개인 기본 데이터가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "개인 기본 데이터 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * 프로젝트 데이터를 조회한다.
	 * 
	 * @param param 클라이언트에서 전달한 데이터 맵 객체
	 * @return
	 */
	@RequestMapping(value = "/member/selectMemberProject")
	public @ResponseBody Map<String, Object> selectMemberProject(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		System.out.println(param);
		try {
			result.setData("data", service.selectMemberProjectList((Map) param.get("dma_memberBasic")));
			result.setStatusMsg(result.STATUS_SUCESS, "개인 기본 데이터가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "개인 기본 데이터 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	@RequestMapping(value = "/member/saveMemberInfo")
	public @ResponseBody Map<String, Object> saveMemberInfo(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		Map hash = new HashMap();
		try {
			hash.put("basic", service.saveMemberBasic((Map) param.get("basic")));
			result.setData("data", hash);
			result.setStatusMsg(result.STATUS_SUCESS, "개인 기본 데이터가 수정되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "개인 기본 데이터 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	@RequestMapping(value = "/member/saveMemberProject")
	public @ResponseBody Map<String, Object> saveMemberProject(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		Map hash = new HashMap();
		try {
			hash.put("project", service.saveMemberProject((List) param.get("project")));
			result.setData("data", hash);
			result.setStatusMsg(result.STATUS_SUCESS, "프로젝트 정보 데이터가 수정되었습니다..");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "프로젝트 정보 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	@RequestMapping(value = "/member/saveMemberFamily")
	public @ResponseBody Map<String, Object> saveMemberFamily(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		Map hash = new HashMap();
		try {
			hash.put("family", service.saveMemberFamily((List) param.get("family")));
			result.setData("data", hash);
			result.setStatusMsg(result.STATUS_SUCESS, "가족 정보 데이터가 수정되었습니다..");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "가족 데이터 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * 우편번호 데이터를 조회한다.
	 * 
	 * @param param 클라이언트에서 전달한 데이터 맵 객체
	 * @return
	 */
	@RequestMapping(value = "/member/selectZipCodeList")
	public @ResponseBody Map<String, Object> selectZipCodeList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("data", service.selectZipCodeList((Map) param.get("param")));
			result.setStatusMsg(result.STATUS_SUCESS, "우편번호 데이터를 조회하였습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "우편번호 데이터 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	// 파일 다운로드
	@RequestMapping(value = "/member/viewProfileImage/{empCd}", method = RequestMethod.GET)
	public void downloadFile(HttpServletResponse response, HttpServletRequest request,
			@PathVariable("empCd") String empCd) throws IOException {

		Map<String, Object> param = new HashMap<String, Object>();
		param.put("EMP_CD", empCd);
		List<Map> fileList = service.selectMemberBasic(param);

		try {
			if (fileList.size() > 0) {
				Map<String, Object> fileInfo = (Map) fileList.get(0);
				String orignalFileName = (String) fileInfo.get("ORIGIN_FILE_NM");
				String upladBaseDir = WebSquareConfig.getInstance().getUpladBaseDir();
				String storedFilePath = upladBaseDir + File.separator + (String) fileInfo.get("FILE_STORED_PATH") 
						+ File.separator + fileInfo.get("STORED_FILE_NM");
				FileUtil.downloadFile(response, request, orignalFileName, storedFilePath);
			} else {
				throw new FileNotFoundException();
			}
		} catch (Exception ex) {
			String contextRootPath = request.getSession().getServletContext().getRealPath("/");
			try {
				FileUtil.downloadFile(response, request, "img_person.png", contextRootPath + service.getImgEmptyProfilePath());
			} catch (Exception ex1) {
				ex1.printStackTrace();
			}
		}
	}
}
