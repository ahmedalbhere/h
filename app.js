// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, update, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ4VhGD49H3RNifMf9VCRPnkALAxNpsOU",
    authDomain: "project-2980864980936907935.firebaseapp.com",
    databaseURL: "https://project-2980864980936907935-default-rtdb.firebaseio.com",
    projectId: "project-2980864980936907935",
    storageBucket: "project-2980864980936907935.appspot.com",
    messagingSenderId: "580110751353",
    appId: "1:580110751353:web:8f039f9b34e1709d4126a8",
    measurementId: "G-R3JNPHCFZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// متغيرات التطبيق
let currentUser = null;
let currentUserType = null;

// عناصر DOM
const screens = {
    roleSelection: document.getElementById('roleSelection'),
    clientLogin: document.getElementById('clientLogin'),
    barberLogin: document.getElementById('barberLogin'),
    clientDashboard: document.getElementById('clientDashboard'),
    barberDashboard: document.getElementById('barberDashboard')
};

// عرض شاشة معينة وإخفاء الباقي
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.classList.add('hidden');
    });
    screens[screenId].classList.remove('hidden');
}

// تهيئة الأحداث
function initEventListeners() {
    // أحداث صفحة اختيار الدور
    document.getElementById('clientBtn').addEventListener('click', () => showScreen('clientLogin'));
    document.getElementById('barberBtn').addEventListener('click', () => showScreen('barberLogin'));
    
    // أحداث تسجيل دخول الزبون
    document.getElementById('clientLoginBtn').addEventListener('click', clientLogin);
    document.getElementById('clientBackBtn').addEventListener('click', () => showScreen('roleSelection'));
    
    // أحداث تسجيل دخول الحلاق
    document.getElementById('barberLoginBtn').addEventListener('click', barberLogin);
    document.getElementById('showSignupBtn').addEventListener('click', showBarberSignup);
    document.getElementById('showLoginBtn').addEventListener('click', showBarberLogin);
    document.getElementById('barberSignupBtn').addEventListener('click', barberSignup);
    document.getElementById('barberBackBtn').addEventListener('click', () => showScreen('roleSelection'));
    
    // أحداث تسجيل الخروج
    document.getElementById('clientLogoutBtn').addEventListener('click', logout);
    document.getElementById('barberLogoutBtn').addEventListener('click', logout);
    
    // أحداث أخرى
    document.getElementById('cancelBookingBtn').addEventListener('click', () => {
        if (currentUser?.booking) {
            cancelBooking(currentUser.booking.barberId, currentUser.booking.bookingId);
        }
    });
}

// ... (بقية الدوال تبقى كما هي بدون تغيير) ...

// تهيئة التطبيق عند تحميل الصفحة
function initApp() {
    initEventListeners();
    showScreen('roleSelection');
    
    // مراقبة حالة المصادقة
    onAuthStateChanged(auth, (user) => {
        if (user && currentUserType === 'barber') {
            // إذا كان الحلاق مسجل الدخول، عرض لوحة التحكم
            showBarberDashboard();
            loadBarberQueue();
        } else if (user && currentUserType === 'client') {
            // إذا كان الزبون مسجل الدخول، عرض لوحة التحكم
            showClientDashboard();
            loadBarbers();
        }
    });
}

// بدء تشغيل التطبيق
document.addEventListener('DOMContentLoaded', initApp);
