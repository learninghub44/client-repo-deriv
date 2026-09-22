import React, { useMemo } from 'react';
import './BootPreloader.scss';

interface BootPreloaderProps {
    progress: number;
    siteName: string;
    subtitle: string;
    messages: string[];
    bootLabel?: string;
    backgroundImage?: string;
    primaryColor: string;
    accentColor: string;
    isComplete: boolean;
    isExiting: boolean;
}

export const BootPreloader: React.FC<BootPreloaderProps> = ({
    progress,
    siteName,
    subtitle,
    messages,
    bootLabel = 'Boot sequence',
    backgroundImage,
    primaryColor,
    accentColor,
    isComplete,
    isExiting,
}) => {
    const currentMessage = useMemo(() => {
        if (isComplete) return 'System ready. Launching application...';
        if (progress < 20) return messages[0] || 'Initializing...';
        if (progress < 40) return messages[1] || 'Connecting to trading services...';
        if (progress < 60) return messages[2] || 'Loading market analysis tools...';
        if (progress < 80) return messages[3] || 'Synchronizing live data...';
        if (progress < 95) return messages[4] || 'Preparing your dashboard...';
        return messages[5] || 'Launching application...';
    }, [progress, messages, isComplete]);

    const cssVariables = {
        '--boot-primary': primaryColor,
        '--boot-accent': accentColor,
        '--boot-bg-image': backgroundImage ? `url(${backgroundImage})` : undefined,
    } as React.CSSProperties;

    return (
        <div
            className={`boot-preloader ${isExiting ? 'boot-preloader--exiting' : ''}`}
            style={cssVariables}
            role='status'
            aria-live='polite'
            aria-label={`${siteName} is loading`}
        >
            <div className={`boot-preloader__scene ${backgroundImage ? '' : 'boot-preloader__scene--generated'}`}>
                {!backgroundImage && (
                    <>
                        <div className='boot-preloader__scene-glow' />
                        <div className='boot-preloader__scene-grid' />
                        <div className='boot-preloader__scene-network' />
                    </>
                )}
            </div>
            <div className='boot-preloader__scrim' />

            <div className='boot-preloader__card'>
                <h1 className='boot-preloader__title'>{siteName}</h1>
                <p className='boot-preloader__subtitle'>{subtitle}</p>

                <div className='boot-preloader__dots' aria-hidden='true'>
                    <span className='boot-preloader__dot' />
                    <span className='boot-preloader__dot' />
                    <span className='boot-preloader__dot' />
                </div>

                <div className='boot-preloader__status' key={currentMessage}>
                    {currentMessage}
                </div>

                <div className='boot-preloader__bar-track'>
                    <div className='boot-preloader__bar-fill' style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>

                <div className='boot-preloader__meta'>
                    <span>{bootLabel}</span>
                    <span>{Math.round(Math.min(progress, 100))}%</span>
                </div>
            </div>
        </div>
    );
};
