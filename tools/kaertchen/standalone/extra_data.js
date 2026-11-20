/* Daten für extra.js: Texte der Karten mit Übersetzungen (TR / AR / VI). Übersetzungen maschinell erstellt – bitte gegenlesen lassen. */
const fs = require('fs'), path = require('path');

/* Bingo: Übersetzungen der Sätze stammen aus LF2_M_1_Live-App_Stoerer-Bingo.html (Reihenfolge dort: ar, vi, tr) */
function bingo() {
  const s = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'LF2_M_1_Live-App_Stoerer-Bingo.html'), 'utf8');
  const i = s.indexOf('const TRB=') + 10, j = s.indexOf('};', i) + 1;
  const T = JSON.parse(s.slice(i, j));
  const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'bingo_cards_LF2_M1.json'), 'utf8'));
  const out = {};
  for (const [k, arr] of Object.entries(cards)) out[k] = arr.map(p => { const t = T[p]; if (!t) throw new Error('Keine Übersetzung: ' + p); return { de: p, ar: t[0], vi: t[1], tr: t[2] }; });
  return out;
}

const WAREN = [
  { name: 'Wanderschuhe', price: '89 € (Einsteiger) · 149 € (Mittelklasse) · 219 € (rahmengenäht)', feat: 'Membran, Vibram-Sohle, stützender Schaft, auf Wunsch neu besohlbar',
    tr: ['Trekking ayakkabısı', 'zar (membran), Vibram taban, destekli konç, istenirse yeniden tabanlanabilir'], ar: ['حذاء للمشي الجبلي', 'غشاء مقاوم للماء، نعل فيبرام، ساق داعمة، يمكن تغيير النعل عند الطلب'], vi: ['Giày đi bộ đường dài', 'màng chống thấm, đế Vibram, cổ giày nâng đỡ, có thể thay đế mới theo yêu cầu'] },
  { name: 'Kaffeevollautomat', price: '349 € · 549 € · 899 €', feat: 'Mahlwerk aus Keramik, Milchaufschäumer, Selbstreinigung, herausnehmbare Brüheinheit',
    tr: ['Tam otomatik kahve makinesi', 'seramik öğütücü, süt köpürtücü, otomatik temizlik, çıkarılabilir demleme ünitesi'], ar: ['ماكينة قهوة أوتوماتيكية بالكامل', 'مطحنة من السيراميك، جهاز لتشكيل رغوة الحليب، تنظيف ذاتي، وحدة تحضير قابلة للإزالة'], vi: ['Máy pha cà phê tự động hoàn toàn', 'bộ xay bằng gốm, đánh sữa tạo bọt, tự làm sạch, bộ pha có thể tháo rời'] },
  { name: 'Regenjacke für Kinder', price: '39 € · 69 € · 99 €', feat: 'verschweißte Nähte, Kapuze mit Schirm, reflektierende Streifen, mitwachsende Ärmel',
    tr: ['Çocuk yağmurluğu', 'kaynaklı dikişler, siperlikli kapüşon, reflektör şeritler, birlikte büyüyen kollar'], ar: ['جاكيت مطر للأطفال', 'درزات ملحومة، قبعة بحافة، شرائط عاكسة، أكمام تكبر مع الطفل'], vi: ['Áo mưa trẻ em', 'đường may hàn kín, mũ trùm có vành, dải phản quang, tay áo điều chỉnh theo độ lớn'] },
  { name: 'Handtasche', price: '59 € · 119 € · 189 €', feat: 'gewachstes Leder, gepolstertes Laptopfach, breiter Tragegurt, Innenfächer für Schlüssel und Handy',
    tr: ['El çantası', 'yağlı (cilalı) deri, yastıklı dizüstü bilgisayar gözü, geniş omuz askısı, anahtar ve cep telefonu için iç gözler'], ar: ['حقيبة يد', 'جلد مشمَّع، جيب مبطَّن للابتوب، حزام عريض، جيوب داخلية للمفاتيح والهاتف'], vi: ['Túi xách', 'da sáp, ngăn laptop có đệm, dây đeo rộng, ngăn trong cho chìa khóa và điện thoại'] },
  { name: 'Akkuschrauber', price: '69 € · 129 € · 199 €', feat: '18 Volt, Wechselakku, Schnellladegerät in einer Stunde, Metallgetriebe, Koffer',
    tr: ['Akülü vidalama makinesi', '18 volt, değiştirilebilir akü, bir saatte hızlı şarj cihazı, metal dişli, çanta'], ar: ['مفك براغي لاسلكي', '18 فولت، بطارية قابلة للتبديل، شاحن سريع في ساعة واحدة، تروس معدنية، حقيبة'], vi: ['Máy vặn vít dùng pin', '18 vôn, pin thay được, sạc nhanh trong một giờ, hộp số kim loại, vali đựng'] },
  { name: 'Matratze', price: '290 € · 490 € · 690 €', feat: 'sieben Liegezonen, abnehmbarer Bezug bei 60 °C waschbar, zehn Jahre Garantie',
    tr: ['Yatak (şilte)', 'yedi yatış bölgesi, 60 °C’de yıkanabilen çıkarılabilir kılıf, on yıl garanti'], ar: ['مرتبة', 'سبع مناطق نوم، غطاء قابل للإزالة والغسل على 60 درجة، ضمان عشر سنوات'], vi: ['Nệm', 'bảy vùng nằm, vỏ tháo rời giặt được ở 60 °C, bảo hành mười năm'] },
  { name: 'Fahrradhelm', price: '39 € · 79 € · 129 €', feat: 'verstellbares Drehrad, 18 Belüftungsöffnungen, Insektennetz, abnehmbares Visier',
    tr: ['Bisiklet kaskı', 'ayarlanabilir çevirme düğmesi, 18 havalandırma deliği, böcek filesi, çıkarılabilir siperlik'], ar: ['خوذة دراجة', 'عجلة ضبط، 18 فتحة تهوية، شبكة ضد الحشرات، حاجب قابل للإزالة'], vi: ['Mũ bảo hiểm xe đạp', 'núm xoay điều chỉnh, 18 lỗ thông gió, lưới chống côn trùng, lưỡi trai tháo rời'] },
  { name: 'Espressokanne und Kaffee', price: 'Kanne 24 € · 39 € · 59 €, Kaffee 500 g 7,90 € · 12,50 €', feat: 'Aluminium oder Edelstahl, induktionsgeeignet, Bohnen aus fairem Handel',
    tr: ['Espresso demliği ve kahve', 'alüminyum veya paslanmaz çelik, indüksiyonlu ocağa uygun, adil ticaret çekirdekleri'], ar: ['إبريق إسبريسو وقهوة', 'ألمنيوم أو ستانلس ستيل، مناسب للطهي بالحث، حبوب من التجارة العادلة'], vi: ['Bình pha espresso và cà phê', 'nhôm hoặc inox, dùng được trên bếp từ, hạt cà phê thương mại công bằng'] },
];
const WAREN_LABEL = { tr: 'Özellikler', ar: 'الميزات', vi: 'Đặc điểm' };

const KUNDEN = [
  { de: 'Sie haben es eilig und sagen das auch.', motiv: 'Zeitersparnis', einwand: '„Das dauert mir zu lange, ich nehme einfach irgendwas.“', kauf: 'Wenn die Verkäuferin ruhig bleibt und Ihnen schnell hilft, kaufen Sie.',
    tr: 'Acele ediyorsunuz ve bunu söylüyorsunuz. Satın alma nedeni: zaman kazanmak. İtiraz: „Bu çok uzun sürüyor, rastgele bir şey alırım.“ Satış görevlisi sakin kalır ve size hızlı yardım ederse satın alırsınız.',
    ar: 'أنتَ مستعجل وتقول ذلك. دافع الشراء: توفير الوقت. الاعتراض: «هذا يستغرق وقتًا طويلًا، سآخذ أي شيء.» إذا بقيت البائعة هادئة وساعدتك بسرعة، فإنك تشتري.',
    vi: 'Bạn đang vội và nói ra điều đó. Động cơ mua: tiết kiệm thời gian. Phản đối: „Lâu quá, tôi lấy đại một cái.“ Nếu nhân viên bình tĩnh và giúp bạn nhanh, bạn sẽ mua.' },
  { de: 'Sie achten sehr auf den Preis und vergleichen laut mit dem Internet.', motiv: 'Sparsamkeit', einwand: '„Online kostet das 40 Euro weniger.“', kauf: 'Wenn Sie einen echten Vorteil vor Ort hören, kaufen Sie.',
    tr: 'Fiyata çok dikkat ediyorsunuz ve sesli olarak internetle karşılaştırıyorsunuz. Satın alma nedeni: tutumluluk. İtiraz: „İnternette bu 40 euro daha ucuz.“ Mağazada gerçek bir avantaj duyarsanız satın alırsınız.',
    ar: 'تهتم كثيرًا بالسعر وتقارن بصوت عالٍ مع الإنترنت. دافع الشراء: التوفير. الاعتراض: «على الإنترنت هذا أرخص بـ 40 يورو.» إذا سمعتَ ميزة حقيقية في المتجر، فإنك تشتري.',
    vi: 'Bạn rất chú ý đến giá và so sánh to tiếng với Internet. Động cơ mua: tiết kiệm. Phản đối: „Trên mạng rẻ hơn 40 euro.“ Nếu nghe được lợi ích thật sự khi mua tại cửa hàng, bạn sẽ mua.' },
  { de: 'Sie wollen etwas Besonderes, das man sieht.', motiv: 'Geltungsbedürfnis, aber Sie sprechen es nicht aus', einwand: '„Haben Sie nichts Hochwertigeres?“', kauf: 'Sie kaufen die teuerste Ausführung, wenn sie gut begründet wird.',
    tr: 'Göze çarpan özel bir şey istiyorsunuz. Satın alma nedeni: saygınlık/gösteriş isteği, ama bunu dile getirmezsiniz. İtiraz: „Daha kaliteli bir şeyiniz yok mu?“ İyi gerekçelendirilirse en pahalı modeli alırsınız.',
    ar: 'تريد شيئًا مميزًا يلفت الأنظار. دافع الشراء: الحاجة إلى المكانة، لكنك لا تصرّح بذلك. الاعتراض: «أليس لديكم شيء أفخر؟» تشتري أغلى طراز إذا جرى تبريره جيدًا.',
    vi: 'Bạn muốn thứ gì đó đặc biệt, nổi bật. Động cơ mua: muốn thể hiện, nhưng bạn không nói ra. Phản đối: „Bạn không có cái nào cao cấp hơn à?“ Bạn mua loại đắt nhất nếu được giải thích thuyết phục.' },
  { de: 'Sie sind unsicher und können sich schlecht entscheiden.', motiv: 'Sicherheit', einwand: '„Ich weiß nicht … ich überlege es mir noch mal.“', kauf: 'Sie kaufen, wenn die Verkäuferin Ihnen begründet etwas empfiehlt.',
    tr: 'Kararsızsınız ve karar vermekte zorlanıyorsunuz. Satın alma nedeni: güvenlik. İtiraz: „Bilmiyorum … bir daha düşüneyim.“ Satış görevlisi gerekçeli bir öneride bulunursa satın alırsınız.',
    ar: 'أنت غير واثق ويصعب عليك اتخاذ القرار. دافع الشراء: الأمان. الاعتراض: «لا أعرف … سأفكّر مرة أخرى.» تشتري إذا نصحتك البائعة بشيء مع ذكر الأسباب.',
    vi: 'Bạn không chắc chắn và khó quyết định. Động cơ mua: sự an tâm. Phản đối: „Tôi không biết … để tôi suy nghĩ lại.“ Bạn mua nếu nhân viên đề xuất kèm lý do rõ ràng.' },
  { de: 'Sie kaufen ein Geschenk und kennen sich mit der Ware gar nicht aus.', motiv: 'Es soll gefallen', einwand: '„Und wenn es ihr nicht gefällt?“', kauf: 'Sie kaufen, wenn Sie vom Umtausch hören.',
    tr: 'Hediye alıyorsunuz ve ürün hakkında hiçbir bilginiz yok. Satın alma nedeni: beğenilmesini istiyorsunuz. İtiraz: „Ya hoşuna gitmezse?“ Değişim hakkını duyarsanız satın alırsınız.',
    ar: 'تشتري هدية ولا تعرف شيئًا عن هذه السلعة. دافع الشراء: أن تعجب الهدية. الاعتراض: «وماذا لو لم تعجبها؟» تشتري إذا سمعتَ عن إمكانية الاستبدال.',
    vi: 'Bạn mua quà tặng và hoàn toàn không biết gì về món hàng. Động cơ mua: muốn người nhận thích. Phản đối: „Nếu cô ấy không thích thì sao?“ Bạn mua nếu nghe nói có thể đổi hàng.' },
  { de: 'Sie achten auf Umwelt und Herkunft.', motiv: 'Umweltbewusstsein', einwand: '„Wo wird das denn hergestellt?“', kauf: 'Sie kaufen, wenn die Verkäuferin dazu etwas sagen kann.',
    tr: 'Çevreye ve ürünün menşeine dikkat ediyorsunuz. Satın alma nedeni: çevre bilinci. İtiraz: „Bu nerede üretiliyor?“ Satış görevlisi bu konuda bilgi verebilirse satın alırsınız.',
    ar: 'تهتم بالبيئة وبمصدر المنتج. دافع الشراء: الوعي البيئي. الاعتراض: «أين يُصنَّع هذا؟» تشتري إذا استطاعت البائعة أن تقول شيئًا عن ذلك.',
    vi: 'Bạn quan tâm đến môi trường và nguồn gốc. Động cơ mua: ý thức bảo vệ môi trường. Phản đối: „Cái này được sản xuất ở đâu vậy?“ Bạn mua nếu nhân viên trả lời được về điều đó.' },
  { de: 'Sie reden viel und kommen vom Thema ab.', motiv: 'Kontakt', einwand: 'keiner, aber Sie erzählen dreimal von Ihrem Urlaub', kauf: 'Sie kaufen, wenn die Verkäuferin Sie freundlich zum Thema zurückführt.',
    tr: 'Çok konuşuyorsunuz ve konudan sapıyorsunuz. Satın alma nedeni: iletişim kurmak. İtiraz: yok, ama üç kez tatilinizi anlatırsınız. Satış görevlisi sizi nazikçe konuya geri döndürürse satın alırsınız.',
    ar: 'تتحدث كثيرًا وتخرج عن الموضوع. دافع الشراء: التواصل. الاعتراض: لا يوجد، لكنك تحكي ثلاث مرات عن إجازتك. تشتري إذا أعادتك البائعة إلى الموضوع بلطف.',
    vi: 'Bạn nói nhiều và lạc đề. Động cơ mua: muốn trò chuyện. Phản đối: không có, nhưng bạn kể ba lần về kỳ nghỉ của mình. Bạn mua nếu nhân viên nhẹ nhàng đưa bạn quay lại chủ đề.' },
  { de: 'Sie sagen fast nichts und antworten einsilbig.', motiv: 'Qualität', einwand: '„Hm. Ja. Mal sehen.“', kauf: 'Sie kaufen, wenn die Verkäuferin Ihnen Ware vorlegt, statt weiter zu fragen.',
    tr: 'Neredeyse hiçbir şey söylemiyorsunuz ve tek kelimeyle cevap veriyorsunuz. Satın alma nedeni: kalite. İtiraz: „Hım. Evet. Bakalım.“ Satış görevlisi soru sormaya devam etmek yerine size ürünleri gösterirse satın alırsınız.',
    ar: 'لا تقول تقريبًا شيئًا وتجيب بكلمة واحدة. دافع الشراء: الجودة. الاعتراض: «همم. نعم. سنرى.» تشتري إذا عرضت عليك البائعة البضاعة بدلًا من الاستمرار في طرح الأسئلة.',
    vi: 'Bạn hầu như không nói gì và chỉ trả lời cụt ngủn. Động cơ mua: chất lượng. Phản đối: „Ừm. Ừ. Để xem.“ Bạn mua nếu nhân viên đưa hàng ra cho bạn xem thay vì hỏi tiếp.' },
];
const KUNDE_LABEL = { tr: 'MÜŞTERİ', ar: 'الزبون', vi: 'KHÁCH' };

const ANGEBOTE = [
  { k: 'A', title: 'Lieferer A · Rain Asia Import GmbH, Hamburg',
    de: ['Regenschirm „Storm“, Stahlgestell, 3 Farben', '6,00 € je Stück netto', '10 % Rabatt ab 200 Stück', '2 % Skonto bei Zahlung in 10 Tagen, sonst 30 Tage netto', 'Fracht insgesamt 96,00 €', 'Lieferzeit 6 Wochen ab Bestellung', 'Herkunft: Fernost, keine Siegel'],
    tr: ['„Storm“ şemsiye, çelik iskelet, 3 renk', 'Adedi 6,00 € net', '200 adetten itibaren %10 indirim', '10 gün içinde ödemede %2 iskonto, aksi halde 30 gün net', 'Toplam navlun 96,00 €', 'Teslim süresi siparişten itibaren 6 hafta', 'Menşe: Uzak Doğu, sertifika yok'],
    ar: ['مظلة «Storm»، هيكل فولاذي، 3 ألوان', '6,00 يورو للقطعة صافي', 'خصم 10٪ ابتداءً من 200 قطعة', 'خصم نقدي 2٪ عند الدفع خلال 10 أيام، وإلا 30 يومًا صافي', 'الشحن الإجمالي 96,00 يورو', 'مدة التسليم 6 أسابيع من الطلب', 'المصدر: الشرق الأقصى، دون شهادات'],
    vi: ['Ô „Storm“, khung thép, 3 màu', '6,00 € mỗi chiếc (giá ròng)', 'Giảm giá 10 % từ 200 chiếc', 'Chiết khấu thanh toán 2 % nếu trả trong 10 ngày, nếu không thì 30 ngày giá ròng', 'Cước vận chuyển tổng cộng 96,00 €', 'Thời gian giao hàng 6 tuần kể từ khi đặt', 'Xuất xứ: Viễn Đông, không có chứng nhận'] },
  { k: 'B', title: 'Lieferer B · Nordsee Schirme GmbH, Bremen',
    de: ['Regenschirm „Deich“, recyceltes Material, 3 Farben', '7,20 € je Stück netto', '15 % Rabatt ab 200 Stück', '3 % Skonto bei Zahlung in 14 Tagen', 'Lieferung frei Haus', 'Lieferzeit 1 Woche', 'faire Produktion (Siegel), Mehrwegkartons'],
    tr: ['„Deich“ şemsiye, geri dönüştürülmüş malzeme, 3 renk', 'Adedi 7,20 € net', '200 adetten itibaren %15 indirim', '14 gün içinde ödemede %3 iskonto', 'Adrese ücretsiz teslimat', 'Teslim süresi 1 hafta', 'Adil üretim (sertifikalı), tekrar kullanılabilir koliler'],
    ar: ['مظلة «Deich»، مواد معاد تدويرها، 3 ألوان', '7,20 يورو للقطعة صافي', 'خصم 15٪ ابتداءً من 200 قطعة', 'خصم نقدي 3٪ عند الدفع خلال 14 يومًا', 'التوصيل مجانًا حتى الباب', 'مدة التسليم أسبوع واحد', 'إنتاج عادل (بشهادة)، كراتين قابلة لإعادة الاستخدام'],
    vi: ['Ô „Deich“, vật liệu tái chế, 3 màu', '7,20 € mỗi chiếc (giá ròng)', 'Giảm giá 15 % từ 200 chiếc', 'Chiết khấu thanh toán 3 % nếu trả trong 14 ngày', 'Giao hàng tận nơi miễn phí', 'Thời gian giao hàng 1 tuần', 'Sản xuất công bằng (có chứng nhận), thùng carton dùng lại được'] },
  { k: 'C', title: 'Lieferer C · Weser-Großhandel KG, Bremerhaven',
    de: ['Regenschirm „Hafen“, 5 Farben', '6,40 € je Stück netto, Preise freibleibend', '5 % Rabatt', 'Zahlung 30 Tage ohne Abzug', 'Fracht 30,00 €', 'Lieferzeit 3 Tage', 'Kauf auf Abruf möglich'],
    tr: ['„Hafen“ şemsiye, 5 renk', 'Adedi 6,40 € net, fiyatlar bağlayıcı değildir', '%5 indirim', 'Ödeme 30 gün, kesintisiz', 'Navlun 30,00 €', 'Teslim süresi 3 gün', 'İstek üzerine (çağrı ile) alım mümkün'],
    ar: ['مظلة «Hafen»، 5 ألوان', '6,40 يورو للقطعة صافي، الأسعار غير ملزمة', 'خصم 5٪', 'الدفع خلال 30 يومًا دون خصم', 'الشحن 30,00 يورو', 'مدة التسليم 3 أيام', 'الشراء عند الطلب ممكن'],
    vi: ['Ô „Hafen“, 5 màu', '6,40 € mỗi chiếc (giá ròng), giá không ràng buộc', 'Giảm giá 5 %', 'Thanh toán 30 ngày, không khấu trừ', 'Cước vận chuyển 30,00 €', 'Thời gian giao hàng 3 ngày', 'Có thể mua theo yêu cầu (gọi hàng)'] },
];

const EREIGNISSE = [
  { title: 'Ereignis 1 – Lieferzeit', de: 'Euer Lieferer meldet: Nachbestellungen dauern jetzt 5 statt 3 Tage. Ihr verkauft 6 Schirme am Tag, Mindestbestand 20. Berechnet den alten und den neuen Meldebestand.',
    tr: ['Olay 1 – Teslim süresi', 'Tedarikçiniz bildiriyor: Ek siparişler artık 3 değil 5 gün sürüyor. Günde 6 şemsiye satıyorsunuz, asgari stok 20. Eski ve yeni sipariş (bildirim) stoğunu hesaplayın.'],
    ar: ['الحدث 1 – مدة التسليم', 'يُبلغكم مورّدكم: الطلبات الإضافية تستغرق الآن 5 أيام بدلًا من 3. تبيعون 6 مظلات في اليوم، والحد الأدنى للمخزون 20. احسبوا حدّ إعادة الطلب القديم والجديد.'],
    vi: ['Sự kiện 1 – Thời gian giao hàng', 'Nhà cung cấp báo: đặt hàng bổ sung giờ mất 5 ngày thay vì 3. Mỗi ngày các bạn bán 6 chiếc ô, tồn kho tối thiểu 20. Hãy tính mức tồn kho báo đặt hàng cũ và mới.'] },
  { title: 'Ereignis 2 – Freibleibend', de: 'Lieferer C antwortet auf eure Bestellung: „Der Preis ist leider auf 6,90 € gestiegen.“ Ist ein Kaufvertrag zu 6,40 € zustande gekommen?',
    tr: ['Olay 2 – Bağlayıcı olmayan fiyat', 'Tedarikçi C siparişinize şöyle yanıt veriyor: „Fiyat maalesef 6,90 €’ya yükseldi.“ 6,40 € üzerinden bir satış sözleşmesi oluştu mu?'],
    ar: ['الحدث 2 – سعر غير ملزم', 'يرد المورّد C على طلبكم: «للأسف ارتفع السعر إلى 6,90 يورو.» هل نشأ عقد بيع بسعر 6,40 يورو؟'],
    vi: ['Sự kiện 2 – Giá không ràng buộc', 'Nhà cung cấp C trả lời đơn đặt hàng của các bạn: „Rất tiếc, giá đã tăng lên 6,90 €.“ Hợp đồng mua bán với giá 6,40 € đã được hình thành chưa?'] },
  { title: 'Ereignis 3 – Rechnung', de: 'Die Rechnung kommt: Warenwert netto 1.424,74 € (nach Rabatt), + 19 % USt = 1.695,44 €. Zahlung mit 3 % Skonto. Berechnet den Überweisungsbetrag.',
    tr: ['Olay 3 – Fatura', 'Fatura geldi: net mal bedeli 1.424,74 € (indirimden sonra), + %19 KDV = 1.695,44 €. Ödeme %3 iskonto ile yapılacak. Havale tutarını hesaplayın.'],
    ar: ['الحدث 3 – الفاتورة', 'وصلت الفاتورة: قيمة البضاعة صافي 1.424,74 يورو (بعد الخصم)، + 19٪ ضريبة القيمة المضافة = 1.695,44 يورو. الدفع مع خصم نقدي 3٪. احسبوا المبلغ المحوَّل.'],
    vi: ['Sự kiện 3 – Hóa đơn', 'Hóa đơn đến: giá trị hàng ròng 1.424,74 € (sau giảm giá), + 19 % thuế GTGT = 1.695,44 €. Thanh toán với chiết khấu 3 %. Hãy tính số tiền chuyển khoản.'] },
  { title: 'Ereignis 4 – Unbestellte Ware', de: 'Mit der Lieferung kommen 50 Paar Gummistiefel, die niemand bestellt hat. Was tut ihr?',
    tr: ['Olay 4 – Sipariş edilmemiş mal', 'Teslimatla birlikte kimsenin sipariş etmediği 50 çift lastik çizme geliyor. Ne yaparsınız?'],
    ar: ['الحدث 4 – بضاعة غير مطلوبة', 'مع التسليم وصلت 50 زوجًا من الجزم المطاطية لم يطلبها أحد. ماذا تفعلون؟'],
    vi: ['Sự kiện 4 – Hàng không đặt', 'Cùng với lô hàng có 50 đôi ủng cao su mà không ai đặt. Các bạn làm gì?'] },
  { title: 'Ereignis 5 – Eingabefehler', de: 'Beim Wareneingang werden 420 statt 240 Schirme im WWS erfasst. Was passiert, wenn niemand es merkt?',
    tr: ['Olay 5 – Giriş hatası', 'Mal girişinde 240 yerine 420 şemsiye mal yönetim sistemine (WWS) kaydediliyor. Kimse fark etmezse ne olur?'],
    ar: ['الحدث 5 – خطأ في الإدخال', 'عند استلام البضاعة سُجّلت 420 مظلة بدلًا من 240 في نظام إدارة البضائع (WWS). ماذا يحدث إذا لم يلاحظ أحد ذلك؟'],
    vi: ['Sự kiện 5 – Lỗi nhập liệu', 'Khi nhập hàng, hệ thống quản lý hàng hóa (WWS) ghi 420 thay vì 240 chiếc ô. Điều gì xảy ra nếu không ai nhận ra?'] },
  { title: 'Ereignis 6 – Herbstmarkt', de: 'Die Geschäftsführung will die Schirme zum Herbstmarkt „am 10.10. fix“. Welche Kaufart ist das, und was gilt, wenn die Ware am 14.10. kommt?',
    tr: ['Olay 6 – Sonbahar pazarı', 'İşletme yönetimi şemsiyeleri sonbahar pazarına „10.10.’da kesin“ istiyor. Bu hangi satın alma türüdür ve mal 14.10.’da gelirse ne geçerlidir?'],
    ar: ['الحدث 6 – سوق الخريف', 'تريد الإدارة المظلات لسوق الخريف «في 10.10 بالتحديد». ما نوع هذا الشراء، وماذا يسري إذا وصلت البضاعة في 14.10؟'],
    vi: ['Sự kiện 6 – Chợ mùa thu', 'Ban giám đốc muốn có ô cho chợ mùa thu „đúng ngày 10.10“. Đây là loại mua nào, và điều gì áp dụng nếu hàng đến ngày 14.10?'] },
];

const TEE = [
  { name: 'Rooibos', kg: '18,00 €', g100: '1,80 €', tr: 'Rooibos', ar: 'روييبوس', vi: 'Rooibos' },
  { name: 'Pfefferminze', kg: '12,40 €', g100: '1,24 €', tr: 'Nane çayı', ar: 'شاي النعناع', vi: 'Trà bạc hà' },
  { name: 'Earl Grey', kg: '26,80 €', g100: '2,68 €', tr: 'Earl Grey', ar: 'إيرل غراي', vi: 'Earl Grey' },
  { name: 'Früchtetee', kg: '15,60 €', g100: '1,56 €', tr: 'Meyve çayı', ar: 'شاي الفواكه', vi: 'Trà trái cây' },
];

module.exports = { bingo, WAREN, WAREN_LABEL, KUNDEN, KUNDE_LABEL, ANGEBOTE, EREIGNISSE, TEE };
