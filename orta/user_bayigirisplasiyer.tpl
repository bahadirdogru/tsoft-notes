{if $GoogleRecaptcha}
<script src='https://www.google.com/recaptcha/api.js'></script>
<script>
    window.GoogleRecaptchaClientKey = '{$GoogleRecaptchaClientKey}';
</script>
{/if}
<div class="col col-12" id="page-login">
    <div class="row mb">
        {if $IS_VENDOR_LOGIN==true}
            <div class="col col-12 box-border">
                <div class="row" id="vendor-login">
                    <div class="col col-12 pageTitle">
                        <div class="row mb lightBg member">{$BLOCK_TITLE}</div>
                    </div>
                    <div class="box col-12">
                        <div class="col col-6 col-md-8 col-sm-12 col-ml-3 col-mr-3 col-md-mr-2 col-md-ml-2">
                            <div class="box col-12  form-control xlarge">
                                <div class="row input-icon tooltipWrapper">
                                    <span class="icon icon-mail">
                                    </span>
                                    <input type="text" placeholder="{#email#}" name="vendor-email" id="vendor-email" value="" class="col col-12" />
                                </div>
                            </div>
                            <div class="box col-12 form-control xlarge tooltipWrapper">
                                <div class="row input-icon tooltipWrapper">
                                    <span class="icon icon-pass">
                                    </span>
                                    <input type="password" placeholder="{#password#}" name="vendor-password" id="vendor-password" value="" class="col col-12" />
                                </div>
                            </div>
                            {if $GoogleRecaptcha}
                                <div class="box col-12 form-control tooltipWrapper">
                                     <div id="seccode" class="g-recaptcha" data-sitekey="{$GoogleRecaptchaClientKey}"></div>
                                </div>
                            {else}
                                <div class="box col-12 form-control tooltipWrapper" {if $CAPTCHA_COUNTER < $CAPTCHA_LIMIT}style="display:none;"{/if}>
                                    <div class="row mb input-icon">
                                        <img  id="vendor-code" data-limit="{$CAPTCHA_LIMIT}" class="secCode" src="/SecCode.php?1509621554748"/>
                                        <input type="text" id="ug-security" name="ug-security" placeholder="Güvenlik Kodu" class="col col-12 withPlace mail required" style="height: 30px;"/>
                                    </div>
                                </div>
                            {/if}
                            <div class="box col-12">
                                <div class="row">
                                    <a data-prefix="vendor-" data-vendor="1" data-callback="ugMemberLoginFn" class="login btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                        {#login#}
                                    </a>
                                </div>
                            </div>
                            {if $IS_REMEMBER_ME_ACTIVE}
                                <div>
                                    <span class="Yazi">
                                        &nbsp;
                                    </span>
                                    <span class="textalan">
                                        <input type="checkbox" id="vendor-remember" value="1" />
                                        <label for="vendor-remember">
                                            {#remember_me#}
                                        </label>
                                    </span>
                                </div>
                            {/if}
                            <div class="col col-12">
                                <div class="row">
                                    <a href="{$PAGE_LINK.MEMBER_PASSWORD_REMINDER}" class="fr form-link info" target="_blank">{#forgot_password#}</a>
                                </div>
                            </div>
                            <div class="col col-12">
                                <div class="row">
                                    <a href="{$PAGE_LINK.VENDOR_REGISTER}" class="fr form-link">{#be_vendor#}</a>
                                </div>
                            </div>
                            <div class="row">
                                {if $DISPLAY_FACEBOOK == 1}
                                    <div class="box col-6 col-md-12 form-control xlarge">
                                        <a href="/srv/service/social/facebook/login" class="fl col-12 input-icon">
                                            <span class="icon icon-fb"></span>
                                            <span class="col col-12 box-border social-btn">
                                                <span class="row">
                                                    <span class="col col-12 form-input">{#login_facebook#}</span>
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                {/if}
                                {if $DISPLAY_TWITTER == 1}
                                    <div class="box col-6 col-md-12 form-control xlarge">
                                        <a href="/srv/service/social/twitter/login" class="fl col-12 input-icon">
                                            <span class="icon icon-tw"></span>
                                            <span class="col col-12 box-border social-btn">
                                                <span class="row">
                                                    <span class="col col-12 form-input">{#login_twitter#}</span>
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                {/if}
                                {if $DISPLAY_APPLE == 1}
                                    <div class="box col-6 col-md-12 form xlarge">
                                        <a href="/srv/service/social/apple/login" class="fl col-12 input-icon" id="popup-member-login-apple">
                                            <span class="icon icon-apple">
                                            </span>
                                            <span class="col col-12 box-border social-btn">
                                                <span class="row">
                                                    <span class="col col-12 form-input">
                                                        {#login_apple#}
                                                    </span>
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script type="text/javascript">

                function ugMemberLoginFn(result, opt) {
                    tooltip.hideAll();
                    var element = result.status === -1 ? $('#vendor-code') : $('#vendor-email');
                    var cls = result.status === 1 ? 'btn-success' : 'btn-danger';

                    tooltip.show(element, result.statusText, false, cls);

                    if (result.status === 1) {
                        setTimeout(function () {
                            window.location.href = result.url;
                        }, 2000);
                    }
                    if (typeof LoginPageTracking !== 'undefined' && typeof LoginPageTracking.Callback === 'function') {
                        LoginPageTracking.Callback(result);
                    }
                }
                $(document).ready(function () {

                    $("#vendor-login input[name^='vendor-']").keypress(function (e) {
                        if (e.which == 13) {
                            $('#vendor-login .login').trigger('click');
                            return false;
                        }
                    });
                    var html = $('#vendor-mesaj').html();
                    setInterval(function () {
                        if ($('#vendor-mesaj').html() != html) {
                            $('#vendor-mesaj').fadeIn();
                        }
                    }, 500);

                    if ($('#vendor-remember').length > 0 && $.cookie('email') !== null && $.cookie('email').length > 5) {
                        $('#vendor-email').val($.cookie('email'));
                        $('#vendor-password').val($.cookie('password'));
                        $('#vendor-remember').prop('checked', true);
                    }
                });
            </script>
        {elseif $IS_VENDOR_MESSAGE_ACTIVE==true}
            {#vendor_is_not_active#}
        {else}
            <div class="col col-12 box-border">
                <div class="row">
                    <div class="col col-12 pageTitle">
                        <div class="row mb lightBg member" id="fullname"></div>
                        <script>
                            $('#fullname').text('{#hello#} ' + MEMBER_INFO.FIRST_NAME + ' ' + MEMBER_INFO.LAST_NAME);
                        </script>
                    </div>
                    <!-- bölge müdürü bilgisi -->
                    {if $IS_CURRENT_ACCOUNT_ACTIVE==1}
                    <div class="box col-12">
                        <div class="col col-6 col-md-12 col-sm-12 col-ml-3 col-mr-3">
                            <div class="region-manager-box">
                                <div style="background-color: gray; color: white; padding: 10px; text-align: center; font-size: 16px; border-radius: 5px 5px 0 0;">
                                    <strong>Bölge Müdürünüz</strong>
                                </div>
                                <div class="manager-content" style="display: flex; align-items: center; padding: 10px;">
                                    <div class="manager-details" style="flex: 1;">
                                         <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> <span id="rep_name">Damla Yayınevi</span></p>
                                        <p style="margin: 5px 0;"><strong>Telefon:</strong> <span id="rep_phone">02125142828</span></p>
                                        <p style="margin: 5px 0;"><strong>E-mail:</strong> <span id="rep_email">satisdestek@damlayayinevi.com.tr</span></p>
                                    </div>
                                    <div class="manager-photo" style="margin-left: 10px;">
                                        <img id="rep_img" src="https://cdn.e-damla.com.tr/PUBLIC/plasiyer/genel-merkez.jpg" alt="Plasiyer Resim" style="width: 100px; height: auto; border-radius: 5px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/if}
                    <!-- bölge müdürü bilgisi -->
                    <div class="box col-12">
                        <div class="col col-6 col-md-12 col-sm-12 col-ml-3 col-mr-3">
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_ORDERS}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#orders#}
                                </a>
                            </div>
                            {if $IS_CURRENT_ACCOUNT_ACTIVE==1}
                                <div class="box col-6">
                                    <a href="/{$PAGE_LINK.MEMBER_CURRENT_ACCOUNT}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center" target="_blank">
                                        {#current_account#}
                                    </a>
                                </div>
                                <div class="box col-6">
                                    <a href="/pay" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center" target="_blank">
                                        {#pay_with_credit_cart#}
                                    </a>
                                </div>
                            {/if}
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_PERSONAL_INFO}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#personal_informations#}
                                </a>
                            </div>
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_SHOPPING_LIST}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#shopping_list#}
                                </a>
                            </div>
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_GIFT_CHECK}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#gift_coupons#}
                                </a>
                            </div>
                            {if $IS_COMMENT_POINTS_ACTIVE}
                                <div class="box col-6">
                                    <a href="/{$PAGE_LINK.MEMBER_COMMENT_POINT}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                        {#points#}
                                    </a>
                                </div>
                            {/if}
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_ADDRESS_LIST}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#adddress_info#}
                                </a>
                            </div>
                            {if $IS_MESSAGE_ACTIVE==1}
                                <div class="box col-6">
                                    <a href="/{$PAGE_LINK.MEMBER_MESSAGES}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                        {#messages#}
                                    </a>
                                </div>
                            {/if}
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_PRICE_ALERT_LIST}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#price_alert#}
                                </a>
                            </div>
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_STOCK_ALERT_LIST}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#stock_alert#}
                                </a>
                            </div>
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_MONEY_ORDER_NOTIFICATION}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#money_order_notificiation#}
                                </a>
                            </div>
                            <div class="box col-6">
                                <a href="/{$PAGE_LINK.MEMBER_PASSWORD_CHANGE}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#change_password#}
                                </a>
                            </div>
                            <div class="box col-6">
                                <a href="#" class="logout btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                    {#logout#}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>