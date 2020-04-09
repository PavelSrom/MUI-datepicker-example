import React, { useState } from "react"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers"
import { availableTimes } from "./dates"
import moment from "moment"

const App = () => {
  const [chosenDate, setChosenDate] = useState(new Date())
  console.log(chosenDate)

  const bookedDates = [
    {
      patient: "Pavel Srom",
      startAt: "2020-04-10T10:00:00",
    },
    {
      patient: "Anonymous",
      startAt: "2020-04-10T11:00:00",
    },
  ]

  const shouldDisableDate = (currD) => {
    // disable weekends
    return currD.getDay() === 0 || currD.getDay() === 6
  }

  // convert all possible available slots to chosenDate + that time
  const availableSlots = availableTimes.map((time) =>
    new Date(chosenDate.toISOString().split("T")[0] + "T" + time).toISOString()
  )
  // extract booked dates from objects and convert them to ISO properly
  const booked = bookedDates.map((date) => new Date(date.startAt).toISOString())
  console.log(booked)
  console.log(availableSlots)
  // so far so good

  const totalAvailable = []
  for (let item of availableSlots) {
    if (!booked.includes(item)) {
      totalAvailable.push(item)
    }
  }
  console.log(totalAvailable)

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ margin: "0 auto" }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            value={chosenDate}
            onChange={(date) => {
              setChosenDate(date)
              console.log(date)
            }}
            autoOk
            disablePast
            format="yyyy/MM/dd hh:mm"
            shouldDisableDate={shouldDisableDate}
          />
        </MuiPickersUtilsProvider>
      </div>

      <div style={{ marginTop: 50 }}>
        <p>Available time slots: {totalAvailable.length}</p>
        {totalAvailable.map((time, index) => (
          <div key={index}>
            <p>Available: {new Date(time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
