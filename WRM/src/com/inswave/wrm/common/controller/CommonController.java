package com.inswave.wrm.common.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.common.service.CommonService;
import com.inswave.wrm.util.Result;
import com.inswave.wrm.util.UserInfo;

@Controller
public class CommonController {

	@Autowired
	private CommonService commonService;

	@Autowired
	private UserInfo user;

	/**
	 * selectCommonSearchItem - 공통코드 아이템 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} 없음
	 * @returns mv dlt_commonSearchItem ( 공통코드 아이템 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/selectCommonSearchItem")
	public @ResponseBody Map<String, Object> selectCommonSearchItem() {
		Result result = new Result();

		try {
			result.setData("dlt_commonSearchItem", commonService.selectCommonSearchItem());
			result.setStatusMsg(result.STATUS_SUCESS, "공통코드 아이템 리스트가 조회 되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "공통코드 아이템 리스트를 가져오는 도중 오류가 발생하였습니다,");
		}
		return result.getResult();
	}

	/**
	 * CommonCode - 모든 공통코드를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} 없음
	 * @returns mv List : 공통코드 전체 리스트
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/selectCommonCode")
	public @ResponseBody Map<String, Object> selectCommonCode() {
		Result result = new Result();
		try {
			result.setData("dlt_commonCode", commonService.selectCommonCodeAll());
			result.setStatusMsg(result.STATUS_SUCESS, "공통코드 전체가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "공통코드 정보를 가져오는 도중 오류가 발생하였습니다,");
		}
		return result.getResult();
	}

	/**
	 * selectMenuList - 조회조건에 따른 메뉴 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_userInfo { EMP_CD :"사용자 ID" }
	 * @returns mv List ( 사용자의 메뉴 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/selectMenuList")
	public @ResponseBody Map<String, Object> selectMenuList() {
		Result result = new Result();
		try {
			result.setData("dlt_menu", commonService.selectMenuList(user.getUserInfo()));
			result.setStatusMsg(result.STATUS_SUCESS, "메뉴정보가 정상 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "메뉴정보 조회도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * CommonCodeList - 조회조건에 따른 공통코드 리스트를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dma_commonGrp { GRP_CD : "공통그룹 코드" }
	 * @returns mv dlt_commonCode ( 공통코드 리스트 );
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/selectCommonCodeList")
	public @ResponseBody Map<String, Object> selectCommonCodeList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_commonCode", commonService.selectCommonCodeList((Map) param.get("dma_commonGrp")));
			result.setStatusMsg(result.STATUS_SUCESS, "공통코드(" + ((Map) param.get("dma_commonGrp")).get("GRP_CD") + ") 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "공통코드 정보(" + ((Map) param.get("dma_commonGrp")).get("GRP_CD") + ")를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	@RequestMapping("/common/selectCommonGroup")
	public @ResponseBody Map<String, Object> selectCommonGroup(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_commonGrp", commonService.selectCommonGroup((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "공통코드 그룹 리스트가 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "공통코드 그룹 리스트를 가져오는 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * saveCommonGrpAll - 공통그룹 리스트 및 하위 코드정보를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_commonGrp ( 공통코드그룹 상태인( C,U,D ) 리스트 ), dlt_commonCode ( 공통코드 상태인( C,U,D ) 리스트 )
	 * @returns mv dlt_result (입력,수정,삭제된 건수 및 상태)
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/saveCommonGrpAll")
	public @ResponseBody Map<String, Object> saveCommonGrpAll(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = commonService.saveCodeGrpListAll((List) param.get("dlt_commonGrp"), (List) param.get("dlt_commonCode"));
			result.setMsg(result.STATUS_SUCESS,"공통그룹 리스트 및 하위 코드 정보가 저장 되었습니다.", "입력 그룹코드 건수: " + (String) hash.get("ICNT_GRP") + "건  ::  입력 세부코드 건수: " + (String) hash.get("ICNT_CODE")
							+ "건 :: 수정 그룹코드 건수: " + (String) hash.get("UCNT_GRP") + "건  ::  수정 세부코드 건수: " + (String) hash.get("UCNT_CODE")
							+ "건  ::  삭제 그룹코드 건수: " + (String) hash.get("DCNT_GRP") + "건  ::  삭제 세부코드 건수: " + (String) hash.get("DCNT_CODE") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "공통그룹 리스트 및 하위 코드 정보 저장 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * saveCommonGrp - 공통그룹 리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_commonGrp ( 공통코드그룹 상태인( C,U,D ) 리스트 ), dma_search ( 조회조건 )
	 * @returns mv dlt_result (입력,수정,삭제된 건수 및 상태), dlt_commonGrp ( 공통코드 그룹 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/saveCommonGrp")
	public @ResponseBody Map<String, Object> saveCommonGrp(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = commonService.saveCodeGrpList((List) param.get("dlt_commonGrp"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "공통 코드 그룹이 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : "
					+ (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "공통 코드 그룹 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * CommonCodeUpdate - 공통그룹코드 리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_commonCode ( 공통코드 상태인( C,U,D ) 리스트 ), dma_commonGrp ( 조회조건 )
	 * @returns mv dma_result ( 입력,수정,삭제된 건수 및 상태 ), dlt_commonCode ( 공통코드 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/saveCommonCode")
	public @ResponseBody Map<String, Object> saveCommonCode(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = commonService.saveCodeList((List) param.get("dlt_commonCode"));
			result.setData("dma_result", hash);
			result.setMsg(result.STATUS_SUCESS, "공통 코드가 저장 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : "
					+ (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "공통 코드 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	/**
	 * 공통 코드 데이터를 조회한다.
	 * 
	 * @date 2017.12.22
	 * @param param {dma_commonCode : {GRP_CD:"02,01", DATA_PREFIX:"dlt_code"}}
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/common/selectCodeList")
	public @ResponseBody Map<String, Object> selectCodeList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		Map commonCode;
		String GRP_CD;
		String dataIdPrefix;
		String[] selectCodeList;
		try {
			commonCode = (Map) param.get("dma_commonCode");
			GRP_CD = (String) commonCode.get("GRP_CD");
			dataIdPrefix = (String) commonCode.get("DATA_PREFIX");

			if (dataIdPrefix == null) {
				dataIdPrefix = "dlt_commonCode_";
			}
			selectCodeList = GRP_CD.split(",");
			commonCode.put("CODE", selectCodeList);

			List codeList = commonService.selectCodeList(commonCode);

			int size = codeList.size();
			String preCode = "";
			List codeGrpList = null;
			for (int i = 0; i < size; i++) {
				Map codeMap = (Map) codeList.remove(0);
				String grp_cd = (String) codeMap.get("GRP_CD");
				if (!preCode.equals(grp_cd)) {
					if (codeGrpList != null) {
						result.setData(dataIdPrefix + preCode, codeGrpList);
					}
					preCode = grp_cd;
					codeGrpList = new ArrayList();
					codeGrpList.add(codeMap);
				} else {
					codeGrpList.add(codeMap);
				}

				if (i == size - 1) {
					result.setData(dataIdPrefix + preCode, codeGrpList);
				}
			}

			result.setStatus(result.STATUS_SUCESS);
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "공통코드 조회중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
}