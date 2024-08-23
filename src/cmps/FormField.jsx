import { useEffect, useState, useRef } from 'react'
import { ArrowDownIcon, ArrowUpIcon, CancelIcon, OKIcon, RollbackIcons } from '../assets/icons'

export function FormField({type = "NUMBER", params, onValueChanged, onPercentChanged }) {
    // type: NUMBER | AUTO_FILL | CALC | CALC_BOLD | CALC_EDITABLE | CALC_TOTAL | DROP_DOWN | SEARCHABLE_DROP_DOWN | STRING

    function Number({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(formatNumber(params.value.toString()))
        
        useEffect(() => {
            onSetValue(parseNumber(valueToEdit))
        }, [valueToEdit])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target

            value = value.replace(/[^0-9]/g, '').replace(/^0+/, '')
            value = formatNumber(value)

            setValueToEdit(value)
        }
           
        return  <>
                <span>{params.label}</span>
                <div className='number'>
                    <input 
                        value={valueToEdit.toLocaleString()}  
                        onChange={handleValueChange} 
                        {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                </div>
                </>
    }

    function AutoFill({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(formatNumber(params.value.toString()))
        
        useEffect(() => {
            onSetValue(parseNumber(valueToEdit))
        }, [valueToEdit])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let { value } = ev.target
            value = value.replace(/[^0-9]/g, '').replace(/^0+/, '')
            value = formatNumber(value)

            setValueToEdit(value)
        }

        const handleValueRollback = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            let value = params.defaultValue.toString().replace(/[^0-9]/g, '').replace(/^0+/, '')
            value = formatNumber(value)

            setValueToEdit(value)
        }
        
        const fieldClass = 'auto-fill' + (valueToEdit.length === 0 ? ' empty' : '')

        return  <>
                <span>{params.label}</span>
                <div className={fieldClass}>
                    <input 
                        value={valueToEdit.toLocaleString()}  
                        onChange={handleValueChange} 
                        {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                        {valueToEdit.replace(/,/g, '') !== params.defaultValue.toString() && <RollbackIcons onClick={handleValueRollback} />}
                </div>
                </>
    }

    function Calc({params}) {
        return  <>
                    <span>{params.label}</span>
                    <div className='calc'>
                        <input 
                            value={params.value.toLocaleString()}  
                            readOnly={true} />
                    </div>
                </>

        return  <>
                <span>{params.label}</span>
                <div className='calc'>
                    <input 
                        value={params.value.toLocaleString()}  
                        readOnly={true} />
                </div>
                </>
    }

    function CalcEditable({params, onSetValue, onSetPercent}) {

        // -------------
        // value
        // -------------
        const [valueToEdit, setValueToEdit] = useState(
            params.value.customValue 
                ? formatNumber(params.value.customValue.toString())
                : params.value.calc
                    ? formatNumber(params.value.calc.toString())
                    : "")

        useEffect(() => {
            if (!params.value.calc || valueToEdit.toString().replace(/,/g, '') !== params.value.calc.toString()) {
                onSetValue(parseNumber(valueToEdit))
            }
        }, [valueToEdit])

        useEffect(() => {
            setValueToEdit(
                params.value.customValue 
                    ? formatNumber(params.value.customValue.toString())
                    : params.value.calc
                        ? formatNumber(params.value.calc.toString())
                        : "")
        }, [params.value.calc])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
            
            let { value } = ev.target
            value = value.replace(/[^0-9]/g, '').replace(/^0+/, '')
            value = formatNumber(value)
            
            setValueToEdit(value)
        }
        
        
        // -------------
        // label / number picker
        // -------------
        const [label, setLabel] = useState(params.label.withPercent)
       
        const [showNumberPicker, setShowNumberPicker] = useState(false)
        const [orgPercent, setOrgPercent ] = useState(
            params.numberPicker.customPercent 
                ? params.numberPicker.customPercent
                : params.numberPicker.default)
        const [percentToEdit, setPercentToEdit] = useState(orgPercent.toString())
    
        const numberPickerRef = useRef()

        useEffect(() => {
            setLabel(
                params.value.customValue && params.value.customValue.toString() !== params.value.default.toString()
                    ? params.label.withCustomValue
                    : params.numberPicker.customPercent
                        ? params.label.withPercent.replace("%1$.1f&percnt;", `${params.numberPicker.customPercent}%`)  
                        : params.label.withPercent.replace("%1$.1f&percnt;", `${params.numberPicker.default}%`)
                    
            )
            
        }, [params.value.customValue, params.numberPicker.customPercent])

        const handleClickLabel = (event) => {
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
                         .replace(/-/g, '');        // Remove hyphens

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
                value = value.slice(1);
            }*/
            
            setPercentToEdit(value)
        }

        const handleStepUp = () => {
            setPercentToEdit(prevPercentToEdit => {
                const newValue = Math.min(parseFloat(prevPercentToEdit) + params.numberPicker.step, params.numberPicker.max)
                return formatFloat(newValue)
            })
        }

        const handleStepDown = () => {
            setPercentToEdit(prevPercentToEdit => {
                const newValue = Math.max(parseFloat(prevPercentToEdit) - params.numberPicker.step, params.numberPicker.min)
                return formatFloat(newValue)
            })
        }

        function handleNumberPickerPercentCancle(ev) {
            setPercentToEdit(orgPercent)
            setLabel(params.label.withPercent.replace("%1$.1f&percnt;", `${orgPercent}%`) )
            setShowNumberPicker(false)
        }

        const handleNumberPickerPercentAccept = (ev) => {
            setOrgPercent(percentToEdit)
            setLabel(params.label.withPercent.replace("%1$.1f&percnt;", `${percentToEdit}%`) )
            setShowNumberPicker(false)
            onSetPercent(percentToEdit)
        }

        // -------------
        // rollback
        // -------------
        const handleValueRollback = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
        
            setValueToEdit(formatNumber(params.value.default.toString()))
            setPercentToEdit(params.numberPicker.default)
            onSetPercent(null)  
            setOrgPercent(params.numberPicker.default)
        }

        const fieldClass = 'auto-fill' + (valueToEdit.length === 0 ? ' empty' : '')
        
        const showRollback = valueToEdit.toString().replace(/,/g, '') !== params.value.default.toString()

        return  <>
                {!showNumberPicker && <span dangerouslySetInnerHTML={{ __html: label }} onClick={handleClickLabel}></span>}
                {showNumberPicker && <span className='number-picker' ref={numberPickerRef}>
                    <OKIcon onClick={handleNumberPickerPercentAccept} />
                    <CancelIcon onClick={handleNumberPickerPercentCancle}  />
                    <ArrowUpIcon onClick={handleStepUp} />
                    <input type="number" 
                        pattern="\d*" 
                        step={params.numberPicker.step} 
                        min={params.numberPicker.min} 
                        max={params.numberPicker.max}
                        value={percentToEdit}
                        onChange={handleNumberPickerPercentChange}  />
                    <ArrowDownIcon onClick={handleStepDown} />
                </span>}
                <div className={fieldClass}>
                    <input 
                        value={valueToEdit.toLocaleString()}  
                        onChange={handleValueChange} 
                        {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                        {showRollback && <RollbackIcons onClick={handleValueRollback} />}
                </div>
                </>
    }

    function CalcTotal({params}) {
        return  <>
                <span>{params.label}</span>
                <div className='calc-total'>
                    <input 
                        value={params.value.toLocaleString()}  
                        readOnly={true} />
                </div>
                </>
    }

    function DropDown({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(params.selectedValue)
        
        useEffect(() => {
            onSetValue(valueToEdit)
        }, [valueToEdit])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            const { value } = ev.target

            setValueToEdit(value)
        }

        return  <>
                <span>{params.label}</span>
                <div className='dropdown'>
                    <select 
                        placeholder={params.options.find(option => option.key==="choose").value} 
                        defaultValue={valueToEdit.toLocaleString()}
                        onChange={handleValueChange} >
                        {params.options.map((option, index) => (
                            <option key={index} value={option.key}>{option.value}</option>
                        ))}
                    </select>
                </div>
                </>
            
    }

    function SearchableDropDown({params, onSetValue}) {
        const allOptions = [
            ...params.options.filter(option => params.suggestedOptions.includes(option.key))
                             .map(option => ({ ...option, suggested: true })),
            ...params.options.filter(option => !params.suggestedOptions.includes(option.key))
        ]

        const [searchToEdit, setSearchToEdit] = useState("")
        const [valueToEdit, setValueToEdit] = useState(params.selectedValue)
        const [isSearchableDropDownOpen, setSearchableDropDownOpen] = useState(false)
        const [filteredOptions, setFilteredOptions] = useState(allOptions)

        useEffect(() => {
            onSetValue(valueToEdit)
        }, [valueToEdit])
    
        const handleShowSearchableDropDownOptions = (event) => {  
            event.preventDefault()
            setSearchableDropDownOpen(true)
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
               
        }

        return  <>
                <span>{params.label}</span>
                <div className='searchable-dropdown'>
                    <input value={params.options.find(option => option.key===valueToEdit).value} onFocus={handleShowSearchableDropDownOptions} readOnly={true} />
                    {isSearchableDropDownOpen && <ul>
                        <li><input placeholder={"חפש..."} value={searchToEdit} onChange={handleSearchChange} /></li>
                        {filteredOptions.map((option, index) => (
                            <li key={index} id={option.key} className={option.suggested ? "suggested" : ""} onClick={handleOptionPress}>{option.value}</li>
                        ))}
                    </ul>}
                </div>
                </>
    }

    function String({params, onSetValue}) {
        const [valueToEdit, setValueToEdit] = useState(params.value)
        
        useEffect(() => {
            onSetValue(valueToEdit)
        }, [valueToEdit])
        
        const handleValueChange = (ev) => {
            ev.preventDefault()
            ev.stopPropagation()
    
            const { value } = ev.target
    
            setValueToEdit(value)
        }
       
        return  <>
                    <span>{params.label}</span>
                    <div className='string'>
                        <input  value={valueToEdit} 
                                onChange={handleValueChange} 
                                {...(params.maxLength > -1 ? { maxLength: params.maxLength } : {})} />
                    </div>
                </>
    }

    // helpers

    const formatNumber = (value) => {
        if (value === '') return ''
        return parseInt(value, 10).toLocaleString()
    }

    const formatFloat = (value) => {
        return parseFloat(value).toFixed(1)
    }

    const parseNumber = (value) => {
        return value.toString().replace(/,/g, '')
    }

    return (
        <div className='form-field'>
            {type === "NUMBER" && Number({params, onSetValue: onValueChanged})}

            {type === "AUTO_FILL" && AutoFill({params, onSetValue: onValueChanged})}

            {type === "CALC" && Calc({params})}

            {type === "CALC_BOLD" && <></>}

            {type === "CALC_EDITABLE" && CalcEditable({params, onSetValue: onValueChanged, onSetPercent: onPercentChanged})}
            
            {type === "CALC_TOTAL" && CalcTotal({params})}

            {type === "DROP_DOWN" && DropDown({params, onSetValue: onValueChanged})}

            {type === "SEARCHABLE_DROP_DOWN" && SearchableDropDown({params, onSetValue: onValueChanged})}

            {type === "STRING" && String({params, onSetValue: onValueChanged})}
        </div>

        
    );
}
