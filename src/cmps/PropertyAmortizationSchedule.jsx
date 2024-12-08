import React, { useCallback, useState } from 'react'
import { Resizable } from 'react-resizable'
import Table from 'rc-table'
import { utilService } from '../services/util.service'
import 'react-resizable/css/styles.css'
import iconAmortizationScheduleOn from '../assets/images/icon_amortization_schedule_on.png'
import { useSplash } from '../contexts/SplashContext'

export function PropertyAmortizationSchedule({data}) {   
    const [columns, setColumns] = useState(buildHeaders())
    
    const { splash } = useSplash()
    const phrases = splash?.phrases

    const handleResize = useCallback(
        (index) => (e, { size }) => {
            setColumns((prevColumns) => {
                const nextColumns = [...prevColumns]
                nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
                }

                nextColumns[index].width = prevColumns[index].width - (size.width - prevColumns[index].width)
                
                return nextColumns
            })
            },
            []
        )

    const mergedColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width,
            onResize: handleResize(index),
        }),
        onCell: (record) => ({
            'data-value': record[col.dataIndex],
          }),
    }))

    const formattedData = data ? JSON.parse(data).map((item, index) => ({
        key: index,
        monthNo: item.monthNo,
        fundBop: utilService.formatNumber(item.fundBop),
        interest: utilService.formatFloat(item.interest) + "%",
        monthlyRepayments: utilService.formatNumber(item.monthlyRepayments, true),
        fundRefund: utilService.formatNumber(item.fundRefund, true),
        interestRepayment: utilService.formatNumber(item.interestRepayment, true),
        fundEop: utilService.formatNumber(item.fundEop),
    })) : []


      return (
        <section className="amortization-schedule">
          <h2 className="title"><img src={iconAmortizationScheduleOn} />{utilService.getPhrase('property_amortization_schedule_label', phrases)}</h2>  
          <Table sticky={true} components={{ header: { cell: ResizableTitle } }} columns={mergedColumns} data={formattedData} />
        </section>
      )
    
}

const buildHeaders = () => {
    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    return [
        {
            title: utilService.getPhrase('amortization_schedule_month_label', phrases),
            dataIndex: 'monthNo',
            key: 'monthNo',
            width: 45,
        },    
        {
            title: utilService.getPhrase('amortization_schedule_bop_fund_label', phrases),
            dataIndex: 'fundBop',
            key: 'fundBop',
            width: 95,
        },
        {
            title: utilService.getPhrase('amortization_schedule_interest_label', phrases),
            dataIndex: 'interest',
            key: 'interest',
            width: 75,
        },
        {
            title: utilService.getPhrase('amortization_schedule_monthly_repayments_label', phrases),
            dataIndex: 'monthlyRepayments',
            key: 'monthlyRepayments',
            width: 95,
        },
        {
            title: utilService.getPhrase('amortization_schedule_fund_refund_label', phrases),
            dataIndex: 'fundRefund',
            key: 'fundRefund',
            width: 95,
        },
        {
            title: utilService.getPhrase('amortization_schedule_interest_repayment_label', phrases),
            dataIndex: 'interestRepayment',
            key: 'interestRepayment',
            width: 95,
        },
        {
            title: utilService.getPhrase('amortization_schedule_eop_fund_label', phrases),
            dataIndex: 'fundEop',
            key: 'fundEop',
            width: 95,
        },
      ]
}

const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props
  
    if (!width) {
      return <th {...restProps} />
    }
  
    return (
      <Resizable width={width} height={0} onResize={onResize}>
        <th {...restProps} />
      </Resizable>
    )
}