<script>
    document.addEventListener('DOMContentLoaded', function() {
        var cargoInfo = document.querySelector('.detailCargo');
        if (window.IS_VENDOR === 0) {
            cargoInfo.style.display = 'block';
        } else {
            cargoInfo.style.display = 'none';
        }
    });
</script>
<div class="col col-12" >
    <div id="productDetail" class="row mb" >
        <div class="fl col-12" id="pageContent">
            <!-- #pageContent = Sayfa içinde belirli bir div i popup olarak açmak istediğimizde bu div içerisinden yükleniyor. Hızlı görünüm için gerekli. -->
            <div class="box col-12">
                <div class="box p-left col-5 col-sm-12 " id="productLeft">
                    <div class="fl col-12">
                        <div class="col col-10 fr">
				            <div class="col col-12 p-right detayy">
                                <div class="row mb loaderWrapper">
                                    <!--{if $P.ADDITIONAL_FIELD_3 != ""}
                                        <a href="javascript:void();" class="videoo" onClick="VideoPlay();" style="display:block;">
                                            <div class="UrunVideoBox">
                                                <div class="UrunVideo" id="urunVideoId">
                                                    {$P.ADDITIONAL_FIELD_3}
                                                </div>
                                            </div>
                                        </a>
                                    {/if}-->
                                    <ul id="productImage" class="fl col-12">
                                        {if $P.ADDITIONAL_FIELD_3 != ""}
                                            <li class="col-12 fl current">
                                            </li>
                                        {/if}
                                        {for $i=0; $i<$P.IMAGE_COUNT; $i++}
                                            <li class="col-12 fl">
                                                <div class="col col-12 p-left">
                                                    <div class="col col-12">
                                                        <div class="row">
                                                            <a href="{$P.IMAGE_LIST.$i.BIG}" rel="productImage" data-index="{$i}" class="image-wrapper detay fl" data-href="{$P.IMAGE_LIST.$i.BIG}" data-standard="{$P.IMAGE_LIST.$i.BIG}">
                                                                <span class="imgInner">
                                                                   <img src="{$P.IMAGE_LIST.$i.BIG}"{if $P.HAS_MAGNIFIER == 1} data-zoom-image="{$P.IMAGE_LIST.$i.BIG}" id="zoomImage{$i}"{/if} alt="{$P.IMAGE_LIST.$i.TITLE} {$P.BRAND}" itemprop="image" />
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        {/for}
                                    </ul>
                                    {if $P.IMAGE_COUNT >= 1}
                                        <div id="imageControl" class="col-12 forDesktop">
                                            <div class="col col-12 p-left">
                                                <span id="prevImage" class="fl ease"></span>
                                                <span id="nextImage" class="fr ease"></span>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
							</div>
                        </div>
                        {if $P.IMAGE_COUNT >= 1} 
                            <div class="box col-2">
                                <div class="row slide-wrapper">
                                    <div id="resimler" class="col col-12 ease"> 
                                        <ul id="productThumbs" class="fl col-12 ease">
                                            {if $P.ADDITIONAL_FIELD_3 != ""}
                                                <li class="col-12 fl">
                                                    <div class="box col-12 videoWrap" id="videoWrap">
                                                        <div class="row ease">
                                                            <a class="image-wrapper video fl" href="javascript:void(0);" data-video="0">
                                                                <span class="imgInner" style="display:none;"></span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            {/if}
                                            {for $i=0; $i<$P.IMAGE_COUNT; $i++}
                                                <li class="col-12 fl" data-type="{$P.IMAGE_LIST.$i.VARIANT_TYPE_ID}">
                                                    <div class="box col-12">
                                                        <div class="row ease">
                                                            <a data-href="{$P.IMAGE_LIST.$i.BIG}" class="image-wrapper resim fl" data-standard="{$P.IMAGE_LIST.$i.BIG}">
                                                                <span class="imgInner">
                                                                    <img src="{$P.IMAGE_LIST.$i.SMALL}" alt="{$P.IMAGE_LIST.$i.TITLE} - Thumbnail" />
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            {/for}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="box col-7 col-sm-12 loaderWrapper" id="productRight">
                    <div class="box col-12 p-top" id="productMobileInfo">
                        <div class="row">
                            <div class="col col-12 p-left" id="productInfo">
                                <h1 class="fl col-12" id="productName" >{$P.TITLE}</h1>
                                <a href="/{$P.MODEL_URL}" target="_blank" title="Yazar: {$P.MODEL}" style="color:#14512B"  class="fl col-lg-6 col-md-12 col-sm-12" id="productBrandText" >{$P.MODEL}</a>
                                <span title="{$P.BRAND}"  class="fr col-12" id="productBrandText" ><a href="/{$P.BRAND_URL}" target="_blank" style="color:#f58120;">{$P.BRAND}</a></span>
                                <div class="fl productComment">
                                    <div class="fr stars">
                                        <div class="fl stars-inner" style="width:{$P.COMMENT_RANK}%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="hideThis">
                                {if $P.DEAL == 1}    
                                    {block name='firsat_sayac'}
                                        <!--FIRSAT URUNU-->
                                        <link rel="stylesheet" type="text/css" href="{$THEME_V4}css/FirsatUrunSayac.css"/>
                                        <div class="col col-12">
                                            <div class="box col-12 fw700 danger">
                                                <div class="row mb">
                                                    {if $TOTAL_SALE > 0}
                                                        Bu fırsatı {$TOTAL_SALE} kişi değerlendirdi.
                                                    {else}
                                                        Bu fırsatı ilk sen satın al!
                                                    {/if}
                                                </div>
                                            </div>
                                            <div class="box col-12 loaderWrapper">
                                                <span id="tsoft_counter" class="col col-12 image-band campaign-band"></span>
                                            </div>
                                        </div>
                                        <script type="text/javascript">
                                            dateFuture1 = new Date({$P.DEAL_END_DATE|date_format:'Y,m-1,d,H,i,s'});
                                            GetCount(dateFuture1, 'tsoft_counter');
                                        </script>
                                        <!--FIRSAT URUNU-->                                
                                    {/block}
                                {/if}
                            </div>

                        </div>
                    </div>
                {block name='firsat_sayac'}{/block}
                {if $P.IS_DISPLAY_PRODUCT == 0}
                    <div class="box col-12 p-left p-right"  id="productMobilePrices">
                        <div class="fl col-12 mainPrices">
                            {if $P.DISCOUNT_PERCENT > 0 && $P.IS_DISPLAY_DISCOUNTED_ACTIVE == 1}
                                <div class="productDiscount fl">%{$P.DISCOUNT_PERCENT}</div>
                            {/if}
                            <div class="col p-left priceLine">
                                {if $P.IS_DISCOUNT_ACTIVE == 1 && $P.IS_DISPLAY_DISCOUNTED_ACTIVE == 1}
                                    <div class="col discountPrice" data-old="{$P.PRICE_BUY}">
                                        <span class="product-price">{vat price=$P.PRICE_SELL  vat=$P.VAT}</span> {$P.TARGET_CURRENCY}
                                    </div><br />
                                    <div class="col currencyPrice discountedPrice" data-old="{$P.PRICE_BUY}">
                                        <span class="product-price-not-discounted">{vat price=$P.PRICE_NOT_DISCOUNTED vat=$P.VAT}</span>  {$P.TARGET_CURRENCY}
                                    </div>
                                {else} 
                                    <div class="col discountPrice" data-old="{$P.PRICE_BUY}">
                                        <span class="product-price">{vat price=$P.PRICE_SELL  vat=$P.VAT}</span> {$P.TARGET_CURRENCY}
                                    </div>
                                {/if}
                            </div>
                        </div>
                        <!--<div class="fl col-12 proDesc">-->
                        <!--    {$P.ADDITIONAL_FIELD_1}-->
                        <!--</div>-->
                    </div>
                    <input type="hidden" name="subPro{$P.ID}" id="subPro{$P.ID}" value="0" />
                    {if $P.HAS_VARIANT == true}
                        <div class="variantOverlay" data-id="{$P.ID}"></div>
                        <div class="box col-12 p-left p-right variantWrapper tooltipWrapper">
                            <textarea id="json{$P.ID}" class="hideThis">{$P.VARIANT_DATA}</textarea>
                            {if $P.VARIANT_FEATURE1_LIST|@count > 0}
                                <div class="row variantLine">
                                    <div class="col col-12 variantType2">{if $P.VARIANT_FEATURE1_TITLE != ''}{$P.VARIANT_FEATURE1_TITLE}{else}Seçiniz{/if}</div>
                                    <div class="col col-12 variantBox subOne" data-order="1"{if $P.DISPLAY_GAIN &&  $P.DISCOUNT_PERCENT > 0 && $P.IS_DISPLAY_DISCOUNTED_ACTIVE == 1} data-callback="changeGain"{/if}>
                                        <div class="fl col-12 ease variantList">
                                            {include file='Blok/UrunDetay/Orta/_alturun/1.tpl' VARIANT_LIST=$P.VARIANT_FEATURE1_LIST SELECTED=$P.VARIANT_FEATURE1_SELECTED GRUP_TIP_NO=1}
                                        </div>
                                        <div class="fl col-12 forMobile variantMoreBtn"></div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                    <div class="box col-12 p-left">
                        <div class="row tooltipWrapper">
                            <input type="hidden" id="IS_STOCK_NOTIFICATION_SUBPRODUCT" value="{$IS_STOCK_NOTIFICATION_SUBPRODUCT}"/>
                            {if $P.HAS_VARIANT == true && $IS_STOCK_NOTIFICATION_SUBPRODUCT == 1}
                                <div class="subProductStockAlert row outStock" style="display:none">
                                    <span class="box productFunction">{#out_of_stock#}</span>
                                    {if $IS_MEMBER_LOGGED_IN != true}
                                        {if $IS_HTTPS_ACTIVE == 1}
                                            <a data-width="500" data-url="/srv/service/customer/login-form" class="popupWin box productFunction popupHide priceAlertLink">{#stock_notification#}</a>
                                        {else}
                                            <a href="/{$PAGE_LINK.MEMBER_LOGIN}" class="box productFunction popupHide priceAlertLink">{#stock_notification#}</a>
                                        {/if}
                                    {else}
                                        <a data-width="450" data-url="/srv/service/profile/add-to-stock-alarm-list/{$P.ID}" class="popupWin box productFunction subProductAlert  popupHide priceAlertLink" data-type="stock">{#stock_notification#}</a>
                                    {/if}
                                </div>
                            {/if}
                            {if $P.STOCK<1 && $NEGATIVE_STOCK == 0 && $P.HAS_VARIANT == false}
                                <div class="outStock">
                                    <span class="box productFunction">{#out_of_stock#}</span>
                                    {if $IS_MEMBER_LOGGED_IN != true}
                                        {if $IS_HTTPS_ACTIVE == 1}
                                            <a data-width="500" data-url="/srv/service/customer/login-form" class="popupWin box productFunction popupHide priceAlertLink">{#stock_notification#}</a>
                                        {else}
                                            <a href="/{$PAGE_LINK.MEMBER_LOGIN}" class="box productFunction popupHide priceAlertLink">{#stock_notification#}</a>
                                        {/if}
                                    {else}
                                        <a data-width="450" data-url="/srv/service/profile/add-to-stock-alarm-list/{$P.ID}-{$P.VARIANT_ID}" class="popupWin box productFunction popupHide priceAlertLink" data-type="stock">{#stock_notification#}</a>
                                    {/if}
                                </div>
                                <div class="fl col-12 add-to-cart-win inStock" style="display:none">
                                    <div class="box col-12 p-top p-left qtyBox">
                                        <div class="box col-12 box-border">
                                            <div class="col col-3 p-left productType">{if $P.STOCK_UNIT != ''}{$P.STOCK_UNIT}{else}{#count#}{/if}:</div>
                                            <div class="fl col-9 qtyBtns" data-increment="{$P.STOCK_INCREMENT}"{if $P.IS_MULTIPLE_DISCOUNT_ACTIVE == 1} data-multiple-disc="true"{/if}>
                                                <a title="-" data-id="{$P.ID}" class="col-4"><p>-</p></a>
                                                <input type="text" id="Adet{$P.ID}" name="Adet{$P.ID}" min="{$P.MIN_ORDER_COUNT}" value="{$P.MIN_ORDER_COUNT}" class="col-4 detayAdet{$P.ID}" />
                                                <a title="+" data-id="{$P.ID}" class="col-4"><p>+</p></a>
                                            </div>
                                        </div>
                                    </div>
                                    {if $P.IS_MULTIPLE_DISCOUNT_ACTIVE == 1}
                                        <div class="box col-12 p-top p-left discBox">
                                            <div class="col col-12 box-border b-bottom b-right">
                                                <div class="row line-bottom">
                                                    <div class="box col-12 display-flex align-items-center flex-wrap line-right lightBg">
                                                        <img src="{$SUBTHEME}genel/v4/v4/toptan.png" title="Toptan Alın İndirim Kazanın" class="fl" />
                                                        <div class="btn btn-small">
                                                            {#title_for_multi_products#}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="fl col-3 col-sm-12">
                                                        <div class="box col-12 col-sm-6 line-right line-bottom fw700">{#amount#}</div>
                                                        <div class="box col-12 col-sm-6 line-right line-bottom fw700">{#discount#}</div>
                                                    </div>
                                                    {foreach $P.MULTIPLE_DISCOUNT as $C}
                                                        {$genis = $P.MULTIPLE_DISCOUNT|@count * 60}
                                                    {/foreach}
                                                    <div class="fl col-9 col-sm-12">
                                                        {$count = 0}
                                                        {foreach $P.MULTIPLE_DISCOUNT as $C}
                                                            {$count = $count +1}
                                                            <div class="fl col-3 col-sm-12 discounts" data-min="{$C.MIN}" data-max="{$C.MAX}">
                                                                <div class="box col-12 col-sm-6 line-right line-bottom miktar"><span class="basMiktar">{$C.MIN}</span> - <span class="bitMiktar">{$C.MAX}</span></div>
                                                                <div class="box col-12 col-sm-6 line-right line-bottom indirimYuzde">%{$C.PERCENT}</div>
                                                            </div>
                                                        {/foreach}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                    <div class="fl col-12" id="mobileBuyBtn">
                                        <div class="box col-6 col-sm-12 p-top p-left buyBtn">
                                            <a onclick="Add2Cart({$P.ID}, $('#subPro{$P.ID}').val(), $('.detayAdet{$P.ID}').val());" class="btn col-12 btn-big btn-default btn-radius" id="addCartBtn">
                                                {#add_to_cart#}
                                                <span class="fr icon-basket light-basket"></span>
                                            </a>
                                        </div>
                                        <div class="box col-6 col-sm-12  p-top p-left buyBtn">
                                            <a onclick="Add2Cart({$P.ID}, $('#subPro{$P.ID}').val(), $('.detayAdet{$P.ID}').val(), 1);" class="btn col-12 btn-big btn-warning btn-radius" id="fastBuyBtn">
                                                {#buy_now#}
                                                <span class="fr icon-basket light-basket fast"></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            {elseif $P.DEAL_PREV_DATE != ''}
                                <div class="box productFunction priceAlertLink">Bu ürün için fırsatı {$P.DEAL_PREV_DATE} tarihinde kaçırdınız.</div>
                            {elseif $P.DEAL_NEXT_DATE != ''}
                                <div class="box productFunction priceAlertLink">Bu ürün için fırsatı {$P.DEAL_NEXT_DATE} tarihinde yakalayabilirisiniz.</div>
                            {elseif $IS_ADD_TO_CART_VISIBLE == 1}
                                <div class="fl col-12 add-to-cart-win inStock">
                                    {if $P.IS_MULTIPLE_DISCOUNT_ACTIVE == 1}
                                        <div class="box col-12 p-top p-left discBox">
                                            <div class="col col-12 box-border b-bottom b-right">
                                                <div class="row line-bottom">
                                                    <div class="box col-12 display-flex align-items-center flex-wrap line-right lightBg">
                                                        <img src="{$SUBTHEME}genel/v4/v4/toptan.png" title="Toptan Alın İndirim Kazanın" class="fl" />
                                                        <div class="btn btn-small">
                                                            {#title_for_multi_products#}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="fl col-3 col-sm-12">
                                                        <div class="box col-12 col-sm-6 line-right line-bottom fw700">{#amount#}</div>
                                                        <div class="box col-12 col-sm-6 line-right line-bottom fw700">{#discount#}</div>
                                                    </div>
                                                    {foreach $P.MULTIPLE_DISCOUNT as $C}
                                                        {$genis = $P.MULTIPLE_DISCOUNT|@count * 60}
                                                    {/foreach}
                                                    <div class="fl col-9 col-sm-12">
                                                        {$count = 0}
                                                        {foreach $P.MULTIPLE_DISCOUNT as $C}
                                                            {$count = $count +1}
                                                            <div class="fl col-3 col-sm-12 discounts" data-min="{$C.MIN}" data-max="{$C.MAX}">
                                                                <div class="box col-12 col-sm-6 line-right line-bottom miktar"><span class="basMiktar">{$C.MIN}</span> - <span class="bitMiktar">{$C.MAX}</span></div>
                                                                <div class="box col-12 col-sm-6 line-right line-bottom indirimYuzde">%{$C.PERCENT}</div>
                                                            </div>
                                                        {/foreach}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                    <div class="fl col-12" style="margin-top: 1rem">
                                        <div class="col col-2 col-sm-5 qtyBtns">
                                            <div class="col col-12 p-left productType">{if $P.STOCK_UNIT != ''}{$P.STOCK_UNIT}{else}{#count#}{/if}:</div>
                                            <select id="Adet{$P.ID}" class="detayAdet detayAdet{$P.ID} col-12">
                                                {for $foo=1 to 200}
                                                    <option value="{$foo*$P.MIN_ORDER_COUNT}">{$foo*$P.MIN_ORDER_COUNT}</option>
                                                {/for}
                                            </select>
                                        </div>
                                        <div class="box col-5 col-sm-12 p-top buyBtn">
                                            <a onclick="Add2Cart({$P.ID}, $('#subPro{$P.ID}').val(), $('.detayAdet{$P.ID}').val());" class="btn col-12 btn-big btn-default btn-radius" id="addCartBtn">
                                                {#add_to_cart#}
                                            </a>
                                        </div>
                                        <div class="box col-3 col-sm-12  p-top buyBtn">
                                            <a onclick="Add2Cart({$P.ID}, $('#subPro{$P.ID}').val(), $('.detayAdet{$P.ID}').val(), 1);" class="btn col-12 btn-big btn-warning btn-radius" id="fastBuyBtn">
                                                {#buy_now#}
                                            </a>
                                        </div>
                                    </div>
                                    <div class="fl col-12" id="bayi-paketici-adet">
                                        {if $P.MIN_ORDER_COUNT > 1}
                                            <div>
                                                Paket İçi Adet: {$P.MIN_ORDER_COUNT}
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                    {if $P.IS_PERSONALIZATION_ACTIVE}
                        <div class="col col-12">
                            <div id="myPersonalizationForm"></div>
                        </div>
                        <script>
                            new PersonalizationForm({
                                form_id: parseInt('{$P.PERSONALIZATION_ID}'),
                                product_id: '{$P.ID}',
                                sub_product_id: '{$P.VARIANT_ID}',
                                uploadButtonActive: true,
                                data: [],
                                selector: '#myPersonalizationForm'
                            });
                        </script>
                    {/if}
                {/if}
                {if $P.IS_DISPLAY_PRODUCT == 0}
                    <div class="box col-12 p-left line-bottom">
                        <div class="row">
                            {if $IS_MEMBER_LOGGED_IN != true}
                                {if $IS_HTTPS_ACTIVE == 1}
                                    <a data-width="500" data-url="/srv/service/customer/login-form" class="popupWin box productFunction popupHide shopListLink" id="shopListLink">{#add_to_shopping_list#}</a>
                                {else}
                                    <a href="/{$PAGE_LINK.MEMBER_LOGIN}" class="box productFunction popupHide shopListLink" id="shopListLink">{#add_to_shopping_list#}</a>
                                {/if}
                            {else}
                                <a data-width="700" data-url="/srv/service/content/get/1014/popup/{$P.ID}-{$P.VARIANT_ID}" class="popupWin box productFunction popupHide shopListLink" id="shopListLink" data-type="shoplist">{#add_to_shopping_list#}</a>
                            {/if}
                            {if $IS_RECOMMENDATION_ACTIVE == 1}
                                <a class="box productFunction popupHide adviceLink TavsiyeEt" id="adviceBtn">{#recommended#}</a>
                            {/if}
                            <div class="fl box smlIconSet">
                                <div class="col shareTitle">{#share#}:</div>
                                <div class="fl shareBtns">
                                    <div class="col p-left">
                                        <a id="fbShareBtn" target="_blank"></a>
                                    </div>
                                    <div class="col p-left">
                                        <a id="twBtn" target="_blank" text="" href="http://twitter.com/share?text={$P.TITLE}&url={$smarty.server.REQUEST_SCHEME}://{$smarty.server.HTTP_HOST}{$smarty.server.REQUEST_URI}"></a>
                                    </div>
                                    <div class="col p-left">
                                        <script type="text/javascript" async defer src="//assets.pinterest.com/js/pinit.js" data-pin-custom="true"></script>
                                        <a href="https://www.pinterest.com/pin/create/button/" rel="nofollow" id="pinBtn" target="_blank"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
                <div class="box col-12">
                    <div class="row">
                        <div class="box col-6 col-sm-12 detailCargo">
                            <span>Kargoya Verilme</span><br />
                            <span class="cargotext">3 İş Günü İçerisinde Kargolanır.</span>
                        </div>
                        {if $P.ADDITIONAL_FIELD_2}
                        <div class="box fr col-sm-12 pageShow">
                           <a href="{$P.ADDITIONAL_FIELD_2}" target="_blank">Sayfaları İncele</a>
                        </div>
                        {/if}
                    </div>
                </div>
                {$ADDTHIS_SOSYAL_ORTAM_BUTON}
                <div class="fl col-12 angularTemplate" id="cmpList" data-url="/srv/campaign-v2/campaign/get-list-by-type/product/{$P.ID}">
                    <div class="box col-12" ng-if="CAMPAIGN_LIST.length > 0">
                        <div class="row">
                            <div class="box col-12 btn-upper warning line-top line-bottom">
                                <div class="row">{#product_campaign#}</div>
                            </div>
                            <div class="col col-12 p-right">
                                <div class="row">
                                    {literal}
                                        <div class="box col-6 col-sm-12 p-bottom p-left" ng-repeat="CMP IN CAMPAIGN_LIST">
                                            <div class="box col-12 lightBg box-border">
                                                <p class="fw600">{{CMP.TITLE}}</p>
                                                <p class="sml p-bottom">{{CMP.DESCRIPTION}}</p>
                                            </div>
                                        </div>
                                    {/literal}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    {block name="tablar"}
        <div class="col col-12">
            <div id="urun-tab" class="row mb">
                <div class="col col-12">
                    <div class="row" id="mobileTabBtn">
                        <ul id="tabBtn">
                            <li class="box col-sm-12 filter-box loaded">
                                <span class="col">{#tab_product_features#}</span>
                            </li>
                            {if $P.IS_DISPLAY_PRODUCT != true}
                                <li class="box filter-box" data-href="/srv/service/product-detail/payment-options/{$P.ID}/{$P.VARIANT_ID}" id="paymentTab">
                                    <span class="col">{#tab_payment_options#}</span>
                                </li>
                            {/if}
                            <li class="box filter-box">
                                <span class="col">Teslimat ve İade Koşulları</span>
                            </li>
                            <li class="box filter-box" data-href="/srv/service/content/get/1004/comment/{$P.ID}" id="commentTab">
                                <span class="col">{#tab_comments#} ({$COMMENT_COUNT})
                                    <span style="margin:8px" class="fr stars dn-xs">
                                        <span class="fl stars-inner" style="width:{$P.COMMENT_RANK}%;"></span>
                                    </span>
                                </span>
                            </li>
                            {if $IS_RECOMMENDATION_ACTIVE == 1}       
                                <li class="box filter-box" data-href="/srv/service/content/get/1004/recommend/{$P.ID}" id="adviceTab">
                                    <span class="col">{#tab_recommended#}</span>
                                </li>
                            {/if}
                        </ul>
                    </div>
                    <div class="row">
                        <div class="box col-12">
                            <ul id="tabPanel" class="box col-12">
                                <li class="fl ozellik">
                                    {block name="tab1"}
                                        <div class="row">
                                            <div class="box col-12" id="productDetailTab">
                                                {$P.DETAIL}
                                            </div>
                                            <div class="col col-12">
                                                <div class="col col-12 box-border b-bottom">
                                                    {if $P.BARCODE != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-barcode mr-1 fa-lg text-dark"></i>&nbsp;&nbsp;{'Barkod'}{':'}</div>
                                                            <div class="box col-7">{$P.BARCODE}</div>
                                                        </div>
                                                    {/if}
                                                    {if $P.SHORT_DESCRIPTION != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-hashtag mr-1 fa-lg text-primary" style="color:brown;"></i>&nbsp;&nbsp;{'Yayın Numarası'}{':'}</div>
                                                            <div class="box col-7">{$P.SHORT_DESCRIPTION}</div>
                                                        </div>
                                                    {/if}
                                                    {if $FILTER_PROPERTY_LIST|@count > 0}
                                                    <div class="">
                                                        {foreach $FILTER_PROPERTY_LIST as $F}
                                                            {if $F.VALUE != ''}
                                                                <div class="row line-bottom">
                                                                    <div class="box col-4 line-right fw700"><i class="fas fa-filter mr-1 fa-lg text-primary"></i>&nbsp;&nbsp;{$F.KEY}{':'}</div>
                                                                    <div class="box col-7">{$F.VALUE}</div>&nbsp;
                                                                </div>
                                                            {/if}
                                                        {/foreach}
                                                    </div>
                                                    {/if}
                                                    {if $P.IS_PRODUCT_SIZE_ACTIVE == true}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-ruler fa-md text-danger" style="color:red"></i>&nbsp;&nbsp;{'Boyut'}{':'}</div>
                                                            <div class="box col-7">{$P.WIDTH} x {$P.HEIGHT} x {$P.DEPTH}&nbsp{'cm'}</div>
                                                        </div>
                                                    {/if}
                                                    {if $P.WEIGHT != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-weight mr-1 fa-lg text-danger" style="color:#434945;"></i>&nbsp;&nbsp;{#weight#}{':'}</div>
                                                            <div class="box col-7">{$P.WEIGHT}</div>
                                                        </div>
                                                    {/if}
                                                    {if $P.DOCUMENT_INFO != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-book-open mr-1 fa-lg text-primary" style="color:purple;"></i>&nbsp;&nbsp;{'Sayfa Sayısı'}{':'}</div>
                                                            <div class="box col-7">{$P.DOCUMENT_INFO}</div>
                                                        </div>
                                                    {/if}
                                                    {if $P.ADDITIONAL_FIELD_1 != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-file mr-1 fa-lg text-primary" style="color:green;"></i>&nbsp;&nbsp;{'Kağıt Bilgisi'}{':'}</div>
                                                            <div class="box col-7">{$P.ADDITIONAL_FIELD_1}</div>
                                                        </div>
                                                    {/if}
                                                    {if $P.MODEL != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fas fa-user-edit fa-lg text-primary" style="color:blue;"></i>&nbsp;{'Yazar'}{':'}</div>
                                                            <div class="box col-7"><a href="/{$P.MODEL_URL}" target="_blank">{$P.MODEL}</a></div>
                                                        </div>
                                                    {/if}
                                                    {if $P.BRAND != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 line-right fw700"><i class="fa fa-copyright mr-1 fa-lg text-dark" style="color:#14512B;"></i>&nbsp;&nbsp;{'Yayın'}{':'}</div>
                                                            <div class="box col-7"><a href="/{$P.BRAND_URL}" target="_blank">{$P.BRAND}</a></div>
                                                        </div>
                                                    {/if}
                                                    {if $P.WARRANTY_INFO != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 fw700">{#warranty#}</div>
                                                            <div class="box col-1 line-right fw700">:</div>
                                                            <div class="box col-7">{$P.WARRANTY_INFO}</div>
                                                        </div>
                                                    {/if}
                                                    {if $P.DELIVERY_INFO != ''}
                                                        <div class="row line-bottom">
                                                            <div class="box col-4 fw700">{#delivery#}</div>
                                                            <div class="box col-1 line-right fw700">:</div>
                                                            <div class="box col-7">{$P.DELIVERY_INFO}</div>
                                                        </div>
                                                    {/if}
                                                </div>
                                                {if $P.TAGS|@count >0}
                                                    <div class="box col-12 line-bottom p-bottom">
                                                        <div class="row box-border b-bottom">
                                                            <div class="box col-12 fw700">{#product_tags#}</div>
                                                        </div>
                                                        <div class="row box-border b-bottom">
                                                            {foreach name=outer item=TAG from=$P.TAGS}
                                                                {if !$smarty.foreach.outer.first}
                                                                    <span class="box p-left">,</span> 
                                                                {/if}
                                                                <a class="box" href="/{$TAG.URL}" target="_blank">{$TAG.TITLE}</a> 
                                                            {/foreach}
                                                        </div>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    {/block}
                                </li>
                                {if $P.IS_DISPLAY_PRODUCT != true}
                                    <li class="fl loaderWrapper"></li>
                                    {/if}
                                <li class="fl loaderWrapper"><p>Siparişleriniz, banka onayı alındıktan sonra 3 iş g&uuml;n&uuml; (Pazartesi-Cuma) i&ccedil;erisinde kargoya teslim
                                    edilir. Teslimat adresinin lojistik merkezimizin uzaklığına g&ouml;re de kargo şirketi 1-3 g&uuml;n
                                    i&ccedil;erisinde siparişinizi size ulaştıracaktır.</p>
                                <p>&Ouml;zel &uuml;retim &uuml;r&uuml;nlerin teslim s&uuml;releri imalat zamanına g&ouml;re farklılık
                                    g&ouml;stermektedir. Bu t&uuml;r &uuml;r&uuml;nlerin teslimat bilgileri ve s&uuml;releri &uuml;r&uuml;n sayfalarında
                                    belirtilmiştir.</p>
                                <p>Tarafımızdan kaynaklanan bir aksilik olması halinde ise size &uuml;yelik bilgilerinizden yola &ccedil;ıkılarak haber
                                    verilecektir. Bu y&uuml;zden &uuml;yelik bilgilerinizin eksiksiz ve doğru olması &ouml;nemlidir. Bayram ve tatil
                                    g&uuml;nlerinde teslimat yapılmamaktadır.</p>
                                <p>Se&ccedil;tiğiniz &uuml;r&uuml;nlerin tamamı anlaşmalı olduğumuz&nbsp; kargo şirketleri tarafından size teslim
                                    edilecektir.</p>
                                <p>Satın aldığınız &uuml;r&uuml;nler bir teyit e-posta'sı ile tarafınıza bildirilecektir. Se&ccedil;tiğiniz
                                    &uuml;r&uuml;nlerden herhangi birinin stokta mevcut olmaması durumunda konu ile ilgili bir e-posta size yollanacak
                                    ve &uuml;r&uuml;n&uuml;n ilk stoklara gireceği tarih tarafınıza bildirilecektir.</p>
                                <p>damlayayinevi.com.tr online alışveriş sitesidir. Aynı anda birden &ccedil;ok kullanıcıya alışveriş yapma imkanı
                                    tanır. Enderde olsa t&uuml;keticinin aynı &uuml;r&uuml;n&uuml; alması s&ouml;z konusudur ve &uuml;r&uuml;n stoklarda
                                    t&uuml;kenmektedir bu durumda ;</p>
                                <p>&Ouml;demesini internet &uuml;zerinden yaptınız &uuml;r&uuml;n eğer stoklarmızda kalmamış ise en az 4 (D&ouml;rt) en
                                    fazla 30 (otuz) g&uuml;n bekeleme s&uuml;resi vardır. &Uuml;r&uuml;n bu tarihleri arasında t&uuml;keticiye verilemez
                                    ise yaptığı &ouml;deme kendisine iade edilir.</p>
                                </li>
                                <li class="fl loaderWrapper"></li>
                                <li class="fl loaderWrapper"></li>
                                    {if $P.DOCUMENT_INFO != ''}
                                    <li class="fl loaderWrapper">
                                        <div class="row">
                                            <div class="box col-12">
                                                {$P.DOCUMENT_INFO}
                                            </div>
                                        </div>
                                    </li>
                                {/if}
                                <!--{if $P.IS_RELATED_PRODUCTS_ACTIVE != ''}
                                    <li class="fl loaderWrapper"></li>
                                {/if}-->
                                    {if $P.IS_VIDEO_ACTIVE == 1}
                                        <li class="fl loaderWrapper" id="videoPanel" data-url="/srv/service/gallery/video-detail/{$P.ID}">
                                            {literal}
                                                {{EMBED}}
                                            {/literal}
                                        </li>
                                    {/if}
                                    {if $IS_CALL_ME_ACTIVE == 1}
                                        <li class="fl loaderWrapper"></li>
                                    {/if}
                                    {if $IS_QUICK_MESSAGE_ACTIVE == 1}
                                        <li class="fl loaderWrapper"></li>
                                    {/if}
                                    {if $IS_SUGGESTION_BOX_ACTIVE == 1}
                                        <li class="fl loaderWrapper"></li>
                                    {/if}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/block}
    </div>
</div>
<div id="pageScripts">
    <input type="hidden" id="urun-id" value="{$P.ID}" />
    <input type="hidden" id="urun-ad" value="{$P.TITLE}" />
    <input type="hidden" id="urun-kategori" value="{$P.CATEGORY_NAME}" />
    <input type="hidden" id="urun-kur" value="{$P.CURRENCY}" />
    <input type="hidden" id="urun-fiyat" value="{$P.PRICE_SELL}" />
    <input type="hidden" id="urun-tedarikci-kod" value="{$P.SUPPLIER_PRODUCT_CODE}" />
    <input type="hidden" id="urun-stock-status" value="{if $P.STOCK>0}1{else}0{/if}" />  
    <input type="hidden" id="urun-kategoriler" value="{$P.CATEGORY_IDS}" /> 
    <!-- #pageScripts = Sayfa scriptleri bu div içerisinden yükleniyor. Hızlı görünüm için gerekli. -->
    <link rel="stylesheet" property="stylesheet" type="text/css" href="/theme/{$THEME_PRODUCT|default:v4}/sub_theme/urundetay/{$SUBTHEME_PRODUCT}/urundetay.css" />
    <link rel="stylesheet" property="stylesheet" type="text/css" href="{$THEME_GENERAL}/sub_theme/genel/{$SUBTHEME_GENERAL}/photoGallery.css" />
    <link rel="stylesheet" property="stylesheet" type="text/css" href="/js/lightbox/css/lightbox.css" />
    <script type="text/javascript" src="/srv/service/conf/load/Blok_UrunDetay/1" charset="utf-8"></script>
    <script type="text/javascript" src="/js/lightbox/js/lightbox.js"></script>
    {if $P.HAS_MAGNIFIER==1}
        <script type="text/javascript" src="/theme/standart/js/elevatezoom.js"></script>
        <script type="text/javascript">
            $(document).ready(function () {
                if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
                    $('.zoomContainer').remove();
                    $('#productLeft img').removeData('elevateZoom');
                    $('#zoomImage0').elevateZoom({
                        /*zoomType: "inner",*/ /* zoomType: "inner" ise "scrollZoom" pasif olmak zorunda */
                        cursor: "crosshair",
                        easing: true,
                        scrollZoom: true,
                        zoomWindowPosition: "productRight",
                        zoomWindowFadeIn: 500,
                        zoomWindowFadeOut: 750
                    });
                }
            });
            function changeSubProImg(parent, subIndex) {
                if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
                    $('.zoomContainer').remove();
                    $('#productLeft img').removeData('elevateZoom');
                    $('#zoomImage' + subIndex).elevateZoom({
                        /*zoomType: "inner",*/ /* zoomType: "inner" ise "scrollZoom" pasif olmak zorunda */
                        cursor: "crosshair",
                        easing: true,
                        scrollZoom: true,
                        zoomWindowPosition: "productRight",
                        zoomWindowFadeIn: 500,
                        zoomWindowFadeOut: 750
                    });
                }
            }
        </script>
    {/if}
    <script type="text/javascript" src="/theme/standart/js/blok-v4/product-detail.js"></script>
    <script>
        {if $P.IS_DISPLAY_PRODUCT == 0 && $P.HAS_VARIANT == true}
            var variant = JSON.parse($('#json{$P.ID}').val());
        {/if}
            
        $(window).load(function() {
            {if $P.ADDITIONAL_FIELD_3 !=""}
                var VideoLink = '{$P.ADDITIONAL_FIELD_3}';
                
                $('#videoWrap').addClass('Video');
                
                $('ul#productImage li:nth-child(1)').text('');
            
                $('ul#productImage li:nth-child(1)').append(VideoLink);
            {/if}
        });
        $(document).ready(function () {
            /*var videokontrol = $(".UrunVideo").html();
            if(videokontrol != ""){
            $(".videobtn").show();
            }
            $(".videoWrap").click(function () {
                $('body').addClass('videoActive');
                $(".UrunVideoBox").addClass("open");
            });

            var sizeChart = '';
            sizeChart = '{$P.ADDITIONAL_FIELD_3}';
            $('.beden').click(function(e) {
                e.preventDefault();
                var sizeTable = new Message({
                    html: sizeChart,
                    width: 962,
                    maxHeight: 452,
                    openingCallback: function(){
                        $('.pWin:last').addClass('overflow').width(1100);
                        $('.pWin:last').addClass('overflow').height(495);
                    }
                });
                sizeTable.show();
            });*/ 

            $('#productImage').slide({
                {if $IS_MINI_FOTO_SLIDE_ACTIVE == 1}
                    isAuto: true,
                {else}
                    isAuto: false,
                {/if}
                slideCtrl: {
                    showCtrl: true,
                    wrapCtrl: '#imageControl',
                    nextBtn: '#nextImage',
                    prevBtn: '#prevImage'
                },
                {if $IS_CLICK_PHOTO_CHANGE_ACTIVE != 1}
                    changeOnMouse: true,
                {/if}
                slidePaging: {
                    showPaging: true,
                    wrapPaging: '#productThumbs'
                },
                changeFn: function (e) {
                {if $P.HAS_MAGNIFIER==1}
                    changeSubProImg('#productThumbs', e);
                {/if}
                }
            });
            $('#tabPanel').slide({
                isAuto: false,
                touchEnabled: false,
                slidePaging: {
                    showPaging: true,
                    wrapPaging: '#tabBtn'
                }
            });
            $('a[rel="productImage"]').lightbox();
            
            if(typeof $("#productThumbs li:eq(0) span.imgInner img").attr("alt") != 'undefined') {
                $(".lb-image").attr("alt", $("#productThumbs li:eq(0) span.imgInner img").attr("alt").replace(' - Thumbnail',''));
            }
            
            $('.variantList').each(function () {
                if ($(this).find('a').length < 5) {
                    $(this).next().remove();
                }
            });
            $('.variantMoreBtn').click(function () {
                $(this).prev().toggleClass('active');
            });
            $('#fbShareBtn').click(function () {
                var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href);
                var winOpts = ['width=590', 'height=430', 'status=no', 'resizable=yes', 'toolbar=no', 'menubar=no', 'scrollbars=yes'].join(',');
                window.open(shareUrl, 'Share on Facebook', winOpts);
            });
            $('#gpBtn').click(function () {
                var shareUrl = 'https://plus.google.com/share?url=' + encodeURIComponent(location.href);
                var winOpts = ['width=525', 'height=430', 'status=no', 'resizable=yes', 'toolbar=no', 'menubar=no', 'scrollbars=yes'].join(',');
                window.open(shareUrl, 'Share on Google', winOpts);
            });
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $('#tabBtn li').click(function () {
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - 20
                    }, 500);
                });
            }
            {if $P.HAS_VARIANT==1}
                $('.subOne a[data-id].selected,.subTwo a[data-id].selected').trigger('click');
            {/if}
        });
        function zoomCallback() {

        }
        function lightCallback() {
            var img = $('#lightContent img');
            img.on('load', function() {
                var contentHeight = $('#lightContent img').height();
                var contentWidth = $('#lightContent img').width();
                setTimeout(function() {
                    var maxH = $('.pWin:last').height();
                    if (contentHeight > maxH) {
                        $('.pWin:last').addClass('overflow').width(contentWidth + 10);
                    }
                }, 500);
            });
        }
        {if $P.DISPLAY_GAIN &&  $P.DISCOUNT_PERCENT > 0 && $P.IS_DISPLAY_DISCOUNTED_ACTIVE == 1}
            {if $P.DISPLAY_VAT == 1}
                function changeGain(data){
                    console.log($('.product-price-not-discounted').html());
                    console.log($('.product-price').html());
                    $('#gain').html(format(parseFloat($('.product-price-not-discounted').html()) - parseFloat($('.product-price').html())));
                }
            {else}
                function changeGain(data){
                    console.log($('.product-price-not-discounted-not-vat').html());
                    console.log($('.product-price-not-vat').html());
                    $('#gain').html(format(parseFloat($('.product-price-not-discounted-not-vat').html()) - parseFloat($('.product-price-not-vat').html())));
                }
            {/if}
        {/if}
    </script>
</div>