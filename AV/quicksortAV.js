/*global alert: true, ODSA, console */
$(document).ready(function() {
  "use strict";
  var av;   // برای فراخوانی آبجکت (شی) های کتابخانه JSAV

  // بارگذاری آبجکت (شی) پیکربندی و به وسیله آن فراخوانی مفسر و آبجکت (شی) ساخت شبه کد از کتابخانه odsaUtils.js
  var config = ODSA.UTILS.loadConfig(),
      interpret = config.interpreter,       // فراخوانی مفسر
      settings = config.getSettings();      // آبجکت (شی) تنظیمات برای تصویرسازی

  // متن نمایش داده شده در کادر وارد کردن مقدارهای آرایه
  $("#arrayValues").attr("placeholder", interpret("av_arrValsPlaceholder"));

  // add the array layout setting preference
  var arrayLayout = settings.add("layout", {type: "select",
    options: {bar: "Bar", array: "Array"},
    label: "Array layout: ", value: "array"});

  // مقداردهی لیست کشویی برای انتخاب اندازه آرایه
  ODSA.AV.initArraySize(5, 12, 8);

  // تابع خروجی دکمه اجرا
  function runIt() {
    var arrValues = ODSA.AV.processArrayValues();

    // اگر مقدار خانه های آرایه خالی بود پس نیاز است تصحیح شود. to fix
    if (arrValues) {
      ODSA.AV.reset(true);
      av = new JSAV($(".avcontainer"), {settings: settings});

      // ساخت یک آرایه جدید بر اساس انتخاب های کاربر
      var arr = av.ds.array(arrValues, {indexed: true, layout: arrayLayout.val()});
      av.umsg(interpret("av_c18"));
      av.displayInit();

      quicksort(arr, 0, arr.size() - 1);

      av.umsg(interpret("av_c1"));

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

  function quicksort(arr, left, right) {
    av.umsg(interpret("av_c2"));

    var pivotIndex = Math.floor((left + right) / 2);
    arr.addClass(pivotIndex, "processing");
    av.step();

    av.umsg(interpret("av_c3"));
    arr.swapWithStyle(pivotIndex, right);
    av.step();

    av.umsg(interpret("av_c4"));
    arr.setLeftArrow(left);
    arr.setRightArrow(right - 1);
    av.step();
    // finalPivotIndex مکان پایانی عنصور محوری خواهد بود.
    var finalPivotIndex = partition(arr, left, right - 1, arr.value(right));

    av.umsg(interpret("av_c5"));
    av.step();

    av.umsg(interpret("av_c6"));
    arr.toggleArrow(finalPivotIndex);
    arr.swapWithStyle(right, finalPivotIndex);
    arr.removeClass(finalPivotIndex, "processing");
    arr.addClass(finalPivotIndex, "deemph");
    av.step();

    // مرتب سازی قسمت سمت چپ
    var subArr1 = arr.slice(left, finalPivotIndex);
    if (subArr1.length === 1) {
      av.umsg(interpret("av_c7"));
      arr.toggleArrow(finalPivotIndex - 1);
      av.step();
      arr.toggleArrow(finalPivotIndex - 1);
      arr.addClass(left, "deemph");
    } else if (subArr1.length > 1) {
      av.umsg(interpret("av_c8"));
      av.step();
      quicksort(arr, left, finalPivotIndex - 1);
    }

    // مرتب سازی قسمت سمت راست
    var subArr2 = arr.slice(finalPivotIndex + 1, right + 1);
    if (subArr2.length === 1) {
      av.umsg(interpret("av_c9"));
      arr.toggleArrow(finalPivotIndex + 1);
      av.step();
      arr.toggleArrow(finalPivotIndex + 1);
      arr.addClass(finalPivotIndex + 1, "deemph");
    } else if (subArr2.length > 1) {
      av.umsg(interpret("av_c10"));
      av.step();
      quicksort(arr, finalPivotIndex + 1, right);
    }
  }

  function partition(arr, left, right, pivotVal) {
    var origLeft = left;

    while (left <= right) {
      // حرکت محدوده سمت چپ به داخل آرایه
      av.umsg(interpret("av_c11"));
      av.step();
      while (arr.value(left) < pivotVal) {
        av.umsg(interpret("av_c12"));
        arr.clearLeftArrow(left);
        left++;
        arr.setLeftArrow(left);
        av.step();
      }

      arr.highlight(left);
      av.umsg(interpret("av_c13"));
      av.step();

      // حرکت محدوده راست یه سمت داخل
      av.umsg(interpret("av_c14"));
      av.step();
      
      while ((right > origLeft) && (right >= left) && (arr.value(right) >= pivotVal)) {
        av.umsg(interpret("av_c15"));
        arr.clearRightArrow(right);
        right--;
        arr.setRightArrow(right);
        av.step();
      }

      if (right > left) {
        arr.highlight(right);
        av.umsg(interpret("av_c13"));
        av.step();
        // جا به جایی المان های به رنگ روشن
        av.umsg(interpret("av_c16"));
        arr.swap(left, right);
        av.step();
        arr.unhighlight([left, right]);
      } else {
        av.umsg(interpret("av_c17"));
        arr.unhighlight(left);
        av.step();
        break;
      }
    }

    // پاک کردن فلاش های آبی و قرمز و نشانه گذاری به عنوان مکان نهایی عنصر محوری
    arr.clearLeftArrow(left);
    arr.clearRightArrow(right);
    arr.toggleArrow(left);

    // برگشت به مکان اول در قسمت راست (زیر آرایه راست)
    return left;
  }

  // اتصال توابع ها به عناصر Html
  $("#run").click(runIt);
  $("#reset").click(ODSA.AV.reset);
});
