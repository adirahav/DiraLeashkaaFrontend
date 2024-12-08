import React, { useEffect, useState } from 'react'
import iconProgram from '../assets/images/icon_program.png'
import iconProgramSelected from '../assets/images/icon_program_selected.png'
import { utilService } from '../services/util.service'

export function UserPrograms({ programs, onChange }) {   

    const [selectedProgram, setSelectedProgram] = useState()

    const handleChoose = (programId) => {
        setSelectedProgram(programId === selectedProgram 
                                ? null 
                                : programId)
    }

    useEffect(() => {
        onChange("selectedProgram", selectedProgram, !selectedProgram)
    }, [selectedProgram])
    
/*{
            "key": "signup_pay_program_label",
            "value": "בחר מנוי"
        },
        */

    function getPeriod(duration, unit) {
        const durationValue = duration ?? 0
        const phrases = {
            d: ["signup_pay_program_1_day", "signup_pay_program_2_days", "signup_pay_program_many_days"],
            w: ["signup_pay_program_1_week", "signup_pay_program_2_weeks", "signup_pay_program_many_weeks"],
            m: ["signup_pay_program_1_month", "signup_pay_program_2_monthes", "signup_pay_program_many_monthes"],
            y: ["signup_pay_program_1_year", "signup_pay_program_2_years", "signup_pay_program_many_years"],
            u: "signup_pay_program_unlimited"
        }
    
        const unitKey = unit?.toLowerCase()
        const phraseArray = phrases[unitKey]
    
        if (unitKey === "u") return utilService.getPhrase(phrases.u, phrases)
        if (!phraseArray) return ""
    
        if (duration === 1) return utilService.getPhrase(phraseArray[0], phrases)
        if (duration === 2) return utilService.getPhrase(phraseArray[1], phrases)
        if (durationValue > 2) {
            const pluralPhrase = utilService.getPhrase(phraseArray[2], phrases)
            return pluralPhrase ? pluralPhrase.replace("%d", duration) : ""
        }
    
        return ""
    }
    
    return (<section className="programs">
        {programs.programTypes.filter(program => program.isAvailable).map((program, index) => (    
            <article key={`program${program.programId}`} className={selectedProgram === program.programId ? 'selected' : ''} onClick={() => handleChoose(program.programId)}>
                <div className='duration'>
                    <h2>{getPeriod(program.durationValue, program.durationUnit)}</h2>
                    {selectedProgram !== program.programId && <img src={iconProgram} />}
                    {selectedProgram === program.programId && <img src={iconProgramSelected} />}
                </div>
                <span className='price'>
                    {utilService.getPhrase("signup_pay_program_price", phrases).replace("%1$s", program.price)}
                </span>
            </article>
        ))}
    </section>)
}
