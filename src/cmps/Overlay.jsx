import PropTypes from 'prop-types'

export function Overlay({ onPress }) {   
    return (
        <div className="overlay" onClick={onPress} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPress() } role='button' tabIndex={0}></div>
    )
}

Overlay.propTypes = {
    onClick: PropTypes.func,
    onPress: PropTypes.func,
}