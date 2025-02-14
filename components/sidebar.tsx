"use client"

import React, { useState, useEffect } from 'react';
import { OmaxIcon, OmaxMarkIcon } from './icons';
export const Sidebar = () => {
    // State for managing sidebar open/close state and width
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(16);

    // Effect to update sidebar width when isOpen state changes
    useEffect(() => {
        // Get sidebar element
        const sidebarElement =
            document.querySelector(".sidebar");
        if (sidebarElement) {
            // Calculate width based on isOpen state
            const width =
                isOpen ? sidebarElement.clientWidth : 0;
            setSidebarWidth(width);
        }
    }, [isOpen]);

    return (
        <div className={`absolute container flex`}>
            {/* Sidebar */}
            <div
                className={`sidebar
                    ${isOpen ? "sidebarOpen" : "sidebarClosed"
                    }`}
                // Adjusted width based on isOpen state
                style={{ width: isOpen ? '16rem' : '5rem' }}
            >
                {/* Sidebar content */}
                <ul className={"nav"}>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </div>
            {/* Main content */}
            <div
                className={`content
                  flex-1
                  ${isOpen ? "contentShifted" : "contentShiftedBack"
                    }`}>
                {/* Button to toggle sidebar */}

                {
                    isOpen ? <div onClick={() => setIsOpen(!isOpen)}>
                        <OmaxMarkIcon width={170} height={40} />
                    </div> :
                        <div onClick={() => setIsOpen(!isOpen)}>
                            <OmaxIcon size={40} />
                        </div>
                }

                {/* <button
                    className="toggleButton"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        // Adjusted button position based on sidebar width
                        left: isOpen ? `calc(${sidebarWidth}px + 20px)` : '20px'
                    }} >
                    {isOpen ? (
                        <svg className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button> */}
            </div>
        </div>
    );
};