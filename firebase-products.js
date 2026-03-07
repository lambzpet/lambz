/**
 * LAMBZ - Firebase Products Loader (Módulo ES6)
 * ================================================
 * Este módulo conecta ao Firebase Firestore e carrega os produtos
 * da coleção "produtos". Ao carregar, ele substitui o array
 * LAMBZ_PRODUCTS global e chama window.onProductsLoaded() se existir.
 * 
 * Se o Firebase estiver vazio ou der erro, os produtos estáticos
 * do products.js servem como fallback.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVw4-mqEgldVepnpXfmxUumhgS6mAlNVk",
    authDomain: "lambz-55076.firebaseapp.com",
    projectId: "lambz-55076",
    storageBucket: "lambz-55076.firebasestorage.app",
    messagingSenderId: "335255604910",
    appId: "1:335255604910:web:470b0bb72e59596c1be73f",
    measurementId: "G-ZNW5JTXDK3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadProductsFromFirebase() {
    try {
        const snapshot = await getDocs(collection(db, "produtos"));

        if (snapshot.empty) {
            console.log("Firebase vazio — usando produtos estáticos.");
            return;
        }

        const firebaseProducts = [];

        snapshot.forEach(doc => {
            const d = doc.data();
            firebaseProducts.push({
                id: doc.id,
                name: d.name || "Sem Nome",
                price: parseInt(d.price) || 0,
                oldPrice: parseInt(d.oldPrice) || 0,
                image: d.image || "",
                images: d.images || [d.image || ""],
                description: d.description || "",
                rating: parseFloat(d.rating) || 5.0,
                reviewCount: parseInt(d.reviewCount) || 0,
                badge: d.badge || null,
                colors: d.colors || [],
                sizes: d.sizes || null,
                reviews: d.reviews || []
            });
        });

        // Substituir o array global
        window.LAMBZ_PRODUCTS = firebaseProducts;

        console.log(`✅ ${firebaseProducts.length} produtos carregados do Firebase!`);

        // Chamar callback de re-render se a página definiu
        if (typeof window.onProductsLoaded === 'function') {
            window.onProductsLoaded();
        }

    } catch (error) {
        console.warn("⚠️ Erro ao carregar Firebase, usando produtos estáticos:", error.message);
    }
}

// Executar ao carregar
loadProductsFromFirebase();
