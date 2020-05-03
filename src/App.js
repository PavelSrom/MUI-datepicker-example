import React, { useState } from 'react'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { Select, MenuItem } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { availableTimes } from './dates'
// import moment from "moment"

const App = () => {
  const [chosenDate, setChosenDate] = useState(new Date())
  const [chosenTreatment, setChosenTreatment] = useState(0)

  const treatments = [
    {
      label: 'Routine checkup',
      duration: 1799000
    },
    {
      label: 'Emergency',
      duration: 3599000
    }
  ]

  const bookedDates = [
    {
      patient: 'Anonymous',
      startAt: '2020-05-04T08:00:00',
      endAt: '2020-05-04T08:59:59'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-05-04T09:00:00',
      endAt: '2020-05-04T09:59:59'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-05-04T14:30:00',
      endAt: '2020-05-04T15:29:59'
    }
  ]

  // convert all possible available slots to chosenDate + that time
  const availableSlots = availableTimes.map(time =>
    new Date(chosenDate.toISOString().split('T')[0] + 'T' + time).toISOString()
  )
  // extract booked dates from objects and convert them to ISO properly
  const booked = bookedDates.map(date => new Date(date.startAt).toISOString())
  // console.log(booked)
  // console.log(availableSlots)
  // so far so good
  // const availableSlotsToTimestamps = availableSlots.map(slot => new Date(slot).getTime())

  const freeSlots = []
  let totalAvailable = []
  for (let item of availableSlots) {
    // this loop works fine
    const startMatches = bookedDates.some(date => {
      const itemTimestamp = new Date(item).getTime()

      const startTimestamp = new Date(date.startAt).getTime()
      const endTimestamp = new Date(date.endAt).getTime()
      const inTheMiddle = itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp

      return inTheMiddle
    })

    if (!startMatches) freeSlots.push(item)
  }
  console.log(freeSlots)
  const freeSlotsToTimestamps = freeSlots.map(slot => ({
    startAt: new Date(slot).getTime(),
    endAt: new Date(slot).getTime() + 1799000
  }))
  console.log(freeSlotsToTimestamps)
  totalAvailable = freeSlotsToTimestamps.filter(slot =>
    freeSlotsToTimestamps.some(
      item => item.endAt === slot.startAt + treatments[chosenTreatment].duration
    )
  )
  console.log(totalAvailable)

  const shouldDisableDate = currD => {
    const isWeekend = currD.getDay() === 0 || currD.getDay() === 6

    // get the day in that month
    // I don't know whether this works 100%, but seems to work so far (needs further testing)
    const bookedForThatDay = booked.filter(
      time => new Date(time).toLocaleDateString() === currD.toLocaleDateString()
    )

    // console.log(bookedForThatDay) // I get what I expect to get
    return isWeekend || bookedForThatDay.length === availableTimes.length
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ margin: '0 auto' }}>
        <Select
          value={chosenTreatment}
          onChange={e => setChosenTreatment(e.target.value)}
        >
          {treatments.map(({ label }, index) => (
            <MenuItem key={index} value={index}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <p>Chosen treatment: {treatments[chosenTreatment].label}</p>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            value={chosenDate}
            onChange={date => {
              setChosenDate(date)
            }}
            autoOk
            disablePast
            format="yyyy/MM/dd hh:mm"
            shouldDisableDate={shouldDisableDate}
            invalidLabel="Invalid label"
          />
        </MuiPickersUtilsProvider>
      </div>

      <div style={{ marginTop: 50 }}>
        {totalAvailable.length > 0 && (
          <>
            <p>Available time slots: {totalAvailable.length}</p>
            {totalAvailable.map((time, index) => (
              <div key={index}>
                <p>Available: {new Date(time.startAt).toLocaleString()}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ marginTop: 50 }}>
        <p>Booked dates:</p>
        {bookedDates.map((date, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <p>Starts at: {new Date(date.startAt).toLocaleString()}</p>
            <p>Ends at: {new Date(date.endAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
