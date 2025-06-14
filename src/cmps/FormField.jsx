import { useEffect, useState, useCallback, useRef } from 'react'
import { IconSizes, ShowPasswordIcon, HidePasswordIcon, HelpIcon, RestartIcon } from '../assets/icons'
import { utilService } from '../services/util.service'
import { LoadingIcon } from '../assets/icons'
import { showTooltipAlert } from './Alert'
import { useSplash } from '../contexts/SplashContext'
import { Button as MaterialButton} from "@mui/material"

export function FormField({type = "STRING", params, onChange, onPress, onEnter }) {
    
    // type: STRING 
    //       TEXT_AREA
    //       NUMBER
    //       EMAIL 
    //       PASSWORD 
    //       BIRTH_OF_YEAR
    //       BUTTON | BUTTON_LONG | BUTTON_SUBMIT
    //       CHECKBOX  
    //       ERROR
    //       CODE   
    //       DROP_DOWN
    
    const DEBOUNCE_AWAIT = 500

    const { splash } = useSplash()
    const phrases = splash?.phrases

    function String({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)

        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                const checkIfHasError = value === ''
                setHasError(checkIfHasError)
                onChange(value, checkIfHasError)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            setValueToEdit(params.value || '')
        }, [params.value])
        
        const handleValueChanged = (e) => {
            const value = e.target.value
            setValueToEdit(value)
            debouncedOnChange(value)
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const fieldClass = `form-field string ${hasError ? ' error' : ''}`

        return  <><div className={fieldClass}>
                    <label>
                        <input type='text' value={valueToEdit?.toString()} onChange={handleValueChanged} onKeyDown={handleKeyDown} required autoCapitalize="off" autoCorrect="off" autoComplete="off" maxLength="75" name="email"></input>
                        <span>{params.label}</span>
                    </label>
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function TextArea({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)

        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                const checkIfHasError = value === ''
                setHasError(checkIfHasError)
                onChange(value, checkIfHasError)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            setValueToEdit(params.value || '')
        }, [params.value])
        
        const handleValueChanged = (e) => {
            const value = e.target.value
            setValueToEdit(value)
            debouncedOnChange(value)
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const fieldClass = `form-field textarea ${hasError ? ' error' : ''}`

        return  <><div className={fieldClass}>
                    <label>
                        <textarea type='text' value={valueToEdit?.toString()} onChange={handleValueChanged} onKeyDown={handleKeyDown} required autoCapitalize="off" autoCorrect="off" autoComplete="off" maxLength="75" name="email"></textarea>
                        <span>{params.label}</span>
                    </label>
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function Number({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)
        
        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                const checkIfHasError = value === ''
                setHasError(checkIfHasError)
                onChange(value, checkIfHasError)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            //setValueToEdit(params.value || '')
            setValueToEdit(params.value >= 0 ? params.value : '')
        }, [params.value])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target

            if (value === "0") {
                setValueToEdit(value)
                debouncedOnChange(value)
                return
            }
        
            value = value.replace(/[^0-9]/g, '').replace(/^0+/, '')

            if (value === "") {
                value = "0"
            }

            value = utilService.formatNumber(value)

            setValueToEdit(value)
            
            debouncedOnChange(value)
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const handleShowTooltip = (ev) => {
            showTooltipAlert({
                title: "Tooltip",
                message: params.tooltip,
                closeButton: { show: true, autoClose: false }, 
                positiveButton: { show: true, text: utilService.getPhrase("dialog_tooltip_button_ok", phrases), onPress: async () => { }, closeAfterPress: true }, 
                negativeButton: { show: false }, 
            })
        }

        const fieldClass = `form-field number ${hasError ? ' error' : ''} ${params.tooltip ? ' tooltip' : ''}`

        return  <><div className={fieldClass}>
                    <label>
                        <input 
                            name={params.name}
                            type='text' 
                            value={valueToEdit?.toString()} 
                            onChange={handleValueChange} 
                            onKeyDown={handleKeyDown} 
                            {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})}
                            required autoCapitalize="off" autoCorrect="off" autoComplete="off"></input>
                        <span>{params.label}</span>
                    </label>
                    {params.tooltip && <HelpIcon className='tooltip' sx={ IconSizes.Small } onClick={handleShowTooltip} />}
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function Email({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)

        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                const checkIfHasError = !utilService.REG_EXP.EMAIL.test(value)
                setHasError(checkIfHasError)
                onChange(value, checkIfHasError)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            setValueToEdit(params.value || '')
        }, [params.value])

        useEffect(() => {
            setHasError(params.hasError || false)
        }, [params.hasError])
        
        const handleValueChange = (e) => {
            const value = e.target.value.trim()
            setValueToEdit(value)
            debouncedOnChange(value)
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const fieldClass = `form-field email ${hasError ? ' error' : ''}`

        return  <><div className={fieldClass}>
                    <label>
                        <input name={params.name} type='text' value={valueToEdit?.toString()} onChange={handleValueChange} onKeyDown={handleKeyDown} disabled={params.isDisabled} required autoCapitalize="off" autoCorrect="off" autoComplete="off" maxLength="75"></input>
                        <span>{params.label}</span>
                    </label>
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function Password({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)
        const [isPasswordVisible, setIsPasswordVisible] = useState(false)
        
        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                const checkIfHasError = !utilService.REG_EXP.PASSWORD.test(value)
                setHasError(checkIfHasError)
                onChange(value, checkIfHasError)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            setValueToEdit(params.value || '')
        }, [params.value])

        const handleValueChange = (e) => {
            const value = e.target.value
            setValueToEdit(value)
            debouncedOnChange(value)
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const togglePasswordVisibility = () => {
            if (params.isDisabled) {
                return
            }

            setIsPasswordVisible(!isPasswordVisible)
        }

        const fieldClass = `form-field password ${hasError ? ' error' : ''}`
        const inputType = isPasswordVisible ? 'text' : 'password'

        return  <><div className={fieldClass}>
                    <label>
                        <input name={params.name} type={inputType} value={valueToEdit?.toString()} onChange={handleValueChange} onKeyDown={handleKeyDown} disabled={params.isDisabled} required autoCapitalize="off" autoCorrect="off" autoComplete="off" maxLength="75"></input>
                        <span>{params.label}</span>
                        {isPasswordVisible && valueToEdit.toString() !== "" && <HidePasswordIcon sx={ IconSizes.Small } onClick={togglePasswordVisibility} />} 
                        {!isPasswordVisible && valueToEdit.toString() !== "" && <ShowPasswordIcon sx={ IconSizes.Small } onClick={togglePasswordVisibility} />}
                    </label>     
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function YearOfBirth({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)
        
        const MIN_AGE = 18
        const MAX_AGE = 180

        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                const currentYear = new Date().getFullYear()
                const age = currentYear - value
                const checkIfHasError = value === '' || !(age >= MIN_AGE && age <= MAX_AGE)
                setHasError(checkIfHasError)
                onChange(value, checkIfHasError)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            setValueToEdit(params.value || '')
        }, [params.value])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target
            value = value.replace(/[^0-9]/g, '').replace(/^0+/, '')
            setValueToEdit(value)
            debouncedOnChange(value)
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const handleShowTooltip = (ev) => {
            showTooltipAlert({
                title: "Tooltip",
                message: params.tooltip,
                closeButton: { show: true, autoClose: false }, 
                positiveButton: { show: true, text: utilService.getPhrase("dialog_tooltip_button_ok", phrases), onPress: async () => { }, closeAfterPress: true }, 
                negativeButton: { show: false }, 
            })
        }

        const fieldClass = `form-field number ${hasError ? ' error' : ''} ${params.tooltip ? ' tooltip' : ''}`

        return  <><div className={fieldClass}>
                    <label>
                        <input 
                            name={params.name}
                            type='text' 
                            value={valueToEdit?.toString()} 
                            onChange={handleValueChange} 
                            onKeyDown={handleKeyDown} 
                            {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})}
                            required autoCapitalize="off" autoCorrect="off" autoComplete="off"></input>
                        <span>{params.label}</span>
                    </label>
                    {params.tooltip && <HelpIcon className='tooltip' sx={ IconSizes.Small } onClick={handleShowTooltip} />}
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function Checkbox({params, onChange}) {
        const [valueToEdit, setValueToEdit] = useState('')
        const [hasError, setHasError] = useState(false)

        useEffect(() => {
            setValueToEdit(params.value || false)
        }, [params.value])
        
        const handleValueChanged = (e) => {
            const checked = e.target.checked
            setValueToEdit(checked)
            
            const checkIfHasError = checked === false
            setHasError(checkIfHasError)
            onChange(checked, checkIfHasError)
        }

        const fieldClass = `form-field checkbox ${hasError ? ' error' : ''}`
        
        return  <><div className={fieldClass}>
                    <label>
                        <input type='checkbox' checked={!!valueToEdit} onChange={handleValueChanged} required autoCapitalize="off" autoCorrect="off" autoComplete="off" disabled={!params.enable} ></input>
                        <span>{params.label}</span>
                    </label>
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function Button({params, onPress, type}) {
        const fieldClass = `form-field button${params.isDisabled ? ' disabled': ''}${params.isLoading ? ' loading': ''}${params.isLinkView ? ' link': ''} ${type}`
        
        return  <div className={fieldClass}>
                    <MaterialButton variant="contained" className='positive' onClick={onPress} disabled={params.isDisabled}>
                        {!params.isLoading && <span dangerouslySetInnerHTML={{ __html: params.text }}></span>}
                        {params.isLoading && <LoadingIcon />}
                    </MaterialButton>
                </div>               
    }

    function Error({params}) {
        return  <>{params.hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function Code({params, onChange, onEnter}) {
        const [valueToEdit, setValueToEdit] = useState(params.value)
        const [hasError, setHasError] = useState(false)

        const inputRefs = useRef([])

        useEffect(() => {
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus()
            }
        }, [])

        const debouncedOnChange = useCallback(
            utilService.debounce((value) => {
                onChange(value)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        useEffect(() => {
            setValueToEdit(params.value || Array(params.length).fill(''))
        }, [params.value])

        useEffect(() => {
            if (valueToEdit.every(value => value !== '')) {
                debouncedOnChange(valueToEdit)
            }
        }, [valueToEdit])
        
        const handleValueChanged = (event, index) => {
            let value = event.target.value
            value = value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
            value = utilService.formatNumber(value)

            setValueToEdit((prevValues) => {
                const updatedValues = [...prevValues]
                updatedValues[index] = value

                if (value !== "" && index < params.length - 1) {
                    inputRefs.current[index + 1].focus()
                }

                return updatedValues
            })
        }

        const handleKeyDown = (e) => {
            if (!onEnter) {
                return
            }

            if (e.key === "Enter") {
                onEnter(e)
            }
        }

        const fieldClass = `form-field code ${hasError ? ' error' : ''}`

        return  <><div className={fieldClass}>
                    <span>{params.label}</span>
                    {[...Array(params.length)].map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            value={valueToEdit[index]?.toString()}
                            onChange={(e) => handleValueChanged(e, index)}
                            onKeyDown={handleKeyDown} 
                            ref={(el) => (inputRefs.current[index] = el)}
                            required
                            autoCapitalize="off"
                            autoCorrect="off"
                            autoComplete="off"
                            maxLength="1"
                            name={`email-${index}`}
                        />
                    ))}
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>
    }

    function DropDown({params, onChange}) {
        
        const [valueToEdit, setValueToEdit] = useState(null)
        const [hasError, setHasError] = useState(false)

        useEffect(() => {
            setValueToEdit(params.selectedValue)
        }, [params.selectedValue])

        useEffect(() => {
            if (valueToEdit) {
                debouncedOnValueChange(valueToEdit)
            }
            
        }, [valueToEdit])
        
        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                const checkIfHasError = value === null || 
                                        value === undefined || 
                                        value.length === 0 || 
                                        value === 'choose'
                setHasError(checkIfHasError)
                onChange(value)
            }, DEBOUNCE_AWAIT),
            [onChange]
        )

        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            const { value } = ev.target

            setValueToEdit(value)
        }
        
        const fieldClass = `form-field dropdown ${hasError ? ' error' : ''}` 

        return  <><div className={fieldClass}>
                    <label>
                        <select 
                            placeholder={params.options?.find(option => option.key==="choose" || option.key===0).value} 
                            value={valueToEdit?.toString()}
                            onChange={handleValueChange} >
                            {params.options?.map((option, index) => (
                                <option key={index} value={option.key.toString()}>{option.value}</option>
                            ))}
                        </select>
                        <span>{params.label}</span>
                    </label>
                </div>
                {params.error && hasError && <div className='form-field-error'>{params.error}</div>}</>    
    }

    return (
        <>
            {type === "STRING" && String({params, onChange, onEnter})}

            {type === "TEXT_AREA" && TextArea({params, onChange, onEnter})}

            {type === "NUMBER" && Number({params, onChange, onEnter})}

            {type === "BUTTON" && Button({params, onPress, type: 'button'})}

            {type === "BUTTON_LONG" && Button({params, onPress, type: 'long'})}

            {type === "BUTTON_SUBMIT" && Button({params, onPress, type: 'submit'})}

            {type === "EMAIL" && Email({params, onChange, onEnter})}

            {type === "PASSWORD" && Password({params, onChange, onEnter})}

            {type === "BIRTH_OF_YEAR" && YearOfBirth({params, onChange, onEnter})}

            {type === "CHECKBOX" && Checkbox({params, onChange})}

            {type === "ERROR" && Error({params})}

            {type === "CODE" && Code({params, onChange, onEnter})}

            {type === "DROP_DOWN" && DropDown({params, onChange})}
        </>

    )
}
