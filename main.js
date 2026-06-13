import { calculateInheritance } from './engine/calculateInheritance.js';
import { formatResults } from './utils/formatResults.js';

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const copyBtn = document.getElementById('copyBtn');
    const printBtn = document.getElementById('printBtn');
    
    const resultsSection = document.getElementById('resultsSection');
    const resultsCards = document.getElementById('resultsCards');
    const messagesContainer = document.getElementById('messages');
    const scholarMode = document.getElementById('scholarMode');
    const errorContainer = document.getElementById('errorContainer');
    const presetBtns = document.querySelectorAll('.preset-btn');

    const presets = {
        gharawiyyatayn1: { wife: 1, father: 1, mother: 1 },
        awl1: { husband: 1, daughter: 2, father: 1, mother: 1 },
        radd1: { mother: 1, daughter: 1 }
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.getAttribute('data-preset');
            const data = presets[presetName];
            if (data) {
                // Reset all first
                document.querySelectorAll('.heirs-container input[type="number"]').forEach(input => {
                    input.value = 0;
                });
                // Apply preset
                for (const key in data) {
                    const input = document.getElementById(key);
                    if (input) input.value = data[key];
                }
            }
        });
    });

    scholarMode.addEventListener('change', (e) => {
        if (e.target.checked && !resultsSection.classList.contains('hidden')) {
            messagesContainer.classList.remove('hidden');
        } else {
            messagesContainer.classList.add('hidden');
        }
    });

    resetBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = 0;
        });
        document.getElementById('estateValue').value = '';
        resultsSection.classList.add('hidden');
        messagesContainer.classList.add('hidden');
        errorContainer.style.display = 'none';
        printBtn.classList.add('hidden');
        copyBtn.classList.add('hidden');
    });

    calculateBtn.addEventListener('click', () => {
        const heirsInput = {};
        const inputs = document.querySelectorAll('.heirs-container input[type="number"]');
        inputs.forEach(input => {
            heirsInput[input.id] = parseInt(input.value) || 0;
        });

        const estateValue = parseFloat(document.getElementById('estateValue').value) || 0;

        errorContainer.style.display = 'none';
        errorContainer.textContent = '';

        try {
            const { shares, messages } = calculateInheritance(heirsInput);
            const formattedShares = formatResults(shares, estateValue);
            displayResults(formattedShares, messages, estateValue);
        } catch (error) {
            errorContainer.textContent = error.message;
            errorContainer.style.display = 'block';
            resultsSection.classList.add('hidden');
            printBtn.classList.add('hidden');
            copyBtn.classList.add('hidden');
        }
    });

    copyBtn.addEventListener('click', () => {
        let text = "Shāfiʿī Inheritance Calculation Summary\n";
        text += "=======================================\n\n";
        
        // Read text directly from the rendered cards to ensure fidelity
        if (resultsCards) {
            const cards = resultsCards.querySelectorAll('.result-card');
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent;
                text += `${title}\n`;
                const items = card.querySelectorAll('li');
                items.forEach(item => {
                    const spans = item.querySelectorAll('span');
                    if (spans.length === 2) {
                        text += `- ${spans[0].textContent}: ${spans[1].textContent}\n`;
                    }
                });
                text += "\n";
            });
        }

        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("Failed to copy to clipboard.");
        });
    });

    function displayResults(shares, messages, estateValue) {
        resultsCards.innerHTML = '';
        messagesContainer.innerHTML = '';
        
        const sharers = shares.filter(s => s.status.includes('Sharer'));
        const residuaries = shares.filter(s => s.status.includes('Residuary') && !s.status.includes('Sharer + Residuary'));
        const blocked = shares.filter(s => s.status.includes('Blocked'));
        
        const specialRules = [];
        if (messages.some(msg => msg.includes("'Awl applied"))) specialRules.push("ʿAwl (Proportional Reduction) applied to handle fractional overflow.");
        if (messages.some(msg => msg.includes("Radd applied"))) specialRules.push("Radd (Redistribution) applied to return surplus to sharers.");
        if (shares.some(s => s.reason && s.reason.includes("Gharāwiyyatayn"))) specialRules.push("Gharāwiyyatayn (ʿUmariyyatayn) exception applied for parents with spouse.");

        let html = '';

        // Summary Card
        html += `
            <div class="result-card summary-card">
                <h3>Summary</h3>
                <ul>
                    <li><span>Total Estate Distributed:</span> <span>100% ${estateValue ? '($' + estateValue.toFixed(2) + ')' : ''}</span></li>
                </ul>
            </div>
        `;

        // Special Rules Card
        if (specialRules.length > 0) {
            html += `
                <div class="result-card" style="border-color: var(--accent);">
                    <h3 style="color: var(--accent);">Special Rules Applied</h3>
                    <ul>
                        ${specialRules.map(rule => `<li><span style="font-weight: 600;">${rule}</span></li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Sharers Card
        if (sharers.length > 0) {
            html += `
                <div class="result-card sharers-card">
                    <h3>Sharers (Fixed Portions)</h3>
                    <ul>
                        ${sharers.map(s => `<li>
                            <div style="display: flex; flex-direction: column;">
                                <span><strong>${s.name}</strong> (Count: ${s.count})</span>
                                <span style="font-size: 0.85em; opacity: 0.8; margin-top: 0.2rem;">Reason: ${s.reason || 'Fixed Share'}</span>
                            </div>
                            <span>${s.fracText} ${s.amountPerPerson !== '-' ? '- $' + s.amountPerPerson + ' each' : ''}</span>
                        </li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Residuaries Card
        if (residuaries.length > 0) {
            html += `
                <div class="result-card residuaries-card">
                    <h3>Residuaries (Remaining Portion)</h3>
                    <ul>
                        ${residuaries.map(s => `<li>
                            <div style="display: flex; flex-direction: column;">
                                <span><strong>${s.name}</strong> (Count: ${s.count})</span>
                                <span style="font-size: 0.85em; opacity: 0.8; margin-top: 0.2rem;">Reason: ${s.reason || 'Takes remainder'}</span>
                            </div>
                            <span>${s.fracText} ${s.amountPerPerson !== '-' ? '- $' + s.amountPerPerson + ' each' : ''}</span>
                        </li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Blocked Card
        if (blocked.length > 0) {
            html += `
                <div class="result-card blocked-card">
                    <h3>Blocked Heirs</h3>
                    <ul>
                        ${blocked.map(s => `<li>
                            <span><strong>${s.name}</strong> (Count: ${s.count})</span> 
                            <span style="font-size: 0.85em; opacity: 0.8">Reason: ${s.reason}</span>
                        </li>`).join('')}
                    </ul>
                </div>
            `;
        }

        resultsCards.innerHTML = html;

        // Messages
        messagesContainer.innerHTML = '<h3 style="color: var(--accent); margin-bottom: 0.5rem; padding-bottom: 0.3rem; border-bottom: 1px solid var(--glass-border);">Calculation Process</h3>';
        messages.forEach((msg, idx) => {
            const div = document.createElement('div');
            div.className = 'message ' + (msg.includes('blocked') ? 'warning' : '');
            div.textContent = `${idx + 1}. ${msg}`;
            messagesContainer.appendChild(div);
        });

        resultsSection.classList.remove('hidden');
        if (scholarMode.checked) {
            messagesContainer.classList.remove('hidden');
        } else {
            messagesContainer.classList.add('hidden');
        }
        printBtn.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
    }
});
