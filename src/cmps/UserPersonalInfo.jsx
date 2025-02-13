import React, { useEffect } from 'react'
import { FormField } from './FormField'
import { useSelector } from 'react-redux'

export function UserPersonalInfo({ personalInfo, onChange, onSubmit }) {   
    
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    const keys = {
        name: "name" + (personalInfo.name ? personalInfo.name : "Default"),
        email: "email" + (personalInfo.email ? personalInfo.email : "Default"),
        password: "password" + (personalInfo.password ? personalInfo.password : "Default"),
        yearOfBirth: "yearOfBirth" + (personalInfo.yearOfBirth ? personalInfo.yearOfBirth : "Default") 
    }

    if (loggedinUser) {
        personalInfo = {
            ...personalInfo,
            email: {
                ...personalInfo.email,
                isDisabled: true,
            },
            password: {
                ...personalInfo.password,
                isDisabled: true,
            }
        }
    }

    const handleOnChange = (key, value, hasError) => {
        onChange(key, value, hasError)
    }

    const handleSubmit = () => {
        onSubmit()
    }

    return (<div>
        <FormField type={"STRING"} key={keys.name} params={personalInfo.name} onChange={(value, hasError) => handleOnChange('name', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"EMAIL"} key={keys.email} params={personalInfo.email} onChange={(value, hasError) => handleOnChange('email', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"PASSWORD"} key={keys.password} params={personalInfo.password} onChange={(value, hasError) => handleOnChange('password', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"BIRTH_OF_YEAR"} key={keys.yearOfBirth} params={personalInfo.yearOfBirth} onChange={(value, hasError) => handleOnChange('yearOfBirth', value, hasError)} onEnter={handleSubmit} />
    </div>)
}
