package com.joynbiz.board.dao.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.joynbiz.board.dao.noticeDAO;


@Repository
public class noticeRepository implements com.joynbiz.board.dao.noticeDAO{
	@Autowired
	private SqlSession sqlSession;	
	private static final String NAMESPACE = "memberMapper.";
	
	//게시글 전체조회
	@Override
	public List<HashMap<String, Object>> getBoardList(HashMap<String, Object> map) {
		return sqlSession.selectList(NAMESPACE+"getBoardList", map);
	}
	
	//게시글 상세조회
	@Override
	public HashMap<String, Object> detailContents(HashMap<String, Object> map) {
		return sqlSession.selectOne(NAMESPACE+"detailContents",map);
	}
	
	//조회수 증가
	@Override
	public int viewCount(HashMap<String, Object> map) {
		return sqlSession.update(NAMESPACE+"viewCount",map);
	}

	//개인정보확인
	@Override
	public boolean isCheckIdentify(HashMap<String, Object> map) {
		return sqlSession.selectOne(NAMESPACE+"isCheckIdentify", map);
	}

	//새 작성
	@Override
	public int insertBoard(HashMap<String, Object> map) {
		return  sqlSession.insert(NAMESPACE+"insertBoard", map);
	}

	//수정
	@Override
	public int updateBoard(HashMap<String, Object> map) {
		return sqlSession.update(NAMESPACE+"updateBoard", map);
	}
	
	//삭제
	@Override
	public int deleteBoard(HashMap<String, Object> map) {
		return sqlSession.update(NAMESPACE+"deleteBoard", map);
	}

}