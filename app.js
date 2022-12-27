const express = require('express');
const app = express();
const fs = require('fs');

let curPath = __dirname;


// Use public static files
app.use(express.static('public'));

// Current directory
const path = require('path');

// Use pug
app.set('view engine', 'pug');


app.get('/go/base', (req, res) => {

    // Back to the base directory
    curPath = __dirname

    // Read the current directory
    const files = fs.readdirSync(curPath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(curPath, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    }
    );

    // Render the pug file
    return res.render("files_folders",{files: files_with_type});
});
app.get('/go/back', (req, res) => {

    try{

        // Back to the parent directory
        const newpath = path.resolve(curPath, '..');
        
        // Read the current directory
        const files = fs.readdirSync(newpath);
        const files_with_type = files.map(file => {
            const file_type = fs.lstatSync(path.join(newpath, file)).isDirectory() ? "folder" : "file";
            return {
                name: file,
                type: file_type
            }
        }
        );
        
        // Update the currpath
        curPath = newpath

        // Render the pug file
        return res.render("files_folders",{files: files_with_type});
    }catch(err){
        next(err)
    }
        
    });


app.get('/:name', (req, res) => {
    
    // Get the name of the file
    const name = req.params.name;

    // Generate the path
    const newpath = path.join(curPath, name);
    
    // Check if file
    if (fs
        .lstatSync(newpath)
        .isFile()) {
            return res.download(newpath);
        }
        
    // Get names of files in the directory
    const files = fs.readdirSync(newpath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(newpath, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    }
    );
    
    // Update the current path
    curPath = newpath;

    // Render the files
    return res.render("files_folders",{files: files_with_type});

});


app.get('/', (req, res,next) => {

    // Get names of files in the directory
    const files = fs.readdirSync(curPath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(__dirname, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    });

    // Render
    res.render("files_folders",{files:files_with_type});

});

app.use((error,req,res,next)=>{


    // Read the current directory
    const files = fs.readdirSync(curPath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(curPath, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    }
    );

    // Render the pug file
    return res.render("files_folders",{files: files_with_type});
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});