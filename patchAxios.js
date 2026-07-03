const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        var pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        if (!--pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.jsx')) {
                        let content = fs.readFileSync(file, 'utf8');
                        if (content.includes('VITE_topic') && content.includes('{ headers: { "Content-type": "application/json" } }')) {
                            content = content.replace('{ headers: { "Content-type": "application/json" } }', '{ headers: { "Content-type": "application/json" }, withCredentials: true }');
                            fs.writeFileSync(file, content, 'utf8');
                            console.log('Patched: ' + file);
                        }
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

walk('src', (err) => {
    if (err) console.error(err);
    else console.log('Done!');
});
