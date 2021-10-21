package com.inswave.wrm.sample.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.inswave.wrm.util.WqLargeResultHandler;

@Repository("largeDataDao")
public class LargeDataDao {

	@Autowired
	private SqlSession sqlSession;

	private static final String NS = "com.inswave.wrm.sample.dao.ZipCodeStreetDao.";

	private static final String AS = "com.inswave.wrm.sample.dao.SampleDao.";

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	public List selectZipCodeStreet(Map param) {
		return sqlSession.selectList(NS + "selectZipCodeStreet", param);
	}

	/**
	 * DefaultType의 resultHandler
	 * 
	 * @date 2016. 8. 17.
	 * @param param SEQ_NO-조회할 row수
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo 추가해야 할 작업
	 */
	public Map selectZipCodeStreetByDefaultResultHandler(Map param) {
		WqLargeResultHandler ldh = new WqLargeResultHandler();
		sqlSession.select(NS + "selectZipCodeStreet", param, ldh);
		return (Map) ldh.getResult();
	}

	// resultHandler를 이용한 조회 - Array 사용 
	public Map selectResultHandler(Map param) {
		WqLargeResultHandler ldh = new WqLargeResultHandler();
		sqlSession.select(AS + "select", param, ldh);
		return (Map) ldh.getResult();
	}
	
	/**
	 * DefaultType의 resultHandler
	 * 
	 * @date 2016. 11. 15.
	 * @param param
	 * @author Inswave Systems
	 * @example 샘플 코드
	 * @todo
	 */
	public List selectArrayByDefaultResultHandler(Map param) {
		WqLargeResultHandler ldh = new WqLargeResultHandler();
		sqlSession.select(AS + "selectArray", param, ldh);
		return (List) ldh.getResult();
	}

}
