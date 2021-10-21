package com.inswave.wrm.common.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.inswave.wrm.common.dao.ProgramDao;
import com.inswave.wrm.common.service.ProgramService;

@Service
public class ProgramServiceImpl implements ProgramService {

	@Resource(name = "programDao")
	private ProgramDao programDao;

	/**
	 * 메뉴관리 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectProgram(Map param) {
		return programDao.selectProgram(param);
	}

	/**
	 * 메뉴별 접근 메뉴 조회
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectProgramAuthority(Map param) {
		return programDao.selectProgramAuthority(param);
	}

	/**
	 * 메뉴별 접근 메뉴 등록
	 * 
	 * @param param Client 전달한 데이터 맵 객체
	 */
	@Override
	public List<Map> selectExcludeProgramAuthority(Map param) {
		return programDao.selectExcludeProgramAuthority(param);
	}

	/**
	 * 여러 건의 메뉴관리(개인기본정보) 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 리스트 객체
	 */
	@Override
	public Map saveProgram(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;

		for (int i = 0; i < param.size(); i++) {

			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += programDao.insertProgram(data);
			} else if (rowStatus.equals("U")) {
				uCnt += programDao.saveProgram(data);
			} else if (rowStatus.equals("D")) {
				dCnt += programDao.deleteProgram(data);
			}
		}
		
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}

	/**
	 * 여러 건의 메뉴별 접근 메뉴 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 리스트 객체
	 */
	@Override
	public Map saveProgramAuthority(List param) {
		int iCnt = 0;
		int uCnt = 0;
		int dCnt = 0;
		for (int i = 0; i < param.size(); i++) {

			Map data = (Map) param.get(i);
			String rowStatus = (String) data.get("rowStatus");
			if (rowStatus.equals("C")) {
				iCnt += programDao.insertProgramAuthority(data);
			} else if (rowStatus.equals("U")) {
				dCnt += programDao.saveProgramAuthority(data);
			} else if (rowStatus.equals("D")) {
				dCnt += programDao.deleteProgramAuthority(data);
			}
		}
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT", String.valueOf(iCnt));
		result.put("UCNT", String.valueOf(uCnt));
		result.put("DCNT", String.valueOf(dCnt));
		return result;
	}

	/**
	 * 메뉴정보 삭제시 하위의 메뉴별 접근권한 데이터를 변경(등록, 수정, 삭제)한다.
	 * 
	 * @param param Client 전달한 데이터 리스트 객체
	 */
	@Override
	public Map saveProgramAll(List paramProgram, List paramProgramAcess) {

		int iCnt_menu = 0; // 등록한 메뉴 건수
		int iCnt_access = 0; // 등록한 메뉴별 접근권한 건수
		int uCnt_menu = 0; // 수정한 메뉴 건수
		int uCnt_access = 0; // 수정한 메뉴별 접근권한 건수
		int dCnt_menu = 0; // 삭제한 메뉴 건수
		int dCnt_access = 0; // 삭제한 메뉴별 접근권한 건수

		for (int i = 0; i < paramProgram.size(); i++) {
			Map dataProgram = (Map) paramProgram.get(i);
			String rowStatusProgram = (String) dataProgram.get("rowStatus");
			if (rowStatusProgram.equals("C")) {
				iCnt_menu += programDao.insertProgram(dataProgram);

				for (int j = 0; j < paramProgramAcess.size(); j++) {
					Map dataProgramAcess = (Map) paramProgramAcess.get(j);
					String rowStatusProgramAuthority = (String) dataProgramAcess.get("rowStatus");
					if (rowStatusProgramAuthority.equals("C")) {
						iCnt_access += programDao.insertProgramAuthority(dataProgramAcess);
					}
				}
			} else if (rowStatusProgram.equals("U")) {
				for (int j = 0; j < paramProgramAcess.size(); j++) {
					Map dataProgramAcess = (Map) paramProgramAcess.get(j);
					String rowStatusProgramAuthority = (String) dataProgramAcess.get("rowStatus");
					if (rowStatusProgramAuthority.equals("C")) {
						iCnt_access += programDao.insertProgramAuthority(dataProgramAcess);
					} else if (rowStatusProgramAuthority.equals("D")) {
						dCnt_access += programDao.deleteProgramAuthority(dataProgramAcess);
					}
				}
				uCnt_menu += programDao.saveProgram(dataProgram);
				// 상위 메뉴가 삭제이면 하위메뉴별 접근권한은 모두 삭제
			} else if (rowStatusProgram.equals("D")) {
				programDao.deleteProgramAuthority(dataProgram); // 하위 코드 정보는 전체 삭제
				dCnt_menu += programDao.deleteProgram(dataProgram);
			}

		}
		Map result = new HashMap();
		result.put("STATUS", "S");
		result.put("ICNT_MENU", String.valueOf(iCnt_menu));
		result.put("ICNT_ACCESS", String.valueOf(iCnt_access));
		result.put("UCNT_MENU", String.valueOf(uCnt_menu));
		result.put("UCNT_ACCESS", String.valueOf(uCnt_access));
		result.put("DCNT_MENU", String.valueOf(dCnt_menu));
		result.put("DCNT_ACCESS", String.valueOf(dCnt_access));
		return result;
	}
}
