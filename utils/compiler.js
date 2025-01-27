// import fs from 'fs';
// import { spawn } from 'child_process';
// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Function to normalize output by trimming and replacing line breaks
// const normalizeOutput = (output) => output.replace(/\r\n/g, '\n').trim();

// const executeSolution = async (
//     solutionPath,
//     solutionOutPutPath,
//     testCasePath,
//     testCasesOutputPath,
//     timeLimit,
//     memoryLimit
// ) => {
//     return new Promise((resolve, reject) => {
        
//         // Step 1: Compile the solution
//         console.log('Compiling Solution...');
//         const compileProcess = spawn('g++', [
//             solutionPath, '-o',
//              `${solutionOutPutPath}.out`,
//               '-std=c++14'
//             ]
//         );

//         compileProcess.stderr.on('data', (data) => {
//             console.log(
//                 'Compilation Error Details:',
//                  data.toString()
//             );
//         });

//         compileProcess.on('close', (code) => {
//             if (code !== 0) {
//                 console.log(
//                     'Compilation failed with exit code:',
//                      code
//                     );
//                 return resolve(
//                     { verdict: 'Compilation Error' }
//                 );
//             }
//             // console.log('Compilation Successful. Executing the Solution...');

//             if (!fs.existsSync(`${solutionOutPutPath}.out`)) {
//                 console.log('Compiled output file not found');
//                 return resolve({ verdict: 'Compilation Error' });
//             }

//             // Step 2: Execute the solution with input
//             const runProcess = spawn(`${solutionOutPutPath}.out`, [], {
//                 stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
//             });

//             // console.log('Writing input to the process...');
//             runProcess.stdin.write(fs.readFileSync(testCasePath, 'utf8'));
//             runProcess.stdin.end();

//             let stdout = '';
//             let stderr = '';

//             // Capture output
//             runProcess.stdout.on('data', (data) => {
//                 stdout += data.toString();
//             });

//             runProcess.stderr.on('data', (data) => {
//                 stderr += data.toString();
//             });

//             // Step 3: Set up execution timeout and memory monitoring
//             const executionTimeout = setTimeout(() => {
//                 runProcess.kill('SIGKILL');
//                 console.log('Time Limit Exceeded');
//                 return resolve({ verdict: 'Time Limit Exceeded' });
//             }, timeLimit);

//             // Step 4: Handling process completion
//             runProcess.on('close', (code) => {
//                 clearTimeout(executionTimeout);

//                 if (stderr) {
//                     console.log('Runtime Error:', stderr);
//                     return resolve({ verdict: 'Runtime Error', error: stderr });
//                 }

//                     // Step 5: Compare the output with the expected output
//                 const expectedOutput = normalizeOutput(fs.readFileSync(testCasesOutputPath, 'utf8'));
//                 const userOutput = normalizeOutput(stdout);

//                 // console.log('User Output:', userOutput);
//                 // console.log('Expected Output:', expectedOutput);

//                 // Step 6: Final comparison and verdict
//                 if (userOutput === expectedOutput) {
//                     console.log('Accepted');
//                     return resolve({ verdict: 'Accepted' });
//                 } else {
//                     console.log('Wrong Answer');
//                     return resolve({ verdict: 'Wrong Answer' });
//                 }
//             });
//         });
//     });
// };

// export default executeSolution























































































import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to normalize output by trimming and replacing line breaks
const normalizeOutput = (output) => output.replace(/\r\n/g, '\n').trim();

const executeSolution = async (
    solutionPath,
    solutionOutPutPath,
    testCasePath,
    testCasesOutputPath,
    timeLimit,
    memoryLimit
) => {
    return new Promise((resolve, reject) => {
        // Step 1: Compile the solution
        console.log('Compiling Solution...');
        const compileProcess = spawn('g++', [
            solutionPath,
            '-o',
            `${solutionOutPutPath}.out`,
            '-std=c++14',
        ]);

        compileProcess.stderr.on('data', (data) => {
            console.log('Compilation Error Details:', data.toString());
        });

        compileProcess.on('close', (code) => {
            if (code !== 0) {
                console.log('Compilation failed with exit code:', code);
                return resolve({ verdict: 'Compilation Error' });
            }

            if (!fs.existsSync(`${solutionOutPutPath}.out`)) {
                console.log('Compiled output file not found');
                return resolve({ verdict: 'Compilation Error' });
            }

            console.log('Compilation Successful. Executing the Solution...');

            // Step 2: Execute the solution with input
            const outputFilePath = `${solutionOutPutPath}.txt`; // Save execution output to a .txt file
            const runProcess = spawn(`${solutionOutPutPath}.out`, [], {
                stdio: ['pipe', fs.openSync(outputFilePath, 'w'), 'pipe'], // Redirect stdout to a file
            });

            runProcess.stdin.write(fs.readFileSync(testCasePath, 'utf8'));
            runProcess.stdin.end();

            let stderr = '';

            // Capture errors
            runProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            // Step 3: Set up execution timeout and memory monitoring
            const executionTimeout = setTimeout(() => {
                runProcess.kill('SIGKILL');
                console.log('Time Limit Exceeded');
                return resolve({ verdict: 'Time Limit Exceeded' });
            }, timeLimit);

            // Step 4: Handling process completion
            runProcess.on('close', (code) => {
                clearTimeout(executionTimeout);

                if (stderr) {
                    console.log('Runtime Error:', stderr);
                    return resolve({ verdict: 'Runtime Error', error: stderr });
                }

                // Step 5: Compare the output with the expected output
                const expectedOutput = normalizeOutput(fs.readFileSync(testCasesOutputPath, 'utf8'));
                const userOutput = normalizeOutput(fs.readFileSync(outputFilePath, 'utf8')); // Read from the output file

                // Step 6: Final comparison and verdict
                if (userOutput === expectedOutput) {
                    console.log('Accepted');
                    return resolve({ verdict: 'Accepted' });
                } else {
                    console.log('Wrong Answer');
                    return resolve({ verdict: 'Wrong Answer' });
                }
            });
        });
    });
};

export default executeSolution;
