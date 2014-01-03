# Click button to calculate the Flesch readability index

There'll be a button which calculates and displays the Flesch redability index.

Calculation of the Flesch index is triggered by entering !, ?, RETURN or BACKSPACE. Or by pushing the button.

The button shows a tooltip, which provides additional information.

Short sentences and words with only a few syllables ensure the readability of a text.

## Calculation details

The original Flesch index is calculated for all languages. German umlauts are replaced (ä = a, ß = ss...).

Numbers are counted as a single syllable (1000,56 = one syllable).

Links are split into subparts (http://aaa-bbb.bla?foo=bar = http aaa bbb bla foo bar).

## Readability scale

* -1000: Dissertation, red
* 10: Officialese, red
* 20: AmbitiousNewspaper, orange
* 35: AverageNewspaper, yellow
* 50: YellowPress, green
* 60: SalesLetter, green
* 80: Slogan, green
* 90: Comic, green

# Install

On the command line, run `npm install ep_readability`.

Alternatively, browse to `http://yourEtherpadliteInstan.ce/admin/plugins`, search for `readability` and click install.

After restarting the server, the plugin takes effect.

# Code

https://github.com/xErik/ep_readability

# TODO

## Options to fine tune the counting process

The plugin interprets a line break (paragraph) as the end of a sentence. If text is copied into the pad, the line breaks may be incorrect and manual adjustment may be necessary. 

Problematic text, counted as two sentences:

    1. All participants
    2. are expected to be awake.

Corrected text, counted as one sentence:

    1. All participants are expected to be awake.
    2. 

## Numbers

Rethink the current solution for counting numbers as one syllable.

Rethink time definitions e.g., 20:30.

## Regex

The internal work is based on a regex orgy. Which could be rewritten, maybe using DOM for additional capabilities like highlighting long words and sentences.

# License
MIT

# Other Resources
Some code of the TextStatistics package is being used.

TextStatistics.js, Christopher Giffard (2012)

`https://github.com/DaveChild/Text-Statistics`