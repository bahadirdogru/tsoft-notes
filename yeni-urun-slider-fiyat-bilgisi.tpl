 {if $P.IS_DISPLAY_PRODUCT == 0}
                            <div class="box col-12">

                              <div class="fl col-12 tooltipWrapper">

                                <div class="productPrice col-12 fl">

                                  {if $P.DISCOUNT_PERCENT > 0 && $P.IS_DISPLAY_DISCOUNTED_ACTIVE == 1}

                                  <div class="fl productDiscount">%{$P.DISCOUNT_PERCENT}</div>

                                  {/if}

                                  <div class="priceWrapper">

                                    <div class="currentPrice {if $P.DISCOUNT_PERCENT > 0}currentPrice2{/if}">

                                      {vat price=$P.PRICE_SELL vat=$P.VAT} {$P.TARGET_CURRENCY}

                                    </div>

                                    {if $P.DISCOUNT_PERCENT > 0 && $P.IS_DISPLAY_DISCOUNTED_ACTIVE == 1}

                                    <div class="discountedPrice">

                                      {vat price=$P.PRICE_NOT_DISCOUNTED vat=$P.VAT} {$P.TARGET_CURRENCY}

                                    </div>

                                    {/if}

                                  </div>

                                </div>

                                <div class="fl col-12 dn-xs">

                                  <input type="hidden" id="Adet{$P.ID}{$BLOCK_ID}" name="Adet{$P.ID}{$BLOCK_ID}" value="{$P.MIN_ORDER_COUNT|default:1}" />

                                  {if $DISPLAY_CART_BUTTON == 1}

                                  <a onclick="Add2Cart({$P.ID}, $('#subPro{$P.ID}{$BLOCK_ID}').val(), $('#Adet{$P.ID}{$BLOCK_ID}').val());" class="fl col-12 basketBtn2" data-parent="{$P.ID}{$BLOCK_ID}">Sepete Ekle</a>

                                  {/if}

                                </div>

                              </div>

                            </div>
                        {/if}