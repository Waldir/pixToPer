'use strict';

// elements
var $boxElement = $('#myBox__element');
var $boxContainer = $('#myBox__container');
var $outputCode = $('#outputCode pre code, #hiddenTextarea');
var $copyBtn = $('#copyToClipBtn');
var $cookieBtn = $('#cookieBtn');
var $elemWidth = $('#input-el-w');
var $elemTop = $('#input-el-t');
var $elemLeft = $('#input-el-l');
var $elemHeight = $('#input-el-h');
var $contWidth = $('#input-cont-w');
var $contHeight = $('#input-cont-h');
var $incWidth = $('#inc-w');
var $incHeight = $('#inc-h');
var $incTop = $('#inc-t');
var $incLeft = $('#inc-l');
var $incRight = $('#inc-r');
var $incBottom = $('#inc-b');
var $incDec = $('#inc-d');

function addLog(strName, objValue, error) {
  var newStrName = error ? '*** ERROR *** ' + strName : ' ' + strName;
  if (objValue) console.log(new Date().toLocaleTimeString() + newStrName, objValue);
  else console.log(new Date().toLocaleTimeString() + newStrName);
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  setCookie(name, '', -1);
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
  var cookie = getCookie('pTpPref');
  if (cookie) {
    cookie = cookie.split(',');
    $incWidth.prop('checked', cookie[0] === 'true');
    $incHeight.prop('checked', cookie[1] === 'true');
    $incTop.prop('checked', cookie[2] === 'true');
    $incLeft.prop('checked', cookie[3] === 'true');
    $incRight.prop('checked', cookie[4] === 'true');
    $incBottom.prop('checked', cookie[5] === 'true');
    $incDec.val(cookie[6]);
    $contWidth.val(cookie[7]);
    $contHeight.val(cookie[8]);
  } else {
    $cookieBtn.hide();
  }
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

  // listen for pasting
  $elemWidth.on('paste', function fn(e) {
    var pasted = e.originalEvent.clipboardData.getData('text');
    pasted = pasted.trim();
    pasted = pasted.replace(/\s/g, '');
    pasted = pasted.split(',');
    $elemTop.val(pasted[0]);
    $elemLeft.val(pasted[1]);
    $elemWidth.val(pasted[2]);
    $elemHeight.val(pasted[3]).trigger('input');
    return false; // return false to avoid pasting
  });
  // rotate container
  $('#rotateCont').on('click', function fn() {
    var input1 = $contWidth.val();
    var input2 = $contHeight.val();
    $contWidth.val(input2);
    $contHeight.val(input1).trigger('input');
  });
  $(inputItems.join(',')).on('input', function fn() {
    // include inputs
    var iW = $incWidth.prop('checked');
    var iH = $incHeight.prop('checked');
    var iT = $incTop.prop('checked');
    var iL = $incLeft.prop('checked');
    var iR = $incRight.prop('checked');
    var iB = $incBottom.prop('checked');
    var iD = $incDec.val();
    // container inputs
    var cW = $contWidth.val();
    var cH = $contHeight.val();
    // aspect ratio
    var aRatio = (cH / cW) * 100 + '%';
    // element inputs
    var eW = $elemWidth.val();
    var eH = $elemHeight.val();
    var eT = $elemTop.val();
    var eL = $elemLeft.val();
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
        width: iW ? decimalPlace(pixToPer.w, iD) + '%' : '',
        height: iH ? decimalPlace(pixToPer.h, iD) + '%' : '',
        top: iT ? decimalPlace(pixToPer.t, iD) + '%' : '',
        left: iL ? decimalPlace(pixToPer.l, iD) + '%' : '',
        right: iR ? decimalPlace(pixToPer.r, iD) + '%' : '',
        bottom: iB ? decimalPlace(pixToPer.b, iD) + '%' : '',
      });
      // set the container
      $boxContainer.css('padding-top', aRatio);
    };
    // set cookies
    setCookie('pTpPref', [iW, iH, iT, iL, iR, iB, iD, cW, cH], 10);
    // output
    $outputCode.html(output);
    addLog('Output');
    // fire after some time
    setTimeout(jqueryGo, 900);
    // show copy btn
    if (!$copyBtn.hasClass('on')) $copyBtn.addClass('on');
  });
  // copy btn pressed
  $copyBtn.on('click', function fn() {
    copyToClip();
    $(this).coin('coin', getRandFromArr(['Its Yours!', 'Thank you!', 'Have it!', 'Ka-ching!', 'Boom!']), '65px');
  });
  // erase cookies
  $cookieBtn.on('click', function fn() {
    eraseCookie('pTpPref');
    $(this).coin('coin', ['Cookies gone!'], '65px');
  });
  // trigger for the first time
  $elemHeight.trigger('input');
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
