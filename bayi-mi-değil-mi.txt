{if $IS_CURRENT_ACCOUNT_ACTIVE==1}
                                    <div class="box col-6 col-sm-12">
                                        <a href="/{$PAGE_LINK.MEMBER_CURRENT_ACCOUNT}" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center" target="_blank">
                                            {#current_account#}
                                        </a>
                                    </div>
                                    <div class="box col-6 col-sm-12">
                                        <a href="/pay" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center" target="_blank">
                                            {#pay_with_credit_cart#}
                                        </a>
                                    </div>
                                {/if}