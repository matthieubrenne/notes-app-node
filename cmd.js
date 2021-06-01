const fs = require("fs");
const yargs = require('yargs');
const chalk = require('chalk');
const { stringify } = require('querystring');
const { array } = require('yargs');

//--------------------------------------------------------------------------------//
                // commande list //
//--------------------------------------------------------------------------------//


yargs.command({
    command: 'list',
    describe: 'Liste toutes mes notes',
    handler: () => {
        console.log("Voici la liste des notes");

        fs.readFile("data.json", "utf-8", (err,data) => {
            if(err) console.log(err);
            else {
                const notes = JSON.parse(data);

                // Boucle for classique
                // for(let i=0; i<notes.length;i++) {
                //     console.log(`${notes[i].id}. ${notes[i].title}`);
                // }

                // foreach
                notes.forEach(note => {
                    console.log(`${note.id}. ${note.title}`);
                })
            }
        })
    }

//--------------------------------------------------------------------------------//
                // commande add //
//--------------------------------------------------------------------------------//


}).command({
    command: 'add',
    describe: "Ajoute une note",
    builder: {
        title: {
            describe: "Titre de ma note",
            demandOption: true,
            type: "string"
        },
        message: {
            describe: "Message de ma note",
            demandOption: false,
            type: "string"
        }
    },
    handler: (argv) => {
        // Pour modifier le contenu d'un fichier
        // 1. le récupérer
        fs.readFile("data.json", "utf-8", (err,dataStr) => {
            // 1a. Grâce à utf-8, le contenu du fichier
            // est en  en chaîne de caractère
            console.log(dataStr)

            // 1b. Je transforme la string JSON en valeur JS
            const notes = JSON.parse(dataStr)
            console.log(notes);
    
            // 2. Exécuter les modifications en JS

            const newNote = {
                title: argv.title,
                message: argv.message
            }

            notes.push(newNote);
            console.log(notes);
    
            // 2b. Transformer mes modifs valeurs JS en chaine JSON
            const notesJSON = JSON.stringify(notes);
            console.log(notesJSON);

            // 3. Envoyer les modifs de mon JSON en écrasant le fichier
            fs.writeFile("data.json",notesJSON,(err) => {
                if(err) console.log(err);
                else {
                    console.log("La note a été ajoutée");
                }
            });
        })
    }

//--------------------------------------------------------------------------------//
                // commande remove //
//--------------------------------------------------------------------------------//



}).command({
    command: 'remove',
    describe: "Supprime une note",
    builder: {
        id: {
            describe: "Id de la note à supprimer",
            demandOption: true,
            type: BigInt
        }
    },
    handler: (argv) => {
       console.log(chalk.bold.red("supprimer une note ?"));
       console.log(argv.id);

       fs.readFile("data.json", "utf-8", (err, data) => {
           if(err) console.log(err);
           else {
               let arrayJS = JSON.parse(data);
               let newArrayJS = arrayJS.filter(array => array.id !== argv.id);
               let newArrayJSON = JSON.stringify(newArrayJS);
               fs.writeFile("data.json", newArrayJSON, (err) => {
                   if(err) console.log(err);
                   else console.log(chalk.reverse.yellow(`Note ${argv.id} supprimée`));
               })
           }
       })
    }

//--------------------------------------------------------------------------------//
                // commande read //
//--------------------------------------------------------------------------------//


}).command({
    command: 'read',
    describe: "Affiche le détail de la note",
    builder: {
       id: {
           describe: "Id de la note que l'on souhaite afficher",
           demandOption: true,
           type: BigInt
       }
   },
    handler: (argv) => {
        console.log(chalk.italic.bold("Détail de la note"));
        console.log(chalk.blue(`Detail de la note numéro ${argv.id} :`));

        fs.readFile("data.json", 'utf-8', (err,data) => {
            if(err) console.log(err)
            else {
               let readArrayJS = JSON.parse(data);
               let readId = readArrayJS.filter(arg => arg.id === argv.id);
               readId.forEach(data => {
                   console.log(chalk.green.inverse(`title:`),`${data.title}`, chalk.green.inverse(`message:`), `${data.message}`);
               })
            }
        })

    }
}).argv;