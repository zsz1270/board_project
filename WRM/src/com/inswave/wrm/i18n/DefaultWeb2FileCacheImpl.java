package com.inswave.wrm.i18n;

import java.io.*;
import java.net.*;
import java.util.*;

import javax.servlet.http.*;

import websquare.*;
import websquare.i18n.*;
import websquare.logging.util.*;
import websquare.util.*;

public class DefaultWeb2FileCacheImpl extends AbstractWeb2File {
	
	private Hashtable w2xPathCache = new Hashtable();
	private String excludeList[];
	private String GMLXMLBaseDir = "GMLXMLBaseDir";
	private String GMLXMLBaseUrl = "";
	private boolean useCache = false; 
	private int storageType = 0;

	public DefaultWeb2FileCacheImpl() {
		try {
			initialize();
		} catch( Exception e ) {
			LogUtil.exception("[DefaultWeb2FileCacheImpl.DefaultWeb2FileCacheImpl] Exception occurs :", e);
		}
	}
	
	private void initialize() throws Exception {
		try {
			WebSquareConfig wc = WebSquareConfig.getInstance();
			GMLXMLBaseDir = wc.getStringValue("/websquare/i18n/xmlInfo/@baseDir", "");
			GMLXMLBaseUrl = wc.getStringValue("/websquare/i18n/xmlInfo/@baseUrl", "url");
			String strCache = wc.getStringValue("/websquare/i18n/xmlInfo/@cache", "false");
			if( strCache != null && strCache.toLowerCase().equals("true") ) {
				useCache = true;
			}
			String storageTypeStr = wc.getStringValue("/websquare/i18n/xmlInfo/@storageType", "0");	//default DISK
			storageType = Integer.parseInt(storageTypeStr);
			
			String excludeStr = wc.getStringValue("/websquare/i18n/xmlInfo/excludeList/@value", "");
			if( excludeStr.length() > 0 ) {
				excludeList = excludeStr.split( "," );
			}
			
			LogUtil.severe("[DefaultWeb2FileCacheImpl.initialize] ###################initialize DefaultWeb2FileCacheImpl #####################" );
            LogUtil.severe("[DefaultWeb2FileCacheImpl.initialize] baseDir            : " + GMLXMLBaseDir  );
            LogUtil.severe("[DefaultWeb2FileCacheImpl.initialize] url  				: " + GMLXMLBaseUrl  );
            LogUtil.severe("[DefaultWeb2FileCacheImpl.initialize] useCache        	: " + useCache  );
            LogUtil.severe("[DefaultWeb2FileCacheImpl.initialize] storageType  		: " + storageType  );
		} catch( Exception e ) {
			LogUtil.exception("[DefaultWeb2FileCacheImpl.initialize] Exception occurs", e );
			throw e;
		}
	}
	
	/**
	 * ???????????? ????????? w2xPath ??? ?????? ????????????. 
	 */
	public void cacheClear() {
		LogUtil.info("[DefaultWeb2FileCacheImpl.cacheClear] start.");
		LogUtil.info("[DefaultWeb2FileCacheImpl.cacheClear] size : " + w2xPathCache.size());
		w2xPathCache.clear();
		excludeList = null;
		LogUtil.info("[DefaultWeb2FileCacheImpl.cacheClear] size : " + w2xPathCache.size());
		LogUtil.info("[DefaultWeb2FileCacheImpl.cacheClear] end.");
	}
	
	/**
	 * ???????????? w2xPath ????????? ????????? ????????? ????????? ?????? XML ???????????? ????????????. ??????????????? ??????????????? ??????.
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	public String getXML( HttpServletRequest request ) throws Exception {
		String result = "";
		try {
			String locale = I18NUtil.getLocale();
			String fullFilePath = getW2xPathFullFilePath( request );
			LogUtil.fine("[DefaultWeb2FileCacheImpl.getXML] fullFilePath :" + fullFilePath);
			if( fullFilePath == null || fullFilePath.length() == 0 ) {
				LogUtil.info("[DefaultWeb2FileImpl.getXML] w2xPath File ????????? ???????????? ???????????????. ??????????????? ???????????????");
				return result;
			}

			boolean isExclude = false;
			if( excludeList != null ) {
				for( int i=0;i<excludeList.length; i++ ) {
					if( fullFilePath.indexOf( excludeList[i].trim() ) > -1 ) {
						isExclude = true;
						break;
					}
				}
				
				if( isExclude == true ) {
					LogUtil.info("[DefaultWeb2FileCacheImpl.getXML] w2xPath ????????? ???????????? ?????? ???????????????.");
					return result;
				}
			}

			if( useCache ) {
				Hashtable localeHash = (Hashtable)w2xPathCache.get("FILE_"+fullFilePath);
				if( localeHash == null ) {
					localeHash = new Hashtable();
					w2xPathCache.put("FILE_"+fullFilePath, localeHash);
				}
				
				result = (String)localeHash.get(locale);
				if( result == null ) {
					result = getContents( fullFilePath , locale, request );
					localeHash.put(locale, result);
				}
			} else {
				result = getContents( fullFilePath , locale, request );
			}
			
		} catch( Exception e ) {
			LogUtil.exception("[DefaultWeb2FileCacheImpl.getW2xPath] Exception occurs.", e);
			throw e;
		}
		return result;
	}
	
	/**
	 * ????????? w2xPath ????????? ??????????????? ????????????. 
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	private String getW2xPathFullFilePath( HttpServletRequest request ) throws Exception {
		String fullFilePath = null;
		try {
			String w2xPathFileName = request.getParameter("w2xPath"); 
			
			w2xPathFileName = w2xPathFileName.replace("../", "");
//			w2xPathFileName = w2xPathFileName.startsWith("/") ? w2xPathFileName.substring(1) : w2xPathFileName;
			
			if (FileValidUtil.getInstance().isValidFullPath(w2xPathFileName) != true) {
				LogUtil.info("[DefaultWeb2FileCacheImpl.getW2xPathFullFilePath] File ????????? ???????????? ????????????.");
				return null; 
			};
			
			if (w2xPathFileName.substring(0, 1).equals("/") == false) {
				w2xPathFileName = "/" + w2xPathFileName;
			}
			
			if( w2xPathFileName == null ) {
				LogUtil.info("[DefaultWeb2FileCacheImpl.getW2xPathFullFilePath] w2xPath File ????????? ???????????? ???????????????. ??????????????? ???????????????");
				return null;
			}
			
			int idx = w2xPathFileName.lastIndexOf(".");
			if( idx == -1 ) {
				LogUtil.info("[DefaultWeb2FileCacheImpl.getW2xPathFullFilePath] w2xPath File ????????? ???????????? ????????????. ??????????????? ???????????????");
				return null; 
			}
			
			if(this.storageType == I18NUtil.STORAGE_HTTP) {
				fullFilePath = GMLXMLBaseUrl + w2xPathFileName;
			} else {
				fullFilePath = GMLXMLBaseDir + w2xPathFileName;
			}
			
			if(this.storageType == I18NUtil.STORAGE_DISK) {
				File f = new File(fullFilePath);
				String canoPath = f.getCanonicalPath();
				if ( canoPath.indexOf(GMLXMLBaseDir) != 0 ) {
					LogUtil.info("[DefaultWeb2FileCacheImpl.getW2xPathFullFilePath] The file name is incorrect. Check the file name. \nfullFilePath : " + fullFilePath + "\nCanonicalPath : " + canoPath);
					fullFilePath = null;				
				}			
			}
		} catch( Exception e ) {
			LogUtil.exception("[DefaultWeb2FileCacheImpl.getW2xPathFullFilePath] Exception occurs.", e);
			throw e;
		}
		return fullFilePath;
	}
	
	/**
	 * w2xPath??? ?????? locale ??? ?????? ????????? ????????? ?????? XML ???????????? ????????????. 
	 * @param fullFilePath
	 * @param locale
	 * @return
	 * @throws Exception 
	 */
	public String getContents( String fullFilePath, String locale, HttpServletRequest request ) throws Exception {
		String result = "";
		InputStream is = null;
		URL url = null;
		try {
			//LogUtil.fine("[DefaultWeb2FileCacheImpl.getContents] storageType:" + storageType);
			//LogUtil.fine("[DefaultWeb2FileCacheImpl.getContents] fullFilePath:" + fullFilePath);
			switch( this.storageType ) {
				case I18NUtil.STORAGE_DISK :
					is = new FileInputStream(fullFilePath);
					break;
				case I18NUtil.STORAGE_WAR :
					url = request.getSession().getServletContext().getResource(fullFilePath.replace(request.getContextPath(),""));
					if(url != null) is = url.openStream();
					break;
				case I18NUtil.STORAGE_JAR :
					url = Web2FileCache.class.getResource(fullFilePath);
					if(url != null) is = url.openStream();
					break;
				case I18NUtil.STORAGE_HTTP :
					url = new URL(fullFilePath);
					if(url != null) is = url.openStream();
					break;
				default :
					break;
			}
			
			if(is == null) {
				throw new Exception("InputStream is null. check out the application xml path.[storageType:" + this.storageType + ", path:" + fullFilePath + "]");
			}
			
			String fileStr = StreamUtil.getString(is, "UTF-8");
			//LogUtil.fine("[DefaultWeb2FileCacheImpl.getContents] fileStr:" + fileStr);
			String regex = "[!][~]";
			String strArray [] = fileStr.split(regex);
			StringBuffer sb = new StringBuffer();
			for( int i = 0 ; i < strArray.length ; i++) {
				String token = strArray[i];
				int lastIndex = token.indexOf("~!");
				if( lastIndex > -1) {
					String key = token.substring(0,lastIndex);
					String value = "";
					value = LabelMessageLoader.getInstance().getMessage(request, key, locale);
					value = XMLUtil.XMLEncoder( value );
					String rest = token.substring(lastIndex+2);
					sb.append(value).append(rest);
				} else {
					sb.append(token);
				}
			}
			result = sb.toString();
		} catch( Exception e ) {
			LogUtil.exception("[DefaultWeb2FileCacheImpl.getContents] Exception occurs.", e);
			throw e;
		} finally {
			try {
				is.close();
			} catch( Exception e ) {
			}
		}
		return result;
	}
	
	public int getStorageType() {
		return storageType;
	}

	public void setStorageType(int storageType) {
		this.storageType = storageType;
	}
}
