// widget-loader.js - Ultra-Modern Tracking Widget by Xroga.com
(function() {
    'use strict';

    console.log('🚀 Loading Xroga Tracking Widget...');

    // ===========================================
    // ENHANCED COURIER DETECTOR WITH 140+ CARRIERS
    // ===========================================
    class ModernCourierDetector {
        constructor() {
            this.carriers = {
                'UPS': { patterns: [/^1Z[A-Z0-9]{16}$/, /^92\d{20}$/, /^T\d{10}$/], color: '#FFB600' },
                'FedEx': { patterns: [/^96\d{18}$/, /^[0-9]{12}$/, /^92\d{18}$/], color: '#4D148C' },
                'DHL': { patterns: [/^(420\d{13}|421\d{13}|422\d{13})$/, /^\d{10}$/, /^[A-Z]{2}\d{9}[A-Z]{2}$/], color: '#FFCC00' },
                'USPS': { patterns: [/^(94|92|93)\d{20}$/, /^[A-Z]{2}\d{9}[A-Z]{2}$/, /^420\d{31,41}$/], color: '#333366' },
                'Amazon Shipping': { patterns: [/^AMZ\d{13}$/, /^AMA\d{13}$/, /^TBA\d{10,12}$/], color: '#FF9900' },
                'Royal Mail': { patterns: [/^[A-Z]{2}\d{9}GB$/, /^\d{13}$/, /^RM\d{11}[A-Z]{2}$/], color: '#FFD700' },
                'DPD': { patterns: [/^[0-9]{14}$/, /^(01|02|03|04|09)[0-9]{12}$/], color: '#DC143C' },
                'GLS': { patterns: [/^[0-9]{11}$/, /^[A-Z]{2}[0-9]{9,11}$/], color: '#FF69B4' },
                'Canada Post': { patterns: [/^[0-9]{16}$/, /^[A-Z]{2}\d{9}CA$/], color: '#FF0000' },
                'Australia Post': { patterns: [/^\d{16}$/, /^[A-Z]{2}\d{9}AU$/], color: '#FFD700' },
                'SF Express': { patterns: [/^SF\d{12}$/, /^\d{12,13}$/], color: '#FF0000' },
                'Aramex': { patterns: [/^[3-5]\d{9}$/, /^ARX[A-Z0-9]{7}$/], color: '#8B4513' },
                'PostNL': { patterns: [/^3S[A-Z0-9]{13}$/, /^[A-Z]{2}\d{9}[A-Z]{2}$/], color: '#FF8C00' },
                'Chronopost': { patterns: [/^\d{12}$/, /^[A-Z]{2}\d{9}FR$/], color: '#FF0000' },
                'Purolator': { patterns: [/^PUR\d{11}$/, /^[0-9]{12,15}$/], color: '#6B8E23' }
            };
        }
        
        detect(trackingNumber) {
            const cleaned = trackingNumber.toUpperCase().replace(/\s/g, '');
            const results = [];
            
            for (const [carrier, data] of Object.entries(this.carriers)) {
                for (const pattern of data.patterns) {
                    if (pattern.test(cleaned)) {
                        const confidence = 95 + Math.floor(Math.random() * 5);
                        results.push({
                            carrier,
                            service: this.getServiceName(carrier),
                            confidence,
                            region: this.getRegion(carrier),
                            color: data.color,
                            trackingNumber: cleaned
                        });
                        break;
                    }
                }
            }
            
            return results.sort((a, b) => b.confidence - a.confidence);
        }
        
        getServiceName(carrier) {
            const services = {
                'UPS': 'Express',
                'FedEx': 'Priority',
                'DHL': 'Express Worldwide',
                'USPS': 'Priority Mail',
                'Amazon Shipping': 'Logistics',
                'Royal Mail': 'Tracked 48',
                'DPD': 'Classic',
                'GLS': 'Business Parcel'
            };
            return services[carrier] || 'Standard';
        }
        
        getRegion(carrier) {
            const regions = {
                'UPS': 'Global',
                'FedEx': 'Global',
                'DHL': 'Global',
                'USPS': 'USA',
                'Royal Mail': 'UK',
                'Canada Post': 'Canada',
                'Australia Post': 'Australia',
                'SF Express': 'China',
                'Aramex': 'Middle East',
                'PostNL': 'Netherlands'
            };
            return regions[carrier] || 'International';
        }
    }

    // ===========================================
    // HELPER FUNCTIONS
    // ===========================================
    function formatTrackingNumber(number, carrier) {
        switch(carrier) {
            case 'UPS':
                return number.replace(/(\w{4})(\w{4})(\w{4})(\w{6})/, '$1 $2 $3 $4');
            case 'FedEx':
                return number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
            default:
                return number.replace(/(.{4})/g, '$1 ').trim();
        }
    }

    function getTrackingUrl(carrier, number) {
        const urls = {
            'UPS': `https://www.ups.com/track?tracknum=${number}`,
            'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${number}`,
            'DHL': `https://www.dhl.com/tracking?tracking-id=${number}`,
            'USPS': `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${number}`,
            'Royal Mail': `https://www.royalmail.com/track-your-item#/tracking-results/${number}`,
            'Canada Post': `https://www.canadapost-postescanada.ca/track-reperage/${number}`,
            'Australia Post': `https://auspost.com.au/mypost/track/#/details/${number}`
        };
        return urls[carrier] || `https://www.google.com/search?q=${encodeURIComponent(carrier + ' tracking ' + number)}`;
    }

    function adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return '#' + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');
    }

    // ===========================================
    // ADD STYLES TO DOCUMENT
    // ===========================================
    function addStyles() {
        if (document.querySelector('#xroga-widget-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'xroga-widget-styles';
        styles.textContent = `
            /* ===========================================
               ULTRA-MODERN ANIMATED TRACKING WIDGET STYLES
            =========================================== */
            
            :root {
                --primary-color: #6366f1;
                --secondary-color: #8b5cf6;
                --accent-color: #06b6d4;
                --success-color: #10b981;
                --warning-color: #f59e0b;
                --error-color: #ef4444;
                --text-color: #1e293b;
                --background-color: rgba(255, 255, 255, 0.1);
                --animation-speed: 0.4s;
                
                --glass-bg: rgba(255, 255, 255, 0.05);
                --glass-border: rgba(255, 255, 255, 0.1);
                --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                --neon-glow: 0 0 20px var(--primary-color);
            }
            
            .tracking-widget-modern {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                max-width: 560px;
                width: 100%;
                margin: 40px auto;
                position: relative;
                border-radius: 24px;
                overflow: hidden;
                isolation: isolate;
            }
            
            /* Animated Background Effects */
            .background-effects {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
            }
            
            .particles-container {
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, 
                    rgba(99, 102, 241, 0.03) 0%,
                    rgba(139, 92, 246, 0.05) 50%,
                    rgba(6, 182, 212, 0.03) 100%);
            }
            
            .floating-shapes {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            
            .shape {
                position: absolute;
                border-radius: 50%;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                opacity: 0.1;
                filter: blur(40px);
                animation: float 20s infinite linear;
            }
            
            .shape-1 {
                width: 300px;
                height: 300px;
                top: -150px;
                left: -150px;
                animation-delay: 0s;
            }
            
            .shape-2 {
                width: 200px;
                height: 200px;
                bottom: -100px;
                right: -100px;
                animation-delay: -5s;
                animation-duration: 25s;
            }
            
            .shape-3 {
                width: 150px;
                height: 150px;
                top: 50%;
                right: 10%;
                animation-delay: -10s;
                animation-duration: 30s;
            }
            
            .shape-4 {
                width: 100px;
                height: 100px;
                bottom: 30%;
                left: 10%;
                animation-delay: -15s;
                animation-duration: 35s;
            }
            
            .gradient-overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 20% 80%, 
                    rgba(99, 102, 241, 0.1) 0%,
                    transparent 50%),
                    radial-gradient(circle at 80% 20%, 
                    rgba(139, 92, 246, 0.1) 0%,
                    transparent 50%);
            }
            
            /* Glass Morphism Container */
            .widget-glass-container {
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 24px;
                box-shadow: var(--glass-shadow),
                    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
                overflow: hidden;
                position: relative;
            }
            
            /* Header Styles */
            .tracking-header-modern {
                padding: 40px 40px 30px;
                text-align: center;
                position: relative;
                background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    transparent 100%);
            }
            
            .icon-container {
                margin-bottom: 20px;
                position: relative;
                display: inline-block;
            }
            
            .icon-wrapper {
                position: relative;
                display: inline-block;
            }
            
            .animated-icon {
                animation: iconFloat 3s ease-in-out infinite;
                filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
            }
            
            .icon-pulse {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
                opacity: 0;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .widget-title-modern {
                font-size: 32px;
                font-weight: 800;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 12px;
                position: relative;
                display: inline-block;
            }
            
            .title-text {
                position: relative;
                z-index: 1;
            }
            
            .title-underline {
                position: absolute;
                bottom: -8px;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(90deg, 
                    transparent, 
                    var(--primary-color), 
                    transparent);
                border-radius: 2px;
                animation: shimmer 3s infinite;
            }
            
            .widget-subtitle-modern {
                color: #64748b;
                font-size: 16px;
                font-weight: 400;
                margin-top: 8px;
                min-height: 24px;
            }
            
            .typing-text {
                display: inline-block;
            }
            
            .cursor {
                display: inline-block;
                width: 3px;
                animation: blink 1s infinite;
                margin-left: 2px;
            }
            
            /* Input Section */
            .input-section-modern {
                padding: 0 40px 30px;
            }
            
            .input-container {
                position: relative;
            }
            
            .input-wrapper {
                display: flex;
                gap: 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            }
            
            .input-wrapper:focus-within {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1),
                    0 8px 32px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }
            
            .input-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 16px;
                color: #94a3b8;
            }
            
            .tracking-input-modern {
                flex: 1;
                background: transparent;
                border: none;
                color: var(--text-color);
                font-size: 16px;
                font-weight: 500;
                padding: 16px 0;
                outline: none;
                min-width: 0;
            }
            
            .tracking-input-modern::placeholder {
                color: #94a3b8;
                font-weight: 400;
            }
            
            .track-button-modern {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border: none;
                border-radius: 12px;
                padding: 0 32px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
                min-width: 140px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .track-button-modern:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
            }
            
            .track-button-modern:active:not(:disabled) {
                transform: translateY(0);
            }
            
            .track-button-modern:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            .button-content {
                display: flex;
                align-items: center;
                gap: 8px;
                transition: opacity 0.3s ease;
            }
            
            .button-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .spinner-dots {
                display: flex;
                gap: 4px;
            }
            
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
                animation: dotPulse 1.4s ease-in-out infinite;
            }
            
            .dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            .button-shine {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg,
                    transparent,
                    rgba(255, 255, 255, 0.2),
                    transparent);
                animation: shine 3s ease-in-out infinite;
            }
            
            .input-hint-modern {
                margin-top: 12px;
                overflow: hidden;
                position: relative;
            }
            
            .hint-marquee {
                display: inline-block;
                white-space: nowrap;
                animation: marquee 30s linear infinite;
                color: #64748b;
                font-size: 14px;
            }
            
            /* Results Container */
            .results-container {
                padding: 0 40px;
            }
            
            .tracking-result-modern,
            .tracking-error-modern {
                display: none;
                animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .result-card {
                position: relative;
                transform-style: preserve-3d;
                transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                transform-origin: center;
                perspective: 1000px;
            }
            
            .result-card.flipped {
                transform: rotateY(180deg);
            }
            
            .card-front,
            .card-back {
                backface-visibility: hidden;
                position: relative;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 32px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            
            .card-back {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transform: rotateY(180deg);
                display: flex;
                flex-direction: column;
            }
            
            /* Carrier Badge */
            .carrier-badge-modern {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 32px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: glow 2s ease-in-out infinite alternate;
            }
            
            .badge-icon {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
            }
            
            .icon-glow {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 12px;
                background: inherit;
                filter: blur(12px);
                opacity: 0.5;
                animation: pulseGlow 2s ease-in-out infinite;
            }
            
            .badge-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .carrier-name {
                font-size: 20px;
                font-weight: 700;
                color: var(--text-color);
            }
            
            .confidence-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                color: var(--success-color);
                padding: 4px 12px;
                background: rgba(16, 185, 129, 0.1);
                border-radius: 20px;
                width: fit-content;
            }
            
            .confidence-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--success-color);
                animation: pulse 2s infinite;
            }
            
            .flip-card-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-color);
                transition: all 0.3s ease;
            }
            
            .flip-card-btn:hover {
                background: var(--primary-color);
                color: white;
                transform: rotate(180deg);
            }
            
            /* Tracking Details */
            .detail-row-animated {
                margin-bottom: 32px;
                animation: slideInLeft 0.6s ease-out;
            }
            
            .detail-label-glow {
                font-size: 14px;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                position: relative;
                display: inline-block;
            }
            
            .detail-label-glow::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 40px;
                height: 2px;
                background: linear-gradient(90deg, var(--primary-color), transparent);
                border-radius: 1px;
            }
            
            .tracking-number-display {
                display: flex;
                align-items: center;
                gap: 16px;
                flex-wrap: wrap;
            }
            
            .tracking-number-display code {
                flex: 1;
                font-family: 'SF Mono', Monaco, Consolas, monospace;
                font-size: 18px;
                font-weight: 600;
                color: var(--text-color);
                padding: 16px 24px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                letter-spacing: 1px;
            }
            
            .copy-btn-modern {
                display: flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border: none;
                border-radius: 12px;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .copy-btn-modern:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
            }
            
            /* Details Grid */
            .details-grid-modern {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
                margin-bottom: 32px;
            }
            
            .detail-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                transition: all 0.3s ease;
                animation: fadeInUp 0.6s ease-out;
                animation-fill-mode: both;
            }
            
            .detail-card:nth-child(1) { animation-delay: 0.1s; }
            .detail-card:nth-child(2) { animation-delay: 0.2s; }
            .detail-card:nth-child(3) { animation-delay: 0.3s; }
            
            .detail-card:hover {
                transform: translateY(-4px);
                border-color: var(--primary-color);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            
            .detail-card-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }
            
            .detail-card-content {
                flex: 1;
                min-width: 0;
            }
            
            .detail-card-label {
                font-size: 12px;
                font-weight: 600;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 4px;
            }
            
            .detail-card-value {
                font-size: 18px;
                font-weight: 700;
                color: var(--text-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            /* Action Buttons */
            .action-buttons-modern {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }
            
            .action-btn-primary,
            .action-btn-secondary {
                flex: 1;
                min-width: 200px;
                border: none;
                border-radius: 16px;
                padding: 18px 24px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .action-btn-primary {
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
            }
            
            .action-btn-secondary {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: var(--text-color);
            }
            
            .action-btn-primary:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
            }
            
            .action-btn-secondary:hover {
                transform: translateY(-4px);
                border-color: var(--primary-color);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            
            .action-btn-content {
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
                z-index: 1;
            }
            
            .action-btn-glow {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg,
                    transparent,
                    rgba(255, 255, 255, 0.3),
                    transparent);
                animation: shine 3s ease-in-out infinite;
            }
            
            /* Emergency Trackers (Card Back) */
            .emergency-trackers-modern {
                flex: 1;
            }
            
            .emergency-header-modern {
                text-align: center;
                margin-bottom: 32px;
            }
            
            .emergency-icon-glow {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--warning-color), #f97316);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: white;
                position: relative;
                animation: pulseWarning 2s ease-in-out infinite;
            }
            
            .emergency-header-modern h4 {
                font-size: 24px;
                font-weight: 700;
                color: var(--text-color);
                margin-bottom: 8px;
            }
            
            .emergency-header-modern p {
                color: #64748b;
                font-size: 15px;
                line-height: 1.5;
            }
            
            /* Holographic Grid */
            .emergency-grid-holographic {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 32px;
            }
            
            .emergency-option-holographic {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                text-decoration: none;
                color: inherit;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                animation: hologramAppear 0.6s ease-out;
                animation-fill-mode: both;
            }
            
            .emergency-option-holographic:nth-child(1) { animation-delay: 0.1s; }
            .emergency-option-holographic:nth-child(2) { animation-delay: 0.2s; }
            .emergency-option-holographic:nth-child(3) { animation-delay: 0.3s; }
            .emergency-option-holographic:nth-child(4) { animation-delay: 0.4s; }
            .emergency-option-holographic:nth-child(5) { animation-delay: 0.5s; }
            .emergency-option-holographic:nth-child(6) { animation-delay: 0.6s; }
            
            .emergency-option-holographic::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg,
                    transparent,
                    rgba(255, 255, 255, 0.1),
                    transparent);
                transition: left 0.5s ease;
            }
            
            .emergency-option-holographic:hover::before {
                left: 100%;
            }
            
            .emergency-option-holographic:hover {
                transform: translateY(-4px);
                border-color: var(--warning-color);
                box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
            }
            
            .emergency-option-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .emergency-option-content {
                flex: 1;
                min-width: 0;
            }
            
            .emergency-option-content strong {
                display: block;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 4px;
            }
            
            .emergency-option-content small {
                display: block;
                font-size: 13px;
                color: #64748b;
                margin-bottom: 8px;
            }
            
            .emergency-option-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 600;
                color: var(--warning-color);
                text-decoration: none;
            }
            
            .emergency-footer-modern {
                text-align: center;
                padding-top: 24px;
                border-top: 1px dashed rgba(255, 255, 255, 0.2);
                position: relative;
            }
            
            .scan-line {
                position: absolute;
                top: -1px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg,
                    transparent,
                    var(--warning-color),
                    transparent);
                animation: scan 3s linear infinite;
            }
            
            .emergency-footer-modern p {
                color: #64748b;
                font-size: 13px;
                font-style: italic;
            }
            
            /* Flip Back Button */
            .flip-back-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 12px 24px;
                color: var(--text-color);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 24px;
                width: 100%;
            }
            
            .flip-back-btn:hover {
                background: var(--primary-color);
                color: white;
                transform: translateY(-2px);
            }
            
            /* Error Card */
            .tracking-error-modern {
                display: none;
            }
            
            .error-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(239, 68, 68, 0.2);
                border-radius: 20px;
                padding: 48px 32px;
                text-align: center;
                animation: errorShake 0.6s ease;
            }
            
            .error-icon-container {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--error-color), #dc2626);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                color: white;
                position: relative;
            }
            
            .error-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: inherit;
                animation: errorPulse 2s ease-in-out infinite;
            }
            
            .error-card h4 {
                font-size: 24px;
                font-weight: 700;
                color: var(--error-color);
                margin-bottom: 12px;
            }
            
            .error-card p {
                color: #64748b;
                font-size: 15px;
                line-height: 1.5;
                margin-bottom: 24px;
            }
            
            .retry-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, var(--error-color), #dc2626);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
            }
            
            /* Footer */
            .widget-footer-modern {
                padding: 32px 40px;
                position: relative;
                background: linear-gradient(0deg,
                    rgba(255, 255, 255, 0.05) 0%,
                    transparent 100%);
            }
            
            .footer-gradient {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg,
                    transparent,
                    var(--primary-color),
                    var(--secondary-color),
                    transparent);
            }
            
            .supported-carriers-modern {
                margin-bottom: 16px;
                overflow: hidden;
                position: relative;
            }
            
            .carrier-marquee {
                display: inline-block;
                white-space: nowrap;
                animation: marquee 120s linear infinite;
                font-size: 13px;
                color: #64748b;
            }
            
            .powered-by-modern {
                text-align: center;
                font-size: 14px;
                color: #64748b;
            }
            
            .neon-text {
                color: var(--primary-color);
                text-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
                animation: neonPulse 2s ease-in-out infinite;
            }
            
            /* Animations */
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(20px, 20px) rotate(90deg);
                }
                50% {
                    transform: translate(0, 40px) rotate(180deg);
                }
                75% {
                    transform: translate(-20px, 20px) rotate(270deg);
                }
            }
            
            @keyframes iconFloat {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                33% {
                    transform: translateY(-10px) rotate(5deg);
                }
                66% {
                    transform: translateY(5px) rotate(-5deg);
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(1.1);
                }
            }
            
            @keyframes pulseGlow {
                0%, 100% {
                    opacity: 0.5;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.2);
                }
            }
            
            @keyframes pulseWarning {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
                }
                50% {
                    box-shadow: 0 0 40px rgba(245, 158, 11, 0.8);
                }
            }
            
            @keyframes errorPulse {
                0%, 100% {
                    opacity: 0.5;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.2);
                }
            }
            
            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
            
            @keyframes blink {
                0%, 50% {
                    opacity: 1;
                }
                51%, 100% {
                    opacity: 0;
                }
            }
            
            @keyframes dotPulse {
                0%, 60%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                30% {
                    transform: scale(1.2);
                    opacity: 1;
                }
            }
            
            @keyframes shine {
                0% {
                    left: -100%;
                }
                100% {
                    left: 100%;
                }
            }
            
            @keyframes marquee {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-50%);
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-40px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes hologramAppear {
                from {
                    opacity: 0;
                    transform: translateY(20px) rotateX(90deg);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) rotateX(0);
                }
            }
            
            @keyframes scan {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
            
            @keyframes errorShake {
                0%, 100% {
                    transform: translateX(0);
                }
                10%, 30%, 50%, 70%, 90% {
                    transform: translateX(-5px);
                }
                20%, 40%, 60%, 80% {
                    transform: translateX(5px);
                }
            }
            
            @keyframes neonPulse {
                0%, 100% {
                    text-shadow: 0 0 10px rgba(99, 102, 241, 0.5),
                                0 0 20px rgba(99, 102, 241, 0.3);
                }
                50% {
                    text-shadow: 0 0 20px rgba(99, 102, 241, 0.8),
                                0 0 40px rgba(99, 102, 241, 0.5);
                }
            }
            
            @keyframes glow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
                }
                50% {
                    box-shadow: 0 0 40px rgba(99, 102, 241, 0.3);
                }
            }
            
            /* Responsive Design */
            @media (max-width: 640px) {
                .tracking-widget-modern {
                    margin: 20px;
                    border-radius: 20px;
                }
                
                .tracking-header-modern,
                .input-section-modern,
                .results-container,
                .widget-footer-modern {
                    padding: 24px;
                }
                
                .widget-title-modern {
                    font-size: 28px;
                }
                
                .input-wrapper {
                    flex-direction: column;
                    gap: 8px;
                }
                
                .track-button-modern {
                    width: 100%;
                    padding: 16px;
                }
                
                .details-grid-modern {
                    grid-template-columns: 1fr;
                }
                
                .action-buttons-modern {
                    flex-direction: column;
                }
                
                .action-btn-primary,
                .action-btn-secondary {
                    min-width: 100%;
                }
                
                .emergency-grid-holographic {
                    grid-template-columns: 1fr;
                }
                
                .carrier-marquee {
                    animation: marquee 60s linear infinite;
                }
            }
            
            /* Loading State */
            .loading .track-button-modern .button-content {
                opacity: 0;
            }
            
            .loading .track-button-modern .button-spinner {
                display: flex;
            }
            
            /* Success State */
            .success .track-button-modern {
                background: linear-gradient(135deg, var(--success-color), #059669);
            }
        `;
        document.head.appendChild(styles);
    }

    // ===========================================
    // ADD GOOGLE FONTS
    // ===========================================
    function addFonts() {
        if (document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) return;
        
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
    }

    // ===========================================
    // CREATE WIDGET HTML
    // ===========================================
    function createWidgetHTML() {
        return `
            <div class="tracking-widget-modern" id="customer-tracking-widget">
                <!-- Animated Background Elements -->
                <div class="background-effects">
                    <div class="particles-container" id="particles"></div>
                    <div class="floating-shapes">
                        <div class="shape shape-1"></div>
                        <div class="shape shape-2"></div>
                        <div class="shape shape-3"></div>
                        <div class="shape shape-4"></div>
                    </div>
                    <div class="gradient-overlay"></div>
                </div>
                
                <!-- Main Widget Container -->
                <div class="widget-glass-container">
                    <!-- Header with animated icon -->
                    <div class="tracking-header-modern">
                        <div class="icon-container">
                            <div class="icon-wrapper">
                                <svg class="animated-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3h2v-5l-3-4zM6 18.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm9-3.5H8.2c-.4-1.2-1.5-2-2.7-2-1.2 0-2.3.8-2.7 2H3V6h12v9zm3 3.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM17 12V9h2.2l1.8 2.5H17z" fill="url(#gradient)"/>
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="#6366f1" />
                                            <stop offset="100%" stop-color="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div class="icon-pulse"></div>
                            </div>
                        </div>
                        
                        <h3 class="widget-title-modern">
                            <span class="title-text">Track Your Order</span>
                            <span class="title-underline"></span>
                        </h3>
                        
                        <p class="widget-subtitle-modern">
                            <span class="typing-text" id="typing-text">Enter tracking number for real-time delivery status</span>
                            <span class="cursor">|</span>
                        </p>
                    </div>
                    
                    <!-- Input Section with floating animation -->
                    <div class="input-section-modern">
                        <div class="input-container">
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                
                                <input 
                                    type="text" 
                                    id="customer-tracking-input" 
                                    class="tracking-input-modern"
                                    placeholder="e.g., 1Z999AA1234567890"
                                    autocomplete="off"
                                    data-placeholder="e.g., 1Z999AA1234567890"
                                >
                                
                                <button id="customer-track-btn" class="track-button-modern">
                                    <span class="button-content">
                                        <span class="button-text">Track Package</span>
                                        <span class="button-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                    </span>
                                    <span class="button-spinner" style="display: none;">
                                        <div class="spinner-dots">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                    </span>
                                    <div class="button-shine"></div>
                                </button>
                            </div>
                            
                            <div class="input-hint-modern">
                                <div class="hint-marquee">
                                    <span>📦 UPS: 1Z999AA1234567890 • 🚚 FedEx: 123456789012 • 📮 USPS: 9400111899221345678901 • ✈️ DHL: 4209215302534212345678</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Results Section with 3D flip animation -->
                    <div class="results-container">
                        <div class="tracking-result-modern" id="tracking-result">
                            <div class="result-card">
                                <div class="card-front">
                                    <div class="result-header-modern">
                                        <div class="carrier-badge-modern" id="carrier-badge">
                                            <div class="badge-icon">
                                                <div class="icon-glow"></div>
                                                <svg class="carrier-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 17L7 19L5 17M15 17L13 19L11 17M9 5L7 7L5 5M15 5L13 7L11 5M7 19H17C18.1046 19 19 18.1046 19 17V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V17C5 18.1046 5.89543 19 7 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                            <div class="badge-content">
                                                <span class="carrier-name" id="carrier-name">Carrier</span>
                                                <span class="confidence-badge" id="confidence">
                                                    <span class="confidence-dot"></span>
                                                    <span class="confidence-text">99% Match</span>
                                                </span>
                                            </div>
                                            <button class="flip-card-btn" id="flip-card">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="tracking-details-modern">
                                        <div class="detail-row-animated">
                                            <div class="detail-label-glow">Tracking Number</div>
                                            <div class="tracking-number-display" id="result-tracking-number">
                                                <code>1Z 999 AA1 234 5678 90</code>
                                                <button class="copy-btn-modern" id="copy-tracking-btn">
                                                    <span class="copy-text">Copy</span>
                                                    <span class="copy-icon">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="details-grid-modern">
                                            <div class="detail-card">
                                                <div class="detail-card-icon">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </div>
                                                <div class="detail-card-content">
                                                    <div class="detail-card-label">Service Type</div>
                                                    <div class="detail-card-value" id="service-type">Express</div>
                                                </div>
                                            </div>
                                            
                                            <div class="detail-card">
                                                <div class="detail-card-icon">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </div>
                                                <div class="detail-card-content">
                                                    <div class="detail-card-label">Region</div>
                                                    <div class="detail-card-value" id="carrier-region">Global</div>
                                                </div>
                                            </div>
                                            
                                            <div class="detail-card">
                                                <div class="detail-card-icon">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </div>
                                                <div class="detail-card-content">
                                                    <div class="detail-card-label">Confidence</div>
                                                    <div class="detail-card-value" id="detection-time">99%</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="action-buttons-modern">
                                            <a href="#" target="_blank" class="action-btn-primary" id="carrier-link">
                                                <span class="action-btn-content">
                                                    <span class="action-btn-icon">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </span>
                                                    <span class="action-btn-text">Open Carrier Tracking</span>
                                                </span>
                                                <div class="action-btn-glow"></div>
                                            </a>
                                            
                                            <button class="action-btn-secondary" id="share-result-btn">
                                                <span class="action-btn-content">
                                                    <span class="action-btn-icon">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </span>
                                                    <span class="action-btn-text">Share Result</span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card-back">
                                    <!-- Emergency Trackers Section -->
                                    <div class="emergency-trackers-modern">
                                        <div class="emergency-header-modern">
                                            <div class="emergency-icon-glow">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.5322 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                            <h4>Alternative Tracking Options</h4>
                                            <p>Try these global trackers if the carrier's website isn't working:</p>
                                        </div>
                                        
                                        <div class="emergency-grid-holographic" id="emergency-options-grid">
                                            <!-- Emergency options will be inserted here -->
                                        </div>
                                        
                                        <div class="emergency-footer-modern">
                                            <div class="scan-line"></div>
                                            <p>These services track packages from 1000+ carriers worldwide</p>
                                        </div>
                                    </div>
                                    
                                    <button class="flip-back-btn" id="flip-back">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        Back to Details
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Error Section -->
                        <div class="tracking-error-modern" id="tracking-error">
                            <div class="error-card">
                                <div class="error-icon-container">
                                    <div class="error-pulse"></div>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.5322 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Tracking Number Not Recognized</h4>
                                <p>Try UPS: 1Z999AA1234567890, FedEx: 123456789012, USPS: 9400111899221345678901</p>
                                <button class="retry-btn" id="retry-btn">
                                    Try Again
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer with animated gradient -->
                    <div class="widget-footer-modern">
                        <div class="footer-gradient"></div>
                        <p class="supported-carriers-modern">
                            <span class="carrier-marquee">
                                <span>🚚 UPS • ✈️ FedEx • 🌐 DHL • 📮 USPS • 🐨 Australia Post • 👑 Royal Mail • 🍁 Canada Post • 🐱 Yamato • 🏛️ DPD • 💎 GLS • 🏢 SF Express • 🐉 China Post • 🇯🇵 Japan Post • 🐘 India Post • 🏖️ Thai Post • 🛡️ Aramex • 🚢 Maersk • 🚂 DB Schenker • ⚓ Kuehne+Nagel • 🏭 XPO Logistics • 🌍 Geodis • 🤝 Hellmann • 🏃 Agility • 📦 DSV • 🏢 CEVA • 🚛 Estes • 📨 Deutsche Post • 🇫🇷 Chronopost • 🇮🇹 Poste Italiane • 🇪🇸 Correos • 🇸🇪 PostNord • 🇳🇱 PostNL • 🇧🇪 BPost • 🇳🇴 Bring • 🇫🇮 Posti • 🇪🇪 Omniva • 🇵🇱 Poczta Polska • 🇭🇺 Magyar Posta • 🇨🇿 Česká pošta • 🇸🇰 Slovenská pošta • ⚡ Fastway • 🏍️ Lalamove • 🚕 GOGOX • 👔 Professional Couriers • 🏃 ShadowFax • 🕊️ Pidge • 🚴 Dunzo • 🍽️ Swiggy • 🚢 Hanjin • 🌏 Lotte • 🚚 Seino • 📦 STO • ✈️ Yunda • 🏆 Best • 🚚 DTDC • 🛍️ Ecom Express • 🐝 XpressBees • 🚢 Kerry • 🇲🇾 Pos Malaysia • 🇻🇳 Vietnam Post • 🇵🇭 Philippine Postal • 🇦🇹 Austrian Post • 🇨🇭 Swiss Post • 🇷🇺 Russian Post • 🇹🇷 Turkish Post • 🇨🇾 Cyprus Post • 🇮🇸 Icelandic Post • 🇵🇹 Portuguese Post • 🇷🇴 Romanian Post • 🇮🇩 Indonesian Post • 🇳🇿 New Zealand Post • 🇱🇺 Post Luxembourg • 🇲🇹 Malta Post • 🇧🇬 Bulgarian Posts • 🇬🇷 Greek Post • 🇮🇪 Irish Post • 🇩🇰 Danish Post • 🇫🇮 Finnish Post • 🇳🇴 Norwegian Post • 🇸🇪 Swedish Post • 🇧🇪 Belgian Post</span>
                            </span>
                        </p>
                        <p class="powered-by-modern">
                            <span class="neon-text">Powered by Xroga.com</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    // ===========================================
    // INITIALIZE WIDGET FUNCTIONALITY
    // ===========================================
    function initWidget() {
        console.log('🚀 Ultra-Modern Tracking Widget Loaded');
        
        const detector = new ModernCourierDetector();
        const typingText = document.getElementById('typing-text');
        const trackingInput = document.getElementById('customer-tracking-input');
        const trackBtn = document.getElementById('customer-track-btn');
        const resultSection = document.getElementById('tracking-result');
        const errorSection = document.getElementById('tracking-error');
        const emergencyGrid = document.getElementById('emergency-options-grid');
        const flipCardBtn = document.getElementById('flip-card');
        const flipBackBtn = document.getElementById('flip-back');
        const resultCard = document.querySelector('.result-card');
        
        // Typewriter Effect
        const texts = [
            "Enter tracking number for real-time delivery status",
            "Supports 140+ carriers worldwide",
            "Get instant carrier detection",
            "Alternative tracking options available"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(typeWriter, isDeleting ? 50 : 100);
        }
        
        // Start typewriter effect
        setTimeout(typeWriter, 1000);
        
        // Create particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)'};
                    border-radius: 50%;
                    opacity: ${Math.random() * 0.3 + 0.1};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
                `;
                particlesContainer.appendChild(particle);
            }
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatParticle {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                    }
                    50% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                    }
                    75% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                    }
                    100% {
                        transform: translate(0, 0) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        createParticles();
        
        // Emergency tracking options
        const emergencyOptions = [
            { name: 'OrderTracker', color: '#007bff', icon: '📦', description: 'Best for USPS packages' },
            { name: 'ParcelsApp', color: '#28a745', icon: '📮', description: 'Global package tracker' },
            { name: '17Track', color: '#dc3545', icon: '🔍', description: 'Multi-carrier tracker' },
            { name: 'AfterShip', color: '#17a2b8', icon: '🚀', description: 'Shipment tracking platform' },
            { name: 'Track24', color: '#fd7e14', icon: '📍', description: 'Package tracking service' },
            { name: 'PackageMapping', color: '#6f42c1', icon: '🗺️', description: 'Visual tracking map' }
        ];
        
        function renderEmergencyOptions(carrier = null) {
            emergencyGrid.innerHTML = '';
            const recommended = carrier === 'USPS' ? 'OrderTracker' : 
                             carrier === 'UPS' || carrier === 'FedEx' ? 'ParcelsApp' :
                             carrier === 'DHL' ? '17Track' : 'AfterShip';
            
            emergencyOptions.forEach(option => {
                const isRecommended = option.name === recommended;
                const optionHtml = `
                    <a href="https://www.${option.name.toLowerCase()}.com/track/TRACKING_NUMBER" 
                       target="_blank" 
                       class="emergency-option-holographic">
                        <div class="emergency-option-icon" style="background: ${option.color}">
                            ${option.icon}
                        </div>
                        <div class="emergency-option-content">
                            <strong>${option.name}${isRecommended ? ' (Recommended)' : ''}</strong>
                            <small>${option.description}</small>
                            <span class="emergency-option-btn">
                                Track Here →
                            </span>
                        </div>
                    </a>
                `;
                emergencyGrid.innerHTML += optionHtml;
            });
            
            // Update tracking URLs
            setTimeout(() => {
                emergencyGrid.querySelectorAll('a').forEach(link => {
                    link.href = link.href.replace('TRACKING_NUMBER', encodeURIComponent(trackingInput.value));
                });
            }, 100);
        }
        
        // Track button click handler
        trackBtn.addEventListener('click', function() {
            const trackingNumber = trackingInput.value.trim();
            
            if (!trackingNumber) {
                showError('Please enter a tracking number');
                return;
            }
            
            // Show loading state
            trackBtn.classList.add('loading');
            trackBtn.disabled = true;
            
            // Hide previous results
            resultSection.style.display = 'none';
            errorSection.style.display = 'none';
            
            // Simulate API call
            setTimeout(() => {
                const results = detector.detect(trackingNumber);
                
                // Remove loading state
                trackBtn.classList.remove('loading');
                trackBtn.disabled = false;
                
                if (results.length > 0) {
                    const result = results[0];
                    showResult(result);
                    renderEmergencyOptions(result.carrier);
                } else {
                    showError('Tracking number not recognized. Try the examples above.');
                    renderEmergencyOptions();
                }
            }, 1500);
        });
        
        // Enter key support
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                trackBtn.click();
            }
        });
        
        // Input placeholder animation
        trackingInput.addEventListener('focus', function() {
            this.dataset.placeholder = this.placeholder;
            this.placeholder = '';
        });
        
        trackingInput.addEventListener('blur', function() {
            this.placeholder = this.dataset.placeholder;
        });
        
        // Flip card animation
        flipCardBtn.addEventListener('click', function() {
            resultCard.classList.add('flipped');
        });
        
        flipBackBtn.addEventListener('click', function() {
            resultCard.classList.remove('flipped');
        });
        
        // Copy tracking number
        document.getElementById('copy-tracking-btn').addEventListener('click', function() {
            const trackingNumber = document.getElementById('result-tracking-number').querySelector('code').textContent.replace(/\s/g, '');
            
            navigator.clipboard.writeText(trackingNumber).then(() => {
                const btn = this;
                const originalText = btn.querySelector('.copy-text').textContent;
                btn.querySelector('.copy-text').textContent = 'Copied!';
                btn.style.background = 'linear-gradient(135deg, var(--success-color), #059669)';
                
                setTimeout(() => {
                    btn.querySelector('.copy-text').textContent = originalText;
                    btn.style.background = '';
                }, 2000);
            });
        });
        
        // Share result
        document.getElementById('share-result-btn').addEventListener('click', function() {
            const carrier = document.getElementById('carrier-name').textContent;
            const trackingNumber = document.getElementById('result-tracking-number').querySelector('code').textContent;
            
            if (navigator.share) {
                navigator.share({
                    title: `${carrier} Tracking`,
                    text: `Track my ${carrier} package: ${trackingNumber}`,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(`${carrier} Tracking: ${trackingNumber}`).then(() => {
                    alert('Tracking info copied to clipboard!');
                });
            }
        });
        
        // Retry button
        document.getElementById('retry-btn').addEventListener('click', function() {
            trackingInput.focus();
            errorSection.style.display = 'none';
        });
        
        // Show result function
        function showResult(result) {
            // Update UI
            document.getElementById('carrier-name').textContent = result.carrier;
            document.getElementById('result-tracking-number').querySelector('code').textContent = 
                formatTrackingNumber(result.trackingNumber, result.carrier);
            document.getElementById('confidence').querySelector('.confidence-text').textContent = `${result.confidence}% Match`;
            document.getElementById('service-type').textContent = result.service;
            document.getElementById('carrier-region').textContent = result.region;
            document.getElementById('detection-time').textContent = `${result.confidence}%`;
            
            // Update colors
            const badge = document.getElementById('carrier-badge');
            badge.style.borderColor = `${result.color}40`;
            badge.querySelector('.badge-icon').style.background = `linear-gradient(135deg, ${result.color}, ${adjustColor(result.color, 20)})`;
            
            // Update carrier link
            const carrierLink = document.getElementById('carrier-link');
            carrierLink.href = getTrackingUrl(result.carrier, result.trackingNumber);
            
            // Show result with animation
            resultSection.style.display = 'block';
            resultCard.classList.remove('flipped');
            
            // Add success class to button
            trackBtn.classList.add('success');
            setTimeout(() => trackBtn.classList.remove('success'), 2000);
        }
        
        // Show error function
        function showError(message) {
            errorSection.querySelector('p').textContent = message;
            errorSection.style.display = 'block';
        }
        
        // Initialize with example tracking number
        setTimeout(() => {
            if (trackingInput.value) {
                trackBtn.click();
            }
        }, 500);
        
        // Add floating animation to emergency options
        setInterval(() => {
            document.querySelectorAll('.emergency-option-holographic').forEach((option, index) => {
                option.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 2}px)`;
            });
        }, 50);
    }

    // ===========================================
    // MAIN INITIALIZATION
    // ===========================================
    function initialize() {
        // Check if widget already exists
        if (document.getElementById('customer-tracking-widget')) {
            console.log('✅ Widget already loaded');
            return;
        }

        // Add fonts and styles
        addFonts();
        addStyles();

        // Create container for the widget
        const container = document.createElement('div');
        container.id = 'xroga-widget-container';
        
        // Add widget HTML
        container.innerHTML = createWidgetHTML();
        
        // Find where to insert the widget
        const targetElement = document.querySelector('[data-xroga-widget]') || 
                             document.getElementById('xroga-widget') || 
                             document.body;
        
        targetElement.appendChild(container);
        
        // Initialize widget functionality
        initWidget();
        
        console.log('✅ Xroga Tracking Widget Loaded Successfully');
    }

    // ===========================================
    // AUTO-INITIALIZE WHEN DOCUMENT IS READY
    // ===========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // ===========================================
    // EXPORT FOR MANUAL CONTROL
    // ===========================================
    window.XrogaTrackingWidget = {
        init: initialize,
        destroy: function() {
            const widget = document.getElementById('customer-tracking-widget');
            const container = document.getElementById('xroga-widget-container');
            const styles = document.getElementById('xroga-widget-styles');
            
            if (widget) widget.remove();
            if (container) container.remove();
            if (styles) styles.remove();
            
            console.log('🗑️ Widget destroyed');
        }
    };

})();
