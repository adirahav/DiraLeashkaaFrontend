import React from 'react'
import { Header } from '../cmps/Header'
import { ImageUpload } from '../cmps/ImageUpload'

export function ImageUploadPage() {

    return (<>
        <Header />
        <main className="upload container">
            <ImageUpload />
        </main>
        <footer className='full'>
            <div>Footer</div>
        </footer>
    </>)
}
