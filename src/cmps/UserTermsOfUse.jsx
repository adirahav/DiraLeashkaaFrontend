import React, { useEffect } from 'react'
import { FormField } from './FormField'

export function UserTermsOfUse({ termsOfUse, onChange }) {   
    const keys = {
        accept: termsOfUse.accept.value.toString() + "acceptDefault",
    }

    const handleOnChange = (key, value, hasError) => {
        if (onChange) {
            onChange(key, value, hasError)
        }
    }
    
    return (<div className='html-area'>
        <div className='text' dangerouslySetInnerHTML={{ __html: termsOfUse.text }}></div>
        <FormField type={"CHECKBOX"} key={keys.accept} params={termsOfUse.accept} onChange={(value, hasError) => handleOnChange('accept', value, hasError)} />
    </div>)
}
