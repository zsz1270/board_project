package com.inswave.wrm.i18n;
import java.io.*;
import java.net.URL;
import java.util.*;

import javax.servlet.http.*;

import websquare.*;
import websquare.i18n.AbstractMessage;
import websquare.i18n.I18NUtil;
import websquare.logging.util.*;
import websquare.util.*;

/**
 * 다국어 처리를 위한 메세지를 관리하는 클래스이다.
 */
public class DefaultMessageImpl extends AbstractMessage {
	/**
	 * @Override
	 * @cdate          2012/11/20     
     * @param          Integer storageType : storageType
     * @param          String path : 다국어 리소스 파일의 경로 
     * @return		   Hashtable 
     * 				   { nation_key : { property_key : property_value } }
     * 				   ex) { "ko" : { "ok" : "성공", "fail" : "실패" },
     *                       "en" : { "ok" : "ok", "fail" : "fail" } }
     * @desc           WAS기 기동되는 시점에 호출되어 처리된다.
     * 				   다국어 처리 Message를 로드하여 Hashtable로 리턴한다.
     * 				   storageType='1' WAR형태인 경우 ServletContext가 로딩되기 전에 처리할 수 없으므로 null을 리턴하고 loadProperty에서 구현한다.
     */
	public Hashtable initializeProperty(int storageType, String path) throws Exception {
		Hashtable languageHash = null;
		try {
			switch(storageType) {
				case I18NUtil.STORAGE_DISK :
					languageHash = loadFileResource(path);
					break;
					
				case I18NUtil.STORAGE_WAR :		//WAS 기동시 HttpServletRequest 객체를 얻어올 수 없음. null을 리턴해야 한다.
					break;
					
				case I18NUtil.STORAGE_JAR :
				case I18NUtil.STORAGE_HTTP :
					languageHash = loadURLResource(storageType, null);
					break;
					
				default :
					break;
			}
		} catch(Exception e) {
			LogUtil.exception("[DefaultMessageImpl.loadProperty] exception occured.", e);
		}
		return languageHash;
	}

	/**
	 * @Override
	 * @cdate          2012/11/20     
     * @param          Integer storageType : storageType
     * @param          HttpServletRequest request : HTTPServletRequest
     * @param          String path : 다국어 리소스 파일의 경로 
     * @return		   Hashtable 
     * 				   { nation_key : { property_key : property_value } }
     * 				   ex) { "ko" : { "ok" : "성공", "fail" : "실패" },
     *                       "en" : { "ok" : "ok", "fail" : "fail" } }
     * @desc           HTTP Request 호출시 기동시점에 로드한 메시지가 없는 경우 최초에 호출된다.
     * 				   다국어 처리 Message를 로드하여 Hashtable로 리턴한다.
     */
	public Hashtable loadProperty(int storageType, HttpServletRequest request, String path)
			throws Exception {
		
		Hashtable languageHash = new Hashtable();;
		try {
			switch(storageType) {
				case I18NUtil.STORAGE_DISK :
					languageHash = loadFileResource(path);
					break;
					
				case I18NUtil.STORAGE_WAR :		
				case I18NUtil.STORAGE_JAR :
				case I18NUtil.STORAGE_HTTP :
					languageHash = loadURLResource(storageType, request);
					break;
				default :
					break;
			}
		} catch(Exception e) {
			LogUtil.exception("[DefaultMessageImpl.loadProperty] exception occured.", e);
		}

		return languageHash;
	}
	
	private Hashtable loadFileResource(String path) throws Exception {
		Hashtable languageHash = new Hashtable();
		try {
			File fDir = new File(path);
		    if (!fDir.isDirectory()) throw new IllegalArgumentException("Not a directory: " + path);
		    File[] entries = fDir.listFiles();
			for (int i=0; i < entries.length; i++) {
				File sDir = entries[i];
				if (!sDir.isDirectory()) {
					LogUtil.info("[DefaultMessageImpl.loadFileResource] skip [" + sDir + "]. It is not a directory");
				} else {
					appendProperty(languageHash, sDir);
					LogUtil.info("[DefaultMessageImpl.loadFileResource] load resource from [" + sDir + "].");
				}
			}
			
			LogUtil.info("[DefaultMessageImpl.loadFileResource] loadFileResource() success.");
		} catch(Exception e) {
			LogUtil.exception("[DefaultMessageImpl.loadFileResource] exception occured.", e);
		}
		return languageHash;
	}

	
	private Hashtable loadURLResource(int storageType, HttpServletRequest request) throws Exception {
		InputStream is = null;
		Hashtable languageHash = new Hashtable();
		try {
			WebSquareConfig wc = WebSquareConfig.getInstance();
			Hashtable resourceHash = getResourcePath();
			URL url = null;
			
			Enumeration em = resourceHash.keys();
			while(em.hasMoreElements()) {
			    String lang = (String)em.nextElement();
			    Vector resourceVt = (Vector)resourceHash.get(lang);
				for( int i=0; i<resourceVt.size(); i++ ) {
					String tmpPath = (String)resourceVt.elementAt(i);
					LogUtil.fine("[DefaultMessageImpl.loadURLResource]resource path:" + tmpPath);
					switch(storageType) {
						case I18NUtil.STORAGE_WAR :
							url = request.getSession().getServletContext().getResource(tmpPath.replace(request.getContextPath(),""));
							break;
						case I18NUtil.STORAGE_JAR :
							url = DefaultWeb2FileCacheImpl.class.getResource(tmpPath);
							break;
						case I18NUtil.STORAGE_HTTP :
							url = new URL(tmpPath);
							break;
						default :
							url = null;
							break;
				
					}
					if(url == null) {
						LogUtil.severe("[DefaultMessage.loadURLResource] url is null. check out the resource path.[storageType:" + storageType + ", path:" + tmpPath + "]");
					}
					appendProperty(languageHash, lang, url);
				}
			}
			
			LogUtil.info("[DefaultMessageImpl.loadURLResource] loadURLResource() success.");

		} catch(Exception e) {
			LogUtil.exception("[DefaultMessageImpl.loadURLResource] exception occured.", e);
		}
		return languageHash;
	}
			
	private Hashtable getResourcePath() throws Exception {
		Hashtable resultHash = new Hashtable();
		try {
			WebSquareConfig wc = WebSquareConfig.getInstance();
			Vector languageVt = XMLUtil.getChildren(wc.getDocument(), "/websquare/i18n/messageInfo/localeResources");
			for( int i=0; i<languageVt.size(); i++ ) {
				Hashtable hash = (Hashtable)languageVt.elementAt(i);
				String lang = (String)hash.get("@nodeName");
				Vector resultVt = new Vector();
				Vector resourceVt = XMLUtil.getChildren(wc.getDocument(), "/websquare/i18n/messageInfo/localeResources/" + lang);
				for (int j=0; j<resourceVt.size(); j++) {
					Hashtable rsHash = (Hashtable)resourceVt.elementAt(j);
					resultVt.add((String)rsHash.get("value"));
				}
				resultHash.put(lang, resultVt);
			}
			//LogUtil.info("[DefaultMessageImpl.getResourcePath] path list:\n" + XMLUtil.indent(XMLUtil.toXML(resultHash)));
		} catch(Exception e) {
			LogUtil.exception("[DefaultMessageImpl.getResourcePath] exception occured.", e);
		}
		return resultHash;
	}
	
	private void appendProperty(Hashtable argHash, File sDir) throws Exception {
		String languageType = sDir.getName();
		Hashtable keys = null;
		if (argHash.containsKey(languageType)) {
			keys = (Hashtable) argHash.get(languageType);
		} else {
			keys = new Hashtable();
			argHash.put(languageType, keys);
		}
		File[] fileList = sDir.listFiles();
		Properties prop = new Properties();
		if (fileList != null) {
			for (int i = 0; i < fileList.length; i++) {
				if( fileList[i].isFile() ) {
					FileInputStream fis = null;
					try {
						fis = new FileInputStream(fileList[i]);
						prop.load(new java.io.BufferedInputStream(fis));
						Enumeration e = prop.keys();
						while (e.hasMoreElements()) {
							Object key = e.nextElement();
							String value = prop.getProperty((String) key);
							keys.put(key, value);
						}
					} catch( Exception e ) {
						LogUtil.exception("[DefaultMessageImpl.appendProperty] exception occured.", e);
					} finally {
						try { if(fis != null) fis.close(); } catch(Exception e1) {}
					}
				}
			}
		}
	}
	
	private void appendProperty(Hashtable argHash, String languageType, URL url) throws Exception {
		InputStream is = null;
		try {
			is = url.openStream();
			Hashtable keys = null;
			if (argHash.containsKey(languageType)) {
				keys = (Hashtable) argHash.get(languageType);
			} else {
				keys = new Hashtable();
				argHash.put(languageType, keys);
			}
			Properties prop = new Properties();
			prop.load(new java.io.BufferedInputStream(is));
			Enumeration e = prop.keys();
			while (e.hasMoreElements()) {
				Object key = e.nextElement();
				String value = prop.getProperty((String) key);
				keys.put(key, value);
			}

		} catch( Exception e ) {
			LogUtil.exception("[DefaultMessageImpl.appendProperty] exception occured.", e);
		} finally {
			try { if(is != null) is.close(); } catch(Exception e1) {}
		}
	}	
}