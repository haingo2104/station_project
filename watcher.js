const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const projectPath = path.resolve(__dirname); 

const watcher = chokidar.watch(projectPath, {
  ignored: /node_modules|\.git/,
  persistent: true,
  ignoreInitial: true
});

function isInProjectPath(filePath) {
  return filePath.startsWith(projectPath);
}

watcher.on('add', filePath => {
  if (isInProjectPath(filePath)) {
    console.log(`Fichier non autorisé détecté: ${filePath}. Suppression...`);
    try {
      fs.unlinkSync(filePath);
      console.log('Fichier supprimé.');
    } catch (err) {
      console.error(`Erreur lors de la suppression du fichier: ${err.message}`);
    }
  }
});

watcher.on('addDir', dirPath => {
  if (isInProjectPath(dirPath)) {
    console.log(`Répertoire non autorisé détecté: ${dirPath}. Suppression...`);
    try {
      fs.rmdirSync(dirPath, { recursive: true });
      console.log('Répertoire supprimé.');
    } catch (err) {
      console.error(`Erreur lors de la suppression du répertoire: ${err.message}`);
    }
  }
});

watcher.on('unlink', filePath => {
  console.log(`Fichier supprimé: ${filePath}`);
});

watcher.on('unlinkDir', dirPath => {
  console.log(`Répertoire supprimé: ${dirPath}`);
});

console.log('Surveillance des fichiers activée.');
