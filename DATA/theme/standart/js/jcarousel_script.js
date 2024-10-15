

// For products
function SendProductNewsForm(productId) {
    window.open('SendProductNewsForm.aspx?productId=' + productId,
				'_blank',
				'width=500,height=200,left=100,top=100');
}


// For Logs
function ShowModalPortalLogs(page) {
    window.showModalDialog(page, null, "dialogWidth:470px;dialogHeight:280px;edge:raised;resizable:yes;scroll:no;status:no");
}





function SendNewsForm(filePath, itemId) {
    window.open(filePath + itemId, '_blank',
				'width=500,height=200,left=100,top=100', 'false');
}



// For products
function OpenProductDetails(filePath, itemId) {
    var PrdPopUp = window.open(filePath + itemId, 'PrdPopUp',
									'scrollbars=yes,width=700,height=550,left=1,top=1', 'true');

    if (PrdPopUp != null) {
        PrdPopUp.focus();
    }
}


// Open child window
function openInstallments(price, height, width) {
    var x, y;
    x = (self.screen.availHeight - height) / 2;
    y = (self.screen.availWidth - width) / 2;

    var winAtts = 'width=' + width + ' , height=' + height + ', toolbar=no, scrollbars=yes, directories=no, left=' + y + ',top=' + x + ' ';
    var chidPopUp = window.open('/Store/ProductInstallments.aspx?price=' + price, 'installments', winAtts);

    if (chidPopUp != null) {
        chidPopUp.focus();
    }
}



//..............

// Script  for Category Selection

function OpenSelectionWindow(idname, url, postBack, wName, width, height, hasParam, sbars, status) {
    var x, y;
    x = (self.screen.availHeight - height) / 2;
    y = (self.screen.availWidth - width) / 2;
    var _strUrl
    if (hasParam == 1) { url += '&'; }
    else { url += '?'; }
    popUpSelectionWindow = window.open(url + 'formname=' + document.forms[0].name +
				'&id=' + idname + '&postBack=' + postBack,
				wName,
				'width=' + width + ',height=' + height + ',left=' + y + ',top=' + x + ',scrollbars=' + sbars + ',status=' + status);
    if (popUpSelectionWindow != null) {
        popUpSelectionWindow.focus();
    }
}


// return selected Imageid
function SetFieldData(formName, id, data, postBack) {
    //eval('var theform = document.' + formName + ';');
    window.opener.document.forms[0].elements[id].value = data; ;
    window.close();
    if (postBack)
        window.opener.__doPostBack(id, '');
}

//.............


// Open child window
function openChild(_file, wName, width, height, sbar) {
    var x, y;
    x = (self.screen.availHeight - height) / 2;
    y = (self.screen.availWidth - width) / 2;
    if (sbar == null) { sbar = 0 }
    winAtts = 'width=' + width + ', height=' + height + ', toolbar=no, scrollbars=' + sbar + ', directories=no, top=' + x + ', left=' + y;
    var ChidPopUp = window.open(_file, wName, winAtts);
    if (ChidPopUp != null) {
        ChidPopUp.focus();
    }
}



function CloseMe() {
    eval('var theform = document.' + formName + ';');
    popUp.close();

}

function Print() {
    window.print();
}


function SearchProduct(e, txtsearchid) {
    if (e == null || e.keyCode == 13) {
        var bt = document.getElementById(txtsearchid);
        window.location = "/store/Search.aspx?search=true&srchtxt=" + encodeURI(bt.value);
        return false;
    }
}


function clickButton(e, buttonid) {
    var bt = document.getElementById(buttonid);
    if (typeof bt == 'object') {
        if (navigator.appName.indexOf("Netscape") > (-1)) {
            if (e.keyCode == 13) {
                bt.click();
                return false;
            }
        }

        if (navigator.appName.indexOf("Microsoft Internet Explorer") > (-1)) {
            if (event.keyCode == 13) {
                bt.click();
                return false;
            }
        }
    }
}


function checkMaxLength(e, el) {
    switch (e.keyCode) {
        case 37: // left
            return true;
        case 38: // up
            return true;
        case 39: // right
            return true;
        case 40: // down
            return true;
        case 8: // backspace
            return true;
        case 46: // delete
            return true;
        case 27: // escape
            el.value = '';
            return true;
    }
    return (el.value.length < el.getAttribute("txtmaxlength"));
}


//asp.net radiobutton selection 
function SetUniqueRadioButton(nameregex, current, hdnElementid, elementValue)
{
   re = new RegExp(nameregex);
   for(i = 0; i < document.forms[0].elements.length; i++)
   {
      elm = document.forms[0].elements[i]
      if (elm.type == 'radio')
      {
         if (re.test(elm.name))
         {
            elm.checked = false;
         }
      }
   }
   current.checked = true;
   
   if(hdnElementid != null && elementValue != null)
   {
      var frmElement = document.getElementById(hdnElementid);
      if(frmElement != null)
      {
         frmElement.value = elementValue;
      }
   }
   __doPostBack(hdnElementid,'');
}



// Script Source: CodeLifter.com
// Copyright 2003
// Do not remove this notice.

// SETUPS:
// ===============================

// Set the horizontal and vertical position for the popup

PositionX = 100;
PositionY = 100;

// Set these value approximately 20 pixels greater than the
// size of the largest image to be used (needed for Netscape)

defaultWidth = 500;
defaultHeight = 500;

// Set autoclose true to have the window close automatically
// Set autoclose false to allow multiple popup windows

var AutoClose = true;

// Do not edit below this line...
// ================================
if (parseInt(navigator.appVersion.charAt(0)) >= 4) {
    var isNN = (navigator.appName == "Netscape") ? 1 : 0;
    var isIE = (navigator.appName.indexOf("Microsoft") != -1) ? 1 : 0;
}
var optNN = 'scrollbars=yes,width=' + defaultWidth + ',height=' + defaultHeight + ',left=' + PositionX + ',top=' + PositionY;
var optIE = 'scrollbars=yes,width=100,height=100,left=' + PositionX + ',top=' + PositionY;

function popImage(imageURL, imageTitle) {
    if (isNN) { imgWin = window.open('about:blank', '', optNN); }
    if (isIE) { imgWin = window.open('about:blank', '', optIE); }
    with (imgWin.document) {
        writeln('<html><head><title>Loading...</title><style>body{margin:0px;}</style>'); writeln('<sc' + 'ript>');
        writeln('var isNN,isIE;'); writeln('if (parseInt(navigator.appVersion.charAt(0))>=4){');
        writeln('isNN=(navigator.appName=="Netscape")?1:0;'); writeln('isIE=(navigator.appName.indexOf("Microsoft")!=-1)?1:0;}');
        writeln('function reSizeToImage(){'); writeln('if (isIE){'); writeln('window.resizeTo(100,100);');
        writeln('width=(document.images[0].width)+25;');
        writeln('height=(document.images[0].height)+90;');
        writeln('window.resizeTo(width,height);}'); writeln('if (isNN){');
        writeln('window.innerWidth=document.images["George"].width;'); writeln('window.innerHeight=document.images["George"].height;}}');
        writeln('function doTitle(){document.title="' + imageTitle + '";}'); writeln('</sc' + 'ript>');
        if (!AutoClose) writeln('</head><body bgcolor=FFFFFF scroll="auto" onload="reSizeToImage();doTitle();self.focus()">')
        else writeln('</head><body bgcolor=FFFFFF scroll="auto" onload="reSizeToImage();doTitle();self.focus()" onblur="self.close()">');
        writeln('<img align=absmiddle name="George" src="' + imageURL + '" style="display:block"></body></html>');
        close();
    }
}
