const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            filelist = walkSync(filePath, filelist);
        } else {
            filelist.push(filePath);
        }
    });
    return filelist;
};

const directories = [
    path.join(__dirname, 'components'),
    path.join(__dirname, 'user')
];

let files = [];
directories.forEach(dir => {
    files = files.concat(walkSync(dir));
});

// We want to skip layout-related files
const skipFiles = ['header.jsx', 'Home.jsx', 'Navbar.jsx', 'Sidebar.jsx', 'Topbar.jsx', 'PublicLayout.jsx', 'DashboardLayout.jsx', 'Landing.jsx', 'About.jsx', 'Contact.jsx', 'Benefits.jsx'];

files.forEach(file => {
    if (!file.endsWith('.jsx')) return;
    const basename = path.basename(file);
    if (skipFiles.includes(basename)) return;

    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Regex to match header imports (e.g. import Header from "../header"; or import Header from "../../components/header"; etc)
    content = content.replace(/import\s+Header\s+from\s+['"].*?header['"];?\n?/g, '');
    
    // Regex to match <Header /> or <Header></Header>
    content = content.replace(/<Header\s*\/>\n?/g, '');
    content = content.replace(/<Header>.*?<\/Header>\n?/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Cleaned up ${basename}`);
    }
});

console.log("Cleanup complete!");
