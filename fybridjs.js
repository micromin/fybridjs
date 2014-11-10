/**
 * Fybrid is an open source library for performing fingerprinting.
 * Fingerprinting can be used for browser identification purposes.
 * Fybrid exploits various Web technologies such as browser pluigns
 * (Silverlight and Flash), HTML5 canvas elements, and browser built-in
 * JavaScript objects to create a uniqu identifer for the browser.
 *
 * Designed and implemented by Amin Faiz Khademi
 **/

//loading MD5 encryption method
var script = document.createElement('script');
script.src = 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// loading a Flash file for collecting data
var flash_obj = document.createElement('object');

flash_obj.setAttribute('id', 'flash_data');
flash_obj.setAttribute('width', 1);
flash_obj.setAttribute('height', 1);

var isIE = (navigator.userAgent.indexOf("MSIE") !== -1); // check if the broswer is IE
if (isIE){
    // IE
    flash_obj.setAttribute('classid', 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000');

    var param = document.createElement('param');
    param.setAttribute('name', 'movie');
    param.setAttribute('value', 'http://fademi.com/fp/Files/Fybrid.swf');
    flash_obj.appendChild(param);
}else {
    flash_obj.setAttribute('data', 'http://fademi.com/fp/Files/Fybrid.swf');
    flash_obj.setAttribute('type', 'application/x-shockwave-flash');
}

param = document.createElement('param');
param.setAttribute('name', 'wmode');
param.setAttribute('value', 'gpu');
flash_obj.appendChild(param);

param = document.createElement('param');
param.setAttribute('name', 'allowscriptaccess');
param.setAttribute('value', 'always');
flash_obj.appendChild(param);

if(document.body !== null){ 
    document.body.appendChild(flash_obj); 
}

var fybridjs = function() {};

var include_flash = false;
var is_encrypt = false;

var retID = new Object(); // returning ID (fingerprint) in JSON format

function get_flash_data(){
    var ret_flash_data = [];
    var flashElem = document.getElementById("flash_data");
    var data = flashElem.get_data();
    var array_data = data.split("<n>");
    for (var i = 0; i < array_data.length; i++){
        var data_i = array_data[i];
        var loc = data_i.indexOf(":");
        var name = data_i.substr(0, loc);
        var value = data_i.substr(loc + 2, data_i.length - loc - 2);
        ret_flash_data.push(name + ":" + value); 
    }
    retID.flashData = ret_flash_data;
    
    
    if(document.body !== null){ 
        document.body.removeChild(flashElem); 
    }
    if (include_flash){
        if (is_encrypt){
            encrypt();
        }else {
            no_encrypt();
        }
    }
}

function getObjs() { // getting JavaScript objects' data
    console.log('-> js objs data added.');
    var ret_nv_data = [];
    var ret_scr_data = [];

    // properties accessible through the navigator and screen objects
    var nav_props = ['userAgent', 'doNotTrack', 'product', 'productSub', 'cookieEnabled', 'vendor', 'platform', 'onLine', 'maxTouchPoints', 'language', 'languages'];
    var scr_props = ['colorDepth', 'pixelDepth', 'width', 'height', 'bufferDepth'];

    // properties accessible through the navigator object
    for (var prop in nav_props) {
        if (typeof navigator[nav_props[prop]] !== "undefined") {
            ret_nv_data.push(nav_props[prop] + " : " + navigator[nav_props[prop]]);
        }
    }
    if (typeof navigator['javaEnabled'] !== "undefined") {
        navigator.javaEnabled() ? ret_nv_data.push('javaEnabled: true') : ret_nv_data.push('javaEnabled: false');
    }

    var isIE = (navigator.userAgent.indexOf("MSIE") !== -1); // check if the broswer is IE

    if (isIE) { // collect list of plugins for IE

    } else {
        // detail information of all plugins
        if (typeof navigator['plugins'] !== "undefined") {
            var plgs = "";
            var plg_props = ['name', 'description', 'filename'];
            for (var i = 0; i < navigator.plugins.length; i++) {
                var current_plg = "{";
                for (var prop in plg_props) {
                    if (typeof navigator.plugins[i][plg_props[prop]] !== "undefined") {
                        current_plg += (plg_props[prop] + ":" + navigator.plugins[i][plg_props[prop]]) + ",";
                    }
                }
                current_plg += "}";
                plgs += current_plg;
            }
        }
        ret_nv_data.push(plgs);
    }
    
    // detail information of all MIME types
    if (typeof navigator['mimeTypes'] !== "undefined") {
        var mimes = "";
        var mime_props = ['type', 'description', 'suffixes'];
        for (var i = 0; i < navigator.mimeTypes.length; i++) {
            var current_mime = "{";
            for (var prop in mime_props) {
                if (typeof navigator.mimeTypes[i][mime_props[prop]] !== "undefined") {
                    current_mime += (mime_props[prop] + ":" + navigator.mimeTypes[i][mime_props[prop]]) + ",";
                }
            }
            current_mime += "}";
            mimes += current_mime;
        }
    }

    ret_nv_data.push(mimes);
    
    // properties accessible through the screen object
    for (var prop in scr_props) {
        if (typeof screen[scr_props[prop]] !== "undefined") {
            ret_scr_data.push(scr_props[prop] + " : " + screen[scr_props[prop]]);
        }
    }
    
    //adding the collected data to the returning ID
    retID.navigator = ret_nv_data;
    retID.screen = ret_scr_data;
}

function getCanvas() { // getting canvas data
    console.log('-> canvas data added.');
    
    // drwaing a canvas with a pangram content and different colors and shapes
    var canvas = document.createElement('CANVAS');
    canvas.height = 200;
    canvas.width = 400;
    var cv_context = canvas.getContext('2d');
    
    cv_context.shadowColor = "rgba(0,0,0,0)";
    cv_context.strokeStyle = "rgba(0,0,0,1)";
    cv_context.lineWidth = 1;
    cv_context.lineCap = "round";
    cv_context.lineJoin = "round";
    cv_context.beginPath();
    cv_context.moveTo(216, 3);
    cv_context.lineTo(400, 3);
    cv_context.lineTo(400, 200);
    cv_context.lineTo(216, 200);
    cv_context.lineTo(216, 3);
    cv_context.closePath();
    cv_context.stroke();
    
    cv_context.shadowColor = "rgba(0,0,0,0)";
    cv_context.fillStyle = "rgba(227,232,140,1)";
    cv_context.fill();
    
    cv_context.shadowOffsetX = 15;
    cv_context.shadowOffsetY = 15;
    cv_context.shadowBlur = 0;
    cv_context.shadowColor = "rgba(0,0,0,0)";
    cv_context.strokeStyle = "rgba(0,0,0,1)";
    cv_context.lineWidth = 1;
    cv_context.lineCap = "round";
    cv_context.lineJoin = "round";
    cv_context.beginPath();
    cv_context.moveTo(199, 179);
    cv_context.bezierCurveTo(181, 142, 145, 69, 127, 32);
    cv_context.bezierCurveTo(97, 37, 36, 48, 5, 53);
    cv_context.bezierCurveTo(14, 86, 31, 151, 40, 183);
    cv_context.bezierCurveTo(52, 175, 76, 158, 88, 150);
    cv_context.lineTo(88, 150);
    cv_context.bezierCurveTo(97, 147, 116, 140, 125, 137);
    cv_context.bezierCurveTo(144, 148, 181, 169, 199, 179);
    cv_context.closePath();
    cv_context.stroke();
   
    cv_context.shadowOffsetX = 15;
    cv_context.shadowOffsetY = 15;
    cv_context.shadowBlur = 0;
    cv_context.shadowColor = "rgba(0,0,0,0)";
    cv_context.fillStyle = "rgba(252,204,204,1)";
    cv_context.fill();


    cv_context.font = 'bold 13pt Arial';
    cv_context.fillStyle = '#FE642E';
    cv_context.fillText("The quick brown fox jumps over the lazy dog!", canvas.width / 2 - 190, 18);
    cv_context.fillStyle = '#FF0040';
    cv_context.fillText("The quick brown fox jumps over the lazy dog!", canvas.width / 2 - 190, 48);
    cv_context.fillStyle = '#00BFFF';
    cv_context.fillText("The quick brown fox jumps over the lazy dog!", canvas.width / 2 - 190, 78);
    cv_context.fillStyle = '#2E2E2E';
    cv_context.fillText("fybridjs", canvas.width / 2 - 50, 108);
    cv_context.fillStyle = '#FA58F4';
    cv_context.fillText("The quick brown fox jumps over the lazy dog!", canvas.width / 2 - 190, 138);
    cv_context.fillStyle = '#B18904';
    cv_context.fillText("The quick brown fox jumps over the lazy dog!", canvas.width / 2 - 190, 168);
    cv_context.fillStyle = '#01DF74';
    cv_context.fillText("The quick brown fox jumps over the lazy dog!", canvas.width / 2 - 190, 198);
    cv_context.fillStyle = '#DF0101';

    retID.canvas = canvas.toDataURL();
}

function getFlash() { // getting flash data
    console.log('-> flash data added.'); 
}

function js_font_detection(){
    console.log('-> js fonts data added.'); 
    var fonts = ["cursive", "monospace", "serif", "sans-serif", "fantasy", "default", "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Book Antiqua", "Bookman Old Style", "Bradley Hand ITC", "Bodoni MT", "Calibri", "Century", "Century Gothic", "Casual", "Comic Sans MS", "Consolas", "Copperplate Gothic Bold", "Courier", "Courier New", "English Text MT", "Felix Titling", "Futura", "Garamond", "Geneva", "Georgia", "Gentium", "Haettenschweiler", "Helvetica", "Impact", "Jokerman", "King", "Kootenay", "Latha", "Liberation Serif", "Lucida Console", "Lalit", "Lucida Grande", "Magneto", "Mistral", "Modena", "Monotype Corsiva", "MV Boli", "OCR A Extended", "Onyx", "Palatino Linotype", "Papyrus", "Parchment", "Pericles", "Playbill", "Segoe Print", "Shruti", "Tahoma", "TeX", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Verona", "Comic Sans MS", "Arial Black", "Arial CYR", "Chiller", "Arial Narrow", "Arial Rounded MT Bold", "Baskerville Old Face", "Berlin Sans FB", "Blackadder ITC", "Lucida Console", "Symbol", "Times New Roman", "Webdings", "Agency FB", "Vijaya", "Algerian", "Arial Unicode MS", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Calibri", "Cambria", "Cambria Math", "Kartika", "MS Mincho", "MS Outlook", "MT Extra", "Segoe UI", "Aharoni", "Aparajita", "Amienne", "cursive", "Academy Engraved LET", "LCD", "LuzSans-Book", "sans-serif", "ZWAdobeF", "Eurostile", "SimSun-PUA", "Blackletter686 BT", "Myriad Web Pro Condensed", "Matisse ITC", "Bell Gothic Std Black", "David Transparent", "Adobe Caslon Pro", "AR BERKLEY", "Australian Sunrise", "Myriad Web Pro", "Gentium Basic", "Highlight LET", "Adobe Myungjo Std M", "GothicE", "HP PSG", "DejaVu Sans", "Arno Pro", "Futura Bk", "DejaVu Sans Condensed", "Euro Sign", "Neurochrome", "Bell Gothic Std Light", "Jokerman Alts LET", "Adobe Fan Heiti Std B", "Baby Kruffy", "Tubular", "Woodcut", "HGHeiseiKakugothictaiW3", "YD2002", "Tahoma Small Cap", "Helsinki", "Bickley Script", "Unicorn", "X-Files", "GENISO", "Frutiger SAIN Bd v.1", "Opus", "ZDingbats", "ABSALOM", "Vagabond", "Year supply of fairy cakes", "Myriad Condensed Web", "Segoe Media Center", "Coronet", "Helsinki Metronome", "Segoe Condensed", "Weltron Urban", "AcadEref", "DecoType Naskh", "Freehand521 BT", "Opus Chords Sans", "Enviro", "SWGamekeys MT", "Croobie", "Arial Narrow Special G1", "AVGmdBU", "Candles", "Futura Bk BT", "Andy", "QuickType", "WP Arabic Sihafa", "DigifaceWide", "ELEGANCE", "BRAZIL", "Pepita MT", "Nina", "Geneva", "OCR B MT", "Futura", "Blade Runner Movie Font", "Allegro BT", "Lucida Blackletter", "AGA Arabesque", "AdLib BT", "Clarendon", "Monotype Sorts", "Alibi", "Bremen Bd BT", "mono", "News Gothic MT", "AvantGarde Bk BT", "chs_boot", "fantasy", "Palatino", "BernhardFashion BT", "Courier New", "CloisterBlack BT", "Scriptina", "Tahoma", "BernhardMod BT", "Virtual DJ", "Nokia Smiley", "Boulder", "Andale Mono IPA", "Belwe Lt BT", "Calligrapher", "Belwe Cn BT", "Tanseek Pro Arabic", "FuturaBlack BT", "Abadi MT Condensed", "Mangal", "Chaucer", "Belwe Bd BT", "Liberation Serif", "DomCasual BT", "Bitstream Vera Sans", "URW Gothic L", "GeoSlab703 Lt BT", "Bitstream Vera Sans Mono", "Nimbus Mono L", "Heather", "Antique Olive", "Clarendon Cn BT", "Amazone BT", "Bitstream Vera Serif", "Utopia", "Americana BT", "Map Symbols", "Bitstream Charter", "Aurora Cn BT", "CG Omega", "Lohit Punjabi", "Balloon XBd BT", "Akhbar MT", "Courier 10 Pitch", "Benguiat Bk BT", "Market", "Cursor", "Bodoni Bk BT", "Letter Gothic", "Luxi Sans", "Brush455 BT", "Sydnie", "Lohit Hindi", "Lithograph", "Albertus", "DejaVu LGC Serif", "Lydian BT", "Antique Olive Compact", "KacstArt", "Incised901 Bd BT", "Clarendon Extended", "Lohit Telugu", "Incised901 Lt BT", "GiovanniITCTT", "KacstOneFixed", "Folio XBd BT", "Edda", "Loma", "Formal436 BT", "Fine Hand", "Garuda", "Impress BT", "RefSpecialty", "Sazanami Mincho", "Staccato555 BT", "VL Gothic", "Hkmer OS", "WP BoxDrawing", "Clarendon Blk BT", "Droid Sans", "CommonBullets", "Sherwood", "Helvetica", "CopprplGoth Bd BT", "Smudger Alts LET", "BPG Rioni", "CopprplGoth BT", "Guitar Pro 5", "Estrangelo TurAbdin", "Dauphin", "Arial Tur", "English111 Vivace BT", "Steamer", "OzHandicraft BT", "Arial Cyr", "Futura Lt BT", "Liberation Sans Narrow", "Futura XBlk BT", "Candy Round BTN Cond", "GoudyHandtooled BT", "GrilledCheese BTN Cn", "GoudyOlSt BT", "Galeforce BTN", "Kabel Bk BT", "Sneakerhead BTN Shadow", "OCR-A BT", "Denmark", "OCR-B 10 BT", "Swiss921 BT", "PosterBodoni BT", "Arial (Arabic)", "Serifa BT", "FlemishScript BT", "Arial", "American Typewriter", "Arial Black", "Apple Symbols", "Arial Narrow", "AppleMyungjo", "Arial Rounded MT Bold", "Zapfino", "Arial Unicode MS", "BlairMdITC TT-Medium", "Century Gothic", "Cracked", "Papyrus", "KufiStandardGK", "Plantagenet Cherokee", "Courier", "Helvetica", "Baskerville Old Face", "Apple Casual", "Type Embellishments One LET", "Bookshelf Symbol 7", "Abadi MT Condensed Extra Bold", "Calibri", "Calibri Bold", "Calisto MT", "Chalkduster", "Cambria", "Franklin Gothic Book Italic", "Century", "Geneva CY", "Franklin Gothic Book", "Helvetica Light", "Gill Sans MT", "Academy Engraved LET", "MT Extra", "Bank Gothic", "Eurostile", "Bodoni SvtyTwo SC ITC TT-Book", "Tekton Pro", "Courier CE", "Maestro", "BO Futura BoldOblique", "Lucida Bright Demibold", "New", "AGaramond", "Charcoal", "DIN-Black", "Lucida Sans Demibold", "Stone Sans OS ITC TT-Bold", "AGaramond Italic", "Bickham Script Pro Regular", "Adobe Arabic Bold", "AGaramond Semibold", "Al Bayan Bold", "Doremi", "AGaramond SemiboldItalic", "Arno Pro Bold", "Casual", "B Futura Bold", "Frutiger 47LightCn", "Gadget", "HelveticaNeueLT Std Bold", "Frutiger 57Cn", "DejaVu Serif Italic Condensed", "Myriad Pro Black It", "Frutiger 67BoldCn", "Gentium Basic Bold", "Sand", "GillSans", "H Futura Heavy", "Liberation Mono Bold", "GillSans Bold", "Cambria Math", "Courier Final Draft", "HelveticaNeue BlackCond", "cursive", "Techno", "HelveticaNeue BlackCondObl", "Gabriola", "JazzText Extended", "HelveticaNeue BlackExt", "sans-serif", "Textile", "HelveticaNeue BlackExtObl fantasy", "HelveticaNeue BoldCond", "Palatino Linotype Bold", "HelveticaNeue BoldCondObl", "BIRTH OF A HERO", "HelveticaNeue BoldExt", "Bleeding Cowboys", "HelveticaNeue BoldExtObl", "ChopinScript", "HelveticaNeue ExtBlackCond", "LCD", "HelveticaNeue ExtBlackCondObl", "Myriad Web Pro Condensed", "HelveticaNeue HeavyCond", "Scriptina", "HelveticaNeue HeavyCondObl", "OpenSymbol", "HelveticaNeue HeavyExt", "Virtual DJ", "HelveticaNeue HeavyExtObl", "Guitar Pro 5", "HelveticaNeue LightCondObl", "Nueva Std", "HelveticaNeue ThinCond", "Chicago", "HelveticaNeue ThinCondObl", "Nueva Std Bold", "Brush Script MT", "Capitals", "Myriad Web Pro", "Avant Garde", "B Avant Garde Demi", "Nueva Std Bold Italic", "BI Avant Garde DemiOblique", "MaestroTimes", "Univers BoldExtObl", "APC Courier", "Myriad Web Pro Bold", "Liberation Serif", "Myriad Pro Light", "Carta", "DIN-Bold", "DIN-Light", "Myriad Web Pro Condensed Italic", "DIN-Medium", "Tekton Pro Oblique", "DIN-Regular", "AScore", "HelveticaNeue UltraLigCondObl", "Opus", "HelveticaNeue UltraLigExt", "Myriad Pro Light It", "HelveticaNeue UltraLigExtObl", "Opus Chords Sans", "HO Futura HeavyOblique", "Opus Japanese Chords", "L Frutiger Light", "VT100", "L Futura Light", "Helsinki", "LO Futura LightOblique", "Helsinki Metronome", "Myriad Pro Black", "New York", "O Futura BookOblique", "R Frutiger Roman", "Reprise", "TradeGothic", "Warnock Pro Bold Caption", "Univers 45 Light", "Warnock Pro", "XBO Futura ExtraBoldOblique", "Univers 45 LightOblique", "Liberation Mono", "Univers 55 Oblique", "UC LCD", "Univers 57 Condensed", "Warnock Pro Bold", "Univers ExtraBlack", "Warnock Pro Light Ital Subhead", "Univers LightUltraCondensed", "Matrix Ticker", "Univers UltraCondensed", "Fang Song"];
    var available_fonts = [];
    
    //default fonts
    var default_fonts = ['serif', 'sans-serif', 'monospace'];
    
    // a pangram
    var test_str = "The quick brown fox jumps over the lazy dog!";

    // a fixed size
    var size = '72px';

    var body = document.getElementsByTagName("body")[0];

    var default_widths = {};
    var default_heights = {};
    var test_span = document.createElement("span");

    test_span.style.fontSize = size;
    test_span.innerHTML = test_str;

    body.appendChild(test_span);
    
    // recording the offset (width and height) properties for the default fonts
    for (var font in default_fonts) {
        test_span.style.fontFamily = default_fonts[font];
        default_widths[default_fonts[font]] = test_span.offsetWidth;
        default_heights[default_fonts[font]] = test_span.offsetHeight;
    }
    
    // checking for the presence of the fonts in the **fonts** array
    for (var i = 0; i < fonts.length; i++){
        var available = false;
        for (var font in default_fonts) {
            test_span.style.fontFamily = fonts[i] + ',' + default_fonts[font]; // using the fallback system of fontfamily
            var new_width = test_span.offsetWidth; // new width
            var new_height = test_span.offsetHeight; // new height
            // check if the font is available
            var is_available = (new_width !== default_widths[default_fonts[font]] || new_height !== default_heights[default_fonts[font]]);
            available = available || is_available;
        }
        if (available){
            available_fonts.push(fonts[i]);
        }
    }
    body.removeChild(test_span);
    retID.jsfont = available_fonts;
}


function encrypt() { // applying encryption
    var fingerprint = "";
    if (include_flash){
        if (arguments.callee.caller.name === "get_flash_data"){
            for (var prop in retID) {
                fingerprint += (prop + "->" + retID[prop]);
            }
            var hash_fingerprint = CryptoJS.MD5(fingerprint);
            retID.fingerprint = hash_fingerprint.toString();
            var send_fingerprint = new CustomEvent("fingerprint_is_ready", {
                detail: {
                    id: retID.fingerprint
                },
                    cancelable: false
            });
            document.dispatchEvent(send_fingerprint);
        }
    }else {
        for (var prop in retID) {
            if (prop!== 'flashData'){
                fingerprint += (prop + "->" + retID[prop]);
            }
        }
        var hash_fingerprint = CryptoJS.MD5(fingerprint);
        retID.fingerprint = hash_fingerprint.toString();
        var send_fingerprint = new CustomEvent("fingerprint_is_ready", {
            detail: {
                id: retID.fingerprint
            },
                cancelable: false
        });
        document.dispatchEvent(send_fingerprint);
    }
}


function no_encrypt() { // applying encryption
    var fingerprint = "";
    if (include_flash){
        if (arguments.callee.caller.name === "get_flash_data"){
                for (var prop in retID) {
                    fingerprint += (prop + "->" + retID[prop]);
                }
                retID.fingerprint = fingerprint;
                var send_fingerprint = new CustomEvent("fingerprint_is_ready", {
                    detail: {
                        id: retID.fingerprint
                    },
                        cancelable: false
                });
                document.dispatchEvent(send_fingerprint);
        }
    }else {
        for (var prop in retID) {
            if (prop!== 'flashData'){
                fingerprint += (prop + "->" + retID[prop]);
            }
        }
        retID.fingerprint = fingerprint;
        var send_fingerprint = new CustomEvent("fingerprint_is_ready", {
            detail: {
                id: retID.fingerprint
            },
                cancelable: false
        });
        document.dispatchEvent(send_fingerprint);
    }
}


fybridjs.prototype.setID = function() { // getting browser ID
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    if (arguments.length === 0) {
        retID.jsdata = getObjs(); // only use JS objects
    } else {
        is_encrypt = (args.indexOf('encrypt') + 1) > 0;
        include_flash = (args.indexOf('flash') + 1) > 0;
        args.indexOf("jsobj") + 1 ? getObjs() : console.log('no jsobj'); // adding JavaScript objects' data to the ID
        args.indexOf('canvas') + 1 ? getCanvas() : console.log('no canvas'); // adding canva data to the ID
        args.indexOf('flash') + 1 ? getFlash() : console.log('no flash'); // adding flash data to the ID
        args.indexOf('jsfonts') + 1 ? js_font_detection() : console.log('no jsfonts'); // counting fonts that are discovered using JavaScript
        args.indexOf('encrypt') + 1 ? encrypt() : no_encrypt(); // applying an encryption method on the generated ID
    }
    //console.log(retID);
};
