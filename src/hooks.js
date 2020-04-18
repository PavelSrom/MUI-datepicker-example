import { useTranslation } from 'react-i18next'

// AnotherPerson just added a comment
export const useLocalization = section => {
  const { t, i18n } = useTranslation(section)

  return {
    t,
    lang: i18n.language,
    changeLang: newLang => i18n.changeLanguage(newLang)
  }
}

export const handleFormErrors = (err, errorState, setErrorState) => {
  // Please note that form and 'errorState' should have the EXACT SAME structure!
  const errors = []
  err.inner.forEach(({ path, message }) => {
    errors.push({ name: path, message })
  })

  const newErrors = { ...errorState }
  for (let key of Object.keys(errorState)) {
    if (errors.map(({ name }) => name).includes(key)) {
      const thatErr = errors.find(({ name }) => name === key)
      newErrors[key] = thatErr.message
    }
  }

  setErrorState(newErrors)
}
