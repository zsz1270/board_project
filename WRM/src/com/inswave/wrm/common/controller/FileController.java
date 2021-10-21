package com.inswave.wrm.common.controller;

import java.awt.PageAttributes.MediaType;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inswave.wrm.common.service.FileService;
import com.inswave.wrm.common.service.MenuService;
import com.inswave.wrm.util.FileUtil;
import com.inswave.wrm.util.Result;

import websquare.WebSquareConfig;

@Controller
public class FileController {

	@Autowired
	private FileService fileService;

	// 파일그룹 조회
	@RequestMapping("/file/selectFileGrp")
	public @ResponseBody Map<String, Object> selectFileGrp(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_fileGroup", fileService.selectFileGrp((Map) param.get("dma_fileGrp")));
			result.setStatusMsg(result.STATUS_SUCESS, "파일 그룹 조회가 완료되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "조회 중에 오류가 발생했습니다.");
		}
		return result.getResult();
	}

	// 파일그룹 저장
	@RequestMapping("/file/saveFileGrp")
	public @ResponseBody Map<String, Object> saveFileGrp(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map hash = fileService.saveFileGrp((Map) param.get("dma_fileGrp"));
			result.setData("dma_result", hash);
			result.setStatusMsg(result.STATUS_SUCESS, "파일그룹 정보가 저장 되었습니다. 입력 : " + (String) hash.get("ICNT") + "건, 수정 : "
					+ (String) hash.get("UCNT") + "건, 삭제 : " + (String) hash.get("DCNT") + "건");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "저장 중에 오류가 발생했습니다.");
		}
		return result.getResult();
	}

	// 파일 목록 조회
	@RequestMapping("/file/selectFile")
	public @ResponseBody Map<String, Object> selectFile(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			result.setData("dlt_file", fileService.selectFile((Map) param.get("dma_search")));
			result.setStatusMsg(result.STATUS_SUCESS, "파일 목록 조회가 완료되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "조회 중에 오류가 발생했습니다.");
		}
		return result.getResult();
	}

	@RequestMapping("/file/selectFileByFileGrp")
	public @ResponseBody Map<String, Object> selectFileByFileGrp(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			Map searchParam = (Map) param.get("dma_search");
			result.setData("dlt_file", fileService.selectFileByFileGrp(searchParam));

			String totalSearchYn = (String) searchParam.get("TOTAL_YN");

			if ((totalSearchYn != null) && totalSearchYn.equals("Y")) {
				result.setData("TOTAL_CNT", fileService.selectFileByFileGrpTotalCnt((Map) param.get("dma_search")));
			}

			result.setStatusMsg(result.STATUS_SUCESS, "파일 그룹별 파일 정보 조회가 완료되었습니다.");
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "조회 중에 오류가 발생했습니다.");
		}
		return result.getResult();
	}

	// 파일목록 저장
	@RequestMapping("/file/saveFile")
	public @ResponseBody Map<String, Object> insertFile(@RequestBody Map<String, Object> param) {
		Result result = new Result();
		try {
			List fileList = (List) param.get("dlt_file");
			if ((fileList == null) || (fileList.size() == 0)) {
				return result.getResult();
			}

			Map hash = fileService.saveFile(fileList);
			
			Map<String, Object> searchParam = new HashMap<String, Object>();
			searchParam.put("DATA_SEQ", ((Map) fileList.get(0)).get("DATA_SEQ"));
			result.setData("dlt_file", fileService.selectFile(searchParam));
			
			result.setMsg(result.STATUS_SUCESS, "파일 정보가 저장 되었습니다.",
					String.format("파일 정보(추가 : %s건, 삭제 : %s건)가 저장 되었습니다.", hash.get("ICNT"), hash.get("DCNT")));
		} catch (Exception ex) {
			ex.printStackTrace();
			result.setMsg(result.STATUS_ERROR, "저장 중에 오류가 발생했습니다.");
		}
		return result.getResult();
	}

	// 파일 다운로드
	@RequestMapping(value = "/file/downloadFile/{fileSeq}", method = RequestMethod.GET)
	public void downloadFile(HttpServletResponse response, HttpServletRequest request,
			@PathVariable("fileSeq") String fileSeq) throws IOException {

		Map<String, Object> param = new HashMap<String, Object>();
		param.put("FILE_SEQ", fileSeq);
		List<Map> fileList = fileService.selectFile(param);

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
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write("<html><head></head><body><div>파일이 존재하지 않습니다.</div></body></html>");
		}
	}
}
