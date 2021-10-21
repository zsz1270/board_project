package com.inswave.wrm.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import websquare.WebSquareConfig;

public class FileUtil {

	public static void downloadFile(HttpServletResponse response, HttpServletRequest request, String orignalFileName,
			String storedFilePath) throws Exception {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		
		try {
			File file = new File(storedFilePath);
			if (file.isFile()) {
				int fileLength = (int) file.length();
				String header = request.getHeader("User-Agent");

				if (header.contains("MSIE") || header.contains("Trident")) {
					orignalFileName = URLEncoder.encode(orignalFileName, "UTF-8").replaceAll("\\+", "%20");
					response.setHeader("Content-Disposition", "attachment;filename=" + orignalFileName + ";");
				} else {
					orignalFileName = new String(orignalFileName.getBytes("UTF-8"), "ISO-8859-1");
					response.setHeader("Content-Disposition", "attachment; filename=\"" + orignalFileName + "\"");
				}

				response.setContentType("application/download; UTF-8");
				response.setContentLength(fileLength);
				response.setHeader("Content-Type", "application/octet-stream");
				response.setHeader("Content-Transfer-Encoding", "binary;");
				response.setHeader("Pragma", "no-cache;");
				response.setHeader("Expires", "-1;");
				response.setHeader("Content-Disposition", "attachment; filename=" + orignalFileName);

				bis = new BufferedInputStream(new FileInputStream(file));
				bos = new BufferedOutputStream(response.getOutputStream());

				byte[] readByte = new byte[4096];

				while ((fileLength = bis.read(readByte)) > 0) {
					bos.write(readByte, 0, fileLength);
					bos.flush();
				}
			} else {
				throw new IOException();
			}
		} finally {
			if (bis != null) {
				try {
					bis.close();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}

			if (bos != null) {
				try {
					bos.close();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		}
	}
}
