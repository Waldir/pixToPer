'use scrict';

// configurations
var production = false;
var acks = ['Its Yours!', 'Thank you!', 'Have it!', 'Ka-ching!', 'Boom!'];

function addLog(strName, objValue, error) {
    var newStrName = error ? '*** ERROR *** ' + strName : ' ' + strName;
    if (!production) {
        if (objValue) console.log(new Date().toLocaleTimeString() + newStrName + objValue);
        else console.log(new Date().toLocaleTimeString() + newStrName);
    }
}

function decimalPlace(num, places) {
    return (num).toFixed(places).replace(/\.0+$/, '');
}

function copyToClip() {
    var toCopy = $('#codeToCopy').text();
    var $temp = $('<textarea/>', { id: 'tempInput' });
    $('body').append($temp);
    $('#tempInput').val(toCopy).select();
    document.execCommand('copy');
    $('#tempInput').remove();
    return false;
}

function getRandFromArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
        '#inc-w',
        '#inc-h',
        '#inc-t',
        '#inc-l',
        '#inc-r',
        '#inc-b',
        '#inc-d',
    ];

    var $boxElement = $('#myBox__element');
    var $boxContainer = $('#myBox__container');
    var $outputCode = $('#outputCode pre code, #hiddenTextarea');
    var $copyBtn = $('#copyToClipBtn');
    // prevent too many decimals
    $('#inc-d').on('keydown', function fn(e) {
        var code = e.keyCode || e.which;
        if (this.value.length === 2 && code !== 38 && code !== 40 && code !== 8) {
            e.preventDefault();
            return false;
        }
    });
    // listen for pasting
    $('#input-el-w').on('paste', function fn(e) {
        var pasted = e.originalEvent.clipboardData.getData('text');
        pasted = pasted.trim();
        pasted = pasted.replace(/\s/g, '');
        pasted = pasted.split(',');
        $('#input-el-t').val(pasted[0]);
        $('#input-el-l').val(pasted[1]);
        $('#input-el-w').val(pasted[2]);
        $('#input-el-h').val(pasted[3]).trigger('input');
        return false; // return flse to avoid pasting
    });
    // rotate container
    $('#rotateCont').on('click', function fn() {
        var input1 = $('#input-cont-w').val();
        var input2 = $('#input-cont-h').val();
        $('#input-cont-w').val(input2);
        $('#input-cont-h').val(input1).trigger('input');
    });
    $(inputItems.join(',')).on('input', function fn() {
        // include inputs
        var iW = $('#inc-w').prop('checked');
        var iH = $('#inc-h').prop('checked');
        var iT = $('#inc-t').prop('checked');
        var iL = $('#inc-l').prop('checked');
        var iR = $('#inc-r').prop('checked');
        var iB = $('#inc-b').prop('checked');
        var iD = $('#inc-d').val();
        // container inputs
        var cW = $('#input-cont-w').val();
        var cH = $('#input-cont-h').val();
        // aspect ratio
        var aRatio = (cH / cW) * 100 + '%';
        // element inputs
        var eW = $('#input-el-w').val();
        var eH = $('#input-el-h').val();
        var eT = $('#input-el-t').val();
        var eL = $('#input-el-l').val();
        var eR = cW - eL - eW;
        var eB = cH - eT - eH;
        var pixToPer = {
            w: (eW / cW) * 100,
            h: (eH / cH) * 100,
            t: (eT / cH) * 100,
            b: (eB / cH) * 100,
            l: (eL / cW) * 100,
            r: (eR / cW) * 100,
        };
        var output = '';
        output += '#container{\n';
        output += '  position: relative;\n';
        output += '  width: ' + cW + 'px;\n';
        output += '  height: ' + cH + 'px;\n';
        output += '}\n\n';
        output += '#element{\n';
        output += '  position: absolute;\n';
        output += iW ? '  width: ' + decimalPlace(pixToPer.w, iD) + '%;\n' : '';
        output += iH ? '  height: ' + decimalPlace(pixToPer.h, iD) + '%;\n' : '';
        output += iT ? '  top: ' + decimalPlace(pixToPer.t, iD) + '%;\n' : '';
        output += iL ? '  left: ' + decimalPlace(pixToPer.l, iD) + '%;\n' : '';
        output += iR ? '  right: ' + decimalPlace(pixToPer.r, iD) + '%;\n' : '';
        output += iB ? '  bottom: ' + decimalPlace(pixToPer.b, iD) + '%;\n' : '';
        output += '}';
        // set the element
        var jqueryGo = function fn() {
            $boxElement.css({
                width: decimalPlace(pixToPer.w, iD) + '%',
                height: decimalPlace(pixToPer.h, iD) + '%',
                top: decimalPlace(pixToPer.t, iD) + '%',
                left: decimalPlace(pixToPer.l, iD) + '%',
                right: decimalPlace(pixToPer.r, iD) + '%',
                bottom: decimalPlace(pixToPer.b, iD) + '%',
            });
            // set the container
            $boxContainer.css('padding-top', aRatio);
        };
        // output
        $outputCode.html(output);
        // fire after some time
        setTimeout(jqueryGo, 900);
        // show copy btn
        if (!$copyBtn.hasClass('on')) $copyBtn.addClass('on');
    });

    $('#copyToClipBtn').on('click', function fn() {
        copyToClip();
        $(this).coin('coin', getRandFromArr(acks), '65px');
    });
    // trigger for the first time
    $('#input-el-h').trigger('input');
    // info btn
    $('#infoBtn').on('click', function fn() {
        $('.modal').css('display', 'block');
        $('body').css('overflow', 'hidden');
        setTimeout(function fn() { $('.modal, .modal__dialog').addClass('on'); }, 300);
    });
    // modal
    $('.modal, .closeBtn').on('click', function fn(e) {
        if (e.target === this) {
            $('.modal__dialog').removeClass('on');
            $('body').css('overflow', '');
            setTimeout(function fn() { $('.modal').removeClass('on'); }, 300);
            setTimeout(function fn() { $('.modal').css('display', 'none'); }, 600);
        }
    });
}

$(document).ready(init);
