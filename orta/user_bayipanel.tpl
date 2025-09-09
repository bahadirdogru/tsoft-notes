<script>
    var MEMBER_INFO = window.damla.memberInfo;
    /*var MEMBER_INFO = 
    {
        "ID": 33773,
        "ID_HASH_SHA": "a5ac27134d69fd2ae5076f18f283bf8f92bde7502eec03945be1eee2dc0f3606",
        "CODE": "T33773",
        "FIRST_NAME": "Bahadır",
        "LAST_NAME": "Doğru",
        "BIRTH_DATE": "0000-00-00",
        "GENDER": "E",
        "MAIL": "bdogru@damlayayinevi.com.tr",
        "MAIL_HASH": "5123caf6ebc3eeb90ae7c61b29a8e36c",
        "MAIL_HASH_SHA": "6ab2f724e3cbdce30557c8ce2d087f8f36208c902b74375daf6c2f6767199c5b",
        "GROUP": 6,
        "MAIL_PERMISSION": false,
        "SMS_PERMISSION": false,
        "PHONE_PERMISSION": false,
        "PHONE": "+90",
        "PHONE_HASH": "43c3e7a1799125d472e8f0107989bce1",
        "PHONE_HASH_SHA": "f03e5b524bba4869f2819901d3a90cfb2e632e787f0a29aa885fda97599b166c",
        "IP": "45.139.201.162",
        "TRANSACTION_COUNT": 0,
        "REPRESENTATIVE": "",
        "KVKK": 0,
        "MEMBER_COUNTRY": "tr",
        "MEMBER_CITY": "",
        "MEMBER_TOWN": "",
        "MEMBER_ZIP_CODE": "0",
        "COUNTRY": "TR",
        "E_COUNTRY": ""
    }*/
</script>

<style>
    
</style>

<div class="col col-12" id="page-bayi-panel">
    <div class="row mb">
        <div class="col col-12 box-border">
            <div class="row">
                <div class="col col-12 pageTitle">
                    <div class="row mb lightBg cargo">Bayi Paneline Hoş Geldiniz;
                        <script>document.write(MEMBER_INFO.FIRST_NAME + ' ' + MEMBER_INFO.LAST_NAME);</script>
                    </div>
                </div>

                <!-- Bölge Müdürü Bilgisi -->
                <div class="box col-12">
                    <div class="col col-6 col-md-12 col-sm-12 col-ml-3 col-mr-3">
                        <div class="region-manager-box">
                            <div
                                style="background-color: gray; color: white; padding: 10px; text-align: center; font-size: 16px; border-radius: 5px 5px 0 0;">
                                <strong>Bölge Müdürünüz</strong>
                            </div>
                            <div class="manager-content" style="display: flex; align-items: center; padding: 10px;">
                                <div class="manager-details" style="flex: 1;">
                                    <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> <span id="rep_name">Ahmet Ünal</span></p>
                                    <p style="margin: 5px 0;"><strong>Telefon:</strong> <span
                                            id="rep_phone">0533 484 06 26</span></p>
                                    <p style="margin: 5px 0;"><strong>E-mail:</strong> <span
                                            id="rep_email">aunal@damlayayinevi.com.tr</span></p>
                                </div>
                                <div class="manager-photo" style="margin-left: 10px;">
                                    <img id="rep_img" src="https://cdn.e-damla.com.tr/PUBLIC/plasiyer/ahmet-unal.jpg"
                                        alt="Plasiyer Resim" style="width: 100px; height: auto; border-radius: 5px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bayi Panel Butonları -->
                <div class="box col-12">
                    <div class="col col-6 col-md-12 col-sm-12 col-ml-3 col-mr-3">
                        <div class="box col-4">
                            <a href="/pay" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center"
                                target="_blank">
                                Cari Ödeme
                            </a>
                        </div>
                        <div class="box col-4">
                            <a href="/raporlar"
                                class="btn col-12 btn-default btn-big btn-upper btn-radius a-center" target="_blank">
                                Cari Hareketler
                            </a>
                        </div>
                        <div class="box col-4">
                            <a href="/raporlar"
                                class="btn col-12 btn-default btn-big btn-upper btn-radius a-center" target="_blank">
                                E-Faturalarım
                            </a>
                        </div>
                        <div class="box col-4">
                            <a href="/fiyat-listesi"
                                class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                Fiyat Listesi
                            </a>
                        </div>
                        <div class="box col-4">
                            <a href="/kataloglar"
                                class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                Kataloglar
                            </a>
                        </div>
                        <div class="box col-4">
                            <a href="https://www.e-damla.com.tr/dijital-icerikler" target="_blank" class="btn col-12 btn-default btn-big btn-upper btn-radius a-center">
                                Dijital İçerikler (Akıllı Tahta)
                            </a>
                        </div>
                    </div>
                </div>


                <div class="box col-12 content-box">
                <!-- burası js ile şekillenecek -->
                </div>

            </div>
        </div>
    </div>
</div>