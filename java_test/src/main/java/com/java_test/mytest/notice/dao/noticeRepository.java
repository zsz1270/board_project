package com.java_test.mytest.notice.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.java_test.mytest.notice.noticevo.SearchDTO;
import com.java_test.mytest.notice.noticevo.SearchpagingDTO;
import com.java_test.mytest.notice.noticevo.noticeVO;
import com.java_test.mytest.notice.noticevo.pagingDTO;

@Repository
public class noticeRepository implements noticeDAO{
	@Autowired
	private SqlSession sqlSession;	
	private static final String NAMESPACE = "memberMapper.";
	
	//게시글 전체조회
	@Override
	public List<noticeVO> getBoardList(SearchpagingDTO scto) {
		return sqlSession.selectList(NAMESPACE+"getBoardList", scto);
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

	@Override
	public int countBoardList(SearchpagingDTO scto) {
		return sqlSession.selectOne(NAMESPACE+"countBoardList", scto);
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