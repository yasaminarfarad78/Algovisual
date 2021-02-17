/*global alert: true, ODSA */
$(document).ready(function() {
  "use strict";
  var av,     // برای فراخوانی آبجکت (شی) های کتابخانه JSAV
      arr,    // برای فراخوانی آبجکت (شی) های کار بر روی آرایه از کتابخانه JSAV
      pseudo; // برای نمایش شبه کد

  // بارگذاری آبجکت (شی) پیکربندی و به وسیله آن فراخوانی مفسر و آبجکت (شی) ساخت شبه کد از کتابخانه odsaUtils.js
  var config = ODSA.UTILS.loadConfig(),
      interpret = config.interpreter,       // فراخوانی مفسر
      code = config.code,                   // فراخوانی آبجکت (شی) شبه کد
      settings = config.getSettings();      // آبجکت (شی) تنظیمات برای تصویرسازی

  // اضافه کردن تنظیمات دلخواه 
  var arrayLayout =
      settings.add("layout",
                   {type: "select", options: {bar: "Bar", array: "Array"},
                     label: "Array layout: ", value: "bar"});

  // مقداردهی لیست کشویی برای انتخاب اندازه آرایه
  ODSA.AV.initArraySize(5, 16, 8);
 
  // Bubble Sort
  function bubblesort() {
    var i, j;
    av.umsg(interpret("av_c1"));
    pseudo.setCurrentLine("sig");
    av.step();
    for (i = 0; i < arr.size() - 1; i++) {
      av.umsg(interpret("av_c2") + i);
      pseudo.setCurrentLine("outloop");
      av.step();
      av.umsg(interpret("av_c3"));
      pseudo.setCurrentLine("inloop");
      av.step();
      arr.addClass(0, "processing");
      for (j = 1; j < arr.size() - i; j++) {
        arr.addClass(j, "processing");
        av.umsg(interpret("av_c4"));
        pseudo.setCurrentLine("compare");
        av.step();
        if (arr.value(j - 1) > arr.value(j)) {
          av.umsg(interpret("av_c5"));
          pseudo.setCurrentLine("swap");
          arr.swap(j - 1, j);
          av.step();
        }
        arr.removeClass(j - 1, "processing");
      }
      arr.removeClass(j - 1, "processing");
      arr.highlight(j - 1);
      av.umsg(interpret("av_c6"));
      av.step();
    }
    av.umsg(interpret("av_c7"));
    arr.unhighlight(true);
    pseudo.setCurrentLine("end");
    av.step();
  }

  // تابع خروجی دکمه اجرا
  function runIt() {
    var arrValues = ODSA.AV.processArrayValues();
    // اگر مقدار خانه های آرایه خالی بود پس نیاز هست مقدار دهی بشود
    if (arrValues) {
      ODSA.AV.reset(true);
      av = new JSAV($(".avcontainer"), {settings: settings});

      // ساخت یک آرایه جدید بر اساس انتخاب های کاربر
      arr = av.ds.array(arrValues, {indexed: true, layout: arrayLayout.val()});
      // ساخت آبجکت (شی) برای نمایش شبه کد
	  pseudo = av.code(code);
      av.umsg("شروع مرتب سازی حبابی");
      av.displayInit();
      bubblesort();
	  // دکمه ادامه/متوقف
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

  // اتصال تابع ها به اجزا Html
  $("#run").click(runIt);
  $("#reset").click(ODSA.AV.reset);

  // متن نمایش داده شده در کادروارد کردن مقدارهای آرایه
  $("#arrayValues").attr("placeholder", interpret("av_arrValsPlaceholder"));
});
