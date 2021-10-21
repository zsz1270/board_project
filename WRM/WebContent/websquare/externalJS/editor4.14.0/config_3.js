﻿
CKEDITOR.editorConfig = function( config )
{

	config.toolbar_default = [
	                                  	['Source','DocProps','-','NewPage','Preview','-'],
	                                  	['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print'],
	                                  	['Undo','Redo','SelectAll','RemoveFormat'],
	                                  	['Bold','Italic','Underline'],
	                                  	['StrikeThrough','Subscript','Superscript'],
	                                  	['OrderedList','UnorderedList','-','Outdent','Indent','Blockquote'],
	                                  	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	                                  	['Anchor','Table'],
	                                  	['Rule','SpecialChar','PageBreak','TextColor','BGColor','ShowBlocks'],
	                                  	['Styles','Format','Font','FontSize']		// No comma for the last row.
	                                  ] ;
	config.toolbar_simple = [
	                                	['Font','FontSize','Table','Image'],
	                                  	['Bold','Italic','Underline','TextColor']
	                                  ];
	config.toolbar_defaultImage = [
	                                  	['Source','DocProps','-','NewPage','Preview','-'],
	                                  	['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print'],
	                                  	['Undo','Redo','SelectAll','RemoveFormat'],
	                                  	['Bold','Italic','Underline'],
	                                  	['StrikeThrough','Subscript','Superscript'],
	                                  	['OrderedList','UnorderedList','-','Outdent','Indent','Blockquote'],
	                                  	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	                                  	['Anchor','Table','Image'],
	                                  	['Rule','SpecialChar','PageBreak','TextColor','BGColor','ShowBlocks'],
	                                  	['Styles','Format','Font','FontSize']		// No comma for the last row.
	                                  ] ;
	config.font_names	 = '굴림;궁서;돋움;바탕;Arial;Comic Sans MS;Courier New;Tahoma;Times New Roman;Verdana' ; 
	config.fullPage = false;   //true이면 html태그 까지 보임 false이면 에디터 부분 태그만 보임(html로 보기 시에)
	config.enterMode = CKEDITOR.ENTER_BR; //엔터시 입력되는 태그 BR P DIV 세 종류가 있습니다.
	config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px' ; //폰트 사이즈 설정입니다.
	config.startupFocus = false; //시작시 editor에 포커스 가는 여부 입니다. 마지막에 그린 에디터로 갑니다.
	
	config.skin ="moono";
	config.allowedContent = true;

	config.pasteFromWordPromptCleanup = true;
	config.pasteFromWordRemoveFontStyles = false;
	config.pasteFromWordRemoveStyles = false;
	
	config.extraPlugins = 'resize';
	//config.resize_dir = 'both'; both || vertical || horizontal

	config.filebrowserUploadMethod = 'form';
};
