// Comportamentos e Logica Lambz

document.addEventListener('DOMContentLoaded', () => {

    // Trust bar — fade carousel (mobile only, shows 1 item at a time)
    const trustItems = document.querySelectorAll('.trust-item');
    if (trustItems.length > 0) {
        let currentIdx = 0;
        // Set first item visible
        trustItems[0].classList.add('active');

        setInterval(() => {
            trustItems[currentIdx].classList.remove('active');
            currentIdx = (currentIdx + 1) % trustItems.length;
            trustItems[currentIdx].classList.add('active');
        }, 3000);
    }

    // Dynamic Cart Badge & Cart Drawer System
    window.getCartData = function () {
        const data = localStorage.getItem("lambz_cart");
        let cart = data ? JSON.parse(data) : [];
        // Migration from old single-item checkout flow if existing
        if (!Array.isArray(cart)) {
            cart = [cart];
            localStorage.setItem("lambz_cart", JSON.stringify(cart));
        }
        return cart;
    };

    window.updateCartBadge = function () {
        const badges = document.querySelectorAll('.cart-badge');
        const cart = window.getCartData();
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems > 99 ? '99+' : totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });

        if (window.renderCartDrawer) window.renderCartDrawer();
    };

    // Inject Modern Sliding Cart Drawer globally
    function initCartDrawer() {
        if (document.getElementById('lambz-cart-drawer')) return;

        const overlay = document.createElement('div');
        overlay.id = 'lambz-cart-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9998;opacity:0;visibility:hidden;transition:all 0.3s ease;backdrop-filter:blur(2px);';

        const drawer = document.createElement('div');
        drawer.id = 'lambz-cart-drawer';
        drawer.style.cssText = 'position:fixed;top:0;right:-400px;width:100%;max-width:400px;height:100vh;background:#fff;z-index:9999;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);display:flex;flex-direction:column;box-shadow:-5px 0 25px rgba(0,0,0,0.1);';

        drawer.innerHTML = `
            <div style="padding:20px 24px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;background:#fff;">
                <h2 style="margin:0;font-size:1.2rem;color:#0f172a;display:flex;align-items:center;gap:10px;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    Seu Carrinho
                </h2>
                <button onclick="window.closeCart()" style="background:none;border:none;font-size:1.5rem;color:#64748b;cursor:pointer;padding:4px;"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div id="lambz-cart-items" style="flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:20px;"></div>
            <div id="lambz-cart-footer" style="padding:24px;background:#f8fafc;border-top:1px solid #e2e8f0;"></div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        overlay.addEventListener('click', window.closeCart);
    }

    const formatPriceDrawer = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

    window.openCart = function () {
        initCartDrawer();
        window.renderCartDrawer();
        document.getElementById('lambz-cart-overlay').style.visibility = 'visible';
        document.getElementById('lambz-cart-overlay').style.opacity = '1';
        document.getElementById('lambz-cart-drawer').style.right = '0';
        document.body.style.overflow = 'hidden';
    };

    window.closeCart = function () {
        const overlay = document.getElementById('lambz-cart-overlay');
        const drawer = document.getElementById('lambz-cart-drawer');
        if (overlay) { overlay.style.opacity = '0'; overlay.style.visibility = 'hidden'; }
        if (drawer) drawer.style.right = '-400px';
        document.body.style.overflow = '';
    };

    window.removeFromCart = function (index) {
        let cart = window.getCartData();
        cart.splice(index, 1);
        localStorage.setItem('lambz_cart', JSON.stringify(cart));
        window.updateCartBadge();
    };

    window.changeCartQty = function (index, delta) {
        let cart = window.getCartData();
        if (cart[index]) {
            cart[index].qty += delta;
            if (cart[index].qty <= 0) cart.splice(index, 1);
            localStorage.setItem('lambz_cart', JSON.stringify(cart));
            window.updateCartBadge();
        }
    };

    window.renderCartDrawer = function () {
        const itemsContainer = document.getElementById('lambz-cart-items');
        const footer = document.getElementById('lambz-cart-footer');
        if (!itemsContainer) return;

        const cart = window.getCartData();

        if (cart.length === 0) {
            itemsContainer.innerHTML = `<div style="text-align:center;margin:auto;color:#94a3b8;display:flex;flex-direction:column;align-items:center;gap:12px;">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <div style="font-size:1.1rem;color:#475569;font-weight:600;">Seu carrinho está vazio</div>
                <div style="font-size:0.9rem;">Adicione produtos para continuar comprando.</div>
                <button onclick="window.closeCart(); window.location.href='produtos.html';" style="margin-top:16px;background:#059669;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:600;cursor:pointer;">Ver Produtos</button>
            </div>`;
            footer.style.display = 'none';
            return;
        }

        let totalCents = 0;

        itemsContainer.innerHTML = cart.map((item, i) => {
            const itemTotal = item.price * (item.qty || 1);
            totalCents += itemTotal;
            const details = [item.color, item.size].filter(Boolean).join(' · ');

            return `<div style="display:flex;gap:16px;background:#fff;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">
                <img src="${item.image}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'">
                <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <h4 style="margin:0;font-size:0.95rem;color:#0f172a;line-height:1.3;font-weight:600;">${item.name}</h4>
                            <button onclick="window.removeFromCart(${i})" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0;display:flex;align-items:center;"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        ${details ? `<div style="font-size:0.75rem;color:#64748b;margin-top:4px;">${details}</div>` : ''}
                    </div>
                    
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                        <div style="display:flex;align-items:center;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;background:#fff;">
                            <button onclick="window.changeCartQty(${i}, -1)" style="width:28px;height:28px;background:none;border:none;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:300;">-</button>
                            <span style="font-size:0.85rem;color:#0f172a;width:24px;text-align:center;font-weight:600;">${item.qty}</span>
                            <button onclick="window.changeCartQty(${i}, 1)" style="width:28px;height:28px;background:none;border:none;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:300;">+</button>
                        </div>
                        <span style="font-weight:700;color:#059669;font-size:1rem;">${formatPriceDrawer(itemTotal)}</span>
                    </div>
                </div>
            </div>`;
        }).join('');

        footer.style.display = 'block';
        footer.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:1.1rem;color:#0f172a;">
                <span style="font-weight:600;">Subtotal</span>
                <span style="font-weight:800;">${formatPriceDrawer(totalCents)}</span>
            </div>
            <p style="font-size:0.8rem;color:#64748b;margin-top:0;margin-bottom:16px;text-align:center;">Frete e descontos calculados no checkout.</p>
            <button onclick="window.location.href='checkout.html'" style="display:block;width:100%;padding:16px;background:#059669;color:white;text-align:center;border-radius:8px;font-weight:700;font-size:1.1rem;border:none;cursor:pointer;box-shadow:0 4px 6px -1px rgba(5,150,105,0.3);transition:transform 0.1s;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
                Finalizar Compra <span style="font-weight:400;margin:0 8px;">—</span> ${formatPriceDrawer(totalCents)}
            </button>
            <button onclick="window.closeCart()" style="display:block;width:100%;margin-top:12px;padding:12px;background:none;border:none;color:#64748b;font-size:0.9rem;font-weight:600;cursor:pointer;">Continuar Comprando</button>
        `;
    };

    window.updateCartBadge();

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
});

function preencherTeste() {
    document.getElementById('nome').value = "Teste Cliente MP";
    document.getElementById('cpf').value = "191.191.191-00";
    document.getElementById('whatsapp').value = "(11) 99999-9999";
    document.getElementById('email').value = "teste@lambz.com";
    document.getElementById('cep').value = "01310-100";
    document.getElementById('cidade-estado').value = "SP - São Paulo";
    document.getElementById('bairro').value = "Bela Vista";
    document.getElementById('rua').value = "Avenida Paulista";
    document.getElementById('numero').value = "1578";
    document.getElementById('complemento').value = "Sala 12";

    // Esconder possível mensagem de erro
    const errorDiv = document.getElementById('checkout-error');
    if (errorDiv) errorDiv.style.display = 'none';

    // Limpar bordas vermelhas
    ['nome', 'cpf', 'whatsapp', 'email', 'cep', 'cidade-estado', 'bairro', 'rua', 'numero'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.border = '1px solid var(--border-color)';
    });
}

// --- INTEGRAÇÃO MERCADO PAGO ---
async function generatePix() {
    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('cep').value.trim();
    const cidadeEstado = document.getElementById('cidade-estado').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const complemento = document.getElementById('complemento').value.trim();

    // Validar TODOS os campos obrigatórios
    const camposIds = ['nome', 'cpf', 'whatsapp', 'email', 'cep', 'cidade-estado', 'bairro', 'rua', 'numero'];
    let temErro = false;

    camposIds.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (!elemento.value.trim()) {
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
        document.querySelector('.checkout-box').scrollIntoView({ behavior: 'smooth' });
        return;
    } else {
        if (errorDiv) errorDiv.style.display = 'none';
    }

    // Dados do carrinho
    let cartData = typeof getCheckoutData === 'function' ? getCheckoutData() : [];
    if (!Array.isArray(cartData)) cartData = [cartData];

    if (cartData.length === 0) {
        cartData = [{
            name: "Produto Fallback",
            price: 14990,
            qty: 1
        }];
    }

    let sumCents = 0;
    let descriptionNames = [];
    cartData.forEach(item => {
        sumCents += (item.price * (item.qty || 1));
        descriptionNames.push(item.name);
    });

    const TEST_MODE = true; // MODO TESTE
    const totalAmount = TEST_MODE ? 1.00 : (sumCents / 100);
    const orderData = cartData;

    const btn = document.querySelector('button[onclick="generatePix()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Gerando PIX seguro...';
    btn.disabled = true;

    try {
        const webhookUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') ? 'https://webhook.site/lambz-test' : window.location.origin + '/api/webhook';

        const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer APP_USR-4885585679236314-030619-a4f4b9fd60b88aa080825e0de62ef613-455827848',
                'X-Idempotency-Key': Date.now().toString()
            },
            body: JSON.stringify({
                transaction_amount: Number(totalAmount.toFixed(2)),
                description: `Lambz - ${descriptionNames.join(', ')}`.substring(0, 250),
                payment_method_id: "pix",
                notification_url: webhookUrl,
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

            // Salva o Pedido COMPLETO no Firebase
            if (window.lambzSaveOrder) {
                await window.lambzSaveOrder({
                    transactionId,
                    nome, cpf, whatsapp, email,
                    cep, cidadeEstado, bairro, rua, numero, complemento,
                    orderInfo: orderData,
                    totalAmount
                });
            }

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
                < div class="checkout-modal-card" >
            <div style="width: 64px; height: 64px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
            </div>
            
            <h2 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-color);">Pedido Reservado!</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 0.95rem;">Último passo: Escaneie o QR Code ou cole o código no seu aplicativo do banco para finalizar a compra de <strong>R$ ${amount.toFixed(2).replace('.', ',')}</strong>.</p>
            
            <img src="data:image/jpeg;base64,${qrCodeBase64}" alt="QR Code PIX Mercado Pago" style="width: 200px; height: 200px; margin: 0 auto 24px; border: 4px solid white; box-shadow: 0 0 0 1px #e2e8f0; border-radius: 8px;">

            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 24px; word-break: break-all; font-family: monospace; font-size: 0.8rem; color: #475569; position: relative;">
                ${payload}
            </div>

            <button id="copyPixBtn" class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 1.1rem; margin-bottom: 12px;">
                Copiar PIX Copia e Cola
            </button>

            <button onclick="showSuccessScreen(${amount})" style="width: 100%; padding: 12px; background: #fef08a; border: 1px dashed #ca8a04; color: #a16207; font-size: 0.9rem; margin-bottom: 24px; cursor: pointer; border-radius: 8px;">
                ⚙️ [Modo Teste] Simular Pagamento
            </button>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0;">
                <div class="spinner-grow" style="width: 1rem; height: 1rem; color: #16a34a; background-color: #16a34a; border-radius: 50%; display: inline-block; animation: spinner-grow 1s linear infinite;"></div>
                <p style="font-size: 0.9rem; color: #16a34a; font-weight: 500; margin: 0;">
                    Aguardando a confirmação do seu banco...
                </p>
            </div>
            <style>
                .checkout-modal-card {
                    background: white; padding: 48px 32px; border-radius: 12px; margin: 0 auto; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                @media (max-width: 600px) {
                    .checkout-modal-card { padding: 32px 16px; }
                    .checkout-modal-card h2 { font-size: 1.25rem !important; }
                    .checkout-modal-card p { font-size: 0.85rem !important; line-height: 1.4 !important; }
                    .checkout-modal-card img { width: 150px !important; height: 150px !important; }
                    .checkout-modal-card button { font-size: 0.95rem !important; padding: 14px !important; }
                    .checkout-modal-card .spinner-grow + p { font-size: 0.8rem !important; }
                }
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

                // Atualiza o Status para PAGO no Firebase
                if (window.lambzUpdateOrderStatus) {
                    await window.lambzUpdateOrderStatus(transactionId, "PAGO");
                }

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
        <div class="checkout-success-card">
            <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h2 style="font-size: 1.8rem; margin-bottom: 12px; color: #064e3b; font-weight: 800; animation: fadeIn 0.8s ease 0.4s both;">Pagamento Confirmado!</h2>
            <p style="color: #334155; margin-bottom: 24px; font-size: 1rem; line-height: 1.5; animation: fadeIn 0.8s ease 0.6s both;">Recebemos o seu pagamento.<br>Seu pedido já está em fase de separação em nosso estoque.</p>
            
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 32px; text-align: left; animation: fadeIn 0.8s ease 0.8s both;">
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">Enviaremos o código de rastreamento e as atualizações do pedido para o seu <strong>WhatsApp</strong> e <strong>E-mail</strong> cadastrados.</p>
            </div>

            <button onclick="window.location.href='index.html'" class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 1.1rem; background-color: #10b981; border-color: #10b981; animation: fadeIn 0.8s ease 1s both;">
                Voltar à Loja
            </button>
        </div>

        <style>
            .checkout-success-card {
                background: white; padding: 48px 32px; border-radius: 12px; margin: 0 auto; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-top: 5px solid #10b981; animation: slideUpFade 0.6s ease-out;
            }
            @media (max-width: 600px) {
                .checkout-success-card { padding: 32px 16px; }
                .checkout-success-card h2 { font-size: 1.35rem !important; }
                .checkout-success-card p { font-size: 0.85rem !important; line-height: 1.4 !important; }
                .checkout-success-card button { font-size: 0.95rem !important; padding: 14px !important; }
            }
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


