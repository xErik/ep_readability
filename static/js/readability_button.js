// ----------------------------------------------------------------------------
// Some snippets from TextStatistics.js (see below) are being used and have
// been adjusted/corrected.
//
// TextStatistics.js
// Christopher Giffard (2012)
// https://github.com/DaveChild/Text-Statistics
// ----------------------------------------------------------------------------
	
	// @TODO rething this regex orgy: the input text is pretty wild sometimes	
	exports.cleanText = function(text) {
		
		//console.log(text);		
		// 1. Remove HTML entities @TODO add more entities
		// 2. Check for plain text links		
		// 3. Remove Etherpad spans, headings (style plugin) and formatting
		// 4. Get an Etherpad paragraph, add dot if no terminator or comma is at the end
		
		text = text.replace(/(&nbsp;)+/gm,' ')
			.replace(/((https?|ftp|file):[\w\.\/\?&=\-\_\:]+)/gm, function(match) {
				return match.split(/[^a-zA-Z0-9äüöÄÜÖß]/).join(' ');
			}) 
			.replace(/<(?!div|\/div)[^>]*>/gm,'').replace(/<\/(?!div)>/gm,'')
			.replace(/<div[^>]*>([^<]+[^:, !?.-])\s*<\/div>/gm, "$1.");

		//console.log(text);
		// This is not Etherpad specific:
		text = text
			.replace(/<[^>]+>/gm, '')					// Strip tags (should be DIVs only at this point)
			.replace(/\d+([\.,]?\d+)*/g, 'two') 		// Convert numbers with delimiters to one syllable @TODO lookahead for space: EUR 1000. bla						
			.replace(/[!?]/gm, '.')						// Unify terminators
			.replace(/(\w)[:,](\S+)/gm, '$1 $2')		// Unify sentence structure
			.replace(/(\w)- (?!und|and)(\w)/gm, '$1$2')	// Remove inline word breaks @TODO add other fill words
			.replace(/(\w)(\r\n|\n|\r)/gm,"$1.")		// Add dot to text followed by linebreak (probably a heading)
			.replace(/(\r\n|\n|\r)/gm,' ')				// Replace new lines with spaces
			.replace(/[^a-zA-Z0-9\.äüöÄÜÖß ]+/gm, '')	// Remove non-word characters
			.replace(/(\w)(\.)+\s*(\w)?/gm,'$1. $3')	// Enhance readability, remove multiple termindator
			.replace(/\s+/g,' ')						// Remove multiple spaces
			.replace(/^\s+/gm,'')						// Strip leading whitespace
			.replace(/\s+$/gm,'')						// Strip trailing whitespace
			.replace(/ä/gm, 'a')						// Consider German umlauts
			.replace(/Ä/gm, 'a')
			.replace(/ü/gm, 'u')
			.replace(/Ü/gm, 'u')
			.replace(/ö/gm, 'o')
			.replace(/Ö/gm, 'o')
			.replace(/ß/gm, 'ss');

		//console.log(text);
		
		return text;
	}
	
	exports.fleschReadingEase = function(text, lang) {
		var flesch = wordCount = sentenceCount = syllCount = averageWordsPerSentence = averageSyllablesPerWord = null;

		wordCount = text.split(/[\s\.]+/g).length || 1;
		sentenceCount = (text.split(/[\.]+/g).length -1) || 1;
		averageWordsPerSentence = wordCount / sentenceCount;
		syllCount = 0;
		
		// Syllables
		text.split(/[\s\.]+/).forEach(function(word) {
			syllCount += exports.syllableCount(word); // exports.countSyllables(word);
		});
		averageSyllablesPerWord = (syllCount || 1) / wordCount;
		
		// Flesch
		if(lang == 'de')
			flesch = Math.round( (180 - averageWordsPerSentence - (58.5 * averageSyllablesPerWord))*10 )/10;
		else
			flesch = Math.round( (206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord))*10 )/10;
		
		var result = {
			 'wordCount': wordCount
			, 'sentenceCount': sentenceCount
			, 'syllableCount': syllCount
			, 'averageWordsPerSentence': averageWordsPerSentence
			, 'averageSyllablesPerWord': averageSyllablesPerWord
			, 'flesch': flesch
		}
		
		return result;
	};
	
	/*
	Evaluate: https://github.com/brbcoding/Readability/blob/master/readability.js
	exports.countSyllables = function(word) {
		word = word.toLowerCase();
		if(word.length <= 3) { return 1; }
		word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
		word = word.replace(/^y/, '');
		console.log(word);
		return word.match(/[aeiouy]{1,2}/g).length;
	};	*/
	
	//
	// I need to go through this function in detail and check it
	//
	exports.syllableCount = function(word) {
		
		var syllableCount = 0,
			prefixSuffixCount = 0,
			wordPartCount = 0;
		
		// Prepare word - make lower case and remove non-word characters
		word = word.toLowerCase();//.replace(/[^a-z]/g,"");
		
		// Specific common exceptions that don't follow the rule set below are handled individually
		// Array of problem words (with word as key, syllable count as value)
		var problemWords = {
			"simile":		3,
			"forever":		3,
			"shoreline":	2
		};
		
		// Return if we've hit one of those...
		if (problemWords[word]) return problemWords[word];
		
		// These syllables would be counted as two but should be one
		var subSyllables = [
			/cial/,
			/tia/,
			/cius/,
			/cious/,
			/giu/,
			/ion/,
			/iou/,
			/sia$/,
			/[^aeiuoyt]{2,}ed$/,
			/.ely$/,
			/[cg]h?e[rsd]?$/,
			/rved?$/,
			/[aeiouy][dt]es?$/,
			/[aeiouy][^aeiouydt]e[rsd]?$/,
			/^[dr]e[aeiou][^aeiou]+$/, // Sorts out deal, deign etc
			/[aeiouy]rse$/ // Purse, hearse
		];
	
		// These syllables would be counted as one but should be two
		var addSyllables = [
			/ia/,
			/riet/,
			/dien/,
			/iu/,
			/io/,
			/ii/,
			/[aeiouym]bl$/,
			/[aeiou]{3}/,
			/^mc/,
			/ism$/,
			/([^aeiouy])\1l$/,
			/[^l]lien/,
			/^coa[dglx]./,
			/[^gq]ua[^auieo]/,
			/dnt$/,
			/uity$/,
			/ie(r|st)$/
		];
	
		// Single syllable prefixes and suffixes
		var prefixSuffix = [
			/^un/,
			/^fore/,
			/ly$/,
			/less$/,
			/ful$/,
			/ers?$/,
			/ings?$/
		];
	
		// Remove prefixes and suffixes and count how many were taken
		prefixSuffix.forEach(function(regex) {
			if (word.match(regex)) {
				word = word.replace(regex,"");
				prefixSuffixCount ++;
			}
		});
		
		wordPartCount = word
			.split(/[^aeiouy]+/ig)
			.filter(function(wordPart) {
				return !!wordPart.replace(/\s+/ig,"").length
			})
			.length;
		
		// Get preliminary syllable count...
		syllableCount = wordPartCount + prefixSuffixCount;
		
		// Some syllables do not follow normal rules - check for them
		subSyllables.forEach(function(syllable) {
			if (word.match(syllable)) syllableCount --;
		});
		
		addSyllables.forEach(function(syllable) {
			if (word.match(syllable)) syllableCount ++;
		});
		
		syllCount = syllableCount || 1;
		return syllCount;
	};
	
	// -----------------------------------------------
	// Calculate readability
	// -----------------------------------------------
	
	var color = {
		 '-1000':{'color': '#FF6666'	, 'resultCategory': 'readability.resultCategory.Dissertation'}
		, '10':  {'color': '#FF6666'	, 'resultCategory': 'readability.resultCategory.Officialese'}
		, '20':  {'color': 'orange'		, 'resultCategory': 'readability.resultCategory.AmbitiousNewspaper'}
		, '35':  {'color': 'yellow'		, 'resultCategory': 'readability.resultCategory.AverageNewspaper'}
		, '50':  {'color': 'lightgreen'	, 'resultCategory': 'readability.resultCategory.YellowPress'}
		, '60':  {'color': 'lightgreen'	, 'resultCategory': 'readability.resultCategory.SalesLetter'}
		, '80':  {'color': 'lightgreen'	, 'resultCategory': 'readability.resultCategory.Slogan'}
		, '90':  {'color': 'lightgreen'	, 'resultCategory': 'readability.resultCategory.Comic'}
	}
	var colorOrder = ['-1000', '10', '20', '35', '50', '60', '80', '90'];

	// do not calculate index if no key has been pressed
	var calculateInterval = null;
		
	exports.aceKeyEvent = function(hook, callstack) {

		// Avoiding recalculation of index if user is typing numbers and chars.
		// It is difficult to detect "!" and "?" accross browsers, this is a (inefficient?) workaround.
		// shiftKey is checked to let "!" and "?" through on qwertz/y keyboards.
		// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		
		var k = callstack.evt.keyCode;
		if(callstack.evt.altKey == false
			&& callstack.evt.shiftKey == false
			&& (/*k == 8 || backspace*/ k == 9 || (k >= 19 && k <= 123))) {
			return true;
		}

		// recalculate text in intervals
		// this is way better than checking for key events accross browsers and keyboard layouts
		if(calculateInterval !== null) clearInterval(calculateInterval);
		calculateInterval = setTimeout(function(){
			$('#calculateReadabilityButton').trigger('click');
		},1500);
		
		return true;
	}

	exports.postAceInit = function(ace) {
		var toolTip = window._('readability.readability.calculate') + "\n\n" 
			+ window._('readability.info.advice');
		$('#calculateReadabilityButton').attr('title', toolTip);
      	$('#readabilityInfo').attr('title', toolTip);
		calculateInterval = setTimeout(function() {
			$('#calculateReadabilityButton').trigger('click');
		}, 1500);
	}

	// @TODO proper language detection
	/*exports.detectLangage = function(text) {
		var lang = 'en';
		if(text != null) {
			var hits = text.match(/ä|Ä|ü|Ü|ö|Ö|ß/gm);
			if(hits != null && hits.length > 0) 
				lang = 'de';
		}
		console.log('Language detected: ' + lang);
		return lang;
	}*/

	exports.doTest = function(text) {
		console.log(text);
		
		
	}	
	
	// Puts the JS not in the right place
	/*exports.aceInitInnerdocbodyHead = function(hook, context) {
		//console.log();
		//context.iframeHTML.push('<script src="http://github.com/bartaz/sandbox.js/raw/master/jquery.highlight.js"></script>');
		context.iframeHTML.push('<script src="../static/plugins/ep_readability/static/js/jquery.highlight.js"></script>');		
		return context.iframeHTML;
	};*/


	exports.aceEditorCSS = function(){
	  return ['ep_readability/static/css/editor.css'];
	};

	exports.documentReady = function(hook_name, args, cb) {
		
	  $('#calculateReadabilityButton').click(function() {
		
		var text = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").html();
		exports.doTest(text);
		var resultFlesch = window._('readability.noResultYet');
		var myColor = 'transparent';
		var myCategory = window._('readability.readability'); // not a category at this point
		var toolTip = window._('readability.readability.calculate') + "\n\n" + window._('readability.info.advice');
		//var lang = exports.detectLangage(text);
		text = exports.cleanText(text);
		
		if(text.length > 0) {
			result = exports.fleschReadingEase( text, 'en' );
			jQuery.each(colorOrder, function(index, item) {
		    	if(result.flesch > item) {
					myColor = color[item].color;
					myCategory = window._(color[item].resultCategory);
					resultFlesch = result.flesch;
				}
			});
			toolTip = window._('readability.info.fleschIndex') + result.flesch + ' ' + window._('readability.info.fleschScale') + "\n"
				//+ window._('readability.info.language') + lang + "\n"
				+ window._('readability.info.sentences') + result.sentenceCount + "\n"
				+ window._('readability.info.words') + result.wordCount + "\n"
				+ window._('readability.info.syllables') + result.syllableCount + "\n"			
				+ window._('readability.info.WordsSentence') + Math.round(result.averageWordsPerSentence*100)/100 + "\n"
				+ window._('readability.info.syllablesWord') + Math.round(result.averageSyllablesPerWord*100)/100 + "\n\n"
				+ window._('readability.info.advice');			
		}
		$('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").highlight(/\bund\b/gi);
		// @TODO set a single style attribute, not all of them
		$('#calculateReadabilityButton').attr('title', toolTip);
        $('#readabilityInfo').attr('title', toolTip).text(myCategory + ' ');
		$('#readabilityMarker').attr('style', 'float:right;color:black;display:inline-block;font-size:1.25em;width:35px;height:100%;border:1px black dotted;background-color:' + myColor + ';').text(resultFlesch);
	  });
	}