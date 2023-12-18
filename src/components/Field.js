import React from 'react'
import { countries } from '../assets/js/countries'
import { FileInput, Select, Textarea, TextInput, ToggleSwitch } from 'flowbite-react'
import PropTypes from 'prop-types'
import Helpers from '../utils/Helpers'

export const FieldElement = React.forwardRef(({ field, fieldObject }, ref) => {
  const { onChange, value } = field

  switch (fieldObject.type) {
    case 'boolean':
      return (
        <ToggleSwitch
          checked={value}
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          required={fieldObject.required}
          readOnly={fieldObject.readonly}
          value={value}
          onChange={onChange}
        />
      )
    case 'country':
      return (
        <Select
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          required={fieldObject.required}
          readOnly={fieldObject.readonly}
          helperText={<React.Fragment>{fieldObject.help}</React.Fragment>}
          {...field}
        >
          <option disabled={true} value=''>
            Choose an option
          </option>
          {countries.map((country) => {
            return (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            )
          })}
        </Select>
      )
    case 'file':
      return (
        <FileInput
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          required={fieldObject.required}
          readOnly={fieldObject.readonly}
          {...field}
        />
      )
    case 'code':
    case 'textarea':
      return (
        <Textarea
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          readOnly={fieldObject.readonly}
          helperText={<React.Fragment>{fieldObject.help}</React.Fragment>}
          rows={4}
          {...field}
        />
      )
    case 'select': {
      const options = Object.entries(fieldObject.options).map(([key, value]) => ({
        key: key,
        value: value
      }))

      return (
        <Select
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          required={fieldObject.required}
          readOnly={fieldObject.readonly}
          helperText={<React.Fragment>{fieldObject.help}</React.Fragment>}
          {...field}
        >
          <option disabled={true} value=''>
            Choose an option
          </option>
          {!!options &&
            !!options.length &&
            options.map((option) => {
              return (
                <option key={option.key} name={option.key}>
                  {option.value}
                </option>
              )
            })}
        </Select>
      )
    }
    case 'timezone':
      var timezones = Intl.supportedValuesOf('timeZone')

      return (
        <Select
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          required={fieldObject.required}
          readOnly={fieldObject.readonly}
          helperText={<React.Fragment>{fieldObject.help}</React.Fragment>}
          {...field}
        >
          <option disabled={true} value=''>
            Choose an option
          </option>
          {timezones.map((timezone) => {
            return (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            )
          })}
        </Select>
      )
    default:
      return (
        <TextInput
          ref={ref}
          id={fieldObject.key}
          type={fieldObject.type}
          placeholder={fieldObject.placeholder}
          required={fieldObject.required}
          readOnly={fieldObject.readonly}
          helperText={<React.Fragment>{fieldObject.help}</React.Fragment>}
          {...field}
        />
      )
  }
})

FieldElement.displayName = 'FieldElement'

FieldElement.propTypes = {
  field: PropTypes.object,
  fieldObject: PropTypes.object
}

export const FieldValue = ({ field, value }) => {
  switch (field.type) {
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'code':
      return <code>{value}</code>
    case 'country':
      var country = countries.find((country) => country.code === value)
      return country.name ?? ''
    case 'date':
      return Helpers.formatDate(value)
    case 'datetime-local':
      return Helpers.formatDate(value)
    case 'email':
      return (
        <a className='underline' href={`mailto:${value}`}>
          {value}
        </a>
      )
    case 'password':
      return '******'
    default:
      return value
  }
}

FieldValue.displayName = 'FieldValue'

FieldValue.propTypes = {
  field: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.array])
}