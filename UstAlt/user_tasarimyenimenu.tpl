<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" crossorigin="anonymous">
<link rel="stylesheet" href="/Data/EditorFiles/css/stil.css" media="all" rel="stylesheet" type="text/css">
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var topBanner = document.querySelector('.topBanner');
        var fiyatlistesi = document.querySelector('.fiyatlistesi');
        if (window.IS_VENDOR === 0) {
            topBanner.style.display = 'block';
            fiyatlistesi.style.display = 'none';
        } else {
            topBanner.style.display = 'none';
            fiyatlistesi.style.display = 'block';
        }
        // window.damla objesini oluştur
        window.damla = {};
        
        // Değerleri window.damla içine çek
        window.damla.pageType = PAGE_TYPE;
        window.damla.memberInfo = MEMBER_INFO;
        window.damla.isVendor = IS_VENDOR;
        window.damla.mobileActive = MOBILE_ACTIVE;
        window.damla.sepetMiktar = SEPET_MIKTAR;
        window.damla.sepetToplam = SEPET_TOPLAM;
        window.damla.sessionId = SESS_ID;
        window.damla.language = LANGUAGE;
        window.damla.currency = CURRENCY;
        window.damla.sepDec = SEP_DEC;
        window.damla.sepTho = SEP_THO;
        window.damla.serviceInfo = SERVICE_INFO;
        window.damla.cartCsrfToken = CART_CSRF_TOKEN;
        window.damla.csrfToken = CSRF_TOKEN;
        
        // Test amaçlı damla objesini console'a yazdır
        console.log(window.damla);
    });
</script>
<!-- Android app uyarı -->
{if $MobileAppRedirect!=false && $AppMarketLink!='' && $PAGE_ID == 1}
<script type="text/javascript">
  var isSafari = false;
</script>
<style>
  #mobileAppNotify, .MobileAppNotify{
    display : none;
  }
</style>
<script type="text/javascript">
  isSafari = (navigator.userAgent.toLowerCase().indexOf('android') != -1 && navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1) ||
  (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS'));
  
  $(document).ready(function () {
    
    if (!isSafari) {
      $('#mobileAppNotify').show();
      $('.MobileAppNotify').show();
    }
    
    $('#appNotifyClose').click(function () {
      $('#mobileAppNotify').fadeOut();
      setCookie('mobileApp', false);
    });
    if(getCookie('mobileApp') == undefined || getCookie('mobileApp') == null || getCookie('mobileApp') == ''){
      $('#mobileAppNotify').fadeIn();
    }
    else{
      $('#mobileAppNotify').remove();
    }
    
  });
  {if $MobileAppRedirect=='ios'}
  var storeUrl = "https://itunes.apple.com/app/id{$AppMarketLink}";
  var appUrl = "{$OpenAppLink}://";
  {else if $MobileAppRedirect=='android'}
  var storeUrl = "market://details?id={$AppMarketLink}";
  var appUrl = "{$OpenAppLink}://";
  {/if}
  $('head').append('<meta name="apple-itunes-app" content="app-id={$AppMarketLink}, affiliate-data=myAffiliateData, app-argument={$OpenAppLink}://">');
  var timeout;
  function openInApplication() {
    timeout = setTimeout(function () {
      document.location.href = storeUrl;
    }, 2000);
    
    document.location.href = appUrl;
  }
  
    $(document).ready(function () {
        timeout = setTimeout(function () {
          $('#tsoft-ecommerce-systems').remove();
        }, 2000);
    });
      
</script>
<script>
        window.onload = function () {
            setTimeout(function () {
                clickButton();
            }, 2000);
        }

        setTimeout(closeButton, 5000);

        function closeButton() {
            document.getElementById("close-button").style.display = "block";
            document.getElementById("close-button-1").style.display = "block";
        }

        function clickButton() {
            document.getElementById("tsoft").click();
        }   
    </script>

<div class="box col-12 whiteBg" id="mobileAppNotify">
  <div class="fl col-12" id="appNotify">
    <span class="box" id="appNotifyClose">×</span>
    <span class="fl btn-radius" id="appLogo">
      {$SITE_LOGO}
    </span>
    {if $MobileAppRedirect=='ios' || $MobileAppRedirect=='android'}
    <span id="appText" class="box">
      {#mobile_app_download#} - {if $MobileAppRedirect=='ios'}{#in_appstore#}{else}{#in_playstore#}{/if}
    </span>
    <a href="javascript:openInApplication()" class="fr btn btn-medium btn-link btn-radius" id="appBtn">{#mobile_app#}</a>
    {/if}
  </div>
</div>
{/if}
<!-- Android app uyarı -->
<div id="pageOverlay" class="col-12 animate"></div>
<div id="mobileMenu" class="box forMobile">
  <div class="box col-12 p-top">
    <div id="closeMobileMenu" class="col col-12 btn-upper">
      <div class="row mb">{#hide_menu#}</div>
    </div>
    <div class="box col-12 p-top">
      <div id="mobileSearch" class="row mb"></div>
    </div>
    <div class="btn btn-big col-12 btn-light btn-upper fw600 passive">
      <div class="row">{#categories#}</div>
    </div>
    <ul class="fl col-12 line-top">
      <li class="fl col-12 line-bottom">
        <a href="/" title="{#home#}" class="col col-12">{#home#}</a>
      </li>
      {foreach $TABS as $M}
      {if $M.CHILDREN|@count > 0}
      <li class="fl col-12 line-bottom">
        <span class="col col-12 ease"><i class="mdi mdi-{$M.URL|replace:"/":""}"></i>{$M.NAME}</span>
        <ul class="box col-12 p-top line-top">
          {foreach $M.CHILDREN as $C}
          {if $C.CHILDREN|@count > 0}
          <li class="fl col-12">
            <span class="col col-12">{$C.NAME}</span>
            <ul class="box col-12 line-top">
              {foreach $C.CHILDREN as $C2}
              <li class="fl col-12">
                <a  {if $M.NEWTAB === true} target="_blank" {/if} href="{$C2.URL}" title="{$C2.NAME}" class="col col-12">{$C2.NAME}</a>
              </li>
              {/foreach}
              <li class="fl col-12">
                <a href="{$C.URL}" class="col col-12">{#show_all#} »</a>
              </li>
            </ul>
          </li>
          {else}
          <li class="fl col-12">
            <a {if $M.NEWTAB === true} target="_blank" {/if} href="{$C.URL}" title="{$C.NAME}" class="col col-12">{$C.NAME}</a>
          </li>
          {/if}
          {/foreach}
          <li class="fl col-12">
            <a href="{$M.URL}" class="col col-12">{#show_all#} »</a>
          </li>
        </ul>
      </li>
      {else}
      <li class="fl col-12 line-bottom">
        <a {if $M.NEWTAB === true} target="_blank" {/if} href="{$M.URL}" title="{$M.NAME}" class="col col-12"><i class="mdi mdi-{$M.URL|replace:"/":""}"></i>{$M.NAME}</a>
      </li>
      {/if}
      {/foreach}
    </ul>
    <div class="col col-12 lightBg" id="mobileOptions">
      <div class="row">
        {if $DISPLAY_LANGUAGES == 1}
        <div class="box col-12 line-bottom">
          <label for="langMobile" class="col col-12">
            <div class="fl col-5">{#select_language#}</div>
            <div class="fl col-1">:</div>
            <div class="col col-6 p-right">
              <select id="langMobile" class="col col-12 language">
                {foreach $LANGUAGE_LIST as $L}
                <option value="{$L.CODE}"{if $LANGUAGE == $L.CODE} selected{/if}>{$L.TITLE}</option>
                {/foreach}
              </select>
            </div>
          </label>
        </div>
        {/if}
        {if count($CURRENCY_LIST) > 1}
        <div class="box col-12 line-bottom">
          <label for="curMobile" class="col col-12">
            <div class="fl col-5">{#currency#}</div>
            <div class="fl col-1">:</div>
            <div class="col col-6 p-right">
              <select id="curMobile" class="col col-12 currency p-top">
                {foreach $CURRENCY_LIST as $P}
                <option {if $P.SELECTED==1}selected{/if} value="{$P.TITLE}">{$P.TITLE}</option>
                {/foreach}
              </select>
            </div>
          </label>
        </div>
        {/if}
        <div class="box col-12 line-bottom">
          <div id="basketMobile" class="col col-12">
            <div class="fl col-5">
              <a href="/{$PAGE_LINK.CART}" class="fl col-12 bgNone" id="mobileBasketBtn">
                <span class="bgNone">{#basket#} (</span>
                <span class="bgNone cart-soft-count">0</span>
                <span>)</span>
              </a>
            </div>
            <div class="fl col-1">
              <a href="/{$PAGE_LINK.CART}" class="fl col-12 bgNone">:</a>
            </div>
            <div class="col col-6 p-right">
              <a href="/{$PAGE_LINK.CART}" class="col col-12 bgNone">
                <label class="bgNone cart-soft-price">0,00</label> {$CURRENCY}
              </a>
            </div>
          </div>
        </div>
        {if $IS_MEMBER_LOGGED_IN == true}
        <div class="box col-12 line-bottom">
          <a id="loginMobile" href="/{$PAGE_LINK.MEMBER_LOGIN}" class="col col-12">{#account#}</a>
        </div>
        <div class="box col-12">
          <a id="favMobile" href="/{$PAGE_LINK.MEMBER_SHOPPING_LIST}" class="col col-12">{#my_favorites#}</a>
        </div>
        {else}
        <div class="box col-12 line-bottom">
          <a id="loginMobile" href="/{$PAGE_LINK.MEMBER_LOGIN}" class="col col-12">{#member_login#}</a>
        </div>
        <div class="box col-12">
          <a id="regisMobile" href="/{$PAGE_LINK.MEMBER_REGISTER}" class="col col-12">{#member_register#}</a>
        </div>
        {/if}
      </div>
    </div>
  </div>
</div>
<span id="backToTop">{#back_to_top#}</span>
<div class="col col-12 dn-xs">
  <div class="row">
    <a href="/" class="fl col-12">
      <img src="/Data/EditorFiles/v4-ozel/ust/kargo-zemin.svg" /> <!-- <img src="/theme/v4-dkitap/sub_theme/ust/v4/v4/topBanner.svg" alt=""> -->
    </a>
  </div>
</div>
<!--whatsapp kulakçığı-->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<!--whatsapp kulakçığı-->
<div class="inner">
  <div id="headerMain" class="col col-12 ease">
      <span class=" searchItem dn-xs">
          <a class="col p-left" href="/siparis-takip"><span class="mdi mdi-package-variant"></span><span class="Item">Kargo Takip</span></a>
          <a class="col p-left" href="/kataloglar"><span class="mdi mdi-book-open"></span><span class="Item">Kataloglar</span></a>
          <a class="col p-left fiyatlistesi" href="/fiyat-listesi"><span class="mdi mdi-view-list"></span><span class="Item">Fiyat Listesi</span></a>
          <!--<a class="col p-left" href="/indirimli-urunler">İndirimdekiler</a>-->
          <!--<a class="col p-left" href="/yeni-urunler">Yeni Ürünler</a>-->
          <a class="col p-left" href="/iletisim"><span class="mdi mdi-phone"></span><span class="Item">İletişim</span></a>
          <a class="col p-left" href="/hakkimizda"><span class="mdi mdi-information-outline"></span><span class="Item">Hakkımızda</span></a>
          <a class="col p-left" target="_blank" href="https://damlapublishing.com/"><span class="mdi mdi-web"></span><span class="Item">Foreign Rights</span></a>
          <a class="col p-left" href="https://e-damla.com.tr"><span class="mdi mdi-water"></span><span class="Item">E-Damla</span></a>
          </span>
    <div class="row">
      <span id="hmLinks" class="col col-3 col-sm-4 col-xs-3 fr">
        <a href="/{$PAGE_LINK.CART}" class="col fr basketLink" id="cart-soft-count">
          <strong class="col dn-xs">{#basket#} (<span class="cart-soft-count">0</span>)</strong><br />
          <span class="col dn-xs basketPrice"><span class="cart-soft-price">0,00</span>TL</span>
        </a>
        {if $IS_MEMBER_LOGGED_IN == true}
        <a href="/{$PAGE_LINK.MEMBER_LOGIN}" class="col fr authorLink" id="desktopMemberBtn">
          <strong class="col dn-xs">{#account#}</strong><br />
          <span class="col dn-xs account-name">{$MEMBER.NAME} {$MEMBER.SURNAME}</span>
        </a>
        {else}
        <a data-width="500" data-url="/srv/service/customer/login-form" href="#" class="col fr authorLink authorLink2 popupWin" id="desktopMemberBtn">
          <strong class="col dn-xs">{#account#}</strong><br />
          <span class="col dn-xs">veya Üye Ol</span>
        </a>
        {/if}
      </span>
      <div class="box col-sm-4 forMobile">
        <span class="fl" id="menuBtn"></span>
      </div>
      <div id="logo" class="col col-2 col-sm-4 a-center">
        <a href="/">
          {$SITE_LOGO}
        </a>
      </div>
      <div class="fl col-1 pos-r allCat">
        <ul class="menu fl col-12">
          <li class="col-12 parentLink fl allFirst">
            <span class="fl">MENÜ</span>
            <nav class="pos-r fl col-12 col-md-11" id="mainMenu">
              <ul class="fl col-12 menu">
                {foreach $TABS as $M}
                <li class="fl col-12{if $M.CHILDREN|@count > 0} drop-down hover parentLink{/if}">
                    <a class="fl col-12" lang="tr" {if $M.NEWTAB === true} target="_blank"{/if} href="{$M.URL}" title="{$M.NAME}"><i class="mdi mdi-{$M.URL|replace:"/":""}"></i>{$M.NAME}</a>
                  {if $M.CHILDREN|@count > 0}                     
                  <ul>
                    {foreach $M.CHILDREN as $C}
                    <li class="fl col-12 d-flex mainCategory">
                      <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$C.URL}" title="{$C.NAME}" class="fl col-12">{$C.NAME}</a>
                      {if $C.CHILDREN|@count > 0}
                      <ul>
                        {foreach from=$C.CHILDREN item='C2' name='children'}
                        <li class="fl col-12">
                          <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$C2.URL}" title="{$C2.NAME}" class="fl col-12">{$C2.NAME}{if $C2@iteration != $C.CHILDREN|@count} {/if}</a>
                          {if $C2.CHILDREN|@count > 0}
                          <ul>
                            {foreach from=$C2.CHILDREN item='C3' name='children'}
                            <li class="fl col-12">
                              <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$C3.URL}" title="{$C3.NAME}" class="fl col-12">{$C3.NAME}</a>
                            </li>
                            {/foreach}
                          </ul>
                          {/if}
                        </li>
                        {/foreach}
                      </ul>
                      {/if}
                    </li>
                    {/foreach}                                          
                  </ul>
                  {/if}
                  <div class="pos-f pos-top pos-right pos-bottom pos-left overlay"></div>
                </li>
                {/foreach}
              </ul>
            </nav>
          </li>
        </ul>
        
      </div>
      
      <div id="search" class="col col-6 col-sm-12">
        <!--<span class="fl col-12 searchItem dn-xs">-->
        <!--  <a class="col p-left" href="/siparis-takip">Kargo Takip</a>-->
        <!--  <a class="col p-left" href="/kataloglar">Kataloglar</a>-->
        <!--  <a class="col p-left" href="/fiyat-listesi">Fiyat Listesi</a>-->
          <!--<a class="col p-left" href="/indirimli-urunler">İndirimdekiler</a>          -->
          <!--<a class="col p-left" href="/yeni-urunler">Yeni Ürünler</a>-->
        <!--  <a class="col p-left" href="/iletisim">İletişim</a>-->
        <!--  <a class="col p-left" href="/hakkimizda">Hakkımızda</a>-->
        <!--  <a class="col p-left" target="_blank" href="https://damlapublishing.com/">Foreign Rights</a>-->
        <!--  <a href="https://e-damla.com.tr">E-Damla</a>-->
          
          
        <!--  </span>-->
        </span>
        <!--<span class="col p-right"><a class="col p-right" href="/">Kargo Takip</a></span>-->
        <form id="FormAra" name="FormAra" action="/{$PAGE_LINK.SEARCH}" method="get" class="row">
          <input id="live-search" autocomplete="OFF" class="arakelime" name="q" type="text" placeholder="{#search_placeholder#}" http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <span id="searchRight" class="box fr">
            <input type="submit" class="btn-default fr" value="ARA" id="searchBtn" />
          </span>
          {if $IS_INLINE_SEARCH_ACTIVE==1}
          <script type="text/javascript" src="/theme/standart/js/blok-v4/live-search.js"></script>
          <div id="live-search-box"></div>  
          {/if}
        </form>
      </div>
    </div>
  </div>
</div>
<div class="col col-12 hideThis">
  <div class="row" id="mainMenu">
    <ul class="inner menu forDesktop">
      <li id="homeLink">
        <a href="/"></a>
      </li>
      {foreach $TABS as $M}
      <li class="ease{if $M.CHILDREN|@count > 0} parentLink{/if}">
        <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$M.URL}" title="{$M.NAME}">{$M.NAME}</a>
        {if $M.CHILDREN|@count > 0}                     
        <div class="box whiteBg subMenu">
          <div class="box {if $M.IMAGE != ''}col-8{else}col-12{/if}">
            <div class="box col-12 dynamicMenu">
              <div class="col col-12 btn-upper menuTitle">{#categories#}</div>
              <ul class="fl col-12 notClear">
                {foreach $M.CHILDREN as $C}
                <li class="col col-4">
                  <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$C.URL}" title="{$C.NAME}" class="line-bottom{if $C.CHILDREN|@count > 0} fw600{/if}">{$C.NAME}</a>    
                  {if $C.CHILDREN|@count > 0}
                  <ul class="box col-12">
                    {foreach $C.CHILDREN as $C2}
                    <li class="row">
                      <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$C2.URL}" title="{$C2.NAME}" class="col col-12">{$C2.NAME}</a>
                    </li>
                    {/foreach}
                  </ul>
                  {/if}
                </li>
                {/foreach}                                          
              </ul>
            </div>
          </div>
          {if $M.IMAGE != ''}
          <div class="box col-4 catImgWrapper">
            <img src="{$M.IMAGE}" alt="{$M.NAME}"/>
          </div>
          {/if}
        </div>
        {/if}
      </li>
      {/foreach}
    </ul>
    <ul class="inner menu forMobile" id="slideMenu">
      {foreach $TABS as $M}
      <li class="ease">
        <a {if $M.NEWTAB === true} target="_blank"{/if} href="{$M.URL}" title="{$M.NAME}">{$M.NAME}</a>
      </li>
      {/foreach}
    </ul>
  </div>
</div>

{if $LICENCE_PERSONALIZATION_ACTIVE == 1 }
<script type="text/javascript" src="/theme/standart/js/blok-v4/personalization.js"></script>
{/if}
<script type="text/javascript">
  function popupCallback() {
    
  }
  function placeCaller(id) {
    if (navigator.appVersion.indexOf('Trident') > -1 && navigator.appVersion.indexOf('Edge') == -1) {
      var wrapID = id || '';
      if (wrapID != '') {
        $('#' + wrapID).find('.withPlace').removeClass('withPlace');
        placeholder();
      }
    }
  }
  
  $(document).ready(function () {
    //Scroll Aşağıya Kaydıkça Menuyü Yukarıya Sabitler------------
    if ($(window).width() > 768) {
      var ustheights = $("#header").height();
      $(window).scroll(function (e) {
        if ($(document).scrollTop() < ustheights + 150) {
          $("#headerMain").removeClass("menuscroll");
          $('#search').addClass('col-6');
          $("#headerMain > .row").removeClass("inner");
          $('#headerMain > .inner').addClass('row');
        } else {
          $('#search').addClass('col-8');
          $('#search').removeClass('col-6');
          $("#headerMain").addClass("menuscroll");
          $("#headerMain > .row").addClass("inner");
          $('#headerMain > .inner').removeClass('row');
        }
      });
    }
    //Scroll Aşağıya Kaydıkça Menuyü Yukarıya Sabitler------------
    $('.menuItem').click(function(){
      if (!$(".menuItem").hasClass("menuActive")) {
        $(this).addClass('menuActive');
      } else {
        $(this).removeClass('menuActive');
      }
      $(this).next().slideToggle();
    });
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      if ($(window).width() < 769) {
        // $('#search').appendTo('#mobileSearch');
      }
      if (/webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)){
        $('option[disabled]').remove();
      }
      $('.parentLink > a, .parent > a').click(function (e) {
        e.preventDefault();
        $(this).next('ul').slideToggle();
      });
      var currentPage = location.pathname;
      $('#slideMenu a[href="' + currentPage + '"]').parent().addClass('current');
    } else {
      if (navigator.appVersion.indexOf('Trident') > -1 && navigator.appVersion.indexOf('Edge') == -1) {
        placeholder();
      }
    }
    $.getJSON('/srv/service/category/get', function (result) {
      var catList = $('#raventi_select');
      var url1 = window.location.href;
      $.each(result, function () {
        var re = new RegExp('category=' + this.ID + '(\&|$)', 'g');
        var selected = re.test(url1) ? 'selected' : '';
        catList.append('<option value="' + this.ID + '" ' + selected + '>' + this.TITLE + '</option>');
      });
    });
    if (/^.*?[\?\&]q=/ig.test(window.location.href)) {
      var sWord = window.location.href.replace(/^.*?[\?\&]q=/ig, '');
      sWord = sWord.replace(/\&.*?$/ig, '').replace(/\+/ig, ' ');
      $('#live-search').val(decodeURIComponent(sWord));
    }
    var mobileAppCookie = getaCookie('MobileNotifyClose');
    
    if (mobileAppCookie == null && !isSafari) {
      $('.MobileAppNotify').fadeIn();
      
    }
    $('.MobileNotifyClose').click(function () {
      setaCookie('MobileNotifyClose', 'Closed', 3);
      $('.MobileAppNotify').fadeOut();
      
    });
  });
  function setaCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }
  function getaCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0)
      return null;
    } else {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
        end = dc.length;
      }
    }
    return unescape(dc.substring(begin + prefix.length, end));
  }
  
  {if $IS_MEMBER_LOGGED_IN == true}
  $(function () {
    $.ajax({
      url: '/srv/service/customer/getmessagecount',
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        var messageCount = parseInt(result);
        if(messageCount > 0){
          $('#hmLinks').append('<a href="/{$PAGE_LINK.MEMBER_MESSAGES}" class="col fr messageLink"><span class="message-count">' + result + '</span><strong class="col dn-xs">{#message#}</strong></a>');
          $('#hmLinks .authorLink').addClass('forDesktop');
        }
      }
    });
  });
  {/if}
</script>
<style>
body #tsoft-ecommerce-systems{
    display: none !important;
    visibility: hidden !important;
    height: 0px !important;
    width: 0px !important;
    font-size: 0px !important;
  }
</style>
    