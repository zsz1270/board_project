package com.inswave.wrm.sample.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.sample.beans.DataBean;
import com.inswave.wrm.sample.beans.RsMsgBean;
import com.inswave.wrm.sample.beans.ParamBean;
import com.inswave.wrm.sample.beans.TempBean;
import com.inswave.wrm.sample.beans.UserBean;
import com.inswave.wrm.sample.service.SampleService;
import com.inswave.wrm.sample.service.ZipCodeService;
import com.inswave.wrm.util.Result;
import com.inswave.wrm.util.UserInfo;

@Controller
public class SampleController {

	@Autowired
	private ZipCodeService zipCodeService;

	@Autowired
	private SampleService sampleService;

	@Autowired
	private UserInfo userInfo;

	/**
	 * 조회 조건에 따른 샘플 목록을 조회한다.
	 * 
	 * @date 2018.11.20
	 * @param {} dma_search { KEYWORD :"검색어", IS_USE:"사용여부" }
	 * @returns mv dlt_sample (샘플 목록) 
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/sample/searchSample")
	public @ResponseBody Map<String, Object> searchMenu(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_sample", sampleService.selectSample((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "샘플 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "샘플 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	/**
	 * 샘플 목록을 등록, 수정, 삭제 한다.
	 * 
	 * @date 2018.11.20
	 * @param {} dlt_sample (샘플 상태( C,U,D ) 목록), dma_search { KEYWORD :"검색어", IS_USE:"사용여부" }
	 * @returns mv dlt_result (입력,수정,삭제된 건수 및 상태), dlt_sample (샘플 목록) 
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/sample/updateSample")
	public @ResponseBody Map<String, Object> saveMenu(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = sampleService.saveSample((List) param.get("dlt_sample"));
			result.setData("dma_result", hash);
			result.setData("dlt_sample", sampleService.selectSample((Map) param.get("dma_search")));
			result.setMsg(result.STATUS_SUCESS, "샘플 정보가 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : "
					+ (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "샘플 정보 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	/**
	 * 기본 데이터 포맷
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 */
	@RequestMapping("/sample/selectLargeDataDefault")
	public @ResponseBody Map<String, Object> selectLargeDataDefault(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_zipCodeStreet", zipCodeService.selectZipCodeStreet((Map) param.get("dma_search")));
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "오류가 발생했습니다.");
		}

		return result.getResult();
	}

	/**
	 * 대량 데이터 테스트용 controller로 기본 ResultHandler사용.
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	@RequestMapping("/sample/selectLargeDataArray")
	public @ResponseBody Map<String, Object> selectLargeDataArray(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_zipCodeStreet", zipCodeService.selectZipCodeStreetByDefaultResultHandler((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "정상적으로 조회가 완료되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "오류가 발생했습니다.");
		}
		return result.getResult();
	}

	/**
	 * SP_ZIP_CODE_STREET 테이블의 STREET컬럼으로 조회하는 기능을 한다.
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 */
	@RequestMapping("/sample/selectZipCodeStreetListByStreet")
	public @ResponseBody Map<String, Object> selectStringLargeData(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			String idx = (String) ((Map) param.get("dma_search")).get("START_IDX");
			int offset = Integer.parseInt(idx) - 1;
			Map searchMap = (Map) param.get("dma_search");
			searchMap.put("OFFSET_ROW", offset);
			searchMap.put("ROW_CNT", 100);

			result.setData("dlt_zipCode", zipCodeService.selectZipCodeStreetByStreet(searchMap));
			if (idx.equals("1")) {
				result.setData("dlt_zipCode_count", String.valueOf(zipCodeService.selectZipCodeStreetByStreetTotalCnt((Map) param.get("dma_search"))));
			}
			result.setData("dma_search_excel", (Map) param.get("dma_search"));
			result.setStatusMsg(result.STATUS_SUCESS, "정상적으로 조회가 완료되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "오류가 발생했습니다.");
		}
		return result.getResult();
	}

	@RequestMapping("/sample/exception")
	public @ResponseBody Map<String, Object> sampleException() {
		Result result = new Result();
		String empCd = null;
		try {
			empCd = empCd.substring(0, 10); // null point exception
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "처리 도중 오류가 발생하였습니다.");
			ex.printStackTrace();
		}
		return result.getResult();
	}

	@RequestMapping("/sample/normal")
	public @ResponseBody Map<String, Object> sampleNormal() {
		String empCd = null;
		Result result = new Result();
		try {
			result.setData("userNm", userInfo.getUserName());
			result.setStatusMsg(result.STATUS_SUCESS, "사용자명이 정상 조회되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "처리 도중 오류가 발생하였습니다.");
			ex.printStackTrace();
		}
		return result.getResult();
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 조회
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 */
	@RequestMapping("/sample/tempSelect")
	public @ResponseBody Map<String, Object> sampleTempSelect(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map searchMap = (Map) param.get("dma_search");
			List tempList = sampleService.select(searchMap);

			result.setData("dlt_temp", tempList);
			result.setStatusMsg(result.STATUS_SUCESS, "리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "처리 도중 오류가 발생하였습니다.");
			ex.printStackTrace();
		}
		return result.getResult();
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_temp ( Release 관리 상태인( C,U,D ) 리스트 )
	 * @returns mv dlt_temp ( 입력,수정,삭제된 건수 및 상태 ) author InswaveSystems
	 * @example
	 */
	@RequestMapping("/sample/tempSave")
	public @ResponseBody Map<String, Object> sampleTempSave(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = sampleService.update((List) param.get("dlt_temp"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "Release관리 정보가 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT")
					+ "건, 삭제 : " + (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "Release관리 정보 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 조회 - Bean 방식
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 */
	@RequestMapping(value = "/sample/bean/tempBeanSelect", method = RequestMethod.POST)
	public @ResponseBody DataBean<TempBean> sampleTempBeanSelect(@RequestBody ParamBean<UserBean> param) {
		DataBean<TempBean> data = new DataBean<TempBean>();
		RsMsgBean rsMsg = new RsMsgBean();
		Result result = new Result();
		try {
			rsMsg.setStatusCode(result.STATUS_SUCESS);
			rsMsg.setStatusMsg("리스트가 조회 되었습니다.");

			UserBean ubean = param.getParam();

			data.setData(sampleService.selectBeanReturn(ubean));
			data.setRsMsg(rsMsg);
		} catch (Exception ex) {
			rsMsg.setStatusCode(result.STATUS_ERROR);
			rsMsg.setStatusMsg(result.STATUS_ERROR_MESSAGE);
			data.setRsMsg(rsMsg);
			ex.printStackTrace();
		}

		return data;
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 등록 수정 삭제 한다. - Bean방식
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_temp ( Release 관리 상태인( C,U,D ) 리스트 )
	 * @returns mv dlt_temp ( 입력,수정,삭제된 건수 및 상태 ) author InswaveSystems
	 * @example
	 */
	@RequestMapping("/sample/bean/tempBeanSave")
	public @ResponseBody Map<String, Object> sampleTempBeanSave(@RequestBody ParamBean param) throws Exception {
		Result result = new Result();
		try {
			List<TempBean> tListbean = (List) param.getParam();

			Map hash = sampleService.updateBean(tListbean);
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "Release관리 정보가 저장 되었습니다. 입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT")
					+ "건, 삭제 : " + (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "Release관리 정보 저장도중 오류가 발생하였습니다.");
			ex.printStackTrace();
		}

		return result.getResult();
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 조회 - Map방식
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 */
	@RequestMapping("/sample/map/tempMapSelect")
	public @ResponseBody Map<String, Object> sampleTempMapSelect(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map searchMap = (Map) param.get("dma_search");
			List tempList = sampleService.select(searchMap);

			result.setData("dlt_temp", tempList);
			result.setStatusMsg(result.STATUS_SUCESS, "리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "처리 도중 오류가 발생하였습니다.");
			ex.printStackTrace();
		}
		return result.getResult();
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 등록 수정 삭제 한다. -Map방식
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_temp ( Release 관리 상태인( C,U,D ) 리스트 )
	 * @returns mv dlt_temp ( 입력,수정,삭제된 건수 및 상태 ) author InswaveSystems
	 * @example
	 */
	@RequestMapping("/sample/map/tempMapSave")
	public @ResponseBody Map<String, Object> sampleTempMapSave(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = sampleService.update((List) param.get("dlt_temp"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "Release관리 정보가 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT")
					+ "건, 삭제 : " + (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "Release관리 정보 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * 모든 타입의 컬럼 정보를 담은 table(SP_CUSTOMER_ORDER) 조회 - Array방식
	 * 
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 */
	@RequestMapping("/sample/Array/tempArraySelect")
	public @ResponseBody Map<String, Object> sampleTempArraySelect(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map searchMap = (Map) param.get("dma_search");
			List tempList = sampleService.select(searchMap);
			result.setData("dlt_temp", sampleService.selectResultHandler(searchMap));
			result.setMsg(result.STATUS_SUCESS, "리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "처리 도중 오류가 발생하였습니다.");
			ex.printStackTrace();
		}
		return result.getResult();
	}
}