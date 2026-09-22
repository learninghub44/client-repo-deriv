import React, { useEffect, useState, useRef } from 'react';
import { useDomainLoaderConfig } from '../useDomainLoaderConfig';
import { useLoaderProgress } from '../useLoaderProgress';
import { BootPreloader } from './BootPreloader';

interface DomainPreloaderProps {
    appReady?: boolean;
    disableSessionReduction?: boolean;
    minimumDuration?: number;
    maximumDuration?: number;
    onComplete: () => void;
}

export const DomainPreloader: React.FC<DomainPreloaderProps> = ({
    appReady = false,
    disableSessionReduction = false,
    minimumDuration = 3000,
    maximumDuration = 15000,
    onComplete,
}) => {
    const config = useDomainLoaderConfig();
    const [isExiting, setIsExiting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showReducedLoader, setShowReducedLoader] = useState(false);
    const completionFiredRef = useRef(false);

    // Check if this is a repeat visit in the same session
    useEffect(() => {
        if (disableSessionReduction) {
            return;
        }

        const hasLoaderShown = sessionStorage.getItem('siteLoaderShown');
        if (hasLoaderShown) {
            setShowReducedLoader(true);
        }
    }, [disableSessionReduction]);

    // Adjust duration for repeat visits
    const effectiveDuration = showReducedLoader ? 1500 : maximumDuration;
    const effectiveMinimum = showReducedLoader ? 500 : minimumDuration;

    const { progress } = useLoaderProgress({
        appReady: appReady || showReducedLoader,
        minimumDuration: effectiveMinimum,
        maximumDuration: effectiveDuration,
    });

    // Handle scroll lock
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalWidth = document.body.style.width;

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = originalWidth;
        };
    }, []);

    // Handle completion
    useEffect(() => {
        if (progress >= 100 && !completionFiredRef.current) {
            completionFiredRef.current = true;
            setIsComplete(true);
            setIsExiting(true);

            // Mark as shown for this session
            sessionStorage.setItem('siteLoaderShown', 'true');

            onComplete();
        }
    }, [progress, onComplete]);

    return (
        <BootPreloader
            progress={progress}
            siteName={config.siteName}
            subtitle={config.subtitle}
            messages={config.messages}
            bootLabel={config.bootLabel}
            backgroundImage={config.backgroundImage}
            primaryColor={config.primaryColor}
            accentColor={config.accentColor}
            isComplete={isComplete}
            isExiting={isExiting}
        />
    );
};
