/**
 * 화면 초기 로딩
 * @lastUpdate 2016.08.28 
 * @author InswaveSystems
 * @since 2016.08.28
 */
scwin.initMainLoad = function() {
	wfm_side.getWindow().scwin.getInitData();
	
	var deviceWidth = com.num.parseFloat($("body").css("width"));
	if (deviceWidth < 1280) {
		$(".wrap").removeClass("show_menu");
		$(".btn_toggle_menu").removeClass("on");
	}
};

/**
 * TabControl의 모든 메뉴 닫기 버튼 이벤트
 * @lastUpdate 2016.08.28
 * @author InswaveSystems
 * @since 2016.08.28
 */
scwin.btn_CloseAll_onclick = function() {
	var cnt = tac_layout.getTabCount();
	for (var i = cnt; i > 0; i--) {
		tac_layout.deleteTab(i);
	}
};

/**
 * WindowContainer의 닫기 이벤트
 * @lastUpdate 2016.08.28
 * @param <String> windowTitle
 * @author InswaveSystems
 * @since 2016.08.28
 * @example
 */
scwin.closeAction = function(windowTitle) {
	if (windowTitle == "메인") {
		return false;
	}
	return true;
};

/**
 * header menu 생성
 */
scwin.setHeaderMenu = function() {
	wfm_header.getWindow().scwin.setGenerator(); //메뉴 생성
	wfm_header.getWindow().scwin.setMenuCss(); //메뉴 css 적용
};

scwin.getLayoutId = function() {
	if (typeof $p.top().$p.getComponentById("tac_layout") === "object") {
		return "T";
	} else if (typeof $p.top().$p.getComponentById("wdc_main") === "object") {
		return "M";
	}
	return null;
};

scwin.isMobileSize = function() {
	var size = {
		width: window.innerWidth || document.body.clientWidth,
		height: window.innerHeight || document.body.clientHeight
	};
	
	if (size.width <= 1024) {
		return true;
	} else {
		return false;
	}
};
