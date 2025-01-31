require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function getRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    return { hours, minutes, seconds };
}

function getMillisecondsUntilTime(hours, minutes, seconds) {
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, seconds, 0);

    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    return target - now;
}

function callFunctionAtRandomTimeOncePerDay(callback) {
    const { hours, minutes, seconds } = getRandomTime();
    const delay = getMillisecondsUntilTime(hours, minutes, seconds);

    setTimeout(() => {
        callback();
        callFunctionAtRandomTimeOncePerDay(callback); // Schedule for the next day
    }, delay);
}

// Example function to be called at random time
function myFunction() {
    console.log("Function called at random time!");

    // Read the file
    fs.readFile('github_filler/changes.js', 'utf8', (err, data) => {
        if (err) throw err;

        // Add one character to the file content
        const newData = data + 'a';

        // Write the updated content back to the file
        fs.writeFile('github_filler/changes.js', newData, 'utf8', (err) => {
            if (err) throw err;

            // Commit and push the changes to GitHub
            const accessToken = process.env.accessToken;
            const repo = 'github.com/Mahesh-Wijerathna/MY_AUTOMATIONS.git';
            const repoDir = path.join(__dirname, '..');
            // console.log(accessToken, repo, repoDir);

            // Check if .git directory exists
            if (!fs.existsSync(`${repoDir}/.git`)) {
                exec(`cd ${repoDir} && git init`, (err, stdout, stderr) => {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                    commitAndPushChanges();
                });
            } else {
                commitAndPushChanges();
            }

                        function commitAndPushChanges() {
                exec(`cd ${repoDir} && git checkout -b dev || git checkout dev`, (err, stdout, stderr) => {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
            
                    exec(`cd ${repoDir} && git config user.email "maheshtharanga49@gmail.com" && git config user.name "Mahesh-Wijerathna"`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(`exec error: ${err}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
            
                        exec(`cd ${repoDir} && git add .`, (err, stdout, stderr) => {
                            if (err) {
                                console.error(`exec error: ${err}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                            console.error(`stderr: ${stderr}`);
            
                            exec(`cd ${repoDir} && git commit -m "Add one character to changes.js"`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(`exec error: ${err}`);
                                    return;
                                }
                                console.log(`stdout: ${stdout}`);
                                console.error(`stderr: ${stderr}`);
            
                                exec(`cd ${repoDir} && git push --force --set-upstream https://${accessToken}@${repo} dev`, (err, stdout, stderr) => {
                                    if (err) {
                                        console.error(`exec error: ${err}`);
                                        return;
                                    }
                                    console.log(`stdout: ${stdout}`);
                                    console.error(`stderr: ${stderr}`);
                                });
                            });
                        });
                    });
                });
            }
        });
    });
}

// Call the function to start the process
callFunctionAtRandomTimeOncePerDay(myFunction);
// myFunction()
