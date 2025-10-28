import { useEffect } from 'react'
import { FormField } from './FormField'
import { useSplash } from "../contexts/SplashContext"
import { utilService } from '../services/util.service'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import PropTypes from "prop-types"

export function UserFinancialDetails({ financialDetails, onChange, onSubmit }) {   
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    useEffect(() => {
        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [phrases])

    const keys = {
        equity: "equity" + (financialDetails.equity ? financialDetails.equity : "Default"),
        incomes: "incomes" + (financialDetails.incomes ? financialDetails.incomes : "Default"),
        commitments: "commitments" + (financialDetails.commitments ? financialDetails.commitments : "Default")
    }

    const handleOnChange = (key, value, hasError) => {
        onChange(key, value, hasError)
    }

    const handleSubmit = () => {
        onSubmit()
    }
    
    return (<div>
        <FormField type={"NUMBER"} key={keys.equity} params={financialDetails.equity} onChange={(value, hasError) => handleOnChange('equity', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"NUMBER"} key={keys.incomes} params={financialDetails.incomes} onChange={(value, hasError) => handleOnChange('incomes', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"NUMBER"} key={keys.commitments} params={financialDetails.commitments} onChange={(value, hasError) => handleOnChange('commitments', value, hasError)} onEnter={handleSubmit} />
    
        <article className="additional-funding-sources">
            <h3>{utilService.getPhrase("user_additional_funding_sources", phrases)}</h3>
            <ul>
                <li>
                    <FormField type={"STRING"} key={keys.equity} params={financialDetails.additionalFundingSources[0].source} onChange={(value, hasError) => handleOnChange('additionalFundingSourcesSource', value, hasError)} onEnter={handleSubmit} />
                    <FormField type={"NUMBER"} key={keys.equity} params={financialDetails.additionalFundingSources[0].amount} onChange={(value, hasError) => handleOnChange('additionalFundingSourcesAmount', value, hasError)} onEnter={handleSubmit} />
                    <FormField type={"NUMBER"} key={keys.equity} params={financialDetails.additionalFundingSources[0].repayment} onChange={(value, hasError) => handleOnChange('additionalFundingSourcesRepayment', value, hasError)} onEnter={handleSubmit} />
                </li>
            </ul>
        </article>
    </div>)
}

UserFinancialDetails.propTypes = {
    financialDetails: PropTypes.shape({
        equity: PropTypes.object.isRequired,
        incomes: PropTypes.object.isRequired,
        commitments: PropTypes.object.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}