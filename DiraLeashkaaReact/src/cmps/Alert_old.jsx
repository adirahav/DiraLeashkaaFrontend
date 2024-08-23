import { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";
import { Button } from "@mui/material";
import { IconSizes, SuccessIcon, ErrorIcon, WarningIcon, MessageIcon, CloseIcon} from '../assets/icons';

window.showSuccessAlert = showSuccessAlert;
window.showWarningAlert = showWarningAlert;
window.showErrorAlert = showErrorAlert;
window.showMessageAlert = showMessageAlert;

export function Alert() {

    const [displayAlert, setDisplayAlert] = useState(false);    
    const [type, setType] = useState('message');    // error | warning | success | message
    const [message, setMessage] = useState('');
    const [positiveButton, setPositiveButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true});
    const [negativeButton, setNegativeButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true});
    const [closeButton, setCloseButton] = useState({show: true, autoClose: true, autoCloseSeconds: 3});
    
    useEffect(() => {
        const unsubscribe = eventBusService.on('show-alert', (data) => {
            setType(data.type ?? type);
            setMessage(data.message);
            setPositiveButton({ ...positiveButton, ...data.positiveButton });
            setNegativeButton({ ...negativeButton, ...data.negativeButton });
            
            setCloseButton((prevCloseButton) => {
                const _closeButton = { ...closeButton, ...data.closeButton };
                
                if (_closeButton && _closeButton.autoClose) {
                    setTimeout(() => {
                        onClose();
                    }, _closeButton.autoCloseSeconds * 1000);
                }
    
                return _closeButton; 
            }); 

            setDisplayAlert(true);
        })

        return unsubscribe;
    }, [type, message, positiveButton, negativeButton, closeButton]);

    function onClose() {
        setType(null);
        setMessage(null);
        setPositiveButton(null);
        setNegativeButton(null);
        setCloseButton(null);
        setDisplayAlert(false);
    }

    function handleButton(button) {
        if (button === null) {
            return;
        }

        if (button.onPress !== null) {
            button.onPress();
        }
        
        if (button.closeAfterPress) {
            onClose();
        }
    }

    if (!displayAlert) return <></>;

    function getHeader() {  
        switch (type) {
            case "error":     return <><div><ErrorIcon sx={ IconSizes.Medium } /><h2>Error</h2></div></>;
            case "warning":   return <><div><WarningIcon sx={ IconSizes.Medium } /><h2>Warning</h2></div></>;
            case "success":   return <><div><SuccessIcon sx={ IconSizes.Medium } /><h2>Success</h2></div></>;
            case "message":   return <><div><MessageIcon sx={ IconSizes.Medium } /><h2>Message</h2></div></>;
            default: <></>
        }
    }

    return (
        <div className={"alert " + type}>
            <header>
                {getHeader()}
                {closeButton.show && <CloseIcon sx={ IconSizes.Small } onClick={onClose} />}
            </header>
            <section className="message">
                <p>{message.replace(/<br\s*\/?>/g, '\n')}</p>
            </section>
            <section className="buttons">
                {positiveButton.show && <Button variant="contained" className='positive' onClick={() => handleButton(positiveButton)}>{positiveButton.text}</Button>}
                {negativeButton.show && <Button variant="contained" className='negative' onClick={() => handleButton(negativeButton)}>{negativeButton.text}</Button>}
            </section>
        </div>
    );
}

function showAlert(data) {
    eventBusService.emit('show-alert', data);
}

export function showErrorAlert(data) {
    showAlert({ ...data, type: 'error' });
}

export function showWarningAlert(data) {
    showAlert({ ...data, type: 'warning' });
}

export function showSuccessAlert(data) {
    showAlert({ ...data, type: 'success' });
}

export function showMessageAlert(data) {
    showAlert({ ...data, type: 'message' });
}