import { IconSizes, CloseIcon} from '../assets/icons'
import { useDispatch, useSelector } from "react-redux"
import { GET_MODAL_DATA } from "../store/reducers/app.reducer"
import { useEffect, useRef } from "react"

export function DynamicModal() {
    const modalData = useSelector((storeState) => storeState.appModule.modalData)
    const dispatch = useDispatch()
    const modalRef = useRef()

    useEffect(() => {

        if (modalData) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }

    }, [modalData])

    function onCloseModel() {
        dispatch({
            type: GET_MODAL_DATA, 
            modalData: null
        })
    }

    if (!modalData) return <></>

    const Cmp = modalData?.cmp

    function onCloseModal() {
        dispatch({ type: GET_MODAL_DATA, modalData: null })
    }

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            onCloseModal()
        }
    }
    
    return (
        <div ref={modalRef} className="dynamic-modal">
            <header>
                <CloseIcon sx={ IconSizes.Small } onClick={onCloseModel} />
            </header>
            <section className="content">
                {Cmp && <Cmp {...modalData.props} />}
            </section>
        </div>
    )
}