/* Übersetzungsblätter LF 8, LF 9, LF 10 (VI · AR · TR). Reihenfolge: [de, tr, ar, vi]. Maschinell erstellt – bitte gegenlesen lassen. */
const A = ['Ablauf', 'Akış', 'سير العمل', 'Cách làm'];
const W = ['Wörter und Texte auf dem Bogen', 'Bogundaki kelimeler ve metinler', 'كلمات ونصوص على الورقة', 'Từ và nội dung trên tờ bài'];
module.exports = [
{ id: 'LF8_M03', dir: 'LF_08', file: 'LF8_M03_Spiel_Bilanz_Legespiel', lf: 'LF 8 · M 3', versions: ['VI_AR_TR'],
  title: ['Bilanz-Legespiel: Was ist der Laden wert?', 'Bilanço yerleştirme oyunu: Mağaza ne kadar değerli?', 'لعبة ترتيب الميزانية: كم تساوي المتجر؟', 'Trò xếp bảng cân đối: cửa hàng đáng giá bao nhiêu?'],
  sections: [
    { h: A, items: [
      ['1. Karten ausschneiden.', '1. Kartları kesin.', '1. قصّوا البطاقات.', '1. Cắt thẻ.'],
      ['2. Jede Karte in Anlagevermögen, Umlaufvermögen oder Fremdkapital legen (im Umlaufvermögen nach Flüssigkeit ordnen).', '2. Her kartı duran varlıklar, dönen varlıklar veya yabancı sermaye alanına koyun (dönen varlıkları likiditeye göre sıralayın).', '2. ضعوا كل بطاقة في الأصول الثابتة أو الأصول المتداولة أو رأس المال الأجنبي (رتّبوا الأصول المتداولة حسب السيولة).', '2. Đặt mỗi thẻ vào tài sản cố định, tài sản lưu động hoặc vốn vay (tài sản lưu động xếp theo tính thanh khoản).'],
      ['3. Summe Aktiva bilden und das Eigenkapital als Differenz ausrechnen.', '3. Aktif toplamını bulun ve özkaynağı fark olarak hesaplayın.', '3. اجمعوا الأصول واحسبوا حقوق الملكية كفرق.', '3. Tính tổng tài sản và tính vốn chủ sở hữu bằng hiệu số.'],
      ['4. Paare erklären: Warum ist die Bilanz immer ausgeglichen?', '4. Çiftler açıklar: Bilanço neden her zaman dengelidir?', '4. يشرح كل زوج: لماذا تكون الميزانية متوازنة دائمًا؟', '4. Từng cặp giải thích: vì sao bảng cân đối luôn cân bằng?'] ] },
    { h: W, items: [
      ['Bilanz', 'bilanço', 'الميزانية العمومية', 'bảng cân đối kế toán'],
      ['Aktiva (Mittelverwendung)', 'aktif (kaynakların kullanımı)', 'الأصول (استخدام الأموال)', 'tài sản (sử dụng vốn)'],
      ['Passiva (Mittelherkunft)', 'pasif (kaynakların kaynağı)', 'الخصوم (مصدر الأموال)', 'nguồn vốn (nguồn gốc vốn)'],
      ['Anlagevermögen', 'duran varlıklar', 'الأصول الثابتة', 'tài sản cố định'],
      ['Umlaufvermögen', 'dönen varlıklar', 'الأصول المتداولة', 'tài sản lưu động'],
      ['Eigenkapital', 'özkaynak', 'حقوق الملكية (رأس المال الخاص)', 'vốn chủ sở hữu'],
      ['Fremdkapital', 'yabancı sermaye', 'رأس المال الأجنبي (الديون)', 'vốn vay (nợ)'],
      ['Gebäude · Ladeneinrichtung (BGA) · Fuhrpark', 'bina · mağaza donanımı · araç filosu', 'مبنى · تجهيزات المتجر · أسطول المركبات', 'nhà · trang thiết bị cửa hàng · đội xe'],
      ['Waren · Forderungen · Bank · Kasse', 'mallar · alacaklar · banka · kasa', 'بضائع · ذمم مدينة · بنك · صندوق', 'hàng hóa · khoản phải thu · ngân hàng · tiền mặt'],
      ['Darlehen · Verbindlichkeiten', 'kredi · borçlar', 'قرض · التزامات (ديون)', 'khoản vay · khoản phải trả'],
      ['Eigenkapital = Vermögen − Schulden', 'özkaynak = varlıklar − borçlar', 'حقوق الملكية = الأصول − الديون', 'vốn chủ sở hữu = tài sản − nợ'],
      ['Summe Aktiva = Summe Passiva', 'aktif toplamı = pasif toplamı', 'مجموع الأصول = مجموع الخصوم', 'tổng tài sản = tổng nguồn vốn'] ] } ] },

{ id: 'LF9_M06', dir: 'LF_09', file: 'LF9_M06_Spiel_Rabatt_Wuerfel', lf: 'LF 9 · M 6', versions: ['VI_AR_TR'],
  title: ['Rabatt-Würfel: Preise senken', 'İndirim zarı: fiyatları düşürmek', 'مكعّب الخصم: تخفيض الأسعار', 'Xúc xắc giảm giá: hạ giá'],
  sections: [
    { h: A, items: [
      ['1. Paare würfeln abwechselnd: Würfel 1 = alter Preis, Würfel 2 = Rabatt.', '1. Çiftler sırayla zar atar: Zar 1 = eski fiyat, Zar 2 = indirim.', '1. يرمي الزميلان المكعّبين بالتناوب: المكعّب 1 = السعر القديم، المكعّب 2 = الخصم.', '1. Từng cặp lần lượt tung xúc xắc: xúc xắc 1 = giá cũ, xúc xắc 2 = giảm giá.'],
      ['2. Neuen Preis mit dem Faktor rechnen (z. B. 25 % → × 0,75) und eintragen.', '2. Yeni fiyatı çarpanla hesaplayın (örn. %25 → × 0,75) ve yazın.', '2. احسبوا السعر الجديد بالمعامل (مثلًا 25٪ ← × 0٫75) وسجّلوه.', '2. Tính giá mới bằng hệ số (ví dụ 25 % → × 0,75) rồi ghi lại.'],
      ['3. Partner prüft mit der umgedrehten Lösung. Richtig = 1 Punkt.', '3. Partner, ters çevrilmiş çözümle kontrol eder. Doğru = 1 puan.', '3. يتحقق الشريك بالحل المقلوب. الصحيح = نقطة.', '3. Bạn cặp kiểm tra bằng bảng đáp án gập lại. Đúng = 1 điểm.'],
      ['4. Profi-Runde: rückwärts den alten Preis bestimmen.', '4. Uzman turu: eski fiyatı geriye doğru hesaplayın.', '4. جولة المحترفين: احسبوا السعر القديم بالعكس.', '4. Vòng nâng cao: tính ngược lại giá cũ.'] ] },
    { h: W, items: [
      ['alter Preis · neuer Preis', 'eski fiyat · yeni fiyat', 'السعر القديم · السعر الجديد', 'giá cũ · giá mới'],
      ['Rabatt · Faktor', 'indirim · çarpan', 'الخصم · المعامل', 'giảm giá · hệ số'],
      ['Neuer Preis = alter Preis × (1 − Rabatt : 100)', 'yeni fiyat = eski fiyat × (1 − indirim : 100)', 'السعر الجديد = السعر القديم × (1 − الخصم ÷ 100)', 'giá mới = giá cũ × (1 − giảm giá ÷ 100)'],
      ['Beispiel: 80,00 € − 25 % → 80 × 0,75 = 60,00 €', 'Örnek: 80,00 € − %25 → 80 × 0,75 = 60,00 €', 'مثال: 80,00 يورو − 25٪ ← 80 × 0٫75 = 60,00 يورو', 'Ví dụ: 80,00 € − 25 % → 80 × 0,75 = 60,00 €'],
      ['Alter Preis = neu : (1 − p : 100)', 'eski fiyat = yeni : (1 − p : 100)', 'السعر القديم = الجديد ÷ (1 − النسبة ÷ 100)', 'giá cũ = giá mới ÷ (1 − p ÷ 100)'],
      ['Runde · Rechnung · Punkt', 'tur · hesaplama · puan', 'جولة · عملية حسابية · نقطة', 'vòng · phép tính · điểm'],
      ['erst nach dem Rechnen aufklappen', 'hesapladıktan sonra açın', 'افتحوا الحل بعد الحساب فقط', 'chỉ mở ra sau khi đã tính'] ] } ] },

{ id: 'LF9_M08', dir: 'LF_09', file: 'LF9_M08_Spiel_Preisschild_Detektive', lf: 'LF 9 · M 8', versions: ['VI_AR_TR'],
  title: ['Preisschild-Detektive', 'Etiket dedektifleri', 'محققو بطاقات الأسعار', 'Thám tử bảng giá'],
  sections: [
    { h: A, items: [
      ['1. Preisschilder im Raum verteilen.', '1. Fiyat etiketlerini odaya dağıtın.', '1. وزّعوا بطاقات الأسعار في القاعة.', '1. Treo/đặt các bảng giá khắp phòng.'],
      ['2. Jeder geht mit dem Ermittlungsbogen herum und prüft jedes Schild: Endpreis? Grundpreis? Ware und Menge?', '2. Herkes soruşturma formuyla dolaşır ve her etiketi kontrol eder: son fiyat? birim fiyat? mal ve miktar?', '2. يتجوّل كل واحد بورقة التحقيق ويفحص كل بطاقة: السعر النهائي؟ سعر الوحدة؟ البضاعة والكمية؟', '2. Mỗi người cầm phiếu điều tra đi kiểm tra từng bảng giá: giá cuối? giá cơ sở? hàng và số lượng?'],
      ['3. Grundpreise mit dem Taschenrechner nachrechnen.', '3. Birim fiyatları hesap makinesiyle yeniden hesaplayın.', '3. أعيدوا حساب أسعار الوحدة بالآلة الحاسبة.', '3. Tính lại giá cơ sở bằng máy tính.'],
      ['4. Auswertung: Für jedes fehlerhafte Schild wird ein richtiges Schild an die Tafel geschrieben.', '4. Değerlendirme: hatalı her etiket için tahtaya doğru bir etiket yazılır.', '4. التقييم: لكل بطاقة خاطئة تُكتب بطاقة صحيحة على السبورة.', '4. Đánh giá: với mỗi bảng giá sai, viết một bảng giá đúng lên bảng.'] ] },
    { h: W, items: [
      ['Endpreis (mit Umsatzsteuer)', 'son fiyat (KDV dahil)', 'السعر النهائي (مع ضريبة القيمة المضافة)', 'giá cuối (đã gồm thuế GTGT)'],
      ['Grundpreis (je 1 kg bzw. 1 l)', 'birim fiyat (1 kg veya 1 l için)', 'سعر الوحدة (لكل 1 كغ أو 1 لتر)', 'giá cơ sở (mỗi 1 kg hoặc 1 l)'],
      ['Ware und Menge', 'mal ve miktar', 'البضاعة والكمية', 'hàng hóa và số lượng'],
      ['Preisangabenverordnung (PAngV)', 'Fiyat Belirtme Yönetmeliği (PAngV)', 'لائحة بيان الأسعار (PAngV)', 'Quy định niêm yết giá (PAngV)'],
      ['korrekt · fehlerhaft', 'doğru · hatalı', 'صحيح · خاطئ', 'đúng · sai'],
      ['Stückware braucht keinen Grundpreis', 'adetle satılan mal için birim fiyat gerekmez', 'البضاعة بالقطعة لا تحتاج إلى سعر وحدة', 'hàng bán theo chiếc không cần giá cơ sở'],
      ['Ermittlungsbogen', 'soruşturma formu', 'ورقة التحقيق', 'phiếu điều tra'],
      ['Honig · Kaffee · Orangensaft · Waschmittel · Frikadellen · Jeans · Gouda', 'bal · kahve · portakal suyu · çamaşır deterjanı · köfte · kot pantolon · gouda peyniri', 'عسل · قهوة · عصير برتقال · منظف غسيل · كرات لحم · جينز · جبن غودا', 'mật ong · cà phê · nước cam · bột giặt · chả thịt · quần jeans · phô mai Gouda'] ] } ] },

{ id: 'LF10_M01', dir: 'LF_10', file: 'LF10_M01_Spiel_Ausweis_Ampel', lf: 'LF 10 · M 1', versions: ['VI_AR_TR'],
  title: ['Ausweis-Ampel: Darf ich verkaufen?', 'Kimlik trafik ışığı: Satabilir miyim?', 'إشارة المرور للهوية: هل يجوز لي البيع؟', 'Đèn giao thông thẻ căn cước: tôi có được bán không?'],
  sections: [
    { h: A, items: [
      ['1. Schilder „verkaufen“ und „nicht verkaufen“ an zwei gegenüberliegende Wände hängen.', '1. „Satılır“ ve „satılmaz“ tabelalarını karşılıklı iki duvara asın.', '1. علّقوا لافتتي «يُباع» و«لا يُباع» على جدارين متقابلين.', '1. Treo biển „được bán“ và „không bán“ trên hai bức tường đối diện.'],
      ['2. Lehrkraft liest eine Fallkarte vor; alle rechnen das Alter (Stichtag 20.11.2026) und laufen auf eine Seite.', '2. Öğretmen bir olay kartı okur; herkes yaşı hesaplar (referans tarih 20.11.2026) ve bir tarafa yürür.', '2. يقرأ المعلّم بطاقة حالة؛ يحسب الجميع العمر (تاريخ الاحتساب 20.11.2026) ويتجهون إلى أحد الجانبين.', '2. Giáo viên đọc một thẻ tình huống; mọi người tính tuổi (ngày chốt 20.11.2026) rồi đi về một phía.'],
      ['3. Eine Person begründet mit der Altersgrenze aus dem Jugendschutzgesetz.', '3. Bir kişi, Gençliğin Korunması Yasasındaki yaş sınırıyla gerekçelendirir.', '3. يبرّر أحدكم بحدّ السن في قانون حماية الشباب.', '3. Một người giải thích bằng giới hạn tuổi trong Luật Bảo vệ Thanh thiếu niên.'],
      ['4. Bei „nicht verkaufen“: Die Gruppe formuliert gemeinsam eine freundliche Ablehnung mit Alternative.', '4. „Satılmaz“ durumunda: grup birlikte alternatifli nazik bir ret cümlesi kurar.', '4. عند «لا يُباع»: تصيغ المجموعة معًا رفضًا لطيفًا مع بديل.', '4. Với „không bán“: cả nhóm cùng nói một lời từ chối lịch sự kèm gợi ý thay thế.'] ] },
    { h: W, items: [
      ['verkaufen · nicht verkaufen', 'satılır · satılmaz', 'يُباع · لا يُباع', 'được bán · không bán'],
      ['Ausweis · Alter · geboren (geb.)', 'kimlik · yaş · doğum tarihi', 'الهوية · العمر · تاريخ الميلاد', 'thẻ căn cước · tuổi · sinh ngày'],
      ['Jugendschutzgesetz', 'Gençliğin Korunması Yasası', 'قانون حماية الشباب', 'Luật Bảo vệ Thanh thiếu niên'],
      ['Bier, Wein, Sekt ab 16', 'bira, şarap, köpüklü şarap: 16 yaşından', 'البيرة والنبيذ والشمبانيا من سن 16', 'bia, rượu vang, sâm panh: từ 16 tuổi'],
      ['Branntwein, Alcopops, Tabak, E-Zigaretten ab 18', 'sert alkol, alkollü gazlı içecekler, tütün, e-sigara: 18 yaşından', 'المشروبات الروحية والمشروبات الكحولية الجاهزة والتبغ والسجائر الإلكترونية من سن 18', 'rượu mạnh, đồ uống pha sẵn có cồn, thuốc lá, thuốc lá điện tử: từ 18 tuổi'],
      ['Feuerwerk F1 ab 12 · F2 ab 18', 'havai fişek F1: 12 yaşından · F2: 18 yaşından', 'الألعاب النارية F1 من سن 12 · F2 من سن 18', 'pháo hoa F1 từ 12 tuổi · F2 từ 18 tuổi'],
      ['Filme und Spiele: FSK / USK', 'filmler ve oyunlar: FSK / USK (yaş sınıfı)', 'الأفلام والألعاب: FSK / USK (التصنيف العمري)', 'phim và trò chơi: FSK / USK (phân loại độ tuổi)'],
      ['Freundlich ablehnen: Bedauern – Grund (Gesetz) – Alternative – Verabschiedung', 'Nazikçe reddetme: üzüntü – gerekçe (yasa) – alternatif – vedalaşma', 'الرفض بلطف: أسف – السبب (القانون) – بديل – وداع', 'Từ chối lịch sự: tiếc – lý do (luật) – gợi ý thay thế – chào tạm biệt'] ] } ] },
];
