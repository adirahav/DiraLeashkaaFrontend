import { useEffect, useState } from 'react'
import { FormField } from './FormField'
import { useSplash } from "../contexts/SplashContext"
import { utilService } from '../services/util.service'
import { onLoadingStart, onLoadingDone } from '../store/actions/app.actions.js'
import PropTypes from "prop-types"
import { DeleteIcon, AddAdditionalFundingSourceIcon, IconSizes, HelpIcon } from '../assets/icons.jsx'
import { showTooltipAlert } from './Alert.jsx'

export function UserFinancialDetails({ financialDetails, onChange, onAddNew, onDeleteExist, onSubmit, showAdditionalFundingSources }) {   
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const [newAdditionalFundingSource, setNewAdditionalFundingSource] = useState({
        "source": {"name":"source","label":utilService.getPhrase("signup_additional_funding_sources_source_label", phrases),"value":"","error":"","tooltip":"","maxLength":"","hasError":false},
        "amount": {"name":"amount","label":utilService.getPhrase("signup_additional_funding_sources_amount_label", phrases),"value":"","error":"","hasError":false},
        "repayment": {"name":"repayment","label":utilService.getPhrase("signup_additional_funding_sources_repayment_label", phrases),"value":"","error":"","hasError":false}
    })

    const [addNewAdditionalFundingSourceEnable, setAddNewAdditionalFundingSourceEnable] = useState(false)

    useEffect(() => {
        if (!phrases) {
            onLoadingStart()  
        } else {
            onLoadingDone()  
        }
    }, [phrases])

    useEffect(() => {
        const { source, amount, repayment } = newAdditionalFundingSource

        const isValid =
            source.value?.trim() !== "" &&
            amount.value?.toString().trim() !== "" &&
            repayment.value?.toString().trim() !== ""

        setAddNewAdditionalFundingSourceEnable(isValid)
    }, [newAdditionalFundingSource])

    const keys = {
        equity: "equity" + (financialDetails.equity.value ? financialDetails.equity.value : "Default"),
        incomes: "incomes" + (financialDetails.incomes.value ? financialDetails.incomes.value : "Default"),
        commitments: "commitments" + (financialDetails.commitments.value ? financialDetails.commitments.value : "Default")
    }

    const handleOnChangeExist = (fieldName, value, hasError) => {
        if (!hasError) {
            onChange(fieldName, value)
        }
    }

    const handleOnChangeNew = (fieldName, value) => {
        setNewAdditionalFundingSource(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                value
            }
        }))
    }

    const handleOnAddNew = (ev) => {
        ev.preventDefault()
        
        if (!addNewAdditionalFundingSourceEnable) {
            return
        }   

        onAddNew(newAdditionalFundingSource)

        setNewAdditionalFundingSource(prev => ({
            source: { ...prev["source"], value: '' },
            amount: {  ...prev["amount"], value: '' },
            repayment: { ...prev["repayment"], value: '' }
        }))
    }

    const handleOnDeleteExist = (additionalFundingSourceUUID) => {
        onDeleteExist(additionalFundingSourceUUID)
    }

    const handleShowTooltip = (message) => {
        showTooltipAlert({
            title: "Tooltip",
            message,
            closeButton: { show: true, autoClose: false }, 
            positiveButton: { show: true, text: utilService.getPhrase("dialog_tooltip_button_ok", phrases), onPress: async () => { }, closeAfterPress: true }, 
            negativeButton: { show: false }, 
        })
    }

    const handleSubmit = () => {
        onSubmit()
    }
    
    return (<div>
        <FormField type={"NUMBER"} key={keys.equity} params={financialDetails.equity} onChange={(value, hasError) => handleOnChangeExist('equity', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"NUMBER"} key={keys.incomes} params={financialDetails.incomes} onChange={(value, hasError) => handleOnChangeExist('incomes', value, hasError)} onEnter={handleSubmit} />
        <FormField type={"NUMBER"} key={keys.commitments} params={financialDetails.commitments} onChange={(value, hasError) => handleOnChangeExist('commitments', value, hasError)} onEnter={handleSubmit} />
    
        {showAdditionalFundingSources &&
            <article className="additional-funding-sources">
                <h3>{utilService.getPhrase("user_additional_funding_sources", phrases)}</h3><HelpIcon className='tooltip' sx={ IconSizes.Small } onClick={() => handleShowTooltip(utilService.getPhrase("property_additional_funding_sources_tooltip", phrases))} />
                <ul>
                    {
                        financialDetails.additionalFundingSources?.map((additionalFundingSource, index) =>
                            <li key={`additionalFundingSource${index}`}>
                                <FormField type={"STRING"} key={`additionalFundingSourceSource${index}`} params={additionalFundingSource.source} onChange={(value, hasError) => handleOnChangeExist(`additionalFundingSources.${index}.source`, value, hasError)} onEnter={handleSubmit} />
                                <FormField type={"NUMBER"} key={`additionalFundingSourceAmount${index}`} params={additionalFundingSource.amount} onChange={(value, hasError) => handleOnChangeExist(`additionalFundingSources.${index}.amount`, value, hasError)} onEnter={handleSubmit} />
                                <FormField type={"NUMBER"} key={`additionalFundingSourceRepayment${index}`} params={additionalFundingSource.repayment} onChange={(value, hasError) => handleOnChangeExist(`additionalFundingSources.${index}.repayment`, value, hasError)} onEnter={handleSubmit} />
                                <DeleteIcon className='icon-delete' sx={IconSizes.Small} title='מחק' onClick={() => handleOnDeleteExist(additionalFundingSource.uuid)} />
                            </li>
                        )
                    }

                    <li key={`additionalFundingSourceNew`}>
                        <FormField type={"STRING"} key={`additionalFundingSourceSource${financialDetails.additionalFundingSources?.length ?? 0}`} params={newAdditionalFundingSource.source} onChange={(value) => handleOnChangeNew('source', value)} onEnter={handleSubmit} />
                        <FormField type={"NUMBER"} key={`additionalFundingSourceAmount${financialDetails.additionalFundingSources?.length ?? 0}`} params={newAdditionalFundingSource.amount} onChange={(value) => handleOnChangeNew('amount', value)} onEnter={handleSubmit} />
                        <FormField type={"NUMBER"} key={`additionalFundingSourceRepayment${financialDetails.additionalFundingSources?.length ?? 0}`} params={newAdditionalFundingSource.repayment} onChange={(value) => handleOnChangeNew('repayment', value)} onEnter={handleSubmit} />
                        <AddAdditionalFundingSourceIcon className={`icon-add ${addNewAdditionalFundingSourceEnable ? 'enable' : 'disable'}`} sx={IconSizes.Small} title='הוסף' onClick={handleOnAddNew} />
                    </li>
                    
                </ul>
            </article>
        }
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