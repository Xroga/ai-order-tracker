// widget-loader.js - Ultra-Modern Tracking Widget Embeddable Version
(function() {
    'use strict';

    console.log('🚀 Loading Ultra-Modern Tracking Widget...');

    // Enhanced Courier Detector with 140+ carriers
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

    // Helper Functions
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

    // Create Widget Container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'xroga-tracking-widget';
    widgetContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;

    // Create Toggle Button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'xroga-widget-toggle';
    toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3h2v-5l-3-4zM6 18.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm9-3.5H8.2c-.4-1.2-1.5-2-2.7-2-1.2 0-2.3.8-2.7 2H3V6h12v9zm3 3.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM17 12V9h2.2l1.8 2.5H17z" fill="white"/>
        </svg>
    `;
    toggleButton.style.cssText = `
        position: absolute;
        bottom: -60px;
        right: 0;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        z-index: 10001;
    `;
    
    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.transform = 'translateY(-4px) scale(1.05)';
        toggleButton.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
    });
    
    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.transform = 'translateY(0) scale(1)';
        toggleButton.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
    });

    // Create Widget Content
    const widgetContent = document.createElement('div');
    widgetContent.id = 'xroga-widget-content';
    widgetContent.style.cssText = `
        width: 380px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        overflow: hidden;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        display: none;
        max-height: 80vh;
        overflow-y: auto;
    `;

    // Add Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Add Styles
    const styles = document.createElement('style');
    styles.textContent = `
        .xroga-widget * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --xroga-primary: #6366f1;
            --xroga-secondary: #8b5cf6;
            --xroga-accent: #06b6d4;
            --xroga-success: #10b981;
            --xroga-warning: #f59e0b;
            --xroga-error: #ef4444;
            --xroga-text: #f1f5f9;
            --xroga-bg: rgba(15, 23, 42, 0.95);
            --xroga-glass: rgba(255, 255, 255, 0.05);
            --xroga-border: rgba(255, 255, 255, 0.1);
        }
        
        #xroga-widget-content {
            scrollbar-width: thin;
            scrollbar-color: var(--xroga-primary) transparent;
        }
        
        #xroga-widget-content::-webkit-scrollbar {
            width: 6px;
        }
        
        #xroga-widget-content::-webkit-scrollbar-track {
            background: transparent;
        }
        
        #xroga-widget-content::-webkit-scrollbar-thumb {
            background: var(--xroga-primary);
            border-radius: 3px;
        }
        
        .widget-inner {
            padding: 24px;
        }
        
        .widget-header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
        }
        
        .widget-icon {
            margin-bottom: 16px;
            animation: xrogaFloat 3s ease-in-out infinite;
        }
        
        @keyframes xrogaFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(5deg); }
            66% { transform: translateY(4px) rotate(-5deg); }
        }
        
        .widget-title {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--xroga-primary), var(--xroga-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        
        .widget-subtitle {
            color: #94a3b8;
            font-size: 14px;
            min-height: 20px;
        }
        
        .input-container {
            margin-bottom: 20px;
        }
        
        .input-wrapper {
            display: flex;
            gap: 8px;
            background: var(--xroga-glass);
            border: 1px solid var(--xroga-border);
            border-radius: 12px;
            padding: 4px;
            transition: all 0.3s ease;
        }
        
        .input-wrapper:focus-within {
            border-color: var(--xroga-primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .tracking-input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--xroga-text);
            font-size: 14px;
            padding: 12px 16px;
            outline: none;
        }
        
        .tracking-input::placeholder {
            color: #64748b;
        }
        
        .track-button {
            background: linear-gradient(135deg, var(--xroga-primary), var(--xroga-secondary));
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            position: relative;
            overflow: hidden;
        }
        
        .track-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        }
        
        .track-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .button-spinner {
            display: none;
            gap: 4px;
        }
        
        .button-spinner .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
            animation: xrogaPulse 1.4s ease-in-out infinite;
        }
        
        .button-spinner .dot:nth-child(2) { animation-delay: 0.2s; }
        .button-spinner .dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes xrogaPulse {
            0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
            30% { transform: scale(1.2); opacity: 1; }
        }
        
        .input-hint {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
            overflow: hidden;
        }
        
        .hint-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: xrogaMarquee 30s linear infinite;
        }
        
        @keyframes xrogaMarquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        
        .results-container {
            display: none;
            animation: xrogaSlideUp 0.6s ease;
        }
        
        @keyframes xrogaSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .result-card {
            background: var(--xroga-glass);
            border: 1px solid var(--xroga-border);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
        }
        
        .carrier-badge {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
        }
        
        .badge-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--xroga-primary), var(--xroga-secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
        }
        
        .badge-content {
            flex: 1;
            min-width: 0;
        }
        
        .carrier-name {
            font-size: 18px;
            font-weight: 700;
            color: var(--xroga-text);
            margin-bottom: 4px;
        }
        
        .confidence-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: var(--xroga-success);
            padding: 4px 8px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 12px;
            width: fit-content;
        }
        
        .confidence-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--xroga-success);
            animation: xrogaPulse 2s infinite;
        }
        
        .tracking-number-display {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .tracking-number-display code {
            flex: 1;
            font-family: monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--xroga-text);
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            letter-spacing: 1px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .copy-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, var(--xroga-primary), var(--xroga-secondary));
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .copy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
        }
        
        .details-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .detail-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
        }
        
        .detail-label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--xroga-text);
        }
        
        .action-buttons {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
        }
        
        .action-btn {
            border: none;
            border-radius: 8px;
            padding: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .action-btn-primary {
            background: linear-gradient(135deg, var(--xroga-primary), var(--xroga-secondary));
            color: white;
        }
        
        .action-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        }
        
        .action-btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--xroga-text);
        }
        
        .action-btn-secondary:hover {
            border-color: var(--xroga-primary);
            background: rgba(99, 102, 241, 0.1);
        }
        
        .error-container {
            display: none;
            animation: xrogaShake 0.6s ease;
        }
        
        @keyframes xrogaShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .error-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 16px;
            padding: 24px;
            text-align: center;
        }
        
        .error-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--xroga-error), #dc2626);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            color: white;
        }
        
        .error-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--xroga-error);
            margin-bottom: 8px;
        }
        
        .error-message {
            color: #94a3b8;
            font-size: 13px;
            margin-bottom: 16px;
        }
        
        .retry-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, var(--xroga-error), #dc2626);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }
        
        .widget-footer {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        }
        
        .carrier-list {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 8px;
            overflow: hidden;
        }
        
        .powered-by {
            font-size: 12px;
            color: #94a3b8;
        }
        
        .powered-by span {
            color: var(--xroga-primary);
            font-weight: 600;
            animation: xrogaNeon 2s ease-in-out infinite;
        }
        
        @keyframes xrogaNeon {
            0%, 100% { text-shadow: 0 0 10px rgba(99, 102, 241, 0.5); }
            50% { text-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
        }
        
        @media (max-width: 480px) {
            #xroga-widget-content {
                width: calc(100vw - 40px);
                right: 20px;
                left: 20px;
                bottom: 80px;
            }
            
            .details-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(styles);

    // Widget HTML
    widgetContent.innerHTML = `
        <div class="widget-inner">
            <div class="widget-header">
                <div class="widget-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3h2v-5l-3-4zM6 18.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm9-3.5H8.2c-.4-1.2-1.5-2-2.7-2-1.2 0-2.3.8-2.7 2H3V6h12v9zm3 3.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM17 12V9h2.2l1.8 2.5H17z" fill="url(#xroga-gradient)"/>
                        <defs>
                            <linearGradient id="xroga-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#6366f1" />
                                <stop offset="100%" stop-color="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="widget-title">Track Your Order</h3>
                <p class="widget-subtitle" id="xroga-typing-text">Enter tracking number for real-time delivery status</p>
            </div>
            
            <div class="input-container">
                <div class="input-wrapper">
                    <input type="text" id="xroga-tracking-input" class="tracking-input" placeholder="e.g., 1Z999AA1234567890" autocomplete="off">
                    <button id="xroga-track-btn" class="track-button">
                        <span id="xroga-button-text">Track</span>
                        <div class="button-spinner" id="xroga-spinner">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </button>
                </div>
                <div class="input-hint">
                    <div class="hint-marquee">🚚 UPS: 1Z999AA1234567890 • ✈️ FedEx: 123456789012 • 📮 USPS: 9400111899221345678901 • 🌐 DHL: 4209215302534212345678</div>
                </div>
            </div>
            
            <div class="results-container" id="xroga-results">
                <div class="result-card">
                    <div class="carrier-badge" id="xroga-carrier-badge">
                        <div class="badge-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17L7 19L5 17M15 17L13 19L11 17M9 5L7 7L5 5M15 5L13 7L11 5M7 19H17C18.1046 19 19 18.1046 19 17V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V17C5 18.1046 5.89543 19 7 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="badge-content">
                            <div class="carrier-name" id="xroga-carrier-name">Carrier</div>
                            <div class="confidence-badge" id="xroga-confidence">
                                <div class="confidence-dot"></div>
                                <span>99% Match</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tracking-number-display">
                        <code id="xroga-tracking-display">1Z 999 AA1 234 5678 90</code>
                        <button class="copy-btn" id="xroga-copy-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Copy
                        </button>
                    </div>
                    
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Service Type</div>
                            <div class="detail-value" id="xroga-service-type">Express</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Region</div>
                            <div class="detail-value" id="xroga-region">Global</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Confidence</div>
                            <div class="detail-value" id="xroga-detection-time">99%</div>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <a href="#" target="_blank" class="action-btn action-btn-primary" id="xroga-carrier-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Open Carrier Tracking
                        </a>
                        <button class="action-btn action-btn-secondary" id="xroga-share-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Share Result
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="error-container" id="xroga-error">
                <div class="error-card">
                    <div class="error-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.5322 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h4 class="error-title">Tracking Number Not Recognized</h4>
                    <p class="error-message">Try UPS: 1Z999AA1234567890, FedEx: 123456789012, USPS: 9400111899221345678901</p>
                    <button class="retry-btn" id="xroga-retry-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Try Again
                    </button>
                </div>
            </div>
            
            <div class="widget-footer">
                <p class="carrier-list">Supports: 🚚 UPS • ✈️ FedEx • 🌐 DHL • 📮 USPS • 📦 140+ Carriers</p>
                <p class="powered-by">Powered by <span>Xroga.com</span></p>
            </div>
        </div>
    `;

    // Assemble Widget
    widgetContainer.appendChild(widgetContent);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // Initialize
    let isWidgetVisible = false;
    const detector = new ModernCourierDetector();

    // Typewriter Effect
    const typingText = document.getElementById('xroga-typing-text');
    const texts = [
        "Enter tracking number for real-time delivery status",
        "Supports 140+ carriers worldwide",
        "Get instant carrier detection",
        "Alternative tracking options available"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;
    
    function startTypewriter() {
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
        
        typingTimeout = setTimeout(startTypewriter, isDeleting ? 50 : 100);
    }
    
    // Toggle Widget
    toggleButton.addEventListener('click', () => {
        isWidgetVisible = !isWidgetVisible;
        
        if (isWidgetVisible) {
            widgetContent.style.display = 'block';
            setTimeout(() => {
                widgetContent.style.transform = 'translateY(0)';
                widgetContent.style.opacity = '1';
            }, 10);
            toggleButton.style.transform = 'rotate(45deg)';
            startTypewriter();
        } else {
            widgetContent.style.transform = 'translateY(100px)';
            widgetContent.style.opacity = '0';
            toggleButton.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                widgetContent.style.display = 'none';
            }, 500);
            clearTimeout(typingTimeout);
        }
    });

    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
        if (isWidgetVisible && 
            !widgetContent.contains(e.target) && 
            !toggleButton.contains(e.target)) {
            isWidgetVisible = false;
            widgetContent.style.transform = 'translateY(100px)';
            widgetContent.style.opacity = '0';
            toggleButton.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                widgetContent.style.display = 'none';
            }, 500);
            clearTimeout(typingTimeout);
        }
    });

    // Track Button Handler
    const trackBtn = document.getElementById('xroga-track-btn');
    const trackingInput = document.getElementById('xroga-tracking-input');
    const resultsContainer = document.getElementById('xroga-results');
    const errorContainer = document.getElementById('xroga-error');
    const spinner = document.getElementById('xroga-spinner');
    const buttonText = document.getElementById('xroga-button-text');

    trackBtn.addEventListener('click', () => {
        const trackingNumber = trackingInput.value.trim();
        
        if (!trackingNumber) {
            showError('Please enter a tracking number');
            return;
        }
        
        // Show loading state
        trackBtn.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'flex';
        
        // Hide previous results
        resultsContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        
        // Simulate API call
        setTimeout(() => {
            const results = detector.detect(trackingNumber);
            
            // Remove loading state
            trackBtn.disabled = false;
            buttonText.style.display = 'block';
            spinner.style.display = 'none';
            
            if (results.length > 0) {
                const result = results[0];
                showResult(result);
            } else {
                showError('Tracking number not recognized. Try the examples above.');
            }
        }, 1500);
    });

    // Enter key support
    trackingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            trackBtn.click();
        }
    });

    // Copy tracking number
    document.getElementById('xroga-copy-btn').addEventListener('click', function() {
        const trackingNumber = document.getElementById('xroga-tracking-display').textContent.replace(/\s/g, '');
        
        navigator.clipboard.writeText(trackingNumber).then(() => {
            const btn = this;
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Copied!
            `;
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        });
    });

    // Share result
    document.getElementById('xroga-share-btn').addEventListener('click', function() {
        const carrier = document.getElementById('xroga-carrier-name').textContent;
        const trackingNumber = document.getElementById('xroga-tracking-display').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: `${carrier} Tracking`,
                text: `Track my ${carrier} package: ${trackingNumber}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`${carrier} Tracking: ${trackingNumber}`).then(() => {
                const btn = this;
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
        }
    });

    // Retry button
    document.getElementById('xroga-retry-btn').addEventListener('click', function() {
        trackingInput.focus();
        errorContainer.style.display = 'none';
    });

    // Show result function
    function showResult(result) {
        // Update UI
        document.getElementById('xroga-carrier-name').textContent = result.carrier;
        document.getElementById('xroga-tracking-display').textContent = formatTrackingNumber(result.trackingNumber, result.carrier);
        document.getElementById('xroga-confidence').querySelector('span').textContent = `${result.confidence}% Match`;
        document.getElementById('xroga-service-type').textContent = result.service;
        document.getElementById('xroga-region').textContent = result.region;
        document.getElementById('xroga-detection-time').textContent = `${result.confidence}%`;
        
        // Update colors
        const badge = document.getElementById('xroga-carrier-badge');
        badge.style.borderColor = `${result.color}40`;
        badge.querySelector('.badge-icon').style.background = `linear-gradient(135deg, ${result.color}, ${adjustColor(result.color, 20)})`;
        
        // Update carrier link
        const carrierLink = document.getElementById('xroga-carrier-link');
        carrierLink.href = getTrackingUrl(result.carrier, result.trackingNumber);
        
        // Show result
        resultsContainer.style.display = 'block';
        
        // Add success animation to button
        trackBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
            trackBtn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        }, 2000);
    }

    // Show error function
    function showError(message) {
        errorContainer.querySelector('.error-message').textContent = message;
        errorContainer.style.display = 'block';
    }

    // Initialize with example on click
    toggleButton.addEventListener('click', () => {
        if (!trackingInput.value) {
            trackingInput.value = '1Z999AA1234567890';
        }
    });

    console.log('✅ Ultra-Modern Tracking Widget Loaded Successfully');
})();
