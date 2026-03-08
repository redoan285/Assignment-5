document.addEventListener("DOMContentLoaded", function(){
    const loginForm = document.getElementById("loginForm");
    if(loginForm){
        loginForm.addEventListener("submit", handleLogin);
    }
    
    const searchBtn = document.getElementById("searchBtn");
    if(searchBtn){
        searchBtn.addEventListener("click", handleSearch);
    }

    const searchInput = document.getElementById("searchInput");
    if(searchInput){
        searchInput.addEventListener("keypress", function(e){
            if(e.key === "Enter"){
                handleSearch();
            }
        });
    }

    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", handleTabClick);
    });

    if(!document.getElementById('issueModal')) {
        createModal();
    }
});

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "admin123"){
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("mainSection").classList.remove("hidden");
        fetchAllIssues();
    } else {
        alert("Invalid credentials! Use admin/admin123");
    }
}

async function fetchAllIssues() {
    showLoading(true);
    try {
        const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await response.json();
        window.allIssues = data.data;
        displayIssues(data.data);
        showLoading(false);
    } catch (error){
        console.error("Error:", error);
        showLoading(false);
    }
}

function displayIssues(issues) {
    const issuesGrid = document.getElementById('issuesGrid');
    
    if(issues.length === 0) {
        issuesGrid.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No issues found</div>';
        document.getElementById('issueCount').textContent = `0 issues`;
        return;
    }
    
    issuesGrid.innerHTML = issues.map(issue => {
        const isHighOrMedium = issue.priority === 'high' || issue.priority === 'medium';
        const borderClass = issue.status === 'open' ? 'card-open' : 'card-closed';
        const circleBgColor = isHighOrMedium ? 'bg-emerald-50' : 'bg-purple-50';
        
        let priorityBadgeClass = '';
        if(issue.priority === 'high') priorityBadgeClass = 'bg-red-50 text-red-400';
        else if(issue.priority === 'medium') priorityBadgeClass = 'bg-amber-50 text-amber-500';
        else priorityBadgeClass = 'bg-slate-100 text-slate-400';
        
        const statusImage = isHighOrMedium ? 'assets/Open-Status.png' : 'assets/Closed- Status .png';
        
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
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${borderClass}">
            <div class="p-5">
                <div class="flex justify-between items-center mb-4">
                    <div class="w-8 h-8 rounded-full ${circleBgColor} flex items-center justify-center">
                        <img src="${statusImage}" class="w-5 h-5" alt="status">
                    </div>
                    <div class="flex gap-2">
                        <span class="${priorityBadgeClass} text-[11px] font-bold px-4 py-1 rounded-full uppercase">${issue.priority}</span>
                    </div>
                </div>
                <h3 class="text-slate-800 font-bold text-lg mb-2 cursor-pointer hover:text-blue-600" onclick="showIssueDetails(${issue.id})">${issue.title}</h3>
                <p class="text-slate-400 text-sm mb-4">${issue.description.substring(0, 100)}...</p>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${issue.labels.map(label => {
                        const labelKey = label.toLowerCase();
                        const colorClass = labelColors[labelKey] || 'bg-gray-50 text-gray-500 border-gray-100';
                        const icon = labelIcons[labelKey] || '<i class="fas fa-tag mr-1"></i>';
                        return `<span class="${colorClass} text-[11px] px-3 py-1 rounded-full border font-medium flex items-center">${icon} ${label.toUpperCase()}</span>`;
                    }).join('')}
                </div>
                <hr class="border-gray-100 -mx-5 mb-4">
                <div class="text-slate-400 text-sm">
                    <p class="flex items-center gap-1"><i class="fas fa-hashtag text-xs"></i> ${issue.id} by ${issue.author}</p>
                    <p class="flex items-center gap-1 mt-1"><i class="far fa-calendar-alt text-xs"></i> ${new Date(issue.createdAt).toLocaleDateString('en-US')}</p>
                </div>
            </div>
        </div>`;
    }).join('');
    
    document.getElementById('issueCount').textContent = `${issues.length} issues`;
}

async function showIssueDetails(issueId) {
    showLoading(true);
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
        const data = await response.json();
        const issue = data.data;
        
        const modalContent = document.getElementById('modalContent');
        if(!modalContent) createModal();
        
        let priorityBadgeClass = '';
        if(issue.priority === 'high') priorityBadgeClass = 'bg-red-500 text-white';
        else if(issue.priority === 'medium') priorityBadgeClass = 'bg-yellow-500 text-white';
        else priorityBadgeClass = 'bg-gray-500 text-white';
        
        const statusText = issue.status === 'open' ? 'Open' : 'Closed';
        const statusClass = issue.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';
        
        const labelIcons = {
            'bug': '<i class="fas fa-bug mr-1"></i>',
            'help wanted': '<i class="fas fa-handshake-angle mr-1"></i>',
            'feature': '<i class="fas fa-star mr-1"></i>',
            'documentation': '<i class="fas fa-book mr-1"></i>',
            'enhancement': '<i class="fas fa-plus-circle mr-1"></i>',
            'question': '<i class="fas fa-question-circle mr-1"></i>'
        };
        
        document.getElementById('modalContent').innerHTML = `
            <div class="bg-white w-full rounded-xl shadow-lg p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-3">${issue.title}</h2>
                <div class="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span class="${statusClass} px-3 py-1 rounded-full font-medium">${statusText}</span>
                    <span class="flex items-center gap-1"><i class="far fa-user-circle"></i> Opened by <span class="font-medium text-gray-700">${issue.author}</span></span>
                    <span class="flex items-center gap-1"><i class="far fa-calendar-alt"></i> ${new Date(issue.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <div class="flex gap-3 mb-4 flex-wrap">
                    ${issue.labels.map(label => {
                        let bgColor = '';
                        if(label.toLowerCase() === 'bug') bgColor = 'bg-red-100 text-red-600';
                        else if(label.toLowerCase() === 'help wanted') bgColor = 'bg-yellow-100 text-yellow-700';
                        else if(label.toLowerCase() === 'feature') bgColor = 'bg-blue-100 text-blue-600';
                        else if(label.toLowerCase() === 'documentation') bgColor = 'bg-purple-100 text-purple-600';
                        else bgColor = 'bg-gray-100 text-gray-700';
                        const icon = labelIcons[label.toLowerCase()] || '<i class="fas fa-tag mr-1"></i>';
                        return `<span class="${bgColor} px-3 py-1 rounded-full text-sm font-medium flex items-center">${icon} ${label.toUpperCase()}</span>`;
                    }).join('')}
                </div>
                <p class="text-gray-600 mb-6">${issue.description}</p>
                <div class="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p class="text-sm text-gray-500 flex items-center gap-1"><i class="far fa-user"></i> Assignee:</p>
                        <p class="font-semibold text-gray-800 flex items-center gap-1"><i class="fas fa-user-check text-gray-600"></i> ${issue.assignee || issue.author}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1 flex items-center gap-1"><i class="fas fa-flag"></i> Priority:</p>
                        <span class="${priorityBadgeClass} text-xs px-3 py-1 rounded-full font-semibold">${issue.priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="flex justify-end mt-6">
                    <button onclick="document.getElementById('issueModal').close()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:opacity-90 flex items-center gap-2"><i class="fas fa-times-circle"></i> Close</button>
                </div>
            </div>
        `;
        
        document.getElementById('issueModal').showModal();
        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load issue details');
        showLoading(false);
    }
}

function createModal() {
    const modalHTML = `
        <dialog id="issueModal" class="modal">
            <div class="modal-box w-11/12 max-w-3xl p-0 bg-transparent shadow-none">
                <div id="modalContent" class="w-full"></div>
            </div>
        </dialog>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

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

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if(searchTerm === '') {
        displayIssues(window.allIssues);
        return;
    }
    searchIssues(searchTerm);
}

async function searchIssues(searchTerm) {
    showLoading(true);
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        displayIssues(data.data || []);
        showLoading(false);
    } catch(error) {
        console.error('Search Error:', error);
        showLoading(false);
    }
}

function handleTabClick(event) {
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('bg-blue-500', 'text-white');
    });
    event.target.classList.add('bg-blue-500', 'text-white');
    filterIssuesByStatus(event.target.dataset.status);
}

function filterIssuesByStatus(status) {
    if(status === 'all'){
        displayIssues(window.allIssues);
        return;
    }

    const filteredIssues = window.allIssues.filter(issue => issue.status === status);
    displayIssues(filteredIssues);
}