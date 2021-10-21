package com.inswave.wrm.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapUtil {

	public static Map merge(Map source, Map target) {

		return merge(source, target, false);
	}

	public static Map merge(Map source, Map target, boolean exist) {

		return merge(source, target, false, null);
	}

	public static Map merge(Map<String, Object> source, Map target, boolean exist, String[] arg) {

		if (arg == null) {
			for (Map.Entry entry : source.entrySet()) {
				Object key = entry.getKey();
				Object value = entry.getValue();
				if (exist) {
					if (target.containsKey(key)) {
						target.put(key, value);
					}

				} else {
					target.put(key, value);
				}
			}
		} else {

			for (int i = 0; i < arg.length; i++) {
				if (exist) {
					if (target.containsKey(arg[i])) {
						target.put(arg[i], source.get(arg[i]));
					}

				} else {
					target.put(arg[i], source.get(arg[i]));
				}
			}
		}
		return target;
	}

	public static List merge(Map source, List target) {

		return merge(source, target, false);
	}

	public static List merge(Map source, List target, boolean exist) {

		return merge(source, target, false, null);
	}

	public static List merge(Map source, List target, boolean exist, String[] arg) {

		int cnt = target.size();
		for (int i = 0; i < cnt; i++) {
			Map data = (Map) target.get(i);

			data = merge(source, data, exist, arg);

			target.set(i, data);
		}

		return target;
	}
	
	/**
	 * List 객체를 문자열 배열로 변환해서 반환한다.
	 * 
	 * @param resultList 서비스의 메소드 실행 결과를 담은 List 객체
	 * @return String[] 문자열 배열
	 */
	public static String[] hashMapValuesToArray(List<HashMap <String, String>> resultList) {
		if (resultList.size() > 0) {
			String strArr[] = new String[1];
			try {
				strArr = new String[resultList.size() * resultList.get(0).size()];
				int idx = 0;
				for (HashMap<String, String> map : resultList) {
					for (String value : map.values()) {
						if (value != null) {
							strArr[idx] = value;
						} else {
							strArr[idx] = "";
						}
						idx++;
					}
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			}
			return strArr;
		} else {
			return null;
		}
	}
	
	public static String[] hashMapValuesToArray(List<HashMap <String, String>> resultList, String keyMap) {
		if (keyMap == null || keyMap.equals("")) return hashMapValuesToArray(resultList);
		
		if (resultList.size() > 0) {
			String[] keyArr = keyMap.split(",");
			String strArr[] = new String[resultList.size() * keyArr.length];
			try {
				int idx = 0;
				for (HashMap<String, String> hashMap : resultList) {
					for (int i=0; i < keyArr.length; i++) {
						String value = hashMap.get(keyArr[i]);
						if (value != null) {
							strArr[idx] = value;
						} else {
							strArr[idx] = "";
						}
						idx++;
					}
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			}
			return strArr;
		} else {
			return null;
		}
	}
}
