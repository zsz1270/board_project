package com.inswave.wrm.common.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("programDao")
public interface ProgramDao {

	// 프로그램관리 조회
	public abstract List<Map> selectProgram(Map param);

	// 프로그램관리 C, U, D
	public abstract int insertProgram(Map param);

	public abstract int deleteProgram(Map param);

	public abstract int saveProgram(Map param);

	// 프로그램별 접근프로그램 조회
	public abstract List<Map> selectProgramAuthority(Map param);

	public abstract List<Map> selectExcludeProgramAuthority(Map param);

	// 프로그램별 접근프로그램 C, D
	public abstract int insertProgramAuthority(Map param);
	
	public abstract int saveProgramAuthority(Map param);

	public abstract int deleteProgramAuthority(Map param);
}
