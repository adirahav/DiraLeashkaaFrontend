import React from 'react'
import { FormField } from './FormField'

export function UserFinancialDetails({ financialDetails, onChange }) {   

    const keys = {
        equity: "equity" + (financialDetails.equity ? financialDetails.equity : "Default"),
        incomes: "incomes" + (financialDetails.incomes ? financialDetails.incomes : "Default"),
        commitments: "commitments" + (financialDetails.commitments ? financialDetails.commitments : "Default")
    }

    const handleOnChange = (key, value, hasError) => {
        onChange(key, value, hasError)
    }

    return (<div>
        <FormField type={"NUMBER"} key={keys.equity} params={financialDetails.equity} onChange={(value, hasError) => handleOnChange('equity', value, hasError)} />
        <FormField type={"NUMBER"} key={keys.incomes} params={financialDetails.incomes} onChange={(value, hasError) => handleOnChange('incomes', value, hasError)} />
        <FormField type={"NUMBER"} key={keys.commitments} params={financialDetails.commitments} onChange={(value, hasError) => handleOnChange('commitments', value, hasError)} />
    </div>)
}
