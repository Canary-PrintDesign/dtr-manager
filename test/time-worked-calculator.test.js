const tap = require('tap')
const moment = require('moment')

tap.equal(1, 1, 'Test working correctly')

tap.test('things', (t) => {
  t.equal(1, 1, 'Test working correctly')
  t.end()
})

function parseTime(time) {
  let [hh, mm, hhr, mmr] = [
    Number(time.slice(0, 2)),
    Number(time.slice(2)),
    0,
    0,
  ]

  if (hh > 23) {
    hhr = hh - 23
    hh = 23
  }

  if (mm > 59) {
    mmr = mm - 59
    mm = 59
  }

  return [hh, mm, hhr, mmr]
}

function calculateTime(hh, mm, hhr, mmr) {
  return moment(
    `${hh.toString().padStart(2, 0)}${mm.toString().padStart(2, 0)}`,
    'HHmm'
  )
    .add(hhr, 'hours')
    .add(mmr, 'minutes')
}

function calculateTimeWorked({ startTime, stopTime, startLunch, stopLunch }) {
  const xStartTime = calculateTime(...parseTime(startTime))
  const xStopTime = calculateTime(...parseTime(stopTime))
  const xStartLunch = calculateTime(...parseTime(startLunch || '0000'))
  const xStopLunch = calculateTime(...parseTime(stopLunch || '0000'))

  const diff = xStopTime.diff(xStartTime)
  const diffLunch = xStopLunch.diff(xStartLunch)

  return moment()
    .startOf('day')
    .milliseconds(diff - diffLunch)
    .format('H:mm')
}

tap.test('regular day', (t) => {
  const startTime = '0700'
  const stopTime = '1500'

  // should be an 8 difference
  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '8:00')

  t.end()
})

tap.test('regular day + 15', (t) => {
  const startTime = '0715'
  const stopTime = '1515'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '8:00')

  t.end()
})

tap.test('regular day with a 45 lunch break', (t) => {
  const startTime = '0715'
  const stopTime = '1515'
  const startLunch = '1200'
  const stopLunch = '1245'

  const diff = calculateTimeWorked({
    startTime,
    stopTime,
    startLunch,
    stopLunch,
  })
  t.equal(diff, '7:15')

  t.end()
})

tap.test('zero dark burnout', (t) => {
  const startTime = '0000'
  const stopTime = '1500'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '15:00')

  t.end()
})

tap.test('zero dark burnout + 45', (t) => {
  const startTime = '0045'
  const stopTime = '1545'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '15:00')

  t.end()
})

tap.test('shoulda been in bed hours ago', (t) => {
  const startTime = '0700'
  const stopTime = '0000'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '17:00')

  t.end()
})

tap.test('shoulda been in bed hours ago + 50', (t) => {
  const startTime = '0700'
  const stopTime = '0050'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '17:50')

  t.end()
})

tap.test('strange hours', (t) => {
  const startTime = '2100'
  const stopTime = '3100'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '10:00')

  t.end()
})

tap.test('brought to you by more than 60 minutes', (t) => {
  const startTime = '0700'
  const stopTime = '1569'

  const diff = calculateTimeWorked({ startTime, stopTime })
  t.equal(diff, '9:09')

  t.end()
})
