import React, { useState } from 'react'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { availableTimes } from './dates'
import { useTranslation } from 'react-i18next'
import { TextField, Button } from '@material-ui/core'
import * as yup from 'yup'
import { handleFormErrors } from './hooks'
// import moment from "moment"

const App = () => {
  // localization stuff
  const { t, i18n } = useTranslation('common')
  console.log(i18n.language)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  })
  const formSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required()
  })

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await formSchema.validate(form, { abortEarly: false })
      console.log('Form is valid')
    } catch (err) {
      handleFormErrors(err, formErrors, setFormErrors)
    }
  }

  const [chosenDate, setChosenDate] = useState(new Date())
  console.log(chosenDate)

  const bookedDates = [
    {
      patient: 'Anonymous',
      startAt: '2020-04-13T10:00:00'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-13T11:00:00' // 13 April at 10AM and 11AM
    },
    {
      patient: 'Pavel Srom',
      startAt: '2020-04-10T08:00:00' // friday 10th is fully booked
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-10T09:00:00'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-10T10:00:00'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-10T11:00:00'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-10T13:00:00'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-10T14:00:00'
    },
    {
      patient: 'Anonymous',
      startAt: '2020-04-10T15:00:00'
    }
    // {
    //   patient: "Pavel Srom",
    //   startAt: "2020-04-16T08:00:00", // april 16th is fully booked too (all below)
    // },
    // {
    //   patient: "Anonymous",
    //   startAt: "2020-04-16T09:00:00",
    // },
    // {
    //   patient: "Anonymous",
    //   startAt: "2020-04-16T10:00:00",
    // },
    // {
    //   patient: "Anonymous",
    //   startAt: "2020-04-16T11:00:00",
    // },
    // {
    //   patient: "Anonymous",
    //   startAt: "2020-04-16T13:00:00",
    // },
    // {
    //   patient: "Anonymous",
    //   startAt: "2020-04-16T14:00:00",
    // },
    // {
    //   patient: "Anonymous",
    //   startAt: "2020-04-16T15:00:00",
    // },
  ]

  console.log(
    bookedDates.filter(({ startAt }) => startAt > new Date().toISOString()) // shows future appointments
  )
  // convert all possible available slots to chosenDate + that time
  const availableSlots = availableTimes.map(time =>
    new Date(chosenDate.toISOString().split('T')[0] + 'T' + time).toISOString()
  )
  // extract booked dates from objects and convert them to ISO properly
  const booked = bookedDates.map(date => new Date(date.startAt).toISOString())
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

  const shouldDisableDate = currD => {
    const isWeekend = currD.getDay() === 0 || currD.getDay() === 6

    // get the day in that month
    // I don't know whether this works 100%, but seems to work so far (needs further testing)
    const bookedForThatDay = booked.filter(
      time => new Date(time).toLocaleDateString() === currD.toLocaleDateString()
    )

    console.log(bookedForThatDay) // I get what I expect to get
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
      {/* <div style={{ margin: '0 auto' }}>
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
                <p>Available: {new Date(time).toLocaleString()}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* localization */}
      {/* <p style={{ marginTop: 50 }}>{t('hello')}</p>
      <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'cz' : 'en')}>
        change language
      </button> */}

      <form onSubmit={handleSubmit}>
        <TextField
          error={Boolean(formErrors.email)}
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          helperText={formErrors.email}
        />
        <TextField
          error={Boolean(formErrors.password)}
          label="Password"
          type="password"
          value={form.password}
          name="password"
          onChange={handleChange}
          helperText={formErrors.password}
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default App
