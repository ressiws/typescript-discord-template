# 🤖 Discord Bot Template (TypeScript + discord.js)
Welcome to your brand new Discord bot! This template helps you quickly start building a bot using TypeScript and discord.js 🛠️

## 📁 Project Structure
```bash
📦 src
 ┣ 📜 config.ts         # Bot Configuration
 ┣ 📜 constants.ts      # Single Source Of Truth for non-config values
 ┣ 📜 index.ts          # Entry point
 ┣ 📂commands           # Command files
 ┣ 📂events             # Event listeners
 ┗ 📂utils              # Utilities
📦 dist                 # Compiled JS files (auto-generated)
📜 package.json         # Dependencies & scripts
📜 tsconfig.json        # TypeScript config
```

## 🚀 Getting Started

### 1. 🧰 Prerequisites
- [Node.js](https://nodejs.org/) (v22+ recommended)
- [Git](https://git-scm.com)
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

### 2. 📦 Installation
```bash
# Clone the repo
git clone https://github.com/ressiws/typescript-discord-template.git

# Go into the project folder
cd typescript-discord-template

# Install dependencies
npm install
```

### 3. ⚙️ Configuration
Create a .env file in the root directory and add:

```ini
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-client-id
GUILD_ID=your-test-server-id
```

> ✅ Tip: Never share your .env or commit it to GitHub!

### 4. 🛠️ Build and Run
```bash
# Compile project
npm run build

# Start the bot
npm start
```

👀 Or run in dev mode with live reload:

```bash
npm run dev
```

## 💬 Creating Commands
Add new command files to the src/commands folder. Each file should export a data and execute property:
```ts
// ping.ts
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export async function execute(interaction) {
  await interaction.reply('Pong!');
}
```

## 🎧 Handling Events
Place event files in src/events. Example:
```ts
// ready.ts
export const name = 'ready';
export const once = true;

export function execute(client) {
  console.log(`🤖 Logged in as ${client.user.tag}`);
}
```

## 🔧 Useful Scripts
| Script          | Description            |
|-----------------|------------------------|
| npm run dev     | Run bot in dev mode 🔁 |
| npm run build   | Compile TS to JS 🛠️    |
| npm start Start | compiled bot 🚀        |

📚 Resources
- [discord.js Guide](https://discordjs.guide/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Dotenv Docs](https://www.npmjs.com/package/dotenv)

## 🛡️ License
Apache License ©️ [Swisser](https://github.com/ressiws) & [DarkenLM](https://github.com/DarkenLM)