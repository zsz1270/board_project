package com.inswave.wrm.sample.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository("templateDao")
public interface TemplateDao {
	public Map selectMemberInfoForTemplate(Map param);

	public List selectMemberFavoriteForTemplate(Map param);
}
