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

async function main() {
    try {
        console.log("--- Add New Script Tab ---");

        // Check files existence first to fail fast
        if (!fs.existsSync(CONSTANTS_PATH)) {
            throw new Error(`Could not find ${CONSTANTS_PATH}. Make sure you are in the project root.`);
        }

        const id = await ask("ID (e.g., my-script): ");
        if (!id) throw new Error("ID is required");

        const title = await ask("Title (e.g., My Awesome Script): ");
        const subtitle = await ask("Subtitle: ");
        const type = 'script'; // Default
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

        // 1. Prepare Navigation Item
        const navItemString = `  { id: '${id}', label: '${label}', type: '${type}' },`;

        // 2. Prepare Script Item

        // Helper to escape backticks for template literals in the output file
        const escapeForCode = (str) => {
            // The content needs to be inside backticks `...` in the final file.
            // So we need to escape existing backticks.
            return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
        };

        const scriptItemString = `  '${id}': {
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
    code: \`${escapeForCode(code)}\`
  },`;

        // Read File
        let content = fs.readFileSync(CONSTANTS_PATH, 'utf8');

        // Insert NAV_ITEM
        // Find the end of NAV_ITEMS array
        const navEndRegex = /export const NAV_ITEMS: NavigationItem\[\] = \[\s*([\s\S]*?)(\n\];)/;
        const navMatch = content.match(navEndRegex);

        if (navMatch) {
            // Insert before the closing ];
            // We assume the last line of the array ends with a comma or we just append.
            content = content.replace(/(export const NAV_ITEMS: NavigationItem\[\] = \[\s*[\s\S]*?)(\];)/, `$1${navItemString}\n$2`);
        } else {
            console.error("Could not find NAV_ITEMS in constants.ts");
            return;
        }

        // Insert SCRIPT Item
        // Find the end of SCRIPTS object
        const scriptsEndRegex = /(export const SCRIPTS: Record<string, ScriptItem> = \{[\s\S]*?)(\n\};)/;

        if (content.match(scriptsEndRegex)) {
            content = content.replace(scriptsEndRegex, `$1\n${scriptItemString}$2`);
        } else {
            console.error("Could not find SCRIPTS object in constants.ts");
            return;
        }

        // Write File
        fs.writeFileSync(CONSTANTS_PATH, content, 'utf8');

        console.log("\nSuccess! Added new script tab.");
        console.log(`Please check ${CONSTANTS_PATH} to verify.`);

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        rl.close();
    }
}

main();
