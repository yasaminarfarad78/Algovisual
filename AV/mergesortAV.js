/*global alert: true, ODSA */
$(document).ready(function() {
  "use strict";
  var av,     // برای فراخوانی آبجکت (شی) های کتابخانه JSAV
      arr;    // برای فراخوانی آبجکت (شی) های کار بر روی آرایه از کتابخانه JSAV

 // بارگذاری آبجکت (شی) پیکربندی و به وسیله آن فراخوانی مفسر و آبجکت (شی) ساخت شبه کد از کتابخانه odsaUtils.js
  var config = ODSA.UTILS.loadConfig(),
      interpret = config.interpreter,       // فراخوانی مفسر
      settings = config.getSettings();      // آبجکت (شی) تنظیمات برای تصویرسازی
	// متن نمایش داده شده در کادر وارد کردن مقدارهای آرایه
  $("#arrayValues").attr("placeholder", interpret("av_arrValsPlaceholder"));

  // در مرتب سازی ادغامی برخلاف دیگر مرتب سازی ها، برای نمایش آرایه نمی توان از 
  //نمایش به صورت میله ای استفاده کرد چون فضای بیشتری را اشغال می کند.
  

  // مقداردهی لیست کشویی برای انتخاب اندازه آرایه
  ODSA.AV.initArraySize(5, 20, 8);

  // تابع خروجی دکمه اجرا
  function runIt() {
    var arrValues = ODSA.AV.processArrayValues();

    // اگر مقدار خانه های آرایه خالی بود پس نیاز است تصحیح شود.
    if (arrValues) {
      ODSA.AV.reset(true);
      av = new JSAV($(".avcontainer"), {settings: settings});
      // ساخت یک آرایه جدید بر اساس انتخاب های کاربر
      arr = av.ds.array(arrValues, {indexed: true});
      av.displayInit();

      //شروع پیاده سازی مرتب سازی ادغامی
      var level = 1;
      var column = 1;
      av.umsg(interpret("av_c1"));
      mergesort(arr, level, column);
      // پایان پیاده سازی مرتب سازی ادغامی

      av.umsg(interpret("av_c2"));

	  // StartStop Button
	    var timesClicked = 0;
		 $("#StartStopbtn").click(function(e) {
		timesClicked++;

		if (timesClicked%2==0) {
			
		clearInterval($("#forwardbtn").data('interval'));
		document.getElementById("startstopbtnicon").classList.add('fa-play');

		document.getElementById("startstopbtnicon").classList.remove('fa-pause');
		} 
		else {
			
			 $("#forwardbtn").data('interval', setInterval(function forwardbtn(){ $("#forwardbtn").click();}, 1000));
			document.getElementById("startstopbtnicon").classList.add('fa-pause');

			document.getElementById("startstopbtnicon").classList.remove('fa-play');
		}
		})
	// StartStop Button end	
			  
      av.recorded(); // علامت گذاری به عنوان پایان تصویرسازی
    }
  }

  // فضای مورد نیاز برای نمایش هر سطر
  var canvasWidth = $("#container").width();
  var rowHeight = 75;
  var blockWidth = 32;

  /**
   * بصورت بازگشتی آرایه ورودی را تقسیم می کند تا زمانی که آرایه های تک عنصر بدست آید ،
   * سپس آرایه ها به صورت مرتب شده با هم ادغام می شوند
   *
   * arr - a JSAV array
   * level -  عمق فعلی در بازگشت
   * column - شماره ستون آرایه فعلی
   */
  function mergesort(arr, level, column) {
    // قراردادن آرایه درموقعیت صحیح
    setPosition(arr, level, column);

    var arrLen = arr.size();
    var returnArr = arr;

    arr.highlight();
    if (arrLen === 1) {    // حالت پایه
      av.umsg(interpret("av_c3"));
      av.step();
      arr.unhighlight();
    } else if (arrLen > 1) { //حالت کلی بازگشت
      av.step();
      av.umsg(interpret("av_c4"));
      arr.unhighlight();

      // وسط آرایه را \یدا میکنیم،
      // اگر ممکن نبود آرایه را به صورت مساوی تقسیم کنیم آرایه اول را بزرگتردر نظر می گیریم.
      var midPoint = Math.ceil(arrLen / 2);

      // ایجاد کردن و نمایش زیرآرایه
      var subArr1 = arr.slice(0, midPoint);
      var avSubArr1 = av.ds.array(subArr1, {indexed: true, center: false});
      var subArr2 = arr.slice(midPoint, arrLen);
      var avSubArr2 = av.ds.array(subArr2, {indexed: true, center: false});

      av.step();

      // انجام عمل  بازگشتی بر هر دو زیرآرایه
      av.umsg(interpret("av_c5"));
      var childArr1Col = column * 2 - 1;
      var retArr1 = mergesort(avSubArr1, level + 1, childArr1Col);

      av.umsg(interpret("av_c6"));
      var childArr2Col = column * 2;
      var retArr2 = mergesort(avSubArr2, level + 1, childArr2Col);

      returnArr = merge(arr, retArr1, retArr2);
    }
    return returnArr;
  }

  /**
   * ادغام کردن رو آرایه یه صورت مرتب شده
   *
   * origArr - آرایه اولیه که آرایه مرتب شده به جای آن نوشته می شود
   * arr1 - اولین آرایه ای که ادغام می شود.
   * arr2 - دومین آرایه ای که ادغام می شود.
   */
  function merge(origArr, arr1, arr2) {
    av.umsg(interpret("av_c7"));
    // پاک کردن مقدارهای آرایه اولیه 
    for (var i = 0; i < origArr.size(); i++) {
      origArr.value(i, "");
    }

    arr1.highlight();
    arr2.highlight();
    av.step();

    if (arr1.size() > 1) {
      arr1.unhighlight();
      arr2.unhighlight();
    }

    var pos1 = 0;
    var pos2 = 0;
    var index = 0;

    // ادغام دو آرایه با هم به صورت مرتب شده.
    while (pos1 < arr1.size() || pos2 < arr2.size()) {
      if (pos1 === arr1.size() || pos2 === arr2.size()) {
        av.umsg(interpret("av_c8"));
      } else {
        // حذف انجام یک مرحله برای آرایه تک مقداری تا زمان کم تری صرف شود.
        if (arr1.size() > 1) {
          if (pos1 < arr1.size()) {
            arr1.highlight(pos1);
          }
          if (pos2 < arr2.size()) {
            arr2.highlight(pos2);
          }
          av.umsg(interpret("av_c9"));
          av.step();
        }
        av.umsg(interpret("av_c10"));
      }

      if (pos1 < arr1.size() &&
          (arr1.value(pos1) <= arr2.value(pos2) || pos2 === arr2.size())) {
        arr1.unhighlight(pos1).highlightBlue(pos1);
        av.step();

        origArr.value(index, arr1.value(pos1));
        // پاک کردن مقدارها از آرایه فعلی.
        arr1.value(pos1, "");
        arr1.unhighlightBlue(pos1);
        pos1++;
      } else {
        arr2.unhighlight(pos2).highlightBlue(pos2);
        av.step();

        origArr.value(index, arr2.value(pos2));
         // پاک کردن مقدارها از آرایه فعلی.
        arr2.value(pos2, "");
        arr2.unhighlightBlue(pos2);
        pos2++;
      }

      origArr.highlightBlue(index);
      av.umsg(interpret("av_c11"));
      av.step();

      origArr.unhighlightBlue(index).markSorted(index);
      index++;
    }

    av.umsg(interpret("av_c12"));
    arr1.hide();
    arr2.hide();
    av.step();

    av.clearumsg();
    return origArr;
  }

  /**
   *محاسبه و تعیین مقدار مناسب برای خصوصیات ظاهری 'بالا' و 'چپ' بر اساس 
   *عمق یا سطح بازگشت آرایه مشخص شده، شماره ستون و تعداد المان های موجود در آرایه
   * top = بالا
   * left = چپ
   * مقدار خصوصیت چپ و بالا برای نمایش فاصله المان(در اینجا آرایه) از بالا و چپ در صفحه وب که به کاربر نمایش داده می شود. 
   *
   * arr - آرایه ای که برای  آن مقدار خصوصیت بالا و پایین تعیین می شود
   * level - سطح یا عمق بازگشت، به عنوان مثال آرایه کامل سطح آن 1 می باشد.
   * column - شماره ستون آرایه ها در ردیف فعلی
   */
  function setPosition(arr, level, column) {
    // محاسبه تعداد آرایه های موجود در ردیف فعلی
    var numArrInRow = Math.pow(2, level - 1);

	//محاسبه مقدار خصوصیت "چپ" آرایه فعلی با تقسیم کردن 


    var left = (canvasWidth / (2 * numArrInRow)) * (2 * column - 1) -
               (blockWidth * arr.size() / 2);
    var top = rowHeight * (level - 1);

    // مقدار دهی خصوصیت چپ و بالا برای نمایش صحیح مکان آرایه در صفحه وب سایت
    arr.element.css({left: left, top: top});
  }

  // اتصال توابع به المان های html
  $("#run").click(runIt);
  $("#ssperform").submit(function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    runIt();
  });
  $("#reset").click(ODSA.AV.reset);
});
