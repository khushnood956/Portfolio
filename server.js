// ==========================================================================
// LOCAL PORTFOLIO STATIC SERVER & PROJECT DEV GATEWAY (server.js)
// Zero-dependency file persistence for local CMS project editing.
// Run using: node server.js
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME Types for file serving
const MIME_TYPES = {
    '.html': 'text/html',
    '.HTML': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.xml': 'application/xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const { method, url } = req;

    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${url}`);

    // Handle Project Persistence API endpoint
    if (method === 'POST' && url === '/api/v1/projects') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // Verify request parses as valid JSON
                const projectsArray = JSON.parse(body);

                if (!Array.isArray(projectsArray)) {
                    throw new Error("Payload must be a JSON array of projects.");
                }

                const projectsJsonPath = path.join(__dirname, 'data', 'projects.json');
                const projectsJsPath = path.join(__dirname, 'data', 'projects.js');

                // Write 1: Write directly to projects.json
                fs.writeFileSync(projectsJsonPath, JSON.stringify(projectsArray, null, 2), 'utf8');

                // Write 2: Write window.projectsData variable to projects.js for CORS fallback
                const jsContent = `window.projectsData = ${JSON.stringify(projectsArray, null, 2)};\n`;
                fs.writeFileSync(projectsJsPath, jsContent, 'utf8');

                console.log(`\n🚀 [SUCCESS] Automatically updated database files on disk:`);
                console.log(`   - Written: ${projectsJsonPath}`);
                console.log(`   - Written: ${projectsJsPath}\n`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'success', 
                    message: 'Successfully persisted projects to files on disk!' 
                }));

            } catch (error) {
                console.error(`❌ [ERROR] Failed to save project payload:`, error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'error', 
                    message: error.message || 'Invalid JSON request payload.' 
                }));
            }
        });
        return;
    }

    // Serve Static Assets
    // Normalize URL path to resolve root index files
    let urlPath = url === '/' ? '/index.HTML' : url;
    let filePath = path.join(__dirname, urlPath);
    
    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Return 404 page if not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 File Not Found</h1><p>The requested file does not exist.</p>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`==========================================================`);
    console.log(`☕ JAVA BACKEND DEVELOPER PORTFOLIO - LOCAL WORKSTATION RUN`);
    console.log(`==========================================================`);
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log(`Admin Gateway is at:  http://localhost:${PORT}/admin/index.html`);
    console.log(`----------------------------------------------------------`);
    console.log(`Tip: Press Ctrl + Shift + P on the homepage to access the editor.`);
    console.log(`Press Ctrl + C to stop the server.`);
    console.log(`==========================================================\n`);
});
