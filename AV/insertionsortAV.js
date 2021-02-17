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
  
  // Insertion Sort
  function inssort() {
    var i, j;
    av.umsg(interpret("av_c3"));
    pseudo.setCurrentLine("sig");
    arr.highlight([0]);
    arr.addClass(1, "processing");
    arr.addClass(1, "whitetext");
    av.step();
    for (i = 1; i < arr.size(); i++) { // وارد کردن iمین مقدار
      arr.addClass(i, "processing");
      arr.addClass(i, "whitetext");
      av.umsg(interpret("av_c4") + i);
      pseudo.setCurrentLine("outloop");
      av.step();
      av.umsg(interpret("av_c5"));
      pseudo.setCurrentLine("inloop");
      av.step();
      for (j = i; (j > 0) && (arr.value(j) < arr.value(j - 1)); j--) {
        arr.addClass(j, "processing");
        arr.addClass(j, "whitetext");
        arr.swap(j, j - 1); // جا به جایی دو اندیس از آرایه
        arr.highlight(j).unhighlight(j - 1); 
        arr.removeClass(j, "processing");
        arr.removeClass(j, "whitetext");
        arr.addClass(j - 1, "processing");
        arr.addClass(j - 1, "whitetext");
        av.umsg(interpret("av_c6"));
        pseudo.setCurrentLine("swap");
        av.step();
      }
      arr.highlight(j);
    }
    pseudo.setCurrentLine("end");
    av.umsg(interpret("av_c2"));
  }

  // تابع خروجی دکمه اجرا
  function runIt() {
    var arrValues = ODSA.AV.processArrayValues();

    // اگر مقدار خانه های آرایه خالی بود پس نیاز است تصحیح شود.
    if (arrValues) {
      ODSA.AV.reset(true);
      av = new JSAV($(".avcontainer"), {settings: settings});

      // ساخت یک آرایه جدید بر اساس انتخاب های کاربر
      arr = av.ds.array(arrValues, {indexed: true, layout: arrayLayout.val()});

      // ساخت آبجکت (شی) برای نمایش شبه کد
      pseudo = av.code(code);
      av.umsg(interpret("av_c1"));
      av.displayInit();
      inssort();
      arr.unhighlight();
      arr.removeClass(true, "processing");
      arr.removeClass(true, "whitetext");
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

  // اتصال تابع ها به اجزا Html
  $("#run").click(runIt);
  $("#ssperform").submit(function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    runIt();
  });
  $("#reset").click(ODSA.AV.reset);
});
    // متن نمایش داده شده در کادر وارد کردن مقدارهای آرایه
  $("#arrayValues").attr("placeholder", interpret("av_arrValsPlaceholder"));