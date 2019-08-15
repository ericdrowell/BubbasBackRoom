const fs = require('fs');

fs.readdir('src/shaders', function(err, files) {
  files.forEach(function(file) {
    let glslStr = fs.readFileSync('src/shaders/' + file, 'utf-8');
    let variableName = file.replace('.glsl', '');
    let jsStr = 'const ' + variableName + ' = `' + glslStr + '`;';

    fs.writeFileSync('dist/shaders/' + file + '.js', jsStr, 'utf-8');
  });
});