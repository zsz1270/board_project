package com.inswave.wrm.common.service;

import java.util.List;
import java.util.Map;

public interface ProgramService {

	// 프로그램관리 조회
	public abstract List<Map> selectProgram(Map param);

	// 프로그램관리 저장(기본정보)
	public abstract Map saveProgram(List param);

	// 프로그램별 접근권한 조회
	public abstract List<Map> selectProgramAuthority(Map param);

	public abstract List<Map> selectExcludeProgramAuthority(Map param);

	// 프로그램별 접근권한 저장(기본정보)
	public abstract Map saveProgramAuthority(List param);

	// 프로그램리스트 및 프로그램별 접근권한 리스트 입력, 수정, 삭제
	public abstract Map saveProgramAll(List paramProgram, List paramProgramAcess);
}
