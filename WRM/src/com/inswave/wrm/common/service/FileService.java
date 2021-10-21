package com.inswave.wrm.common.service;

import java.util.List;
import java.util.Map;

public interface FileService {
		
	public abstract List<Map> selectFileGrp(Map param);
	
	public abstract Map saveFileGrp(Map param);
	
	public abstract List<Map> selectFile(Map param);
	
	public abstract List<Map> selectFileByFileGrp(Map param);
	
	public abstract Map selectFileByFileGrpTotalCnt(Map param);
	
	public abstract Map saveFile(List param);
}
