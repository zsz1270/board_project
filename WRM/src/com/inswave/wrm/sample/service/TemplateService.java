package com.inswave.wrm.sample.service;

import java.util.List;
import java.util.Map;

public interface TemplateService {
	public Map selectMemberInfoForTemplate(Map param);

	public List selectMemberFavoriteForTemplate(Map param);
}
