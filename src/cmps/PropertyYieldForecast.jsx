import React, { useCallback, useState } from 'react'
import { Resizable } from 'react-resizable'
import Table from 'rc-table'
import { utilService } from '../services/util.service'
import 'react-resizable/css/styles.css'
import { useSplash } from '../contexts/SplashContext'

export function PropertyYieldForecast({data}) {   
    const buildHeaders = () => {
        return [
            {
                title: utilService.getPhrase('amortization_schedule_month_label', phrases),
                dataIndex: 'monthNo',
                key: 'monthNo',
                width: 45,
            },    
            {
                title: utilService.getPhrase('yield_forecast_property_price_label', phrases),
                dataIndex: 'propertyPrice',
                key: 'propertyPrice',
                width: 75,
            },
            {
                title: utilService.getPhrase('yield_forecast_rent_label', phrases),
                dataIndex: 'rent',
                key: 'rent',
                width: 65,
            },
            {
                title: utilService.getPhrase('yield_forecast_financing_costs_label', phrases),
                dataIndex: 'financingCosts',
                key: 'financingCosts',
                width: 65,
            },
            {
                title: utilService.getPhrase('yield_forecast_valuation_in_realization_label', phrases),
                dataIndex: 'valuationInRealization',
                key: 'valuationInRealization',
                width: 75,
            },
            {
                title: utilService.getPhrase('yield_forecast_commendation_tax_label', phrases),
                dataIndex: 'commendationTax',
                key: 'commendationTax',
                width: 65,
            },
            {
                title: utilService.getPhrase('yield_forecast_profit_label', phrases),
                dataIndex: 'profit',
                key: 'profit',
                width: 75,
            },
            {
                title: utilService.getPhrase('yield_forecast_total_return_label', phrases),
                dataIndex: 'totalReturn',
                key: 'totalReturn',
                width: 65,
            },
            {
                title: utilService.getPhrase('yield_forecast_return_on_equity_label', phrases),
                dataIndex: 'returnOnEquity',
                key: 'returnOnEquity',
                width: 65,
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

    const { splash } = useSplash()
    const phrases = splash?.phrases
    
    const [columns, setColumns] = useState(buildHeaders())
    
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
        propertyPrice: utilService.formatNumber(item.propertyPrice),
        rent: utilService.formatNumber(item.rent, true),
        financingCosts: utilService.formatNumber(item.financingCosts, true),
        valuationInRealization: utilService.formatNumber(item.valuationInRealization),
        commendationTax: utilService.formatNumber(item.commendationTax, true),
        profit: utilService.formatNumber(item.profit),
        totalReturn: utilService.formatFloat(item.totalReturn) + "%",
        returnOnEquity: utilService.formatFloat(item.returnOnEquity) + "%",   
    })) : []


    return (<>
        <h2>{utilService.getPhrase('property_yield_forecast_label', phrases)}</h2>  
        <section className="yield-forecast">
          <Table sticky={true} components={{ header: { cell: ResizableTitle } }} columns={mergedColumns} data={formattedData} />
        </section>
    </>) 
    
}


