import { FormField } from './FormField'
import PropTypes from "prop-types"

export function UserFinancialDetails({ financialDetails, onChange, onSubmit }) {   
    
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