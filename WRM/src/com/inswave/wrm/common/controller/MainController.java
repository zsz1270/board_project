package com.inswave.wrm.common.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.common.service.CommonService;
import com.inswave.wrm.common.service.MainService;
import com.inswave.wrm.util.Result;
import com.inswave.wrm.util.UserInfo;

@Controller
public class MainController {

	@Autowired
	private UserInfo user;

	@Autowired
	private CommonService commonService;

	@Autowired
	private MainService mainService;

	@Value("${main.setting.code.DB}")
	private String dbCode;

	@Value("${main.setting.code.LS}")
	private String lsCode;

	@RequestMapping("/main/init")
	public @ResponseBody Map<String, Object> getInitMainInfo() {
		Result result = new Result();
		Map memberParam = null;
		Map setInfo = null;
		List menuList = null;
		Map defInfo = null;

		try {
			memberParam = user.getUserInfoByBase();
			defInfo = new HashMap();
			defInfo.put("EMP_CD", user.getUserId());
			defInfo.put("EMP_NM", user.getUserName());
			
			if (user.getIsAdmin()) {
				defInfo.put("IS_ADMIN", "Y"); 
			} else { 
				defInfo.put("IS_ADMIN", "N");
			}
			
			result.setData("dlt_menu", commonService.selectMenuList(memberParam));
			result.setData("dlt_fav", commonService.selectFavListByEmpCd(user.getUserId()));
			result.setData("dma_defInfo", defInfo);
			result.setData("dlt_programAuthority", commonService.selectProgramAuthorityList(memberParam));
			result.setStatusMsg(result.STATUS_SUCESS, "메뉴정보가 조회 되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "");
		}

		return result.getResult();
	}

	/**
	 * 로그인된 사용자의 메인 설정 정보를 가져온다.
	 * 
	 * @date 2017.12.22
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	@RequestMapping("/main/selectBmMainSetting")
	public @ResponseBody Map<String, Object> selectBmMainSetting() {
		Result result = new Result();

		try {
			result.setData("dma_setting", commonService.selectBmMainSetting(user.getUserInfo()));
			result.setStatusMsg(result.STATUS_SUCESS, "정상적으로 조회가 완료되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "오류가 발생했습니다.");
		}

		return result.getResult();
	}

	/**
	 * MAIN 화면에 관련된 설정 정보 업데이트
	 * 
	 * @date 2017.12.22
	 * @param {Object} argument 파라미터 정보
	 * @returns {Object} 반환 변수 및 객체
	 * @author Inswave Systems
	 */
	@RequestMapping("/main/updateBmMainSetting")
	public @ResponseBody Map<String, Object> updateBmMainSetting(@RequestBody Map<String, Object> param, HttpServletRequest request,
			HttpServletResponse response) {

		int rsNum = 0;
		Result result = new Result();
		Map<String, String> paramMap = (Map) param.get("dma_setting");

		try {
			paramMap.put("EMP_CD", user.getUserId());
			rsNum = commonService.updateBmMainSetting(paramMap);
			if (rsNum == 1) {
				user.updateMainLayoutCode(request.getSession(), (String) paramMap.get("MAIN_LAYOUT_PAGE_CODE"));
				result.setData("dma_setting", (Map) param.get("dma_setting"));
				result.setMsg(result.STATUS_SUCESS, "저장되었습니다.");
			} else {
				result.setMsg(result.STATUS_ERROR, "업데이트 정보가 저장도중 오류가 발생하였습니다.");
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "저장 도중 오류가 발생하였습니다.");
		}

		return result.getResult();
	}

	/**
	 * get favorites list
	 * 
	 * @date 2017.12.22
	 * @param argument 파라미터 정보
	 * @returns <ModelAndView> 반환 변수 및 객체
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	@RequestMapping("/main/selectFavList")
	public @ResponseBody Map<String, Object> selectFavList() {
		Result result = new Result();

		try {
			result.setData("dlt_fav", commonService.selectFavListByEmpCd(user.getUserId()));
			result.setStatusMsg(result.STATUS_SUCESS, "메뉴 정보가 정상 조회되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "메뉴정보 조회도중 오류가 발생하였습니다.");
		}

		return result.getResult();
	}

	/**
	 * 즐겨찾기 메뉴정보를 입력, 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @returns mv
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/main/updateFav")
	public @ResponseBody Map<String, Object> updateFav(@RequestBody Map<String, Object> param) {
		int rsInt = 0;
		Map dbParam = null;
		String updateStatus = null;
		Result result = new Result();

		try {
			dbParam = (Map) param.get("dma_fav");
			updateStatus = (String) dbParam.get("STATUS");
			if (updateStatus == null) {
				throw new NullPointerException("상태값이 누락되었습니다.");
			}
			dbParam.put("EMP_CD", user.getUserId());

			rsInt = commonService.updateBmFavorite(dbParam);
			if (rsInt > 0) {
				result.setData("updateResult", updateStatus + ":" + rsInt);
			} else {
				result.setMsg(result.STATUS_ERROR, "업데이트 도중 오류가 발생하였습니다. 잠시 후 다시 시도해주시기 바랍니다.");
			}

		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "업데이트 도중 오류가 발생하였습니다.");
		}

		return result.getResult();
	}

	/**
	 * 메인 화면의 업데이트 내용을 가져온다.
	 * 
	 * @date 2017.12.22
	 * @param {} Map : { EMP_CD :"사용자 ID" }
	 * @returns mv List (사용자의 메뉴 리스트 )
	 * @author Inswave Systems
	 * @example
	 */
	@RequestMapping("/main/selectReleaseForMain")
	public @ResponseBody Map<String, Object> selectReleaseForMain(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map dbParam = (Map) param.get("dma_search");
			String totalSearchYn = (String) dbParam.get("TOTAL_YN"); // 총건수 조회 여부
			Map totalCnt = null;

			if (dbParam.get("IS_USE") == null) {
				dbParam.put("IS_USE", 'Y');
			}

			if (dbParam.get("selectType") == null) {
				dbParam.put("selectType", "S");
			}

			if (totalSearchYn.equals("Y")) {
				totalCnt = mainService.selectReleasetTotalCnt();
				result.setData("TOTAL_CNT", totalCnt);
			}
			
			result.setData("dlt_release", mainService.selectRelease(dbParam));
			result.setStatusMsg(result.STATUS_SUCESS, "릴리즈 정보가 정상적으로 조회가 완료되었습니다.");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "오류가 발생했습니다.");
		}
		return result.getResult();
	}

	/**
	 * ReleaseUpdate - 메인화면의 release 리스트를 등록 수정 삭제 한다.
	 * 
	 * @date 2017.12.22
	 * @param {} dlt_release ( Release 관리 상태인( C,U,D ) 리스트 )
	 * @returns mv dlt_result ( 입력,수정,삭제된 건수 및 상태 ), dlt_release ( 메뉴관리 리스트 ) author InswaveSystems
	 * @example
	 */
	@RequestMapping("/main/saveReleaseForMain")
	public @ResponseBody Map<String, Object> saveReleaseForMain(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map release = mainService.saveRelease((List) param.get("dlt_release"));
			result.setMsg(result.STATUS_SUCESS, "Release 관리 정보가 저장 되었습니다.", "입력 : " + (String) release.get("ICNT") + "건, 수정 : " + (String) release.get("UCNT")
					+ "건, 삭제 : " + (String) release.get("DCNT") + "건");
		} catch (Exception ex) {
			result.setMsg(result.STATUS_ERROR, "Release관리 정보 저장도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
	
	/**
	 * ReleaseUpdate - 메인화면의 단축키 리스트를 조회 한다.
	 * 
	 * @date 2018.03.21
	 * @param {} 
	 * @returns 
	 */
	@RequestMapping("/main/selectShortcutList")
	public @ResponseBody Map<String, Object> selectShortcutList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		Map dbParam = null;
		String programCode = null;
		try {
			dbParam = (Map) param.get("dma_shortcut");
			programCode = (String) dbParam.get("PROGRAM_CD");
			if (programCode == null) {
				throw new NullPointerException("프로그램 코드가 누락되었습니다.");
			}
			result.setData("dlt_shortcutList", commonService.selectShortcutList(programCode));
			result.setStatus(result.STATUS_SUCESS);
		} catch(Exception ex) {
			result.setMsg(result.STATUS_ERROR, "단축키 조회 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}

	@RequestMapping("/main/updateShortcutList")
	public @ResponseBody Map<String, Object> updateShortcutList(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = commonService.updateShortcutList((List) param.get("dlt_updataShortcutList"));
			result.setMsg(result.STATUS_SUCESS, "단축키 정보가 업데이트 되었습니다.", "입력 : " + (String) hash.get("ICNT") + "건, 수정 : " + (String) hash.get("UCNT") + "건, 삭제 : "
					+ (String) hash.get("DCNT") + "건");
		} catch(Exception ex) {
			result.setMsg(result.STATUS_ERROR, "단축키 업데이트 도중 오류가 발생하였습니다.");
		}
		return result.getResult();
	}
}
