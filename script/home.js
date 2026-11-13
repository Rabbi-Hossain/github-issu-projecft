let allIssues = [];

// Fetch Data
const loadIssues = () => {
    document.getElementById('loading').classList.remove('hidden');
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;
            displayIssues(allIssues);
            document.getElementById('loading').classList.add('hidden');
        });
};

// Display Cards
const displayIssues = (issues) => {
    const container = document.getElementById('card-container');
    const countTag = document.getElementById('issue-count');
    container.innerHTML = '';
    countTag.innerText = `${issues.length} Issues`;

    if (issues.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-slate-400 py-10">No issues found</p>`;
        return;
    }

    issues.forEach(item => {
        const div = document.createElement('div');
        
        // Top border color (Green for open, Purple for closed)
        const borderColor = item.status === 'open' ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500';

        div.className = `bg-white p-4 rounded-xl shadow-sm border border-slate-200 ${borderColor} flex flex-col justify-between cursor-pointer hover:shadow-md`;
        
        div.onclick = () => showModal(item.id);

        div.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-3">
                    <i class="fa-regular fa-circle-dot ${item.status === 'open' ? 'text-green-500' : 'text-purple-500'}"></i>
                    <span class="text-xs uppercase px-2 py-0.5 rounded bg-slate-100 font-semibold">${item.priority}</span>
                </div>
                <h3 class="font-bold text-sm text-slate-800 mb-1 line-clamp-1">${item.title}</h3>
                <p class="text-xs text-slate-500 mb-3 line-clamp-2">${item.description}</p>
            </div>
            <div class="border-t pt-2 text-[11px] text-slate-400 flex justify-between">
                <span>#${item.id} by ${item.author}</span>
                <span>${new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
        `;
        container.appendChild(div);
    });
};

// Tab Filtering
const filterTab = (status) => {
    ['all', 'open', 'closed'].forEach(s => {
        const btn = document.getElementById(`btn-${s}`);
        btn.className = s === status ? 'btn btn-sm bg-blue-600 text-white' : 'btn btn-sm btn-ghost';
    });

    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(item => item.status === status);
        displayIssues(filtered);
    }
};

// Search
document.getElementById('search-input').addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase();
    if (!text) {
        displayIssues(allIssues);
        return;
    }
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
        .then(res => res.json())
        .then(data => displayIssues(data.data || []));
});

// Modal Details
const showModal = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            const item = data.data;
            document.getElementById('modal-title').innerText = item.title;
            document.getElementById('modal-desc').innerText = item.description;
            document.getElementById('modal-author').innerText = item.author;
            document.getElementById('modal-date').innerText = new Date(item.createdAt).toLocaleDateString();
            document.getElementById('my_modal').showModal();
        });
};

loadIssues();