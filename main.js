// تهيئة المتغيرات
let counterValue = 0;
let history = [];
let historySize = 10;
let currentEditIndex = -1;

// العناصر
const counterElement = document.getElementById('counter');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');
const setCounterInput = document.getElementById('set-counter-input');
const setCounterBtn = document.getElementById('set-counter-btn');
const historyList = document.getElementById('history-list');
const historySizeInput = document.getElementById('history-size');
const connectionStatus = document.getElementById('connection-status');

// عناصر النوافذ المنبثقة
const nameModal = document.getElementById('name-modal');
const historyNameInput = document.getElementById('history-name-input');
const confirmSaveBtn = document.getElementById('confirm-save');
const cancelSaveBtn = document.getElementById('cancel-save');

const editModal = document.getElementById('edit-modal');
const editNameInput = document.getElementById('edit-name-input');
const confirmEditBtn = document.getElementById('confirm-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

// التحقق من حالة الاتصال
function updateOnlineStatus() {
    if (navigator.onLine) {
        connectionStatus.textContent = 'متصل بالإنترنت';
        connectionStatus.classList.remove('offline');
        connectionStatus.classList.add('online');
    } else {
        connectionStatus.textContent = 'تعمل بدون اتصال';
        connectionStatus.classList.remove('online');
        connectionStatus.classList.add('offline');
    }
}

// تحميل القيمة المحفوظة من localStorage
function loadFromStorage() {
    const savedCounter = localStorage.getItem('tazkeerCounter');
    const savedHistory = localStorage.getItem('tazkeerHistory');
    const savedHistorySize = localStorage.getItem('tazkeerHistorySize');
    
    if (savedCounter) {
        counterValue = parseInt(savedCounter);
    }
    
    if (savedHistory) {
        history = JSON.parse(savedHistory);
    }
    
    if (savedHistorySize) {
        historySize = parseInt(savedHistorySize);
        historySizeInput.value = historySize;
    }
    
    updateCounter();
    updateHistory();
}

// تحديث العداد
function updateCounter() {
    counterElement.textContent = counterValue;
    localStorage.setItem('tazkeerCounter', counterValue);
    
    // تأثير احتفالي عند الوصول إلى أرقام محددة
    if (counterValue > 0 && (counterValue % 33 === 0 || counterValue % 99 === 0)) {
        counterElement.classList.add('celebrate');
        setTimeout(() => {
            counterElement.classList.remove('celebrate');
        }, 500);
    }
}

// تحديث سجل التاريخ
function updateHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li style="color: #888; text-align: center;">لا توجد سجلات سابقة</li>';
        return;
    }
    
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        li.innerHTML = `
            <div class="history-info">
                <span class="history-name">${item.name || 'بدون اسم'}</span>
                <span class="history-value">(${item.value})</span>
                <span class="history-date">${item.date}</span>
            </div>
            <div class="history-actions">
                <button class="history-settings-btn" data-index="${index}">
                    <i class="fas fa-cog"></i>
                </button>
                <div class="history-settings-menu" id="menu-${index}">
                    <button class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i> تعديل</button>
                    <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i> حذف</button>
                </div>
            </div>
        `;
        
        historyList.appendChild(li);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    document.querySelectorAll('.history-settings-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = this.getAttribute('data-index');
            const menu = document.getElementById(`menu-${index}`);
            
            // إخفاء جميع القوائم الأخرى
            document.querySelectorAll('.history-settings-menu').forEach(m => {
                if (m.id !== `menu-${index}`) {
                    m.classList.remove('show');
                }
            });
            
            // تبديل عرض القائمة الحالية
            menu.classList.toggle('show');
        });
    });
    
    // إضافة مستمعي الأحداث لأزرار التعديل والحذف
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            openEditModal(index);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteHistoryItem(index);
        });
    });
    
    // إغلاق القوائم عند النقر في أي مكان آخر
    document.addEventListener('click', function() {
        document.querySelectorAll('.history-settings-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

// فتح نافذة التعديل
function openEditModal(index) {
    currentEditIndex = index;
    editNameInput.value = history[index].name || '';
    editModal.classList.add('show');
}

// حفظ التعديل
function saveEdit() {
    if (currentEditIndex !== -1) {
        history[currentEditIndex].name = editNameInput.value.trim();
        localStorage.setItem('tazkeerHistory', JSON.stringify(history));
        updateHistory();
        editModal.classList.remove('show');
        currentEditIndex = -1;
    }
}

// حذف عنصر من السجل
function deleteHistoryItem(index) {
    history.splice(index, 1);
    localStorage.setItem('tazkeerHistory', JSON.stringify(history));
    updateHistory();
}

// إضافة تأثير النقر
function addClickEffect(element) {
    element.classList.add('click-effect');
    setTimeout(() => {
        element.classList.remove('click-effect');
    }, 300);
}

// زيادة العداد
incrementBtn.addEventListener('click', function() {
    counterValue++;
    updateCounter();
    addClickEffect(incrementBtn);
});

// إنقاص العداد
decrementBtn.addEventListener('click', function() {
    if (counterValue > 0) {
        counterValue--;
        updateCounter();
        addClickEffect(decrementBtn);
    }
});

// فتح نافذة إدخال الاسم عند التصفير
resetBtn.addEventListener('click', function() {
    if (counterValue > 0) {
        historyNameInput.value = '';
        nameModal.classList.add('show');
        addClickEffect(resetBtn);
    }
});

// تأكيد حفظ السجل مع الاسم
confirmSaveBtn.addEventListener('click', function() {
    saveHistoryItem();
});

// إلغاء حفظ السجل
cancelSaveBtn.addEventListener('click', function() {
    nameModal.classList.remove('show');
});

// حفظ العنصر في السجل
function saveHistoryItem() {
    const name = historyNameInput.value.trim();
    const now = new Date();
    const dateString = now.toLocaleDateString('ar-EG') + ' ' + 
                        now.toLocaleTimeString('ar-EG');
    
    history.unshift({
        value: counterValue,
        name: name || 'بدون اسم',
        date: dateString
    });
    
    // الحفاظ على آخر عناصر فقط في السجل حسب الحجم المحدد
    if (history.length > historySize) {
        history = history.slice(0, historySize);
    }
    
    // حفظ السجل وتحديثه
    localStorage.setItem('tazkeerHistory', JSON.stringify(history));
    updateHistory();
    
    // تصفير العداد وإغلاق النافذة
    counterValue = 0;
    updateCounter();
    nameModal.classList.remove('show');
}

// السماح بالحفظ باستخدام Enter في حقل الاسم
historyNameInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        saveHistoryItem();
    }
});

// تأكيد التعديل
confirmEditBtn.addEventListener('click', function() {
    saveEdit();
});

// إلغاء التعديل
cancelEditBtn.addEventListener('click', function() {
    editModal.classList.remove('show');
    currentEditIndex = -1;
});

// السماح بالحفظ باستخدام Enter في حقل التعديل
editNameInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        saveEdit();
    }
});

// تعيين قيمة مخصصة للعداد
setCounterBtn.addEventListener('click', function() {
    const newValue = parseInt(setCounterInput.value);
    if (!isNaN(newValue) && newValue >= 0) {
        counterValue = newValue;
        updateCounter();
        setCounterInput.value = '';
        addClickEffect(setCounterBtn);
    } else {
        alert('يرجى إدخال رقم صحيح موجب');
    }
});

// تغيير حجم السجل
historySizeInput.addEventListener('change', function() {
    const newSize = parseInt(this.value);
    if (!isNaN(newSize) && newSize >= 5 && newSize <= 100) {
        historySize = newSize;
        localStorage.setItem('tazkeerHistorySize', historySize);
        
        // تقليم السجل إذا كان أكبر من الحجم الجديد
        if (history.length > historySize) {
            history = history.slice(0, historySize);
            localStorage.setItem('tazkeerHistory', JSON.stringify(history));
            updateHistory();
        }
    } else {
        alert('يرجى إدخال رقم بين 5 و 100');
        this.value = historySize;
    }
});

// السماح بالاستخدام باستخدام Enter في حقل الإدخال
setCounterInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        setCounterBtn.click();
    }
});

// التهيئة الأولية عند تحميل الصفحة
window.addEventListener('load', function() {
    loadFromStorage();
    updateOnlineStatus();
    
    // إضافة مستمعي الأحداث لتغير حالة الاتصال
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // تسجيل Service Worker إذا كان متاحًا
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    initFooterAnimations();
});


// إضافة تأثيرات للفوتر عند التمرير
function initFooterAnimations() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    featureItems.forEach((item, index) => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(item);
    });
}