function scheduleHtmlParser(html) {
  let result = [];

  // 节次映射
  const sectionMapping = {
    '第一大节': [1, 2],
    '第二大节': [3, 4],
    '第三大节': [5],
    '第四大节': [6, 7],
    '第五大节': [8, 9],
    '第六大节': [10],
    '第七大节': [11, 12],
    '第八大节': [13]
  };

  console.log('[DEBUG] 开始解析课程表');

  // 遍历每一行（大节）
  $('#kbtable tr').slice(1, -1).each(function () {
    const rawRowTitle = $(this).find('th').first().text();
    const rowTitleMatch = rawRowTitle.match(/第[一二三四五六七八]大节/);
    const rowTitle = rowTitleMatch ? rowTitleMatch[0] : '';

    console.log(`[DEBUG] 原始大节标题: ${rawRowTitle}`);
    console.log(`[DEBUG] 解析后大节标题: ${rowTitle}`);

    const sections = sectionMapping[rowTitle] || [];

    console.log(`[DEBUG] 对应节次：${sections}`);

    // 遍历每一列（星期）
    $(this).find('td').each(function (colIndex) {
      const $div = $(this).find('.kbcontent1');

      // 如果课程非空
      if ($div.text().trim() !== '' && $div.text().trim() !== '\xa0') {
        let courseInfo = {
          name: $div.clone().children().remove().end().text().trim(),
          day: colIndex + 1,
          weeks: [],
          position: '',
          teacher: '',
          sections: sections // 直接设置节次
        };

        console.log(`[DEBUG] 发现课程: ${courseInfo.name}`);

        // 解析周次
        let weekText = $div.find('font[title="周次(节次)"]').text();
        if (weekText) {
          console.log(`[DEBUG] 周次文本: ${weekText}`);
          let weekParts = weekText.replace('(周)', '').split(',');
          weekParts.forEach(part => {
            if (part.includes('-')) {
              let [start, end] = part.split('-').map(Number);
              for (let i = start; i <= end; i++) {
                if (courseInfo.weeks.indexOf(i) === -1) {
                  courseInfo.weeks.push(i);
                }
              }
            } else {
              courseInfo.weeks.push(Number(part));
            }
          });
        }

        // 解析教室
        let positionText = $div.find('font[title="教室"]').text();
        if (positionText) {
          courseInfo.position = positionText.trim().slice(0, 50);
          console.log(`[DEBUG] 上课地点: ${courseInfo.position}`);
        }

        // 解析教师（从隐藏的div中获取）
        let $hiddenDiv = $(this).find('.kbcontent');
        let teacherText = $hiddenDiv.find('font[title="老师"]').text();
        if (teacherText) {
          courseInfo.teacher = teacherText.trim().slice(0, 50);
          console.log(`[DEBUG] 教师: ${courseInfo.teacher}`);
        }

        // 过滤和校验
        courseInfo.weeks = courseInfo.weeks.filter(w => w >= 1 && w <= 30);

        console.log(`[DEBUG] 课程详情: `, courseInfo);

        if (courseInfo.name && courseInfo.position && courseInfo.teacher) {
          result.push(courseInfo);
          console.log(`[DEBUG] 成功添加课程: ${courseInfo.name}`);
        } else {
          console.log(`[DEBUG] 课程信息不完整，未添加: ${courseInfo.name}`);
        }
      }
    });
  });

  // 合并同类项（课程名称、上课地点、教师、星期几相同）
  const mergedResult = [];
  result.forEach(course => {
    const existingCourse = mergedResult.find(c =>
        c.name === course.name &&
        c.day === course.day &&
        c.position === course.position &&
        c.teacher === course.teacher
    );

    if (existingCourse) {
      existingCourse.weeks = [...new Set([...existingCourse.weeks, ...course.weeks])].sort((a, b) => a - b);
      existingCourse.sections = [...new Set([...existingCourse.sections, ...course.sections])].sort((a, b) => a - b);
    } else {
      mergedResult.push(course);
    }
  });

  console.log('[DEBUG] 课程表解析完成');
  console.log('[DEBUG] 总课程数: ', mergedResult.length);
  console.log('[DEBUG] 课程详情: ', mergedResult);

  return mergedResult;
}