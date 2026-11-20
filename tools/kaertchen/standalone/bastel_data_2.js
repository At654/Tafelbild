/* Übersetzungsblätter LF 6 und LF 7 (VI · AR · TR). Reihenfolge: [de, tr, ar, vi]. Maschinell erstellt – bitte gegenlesen lassen. */
const A = ['Ablauf', 'Akış', 'سير العمل', 'Cách làm'];
const W = ['Wörter und Texte auf dem Bogen', 'Bogundaki kelimeler ve metinler', 'كلمات ونصوص على الورقة', 'Từ và nội dung trên tờ bài'];
module.exports = [
{ id: 'LF6_M09', dir: 'LF_06', file: 'LF6_M09_M10_Spiel_Lieferer_Trumpf', lf: 'LF 6 · M 9–10', versions: ['VI_AR_TR'],
  title: ['Trumpf: Welcher Lieferer gewinnt?', 'Koz oyunu: Hangi tedarikçi kazanır?', 'لعبة التفوّق: أي مورّد يفوز؟', 'Bài so sánh: nhà cung cấp nào thắng?'],
  sections: [
    { h: A, items: [
      ['1. Karten mischen und verteilen, jeder hält seinen Stapel verdeckt.', '1. Kartları karıştırıp dağıtın, herkes destesini kapalı tutar.', '1. اخلطوا البطاقات ووزّعوها، ويحتفظ كل لاعب بكومته مقلوبة.', '1. Xáo và chia bài, mỗi người giữ chồng bài úp xuống.'],
      ['2. Wer dran ist, liest von seiner obersten Karte eine Eigenschaft vor.', '2. Sırası gelen, en üstteki kartından bir özelliği okur.', '2. من جاء دوره يقرأ خاصية من بطاقته العليا.', '2. Ai đến lượt thì đọc một đặc điểm trên lá bài trên cùng.'],
      ['3. Alle vergleichen: Preis und Lieferzeit – niedrig gewinnt; Sterne – hoch gewinnt.', '3. Herkes karşılaştırır: fiyat ve teslim süresi – düşük olan kazanır; yıldız – yüksek olan kazanır.', '3. الجميع يقارنون: السعر ومدة التسليم – الأقل يفوز؛ النجوم – الأعلى يفوز.', '3. Mọi người so sánh: giá và thời gian giao hàng – thấp thì thắng; số sao – cao thì thắng.'],
      ['4. Abschluss: Jede Gruppe wählt mit der Entscheidungsbewertungstabelle den besten Lieferer (Gewichtung z. B. Preis 40 %, Qualität 25 %, Lieferzeit 15 %, Umwelt 20 %).', '4. Sonunda her grup, karar değerlendirme tablosuyla en iyi tedarikçiyi seçer (ağırlık örn. fiyat %40, kalite %25, teslim süresi %15, çevre %20).', '4. في الختام تختار كل مجموعة أفضل مورّد بجدول تقييم القرار (الأوزان مثلًا: السعر 40٪، الجودة 25٪، مدة التسليم 15٪، البيئة 20٪).', '4. Kết thúc: mỗi nhóm chọn nhà cung cấp tốt nhất bằng bảng đánh giá quyết định (trọng số ví dụ: giá 40 %, chất lượng 25 %, thời gian giao 15 %, môi trường 20 %).'] ] },
    { h: W, items: [
      ['Lieferer für Thermobecher', 'Termos bardak tedarikçisi', 'مورّد الأكواب الحرارية', 'Nhà cung cấp cốc giữ nhiệt'],
      ['Bezugspreis je Stück', 'birim başına alış (tedarik) fiyatı', 'سعر الشراء للقطعة', 'giá nhập mỗi chiếc'],
      ['Lieferzeit in Tagen', 'gün olarak teslim süresi', 'مدة التسليم بالأيام', 'thời gian giao hàng (ngày)'],
      ['Qualität (1–5)', 'kalite (1–5)', 'الجودة (1–5)', 'chất lượng (1–5)'],
      ['Umwelt & Soziales (1–5)', 'çevre ve sosyal sorumluluk (1–5)', 'البيئة والمسؤولية الاجتماعية (1–5)', 'môi trường & xã hội (1–5)'],
      ['Zuverlässigkeit (1–5)', 'güvenilirlik (1–5)', 'الموثوقية (1–5)', 'độ tin cậy (1–5)'],
      ['Preis und Lieferzeit: der niedrigste Wert gewinnt.', 'Fiyat ve teslim süresi: en düşük değer kazanır.', 'السعر ومدة التسليم: الأقل يفوز.', 'Giá và thời gian giao: giá trị thấp nhất thắng.'],
      ['Qualität, Umwelt & Soziales, Zuverlässigkeit: der höchste Wert gewinnt.', 'Kalite, çevre ve sosyal sorumluluk, güvenilirlik: en yüksek değer kazanır.', 'الجودة والبيئة والمسؤولية الاجتماعية والموثوقية: الأعلى يفوز.', 'Chất lượng, môi trường & xã hội, độ tin cậy: giá trị cao nhất thắng.'],
      ['Der Gewinner bekommt alle Karten der Runde.', 'Kazanan, turdaki tüm kartları alır.', 'الفائز يأخذ كل بطاقات الجولة.', 'Người thắng lấy hết các lá bài của vòng.'],
      ['Entscheidungsbewertungstabelle', 'karar değerlendirme tablosu', 'جدول تقييم القرار', 'bảng đánh giá quyết định'],
      ['Gewichtung', 'ağırlıklandırma', 'الوزن (الأهمية)', 'trọng số'] ] } ] },

{ id: 'LF6_M12', dir: 'LF_06', file: 'LF6_M12_Spiel_Domino_Kaufarten', lf: 'LF 6 · M 12', versions: ['VI_AR_TR'],
  title: ['Domino: Kaufarten', 'Domino: satın alma türleri', 'دومينو: أنواع الشراء', 'Domino: các loại mua bán'],
  sections: [
    { h: A, items: [
      ['1. Dominosteine ausschneiden und mischen.', '1. Domino taşlarını kesin ve karıştırın.', '1. قصّوا قطع الدومينو واخلطوها.', '1. Cắt các quân domino và xáo trộn.'],
      ['2. Mit dem ⭐-Stein beginnen; rechts steht ein Begriff, die passende Erklärung steht links auf dem nächsten Stein.', '2. ⭐ taşıyla başlayın; sağda bir kavram vardır, uygun açıklama sonraki taşın solundadır.', '2. ابدأوا بقطعة ⭐؛ على اليمين مصطلح، والشرح المناسب على يسار القطعة التالية.', '2. Bắt đầu với quân ⭐; bên phải là một khái niệm, lời giải thích phù hợp nằm bên trái quân kế tiếp.'],
      ['3. Die Kette schließt sich zum Kreis.', '3. Zincir kapanarak bir daire oluşturur.', '3. تُغلق السلسلة لتصبح دائرة.', '3. Chuỗi khép lại thành vòng tròn.'],
      ['4. Paare lesen die Kette laut vor; wer schneller fertig ist, erklärt zwei Kaufarten an einem Beispiel.', '4. Çiftler zinciri yüksek sesle okur; daha hızlı bitiren iki satın alma türünü bir örnekle açıklar.', '4. يقرأ كل زوج السلسلة بصوت عالٍ؛ ومن ينتهي أولًا يشرح نوعي شراء بمثال.', '4. Từng cặp đọc to chuỗi; ai xong nhanh hơn thì giải thích hai loại mua bán bằng một ví dụ.'] ] },
    { h: W, items: [
      ['Sofortkauf: Lieferung sofort nach Vertragsschluss', 'Peşin teslim alım: sözleşmeden hemen sonra teslimat', 'الشراء الفوري: التسليم فور إبرام العقد', 'Mua giao ngay: giao hàng ngay sau khi ký hợp đồng'],
      ['Terminkauf: Lieferung bis zu einem Termin oder in einem Zeitraum', 'Vadeli alım: belirli bir tarihe kadar veya bir zaman aralığında teslimat', 'الشراء لأجل: التسليم حتى موعد أو خلال فترة', 'Mua có kỳ hạn: giao hàng đến một thời điểm hoặc trong một khoảng thời gian'],
      ['Fixkauf: Lieferung genau an einem Termin – danach ist die Ware wertlos', 'Kesin tarihli alım: teslimat tam belirli günde – sonrasında mal değersizdir', 'الشراء بموعد ثابت: التسليم في موعد محدد بالضبط – وبعده تفقد البضاعة قيمتها', 'Mua ấn định ngày: giao đúng một ngày – sau đó hàng vô giá trị'],
      ['Kauf auf Abruf: große Menge kaufen, Teilmengen nach Bedarf abrufen', 'Çağrı üzerine alım: büyük miktar satın alınır, parçalar ihtiyaca göre çağrılır', 'الشراء عند الطلب: شراء كمية كبيرة وطلب أجزاء منها حسب الحاجة', 'Mua theo gọi hàng: mua số lượng lớn, gọi từng phần khi cần'],
      ['Spezifikationskauf: Farbe, Größe, Modell bestimmt der Käufer später', 'Özellik belirlemeli alım: renk, beden, modeli alıcı sonradan belirler', 'الشراء بالمواصفات: يحدد المشتري اللون والمقاس والطراز لاحقًا', 'Mua theo chỉ định: người mua quyết định màu, cỡ, mẫu sau'],
      ['Kauf auf Probe: Ware in einer Frist ausprobieren und zurückgeben dürfen', 'Deneme süreli alım: mal bir süre denenir ve iade edilebilir', 'الشراء بشرط التجربة: يمكن تجربة البضاعة خلال مهلة وإرجاعها', 'Mua dùng thử: được dùng thử trong một thời hạn và trả lại'],
      ['Kauf nach Probe: Ware muss genau dem Muster entsprechen', 'Numuneye göre alım: mal tam olarak numuneye uymalıdır', 'الشراء حسب العيّنة: يجب أن تطابق البضاعة العيّنة تمامًا', 'Mua theo mẫu: hàng phải đúng như hàng mẫu'],
      ['Kauf zur Probe: kleine Menge zum Testen, ohne weitere Verpflichtung', 'Deneme amaçlı alım: test için küçük miktar, başka yükümlülük yok', 'الشراء للتجربة: كمية صغيرة للاختبار دون التزام آخر', 'Mua để thử: số lượng nhỏ để thử, không có nghĩa vụ thêm'],
      ['Verbrauchsgüterkauf: Unternehmer verkauft an Privatperson', 'Tüketici satışı: işletme özel kişiye satar', 'بيع سلع استهلاكية: تاجر يبيع لفرد', 'Mua bán hàng tiêu dùng: doanh nghiệp bán cho cá nhân'],
      ['zweiseitiger Handelskauf: Kaufmann verkauft an Kaufmann', 'Çift taraflı ticari alım: tüccar tüccara satar', 'شراء تجاري ثنائي: تاجر يبيع لتاجر', 'Mua bán thương mại hai bên: thương nhân bán cho thương nhân'],
      ['bürgerlicher Kauf: Privatperson verkauft an Privatperson', 'Medeni hukuk alımı: özel kişi özel kişiye satar', 'الشراء المدني: فرد يبيع لفرد', 'Mua bán dân sự: cá nhân bán cho cá nhân'],
      ['Eigentumsvorbehalt: Ware bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers', 'Mülkiyeti saklı tutma: mal tamamen ödenene kadar satıcının malı kalır', 'الاحتفاظ بالملكية: تبقى البضاعة ملك البائع حتى السداد الكامل', 'Bảo lưu quyền sở hữu: hàng thuộc người bán cho đến khi thanh toán đủ'] ] } ] },

{ id: 'LF7_M03', dir: 'LF_07', file: 'LF7_M03_Bastelbogen_Maengelarten_Wuerfel', lf: 'LF 7 · M 3', versions: ['VI_AR_TR'],
  title: ['Mängelarten-Würfel', 'Kusur türleri küpü', 'مكعّب أنواع العيوب', 'Xúc xắc các loại lỗi hàng'],
  sections: [
    { h: A, items: [
      ['1. Karten ausschneiden und auf die passenden Würfelseiten kleben.', '1. Kartları kesin ve uygun küp yüzlerine yapıştırın.', '1. قصّوا البطاقات والصقوها على أوجه المكعّب المناسبة.', '1. Cắt thẻ và dán lên đúng mặt xúc xắc.'],
      ['2. Partnercheck mit der Lösung (vor dem Zusammenkleben!).', '2. Çözümle partner kontrolü (yapıştırmadan önce!).', '2. اختبار الشريك مع الحل (قبل اللصق النهائي!).', '2. Kiểm tra theo cặp với đáp án (trước khi dán lại!).'],
      ['3. Würfel ausschneiden, alle Linien falten, Laschen innen festkleben.', '3. Küpü kesin, tüm çizgilerden katlayın, kulakçıkları içeriden yapıştırın.', '3. قصّوا المكعّب واطووا كل الخطوط والصقوا الألسنة من الداخل.', '3. Cắt xúc xắc, gấp theo mọi đường, dán các mép bên trong.'],
      ['4. Würfelspiel zu zweit: Würfeln – nenne zur Seite oben ein eigenes Beispiel und die Rügefrist beim zweiseitigen Handelskauf. Richtig = 1 Punkt.', '4. İki kişilik zar oyunu: zarı atın – üstteki yüz için kendi örneğinizi ve çift taraflı ticari alımda ihbar süresini söyleyin. Doğru = 1 puan.', '4. لعبة المكعّب لشخصين: ارمِ المكعّب – اذكر مثالًا من عندك للوجه العلوي ومهلة الإخطار (الشكوى) في الشراء التجاري الثنائي. الصحيح = نقطة.', '4. Chơi xúc xắc theo cặp: tung xúc xắc – nêu ví dụ của bạn cho mặt trên và thời hạn khiếu nại trong mua bán thương mại hai bên. Đúng = 1 điểm.'] ] },
    { h: W, items: [
      ['offener Mangel: sofort bei der Prüfung erkennbar', 'açık kusur: kontrol sırasında hemen fark edilir', 'عيب ظاهر: يُكتشف فورًا عند الفحص', 'lỗi lộ rõ: nhìn thấy ngay khi kiểm tra'],
      ['versteckter Mangel: zeigt sich erst später beim Gebrauch', 'gizli kusur: ancak sonra kullanırken ortaya çıkar', 'عيب خفي: يظهر لاحقًا عند الاستعمال', 'lỗi ẩn: chỉ lộ ra sau khi sử dụng'],
      ['arglistig verschwiegener Mangel: Der Lieferer kennt den Mangel und verschweigt ihn absichtlich.', 'kasten gizlenen kusur: tedarikçi kusuru bilir ve bilerek saklar', 'عيب مُخفى بسوء نية: يعرف المورّد العيب ويخفيه عمدًا', 'lỗi cố tình giấu: nhà cung cấp biết lỗi và cố ý giấu'],
      ['Mangel in der Art: Es wurde eine andere Ware geliefert (Falschlieferung).', 'tür kusuru: başka bir mal teslim edildi (yanlış teslimat)', 'عيب في النوع: سُلِّمت بضاعة أخرى (تسليم خاطئ)', 'lỗi về loại hàng: giao hàng khác loại (giao sai)'],
      ['Mangel in der Menge: Es wurde zu wenig geliefert (Mindermenge).', 'miktar kusuru: eksik teslim edildi (eksik miktar)', 'عيب في الكمية: سُلِّم أقل من المطلوب (نقص الكمية)', 'lỗi về số lượng: giao thiếu (thiếu số lượng)'],
      ['Mangel in der Güte: Die Ware hat nicht die vereinbarte Beschaffenheit.', 'kalite kusuru: mal kararlaştırılan nitelikte değil', 'عيب في الجودة: البضاعة ليست بالمواصفات المتفق عليها', 'lỗi về chất lượng: hàng không đúng chất lượng đã thỏa thuận'],
      ['Rügefrist · unverzüglich', 'ihbar süresi (kusur bildirimi) · gecikmeden', 'مهلة الإخطار بالعيب · دون تأخير', 'thời hạn khiếu nại lỗi · ngay lập tức'],
      ['Der Spiegel hat einen Sprung.', 'Aynada çatlak var.', 'في المرآة شرخ.', 'Cái gương bị nứt.'],
      ['Die Regenjacke ist nicht wasserdicht.', 'Yağmurluk su geçirmez değil.', 'سترة المطر غير مقاومة للماء.', 'Áo mưa không chống thấm nước.'],
      ['Ein Unfallschaden beim Auto wird verschwiegen.', 'Arabadaki kaza hasarı gizlenir.', 'يُخفى ضرر حادث في السيارة.', 'Hư hỏng do tai nạn của xe bị giấu.'],
      ['Karottensaft statt Energydrink', 'Enerji içeceği yerine havuç suyu', 'عصير جزر بدلًا من مشروب الطاقة', 'Nước ép cà rốt thay vì nước tăng lực'],
      ['48 statt 60 Stück geliefert', '60 yerine 48 adet teslim edildi', 'سُلِّمت 48 قطعة بدلًا من 60', 'Giao 48 thay vì 60 chiếc'],
      ['Der Staubsauger hat 800 statt 900 Watt.', 'Elektrikli süpürge 900 yerine 800 watt.', 'المكنسة الكهربائية 800 واط بدلًا من 900.', 'Máy hút bụi chỉ 800 W thay vì 900 W.'] ] } ] },

{ id: 'LF7_M06', dir: 'LF_07', file: 'LF7_M06_Bastelbogen_Lager_Schieber_Lagergrundsaetze', lf: 'LF 7 · M 6', versions: ['VI_AR_TR'],
  title: ['Lager-Schieber: Lagergrundsätze', 'Depo sürgüsü: depolama ilkeleri', 'منزلق المخزن: مبادئ التخزين', 'Thanh trượt kho: nguyên tắc lưu kho'],
  sections: [
    { h: A, items: [
      ['1. Kärtchen ausschneiden und in die passenden Felder des Streifens kleben.', '1. Kartçıkları kesin ve şeridin uygun alanlarına yapıştırın.', '1. قصّوا البطاقات الصغيرة والصقوها في الخانات المناسبة من الشريط.', '1. Cắt thẻ nhỏ và dán vào các ô phù hợp trên dải.'],
      ['2. Hülle ausschneiden, das Fenster ausschneiden.', '2. Kılıfı kesin, pencereyi de kesip çıkarın.', '2. قصّوا الغلاف وقصّوا النافذة.', '2. Cắt vỏ bọc và cắt cửa sổ.'],
      ['3. Hülle an der blauen Linie falten, Lasche innen festkleben (oben und unten offen lassen).', '3. Kılıfı mavi çizgiden katlayın, kulakçığı içeriden yapıştırın (üst ve alt açık kalsın).', '3. اطووا الغلاف عند الخط الأزرق والصقوا اللسان من الداخل (اتركوا الأعلى والأسفل مفتوحين).', '3. Gấp vỏ bọc theo đường xanh, dán mép bên trong (để hở trên và dưới).'],
      ['4. Streifen hineinschieben und ziehen – Feld für Feld erklären.', '4. Şeridi içine sürüp çekin – alan alan açıklayın.', '4. أدخلوا الشريط واسحبوه – واشرحوا خانة بعد خانة.', '4. Luồn dải vào và kéo – giải thích từng ô một.'] ] },
    { h: W, items: [
      ['warengerecht lagern: Wareneigenschaften beachten (Kühlung, Licht, Geruch, schwere Ware unten)', 'maline uygun depolama: ürün özelliklerine dikkat (soğutma, ışık, koku, ağır mal altta)', 'التخزين المناسب للبضاعة: مراعاة خصائصها (التبريد، الضوء، الرائحة، الثقيل في الأسفل)', 'lưu kho đúng loại hàng: chú ý đặc tính hàng (làm lạnh, ánh sáng, mùi, hàng nặng để dưới)'],
      ['geräumig lagern: genug Platz zum Auspacken und Auszeichnen', 'geniş depolama: açmak ve fiyatlamak için yeterli yer', 'تخزين واسع: مساحة كافية للتفريغ ووضع الأسعار', 'lưu kho rộng rãi: đủ chỗ để mở hàng và dán giá'],
      ['übersichtlich lagern: Jede Ware hat einen beschrifteten Platz.', 'düzenli depolama: her malın etiketli bir yeri var', 'تخزين منظَّم: لكل بضاعة مكان معنون', 'lưu kho rõ ràng: mỗi loại hàng có chỗ có nhãn'],
      ['fifo – first in, first out: Ältere Ware nach vorne, neue Ware nach hinten.', 'FIFO – ilk giren ilk çıkar: eski mal öne, yeni mal arkaya', 'FIFO – الداخل أولًا يخرج أولًا: البضاعة الأقدم إلى الأمام والجديدة إلى الخلف', 'FIFO – vào trước ra trước: hàng cũ để phía trước, hàng mới phía sau'],
      ['Verkaufsbereitschaft sichern', 'satışa hazırlığı sağlamak', 'ضمان الجاهزية للبيع', 'đảm bảo sẵn sàng bán hàng'],
      ['Ware verkaufsfähig machen', 'malı satışa uygun hâle getirmek', 'جعل البضاعة صالحة للبيع', 'làm cho hàng đủ điều kiện bán'],
      ['Tiefkühlkost bleibt kalt, Käse liegt getrennt vom Kaffee.', 'Donmuş gıda soğuk kalır, peynir kahveden ayrı durur.', 'الأطعمة المجمدة تبقى باردة والجبن بعيد عن القهوة.', 'Đồ đông lạnh luôn lạnh, phô mai để riêng cà phê.'],
      ['Osterhasen liegen schon im Januar im Lager.', 'Paskalya tavşanları ocakta zaten depoda.', 'أرانب عيد الفصح موجودة في المخزن منذ يناير.', 'Thỏ Phục sinh đã nằm trong kho từ tháng Giêng.'],
      ['Käse reift im Lager, Ware wird abgepackt.', 'Peynir depoda olgunlaşır, mal paketlenir.', 'الجبن ينضج في المخزن وتُعبَّأ البضاعة.', 'Phô mai ủ chín trong kho, hàng được đóng gói.'] ] } ] },

{ id: 'LF7_M11', dir: 'LF_07', file: 'LF7_M11_Spiel_Tarsia_Umschlag_und_Lagerdauer', lf: 'LF 7 · M 11', versions: ['VI_AR_TR'],
  title: ['Tarsia: Umschlag und Lagerdauer', 'Tarsia: stok devir hızı ve depolama süresi', 'تارسيا: معدل الدوران ومدة التخزين', 'Tarsia: vòng quay và thời gian lưu kho'],
  sections: [
    { h: A, items: [
      ['1. Paare schneiden die 9 Quadrate aus.', '1. Çiftler 9 kareyi keser.', '1. يقصّ كل زوج المربعات التسعة.', '1. Từng cặp cắt 9 ô vuông.'],
      ['2. Jede Aufgabe rechnen und an das passende Ergebnis legen.', '2. Her görevi hesaplayın ve uygun sonucun yanına koyun.', '2. احسبوا كل مسألة وضعوها بجانب النتيجة المناسبة.', '2. Tính từng bài và đặt cạnh kết quả phù hợp.'],
      ['3. Die Außenkanten bleiben leer.', '3. Dış kenarlar boş kalır.', '3. تبقى الحواف الخارجية فارغة.', '3. Các cạnh ngoài để trống.'],
      ['4. Kontrolle mit der Lösung; Rechenwege im Heft notieren.', '4. Çözümle kontrol edin; hesap yollarını deftere yazın.', '4. تحقّقوا بالحل واكتبوا خطوات الحساب في الدفتر.', '4. Kiểm tra bằng đáp án; ghi cách tính vào vở.'] ] },
    { h: W, items: [
      ['Absatz', 'satış miktarı', 'حجم المبيعات (الكمية المباعة)', 'lượng tiêu thụ'],
      ['Ø Lagerbestand', 'ortalama stok', 'متوسط المخزون', 'tồn kho trung bình'],
      ['Wareneinsatz', 'satılan malın maliyeti', 'تكلفة البضاعة المباعة', 'giá vốn hàng bán'],
      ['Umschlagshäufigkeit = Absatz : Ø Lagerbestand', 'stok devir hızı = satış : ortalama stok', 'معدل دوران المخزون = المبيعات ÷ متوسط المخزون', 'vòng quay hàng tồn = lượng bán ÷ tồn kho trung bình'],
      ['Ø Lagerdauer = 360 : Umschlagshäufigkeit', 'ortalama depolama süresi = 360 : devir hızı', 'متوسط مدة التخزين = 360 ÷ معدل الدوران', 'thời gian lưu kho trung bình = 360 ÷ vòng quay'],
      ['geplanter Absatz = Umschlagshäufigkeit × Ø Lagerbestand', 'planlanan satış = devir hızı × ortalama stok', 'المبيعات المخطَّطة = معدل الدوران × متوسط المخزون', 'lượng bán dự kiến = vòng quay × tồn kho trung bình'],
      ['aufrunden', 'yukarı yuvarlamak', 'التقريب إلى الأعلى', 'làm tròn lên'],
      ['Stück · Tage · TEUR (Tausend Euro)', 'adet · gün · TEUR (bin euro)', 'قطعة · أيام · TEUR (ألف يورو)', 'chiếc · ngày · TEUR (nghìn euro)'],
      ['Hohe Umschlagshäufigkeit = kurze Lagerdauer.', 'Yüksek devir hızı = kısa depolama süresi.', 'معدل دوران مرتفع = مدة تخزين قصيرة.', 'Vòng quay cao = thời gian lưu kho ngắn.'] ] } ] },

{ id: 'LF7_M13', dir: 'LF_07', file: 'LF7_M13_Spiel_Inventur_Rallye', lf: 'LF 7 · M 13', versions: ['VI_AR_TR'],
  title: ['Inventur-Rallye', 'Envanter yarışı', 'سباق الجرد', 'Cuộc đua kiểm kê'],
  sections: [
    { h: A, items: [
      ['1. Stationen im Raum aufhängen. Teams à 4 Personen, jedes Team startet an einer anderen Station.', '1. İstasyonları odaya asın. 4 kişilik takımlar, her takım farklı bir istasyondan başlar.', '1. علّقوا المحطات في القاعة. فرق من 4 أشخاص، ويبدأ كل فريق من محطة مختلفة.', '1. Treo các trạm trong phòng. Mỗi đội 4 người, mỗi đội bắt đầu ở một trạm khác nhau.'],
      ['2. Antwort auf dem Laufzettel notieren, dann im Uhrzeigersinn weiter.', '2. Cevabı koşu kâğıdına yazın, sonra saat yönünde devam edin.', '2. دوّنوا الإجابة على ورقة الجولة ثم تابعوا باتجاه عقارب الساعة.', '2. Ghi câu trả lời vào phiếu, rồi đi tiếp theo chiều kim đồng hồ.'],
      ['3. Nach etwa 12 Minuten zurück auf die Plätze, gemeinsame Auswertung.', '3. Yaklaşık 12 dakika sonra yerlerinize dönün, ortak değerlendirme.', '3. بعد نحو 12 دقيقة عودوا إلى أماكنكم للتقييم المشترك.', '3. Sau khoảng 12 phút về chỗ, cùng đánh giá.'],
      ['4. Schnellstes Team mit den meisten richtigen Antworten gewinnt.', '4. En hızlı ve en çok doğru cevabı veren takım kazanır.', '4. يفوز الفريق الأسرع صاحب أكبر عدد من الإجابات الصحيحة.', '4. Đội nhanh nhất và đúng nhiều nhất thắng.'] ] },
    { h: W, items: [
      ['Inventur', 'envanter sayımı', 'الجرد', 'kiểm kê'],
      ['Inventar', 'envanter listesi (sayım sonucu)', 'قائمة الجرد (نتيجة الجرد)', 'bảng kê tài sản (kết quả kiểm kê)'],
      ['Sollbestand · Istbestand', 'kayıtlı stok · sayılan stok', 'المخزون الدفتري · المخزون الفعلي', 'tồn kho theo sổ · tồn kho thực tế'],
      ['Inventurdifferenz = Istbestand − Sollbestand', 'envanter farkı = sayılan − kayıtlı stok', 'فرق الجرد = الفعلي − الدفتري', 'chênh lệch kiểm kê = thực tế − theo sổ'],
      ['Fehlbestand (Minus) · Mehrbestand (Plus)', 'eksik stok (eksi) · fazla stok (artı)', 'نقص في المخزون (ناقص) · زيادة في المخزون (زائد)', 'thiếu hàng (âm) · thừa hàng (dương)'],
      ['Einstandspreis', 'alış (maliyet) fiyatı', 'سعر التكلفة (الاقتناء)', 'giá vốn nhập'],
      ['WWS (Warenwirtschaftssystem)', 'WWS (mal yönetim sistemi)', 'نظام إدارة البضائع', 'WWS (hệ thống quản lý hàng hóa)'],
      ['Stichtagsinventur · permanente Inventur', 'belirli gün envanteri · sürekli envanter', 'جرد في يوم محدد · جرد مستمر', 'kiểm kê vào ngày chốt · kiểm kê liên tục'],
      ['Laufzettel · Station', 'koşu kâğıdı · istasyon', 'ورقة الجولة · محطة', 'phiếu chạy · trạm'],
      ['Ursachen: Ladendiebstahl, Bruch/Verderb, Zählfehler', 'nedenler: mağaza hırsızlığı, kırılma/bozulma, sayım hatası', 'الأسباب: سرقة، كسر/تلف، خطأ في العدّ', 'nguyên nhân: trộm cắp, vỡ/hỏng, đếm sai'] ] } ] },
];
