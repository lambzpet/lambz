// Comportamentos e Logica Lambz

document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect - Esconde/Mostra estilos baseados na rolagem
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Máscaras e Formatações Básicas (Mockadas para não depender de libs externas aqui)
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : x[1] + '.' + x[2] + (x[3] ? '.' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        });
    }

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
            e.target.value = !x[2] ? x[1] : x[1] + '-' + x[2];
        });
    }

    // Modal do Asaas Guide
    const asaasModal = document.getElementById('asaas-modal');
    const btnOpenAsaas = document.getElementById('asaas-guide-btn');
    const btnCloseAsaas = document.getElementById('close-asaas-modal');
    const btnGotIt = document.getElementById('got-it-btn');

    if (btnOpenAsaas && asaasModal) {
        btnOpenAsaas.addEventListener('click', () => {
            asaasModal.classList.add('active');
        });
    }

    const closeModal = () => {
        if (asaasModal) asaasModal.classList.remove('active');
    };

    if (btnCloseAsaas) btnCloseAsaas.addEventListener('click', closeModal);
    if (btnGotIt) btnGotIt.addEventListener('click', closeModal);
    if (asaasModal) {
        asaasModal.addEventListener('click', (e) => {
            if (e.target === asaasModal) {
                closeModal();
            }
        });
    }
});

function preencherTeste() {
    document.getElementById('nome').value = "Teste Cliente MP";
    document.getElementById('cpf').value = "191.191.191-00";
    document.getElementById('whatsapp').value = "(11) 99999-9999";
    document.getElementById('email').value = "teste@lambz.com";
    document.getElementById('rua').value = "Rua Teste MP";
    document.getElementById('numero').value = "123";

    // Esconder possível mensagem de erro
    const errorDiv = document.getElementById('checkout-error');
    if (errorDiv) errorDiv.style.display = 'none';

    // Limpar bordas vermelhas
    ['nome', 'cpf', 'whatsapp', 'email'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.border = '1px solid var(--border-color)';
    });
}

// --- INTEGRAÇÃO MERCADO PAGO (EM CONSTRUÇÃO) ---
// --- INTEGRAÇÃO MERCADO PAGO ---
async function generatePix() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;

    const camposIds = ['nome', 'cpf', 'whatsapp', 'email'];
    let temErro = false;

    // Reseta bordas e verifica quem está vazio
    camposIds.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (!elemento.value) {
                elemento.style.border = '2px solid #ef4444';
                temErro = true;
            } else {
                elemento.style.border = '1px solid var(--border-color)';
            }
        }
    });

    const errorDiv = document.getElementById('checkout-error');
    if (temErro) {
        if (errorDiv) errorDiv.style.display = 'block';
        // Deslizar até o formulário do erro p/ cliente ver
        document.querySelector('.checkout-box').scrollIntoView({ behavior: 'smooth' });
        return;
    } else {
        if (errorDiv) errorDiv.style.display = 'none';
    }

    const cartData = typeof getCheckoutData === 'function' ? getCheckoutData() : null;
    const orderData = cartData || {
        name: "Produto Fallback",
        price: 149.90,
        qty: 1
    };

    // Mercado Pago aceita R$ 1,00 para teste de boa. E a taxa do PIX no MP é ~0.99% (cerca de 1 centavo)!
    const totalAmount = 1.00; // orderData.price * orderData.qty;

    const btn = document.querySelector('button[onclick="generatePix()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Gerando PIX seguro... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const webhookUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'https://webhook.site/lambz-test' : window.location.origin + '/api/webhook';

        const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer APP_USR-4885585679236314-030619-a4f4b9fd60b88aa080825e0de62ef613-455827848',
                'X-Idempotency-Key': Date.now().toString() // Identificador único pro MP não duplicar cobrança
            },
            body: JSON.stringify({
                transaction_amount: Number(totalAmount.toFixed(2)),
                description: `Lambz - ${orderData.name}`,
                payment_method_id: "pix",
                notification_url: webhookUrl, // <--- Aqui o Mercado Pago avisa a nossa Vercel (Webhook IPN)
                payer: {
                    email: email,
                    first_name: nome.split(' ')[0] || "Cliente",
                    last_name: nome.split(' ').slice(1).join(' ') || "Lambz",
                    identification: {
                        type: cpf.length === 14 ? 'CNPJ' : 'CPF',
                        number: cpf
                    }
                }
            })
        });

        const result = await response.json();

        if (response.ok && result.point_of_interaction) {
            const copiaCola = result.point_of_interaction.transaction_data.qr_code;
            const base64Img = result.point_of_interaction.transaction_data.qr_code_base64;
            const transactionId = result.id;

            showPixModal_MP(copiaCola, base64Img, totalAmount, orderData, email, transactionId);
        } else {
            console.error("Erro MP:", result);
            alert('Aconteceu um erro ao gerar o PIX pelo Mercado Pago. (Verifique o formato do CPF e Email).');
        }

    } catch (error) {
        console.error('Erro requisição MP:', error);
        alert('Erro de conexão transparente com o banco. Tente novamente.');
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

function showPixModal_MP(payload, qrCodeBase64, amount, expectedData, email, transactionId) {
    const checkoutWrapper = document.querySelector('.checkout-wrapper');
    if (!checkoutWrapper) return;

    checkoutWrapper.innerHTML = `
        <div style="background: white; padding: 48px 32px; border-radius: 12px; margin: 0 auto; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="width: 64px; height: 64px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
            </div>
            
            <h2 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-color);">Pedido Reservado!</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 0.95rem;">Último passo: Escaneie o QR Code ou cole o código no seu aplicativo do banco para finalizar a compra de <strong>R$ ${amount.toFixed(2).replace('.', ',')}</strong>.</p>
            
            <img src="data:image/jpeg;base64,${qrCodeBase64}" alt="QR Code PIX Mercado Pago" style="width: 200px; height: 200px; margin: 0 auto 24px; border: 4px solid white; box-shadow: 0 0 0 1px #e2e8f0; border-radius: 8px;">

            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 24px; word-break: break-all; font-family: monospace; font-size: 0.8rem; color: #475569; position: relative;">
                ${payload}
            </div>

            <button id="copyPixBtn" class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 1.1rem; margin-bottom: 24px;">
                Copiar PIX Copia e Cola
            </button>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0;">
                <div class="spinner-grow" style="width: 1rem; height: 1rem; color: #16a34a; background-color: #16a34a; border-radius: 50%; display: inline-block; animation: spinner-grow 1s linear infinite;"></div>
                <p style="font-size: 0.9rem; color: #16a34a; font-weight: 500; margin: 0;">
                    Aguardando a confirmação do seu banco...
                </p>
            </div>
            <style>
                @keyframes spinner-grow {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(1); opacity: 0; }
                }
            </style>
        </div>
    `;

    checkoutWrapper.style.display = 'block';

    let pollingAttempts = 0;
    const maxAttempts = 225; // 15 Minutos de limite

    // Polling Automático Inteligente do Mercado Pago a cada 4 segundos
    const pollingInterval = setInterval(async () => {
        pollingAttempts++;
        if (pollingAttempts > maxAttempts) {
            clearInterval(pollingInterval);
            return;
        }

        try {
            const res = await fetch(`https://api.mercadopago.com/v1/payments/${transactionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer APP_USR-4885585679236314-030619-a4f4b9fd60b88aa080825e0de62ef613-455827848'
                }
            });

            const checkData = await res.json();
            console.log('Verificando status do Pix MP:', checkData.status);

            // MP devolve 'approved' minúsculo
            if (checkData.status === 'approved') {
                clearInterval(pollingInterval);
                showSuccessScreen(amount);
            }
        } catch (e) {
            console.error('Erro no polling do MP:', e);
        }
    }, 4000);

    document.getElementById('copyPixBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(payload);
        const btn = document.getElementById('copyPixBtn');
        btn.innerHTML = 'Código PIX Copiado! <svg style="margin-left:8px; display:inline;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
        btn.style.backgroundColor = '#10b981';
        btn.style.borderColor = '#10b981';

        setTimeout(() => {
            btn.innerHTML = 'Copiar PIX Copia e Cola';
            btn.style.backgroundColor = 'var(--action-color)';
            btn.style.borderColor = 'var(--action-color)';
        }, 4000);
    });
}

function showSuccessScreen(amount) {
    const checkoutWrapper = document.querySelector('.checkout-wrapper');
    if (!checkoutWrapper) return;

    // Esvazia carrinho falso (Exemplo)
    if (typeof localStorage !== 'undefined') localStorage.removeItem('lambz_checkout');

    checkoutWrapper.innerHTML = `
        <div style="background: white; padding: 48px 32px; border-radius: 12px; margin: 0 auto; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-top: 5px solid #10b981; animation: slideUpFade 0.6s ease-out;">
            <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h2 style="font-size: 1.8rem; margin-bottom: 12px; color: #064e3b; font-weight: 800; animation: fadeIn 0.8s ease 0.4s both;">Tudo Certo, VIP! 🚀</h2>
            <p style="color: #334155; margin-bottom: 24px; font-size: 1rem; line-height: 1.5; animation: fadeIn 0.8s ease 0.6s both;">O recebedor confirmou seu Pix de <strong>R$ ${amount.toFixed(2).replace('.', ',')}</strong> na velocidade da luz.<br>Seu novo par Lambz ou Bitpins já está entrando na fila de expedição.</p>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 32px; text-align: left; animation: fadeIn 0.8s ease 0.8s both;">
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">Enviaremos o código de rastreio e os detalhes mágicos direto no seu <strong>WhatsApp</strong> 🟢</p>
            </div>

            <button onclick="window.location.href='index.html'" class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 1.1rem; background-color: #10b981; border-color: #10b981; animation: fadeIn 0.8s ease 1s both;">
                Voltar à Loja
            </button>
        </div>

        <style>
            @keyframes slideUpFade {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes bounceIn {
                0% { opacity: 0; transform: scale(0.3); }
                50% { opacity: 1; transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
    `;

    // Disparar efeito UAU de Confetes na tela usando Canvas Confetti (Injetado dinamicamente para não pesar o site base)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => {
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#10b981', '#ffffff', '#cbd5e1'] // Cores da marca
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#10b981', '#ffffff', '#cbd5e1']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };
    document.body.appendChild(script);
}

/* ========================================================
   INTEGRAÇÃO LIRAPAY BR (DESATIVADA / COMENTADA PARA EVITAR TAXAS)
   ========================================================

async function generatePix_Lirapay() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;

    if (!nome || !cpf || !whatsapp || !email) {
        alert('Por favor, preencha todos os campos pessoais (Nome, CPF, WhatsApp e E-mail) para prosseguir.');
        return;
    }

    const cartData = typeof getCheckoutData === 'function' ? getCheckoutData() : null;
    const orderData = cartData || {
        name: "Produto Fallback",
        price: 149.90,
        qty: 1
    };

    const externalId = 'PEDIDO-' + Date.now();
    // TEMPORÁRIO PARA TESTES REAIS: R$ 4,90 (LiraPay n permite 1 real pq ñ cobre a taxa base deles do pix interbancario)
    const totalAmount = 4.90; // orderData.price * orderData.qty;

    const btn = document.querySelector('button[onclick="generatePix()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Gerando PIX... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const response = await fetch('https://api.lirapaybr.com/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-secret': 'sk_ab8d315658f947886f35d9b78fa3b64b54fc8d42934eb7b74742eef9a05d05c881cc9794a46bef03a91cf8eacd1cf4d7ffa9994d71f2f569157665d8e8e73504'
            },
            body: JSON.stringify({
                external_id: externalId,
                total_amount: totalAmount,
                payment_method: 'PIX',
                webhook_url: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'https://webhook.site/lambz-test' : window.location.origin + '/api/webhook',
                ip: '127.0.0.1',
                items: [
                    {
                        id: "item_1",
                        title: orderData.name,
                        description: `Compra Lambz - Cor: ${ orderData.color || 'N/A' } Tam: ${ orderData.size || 'N/A' }`,
                        price: orderData.price,
                        quantity: orderData.qty,
                        is_physical: true
                    }
                ],
                customer: {
                    name: nome,
                    email: email,
                    phone: whatsapp,
                    document_type: cpf.length === 14 ? 'CNPJ' : 'CPF',
                    document: cpf
                }
            })
        });

        const result = await response.json();

        if (response.ok && result.pix && result.pix.payload && result.id) {
            showPixModal_Lirapay(result.pix.payload, totalAmount, orderData, email, result.id);
        } else {
            console.error(result);
            alert('Aconteceu um erro ao gerar o PIX. Verifique se os dados estão corretos (CPF sem erros falsos, E-mail formato correto).');
        }

    } catch (error) {
        console.error('Erro requisição:', error);
        alert('Erro de conexão com o banco ao gerar o PIX.');
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

function showPixModal_Lirapay(payload, amount, expectedData, email, transactionId) {
    // 1 - Em vez de popup overlay, vamos substituir o próprio checkout por uma tela de confirmação/espera.
    const checkoutWrapper = document.querySelector('.checkout-wrapper');
    if (!checkoutWrapper) return; // fail-safe

    // API Publica para gerar Imagem QR Code a partir de texto (Seguro e Confiavel via GET)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}`;

                checkoutWrapper.innerHTML = `
        <div style="background: white; padding: 48px 32px; border-radius: 12px; margin: 0 auto; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="width: 64px; height: 64px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            
            <h2 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-color);">Pedido Reservado!</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 0.95rem;">Último passo: Escaneie o QR Code ou cole o código no seu aplicativo do banco para finalizar a compra de <strong>R$ ${amount.toFixed(2).replace('.', ',')}</strong>.<br><br><span style="font-size: 0.8rem; background: #ffedd5; color: #ea580c; padding: 4px 8px; border-radius: 4px;">Valor de Teste</span></p>
            
            <img src="${qrCodeUrl}" alt="QR Code PIX" style="width: 200px; height: 200px; margin: 0 auto 24px; border: 4px solid white; box-shadow: 0 0 0 1px #e2e8f0; border-radius: 8px;">

            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 24px; word-break: break-all; font-family: monospace; font-size: 0.8rem; color: #475569; position: relative;">
                ${payload}
            </div>

            <button id="copyPixBtn" class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 1.1rem; margin-bottom: 24px;">
                Copiar Código PIX
            </button>
            
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 16px;">
                <i class="fas fa-spinner fa-spin" style="margin-right: 8px; color: var(--primary-color)"></i>
                Aguardando confirmação do pagamento... (Atualização Automática)
            </p>
        </div>
    `;

            // Atualiza Layout de Fundo da Pagina para Clean 
            checkoutWrapper.style.display = 'block';

            let pollingAttempts = 0;
            const maxAttempts = 225; // 225 vezes * 4 seg = 900 segundos (15 Minutos de limite)

            // Iniciar Polling (Verificação) Automática na LiraPay a cada 4 segundos
            const pollingInterval = setInterval(async () => {
                pollingAttempts++;
                if (pollingAttempts > maxAttempts) {
                    clearInterval(pollingInterval);
                    console.log('Tempo limite do QR Code atingido. Parando verificações.');
                    return;
                }

                try {
                    const res = await fetch(`https://api.lirapaybr.com/v1/transactions/${transactionId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'api-secret': 'sk_ab8d315658f947886f35d9b78fa3b64b54fc8d42934eb7b74742eef9a05d05c881cc9794a46bef03a91cf8eacd1cf4d7ffa9994d71f2f569157665d8e8e73504'
                        }
                    });

                    const checkData = await res.json();
                    console.log('Verificando status do Pix:', checkData.status);

                    // A LiraPay devolve 'AUTHORIZED' quando o dinheiro entra (Pix Pago)
                    if (checkData.status === 'AUTHORIZED') {
                        clearInterval(pollingInterval);
                        showSuccessScreen(amount);
                    }
                } catch (e) {
                    console.error('Erro no polling:', e);
                }
            }, 4000);

            document.getElementById('copyPixBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(payload);
                const btn = document.getElementById('copyPixBtn');
                btn.innerHTML = 'Código PIX Copiado! <svg style="margin-left:8px; display:inline;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                btn.style.backgroundColor = '#10b981';
                btn.style.borderColor = '#10b981';

                setTimeout(() => {
                    btn.innerHTML = 'Copiar Código PIX';
                    btn.style.backgroundColor = 'var(--primary-color)';
                    btn.style.borderColor = 'var(--primary-color)';
                }, 4000);
            });
        }
*/
