export type Lang = "ar" | "en";

export const t = (lang: Lang) => {
  const isAr = lang === "ar";

  return {
    brand: "MirroOfTrader",
    home_title: isAr ? "مرآة المتداول" : "The Mirror of the Trader",
    home_sub: isAr
      ? "رحلة نفسية، عقلية وفلسفية عبر الظلال الأربعة"
      : "A psychological, mental, and philosophical journey through four shadows",
    start_reading: isAr ? "ابدأ القراءة" : "Start Reading",
    get_access: isAr ? "شراء بطاقة تفعيل" : "Get Access",
    login: isAr ? "تسجيل الدخول" : "Login",
    store: isAr ? "المتجر" : "Store",
    test: isAr ? "اختبار الظل" : "Shadow Test",
    dashboard: isAr ? "لوحة المستخدم" : "Dashboard",
  };
};
