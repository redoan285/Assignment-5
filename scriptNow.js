// =====================================================================
// ১. DOMContentLoaded - যখন পুরো HTML লোড হয়ে যাবে
// =====================================================================

document.addEventListener("DOMContentLoaded", function(){
    // লগিন ফর্ম ইভেন্ট লিসেনার
    const loginForm = document.getElementById("loginForm");
    if(loginForm){
        loginForm.addEventListener("submit", handleLogin);
    }
    
    // সার্চ বাটন ইভেন্ট লিসেনার
    const searchBtn = document.getElementById("searchBtn");
    if(searchBtn){
        searchBtn.addEventListener("click", handleSearch);
    }

    // ট্যাব ইভেন্ট লিসেনার
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", handleTabClick);
    });

    // মডাল আছে কিনা চেক করি
    if(!document.getElementById('issueModal')) {
        createModal();
    }

    // Google Fonts এবং Font Awesome যোগ করি
    addFontsAndIcons();
});

// =====================================================================
// ফন্ট এবং আইকন যোগ করার ফাংশন
// =====================================================================

function addFontsAndIcons() {
    // Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Font Awesome
    const faLink = document.createElement('link');
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    faLink.rel = 'stylesheet';
    document.head.appendChild(faLink);

    // Base style
    const style = document.createElement('style');
    style.textContent = `
        * {
            font-family: 'Inter', sans-serif;
        }
    `;
    document.head.appendChild(style);
}

// =====================================================================
// ২. লগিন ফাংশন
// =====================================================================

function handleLogin(event) {
    event.preventDefault(); // ফর্ম রিফ্রেশ হওয়া বন্ধ কর
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "admin123"){
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("mainSection").classList.remove("hidden");
        fetchAllIssues();
    } else {
        alert("ভুল ক্রেডেনশিয়াল! admin/admin123 ব্যবহার করুন।");
    }
}

// =====================================================================
// ৩. API থেকে ইস্যু আনা
// =====================================================================

async function fetchAllIssues() {
    showLoading(true);

    try {
        const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await response.json();

        console.log("Issues:", data.data);
        
        // সব ইস্যুগুলো সেভ করে রাখি (ফিল্টার ও সার্চের জন্য)
        window.allIssues = data.data;
        
        // ইস্যুগুলো কার্ড আকারে দেখাও
        displayIssues(data.data);
        
        showLoading(false);
    } catch (error){
        console.error("Error:", error);
        showLoading(false);
    }
}

// =====================================================================
// ৪. ইস্যুগুলো কার্ড আকারে দেখানোর ফাংশন
// =====================================================================

function displayIssues(issues) {
    const issuesGrid = document.getElementById('issuesGrid');
    
    // যদি কোনো ইস্যু না থাকে
    if(issues.length === 0) {
        issuesGrid.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">কোনো ইস্যু পাওয়া যায়নি</div>';
        document.getElementById('issueCount').textContent = `0 issues`;
        return;
    }
    
    // issues.map() = প্রতিটি ইস্যুর জন্য একটা করে কার্ড তৈরি কর
    issuesGrid.innerHTML = issues.map(issue => {
        // priority অনুযায়ী সব স্টাইল নির্ধারণ
        const isHighOrMedium = issue.priority === 'high' || issue.priority === 'medium';
        
        // টপ বার কালার - priority অনুযায়ী
        const topBarColor = isHighOrMedium ? 'bg-[#27AE60]' : 'bg-[#8E44AD]';
        
        // সার্কেল ব্যাকগ্রাউন্ড কালার
        const circleBgColor = isHighOrMedium ? 'bg-emerald-50' : 'bg-purple-50';
        
        // সার্কেল বর্ডার কালার
        const circleBorderColor = isHighOrMedium ? 'border-emerald-500' : 'border-purple-500';
        
        // priority ব্যাজের স্টাইল (আইকন সরানো হয়েছে)
        let priorityBadgeClass = '';
        let priorityText = issue.priority;
        
        if(issue.priority === 'high') {
            priorityBadgeClass = 'bg-red-50 text-red-400';
        } else if(issue.priority === 'medium') {
            priorityBadgeClass = 'bg-amber-50 text-amber-500';
        } else {
            priorityBadgeClass = 'bg-slate-100 text-slate-400';
        }
        
        // স্ট্যাটাস ইমেজ - priority অনুযায়ী (High/Medium = Open-Status.png, Low = Closed-Status.png)
        // এবং এটা দেখাবে কার্ডের বাম পাশের ইমোজির জায়গায়
        let statusImage = '';
        let circleImage = '';
        
        if(isHighOrMedium) {
            statusImage = 'assets/Open-Status.png';
        } else {
            statusImage = 'assets/Closed- Status .png';
        }
        
        // লেবেলগুলোর জন্য ব্যাজ স্টাইল - Font Awesome আইকন সহ
        const labelIcons = {
            'bug': '<i class="fas fa-bug mr-1"></i>',
            'help wanted': '<i class="fas fa-handshake-angle mr-1"></i>',
            'feature': '<i class="fas fa-star mr-1"></i>',
            'documentation': '<i class="fas fa-book mr-1"></i>',
            'enhancement': '<i class="fas fa-plus-circle mr-1"></i>',
            'question': '<i class="fas fa-question-circle mr-1"></i>'
        };
        
        const labelColors = {
            'bug': 'bg-red-50 text-red-500 border-red-100',
            'help wanted': 'bg-amber-50 text-amber-600 border-amber-100',
            'feature': 'bg-blue-50 text-blue-500 border-blue-100',
            'documentation': 'bg-purple-50 text-purple-500 border-purple-100',
            'enhancement': 'bg-green-50 text-green-600 border-green-100',
            'question': 'bg-gray-50 text-gray-600 border-gray-100'
        };
        
        return `
        <!-- ইস্যু কার্ড - priority: ${issue.priority} -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <!-- টপ কালার বার - priority অনুযায়ী (high/medium = green, low = purple) -->
            <div class="h-1.5 w-full ${topBarColor}"></div>
            
            <div class="p-5">
                <!-- হেডার section -->
                <div class="flex justify-between items-center mb-4">
                    <!-- বাম পাশের সার্কেলের জায়গায় Status ইমেজ -->
                    <div class="w-8 h-8 rounded-full ${circleBgColor} flex items-center justify-center">
                        <img src="${statusImage}" class="w-5 h-5" alt="status">
                    </div>
                    <div class="flex gap-2">
                        <!-- Priority ব্যাজ (শুধু টেক্সট, আইকন নেই) -->
                        <span class="${priorityBadgeClass} text-[11px] font-bold px-4 py-1 rounded-full uppercase">
                            ${priorityText}
                        </span>
                    </div>
                </div>
                
                <!-- ইস্যুর টাইটেল - ক্লিক করলে মডাল খুলবে -->
                <h3 class="text-slate-800 font-bold text-lg mb-2 cursor-pointer hover:text-blue-600" onclick="showIssueDetails(${issue.id})">
                    ${issue.title}
                </h3>
                
                <!-- ইস্যুর বিবরণ (শুধু প্রথম ১০০ অক্ষর) -->
                <p class="text-slate-400 text-sm mb-4">
                    ${issue.description.substring(0, 100)}...
                </p>
                
                <!-- লেবেল section - Font Awesome আইকন সহ -->
                <div class="flex flex-wrap gap-2 mb-6">
                    ${issue.labels.map(label => {
                        const labelKey = label.toLowerCase();
                        const colorClass = labelColors[labelKey] || 'bg-gray-50 text-gray-500 border-gray-100';
                        const icon = labelIcons[labelKey] || '<i class="fas fa-tag mr-1"></i>';
                        
                        return `
                            <span class="${colorClass} text-[11px] px-3 py-1 rounded-full border font-medium flex items-center">
                                ${icon} ${label.toUpperCase()}
                            </span>
                        `;
                    }).join('')}
                </div>
                
                <hr class="border-gray-100 -mx-5 mb-4">
                
                <!-- লেখক এবং তারিখ section - Font Awesome আইকন সহ -->
                <div class="text-slate-400 text-sm">
                    <p class="flex items-center gap-1">
                        <i class="fas fa-hashtag text-xs"></i> ${issue.id} by ${issue.author}
                    </p>
                    <p class="flex items-center gap-1 mt-1">
                        <i class="far fa-calendar-alt text-xs"></i> ${new Date(issue.createdAt).toLocaleDateString('en-US')}
                    </p>
                </div>
            </div>
        </div>
    `}).join('');
    
    // issueCount আপডেট কর (কতগুলো ইস্যু দেখাচ্ছে)
    document.getElementById('issueCount').textContent = `${issues.length} issues`;
}

// =====================================================================
// ৫. সিঙ্গেল ইস্যুর ডিটেইলস দেখানোর ফাংশন (মডালের জন্য)
// =====================================================================

async function showIssueDetails(issueId) {
    showLoading(true);
    
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
        const data = await response.json();
        const issue = data.data;
        
        // মডালের কন্টেন্ট তৈরি করি
        const modalContent = document.getElementById('modalContent');
        
        // যদি modalContent না থাকে, তাহলে একটা মডাল তৈরি করি
        if(!modalContent) {
            createModal();
        }
        
        // priority অনুযায়ী ব্যাজ স্টাইল (আইকন সরানো হয়েছে)
        let priorityBadgeClass = '';
        let priorityText = issue.priority.toUpperCase();
        
        if(issue.priority === 'high') {
            priorityBadgeClass = 'bg-red-500 text-white';
        } else if(issue.priority === 'medium') {
            priorityBadgeClass = 'bg-yellow-500 text-white';
        } else {
            priorityBadgeClass = 'bg-gray-500 text-white';
        }
        
        // priority অনুযায়ী status ইমেজ নির্ধারণ (মডালের বাম পাশের জন্য)
        const isHighOrMedium = issue.priority === 'high' || issue.priority === 'medium';
        let statusImage = '';
        
        if(isHighOrMedium) {
            statusImage = 'Open-Status.png';
        } else {
            statusImage = 'Closed-Status.png';
        }
        
        // status এর জন্য bg color
        let statusClass = isHighOrMedium ? 'bg-green-100' : 'bg-purple-100';
        
        // লেবেল আইকন
        const labelIcons = {
            'bug': '<i class="fas fa-bug mr-1"></i>',
            'help wanted': '<i class="fas fa-handshake-angle mr-1"></i>',
            'feature': '<i class="fas fa-star mr-1"></i>',
            'documentation': '<i class="fas fa-book mr-1"></i>',
            'enhancement': '<i class="fas fa-plus-circle mr-1"></i>',
            'question': '<i class="fas fa-question-circle mr-1"></i>'
        };
        
        // মডালের কন্টেন্ট সেট করি
        document.getElementById('modalContent').innerHTML = `
            <!-- Issue Card -->
            <div class="bg-white w-full rounded-xl shadow-lg p-6">
                <!-- Title -->
                <h2 class="text-2xl font-semibold text-gray-800 mb-3">
                    ${issue.title}
                </h2>

                <!-- Status Row - priority অনুযায়ী ইমেজ -->
                <div class="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span class="${statusClass} p-1 rounded-full flex items-center justify-center">
                        <img src="${statusImage}" class="w-5 h-5" alt="status">
                    </span>
                    <span class="flex items-center gap-1">
                        <i class="far fa-user-circle"></i> Opened by <span class="font-medium text-gray-700">${issue.author}</span>
                    </span>
                    <span class="flex items-center gap-1">
                        <i class="far fa-calendar-alt"></i> ${new Date(issue.createdAt).toLocaleDateString('en-GB')}
                    </span>
                </div>

                <!-- Tags - Font Awesome আইকন সহ -->
                <div class="flex gap-3 mb-4 flex-wrap">
                    ${issue.labels.map(label => {
                        let bgColor = '';
                        let textColor = '';
                        let labelText = label.toUpperCase();
                        let icon = labelIcons[label.toLowerCase()] || '<i class="fas fa-tag mr-1"></i>';
                        
                        if(label.toLowerCase() === 'bug') {
                            bgColor = 'bg-red-100';
                            textColor = 'text-red-600';
                        } else if(label.toLowerCase() === 'help wanted') {
                            bgColor = 'bg-yellow-100';
                            textColor = 'text-yellow-700';
                        } else if(label.toLowerCase() === 'feature') {
                            bgColor = 'bg-blue-100';
                            textColor = 'text-blue-600';
                        } else if(label.toLowerCase() === 'documentation') {
                            bgColor = 'bg-purple-100';
                            textColor = 'text-purple-600';
                        } else {
                            bgColor = 'bg-gray-100';
                            textColor = 'text-gray-700';
                        }
                        
                        return `
                            <span class="${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                ${icon} ${labelText}
                            </span>
                        `;
                    }).join('')}
                </div>

                <!-- Description -->
                <p class="text-gray-600 mb-6">
                    ${issue.description}
                </p>

                <!-- Bottom Info -->
                <div class="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-500 flex items-center gap-1">
                            <i class="far fa-user"></i> Assignee:
                        </p>
                        <p class="font-semibold text-gray-800 flex items-center gap-1">
                            <i class="fas fa-user-check text-gray-600"></i> ${issue.assignee || issue.author}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <i class="fas fa-flag"></i> Priority:
                        </p>
                        <span class="${priorityBadgeClass} text-xs px-3 py-1 rounded-full font-semibold">
                            ${priorityText}
                        </span>
                    </div>
                </div>

                <!-- Button -->
                <div class="flex justify-end mt-6">
                    <button onclick="document.getElementById('issueModal').close()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:opacity-90 flex items-center gap-2">
                        <i class="fas fa-times-circle"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        // মডাল দেখাও
        document.getElementById('issueModal').showModal();
        showLoading(false);
        
    } catch (error) {
        console.error('Error fetching issue details:', error);
        alert('ইস্যুর ডিটেইলস লোড করতে সমস্যা হয়েছে');
        showLoading(false);
    }
}

// =====================================================================
// ৬. মডাল তৈরি করার ফাংশন (যদি HTML এ না থাকে)
// =====================================================================

function createModal() {
    // মডালের HTML তৈরি করি
    const modalHTML = `
        <dialog id="issueModal" class="modal">
            <div class="modal-box w-11/12 max-w-3xl p-0 bg-transparent shadow-none">
                <div id="modalContent" class="w-full"></div>
            </div>
        </dialog>
    `;
    
    // body তে মডাল যোগ করি
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// =====================================================================
// ৭. লোডিং দেখানো/লুকানোর ফাংশন
// =====================================================================

function showLoading(show) {
    const loading = document.getElementById("loading");
    const issuesGrid = document.getElementById("issuesGrid");

    if(show){
        loading.classList.remove("hidden");
        issuesGrid.classList.add("hidden");
    } else {
        loading.classList.add("hidden");
        issuesGrid.classList.remove("hidden");
    }
}

// =====================================================================
// ৮. সার্চ ফাংশন
// =====================================================================

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    console.log('Searching for:', searchTerm);
    
    if(searchTerm === '') {
        // সার্চ টার্ম খালি থাকলে সব ইস্যু দেখাও
        fetchAllIssues();
        return;
    }
    
    // সার্চ API কল
    searchIssues(searchTerm);
}

// =====================================================================
// ৯. সার্চ API ফাংশন
// =====================================================================

async function searchIssues(searchTerm) {
    showLoading(true);
    
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        console.log('Search Results:', data);
        
        if(data.data && data.data.length > 0) {
            displayIssues(data.data);
        } else {
            displayIssues([]);
        }
        
        showLoading(false);
    } catch(error) {
        console.error('Search Error:', error);
        showLoading(false);
    }
}

// =====================================================================
// ১০. ট্যাব ক্লিক হ্যান্ডলার
// =====================================================================

function handleTabClick(event) {
    // সব ট্যাব থেকে active ক্লাস সরাও
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab-active'));
    
    // এই ট্যাবে active ক্লাস যোগ কর
    event.target.classList.add('tab-active');
    
    // কোন স্ট্যাটাস সিলেক্ট করেছে (all, open, closed)
    const status = event.target.dataset.status;
    console.log('Selected status:', status);
    
    // স্ট্যাটাস অনুযায়ী ফিল্টার করে দেখাও
    filterIssuesByStatus(status);
}

// =====================================================================
// ১১. স্ট্যাটাস অনুযায়ী ফিল্টার ফাংশন
// =====================================================================

async function filterIssuesByStatus(status) {
    showLoading(true);
    
    try {
        // যদি all সিলেক্ট করে, তাহলে সব ইস্যু দেখাও
        if(status === 'all') {
            fetchAllIssues();
            return;
        }
        
        // API থেকে সব ইস্যু এনে ফিল্টার করি
        const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await response.json();
        
        // স্ট্যাটাস অনুযায়ী ফিল্টার করি
        const filteredIssues = data.data.filter(issue => issue.status === status);
        
        // ফিল্টার করা ইস্যু দেখাই
        displayIssues(filteredIssues);
        showLoading(false);
        
    } catch(error) {
        console.error("Filter Error:", error);
        showLoading(false);
    }
}