/*
 * CKFinder
 * ========
 * http://cksource.com/ckfinder
 * Copyright (C) 2007-2015, CKSource - Frederico Knabben. All rights reserved.
 *
 * The software, this file, and its contents are subject to the CKFinder
 * License. Please read the license.txt file before using, installing, copying,
 * modifying, or distributing this file or part of its contents. The contents of
 * this file is part of the Source Code of CKFinder.
 *
 */

/**
 * @fileOverview Defines the {@link CKFinder.lang} object for the English
 *		language. This is the base file for all translations.
 */

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKFinder.lang['ko'] =
{
	appTitle : 'CKFinder',

	// Common messages and labels.
	common :
	{
		// Put the voice-only part of the label in the span.
		unavailable		: '%1<span class="cke_accessibility">, unavailable</span>',
		confirmCancel	: '정말 닫으시겠습니까? 저장되지 않은 이미지 수정 사항이 있습니다.',
		ok				: '확인',
		cancel			: '취소',
		confirmationTitle	: '알림',
		messageTitle	: '정보',
		inputTitle		: 'Question',
		undo			: 'Undo',
		redo			: 'Redo',
		skip			: '건너뛰기',
		skipAll			: '모두 건너뛰기',
		makeDecision	: '어떻게 처리할까요?',
		rememberDecision: '내 선택 기억'
	},


	// Language direction, 'ltr' or 'rtl'.
	dir : 'ltr',
	HelpLang : 'en',
	LangCode : 'ko',

	// Date Format
	//		d    : Day
	//		dd   : Day (padding zero)
	//		m    : Month
	//		mm   : Month (padding zero)
	//		yy   : Year (two digits)
	//		yyyy : Year (four digits)
	//		h    : Hour (12 hour clock)
	//		hh   : Hour (12 hour clock, padding zero)
	//		H    : Hour (24 hour clock)
	//		HH   : Hour (24 hour clock, padding zero)
	//		M    : Minute
	//		MM   : Minute (padding zero)
	//		a    : Firt char of AM/PM
	//		aa   : AM/PM
	DateTime : 'yyyy/m/d aa h:MM',
	DateAmPm : ['오전','오후'],

	// Folders
	FoldersTitle	: '폴더',
	FolderLoading	: '로딩 중...',
	FolderNew		: '새로운 폴더 이름을 입력해 주십시오: ',
	FolderRename	: '새로운 폴더 이름을 입력해 주십시오: ',
	FolderDelete	: '정말 "%1" 폴더를 삭제하시겠습니까?',
	FolderRenaming	: ' (변경 중...)',
	FolderDeleting	: ' (삭제 중...)',
	DestinationFolder	: '목적지 폴더',

	// Files
	FileRename		: '새로운 파일 이름을 입력해 주십시오: ',
	FileRenameExt	: '정말 파일 확장자를 변경하시겠습니까? 파일을 사용할 수 없게 될 수 있습니다.',
	FileRenaming	: '변경 중...',
	FileDelete		: '정말 %1 파일을 삭제하시겠습니까?',
	FilesDelete	: '정말 %1개 파일을 삭제하시겠습니까?',
	FilesLoading	: '로딩 중...',
	FilesEmpty		: '폴더가 비어있습니다.',
	DestinationFile	: '목적지 파일',
	SkippedFiles	: '건너뛴 파일:',

	// Basket -- removed
	BasketFolder		: 'Basket',
	BasketClear			: 'Clear Basket',
	BasketRemove		: 'Remove from Basket',
	BasketOpenFolder	: 'Open Parent Folder',
	BasketTruncateConfirm : 'Do you really want to remove all files from the basket?',
	BasketRemoveConfirm	: 'Do you really want to remove the file "%1" from the basket?',
	BasketRemoveConfirmMultiple	: 'Do you really want to remove %1 files from the basket?',
	BasketEmpty			: 'No files in the basket, drag and drop some.',
	BasketCopyFilesHere	: 'Copy Files from Basket',
	BasketMoveFilesHere	: 'Move Files from Basket',

	// Global messages
	OperationCompletedSuccess	: '작업이 완료되었습니다.',
	OperationCompletedErrors		: '작업 도중에 오류가 발생하였습니다.',
	FileError				: '%s: %e',

	// Move and Copy files
	MovedFilesNumber		: '이동한 파일 수: %s.',
	CopiedFilesNumber	: '복사한 파일 수: %s.',
	MoveFailedList		: '해당 파일은 이동할 수 없습니다:<br />%s',
	CopyFailedList		: '해당 파일은 복사할 수 없습니다:<br />%s',

	// Toolbar Buttons (some used elsewhere)
	Upload		: '업로드',
	UploadTip	: '새 파일 업로드',
	Refresh		: '새로고침',
	Settings	: '설정',
	Help		: 'Help',
	HelpTip		: 'Help',

	// Context Menus
	Select			: '선택',
	SelectThumbnail : '썸네일 선택',
	View			: '이미지 보기',
	Download		: '다운로드',

	NewSubFolder	: '새 폴더 만들기',
	Rename			: '이름 변경',
	Delete			: '삭제',
	DeleteFiles		: '삭제',

	CopyDragDrop	: '여기로 복사하기',
	MoveDragDrop	: '여기로 이동하기',

	// Dialogs
	RenameDlgTitle		: '이름 변경',
	NewNameDlgTitle		: '새 이름',
	FileExistsDlgTitle	: '알림',
	SysErrorDlgTitle : '시스템 오류',

	FileOverwrite	: '덮어쓰기',
	FileAutorename	: '자동 이름변경',
	ManuallyRename	: '직접 이름변경',

	// Generic
	OkBtn		: '확인',
	CancelBtn	: '취소',
	CloseBtn	: '닫기',

	// Up드oad Panel
	UploadTitle			: '업로드',
	UploadSelectLbl		: '업로드할 파일을 선택하세요',
	UploadProgressLbl	: '(업로드 중입니다, 기다려주세요...)',
	UploadBtn			: '선택한 파일 업로드',
	UploadBtnCancel		: '취소',

	UploadNoFileMsg		: '컴퓨터에서 파일을 선택해주세요.',
	UploadNoFolder		: '업로드 전에 폴더를 선택해 주십시오.',
	UploadNoPerms		: '권한이 없어 파일을 업로드할 수 없습니다.',
	UploadUnknError		: '파일 전송 중에 오류가 발생하였습니다.',
	UploadExtIncorrect	: '이 폴더에서 유효하지 않은 파일 확장자입니다.',

	// Flash Uploads
	UploadLabel			: '파일 업로드',
	UploadTotalFiles	: '전체 파일 수:',
	UploadTotalSize		: '전체 크기:',
	UploadSend			: '업로드',
	UploadAddFiles		: '파일 추가',
	UploadClearFiles	: '파일 지우기',
	UploadCancel		: '업로드 취소',
	UploadRemove		: '제거',
	UploadRemoveTip		: '제거 !f',
	UploadUploaded		: '업로드 중 !n%',
	UploadProcessing	: '진행 중...',

	// Settings Panel
	SetTitle		: '설정',
	SetView			: '보기:',
	SetViewThumb	: '미리보기',
	SetViewList		: '리스트',
	SetDisplay		: '표시:',
	SetDisplayName	: '파일 이름',
	SetDisplayDate	: '날짜',
	SetDisplaySize	: '파일 크기',
	SetSort			: '정렬:',
	SetSortName		: '파일 이름',
	SetSortDate		: '날짜',
	SetSortSize		: '파일 크기',
	SetSortExtension		: '확장자',

	// Status Bar
	FilesCountEmpty : '<빈 폴더>',
	FilesCountOne	: '1 file',
	FilesCountMany	: '%1 files',

	// Size and Speed
	Kb				: '%1 KB',
	Mb				: '%1 MB',
	Gb				: '%1 GB',
	SizePerSecond	: '%1/s',

	// Connector Error Messages.
	ErrorUnknown	: '요청을 완료할 수 없었습니다. (오류 %1)',
	Errors :
	{
	 10 : '올바르지 않은 명령.',
	 11 : '요청에서 리소스 유형이 특정되지 않았습니다.',
	 12 : '요청한 리소스 유형이 올바르지 않습니다.',
	102 : '올바르지 않은 파일 또는 폴더 이름.',
	103 : '인증 제한 때문에 작업을 완료할 수 없었습니다.',
	104 : '파일 시스템 권한 제한 때문에 작업을 완료할 수 없었습니다.',
	105 : '올바르지 않은 파일 확장자.',
	109 : '올바르지 않은 요청.',
	110 : '알 수 없는 오류.',
	111 : '파일 크기 때문에 요청을 완료할 수 없습니다.',
	115 : '이미 같은 이름의 파일이나 폴더가 존재합니다.',
	116 : '폴더를 찾지 못하였습니다. 새로고침을 해 보시고 다시 시도해 주십시오.',
	117 : '파일을 찾지 못하였습니다. 새로고침을 해 보시고 다시 시도해 주십시오.',
	118 : '원본 폴더와 대상 폴더가 동일합니다.',
	201 : '이미 같은 이름의 파일이 존재합니다. 해당 업로드 파일의 이름이 "%1" 로 변경되었습니다.',
	202 : '올바르지 않은 파일.',
	203 : '올바르지 않은 파일. 파일 용량이 너무 큽니다.',
	204 : '업로드한 파일이 손상되어 있습니다.',
	205 : '서버에 업로드를 위한 임시 폴더가 사용가능하지 않습니다.',
	206 : '보안상의 이유로 업로드가 중단되었습니다. 해당 파일은 HTML 같은 데이터가 포함되어 있습니다.',
	207 : '업로드한 파일의 이름이 "%1" 로 변경되었습니다.',
	300 : '파일 이동 실패.',
	301 : '파일 복사 실패.',
	500 : '파일 브라우저가 보안상의 이유로 비활성화 되어있습니다. 당신의 시스템 관리자에게 연락을 해 보시고 CKFinder의 설정 파일을 확인해 주십시오.',
	501 : '미리 보기 지원이 비활성화 되어 있습니다.'
	},

	// Other Error Messages.
	ErrorMsg :
	{
		FileEmpty		: '파일 이름이 비어있습니다.',
		FileExists		: '%s 파일이 이미 존재합니다.', // %s 사용가능
		FolderEmpty		: '폴더 이름이 비어있습니다.',
		FolderExists	: '폴더가 이미 존재합니다.',
		FolderNameExists	: '폴더 이름이 이미 존재합니다.',

		FileInvChar		: '파일 이름은 해당 기호를 포함할 수 없습니다: \n\\ / : * ? " < > |',
		FolderInvChar	: '폴더 이름은 해당 기호를 포함할 수 없습니다: \n\\ / : * ? " < > |',

		PopupBlockView	: '새 창에서 파일을 열 수 없습니다. 브라우저에서 팝업을 열 수 있도록 설정해 주십시오.',
		XmlError		: 'XML 응답을 로딩할 수 없습니다.',
		XmlEmpty		: 'XML 응답을 로딩할 수 없습니다. 응답이 비어있습니다.',
		XmlRawResponse	: 'Raw response from the server: %s'
	},

	// Imageresize plugin
	Imageresize :
	{
		dialogTitle		: '크기변경 %s',
		sizeTooBig		: '원본 이미지보다 너비나 높이가 크게 설정할 수 없습니다 (%size).',
		resizeSuccess	: '이미지 크기가 변경되었습니다.',
		thumbnailNew	: '새 이미지 생성',
		thumbnailSmall	: '작음 (%s)',
		thumbnailMedium	: '보통 (%s)',
		thumbnailLarge	: '큼 (%s)',
		newSize			: '크기 설정',
		width			: '너비',
		height			: '높이',
		invalidHeight	: '유효하지 않은 높이입니다.',
		invalidWidth	: '유효하지 않은 너비입니다.',
		invalidName		: '유효하지 않는 이름입니다.',
		newImage		: '새 이미지 생성',
		noExtensionChange : '파일 확장자는 변경할 수 없습니다.',
		imageSmall		: '이미지가 너무 작습니다.',
		contextMenuName	: '크기 변경',
		lockRatio		: '비율 유지',
		resetSize		: '크기 초기화'
	},

	// Fileeditor plugin
	Fileeditor :
	{
		save			: '저장',
		fileOpenError	: '파일을 열 수 없습니다.',
		fileSaveSuccess	: '파일이 저장되었습니다.',
		contextMenuName	: '편집',
		loadingFile		: '로딩중입니다, 잠시만 기다려주세요...'
	},

	Maximize :
	{
		maximize : '최대화',
		minimize : '이전 크기로'
	},

	Gallery :
	{
		current : 'Image {current} of {total}'
	},

	Zip :
	{
		extractHereLabel	: 'Extract here',
		extractToLabel		: 'Extract to...',
		downloadZipLabel	: 'Download as zip',
		compressZipLabel	: 'Compress to zip',
		removeAndExtract	: 'Remove existing and extract',
		extractAndOverwrite	: 'Extract overwriting existing files',
		extractSuccess		: 'File extracted successfully.'
	},

	Search :
	{
		searchPlaceholder : '검색'
	}
};
