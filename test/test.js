var readab = require('../static/js/readability_button.js');

exports.testCleanTextAddDotToParagraph = function(test){
	var text = '<div id="magicdomid2" class=""><span class="author-a-z65zjckdup0xdseeity">Politische Transparenz und Antikorruption</span></div>';
	var result = 'Politische Transparenz und Antikorruption.';
	test.equal(result, readab.cleanText(text));
	
	text = '<div id="magicdomid2" class=""><span class="author-a-z65zjckdup0xdseeity">Politische Transparenz und Antikorruption!</span></div>';
	result = 'Politische Transparenz und Antikorruption.';
	test.equal(result, readab.cleanText(text));

	text = '<div id="magicdomid3" class=""><span class="author-a-z65zjckdup0xdseeity">Es soll:</span></div><div id="magicdomid4" class=""><br></div><div id="magicdomid5" class=""><span class="author-a-z65zjckdup0xdseeity">die Existenz sichern</span></div>';
	result = 'Es soll die Existenz sichern.';
	test.equal(result, readab.cleanText(text));

	text = '<div id="magicdomid14" class=""><span class="author-a-z65zjckdup0xdseeity">Der sich wie folgt berechnet:</span></div><div id="magicdomid15" class=""><br></div><div id="magicdomid16" class=""><span class="author-a-z65zjckdup0xdseeity">(60% vom durchschnittlichen Jahresarbeitslohn in Deutschland + 1.000€ Werbekostenpauschale) geteilt durch 2.080 Stunden [52 Wochen à 40 Wochenstunden]</span></div>';
	result = 'Der sich wie folgt berechnet two vom durchschnittlichen Jahresarbeitslohn in Deutschland two Werbekostenpauschale geteilt durch two Stunden two Wochen two Wochenstunden.';
	test.equal(result, readab.cleanText(text));
	
	text = '<div id="magicdomid6" class=""><span class="author-a-eyz86zqg38z79zx2z82z0z70zsz89zz76z">»</span><span class="author-a-eyz86zqg38z79zx2z82z0z70zsz89zz76z i"><i>Die Politik ist hier besonders gefragt, Entwicklung und Einsatz freier Verschlusselungsanwendungen zu fordern</i></span><span class="author-a-eyz86zqg38z79zx2z82z0z70zsz89zz76z">.«</span></div>';
	result = 'Die Politik ist hier besonders gefragt Entwicklung und Einsatz freier Verschlusselungsanwendungen zu fordern.';
	test.equal(result, readab.cleanText(text));
	
    test.done();
};

exports.testCleanTextNumbers = function(test) {
	var text = '<div id="magicdomid2" class=""><span class="author-a-z65zjckdup0xdseeity">1000,56€</span></div>';
	var result = 'two.';
	test.equal(result, readab.cleanText(text));
	test.done();
}

exports.testCleanTextWordBreak = function(test) {
	var text = '<div id="magicdomid10" class=""><span class="author-a-z65zjckdup0xdseeity"> als Kon-</span></div><div id="magicdomid11" class=""><br></div><div id="magicdomid12" class=""><br></div><div id="magicdomid13" class=""><span class="author-a-z65zjckdup0xdseeity">trollinstanz sicherstellen.</span></div>';
	var result = 'als Kontrollinstanz sicherstellen.';
	test.equal(result, readab.cleanText(text));
	test.done();
}

exports.cleanTextWorkBreakInline = function(test) {
	var text = '<div id="magicdomid15" class=""><span class="author-a-z65zjckdup0xdseeity">Aus Transparenzgrunden soll ein solches Register auf der Internetseite des Bundesta- ges veroffentlicht werden. Es muss maschinenlesbar gestaltet sein, um im Sinne von OpenData die Verknupfung mit Abgeordneten- und Abstimmungsdaten zu ermogli- chen und um Sortier- und Durchsuchbarkeit sicherzustellen.</span></div>';
	var result = 'Aus Transparenzgrunden soll ein solches Register auf der Internetseite des Bundestages veroffentlicht werden. Es muss maschinenlesbar gestaltet sein um im Sinne von OpenData die Verknupfung mit Abgeordneten und Abstimmungsdaten zu ermoglichen und um Sortier und Durchsuchbarkeit sicherzustellen.';
	test.equal(result, readab.cleanText(text));
	test.done();
}

exports.cleanTextEntityDecode = function(test) {
	var text = '<div id="magicdomid2" class=""><br></div><div id="magicdomid3" class=""><br></div><div id="magicdomid4" class=""><span class="author-a-z65zjckdup0xdseeity">&nbsp;</span></div><div id="magicdomid5" class=""><br></div>';
	var result = '';
	test.equal(result, readab.cleanText(text));
	
	text = '<div id="magicdomid2" class=""><span class="author-a-z65zjckdup0xdseeity">Bedingungsloses Grundeinkommen und Mindestlohn&nbsp;</span></div><div id="magicdomid3" class=""><span class="author-a-z65zjckdup0xdseeity">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div id="magicdomid4" class=""><span class="author-a-z65zjckdup0xdseeity">Wir Piraten setzen uns fur die Einfuhrung eines bedingungslosen Grundeinkommens ein, das die Ziele des „Rechts auf sichere Existenz und gesellschaftlicher Teilhabe“ aus unserem Parteiprogramm erfullt. Es soll:&nbsp;</span></div>';
	result = 'Bedingungsloses Grundeinkommen und Mindestlohn. Wir Piraten setzen uns fur die Einfuhrung eines bedingungslosen Grundeinkommens ein das die Ziele des Rechts auf sichere Existenz und gesellschaftlicher Teilhabe aus unserem Parteiprogramm erfullt. Es soll';
	test.equal(result, readab.cleanText(text));
		
	test.done();
}

exports.cleanTextFormatting = function(test) {
	var text = '<div id="magicdomid2" class="ace-line"><h1><code><i><b><span class="author-a-z65zjckdup0xdseeity">Das Generationen-Manifest</span></h1></div><div id="magicdomid3" class="ace-line"><h1><span class="author-a-z65zjckdup0xdseeity">Hier geht es direkt zum Download!</span></b></i></code></h1></div>';
	var result = 'Das GenerationenManifest. Hier geht es direkt zum Download.';
	test.equal(result, readab.cleanText(text));
	test.done();
}

exports.cleanTextLinks = function(test) {
	var text = '<div id="magicdomid8" class=""><br></div><div id="magicdomid9" class=""><span class="author-a-z65zjckdup0xdseeity url"><a href="http://jaja.nono-nana.bla?nix=doh">http://jaja.nono-nana.bla?nix=doh</a></span></div>';
	var result = 'http jaja nono nana bla nix doh.';
	test.equal(result, readab.cleanText(text));
	
	var text = '<div id="magicdomid27" class=""><span class="author-a-z65zjckdup0xdseeity">Vortrag (</span><span class="author-a-z65zjckdup0xdseeity url"><a href="http://wiki.piratenpartei.de/Datei:Aaa_Bbb.jpg)">http://wiki.piratenpartei.de/Datei:Aaa_Bbb.jpg)</a></span></div>';
	var result = 'Vortrag http wiki piratenpartei de Datei Aaa Bbb jpg.';
	test.equal(result, readab.cleanText(text));	
	test.done();
}
