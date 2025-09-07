import { FormField } from './FormField'
import PropTypes from "prop-types"

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

UserTermsOfUse.propTypes = {
  termsOfUse: PropTypes.shape({
    accept: PropTypes.oneOfType([
      PropTypes.shape({
        value: PropTypes.oneOfType([ PropTypes.bool, PropTypes.oneOf([null]),]),
      }),
      PropTypes.oneOf([null]),
    ]),
    text: PropTypes.oneOfType([ PropTypes.string, PropTypes.oneOf([null]),
    ]),
  }).isRequired,
  onChange: PropTypes.func,
}
