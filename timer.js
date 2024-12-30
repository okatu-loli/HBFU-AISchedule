/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer({
  startSemester = '' // 可选参数，开学时间
} = {}) {
  // 判断当前是否为夏令时
  function isSummerTime(date) {
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const day = date.getDate();

    // 5月6日至10月8日为夏令时
    if (month >= 5 && month <= 10) { // 初始范围5月到10月
      if ((month === 5 && day >= 6) || (month === 10 && day <= 8) || (month > 5 && month < 10)) {
        // 进一步细化条件
        return true;
      }
    }
    return false;
  }

  // 获取当前日期
  const today = new Date();
  const isSummer = isSummerTime(today);

  // 冬令时和夏令时的基本配置
  const winterSections = [
    { section: 1, startTime: '08:00', endTime: '08:45' },
    { section: 2, startTime: '08:45', endTime: '09:30' },
    { section: 3, startTime: '09:45', endTime: '10:30' },
    { section: 4, startTime: '10:30', endTime: '11:15' },
    { section: 5, startTime: '11:25', endTime: '12:10' },
    { section: 6, startTime: '14:00', endTime: '14:45' },
    { section: 7, startTime: '14:45', endTime: '15:30' },
    { section: 8, startTime: '15:45', endTime: '16:30' },
    { section: 9, startTime: '16:30', endTime: '17:15' },
    { section: 10, startTime: '17:25', endTime: '18:10' },
    { section: 11, startTime: '18:40', endTime: '19:25' },
    { section: 12, startTime: '19:25', endTime: '20:10' },
    { section: 13, startTime: '20:20', endTime: '21:05' }
  ];

  const summerSections = [
    { section: 1, startTime: '08:00', endTime: '08:45' },
    { section: 2, startTime: '08:45', endTime: '09:30' },
    { section: 3, startTime: '09:45', endTime: '10:30' },
    { section: 4, startTime: '10:30', endTime: '11:15' },
    { section: 5, startTime: '11:25', endTime: '12:10' },
    { section: 6, startTime: '14:30', endTime: '15:15' },
    { section: 7, startTime: '15:15', endTime: '16:00' },
    { section: 8, startTime: '16:15', endTime: '17:00' },
    { section: 9, startTime: '17:00', endTime: '17:45' },
    { section: 10, startTime: '17:55', endTime: '18:40' },
    { section: 11, startTime: '19:10', endTime: '19:55' },
    { section: 12, startTime: '19:55', endTime: '20:40' },
    { section: 13, startTime: '20:50', endTime: '21:35' }
  ];

  return {
    totalWeek: 17, // 总周数
    startSemester, // 开学时间
    startWithSunday: false, // 是否周日为起始日
    showWeekend: true, // 是否显示周末
    forenoon: 5, // 上午课程节数
    afternoon: 5, // 下午课程节数
    night: 3, // 晚上课程节数
    sections: isSummer ? summerSections : winterSections // 根据季节选择对应的时间表
  }
}