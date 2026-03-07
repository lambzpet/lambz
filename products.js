/**
 * LAMBZ - Base de Produtos
 * ========================
 * Este é o "banco de dados" da loja.
 * Para adicionar/editar/remover produtos, basta alterar este arquivo.
 * 
 * Quando houver backend, este arquivo será substituído por uma API,
 * mas a estrutura dos dados permanece a mesma.
 * 
 * CAMPOS OBRIGATÓRIOS:
 * - id: identificador único (string simples, ex: "cama-nuvem")
 * - name: nome do produto
 * - price: preço atual em centavos (14990 = R$ 149,90)
 * - oldPrice: preço antigo em centavos (para mostrar o "de/por")
 * - image: URL da imagem principal
 * - images: array de URLs (galeria, a primeira é a principal)
 * - description: descrição curta do produto
 * - rating: nota de 0 a 5
 * - reviewCount: quantidade de avaliações
 * - badge: texto do selo (ex: "Mais Vendido", "Novidade") ou null
 * - colors: array de cores disponíveis
 * - sizes: array de tamanhos disponíveis (ou null se não tiver)
 * - reviews: array de avaliações de clientes
 */

window.LAMBZ_PRODUCTS = [
    {
        id: "cama-nuvem",
        name: "Cama Terapêutica Nuvem",
        price: 14990,
        oldPrice: 29990,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800&h=800",
        images: [
            "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        description: "Feita com espuma viscoelástica de alta densidade que se molda ao corpo do seu pet, aliviando a pressão nas articulações. Revestimento anti-pelos removível e lavável. Conforto absoluto.",
        rating: 5.0,
        reviewCount: 428,
        badge: "Mais Vendido",
        colors: ["Cinza Nuvem", "Bege Areia", "Rosa Blush"],
        sizes: ["P (até 8kg)", "M (até 18kg)", "G (até 35kg)"],
        reviews: [
            {
                name: "Marcela S.",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Finalmente encontrei uma cama que realmente dura e que meu cachorro amou na hora. O acabamento é muito diferente das antigas que eu comprava. Vale cada centavo!"
            },
            {
                name: "Lucas R.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Surreal a qualidade. Minha Golden de 28kg dorme nessa cama e ela não deformou em nada depois de meses. Recomendo demais a Lambz."
            },
            {
                name: "Ana P.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Chegou super rápido e muito bem embalado. Minha gata não sai mais de cima. Já é o segundo produto que compro da Lambz, virei fã!"
            }
        ]
    },
    {
        id: "coleira-conforto",
        name: "Coleira Peitoral Conforto Absoluto",
        price: 8990,
        oldPrice: 15990,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800&h=800",
        images: [
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        description: "Peitoral ergonômico com forro acolchoado que distribui a pressão uniformemente. Fivelas de aço inox, costura reforçada e tecido respirável. Seu pet passeia sem desconforto.",
        rating: 4.9,
        reviewCount: 156,
        badge: "Novidade",
        colors: ["Preto Clássico", "Vermelho Aventura", "Azul Petróleo"],
        sizes: ["PP (até 4kg)", "P (até 8kg)", "M (até 18kg)", "G (até 35kg)"],
        reviews: [
            {
                name: "Fernanda M.",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Meu cachorro puxava muito na coleira antiga. Com essa peitoral ele ficou muito mais tranquilo nos passeios. Material excelente!"
            },
            {
                name: "Pedro H.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Acabamento impecável, parece produto importado de alto padrão. Meu Bulldog Francês usa todo dia e está intacta."
            }
        ]
    },
    {
        id: "bebedouro-zen",
        name: "Bebedouro Fonte Zen Água Corrente",
        price: 17990,
        oldPrice: 24990,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800&h=800",
        images: [
            "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        description: "Fonte de água com filtro de carvão ativado e fluxo silencioso. Estimula seu pet a beber mais água, prevenindo problemas renais. Capacidade de 2.5L com LED noturno.",
        rating: 4.9,
        reviewCount: 89,
        badge: null,
        colors: ["Branco Crystal", "Verde Menta"],
        sizes: null,
        reviews: [
            {
                name: "Camila T.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Meus dois gatos adoraram! Antes quase não bebiam água, agora ficam brincando com o jato. Super silencioso também."
            },
            {
                name: "Roberto S.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 4,
                text: "Filtro dura bastante e o LED à noite é lindo. Único ponto: demorou um pouco pro meu gato se acostumar, mas agora só bebe aqui."
            }
        ]
    },
    {
        id: "escova-pelos",
        name: "Luva e Escova Removedora de Pelos",
        price: 4990,
        oldPrice: 9990,
        image: "https://images.unsplash.com/photo-1628009559385-484bd7480a40?auto=format&fit=crop&q=80&w=800&h=800",
        images: [
            "https://images.unsplash.com/photo-1628009559385-484bd7480a40?auto=format&fit=crop&q=80&w=800&h=800"
        ],
        description: "Luva de silicone premium com cerdas suaves que removem pelos soltos enquanto massageiam seu pet. Funciona em cães e gatos. Fácil de limpar — os pelos saem numa única passada.",
        rating: 4.8,
        reviewCount: 210,
        badge: null,
        colors: ["Azul", "Rosa", "Verde"],
        sizes: null,
        reviews: [
            {
                name: "Julia F.",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Impressionante a quantidade de pelo que sai! Meu sofá agradece. E minha gata ama quando eu uso, fica ronronando."
            },
            {
                name: "Thiago B.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                rating: 5,
                text: "Melhor custo-benefício da Lambz. Uso todo dia no meu Golden e ele adora. Muito mais prático que escova normal."
            }
        ]
    }
];

/* ────────────────────────────────────────
   FUNÇÕES UTILITÁRIAS
   ──────────────────────────────────────── */

/** Formata centavos para BRL: 14990 → "R$ 149,90" */
function formatPrice(cents) {
    return "R$ " + (cents / 100).toFixed(2).replace(".", ",");
}

/** Calcula desconto: (14990, 29990) → "-50%" */
function calcDiscount(price, oldPrice) {
    const pct = Math.round((1 - price / oldPrice) * 100);
    return "-" + pct + "%";
}

/** Busca produto por ID */
function getProductById(id) {
    return LAMBZ_PRODUCTS.find(p => p.id === id) || null;
}

/** Pega o ID do produto da URL: ?id=cama-nuvem */
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/** Gera estrelas SVG */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
    }
    return html;
}

/** Salva produto escolhido no localStorage para o checkout ler */
function saveToCheckout(productId, qty, color, size) {
    const product = getProductById(productId);
    if (!product) return;

    const checkoutData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty || 1,
        color: color || product.colors[0],
        size: size || (product.sizes ? product.sizes[0] : null)
    };

    localStorage.setItem("lambz_checkout", JSON.stringify(checkoutData));
}

/** Lê dados do checkout do localStorage */
function getCheckoutData() {
    const data = localStorage.getItem("lambz_checkout");
    return data ? JSON.parse(data) : null;
}
