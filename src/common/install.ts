// 下载QQ

import { execSync } from "child_process";
import { chmodSync, cpSync, existsSync, readdir, renameSync, rmSync, writeFileSync } from "fs";
import Downloader from "nodejs-file-downloader";
import path from "path";

const doenloadYukihana = async (file: string, targetFile: string, filepath: string) => {
    const downloader = new Downloader({
        url: `https://github.com/project-yukihana/Yukihana/releases/download/v1.1.4/${file}`, // If the file name already exists, a new file with the name 200MB1.zip is created.
        directory: filepath, // This folder will be created, if it doesn't exist.
        fileName: targetFile,
        onProgress: (percentage) => {
            console.log(`\r${percentage}%`);
        }
    });
    console.log('\n');
    try {
        const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.
        
        console.log("All done");
    } catch (error) {
        //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
        //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
        console.error("Download dbghelp failed", error);
        throw error;
    }
};

// 安装QQ
const windows = async () => {
    // 下载
    const qqUrl =
        "https://dldir1.qq.com/qqfile/qq/QQNT/Windows/QQ_9.9.15_240808_x64_01.exe";
    const cachePath = path.resolve(__dirname, "./cache");
    {
        const filename = path.basename(qqUrl);

        const filepath = path.resolve(cachePath, filename);
        if (!existsSync(filepath)) {
            console.log("download qq......");
            const downloader = new Downloader({
                url: qqUrl, // If the file name already exists, a new file with the name 200MB1.zip is created.
                directory: cachePath, // This folder will be created, if it doesn't exist.
                onProgress: (percentage) => {
                    process.stdout.write(`\r${percentage}%`);
                    console.log(`\r${percentage}%`);
                }
            });
            console.log('\n');
            try {
                const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.

                console.log("All done");
            } catch (error) {
                //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
                //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
                console.log("Download qq failed", error);
                throw error;
            }
        }
    }
    {
        const _7zUrl = "https://www.7-zip.org/a/7zr.exe";
        const filepath = path.resolve(cachePath, "7zr.exe");
        if (!existsSync(filepath) && !existsSync(path.resolve(cachePath, "7z/7z.exe"))) {
            console.log("download 7z console......");
            const downloader = new Downloader({
                url: _7zUrl, // If the file name already exists, a new file with the name 200MB1.zip is created.
                directory: cachePath, // This folder will be created, if it doesn't exist.
                onProgress: (percentage) => {
                    console.log(`\r${percentage}%`);
                }
            });
            console.log('\n');
            try {
                const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.

                console.log("All done");
            } catch (error) {
                //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
                //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
                console.log("Download 7z failed", error);
                throw error;
            }
        }
    }
    {
        const _7zUrl = "https://www.7-zip.org/a/7z2407-x64.exe";
        const filepath = path.resolve(cachePath, "7z.exe");
        if (!existsSync(filepath) && !existsSync(path.resolve(cachePath, "7z/7z.exe"))) {
            console.log("download 7z......");
            const downloader = new Downloader({
                url: _7zUrl, // If the file name already exists, a new file with the name 200MB1.zip is created.
                fileName: '7z.exe',
                directory: cachePath, // This folder will be created, if it doesn't exist.
                onProgress: (percentage) => {
                    console.log(`\r${percentage}%`);
                }
            });
            console.log('\n');
            try {
                const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.

                console.log("All done");
            } catch (error) {
                //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
                //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
                console.log("Download 7z failed", error);
                throw error;
            }
        }
    }
    // 解压
    {
        console.log('extract.....');
        const _7zConsolepath = path.resolve(cachePath, "7zr.exe");
        let _7zpath = path.resolve(cachePath, "7z.exe");
        const _7zTargetpath = path.resolve(cachePath, "7z");
        const qqFilename = path.basename(qqUrl);
        const qqFilepath = path.resolve(cachePath, qqFilename);
        const programPath = path.resolve(__dirname, "./program");

        if (!existsSync(path.resolve(cachePath, "./7z/7z.exe"))) {
            execSync(`${_7zConsolepath} x ${_7zpath} -O${_7zTargetpath}`);
        }
        _7zpath = path.resolve(cachePath, "./7z/7z.exe");

        if (!existsSync(path.resolve(programPath, 'QQ.exe'))) {
            console.log('move.....');
            if (!existsSync(path.resolve(programPath, 'Files'))) {
                execSync(`${_7zpath} x ${qqFilepath} -O${programPath} Files -r`);
            }
            moveFilesAndDeleteDir(path.resolve(programPath, './Files'), programPath);
        }
    }
    {
        // 过校验
        if (!existsSync(path.resolve(__dirname, 'program/dbghelp.dll'))) {
            const filepath = path.resolve(__dirname, 'program');
            console.log("download dbghelp.dll......");
            const downloader = new Downloader({
                url: 'https://github.com/project-yukihana/Yukihana-patch/releases/download/v1.1.0/yukihana-dbghelp-win32-x86_64-v1.1.0.dll', // If the file name already exists, a new file with the name 200MB1.zip is created.
                directory: filepath, // This folder will be created, if it doesn't exist.
                fileName: 'dbghelp.dll',
                onProgress: (percentage) => {
                    console.log(`\r${percentage}%`);
                }
            });
            console.log('\n');
            try {
                const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.
                writeFileSync(path.resolve(__dirname, './program/patch.json'), JSON.stringify({
                    "resources\\app\\app_launcher\\index.js": {
                        "target": "resources\\app\\app_launcher\\index.original.js",
                        "content": "require('./launcher.node').load('external_index', module);",
                        "cur": 0,
                        "start": 0,
                        "end": 1
                    }
                }));
                console.log("All done");
            } catch (error) {
                //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
                //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
                console.error("Download dbghelp failed", error);
                throw error;
            }
        }
    }
    {
        const filepath = path.resolve(__dirname, 'program/resources/app/app_launcher');
        if (!existsSync(path.resolve(filepath, 'index.original.js')))
        {
            renameSync(path.resolve(filepath, 'index.js'), path.resolve(filepath, 'index.original.js'));
            await doenloadYukihana('core.js', 'index.js', filepath);
            await doenloadYukihana('server.key', 'server.key', filepath);
            await doenloadYukihana('server.crt', 'server.crt', filepath);
            await doenloadYukihana('yukihana.yaml', 'yukihana.yaml', filepath);
        }
    }
    // 清理
    {
        console.log('clean......');
        try {
            rmSync(path.resolve(cachePath, '7zr.exe'));
        } catch { }
        try {
            rmSync(path.resolve(cachePath, '7z.exe'));
        } catch { }
        console.log('done.');
    }
};
// 移动文件的函数
function moveFilesAndDeleteDir(sourceDir: string, destDir: string) {
    // 读取 b 目录下的所有文件
    readdir(sourceDir, (err, files) => {
        if (err) {
            console.error(`读取目录出错: ${err}`);
            return;
        }

        // 遍历每个文件
        files.forEach(file => {
            const sourceFilePath = path.join(sourceDir, file);
            const destFilePath = path.join(destDir, file);

            // 将文件移动到 a 目录
            renameSync(sourceFilePath, destFilePath);
        });

        // 删除 b 目录
        rmSync(sourceDir, { recursive: true });
    });
}

/**
 * 待测试
 * @returns 
 */
const linux = async () => {
    // 下载
    const qqUrl =
        "https://dldir1.qq.com/qqfile/qq/QQNT/Linux/QQ_3.2.12_240808_x86_64_01.AppImage";
    const cachePath = path.resolve(__dirname, "./cache");
    {
        const filename = path.basename(qqUrl);

        const filepath = path.resolve(cachePath, filename);
        if (!existsSync(filepath)) {
            console.log("download qq......");
            const downloader = new Downloader({
                url: qqUrl, // If the file name already exists, a new file with the name 200MB1.zip is created.
                directory: cachePath, // This folder will be created, if it doesn't exist.
                onProgress: (percentage) => {
                    process.stdout.write(`\r${percentage}%`);
                }
            });
            console.log('\n');
            try {
                const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.
                if (filePath !== null)
                {
                    chmodSync(filePath, '0755');
                }
                console.log("All done");
            } catch (error) {
                //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
                //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
                console.log("Download qq failed", error);
                return;
            }
        }
    }
    // 解压
    {
        console.log('extract.....');
        const qqFilename = path.basename(qqUrl);
        const qqFilepath = path.resolve(cachePath, qqFilename);
        const programPath = path.resolve(__dirname, "./program");

        if (!existsSync(path.resolve(programPath, 'QQ'))) {
            console.log('move.....');
            if (!existsSync(path.resolve(programPath, 'Files'))) {
                execSync(`${qqFilepath} --extract-appimage`);
            }
            moveFilesAndDeleteDir(path.resolve(programPath, './Files'), programPath);
        }
    }
    {
        const filepath = path.resolve(__dirname, 'program/resources/app/app_launcher');
        if (!existsSync(path.resolve(filepath, 'index.original.js')))
        {
            renameSync(path.resolve(filepath, 'index.js'), path.resolve(filepath, 'index.original.js'));
            await doenloadYukihana('core.js', 'index.js', filepath);
            await doenloadYukihana('server.key', 'server.key', filepath);
            await doenloadYukihana('server.crt', 'server.crt', filepath);
            await doenloadYukihana('yukihana.yaml', 'yukihana.yaml', filepath);
        }
    }
    // 清理
    {
        console.log('clean......');
        console.log('done.');
    }
};

export const install = async () => {
    switch (process.platform) {
        case 'win32':
            await windows();
            break;
            
        case 'linux':
            await linux();
            break;
    
        default:
            throw new Error(`platform ${process.platform} not supported!`);
            break;
    }
};