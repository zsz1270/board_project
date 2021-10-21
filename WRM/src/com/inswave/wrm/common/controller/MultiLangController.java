package com.inswave.wrm.common.controller;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import websquare.exception.PostControllerException;
import websquare.i18n.HTTPContext;
import websquare.i18n.I18N;
import websquare.i18n.LabelMessageLoader;
import websquare.i18n.Web2FileCache;
import websquare.logging.util.LogUtil;
import websquare.util.HttpUtil;

@Controller
public class MultiLangController {

	/**
	 * Caching 되어 있는 다국어 언어셋을 초기화 후 reload 한다.
	 */
	@RequestMapping(value = "/clearCache")
	@ResponseBody
	public void clearCache(HttpServletRequest request, HttpServletResponse response) {

		try {
			// 다국어 메시지 캐시 삭제
			LabelMessageLoader.getInstance().reload();

			// 화면 소스 캐시 삭제
			Web2FileCache.getInstance().cacheClear();
		} catch (Exception ex) {
			LogUtil.exception("[MultiLangController.clearCache] Exception.", ex);
		}
	}

	/**
	 * 다국어 처리를 수행한다.
	 */
	@RequestMapping(value = "/I18N")
	@ResponseBody
	public void processMultiLang(HttpServletRequest request, HttpServletResponse response) {
		HTTPContext frameworkContext = null;
		ServletOutputStream os = null;

		try {
			frameworkContext = HTTPContext.getContext();
			frameworkContext.setWebInfo(request, response, null, null);

			String w2xPath = HttpUtil.getParameter(request, "w2xPath");
			String result = Web2FileCache.getInstance().getXML(request);
			if (w2xPath != null && !w2xPath.equals("") && result != null && !result.equals("")) {

				try {
					byte[] bytes = result.getBytes("UTF-8");
					MessageDigest md = null;
					try {
						md = MessageDigest.getInstance("SHA");
						byte[] messageDigest = md.digest(bytes);
						BigInteger number = new BigInteger(1, messageDigest);
						StringBuffer sb = new StringBuffer("0");
						sb.append("\"");
						sb.append(number.toString(16));
						sb.append("\"");
						String ETAG = sb.toString();
						String previousETAG = request.getHeader("If-None-Match");

						if( previousETAG != null && ETAG != null ) {
							if( ETAG.equals( previousETAG ) ) {
								response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
								return;
							}
						}
						response.setHeader( "ETag", sb.toString() );
					} catch (Exception e) {
						LogUtil.exception( "[I18N] MessageDigest Exception.", e );
					}

					boolean compressed = false;
					String ae = request.getHeader("Accept-Encoding");
					if( ae != null && ae.indexOf("gzip") != -1 ) { // 압축 가능, 여부 판단
						compressed = true;
					}

					if( compressed ) {
						ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
						OutputStream zipOut = new GZIPOutputStream(byteOut);
						zipOut.write(bytes, 0, bytes.length);
						zipOut.flush();
						zipOut.close();
						byteOut.flush();
						bytes = byteOut.toByteArray();
						response.setHeader("Content-Encoding", "gzip");
					}

					SimpleDateFormat formatter = new SimpleDateFormat( "EEE, dd MMM yyyy HH:mm:ss z", Locale.US );
					Calendar cal = Calendar.getInstance();
					cal.add( Calendar.YEAR, 1 );
					cal.add( Calendar.DATE, -1 );
					formatter.setTimeZone( TimeZone.getTimeZone( "GMT" ) );
					String expires = formatter.format( cal.getTime() );
					response.setHeader( "Expires", expires );
					response.setHeader( "Last-Modified", expires );
					response.setHeader( "Cache-Control", "public, max-age=31449600" ); // 31449600

					response.setContentLength( bytes.length );
					os = response.getOutputStream();
					os.write( bytes, 0, bytes.length );
				} catch( Exception e ) {
					throw e;
				} finally {
					try {
						if (os != null) {
							os.flush();
						}
					} catch( Exception e ) {
						LogUtil.exception( "[I18N] OutputStream flush Exception.", e );
					}
					
					try {
						if (os != null) {
							os.close();
						}
					} catch( Exception e ) {
						LogUtil.exception( "[I18N] OutputStream close Exception.", e );
					}
				}
			}
		} catch( FileNotFoundException e1 ) {
			LogUtil.exception( "[I18N] FileNotFoundException Exception.", e1 );
		} catch( Exception e ) {
			LogUtil.exception( "[I18N] Exception.", e );
		} finally {
			try {
				if( os != null ) {
					os.flush();
					os.close();
				}
			} catch( IOException e1 ) {
				LogUtil.exception( "[I18N] FileNotFoundException IOException.", e1 );
			}

			if( frameworkContext != null ) {
				frameworkContext.setWebInfo( null, null, null, null );
			}
		}
	}
}