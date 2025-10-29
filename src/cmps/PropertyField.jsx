import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from "prop-types"
import { ArrowDownIcon, ArrowUpIcon, CancelIcon, OKIcon, RollbackIcons, AttentionIcon } from '../assets/icons'
import { utilService } from '../services/util.service'
import { showWarningAlert } from './Alert'
import { useSplash } from '../contexts/SplashContext'

export function PropertyField({type = "NUMBER", params, isFirstLoading, onValueChanged, onPercentChanged }) {
    // type: NUMBER | AUTO_FILL | CALC | CALC_BOLD | CALC_EDITABLE | CALC_TOTAL | DROP_DOWN | SEARCHABLE_DROP_DOWN | VISUAL_DROP_DOWN | MULTIPLE_DROP_DOWN | STRING | TEXT_AREA | PERCENT

    const DEBOUNCE_AWAIT = 500
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    function Number({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(utilService.formatNumber(params.value?.toString()))
        const [isChangedByUser, setIsChangedByUser] = useState(false)

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])
        
        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(utilService.parseNumber(value))
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target
            if (value === "0") {
                value.replace(/[^0-9]/g, '').replace(/^0+/, '')
            } 
           
            value = utilService.formatNumber(value)
            setValueToEdit(value)
            setIsChangedByUser(true)
        }
           
        const fieldClass = 'property-field number' + (isFirstLoading
                                                    ? ' loading0' 
                                                    : valueToEdit === null || 
                                                      valueToEdit.length === 0 
                                                        ? ' empty' 
                                                        : '')
       
       return  <div className={fieldClass}>
                    <span>{params.label}</span>
                    <div>
                        <input 
                            value={valueToEdit.toLocaleString()}  
                            onChange={handleValueChange} 
                            {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                    </div>
                </div>
    }

    function AutoFill({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(utilService.formatNumber(params.value?.toString()))
        const [isChangedByUser, setIsChangedByUser] = useState(false)
        
        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])
        
        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(utilService.parseNumber(value))
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target
            if (value === "0") {
                value.replace(/[^0-9]/g, '').replace(/^0+/, '')
            }
            value = utilService.formatNumber(value)
            setValueToEdit(value)
            setIsChangedByUser(true)
        }

        const handleValueRollback = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            setIsChangedByUser(true)
            let value = params.defaultValue === 0 ? "0" : params.defaultValue.toString().replace(/[^0-9]/g, '').replace(/^0+/, '')
            value = utilService.formatNumber(value)

            setValueToEdit(value)
        }

        /*const showRollback1 = valueToEdit.replace(/,/g, '') !== params.defaultValue?.toString() && 
                             !isFirstLoading && 
                             params.defaultValue != undefined && 
                             params.id */
            
        const showRollback = isFirstLoading || !valueToEdit 
                             ? false 
                             //: (!params.value && !params.defaultValue) ||
                             : (!(typeof params.value === 'number') && !(typeof params.defaultValue === 'number')) ||
                               (valueToEdit?.toString().replace(/,/g, '') !== params.defaultValue?.toString())
     
        const fieldClass = 'property-field auto-fill' + (showRollback ? ' roll-back' : '') + (isFirstLoading
                                ? ' loading1' 
                                : valueToEdit === null || 
                                  valueToEdit.length === 0 
                                    ? ' empty' 
                                    : '')

        return  <div className={fieldClass}>
                    <span>{params.label}</span>
                    <div>
                        <input 
                            value={valueToEdit.toLocaleString()}  
                            onChange={handleValueChange} 
                            {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                            {showRollback && <RollbackIcons onClick={handleValueRollback} />}
                    </div>
                </div>
    }

    function Calc({params}) {
        const fieldClass = 'property-field calc' + (isFirstLoading
                                                    ? ' loading2' 
                                                    : '')
                                             + (params.hasWarning 
                                                    ? ' warning' 
                                                    : '')

        const handleShowWarningAlert = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            showWarningAlert({
                title: "Error",
                message: params.warning,
                closeButton: { show: true, autoClose: false }, 
                positiveButton: { show: true, text: utilService.getPhrase("dialog_tooltip_button_ok", phrases), onPress: async () => { }, closeAfterPress: true }, 
                negativeButton: { show: false }, 
            })
        }
        
        return  <div className={fieldClass}>
                    <span dangerouslySetInnerHTML={{ __html: params.label }} ></span>
                    <div className='calc'>
                        <input 
                            value={params.value !== null && params.value !== undefined ? params.value.toLocaleString() : ''}  
                            readOnly={true}
                            disabled={true}  />
                        {params.hasWarning && <AttentionIcon onClick={handleShowWarningAlert} />}
                    </div>
                </div>
    }

    function CalcEditable({params, onSetValue, onSetPercent}) {
        const [isChangedByUser, setIsChangedByUser] = useState(false)
        
        // -------------
        // value
        // -------------
        const [valueToEdit, setValueToEdit] = useState(
            params.value.customValue || params.value.customValue === 0
                ? utilService.formatNumber(params.value.customValue.toString())
                : params.value.calc
                    ? utilService.formatNumber(params.value.calc.toString())
                    : "")
        
        useEffect(() => {
            if (isChangedByUser && (!params.value.calc || valueToEdit.toString().replace(/,/g, '') !== params.value.calc.toString())) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])

        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(value === '' ? null : utilService.parseNumber(value))
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        useEffect(() => {
            setValueToEdit(
                params.value.customValue || params.value.customValue === 0 
                    ? utilService.formatNumber(params.value.customValue.toString())
                    : params.value.calc
                        ? utilService.formatNumber(params.value.calc.toString())
                        : "")
        }, [params.value.calc])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            
            let { value } = ev.target
            if (value !== "0") {
                value = value.replace(/[^0-9]/g, '').replace(/^0+/, '')
                if (value === "") value = "0"
            }
            value = utilService.formatNumber(value)
            
            setValueToEdit(value)
            setIsChangedByUser(true)
        }
        
        
        // -------------
        // label / number picker
        // -------------
        const [label, setLabel] = useState(params.label.withPercent)
       
        const [showNumberPicker, setShowNumberPicker] = useState(false)
        const [orgPercent, setOrgPercent ] = useState(null)
        const [percentToEdit, setPercentToEdit] = useState(null)
    
        const numberPickerRef = useRef()

        useEffect(() => {
            setLabel(
                params.value.customValue !== null && params.value.customValue?.toString() !== params.value.default?.toString()
                    ? params.label.withCustomValue
                    : params.numberPicker.customPercent
                        ? params.label.withPercent.replace("%1$.1f&percnt;", `${params.numberPicker.customPercent}%`)  
                        : params.label.withPercent.replace("%1$.1f&percnt;", `${params.numberPicker.default}%`)
                    
            )
            
        }, [params.value.customValue, params.numberPicker.customPercent])

        useEffect(() => {
            setOrgPercent(params.numberPicker.customPercent 
                ? params.numberPicker.customPercent
                : params.numberPicker.default)
        }, [params.numberPicker])

        useEffect(() => {
            setPercentToEdit(orgPercent?.toString())
        }, [orgPercent])

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnPercentChange(percentToEdit)
            }
        }, [percentToEdit])

        const debouncedOnPercentChange = useCallback(
            utilService.debounce((percent) => {
                onSetPercent(percent === '' ? null : percent)
            }, DEBOUNCE_AWAIT),
            [onSetPercent]
        )

        const handleClickLabel = () => {
            if (!showNumberPicker) {
                numberPickerRef.current = undefined 
                setShowNumberPicker(true)
            }
        }

        const handleNumberPickerPercentChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            
            let { value } = ev.target
            
            value = value.replace(/[^0-9.]/g, '')   // Remove all characters except digits and dots
                         .replace(/\.{2,}/g, '.')   // Replace multiple dots with a single dot
                         .replace(/-/g, '')         // Remove hyphens

            if (value.length > 1 && value.startsWith('.')) {
                value = "0" + value
            }

            if (value > params.numberPicker.max) {
                value = params.numberPicker.max
            }

            /*const parts = value.split('.')          // Ensure only one dot is allowed 
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('')
            }

            if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {    // Handle leading zeros
                value = value.replace(/^0+/, '')
            }
            
            if (value.startsWith('0') && value[1] !== '.') {    // Handle case where first character is zero and second is not dot
                value = value.slice(1)
            }*/
            
            setPercentToEdit(value)
        }

        const handleStepUp = () => {
            setPercentToEdit(prevPercentToEdit => {
                const newValue = Math.min(parseFloat(prevPercentToEdit) + params.numberPicker.step, params.numberPicker.max)
                return utilService.formatFloat(newValue)
            })
        }

        const handleStepDown = () => {
            setPercentToEdit(prevPercentToEdit => {
                const newValue = Math.max(parseFloat(prevPercentToEdit) - params.numberPicker.step, params.numberPicker.min)
                return utilService.formatFloat(newValue)
            })
        }

        function handleNumberPickerPercentCancle() {
            setPercentToEdit(orgPercent)
            setLabel(params.label.withPercent.replace("%1$.1f&percnt;", `${orgPercent}%`) )
            setShowNumberPicker(false)
        }

        const handleNumberPickerPercentAccept = () => {
            const fixedPercentToEdit = utilService.formatFloat(percentToEdit)
            setOrgPercent(fixedPercentToEdit)
            setLabel(params.label.withPercent.replace("%1$.1f&percnt;", `${fixedPercentToEdit}%`) )
            setShowNumberPicker(false)
            onSetPercent(fixedPercentToEdit)
        }

        // -------------
        // rollback
        // -------------
        const handleValueRollback = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            
            setIsChangedByUser(true)
           
            if (params.value.customValue !== null) {
                setValueToEdit('')
            } else if (params.numberPicker.customPercent !== null) {
                setPercentToEdit('')
            }
        }

        const showRollback = isFirstLoading || valueToEdit === null || valueToEdit === ''
                                ? false 
                                : params.isReadOnly
                                    ? params.numberPicker.customPercent !== params.numberPicker.default && !isFirstLoading && params.id
                                    : (!params.value && !params.value.default && params.value.calc !== params.value.default) ||
                                      (params.value.customValue !== null && params.value.customValue !== params.value.default) ||
                                      (params.numberPicker.customPercent !== params.numberPicker.default) ||
                                      (!valueToEdit && valueToEdit?.toString().replace(/,/g, '') !== params.value.default?.toString())
        
        const fieldClass = 'calc-editable' + (showRollback ? ' roll-back' : '') + (showNumberPicker ? ' number-picker' : '') + (isFirstLoading
                                        ? ' loading3' 
                                        : valueToEdit === null || 
                                          valueToEdit.length === 0 
                                            ? ' empty' 
                                            : '')

        return  <div className={`property-field ${fieldClass}`}>
                    {!showNumberPicker && <span dangerouslySetInnerHTML={{ __html: label }} onClick={handleClickLabel} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClickLabel() } role='button' tabIndex={0}></span>}
                    {showNumberPicker && <NumberPicker ref={numberPickerRef} numberPicker={params.numberPicker} value={percentToEdit} onAccept={handleNumberPickerPercentAccept} onCancel={handleNumberPickerPercentCancle} onStepUp={handleStepUp} onStepDown={handleStepDown} onValueChange={handleNumberPickerPercentChange} />}
                    <div>
                        <input 
                            value={valueToEdit.toLocaleString()}  
                            onChange={handleValueChange} 
                            readOnly={params.isReadOnly}
                            {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                        {showRollback && <RollbackIcons onClick={handleValueRollback} />}
                    </div>
                </div>
    }

    function CalcTotal({params}) {
        const fieldClass = 'calc-total' + (isFirstLoading
                                            ? ' loading4' 
                                            : '')
        
        const value = params.value 
                        ? (params.leftSign ?? "") + params.value?.toLocaleString(undefined, {
                            minimumFractionDigits: params.decimalPlaces ?? 0,
                            maximumFractionDigits: params.decimalPlaces ?? 0,
                          }) + (params.rightSign ?? "")
                        : ""

        return  <div className={`property-field ${fieldClass}`}>
                    <span dangerouslySetInnerHTML={{ __html: params.label }} ></span>
                    <div>
                        <input 
                            value={value}  
                            readOnly={true} />
                    </div>
                </div>
    }

    function DropDown({ params, onSetValue }) {
        const [valueToEdit, setValueToEdit] = useState(null)
        const [isChangedByUser, setIsChangedByUser] = useState(false)
        const [isOpen, setIsOpen] = useState(false)
        
        const dropdownRef = useRef()

        useEffect(() => {
            if (params.label || params.options || params.selectedValue) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside)
                }, 0)
            }
    
            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }, [params.label, params.options, params.selectedValue])

        useEffect(() => {
            setValueToEdit(params.selectedValue)
        }, [params.selectedValue])
    
        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(value)
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )
    
        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])
    
        const handleValueChange = (value) => {
            setValueToEdit(value)
            setIsChangedByUser(true)
            setIsOpen(false)
        }
    
        const handleShowWarningAlert = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
    
            showWarningAlert({
                title: "Error",
                message: params.warning,
                closeButton: { show: true, autoClose: false },
                positiveButton: {
                    show: true,
                    text: utilService.getPhrase("dialog_tooltip_button_ok", phrases),
                    onPress: async () => {},
                    closeAfterPress: true,
                },
                negativeButton: { show: false },
            })
        }

        function handleClickOutside(ev) {
            if (dropdownRef.current && !dropdownRef.current.contains(ev.target)) {
                setIsOpen(false)
            }
        }
    
        const fieldClass =
            "property-field dropdown" + (isFirstLoading
                                            ? " loading5"
                                            : valueToEdit === null ||
                                              valueToEdit === undefined ||
                                              valueToEdit.length === 0 ||
                                              valueToEdit === "choose"
                                                ? " empty"
                                                : "") 
                                      + (params.hasWarning ? " warning" : "")
    
        const toggleDropdown = () => setIsOpen(!isOpen)
        
        return (
            <div className={fieldClass} ref={dropdownRef}>
                <span>{params.label}</span>
                <div className={`custom-dropdown ${isOpen ? "open" : ""}`} onClick={toggleDropdown} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleDropdown() } role='button' tabIndex={0}>
                {params.hasWarning && <AttentionIcon onClick={handleShowWarningAlert} />}
                    <button className="dropdown-toggle">
                        {params.options?.find(option => option.key.toString() === valueToEdit?.toString())?.value || utilService.getPhrase("dropdown_choose", phrases)}
                        {!isOpen && <ArrowDownIcon />}
                        {isOpen && <ArrowUpIcon />}
                    </button>
                    {isOpen && (
                        <ul className="dropdown-menu">
                            {params.options?.map((option, index) => (
                                <li
                                    key={index}
                                    className={valueToEdit?.toString() === option.key.toString() ? "selected" : ""}
                                    onClick={() => handleValueChange(option.key)}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleValueChange() } 
                                    role='button' 
                                    tabIndex={0}
                                >
                                    {option.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }

    function SearchableDropDown({params, onSetValue}) {
        const allOptions = params.options ? [
            ...params.options.filter(option => params.suggestedOptions.includes(option.key))
                             .map(option => ({ ...option, suggested: true })),
            ...params.options.filter(option => !params.suggestedOptions.includes(option.key))
        ] : []
        const [searchToEdit, setSearchToEdit] = useState("")
        const [valueToEdit, setValueToEdit] = useState(params?.selectedValue ?? null)
        const [isOpen, setIsOpen] = useState(false)
        const [filteredOptions, setFilteredOptions] = useState(allOptions)
        const [isChangedByUser, setIsChangedByUser] = useState(false)

        const fieldRef = useRef()
        const dropdownRef = useRef()

        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(value)
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        useEffect(() => {
            if (params.label || params.options || params.selectedValue) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside)
                }, 0)
            }
    
            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }, [params.label, params.options, params.selectedValue])

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])

        useEffect(() => {
            if (params) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside)
                }, 0)
            }
    
            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
    
        }, [params])
    
        const toggleDropdown = (event) => {  
            event.preventDefault()
            setIsOpen(true)
        } 

        const handleSearchChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            
            const { value } = ev.target

            setSearchToEdit(value)
            setFilteredOptions(allOptions.filter(option => option.value.includes(value)))
        }

        const handleOptionPress = (event) => {
        
            event.preventDefault()
    
            const { id } = event.target
            setValueToEdit(id)
            setIsOpen(false)
            setIsChangedByUser(true)
        }

        function handleClickOutside(ev) {
            if (dropdownRef.current && !dropdownRef.current.contains(ev.target)/* && inputRef.current !== document.activeElement*/) {
                setIsOpen(false)
            }
        }
        
        const fieldClass = 'property-field dropdown searchable' + (isFirstLoading
                                                                    ? ' loading6' 
                                                                    : valueToEdit === null || 
                                                                      valueToEdit === undefined || 
                                                                      valueToEdit.length === 0 || 
                                                                      valueToEdit === 'choose' 
                                                                        ? ' empty' 
                                                                        : '')

        return  <div className={fieldClass} ref={dropdownRef}>
                    <span>{params.label}</span>
                    <div ref={fieldRef} className={`custom-dropdown ${isOpen ? "open" : ""}`} onClick={toggleDropdown} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleDropdown() } role='button' tabIndex={0}>
                        <button className="dropdown-toggle">
                            {params.options?.find(option => option.key.toString() === valueToEdit?.toString())?.value || utilService.getPhrase("dropdown_choose", phrases)}
                            {!isOpen && <ArrowDownIcon />}
                            {isOpen && <ArrowUpIcon />}
                        </button>
                        {isOpen && <div className="dropdown-menu">
                            <input placeholder={"חפש..."} value={searchToEdit} onChange={handleSearchChange} />
                            <ul>
                                {filteredOptions.map((option, index) => (
                                    <li key={index} id={option.key} className={option.suggested ? "suggested" : ""} onClick={handleOptionPress} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOptionPress() } role='button' tabIndex={0}>{option.value}</li>
                                ))}
                            </ul>
                        </div>}
                        
                    </div>
                </div>
    }
    
    function VisualDropDownn({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(params?.selectedValue ?? null)
        const [isOpen, setIsOpen] = useState(false)
        const [filteredOptions, setFilteredOptions] = useState(params.options)
        const [isChangedByUser, setIsChangedByUser] = useState(false)

        const fieldRef = useRef()
        const dropdownRef = useRef()

        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(value)
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        useEffect(() => {
            if (params.label || params.options || params.selectedValue) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside)
                }, 0)
            }
    
            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }, [params.label, params.options, params.selectedValue])

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])

        useEffect(() => {
            if (params) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside)
                }, 0)
            }
    
            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
    
        }, [params])

        useEffect(() => {
            setFilteredOptions(params.options)
        }, [params.options])

        const toggleDropdown = (event) => {  
            event.preventDefault()
            setIsOpen(true)
        } 

        const handleOptionPress = (event) => {
            event.preventDefault()
    
            const { id } = event.currentTarget
            
            setValueToEdit(id)
            setIsOpen(false)
            setIsChangedByUser(true)
        }

        function handleClickOutside(ev) {
            if (dropdownRef.current && !dropdownRef.current.contains(ev.target)/* && inputRef.current !== document.activeElement*/) {
                setIsOpen(false)
            }
        }
        
        const fieldClass = `property-field dropdown visual` + (isFirstLoading
                                                                    ? ' loading6' 
                                                                    : valueToEdit === null || 
                                                                      valueToEdit === undefined || 
                                                                      valueToEdit.length === 0 || 
                                                                      valueToEdit === 'choose' 
                                                                        ? ' empty' 
                                                                        : '')

        return  <div className={fieldClass} ref={dropdownRef}>
                    <div ref={fieldRef} className={`custom-dropdown ${isOpen ? "open" : ""}`}>
                        <button className="dropdown-toggle" onClick={toggleDropdown}>
                            {params.options?.find(option => option.key.toString() === valueToEdit?.toString())?.value || utilService.getPhrase("dropdown_choose", phrases)}
                            {!isOpen && <ArrowDownIcon />}
                            {isOpen && <ArrowUpIcon />}
                        </button>
                        {isOpen && <div className="dropdown-menu">
                            <ul>
                                {filteredOptions.map((option, index) => (
                                    <li key={index} id={option.key} className={option.suggested ? "suggested" : ""} onClick={handleOptionPress} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOptionPress() } role='button' tabIndex={0}>
                                        {option.image && <img src={option.image} alt={option.value} />}
                                        <div>
                                            <span>{option.value}</span>
                                            {option.info && <span>{option.info}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>}
                        
                    </div>
                </div>
    }

    function MultipleDropDownn({params, onSetValue}) {
        const [isOpen, setIsOpen] = useState(false)
        const [filteredOptions, setFilteredOptions] = useState()
        const [choosenText, setChoosenText] = useState()

        const fieldRef = useRef()
        const dropdownRef = useRef()

        useEffect(() => {
            if (params.label || params.options || params.selectedValue) {
                setTimeout(() => {
                    document.addEventListener('click', handleClickOutside)
                }, 0)
            }
    
            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }, [params.label, params.options, params.selectedValue])

        useEffect(() => {
            setFilteredOptions(params.options)
        }, [params.options])

        useEffect(() => {
            setChoosenText( 
                params?.selectedValue?.length > 1 
                    ? params?.texts.many.replace('%1$s', params?.selectedValue?.length)
                    : params?.selectedValue?.length === 1
                        ? params?.texts.one
                        : params?.texts.any
            )
        }, [params?.selectedValue?.length])

        const toggleDropdown = (event) => {  
            event.preventDefault()
            setIsOpen(true)
        } 

        const handleCheckboxChanged = (event) => {
            event.stopPropagation()  
            
            const checked = event.target.checked
            const { id } = event.target
            onSetValue(checked, id)
        }

        function handleClickOutside(ev) {
            if (dropdownRef.current && !dropdownRef.current.contains(ev.target)/* && inputRef.current !== document.activeElement*/) {
                setIsOpen(false)
            }
        }
        
        const fieldClass = `property-field dropdown multiple ` 
                                + (isFirstLoading
                                    ? ' loading6' 
                                    : params?.selectedValue === null || 
                                      params?.selectedValue === undefined || 
                                      params?.selectedValue.length === 0 || 
                                      params?.selectedValue === 'choose' 
                                        ? ' empty' 
                                        : '')
                                                                        
        return  <div className={fieldClass} ref={dropdownRef}>
                    <div ref={fieldRef} className={`custom-dropdown ${isOpen ? "open" : ""}`}>
                        <button className="dropdown-toggle" onClick={toggleDropdown}>
                            <span dangerouslySetInnerHTML={{ __html: choosenText }} />
                            {!isOpen && <ArrowDownIcon />}
                            {isOpen && <ArrowUpIcon />}
                        </button>
                        {isOpen && <div className="dropdown-menu">
                            <ul>
                                {filteredOptions.map((option, index) => (
                                    <li key={index}>
                                        <input type='checkbox' id={option.key} checked={option.checked} onChange={handleCheckboxChanged} required autoCapitalize="off" autoCorrect="off" autoComplete="off" disabled={!option.enable} ></input>
                                        {option.image && <img src={option.image} alt={option.value} />}
                                        <div>
                                            <span>{option.value}</span>
                                            {option.info && <span>{option.info}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>}
                        
                    </div>
                </div>
    }

    function String({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(params.value)
        const [isChangedByUser, setIsChangedByUser] = useState(false)
        const inputRef = useRef()

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])
        
        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(value)
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
    
            const { value } = ev.target
    
            setValueToEdit(value)
            setIsChangedByUser(true)
        }
        
        if (params.isFocus && inputRef.current) {
            inputRef.current.focus()
        }

        const fieldClass = 'property-field string' + (isFirstLoading
                                                    ? ' loading7' 
                                                    : valueToEdit === null || 
                                                      valueToEdit?.length === 0 
                                                        ? ' empty' 
                                                        : '')

        return  <div className={fieldClass}>
                    <span>{params.label}</span>
                    <div className='string'>
                        <input  value={valueToEdit} ref={inputRef}
                                onChange={handleValueChange} 
                                {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                    </div>
                </div>
    }

    function TextArea({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(params.value)
        const [isChangedByUser, setIsChangedByUser] = useState(false)
        const inputRef = useRef()

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnValueChange(valueToEdit)
            }
        }, [valueToEdit])
        
        const debouncedOnValueChange = useCallback(
            utilService.debounce((value) => {
                onSetValue(value)
            }, DEBOUNCE_AWAIT),
            [onSetValue]
        )

        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
    
            const { value } = ev.target
    
            setValueToEdit(value)
            setIsChangedByUser(true)
        }
        
        if (params.isFocus && inputRef.current) {
            inputRef.current.focus()
        }

        const fieldClass = 'property-field textarea' + (isFirstLoading
                                                    ? ' loading8' 
                                                    : valueToEdit === null || 
                                                      valueToEdit?.length === 0 
                                                        ? ' empty' 
                                                        : '')

        return  <div className={fieldClass} title={valueToEdit?.toString()}>
                    <span>{params.label}</span>
                    <div className='textarea'>
                        <textarea type='text' value={valueToEdit?.toString()} 
                            onChange={handleValueChange} 
                            {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} required autoCapitalize="off" autoCorrect="off" autoComplete="off"></textarea>
                    </div>
                </div>
    }
    
    function Percent({params, onSetPercent}) {
        const [isChangedByUser, setIsChangedByUser] = useState(false)
        // -------------
        // label / number picker
        // -------------
        const [label, setLabel] = useState(params.label.replace("%1$.1f&percnt;", ''))
       
        const [showNumberPicker, setShowNumberPicker] = useState(false)
        const [orgPercent, setOrgPercent ] = useState(null)
        const [percentToEdit, setPercentToEdit] = useState(null)
    
        const numberPickerRef = useRef()

        useEffect(() => {
            setLabel(
                params.numberPicker.customPercent
                    ? params.label.replace("%1$.1f&percnt;", `${utilService.formatFloat(params.numberPicker.customPercent)}%`)  
                    : params.numberPicker.default
                        ? params.label.replace("%1$.1f&percnt;", `${utilService.formatFloat(params.numberPicker.default)}%`)
                        : params.label.replace("%1$.1f&percnt;", '')
            )
        }, [params.numberPicker.customPercent, params.numberPicker.default])

        useEffect(() => {
           setOrgPercent(params.numberPicker.customPercent 
                ? params.numberPicker.customPercent
                : params.numberPicker.default)
        }, [params.numberPicker])

        useEffect(() => {
            setPercentToEdit(orgPercent?.toString())
        }, [orgPercent])

        useEffect(() => {
            if (isChangedByUser) {
                debouncedOnPercentChange(percentToEdit)
            }
        }, [percentToEdit])

        const debouncedOnPercentChange = useCallback(
            utilService.debounce((percent) => {
                onSetPercent(percent === '' ? null : percent)
            }, DEBOUNCE_AWAIT),
            [onSetPercent]
        )

        const handleClickLabel = () => {
            if (!showNumberPicker) {
                numberPickerRef.current = undefined 
                setShowNumberPicker(true)
            }
        }

        const handleNumberPickerPercentChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target
            
            value = value.replace(/[^0-9.]/g, '')   
                         .replace(/\.{2,}/g, '.')   
                         .replace(/-/g, '')        

            if (value.length > 1 && value.startsWith('.')) {
                value = "0" + value
            }

            if (value > params.numberPicker.max) {
                value = params.numberPicker.max
            }

            setPercentToEdit(value)
        }

        const handleStepUp = () => {
            setPercentToEdit(prevPercentToEdit => {
                const newValue = Math.min(parseFloat(prevPercentToEdit) + params.numberPicker.step, params.numberPicker.max)
                return utilService.formatFloat(newValue)
            })
        }

        const handleStepDown = () => {
            setPercentToEdit(prevPercentToEdit => {
                const newValue = Math.max(parseFloat(prevPercentToEdit) - params.numberPicker.step, params.numberPicker.min)
                return utilService.formatFloat(newValue)
            })
        }

        function handleNumberPickerPercentCancle() {
            setPercentToEdit(orgPercent)
            setLabel(params.label.replace("%1$.1f&percnt;", `${orgPercent}%`) )
            setShowNumberPicker(false)
        }

        const handleNumberPickerPercentAccept = () => {
            setOrgPercent(percentToEdit)
            setLabel(params.label
                //.replace("<u>", "<span>")
                //.replace("</u>", "</span>")
                .replace("%1$.1f&percnt;", `${percentToEdit}%`) 
            )
            setShowNumberPicker(false)
            onSetPercent(percentToEdit)
        }

        // -------------
        // rollback
        // -------------
        const handleValueRollback = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
        
            setIsChangedByUser(true)
            setShowNumberPicker(false)
            
            if (params.numberPicker.customPercent) {
                setPercentToEdit('')
            }
        }

        const formattedDefault = (
            (parseFloat(params.numberPicker?.default ?? 0) || 0) +
            (parseFloat(params.numberPicker?.delta ?? 0) || 0)
        )

        const formattedPercentToEdit = utilService.formatFloat(percentToEdit?.toString().replace(/,/g, ''))

        
        const normalize = val => {
            if (val == null || isNaN(val)) return null
            const num = window.Number(val)
            return Math.round(num * 10) / 10        // round to one decimal
        }
        
        const normalizedEdit = normalize(formattedPercentToEdit)
        const normalizedDefault = normalize(formattedDefault)
        
        console.log(`${params.label}: ${normalizedEdit} !== ${normalizedDefault} + (${JSON.stringify(params.numberPicker)})`)
        
        const showRollback = isFirstLoading || !percentToEdit 
            ? false 
            : normalizedEdit !== normalizedDefault
                                
        const divClass = `property-field percent ${showRollback ? 'roll-back' : ''} ${showNumberPicker ? 'number-picker' : ''}`

        return  <div className={divClass}>
                    <div className='rollback'>
                        {showRollback && <RollbackIcons onClick={handleValueRollback} />}
                    </div>
                    <span className='label' dangerouslySetInnerHTML={{ __html: label }} onClick={handleClickLabel} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClickLabel() } role='button' tabIndex={0}></span>
                    {showNumberPicker && <NumberPicker ref={numberPickerRef} numberPicker={params.numberPicker} value={formattedPercentToEdit} onAccept={handleNumberPickerPercentAccept} onCancel={handleNumberPickerPercentCancle} onStepUp={handleStepUp} onStepDown={handleStepDown} onValueChange={handleNumberPickerPercentChange} /> }
                </div>
    }

    const NumberPicker = React.forwardRef(function NumberPicker({ numberPicker, value, onAccept, onCancel, onStepUp, onStepDown, onValueChange }, ref) {
        const handleKeyDown = (ev) => {
            if (ev.key === "Enter" || ev.keyCode === 13) {
                ev.preventDefault()
                ev.stopPropagation()
                onAccept(ev)
                return
            }

            if (ev.key === "Escape" || ev.keyCode === 27) {
                ev.preventDefault()
                ev.stopPropagation()
                onCancel(ev)
                return
            }
        }
        
        
        return (
            <span className="number-picker" ref={ref}>
                <div className="actions">
                    <OKIcon onClick={onAccept} />
                    <CancelIcon onClick={onCancel} />
                </div>
                <div className="input">
                    <ArrowUpIcon onClick={onStepUp} />
                    <input
                        type="number"
                        pattern="\d*"
                        step={numberPicker.step}
                        min={numberPicker.min}
                        max={numberPicker.max}
                        value={utilService.formatFloat(value)}
                        onChange={onValueChange}
                        onKeyDown={handleKeyDown}
                    />
                    <ArrowDownIcon onClick={onStepDown} />
                </div>
            </span>
        )
    })
    

    Number.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    AutoFill.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    Calc.propTypes = {
        params: PropTypes.object
    }
    
    CalcEditable.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func,
        onSetPercent: PropTypes.func
    }
    
    CalcTotal.propTypes = {
        params: PropTypes.object
    }
    
    DropDown.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    SearchableDropDown.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    VisualDropDownn.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    MultipleDropDownn.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    String.propTypes = {
        params: PropTypes.oneOfType([
            PropTypes.shape({
              isFocus: PropTypes.bool,
              label: PropTypes.string,
              maxLength: PropTypes.number
            }),
            PropTypes.oneOf([null]),
          ]),
        onSetValue: PropTypes.func
    }
    
    TextArea.propTypes = {
        params: PropTypes.object,
        onSetValue: PropTypes.func
    }
    
    Percent.propTypes = {
        params: PropTypes.object,
        onSetPercent: PropTypes.func
    }

    NumberPicker.propTypes = {
        numberPicker: PropTypes.shape({
          step: PropTypes.number,
          min: PropTypes.number,
          max: PropTypes.number,
        }).isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        onAccept: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        onStepUp: PropTypes.func.isRequired,
        onStepDown: PropTypes.func.isRequired,
        onValueChange: PropTypes.func.isRequired,
    }

    return (
        <>
            {type === "NUMBER" && Number({params, onSetValue: onValueChanged})}

            {type === "AUTO_FILL" && AutoFill({params, onSetValue: onValueChanged})}

            {type === "CALC" && Calc({params})}

            {type === "CALC_BOLD" && <></>}

            {type === "CALC_EDITABLE" && CalcEditable({params, onSetValue: onValueChanged, onSetPercent: onPercentChanged})}
            
            {type === "CALC_TOTAL" && CalcTotal({params})}

            {type === "DROP_DOWN" && DropDown({params, onSetValue: onValueChanged})}

            {type === "SEARCHABLE_DROP_DOWN" && SearchableDropDown({params, onSetValue: onValueChanged})}
            
            {type === "VISUAL_DROP_DOWN" && VisualDropDownn({params, onSetValue: onValueChanged})}
            
            {type === "MULTIPLE_DROP_DOWN" && MultipleDropDownn({params, onSetValue: onValueChanged})}
            
            {type === "STRING" && String({params, onSetValue: onValueChanged})}

            {type === "TEXT_AREA" && TextArea({params, onSetValue: onValueChanged})}

            {type === "PERCENT" && Percent({params, onSetPercent: onPercentChanged})}           
        </>  
    )
}


PropertyField.propTypes = {
    type: PropTypes.string,
    params: PropTypes.object,
    isFirstLoading: PropTypes.bool,  
    onValueChanged: PropTypes.func,
    onPercentChanged: PropTypes.func,
}

