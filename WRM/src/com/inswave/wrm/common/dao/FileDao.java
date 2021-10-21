package com.inswave.wrm.common.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("fileDao")
public interface FileDao {
	
	public abstract List<Map> selectFileGrp(Map param);
	
	public abstract int insertFileGrp(Map param);
	
	public abstract int updateFileGrp(Map param);
	
	public abstract int deleteFileGrp(Map param);
	
	public abstract List<Map> selectFile(Map param);
	
	public abstract List<Map> selectFileByFileGrp(Map param);
	
	public abstract Map selectFileByFileGrpTotalCnt(Map param);
	
	public abstract int insertFile(Map param);
	
	public abstract int deleteFile(Map param);

	public abstract int updateFileIsDelete(Map data);
}
