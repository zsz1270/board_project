package com.java_test.mytest.notice.IPconfig;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IPConfig {
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	public String getIPConfig(HttpServletRequest request) {
		String ip = request.getHeader("X-FORWARDED-FOR");
		
		if (ip == null) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_Client_IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null) {
			ip = request.getRemoteAddr();
		}
		
		logger.info(" IP : " + ip);
		return ip;
	}
}
