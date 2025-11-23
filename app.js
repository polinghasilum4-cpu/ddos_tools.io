// Application logic for Darkness DDoS Toolkit
let attackRunning = false;
let packetsSent = 0;
let activeThreads = 0;
let currentAttackInterval = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    logMessage('Darkness DDoS Toolkit v3.0 loaded successfully', 'success');
    logMessage('Warning: Use only for authorized penetration testing', 'warning');
    updateStats();
    loadSavedConfigurations();
    
    // Auto-save settings every 5 seconds
    setInterval(saveCurrentSettings, 5000);
});

function logMessage(message, type = 'info') {
    const logContainer = document.getElementById('attackLogs');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    logEntry.innerHTML = `<strong>[${timestamp}]</strong> ${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function updateStats() {
    document.getElementById('packetsSent').textContent = packetsSent.toLocaleString();
    document.getElementById('activeThreads').textContent = activeThreads;
    
    const attackPower = Math.min(100, Math.floor(packetsSent / 100));
    document.getElementById('attackPower').textContent = attackPower + '%';
    
    document.getElementById('targetStatus').textContent = attackRunning ? 'UNDER ATTACK' : 'IDLE';
    document.getElementById('targetStatus').style.color = attackRunning ? '#ff0000' : '#00ff00';
    
    const progress = document.getElementById('attackProgress');
    progress.style.width = attackPower + '%';
    
    document.getElementById('progressText').textContent = attackRunning ? 
        `Attacking... ${packetsSent} packets sent` : 
        'Ready to attack...';
}

function startAttack(type) {
    if (attackRunning) {
        logMessage('Attack already in progress. Stop current attack first.', 'warning');
        return;
    }

    const target = document.getElementById('targetUrl').value.trim();
    const port = parseInt(document.getElementById('targetPort').value) || 80;
    
    if (!target) {
        logMessage('Please enter a target URL or IP address', 'error');
        return;
    }

    attackRunning = true;
    packetsSent = 0;
    activeThreads = parseInt(document.getElementById('threads').value) || 50;

    logMessage(`Starting ${type.toUpperCase()} attack on ${target}:${port}`, 'success');
    logMessage(`Launching ${activeThreads} attack threads with ${attackConfig.attack_methods[type]?.parameters.packet_size || 1024} byte packets`, 'info');

    // Simulate attack progress
    currentAttackInterval = setInterval(() => {
        if (!attackRunning) {
            clearInterval(currentAttackInterval);
            return;
        }

        const basePackets = attackConfig.attack_methods[type]?.parameters.packet_rate || 100;
        packetsSent += Math.floor(Math.random() * basePackets * activeThreads / 10);
        updateStats();

        // Simulate different attack behaviors
        if (packetsSent > 10000 && packetsSent < 15000) {
            logMessage('Target network showing increased latency', 'warning');
        } else if (packetsSent > 30000) {
            logMessage('Target service degradation detected', 'success');
        }

    }, 100);

    // Auto-stop after duration
    const duration = parseInt(document.getElementById('duration').value) * 1000 || 60000;
    setTimeout(() => {
        if (attackRunning) {
            stopAllAttacks();
            logMessage(`Attack completed automatically after ${duration/1000} seconds`, 'info');
            logMessage(`Total packets sent: ${packetsSent.toLocaleString()}`, 'success');
        }
    }, duration);
}

function startCustomAttack() {
    const attackType = document.getElementById('attackType').value;
    
    try {
        const customPayload = document.getElementById('customPayload').value;
        if (customPayload) {
            JSON.parse(customPayload);
            logMessage('Custom payload validated successfully', 'success');
        }
    } catch (e) {
        logMessage('Invalid JSON in custom payload: ' + e.message, 'error');
        return;
    }
    
    startAttack(attackType);
}

function stopAllAttacks() {
    attackRunning = false;
    activeThreads = 0;
    
    if (currentAttackInterval) {
        clearInterval(currentAttackInterval);
        currentAttackInterval = null;
    }
    
    logMessage('All attacks stopped', 'warning');
    logMessage(`Final statistics: ${packetsSent.toLocaleString()} packets sent`, 'info');
    updateStats();
}

function exportConfig() {
    const config = {
        darkness_ddos_config: {
            ...attackConfig,
            timestamp: new Date().toISOString(),
            current_settings: getCurrentSettings()
        }
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `darkness_config_${new Date().getTime()}.json`;
    link.click();
    
    logMessage('Configuration exported successfully', 'success');
}

function importConfig() {
    document.getElementById('importFile').click();
}

function handleFileImport(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            applyImportedConfig(config);
            logMessage('Configuration imported successfully', 'success');
        } catch (error) {
            logMessage('Error importing configuration: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

function applyImportedConfig(config) {
    if (config.current_settings) {
        document.getElementById('targetUrl').value = config.current_settings.targetUrl || '';
        document.getElementById('targetPort').value = config.current_settings.targetPort || 80;
        document.getElementById('attackType').value = config.current_settings.attackType || 'udp';
        document.getElementById('threads').value = config.current_settings.threads || 50;
        document.getElementById('duration').value = config.current_settings.duration || 60;
        document.getElementById('packetSize').value = config.current_settings.packetSize || 1024;
    }
}

function getCurrentSettings() {
    return {
        targetUrl: document.getElementById('targetUrl').value,
        targetPort: document.getElementById('targetPort').value,
        attackType: document.getElementById('attackType').value,
        threads: document.getElementById('threads').value,
        duration: document.getElementById('duration').value,
        packetSize: document.getElementById('packetSize').value,
        customPayload: document.getElementById('customPayload').value
    };
}

function saveCurrentSettings() {
    const settings = getCurrentSettings();
    localStorage.setItem('darknessCurrentSettings', JSON.stringify(settings));
}

function loadCurrentSettings() {
    const saved = localStorage.getItem('darknessCurrentSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('targetUrl').value = settings.targetUrl || '';
        document.getElementById('targetPort').value = settings.targetPort || 80;
        document.getElementById('attackType').value = settings.attackType || 'udp';
        document.getElementById('threads').value = settings.threads || 50;
        document.getElementById('duration').value = settings.duration || 60;
        document.getElementById('packetSize').value = settings.packetSize || 1024;
        document.getElementById('customPayload').value = settings.customPayload || '';
    }
}

function saveConfiguration() {
    const name = document.getElementById('configName').value.trim() || `config_${new Date().getTime()}`;
    const configurations = JSON.parse(localStorage.getItem('darknessConfigurations') || '{}');
    
    configurations[name] = {
        ...getCurrentSettings(),
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('darknessConfigurations', JSON.stringify(configurations));
    logMessage(`Configuration "${name}" saved successfully`, 'success');
    loadSavedConfigurations();
}

function loadConfiguration() {
    const name = document.getElementById('configName').value.trim();
    const configurations = JSON.parse(localStorage.getItem('darknessConfigurations') || '{}');
    
    if (configurations[name]) {
        const config = configurations[name];
        document.getElementById('targetUrl').value = config.targetUrl || '';
        document.getElementById('targetPort').value = config.targetPort || 80;
        document.getElementById('attackType').value = config.attackType || 'udp';
        document.getElementById('threads').value = config.threads || 50;
        document.getElementById('duration').value = config.duration || 60;
        document.getElementById('packetSize').value = config.packetSize || 1024;
        document.getElementById('customPayload').value = config.customPayload || '';
        
        logMessage(`Configuration "${name}" loaded successfully`, 'success');
    } else {
        logMessage(`Configuration "${name}" not found`, 'error');
    }
}

function deleteConfiguration() {
    const name = document.getElementById('configName').value.trim();
    const configurations = JSON.parse(localStorage.getItem('darknessConfigurations') || '{}');
    
    if (configurations[name]) {
        delete configurations[name];
        localStorage.setItem('darknessConfigurations', JSON.stringify(configurations));
        logMessage(`Configuration "${name}" deleted`, 'success');
        loadSavedConfigurations();
    } else {
        logMessage(`Configuration "${name}" not found`, 'error');
    }
}

function loadSavedConfigurations() {
    const configurations = JSON.parse(localStorage.getItem('darknessConfigurations') || '{}');
    const configList = document.getElementById('configList');
    
    if (Object.keys(configurations).length === 0) {
        configList.innerHTML = '<em>No saved configurations</em>';
        return;
    }
    
    let html = '<strong>Saved Configurations:</strong><br>';
    for (const [name, config] of Object.entries(configurations)) {
        const date = new Date(config.savedAt).toLocaleDateString();
        html += `<div style="margin: 5px 0;">
            <span style="color: #00ffff;">${name}</span> 
            <small>(Saved: ${date})</small>
        </div>`;
    }
    
    configList.innerHTML = html;
}

function clearLogs() {
    document.getElementById('attackLogs').innerHTML = '';
    logMessage('Logs cleared', 'info');
}

function saveLogs() {
    const logs = document.getElementById('attackLogs').innerText;
    const blob = new Blob([logs], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `darkness_logs_${new Date().getTime()}.txt`;
    link.click();
    logMessage('Logs saved successfully', 'success');
}

// Load current settings when page loads
loadCurrentSettings();