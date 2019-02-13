'use scrict';

// configurations
var conf = {
    production: false,
};
/**
* addLog - adds an entry to the console
* @param {string} strName
* @param {object} objValue
* @param {boolean} error
*/
function addLog(strName, objValue, error) {
    var newStrName = error ? '*** ERROR *** ' + strName : ' ' + strName;
    if (!conf.production) {
        if (objValue) console.log(new Date().toLocaleTimeString() + newStrName + objValue);
        else console.log(new Date().toLocaleTimeString() + newStrName);
    }
}

function init() {
    // init
    var inputItems = [
        '#input-cont-w',
        '#input-cont-h',
        '#input-el-w',
        '#input-el-h',
        '#input-el-t',
        '#input-el-l',
    ];

    $(inputItems.join(',')).on('input', function fn() {
        var el = $(this).attr('data-el');
        var type = $(this).attr('data-type');
        var val = $(this).val();
        addLog('input: ', [el, type, val]);
        $(el).css(type, val);
    });

    var $input = $(inputItems.join(','));
    $(document).on('keydown', function onKeyDown(e) {
        if (e.which === 38 || e.which === 104) $input.val((parseInt($input.val()) + 1));
        else if (e.which === 40 || e.which === 98) $input.val((parseInt($input.val()) - 1));
    });
}

$(document).ready(init);
