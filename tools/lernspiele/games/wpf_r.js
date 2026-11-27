/* WPF Rechenfit (WPF-R) – Lernspiele mit Spanisch. Texte: Deutsch ¦ es */
const ES = ['es'];
const mc = (h, e, q, right, wrong, w, p) => h.MC(e, q, [right].concat(wrong), 0, w, p);
module.exports = [

{ key: 'WPF-R.M1', file: 'WPF-Rechenfit_M_1_Dreisatz-Kasse.html', lskey: 'wpfr1_lang', icon: '🧮', h1: 'Dreisatz an der Kasse', title: 'Dreisatz an der Kasse – WPF Rechenfit Modul 1', langs: ES,
  head: 'Dreisatz, Grundpreis, lose Ware, Wechselgeld ¦ Regla de tres, precio base, mercancía a granel, cambio',
  merk: 'Dreisatz: erst auf 1 Stück/1 kg zurückrechnen, dann auf die gewünschte Menge. Grundpreis = Preis : Menge · Bezugsmenge (z. B. €/kg). Lose Ware: Gewicht · Preis je kg. Wechselgeld = gegebenes Geld − Rechnungsbetrag. ¦ Regla de tres: primero calcular 1 unidad/1 kg, luego la cantidad deseada. Precio base = precio : cantidad · cantidad de referencia (p. ej., €/kg). Mercancía a granel: peso · precio por kg. Cambio = dinero entregado − importe de la cuenta.',
  stages: h => [
    h.CALC('🍎', '4 kg Äpfel kosten 9,80 €. Wie viel kosten 6 kg? ¦ 4 kg de manzanas cuestan 9,80 €. ¿Cuánto cuestan 6 kg?', '€', 14.7, 'Erst 1 kg ausrechnen: 9,80 : 4. ¦ Primero calcula 1 kg: 9,80 : 4.', '9,80 : 4 = 2,45; 2,45 · 6 = 14,70'),
    h.CALC('🧈', 'Eine 250-g-Packung Butter kostet 1,95 €. Wie hoch ist der Grundpreis je kg? ¦ Un paquete de 250 g de mantequilla cuesta 1,95 €. ¿Cuál es el precio base por kg?', '€/kg', 7.8, '1 kg sind 4 Packungen. ¦ 1 kg son 4 paquetes.', '1,95 · 4 = 7,80 €/kg'),
    h.CALC('🧀', 'Du wiegst 0,4 kg Käse ab. 1 kg kostet 18,50 €. Was kostet die Portion? ¦ Pesas 0,4 kg de queso. 1 kg cuesta 18,50 €. ¿Cuánto cuesta la porción?', '€', 7.4, 'Gewicht mal Preis je kg. ¦ Peso por precio por kg.', '0,4 · 18,50 = 7,40'),
    h.CALC('💶', 'Der Kunde kauft für 17,35 € und gibt dir 20 €. Wie viel Wechselgeld bekommt er? ¦ El cliente compra por 17,35 € y te da 20 €. ¿Cuánto cambio recibe?', '€', 2.65, 'Gegebenes Geld minus Rechnung. ¦ Dinero entregado menos la cuenta.', '20,00 − 17,35 = 2,65'),
    h.CALC('📦', 'Profi: Ein Mitarbeiter packt in 3 Stunden 90 Kartons. Wie viele Kartons packt er in 5 Stunden? ¦ Profi: Un empleado empaqueta 90 cajas en 3 horas. ¿Cuántas cajas empaqueta en 5 horas?', 'Kartons', 150, 'Erst: Kartons pro Stunde. ¦ Primero: cajas por hora.', '90 : 3 = 30; 30 · 5 = 150', true)
  ] },

{ key: 'WPF-R.M2', file: 'WPF-Rechenfit_M_2_Rabatt-Skonto-Bezug.html', lskey: 'wpfr2_lang', icon: '🏷️', h1: 'Rabatt, Skonto, Bezug', title: 'Rabatt, Skonto, Bezug – WPF Rechenfit Modul 2', langs: ES,
  head: 'Prozentwert, Rabatt, Skonto, Bezugspreis ¦ Valor porcentual, descuento, pronto pago, precio de compra',
  merk: 'Prozentwert = Grundwert · Prozentsatz : 100. Rabatt vom Listenpreis, Skonto vom Zieleinkaufspreis (bei schneller Zahlung). Bezugspreis = Einkaufspreis (nach Rabatt und Skonto) + Bezugskosten (z. B. Fracht). ¦ Valor porcentual = valor base · porcentaje : 100. Descuento sobre el precio de lista, descuento por pronto pago sobre el precio a plazo (si se paga rápido). Precio de compra = precio de compra (tras descuento y pronto pago) + gastos de compra (p. ej., flete).',
  stages: h => [
    h.CALC('🏷️', '15 % Rabatt auf 240 €. Wie hoch ist der Rabatt in Euro? ¦ 15 % de descuento sobre 240 €. ¿A cuántos euros asciende el descuento?', '€', 36, '240 · 15 : 100. ¦ 240 · 15 : 100.', '240 · 15 : 100 = 36'),
    h.CALC('⏰', 'Rechnung über 800 €, 2 % Skonto bei Zahlung in 10 Tagen. Wie hoch ist der Skonto? ¦ Factura de 800 €, 2 % de descuento por pago en 10 días. ¿A cuánto asciende el descuento?', '€', 16, '800 · 2 : 100. ¦ 800 · 2 : 100.', '800 · 2 : 100 = 16'),
    h.CALC('🧾', 'Listenpreis 500 €, Rabatt 10 %. Wie hoch ist der Einkaufspreis nach Rabatt? ¦ Precio de lista 500 €, descuento del 10 %. ¿Cuál es el precio de compra tras el descuento?', '€', 450, 'Erst Rabatt: 500 · 10 : 100 = 50. ¦ Primero el descuento: 500 · 10 : 100 = 50.', '500 − 50 = 450'),
    h.CALC('🚚', 'Einkaufspreis 450 €, Bezugskosten 18 €. Wie hoch ist der Bezugspreis? ¦ Precio de compra 450 €, gastos de compra 18 €. ¿Cuál es el precio de adquisición?', '€', 468, 'Einkaufspreis plus Bezugskosten. ¦ Precio de compra más gastos de compra.', '450 + 18 = 468'),
    h.CALC('🧮', 'Profi: Listenpreis 1.000 € → Rabatt 20 % → Skonto 2 %. Wie hoch ist der Bareinkaufspreis? ¦ Profi: Precio de lista 1.000 € → descuento 20 % → pronto pago 2 %. ¿Cuál es el precio de compra al contado?', '€', 784, 'Erst Rabatt (800), dann 2 % Skonto (16) abziehen. ¦ Primero el descuento (800), luego restar el 2 % (16).', '1000 − 200 = 800; 800 − 16 = 784', true)
  ] },

{ key: 'WPF-R.M3', file: 'WPF-Rechenfit_M_3_Prozentsatz-Radar.html', lskey: 'wpfr3_lang', icon: '📉', h1: 'Prozentsatz-Radar', title: 'Prozentsatz-Radar – WPF Rechenfit Modul 3', langs: ES,
  head: 'Prozentsatz: Preissenkung, Anteil, Veränderung ¦ Porcentaje: rebaja, proporción, cambio',
  merk: 'Prozentsatz = Prozentwert · 100 : Grundwert. Veränderung in % = Veränderung · 100 : alter Wert (der alte Wert ist 100 %). ¦ Porcentaje = valor porcentual · 100 : valor base. Cambio en % = cambio · 100 : valor antiguo (el valor antiguo es el 100 %).',
  stages: h => [
    h.CALC('📉', 'Eine Jacke sinkt von 80 € auf 60 €. Um wie viel Prozent wurde sie günstiger? ¦ Una chaqueta baja de 80 € a 60 €. ¿En qué porcentaje se abarató?', '%', 25, 'Preissenkung 20 € · 100 : 80. ¦ Rebaja 20 € · 100 : 80.', '20 · 100 : 80 = 25 %'),
    h.CALC('🛒', '18 von 72 Kunden kaufen online. Wie viel Prozent sind das? ¦ 18 de 72 clientes compran online. ¿Qué porcentaje es?', '%', 25, '18 · 100 : 72. ¦ 18 · 100 : 72.', '18 · 100 : 72 = 25 %'),
    h.CALC('📈', 'Der Absatz steigt von 500 auf 560 Stück. Um wie viel Prozent? ¦ Las ventas suben de 500 a 560 unidades. ¿En qué porcentaje?', '%', 12, 'Zuwachs 60 · 100 : 500. ¦ Aumento 60 · 100 : 500.', '60 · 100 : 500 = 12 %'),
    mc(h, '🔎', 'Von welchem Wert rechnest du bei „um 10 % gesenkt“? ¦ ¿Desde qué valor calculas con «bajado un 10 %»?', 'Vom alten (ursprünglichen) Preis ¦ Del precio antiguo (original)', ['Vom neuen Preis ¦ Del precio nuevo', 'Von 100 € immer ¦ De 100 € siempre'], 'Der alte Wert ist der Grundwert (100 %). ¦ El valor antiguo es el valor base (100 %).'),
    h.CALC('🧠', 'Profi: Ein Preis wird von 50 € auf 40 € gesenkt. Um wie viel Prozent ist er günstiger? ¦ Profi: Un precio baja de 50 € a 40 €. ¿En qué porcentaje es más barato?', '%', 20, 'Senkung 10 € · 100 : 50. ¦ Rebaja 10 € · 100 : 50.', '10 · 100 : 50 = 20 %', true)
  ] },

{ key: 'WPF-R.M4', file: 'WPF-Rechenfit_M_4_Grundwert-Steuer.html', lskey: 'wpfr4_lang', icon: '🧾', h1: 'Grundwert und Steuer', title: 'Grundwert und Steuer – WPF Rechenfit Modul 4', langs: ES,
  head: 'Grundwert, Preis vorher, Umsatzsteuer ¦ Valor base, precio anterior, IVA',
  merk: 'Grundwert = Prozentwert · 100 : Prozentsatz. Umsatzsteuer 19 %: Brutto = Netto · 1,19; Netto = Brutto : 1,19. Preis vor einer Senkung von 25 %: Der neue Preis entspricht 75 %, also Preis : 75 · 100. ¦ Valor base = valor porcentual · 100 : porcentaje. IVA 19 %: bruto = neto · 1,19; neto = bruto : 1,19. Precio antes de una rebaja del 25 %: el nuevo precio equivale al 75 %, es decir, precio : 75 · 100.',
  stages: h => [
    h.CALC('🔢', '15 % von einem Betrag sind 45 €. Wie hoch ist der Grundwert? ¦ El 15 % de una cantidad son 45 €. ¿Cuál es el valor base?', '€', 300, '45 · 100 : 15. ¦ 45 · 100 : 15.', '45 · 100 : 15 = 300'),
    h.CALC('🧾', 'Der Bruttopreis beträgt 119 € (mit 19 % Umsatzsteuer). Wie hoch ist der Nettopreis? ¦ El precio bruto es 119 € (con 19 % de IVA). ¿Cuál es el precio neto?', '€', 100, 'Brutto durch 1,19. ¦ Bruto dividido entre 1,19.', '119 : 1,19 = 100'),
    h.CALC('🏛️', 'Der Nettopreis beträgt 250 €. Wie hoch ist die Umsatzsteuer (19 %)? ¦ El precio neto es 250 €. ¿Cuánto es el IVA (19 %)?', '€', 47.5, '250 · 19 : 100. ¦ 250 · 19 : 100.', '250 · 19 : 100 = 47,50'),
    h.CALC('🧥', 'Eine Jacke kostet nach 25 % Preissenkung 75 €. Wie teuer war sie vorher? ¦ Una chaqueta cuesta 75 € tras una rebaja del 25 %. ¿Cuánto costaba antes?', '€', 100, '75 € sind 75 % vom alten Preis. ¦ 75 € es el 75 % del precio antiguo.', '75 · 100 : 75 = 100'),
    h.CALC('🧮', 'Profi: Bruttopreis 238 € (19 % USt). Wie hoch ist die enthaltene Umsatzsteuer? ¦ Profi: Precio bruto 238 € (19 % de IVA). ¿Cuánto IVA contiene?', '€', 38, 'Erst Netto: 238 : 1,19 = 200. ¦ Primero el neto: 238 : 1,19 = 200.', '238 − 200 = 38', true)
  ] },

{ key: 'WPF-R.M5', file: 'WPF-Rechenfit_M_5_Kennzahlen-Check.html', lskey: 'wpfr5_lang', icon: '📦', h1: 'Kennzahlen-Check', title: 'Kennzahlen-Check – WPF Rechenfit Modul 5', langs: ES,
  head: 'Durchschnitt, Kennzahlen, Ø-Lagerbestand ¦ Promedio, indicadores, existencia media',
  merk: 'Durchschnitt = Summe : Anzahl. Ø-Lagerbestand = (Anfangsbestand + Endbestand) : 2. Umschlagshäufigkeit = Wareneinsatz : Ø-Lagerbestand. Durchschnittliche Lagerdauer = 360 : Umschlagshäufigkeit. ¦ Promedio = suma : cantidad. Existencia media = (existencia inicial + existencia final) : 2. Rotación = coste de mercancías vendidas : existencia media. Duración media de almacenamiento = 360 : rotación.',
  stages: h => [
    h.CALC('📊', 'Tagesumsätze: 420 €, 380 € und 460 €. Wie hoch ist der Durchschnitt? ¦ Ventas diarias: 420 €, 380 € y 460 €. ¿Cuál es el promedio?', '€', 420, 'Summe durch 3. ¦ Suma entre 3.', '1260 : 3 = 420'),
    h.CALC('📦', 'Anfangsbestand 300 Stück, Endbestand 500 Stück. Wie hoch ist der Ø-Lagerbestand? ¦ Existencia inicial 300 unidades, final 500. ¿Cuál es la existencia media?', 'Stück', 400, '(300 + 500) : 2. ¦ (300 + 500) : 2.', '800 : 2 = 400'),
    h.CALC('🔄', 'Wareneinsatz 2.400 €, Ø-Lagerbestand 400 €. Wie hoch ist die Umschlagshäufigkeit? ¦ Coste de mercancías 2.400 €, existencia media 400 €. ¿Cuál es la rotación?', 'mal', 6, 'Wareneinsatz : Ø-Lagerbestand. ¦ Coste de mercancías : existencia media.', '2400 : 400 = 6'),
    h.CALC('⏳', 'Die Umschlagshäufigkeit beträgt 6. Wie lang ist die durchschnittliche Lagerdauer in Tagen? ¦ La rotación es 6. ¿Cuántos días dura de media el almacenamiento?', 'Tage', 60, '360 : Umschlagshäufigkeit. ¦ 360 : rotación.', '360 : 6 = 60'),
    h.CALC('🧠', 'Profi: Die Umschlagshäufigkeit steigt auf 12. Wie lang ist nun die Lagerdauer? ¦ Profi: La rotación sube a 12. ¿Cuánto dura ahora el almacenamiento?', 'Tage', 30, '360 : 12. ¦ 360 : 12.', '360 : 12 = 30', true)
  ] },

{ key: 'WPF-R.M6', file: 'WPF-Rechenfit_M_6_Kasse-Inventur-Verteilung.html', lskey: 'wpfr6_lang', icon: '🏧', h1: 'Kasse, Inventur, Verteilung', title: 'Kasse, Inventur, Verteilung – WPF Rechenfit Modul 6', langs: ES,
  head: 'Kasse, Inventurdifferenz, Verteilung ¦ Caja, diferencia de inventario, reparto',
  merk: 'Kassenendbestand = Anfangsbestand + Einnahmen − Ausgaben. Inventurdifferenz = Sollbestand − Istbestand (positiv = Fehlbestand). Verteilung im Verhältnis: Summe der Teile bilden, einen Teil berechnen, dann vervielfachen. ¦ Saldo final de caja = saldo inicial + ingresos − gastos. Diferencia de inventario = existencia teórica − existencia real (positiva = faltante). Reparto proporcional: sumar las partes, calcular una parte y multiplicar.',
  stages: h => [
    h.CALC('💶', 'Anfangsbestand 150 €, Bareinnahmen 840 €, Auszahlungen 65 €. Wie hoch ist der Endbestand? ¦ Saldo inicial 150 €, ingresos en efectivo 840 €, pagos 65 €. ¿Cuál es el saldo final?', '€', 925, '150 + 840 − 65. ¦ 150 + 840 − 65.', '150 + 840 − 65 = 925'),
    h.CALC('🔍', 'Sollbestand 120 Stück, Istbestand 114 Stück. Wie groß ist die Inventurdifferenz? ¦ Existencia teórica 120 unidades, real 114. ¿Cuál es la diferencia de inventario?', 'Stück', 6, 'Soll minus Ist. ¦ Teórica menos real.', '120 − 114 = 6 (Fehlbestand)'),
    h.CALC('➗', '600 € Kosten werden im Verhältnis 1 : 2 : 3 verteilt. Wie viel zahlt der Dritte? ¦ 600 € de costes se reparten en la proporción 1 : 2 : 3. ¿Cuánto paga el tercero?', '€', 300, 'Teile: 1 + 2 + 3 = 6. 600 : 6 = 100. ¦ Partes: 1 + 2 + 3 = 6. 600 : 6 = 100.', '100 · 3 = 300'),
    mc(h, '🧾', 'Der Istbestand ist größer als der Sollbestand. Wie nennt man das? ¦ La existencia real es mayor que la teórica. ¿Cómo se llama?', 'Mehrbestand ¦ Excedente', ['Fehlbestand ¦ Faltante', 'Skonto ¦ Descuento por pronto pago'], 'Ist größer als Soll = Mehrbestand; Ist kleiner = Fehlbestand. ¦ Real mayor que teórica = excedente; real menor = faltante.'),
    h.CALC('🧮', 'Profi: Kassensoll 925,00 €, gezählt 919,50 €. Wie hoch ist die Kassendifferenz? ¦ Profi: Saldo teórico de caja 925,00 €, contado 919,50 €. ¿Cuál es la diferencia de caja?', '€', 5.5, 'Soll minus Ist. ¦ Teórico menos real.', '925,00 − 919,50 = 5,50 (Fehlbetrag)', true)
  ] },

{ key: 'WPF-R.M7', file: 'WPF-Rechenfit_M_7_Rechenart-Sortierer.html', lskey: 'wpfr7_lang', icon: '🧩', h1: 'Rechenart-Sortierer', title: 'Rechenart-Sortierer – WPF Rechenfit Modul 7', langs: ES,
  head: 'Welche Rechenart ist gefragt? ¦ ¿Qué tipo de cálculo se pide?',
  merk: 'In der Prüfung zuerst die Rechenart erkennen: Dreisatz („2 kosten …, wie viel kosten 5?“), Prozentrechnung („… %“, Rabatt, Steuer), Durchschnitt („im Mittel“). Dann Rechenweg aufschreiben und Einheit angeben. ¦ En el examen primero identifica el tipo de cálculo: regla de tres («2 cuestan…, ¿cuánto cuestan 5?»), porcentajes («… %», descuento, impuesto), promedio («de media»). Luego escribe el procedimiento e indica la unidad.',
  stages: h => [
    h.SORT('Welche Rechenart brauchst du? ¦ ¿Qué tipo de cálculo necesitas?',
      [h.B('🔁', 'Dreisatz ¦ Regla de tres'), h.B('%', 'Prozent ¦ Porcentaje'), h.B('⌀', 'Durchschnitt ¦ Promedio')],
      [h.I('🥤', 0, '6 Flaschen kosten 4,50 €. Wie viel kosten 10? ¦ 6 botellas cuestan 4,50 €. ¿Cuánto cuestan 10?'), h.I('🏷️', 1, '20 % Rabatt auf 150 € ¦ 20 % de descuento sobre 150 €'), h.I('📅', 2, 'Umsatz der Woche im Mittel pro Tag ¦ Ventas de la semana de media por día'), h.I('🧾', 1, 'Wie viel Umsatzsteuer sind in 119 € enthalten? ¦ ¿Cuánto IVA contienen 119 €?'), h.I('⚖️', 0, '3 kg Obst kosten 7,50 €. Preis für 5 kg? ¦ 3 kg de fruta cuestan 7,50 €. ¿Precio de 5 kg?'), h.I('👥', 2, 'Durchschnittliche Kundenzahl je Stunde ¦ Número medio de clientes por hora')]),
    h.CALC('🔁', 'Prüfungsstil: 6 Dosen kosten 7,20 €. Wie viel kosten 9 Dosen? ¦ Estilo examen: 6 latas cuestan 7,20 €. ¿Cuánto cuestan 9 latas?', '€', 10.8, 'Eine Dose: 7,20 : 6 = 1,20. ¦ Una lata: 7,20 : 6 = 1,20.', '1,20 · 9 = 10,80'),
    h.CALC('🏷️', 'Prüfungsstil: Ein Pullover für 60 € wird um 15 % herabgesetzt. Neuer Preis? ¦ Estilo examen: Un jersey de 60 € se rebaja un 15 %. ¿Precio nuevo?', '€', 51, 'Erst 15 % von 60 = 9. ¦ Primero el 15 % de 60 = 9.', '60 − 9 = 51'),
    mc(h, '✍️', 'Was gehört zu einer vollständigen Rechenaufgabe in der Prüfung? ¦ ¿Qué forma parte de un ejercicio completo en el examen?', 'Rechenweg und Ergebnis mit Einheit ¦ Procedimiento y resultado con unidad', ['Nur das Ergebnis ohne Einheit ¦ Solo el resultado sin unidad', 'Nur die Einheit ¦ Solo la unidad'], 'Der Rechenweg bringt Teilpunkte, auch wenn das Ergebnis falsch ist. ¦ El procedimiento da puntos parciales aunque el resultado sea incorrecto.'),
    h.CALC('🎓', 'Profi: Durchschnitt der Tagesumsätze 410, 390, 450, 430, 420 €. ¦ Profi: Promedio de las ventas diarias 410, 390, 450, 430, 420 €.', '€', 420, 'Summe : 5. ¦ Suma : 5.', '2100 : 5 = 420', true)
  ] },

{ key: 'WPF-R.M8', file: 'WPF-Rechenfit_M_8_Rechentest-Mix.html', lskey: 'wpfr8_lang', icon: '🎯', h1: 'Rechentest-Mix', title: 'Rechentest-Mix – WPF Rechenfit Modul 8', langs: ES,
  head: 'Generalprobe für die Abschlussprüfung ¦ Ensayo general para el examen final',
  merk: 'Vor jeder Rechenaufgabe: Was ist gegeben? Was ist gesucht? Welche Rechenart? Rechenweg aufschreiben, Ergebnis mit Einheit, Probe durch Überschlagen (Ergebnis plausibel?). ¦ Antes de cada ejercicio: ¿Qué se da? ¿Qué se busca? ¿Qué tipo de cálculo? Escribe el procedimiento, resultado con unidad y comprueba por estimación (¿es plausible?).',
  stages: h => [
    h.CALC('💶', 'Ein Kunde kauft für 23,45 € ein und zahlt mit einem 50-€-Schein. Wechselgeld? ¦ Un cliente compra por 23,45 € y paga con un billete de 50 €. ¿Cambio?', '€', 26.55, '50,00 − 23,45. ¦ 50,00 − 23,45.', '50,00 − 23,45 = 26,55'),
    h.CALC('🏷️', 'Rechnung 1.200 €, Skonto 3 %. Wie hoch ist der Skontobetrag? ¦ Factura 1.200 €, pronto pago del 3 %. ¿A cuánto asciende?', '€', 36, '1200 · 3 : 100. ¦ 1200 · 3 : 100.', '1200 · 3 : 100 = 36'),
    h.CALC('📈', 'Der Preis steigt von 40 € auf 50 €. Um wie viel Prozent? ¦ El precio sube de 40 € a 50 €. ¿En qué porcentaje?', '%', 25, '10 · 100 : 40. ¦ 10 · 100 : 40.', '10 · 100 : 40 = 25 %'),
    h.CALC('📦', 'Anfangsbestand 200, Endbestand 600 Stück. Ø-Lagerbestand? ¦ Existencia inicial 200, final 600 unidades. ¿Existencia media?', 'Stück', 400, '(200 + 600) : 2. ¦ (200 + 600) : 2.', '800 : 2 = 400'),
    mc(h, '🧐', 'Dein Ergebnis für eine Hose ist 0,89 €, obwohl sie etwa 40 € kosten soll. Was tust du? ¦ Tu resultado para unos pantalones es 0,89 €, aunque deberían costar unos 40 €. ¿Qué haces?', 'Überschlagen und die Rechnung noch einmal prüfen ¦ Estimar y revisar el cálculo otra vez', ['Das Ergebnis so abgeben ¦ Entregar el resultado tal cual', 'Zufällig eine Zahl ändern ¦ Cambiar un número al azar'], 'Plausibilitätsprüfung rettet Punkte. ¦ La comprobación de plausibilidad salva puntos.'),
    h.CALC('🎓', 'Profi: Listenpreis 800 €, Rabatt 25 %, Bezugskosten 30 €. Bezugspreis? ¦ Profi: Precio de lista 800 €, descuento 25 %, gastos de compra 30 €. ¿Precio de adquisición?', '€', 630, 'Rabatt: 200 €. Dann plus Bezugskosten. ¦ Descuento: 200 €. Luego más gastos de compra.', '800 − 200 = 600; 600 + 30 = 630', true)
  ] },

];
