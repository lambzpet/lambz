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
        id: "garrafa-portatil-pet",
        name: "Garrafa de Água Portátil Pet",
        price: 37990,
        oldPrice: 59990,
        // Imagens hospedadas no Supabase Storage
        image: "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-hero.jpg",
        images: [
            "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-hero.jpg",
            "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-dimensoes.jpg",
            "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-cores.jpg",
            "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-detalhe.jpg",
            "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-bandeja.jpg"
        ],
        // Imagem de cada cor — troca a foto ao selecionar
        colorImages: {
            "Verde": "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-verde.jpg",
            "Rosa": "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-rosa.jpg",
            "Azul": "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-azul.jpg"
        },
        description: "Leve água fresca pro seu pet em qualquer passeio. Garrafa portátil de 800ml com bandeja dobrável de silicone — basta apertar o botão e a água sobe. Material ABS + TPR resistente, leve e fácil de limpar. Alça reforçada com mosquetão. Ideal para viagens, caminhadas e parques.",
        rating: 4.9,
        reviewCount: 347,
        badge: null,
        colors: ["Verde", "Rosa", "Azul"],
        sizes: null,
        reviews: [
            {
                name: "Carol Mendes",
                rating: 5,
                text: "Ótima garrafa, grande e convincente. Meu cachorro amou e agora levo em todo passeio. Muito prática!",
                photo: "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-uso-real.jpg"
            },
            {
                name: "Bia Ferreira",
                rating: 5,
                text: "Boa qualidade, conforme descrito. A bandeja dobrável é muito inteligente, cabe na bolsa tranquilamente.",
                photo: "https://curpipklnvljucpivppj.supabase.co/storage/v1/object/public/lambzbuckets/garrafa-portatil/garrafa-mao.jpg"
            },
            {
                name: "Rafa Oliveira",
                rating: 5,
                text: "Comprei pra usar nas trilhas com minha Golden e funcionou perfeito. Não vaza nada. Super recomendo!"
            }
        ]
    },
    {
        id: "alimentador-inteligente-camera",
        name: "Alimentador Automático Inteligente com Câmera",
        price: 286990,
        oldPrice: 399990,
        image: "https://placehold.co/800x800/1a1a2e/ffffff?text=Alimentador+Smart",
        images: [
            "https://placehold.co/800x800/1a1a2e/ffffff?text=Alimentador+Smart"
        ],
        colorImages: {
            "Preto": "https://placehold.co/800x800/1a1a2e/ffffff?text=Preto",
            "Branco": "https://placehold.co/800x800/f5f5f5/333333?text=Branco"
        },
        description: "Alimentador inteligente para cães e gatos com câmera HD 1080P e visão noturna. Veja e ouça seu pet em qualquer lugar! Programe de 1 a 6 refeições diárias com porções personalizáveis. Conexão WiFi 2.4/5 GHz pelo app \"Pet Zero\" — controle pelo celular, mesmo à distância. Capacidade de 4L, tigela de 6,7 polegadas. Alimentação dupla (bateria + cabo) para funcionar sem parar.",
        rating: 4.8,
        reviewCount: 89,
        badge: "Lançamento",
        colors: ["Preto", "Branco"],
        sizes: ["1 Tigela (2.4/5GHz)", "2 Tigelas (2.4/5GHz)"],
        reviews: [
            {
                name: "Mariana Costa",
                rating: 5,
                text: "Comprei pra alimentar meus 2 gatos enquanto viajo a trabalho. A câmera é nítida e o app funciona super bem. Nunca mais me preocupo se comeram!"
            },
            {
                name: "Thiago Rezende",
                rating: 5,
                text: "Produto incrível. Programação fácil, o WiFi 5GHz conecta sem travar e a visão noturna da câmera é surpreendente. Vale cada centavo."
            },
            {
                name: "Juliana Alves",
                rating: 4,
                text: "Funciona muito bem, meu dog já se acostumou com o barulho. Única coisa é que o app demora um pouco pra conectar na primeira vez, depois roda liso."
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
