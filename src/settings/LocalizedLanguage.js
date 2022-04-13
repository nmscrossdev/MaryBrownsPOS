// ES6 module syntax
import LocalizedStrings from 'react-localization';
import language_es from './Language_es'; //Spanish
import language_en from './Language_en'; //English
import language_hi from './Language_hi'; //Hindi
import language_fr from './Language_fr'; //French
import language_nl from './Language_nl'; //Dutch
import language_de from './Language_de'; //German
import language_zh from './Language_zh'; //chinese
import language_no from './Language_no'; //Norwegian
import language_da from './Language_da'; //danish
import language_fi from './Language_fi'; //finnish for Finland
var language = {
    "en": language_en.en,
    "fr": language_fr.fr,
    "hi": language_hi.hi,
    "es": language_es.es,
    "nl": language_nl.nl,
    "de": language_de.de,
    "zh": language_zh.zh,
    "no": language_no.no,
    "da": language_da.da,
    "fi": language_fi.fi,
}

var lang = localStorage.getItem('LANG') ? localStorage.getItem('LANG').toString() : 'en';
var result = {};
const formatedLanguage = (selectLang) => {
    // console.log("selectLang",selectLang)
    if (selectLang && selectLang.length) {
        for (var i = 0; i < selectLang.length; i++) {
            result[selectLang[i].key.replace(" ", "")] = selectLang[i].value;
        }
    } else {
        formatedLanguage(language.en)
    }
    return result
}

var LocalizedLanguage = new LocalizedStrings({
    [lang]: formatedLanguage(language[lang])
});

//console.log("LocalizedLanguage", LocalizedLanguage) 
if (lang) {
    LocalizedLanguage.setLanguage(lang);
}
export default LocalizedLanguage;


