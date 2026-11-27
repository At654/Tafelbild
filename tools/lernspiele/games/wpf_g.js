/* WPF Grafiken (WPF-G) – Lernspiele mit Spanisch. Texte: Deutsch ¦ es */
const ES = ['es'];
const mc = (h, e, q, right, wrong, w, p) => h.MC(e, q, [right].concat(wrong), 0, w, p);
module.exports = [

{ key: 'WPF-G.M1', file: 'WPF-Grafiken_M_1_Grafik-Detektiv.html', lskey: 'wpfg1_lang', icon: '📊', h1: 'Grafik-Detektiv', title: 'Grafik-Detektiv – WPF Grafiken Modul 1', langs: ES,
  head: 'Wie liest man eine Grafik? ¦ ¿Cómo se lee un gráfico?',
  merk: 'Zuerst Titel lesen, dann Achsen und Einheiten, dann Legende, dann die Quelle. Diagrammtypen: Balkendiagramm = Vergleich, Liniendiagramm = Entwicklung über die Zeit, Kreisdiagramm = Anteile am Ganzen. ¦ Primero leer el título, luego ejes y unidades, después la leyenda y la fuente. Tipos: gráfico de barras = comparación, de líneas = evolución en el tiempo, circular = partes de un todo.',
  stages: h => [
    h.ORDER('Bringe die Schritte zum Lesen einer Grafik in die richtige Reihenfolge. ¦ Ordena los pasos para leer un gráfico.',
      'Erst das Thema (Titel), dann Achsen und Einheiten, dann Legende, am Ende die Aussage. ¦ Primero el tema (título), luego ejes y unidades, después la leyenda y al final la conclusión.',
      [h.O('🏷️', 'Titel lesen ¦ Leer el título'), h.O('📏', 'Achsen und Einheiten prüfen ¦ Revisar ejes y unidades'), h.O('🎨', 'Legende ansehen ¦ Mirar la leyenda'), h.O('💡', 'Aussage formulieren ¦ Formular la conclusión')]),
    h.SORT('Welches Diagramm passt zur Aufgabe? ¦ ¿Qué gráfico encaja con la tarea?',
      [h.B('📊', 'Balken (Vergleich) ¦ Barras (comparar)'), h.B('📈', 'Linie (Entwicklung) ¦ Líneas (evolución)'), h.B('🥧', 'Kreis (Anteile) ¦ Circular (partes)')],
      [h.I('🏬', 0, 'Umsatz von drei Filialen vergleichen ¦ Comparar las ventas de tres sucursales'), h.I('🌡️', 1, 'Temperatur im Laufe eines Jahres ¦ Temperatura a lo largo de un año'), h.I('🍰', 2, 'Anteil der Zahlungsarten am Gesamtumsatz ¦ Proporción de formas de pago en las ventas totales'), h.I('👨‍🎓', 1, 'Anzahl der Azubis über zehn Jahre ¦ Número de aprendices durante diez años'), h.I('🥤', 0, 'Verkaufte Getränke je Sorte vergleichen ¦ Comparar las bebidas vendidas por tipo'), h.I('👥', 2, 'Altersgruppen der Kunden in Prozent ¦ Grupos de edad de los clientes en porcentaje')]),
    h.PICK('Was gehört zu einer guten Grafik? ¦ ¿Qué forma parte de un buen gráfico?',
      'Titel, Achsenbeschriftung, Einheit und Quelle gehören dazu. ¦ El título, los rótulos de los ejes, la unidad y la fuente forman parte de él.',
      [h.K('🏷️', 1, 'Titel ¦ Título'), h.K('📏', 1, 'Beschriftete Achsen mit Einheit ¦ Ejes rotulados con unidad'), h.K('📚', 1, 'Quelle ¦ Fuente'), h.K('🎉', 0, 'Zufällige Werbebilder ¦ Imágenes publicitarias al azar'), h.K('🎨', 1, 'Legende (wenn nötig) ¦ Leyenda (si hace falta)')]),
    mc(h, '⚠️', 'Die y-Achse beginnt bei 90 statt bei 0. Was bewirkt das? ¦ El eje y empieza en 90 en lugar de 0. ¿Qué efecto tiene?', 'Unterschiede wirken größer, als sie sind ¦ Las diferencias parecen mayores de lo que son', ['Nichts ¦ Nada', 'Die Grafik ist falsch gedruckt ¦ El gráfico está mal impreso'], 'Die Achse immer prüfen: Sie kann täuschen. ¦ Revisa siempre el eje: puede engañar.'),
    mc(h, '🧐', 'Profi: Warum steht die Quelle unter der Grafik? ¦ Profi: ¿Por qué aparece la fuente bajo el gráfico?', 'Man kann prüfen, woher die Daten stammen ¦ Se puede comprobar de dónde proceden los datos', ['Damit die Grafik länger aussieht ¦ Para que el gráfico parezca más largo', 'Das ist reine Dekoration ¦ Es pura decoración'], 'Die Quelle zeigt, ob die Daten glaubwürdig sind. ¦ La fuente muestra si los datos son creíbles.', true)
  ] },

{ key: 'WPF-G.M2', file: 'WPF-Grafiken_M_2_Anteile-Profi.html', lskey: 'wpfg2_lang', icon: '🥧', h1: 'Anteile-Profi', title: 'Anteile-Profi – WPF Grafiken Modul 2', langs: ES,
  head: 'Anteile und Prozentwerte aus Grafiken ¦ Proporciones y porcentajes en gráficos',
  merk: 'Ein Kreisdiagramm zeigt Teile eines Ganzen: Alle Teile zusammen sind 100 %. Anteil in % = Teil · 100 : Ganzes. Prozentwert = Ganzes · % : 100. ¦ Un gráfico circular muestra partes de un todo: todas las partes suman 100 %. Porcentaje = parte · 100 : total. Valor porcentual = total · % : 100.',
  stages: h => [
    mc(h, '🥧', 'Ein Kreisdiagramm hat die Anteile 40 %, 35 % und ein dritter Teil. Wie groß ist der dritte Teil? ¦ Un gráfico circular tiene las partes 40 %, 35 % y una tercera. ¿Cuánto es la tercera?', '25 % ¦ 25 %', ['75 % ¦ 75 %', '10 % ¦ 10 %'], 'Alle Teile zusammen sind 100 %: 100 − 40 − 35 = 25. ¦ Todas las partes suman 100 %: 100 − 40 − 35 = 25.'),
    h.CALC('💳', 'Von 200 Kunden zahlen 25 % mit Karte. Wie viele Kunden sind das? ¦ De 200 clientes, el 25 % paga con tarjeta. ¿Cuántos clientes son?', 'Kunden', 50, 'Rechne 200 · 25 : 100. ¦ Calcula 200 · 25 : 100.', '200 · 25 : 100 = 50'),
    h.CALC('📱', 'Von 80 Besuchern kommen 20 mit dem Fahrrad. Wie viel Prozent sind das? ¦ De 80 visitantes, 20 vienen en bicicleta. ¿Qué porcentaje es?', '%', 25, 'Rechne 20 · 100 : 80. ¦ Calcula 20 · 100 : 80.', '20 · 100 : 80 = 25 %'),
    h.PICK('Welche Aussagen passen zu einem Kreisdiagramm? ¦ ¿Qué afirmaciones encajan con un gráfico circular?',
      'Ein Kreis zeigt Anteile am Ganzen, die zusammen 100 % ergeben. Er zeigt keine Entwicklung über Jahre. ¦ Un círculo muestra partes de un todo que suman 100 %. No muestra evolución a lo largo de los años.',
      [h.K('✅', 1, 'Alle Teile zusammen sind 100 %. ¦ Todas las partes suman 100 %.'), h.K('🍰', 1, 'Größere Stücke = größerer Anteil. ¦ Trozos mayores = mayor proporción.'), h.K('📈', 0, 'Es zeigt die Entwicklung über zehn Jahre. ¦ Muestra la evolución durante diez años.'), h.K('🎯', 1, 'Es zeigt Anteile an einer Gesamtmenge. ¦ Muestra partes de una cantidad total.')]),
    h.CALC('🛒', 'Profi: 30 % von 450 Artikeln sind Angebote. Wie viele Artikel sind keine Angebote? ¦ Profi: El 30 % de 450 artículos son ofertas. ¿Cuántos artículos no son ofertas?', 'Artikel', 315, 'Erst 30 % berechnen, dann abziehen. ¦ Primero calcula el 30 %, luego resta.', '450 · 30 : 100 = 135; 450 − 135 = 315', true)
  ] },

{ key: 'WPF-G.M3', file: 'WPF-Grafiken_M_3_Trend-Radar.html', lskey: 'wpfg3_lang', icon: '📈', h1: 'Trend-Radar', title: 'Trend-Radar – WPF Grafiken Modul 3', langs: ES,
  head: 'Veränderungen und Trends erkennen ¦ Reconocer cambios y tendencias',
  merk: 'Ein Trend ist die Richtung einer Entwicklung: steigend, fallend oder gleichbleibend. Absolute Veränderung = neuer Wert − alter Wert. Prozentuale Veränderung = Veränderung · 100 : alter Wert. ¦ Una tendencia es la dirección de una evolución: creciente, decreciente o constante. Cambio absoluto = valor nuevo − valor antiguo. Cambio porcentual = cambio · 100 : valor antiguo.',
  stages: h => [
    h.SORT('Welcher Trend ist beschrieben? ¦ ¿Qué tendencia se describe?',
      [h.B('📈', 'steigend ¦ creciente'), h.B('📉', 'fallend ¦ decreciente'), h.B('➖', 'gleichbleibend ¦ constante')],
      [h.I('🌡️', 0, 'Von 2020 bis 2024 immer mehr Onlinekäufe ¦ De 2020 a 2024 cada vez más compras online'), h.I('📻', 1, 'Der Verkauf von CDs sinkt jedes Jahr ¦ La venta de CD baja cada año'), h.I('🥖', 2, 'Der Brotpreis bleibt seit Jahren fast gleich ¦ El precio del pan casi no cambia desde hace años'), h.I('👨‍🎓', 0, 'Jedes Jahr mehr Azubis ¦ Cada año más aprendices'), h.I('🛍️', 1, 'Immer weniger Kunden kommen am Sonntag ¦ Cada vez menos clientes vienen el domingo'), h.I('⚖️', 2, 'Die Kundenzahl schwankt kaum ¦ El número de clientes apenas varía')]),
    h.CALC('➕', 'Der Umsatz steigt von 50 auf 62 Stück. Wie groß ist die absolute Veränderung? ¦ Las ventas suben de 50 a 62 unidades. ¿Cuál es el cambio absoluto?', 'Stück', 12, 'Neuer Wert minus alter Wert. ¦ Valor nuevo menos valor antiguo.', '62 − 50 = 12'),
    h.CALC('📊', 'Der Umsatz steigt von 50 auf 62 Stück. Um wie viel Prozent steigt er? ¦ Las ventas suben de 50 a 62 unidades. ¿En qué porcentaje suben?', '%', 24, 'Rechne 12 · 100 : 50. ¦ Calcula 12 · 100 : 50.', '12 · 100 : 50 = 24 %'),
    mc(h, '🔎', 'Eine Linie steigt von Jahr 1 bis 3 stark und dann kaum noch. Was beschreibst du? ¦ Una línea sube mucho del año 1 al 3 y luego casi nada. ¿Qué describes?', 'Erst starkes, dann schwaches Wachstum ¦ Primero fuerte y luego débil crecimiento', ['Dauerhaften Rückgang ¦ Descenso continuo', 'Gleichbleibende Werte ¦ Valores constantes'], 'Beschreibe die Linie in Abschnitten. ¦ Describe la línea por tramos.'),
    h.CALC('📉', 'Profi: Der Preis fällt von 80 € auf 60 €. Um wie viel Prozent sinkt er? ¦ Profi: El precio baja de 80 € a 60 €. ¿En qué porcentaje baja?', '%', 25, 'Veränderung 20 € · 100 : 80. ¦ Cambio 20 € · 100 : 80.', '20 · 100 : 80 = 25 %', true)
  ] },

{ key: 'WPF-G.M4', file: 'WPF-Grafiken_M_4_Tabellen-Knacker.html', lskey: 'wpfg4_lang', icon: '🧮', h1: 'Tabellen-Knacker', title: 'Tabellen-Knacker – WPF Grafiken Modul 4', langs: ES,
  head: 'Tabellen und Statistiken lesen ¦ Leer tablas y estadísticas',
  merk: 'Tabelle: Zeilen gehen waagerecht, Spalten senkrecht. Überschriften und Einheiten zuerst lesen. Summe = alle Werte addieren. Mittelwert (Durchschnitt) = Summe : Anzahl der Werte. Der größte und der kleinste Wert zeigen die Spannweite. ¦ Tabla: las filas van en horizontal, las columnas en vertical. Lee primero encabezados y unidades. Suma = sumar todos los valores. Media = suma : número de valores. El mayor y el menor valor muestran el rango.',
  stages: h => [
    h.SORT('Zeile oder Spalte? ¦ ¿Fila o columna?',
      [h.B('↔️', 'Zeile (waagerecht) ¦ Fila (horizontal)'), h.B('↕️', 'Spalte (senkrecht) ¦ Columna (vertical)')],
      [h.I('➡️', 0, 'Alle Werte für „Montag“ nebeneinander ¦ Todos los valores de «lunes» uno al lado del otro'), h.I('⬇️', 1, 'Alle Umsätze einer Filiale untereinander ¦ Todas las ventas de una sucursal una debajo de otra'), h.I('🧾', 0, 'Ein Artikel mit Preis, Menge und Summe ¦ Un artículo con precio, cantidad y suma'), h.I('📅', 1, 'Alle Werte der Woche 3 untereinander ¦ Todos los valores de la semana 3 en vertical')]),
    h.CALC('➕', 'Umsatz an drei Tagen: 120 €, 90 € und 150 €. Wie hoch ist die Summe? ¦ Ventas en tres días: 120 €, 90 € y 150 €. ¿Cuál es la suma?', '€', 360, 'Addiere alle drei Werte. ¦ Suma los tres valores.', '120 + 90 + 150 = 360'),
    h.CALC('🧮', 'Umsatz an drei Tagen: 120 €, 90 € und 150 €. Wie hoch ist der Durchschnitt? ¦ Ventas en tres días: 120 €, 90 € y 150 €. ¿Cuál es el promedio?', '€', 120, 'Summe : Anzahl der Tage. ¦ Suma : número de días.', '360 : 3 = 120'),
    mc(h, '🔍', 'In welcher Spalte steht die Einheit meistens? ¦ ¿Dónde suele estar la unidad?', 'In der Überschrift oder in der Kopfzeile ¦ En el encabezado o en la fila de títulos', ['Nie in der Tabelle ¦ Nunca en la tabla', 'In der letzten Zeile ganz klein ¦ En la última fila, muy pequeña'], 'Immer zuerst Überschrift und Einheit lesen: €, kg oder Stück machen einen großen Unterschied. ¦ Lee siempre primero el título y la unidad: €, kg o unidades marcan una gran diferencia.'),
    h.CALC('🏆', 'Profi: Wochenumsätze: 200, 250, 150, 300 €. Um wie viel ist der größte Wert größer als der kleinste? ¦ Profi: Ventas semanales: 200, 250, 150, 300 €. ¿En cuánto supera el mayor al menor?', '€', 150, 'Größter Wert minus kleinster Wert. ¦ Valor mayor menos valor menor.', '300 − 150 = 150', true)
  ] },

{ key: 'WPF-G.M5', file: 'WPF-Grafiken_M_5_Aussagen-Pruefer.html', lskey: 'wpfg5_lang', icon: '🧐', h1: 'Aussagen-Prüfer', title: 'Aussagen-Prüfer – WPF Grafiken Modul 5', langs: ES,
  head: 'Stimmt die Aussage? Grafiken beschreiben ¦ ¿Es cierta la afirmación? Describir gráficos',
  merk: 'Aussagen prüfen: Passt sie zu den Zahlen? Ist sie belegbar („stimmt“), widerlegt („stimmt nicht“) oder aus der Grafik nicht ablesbar? Grafik beschreiben: Thema nennen, Zeitraum oder Vergleich, Auffälligkeiten, Fazit. ¦ Comprobar afirmaciones: ¿Concuerdan con las cifras? ¿Se pueden demostrar («cierto»), refutar («falso») o no se pueden leer en el gráfico? Describir un gráfico: indicar el tema, el periodo o la comparación, lo llamativo y una conclusión.',
  stages: h => [
    h.SORT('Die Grafik zeigt: Filiale A 300 €, Filiale B 200 €, Filiale C 100 € Umsatz. Stimmt die Aussage? ¦ El gráfico muestra: sucursal A 300 €, B 200 €, C 100 € de ventas. ¿Es cierta la afirmación?',
      [h.B('✅', 'stimmt ¦ cierto'), h.B('❌', 'stimmt nicht ¦ falso'), h.B('❓', 'nicht ablesbar ¦ no se puede leer')],
      [h.I('🏬', 0, 'Filiale A hat den höchsten Umsatz. ¦ La sucursal A tiene las mayores ventas.'), h.I('🏬', 1, 'Filiale C hat mehr Umsatz als B. ¦ La sucursal C tiene más ventas que B.'), h.I('🏬', 2, 'Filiale A hat den meisten Gewinn. ¦ La sucursal A tiene la mayor ganancia.'), h.I('➕', 0, 'Zusammen machen alle drei 600 € Umsatz. ¦ Entre las tres hacen 600 € de ventas.'), h.I('👥', 2, 'In Filiale B arbeiten die meisten Mitarbeiter. ¦ En la sucursal B trabajan más empleados.')]),
    h.ORDER('Bringe die Bausteine einer Grafikbeschreibung in die richtige Reihenfolge. ¦ Ordena los elementos de una descripción de gráfico.',
      'Erst Thema und Quelle, dann Zeitraum, Auffälligkeit und Fazit. ¦ Primero tema y fuente, luego periodo, lo llamativo y la conclusión.',
      [h.O('🏷️', 'Thema und Quelle nennen ¦ Indicar tema y fuente'), h.O('📅', 'Zeitraum oder Vergleich beschreiben ¦ Describir periodo o comparación'), h.O('⭐', 'Auffälligkeiten nennen ¦ Mencionar lo llamativo'), h.O('🏁', 'Fazit ziehen ¦ Sacar una conclusión')]),
    mc(h, '✍️', 'Welcher Satz beschreibt eine Grafik am besten? ¦ ¿Qué frase describe mejor un gráfico?', 'Die Grafik zeigt, wie sich der Umsatz von 2020 bis 2024 entwickelt hat. ¦ El gráfico muestra cómo evolucionaron las ventas de 2020 a 2024.', ['Ich finde die Farben schön. ¦ Me gustan los colores.', 'Das ist ein Bild. ¦ Es una imagen.'], 'Eine Beschreibung nennt Thema und Zeitraum und bleibt bei den Daten. ¦ Una descripción indica el tema y el periodo y se atiene a los datos.'),
    mc(h, '⚠️', 'Die Zahl der Käufer steigt von 10 auf 12. Welche Formulierung ist übertrieben? ¦ El número de compradores sube de 10 a 12. ¿Qué formulación es exagerada?', 'Die Käufer haben sich verdoppelt. ¦ Los compradores se han duplicado.', ['Die Käufer sind um 2 gestiegen. ¦ Los compradores han aumentado en 2.', 'Die Käufer sind um 20 % gestiegen. ¦ Los compradores han aumentado un 20 %.'], 'Von 10 auf 12 ist ein Plus von 20 %, keine Verdopplung. ¦ De 10 a 12 es un aumento del 20 %, no una duplicación.'),
    mc(h, '🎯', 'Profi: Eine Grafik zeigt nur die Verkaufszahlen. Was darfst du NICHT daraus schließen? ¦ Profi: Un gráfico solo muestra las cifras de ventas. ¿Qué NO puedes concluir?', 'Wie hoch der Gewinn ist ¦ A cuánto asciende la ganancia', ['Welche Filiale am meisten verkauft ¦ Qué sucursal vende más', 'Ob die Zahlen steigen oder fallen ¦ Si las cifras suben o bajan'], 'Nur das, was in der Grafik steht, ist belegbar. ¦ Solo es demostrable lo que aparece en el gráfico.', true)
  ] },

{ key: 'WPF-G.M6', file: 'WPF-Grafiken_M_6_Schaubild-Lotse.html', lskey: 'wpfg6_lang', icon: '🧭', h1: 'Schaubild-Lotse', title: 'Schaubild-Lotse – WPF Grafiken Modul 6', langs: ES,
  head: 'Schaubilder der Wirtschaft verstehen ¦ Entender los esquemas de la economía',
  merk: 'Schaubilder zeigen Zusammenhänge: Pfeile stehen für Ströme (Güter, Geld), Kästen für Beteiligte (Haushalte, Unternehmen, Staat). Im Wirtschaftskreislauf fließen Güter in die eine und Geld in die Gegenrichtung. Ein Organigramm zeigt den Aufbau eines Betriebs. ¦ Los esquemas muestran relaciones: las flechas son flujos (bienes, dinero), las cajas son participantes (hogares, empresas, Estado). En el circuito económico los bienes fluyen en un sentido y el dinero en el contrario. Un organigrama muestra la estructura de una empresa.',
  stages: h => [
    h.SORT('Gütestrom oder Geldstrom? ¦ ¿Flujo de bienes o flujo de dinero?',
      [h.B('📦', 'Gütestrom ¦ Flujo de bienes'), h.B('💶', 'Geldstrom ¦ Flujo de dinero')],
      [h.I('🛒', 0, 'Das Geschäft liefert Ware an den Haushalt. ¦ La tienda entrega mercancía al hogar.'), h.I('💳', 1, 'Der Haushalt bezahlt die Ware. ¦ El hogar paga la mercancía.'), h.I('👷', 0, 'Haushalte stellen Arbeitskraft zur Verfügung. ¦ Los hogares ponen su trabajo a disposición.'), h.I('💰', 1, 'Das Unternehmen zahlt Löhne. ¦ La empresa paga salarios.'), h.I('🏭', 0, 'Das Unternehmen liefert Waren in den Laden. ¦ La empresa entrega mercancías a la tienda.'), h.I('🏦', 1, 'Der Kunde zahlt mit Karte. ¦ El cliente paga con tarjeta.')]),
    mc(h, '↔️', 'Im Wirtschaftskreislauf geht ein Güterpfeil nach rechts. In welche Richtung geht der zugehörige Geldpfeil? ¦ En el circuito económico una flecha de bienes va a la derecha. ¿Hacia dónde va la flecha de dinero correspondiente?', 'In die Gegenrichtung ¦ En sentido contrario', ['Ebenfalls nach rechts ¦ También a la derecha', 'Er fehlt ¦ No existe'], 'Waren und Geld fließen in entgegengesetzte Richtungen. ¦ Las mercancías y el dinero fluyen en direcciones opuestas.'),
    mc(h, '🏢', 'Was zeigt ein Organigramm? ¦ ¿Qué muestra un organigrama?', 'Den Aufbau eines Betriebs mit Abteilungen und Vorgesetzten ¦ La estructura de una empresa con departamentos y superiores', ['Die Wetterlage ¦ El tiempo atmosférico', 'Die Preise der letzten Woche ¦ Los precios de la semana pasada'], 'Boxen = Stellen, Linien = Weisungswege. ¦ Cajas = puestos, líneas = vías de mando.'),
    h.PICK('Welche Beteiligten kommen im Wirtschaftskreislauf vor? ¦ ¿Qué participantes aparecen en el circuito económico?',
      'Haushalte, Unternehmen und der Staat sind im erweiterten Kreislauf dabei. ¦ Hogares, empresas y Estado participan en el circuito ampliado.',
      [h.K('🏠', 1, 'Haushalte ¦ Hogares'), h.K('🏭', 1, 'Unternehmen ¦ Empresas'), h.K('🏛️', 1, 'Staat ¦ Estado'), h.K('🚀', 0, 'Raumfahrtbehörde ¦ Agencia espacial'), h.K('🏦', 1, 'Banken (Sparen und Kredit) ¦ Bancos (ahorro y crédito)')]),
    mc(h, '🧠', 'Profi: Haushalte sparen mehr. Was ändert sich im Schaubild? ¦ Profi: Los hogares ahorran más. ¿Qué cambia en el esquema?', 'Ein Teil des Geldes fließt zur Bank statt zu den Unternehmen ¦ Parte del dinero va al banco en lugar de a las empresas', ['Nichts ändert sich ¦ No cambia nada', 'Die Unternehmen liefern mehr Waren ¦ Las empresas entregan más mercancías'], 'Sparen leitet Geld in einen Nebenstrom zur Bank. ¦ El ahorro desvía dinero hacia una corriente lateral hacia el banco.', true)
  ] },

];
