"use strict";



(function ($) {


  /**
   * ساخت فلش نشانگر محدوده چپ بالای اندیس مشخص شده
   * اگر فلش نشانگر محدوده چپ بالای المان موجود است کاری انجام داده نمی شود
   */
  JSAV._types.ds.AVArray.prototype.setLeftArrow = JSAV.anim(function (indices) {
    var $elems = JSAV.utils._helpers.getIndices($(this.element).find("li"), indices);

    // قرار دادن فلش نشانگر برروی هر اندیسی که مشخص شده است.
    $elems.each(function (index, item) {
      if (!$elems.hasClass("jsavarrow")) {
        $elems.toggleClass("jsavarrow");
      }

      if ($elems.hasClass("rightarrow")) {
        // اگر اندیس انتخاب شده دارای فلش راست(قرمز) باشد آن را حذف می کنیم
        // و کلاس فلش چپ/راست را به آن اضافه می کنیم.
        $elems.toggleClass("rightarrow");
        $elems.toggleClass("leftrightarrow");
      } else if (!$elems.hasClass("leftarrow")) {
        // اگر اندیس انتخاب شده فلش راست(قرمز) را نداشته باشد فلش چپ(آبی) را به آن اضافه می کنیم.
        $elems.toggleClass("leftarrow");
      }
    });
  });

  /**
   * ساخت فلش نشانگر محدوده راست بالای اندیس مشخص شده
   * اگر فلش نشانگر محدوده راست بالای المان موجود است کاری انجام داده نمی شود
   */
  JSAV._types.ds.AVArray.prototype.setRightArrow = JSAV.anim(function (indices) {
    var $elems = JSAV.utils._helpers.getIndices($(this.element).find("li"), indices);

   // قرار دادن فلش نشانگر برروی هر اندیسی که مشخص شده است.
    $elems.each(function (index, item) {
      if (!$elems.hasClass("jsavarrow")) {
        $elems.toggleClass("jsavarrow");
      }

      if ($elems.hasClass("leftarrow")) {
        // اگر اندیس انتخاب شده دارای فلش چپ(آبی) باشد آن را حذف می کنیم
        // و کلاس فلش چپ/راست را به آن اضافه می کنیم.
        $elems.toggleClass("leftarrow");
        $elems.toggleClass("leftrightarrow");
      } else if (!$elems.hasClass("rightarrow")) {
       // اگر اندیس انتخاب شده فلش چپ(آبی) را نداشته باشد فلش راست(قرمز) را به آن اضافه می کنیم.
        $elems.toggleClass("rightarrow");
      }
    });
  });

  /**
   *حذف فلش چپ(اگر موجود است)از اندیس مشخص شده
   */
  JSAV._types.ds.AVArray.prototype.clearLeftArrow = JSAV.anim(function (indices) {
    var $elems = JSAV.utils._helpers.getIndices($(this.element).find("li"), indices);

    // حذف فلش از روی هر اندیسی که مشخص شده است.
    $elems.each(function (index, item) {
      if ($elems.hasClass("leftrightarrow")) {
		  // تعویض نشانگر محدوده اشتراکی چپ/راست(سیاه) با نشانگر محدوده راست(قرمز)
        $elems.toggleClass("leftrightarrow");
        $elems.toggleClass("rightarrow");
      } else if ($elems.hasClass("leftarrow")) {
        // حذف فلش چپ
        $elems.toggleClass("leftarrow");
        $elems.toggleClass("jsavarrow");
      }
    });
  });

  /**
    *حذف فلش راست(اگر موجود است)از اندیس مشخص شده
   */
  JSAV._types.ds.AVArray.prototype.clearRightArrow = JSAV.anim(function (indices) {
    var $elems = JSAV.utils._helpers.getIndices($(this.element).find("li"), indices);

    // حذف فلش از روی هر اندیسی که مشخص شده است.
    $elems.each(function (index, item) {
      if ($(item).hasClass("leftrightarrow")) {
        // تعویض نشانگر محدوده اشتراکی چپ/راست(سیاه) با نشانگر محدوده چپ(آبی)
        $(item).toggleClass("leftrightarrow");
        $(item).toggleClass("leftarrow");
      } else if ($(item).hasClass("rightarrow")) {
        // حذف فلش راست
        $(item).toggleClass("rightarrow");
        $(item).toggleClass("jsavarrow");
      }
    });
  });

  
  JSAV._types.ds.AVArray.prototype.swapWithStyle = function (index1, index2) {
    this.swap(index1, index2);
    this.unhighlightBlue(index1);
    this.highlightBlue(index2);
  };
}(jQuery));
