async function scheduleHtmlProvider() {
  await loadTool('AIScheduleTools')
  try {
    const year = await AISchedulePrompt({
      titleText: '学年',
      tipText: '请输入本学年开始的年份',
      defaultText: '2024',
      validator: value => {
        try {
          const v = parseInt(value)
          if (v < 2000 || v > 2100) {
            return '请输入正确的学年'
          }
          return false
        } catch (error) {
          return '请输入正确的学年'
        }
      }
    })

    let term = await AISchedulePrompt({
      titleText: '学期',
      tipText: '请输入本学期的学期(1,2 分别表示上、下学期)',
      defaultText: '1',
      validator: value => {
        if (value === '1' || value === '2') {
          return false
        }
        return '请输入正确的学期'
      }
    })

    const res = await fetch(`https://jw.v.hbfu.edu.cn/jsxsd/xskb/xskb_list.do?xnxq01id=${year}-${parseInt(year) + 1}-${term}`, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
      },
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    return await res.text()
  } catch (error) {
    await AIScheduleAlert('请确定你已经登陆了教务系统')
    return 'do not continue'
  }
}