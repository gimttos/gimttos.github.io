import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const CONSTANTS_PATH = path.join(__dirname, 'src', 'constants.ts');
const SCRIPTS_DIR = path.join(__dirname, 'src', 'scripts');
const SCRIPTS_INDEX_PATH = path.join(SCRIPTS_DIR, 'index.ts');

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function promptMultiLine(label) {
    console.log(`\n${label} (Type 'END' on a new line to finish):`);
    const lines = [];
    while (true) {
        const line = await ask('');
        if (line.trim() === 'END') break;
        lines.push(line);
    }
    return lines.join('\n');
}

// Convert kebab-case to camelCase for variable names
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function main() {
    try {
        console.log("--- Add New Script Tab ---\n");

        // Check files existence first to fail fast
        if (!fs.existsSync(CONSTANTS_PATH)) {
            throw new Error(`Could not find ${CONSTANTS_PATH}. Make sure you are in the project root.`);
        }
        if (!fs.existsSync(SCRIPTS_INDEX_PATH)) {
            throw new Error(`Could not find ${SCRIPTS_INDEX_PATH}. Make sure scripts folder exists.`);
        }

        const id = await ask("ID (e.g., my-script): ");
        if (!id) throw new Error("ID is required");

        const variableName = toCamelCase(id);
        const scriptFileName = `${variableName}.ts`;
        const scriptFilePath = path.join(SCRIPTS_DIR, scriptFileName);

        if (fs.existsSync(scriptFilePath)) {
            throw new Error(`Script file ${scriptFileName} already exists!`);
        }

        const title = await ask("Title (e.g., My Awesome Script): ");
        const subtitle = await ask("Subtitle: ");
        const label = await ask("Navigation Label (Short name for tab): ");

        const description = await ask("Description: ");
        const author = await ask("Author: ");
        const version = await ask("Version (default 1.0): ") || "1.0";

        const intro = await promptMultiLine("Introduction (Markdown supported)");
        const usageDesc = await promptMultiLine("Usage Description");
        const imageUrl = await ask("Image URL (e.g., /images/demo.gif): ");

        const code = await promptMultiLine("Script Code");

        // Prepare content
        const date = new Date();
        const formattedDate = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}.`;

        // Helper to escape backticks for template literals in the output file
        const escapeForCode = (str) => {
            return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
        };

        // 1. Create individual script file
        const scriptFileContent = `import { ScriptItem } from '../types';

export const ${variableName}: ScriptItem = {
    id: '${id}',
    title: '${title.replace(/'/g, "\\'")}',
    subtitle: '${subtitle.replace(/'/g, "\\'")}',
    description: '${description.replace(/'/g, "\\'")}',
    author: '${author.replace(/'/g, "\\'")}',
    version: '${version}',
    updatedAt: '${formattedDate}',
    content: {
        introduction: \`${escapeForCode(intro)}\`,
        usage: {
            description: \`${escapeForCode(usageDesc)}\`,
            images: [
                "${imageUrl}"
            ]
        }
    },
    code: \`${escapeForCode(code)}\`,
};
`;

        fs.writeFileSync(scriptFilePath, scriptFileContent, 'utf8');
        console.log(`\n✓ Created ${scriptFileName}`);

        // 2. Update scripts/index.ts - add export
        let indexContent = fs.readFileSync(SCRIPTS_INDEX_PATH, 'utf8');
        const exportLine = `export { ${variableName} } from './${variableName}';\n`;
        indexContent += exportLine;
        fs.writeFileSync(SCRIPTS_INDEX_PATH, indexContent, 'utf8');
        console.log(`✓ Updated scripts/index.ts`);

        // 3. Update constants.ts
        let constantsContent = fs.readFileSync(CONSTANTS_PATH, 'utf8');

        // 3a. Add import to the imports from './scripts'
        const importRegex = /import \{([^}]+)\} from '\.\/scripts';/;
        const importMatch = constantsContent.match(importRegex);

        if (importMatch) {
            const existingImports = importMatch[1];
            const newImports = existingImports.trimEnd() + `,\n    ${variableName},`;
            constantsContent = constantsContent.replace(importRegex, `import {${newImports}\n} from './scripts';`);
        } else {
            console.error("Could not find scripts import in constants.ts");
            return;
        }

        // 3b. Add NAV_ITEM
        const navItemString = `    { id: '${id}', label: '${label}', type: 'script' },`;
        const navEndRegex = /(export const NAV_ITEMS: NavigationItem\[\] = \[\s*[\s\S]*?)(];)/;

        if (constantsContent.match(navEndRegex)) {
            constantsContent = constantsContent.replace(navEndRegex, `$1${navItemString}\n$2`);
        } else {
            console.error("Could not find NAV_ITEMS in constants.ts");
            return;
        }

        // 3c. Add SCRIPT reference
        const scriptRefString = `    '${id}': ${variableName},`;
        const scriptsEndRegex = /(export const SCRIPTS: Record<string, ScriptItem> = \{[\s\S]*?)(};)/;

        if (constantsContent.match(scriptsEndRegex)) {
            constantsContent = constantsContent.replace(scriptsEndRegex, `$1${scriptRefString}\n$2`);
        } else {
            console.error("Could not find SCRIPTS object in constants.ts");
            return;
        }

        fs.writeFileSync(CONSTANTS_PATH, constantsContent, 'utf8');
        console.log(`✓ Updated constants.ts`);

        console.log("\n✅ Success! Added new script tab.");
        console.log(`   - Script file: src/scripts/${scriptFileName}`);
        console.log(`   - Variable name: ${variableName}`);
        console.log(`   - Navigation ID: ${id}`);

    } catch (err) {
        console.error("\n❌ Error:", err.message);
    } finally {
        rl.close();
    }
}

main();
