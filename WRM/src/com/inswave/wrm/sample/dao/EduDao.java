package com.inswave.wrm.sample.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.inswave.wrm.util.WqLargeResultHandler;

@Repository("eduDao")
public class EduDao {
	@Autowired
	private SqlSession sqlSession;

	private static final String NS = "com.inswave.wrm.sample.dao.EduDao.";

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	public int insertSpMember(Map param) throws Exception {
		return sqlSession.insert(NS + "insertSpMember", param);
	}

	public int updateSpMember(Map param) throws Exception {
		return sqlSession.update(NS + "updateSpMember", param);
	}

	public Map selectOneSpMember(Map param) throws Exception {
		return sqlSession.selectOne(NS + "selectOneSpMember", param);
	}

	public List selectListSpMember(Map param) throws Exception {
		return sqlSession.selectList(NS + "selectListSpMember", param);
	}

	public Map selectListSpMemberByHandler(Map param) throws Exception {
		return callDefaultResultHandler(NS + "selectListSpMember", param);
	}

	public Map callDefaultResultHandler(String mapperID, Map param) {
		WqLargeResultHandler ldh = new WqLargeResultHandler();
		sqlSession.select(mapperID, param, ldh);
		return (Map) ldh.getResult();
	}

	public List selectListZipCodeByTown(Map param) throws Exception {
		return sqlSession.selectList(NS + "selectListZipCodeByTown", param);
	}

}
