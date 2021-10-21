/*
    * 개요
       bizCommon.js는 업무에서 빈번히 사용되는 function을 정리한 funcion 목록이다.
       bizCommon.js는 WebSquare에서 공식적으로 제공하는 functoin은 아니다.
       사이트별로 커스트마이징이 필요하며, 확장 및 수정이 가능하다.
       확장 및 수정시 업무개발 영역으로 copy후 사용한다. bizCommon.js 자체 파일 수정은 불가 한다.

    * function 분류
        1. 업무적으로 필요한 WebSquare 공통 function
        2. 업무적으로 필요한 Format 관련 function
        3. 업무적으로 필요한 Util function

    * function 목록
         1.1. -                 -
         2.1.  ssnMask           주민등록번호에 "-"가 없는 경우 "-"를 추가한다.
         2.2.  ssnAstarMask      주민등록번호에 "-"가 없는 경우 "-"를 추가하며 뒤에 6자리를 *로 처리한다.
         2.3.  accountAstarMask  계좌번호의 숫자기준으로  7자리 이후를 *로 표시한다.
         2.4.  postMask          우편번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
         2.5.  corpNoMask        사업자번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
         2.6.  corpJuminMask     사업자번호, 주민번호 일때, "-"가 없는 경우 "-"를 추가하여 표시한다.
         2.7.  telephoneMask     전화번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
         2.8.  toFormatNumber    숫자에 포맷을 적용한다.
         2.9.  setAmtUnit        금액을 단위금액으로 표시한다.
         2.10. checkID           길이에 따라 주민번호/사업자번호/법인 번호를 검사한다.
         2.11. checkBizID        사업자등록번호를 검사한다.
         2.12. checkCorpID       법인등록번호를  검사한다.
         2.13. checkPersonID     내외국인 주민등록번호를 체크한다.
         3.1.  chkNumberFormat   자리수를 비교한다.
         3.2.  isNumber          입력받은 문자열이 숫자이면 true, 아니면 false를 리턴한다.
         3.3.  isEnglish         입력받은 문자열이  모두 영단어이면 true, 아니면 false를 리턴한다.
         3.4.  hasNumOrLetter    입력받은 문자열이 모두 영문또는 숫자로 되어 있으면 true, 아니면 false를 리턴한다.
         3.5.  isKoreanWord      단어에 한글이 포함되어 있으면 true, 아니면 false를 리턴한다.
         3.6.  isKorean          단어에 한글이 포함되어 있으면 true, 아니면 false를 리턴한다.
         3.7.  checkChar         특수 문자가 포함된 경우 true 아니면 false를 리턴한다.
         3.8.  isContinuous      연속된 숫자나 문자이면 true, 아니면 false를 리턴한다.
*/

/**
 * 2.1. ssnMask : 주민등록번호에 "-"가 없는 경우 "-"를 추가한다.
 * @param   str : 주민등록번호
 * @return  123456-1234567
 * @example ssnMask("1234561234567");
 */
function ssnMask( str ) {
    var pos = -1;

    // 1. test pos value
    pos = str.indexOf("-");
    if( pos > -1 && ( pos != 6 || str.length <= 7 ) ) {
        str = str.slice(0, pos) + str.slice(pos+1, str.length);
    }

    // 2. add "-"
    pos = str.indexOf("-");
    if( pos == -1 && str.length >= 7 ) {
        str = str.slice(0, 6) + "-" + str.slice(6, str.length);
    }

    // 3. check max length
    if( str.length > 14 ) {
        str = str.slice(0, 14);
    }

    return str;
}

/**
 * 2.2. ssnAstarMask : 주민등록번호에 "-"가 없는 경우 "-"를 추가하며 뒤에 6자리를 *로 처리한다.
 * @param   str : 주민등록번호
 * @return  123456-1******
 * @example ssnAstarMask("1234561234567");
 */
function ssnAstarMask( str ) {
    if( str.indexOf("-") >= 0 ) {
        var pos = str.indexOf("-");
        retValue = str.substring(0, pos) + str.substring(pos+1);
    } else {
        retValue = str;
    }

    if( retValue.length > 7 ) {
        retValue = retValue.substring(0, 6) + "-" + retValue.substring(6, 7) + "*******".substring(0, retValue.length-7);
    } else if(retValue.length > 6 ){
        retValue = retValue.substring(0, 6) + "-" + retValue.substring(6);
    }
    return retValue;
}


/**
 * 2.3. accountAstarMask : 계좌번호의 숫자기준으로  7자리 이후를 *로 표시한다.
 *                         (은행마다 계좌번호 체계가 다르므로 커스터마이징이 필요 하다 )
 * @param   str : 계좌번호
 * @return  082-123***-**-***
 * @example accountAstarMask("082-123456-02-123");
 */
function accountAstarMask( str ) {
    var retValue = "";
    var idx = 0;

    for( var i=0; i<str.length; i++ ) {
        var oneChar = str.charAt(i);
        if( oneChar == "-" ) {
            retValue += oneChar;
        } else {
            idx++;
            retValue = (idx>6) ? retValue + "*" : retValue + oneChar;
        }
    }

    return retValue;
}

/**
 * 2.4. postMask : 우편번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
 *                 grid에서 importExp에서도 사용가능하다.
 * @param   str : 우편번호
 * @return  123-456
 * @example postMask("123456");
 */
function postMask( str ) {
    var pos = -1;

    // 1. test pos str
    pos = str.indexOf("-");
    if( pos>-1 && ( pos != 3 || str.length <= 4 ) ) {
        str = str.slice(0, pos) + str.slice(pos+1, str.length);
    }

    // 2. add "-"
    pos = str.indexOf("-");
    if( pos == -1 && str.length >= 4){
        str = str.slice(0, 3) + "-" + str.slice(3, str.length);
    }

    // 3. check max length
    if( str.length > 7 ) {
        str = str.slice(0, 7);
    }

    return str;
}

/**
 * 2.5. corpNoMask : 사업자번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
 *                   grid에서 importExp에서도 사용가능하다.
 * @param   str : 사업자번호
 * @return  123-45-67890
 * @example corpNoMask("1234567890");
 */
function corpNoMask( str ) {
    var pos = str.indexOf("-");
    var lastPos = str.lastIndexOf("-");

    if( lastPos == 6 && str.length <= 7 ) {
        str = str.slice(0, lastPos) + str.slice(lastPos+1, str.length);
    }
    if( lastPos == 3 && str.length <= 4 ) {
        str = str.slice(0, lastPos) + str.slice(lastPos+1, str.length);
    }

    // 2. add "-"
    pos = str.indexOf("-");
    if( pos == -1 && str.length >= 4 ) {
        str = str.slice(0, 3) + "-" + str.slice(3, str.length);
    }

    pos = str.indexOf("-");
    var lastPos = str.lastIndexOf("-");
    if( pos == 3 && str.length >= 7 && lastPos == pos ) {
        str = str.slice(0, 6) + "-" + str.slice(6, str.length);
    }

    // 3. check max length
    if( str.length > 12 ) {
        str = str.slice(0, 12);
    }

    return str;
}

/**
 * 2.6. corpJuminMask : 사업자번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
 *                      ( grid에서 importExp에서도 사용가능하다. )
 * @param   str : 사업자번호 또는 주민번호
 * @return  123-45-67890, 123456-1234567
 * @example corpNoMask("1234567890");, corpNoMask("1234561234567");
 */
function corpJuminMask( str ) {
    var pos = str.indexOf("-");
    var lastPos = str.lastIndexOf("-");

    if( lastPos == 6 && str.length <= 7 ) {
        str = str.slice(0, lastPos) + str.slice(lastPos+1, str.length);
    }
    if( lastPos == 3 && str.length <= 4 ) {
        str = str.slice(0, lastPos) + str.slice(lastPos+1, str.length);
    }

    // 2. add "-"
    pos = str.indexOf("-");
    if( pos == -1 && str.length >= 4 ) {
        str = str.slice(0, 3) + "-" + str.slice(3, str.length);
    }

    pos = str.indexOf("-");
    var lastPos = str.lastIndexOf("-");
    if( pos == 3 && str.length >= 7 && lastPos == pos ) {
        str = str.slice(0, 6) + "-" + str.slice(6, str.length);
    }

    var sregExp = /-/g;
    // 3. check max length
    if( str.length > 12 ) {
        str = str.replace(sregExp, "");
        str = str.slice(0, 6) + "-" + str.slice(6, str.length);
    }

    // 3. check max length
    if( str.length > 14 ) {
        str = str.slice(0, 14);
    }
    return str;
}

/**
 * 2.7. telephoneMask : 전화번호의 "-"가 없는 경우 "-"를 추가하여 표시한다.
 *                      ( grid에서 importExp에서도 사용가능하다. )
 * @param   str : 전화번호
 * @return  02-2663-1234
 * @example telephoneMask("0226631234");
 */
function telephoneMask( str ) {
    var delimeter1 = "-";
    var delimeter2 = "-";

    var firstDelimeterPos = 3;
    var maxLength = 11 + delimeter1.length + delimeter2.length;

    if( str.indexOf("02") == 0 ) {
        firstDelimeterPos -= 1;
        maxLength -= 1;
    }

    // limit max length
    if( str.length > maxLength ) {
        str = str.substr(0, maxLength);
    }

    // remove delimeter
    var regExp = new RegExp("[0-9]*", 'g');
    var result = (str + "").match(regExp);
    str = result.join("");

    // 1st delimeter
    if( str.length > firstDelimeterPos ) {
        str = str.substr(0, firstDelimeterPos) + delimeter1 + str.substr(firstDelimeterPos, str.length);
    }

    // 2nd delimeter
    if( str.length > firstDelimeterPos + delimeter1.length + 4 ) {
        str = str.substr(0, str.length-4) + delimeter2 + str.substr(str.length-4, str.length);
    }

    return str;
}

/**
 * 2.8. toFormatNumber : 숫자에 포맷을 적용한다.
 * @param   target : 숫자
 * @param   format : 숫자포맷
 * @example toFormatNumber(1234.567, "#,###.##") => 1,234.56
 * @example toFormatNumber("1234.5", "#,###.00") => 1,234.50
 */
function toFormatNumber( target, format ) {
    var returnValue = "";
    target = "" + target;
    var p = format.indexOf(".");
    var p1 = target.indexOf(".");
    var positive = "";
    var negative = "";
    var max = 99;
    var d = false;

    if( p < 0 ) {
        p = format.length;
    }

    if( p1 < 0 ) {
        p1 = target.length;
    }

    if( format.indexOf(",") >= 0) {
        d = true;
        max = format.substring(format.indexOf(","), p).length;
    }

    for( var i=p1-1; i>=0; i-- ) {
        if( d && i != 0 && (p1-i)%3 == 0 ) {
            positive = "," + target.charAt(i) + positive;
        } else {
            positive = target.charAt(i) + positive;
        }
    }

    for( var i=p+1; i<format.length; i++ ) {
        p2 = p1 + (i-p);
        if( target.length <= p2 ) {
            if( format.charAt(i) == "0" ) {
                negative = negative + "0";
            }
        } else {
            negative = negative + target.charAt(p2);
        }
    }

    if( negative.length>0 ) {
        returnValue = positive + "." + negative;
    } else {
        returnValue = positive;
    }
    return returnValue;
}

/**
 * 2.9. setAmtUnit : 금액을 단위금액으로 표시한다.
 * @param   amt  : 금액
 * @param   unit : 단위금액
 * @example setAmtUnit(1234567, 1000)
 */
function setAmtUnit( amt, unit) {
    var digit = parseInt( unit ,10 );
    var amt = parseFloat( amt , 10 );
    amt = amt/digit;
    var ret = toFormatNumber(amt, "#,###");
    return ret;
}

/**
 * 2.10. checkID : 길이에 따라 주민번호/사업자번호/법인 번호를 검사한다.
 * @param word : 문자열
 * @return 올바른 번호가 아닌경우 false
 * @example checkID("9701011234567");
 */
function checkID(str) {
    var len = str.length;
    
    if(len == 10) {
        return checkBizID(str);
    } else if(len == 12) {
        return checkCorpID(str);
    } else if(len == 13) {
        return checkPersonID(str);
    }

    return false;
}

/**
 * 2.11. checkBizID : 사업자등록번호를 검사한다.
 * @param word : 문자열
 * @return 올바른 번호가 아닌경우 false
 * @example checkBizID("1101112345");
 */
function checkBizID(str) {
    var sum = 0;
    var aBizID =new Array(10);
    var checkID =new Array("1","3","7","1","3","7","1","3","5");

    for (var i=0;i<10;i++){
        aBizID[i] = str.substring(i,i+1);
    }
    for (var i=0;i<9;i++){
        sum += aBizID[i]*checkID[i];
    }

    sum = sum + parseInt((aBizID[8]*5)/10) ;
    temp = sum%10;
    temp1 = 0;

    if( temp != 0 ) {
        temp1 = 10 - temp;
    } else {
        temp1 = 0;
    }

    if( temp1 != aBizID[9] ) {
        return false;
    }
    return true;
}

/**
 * 2.12. checkCorpID : 법인등록번호를  검사한다.
 * @param word : 문자열
 * @return 올바른 번호가 아닌경우 false
 * @example checkCorpID("110211234567");
 */
function checkCorpID(str) {
    var  checkID = new Array(1,2,1,2,1,2,1,2,1,2,1,2);
    var  sCorpNo = str;

    var  lV1 = 0;
    var  nV2 = 0;
    var  nV3 = 0;

    for( var i=0 ; i<12 ; i++ ) {
        lV1 = parseInt(sCorpNo.substring(i, i+1)) * checkID[i];

        if(lV1 >= 10) {
            nV2 += lV1 % 10;
        } else {
            nV2 += lV1;
        }
    }

    nV3 = nV2 % 10;

    if( nV3 > 0 ) {
        nV3 = 10 - nV3;
    } else {
        nV3 = 0;
    }
    if( sCorpNo.substring(12,13) != nV3) {
        return false;
    }
    return true;
}

/**
 * 2.13. checkPersonID : 내외국인 주민등록번호를 체크한다.
 * @param word : 문자열
 * @return 올바른 번호가 아닌경우 false
 * @example checkPersonID("6601011234567");
 */
function checkPersonID(str) {
    var checkID = new Array(2,3,4,5,6,7,8,9,2,3,4,5);
    var aPersonID = new Array(13);
    var i=0, sum=0;
    var temp=0, temp1=0, temp2=0;
    var yy = "";

    if(str.length != 13) {
        return false;
    }
    for(i=0;i<13;i++) {
        if(str.charAt(i)<'0' || str.charAt(i)>'9')  {
            return false;
        }
    }

    //foreigner PersonID Pass
    if (str.substring(6,13) == "5000000" || str.substring(6,13) == "6000000"
    || str.substring(6,13) == "7000000" || str.substring(6,13) == "8000000") {
        return true;
    }

    for(i=0;i<12;i++){
        sum += str.charAt(i) * checkID[i];
    }

    temp = sum - Math.floor(sum/11)*11;
    temp = 11 - temp;
    temp = temp - Math.floor(temp/10)*10;

    // 나이 (-) 체크
    if( str.charAt(6) == '1' || str.charAt(6) == '2' || str.charAt(6) == '5' || str.charAt(6) == '6' ) {
        yy = "19";
    } else {
        yy = "20";
    }
    if( parseInt(getCurrentDate('yyyy')) - parseInt(yy + str.substring(0,2) ) < 0 ) {
        return false;
    }

    //외국인 주민번호 체크로직 추가
    if( str.charAt(6) != '5' && str.charAt(6) != '6' && str.charAt(6) != '7' && str.charAt(6)!= '8' ) {
        if( temp==eval(str.charAt(12)) ) {
            return true;
        } else {
            return false;
        }
    } else {
        if( (temp + 2)%10 == eval(str.charAt(12)) ) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}


/**
 * 3.1. chkNumberFormat : 자리수를 비교한다.
 * @param number : 숫자
 * @param format : 자리수 (전체자리수.소수점자리수)
 * @example chkNumberFormat(1234.567, 10.3) => true
 * @example chkNumberFormat("1234.567", 7.2) => false
 */
function chkNumberFormat( amt, format) {
    amt = "" + amt;
    format = "" + format;

    var p1 = amt.indexOf(".");
    var p = format.indexOf(".");
    var positiveSize = 0;
    var negativeSize = 0;

    if( p1 < 0 ) {
        p1 = amt.length;
    }

    if( p < 0 ) {
        positiveSize = parseInt(format);
    } else {
        positiveSize = parseInt( format.substring(0, p) ) - negativeSize;
        negativeSize = parseInt( format.substring(p+1) );
    }

    if( p1 > positiveSize || negativeSize < amt.substring(p1+1).length) {
        return false;
    } else {
        return true;
    }
}

/**
 * 3.2. isNumber : 입력받은 문자열이 숫자이면 true, 아니면 false를 리턴한다.
 * @param   word : 문자열
 * @return  숫자이면 true 그외는 false
 * @example isNumber("123456");
 */
function isNumber( word ) {
    var c;

    for( var i=0; i<word.length; i++ ) {
        c = word.charAt(i);
        if( ( c < '0' || c > '9' ) && c != ',' ) {
            return false;
        }
    }
    return true;
}


/**
 * 3.3. isEnglish : 입력받은 문자열이  모두 영단어이면 true, 아니면 false를 리턴한다.
 * @param   word : 문자열
 * @return  영단어이면 true, 아니면 false
 * @example isEnglish("abcdefg");
 */
function isEnglish( word ) {
    var c;

    for( var i=0; i<word.length; i++ ) {
        c = word.toLowerCase().charAt(i);
        if( c < 'a' || c > 'z' ) {
            return false;
        }
    }
    return true;
}

/**
 * 3.4. hasNumOrLetter : 입력받은 문자열이 모두 영문또는 숫자로 되어 있으면 true, 아니면 false를 리턴한다.
 * @param   word : 문자열
 * @return  영단어이면 true, 아니면 false
 * @example hasNumOrLetter("abc123de4fg");
 */
function hasNumOrLetter( word ) {
    var c;
    var flag = false;
    for( var i=0; i<word.length; i++ ) {
        c = word.toLowerCase().charAt(i);
        if( ( c >= 'a' && c <= 'z' ) || ( c >= '0' && c <= '9' ) ) {
        	flag = true;
        } else {
        	flag = false;
        	break;
        }
    }
    return flag;
}

/**
 * 3.5. isKoreanWord : 단어에 한글이 포함되어 있으면 true, 아니면 false를 리턴한다.
 * @param   word : 문자열
 * @return  한글이 포함되어 있으면 true, 아니면 false
 * @example isKoreanWord("무궁화꽃이");
 */
function isKoreanWord( word ) {
    var c;

    for( var i=0; i<word.length; i++ ) {
        c = word.charAt(i);
        if( isKorean(c) ) {
            return true;
        }
    }
    return false;
}

/**
 * 3.6. isKorean : 단어에 한글이 포함되어 있으면 true, 아니면 false를 리턴한다.
 * @param   str : 문자열
 * @return  한글이 포함되어 있으면 true, 아니면 false
 * @example isKorean("abcd무궁화");
 */
function isKorean( str ) {
    if( str != null && str.length > 0 ) {
        var locale = 0;
        for( var i = 0 ; i < str.length ; i++ ) {
            locale |= _getLocale( str.charAt(i) );
        }

        if( ( locale & ~0x3 ) == 0 ) {
            return true;
        }
    }
    return false;
}

function _getLocale( str ) {
    var locale = 0;
    if ( str.length > 0 ) {
        var charCode = str.charCodeAt( 0 );
        if ( charCode >= 0XAC00 && charCode <= 0XD7A3 ) {   // 한글음절.[ 44032 ~ 55203 ]
            locale = 0X1;
        } else if ( ( charCode >= 0X1100 && charCode <= 0X11F9 ) || ( charCode >= 0X3131 && charCode <= 0X318E )    ) {    // 한글자모.[ 4352 ~ 4601 ]
            locale = 0X2;
        } else if ( charCode >= 0X30 && charCode <= 0X39 ) {    // 숫자.[ 48 ~ 57 ]
            locale = 0X4;
        } else if ( ( charCode >= 0X20 && charCode <= 0X2F ) || ( charCode >= 0X3A && charCode <= 0X40 )
                 || ( charCode >= 0X5B && charCode <= 0X60 ) || ( charCode >= 0X7B && charCode <= 0X7E ) ) {    // 특수문자
            locale = 0X8;
        } else if ( charCode >= 0X41 && charCode <= 0X5A ) {    // 영문 대.[ 65 ~ 90 ]
            locale = 0X10;
        } else if ( charCode >= 0X61 && charCode <= 0X7A ) {    // 영문 소.[ 97 ~ 122 ]
            locale = 0X20;
        } else {    // 기타
            locale = 0X30;
        }
    }

    return locale;
}

/**
 * 3.7. checkChar : 특수 문자가 포함된 경우 true 아니면 false를 리턴한다.
 * @param   word : 문자열
 * @return  특수 문자가 포함된 경우 true 아니면 false
 * @example checkChar("abcd##무궁화");
 */
function checkChar( str ){
    var m_Sp = /[$\\@\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\|]/;
    var m_val = str;
    var strLen = m_val.length;
    var m_char = m_val.charAt((strLen) - 1);
    if(m_char.search(m_Sp) != -1) {
        return false;
    }
    return true;
}

/**
 * 3.8. isContinuous : 연속된 숫자나 문자이면 true, 아니면 false를 리턴한다.
 * @param   word : 문자열
 * @return  연속된 숫자나 문자이면 true, 아니면 false
 * @example isContinuous("abcd##무궁화");
 */
function isContinuous( word ) {
    var c0, c, c1;

    var con = true;
    var con1 = true;
    var con2 = true;

    for(var i=1; i<word.length; i++) {
        c0 = parseInt(word.charCodeAt(i-1));
        c = parseInt(word.charCodeAt(i));
        c1 = parseInt(word.charCodeAt(i-1)) + 1;

        if(c!=c0) {
            con1 = false;
        }
        if(c!=c1) {
            con2 = false;
        }
    }

    if(con1 == false && con2 == false) {
        con = false;
    }

    return con;
}