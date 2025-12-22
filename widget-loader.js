// widget-loader.js
(function() {
  console.log('📦 CourierDetect Widget Loading...');
  
  // Create widget HTML
  const widgetHTML = `
  <div id="courierdetect-widget" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 320px;
    background: white;
    border: 1px solid #e1e3e5;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9999;
    display: none;
  ">
    <h3 style="margin: 0 0 10px 0;">Track Your Order</h3>
    <p style="margin: 0 0 15px 0;">Enter tracking number</p>
    <input type="text" placeholder="Tracking number" style="
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
    ">
    <button style="
      width: 100%;
      padding: 10px;
      background: #5c6ac4;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    ">Track Package</button>
    <div style="text-align: center; margin-top: 15px; font-size: 12px; color: #999;">
      Powered by CourierDetect
    </div>
  </div>
  
  <button id="cd-trigger" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #5c6ac4;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9998;
    font-size: 20px;
  ">📦</button>
  `;
  
  // Add to page
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Add functionality
  const trigger = document.getElementById('cd-trigger');
  const widget = document.getElementById('courierdetect-widget');
  
  trigger.addEventListener('click', () => {
    widget.style.display = widget.style.display === 'block' ? 'none' : 'block';
  });
  
  console.log('✅ CourierDetect Widget Loaded');
})();
