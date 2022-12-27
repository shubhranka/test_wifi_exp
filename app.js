const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

let curPath = __dirname;

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Use public static files
app.use(express.static('public'));

// Current directory
const path = require('path');

// Use pug
app.set('view engine', 'pug');


app.get('/go/base', (req, res) => {

    // Back to the base directory
    curPath = __dirname

    // Redirect to the base directory
    return res.redirect('/');
});
app.get('/go/back', (req, res) => {

    try{

        // Back to the parent directory
        const newpath = path.resolve(curPath, '..');
        
        // Check if allowed directory
        fs.lstatSync(newpath)

        
        // Update the currpath
        curPath = newpath

        // Redirect to the base directory
        return res.redirect('/');
        
    }catch(err){
        next(err)
    }
        
    });


app.post('/', (req, res) => {
    
    try{


        console.log(req.body)
        // Get the name of the file
        const name = req.body.name;
        
        // Generate the path
        const newpath = path.join(curPath, name);
        
        // Check if file
        if (fs
            .lstatSync(newpath)
            .isFile()) {
                return res.download(newpath);
        }
        
        // Update the current path
        curPath = newpath;

        console.log(curPath)
        return res.redirect('/');
    }catch(err){
        next(err)
    }
    
});


app.get('/', (req, res,next) => {

    // Get names of files in the directory
    const files = fs.readdirSync(curPath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(curPath)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    });

    // Render
    return res.render("files_folders",{files:files_with_type,path:curPath});

});

app.use((error,req,res,next)=>{


    // Redirect to the base directory
    const files = fs.readdirSync(curPath);
    const files_with_type = files.map(file => {
        const file_type = fs.lstatSync(path.join(__dirname, file)).isDirectory() ? "folder" : "file";
        return {
            name: file,
            type: file_type
        }
    });

    // Render
    return res.render("files_folders",{files:files_with_type,path:curPath});

})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});