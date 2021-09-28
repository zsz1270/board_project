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
	public noticeVO detailContents(noticeVO noticevo) {
		return sqlSession.selectOne(NAMESPACE+"detailContents",noticevo);
	}
	
	//조회수 증가
	@Override
	public int viewCount(noticeVO noticevo) {
		return sqlSession.update(NAMESPACE+"viewCount",noticevo);
	}

	@Override
	public int insertBoard(noticeVO noticevo) {
		return  sqlSession.insert(NAMESPACE+"insertBoard", noticevo);
	}

	@Override
	public int updateBoard(noticeVO noticevo) {
		return sqlSession.update(NAMESPACE+"updateBoard", noticevo);
	}

	@Override
	public boolean isCheckIdentify(noticeVO nvo) {
		return sqlSession.selectOne(NAMESPACE+"isCheckIdentify", nvo);
	}

	@Override
	public int deleteBoard(noticeVO nvo) {
		return sqlSession.update(NAMESPACE+"deleteBoard", nvo);
	}


	@Override
	public int countBoardList(SearchpagingDTO scto) {
		return sqlSession.selectOne(NAMESPACE+"countBoardList", scto);
	}

	

}