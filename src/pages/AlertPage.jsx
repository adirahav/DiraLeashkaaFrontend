import React from 'react'
import { Header } from '../cmps/Header'
import { showErrorAlert, showMessageAlert, showWarningAlert, showSuccessAlert } from '../cmps/Alert'

export function AlertPage() {

    function showAlert(type) {
        switch (type) {
            case 'error':
                showErrorAlert({
                    message: 'Error alert example',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: false }, 
                })
                break;
            case 'message':
                showMessageAlert({
                    message: 'Message alert example',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: "Yes", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: true, text: "No", onPress: null, closeAfterPress: true }, 
                })
                break;
            case 'warning':
                showWarningAlert({
                    message: 'Warning alert example',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: false }, 
                    negativeButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                })
                break;
            case 'success':
                showSuccessAlert({
                    message: 'Success alert example',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: "Great", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: false }, 
                })
                break;
        }
        
    }

    return (<>
        <Header />
        <main className="home container">
            <p>
                <button onClick={() => { showAlert('error') }}>Show Error Alert</button>
                <button onClick={() => { showAlert('message') }}>Show Message Alert</button>
                <button onClick={() => { showAlert('warning') }}>Show Warning Alert</button>
                <button onClick={() => { showAlert('success') }}>Show Success Alert</button>
            </p>
        </main>
        <footer className='full'>
            <div>Footer</div>
        </footer>
    </>)
}
