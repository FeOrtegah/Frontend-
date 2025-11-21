// src/components/molecules/DynamicTable.jsx
import React from 'react';
import Image from '../atoms/Image';

function DynamicTable({ columns = [], data = [], className = '', striped = true, hover = true, emptyMessage = 'No hay datos disponibles', }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    const isArrayFormat = data.length > 0 && Array.isArray(data[0]);

    const isImageUrl = (str) => {
        if (!str || typeof str !== 'string') return false;
        return str.startsWith('http') || str.startsWith('/') || str.includes('.png') || str.includes('.jpg') || str.includes('.jpeg') || str.includes('.svg' || str.includes('.gif') || str.includes('.webp'));
    };

    return (
        <div className={`overflow-x-auto rounded-lg shadow-sm ${className}`}>
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        {columns.map((header, index) => (
                            <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {data.map((row, rowIndex) => {
                        const cells = isArrayFormat ? row : columns.map((col) => {
                            const key = col.toLowerCase();
                            return row[col] ?? row[key] ?? '';
                        });

                        return (
                            <tr key={row.id || rowIndex} className={`  ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : ''} ${hover ? 'hover:bg-gray-100' : ''} transition-colors`} >
                                {cells.map((cell, cellIndex) => {
                                    const header = columns[cellIndex];
                                    const headerLower = header.toLowerCase();

                                    const isImageColumn = headerLower.includes('logo') ||
                                        headerLower.includes('imagen') ||
                                        headerLower.includes('foto') ||
                                        headerLower.includes('avatar');

                                        const shouldShowImage = isImageColumn && isImageUrl(cell);
                                        
                                        return (
                                            <td key={cellIndex} className={`px-4 py-3 text-sm text-gray-900 align-top ${isImageColumn ? 'whitespace-normal' : 'whitespace-nowrap'} `}>
                                                {shouldShowImage ? ( 
                                                    <Image src={cell} alt={header} className="h-12 w-12 object-contain rounded-lg shadow-sm"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'block';
                                                        }}
                                                    />
                                                ) : null}
                                                <span className={shouldShowImage ? 'hidden' : ''}>
                                                    {cell}
                                                </span>
                                            </td>
                                        );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default DynamicTable;