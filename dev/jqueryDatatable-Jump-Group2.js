var format = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-format/lib/string-format.js' );

var iFullNumbersShowPages = 5;
var oPagination = { "iFullNumbersShowPages": iFullNumbersShowPages };
var DataTable = { "ext": oPagination };

var oSettings =
    {
        "_iDisplayStart": -1,
        "_iDisplayLength": 5
    };

function calcTotalPageCount( oSettings )
{
    return parseInt(( oSettings.fnRecordsDisplay() - 1 ) / oSettings._iDisplayLength, 10 ) + 1;
}

function calcCurrentPageNum( oSettings )
{
    return Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ) + 1;
}

function calcPageNum( recordNr, oSettings )
{
    return Math.ceil( recordNr / oSettings._iDisplayLength );//+ 1;
}

function calcRecNum( pageNum, oSettings )
{
    var recNum = ( pageNum - 1 ) /
        oSettings._iDisplayLength * oSettings._iDisplayLength
        * oSettings._iDisplayLength;
    return recNum > 0 ? recNum : 0;
}

function calcPrevPageGroupPageNum( recNum, oSettings )
{
    var pageNum = calcPageNum( recNum, oSettings );
    var pageGroup = calcPageGroup( pageNum, oSettings );
    return ( ( pageGroup - 1 )
        * iFullNumbersShowPages )
        - oSettings._iDisplayLength + 1;
}

function calcNextPageGroupPageNum( recNum, oSettings )
{
    var pageNum = calcPageNum( recNum, oSettings );
    //var pageGroup = calcPageGroup( pageNum, oSettings );
    return ( pageNum * iFullNumbersShowPages )
        - iFullNumbersShowPages
        + 1;
}

function calcPageGroup( pageNum, oSettings )
{
    return Math.ceil(( pageNum - iFullNumbersShowPages ) / oSettings._iDisplayLength ) + 1;
}

String.prototype.lpad = function ( padString, length )
{
    var str = this;
    while ( str.length < length )
        str = padString + str;
    return str;
}

function doPrevGroup( records )
{
    console.log( "CurRec CurPage CurPageGroup PrevGroupPage TargetPrevGroupRecNum" );

    for ( var i = 0; i < records.length; i++ )
    {
        var recordNum = records[i];

        var pageNum = calcPageNum( recordNum, oSettings );
        var pgGroup = calcPageGroup( pageNum, oSettings );
        // PrevGroup uses:
        var prevPageGroupPageNum = calcPrevPageGroupPageNum( recordNum, oSettings );
        var targetPrevGroupRecNum = calcRecNum( prevPageGroupPageNum, oSettings );

        console.log(
            String( recordNum ).lpad( " ", 6 )
            + String( pageNum ).lpad( " ", 6 )
            + String( pgGroup ).lpad( " ", 12 )
            + String( prevPageGroupPageNum ).lpad( " ", 12 )
            + String( targetPrevGroupRecNum ).lpad( " ", 12 )
        );
    }
}

function doNextGroup( records )
{
    console.log( "CurRec CurPage CurPageGroup NextGroupPage TargetNextGroupRecNum" );

    for ( var i = 0; i < records.length; i++ )
    {
        var recordNum = records[i];

        var pageNum = calcPageNum( recordNum, oSettings );
        var pgGroup = calcPageGroup( pageNum, oSettings );

        // Next Group uses:
        var nextPageGroupPageNum = calcNextPageGroupPageNum( recordNum, oSettings );
        var targetNextGroupRecNum = calcRecNum( nextPageGroupPageNum, oSettings );

        console.log(
            String( recordNum ).lpad( " ", 6 )
            + String( pageNum ).lpad( " ", 6 )
            + String( pgGroup ).lpad( " ", 12 )
            + String( nextPageGroupPageNum ).lpad( " ", 12 )
            + String( targetNextGroupRecNum ).lpad( " ", 12 )
        );
    }
}

function calcEndButton( startPageButton, maxButtonCount, totalPageCount )
{
    var endPageButton = startPageButton + maxButtonCount - 1;
    endPageButton = totalPageCount - startPageButton < 1 ? startPageButton : endPageButton;
    if ( endPageButton > totalPageCount )
    {
        endPageButton = totalPageCount;
    }

    return endPageButton;
}

function calcStartPageButton( startPageButton, endPageButton )
{
    return Math.ceil(( endPageButton + startPageButton ) / 2 );
}
// GroupPage: {1: 1, 2: 6, 3: 11, 4: 16}
// PageRec: {1: 0, 6: 25, 11: 51, 16: 75}
//var recNums = [1, 25, 26, 35, 36, 46, 51, 60, 61, 75, 80];
var recNums = [1, 24, 25, 35, 51, 61, 75, 80, 120];
//doPrevGroup( recNums );
//doNextGroup( recNums );
